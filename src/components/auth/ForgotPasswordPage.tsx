import React, { useState } from 'react';
import { AuthService } from '../../services/authService';
import { Shield, Mail, ArrowLeft, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface ForgotPasswordPageProps {
  onNavigate: (path: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Informe um e-mail válido para recuperação.');
      return;
    }

    setIsLoading(true);

    const res = await AuthService.requestPasswordReset(email.trim());
    setIsLoading(false);

    if (res.success) {
      setSuccessMessage(
        'Instruções de recuperação de senha enviadas! Verifique sua caixa de entrada e pasta de spam.'
      );
    } else {
      setErrorMessage(res.error || 'Não foi possível solicitar a recuperação. Verifique os dados digitados.');
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
              RECUPERAÇÃO TÁTICA
            </h1>
            <p className="text-xs text-amber-400/90 font-medium">
              Informe seu e-mail cadastrado para redefinir sua credencial
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
          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-start gap-2.5 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              <div>
                <p>{successMessage}</p>
                <p className="text-[11px] text-emerald-200/80 mt-1">
                  O link abrirá a tela oficial de redefinição de senha com seu token de segurança.
                </p>
              </div>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
                E-mail cadastrado na plataforma:
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-tactical font-black text-xs uppercase tracking-widest transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enviando solicitação...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Enviar Link de Recuperação</span>
                </>
              )}
            </button>
          </form>

          {/* Voltar ao Login */}
          <div className="pt-4 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={() => onNavigate('/login')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar para o Login</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
