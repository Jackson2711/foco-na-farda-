import React from 'react';
import {
  Home,
  Compass,
  FileQuestion,
  Target,
  FileText,
  BookOpen,
  Timer,
  RotateCcw,
  BarChart3,
  Newspaper,
  Star,
  User,
  Trophy,
  ShieldAlert,
  Brain,
  Repeat,
  LogOut,
} from 'lucide-react';

import { UserProfile } from '../../types';

interface SidebarProps {
  user?: UserProfile | null;
  activeTab: string;
  onNavigate: (tab: string) => void;
  pendingReviewsCount?: number;
  pendingRetestsCount?: number;
  isOpen?: boolean;
  onClose?: () => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  activeTab,
  onNavigate,
  pendingReviewsCount = 0,
  pendingRetestsCount = 0,
  isOpen = false,
  onClose,
  onLogout,
}) => {
  const isAdmin = ['moderator', 'editor', 'admin', 'super_admin'].includes(user?.role || '');

  const navItems = [
    { id: 'dashboard', label: 'Início', icon: Home },
    { id: 'radar', label: 'Concursos', icon: Compass },
    { id: 'questions', label: 'Questões', icon: FileQuestion },
    {
      id: 'retest',
      label: 'Reteste Adaptativo',
      icon: Repeat,
      badge: pendingRetestsCount > 0 ? pendingRetestsCount : undefined,
    },
    { id: 'psychometrics', label: 'Psicometria & Erros', icon: Brain },
    { id: 'mycontest', label: 'Meu Concurso', icon: Target },
    { id: 'simulations', label: 'Simulados', icon: FileText },
    { id: 'disciplines', label: 'Disciplinas', icon: BookOpen },
    { id: 'timer', label: 'Estudar', icon: Timer },
    {
      id: 'reviews',
      label: 'Revisões',
      icon: RotateCcw,
      badge: pendingReviewsCount > 0 ? pendingReviewsCount : undefined,
    },
    { id: 'performance', label: 'Desempenho', icon: BarChart3 },
    { id: 'ranking', label: 'Ranking', icon: Trophy },
    { id: 'news', label: 'Notícias', icon: Newspaper },
    { id: 'favorites', label: 'Favoritos', icon: Star },
    { id: 'profile', label: 'Perfil', icon: User },
    ...(isAdmin ? [{ id: 'admin', label: 'Administração', icon: ShieldAlert, adminOnly: true }] : []),
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#0A1128] border-r border-slate-800 shrink-0 min-h-[calc(100vh-57px)] p-3 select-none">
      <div className="space-y-1">
        <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          CENTRAL TÁTICA
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                isActive
                  ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              } ${item.adminOnly ? 'text-amber-400/90 border border-dashed border-amber-500/20 mt-4' : ''}`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold font-mono-code animate-pulse">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Botão de Logout Real (Supabase) */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-400/80 hover:text-red-300 hover:bg-red-500/10 transition mt-2"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span>Encerrar Sessão (Sair)</span>
          </button>
        )}
      </div>

      {/* Motivational Tactical Footer Box */}
      <div className="mt-auto pt-4 border-t border-slate-800/80 px-2 text-center">
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <p className="text-[11px] font-semibold text-slate-300 italic">
            "A farda não é dada. É conquistada questão por questão."
          </p>
          <span className="text-[9px] uppercase font-tactical text-amber-400 font-bold tracking-widest block mt-1">
            FOCO NA FARDA • BRASIL
          </span>
        </div>
      </div>
    </aside>
  );
};
