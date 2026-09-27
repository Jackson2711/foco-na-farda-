import React from 'react';
import {
  Shield,
  Siren,
  Search,
  Truck,
  Car,
  FileCheck2,
  Building2,
  Users2,
  Lock,
  ArrowRight,
  Compass,
} from 'lucide-react';

interface ContestCategoryCardsProps {
  onSelectCategory: (categoryName: string, queryFilter?: string) => void;
  activeCategory?: string;
}

export const ContestCategoryCards: React.FC<ContestCategoryCardsProps> = ({
  onSelectCategory,
  activeCategory,
}) => {
  const categories = [
    {
      id: 'policial',
      title: 'POLICIAL',
      subtitle: 'PM • PC • PF • PRF • Polícia Penal',
      description: 'Policiamento ostensivo, perícia técnica, investigação judiciária e custódia penal.',
      tags: ['Polícia Militar', 'Polícia Civil', 'Polícia Federal', 'PRF', 'Polícia Penal'],
      icon: Shield,
      accent: 'amber',
      borderClass: 'border-amber-500/30 hover:border-amber-400',
      badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      imgUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'seguranca',
      title: 'SEGURANÇA',
      subtitle: 'Guarda Municipal • Segurança Pública • Forças Armadas',
      description: 'Proteção preventiva comunitária, segurança cidadã e soberania nacional.',
      tags: ['Guarda Municipal', 'Segurança Cidadã', 'Forças Armadas'],
      icon: Users2,
      accent: 'blue',
      borderClass: 'border-blue-500/30 hover:border-blue-400',
      badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      imgUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'transito',
      title: 'TRÂNSITO',
      subtitle: 'DETRAN • Agente de Trânsito',
      description: 'Fiscalização de tráfego, educação viária, controle veicular e mobilidade urbana.',
      tags: ['DETRAN', 'Agente de Trânsito', 'Policiamento Viário'],
      icon: Car,
      accent: 'emerald',
      borderClass: 'border-emerald-500/30 hover:border-emerald-400',
      badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      imgUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'fiscalizacao',
      title: 'FISCALIZAÇÃO',
      subtitle: 'Fiscal de Posturas • Fiscal de Tributos • Fazendário',
      description: 'Auditoria tributária, posturas municipais, controle ambiental e inspeção sanitária.',
      tags: ['Tributos', 'Posturas', 'Fazendário', 'Auditoria'],
      icon: FileCheck2,
      accent: 'purple',
      borderClass: 'border-purple-500/30 hover:border-purple-400',
      badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
      imgUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'outros',
      title: 'OUTROS CONCURSOS',
      subtitle: 'Tribunais • Ministério Público • Administrativo',
      description: 'Carreiras de apoio da justiça, analistas e técnicos de instituições públicas.',
      tags: ['Tribunais TJ/TRF', 'Ministério Público', 'Administrativo'],
      icon: Building2,
      accent: 'slate',
      borderClass: 'border-slate-700 hover:border-slate-500',
      badgeClass: 'bg-slate-800 text-slate-300 border-slate-700',
      imgUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="space-y-3.5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-tactical font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400" />
            Navegue por Carreiras & Áreas
          </h3>
          <p className="text-xs text-slate-400">
            Selecione uma categoria para filtrar oportunidades em todo o Brasil.
          </p>
        </div>

        {activeCategory && activeCategory !== 'all' && (
          <button
            onClick={() => onSelectCategory('all', '')}
            className="text-xs font-semibold text-amber-400 hover:underline"
          >
            Ver todas as carreiras
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id, cat.title)}
              className={`group relative overflow-hidden rounded-2xl bg-[#0D1829] border ${
                isActive ? 'border-amber-400 ring-2 ring-amber-400/20' : cat.borderClass
              } shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-0.5`}
            >
              {/* Image banner with overlay */}
              <div className="relative h-28 w-full overflow-hidden bg-slate-900">
                <img
                  src={cat.imgUrl}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-75 contrast-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1829] via-[#0D1829]/60 to-transparent" />

                <div className="absolute top-2.5 left-2.5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border ${cat.badgeClass} backdrop-blur-sm`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{cat.title}</span>
                  </span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-tactical font-black text-white uppercase tracking-wider group-hover:text-amber-300 transition">
                    {cat.subtitle}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-snug">
                    {cat.description}
                  </p>
                </div>

                {/* Sub-tags */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 group-hover:text-amber-400 transition">
                  <span className="font-semibold">{cat.tags.length} especialidades</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
