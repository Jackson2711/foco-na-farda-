import React, { useState, useEffect } from 'react';
import { Heart, X, ArrowRight } from 'lucide-react';

interface SupportBannerProps {
  onNavigate: (path: string) => void;
  className?: string;
}

const STORAGE_KEY = 'foco_support_banner_dismissed_until';
const DISMISS_DAYS = 7;

export const SupportBanner: React.FC<SupportBannerProps> = ({ onNavigate, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const dismissedUntil = localStorage.getItem(STORAGE_KEY);
      if (!dismissedUntil || Date.now() > Number(dismissedUntil)) {
        setIsVisible(true);
      }
    } catch {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    try {
      const expireTime = Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000;
      localStorage.setItem(STORAGE_KEY, String(expireTime));
    } catch {}
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`relative rounded-2xl bg-gradient-to-r from-[#0C152B] via-[#0E1A36] to-[#0A1226] border border-amber-500/25 p-4 sm:p-5 shadow-lg shadow-black/20 text-slate-200 transition-all ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 pr-8 sm:pr-0">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Heart className="w-5 h-5 fill-amber-400/20 text-amber-400" />
          </div>
          <div>
            <h4 className="text-sm font-tactical font-black text-white uppercase tracking-wider flex items-center gap-2">
              Está curtindo o Foco na Farda?
            </h4>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              Plataforma 100% gratuita e sem anúncios invasivos. Ajude a manter o projeto no ar através de doação voluntária.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <button
            onClick={() => onNavigate('/doar')}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-tactical font-bold text-xs uppercase tracking-wider transition shadow-md shadow-amber-500/20"
          >
            <span>Fazer uma doação</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleDismiss}
            aria-label="Dispensar aviso de apoio"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
            title="Lembrar mais tarde"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
