import React, { useState } from 'react';
import { State, Region, Contest } from '../../types';
import { MapPin, Compass, Building2, CheckCircle2, ChevronRight, FileText } from 'lucide-react';

interface BrazilMapProps {
  states: State[];
  regions: Region[];
  contests: Contest[];
  selectedStateId?: string;
  onSelectState: (stateId: string) => void;
  onViewContest: (contest: Contest) => void;
}

// Coordinate grid representation for Brazilian States for responsive interactive grid & SVG
const STATE_POSITIONS: Record<string, { x: number; y: number; label: string }> = {
  // Norte
  RR: { x: 3, y: 1, label: 'Roraima' },
  AP: { x: 5, y: 1, label: 'Amapá' },
  AM: { x: 2, y: 2, label: 'Amazonas' },
  PA: { x: 4, y: 2, label: 'Pará' },
  AC: { x: 1, y: 3, label: 'Acre' },
  RO: { x: 2, y: 3, label: 'Rondônia' },
  TO: { x: 4, y: 3, label: 'Tocantins' },
  // Nordeste
  MA: { x: 5, y: 2, label: 'Maranhão' },
  PI: { x: 6, y: 2, label: 'Piauí' },
  CE: { x: 7, y: 2, label: 'Ceará' },
  RN: { x: 8, y: 2, label: 'Rio Grande do Norte' },
  PB: { x: 8, y: 3, label: 'Paraíba' },
  PE: { x: 7, y: 3, label: 'Pernambuco' },
  AL: { x: 8, y: 4, label: 'Alagoas' },
  SE: { x: 7, y: 4, label: 'Sergipe' },
  BA: { x: 6, y: 4, label: 'Bahia' },
  // Centro-Oeste
  MT: { x: 3, y: 4, label: 'Mato Grosso' },
  DF: { x: 5, y: 4, label: 'Distrito Federal' },
  GO: { x: 4, y: 4, label: 'Goiás' },
  MS: { x: 3, y: 5, label: 'Mato Grosso do Sul' },
  // Sudeste
  MG: { x: 5, y: 5, label: 'Minas Gerais' },
  ES: { x: 6, y: 5, label: 'Espírito Santo' },
  SP: { x: 4, y: 6, label: 'São Paulo' },
  RJ: { x: 5, y: 6, label: 'Rio de Janeiro' },
  // Sul
  PR: { x: 3, y: 6, label: 'Paraná' },
  SC: { x: 4, y: 7, label: 'Santa Catarina' },
  RS: { x: 3, y: 7, label: 'Rio Grande do Sul' },
};

