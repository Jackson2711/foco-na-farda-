import React, { useState } from 'react';
import { UserProfile, UserAlertPreferences } from '../../types';
import { FocoDataEngineStore } from '../../services/store';
import { AuthService } from '../../services/authService';
import {
  User,
  Shield,
  Award,
  Bell,
  Settings,
  Save,
  CheckCircle2,
  Clock,
  Target,
  Flame,
  Calendar,
  Mail,
  LogOut,
  Lock,
} from 'lucide-react';

interface ProfileViewProps {
  user: UserProfile;
  onUpdateUser: (profile: UserProfile) => void;
  onLogout?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onUpdateUser,
  onLogout,
}) => {
  const careers = FocoDataEngineStore.getCareers();
  const states = FocoDataEngineStore.getStates();

  const [name, setName] = useState(user.name);
  const [dailyMinutes, setDailyMinutes] = useState(user.dailyStudyMinutes);
  const [targetCareerId, setTargetCareerId] = useState(user.targetCareerId);
  const [stateId, setStateId] = useState(user.stateId || 'st-sp');
  const [studyLevel, setStudyLevel] = useState(user.studyLevel);

  // Alerts preferences
  const [alertPrefs, setAlertPrefs] = useState<UserAlertPreferences>(() =>
    FocoDataEngineStore.getAlertPreferences()
  );
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Rank thresholds
  const rankLevels = [
    { rank: 'Recruta', minXP: 0 },
    { rank: 'Aluno', minXP: 200 },
    { rank: 'Operacional', minXP: 500 },
    { rank: 'Aspirante', minXP: 1000 },
    { rank: 'Cadete', minXP: 1800 },
    { rank: 'Oficial', minXP: 3000 },
  ];

  const currentRankIdx = rankLevels.findIndex((r) => r.rank === user.rank);
  const nextRank = rankLevels[currentRankIdx + 1] || null;

  const currentBase = rankLevels[currentRankIdx]?.minXP || 0;
  const nextTarget = nextRank ? nextRank.minXP : user.xp;
  const progressToNext = nextRank
    ? Math.min(100, Math.round(((user.xp - currentBase) / (nextTarget - currentBase)) * 100))
    : 100;

  const formattedCreatedAt = (() => {
    try {
      return new Date(user.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return 'Data indisponível';
    }
  })();

  const handleSave = async () => {
    setIsSaving(true);
    const updates = {
      name: name.trim() || user.name,
      dailyStudyMinutes: dailyMinutes,
      targetCareerId,
      stateId,
      studyLevel,
    };

    // Sincroniza localmente e na tabela profiles do Supabase
    const updated = await AuthService.updateUserProfileData(user.id, updates);

    FocoDataEngineStore.saveAlertPreferences(alertPrefs);
    onUpdateUser(updated);
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-tactical font-black text-white uppercase tracking-wider flex items-center gap-2.5">
            <User className="w-6 h-6 text-amber-400" />
            Perfil & Progressão de Patente
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Personalização do candidato, notificações de editais e hierarquia militar.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20"
        >
          <Save className="w-4 h-4" />
          <span>Salvar Alterações</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Perfil e preferências de alerta salvos com sucesso!</span>
        </div>
      )}

      {/* Gamification & Military Rank Card (Section 22) */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0C152B] via-slate-900 to-[#0A1128] border border-amber-500/30 p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-tactical font-black text-lg">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono-code">
                PATENTE ATUAL
              </span>
              <h3 className="text-xl font-bold text-white uppercase font-tactical">
                {user.rank}
              </h3>
            </div>
          </div>

          <div className="text-right">
            <span className="text-2xl font-mono-code font-black text-amber-400">
              {user.xp} XP
            </span>
            <p className="text-[10px] text-slate-400">
              {nextRank ? `Faltam ${nextRank.minXP - user.xp} XP para ${nextRank.rank}` : 'Patente Máxima Atingida'}
            </p>
          </div>
        </div>

        {/* Progress Bar to next rank */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Progresso da Patente</span>
            <span className="font-mono-code font-bold text-white">{progressToNext}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${progressToNext}%` }}
            />
          </div>
        </div>

        {/* Rank steps */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2">
          {rankLevels.map((lvl) => {
            const isCurrent = lvl.rank === user.rank;
            const isPassed = user.xp >= lvl.minXP;

            return (
              <div
                key={lvl.rank}
                className={`p-2 rounded-xl border text-center transition ${
                  isCurrent
                    ? 'bg-amber-500/20 border-amber-400 text-white font-bold'
                    : isPassed
                    ? 'bg-slate-900/90 border-slate-800 text-slate-300'
                    : 'bg-slate-950/40 border-slate-900 text-slate-600'
                }`}
              >
                <span className="text-xs block font-tactical">{lvl.rank}</span>
                <span className="text-[9px] font-mono-code block mt-0.5 text-slate-400">
                  {lvl.minXP} XP
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Personal Info Form & Alert Preferences */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Personal Details */}
        <div className="lg:col-span-7 rounded-2xl bg-[#0B132B] border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-tactical font-bold text-white uppercase tracking-wider">
              Dados do Candidato
            </h3>
            {user.avatarUrl && (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-8 h-8 rounded-full border border-amber-400/60 object-cover"
                referrerPolicy="no-referrer"
              />
            )}
          </div>

          <div className="space-y-3 text-xs">
            {/* Nome (Editável pelo candidato) */}
            <div>
              <label className="block font-bold text-slate-300 mb-1">
                Nome ou Nome de Guerra:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome ou nome de guerra"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            {/* Email Oficial */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-slate-300">
                  E-mail Oficial:
                </label>
                <span className="text-[10px] text-amber-400 font-mono-code font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Conta Verificada
                </span>
              </div>
              <div className="relative">
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-400 cursor-not-allowed text-xs font-mono-code"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Método de Login (Requisito 8) */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Método de Login
                  </span>
                  <span className="text-xs font-bold text-slate-200">
                    {user.loginMethod === 'google' ? 'Google OAuth' : 'E-mail e Senha'}
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold font-mono-code">
                ATIVO
              </span>
            </div>

            {/* Data de Cadastro na Plataforma (Requisito 8) */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Data de Cadastro Oficial
                  </span>
                  <span className="text-xs font-bold text-slate-200">
                    {formattedCreatedAt}
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold font-mono-code">
                REGISTRADO
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Carreira de Foco:
                </label>
                <select
                  value={targetCareerId}
                  onChange={(e) => setTargetCareerId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                >
                  {careers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Estado de Preferência:
                </label>
                <select
                  value={stateId}
                  onChange={(e) => setStateId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                >
                  {states.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.code} — {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Meta Diária (minutos):
                </label>
                <input
                  type="number"
                  step={15}
                  value={dailyMinutes}
                  onChange={(e) => setDailyMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Nível Declarado:
                </label>
                <select
                  value={studyLevel}
                  onChange={(e) => setStudyLevel(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                >
                  <option value="Iniciante">Iniciante</option>
                  <option value="Intermediário">Intermediário</option>
                  <option value="Avançado">Avançado</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Preferences (Section 26) */}
        <div className="lg:col-span-5 rounded-2xl bg-[#0B132B] border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="text-sm font-tactical font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              Alertas Oficiais de Concursos
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Notificações prioritárias sobre publicação de novos editais e prazos.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { id: 'newContest', label: 'Novo concurso autorizado ou previsto' },
              { id: 'newEdict', label: 'Edital oficial publicado' },
              { id: 'openRegistrations', label: 'Início de inscrições abertas' },
              { id: 'dateChange', label: 'Retificação de datas ou cronograma' },
              { id: 'results', label: 'Resultados e gabaritos definitivos' },
              { id: 'convocations', label: 'Convocações para TAF e formação' },
              { id: 'pendingReviews', label: 'Lembrete de revisões de 24h pendentes' },
            ].map((item) => (
              <label
                key={item.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 cursor-pointer hover:border-slate-700"
              >
                <span className="text-slate-300 font-medium">{item.label}</span>
                <input
                  type="checkbox"
                  checked={(alertPrefs as any)[item.id] !== false}
                  onChange={(e) =>
                    setAlertPrefs({ ...alertPrefs, [item.id]: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-amber-500 focus:ring-0 bg-slate-800 border-slate-700"
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Seção de Segurança da Conta e Logout */}
      <div className="rounded-2xl bg-[#0B132B] border border-slate-800 p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-tactical font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            Sessão e Segurança da Conta
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Sua sessão atual está autenticada com segurança na plataforma Foco na Farda.
          </p>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 font-bold text-xs uppercase tracking-wider transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </button>
        )}
      </div>
    </div>
  );
};
