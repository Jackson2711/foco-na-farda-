import React from 'react';
import { Cookie, Shield, Lock, Sliders, CheckCircle2, RefreshCw } from 'lucide-react';
import { InstitutionalHeader } from './InstitutionalHeader';
import { PLATFORM_INFO } from './TermsPage';
import { CookieConsentService } from '../../services/cookieConsentService';

interface CookiesPolicyPageProps {
  onNavigate: (path: string) => void;
  onOpenPreferences?: () => void;
  isAuthenticated?: boolean;
}

export const CookiesPolicyPage: React.FC<CookiesPolicyPageProps> = ({
  onNavigate,
  onOpenPreferences,
  isAuthenticated = false,
}) => {
  const handleOpenModal = () => {
    if (onOpenPreferences) {
      onOpenPreferences();
    } else {
      CookieConsentService.openPreferencesModal();
    }
  };

  return (
    <div className="min-h-screen bg-[#070D1E] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      <InstitutionalHeader onNavigate={onNavigate} isAuthenticated={isAuthenticated} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#0C152B] via-slate-900 to-[#0A1128] border border-amber-500/30 p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold">
              <Cookie className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-amber-400">
                DIRETRIZ DE TRANSPARÊNCIA DIGITAL • VERSÃO {PLATFORM_INFO.termsVersion}
              </span>
              <h1 className="text-2xl sm:text-3xl font-tactical font-black text-white uppercase tracking-wider">
                Política de Cookies
              </h1>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Entenda como o <strong>{PLATFORM_INFO.platformName}</strong> utiliza cookies e armazenamento local para assegurar a navegabilidade, segurança da conta e personalização do candidato.
          </p>

          <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <span className="text-[11px] text-slate-400">
              Você pode alterar seu consentimento a qualquer instante pelo painel interativo.
            </span>
            <button
              onClick={handleOpenModal}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20 flex items-center gap-2"
            >
              <Sliders className="w-4 h-4" />
              <span>Gerenciar Preferências de Cookies</span>
            </button>
          </div>
        </div>

        {/* O que são cookies */}
        <section className="rounded-2xl bg-[#0D1829] border border-slate-800 p-6 space-y-3 text-xs text-slate-300 leading-relaxed">
          <h2 className="text-sm font-tactical font-bold text-white uppercase tracking-wider text-amber-400">
            1. O que São Cookies e Armazenamento Local?
          </h2>
          <p>
            Cookies são pequenos arquivos de texto enviados pelo servidor da plataforma e gravados no navegador do seu dispositivo (computador, tablet ou smartphone).
          </p>
          <p>
            Eles desempenham papéis fundamentais: permitem que você permaneça logado entre diferentes telas, salvam o concurso-alvo que você escolheu no radar e memorizam a contagem regressiva do cronômetro de estudos. Também utilizamos tecnologias modernas equivalentes, como o <code>localStorage</code> e <code>sessionStorage</code>.
          </p>
        </section>

        {/* Categorias Utilizadas */}
        <section className="rounded-2xl bg-[#0D1829] border border-slate-800 p-6 space-y-5 text-xs text-slate-300 leading-relaxed">
          <div>
            <h2 className="text-sm font-tactical font-bold text-white uppercase tracking-wider text-amber-400">
              2. Categorias de Cookies Utilizadas na Plataforma
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Classificamos nossos cookies em quatro categorias distintas para máxima transparência:
            </p>
          </div>

          <div className="space-y-4">
            {/* Categoria 1: Necessários */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white uppercase tracking-wide flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-400" />
                  a) Cookies Estritamente Necessários (Obrigatórios)
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono-code">
                  SEMPRE ATIVO
                </span>
              </div>
              <p className="text-slate-300 text-xs">
                São indispensáveis para a navegabilidade e para o funcionamento da plataforma. Permitem a autenticação segura do candidato, controle de sessão, proteção contra ataques de repetição e armazenamento do próprio registro de consentimento de privacidade.
              </p>
              <p className="text-[11px] text-slate-500 font-mono-code">
                Exemplos de chaves: <code>sb-auth-token</code>, <code>foco_cookie_consent_preferences</code>.
              </p>
            </div>

            {/* Categoria 2: Preferências */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white uppercase tracking-wide flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  b) Cookies de Preferências e Personalização
                </span>
                <span className="text-[11px] text-slate-400">
                  Gerenciável pelo usuário
                </span>
              </div>
              <p className="text-slate-300 text-xs">
                Permitem que a plataforma recorde suas preferências individuais para que você não precise reconfigurar a cada novo acesso. Guardam seu concurso-alvo prioritário (ex: PMESP, PCSP, PRF), o estado da federação selecionado, sua meta diária de minutos de estudo e os filtros do banco de questões.
              </p>
              <p className="text-[11px] text-slate-500 font-mono-code">
                Exemplos de chaves: <code>foco_user_profile</code>, <code>foco_alert_preferences</code>.
              </p>
            </div>

            {/* Categoria 3: Analytics */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white uppercase tracking-wide flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400" />
                  c) Cookies de Analytics e Desempenho Interno
                </span>
                <span className="text-[11px] text-slate-400">
                  Gerenciável pelo usuário
                </span>
              </div>
              <p className="text-slate-300 text-xs">
                Coletam dados estatísticos anônimos e agregados sobre como os candidatos utilizam as ferramentas (ex: quais módulos são mais acessados, tempo de carregamento de páginas e detecção de falhas no carregamento de questões). Não cruzamos esses dados com identificadores pessoais externos.
              </p>
            </div>

            {/* Categoria 4: Marketing */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white uppercase tracking-wide flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  d) Cookies de Comunicação e Marketing
                </span>
                <span className="text-[11px] text-slate-400">
                  Gerenciável pelo usuário
                </span>
              </div>
              <p className="text-slate-300 text-xs">
                O <strong>FOCO NA FARDA</strong> não vende nem transfere dados de candidatos para agências de publicidade ou corretores de dados. Esta categoria reserva-se unicamente para gerenciar o alcance de avisos institucionais da própria plataforma (como lançamento de novos simulados nacionais ou editais iminentes).
              </p>
            </div>
          </div>
        </section>

        {/* Como gerenciar */}
        <section className="rounded-2xl bg-[#0D1829] border border-slate-800 p-6 space-y-4 text-xs text-slate-300 leading-relaxed">
          <h2 className="text-sm font-tactical font-bold text-white uppercase tracking-wider text-amber-400">
            3. Como Gerenciar Suas Preferências de Cookies
          </h2>
          <p>
            Você pode revisar ou revogar seu consentimento a qualquer instante clicando no botão abaixo ou no link <strong>"Preferências de Cookies"</strong> situado no rodapé de qualquer tela da plataforma:
          </p>
          <div className="pt-2">
            <button
              onClick={handleOpenModal}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-amber-300 font-bold text-xs uppercase tracking-wider transition"
            >
              Abrir Painel de Preferências de Cookies
            </button>
          </div>
          <p className="text-slate-400 text-[11px] pt-2">
            Adicionalmente, você pode configurar seu navegador de internet (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari) para bloquear ou alertar sobre o envio de cookies. Contudo, desabilitar cookies essenciais poderá impedir o login e a correta resolução de simulados.
          </p>
        </section>
      </main>
    </div>
  );
};
