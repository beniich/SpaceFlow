import { useRef, useEffect } from 'react';
import { Camera, X } from 'lucide-react';
import QrScanner from 'qr-scanner';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<any>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const scanner = new QrScanner(
      videoRef.current,
      (result: any) => onScan(result.data),
      { highlightScanRegion: true }
    );
    scannerRef.current = scanner;
    
    scanner.start().catch((err: any) => {
        console.error("Failed to start QR scanner:", err);
    });

    return () => {
      scanner?.stop();
      scanner?.destroy();
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-white/10 text-white rounded-lg z-10 hover:bg-white/20 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        playsInline
      />
      <div className="absolute bottom-8 left-0 right-0 text-center text-white pointer-events-none">
        <div className="inline-flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
            <Camera className="w-5 h-5" />
            <span>Scannez le QR code d'accès</span>
        </div>
      </div>
    </div>
  );
}
