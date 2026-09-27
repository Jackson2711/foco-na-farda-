import React, { useState, useEffect, useRef } from 'react';
import {
  UserProfile,
  Contest,
  Career,
  Position,
  Discipline,
  Topic,
  State,
  Question,
  SimulationResult,
} from '../../types';
import { FocoDataEngineStore } from '../../services/store';
import { SimuladosBanner } from '../common/SectionBanners';
import { soundService } from '../../services/soundService';
import { generateSimulationQuestions } from '../../services/aiService';
import {
  FileText,
  Award,
  Clock,
  Play,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  ChevronRight,
  Filter,
  AlertTriangle,
  Flame,
  Share2,
  Bell,
  BellOff,
  Sparkles,
  Loader2,
  BookOpen,
  Target,
  Shield,
  Layers,
  MapPin,
  Building2,
  Compass,
} from 'lucide-react';

interface SimulationsViewProps {
  user: UserProfile;
  onUpdateUser: (profile: UserProfile) => void;
}

export const SimulationsView: React.FC<SimulationsViewProps> = ({
  user,
  onUpdateUser,
}) => {
  const allQuestions = FocoDataEngineStore.getQuestions();
  const disciplines = FocoDataEngineStore.getDisciplines();
  const careers = FocoDataEngineStore.getCareers();
  const contests = FocoDataEngineStore.getContests();
  const states = FocoDataEngineStore.getStates();
  const positions = FocoDataEngineStore.getPositions();

  // Mode: 'list' | 'taking' | 'result'
  const [mode, setMode] = useState<'list' | 'taking' | 'result'>('list');

  // =========================================================================
  // HIERARQUIA DE CONTEXTO DO SIMULADO:
  // CONCURSO -> CARGO -> ÓRGÃO -> LOCALIDADE -> DISCIPLINA -> TÓPICO -> QUANTIDADE -> DIFICULDADE
  // =========================================================================
  const [selectedCareerId, setSelectedCareerId] = useState<string>('car-pm');
  const [selectedContestId, setSelectedContestId] = useState<string>('cnt-pmce-2025');
  const [selectedPositionId, setSelectedPositionId] = useState<string>('pos-pm-soldado');
  const [selectedStateId, setSelectedStateId] = useState<string>('st-ce');
  const [selectedDisciplineId, setSelectedDisciplineId] = useState<string>('disc-const');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('top-cf-direitos-fundamentais');
  const [selectedBoard, setSelectedBoard] = useState<string>('Cebraspe');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Fácil' | 'Média' | 'Difícil'>('Média');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [durationMinutes, setDurationMinutes] = useState<number>(25);

  // Alarme Sonoro State (Persistido no localStorage)
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => soundService.isAlarmEnabled());
  const [timeExpiredAlert, setTimeExpiredAlert] = useState<boolean>(false);
  const alarmFiredRef = useRef<boolean>(false);

  // AI Generation State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string>('');

  // Active Simulation State
  const [simQuestions, setSimQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D' | 'E'>>({});
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [completedResult, setCompletedResult] = useState<SimulationResult | null>(null);

  // History of simulations taken by user
  const userSimulations = FocoDataEngineStore.getSimulations(user.id);

  // Available topics for selected discipline
  const availableTopics = FocoDataEngineStore.getTopics(selectedDisciplineId);

  // Available positions for selected career
  const availablePositions = positions.filter((p) => p.careerId === selectedCareerId);

  // Available contests for selected career and state
  const availableContests = contests.filter((c) => {
    if (selectedCareerId && c.careerId !== selectedCareerId) return false;
    if (selectedStateId && selectedStateId !== 'all' && c.stateId !== selectedStateId && c.stateId !== 'st-br') return false;
    return true;
  });

  // Toggle do som do alarme
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundService.setAlarmEnabled(next);
    if (next) {
      soundService.playAlarmSound();
    }
  };

  // Recalcula tempo recomendado ao mudar quantidade
  useEffect(() => {
    // 2.5 minutos por questão (padrão oficial de concursos de segurança pública)
    setDurationMinutes(Math.max(10, Math.round(questionCount * 2.5)));
  }, [questionCount]);

  // Atualiza tópicos disponíveis quando a disciplina muda
  useEffect(() => {
    const topics = FocoDataEngineStore.getTopics(selectedDisciplineId);
    if (topics.length > 0) {
      // Se tiver um tópico pré-selecionado válido, mantém; senão usa o primeiro
      const exists = topics.some((t) => t.id === selectedTopicId);
      if (!exists) {
        setSelectedTopicId(topics[0].id);
      }
    } else {
      setSelectedTopicId('geral');
    }
  }, [selectedDisciplineId]);

  // Timer countdown com disparo do alarme sonoro exatamente em 00:00 (sem repetições)
  useEffect(() => {
    if (mode !== 'taking') return;

    if (secondsRemaining <= 0) {
      // Dispara alarme sonoro uma única vez se habilitado
      if (!alarmFiredRef.current) {
        alarmFiredRef.current = true;
        soundService.playAlarmSound();
      }
      setTimeExpiredAlert(true);
      handleFinishSimulation();
      return;
    }

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [mode, secondsRemaining]);

  // Resgata entidades selecionadas para o resumo contextual obrigatório
  const currentCareer = careers.find((c) => c.id === selectedCareerId);
  const currentContest = contests.find((c) => c.id === selectedContestId);
  const currentPosition = positions.find((p) => p.id === selectedPositionId);
  const currentState = states.find((s) => s.id === selectedStateId);
  const currentDiscipline = disciplines.find((d) => d.id === selectedDisciplineId);
  const currentTopic = availableTopics.find((t) => t.id === selectedTopicId);

  // Nomes canônicos formatados
  const contextSummary = {
    concurso: currentCareer?.name || 'Polícia Militar',
    cargo: currentPosition?.name || (selectedCareerId === 'car-pm' ? 'Soldado' : 'Agente'),
    localidade: currentState?.name || (selectedStateId === 'st-ce' ? 'Ceará' : 'Brasil'),
    disciplina: currentDiscipline?.name || 'Direito Constitucional',
    topico: currentTopic?.name || (selectedTopicId === 'top-cf-direitos-fundamentais' ? 'Direitos e Garantias Fundamentais' : 'Conteúdo Geral'),
    banca: selectedBoard,
    dificuldade: selectedDifficulty,
    quantidade: questionCount,
  };

  const editalInfo = currentContest ? {
    title: currentContest.title,
    banca: currentContest.examiningBoard,
    situacao: currentContest.situation,
    requisitos: currentContest.requirements,
    observacoes: currentContest.observations,
    fases: currentContest.phases?.map((p) => p.name).join(', '),
  } : undefined;

  // Iniciar Simulado Tático com Validação Estrita de Contexto
  const handleStartSimulation = async () => {
    soundService.unlockAudio();
    alarmFiredRef.current = false;
    setIsGenerating(true);
    setGenerationError('');
    setTimeExpiredAlert(false);

    try {
      // 1. Tenta gerar via IA no backend com o contexto estrito solicitado
      const aiResult = await generateSimulationQuestions({
        contestTitle: contextSummary.concurso,
        careerName: currentCareer?.name || 'Polícia Militar',
        positionName: contextSummary.cargo,
        organizationName: currentContest?.sourceName || 'Polícia Militar do Estado do Ceará (PMCE)',
        locationState: currentState?.name || 'Ceará',
        disciplineName: contextSummary.disciplina,
        topicName: contextSummary.topico,
        examiningBoard: selectedBoard,
        difficulty: selectedDifficulty,
        quantity: questionCount,
        editalInfo,
      });

      if (aiResult.questions && aiResult.questions.length > 0) {
        setSimQuestions(aiResult.questions);
        setCurrentIdx(0);
        setAnswers({});
        setSecondsRemaining(durationMinutes * 60);
        setMode('taking');
        setIsGenerating(false);
        return;
      }
    } catch (aiErr: any) {
      console.warn('Falha na geração via IA do simulado:', aiErr);
    }

    // 2. Fallback Seguro: Se IA falhar, busca no banco local EXCLUSIVAMENTE pelo tópico e disciplina
    const filteredLocal = FocoDataEngineStore.getQuestionsFiltered({
      careerId: selectedCareerId,
      disciplineId: selectedDisciplineId,
      topic: contextSummary.topico,
      difficulty: selectedDifficulty === 'Média' ? 'Médio' : selectedDifficulty,
      examiningBoard: selectedBoard,
    });

    if (filteredLocal.length >= 3) {
      // Utiliza apenas questões que realmente pertencem ao contexto solicitado
      const shuffled = [...filteredLocal].sort(() => 0.5 - Math.random()).slice(0, questionCount);
      setSimQuestions(shuffled);
      setCurrentIdx(0);
      setAnswers({});
      setSecondsRemaining(durationMinutes * 60);
      setMode('taking');
      setIsGenerating(false);
      return;
    }

    // 3. Caso não haja questões específicas para esse tópico: Notifica com transparência (não gera off-topic genérico)
    setIsGenerating(false);
    setGenerationError(
      `Não foi possível gerar questões estritamente sobre "${contextSummary.topico}" no momento. Por favor, verifique sua conexão ou tente gerar novamente.`
    );
  };

  // Finalizar Simulado e Calcular Rendimento
  const handleFinishSimulation = () => {
    let correctCount = 0;
    const breakdownMap: Record<string, { total: number; correct: number }> = {};

    simQuestions.forEach((q, idx) => {
      const selected = answers[idx];
      const isCorrect = selected === q.correctOptionLetter;
      if (isCorrect) correctCount++;

      // Breakdown por disciplina
      const disc = disciplines.find((d) => d.id === q.disciplineId)?.name || q.disciplineId || 'Geral';
      if (!breakdownMap[disc]) {
        breakdownMap[disc] = { total: 0, correct: 0 };
      }
      breakdownMap[disc].total++;
      if (isCorrect) breakdownMap[disc].correct++;

      // Registra resposta individual no perfil
      if (selected) {
        FocoDataEngineStore.recordAnswer({
          userId: user.id,
          questionId: q.id,
          selectedOptionLetter: selected,
          isCorrect,
          timeSpentSeconds: 45,
        });
      }
    });

    const scorePct = simQuestions.length > 0 ? Math.round((correctCount / simQuestions.length) * 100) : 0;
    const timeSpent = Math.max(0, durationMinutes * 60 - secondsRemaining);

    const breakdownList = Object.entries(breakdownMap).map(([disciplineName, stat]) => ({
      disciplineName,
      total: stat.total,
      correct: stat.correct,
    }));

    const recordOutput = FocoDataEngineStore.recordSimulation({
      userId: user.id,
      title: `Simulado: ${contextSummary.disciplina} (${contextSummary.topico})`,
      totalQuestions: simQuestions.length,
      correctCount,
      wrongCount: simQuestions.length - correctCount,
      scorePercentage: scorePct,
      timeSpentSeconds: timeSpent,
      completedAt: new Date().toISOString(),
      breakdownByDiscipline: breakdownList,
    });

    setCompletedResult(recordOutput.result);
    setMode('result');
    onUpdateUser(FocoDataEngineStore.getUserProfile()!);
  };

  const formatTimer = (totalSeconds: number) => {
    const safeSecs = Math.max(0, totalSeconds);
    const mins = Math.floor(safeSecs / 60);
    const secs = safeSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Banner Informativo: SIMULADOS */}
      {mode === 'list' && <SimuladosBanner />}

      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-tactical font-black text-white uppercase tracking-wider flex items-center gap-2.5">
            <Award className="w-6 h-6 text-amber-400" />
            Simulados Táticos & Calibração de Prova
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Simulação de prova real com aderência rigorosa ao edital, cronômetro oficial e alarme sonoro.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          {/* Som do Alarme Toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition shadow-sm ${
              soundEnabled
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
            title="Alternar som do alarme quando o cronômetro chegar a 00:00"
          >
            {soundEnabled ? (
              <Bell className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <BellOff className="w-3.5 h-3.5 text-slate-500" />
            )}
            <span>Som do alarme: {soundEnabled ? 'Ativado' : 'Desativado'}</span>
          </button>

          {mode !== 'list' && (
            <button
              onClick={() => {
                if (mode === 'taking' && !window.confirm('Deseja realmente sair do simulado em andamento?')) {
                  return;
                }
                setMode('list');
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-semibold hover:text-white"
            >
              Menu de Simulados
            </button>
          )}
        </div>
      </div>

      {/* Alerta Visual de Tempo Esgotado */}
      {timeExpiredAlert && (
        <div className="p-4 rounded-2xl bg-red-500/20 border-2 border-red-500 text-white text-xs font-bold flex items-center justify-between gap-3 animate-bounce">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-red-400 shrink-0" />
            <div>
              <span className="text-sm font-black uppercase tracking-wider block">
                ⏰ TEMPO ESGOTADO!
              </span>
              <span className="text-red-200 font-normal">
                O tempo de prova chegou a 00:00. Suas respostas foram computadas e seu gabarito foi gerado.
              </span>
            </div>
          </div>
          <button
            onClick={() => setTimeExpiredAlert(false)}
            className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-bold"
          >
            Entendido
          </button>
        </div>
      )}

      {/* Mode: List / Configurator */}
      {mode === 'list' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Simulation Creator Card */}
          <div className="lg:col-span-7 rounded-2xl bg-[#0B132B] border border-slate-800 p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-sm font-tactical font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-400" />
                Configurar Simulado Tático
              </span>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                GERAÇÃO POR CONTEXTO REAL
              </span>
            </div>

            {generationError && (
              <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold text-white">Falha na Geração Contextual</p>
                  <p className="mt-0.5 leading-relaxed">{generationError}</p>
                </div>
              </div>
            )}

            {/* Hierarquia de Configuração */}
            <div className="space-y-4">
              {/* 1. Concurso & Carreira */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Concurso / Carreira:
                  </label>
                  <select
                    value={selectedCareerId}
                    onChange={(e) => {
                      setSelectedCareerId(e.target.value);
                      const matchingPos = positions.find((p) => p.careerId === e.target.value);
                      if (matchingPos) setSelectedPositionId(matchingPos.id);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                  >
                    {careers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Cargo */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Cargo:
                  </label>
                  <select
                    value={selectedPositionId}
                    onChange={(e) => setSelectedPositionId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                  >
                    {availablePositions.length > 0 ? (
                      availablePositions.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="pos-soldado">Soldado</option>
                        <option value="pos-agente">Agente</option>
                        <option value="pos-oficial">Oficial</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* 3. Localidade / Estado */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Localidade / Estado:
                  </label>
                  <select
                    value={selectedStateId}
                    onChange={(e) => setSelectedStateId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="all">Todas as Regiões (Nacional)</option>
                    {states.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name} ({st.code})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. Banca Examinadora */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Banca Examinadora de Referência:
                  </label>
                  <select
                    value={selectedBoard}
                    onChange={(e) => setSelectedBoard(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="Cebraspe">Cebraspe (Cespe)</option>
                    <option value="Fundação Vunesp">Fundação Vunesp</option>
                    <option value="FGV Conhecimento">FGV Conhecimento</option>
                    <option value="FCC">FCC (Carlos Chagas)</option>
                    <option value="IDECAN">IDECAN</option>
                    <option value="Instituto AOCP">Instituto AOCP</option>
                    <option value="IBFC">IBFC</option>
                    <option value="Consulplan">Consulplan</option>
                  </select>
                </div>
              </div>

              {/* 5. Disciplina */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Disciplina Selecionada:
                </label>
                <select
                  value={selectedDisciplineId}
                  onChange={(e) => setSelectedDisciplineId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                >
                  {disciplines.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 6. TÓPICO ESPECÍFICO (PRIORIDADE ABSOLUTA) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-amber-400">
                    Tópico Específico (Prioridade Absoluta):
                  </label>
                  <span className="text-[10px] text-slate-400">
                    Filtro estrito de cobrança
                  </span>
                </div>
                <select
                  value={selectedTopicId}
                  onChange={(e) => setSelectedTopicId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-amber-500/40 text-amber-200 text-xs focus:outline-none focus:border-amber-400"
                >
                  {availableTopics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                  <option value="top-geral">Conteúdo Programático Geral da Disciplina</option>
                </select>
              </div>

              {/* 7. Dificuldade & Quantidade */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Nível de Dificuldade:
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['Fácil', 'Média', 'Difícil'] as const).map((dif) => (
                      <button
                        key={dif}
                        type="button"
                        onClick={() => setSelectedDifficulty(dif)}
                        className={`py-1.5 px-2 rounded-lg border text-xs font-bold transition text-center ${
                          selectedDifficulty === dif
                            ? 'bg-amber-500 text-slate-950 border-amber-400'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {dif}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Quantidade de Questões:
                  </label>
                  <select
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value={5}>5 questões (Express - 12 min)</option>
                    <option value={10}>10 questões (Rápido - 25 min)</option>
                    <option value={15}>15 questões (Tático - 37 min)</option>
                    <option value={20}>20 questões (Padrão - 50 min)</option>
                    <option value={30}>30 questões (Intensivo - 75 min)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* RESUMO OBRIGATÓRIO: SEU SIMULADO */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                <span className="text-xs font-tactical font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  SEU SIMULADO (CONFIRMAÇÃO DE CONTEXTO)
                </span>
                <span className="text-[10px] font-mono-code text-slate-400">
                  {durationMinutes} MIN TEMPO DE PROVA
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                <div>
                  <span className="text-slate-500 text-[10px] block">Concurso:</span>
                  <span className="font-semibold text-white truncate block">{contextSummary.concurso}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Cargo:</span>
                  <span className="font-semibold text-white truncate block">{contextSummary.cargo}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Localidade:</span>
                  <span className="font-semibold text-slate-200 truncate block">{contextSummary.localidade}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Banca:</span>
                  <span className="font-semibold text-amber-300 truncate block">{contextSummary.banca}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 text-[10px] block">Disciplina:</span>
                  <span className="font-semibold text-white truncate block">{contextSummary.disciplina}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-amber-400 text-[10px] block font-bold">Tópico Selecionado:</span>
                  <span className="font-bold text-amber-300 truncate block">{contextSummary.topico}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Quantidade:</span>
                  <span className="font-bold text-white">{contextSummary.quantidade} questões</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Dificuldade:</span>
                  <span className="font-bold text-amber-400">{contextSummary.dificuldade}</span>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStartSimulation}
              disabled={isGenerating}
              className="w-full py-3.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider hover:bg-amber-400 transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>GERANDO & VALIDANDO QUESTÕES DO TÓPICO...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>INICIAR SIMULADO AGORA ({contextSummary.quantidade} QUESTÕES)</span>
                </>
              )}
            </button>
          </div>

          {/* Historical Simulations Taken */}
          <div className="lg:col-span-5 rounded-2xl bg-[#0B132B] border border-slate-800 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-sm font-tactical font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                Seus Resultados Anteriores
              </span>
              <span className="text-xs font-mono-code text-slate-400">
                {userSimulations.length} Realizados
              </span>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {userSimulations.length > 0 ? (
                userSimulations.map((sim) => (
                  <div
                    key={sim.id}
                    className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white truncate max-w-[200px]">
                        {sim.title}
                      </span>
                      <span
                        className={`font-mono-code font-bold px-2 py-0.5 rounded text-[11px] ${
                          sim.scorePercentage >= 70
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {sim.scorePercentage}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>
                        {sim.correctCount} acertos de {sim.totalQuestions} questões
                      </span>
                      <span>
                        {new Date(sim.completedAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 space-y-2">
                  <Award className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs">
                    Você ainda não realizou nenhum simulado. Inicie seu primeiro teste agora para medir seu aproveitamento sob pressão.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mode: Taking Simulation */}
      {mode === 'taking' && simQuestions.length > 0 && (
        <div className="space-y-6">
          {/* Floating Top Simulation Bar with Countdown & Sound Controller */}
          <div className="p-4 rounded-2xl bg-[#0D1829] border border-amber-500/40 flex flex-wrap items-center justify-between gap-4 shadow-xl sticky top-2 z-20 backdrop-blur-md">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-tactical font-black text-amber-400 uppercase tracking-wider">
                  SIMULADO EM ANDAMENTO
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-xs font-mono-code text-slate-300">
                  Questão {currentIdx + 1} de {simQuestions.length}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {contextSummary.disciplina} • <strong className="text-amber-300">{contextSummary.topico}</strong>
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Sound Alarm Toggle Button */}
              <button
                type="button"
                onClick={handleToggleSound}
                className={`p-2 rounded-xl border transition ${
                  soundEnabled
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                    : 'bg-slate-900 border-slate-700 text-slate-500 hover:text-white'
                }`}
                title={soundEnabled ? 'Alarme sonoro ativado (toca em 00:00)' : 'Alarme sonoro desativado'}
              >
                {soundEnabled ? <Bell className="w-4 h-4 text-amber-400" /> : <BellOff className="w-4 h-4" />}
              </button>

              {/* Countdown clock */}
              <div
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border font-mono-code font-bold text-sm shadow-inner ${
                  secondsRemaining < 180
                    ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse'
                    : 'bg-slate-900 border-slate-700 text-amber-400'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{formatTimer(secondsRemaining)}</span>
              </div>

              <button
                onClick={handleFinishSimulation}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-md shadow-amber-500/20"
              >
                Entregar Simulado
              </button>
            </div>
          </div>

          {/* Question View */}
          {(() => {
            const q = simQuestions[currentIdx];
            const currentSelected = answers[currentIdx];

            return (
              <div className="rounded-2xl bg-[#0B132B] border border-slate-800 p-6 space-y-6 shadow-xl">
                {/* Context Header of this Question */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-code font-bold text-amber-400">
                      Questão #{currentIdx + 1}
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-300 font-semibold">
                      {q.topic || contextSummary.topico}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                    <span>Banca: <strong className="text-white">{q.examiningBoard}</strong></span>
                    <span>Dificuldade: <strong className="text-amber-300">{q.difficulty}</strong></span>
                  </div>
                </div>

                {/* Enunciado */}
                <div className="text-sm sm:text-base text-slate-100 leading-relaxed whitespace-pre-line font-medium">
                  {q.statement}
                </div>

                {/* Alternativas A, B, C, D, E */}
                <div className="space-y-3 pt-2">
                  {q.options.map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() =>
                        setAnswers({ ...answers, [currentIdx]: opt.letter })
                      }
                      className={`p-3.5 rounded-xl border text-xs sm:text-sm font-medium cursor-pointer transition flex items-start gap-3.5 ${
                        currentSelected === opt.letter
                          ? 'bg-amber-500/20 border-amber-400 text-white ring-1 ring-amber-400 shadow-md'
                          : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center font-tactical font-black text-xs ${
                          currentSelected === opt.letter
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {opt.letter}
                      </span>
                      <span className="mt-0.5 leading-relaxed flex-1">{opt.text}</span>
                    </div>
                  ))}
                </div>

                {/* Navigation Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
                  <button
                    disabled={currentIdx === 0}
                    onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
                    className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold hover:text-white disabled:opacity-40 transition"
                  >
                    ← Anterior
                  </button>

                  <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1">
                    {simQuestions.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentIdx(i)}
                        className={`w-7 h-7 rounded-lg text-xs font-mono-code font-bold transition shrink-0 ${
                          currentIdx === i
                            ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400'
                            : answers[i]
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  {currentIdx < simQuestions.length - 1 ? (
                    <button
                      onClick={() => setCurrentIdx((prev) => Math.min(simQuestions.length - 1, prev + 1))}
                      className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold hover:text-white transition"
                    >
                      Próxima →
                    </button>
                  ) : (
                    <button
                      onClick={handleFinishSimulation}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-md shadow-emerald-600/20"
                    >
                      Concluir Simulado
                    </button>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Mode: Simulation Result */}
      {mode === 'result' && completedResult && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-[#0B132B] border border-amber-500/40 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="text-center space-y-2 pb-4 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-tactical">
                GABARITO E RESULTADO OFICIAL
              </span>
              <h3 className="text-2xl font-bold text-white">{completedResult.title}</h3>
              <p className="text-xs text-slate-400">
                Contexto: {contextSummary.concurso} • {contextSummary.cargo} • Banca {contextSummary.banca}
              </p>
            </div>

            {/* Score Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-4xl font-mono-code font-black text-amber-400">
                  {completedResult.scorePercentage}%
                </span>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">
                  Aproveitamento
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                <span className="text-4xl font-mono-code font-black text-emerald-400">
                  {completedResult.correctCount}
                </span>
                <p className="text-xs text-slate-300 font-bold uppercase tracking-wider mt-1">
                  Acertos (de {completedResult.totalQuestions})
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/30 text-center">
                <span className="text-4xl font-mono-code font-black text-red-400">
                  {completedResult.wrongCount}
                </span>
                <p className="text-xs text-slate-300 font-bold uppercase tracking-wider mt-1">
                  Erros
                </p>
              </div>
            </div>

            {/* Breakdown by Discipline */}
            {completedResult.breakdownByDiscipline && completedResult.breakdownByDiscipline.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Aproveitamento por Disciplina:
                </h4>
                <div className="space-y-2">
                  {completedResult.breakdownByDiscipline.map((item) => {
                    const pct = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
                    return (
                      <div key={item.disciplineName} className="p-3 rounded-xl bg-slate-900 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white">{item.disciplineName}</span>
                          <span className="font-mono-code text-amber-400 font-bold">
                            {pct}% ({item.correct}/{item.total})
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-amber-400 h-full rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setMode('list')}
                className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold hover:border-amber-400 transition"
              >
                Voltar ao Menu
              </button>

              <button
                onClick={handleStartSimulation}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition"
              >
                Fazer Outro Simulado do Tópico
              </button>
            </div>
          </div>

          {/* Caderno de Questões com Justificativas e Fontes */}
          <div className="space-y-4">
            <h4 className="text-sm font-tactical font-black text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              Revisão Comentada de Todas as Questões do Simulado
            </h4>

            {simQuestions.map((q, idx) => {
              const userAns = answers[idx];
              const isCorrect = userAns === q.correctOptionLetter;

              return (
                <div
                  key={q.id}
                  className={`rounded-2xl bg-[#0B132B] border p-6 space-y-4 shadow-lg ${
                    isCorrect ? 'border-emerald-500/30' : 'border-rose-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                    <span className="font-mono-code font-bold text-amber-400">
                      Questão #{idx + 1} • {q.topic || contextSummary.topico}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-md font-bold text-[11px] ${
                        isCorrect
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {isCorrect ? 'Acertou' : userAns ? `Errou (Marcou ${userAns})` : 'Em Branco'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                    {q.statement}
                  </p>

                  {/* Alternativas */}
                  <div className="space-y-2 text-xs">
                    {q.options.map((opt) => {
                      const isGabarito = opt.letter === q.correctOptionLetter;
                      const isUserChoice = opt.letter === userAns;

                      return (
                        <div
                          key={opt.id}
                          className={`p-2.5 rounded-xl border flex items-start gap-2.5 ${
                            isGabarito
                              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
                              : isUserChoice && !isCorrect
                              ? 'bg-rose-500/10 border-rose-500/40 text-rose-200'
                              : 'bg-slate-900 border-slate-800/80 text-slate-400'
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[11px] shrink-0 ${
                              isGabarito
                                ? 'bg-emerald-500 text-slate-950'
                                : isUserChoice
                                ? 'bg-rose-500 text-white'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {opt.letter}
                          </span>
                          <div className="space-y-0.5 flex-1">
                            <span className="leading-relaxed block">{opt.text}</span>
                            {opt.distractorExplanation && (
                              <span className="text-[11px] text-slate-400 block pt-0.5 italic">
                                Justificativa: {opt.distractorExplanation}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Fundamentação & Fonte */}
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 text-xs">
                    <p className="text-slate-300 leading-relaxed">
                      <strong className="text-emerald-400">Gabarito Comentado:</strong> {q.explanation}
                    </p>
                    {q.source && (
                      <p className="text-[11px] text-slate-500">
                        <strong>Fonte Normativa:</strong> {q.source}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
