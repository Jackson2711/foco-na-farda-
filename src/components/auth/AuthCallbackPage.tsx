import React, { useEffect, useState } from 'react';
import { AuthService } from '../../services/authService';
import { UserProfile } from '../../types';
import { Shield, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

interface AuthCallbackPageProps {
  onSuccess: (user: UserProfile) => void;
  onNavigate: (path: string) => void;
}

export const AuthCallbackPage: React.FC<AuthCallbackPageProps> = ({ onSuccess, onNavigate }) => {
  const [statusMessage, setStatusMessage] = useState('Processando autenticação nativa...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    async function processCallback() {
      try {
        const params = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));

        const error = params.get('error') || hashParams.get('error');
        const errorDescription = params.get('error_description') || hashParams.get('error_description');

        if (error) {
          if (error === 'access_denied') {
            setErrorMessage('Autenticação cancelada pelo usuário.');
          } else {
            setErrorMessage(errorDescription || 'Recusa de autorização no login social.');
          }
          setIsProcessing(false);
          return;
        }

        // Recupera a sessão ativa do AuthService
        const session = await AuthService.getSession();

        if (isCancelled) return;

        if (session && session.user) {
          const profile = await AuthService.syncOrCreateProfile(session.user);
          setStatusMessage('Acesso autorizado! Redirecionando para o Centro de Comando...');
          window.history.replaceState({}, document.title, '/dashboard');

          setTimeout(() => {
            if (!isCancelled) {
              onSuccess(profile);
              onNavigate('/dashboard');
            }
          }, 300);
        } else {
          // Redireciona para o login de forma segura
          onNavigate('/login');
        }
      } catch (err: any) {
        console.error('Falha no processamento do callback:', err);
        if (!isCancelled) {
          setErrorMessage('Ocorreu uma falha durante a validação da sessão.');
          setIsProcessing(false);
        }
      }
    }

    processCallback();

    return () => {
      isCancelled = true;
    };
  }, [onSuccess, onNavigate]);

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-[#0D1829] border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 text-center">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 mb-2">
            <Shield className="w-9 h-9" />
          </div>

          <h1 className="text-xl font-tactical font-black tracking-wider text-white uppercase">
            FOCO NA FARDA
          </h1>

          {isProcessing && !errorMessage ? (
            <div className="space-y-4 py-4 animate-fade-in">
              <Loader2 className="w-8 h-8 animate-spin text-amber-400 mx-auto" />
              <div className="space-y-1">
                <p className="text-xs font-tactical font-bold text-amber-300 uppercase tracking-wider">
                  Verificando Sessão
                </p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  {statusMessage}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-2 animate-fade-in text-left">
              <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-semibold flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('/login')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-tactical font-black text-xs uppercase tracking-widest transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Ir para o Login</span>
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-[10px] text-slate-500 mt-6 uppercase tracking-widest font-mono-code">
          FOCO NA FARDA • SEGURANÇA E DISCIPLINA • PLATAFORMA OFICIAL
        </p>
      </div>
    </div>
  );
};
