import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  QrCode, Building, Wrench, ArrowRight, AlertCircle,
  CheckCircle2, FileText, ChevronLeft, ShieldCheck
} from "lucide-react";

export default function QRScanResult() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!code) return;
    setLoading(true);
    fetch(`/api/qr/scan/${encodeURIComponent(code)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    })
      .then(async (r) => {
        const data = await r.json().catch(() => ({ error: "FETCH_ERROR" }));
        if (!r.ok) {
          setError(data);
        } else {
          setResult(data.data);
        }
      })
      .catch((e) => setError({ message: e.message || "Erreur réseau lors de la vérification du QR Code" }))
      .finally(() => setLoading(false));
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090A0F] text-white flex flex-col items-center justify-center p-4 font-mono">
        <div className="flex flex-col items-center gap-4 p-8 bg-[#12141D] border border-slate-800 rounded-3xl max-w-sm w-full text-center shadow-2xl">
          <QrCode className="w-12 h-12 text-cyan-400 animate-pulse" />
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Vérification Cryptographique...</h2>
            <p className="text-xs text-slate-400">Décodage du tag équipement et de la géofence</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-[#090A0F] text-white flex flex-col items-center justify-center p-4 font-mono">
        <div className="bg-[#12141D] border border-rose-500/30 p-8 rounded-3xl max-w-md w-full text-center space-y-6 shadow-2xl">
          <AlertCircle className="w-16 h-16 text-rose-500 mx-auto animate-bounce" />
          <div className="space-y-2">
            <h1 className="text-lg font-bold text-white">Tag QR Invalide ou Inconnu</h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              {error?.message || error?.suggestion || "Ce QR code est introuvable, désactivé ou sa signature ne correspond à aucun équipement répertorié."}
            </p>
          </div>

          <div className="pt-2">
            <Link 
              to="/dashboard" 
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Retour au Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { asset, redirectUrl, requiresAuth } = result;

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-200 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md space-y-6">
        {/* Header Status */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full font-mono text-xs font-bold shadow">
            <CheckCircle2 className="w-4 h-4" /> Tag Équipement Authentifié
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Équipement Identifié</h1>
        </div>

        {/* Asset Details Card */}
        <div className="bg-[#12141D] border border-slate-800 p-6 rounded-3xl space-y-5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-cyan-400 tracking-wider">
                RÉF: {asset.code}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3" /> HMAC Valide
              </span>
            </div>
            <h2 className="text-lg font-bold text-white">{asset.name}</h2>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80 font-mono text-xs">
            <div className="bg-[#090A0F] p-3 rounded-2xl border border-slate-800/60 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
                <Building className="w-3 h-3 text-cyan-400" /> Bâtiment
              </span>
              <p className="font-bold text-slate-200 truncate">{asset.building || "Bâtiment Principal"}</p>
            </div>

            <div className="bg-[#090A0F] p-3 rounded-2xl border border-slate-800/60 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
                <Wrench className="w-3 h-3 text-purple-400" /> Categorie
              </span>
              <p className="font-bold text-slate-200 truncate">{asset.type || "Installation CVC"}</p>
            </div>
          </div>

          {asset.openTickets > 0 && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl font-mono text-xs text-amber-300 flex items-center gap-2">
              <span className="text-base">⚠️</span>
              <span>{asset.openTickets} réclamation{asset.openTickets > 1 ? 's' : ''} en cours sur cet équipement</span>
            </div>
          )}
        </div>

        {/* Primary Actions */}
        <div className="space-y-3 font-mono">
          {requiresAuth ? (
            <div className="space-y-2">
              <Link
                to={`/login?redirect=${encodeURIComponent(redirectUrl || `/dashboard`)}`}
                className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
              >
                Se connecter pour déclarer une anomalie <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
            >
              <FileText className="w-4 h-4" /> Créer / Consulter Ticket Réclamation <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <Link
            to="/dashboard"
            className="w-full py-2.5 bg-[#12141D] hover:bg-slate-800 text-slate-400 hover:text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border border-slate-800 transition-all cursor-pointer"
          >
            Accéder au Portail Facility Manager
          </Link>
        </div>
      </div>
    </div>
  );
}
