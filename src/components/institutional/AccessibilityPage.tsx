import React from 'react';
import { Eye, Shield, Keyboard, Monitor, CheckCircle2, Mail, Sparkles } from 'lucide-react';
import { InstitutionalHeader } from './InstitutionalHeader';
import { PLATFORM_INFO } from './TermsPage';

interface AccessibilityPageProps {
  onNavigate: (path: string) => void;
  isAuthenticated?: boolean;
}

export const AccessibilityPage: React.FC<AccessibilityPageProps> = ({
  onNavigate,
  isAuthenticated = false,
}) => {
  return (
    <div className="min-h-screen bg-[#070D1E] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      <InstitutionalHeader onNavigate={onNavigate} isAuthenticated={isAuthenticated} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#0C152B] via-slate-900 to-[#0A1128] border border-amber-500/30 p-6 sm:p-8 shadow-xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono-code font-bold uppercase tracking-wider">
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>Inclusão e Acessibilidade Digital</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-tactical font-black text-white uppercase tracking-wider">
            Declaração de Acessibilidade
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            O <strong>{PLATFORM_INFO.platformName}</strong> tem o compromisso de assegurar que qualquer candidato a concurso público, independentemente de limitações visuais, motoras ou cognitivas, possa usufruir plenamente de todas as ferramentas educacionais.
          </p>
        </div>

        {/* Diretrizes Adotadas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-5 rounded-2xl bg-[#0D1829] border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wide">
              <Eye className="w-4 h-4" />
              <span>Alto Contraste Tático</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Paleta escura de alto contraste tático (fundos profundos com acentos em âmbar e texto claro), reduzindo a fadiga visual durante longas horas de estudo e atendendo a pessoas com baixa visão ou fotossensibilidade.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0D1829] border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wide">
              <Keyboard className="w-4 h-4" />
              <span>Navegação por Teclado</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Todos os botões de alternativas, abas, links institucionais e formulários possuem estados de foco visualmente identificáveis e podem ser acionados via teclas <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono-code">Tab</kbd> e <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono-code">Enter</kbd>.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0D1829] border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wide">
              <Monitor className="w-4 h-4" />
              <span>Leitores de Tela (Screen Readers)</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Estruturação com tags semânticas HTML5 (<code>header</code>, <code>nav</code>, <code>main</code>, <code>footer</code>, <code>aside</code>) e atributos ARIA para permitir interpretação por leitores como NVDA, JAWS, VoiceOver e TalkBack.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0D1829] border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wide">
              <Sparkles className="w-4 h-4" />
              <span>Redimensionamento e Tipografia</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Tipografia com desenho limpo e fontes responsivas que mantêm legibilidade e diagramação intacta mesmo quando o candidato aplica zoom de até 200% no navegador.
            </p>
          </div>
        </div>

        {/* Padrões e Metas */}
        <section className="rounded-2xl bg-[#0D1829] border border-slate-800 p-6 sm:p-8 space-y-4 text-xs text-slate-300 leading-relaxed">
          <h2 className="text-sm font-tactical font-bold text-white uppercase tracking-wider text-amber-400">
            Conformidade com Diretrizes WCAG 2.1
          </h2>
          <p>
            Nossa equipe de desenvolvimento orienta as interfaces segundo os princípios de acessibilidade da <strong>WCAG 2.1 (Web Content Accessibility Guidelines)</strong> no nível AA:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-1 text-slate-300">
            <li><strong>Perceptível:</strong> Informações e elementos da interface são apresentados de forma clara e perceptível aos sentidos;</li>
            <li><strong>Operável:</strong> Nenhum componente requer interações que um usuário com mobilidade reduzida não consiga executar;</li>
            <li><strong>Compreensível:</strong> Textos objetivos, instruções de formulários bem sinalizadas e mensagens de erro descritivas;</li>
            <li><strong>Robusto:</strong> Código validado para funcionar em navegadores desktop, tablets, smartphones e assistentes de voz.</li>
          </ul>
        </section>

        {/* Canal para Comunicação de Barreiras */}
        <section className="rounded-2xl bg-[#0D1829] border border-slate-800 p-6 space-y-3 text-xs text-slate-300">
          <h2 className="text-sm font-tactical font-bold text-white uppercase tracking-wider text-amber-400">
            Relato de Barreiras de Acessibilidade
          </h2>
          <p>
            A acessibilidade é um processo de aprimoramento contínuo. Se você encontrar qualquer barreira de navegação, dificuldade de leitura ou incompatibilidade em algum recurso, informe-nos imediatamente:
          </p>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
            <Mail className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="font-bold text-white">Canal de Acessibilidade FOCO NA FARDA</p>
              <p className="text-slate-400 text-xs font-mono-code">{PLATFORM_INFO.contactEmail}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
