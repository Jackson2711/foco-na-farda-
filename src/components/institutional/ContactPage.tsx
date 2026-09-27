import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, Clock, Shield, AlertCircle } from 'lucide-react';
import { InstitutionalHeader } from './InstitutionalHeader';
import { PLATFORM_INFO } from './TermsPage';

interface ContactPageProps {
  onNavigate: (path: string) => void;
  isAuthenticated?: boolean;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate, isAuthenticated = false }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Dúvida Pedagógica');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setSending(true);
    // Simula envio de contato
    setTimeout(() => {
      setSending(false);
      setSentSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#070D1E] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      <InstitutionalHeader onNavigate={onNavigate} isAuthenticated={isAuthenticated} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#0C152B] via-slate-900 to-[#0A1128] border border-amber-500/30 p-6 sm:p-8 shadow-xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono-code font-bold uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            <span>Canal Oficial de Atendimento</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-tactical font-black text-white uppercase tracking-wider">
            Central de Contato e Suporte
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Precisa de auxílio técnico, tem sugestões sobre novos editais de concursos ou deseja tirar dúvidas sobre sua conta? Envie uma mensagem diretamente para a equipe do <strong>{PLATFORM_INFO.platformName}</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Informações de Contato e Prazos */}
          <div className="md:col-span-5 space-y-4">
            <div className="rounded-2xl bg-[#0D1829] border border-slate-800 p-6 space-y-4 text-xs">
              <h3 className="text-sm font-tactical font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400" />
                Canais Oficiais
              </h3>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Suporte e Atendimento Geral:
                  </span>
                  <a
                    href={`mailto:${PLATFORM_INFO.contactEmail}`}
                    className="text-amber-400 font-bold hover:underline font-mono-code text-xs block"
                  >
                    {PLATFORM_INFO.contactEmail}
                  </a>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Encarregado de Privacidade (LGPD):
                  </span>
                  <a
                    href={`mailto:${PLATFORM_INFO.dpoEmail}`}
                    className="text-amber-400 font-bold hover:underline font-mono-code text-xs block"
                  >
                    {PLATFORM_INFO.dpoEmail}
                  </a>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-slate-300 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Tempo de Resposta Médio:</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Até 24 horas úteis (Segunda a Sexta, das 08h às 18h - Horário de Brasília).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário de Envio */}
          <div className="md:col-span-7">
            <div className="rounded-2xl bg-[#0D1829] border border-slate-800 p-6 sm:p-8 space-y-4">
              <h3 className="text-sm font-tactical font-bold text-white uppercase tracking-wider">
                Envie sua Mensagem
              </h3>

              {sentSuccess && (
                <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-start gap-2.5 animate-fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm">Mensagem enviada com sucesso!</p>
                    <p className="text-slate-300 text-xs mt-1">
                      Nossa equipe responderá em breve através do e-mail informado.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
                    Seu Nome:
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome completo ou de guerra"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:border-amber-400 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
                    Seu E-mail:
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemplo@email.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:border-amber-400 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
                    Assunto do Contato:
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Dúvida Pedagógica">Dúvida sobre Questões ou Gabarito</option>
                    <option value="Sugestão de Concurso">Sugestão de Novo Concurso / Edital</option>
                    <option value="Suporte Tecnico">Problema Técnico ou Acesso</option>
                    <option value="Privacidade LGPD">Privacidade e Dados Pessoais (LGPD)</option>
                    <option value="Outro">Outro Assunto</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
                    Mensagem Detalhada:
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Descreva sua solicitação com o máximo de detalhes para agilizar o atendimento..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:border-amber-400 focus:outline-none resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-tactical font-black text-xs uppercase tracking-widest transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{sending ? 'Transmitindo Mensagem...' : 'Enviar Mensagem'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
