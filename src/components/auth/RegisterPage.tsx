import React, { useState } from 'react';
import { AuthService } from '../../services/authService';
import { UserProfile } from '../../types';
import { TermsAndPrivacyModal } from './TermsAndPrivacyModal';
import { GoogleIcon } from './GoogleIcon';
import {
  Shield,
  User,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Info,
} from 'lucide-react';

interface RegisterPageProps {
  onSuccess: (user: UserProfile) => void;
  onNavigate: (path: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onSuccess, onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [googleInfoMessage, setGoogleInfoMessage] = useState<string | null>(null);
  const [modalType, setModalType] = useState<'terms' | 'privacy' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setGoogleInfoMessage(null);

    // Validações
    if (!name.trim()) {
      setErrorMessage('Informe seu nome completo ou nome de guerra.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Informe um e-mail válido.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('A confirmação de senha não confere com a senha digitada.');
      return;
    }

    if (!termsAccepted) {
      setErrorMessage('Você deve ler e aceitar os Termos de Uso para prosseguir.');
      return;
    }

    if (!privacyAccepted) {
      setErrorMessage('Você deve ler e estar ciente da Política de Privacidade para prosseguir.');
      return;
    }

    setIsLoading(true);

    const res = await AuthService.register({
      name: name.trim(),
      email: email.trim(),
      password,
      confirmPassword,
      termsAccepted,
      privacyAccepted,
    });

    setIsLoading(false);

    if (res.success && res.data?.user) {
      // Entra diretamente na plataforma com a sessão criada
      onSuccess(res.data.user);
    } else {
      setErrorMessage(res.error || 'Falha ao criar conta. Verifique os dados fornecidos.');
    }
  };

  const handleGoogleRegister = async () => {
    setErrorMessage(null);
    setGoogleInfoMessage(null);
    setIsGoogleLoading(true);

    const res = await AuthService.loginWithGoogle();
    setIsGoogleLoading(false);

    if (!res.success) {
      if (res.error === 'GOOGLE_NOT_CONFIGURED') {
        setGoogleInfoMessage(
          'O cadastro com Google ainda precisa ser configurado com o Client ID no ambiente da plataforma. Por favor, utilize o cadastro por Nome, E-mail e Senha abaixo para ingressar normalmente.'
        );
      } else {
        setErrorMessage(res.error || 'Não foi possível iniciar o cadastro com Google no momento.');
      }
    } else if (res.data?.user) {
      onSuccess(res.data.user);
    }
  };

  const isFormValid =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length >= 6 &&
    confirmPassword === password &&
    termsAccepted &&
    privacyAccepted;

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        {/* Modal de Leitura de Termos e Privacidade */}
        <TermsAndPrivacyModal type={modalType} onClose={() => setModalType(null)} />

        {/* Card Principal de Cadastro */}
        <div className="rounded-2xl bg-[#0D1829] border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
          {/* Cabeçalho */}
          <div className="text-center space-y-2">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 mb-1">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-tactical font-black tracking-wider text-white uppercase">
              NOVO ALISTAMENTO
            </h1>
            <p className="text-xs text-amber-400/90 font-medium">
              Crie sua conta oficial de preparação militar no FOCO NA FARDA
            </p>
          </div>

          {/* Feedback de Erro */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-semibold flex items-start gap-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Aviso Educado de Configuração do Google */}
          {googleInfoMessage && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium flex items-start gap-2.5 animate-fade-in">
              <Info className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-[11px] block uppercase">Google OAuth Pendente</span>
                <span className="text-[11px] leading-relaxed text-amber-200/90">{googleInfoMessage}</span>
              </div>
            </div>
          )}

          {/* Formulário de Cadastro */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Nome Completo */}
            <div>
              <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
                Nome:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome ou nome de guerra"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:border-amber-400 focus:outline-none"
                  autoComplete="name"
                  required
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Email */}
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

            {/* Senha e Confirmar Senha */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
                  Senha:
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:border-amber-400 focus:outline-none"
                    autoComplete="new-password"
                    required
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
                  Confirmar senha:
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita sua senha"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:border-amber-400 focus:outline-none"
                    autoComplete="new-password"
                    required
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Checkbox Termos de Uso */}
            <div className="pt-2 space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-0 bg-slate-800 border-slate-700 mt-0.5"
                  required
                />
                <span className="text-slate-300 text-[11px] leading-relaxed">
                  Li e aceito os{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setModalType('terms');
                    }}
                    className="text-amber-400 font-bold underline hover:text-amber-300"
                  >
                    Termos de Uso
                  </button>
                  .
                </span>
              </label>

              {/* Checkbox Política de Privacidade */}
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={privacyAccepted}
                  onChange={(e) => setPrivacyAccepted(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-0 bg-slate-800 border-slate-700 mt-0.5"
                  required
                />
                <span className="text-slate-300 text-[11px] leading-relaxed">
                  Li e estou ciente da{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setModalType('privacy');
                    }}
                    className="text-amber-400 font-bold underline hover:text-amber-300"
                  >
                    Política de Privacidade
                  </button>
                  .
                </span>
              </label>
            </div>

            {/* Botão de Submissão Criar conta */}
            <button
              type="submit"
              disabled={isLoading || isGoogleLoading || !isFormValid}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-tactical font-black text-xs uppercase tracking-widest transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed mt-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Criando conta...</span>
                </>
              ) : (
                <>
                  <span>Criar conta</span>
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
              <span className="bg-[#0D1829] px-3 text-slate-400">Ou crie sua conta com</span>
            </div>
          </div>

          {/* Botão Criar conta com Google */}
          <button
            type="button"
            onClick={handleGoogleRegister}
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
                  Criar conta com Google
                </span>
              </>
            )}
          </button>

          {/* Rodapé / Link para Login */}
          <div className="pt-4 border-t border-slate-800 text-center space-y-2">
            <p className="text-xs text-slate-400">
              Já possui conta cadastrada?
            </p>
            <button
              type="button"
              onClick={() => onNavigate('/login')}
              className="text-amber-400 hover:text-amber-300 font-bold text-xs uppercase tracking-wider transition underline"
            >
              Voltar e Fazer Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
