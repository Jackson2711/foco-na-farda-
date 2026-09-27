import React, { useState } from 'react';
import { UserProfile, AlertNotification } from '../../types';
import { PWAInstallButton } from './PWAInstallButton';
import { FocoDataEngineStore } from '../../services/store';
import { getStoredSupabaseConfig } from '../../services/supabaseClient';
import { Bell, Flame, Shield, Award, CheckCircle, Menu, X, Database, LogOut } from 'lucide-react';

interface NavbarProps {
  user: UserProfile;
  activeTab: string;
  onNavigate: (tab: string) => void;
  onOpenMobileMenu?: () => void;
  onToggleSidebar?: () => void;
  onOpenSupabaseModal?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  onNavigate,
  onToggleSidebar,
  onOpenSupabaseModal,
  onLogout,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notifications: AlertNotification[] = FocoDataEngineStore.getNotifications(user.id);
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const isSupabaseConfigured = Boolean(getStoredSupabaseConfig().url);

  const handleMarkRead = (id: string) => {
    FocoDataEngineStore.markNotificationRead(id);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0A1128]/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-2.5 flex items-center justify-between">
      {/* Brand & Target Quick Info */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 text-left focus:outline-none group"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-md group-hover:scale-105 transition">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-tactical font-black tracking-wider text-white flex items-center gap-1.5">
              FOCO NA FARDA
              <span className="text-[10px] font-mono-code font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                BR
              </span>
            </span>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
              Seu concurso. Sua preparação. Sua farda.
            </p>
          </div>
        </button>
      </div>

      {/* User Stats, Notifications & PWA */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Streak Counter */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-bold"
          title={`Sequência de estudos ativa: ${user.streakDays} dias consecutivos`}
        >
          <Flame className="w-3.5 h-3.5 fill-orange-400 text-orange-500 animate-pulse" />
          <span>{user.streakDays}d</span>
        </div>

        {/* XP and Military Rank Badge */}
        <button
          onClick={() => onNavigate('profile')}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold hover:border-amber-500/40 transition"
          title={`Patente Militar: ${user.rank} | ${user.xp} XP`}
        >
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-amber-300 font-bold hidden sm:inline">{user.rank}</span>
          <span className="text-[11px] text-slate-400 font-mono-code">{user.xp} XP</span>
        </button>

        {/* In-App PWA Install Button */}
        <PWAInstallButton />

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
            title="Notificações e Alertas Oficiais"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-[#0D1829] border border-slate-700 shadow-2xl p-4 text-slate-100 z-50 animate-fade-in">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Alertas de Concursos
                </span>
                <span className="text-[11px] text-slate-400 font-mono-code">
                  {unreadCount} não lidos
                </span>
              </div>

              <div className="mt-2.5 space-y-2 max-h-64 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => handleMarkRead(notif.id)}
                      className={`p-2.5 rounded-lg border text-xs cursor-pointer transition ${
                        notif.isRead
                          ? 'bg-slate-900/40 border-slate-800 text-slate-400'
                          : 'bg-amber-500/10 border-amber-500/30 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold mb-1">
                        <span className="text-white">{notif.title}</span>
                        {!notif.isRead && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        )}
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-300">
                        {notif.message}
                      </p>
                      <span className="text-[9px] text-slate-500 block mt-1">
                        {new Date(notif.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-center text-slate-500 py-3">
                    Nenhum alerta recente.
                  </p>
                )}
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Fechar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Se for administrador, exibe atalho com distintivo tático */}
        {['moderator', 'editor', 'admin', 'super_admin'].includes(user.role) && (
          <button
            onClick={() => onNavigate('admin')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold uppercase transition flex items-center gap-1.5 ${
              activeTab === 'admin'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
            }`}
            title="Acessar Painel Administrativo"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin</span>
          </button>
        )}

        {/* User Mini Avatar / Profile link */}
        <button
          onClick={() => onNavigate('profile')}
          className="flex items-center gap-2 pl-1 group"
          title={`Perfil de ${user.name}`}
        >
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border border-amber-500/50 group-hover:border-amber-400 transition"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-amber-400 group-hover:border-amber-400 transition">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </button>

        {/* Botão Sair */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/40 text-xs font-semibold transition"
            title="Sair da Plataforma"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        )}
      </div>
    </header>
  );
};
