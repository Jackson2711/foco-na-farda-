import React, { useState } from 'react';
import { AuthService } from '../../services/authService';
import { UserProfile } from '../../types';
import { GoogleIcon } from './GoogleIcon';
import { Shield, Mail, Lock, ArrowRight, AlertCircle, Loader2, Info } from 'lucide-react';

interface LoginPageProps {
  onSuccess: (user: UserProfile) => void;
  onNavigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [googleInfoMessage, setGoogleInfoMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setGoogleInfoMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Informe seu e-mail e senha.');
      return;
    }

    setIsLoading(true);

    const res = await AuthService.login(email, password);
    setIsLoading(false);

    if (res.success && res.data) {
      onSuccess(res.data.user);
    } else {
      setErrorMessage(res.error || 'Credenciais inválidas. Verifique os dados digitados.');
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage(null);
    setGoogleInfoMessage(null);
    setIsGoogleLoading(true);

    const res = await AuthService.loginWithGoogle();
    setIsGoogleLoading(false);

    if (!res.success) {
      if (res.error === 'GOOGLE_NOT_CONFIGURED') {
        setGoogleInfoMessage(
          'O login com Google ainda precisa ser configurado com o Client ID no ambiente da plataforma. Por favor, utilize o login por E-mail e Senha abaixo para acessar normalmente.'
        );
      } else {
        setErrorMessage(res.error || 'Não foi possível iniciar o login com Google no momento.');
      }
    } else if (res.data?.user) {
      onSuccess(res.data.user);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Card Principal */}
        <div className="rounded-2xl bg-[#0D1829] border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
          {/* Cabeçalho */}
          <div className="text-center space-y-2">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 mb-1">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-tactical font-black tracking-wider text-white uppercase">
              FOCO NA FARDA
            </h1>
            <p className="text-xs text-amber-400/90 font-medium">
              Autenticação Oficial • Acesso ao Centro de Comando
            </p>
          </div>

          {/* Mensagem de Erro */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-semibold flex items-start gap-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Aviso Educado de Configuração do Google (Não impede login por email) */}
          {googleInfoMessage && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium flex items-start gap-2.5 animate-fade-in">
              <Info className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-[11px] block uppercase">Google OAuth Pendente</span>
                <span className="text-[11px] leading-relaxed text-amber-200/90">{googleInfoMessage}</span>
              </div>
            </div>
          )}

          {/* Formulário de Login */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
                Email:
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@foconafarda.com.br"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:border-amber-400 focus:outline-none"
                  autoComplete="email"
                  required
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                  Senha:
                </label>
                <button
                  type="button"
                  onClick={() => onNavigate('/recuperar-senha')}
                  className="text-amber-400 hover:text-amber-300 text-[11px] font-semibold transition"
                >
                  Esqueci minha senha
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:border-amber-400 focus:outline-none"
                  autoComplete="current-password"
                  required
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Botão Entrar */}
            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-tactical font-black text-xs uppercase tracking-widest transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Entrando...</span>
                </>
              ) : (
                <>
                  <span>Entrar</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divisor Visual Tático */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
              <span className="bg-[#0D1829] px-3 text-slate-400">Ou continue com</span>
            </div>
          </div>

          {/* Botão Continuar com Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || isLoading}
            className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800/90 border border-slate-700 hover:border-slate-600 text-white font-semibold text-xs tracking-wide transition shadow-md flex items-center justify-center gap-3 disabled:opacity-50 group"
          >
            {isGoogleLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                <span>Verificando Google...</span>
              </>
            ) : (
              <>
                <div className="p-1 rounded bg-white shrink-0">
                  <GoogleIcon className="w-4 h-4" />
                </div>
                <span className="font-tactical font-bold uppercase tracking-wider text-[11px] group-hover:text-amber-300 transition">
                  Continuar com Google
                </span>
              </>
            )}
          </button>

          {/* Divisor & Link Criar Conta */}
          <div className="pt-4 border-t border-slate-800 text-center space-y-3">
            <p className="text-xs text-slate-400">
              Ainda não possui conta de candidato?
            </p>
            <button
              type="button"
              onClick={() => onNavigate('/cadastro')}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/40 text-amber-300 font-bold text-xs uppercase tracking-wider transition"
            >
              Criar minha conta
            </button>
          </div>
        </div>

        {/* Rodapé Tático */}
        <p className="text-center text-[10px] text-slate-500 mt-6 uppercase tracking-widest font-mono-code">
          FOCO NA FARDA • SEGURANÇA E DISCIPLINA • PLATAFORMA OFICIAL
        </p>
      </div>
    </div>
  );
};
