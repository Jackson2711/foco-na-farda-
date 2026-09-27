import React, { useState } from 'react';
import { UserProfile, FavoriteItem, Contest, Question, Discipline } from '../../types';
import { FocoDataEngineStore } from '../../services/store';
import {
  Star,
  Compass,
  FileQuestion,
  BookOpen,
  Trash2,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

interface FavoritesViewProps {
  user: UserProfile;
  onOpenContest: (contest: Contest) => void;
  onOpenQuestion: (questionId: string) => void;
  onSelectDiscipline: (disciplineId: string) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  user,
  onOpenContest,
  onOpenQuestion,
  onSelectDiscipline,
}) => {
  const [activeTab, setActiveTab] = useState<'contest' | 'question' | 'discipline'>('contest');
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() =>
    FocoDataEngineStore.getFavorites(user.id)
  );

  const contests = FocoDataEngineStore.getContests();
  const questions = FocoDataEngineStore.getQuestions();
  const disciplines = FocoDataEngineStore.getDisciplines();

  const handleRemove = (itemType: FavoriteItem['itemType'], itemId: string) => {
    FocoDataEngineStore.toggleFavorite(user.id, itemType, itemId);
    setFavorites(FocoDataEngineStore.getFavorites(user.id));
  };

  const contestFavs = favorites.filter((f) => f.itemType === 'contest');
  const questionFavs = favorites.filter((f) => f.itemType === 'question');
  const disciplineFavs = favorites.filter((f) => f.itemType === 'discipline');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-tactical font-black text-white uppercase tracking-wider flex items-center gap-2.5">
            <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
            Meus Favoritos Táticos
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Concursos, questões e matérias marcadas com estrela para acesso imediato.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveTab('contest')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'contest'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Concursos ({contestFavs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('question')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'question'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileQuestion className="w-3.5 h-3.5" />
            <span>Questões ({questionFavs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('discipline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'discipline'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Disciplinas ({disciplineFavs.length})</span>
          </button>
        </div>
      </div>

      {/* Tab: Contests */}
      {activeTab === 'contest' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contestFavs.map((fav) => {
            const cnt = contests.find((c) => c.id === fav.itemId);
            if (!cnt) return null;

            return (
              <div
                key={fav.id}
                className="p-5 rounded-2xl bg-[#0B132B] border border-slate-800 hover:border-amber-500/40 transition flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                    <span className="font-bold text-amber-400">{cnt.sphere}</span>
                    <button
                      onClick={() => handleRemove('contest', cnt.id)}
                      className="text-slate-500 hover:text-red-400 transition"
                      title="Remover dos favoritos"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-2">{cnt.title}</h3>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                    <span>Banca: <strong className="text-slate-200">{cnt.examiningBoard}</strong></span>
                    <span>Vagas: <strong className="text-slate-200">{cnt.vacancies}</strong></span>
                    <span>Salário: <strong className="text-amber-300">R$ {cnt.salary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></span>
                  </div>
                </div>

                <button
                  onClick={() => onOpenContest(cnt)}
                  className="w-full py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <span>Ver Detalhes do Concurso</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}

          {contestFavs.length === 0 && (
            <div className="col-span-full p-12 text-center rounded-2xl bg-[#0B132B] border border-slate-800 text-slate-400 text-xs">
              Nenhum concurso favoritado. Clique na estrela em qualquer edital no Radar de Concursos para salvar aqui.
            </div>
          )}
        </div>
      )}

      {/* Tab: Questions */}
      {activeTab === 'question' && (
        <div className="space-y-3">
          {questionFavs.map((fav) => {
            const q = questions.find((item) => item.id === fav.itemId);
            if (!q) return null;

            return (
              <div
                key={fav.id}
                className="p-4 rounded-2xl bg-[#0B132B] border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono-code font-bold text-amber-400">
                    Questão #{q.codeNumber} • {q.examiningBoard} • {q.year}
                  </span>
                  <button
                    onClick={() => handleRemove('question', q.id)}
                    className="text-slate-500 hover:text-red-400 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-200 line-clamp-2">{q.statement}</p>

                <div className="flex justify-end">
                  <button
                    onClick={() => onOpenQuestion(q.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs"
                  >
                    Resolver Questão
                  </button>
                </div>
              </div>
            );
          })}

          {questionFavs.length === 0 && (
            <div className="p-12 text-center rounded-2xl bg-[#0B132B] border border-slate-800 text-slate-400 text-xs">
              Nenhuma questão favoritada. Toque no ícone de estrela durante a resolução para salvar questões difíceis aqui.
            </div>
          )}
        </div>
      )}

      {/* Tab: Disciplines */}
      {activeTab === 'discipline' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {disciplineFavs.map((fav) => {
            const disc = disciplines.find((d) => d.id === fav.itemId);
            if (!disc) return null;

            return (
              <div
                key={fav.id}
                className="p-5 rounded-2xl bg-[#0B132B] border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-sm font-bold text-white">{disc.name}</h4>
                  <p className="text-xs text-slate-400">{disc.description}</p>
                </div>
                <button
                  onClick={() => onSelectDiscipline(disc.id)}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs"
                >
                  Acessar
                </button>
              </div>
            );
          })}

          {disciplineFavs.length === 0 && (
            <div className="col-span-full p-12 text-center rounded-2xl bg-[#0B132B] border border-slate-800 text-slate-400 text-xs">
              Nenhuma disciplina favoritada ainda.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
