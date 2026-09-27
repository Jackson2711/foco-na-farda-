import React, { useState, useEffect } from 'react';
import { CookieConsentService } from '../../services/cookieConsentService';
import { Cookie, Shield, Check, X, SlidersHorizontal } from 'lucide-react';

interface CookieConsentBannerProps {
  onOpenPreferences: () => void;
  onNavigate?: (path: string) => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({
  onOpenPreferences,
  onNavigate,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Exibe somente se o usuário ainda não tiver respondido
    if (!CookieConsentService.hasAnswered()) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    CookieConsentService.acceptAll();
    setIsVisible(false);
  };

  const handleRejectNonEssential = () => {
    CookieConsentService.rejectNonEssential();
    setIsVisible(false);
  };

  const handleConfigure = () => {
    setIsVisible(false);
    onOpenPreferences();
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Consentimento de Cookies"
      className="fixed bottom-3 left-3 right-3 sm:left-6 sm:right-6 md:left-auto md:right-6 md:max-w-xl z-50 animate-slide-up"
    >
      <div className="rounded-2xl bg-[#0D1829]/95 backdrop-blur-md border border-amber-500/50 p-5 shadow-2xl text-slate-100 space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
            <Cookie className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-tactical font-black text-white uppercase tracking-wider flex items-center gap-2">
              Privacidade e Cookies
              <span className="text-[10px] font-mono-code font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                LGPD
              </span>
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              O <strong>FOCO NA FARDA</strong> utiliza cookies necessários para manter a sua sessão de estudos segura, além de opções para personalização do concurso-alvo e métricas anônimas. Você tem total controle sobre suas escolhas. Saiba mais na nossa{' '}
              <button
                type="button"
                onClick={() => {
                  if (onNavigate) onNavigate('/politica-de-cookies');
                }}
                className="text-amber-400 font-bold underline hover:text-amber-300"
              >
                Política de Cookies
              </button>
              .
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-1 border-t border-slate-800">
          <button
            type="button"
            onClick={handleConfigure}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-300 text-xs font-semibold transition flex items-center justify-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>CONFIGURAR PREFERÊNCIAS</span>
          </button>

          <button
            type="button"
            onClick={handleRejectNonEssential}
            className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition flex items-center justify-center gap-1.5"
          >
            <span>RECUSAR NÃO ESSENCIAIS</span>
          </button>

          <button
            type="button"
            onClick={handleAcceptAll}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>ACEITAR</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
