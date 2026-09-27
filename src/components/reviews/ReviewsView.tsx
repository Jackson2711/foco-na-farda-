import React, { useState } from 'react';
import { UserProfile, ReviewItem, Question, Discipline } from '../../types';
import { FocoDataEngineStore } from '../../services/store';
import {
  RotateCcw,
  CheckCircle2,
  Calendar,
  BookOpen,
  FileQuestion,
  ChevronRight,
  Flame,
  Award,
  Sparkles,
} from 'lucide-react';

interface ReviewsViewProps {
  user: UserProfile;
  onOpenQuestion: (questionId: string) => void;
}

export const ReviewsView: React.FC<ReviewsViewProps> = ({
  user,
  onOpenQuestion,
}) => {
  const reviews: ReviewItem[] = FocoDataEngineStore.getReviews(user.id);
  const questions: Question[] = FocoDataEngineStore.getQuestions();
  const disciplines: Discipline[] = FocoDataEngineStore.getDisciplines();

  const [activeFilter, setActiveFilter] = useState<'pending' | 'completed'>('pending');

  const pendingReviews = reviews.filter((r) => r.status === 'pending');
  const completedReviews = reviews.filter((r) => r.status === 'completed');

  const handleAdvanceReview = (reviewId: string, nextInterval?: 7 | 30) => {
    FocoDataEngineStore.markReviewDone(reviewId, nextInterval);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-tactical font-black text-white uppercase tracking-wider flex items-center gap-2.5">
            <RotateCcw className="w-6 h-6 text-amber-400" />
            Revisões de Hoje (Curva do Esquecimento)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Algoritmo de repetição espaçada (24h, 7 dias e 30 dias) para fixação definitiva na memória.
          </p>
        </div>

        {/* Status switch */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveFilter('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeFilter === 'pending'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Pendentes Hoje ({pendingReviews.length})
          </button>
          <button
            onClick={() => setActiveFilter('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeFilter === 'completed'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Concluídas ({completedReviews.length})
          </button>
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-3">
        {activeFilter === 'pending' ? (
          pendingReviews.length > 0 ? (
            pendingReviews.map((rev) => {
              const q = questions.find((item) => item.id === rev.questionId);
              const disc = disciplines.find((d) => d.id === q?.disciplineId);

              if (!q) return null;

              return (
                <div
                  key={rev.id}
                  className="rounded-2xl bg-[#0B132B] border border-slate-800 p-5 shadow-lg space-y-4 hover:border-amber-500/40 transition"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded font-mono-code font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        Ciclo de {rev.intervalDays} {rev.intervalDays === 1 ? 'dia' : 'dias'}
                      </span>
                      <span className="font-semibold text-slate-300">
                        {disc?.name || 'Disciplina'}
                      </span>
                      <span className="text-slate-400">
                        {q.examiningBoard} • {q.year}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-400">
                      Revisado {rev.timesReviewed} vezes
                    </span>
                  </div>

                  <p className="text-sm text-slate-200 line-clamp-3">
                    {q.statement}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <button
                      onClick={() => onOpenQuestion(q.id)}
                      className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-white text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <FileQuestion className="w-3.5 h-3.5 text-amber-400" />
                      <span>Resolver / Ver Explicação Completa</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAdvanceReview(rev.id, 7)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-medium"
                        title="Agendar próxima revisão para daqui a 7 dias"
                      >
                        +7 Dias
                      </button>
                      <button
                        onClick={() => handleAdvanceReview(rev.id, 30)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-medium"
                        title="Agendar próxima revisão para daqui a 30 dias"
                      >
                        +30 Dias
                      </button>
                      <button
                        onClick={() => handleAdvanceReview(rev.id)}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Marcar como Dominada</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center rounded-2xl bg-[#0B132B] border border-slate-800 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-white">Nenhuma revisão pendente para hoje!</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Todas as questões e temas agendados foram revisados. Continue resolvendo questões no banco para alimentar novos ciclos.
              </p>
            </div>
          )
        ) : (
          completedReviews.map((rev) => {
            const q = questions.find((item) => item.id === rev.questionId);
            return (
              <div
                key={rev.id}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs flex items-center justify-between opacity-80"
              >
                <div>
                  <span className="font-bold text-white">Questão #{q?.codeNumber}</span>
                  <p className="text-slate-400 line-clamp-1">{q?.statement}</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                  Dominada
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
