import React, { useState } from 'react';
import { Contest, Career, State, City, Organization, Sphere, ContestSituation } from '../../types';
import { FocoDataEngineStore } from '../../services/store';
import { BrazilMap } from './BrazilMap';
import { ConcursosBanner } from '../common/SectionBanners';
import {
  Compass,
  Search,
  Filter,
  CheckCircle,
  ExternalLink,
  Star,
  MapPin,
  Calendar,
  Building,
  DollarSign,
  Users,
  ShieldCheck,
  History,
  Map,
  X,
  Clock,
  Layers,
} from 'lucide-react';

interface ContestRadarProps {
  userId: string;
  onSetTargetContest?: (contestId: string) => void;
}

export const ContestRadar: React.FC<ContestRadarProps> = ({
  userId,
  onSetTargetContest,
}) => {
  const [viewMode, setViewMode] = useState<'radar' | 'map' | 'history'>('radar');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSphere, setSelectedSphere] = useState<string>('all');
  const [selectedCareer, setSelectedCareer] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedSituation, setSelectedSituation] = useState<string>('all');
  const [selectedBoard, setSelectedBoard] = useState<string>('all');
  const [selectedMinSalary, setSelectedMinSalary] = useState<number>(0);
  const [selectedMinVacancies, setSelectedMinVacancies] = useState<number>(0);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const [selectedContestDetail, setSelectedContestDetail] = useState<Contest | null>(null);

  const contests: Contest[] = FocoDataEngineStore.getContests();
  const careers: Career[] = FocoDataEngineStore.getCareers();
  const states: State[] = FocoDataEngineStore.getStates();
  const cities: City[] = FocoDataEngineStore.getCities();
  const organizations: Organization[] = FocoDataEngineStore.getOrganizations();
  const regions = FocoDataEngineStore.getRegions();

  // Distinct boards
  const boards = Array.from(new Set(contests.map((c) => c.examiningBoard).filter(Boolean)));

  // Filter logic
  const filteredContests = contests.filter((c) => {
    // History tab vs Active radar
    if (viewMode === 'history') {
      if (!c.isHistorical && c.situation !== 'Encerrado') return false;
    } else if (viewMode === 'radar') {
      if (c.isHistorical) return false;
    }

    if (selectedSphere !== 'all' && c.sphere !== selectedSphere) return false;
    if (selectedCareer !== 'all' && c.careerId !== selectedCareer) return false;
    if (selectedState !== 'all' && c.stateId !== selectedState) return false;
    if (selectedSituation !== 'all' && c.situation !== selectedSituation) return false;
    if (selectedBoard !== 'all' && !c.examiningBoard.toLowerCase().includes(selectedBoard.toLowerCase())) return false;
    if (selectedMinSalary > 0 && (c.salary || 0) < selectedMinSalary) return false;
    if (selectedMinVacancies > 0 && (c.vacancies || 0) < selectedMinVacancies) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const org = organizations.find((o) => o.id === c.organizationId);
      const matchesTitle = c.title.toLowerCase().includes(q);
      const matchesOrg = org?.name.toLowerCase().includes(q) || org?.acronym.toLowerCase().includes(q);
      const matchesBoard = c.examiningBoard.toLowerCase().includes(q);
      const matchesSource = c.sourceName.toLowerCase().includes(q);
      return matchesTitle || matchesOrg || matchesBoard || matchesSource;
    }

    return true;
  });

  const handleToggleFavorite = (contestId: string) => {
    FocoDataEngineStore.toggleFavorite(userId, 'contest', contestId);
  };

  const isFav = (contestId: string) => {
    return FocoDataEngineStore.isFavorite(userId, 'contest', contestId);
  };

  const getOrgAcronym = (orgId: string) => {
    return organizations.find((o) => o.id === orgId)?.acronym || 'Órgão';
  };

  const getStateCode = (stateId?: string) => {
    if (!stateId) return 'BR';
    return states.find((s) => s.id === stateId)?.code || 'BR';
  };

  const getCityName = (cityId?: string) => {
    if (!cityId) return '';
    return cities.find((c) => c.id === cityId)?.name || '';
  };

  return (
    <div className="space-y-6">
      {/* Banner Informativo: CONCURSOS */}
      <ConcursosBanner
        action={{
          label: viewMode === 'map' ? 'Ver em Lista' : 'Ver Mapa do Brasil',
          onClick: () => setViewMode(viewMode === 'map' ? 'radar' : 'map'),
        }}
      />

      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-tactical font-black text-white uppercase tracking-wider flex items-center gap-2.5">
            <Compass className="w-6 h-6 text-amber-400" />
            Radar Nacional de Concursos
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Monitoramento de editais de segurança pública federais, estaduais, distritais e municipais.
          </p>
        </div>

        {/* View mode switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 self-stretch sm:self-auto justify-center">
          <button
            onClick={() => setViewMode('radar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              viewMode === 'radar'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Radar Ativo</span>
          </button>

          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              viewMode === 'map'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Mapa do Brasil</span>
          </button>

          <button
            onClick={() => setViewMode('history')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              viewMode === 'history'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Banco Histórico</span>
          </button>
        </div>
      </div>

      {/* Interactive Map View */}
      {viewMode === 'map' ? (
        <BrazilMap
          states={states}
          regions={regions}
          contests={contests}
          selectedStateId={selectedState !== 'all' ? selectedState : undefined}
          onSelectState={(stId) => setSelectedState(stId)}
          onViewContest={(cnt) => setSelectedContestDetail(cnt)}
        />
      ) : (
        <>
          {/* Filters Bar */}
          <div className="p-4 rounded-2xl bg-[#0B132B] border border-slate-800 space-y-3 shadow-lg">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Pesquisar por órgão, concurso, cargo, banca organizadora ou fonte oficial..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Select Dropdowns Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {/* Esfera */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Esfera
                </label>
                <select
                  value={selectedSphere}
                  onChange={(e) => setSelectedSphere(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                >
                  <option value="all">Todas as esferas</option>
                  <option value="Federal">Federal</option>
                  <option value="Estadual">Estadual</option>
                  <option value="Distrital">Distrital</option>
                  <option value="Municipal">Municipal</option>
                </select>
              </div>

              {/* Carreira */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Carreira
                </label>
                <select
                  value={selectedCareer}
                  onChange={(e) => setSelectedCareer(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                >
                  <option value="all">Todas as carreiras</option>
                  {careers.map((car) => (
                    <option key={car.id} value={car.id}>
                      {car.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Estado */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Estado / UF
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                >
                  <option value="all">Todos os Estados</option>
                  {states.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.code} — {st.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Situação */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Situação
                </label>
                <select
                  value={selectedSituation}
                  onChange={(e) => setSelectedSituation(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                >
                  <option value="all">Todas as situações</option>
                  <option value="Inscrições abertas">Inscrições abertas</option>
                  <option value="Edital publicado">Edital publicado</option>
                  <option value="Banca definida">Banca definida</option>
                  <option value="Comissão formada">Comissão formada</option>
                  <option value="Autorizado">Autorizado</option>
                  <option value="Previsto">Previsto</option>
                  <option value="Encerrado">Encerrado</option>
                </select>
              </div>
            </div>

            {/* Toggle Advanced Filters (Banca, Salário, Vagas) */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1.5"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>{showAdvancedFilters ? 'Ocultar Filtros Avançados' : 'Filtros Avançados (Banca, Remuneração, Vagas)'}</span>
              </button>
            </div>

            {showAdvancedFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-800/80 animate-fade-in">
                {/* Banca */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                    Banca Organizadora
                  </label>
                  <select
                    value={selectedBoard}
                    onChange={(e) => setSelectedBoard(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="all">Todas as Bancas</option>
                    {boards.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Remuneração Mínima */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                    Remuneração Inicial
                  </label>
                  <select
                    value={selectedMinSalary}
                    onChange={(e) => setSelectedMinSalary(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value={0}>Qualquer remuneração</option>
                    <option value={3000}>A partir de R$ 3.000</option>
                    <option value={5000}>A partir de R$ 5.000</option>
                    <option value={8000}>A partir de R$ 8.000</option>
                    <option value={12000}>A partir de R$ 12.000</option>
                  </select>
                </div>

                {/* Vagas Mínimas */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                    Número de Vagas
                  </label>
                  <select
                    value={selectedMinVacancies}
                    onChange={(e) => setSelectedMinVacancies(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value={0}>Qualquer quantidade</option>
                    <option value={50}>50+ vagas</option>
                    <option value={200}>200+ vagas</option>
                    <option value={500}>500+ vagas</option>
                    <option value={1000}>1.000+ vagas</option>
                  </select>
                </div>
              </div>
            )}

            {/* Filter tags count */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
              <span>
                Exibindo <strong>{filteredContests.length}</strong> concursos encontrados
              </span>
              {(selectedSphere !== 'all' || selectedCareer !== 'all' || selectedState !== 'all' || selectedSituation !== 'all' || selectedBoard !== 'all' || selectedMinSalary > 0 || selectedMinVacancies > 0 || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedSphere('all');
                    setSelectedCareer('all');
                    setSelectedState('all');
                    setSelectedSituation('all');
                    setSelectedBoard('all');
                    setSelectedMinSalary(0);
                    setSelectedMinVacancies(0);
                    setSearchQuery('');
                  }}
                  className="text-amber-400 hover:underline font-semibold"
                >
                  Limpar todos os filtros
                </button>
              )}
            </div>
          </div>

          {/* Contests Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContests.map((cnt) => {
              const stateCode = getStateCode(cnt.stateId);
              const cityName = getCityName(cnt.cityId);
              const orgAcronym = getOrgAcronym(cnt.organizationId);
              const favorited = isFav(cnt.id);

              return (
                <div
                  key={cnt.id}
                  className="rounded-2xl bg-[#0B132B] border border-slate-800 p-5 hover:border-amber-500/50 transition flex flex-col justify-between shadow-lg relative group"
                >
                  {/* Card Header */}
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-tactical font-black bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          {orgAcronym}
                        </span>
                        <span className="text-[10px] font-mono-code text-slate-400">
                          {cnt.sphere} • {stateCode} {cityName ? `(${cityName})` : ''}
                        </span>
                      </div>

                      {/* Favorite Button */}
                      <button
                        onClick={() => handleToggleFavorite(cnt.id)}
                        className={`p-1.5 rounded-lg border transition ${
                          favorited
                            ? 'bg-amber-500/20 border-amber-400 text-amber-400'
                            : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-white'
                        }`}
                        title="Favoritar concurso"
                      >
                        <Star className={`w-3.5 h-3.5 ${favorited ? 'fill-amber-400' : ''}`} />
                      </button>
                    </div>

                    <h3 className="text-sm font-bold text-white mt-2.5 leading-snug group-hover:text-amber-400 transition">
                      {cnt.title}
                    </h3>

                    {/* Situation badge */}
                    <div className="mt-2.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                          cnt.situation === 'Inscrições abertas'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse'
                            : cnt.situation === 'Edital publicado'
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                            : cnt.situation === 'Autorizado' || cnt.situation === 'Banca definida'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {cnt.situation}
                      </span>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                      <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/80">
                        <span className="text-[10px] text-slate-400 block">Vagas</span>
                        <span className="font-mono-code font-bold text-white">
                          {cnt.vacancies ? cnt.vacancies.toLocaleString('pt-BR') : 'A definir'}
                        </span>
                      </div>

                      <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/80">
                        <span className="text-[10px] text-slate-400 block">Remuneração</span>
                        <span className="font-mono-code font-bold text-amber-300">
                          R$ {cnt.salary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 space-y-1 text-[11px] text-slate-400">
                      <div className="flex items-center justify-between">
                        <span>Banca:</span>
                        <strong className="text-slate-200">{cnt.examiningBoard}</strong>
                      </div>
                      {cnt.examDate && (
                        <div className="flex items-center justify-between">
                          <span>Data da Prova:</span>
                          <strong className="text-slate-200">
                            {new Date(cnt.examDate + 'T00:00:00').toLocaleDateString('pt-BR')}
                          </strong>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer with Official Source Label */}
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="truncate max-w-[140px]" title={cnt.sourceName}>
                        Fonte Oficial
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedContestDetail(cnt)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-white text-xs font-bold transition flex items-center gap-1"
                    >
                      <span>Ver Concurso</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredContests.length === 0 && (
            <div className="p-12 text-center rounded-2xl bg-[#0B132B] border border-slate-800 space-y-3">
              <Compass className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">Nenhum concurso encontrado</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Não localizamos concursos para os filtros selecionados. Tente expandir sua busca para outros estados ou esferas.
              </p>
            </div>
          )}
        </>
      )}

      {/* Contest Detail Modal */}
      {selectedContestDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-[#0D1829] border border-amber-500/40 p-6 shadow-2xl text-slate-100 relative space-y-5">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {selectedContestDetail.sphere} • {getStateCode(selectedContestDetail.stateId)}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {selectedContestDetail.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedContestDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Official Source Banner (Section 6 Requirement) */}
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <span className="font-bold text-emerald-300">
                  FONTE OFICIAL VERIFICADA
                </span>
                <p className="text-slate-300">
                  Origem: <strong>{selectedContestDetail.sourceName}</strong>
                </p>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                  <span>Publicação: {selectedContestDetail.publishedAt}</span>
                  <span>Última atualização: {selectedContestDetail.updatedAt}</span>
                </div>
              </div>
            </div>

            {/* Key Data Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Vagas</span>
                <span className="text-base font-mono-code font-bold text-white">
                  {selectedContestDetail.vacancies || 'A definir'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Remuneração</span>
                <span className="text-base font-mono-code font-bold text-amber-300">
                  R$ {selectedContestDetail.salary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Banca</span>
                <span className="text-xs font-bold text-white truncate block">
                  {selectedContestDetail.examiningBoard}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Data da Prova</span>
                <span className="text-xs font-bold text-white">
                  {selectedContestDetail.examDate
                    ? new Date(selectedContestDetail.examDate + 'T00:00:00').toLocaleDateString('pt-BR')
                    : 'A definir'}
                </span>
              </div>
            </div>

            {/* Requirements & Observations */}
            <div className="space-y-3 text-xs text-slate-300">
              {selectedContestDetail.requirements && (
                <div>
                  <h4 className="font-bold text-white mb-1">Requisitos Básicos:</h4>
                  <p className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    {selectedContestDetail.requirements}
                  </p>
                </div>
              )}

              {/* Phases */}
              {selectedContestDetail.phases && selectedContestDetail.phases.length > 0 && (
                <div>
                  <h4 className="font-bold text-white mb-1">Etapas do Concurso:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {selectedContestDetail.phases.map((ph, idx) => (
                      <div
                        key={ph.id}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-2 text-[11px]"
                      >
                        <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px]">
                          {idx + 1}
                        </span>
                        <span>{ph.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedContestDetail.observations && (
                <div>
                  <h4 className="font-bold text-white mb-1">Observações Táticas:</h4>
                  <p className="text-slate-400 italic">
                    {selectedContestDetail.observations}
                  </p>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800">
              <a
                href={selectedContestDetail.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-amber-400 hover:underline font-semibold"
              >
                <span>Acessar Diário Oficial / Fonte Oficial</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="flex items-center gap-2">
                {onSetTargetContest && (
                  <button
                    onClick={() => {
                      onSetTargetContest(selectedContestDetail.id);
                      setSelectedContestDetail(null);
                    }}
                    className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 text-xs transition"
                  >
                    Definir como Meu Concurso Alvo
                  </button>
                )}
                <button
                  onClick={() => setSelectedContestDetail(null)}
                  className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs transition"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
