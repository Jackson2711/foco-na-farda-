import React from 'react';
import { UserProfile, QuestionAnswerRecord, StudySession, Discipline } from '../../types';
import { FocoDataEngineStore } from '../../services/store';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Award,
  AlertCircle,
  Lightbulb,
  FileQuestion,
  Layers,
} from 'lucide-react';

interface PerformanceViewProps {
  user: UserProfile;
  onNavigateToQuestions: () => void;
}

export const PerformanceView: React.FC<PerformanceViewProps> = ({
  user,
  onNavigateToQuestions,
}) => {
  const answers: QuestionAnswerRecord[] = FocoDataEngineStore.getQuestionAnswers(user.id);
  const sessions: StudySession[] = FocoDataEngineStore.getStudySessions(user.id);
  const disciplines: Discipline[] = FocoDataEngineStore.getDisciplines();
  const questions = FocoDataEngineStore.getQuestions();

  // Metrics
  const totalQuestions = answers.length;
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const wrongCount = totalQuestions - correctCount;
  const overallAccuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const totalMinutesStudied = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalHoursFormatted = `${Math.floor(totalMinutesStudied / 60)}h ${totalMinutesStudied % 60}m`;

  // Discipline breakdown
  const disciplineStats = disciplines.map((disc) => {
    const questionIds = new Set(questions.filter((q) => q.disciplineId === disc.id).map((q) => q.id));
    const discAnswers = answers.filter((a) => questionIds.has(a.questionId));
    const discCorrect = discAnswers.filter((a) => a.isCorrect).length;
    const discAccuracy = discAnswers.length > 0 ? Math.round((discCorrect / discAnswers.length) * 100) : 0;

    return {
      id: disc.id,
      name: disc.name,
      total: discAnswers.length,
      correct: discCorrect,
      wrong: discAnswers.length - discCorrect,
      accuracy: discAccuracy,
    };
  }).filter((s) => s.total > 0);

  // Best & Worst discipline
  const sortedStats = [...disciplineStats].sort((a, b) => b.accuracy - a.accuracy);
  const bestDiscipline = sortedStats.length > 0 ? sortedStats[0] : null;
  const worstDiscipline = sortedStats.length > 0 ? sortedStats[sortedStats.length - 1] : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-tactical font-black text-white uppercase tracking-wider flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-amber-400" />
            Análise Tática de Desempenho
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Estatísticas auditadas com base estrita no seu histórico real de estudos.
          </p>
        </div>
      </div>

      {/* 4 Main Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-5 rounded-2xl bg-[#0B132B] border border-slate-800 space-y-1 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Questões Feitas</span>
            <FileQuestion className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-mono-code font-black text-white">
            {totalQuestions}
          </div>
          <span className="text-[10px] text-slate-500">
            {correctCount} certas • {wrongCount} erradas
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B132B] border border-slate-800 space-y-1 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Aproveitamento</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-mono-code font-black text-emerald-400">
            {overallAccuracy}%
          </div>
          <span className="text-[10px] text-slate-500">
            Taxa média geral de acertos
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B132B] border border-slate-800 space-y-1 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Tempo Líquido</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-mono-code font-black text-white">
            {totalHoursFormatted}
          </div>
          <span className="text-[10px] text-slate-500">
            Registrado no cronômetro
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B132B] border border-slate-800 space-y-1 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>XP & Patente</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-mono-code font-black text-amber-400">
            {user.xp}
          </div>
          <span className="text-[10px] text-amber-300 font-bold uppercase">
            {user.rank}
          </span>
        </div>
      </div>

      {/* Best & Worst Strengths */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase text-emerald-400">
              PONTO FORTE TÁTICO
            </span>
            <h4 className="text-base font-bold text-white">
              {bestDiscipline ? bestDiscipline.name : 'Dados em construção'}
            </h4>
            <p className="text-xs text-slate-300">
              {bestDiscipline
                ? `Aproveitamento de ${bestDiscipline.accuracy}% (${bestDiscipline.correct}/${bestDiscipline.total} acertos). Mantenha revisões espaçadas periódicas.`
                : 'Resolva questões para identificar suas maiores forças nas provas.'}
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase text-amber-400">
              PONTO DE ATENÇÃO / PRIORIDADE
            </span>
            <h4 className="text-base font-bold text-white">
              {worstDiscipline ? worstDiscipline.name : 'Dados em construção'}
            </h4>
            <p className="text-xs text-slate-300">
              {worstDiscipline
                ? `Aproveitamento de ${worstDiscipline.accuracy}%. Recomendado dedicar pelo menos 40% do seu tempo diário a esta matéria.`
                : 'Resolva questões para identificar matérias com maior índice de erros.'}
            </p>
          </div>
        </div>
      </div>

      {/* Breakdown by Discipline Full List */}
      <div className="rounded-2xl bg-[#0B132B] border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-tactical font-bold text-white uppercase tracking-wider">
            Detalhamento Completo por Disciplina
          </h3>
          <span className="text-xs font-mono-code text-slate-400">
            {disciplineStats.length} Matérias com Resoluções
          </span>
        </div>

        {disciplineStats.length > 0 ? (
          <div className="space-y-4">
            {disciplineStats.map((stat) => (
              <div key={stat.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{stat.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">
                      {stat.correct} certos / {stat.wrong} errados
                    </span>
                    <span
                      className={`font-mono-code font-bold px-2 py-0.5 rounded ${
                        stat.accuracy >= 70
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : stat.accuracy >= 50
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {stat.accuracy}%
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      stat.accuracy >= 70
                        ? 'bg-emerald-500'
                        : stat.accuracy >= 50
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${stat.accuracy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center text-slate-400 space-y-3">
            <FileQuestion className="w-10 h-10 text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-white">Nenhuma questão respondida ainda</h4>
            <p className="text-xs max-w-sm mx-auto">
              Ao resolver questões e simulados na plataforma, seu raio-X tático e gráficos de desempenho serão calculados em tempo real.
            </p>
            <button
              onClick={onNavigateToQuestions}
              className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              Ir para o Banco de Questões
            </button>
          </div>
        )}
      </div>

      {/* Tactical Mentor Recommendations */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-[#0B132B] border border-amber-500/30 flex items-start gap-3.5">
        <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-slate-300 leading-relaxed">
          <span className="font-bold text-white text-sm">
            Diretriz do Coordenador Pedagógico:
          </span>
          <p>
            Mantenha uma meta de no mínimo 30 a 50 questões resolvidas diariamente. Para matérias jurídicas (Direito Penal e Constitucional), priorize a letra da lei combinada às súmulas vinculantes do STF e STJ. Use a função "Explicar com IA" sempre que errar uma questão para entender o conceito e agende a questão para o ciclo de 24 horas nas Revisões Espaçadas.
          </p>
        </div>
      </div>
    </div>
  );
};
