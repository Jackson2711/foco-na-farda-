import React, { useState } from 'react';
import {
  Question,
  QuestionAnswerRecord,
  Discipline,
  Career,
  UserProfile,
  ConfidenceLevel,
  ErrorType,
  DistractorRole,
} from '../../types';
import { FocoDataEngineStore } from '../../services/store';
import { EstudosBanner } from '../common/SectionBanners';
import {
  explainWithAI,
  getMicroReviewWithAI,
  getDistractorDeepDiveWithAI,
} from '../../services/aiService';
import {
  FileQuestion,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Star,
  ChevronRight,
  Filter,
  BookmarkCheck,
  Send,
  Loader2,
  BookOpen,
  Award,
  Layers,
  HelpCircle,
  X,
  Brain,
  AlertTriangle,
  Repeat,
  Zap,
  Target,
  ShieldCheck,
} from 'lucide-react';

interface QuestionSolverProps {
  user: UserProfile;
  initialQuestionId?: string;
  onUpdateUser: (profile: UserProfile) => void;
}

export const QuestionSolver: React.FC<QuestionSolverProps> = ({
  user,
  initialQuestionId,
  onUpdateUser,
}) => {
  const allQuestions: Question[] = FocoDataEngineStore.getQuestions();
  const disciplines: Discipline[] = FocoDataEngineStore.getDisciplines();
  const careers: Career[] = FocoDataEngineStore.getCareers();

  // Filters
  const [selectedDisciplineId, setSelectedDisciplineId] = useState<string>('all');
  const [selectedCareerId, setSelectedCareerId] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'unanswered' | 'wrong'>('all');

  // Answers by user
  const userAnswers: QuestionAnswerRecord[] = FocoDataEngineStore.getQuestionAnswers(user.id);

  // Filtered pool
  const filteredQuestions = allQuestions.filter((q) => {
    if (selectedDisciplineId !== 'all' && q.disciplineId !== selectedDisciplineId) return false;
    if (selectedCareerId !== 'all' && q.careerId !== selectedCareerId) return false;
    if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;

    if (selectedStatusFilter === 'unanswered') {
      const answered = userAnswers.some((a) => a.questionId === q.id);
      if (answered) return false;
    } else if (selectedStatusFilter === 'wrong') {
      const hasWrong = userAnswers.some((a) => a.questionId === q.id && !a.isCorrect);
      if (!hasWrong) return false;
    }

    return true;
  });

  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    if (initialQuestionId) {
      const idx = filteredQuestions.findIndex((q) => q.id === initialQuestionId);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });

  const currentQuestion: Question | undefined = filteredQuestions[currentIndex] || filteredQuestions[0];

  // Current answering state
  const [selectedLetter, setSelectedLetter] = useState<'A' | 'B' | 'C' | 'D' | 'E' | null>(null);
  const [confidenceLevel, setConfidenceLevel] = useState<ConfidenceLevel>('Certeza');
  const [selectedErrorType, setSelectedErrorType] = useState<ErrorType>('Conceito');
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [isDunningKruger, setIsDunningKruger] = useState<boolean>(false);
  const [xpEarned, setXpEarned] = useState<number | null>(null);

  // Micro-review & Distractor modals
  const [showMicroReviewModal, setShowMicroReviewModal] = useState<boolean>(false);
  const [microReview, setMicroReview] = useState<string>('');
  const [microReviewLoading, setMicroReviewLoading] = useState<boolean>(false);

  const [showDistractorModal, setShowDistractorModal] = useState<boolean>(false);
  const [distractorDeepDive, setDistractorDeepDive] = useState<string>('');
  const [distractorDeepDiveLoading, setDistractorDeepDiveLoading] = useState<boolean>(false);
  const [targetDistractorLetter, setTargetDistractorLetter] = useState<string>('');

  // AI Modal State
  const [showAIModal, setShowAIModal] = useState<boolean>(false);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [aiPromptType, setAiPromptType] = useState<string>('beginner');
  const [customQuery, setCustomQuery] = useState<string>('');
  const [aiError, setAiError] = useState<string>('');

  // History for this specific question
  const thisQuestionAnswers = currentQuestion
    ? userAnswers.filter((a) => a.questionId === currentQuestion.id)
    : [];

  const handleSelectOption = (letter: 'A' | 'B' | 'C' | 'D' | 'E') => {
    if (isAnswered) return;
    setSelectedLetter(letter);
  };

  const handleConfirmAnswer = () => {
    if (!selectedLetter || !currentQuestion || isAnswered) return;

    const correct = selectedLetter === currentQuestion.correctOptionLetter;
    const dk = !correct && confidenceLevel === 'Certeza';

    // Find distractor role for selected option
    const distractorObj = currentQuestion.distractors?.find((d) => d.letter === selectedLetter);
    const chosenRole = distractorObj?.role;

    setIsCorrect(correct);
    setIsDunningKruger(dk);
    setIsAnswered(true);

    const result = FocoDataEngineStore.recordAnswer({
      userId: user.id,
      questionId: currentQuestion.id,
      selectedOptionLetter: selectedLetter,
      isCorrect: correct,
      confidenceLevel,
      errorType: correct ? undefined : selectedErrorType,
      chosenDistractorRole: chosenRole,
      timeSpentSeconds: 45,
    });

    setXpEarned(result.xpGained);
    onUpdateUser(result.userProfile);
  };

  const handleUpdateErrorType = (type: ErrorType) => {
    setSelectedErrorType(type);
    if (!currentQuestion) return;
    // Update last answer in store
    const answers = FocoDataEngineStore.getQuestionAnswers(user.id);
    const lastAns = answers[answers.length - 1];
    if (lastAns && lastAns.questionId === currentQuestion.id) {
      lastAns.errorType = type;
      // Also update adaptive retest if present
      const retests = FocoDataEngineStore.getAdaptiveRetests(user.id);
      const retest = retests.find((r) => r.originalQuestionId === currentQuestion.id);
      if (retest) {
        retest.errorType = type;
        FocoDataEngineStore.saveAdaptiveRetests(retests);
      }
    }
  };

  const handleTriggerMicroReview = async () => {
    if (!currentQuestion || !selectedLetter) return;
    setShowMicroReviewModal(true);
    setMicroReviewLoading(true);

    const wrongOpt = currentQuestion.options.find((o) => o.letter === selectedLetter);
    const rightOpt = currentQuestion.options.find(
      (o) => o.letter === currentQuestion.correctOptionLetter
    );
    const distractorObj = currentQuestion.distractors?.find((d) => d.letter === selectedLetter);

    try {
      const reply = await getMicroReviewWithAI({
        question: currentQuestion.statement,
        chosenOption: `${selectedLetter}) ${wrongOpt?.text || ''}`,
        correctOption: `${currentQuestion.correctOptionLetter}) ${rightOpt?.text || ''}`,
        errorType: selectedErrorType,
        distractorRole: distractorObj?.role,
        explanation: currentQuestion.explanation,
      });
      setMicroReview(reply);
    } catch {
      setMicroReview(
        '⚠️ Micro-revisão tática local: Atente-se à regra de ouro do dispositivo legal citado na fundamentação oficial para não reincidir neste distrator.'
      );
    } finally {
      setMicroReviewLoading(false);
    }
  };

  const handleTriggerDistractorDeepDive = async (letter: string) => {
    if (!currentQuestion) return;
    setTargetDistractorLetter(letter);
    setShowDistractorModal(true);
    setDistractorDeepDiveLoading(true);

    const opt = currentQuestion.options.find((o) => o.letter === letter);
    const rightOpt = currentQuestion.options.find(
      (o) => o.letter === currentQuestion.correctOptionLetter
    );
    const distractorObj = currentQuestion.distractors?.find((d) => d.letter === letter);

    try {
      const reply = await getDistractorDeepDiveWithAI({
        question: currentQuestion.statement,
        chosenOptionText: `${letter}) ${opt?.text || ''}`,
        correctOptionText: `${currentQuestion.correctOptionLetter}) ${rightOpt?.text || ''}`,
        distractorType: distractorObj?.roleDescription || distractorObj?.role,
      });
      setDistractorDeepDive(reply);
    } catch {
      setDistractorDeepDive(
        distractorObj?.trapExplanation ||
          'Este distrator foi desenhado pela banca para induzir o candidato ao erro através de inversão de regra ou prazo sutil.'
      );
    } finally {
      setDistractorDeepDiveLoading(false);
    }
  };

  const handleNextQuestion = () => {
    setSelectedLetter(null);
    setConfidenceLevel('Certeza');
    setSelectedErrorType('Conceito');
    setIsAnswered(false);
    setIsCorrect(false);
    setIsDunningKruger(false);
    setXpEarned(null);
    setShowAIModal(false);
    setShowMicroReviewModal(false);
    setShowDistractorModal(false);
    setAiResponse('');
    setAiError('');

    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleScheduleReview = () => {
    if (!currentQuestion) return;
    FocoDataEngineStore.scheduleReview(user.id, currentQuestion.id, 1);
    alert('Questão adicionada ao seu cronograma de Revisões de Hoje (24 horas)!');
  };

  const handleToggleFavorite = () => {
    if (!currentQuestion) return;
    FocoDataEngineStore.toggleFavorite(user.id, 'question', currentQuestion.id);
  };

  const isFav = currentQuestion
    ? FocoDataEngineStore.isFavorite(user.id, 'question', currentQuestion.id)
    : false;

  // AI Explanation Handler
  const handleTriggerAI = async (type: 'beginner' | 'tactical' | 'summary' | 'why_wrong' | 'flashcards' | 'custom') => {
    if (!currentQuestion) return;
    setAiPromptType(type);
    setShowAIModal(true);
    setAiLoading(true);
    setAiError('');

    try {
      const reply = await explainWithAI({
        question: currentQuestion.statement,
        options: currentQuestion.options.map((o) => ({ letter: o.letter, text: o.text })),
        correctAnswer: currentQuestion.correctOptionLetter,
        explanation: currentQuestion.explanation,
        promptType: type,
        selectedOption: selectedLetter || undefined,
        customQuery: type === 'custom' ? customQuery : undefined,
      });
      setAiResponse(reply);
    } catch (err: any) {
      setAiError(err?.message || 'Falha ao comunicar com o tutor de IA.');
    } finally {
      setAiLoading(false);
    }
  };

  if (!currentQuestion) {
    return (
      <div className="p-12 text-center rounded-2xl bg-[#0B132B] border border-slate-800 space-y-4">
        <FileQuestion className="w-12 h-12 text-slate-600 mx-auto" />
        <h3 className="text-lg font-bold text-white">Nenhuma questão encontrada</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Tente alterar os filtros de disciplina ou status para ver outras questões.
        </p>
        <button
          onClick={() => {
            setSelectedDisciplineId('all');
            setSelectedCareerId('all');
            setSelectedDifficulty('all');
            setSelectedStatusFilter('all');
          }}
          className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs"
        >
          Limpar todos os filtros
        </button>
      </div>
    );
  }

  const discipline = disciplines.find((d) => d.id === currentQuestion.disciplineId);

  return (
    <div className="space-y-6">
      {/* Banner Informativo: ESTUDOS */}
      <EstudosBanner />

      {/* Header & Question Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-tactical font-black text-white uppercase tracking-wider flex items-center gap-2.5">
            <FileQuestion className="w-6 h-6 text-amber-400" />
            Banco Nacional de Questões
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Resolução comentada, filtros por banca policial e tutoria inteligente com IA.
          </p>
        </div>

        {/* Counter and Navigation */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono-code font-bold px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-amber-400">
            Questão {currentIndex + 1} de {filteredQuestions.length}
          </span>
          <button
            onClick={handleNextQuestion}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
          >
            <span>Próxima</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-3.5 rounded-2xl bg-[#0B132B] border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
            Disciplina
          </label>
          <select
            value={selectedDisciplineId}
            onChange={(e) => {
              setSelectedDisciplineId(e.target.value);
              setCurrentIndex(0);
            }}
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
          >
            <option value="all">Todas as Disciplinas</option>
            {disciplines.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
            Carreira
          </label>
          <select
            value={selectedCareerId}
            onChange={(e) => {
              setSelectedCareerId(e.target.value);
              setCurrentIndex(0);
            }}
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
          >
            <option value="all">Todas as Carreiras</option>
            {careers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
            Dificuldade
          </label>
          <select
            value={selectedDifficulty}
            onChange={(e) => {
              setSelectedDifficulty(e.target.value);
              setCurrentIndex(0);
            }}
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
          >
            <option value="all">Todas as Dificuldades</option>
            <option value="Fácil">Fácil</option>
            <option value="Médio">Médio</option>
            <option value="Difícil">Difícil</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
            Meu Histórico
          </label>
          <select
            value={selectedStatusFilter}
            onChange={(e) => {
              setSelectedStatusFilter(e.target.value as any);
              setCurrentIndex(0);
            }}
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
          >
            <option value="all">Todas</option>
            <option value="unanswered">Apenas Não Respondidas</option>
            <option value="wrong">Apenas que já Errei</option>
          </select>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="rounded-2xl bg-[#0B132B] border border-slate-800 p-5 sm:p-7 shadow-xl space-y-6">
        {/* Meta badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400 font-mono-code font-bold text-xs border border-amber-500/30">
              #{currentQuestion.codeNumber}
            </span>

            {/* Question Type Badge: OFICIAL, AUTORAL, GERADA POR IA */}
            {currentQuestion.questionType === 'GERADA POR IA' || currentQuestion.isAdaptiveVariant ? (
              <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-bold text-[11px] border border-purple-500/40 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-400" />
                GERADA POR IA
              </span>
            ) : currentQuestion.questionType === 'AUTORAL' ? (
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold text-[11px] border border-amber-500/40">
                AUTORAL
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-[11px] border border-emerald-500/40 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                OFICIAL
              </span>
            )}

            <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-slate-300 font-semibold text-xs border border-slate-800">
              {discipline?.name || 'Disciplina'}
            </span>
            {currentQuestion.topic && (
              <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-slate-400 text-xs hidden sm:inline">
                {currentQuestion.topic}
              </span>
            )}
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono-code text-[11px]">
              {currentQuestion.examiningBoard} • {currentQuestion.year}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Favorite button */}
            <button
              onClick={handleToggleFavorite}
              className={`p-2 rounded-lg border transition ${
                isFav
                  ? 'bg-amber-500/20 border-amber-400 text-amber-400'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Salvar questão nos Favoritos"
            >
              <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400' : ''}`} />
            </button>

            {/* Schedule review button */}
            <button
              onClick={handleScheduleReview}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 transition"
              title="Agendar para Revisões de Hoje (24h)"
            >
              <BookmarkCheck className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Statement / Enunciado */}
        <div className="text-sm sm:text-base text-slate-100 font-normal leading-relaxed whitespace-pre-line">
          {currentQuestion.statement}
        </div>

        {/* Nível de Confiança ao Responder (Psicometria Educacional) */}
        {!isAnswered && (
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-amber-400" />
              Nível de Confiança nesta Questão:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setConfidenceLevel('Certeza')}
                className={`px-3 py-2 rounded-lg border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  confidenceLevel === 'Certeza'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 ring-1 ring-emerald-400'
                    : 'bg-slate-800/70 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <span>🟢</span>
                <span>Certeza Absoluta</span>
              </button>
              <button
                type="button"
                onClick={() => setConfidenceLevel('Duvida')}
                className={`px-3 py-2 rounded-lg border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  confidenceLevel === 'Duvida'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-1 ring-amber-400'
                    : 'bg-slate-800/70 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <span>🟡</span>
                <span>Dúvida (50/50)</span>
              </button>
              <button
                type="button"
                onClick={() => setConfidenceLevel('Chute')}
                className={`px-3 py-2 rounded-lg border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  confidenceLevel === 'Chute'
                    ? 'bg-purple-500/20 border-purple-400 text-purple-300 ring-1 ring-purple-400'
                    : 'bg-slate-800/70 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <span>🔴</span>
                <span>Chute</span>
              </button>
            </div>
          </div>
        )}

        {/* Options List */}
        <div className="space-y-2.5 pt-2">
          {currentQuestion.options.map((opt) => {
            const isSelected = selectedLetter === opt.letter;
            const distractorInfo = currentQuestion.distractors?.find((d) => d.letter === opt.letter);
            let optionStyles = 'bg-slate-900/80 border-slate-800 text-slate-200 hover:border-slate-700';

            if (!isAnswered) {
              if (isSelected) {
                optionStyles = 'bg-amber-500/20 border-amber-400 text-white ring-1 ring-amber-400';
              }
            } else {
              if (opt.letter === currentQuestion.correctOptionLetter) {
                optionStyles = 'bg-emerald-500/20 border-emerald-400 text-white ring-1 ring-emerald-400';
              } else if (isSelected && !isCorrect) {
                optionStyles = 'bg-red-500/20 border-red-500 text-white ring-1 ring-red-500';
              } else {
                optionStyles = 'bg-slate-900/40 border-slate-900 text-slate-500 opacity-60';
              }
            }

            return (
              <div
                key={opt.id}
                onClick={() => handleSelectOption(opt.letter)}
                className={`p-3.5 rounded-xl border text-xs sm:text-sm font-medium cursor-pointer transition flex flex-col gap-2 ${optionStyles}`}
              >
                <div className="flex items-start gap-3 w-full">
                  <span
                    className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center font-tactical font-black text-xs ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {opt.letter}
                  </span>
                  <span className="mt-0.5 leading-relaxed flex-1">{opt.text}</span>
                </div>

                {/* Distractor Analysis Pill (Shown after answering) */}
                {isAnswered && distractorInfo && (
                  <div className="mt-1 pt-1.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded font-mono-code text-[10px] font-bold ${
                        opt.letter === currentQuestion.correctOptionLetter
                          ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {opt.letter === currentQuestion.correctOptionLetter ? 'Gabarito Oficial' : `Distrator: ${distractorInfo.role}`}
                      </span>
                      <span className="text-slate-400 text-[11px] italic">
                        {distractorInfo.roleDescription}
                      </span>
                    </div>

                    {opt.letter !== currentQuestion.correctOptionLetter && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTriggerDistractorDeepDive(opt.letter);
                        }}
                        className="text-[10px] text-amber-400 hover:text-amber-300 underline font-semibold"
                      >
                        Ver armadilha da banca →
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Dunning-Kruger Warning Banner (Erro com Certeza) */}
        {isAnswered && isDunningKruger && (
          <div className="p-4 rounded-xl bg-amber-500/15 border border-amber-500/50 space-y-2 animate-fade-in">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>ALERTA DE PONTO CEGO CRÍTICO (Efeito Dunning-Kruger)</span>
            </div>
            <p className="text-xs text-amber-200/90 leading-relaxed">
              Você marcou esta alternativa com <strong>Certeza Absoluta</strong>, mas o gabarito oficial é outro! Isso revela uma falsa segurança em uma regra ou prazo.
              Esta questão foi inserida imediatamente no seu <strong>Ciclo de Reteste Adaptativo</strong>.
            </p>
          </div>
        )}

        {/* Error Classification Selector (Se errou a questão) */}
        {isAnswered && !isCorrect && (
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-amber-400" />
                Por que você errou esta questão? (Classificação Psicométrica):
              </span>
              <span className="text-[10px] text-slate-400">Ajuda a calibrar seu plano de estudos</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {(
                [
                  { id: 'Conceito', label: '🧠 Conceito', desc: 'Lacuna teórica' },
                  { id: 'Interpretacao_Pegadinha', label: '🎯 Pegadinha', desc: 'Distrator da banca' },
                  { id: 'Atencao_Leitura', label: '⚡ Atenção', desc: 'Leu rápido / Exceto' },
                  { id: 'Memorizacao', label: '📚 Memorização', desc: 'Esqueceu prazo/pena' },
                  { id: 'Chute', label: '🎲 Chute', desc: 'Sem certeza' },
                ] as const
              ).map((err) => (
                <button
                  key={err.id}
                  type="button"
                  onClick={() => handleUpdateErrorType(err.id)}
                  className={`p-2 rounded-lg border text-center transition ${
                    selectedErrorType === err.id
                      ? 'bg-amber-500/25 border-amber-400 text-white font-bold ring-1 ring-amber-400'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <div className="text-xs">{err.label}</div>
                  <div className="text-[9px] text-slate-400">{err.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action bar (Responder, Status, Explicar com IA) */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            {!isAnswered ? (
              <button
                onClick={handleConfirmAnswer}
                disabled={!selectedLetter}
                className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20"
              >
                Confirmar Resposta
              </button>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                {isCorrect ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>CORRETO! +{xpEarned} XP</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold animate-fade-in">
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span>INCORRETO (Gabarito: {currentQuestion.correctOptionLetter})</span>
                  </div>
                )}

                {/* Botão de Micro-Revisão Imediata via IA */}
                {!isCorrect && (
                  <button
                    onClick={handleTriggerMicroReview}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-400 text-amber-300 hover:bg-amber-500/30 text-xs font-bold transition"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Micro-Revisão Imediata</span>
                  </button>
                )}

                {/* Próxima Questão */}
                <button
                  onClick={handleNextQuestion}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 text-xs transition"
                >
                  <span>Próxima Questão</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* AI Assistant Trigger Button (Section 20 requirement) */}
            <button
              onClick={() => handleTriggerAI('beginner')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-bold transition shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Explicar com IA</span>
            </button>
          </div>

          {/* User History on this question */}
          <div className="text-[11px] text-slate-400">
            Você já respondeu esta questão:{' '}
            <strong className="text-white">{thisQuestionAnswers.length} vezes</strong>
          </div>
        </div>

        {/* Detailed Official Explanation Box (shown after answer) */}
        {isAnswered && (
          <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 animate-fade-in">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              Comentário Oficial do Professor:
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentQuestion.explanation}
            </p>
            <div className="text-[10px] text-slate-500 pt-1">
              Base normativa / Fonte: {currentQuestion.source}
            </div>
          </div>
        )}
      </div>

      {/* AI Assistant Tactical Modal (Section 20 implementation) */}
      {showAIModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-[#0D1829] border border-amber-500/40 p-6 shadow-2xl text-slate-100 relative space-y-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Tutor Tático de Inteligência Artificial
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Mentoria direcionada para carreiras de segurança pública
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAIModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Mode Selector Buttons (Section 20 options) */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleTriggerAI('beginner')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  aiPromptType === 'beginner'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                Iniciante
              </button>

              <button
                onClick={() => handleTriggerAI('tactical')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  aiPromptType === 'tactical'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                Visão Tática / Pegadinhas
              </button>

              <button
                onClick={() => handleTriggerAI('summary')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  aiPromptType === 'summary'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                Resumo & Mnemônico
              </button>

              <button
                onClick={() => handleTriggerAI('flashcards')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  aiPromptType === 'flashcards'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                Gerar Flashcards
              </button>

              {isAnswered && !isCorrect && (
                <button
                  onClick={() => handleTriggerAI('why_wrong')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    aiPromptType === 'why_wrong'
                      ? 'bg-red-500 text-white'
                      : 'bg-red-500/20 border border-red-500/40 text-red-300 hover:text-white'
                  }`}
                >
                  Por que errei?
                </button>
              )}
            </div>

            {/* AI Content Area */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 min-h-[200px] max-h-[380px] overflow-y-auto text-xs text-slate-200 leading-relaxed whitespace-pre-line">
              {aiLoading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-3 text-slate-400">
                  <Loader2 className="w-7 h-7 text-amber-400 animate-spin" />
                  <p className="font-semibold text-xs">
                    O Mentor Tático de IA está analisando a legislação e preparando sua explicação...
                  </p>
                </div>
              ) : aiError ? (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                  {aiError}
                </div>
              ) : aiResponse ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-amber-400 font-mono-code pb-1 border-b border-slate-800">
                    <span>EXPLICAÇÃO TÁTICA PERSONALIZADA</span>
                    <span>MODELO: GEMINI 3.8 FLASH</span>
                  </div>
                  <div>{aiResponse}</div>
                </div>
              ) : (
                <p className="text-slate-500 text-center py-8">
                  Selecione um dos modos acima para que a inteligência artificial explique este tema.
                </p>
              )}
            </div>

            {/* Custom Question input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Fazer uma pergunta específica sobre esta questão para a IA..."
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && customQuery.trim()) {
                    handleTriggerAI('custom');
                  }
                }}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400"
              />
              <button
                onClick={() => {
                  if (customQuery.trim()) handleTriggerAI('custom');
                }}
                disabled={!customQuery.trim() || aiLoading}
                className="px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 disabled:opacity-40 text-xs transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Micro-Revisão Imediata (Cirúrgica para o Erro do Candidato) */}
      {showMicroReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-[#0D1829] border border-amber-500/50 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Micro-Revisão Tática Imediata</h3>
                  <p className="text-[11px] text-amber-400">Focada no seu Ponto Cego</p>
                </div>
              </div>
              <button
                onClick={() => setShowMicroReviewModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 min-h-[140px] text-xs text-slate-200 leading-relaxed whitespace-pre-line">
              {microReviewLoading ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-2 text-slate-400">
                  <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
                  <p className="text-xs font-semibold">Sintetizando a regra de ouro com a IA...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-[10px] text-amber-400 font-mono-code uppercase">
                    Diagnóstico Imediato • Reteste Adaptativo Agendado
                  </div>
                  <div className="text-slate-200 text-xs sm:text-sm font-normal leading-relaxed">
                    {microReview}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                Esta questão reaparecerá no seu <strong>Reteste Adaptativo (24h)</strong>.
              </span>
              <button
                onClick={() => setShowMicroReviewModal(false)}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Análise de Distrator Específico */}
      {showDistractorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-[#0D1829] border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Análise da Armadilha da Banca</h3>
                  <p className="text-[11px] text-slate-400">
                    Alternativa ({targetDistractorLetter}) • Como a banca montou essa armadilha
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDistractorModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 min-h-[140px] text-xs text-slate-200 leading-relaxed whitespace-pre-line">
              {distractorDeepDiveLoading ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-2 text-slate-400">
                  <Loader2 className="w-6 h-6 text-orange-400 animate-spin" />
                  <p className="text-xs font-semibold">Dissecando a técnica do examinador com a IA...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-[10px] text-orange-400 font-mono-code uppercase">
                    Engenharia Reversa do Distrator • {currentQuestion.examiningBoard}
                  </div>
                  <div className="text-slate-200 text-xs sm:text-sm font-normal leading-relaxed">
                    {distractorDeepDive}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowDistractorModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-700 transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
