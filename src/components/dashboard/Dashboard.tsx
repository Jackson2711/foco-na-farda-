import React from 'react';
import { UserProfile, Contest, QuestionAnswerRecord, StudySession, Discipline } from '../../types';
import { FocoDataEngineStore } from '../../services/store';
import {
  Shield,
  Target,
  Clock,
  Flame,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  FileQuestion,
  Timer,
  AlertCircle,
  Sparkles,
  ArrowUpRight,
  Star,
  Brain,
  Repeat,
  Zap,
} from 'lucide-react';

interface DashboardProps {
  user: UserProfile;
  onNavigate: (tab: string) => void;
  onSelectContest?: (contestId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  onNavigate,
  onSelectContest,
}) => {
  const contests = FocoDataEngineStore.getContests();
  const disciplines = FocoDataEngineStore.getDisciplines();
  const careers = FocoDataEngineStore.getCareers();
  const answers: QuestionAnswerRecord[] = FocoDataEngineStore.getQuestionAnswers(user.id);
  const sessions: StudySession[] = FocoDataEngineStore.getStudySessions(user.id);
  const reviews = FocoDataEngineStore.getReviews(user.id).filter((r) => r.status === 'pending');
  const favorites = FocoDataEngineStore.getFavorites(user.id);
  const adaptiveRetests = FocoDataEngineStore.getAdaptiveRetests(user.id);
  const readyRetestsCount = adaptiveRetests.filter(
    (r) => r.status === 'ready' || new Date(r.scheduledFor) <= new Date()
  ).length;
  const psychometrics = FocoDataEngineStore.getPsychometricMetrics(user.id);

  // Target contest
  const targetContest: Contest | undefined = contests.find(
    (c) => c.id === user.targetContestId
  ) || contests[0];

  const targetCareer = careers.find((c) => c.id === (targetContest?.careerId || user.targetCareerId));

  // Today calculations
  const todayDateStr = new Date().toISOString().split('T')[0];
  const answersToday = answers.filter((a) => a.answeredAt.startsWith(todayDateStr));
  const correctToday = answersToday.filter((a) => a.isCorrect).length;
  const accuracyToday = answersToday.length > 0 ? Math.round((correctToday / answersToday.length) * 100) : 0;

  // Study time today
  const minutesToday = sessions
    .filter((s) => s.completedAt.startsWith(todayDateStr))
    .reduce((acc, s) => acc + s.durationMinutes, 0);

  const hoursFormatted = `${String(Math.floor(minutesToday / 60)).padStart(2, '0')}h${String(
    minutesToday % 60
  ).padStart(2, '0')}`;

  // Days remaining for exam
  let daysRemaining: number | null = null;
  if (targetContest?.examDate) {
    const examDate = new Date(targetContest.examDate + 'T00:00:00');
    const today = new Date();
    const diffTime = examDate.getTime() - today.getTime();
    daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }

  // Greeting by hour
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Bom dia' : currentHour < 18 ? 'Boa tarde' : 'Boa noite';

  // Overall statistics
  const totalQuestions = answers.length;
  const totalCorrect = answers.filter((a) => a.isCorrect).length;
  const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  // Performance by discipline
  const questionsList = FocoDataEngineStore.getQuestions();
  const disciplineStats = disciplines.map((disc) => {
    const discQuestionIds = new Set(questionsList.filter((q) => q.disciplineId === disc.id).map((q) => q.id));
    const discAnswers = answers.filter((a) => discQuestionIds.has(a.questionId));
    const correct = discAnswers.filter((a) => a.isCorrect).length;
    const accuracy = discAnswers.length > 0 ? Math.round((correct / discAnswers.length) * 100) : null;
    return {
      name: disc.name,
      total: discAnswers.length,
      correct,
      accuracy,
    };
  }).filter((s) => s.total > 0).slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Hero Tactical Command Header */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0C152B] via-[#0F1E3D] to-[#0A1128] border border-amber-500/30 p-5 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs uppercase font-mono-code font-bold text-amber-400 tracking-wider">
              {greeting}, {user.name} • Patente: {user.rank}
            </span>
            <h1 className="text-2xl sm:text-3xl font-tactical font-black text-white uppercase tracking-wide">
              {targetContest?.title || 'Preparação Policial Nacional'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Carreira:{' '}
              <strong className="text-amber-400 font-semibold">
                {targetCareer?.name || 'Segurança Pública'}
              </strong>{' '}
              • Situação: <span className="text-slate-200">{targetContest?.situation}</span> •
              Banca: <span className="text-slate-200">{targetContest?.examiningBoard}</span>
            </p>

            {daysRemaining !== null && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold font-mono-code">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Faltam {daysRemaining} dias para sua prova oficial</span>
              </div>
            )}
          </div>

          {/* Primary Action Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => onNavigate('questions')}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-amber-300 transition"
            >
              <span>CONTINUAR ESTUDANDO</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>

            <button
              onClick={() => onNavigate('timer')}
              className="flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-amber-400 text-slate-200 text-xs font-bold transition"
            >
              <Timer className="w-4 h-4 text-amber-400" />
              <span>Cronômetro</span>
            </button>
          </div>
        </div>

        {/* Tactical background accent */}
        <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 4 Key Tactical Metric Cards (Section 4) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Questões Hoje */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0B132B] border border-slate-800 shadow-md space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
            <span>Questões Hoje</span>
            <FileQuestion className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono-code font-black text-white">
            {answersToday.length}
          </div>
          <div className="text-[10px] text-slate-500">
            Total histórico: {totalQuestions}
          </div>
        </div>

        {/* Acertos */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0B132B] border border-slate-800 shadow-md space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
            <span>Taxa de Acertos</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono-code font-black text-emerald-400">
            {accuracyToday}%
          </div>
          <div className="text-[10px] text-slate-500">
            Geral: {overallAccuracy}% de acerto
          </div>
        </div>

        {/* Tempo de Estudo */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0B132B] border border-slate-800 shadow-md space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
            <span>Tempo Hoje</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono-code font-black text-white">
            {hoursFormatted}
          </div>
          <div className="text-[10px] text-slate-500">
            Meta diária: {Math.floor(user.dailyStudyMinutes / 60)}h
          </div>
        </div>

        {/* Sequência */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0B132B] border border-slate-800 shadow-md space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
            <span>Sequência</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono-code font-black text-orange-400">
            {user.streakDays} dias
          </div>
          <div className="text-[10px] text-slate-500">
            Fogo tático constante
          </div>
        </div>
      </div>

      {/* Seção Informativa: ESTUDE DE FORMA INTELIGENTE (Section 14) */}
      <div className="rounded-2xl bg-[#0B132B] border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wider text-amber-400 uppercase">
              <span>Metodologia Ativa</span>
              <span className="text-slate-600" aria-hidden="true">·</span>
              <span className="text-slate-400 font-normal normal-case">Pilares de Preparação</span>
            </div>
            <h3 className="text-base sm:text-lg font-tactical font-black text-white uppercase tracking-wider mt-0.5">
              Estude de Forma Inteligente
            </h3>
          </div>
          <p className="text-xs text-slate-400 max-w-md">
            Ferramentas integradas para guiar cada etapa da sua jornada rumo à aprovação na carreira pública.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* Card 1: Questões */}
          <button
            type="button"
            onClick={() => onNavigate('questions')}
            className="group text-left p-4 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all shadow-sm flex flex-col justify-between space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <FileQuestion className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition shrink-0 mt-1" />
            </div>
            <div>
              <h4 className="font-tactical font-black text-sm text-white group-hover:text-amber-400 transition uppercase tracking-wide">
                Questões
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                "Seu próximo avanço começa com uma questão." Resolução comentada e dissecação de distratores.
              </p>
            </div>
          </button>

          {/* Card 2: Simulados */}
          <button
            type="button"
            onClick={() => onNavigate('simulations')}
            className="group text-left p-4 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-sky-500/40 transition-all shadow-sm flex flex-col justify-between space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-sky-400 transition shrink-0 mt-1" />
            </div>
            <div>
              <h4 className="font-tactical font-black text-sm text-white group-hover:text-sky-400 transition uppercase tracking-wide">
                Simulados
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                "Teste seu conhecimento sob pressão." Cronômetro ininterrupto e reprodução fiel do ambiente do edital.
              </p>
            </div>
          </button>

          {/* Card 3: Diagnóstico */}
          <button
            type="button"
            onClick={() => onNavigate('psychometrics')}
            className="group text-left p-4 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/40 transition-all shadow-sm flex flex-col justify-between space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <Brain className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-purple-400 transition shrink-0 mt-1" />
            </div>
            <div>
              <h4 className="font-tactical font-black text-sm text-white group-hover:text-purple-400 transition uppercase tracking-wide">
                Diagnóstico
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                "Descubra onde você precisa melhorar." Mapeamento cognitivo de vulnerabilidades e pontos cegos.
              </p>
            </div>
          </button>

          {/* Card 4: Revisões */}
          <button
            type="button"
            onClick={() => onNavigate('reviews')}
            className="group text-left p-4 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all shadow-sm flex flex-col justify-between space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Repeat className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition shrink-0 mt-1" />
            </div>
            <div>
              <h4 className="font-tactical font-black text-sm text-white group-hover:text-emerald-400 transition uppercase tracking-wide">
                Revisões
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Repetição espaçada com intervalos de 24h, 7d e 30d para neutralizar a curva do esquecimento.
              </p>
            </div>
          </button>

          {/* Card 5: Análise de Erros */}
          <button
            type="button"
            onClick={() => onNavigate('retest')}
            className="group text-left p-4 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-rose-500/40 transition-all shadow-sm flex flex-col justify-between space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <Target className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-rose-400 transition shrink-0 mt-1" />
            </div>
            <div>
              <h4 className="font-tactical font-black text-sm text-white group-hover:text-rose-400 transition uppercase tracking-wide">
                Análise de Erros
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Esteira de reteste adaptativo das assertivas erradas com alteração e embaralhamento de opções.
              </p>
            </div>
          </button>

          {/* Card 6: Desempenho */}
          <button
            type="button"
            onClick={() => onNavigate('performance')}
            className="group text-left p-4 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all shadow-sm flex flex-col justify-between space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition shrink-0 mt-1" />
            </div>
            <div>
              <h4 className="font-tactical font-black text-sm text-white group-hover:text-amber-400 transition uppercase tracking-wide">
                Desempenho
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Métricas históricas de evolução, taxa líquida de acertos e distribuição comparativa por banca.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Grid: Study Agenda & Performance by Discipline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Next Study Task & Reviews */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-2xl bg-[#0B132B] border border-slate-800 p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-tactical font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-400" />
                Próximas Missões de Estudo
              </h3>
              <span className="text-[10px] font-mono-code text-slate-400">
                CICLO ATIVO
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Task 1: Spaced Reviews & Adaptive Retest */}
              <div
                onClick={() => onNavigate('retest')}
                className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    {readyRetestsCount > 0 ? readyRetestsCount : <Repeat className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white group-hover:text-amber-400 transition">
                        Ciclo de Reteste Adaptativo
                      </h4>
                      {readyRetestsCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[9px] font-bold font-mono-code">
                          {readyRetestsCount} prontos
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {readyRetestsCount > 0
                        ? `${readyRetestsCount} questões no ciclo para retestar hoje.`
                        : 'Esteira adaptativa para eliminar pontos cegos e memorização falsa.'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition" />
              </div>

              {/* Task 2: Psychometrics & Blind Spots */}
              <div
                onClick={() => onNavigate('psychometrics')}
                className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white group-hover:text-blue-400 transition">
                        Diagnóstico Psicométrico & Distratores
                      </h4>
                      {psychometrics.blindSpotsCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-bold font-mono-code">
                          {psychometrics.blindSpotsCount} pontos cegos
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Mapa de calor de vulnerabilidades e laudo cognitivo com IA.
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition" />
              </div>

              {/* Task 3: Spaced Reviews */}
              <div
                onClick={() => onNavigate('reviews')}
                className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center font-bold">
                    {reviews.length}
                  </div>
                  <div>
                    <h4 className="font-bold text-white group-hover:text-amber-400 transition">
                      Revisões Espaçadas de Hoje
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {reviews.length > 0
                        ? `${reviews.length} questões agendadas para revisão imediata.`
                        : 'Nenhuma revisão pendente para hoje. Excelente!'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition" />
              </div>

              {/* Task 2: Question Solving */}
              <div
                onClick={() => onNavigate('questions')}
                className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    <FileQuestion className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white group-hover:text-amber-400 transition">
                      Resolução de Questões da Banca
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Resolva questões com comentários e assistência da IA.
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition" />
              </div>

              {/* Task 3: Simulado */}
              <div
                onClick={() => onNavigate('simulations')}
                className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white group-hover:text-amber-400 transition">
                      Simulado Tático com Cronômetro
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Avalie seu tempo de prova e ranking nacional.
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition" />
              </div>
            </div>
          </div>
        </div>

        {/* Performance by Discipline (Section 4) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-2xl bg-[#0B132B] border border-slate-800 p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-tactical font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Desempenho por Disciplina
              </h3>
              <button
                onClick={() => onNavigate('performance')}
                className="text-[11px] text-amber-400 hover:underline font-semibold"
              >
                Ver tudo →
              </button>
            </div>

            {disciplineStats.length > 0 ? (
              <div className="space-y-3">
                {disciplineStats.map((stat) => (
                  <div key={stat.name} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">{stat.name}</span>
                      <span className="font-mono-code font-bold text-amber-400">
                        {stat.accuracy}% ({stat.correct}/{stat.total})
                      </span>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          (stat.accuracy || 0) >= 70
                            ? 'bg-emerald-500'
                            : (stat.accuracy || 0) >= 50
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${stat.accuracy || 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-slate-400 space-y-2">
                <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs">
                  Você ainda não respondeu questões suficientes para gerar o gráfico por disciplina.
                </p>
                <button
                  onClick={() => onNavigate('questions')}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs"
                >
                  Começar a responder questões
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Target Contest Detailed Card (Section 11) */}
      {targetContest && (
        <div className="rounded-2xl bg-[#0B132B] border border-slate-800 p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              SEU OBJETIVO PRINCIPAL
            </span>
            <h4 className="text-base font-bold text-white">{targetContest.title}</h4>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
              <span>Vagas: <strong className="text-white">{targetContest.vacancies}</strong></span>
              <span>Banca: <strong className="text-white">{targetContest.examiningBoard}</strong></span>
              <span>Salário: <strong className="text-amber-300">R$ {targetContest.salary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></span>
              <span>Origem: <strong className="text-slate-300">{targetContest.sourceName}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            <button
              onClick={() => onNavigate('mycontest')}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-white text-xs font-bold transition"
            >
              Painel do Meu Concurso
            </button>
            <button
              onClick={() => onNavigate('radar')}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition"
            >
              Trocar Concurso Alvo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
