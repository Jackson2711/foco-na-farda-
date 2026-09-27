import React, { useState } from 'react';
import { FocoDataEngineStore } from '../../services/store';
import { UserProfile, Career, Contest, State } from '../../types';
import { Shield, Target, Clock, Award, CheckCircle2, ChevronRight, User } from 'lucide-react';

interface OnboardingModalProps {
  onComplete: (profile: UserProfile) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCareerId, setSelectedCareerId] = useState<string>('car-pm');
  const [selectedStateId, setSelectedStateId] = useState<string>('st-sp');
  const [selectedContestId, setSelectedContestId] = useState<string>('cnt-pmesp-2025');
  const [dailyMinutes, setDailyMinutes] = useState<number>(120);
  const [studyLevel, setStudyLevel] = useState<'Iniciante' | 'Intermediário' | 'Avançado'>('Iniciante');

  const careers: Career[] = FocoDataEngineStore.getCareers();
  const states: State[] = FocoDataEngineStore.getStates();
  const contests: Contest[] = FocoDataEngineStore.getContests();

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Create user profile
      const newProfile: UserProfile = {
        id: `usr-${Date.now()}`,
        name: name.trim() || 'Candidato Focado',
        email: email.trim() || 'candidato@foconafarda.com.br',
        role: 'candidate',
        targetCareerId: selectedCareerId,
        targetContestId: selectedContestId,
        stateId: selectedStateId,
        dailyStudyMinutes: dailyMinutes,
        studyLevel: studyLevel,
        streakDays: 1,
        xp: 25, // Welcome bonus
        rank: 'Recruta',
        createdAt: new Date().toISOString(),
      };

      FocoDataEngineStore.saveUserProfile(newProfile);
      onComplete(newProfile);
    }
  };

  const filteredContests = contests.filter(
    (c) => c.careerId === selectedCareerId || c.stateId === selectedStateId || c.sphere === 'Federal'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl bg-[#0B132B] border border-amber-500/40 p-6 sm:p-8 shadow-2xl text-slate-100 relative">
        {/* Header Badge */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-tactical font-bold tracking-wider text-white">
                FOCO NA FARDA
              </h2>
              <p className="text-xs text-amber-400/90 font-medium">
                Seu concurso. Sua preparação. Sua farda.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono-code px-2.5 py-1 rounded bg-slate-800 text-amber-400 border border-slate-700">
            ETAPA {step}/4
          </span>
        </div>

        {/* Step Indicator Bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full my-5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-500 to-amber-400 h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Step 1: Identification */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-amber-400" />
                Apresentação do Candidato
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Para isolamento rigoroso dos seus dados, questões resolvidas, simulados e estatísticas.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Seu Nome ou Nome de Guerra:
                </label>
                <input
                  type="text"
                  placeholder="Ex: Soldado Silva, Candidato Lima..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  E-mail de Acesso:
                </label>
                <input
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Carreira & Região */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-400" />
                Qual é a sua carreira dos sonhos?
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                A plataforma adapta questões, simulados e pesos conforme o seu objetivo.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {careers.map((career) => (
                <button
                  key={career.id}
                  onClick={() => setSelectedCareerId(career.id)}
                  type="button"
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition flex items-center justify-between ${
                    selectedCareerId === career.id
                      ? 'bg-amber-500/20 border-amber-400 text-white ring-1 ring-amber-400'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{career.name}</span>
                  {selectedCareerId === career.id && (
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 ml-1" />
                  )}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Estado ou Esfera de Interesse Principal:
              </label>
              <select
                value={selectedStateId}
                onChange={(e) => setSelectedStateId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
              >
                {states.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.code} — {st.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 3: Concurso Específico */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                Seu Concurso Alvo Principal
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Você pode trocar a qualquer momento no menu "Meu Concurso".
              </p>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {filteredContests.length > 0 ? (
                filteredContests.map((cnt) => (
                  <div
                    key={cnt.id}
                    onClick={() => setSelectedContestId(cnt.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition ${
                      selectedContestId === cnt.id
                        ? 'bg-amber-500/15 border-amber-400 ring-1 ring-amber-400'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{cnt.title}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-amber-400">
                        {cnt.situation}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400">
                      <span>Banca: <strong>{cnt.examiningBoard}</strong></span>
                      <span>Vagas: <strong>{cnt.vacancies}</strong></span>
                      <span>Salário: <strong>R$ {cnt.salary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-slate-900 text-center text-xs text-slate-400">
                  Nenhum concurso específico filtrado. Selecione o primeiro concurso geral para iniciar.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Rotina & Nível */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                Tempo Diário & Nível Atual
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Quanto tempo você pode dedicar à sua farda todos os dias?
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              {[
                { label: '30 min', min: 30 },
                { label: '1 hora', min: 60 },
                { label: '2 horas', min: 120 },
                { label: '3+ horas', min: 180 },
              ].map((opt) => (
                <button
                  key={opt.min}
                  type="button"
                  onClick={() => setDailyMinutes(opt.min)}
                  className={`py-2.5 px-2 rounded-xl text-center text-xs font-bold transition border ${
                    dailyMinutes === opt.min
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Como você avalia seu nível preparatório hoje?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Iniciante', 'Intermediário', 'Avançado'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setStudyLevel(lvl)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition ${
                      studyLevel === lvl
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
              <p className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Plano Tático Imediato
              </p>
              Ao concluir, geraremos seu plano de estudos diário, radar de concursos ativos e acesso ao banco de questões com inteligência artificial.
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-800">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              type="button"
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold transition"
            >
              Voltar
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            type="button"
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20"
          >
            <span>{step === 4 ? 'Acessar Plataforma' : 'Continuar'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
