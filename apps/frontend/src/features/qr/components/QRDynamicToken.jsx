import { useState, useEffect, useCallback } from "react";
import { QRCodeDisplay } from "./QRCodeDisplay";
import { RefreshCw, Shield, AlertCircle } from "lucide-react";

const ROTATION_INTERVAL_SEC = 30;

export function QRDynamicToken({ assetId, asset }) {
  const [tokenData, setTokenData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(ROTATION_INTERVAL_SEC);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDynamicToken = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/qr/asset/${assetId}/dynamic`);
      if (!res.ok) {
        throw new Error("Impossible de générer le token rotatif");
      }
      const data = await res.json();
      setTokenData(data.data);
      setTimeLeft(ROTATION_INTERVAL_SEC);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [assetId]);

  useEffect(() => {
    fetchDynamicToken();
  }, [fetchDynamicToken]);

  useEffect(() => {
    if (!tokenData) return;
    
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          fetchDynamicToken();
          return ROTATION_INTERVAL_SEC;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [tokenData, fetchDynamicToken]);

  return (
    <div className="bg-[#090A0F] border border-slate-800 rounded-2xl p-4 space-y-4 max-w-md mx-auto">
      <div className="flex items-center justify-between text-xs font-mono border-b border-slate-800 pb-3">
        <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <Shield size={14} />
          <span>Protection Anti-Falsification</span>
        </div>
        
        <div className="flex items-center gap-1.5 text-amber-400 font-bold">
          <RefreshCw size={12} className="animate-spin" />
          <span>Renouvellement {timeLeft}s</span>
        </div>
      </div>

      {loading && !tokenData && (
        <div className="p-8 text-center text-xs font-mono text-slate-400 animate-pulse">
          Génération du token dynamique...
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs font-mono flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {tokenData && (
        <QRCodeDisplay
          qr={{
            shortCode: tokenData.shortCode,
            url: tokenData.token,
            dataUrl: tokenData.dataUrl
          }}
          asset={asset}
          showActions
          dynamicMode
          onRefresh={fetchDynamicToken}
        />
      )}
    </div>
  );
}
