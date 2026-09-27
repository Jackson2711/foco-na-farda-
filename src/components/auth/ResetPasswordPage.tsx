import React, { useState, useEffect } from 'react';
import { AuthService } from '../../services/authService';
import { Shield, Lock, CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

interface ResetPasswordPageProps {
  onNavigate: (path: string) => void;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onNavigate }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Monitora se há evento de recuperação no hash/query da URL
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('error=')) {
      setErrorMessage('O link de recuperação expirou ou é inválido. Solicite um novo link.');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (newPassword.length < 6) {
      setErrorMessage('A nova senha deve possuir no mínimo 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('As senhas digitadas não coincidem.');
      return;
    }

    setIsLoading(true);

    const res = await AuthService.updatePassword(newPassword);
    setIsLoading(false);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        onNavigate('/login');
      }, 2500);
    } else {
      setErrorMessage(res.error || 'Falha ao redefinir senha. Certifique-se de acessar pelo link oficial de e-mail.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-[#0D1829] border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
          {/* Cabeçalho */}
          <div className="text-center space-y-2">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 mb-1">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-tactical font-black tracking-wider text-white uppercase">
              NOVA SENHA
            </h1>
            <p className="text-xs text-amber-400/90 font-medium">
              Defina sua nova credencial de segurança no Supabase Auth
            </p>
          </div>

          {/* Feedback de Erro */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-semibold flex items-start gap-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Feedback de Sucesso */}
          {success ? (
            <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold space-y-3 animate-fade-in">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Senha atualizada com sucesso!</span>
              </div>
              <p className="text-slate-300 text-xs">
                Sua credencial foi gravada no Supabase. Redirecionando para a tela de login...
              </p>
              <button
                type="button"
                onClick={() => onNavigate('/login')}
                className="w-full py-2 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs uppercase"
              >
                Acessar Login Agora
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
                  Nova Senha:
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                  Confirmar Nova Senha:
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a nova senha"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:border-amber-400 focus:outline-none"
                    autoComplete="new-password"
                    required
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-tactical font-black text-xs uppercase tracking-widest transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Gravando nova senha...</span>
                  </>
                ) : (
                  <>
                    <span>Salvar Nova Senha</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Link para Login */}
          <div className="pt-4 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={() => onNavigate('/login')}
              className="text-amber-400 hover:text-amber-300 text-xs font-semibold transition underline"
            >
              Voltar para o Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
