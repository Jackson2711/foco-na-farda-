import React from 'react';
import { Shield, Target, Compass, Award, CheckCircle2, BookOpen, Brain, Zap, Users } from 'lucide-react';
import { InstitutionalHeader } from './InstitutionalHeader';
import { PLATFORM_INFO } from './TermsPage';

interface AboutPageProps {
  onNavigate: (path: string) => void;
  isAuthenticated?: boolean;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, isAuthenticated = false }) => {
  return (
    <div className="min-h-screen bg-[#070D1E] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      <InstitutionalHeader onNavigate={onNavigate} isAuthenticated={isAuthenticated} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Hero Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#0C152B] via-slate-900 to-[#0A1128] border border-amber-500/30 p-6 sm:p-8 shadow-xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono-code font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Nossa Missão Institucional</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-tactical font-black text-white uppercase tracking-wider">
            Sobre o FOCO NA FARDA
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
            O <strong>FOCO NA FARDA</strong> nasceu da convicção de que a conquista da farda pública exige muito mais do que apenas assistir aulas passivas: exige <strong>disciplina tática</strong>, <strong>resolução exaustiva de questões reais</strong>, <strong>domínio da pegadinha das bancas</strong> e <strong>combate cirúrgico aos pontos cegos do candidato</strong>.
          </p>
        </div>

        {/* Pilares Estratégicos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#0D1829] border border-slate-800 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-tactical font-bold text-white uppercase tracking-wider">
              1. Foco Específico
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Direcionamento exclusivo para carreiras de segurança pública e defesa: Polícias Militares, Polícias Civis, Polícia Federal, PRF, Polícia Penal, Guardas Municipais e Trânsito.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0D1829] border border-slate-800 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-tactical font-bold text-white uppercase tracking-wider">
              2. Psicometria de Erros
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Não basta saber se acertou ou errou. Classificamos a causa raiz: lacuna de conceito, pegadinha semântica da banca, inversão de regra, prazo esquecido ou chute.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0D1829] border border-slate-800 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-tactical font-bold text-white uppercase tracking-wider">
              3. Fontes Oficiais
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Compromisso inegociável com a verdade do edital. Monitoramento de diários oficiais e provas reais das principais bancas examinadoras (Cebraspe, Vunesp, FGV, IBFC, IDECAN).
            </p>
          </div>
        </div>

        {/* Nossa Metodologia */}
        <section className="rounded-2xl bg-[#0D1829] border border-slate-800 p-6 sm:p-8 space-y-4 text-xs text-slate-300 leading-relaxed">
          <h2 className="text-base font-tactical font-bold text-white uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Metodologia Tática de Preparação
          </h2>
          <p>
            Construímos o ecossistema com base no método de <strong>Recuperação Ativa (Active Recall)</strong> e <strong>Repetição Espaçada (Spaced Repetition)</strong>, que comprovadamente consolidam a memória de longo prazo necessária para o dia da prova.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="font-bold text-white uppercase text-[11px] block">
                • Reteste Adaptativo de 24h, 7d e 30d
              </span>
              <p className="text-slate-400 text-[11px]">
                As questões erradas pelo candidato retornam em intervalos cientificamente calculados para selar o aprendizado.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="font-bold text-white uppercase text-[11px] block">
                • Micro-Revisões Cirúrgicas
              </span>
              <p className="text-slate-400 text-[11px]">
                Explicações focadas estritamente no distrator que seduziu o aluno, sem enrolação teórica desnecessária.
              </p>
            </div>
          </div>
        </section>

        {/* Informações Institucionais Transparentes */}
        <section className="rounded-2xl bg-[#0D1829] border border-slate-800 p-6 space-y-3 text-xs text-slate-300">
          <h2 className="text-sm font-tactical font-bold text-white uppercase tracking-wider text-amber-400">
            Transparência Institucional
          </h2>
          <p>
            O <strong>{PLATFORM_INFO.platformName}</strong> é gerido de forma independente pela {PLATFORM_INFO.responsibleParty}. Nosso propósito é democratizar o acesso à preparação de excelência para candidatos em todos os 26 estados da federação e no Distrito Federal.
          </p>
          <div className="pt-2 flex items-center gap-2 text-slate-400 text-xs">
            <span>Dúvidas ou sugestões de editais?</span>
            <button
              onClick={() => onNavigate('/contato')}
              className="text-amber-400 font-bold underline hover:text-amber-300"
            >
              Fale com nossa equipe →
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};
