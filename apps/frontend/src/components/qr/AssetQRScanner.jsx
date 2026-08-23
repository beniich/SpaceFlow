import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import {
  Camera, CameraOff, SwitchCamera, Image, RefreshCw,
  CheckCircle2, AlertTriangle, Wrench, XCircle, Search,
  Zap, MapPin, Building, Activity, Sparkles, Volume2, VolumeX,
  ArrowRight, ShieldAlert, Cpu, ExternalLink, QrCode
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';

// Status labels & color map
const STATUS_CONFIG = {
  OPERATIONAL: {
    label: 'Opérationnel',
    color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    dot: 'bg-emerald-400',
    icon: CheckCircle2
  },
  MAINTENANCE: {
    label: 'En Maintenance',
    color: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    dot: 'bg-amber-400',
    icon: Wrench
  },
  BREAKDOWN: {
    label: 'En Panne',
    color: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    dot: 'bg-rose-400',
    icon: AlertTriangle
  },
  RETIRED: {
    label: 'Retiré du service',
    color: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30',
    dot: 'bg-zinc-400',
    icon: XCircle
  }
};

/**
 * AssetQRScanner Component
 * Uses html5-qrcode for fast, lightweight QR & Barcode scanning via camera or file upload.
 * Facilitates instant lookup, detail display, and 1-click status updates.
 */
export default function AssetQRScanner({
  onAssetSelected,
  autoCloseOnFound = false,
  compact = false
}) {
  const [scannerActive, setScannerActive] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState(null);
  const [scannedAsset, setScannedAsset] = useState(null);
  const [rawScannedText, setRawScannedText] = useState(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [scanHistory, setScanHistory] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [manualCode, setManualCode] = useState('');
  const [cameraError, setCameraError] = useState(null);
  const [showQRTagModal, setShowQRTagModal] = useState(false);

  const qrRegionId = useRef(`qr-reader-region-${Math.random().toString(36).substring(2, 9)}`);
  const html5QrCodeRef = useRef(null);
  const fileInputRef = useRef(null);

  // Play audio feedback beep
  const playBeep = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
      if (navigator.vibrate) navigator.vibrate(80);
    } catch {
      // Audio context might be restricted before interaction
    }
  }, [soundEnabled]);

  // Lookup asset by text/id/serial
  const lookupAsset = useCallback(async (code) => {
    if (!code) return;
    setLookupLoading(true);
    setRawScannedText(code);

    try {
      // Parse possible URL or prefixed payloads e.g. "BEECARBONAT:ASSET:uuid" or "https://domain.com/assets/uuid"
      let cleanCode = code.trim();
      if (cleanCode.includes('/assets/')) {
        cleanCode = cleanCode.split('/assets/').pop().split('?')[0].split('#')[0];
      } else if (cleanCode.startsWith('BEECARBONAT:ASSET:')) {
        cleanCode = cleanCode.replace('BEECARBONAT:ASSET:', '');
      }

      // 1. Try finding by ID directly
      let foundAsset = null;
      try {
        const { data } = await api.get(`/assets/${cleanCode}`);
        if (data && data.id) {
          foundAsset = data;
        }
      } catch {
        // Not found by ID, will try search
      }

      // 2. If not found by direct ID, search by serialNumber or name
      if (!foundAsset) {
        const { data } = await api.get('/assets', { params: { search: cleanCode } });
        const list = Array.isArray(data) ? data : (data?.data || []);
        if (list.length > 0) {
          // Exact match on serial number preferred, else first match
          foundAsset = list.find(a => a.serialNumber?.toLowerCase() === cleanCode.toLowerCase()) || list[0];
          // Get complete details
          if (foundAsset?.id) {
            try {
              const full = await api.get(`/assets/${foundAsset.id}`);
              if (full.data) foundAsset = full.data;
            } catch {}
          }
        }
      }

      if (foundAsset) {
        setScannedAsset(foundAsset);
        playBeep();
        toast.success(`Actif identifié : ${foundAsset.name}`);
        
        // Add to history
        setScanHistory(prev => {
          const filtered = prev.filter(a => a.id !== foundAsset.id);
          return [foundAsset, ...filtered].slice(0, 8);
        });

        if (onAssetSelected) {
          onAssetSelected(foundAsset);
        }
      } else {
        setScannedAsset(null);
        toast.error(`Aucun actif trouvé pour le code : "${cleanCode}"`);
      }
    } catch (err) {
      console.error('Lookup error:', err);
      toast.error('Erreur lors de la recherche de l\'actif');
    } finally {
      setLookupLoading(false);
    }
  }, [playBeep, onAssetSelected]);

  // Handle successful QR code read
  const onScanSuccess = useCallback((decodedText) => {
    if (decodedText && decodedText !== rawScannedText) {
      lookupAsset(decodedText);
    }
  }, [rawScannedText, lookupAsset]);

  // Initialize camera list
  useEffect(() => {
    Html5Qrcode.getCameras()
      .then(devices => {
        if (devices && devices.length) {
          setCameras(devices);
          // Prefer back/environment camera if available
          const backCam = devices.find(d => 
            d.label.toLowerCase().includes('back') || 
            d.label.toLowerCase().includes('arri') || 
            d.label.toLowerCase().includes('environment')
          );
          setSelectedCameraId(backCam ? backCam.id : devices[0].id);
        }
      })
      .catch(err => {
        console.warn('Unable to get cameras:', err);
      });
  }, []);

  // Start QR camera scanner
  const startScanner = async () => {
    setCameraError(null);
    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode(qrRegionId.current, {
          formatsToSupport: [
            Html5QrcodeSupportedFormats.QR_CODE,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.EAN_13
          ],
          verbose: false
        });
      }

      const cameraId = selectedCameraId || { facingMode: 'environment' };
      const config = {
        fps: 15,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      };

      await html5QrCodeRef.current.start(
        cameraId,
        config,
        (decodedText) => onScanSuccess(decodedText),
        () => {} // silent frame failures
      );

      setScannerActive(true);
    } catch (err) {
      console.error('Camera start error:', err);
      setCameraError('Accès à la caméra refusé ou non supporté. Vous pouvez scanner un fichier image ou saisir le numéro.');
      setScannerActive(false);
    }
  };

  // Stop camera scanner
  const stopScanner = async () => {
    if (html5QrCodeRef.current && scannerActive) {
      try {
        await html5QrCodeRef.current.stop();
        setScannerActive(false);
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
  };

  // Toggle camera switch
  const switchCamera = async () => {
    if (cameras.length <= 1) return;
    const currentIndex = cameras.findIndex(c => c.id === selectedCameraId);
    const nextIndex = (currentIndex + 1) % cameras.length;
    const nextCamId = cameras[nextIndex].id;
    setSelectedCameraId(nextCamId);

    if (scannerActive) {
      await stopScanner();
      setTimeout(() => {
        startScanner();
      }, 250);
    }
  };

  // Scan from uploaded file
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLookupLoading(true);
      const scanner = html5QrCodeRef.current || new Html5Qrcode(qrRegionId.current);
      const result = await scanner.scanFile(file, true);
      if (result) {
        lookupAsset(result);
      }
    } catch (err) {
      console.error('File scan error:', err);
      toast.error('Aucun QR code lisible détecté dans l\'image');
    } finally {
      setLookupLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Update asset status directly
  const handleStatusChange = async (newStatus) => {
    if (!scannedAsset) return;
    setUpdatingStatus(true);
    try {
      const { data } = await api.put(`/assets/${scannedAsset.id}`, { status: newStatus });
      setScannedAsset(prev => ({ ...prev, status: newStatus }));
      toast.success(`Statut mis à jour : ${STATUS_CONFIG[newStatus]?.label || newStatus}`);
      
      // Update history list
      setScanHistory(prev => prev.map(a => a.id === scannedAsset.id ? { ...a, status: newStatus } : a));
      
      if (onAssetSelected) {
        onAssetSelected({ ...scannedAsset, status: newStatus });
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur lors de la mise à jour du statut');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Quick manual submission
  const handleManualSearch = (e) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    lookupAsset(manualCode.trim());
  };

  // Clean up scanner on unmount
  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="bg-surface border border-zinc-800 p-4 md:p-6 text-zinc-100 font-sans shadow-xl">
      {/* Header section */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-bold font-display uppercase tracking-widest text-zinc-50 flex items-center gap-2">
              Scanner QR Actif
              <span className="text-[10px] font-mono px-2 py-0.5 bg-zinc-900 border border-zinc-700 text-cyan-400">
                Lightweight Engine
              </span>
            </h2>
            <p className="text-xs font-mono text-zinc-400">
              Recherche instantanée et mise à jour de statut des équipements
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition"
            title={soundEnabled ? 'Désactiver le son' : 'Activer le bip sonore'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
          </button>

          {cameras.length > 1 && (
            <button
              type="button"
              onClick={switchCamera}
              className="p-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 transition flex items-center gap-1.5 text-xs font-mono"
              title="Changer de caméra"
            >
              <SwitchCamera className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Caméra</span>
            </button>
          )}

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 text-xs font-mono flex items-center gap-1.5 transition"
          >
            <Image className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Fichier Image</span>
          </button>

          {!scannerActive ? (
            <button
              type="button"
              onClick={startScanner}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition"
            >
              <Camera className="w-4 h-4" />
              Lancer Caméra
            </button>
          ) : (
            <button
              type="button"
              onClick={stopScanner}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-zinc-50 font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition"
            >
              <CameraOff className="w-4 h-4" />
              Arrêter Caméra
            </button>
          )}
        </div>
      </div>

      {/* Camera Viewfinder / Scanner Area */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 flex flex-col">
          {/* Scanner View Area */}
          <div className="relative bg-zinc-950 border border-zinc-800 overflow-hidden flex flex-col items-center justify-center min-h-[300px] w-full">
            {/* Target Div for html5-qrcode */}
            <div
              id={qrRegionId.current}
              className={`w-full ${scannerActive ? 'block' : 'hidden'}`}
              style={{ width: '100%', minHeight: '300px' }}
            />

            {!scannerActive && (
              <div className="p-8 text-center flex flex-col items-center justify-center space-y-3">
                <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
                  <Camera className="w-8 h-8 text-zinc-400" />
                </div>
                <div>
                  <p className="text-sm font-mono text-zinc-300 font-bold">Caméra en veille</p>
                  <p className="text-xs text-zinc-500 max-w-xs mt-1">
                    Cliquez sur "Lancer Caméra" pour scanner l'étiquette QR collée sur l'actif ou chargez une photo.
                  </p>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={startScanner}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-mono font-bold text-xs uppercase tracking-wider"
                  >
                    Activer Caméra
                  </button>
                </div>
              </div>
            )}

            {cameraError && (
              <div className="p-4 m-3 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <span>{cameraError}</span>
              </div>
            )}

            {/* Scan animation overlay when active */}
            {scannerActive && (
              <div className="pointer-events-none absolute inset-0 border-2 border-cyan-500/40 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-cyan-400 relative">
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-300" />
                  <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-300" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-300" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-300" />
                  <div className="w-full h-0.5 bg-cyan-400 animate-pulse absolute top-1/2 -translate-y-1/2 shadow-[0_0_8px_#22d3ee]" />
                </div>
              </div>
            )}
          </div>

          {/* Manual input fallback */}
          <form onSubmit={handleManualSearch} className="mt-3 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Ou saisir N° Série / ID Actif (ex: HVAC, SN...)"
                className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-xs font-mono text-zinc-100 placeholder:text-zinc-600"
              />
            </div>
            <button
              type="submit"
              disabled={lookupLoading || !manualCode.trim()}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-zinc-200 text-xs font-mono uppercase tracking-wider font-bold"
            >
              Rechercher
            </button>
          </form>

          {/* Quick preset test barcodes */}
          <div className="mt-3 pt-3 border-t border-zinc-800/80 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-mono uppercase text-zinc-500">Actifs fréquents :</span>
            {['HVAC #1', 'Electrical #2', 'Security #3', 'IT #4'].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => lookupAsset(preset)}
                className="text-[10px] font-mono px-2 py-0.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-cyan-400 transition"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Scanned Asset Details & Status Update Panel */}
        <div className="lg:col-span-6 flex flex-col">
          {lookupLoading ? (
            <div className="bg-zinc-950 border border-zinc-800 p-8 flex flex-col items-center justify-center min-h-[300px] h-full text-center">
              <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
              <p className="text-xs font-mono uppercase tracking-widest text-zinc-300">Identification de l'actif...</p>
              <p className="text-[11px] font-mono text-zinc-500 mt-1">Interrogation de la base de données BEECARBONAT</p>
            </div>
          ) : scannedAsset ? (
            <div className="bg-zinc-950 border border-cyan-500/40 p-5 flex flex-col justify-between h-full space-y-4">
              {/* Asset Title Bar */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-zinc-900 border border-zinc-700 text-zinc-300 uppercase">
                        {scannedAsset.category || 'Équipement'}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500">
                        SN: {scannedAsset.serialNumber || 'N/A'}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-zinc-50 font-display mt-1 tracking-wide">
                      {scannedAsset.name}
                    </h3>
                  </div>

                  {/* QR code thumbnail */}
                  <div className="p-1.5 bg-white shrink-0 shadow">
                    <QRCodeSVG
                      value={scannedAsset.id || scannedAsset.serialNumber || 'BEECARBONAT'}
                      size={44}
                    />
                  </div>
                </div>

                {/* Key metadata grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 pt-3 border-t border-zinc-800 text-xs font-mono">
                  <div className="bg-zinc-900/80 p-2 border border-zinc-800/80">
                    <p className="text-[10px] text-zinc-500 uppercase flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-cyan-400" /> Emplacement
                    </p>
                    <p className="text-zinc-200 font-bold mt-0.5 truncate">{scannedAsset.location || 'Bâtiment Principal'}</p>
                  </div>

                  <div className="bg-zinc-900/80 p-2 border border-zinc-800/80">
                    <p className="text-[10px] text-zinc-500 uppercase flex items-center gap-1">
                      <Building className="w-3 h-3 text-cyan-400" /> Bâtiment
                    </p>
                    <p className="text-zinc-200 font-bold mt-0.5 truncate">{scannedAsset.building?.name || 'Tour Horizon'}</p>
                  </div>

                  <div className="bg-zinc-900/80 p-2 border border-zinc-800/80">
                    <p className="text-[10px] text-zinc-500 uppercase flex items-center gap-1">
                      <Activity className="w-3 h-3 text-emerald-400" /> Score Santé
                    </p>
                    <p className={`font-bold mt-0.5 ${
                      (scannedAsset.healthScore || 85) > 70 ? 'text-emerald-400' :
                      (scannedAsset.healthScore || 85) > 40 ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {scannedAsset.healthScore || 85} %
                    </p>
                  </div>
                </div>

                {/* Manufacturer & Specs */}
                <div className="mt-3 text-xs font-mono text-zinc-400 flex flex-wrap gap-x-4 gap-y-1">
                  <span>Fabricant: <strong className="text-zinc-200">{scannedAsset.manufacturer || 'Standard'}</strong></span>
                  <span>Modèle: <strong className="text-zinc-200">{scannedAsset.model || 'Mod-2024'}</strong></span>
                  {scannedAsset.purchasePrice && (
                    <span>Valeur: <strong className="text-zinc-200">{scannedAsset.purchasePrice.toLocaleString('fr-FR')} €</strong></span>
                  )}
                </div>
              </div>

              {/* Status Update Control Section */}
              <div className="pt-4 border-t border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    Mise à jour rapide du statut
                  </span>
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 border ${
                    STATUS_CONFIG[scannedAsset.status]?.color || 'bg-zinc-800 text-zinc-300'
                  }`}>
                    Actuel : {STATUS_CONFIG[scannedAsset.status]?.label || scannedAsset.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                    const Icon = cfg.icon;
                    const isCurrent = scannedAsset.status === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        disabled={updatingStatus || isCurrent}
                        onClick={() => handleStatusChange(key)}
                        className={`p-2 border text-left flex flex-col justify-between transition ${
                          isCurrent
                            ? `${cfg.color} ring-1 ring-offset-1 ring-offset-zinc-950 font-bold`
                            : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850 text-zinc-300'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <Icon className="w-3.5 h-3.5" />
                          <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                        </div>
                        <span className="text-[11px] font-mono mt-1 leading-tight">{cfg.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons: OT / Maintenance Log */}
              <div className="pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <a
                    href={`/assets?search=${encodeURIComponent(scannedAsset.serialNumber || scannedAsset.name)}`}
                    className="text-[11px] font-mono text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    Fiche détaillée <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      toast.success(`Fiche d'intervention créée pour ${scannedAsset.name}`);
                    }}
                    className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-200"
                  >
                    + Créer Ordre de Travail
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-zinc-950 border border-zinc-800 p-8 flex flex-col items-center justify-center min-h-[300px] h-full text-center">
              <QrCode className="w-12 h-12 text-zinc-700 mb-3" />
              <p className="text-sm font-mono text-zinc-400 font-bold uppercase tracking-wider">En attente de scan</p>
              <p className="text-xs text-zinc-600 max-w-sm mt-1">
                Pointez la caméra vers le QR code d'un équipement ou utilisez la recherche pour afficher immédiatement les données et modifier son statut en un clic.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Scans Strip */}
      {scanHistory.length > 0 && (
        <div className="mt-6 pt-4 border-t border-zinc-800">
          <p className="text-xs font-mono uppercase text-zinc-500 tracking-wider mb-2">
            Historique de la session ({scanHistory.length}) :
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {scanHistory.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setScannedAsset(item)}
                className={`px-3 py-1.5 bg-zinc-950 border text-left shrink-0 transition text-xs font-mono ${
                  scannedAsset?.id === item.id
                    ? 'border-cyan-500 bg-cyan-950/20 text-cyan-300'
                    : 'border-zinc-800 hover:border-zinc-700 text-zinc-400'
                }`}
              >
                <div className="font-bold truncate max-w-[140px]">{item.name}</div>
                <div className="text-[10px] text-zinc-500">{item.serialNumber}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
