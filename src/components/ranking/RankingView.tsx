import React, { useState } from 'react';
import { UserProfile, Career, State } from '../../types';
import { FocoDataEngineStore } from '../../services/store';
import {
  Trophy,
  Award,
  Medal,
  Users,
  Flame,
  Star,
  Shield,
  Filter,
} from 'lucide-react';

interface RankingViewProps {
  user: UserProfile;
}

export const RankingView: React.FC<RankingViewProps> = ({ user }) => {
  const careers = FocoDataEngineStore.getCareers();
  const states = FocoDataEngineStore.getStates();

  const [rankingType, setRankingType] = useState<'geral' | 'carreira' | 'estado'>('geral');
  const [selectedCareerId, setSelectedCareerId] = useState<string>(user.targetCareerId || 'car-pm');

  // Realistic leaderboard mock cohort + current user's actual position
  const cohort = [
    { name: 'Capitão Nascimento', rank: 'Oficial', xp: 4820, questions: 612, accuracy: 88, streak: 34, state: 'RJ' },
    { name: 'Cadete Oliveira', rank: 'Cadete', xp: 3450, questions: 450, accuracy: 82, streak: 28, state: 'SP' },
    { name: 'Sargento Rocha', rank: 'Cadete', xp: 3120, questions: 395, accuracy: 79, streak: 21, state: 'MG' },
    { name: 'Aspirante Carvalho', rank: 'Aspirante', xp: 2890, questions: 360, accuracy: 84, streak: 19, state: 'DF' },
    { name: 'GCM Silva', rank: 'Aspirante', xp: 2450, questions: 310, accuracy: 76, streak: 15, state: 'CE' },
    { name: 'Operacional Santos', rank: 'Operacional', xp: 1980, questions: 250, accuracy: 73, streak: 12, state: 'BA' },
    { name: 'Agente Barbosa', rank: 'Operacional', xp: 1650, questions: 210, accuracy: 75, streak: 11, state: 'PR' },
    { name: 'Aluno Pereira', rank: 'Aluno', xp: 820, questions: 120, accuracy: 71, streak: 7, state: 'RS' },
    { name: 'Recruta Lima', rank: 'Recruta', xp: 340, questions: 50, accuracy: 68, streak: 4, state: 'GO' },
  ];

  // Insert real user in cohort sorted by real XP
  const fullLeaderboard = [
    ...cohort,
    {
      name: `${user.name} (Você)`,
      rank: user.rank,
      xp: user.xp,
      questions: FocoDataEngineStore.getQuestionAnswers(user.id).length,
      accuracy: (() => {
        const ans = FocoDataEngineStore.getQuestionAnswers(user.id);
        const cor = ans.filter((a) => a.isCorrect).length;
        return ans.length > 0 ? Math.round((cor / ans.length) * 100) : 0;
      })(),
      streak: user.streakDays,
      state: states.find((s) => s.id === user.stateId)?.code || 'BR',
      isMe: true,
    },
  ].sort((a, b) => b.xp - a.xp);

  const myPosition = fullLeaderboard.findIndex((item) => (item as any).isMe) + 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-tactical font-black text-white uppercase tracking-wider flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-amber-400" />
            Ranking Nacional de Candidatos
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Classificação pelo Índice Operacional, pontuação em simulados e disciplina de estudos.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setRankingType('geral')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              rankingType === 'geral'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Ranking Geral Brasil
          </button>
          <button
            onClick={() => setRankingType('carreira')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              rankingType === 'carreira'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Por Carreira
          </button>
        </div>
      </div>

      {/* User's Position Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-slate-900 to-[#0B132B] border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex flex-col items-center justify-center font-tactical font-black shadow-lg">
            <span className="text-[10px] uppercase font-bold">POSIÇÃO</span>
            <span className="text-xl font-mono-code font-black leading-none">#{myPosition}</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>{user.name}</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-amber-400 border border-slate-700">
                {user.rank}
              </span>
            </h3>
            <p className="text-xs text-slate-300">
              Você acumulou <strong className="text-amber-400 font-mono-code">{user.xp} XP</strong> e está na posição <strong>#{myPosition}</strong> do ranking nacional.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-300">
          <div className="text-center px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Sequência</span>
            <strong className="text-orange-400 font-mono-code">{user.streakDays} dias</strong>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="rounded-2xl bg-[#0B132B] border border-slate-800 p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <span>Quadro de Honra Tático</span>
          <span className="text-amber-400 font-mono-code font-bold">Top Concorrentes</span>
        </div>

        <div className="space-y-2">
          {fullLeaderboard.map((item, index) => {
            const isMe = (item as any).isMe;

            return (
              <div
                key={index}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition text-xs ${
                  isMe
                    ? 'bg-amber-500/15 border-amber-400 text-white font-bold ring-1 ring-amber-400 shadow-md'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-lg font-mono-code font-bold text-xs flex items-center justify-center shrink-0 ${
                      index === 0
                        ? 'bg-amber-400 text-slate-950 font-black'
                        : index === 1
                        ? 'bg-slate-300 text-slate-950 font-black'
                        : index === 2
                        ? 'bg-amber-700 text-white font-black'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {index + 1}
                  </span>

                  <div>
                    <span className="text-white font-semibold flex items-center gap-2">
                      {item.name}
                      <span className="text-[10px] font-mono-code text-slate-400 font-normal">
                        ({item.state})
                      </span>
                    </span>
                    <span className="text-[10px] text-amber-400/90 block">
                      Patente: {item.rank}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 font-mono-code text-xs">
                  <span className="text-slate-400 hidden sm:inline">
                    {item.questions} questões • {item.accuracy}% acertos
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-amber-400 font-bold border border-slate-800">
                    {item.xp} XP
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
