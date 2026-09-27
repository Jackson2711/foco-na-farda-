import React from 'react';
import { Shield, Cookie, Heart } from 'lucide-react';
import { CookieConsentService } from '../../services/cookieConsentService';

interface InstitutionalFooterProps {
  onNavigate: (path: string) => void;
  onOpenCookiePreferences?: () => void;
}

export const InstitutionalFooter: React.FC<InstitutionalFooterProps> = ({
  onNavigate,
  onOpenCookiePreferences,
}) => {
  const handleOpenCookies = () => {
    if (onOpenCookiePreferences) {
      onOpenCookiePreferences();
    } else {
      CookieConsentService.openPreferencesModal();
    }
  };

  return (
    <footer className="w-full bg-[#050A18] border-t border-slate-800/80 text-slate-400 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Top Brand & Support Callout */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/10 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-tactical font-black tracking-wider text-white text-base block uppercase">
                FOCO NA FARDA
              </span>
              <p className="text-xs text-amber-400/90 font-medium">
                Estude. Evolua. Conquiste.
              </p>
            </div>
          </div>

          {/* Botão de Apoio Voluntário */}
          <button
            onClick={() => onNavigate('/doar')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/15 to-amber-500/5 hover:from-amber-500/25 hover:to-amber-500/15 border border-amber-500/30 text-amber-300 hover:text-white font-tactical font-bold text-xs uppercase tracking-wider transition shadow-sm"
          >
            <Heart className="w-4 h-4 fill-amber-400/40 text-amber-400" />
            <span>💙 Apoie o Foco na Farda</span>
          </button>
        </div>

        {/* Navigation Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
          {/* Coluna 1: Plataforma */}
          <div className="space-y-2.5">
            <span className="font-tactical font-bold text-white uppercase tracking-wider text-[11px] block text-amber-400/90">
              Plataforma
            </span>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('/dashboard')}
                  className="text-slate-400 hover:text-amber-400 transition"
                >
                  Início
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/concursos')}
                  className="text-slate-400 hover:text-amber-400 transition"
                >
                  Concursos
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/questoes')}
                  className="text-slate-400 hover:text-amber-400 transition"
                >
                  Questões
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/simulados')}
                  className="text-slate-400 hover:text-amber-400 transition"
                >
                  Simulados
                </button>
              </li>
            </ul>
          </div>

          {/* Coluna 2: Institucional */}
          <div className="space-y-2.5">
            <span className="font-tactical font-bold text-white uppercase tracking-wider text-[11px] block text-amber-400/90">
              Institucional
            </span>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('/sobre')}
                  className="text-slate-400 hover:text-amber-400 transition"
                >
                  Sobre o Projeto
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/faq')}
                  className="text-slate-400 hover:text-amber-400 transition"
                >
                  Ajuda (FAQ)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contato')}
                  className="text-slate-400 hover:text-amber-400 transition"
                >
                  Contato
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/acessibilidade')}
                  className="text-slate-400 hover:text-amber-400 transition"
                >
                  Acessibilidade
                </button>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Sustentabilidade */}
          <div className="space-y-2.5">
            <span className="font-tactical font-bold text-white uppercase tracking-wider text-[11px] block text-amber-400/90">
              Sustentabilidade
            </span>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('/doar')}
                  className="text-amber-300 font-semibold hover:text-amber-200 transition flex items-center gap-1.5"
                >
                  <span>Doar para o Projeto</span>
                </button>
              </li>
              <li className="text-[11px] text-slate-400 leading-relaxed">
                Plataforma sem planos pagos, sustentada por doações voluntárias de estudantes e candidatos.
              </li>
            </ul>
          </div>

          {/* Coluna 4: Legal & Privacidade */}
          <div className="space-y-2.5">
            <span className="font-tactical font-bold text-white uppercase tracking-wider text-[11px] block text-amber-400/90">
              Transparência & LGPD
            </span>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('/termos-de-uso')}
                  className="text-slate-400 hover:text-amber-400 transition"
                >
                  Termos de Uso
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/politica-de-privacidade')}
                  className="text-slate-400 hover:text-amber-400 transition"
                >
                  Política de Privacidade
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/politica-de-cookies')}
                  className="text-slate-400 hover:text-amber-400 transition"
                >
                  Política de Cookies
                </button>
              </li>
              <li>
                <button
                  onClick={handleOpenCookies}
                  className="text-slate-400 hover:text-amber-300 transition flex items-center gap-1"
                >
                  <Cookie className="w-3.5 h-3.5 text-amber-400" />
                  <span>Preferências de Cookies</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright and legal disclosure */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p className="text-center md:text-left leading-relaxed">
            © {new Date().getFullYear()} <strong>FOCO NA FARDA</strong>. Plataforma educacional independente de preparação para concursos públicos. Não possui filiação ou vínculo institucional com a Polícia Militar, Polícia Civil, Polícia Federal, PRF, Exército ou qualquer órgão público.
          </p>
          <p className="font-mono-code text-slate-400 shrink-0 text-center md:text-right">
            Brasil • Acesso Democrático
          </p>
        </div>
      </div>
    </footer>
  );
};