export const BrazilMap: React.FC<BrazilMapProps> = ({
  states,
  regions,
  contests,
  selectedStateId,
  onSelectState,
  onViewContest,
}) => {
  const [selectedRegionId, setSelectedRegionId] = useState<string>('all');

  // Filter states by region
  const filteredStates = states.filter((st) => {
    if (selectedRegionId === 'all') return st.code !== 'BR';
    return st.regionId === selectedRegionId && st.code !== 'BR';
  });

  const activeState = states.find((s) => s.id === selectedStateId);

  // Contests associated with the selected state (or federal if BR selected)
  const stateContests = contests.filter((c) => {
    if (!selectedStateId) return false;
    const targetState = states.find((s) => s.id === selectedStateId);
    if (!targetState) return false;
    return c.stateId === selectedStateId || (targetState.code === 'DF' && c.sphere === 'Federal');
  });

  const openContests = stateContests.filter(
    (c) => c.situation === 'Inscrições abertas' || c.situation === 'Edital publicado'
  );
  const plannedContests = stateContests.filter(
    (c) => c.situation === 'Previsto' || c.situation === 'Autorizado' || c.situation === 'Comissão formada' || c.situation === 'Banca definida'
  );
  const closedContests = stateContests.filter(
    (c) => c.situation === 'Prova realizada' || c.situation === 'Encerrado' || c.isHistorical
  );

  return (
    <div className="space-y-6">
      {/* Region Filter Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#0B132B] border border-slate-800">
        <div>
          <h3 className="text-sm font-tactical font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400" />
            Mapa Interativo de Oportunidades no Brasil
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Selecione uma região ou estado para visualizar concursos abertos, previstos e carreiras.
          </p>
        </div>

        {/* Region pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedRegionId('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              selectedRegionId === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Todas as Regiões
          </button>
          {regions.map((reg) => (
            <button
              key={reg.id}
              onClick={() => setSelectedRegionId(reg.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                selectedRegionId === reg.id
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {reg.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Tactical Grid Map */}
        <div className="lg:col-span-7 rounded-2xl bg-[#0B132B] border border-slate-800 p-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
              Matriz Cartográfica de Estados (26 Estados + DF)
            </span>
            <span className="text-[11px] text-amber-400 font-mono-code font-bold">
              {filteredStates.length} Estados filtrados
            </span>
          </div>

          {/* Interactive State Tiles arranged geographically */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-2 pt-4">
            {states
              .filter((st) => st.code !== 'BR')
              .map((st) => {
                const count = contests.filter((c) => c.stateId === st.id).length;
                const isSelected = selectedStateId === st.id;
                const isInSelectedRegion =
                  selectedRegionId === 'all' || st.regionId === selectedRegionId;

                return (
                  <button
                    key={st.id}
                    onClick={() => onSelectState(st.id)}
                    className={`relative p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20 ring-2 ring-amber-400'
                        : isInSelectedRegion
                        ? 'bg-slate-900/90 border-slate-700/80 text-white hover:border-amber-400/60 hover:bg-slate-800'
                        : 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-40'
                    }`}
                  >
                    <span className="text-sm font-black font-tactical">{st.code}</span>
                    <span
                      className={`text-[9px] font-mono-code mt-0.5 truncate max-w-full ${
                        isSelected ? 'text-slate-900 font-bold' : 'text-slate-400'
                      }`}
                    >
                      {st.name.split(' ')[0]}
                    </span>

                    {count > 0 && (
                      <span
                        className={`absolute -top-1.5 -right-1.5 px-1.5 py-0.2 rounded-full text-[9px] font-mono-code font-bold ${
                          isSelected
                            ? 'bg-slate-950 text-amber-400'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
          </div>

          {/* Federal Special Option */}
          <div className="mt-4 pt-3 border-t border-slate-800">
            {states.find((s) => s.code === 'BR') && (
              <button
                onClick={() => onSelectState(states.find((s) => s.code === 'BR')!.id)}
                className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold transition flex items-center justify-between ${
                  selectedStateId === states.find((s) => s.code === 'BR')?.id
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                    : 'bg-slate-900 border-slate-800 text-amber-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span>Âmbito Federal / Nacional (Polícia Federal, PRF, SENAPPEN)</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* State Detail Inspection Panel */}
        <div className="lg:col-span-5 rounded-2xl bg-[#0B132B] border border-slate-800 p-5 shadow-xl">
          {activeState ? (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-tactical font-black text-sm border border-amber-500/40">
                    {activeState.code}
                  </span>
                  <div>
                    <h4 className="text-base font-bold text-white">{activeState.name}</h4>
                    <p className="text-[11px] text-slate-400">
                      Região: {regions.find((r) => r.id === activeState.regionId)?.name || 'Nacional'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Counters */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                  <span className="text-lg font-mono-code font-bold text-emerald-400">
                    {openContests.length}
                  </span>
                  <p className="text-[10px] text-slate-300 font-medium">Abertos</p>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
                  <span className="text-lg font-mono-code font-bold text-amber-400">
                    {plannedContests.length}
                  </span>
                  <p className="text-[10px] text-slate-300 font-medium">Previstos</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
                  <span className="text-lg font-mono-code font-bold text-slate-300">
                    {closedContests.length}
                  </span>
                  <p className="text-[10px] text-slate-400 font-medium">Históricos</p>
                </div>
              </div>

              {/* List of Contests in this state */}
              <div className="space-y-2.5 pt-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wide block">
                  Concursos Cadastrados ({stateContests.length})
                </span>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {stateContests.length > 0 ? (
                    stateContests.map((cnt) => (
                      <div
                        key={cnt.id}
                        className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition group cursor-pointer"
                        onClick={() => onViewContest(cnt)}
                      >
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-white group-hover:text-amber-400 transition">
                            {cnt.title}
                          </h5>
                          <span
                            className={`text-[9px] font-semibold px-2 py-0.5 rounded ${
                              cnt.situation === 'Inscrições abertas'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-slate-800 text-amber-400'
                            }`}
                          >
                            {cnt.situation}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                          <span>Vagas: <strong className="text-slate-200">{cnt.vacancies}</strong></span>
                          <span>Banca: <strong className="text-slate-200">{cnt.examiningBoard}</strong></span>
                          <span>Salário: <strong className="text-amber-300">R$ {cnt.salary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></span>
                        </div>

                        <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800/80 pt-1.5">
                          <span>Fonte: {cnt.sourceName}</span>
                          <span className="text-amber-400 font-semibold group-hover:underline">
                            Ver detalhes →
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-900 text-center text-xs text-slate-400">
                      Nenhum concurso catalogado para este estado no momento.
                      <p className="text-[11px] text-amber-400 mt-1">
                        Você pode cadastrar novos editais no Painel do Administrador.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 space-y-2">
              <MapPin className="w-10 h-10 text-amber-400 mx-auto opacity-70" />
              <h4 className="text-sm font-bold text-white">Nenhum estado selecionado</h4>
              <p className="text-xs">
                Clique em qualquer um dos 26 estados ou DF no mapa ao lado para explorar oportunidades locais.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
