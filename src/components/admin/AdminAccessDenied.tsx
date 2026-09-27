import React from 'react';
import { ShieldAlert, ArrowLeft, LogOut, KeyRound, AlertTriangle } from 'lucide-react';
import { UserProfile } from '../../types';

interface AdminAccessDeniedProps {
  user: UserProfile | null;
  errorMessage?: string;
  onNavigate: (tab: string) => void;
  onLogout: () => void;
  onSwitchToAdminAccount?: () => void;
}

export const AdminAccessDenied: React.FC<AdminAccessDeniedProps> = ({
  user,
  errorMessage,
  onNavigate,
  onLogout,
  onSwitchToAdminAccount,
}) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-[#0B132B] border-2 border-red-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-red-950/40 text-center relative overflow-hidden animate-fade-in">
        {/* Glow de Alerta Tático */}
        <div className="absolute -top-24 -left-24 w-56 h-56 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-56 h-56 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Emblema de Bloqueio */}
        <div className="w-20 h-20 rounded-2xl bg-red-500/10 border-2 border-red-500/40 text-red-400 mx-auto flex items-center justify-center mb-6 shadow-lg shadow-red-500/10">
          <ShieldAlert className="w-10 h-10 animate-pulse text-red-500" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-700/50 text-red-400 text-xs font-mono font-bold uppercase tracking-widest mb-3">
          <AlertTriangle className="w-3.5 h-3.5" />
          HTTP 403 • ACESSO NEGADO PELO BACKEND
        </div>

        <h1 className="text-2xl sm:text-3xl font-black font-tactical text-white tracking-wide uppercase mb-3">
          Área Administrativa Restrita
        </h1>

        <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto mb-6">
          {errorMessage || (
            <>
              O acesso ao Painel de Comando em <code className="text-red-400 font-mono bg-red-950/50 px-1.5 py-0.5 rounded">/admin</code> foi rejeitado pelo servidor de segurança.
            </>
          )}
        </p>

        {/* Card Informativo com Dados do Usuário & Role */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-left space-y-2.5 mb-6 text-xs font-mono">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <span className="text-slate-400">Usuário Autenticado:</span>
            <span className="text-white font-semibold">{user?.email || 'Sessão Não Administrativa'}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <span className="text-slate-400">Papel / Role Atual:</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-bold uppercase">
              {user?.role || 'user'}
            </span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <span className="text-slate-400">Requisito de Acesso:</span>
            <span className="text-emerald-400 font-bold">moderator, editor, admin ou super_admin</span>
          </div>
          <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
            <span>Validação de Segurança:</span>
            <span className="text-slate-400 font-bold">100% Backend RBAC Enforcement</span>
          </div>
        </div>

        {/* Ações Táticas */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Painel de Estudos
          </button>

          {onSwitchToAdminAccount && (
            <button
              onClick={onSwitchToAdminAccount}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider transition-all border border-slate-700 cursor-pointer"
              title="Acessar com credenciais administrativas de teste"
            >
              <KeyRound className="w-4 h-4 text-amber-400" />
              Entrar como Admin
            </button>
          )}

          <button
            onClick={onLogout}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-950/50 hover:bg-red-900/60 text-red-300 font-bold text-xs uppercase tracking-wider transition-all border border-red-800/40 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Encerrar Sessão
          </button>
        </div>
      </div>
    </div>
  );
};
