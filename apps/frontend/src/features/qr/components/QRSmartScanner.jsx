import { useState, useRef, useEffect, useCallback } from "react";
import jsQR from "jsqr";
import { Camera, Upload, X, Zap, MapPin, AlertCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./QRSmartScanner.css";

const SCAN_RESULT_BUFFER_MS = 1500;

export function QRSmartScanner({ 
  onScan, 
  onClose,
  dynamicMode = false,
  geoFence = null,
}) {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const lastScanRef = useRef({ code: null, timestamp: 0 });
  const animationRef = useRef(null);
  
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [mode, setMode] = useState("auto");
  const [torchOn, setTorchOn] = useState(false);
  const [scansCount, setScansCount] = useState(0);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    if (geoFence && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setCurrentLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        }),
        err => setError(`GPS requis: ${err.message}`),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, [geoFence]);

  const startCamera = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Accès caméra non supporté par ce navigateur.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities?.();
      
      if (capabilities?.torch) {
        track.applyConstraints({ advanced: [{ torch: torchOn }] }).catch(() => {});
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setScanning(true);
        setError(null);
      }
    } catch (err) {
      setError(getCameraErrorMessage(err));
    }
  }, [torchOn]);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setScanning(false);
  }, []);

  const handleScannedCode = useCallback(async (raw, cornerPoints) => {
    try {
      if (navigator.vibrate) navigator.vibrate(80);
      
      let scanInput = raw;
      try {
        const url = new URL(raw);
        if (url.pathname.includes("/qr/")) {
          scanInput = url.pathname.split("/qr/")[1];
        }
      } catch {
        // Raw code
      }

      if (geoFence && currentLocation) {
        const distance = haversineDistance(
          currentLocation.lat, currentLocation.lng,
          geoFence.lat, geoFence.lng
        );
        if (distance > geoFence.radiusM) {
          setError(`Hors zone (${Math.round(distance)}m, max ${geoFence.radiusM}m)`);
          return;
        }
      }

      const res = await fetch(`/api/qr/scan/${encodeURIComponent(scanInput)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientData: {
            timestamp: Date.now(),
            geo: currentLocation,
            cornerPoints,
          },
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: "SCAN_FAILED" }));
        handleScanError(errData);
        return;
      }

      const result = await res.json();
      
      stopCamera();
      setScansCount(prev => prev + 1);
      
      if (onScan) {
        onScan(result.data);
      } else {
        if (result.data.requiresAuth) {
          navigate(`/login?redirect=${encodeURIComponent(result.data.redirectUrl)}`);
        } else {
          navigate(result.data.redirectUrl);
        }
      }
    } catch (e) {
      setError(`Erreur: ${e.message}`);
    }
  }, [currentLocation, geoFence, navigate, onScan, stopCamera]);

  useEffect(() => {
    if (!scanning) return;

    let lastFrameTime = 0;
    const TARGET_FPS = 15;

    const tick = (currentTime) => {
      animationRef.current = requestAnimationFrame(tick);
      
      const delta = currentTime - lastFrameTime;
      if (delta < 1000 / TARGET_FPS) return;
      lastFrameTime = currentTime;

      if (!videoRef.current || !canvasRef.current) return;
      const video = videoRef.current;
      
      if (video.readyState !== video.HAVE_ENOUGH_DATA) return;

      const targetW = Math.min(video.videoWidth, 1280);
      const targetH = Math.floor(video.videoHeight * (targetW / video.videoWidth));
      
      if (canvasRef.current.width !== targetW) {
        canvasRef.current.width = targetW;
        canvasRef.current.height = targetH;
      }
      
      const ctx = canvasRef.current.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(video, 0, 0, targetW, targetH);
      
      const imageData = ctx.getImageData(0, 0, targetW, targetH);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "attemptBoth",
      });

      if (code?.data) {
        const now = Date.now();
        if (
          lastScanRef.current.code === code.data && 
          now - lastScanRef.current.timestamp < SCAN_RESULT_BUFFER_MS
        ) {
          return;
        }
        
        lastScanRef.current = { code: code.data, timestamp: now };
        handleScannedCode(code.data, code.cornerPoints);
      }
    };

    animationRef.current = requestAnimationFrame(tick);
  }, [scanning, handleScannedCode]);

  const handleScanError = (err) => {
    if (err.error === "INVALID_QR") {
      setError(`⚠️ QR invalide: ${err.reason || "Format inconnu"}`);
    } else if (err.error === "QR_NOT_FOUND") {
      setError("Ce QR code n'existe pas ou a été désactivé.");
    } else if (err.error === "INVALID_QR_SIGNATURE") {
      setError("⚠️ Signature falsifiée - QR non authentique");
    } else if (err.error === "EXPIRED") {
      setError("⏰ QR code expiré");
    } else {
      setError(err.message || "Erreur de traitement du QR code");
    }
  };

  const handleFileSelect = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      
      const code = jsQR(imageData.data, img.width, img.height);
      if (code?.data) {
        handleScannedCode(code.data);
      } else {
        setError("Aucun QR code valide n'a été détecté dans cette image.");
      }
    };
    img.src = URL.createObjectURL(file);
  }, [handleScannedCode]);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  return (
    <div className="qr-smart-scanner">
      <header className="scanner-header">
        <div>
          <h3 className="font-bold text-white text-sm tracking-wide">Scanner Intelligent QR / DataMatrix</h3>
          {scansCount > 0 && (
            <span className="scans-count font-mono">
              {scansCount} scan{scansCount > 1 ? "s" : ""}
            </span>
          )}
        </div>
        <button onClick={onClose || (() => navigate(-1))} className="btn-close cursor-pointer" aria-label="Fermer">
          <X size={20} />
        </button>
      </header>

      <div className="scanner-viewport relative">
        <video 
          ref={videoRef} 
          className="scanner-video"
          playsInline
          muted
        />
        <canvas ref={canvasRef} className="scanner-canvas-hidden" />
        
        <div className="scanner-overlay">
          <div className="scanner-frame">
            <div className="scanner-corner tl" />
            <div className="scanner-corner tr" />
            <div className="scanner-corner bl" />
            <div className="scanner-corner br" />
            <div className="scanner-laser" />
          </div>
          <p className="scanner-hint font-mono">
            {mode === "auto" ? "Centrez le QR Code ou le tag équipement" : "Téléchargez une photo du QR"}
          </p>
        </div>

        {currentLocation && (
          <div className="gps-status font-mono">
            <MapPin size={14} />
            <span>GPS ±{Math.round(currentLocation.accuracy)}m</span>
          </div>
        )}

        <button 
          className={`torch-btn ${torchOn ? "active" : ""}`}
          onClick={() => setTorchOn(t => !t)}
          aria-label="Activer la torche"
        >
          <Zap size={20} />
        </button>
      </div>

      {error && (
        <div className="scanner-error" role="alert">
          <AlertCircle size={18} className="shrink-0" />
          <p className="text-xs font-mono">{error}</p>
        </div>
      )}

      <div className="scanner-controls">
        <button 
          className={`mode-btn cursor-pointer ${mode === "auto" ? "active" : ""}`}
          onClick={() => {
            setMode("auto");
            startCamera();
          }}
        >
          <Camera size={18} />
          <span>Caméra Direct</span>
        </button>
        
        <label className="mode-btn cursor-pointer">
          <Upload size={18} />
          <span>Fichier Image</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
        </label>
      </div>

      <footer className="scanner-footer">
        <span className={`status ${scanning ? 'live' : 'paused'} font-mono`}>
          {scanning ? "🟢 Caméra active" : "⏸️ En attente"}
        </span>
        {dynamicMode && (
          <span className="dynamic-badge font-mono">
            <Clock size={14} /> Protection Rotative
          </span>
        )}
      </footer>
    </div>
  );
}

function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng/2)**2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function getCameraErrorMessage(err) {
  if (err.name === "NotAllowedError") return "Permission caméra refusée. Veuillez autoriser la caméra dans le navigateur.";
  if (err.name === "NotFoundError") return "Aucune caméra détectée sur cet appareil.";
  if (err.name === "NotReadableError") return "Caméra déjà utilisée par une autre application.";
  return `Erreur caméra: ${err.message || "Impossible d'accéder au flux vidéo"}`;
}
