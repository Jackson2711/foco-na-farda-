import React from 'react';
import { Shield, ArrowLeft, Home, LogIn } from 'lucide-react';

interface InstitutionalHeaderProps {
  onNavigate: (path: string) => void;
  isAuthenticated?: boolean;
}

export const InstitutionalHeader: React.FC<InstitutionalHeaderProps> = ({
  onNavigate,
  isAuthenticated = false,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0A1128]/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate(isAuthenticated ? '/dashboard' : '/login')}
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

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => onNavigate(isAuthenticated ? '/dashboard' : '/login')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-bold text-xs uppercase tracking-wider transition"
        >
          {isAuthenticated ? (
            <>
              <Home className="w-4 h-4" />
              <span>Painel do Candidato</span>
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>Entrar / Cadastrar</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
