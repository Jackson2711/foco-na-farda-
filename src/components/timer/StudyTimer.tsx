import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, Discipline, Contest } from '../../types';
import { FocoDataEngineStore } from '../../services/store';
import { EstudosBanner } from '../common/SectionBanners';
import { soundService } from '../../services/soundService';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  BookOpen,
  Target,
  Flame,
  Award,
  Bell,
  BellOff,
} from 'lucide-react';

interface StudyTimerProps {
  user: UserProfile;
  onUpdateUser: (profile: UserProfile) => void;
}

export const StudyTimer: React.FC<StudyTimerProps> = ({ user, onUpdateUser }) => {
  const disciplines = FocoDataEngineStore.getDisciplines();
  const contests = FocoDataEngineStore.getContests();

  const [mode, setMode] = useState<'pomodoro' | 'foco' | 'personalizado'>('pomodoro');
  const [selectedDisciplineId, setSelectedDisciplineId] = useState<string>(disciplines[0]?.id || 'disc-const');
  const [selectedContestId, setSelectedContestId] = useState<string>(user.targetContestId || contests[0]?.id || '');
  const [customMinutes, setCustomMinutes] = useState<number>(30);

  // Timer states
  const getInitialSeconds = (m: 'pomodoro' | 'foco' | 'personalizado') => {
    if (m === 'pomodoro') return 25 * 60;
    if (m === 'foco') return 50 * 60;
    return customMinutes * 60;
  };

  const [secondsLeft, setSecondsLeft] = useState<number>(getInitialSeconds('pomodoro'));
  const [isActive, setIsActive] = useState<boolean>(false);
  const [initialDuration, setInitialDuration] = useState<number>(25 * 60);
  const [sessionCompleted, setSessionCompleted] = useState<boolean>(false);
  const [xpGained, setXpGained] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => soundService.isAlarmEnabled());

  // Trava para evitar disparos repetidos do alarme sonoro
  const alarmFiredRef = useRef<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
    } else if (isActive && secondsLeft === 0) {
      if (!alarmFiredRef.current) {
        alarmFiredRef.current = true;
        soundService.playAlarmSound();
      }
      handleCompleteSession(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft]);

  const handleModeChange = (newMode: 'pomodoro' | 'foco' | 'personalizado') => {
    setIsActive(false);
    alarmFiredRef.current = false;
    setMode(newMode);
    const secs = getInitialSeconds(newMode);
    setSecondsLeft(secs);
    setInitialDuration(secs);
    setSessionCompleted(false);
  };

  const handleStart = () => {
    soundService.unlockAudio();
    alarmFiredRef.current = false;
    setIsActive(true);
    setSessionCompleted(false);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    alarmFiredRef.current = false;
    const secs = getInitialSeconds(mode);
    setSecondsLeft(secs);
    setInitialDuration(secs);
    setSessionCompleted(false);
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundService.setAlarmEnabled(next);
    if (next) {
      soundService.playAlarmSound();
    }
  };

  const handleCompleteSession = (fromZeroAlarm: boolean = false) => {
    setIsActive(false);
    if (fromZeroAlarm && !alarmFiredRef.current) {
      alarmFiredRef.current = true;
      soundService.playAlarmSound();
    }

    const durationMinutes = Math.max(1, Math.round((initialDuration - secondsLeft) / 60));

    const result = FocoDataEngineStore.recordStudySession({
      userId: user.id,
      disciplineId: selectedDisciplineId,
      contestId: selectedContestId || undefined,
      durationMinutes,
      mode,
      startedAt: new Date(Date.now() - durationMinutes * 60 * 1000).toISOString(),
      completedAt: new Date().toISOString(),
    });

    setXpGained(result.xpGained);
    setSessionCompleted(true);
    onUpdateUser(FocoDataEngineStore.getUserProfile()!);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const progressPct = ((initialDuration - secondsLeft) / initialDuration) * 100;

  return (
    <div className="space-y-6">
      {/* Banner Informativo: ESTUDOS */}
      <EstudosBanner compact />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-tactical font-black text-white uppercase tracking-wider flex items-center gap-2.5">
            <Timer className="w-6 h-6 text-amber-400" />
            Cronômetro de Estudos Táticos
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Controle de tempo líquido, ciclos Pomodoro e registro automático de horas estudadas.
          </p>
        </div>

        {/* Controles de Alarme Sonoro */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleSound}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition shadow-sm ${
              soundEnabled
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
            title="Alternar reprodução do alarme sonoro ao chegar em 00:00"
          >
            {soundEnabled ? (
              <Bell className="w-4 h-4 text-amber-400" />
            ) : (
              <BellOff className="w-4 h-4 text-slate-500" />
            )}
            <span>Som do alarme: {soundEnabled ? 'Ativado' : 'Desativado'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Clock Card */}
        <div className="lg:col-span-7 rounded-2xl bg-[#0B132B] border border-slate-800 p-6 sm:p-8 shadow-xl flex flex-col items-center justify-center space-y-6">
          {/* Mode Selector */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => handleModeChange('pomodoro')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                mode === 'pomodoro'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pomodoro (25m)
            </button>
            <button
              onClick={() => handleModeChange('foco')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                mode === 'foco'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Foco Total (50m)
            </button>
            <button
              onClick={() => handleModeChange('personalizado')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                mode === 'personalizado'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Personalizado
            </button>
          </div>

          {/* Big Circular/Digital Tactical Display */}
          <div className="relative w-64 h-64 rounded-full border-4 border-slate-800 flex flex-col items-center justify-center bg-slate-900/60 shadow-inner">
            <span className="text-5xl font-mono-code font-black text-amber-400 tracking-wider">
              {formatTime(secondsLeft)}
            </span>
            <span className="text-xs uppercase font-bold text-slate-400 font-tactical mt-2">
              {isActive ? 'EM PROGRESSO' : 'EM PAUSA'}
            </span>

            {/* Circular progress highlight */}
            <div
              className="absolute inset-0 rounded-full border-4 border-amber-500 pointer-events-none transition-all duration-1000"
              style={{
                clipPath: `polygon(50% 50%, -50% -50%, ${progressPct}% -50%, ${progressPct}% 150%, -50% 150%)`,
              }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {!isActive ? (
              <button
                onClick={handleStart}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>INICIAR SESSÃO</span>
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider transition"
              >
                <Pause className="w-4 h-4 fill-white" />
                <span>PAUSAR</span>
              </button>
            )}

            <button
              onClick={() => handleCompleteSession(false)}
              disabled={secondsLeft === initialDuration}
              className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition disabled:opacity-40"
              title="Encerrar e registrar minutos estudados"
            >
              Concluir & Salvar
            </button>

            <button
              onClick={handleReset}
              className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition"
              title="Reiniciar cronômetro"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {sessionCompleted && (
            <div className="w-full p-4 rounded-xl bg-amber-500/15 border-2 border-amber-500/40 text-amber-200 text-xs font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in shadow-lg">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <span className="text-sm font-black text-white uppercase tracking-wider block">
                    ⏰ TEMPO ESGOTADO! Ciclo Finalizado.
                  </span>
                  <span className="text-[11px] text-amber-300/80 font-normal">
                    Tempo líquido computado no seu histórico. +{xpGained} XP obtidos.
                  </span>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition self-start sm:self-auto shrink-0 shadow"
              >
                Novo Ciclo
              </button>
            </div>
          )}
        </div>

        {/* Configuration & Selection Panel */}
        <div className="lg:col-span-5 rounded-2xl bg-[#0B132B] border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="text-sm font-tactical font-bold text-white uppercase tracking-wider">
              Associação do Estudo
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Associe o tempo gasto à matéria e concurso corretos para estatísticas exatas.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Disciplina em Estudo:
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

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Concurso Referência:
              </label>
              <select
                value={selectedContestId}
                onChange={(e) => setSelectedContestId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
              >
                {contests.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            {mode === 'personalizado' && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Duração Personalizada (em minutos):
                </label>
                <input
                  type="number"
                  min={5}
                  max={180}
                  value={customMinutes}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setCustomMinutes(val);
                    setSecondsLeft(val * 60);
                    setInitialDuration(val * 60);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                />
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Award className="w-4 h-4" />
              <span>Regras de Gamificação Tática:</span>
            </div>
            <p>• Cada hora líquida de estudo confere +50 XP à sua patente militar.</p>
            <p>• Suas horas alimentam diretamente seu Desempenho e Sequência diária.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
