import React, { useState } from 'react';
import { Discipline, Topic, Flashcard } from '../../types';
import { FocoDataEngineStore } from '../../services/store';
import {
  BookOpen,
  Layers,
  ChevronRight,
  FileQuestion,
  Sparkles,
  RotateCw,
  Plus,
  CheckCircle2,
} from 'lucide-react';

interface DisciplinesViewProps {
  onSelectDisciplineToPractice: (disciplineId: string) => void;
}

export const DisciplinesView: React.FC<DisciplinesViewProps> = ({
  onSelectDisciplineToPractice,
}) => {
  const disciplines: Discipline[] = FocoDataEngineStore.getDisciplines();
  const allTopics: Topic[] = FocoDataEngineStore.getTopics();
  const allFlashcards: Flashcard[] = FocoDataEngineStore.getFlashcards();

  const [selectedDisciplineId, setSelectedDisciplineId] = useState<string>(disciplines[0]?.id || 'disc-const');
  const [activeTab, setActiveTab] = useState<'topics' | 'flashcards'>('topics');
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const activeDiscipline = disciplines.find((d) => d.id === selectedDisciplineId) || disciplines[0];
  const disciplineTopics = allTopics.filter((t) => t.disciplineId === activeDiscipline?.id);
  const disciplineFlashcards = allFlashcards.filter((f) => f.disciplineId === activeDiscipline?.id);

  const toggleFlip = (cardId: string) => {
    setFlippedCards((prev) => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-tactical font-black text-white uppercase tracking-wider flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-amber-400" />
            Disciplinas & Doutrina Tática
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Matérias estruturadas, tópicos mais cobrados em editais e flashcards para memorização rápida.
          </p>
        </div>

        <button
          onClick={() => onSelectDisciplineToPractice(activeDiscipline.id)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition uppercase tracking-wider shadow-lg shadow-amber-500/20"
        >
          <FileQuestion className="w-4 h-4" />
          <span>Resolver Questões Desta Matéria</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Disciplines Selector Sidebar */}
        <div className="lg:col-span-4 rounded-2xl bg-[#0B132B] border border-slate-800 p-4 shadow-xl space-y-2 max-h-[600px] overflow-y-auto">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
            Catálogo Geral de Disciplinas
          </span>

          {disciplines.map((disc) => {
            const isSelected = selectedDisciplineId === disc.id;

            return (
              <button
                key={disc.id}
                onClick={() => setSelectedDisciplineId(disc.id)}
                className={`w-full p-3 rounded-xl border text-left text-xs font-semibold transition flex items-center justify-between ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="text-white">{disc.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono-code font-normal">
                    {disc.topicsCount || 6} tópicos essenciais
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
              </button>
            );
          })}
        </div>

        {/* Content Details: Topics or Flashcards */}
        <div className="lg:col-span-8 rounded-2xl bg-[#0B132B] border border-slate-800 p-6 shadow-xl space-y-5">
          {/* Header of selected discipline */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono-code">
                DISCIPLINA SELECIONADA
              </span>
              <h3 className="text-xl font-bold text-white mt-0.5">
                {activeDiscipline.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                {activeDiscipline.description}
              </p>
            </div>

            {/* Sub-tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
              <button
                onClick={() => setActiveTab('topics')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === 'topics'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Tópicos
              </button>
              <button
                onClick={() => setActiveTab('flashcards')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === 'flashcards'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Flashcards ({disciplineFlashcards.length})
              </button>
            </div>
          </div>

          {/* Tab 1: Topics */}
          {activeTab === 'topics' && (
            <div className="space-y-3">
              {disciplineTopics.length > 0 ? (
                disciplineTopics.map((top, idx) => (
                  <div
                    key={top.id}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition space-y-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-400 text-[10px] font-mono-code font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h4 className="text-xs font-bold text-white">{top.name}</h4>
                    </div>
                    {top.summary && (
                      <p className="text-[11px] text-slate-400 pl-7 leading-relaxed">
                        {top.summary}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Tópicos detalhados integrados ao banco de questões desta disciplina.
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Flashcards */}
          {activeTab === 'flashcards' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Toque em qualquer cartão para virar e conferir a resposta ou conceito memorizado.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {disciplineFlashcards.map((fc) => {
                  const isFlipped = !!flippedCards[fc.id];

                  return (
                    <div
                      key={fc.id}
                      onClick={() => toggleFlip(fc.id)}
                      className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-400/50 transition cursor-pointer min-h-[160px] flex flex-col justify-between shadow-md"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pb-2 border-b border-slate-800">
                        <span className="font-bold text-amber-400">{fc.tag}</span>
                        <div className="flex items-center gap-1 text-slate-400">
                          <RotateCw className="w-3 h-3" />
                          <span>{isFlipped ? 'Verso (Resposta)' : 'Frente (Pergunta)'}</span>
                        </div>
                      </div>

                      <div className="py-2 text-xs sm:text-sm font-medium text-slate-100 leading-relaxed whitespace-pre-line">
                        {isFlipped ? fc.back : fc.front}
                      </div>

                      <div className="pt-2 text-[10px] text-slate-500 text-right">
                        Clique para virar
                      </div>
                    </div>
                  );
                })}
              </div>

              {disciplineFlashcards.length === 0 && (
                <div className="p-8 text-center text-slate-400 space-y-2">
                  <p className="text-xs">
                    Nenhum flashcard cadastrado ainda para esta matéria.
                  </p>
                  <p className="text-[11px] text-amber-400">
                    Você pode gerar flashcards automaticamente ao resolver questões clicando em "Explicar com IA &gt; Criar Flashcards".
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
