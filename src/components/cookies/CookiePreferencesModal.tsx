import React, { useState, useEffect } from 'react';
import { CookieConsentService, CookiePreferences } from '../../services/cookieConsentService';
import { Shield, Cookie, Check, X, Lock, CheckCircle2 } from 'lucide-react';

interface CookiePreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (path: string) => void;
}

export const CookiePreferencesModal: React.FC<CookiePreferencesModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [preferences, setPreferences] = useState(true);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const current = CookieConsentService.getConsent();
      if (current) {
        setPreferences(current.preferences);
        setAnalytics(current.analytics);
        setMarketing(current.marketing);
      }
      setSavedFeedback(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    CookieConsentService.saveConsent({ preferences, analytics, marketing });
    setSavedFeedback(true);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleAcceptAll = () => {
    CookieConsentService.acceptAll();
    setPreferences(true);
    setAnalytics(true);
    setMarketing(true);
    setSavedFeedback(true);
    setTimeout(() => {
      onClose();
    }, 800);
  };

  const handleRejectNonEssential = () => {
    CookieConsentService.rejectNonEssential();
    setPreferences(false);
    setAnalytics(false);
    setMarketing(false);
    setSavedFeedback(true);
    setTimeout(() => {
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl bg-[#0D1829] border border-amber-500/40 p-6 sm:p-8 shadow-2xl space-y-6 text-slate-100 relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold">
              <Cookie className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-tactical font-black text-white uppercase tracking-wider">
                Centro de Preferências de Cookies
              </h3>
              <p className="text-xs text-amber-400/90 font-mono-code">
                Controle de Privacidade • LGPD • FOCO NA FARDA
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informative text */}
        <p className="text-xs text-slate-300 leading-relaxed shrink-0">
          Utilizamos cookies e tecnologias de armazenamento local para garantir a integridade da sua sessão de estudos, personalizar suas preferências de concursos e aprimorar nossos serviços. Você pode habilitar ou desabilitar cada categoria de acordo com sua vontade (exceto os estritamente necessários). Para detalhes completos, consulte nossa{' '}
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onNavigate) onNavigate('/politica-de-cookies');
            }}
            className="text-amber-400 font-bold underline hover:text-amber-300"
          >
            Política de Cookies
          </button>
          .
        </p>

        {savedFeedback && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fade-in shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Suas preferências de privacidade foram atualizadas e salvas com sucesso!</span>
          </div>
        )}

        {/* Categories List */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3.5 text-xs">
          {/* 1. Necessários */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white uppercase tracking-wide">
                  Cookies Estritamente Necessários
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 font-mono-code">
                  <Lock className="w-3 h-3" /> SEMPRE ATIVOS
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Essenciais para o funcionamento básico e segurança da plataforma FOCO NA FARDA. Permitem a autenticação, navegação protegida de rotas, manutenção da sessão de estudos, prevenção de ataques CSRF e o armazenamento do seu próprio consentimento. Não podem ser desativados.
            </p>
          </div>

          {/* 2. Preferências */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white uppercase tracking-wide">
                Cookies de Preferências e Personalização
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences}
                  onChange={(e) => setPreferences(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Lembram suas configurações individuais, como concurso-alvo selecionado (ex: PMESP, PCSP, PF), estado de preferência, meta diária de estudos e filtros aplicados no radar de editais.
            </p>
          </div>

          {/* 3. Analytics */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white uppercase tracking-wide">
                Cookies de Análise e Métricas Internas
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Ajudam a entender quais disciplinas e funcionalidades são mais acessadas, tempos de carregamento e diagnóstico de erros do sistema. As métricas são totalmente anonimizadas e não identificam o usuário pessoalmente perante terceiros.
            </p>
          </div>

          {/* 4. Marketing */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white uppercase tracking-wide">
                Cookies de Comunicação e Marketing
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Não vendemos nem comercializamos dados de candidatos com redes de publicidade de terceiros. Esta opção é reservada exclusivamente para notificações de campanhas institucionais e novos materiais educativos do FOCO NA FARDA.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleRejectNonEssential}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              Recusar Não Essenciais
            </button>
            <button
              type="button"
              onClick={handleAcceptAll}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
            >
              Aceitar Todos
            </button>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20"
          >
            Salvar Preferências
          </button>
        </div>
      </div>
    </div>
  );
};
