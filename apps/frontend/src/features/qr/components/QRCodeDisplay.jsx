import { useState, useRef } from "react";
import { 
  Download, Printer, Share2, Copy, Eye, EyeOff,
  RefreshCw, Zap, QrCode as QrIcon, Check
} from "lucide-react";

export function QRCodeDisplay({
  qr,
  asset,
  showActions = true,
  dynamicMode = false,
  onRefresh,
  onPrint,
}) {
  const [showFull, setShowFull] = useState(false);
  const [copied, setCopied] = useState(false);
  const printRef = useRef(null);

  const handleCopy = () => {
    if (qr?.shortCode) {
      navigator.clipboard.writeText(qr.shortCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = (format = "png") => {
    if (!qr?.dataUrl) return;
    const link = document.createElement("a");
    link.href = qr.dataUrl;
    link.download = `qr-${asset?.code || 'asset'}.${format}`;
    link.click();
  };

  const handleShare = async () => {
    if (!qr) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `QR Code Équipement ${asset?.code || ''}`,
          text: `${asset?.name || 'Équipement'} - ${asset?.code || ''}`,
          url: qr.url || window.location.href,
        });
      } catch (e) {
        // Share cancelled
      }
    } else {
      navigator.clipboard.writeText(qr.url || window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    if (!qr?.dataUrl) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code ${asset?.code || ''}</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 2rem; text-align: center; background: #fff; color: #000; }
            .qr-container { border: 2px solid #000; padding: 1.5rem; max-width: 350px; margin: 0 auto; border-radius: 12px; }
            .qr-image { max-width: 100%; height: auto; }
            .asset-code { font-size: 1.5rem; font-weight: bold; margin: 1rem 0 0.25rem; font-family: monospace; }
            .asset-name { color: #444; font-size: 0.95rem; }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <img class="qr-image" src="${qr.dataUrl}" />
            <div class="asset-code">${asset?.code || qr.shortCode || ''}</div>
            <div class="asset-name">${asset?.name || 'Équipement'}</div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      if (onPrint) onPrint(qr);
    }, 250);
  };

  return (
    <div className="bg-[#12141D] border border-slate-800 p-5 rounded-2xl flex flex-col items-center gap-4 text-white font-sans max-w-sm mx-auto shadow-xl">
      <div className="relative p-4 bg-white rounded-xl shadow-md border border-slate-200" ref={printRef}>
        {qr?.dataUrl ? (
          <img 
            src={qr.dataUrl} 
            alt={`QR code ${asset?.code || ''}`}
            className="w-48 h-48 object-contain rounded"
          />
        ) : (
          <div className="w-48 h-48 flex items-center justify-center bg-slate-100 text-slate-400 rounded">
            <QrIcon size={48} className="animate-pulse" />
          </div>
        )}
        
        {dynamicMode && (
          <div className="absolute top-2 right-2 bg-amber-500/90 text-slate-950 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
            LIVE
          </div>
        )}
      </div>

      <div className="text-center space-y-1">
        <span className="font-mono text-xs font-bold text-cyan-400 tracking-wider">
          {asset?.code || qr?.shortCode || "TAG ÉQUIPEMENT"}
        </span>
        <h4 className="text-sm font-medium text-slate-200 line-clamp-1">
          {asset?.name || "Équipement non spécifié"}
        </h4>
      </div>

      {showActions && (
        <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-800 w-full">
          <button 
            onClick={() => handleDownload("png")} 
            title="Télécharger PNG"
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            <Download size={16} />
          </button>
          <button 
            onClick={handlePrint} 
            title="Imprimer"
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            <Printer size={16} />
          </button>
          <button 
            onClick={handleShare} 
            title="Partager"
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            <Share2 size={16} />
          </button>
          <button 
            onClick={handleCopy} 
            title="Copier le code"
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors relative cursor-pointer"
          >
            {copied ? <Check size={16} className="text-cyan-400" /> : <Copy size={16} />}
          </button>
          {dynamicMode && (
            <button 
              onClick={onRefresh} 
              title="Rafraîchir"
              className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors cursor-pointer"
            >
              <RefreshCw size={16} />
            </button>
          )}
          <button 
            onClick={() => setShowFull(s => !s)} 
            title={showFull ? "Masquer le code" : "Détails techniques"}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            {showFull ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      )}

      {showFull && qr && (
        <div className="w-full bg-[#090A0F] border border-slate-800 p-3 rounded-xl text-left font-mono text-xs space-y-2 mt-1">
          <div className="flex justify-between items-center text-slate-400">
            <span>Short Code:</span>
            <code className="text-cyan-300 font-bold">{qr.shortCode}</code>
          </div>
          <div className="flex flex-col gap-1 text-slate-400">
            <span>URL Signée:</span>
            <code className="text-[10px] text-slate-300 truncate bg-slate-900 p-1.5 rounded border border-slate-800">
              {qr.url}
            </code>
          </div>
          {dynamicMode && (
            <div className="flex items-center gap-1.5 text-[11px] text-amber-400 pt-1">
              <Zap size={14} />
              <span>Token rotatif temporaire (30s)</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
