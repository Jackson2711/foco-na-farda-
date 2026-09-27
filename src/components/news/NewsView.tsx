import React, { useState } from 'react';
import { NewsItem } from '../../types';
import { FocoDataEngineStore } from '../../services/store';
import {
  Newspaper,
  Search,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Filter,
} from 'lucide-react';

export const NewsView: React.FC = () => {
  const newsList: NewsItem[] = FocoDataEngineStore.getNews();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['Concursos', 'Editais', 'Segurança Pública', 'Polícia', 'Legislação', 'Convocações'];

  const filteredNews = newsList.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.sourceName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-tactical font-black text-white uppercase tracking-wider flex items-center gap-2.5">
            <Newspaper className="w-6 h-6 text-amber-400" />
            Radar de Notícias & Diários Oficiais
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Informações apuradas diretamente das publicações oficiais e bancas examinadoras.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0B132B] border border-slate-800 space-y-3 shadow-lg">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Pesquisar notícias por órgão, concurso ou tema..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Todas as Categorias
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* News List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNews.map((news) => (
          <div
            key={news.id}
            className="p-5 rounded-2xl bg-[#0B132B] border border-slate-800 hover:border-amber-500/40 transition flex flex-col justify-between shadow-lg space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-500/15 text-amber-400 font-bold border border-amber-500/30">
                  {news.category}
                </span>
                <span className="flex items-center gap-1 font-mono-code">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(news.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                </span>
              </div>

              <h3 className="text-base font-bold text-white leading-snug">
                {news.title}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                {news.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span className="truncate max-w-[200px] text-slate-400">
                  {news.sourceName}
                </span>
              </div>

              <a
                href={news.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-amber-400 hover:underline font-bold text-xs"
              >
                <span>Acessar Fonte</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
