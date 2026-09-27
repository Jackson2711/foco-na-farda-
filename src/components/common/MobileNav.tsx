import React, { useState } from 'react';
import {
  Home,
  Compass,
  FileQuestion,
  Target,
  MoreHorizontal,
  X,
  FileText,
  BookOpen,
  Timer,
  RotateCcw,
  BarChart3,
  Trophy,
  Newspaper,
  Star,
  User,
  ShieldAlert,
  Brain,
  Repeat,
  LogOut,
} from 'lucide-react';

import { UserProfile } from '../../types';

interface MobileNavProps {
  user?: UserProfile | null;
  activeTab: string;
  onNavigate: (tab: string) => void;
  pendingReviewsCount?: number;
  pendingRetestsCount?: number;
  onLogout?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  user,
  activeTab,
  onNavigate,
  pendingReviewsCount = 0,
  pendingRetestsCount = 0,
  onLogout,
}) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const isAdmin = ['moderator', 'editor', 'admin', 'super_admin'].includes(user?.role || '');

  const mainItems = [
    { id: 'dashboard', label: 'Início', icon: Home },
    { id: 'questions', label: 'Questões', icon: FileQuestion },
    {
      id: 'retest',
      label: 'Reteste',
      icon: Repeat,
      badge: pendingRetestsCount > 0 ? pendingRetestsCount : undefined,
    },
    { id: 'psychometrics', label: 'Psicometria', icon: Brain },
  ];

  const drawerItems = [
    { id: 'radar', label: 'Radar de Concursos', icon: Compass },
    { id: 'mycontest', label: 'Meu Concurso Alvo', icon: Target },
    { id: 'simulations', label: 'Simulados', icon: FileText },
    { id: 'disciplines', label: 'Disciplinas & Tópicos', icon: BookOpen },
    { id: 'timer', label: 'Estudar (Cronômetro)', icon: Timer },
    {
      id: 'reviews',
      label: 'Revisões de Hoje',
      icon: RotateCcw,
      badge: pendingReviewsCount > 0 ? pendingReviewsCount : undefined,
    },
    { id: 'performance', label: 'Meu Desempenho', icon: BarChart3 },
    { id: 'ranking', label: 'Ranking Nacional', icon: Trophy },
    { id: 'news', label: 'Notícias & Editais', icon: Newspaper },
    { id: 'favorites', label: 'Meus Favoritos', icon: Star },
    { id: 'profile', label: 'Meu Perfil', icon: User },
    ...(isAdmin ? [{ id: 'admin', label: 'Painel do Administrador', icon: ShieldAlert }] : []),
  ];

  const handleSelect = (tab: string) => {
    onNavigate(tab);
    setShowDrawer(false);
  };

  return (
    <>
      {/* Mobile Drawer Menu */}
      {showDrawer && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full bg-[#0D1829] border-t border-slate-700 rounded-t-2xl p-4 max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-sm font-tactical font-bold text-amber-400 uppercase tracking-wider">
                Módulos do Sistema
              </span>
              <button
                onClick={() => setShowDrawer(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3">
              {drawerItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs font-semibold transition ${
                      isActive
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-amber-400" />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold font-mono-code">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {onLogout && (
              <div className="mt-3 pt-3 border-t border-slate-800">
                <button
                  onClick={() => {
                    setShowDrawer(false);
                    onLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-xs hover:bg-red-500/20 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Encerrar Sessão (Sair)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Persistent Bottom Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A1128]/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 flex items-center justify-around">
        {mainItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-medium transition ${
                isActive
                  ? 'text-amber-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{item.label}</span>
            </button>
          );
        })}

        <button
          onClick={() => setShowDrawer(true)}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-medium transition relative ${
            drawerItems.some((d) => d.id === activeTab)
              ? 'text-amber-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MoreHorizontal className="w-5 h-5 mb-0.5" />
          <span>Mais</span>
          {pendingReviewsCount > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          )}
        </button>
      </nav>
    </>
  );
};
