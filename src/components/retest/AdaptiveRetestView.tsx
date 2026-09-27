import React, { useState } from 'react';
import {
  UserProfile,
  AdaptiveRetestItem,
  Question,
  Discipline,
  Career,
  RetestStage,
} from '../../types';
import { FocoDataEngineStore } from '../../services/store';
import {
  generateVariantQuestionWithAI,
  getMicroReviewWithAI,
} from '../../services/aiService';
import {
  Repeat,
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Calendar,
  AlertTriangle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Brain,
  FileQuestion,
  BookOpen,
} from 'lucide-react';

interface AdaptiveRetestViewProps {
  user: UserProfile;
  onUpdateUser: (profile: UserProfile) => void;
  onNavigateToQuestions: () => void;
}

export const AdaptiveRetestView: React.FC<AdaptiveRetestViewProps> = ({
  user,
  onUpdateUser,
  onNavigateToQuestions,
}) => {
  const [retests, setRetests] = useState<AdaptiveRetestItem[]>(() =>
    FocoDataEngineStore.getAdaptiveRetests(user.id)
  );

  const [activeTabFilter, setActiveTabFilter] = useState<'ready' | 'pending' | 'mastered'>('ready');
  const [solvingItem, setSolvingItem] = useState<AdaptiveRetestItem | null>(null);
  const [solvingQuestion, setSolvingQuestion] = useState<Question | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<'A' | 'B' | 'C' | 'D' | 'E' | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [loadingVariant, setLoadingVariant] = useState<boolean>(false);

  const questions: Question[] = FocoDataEngineStore.getQuestions();
  const disciplines: Discipline[] = FocoDataEngineStore.getDisciplines();

  // Reload data
  const refreshData = () => {
    setRetests(FocoDataEngineStore.getAdaptiveRetests(user.id));
  };

  const now = new Date();
  const readyItems = retests.filter((r) => r.status === 'ready' || new Date(r.scheduledFor) <= now);
  const inProgressItems = retests.filter((r) => r.status === 'pending' && new Date(r.scheduledFor) > now);
  const masteredItems = retests.filter((r) => r.status === 'mastered');

  const filteredItems =
    activeTabFilter === 'ready'
      ? readyItems
      : activeTabFilter === 'pending'
      ? inProgressItems
      : masteredItems;

  const handleStartRetest = async (item: AdaptiveRetestItem) => {
    setSolvingItem(item);
    setSelectedLetter(null);
    setIsAnswered(false);
    setIsCorrect(false);

    // If stage is retest_7d_variant and variant question is not yet present, generate with Gemini
    if (item.currentStage === 'retest_7d_variant') {
      if (item.variantQuestion) {
        setSolvingQuestion(item.variantQuestion);
      } else {
        const original = questions.find((q) => q.id === item.originalQuestionId);
        if (original) {
          setLoadingVariant(true);
          try {
            const variantData = await generateVariantQuestionWithAI({
              originalQuestion: original,
              errorType: item.errorType,
              distractorRole: item.chosenDistractorRole,
            });

            if (variantData && variantData.statement && variantData.options) {
              const fullVariant: Question = {
                id: `var-${Date.now()}`,
                codeNumber: Math.floor(1000 + Math.random() * 9000),
                statement: variantData.statement,
                options: variantData.options as any,
                correctOptionLetter: (variantData.correctOptionLetter as any) || 'A',
                explanation: variantData.explanation || original.explanation,
                disciplineId: original.disciplineId,
                careerId: original.careerId,
                positionName: original.positionName,
                contestTitle: `${original.contestTitle} (Variante Adaptativa)`,
                year: 2026,
                examiningBoard: original.examiningBoard,
                difficulty: original.difficulty,
                source: 'Gerador Adaptativo IA Gemini - Foco na Farda',
                tags: [...original.tags, 'Variante Adaptativa'],
                isAdaptiveVariant: true,
                derivedFromQuestionId: original.id,
              };
              setSolvingQuestion(fullVariant);
              item.variantQuestion = fullVariant;
              FocoDataEngineStore.saveAdaptiveRetests(retests);
            } else {
              setSolvingQuestion(original);
            }
          } catch {
            setSolvingQuestion(original);
          } finally {
            setLoadingVariant(false);
          }
        }
      }
    } else {
      const q = questions.find((itemQ) => itemQ.id === item.originalQuestionId);
      setSolvingQuestion(q || null);
    }
  };

  const handleConfirmRetestAnswer = () => {
    if (!solvingItem || !solvingQuestion || !selectedLetter || isAnswered) return;

    const correct = selectedLetter === solvingQuestion.correctOptionLetter;
    setIsCorrect(correct);
    setIsAnswered(true);

    // Record answer in general store
    FocoDataEngineStore.recordAnswer({
      userId: user.id,
      questionId: solvingQuestion.id,
      selectedOptionLetter: selectedLetter,
      isCorrect: correct,
      timeSpentSeconds: 35,
    });

    // Advance retest stage in store
    FocoDataEngineStore.advanceAdaptiveRetestStage(solvingItem.id, correct);
    refreshData();
  };

  const handleCloseSession = () => {
    setSolvingItem(null);
    setSolvingQuestion(null);
    setSelectedLetter(null);
    setIsAnswered(false);
    refreshData();
  };

  const stageLabels: Record<RetestStage, { label: string; desc: string; color: string }> = {
    micro_review: { label: 'Micro-Revisão', desc: 'Fixação imediata da regra', color: 'text-amber-400 bg-amber-500/20 border-amber-500/30' },
    retest_24h: { label: 'Reteste 24 Horas', desc: 'Verificação rápida de curto prazo', color: 'text-blue-400 bg-blue-500/20 border-blue-500/30' },
    retest_7d_variant: { label: 'Reteste 7 Dias (Variante)', desc: 'Questão inédita gerada pela IA', color: 'text-purple-400 bg-purple-500/20 border-purple-500/30' },
    retest_30d_mastery: { label: 'Reteste 30 Dias (Consolidação)', desc: 'Memória de longo prazo', color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30' },
    mastered: { label: 'Ponto Cego Superado', desc: 'Habilidade cognitiva consolidada', color: 'text-emerald-300 bg-emerald-500/30 border-emerald-500/50' },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0C152B] via-[#0D1C3D] to-[#12234D] border border-amber-500/30 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold font-mono-code uppercase tracking-wider">
              <Repeat className="w-3.5 h-3.5" />
              SISTEMA DE APRENDIZAGEM ADAPTATIVA
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Ciclo de Reteste Adaptativo
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Não adianta apenas responder mais questões. O objetivo é <strong>aumentar o domínio real do conteúdo</strong>.
              Toda questão que você erra passa pela esteira de 4 estágios até a consolidação definitiva na memória de longo prazo.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <div className="text-center">
              <div className="text-2xl font-black text-amber-400 font-mono-code">
                {readyItems.length}
              </div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Prontos Hoje</div>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="text-center">
              <div className="text-2xl font-black text-white font-mono-code">
                {inProgressItems.length}
              </div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Em Ciclo</div>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="text-center">
              <div className="text-2xl font-black text-emerald-400 font-mono-code">
                {masteredItems.length}
              </div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Dominados</div>
            </div>
          </div>
        </div>
      </div>

      {/* Esteira dos 4 Estágios (Pipeline Pedagógico) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0B132B] border border-slate-800 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Brain className="w-3.5 h-3.5 text-amber-400" />
          Como Funciona o Ciclo Adaptativo de Retenção:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1">
            <div className="font-bold text-amber-400 flex items-center gap-1.5">
              <span>1. Micro-Revisão</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Explicação cirúrgica imediata da IA mostrando exatamente a regra ou prazo violado.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1">
            <div className="font-bold text-blue-400 flex items-center gap-1.5">
              <span>2. Reteste 24 Horas</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              A mesma questão reaplicada após 1 dia para medir assimilação inicial do feedback.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1">
            <div className="font-bold text-purple-400 flex items-center gap-1.5">
              <span>3. Variante 7 Dias (IA)</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Questão autoral inédita gerada pelo Gemini para testar o conceito sem decoreba de letra.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1">
            <div className="font-bold text-emerald-400 flex items-center gap-1.5">
              <span>4. Consolidação 30d</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Reteste definitivo para atestar que o ponto cego foi eliminado para o dia da prova.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex border-b border-slate-800 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTabFilter('ready')}
          className={`pb-3 border-b-2 transition flex items-center gap-1.5 ${
            activeTabFilter === 'ready'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <span>Prontos para Retestar</span>
          <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono-code text-[10px]">
            {readyItems.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTabFilter('pending')}
          className={`pb-3 border-b-2 transition flex items-center gap-1.5 ${
            activeTabFilter === 'pending'
              ? 'border-blue-400 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <span>Em Andamento (Aguardando Data)</span>
          <span className="px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono-code text-[10px]">
            {inProgressItems.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTabFilter('mastered')}
          className={`pb-3 border-b-2 transition flex items-center gap-1.5 ${
            activeTabFilter === 'mastered'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <span>Pontos Cegos Superados</span>
          <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono-code text-[10px]">
            {masteredItems.length}
          </span>
        </button>
      </div>

      {/* Retest Active Solving Modal / Panel */}
      {solvingItem && solvingQuestion && (
        <div className="p-6 rounded-2xl bg-[#0D1829] border border-amber-500/50 space-y-5 animate-fade-in shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full border text-xs font-bold ${stageLabels[solvingItem.currentStage].color}`}>
                {stageLabels[solvingItem.currentStage].label}
              </span>
              {solvingQuestion.isAdaptiveVariant && (
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Questão Variante Inédita (Gemini)
                </span>
              )}
            </div>

            <button
              onClick={handleCloseSession}
              className="text-xs text-slate-400 hover:text-white"
            >
              Fechar Reteste ✕
            </button>
          </div>

          {loadingVariant ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
              <p className="text-xs text-slate-300 font-semibold">
                O Gemini está forjando uma questão variante adaptativa inédita no mesmo padrão da sua banca...
              </p>
            </div>
          ) : (
            <>
              {/* Micro-Review Summary Note if available */}
              {solvingItem.microReviewSummary && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1 text-xs">
                  <span className="font-bold text-amber-400 flex items-center gap-1 text-[11px] uppercase">
                    <Zap className="w-3 h-3" />
                    Lembre-se da Micro-Revisão:
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {solvingItem.microReviewSummary}
                  </p>
                </div>
              )}

              {/* Statement */}
              <div className="text-sm text-slate-100 font-medium leading-relaxed whitespace-pre-line">
                {solvingQuestion.statement}
              </div>

              {/* Options */}
              <div className="space-y-2">
                {solvingQuestion.options.map((opt) => {
                  const isSelected = selectedLetter === opt.letter;
                  let optStyle = 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700';

                  if (!isAnswered) {
                    if (isSelected) optStyle = 'bg-amber-500/20 border-amber-400 text-white ring-1 ring-amber-400';
                  } else {
                    if (opt.letter === solvingQuestion.correctOptionLetter) {
                      optStyle = 'bg-emerald-500/20 border-emerald-400 text-white ring-1 ring-emerald-400';
                    } else if (isSelected && !isCorrect) {
                      optStyle = 'bg-red-500/20 border-red-500 text-white ring-1 ring-red-500';
                    } else {
                      optStyle = 'bg-slate-900/50 border-slate-900 text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <div
                      key={opt.id}
                      onClick={() => !isAnswered && setSelectedLetter(opt.letter)}
                      className={`p-3 rounded-xl border text-xs font-medium cursor-pointer transition flex items-start gap-3 ${optStyle}`}
                    >
                      <span className="w-6 h-6 rounded flex items-center justify-center bg-slate-800 text-slate-300 font-bold shrink-0">
                        {opt.letter}
                      </span>
                      <span className="mt-0.5 leading-relaxed">{opt.text}</span>
                    </div>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                {!isAnswered ? (
                  <button
                    onClick={handleConfirmRetestAnswer}
                    disabled={!selectedLetter}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 disabled:opacity-40 text-xs transition"
                  >
                    Confirmar Gabarito do Reteste
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    {isCorrect ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Excelente! Avançou para o próximo ciclo de retenção!</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold">
                        <XCircle className="w-4 h-4 text-red-400" />
                        <span>Ainda com dúvidas. O ciclo de 24h foi reiniciado.</span>
                      </div>
                    )}

                    <button
                      onClick={handleCloseSession}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-700 transition"
                    >
                      Concluir Sessão
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Retest Items List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#0B132B] border border-slate-800 space-y-3">
            <FileQuestion className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-white">Nenhum item nesta fila</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Ao errar ou responder questões com dúvida no Banco de Questões, elas entram automaticamente na esteira adaptativa de reteste!
            </p>
            <button
              onClick={onNavigateToQuestions}
              className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs"
            >
              Resolver Questões Agora
            </button>
          </div>
        ) : (
          filteredItems.map((item) => {
            const originalQ = questions.find((q) => q.id === item.originalQuestionId);
            const discName = disciplines.find((d) => d.id === originalQ?.disciplineId)?.name;
            const stageInfo = stageLabels[item.currentStage];

            return (
              <div
                key={item.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#0B132B] border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${stageInfo.color}`}>
                      {stageInfo.label}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 text-[10px]">
                      {discName || 'Disciplina'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Tipo de Erro Inicial: <strong className="text-slate-200">{item.errorType}</strong>
                    </span>
                    {item.chosenDistractorRole && (
                      <span className="text-[10px] text-orange-400">
                        • Distrator: {item.chosenDistractorRole}
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs sm:text-sm font-semibold text-white line-clamp-2">
                    {originalQ?.statement || 'Questão do Banco'}
                  </h4>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      Agendado: {new Date(item.scheduledFor).toLocaleDateString('pt-BR')}
                    </span>
                    <span>•</span>
                    <span>Retestados: {item.timesRetested}x</span>
                    <span>•</span>
                    <span>Retenção: <strong className="text-amber-400">{item.retentionRate}%</strong></span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <button
                    onClick={() => handleStartRetest(item)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Iniciar Reteste</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
