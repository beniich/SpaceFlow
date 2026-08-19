import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, Download, X, Building2, Package, QrCode, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AssetQRTagModal({ open, onClose, asset }) {
  const printRef = useRef(null);

  if (!open || !asset) return null;

  const qrPayload = JSON.stringify({
    app: 'BEECARBONAT-PRO',
    id: asset.id,
    sn: asset.serialNumber,
    name: asset.name,
    category: asset.category
  });

  const handlePrint = () => {
    window.print();
    toast.success('Impression de l\'étiquette lancée');
  };

  const handleDownloadSVG = () => {
    const svgEl = printRef.current?.querySelector('svg');
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `QR-Tag-${asset.serialNumber || asset.name}.svg`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Fichier QR SVG téléchargé');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-md p-6 relative shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-200 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4 text-cyan-400">
          <Tag className="w-5 h-5" />
          <h3 className="font-display font-bold uppercase tracking-widest text-zinc-100">
            Étiquette Industrielle QR
          </h3>
        </div>

        {/* Printable Tag Badge Card */}
        <div
          ref={printRef}
          className="bg-white text-zinc-900 p-5 border-2 border-zinc-900 rounded-none my-4 flex flex-col items-center justify-center text-center print:border-black print:m-0"
        >
          <div className="w-full flex items-center justify-between pb-2 mb-3 border-b-2 border-zinc-900">
            <span className="text-[10px] font-mono font-black uppercase tracking-wider text-zinc-800">
              BEECARBONAT FACILITY PRO
            </span>
            <span className="text-[10px] font-mono font-bold bg-zinc-900 text-white px-1.5 py-0.5">
              {asset.category || 'ASSET'}
            </span>
          </div>

          {/* High-Contrast Crisp QR */}
          <div className="p-3 bg-white border border-zinc-300 shadow-sm inline-block my-1">
            <QRCodeSVG
              value={asset.id || asset.serialNumber || qrPayload}
              size={160}
              level="H"
              includeMargin={false}
            />
          </div>

          <p className="font-bold font-display text-base text-zinc-900 mt-3 tracking-wide leading-snug">
            {asset.name}
          </p>
          <p className="text-xs font-mono font-bold text-zinc-700 mt-0.5">
            SN: {asset.serialNumber || 'SN-BEECARBONAT-001'}
          </p>
          <p className="text-[10px] font-mono text-zinc-500 mt-1">
            Emplacement : {asset.location || 'Bâtiment Principal'}
          </p>

          <div className="w-full mt-3 pt-2 border-t border-dashed border-zinc-400 flex items-center justify-between text-[9px] font-mono text-zinc-500">
            <span>Scan pour statut &amp; OT</span>
            <span>ID: {asset.id ? asset.id.slice(0, 8) : '00000000'}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-zinc-800">
          <button
            type="button"
            onClick={handleDownloadSVG}
            className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-amber-400" />
            Télécharger SVG
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Imprimer Tag
          </button>
        </div>
      </div>
    </div>
  );
}
