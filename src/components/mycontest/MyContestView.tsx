import React, { useState } from 'react';
import { UserProfile, Contest, Discipline, QuestionAnswerRecord, Career, Position } from '../../types';
import { FocoDataEngineStore } from '../../services/store';
import { generateAIStudyPlan } from '../../services/aiService';
import { ConcursosBanner } from '../common/SectionBanners';
import {
  Target,
  Calendar,
  DollarSign,
  Users,
  Award,
  BookOpen,
  Sparkles,
  FileText,
  FileQuestion,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Loader2,
  ChevronRight,
} from 'lucide-react';

interface MyContestViewProps {
  user: UserProfile;
  onNavigate: (tab: string) => void;
  onOpenContestSelector: () => void;
}

export const MyContestView: React.FC<MyContestViewProps> = ({
  user,
  onNavigate,
  onOpenContestSelector,
}) => {
  const contests = FocoDataEngineStore.getContests();
  const disciplines = FocoDataEngineStore.getDisciplines();
  const careers = FocoDataEngineStore.getCareers();
  const positions = FocoDataEngineStore.getPositions();
  const answers: QuestionAnswerRecord[] = FocoDataEngineStore.getQuestionAnswers(user.id);

  const contest: Contest =
    contests.find((c) => c.id === user.targetContestId) || contests[0];

  const career = careers.find((c) => c.id === contest.careerId);
  const position = positions.find((p) => p.id === contest.positionId);

  // AI Plan State
  const [aiPlan, setAiPlan] = useState<string>('');
  const [loadingAI, setLoadingAI] = useState<boolean>(false);
  const [showPlanModal, setShowPlanModal] = useState<boolean>(false);

  // Calculation of days remaining
  let daysRemaining: number | null = null;
  if (contest.examDate) {
    const examDate = new Date(contest.examDate + 'T00:00:00');
    const today = new Date();
    const diffTime = examDate.getTime() - today.getTime();
    daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }

  // Generate intelligent study plan with AI
  const handleGeneratePlan = async () => {
    setShowPlanModal(true);
    setLoadingAI(true);
    try {
      const plan = await generateAIStudyPlan({
        targetCareer: career?.name || 'Polícia Militar',
        targetContest: contest.title,
        hoursPerDay: Math.floor(user.dailyStudyMinutes / 60) || 2,
        daysPerWeek: 6,
        weakSubjects: ['Direito Penal', 'Língua Portuguesa', 'RLM'],
        examDate: contest.examDate,
      });
      setAiPlan(plan);
    } catch (e: any) {
      setAiPlan('Não foi possível gerar o plano de estudos no momento. Verifique a chave de API.');
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner Informativo: CONCURSOS */}
      <ConcursosBanner
        compact
        action={{
          label: 'Explorar Mais Concursos',
          onClick: () => onNavigate('radar'),
        }}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-tactical font-black text-white uppercase tracking-wider flex items-center gap-2.5">
            <Target className="w-6 h-6 text-amber-400" />
            Central Tática: Meu Concurso
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Planejamento exclusivo, cronograma de matérias e cronômetro para sua farda.
          </p>
        </div>

        <button
          onClick={onOpenContestSelector}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-amber-300 text-xs font-bold transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Trocar Concurso Alvo</span>
        </button>
      </div>

      {/* Target Contest Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-[#0D1829] to-[#0A1128] border border-amber-500/40 p-6 sm:p-7 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {contest.sphere}
              </span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                {contest.situation}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white">{contest.title}</h1>
            <p className="text-xs text-slate-400 mt-1">
              Cargo: <strong className="text-slate-200">{position?.name || 'Agente / Soldado'}</strong>{' '}
              • Escolaridade: <strong className="text-slate-200">{position?.educationLevel || 'Nível Superior / Médio'}</strong>
            </p>
          </div>

          {daysRemaining !== null && (
            <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/40 text-center min-w-[140px]">
              <span className="text-3xl font-mono-code font-black text-amber-400">
                {daysRemaining}
              </span>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                Dias até a Prova
              </p>
            </div>
          )}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Vagas</span>
            <span className="text-lg font-mono-code font-bold text-white">
              {contest.vacancies ? contest.vacancies.toLocaleString('pt-BR') : 'A definir'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Remuneração</span>
            <span className="text-lg font-mono-code font-bold text-amber-300">
              R$ {contest.salary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Banca</span>
            <span className="text-sm font-bold text-white truncate block">
              {contest.examiningBoard}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Data da Prova</span>
            <span className="text-sm font-bold text-white">
              {contest.examDate
                ? new Date(contest.examDate + 'T00:00:00').toLocaleDateString('pt-BR')
                : 'A definir'}
            </span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleGeneratePlan}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-300 transition"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Gerar Plano de Estudo com IA</span>
          </button>

          <button
            onClick={() => onNavigate('simulations')}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-white text-xs font-bold transition"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Simulado Deste Concurso</span>
          </button>

          <button
            onClick={() => onNavigate('questions')}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-white text-xs font-bold transition"
          >
            <FileQuestion className="w-4 h-4 text-amber-400" />
            <span>Resolver Questões da Banca</span>
          </button>

          <a
            href={contest.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white text-xs font-medium transition ml-auto"
          >
            <span>Edital Oficial / DOU</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Disciplines of the Exam */}
      <div className="rounded-2xl bg-[#0B132B] border border-slate-800 p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-sm font-tactical font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            Disciplinas do Conteúdo Programático
          </h3>
          <span className="text-[11px] text-slate-400 font-mono-code">
            {disciplines.length} Disciplinas Catalogadas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {disciplines.slice(0, 6).map((disc) => (
            <div
              key={disc.id}
              onClick={() => onNavigate('disciplines')}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 transition cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition">
                  {disc.name}
                </h4>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                {disc.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Study Plan Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-[#0D1829] border border-amber-500/40 p-6 shadow-2xl text-slate-100 relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  Plano de Estudos Tático Gerado por IA
                </h3>
              </div>
              <button
                onClick={() => setShowPlanModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 min-h-[220px] max-h-[420px] overflow-y-auto text-xs text-slate-200 leading-relaxed whitespace-pre-line font-normal">
              {loadingAI ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-3 text-slate-400">
                  <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                  <p className="font-semibold text-xs">
                    Criando ciclo de estudos tático e divisão de horários com base no edital...
                  </p>
                </div>
              ) : (
                aiPlan
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowPlanModal(false)}
                className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs"
              >
                Salvar e Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
