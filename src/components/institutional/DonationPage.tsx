import React, { useState } from 'react';
import {
  Heart,
  Shield,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Sparkles,
  Server,
  BookOpen,
  Users,
  Info,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

interface DonationPageProps {
  onNavigate: (path: string) => void;
  isAuthenticated?: boolean;
}

const PRESET_AMOUNTS = [5, 10, 20, 50];

export const DonationPage: React.FC<DonationPageProps> = ({ onNavigate, isAuthenticated = false }) => {
  const [selectedAmount, setSelectedAmount] = useState<number | 'custom'>(10);
  const [customValue, setCustomValue] = useState<string>('30');
  const [frequency, setFrequency] = useState<'once' | 'monthly'>('once');
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);

  const finalAmount = selectedAmount === 'custom' ? parseFloat(customValue.replace(',', '.')) || 0 : selectedAmount;

  const handleDonateClick = () => {
    setShowStatusModal(true);
  };

  return (
    <div className="min-h-screen bg-[#070D1E] text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 w-full bg-[#0A1128]/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3 flex items-center justify-between">
        <button
          onClick={() => onNavigate(isAuthenticated ? '/dashboard' : '/')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-amber-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao {isAuthenticated ? 'Dashboard' : 'Início'}</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-md">
            <Shield className="w-4 h-4" />
          </div>
          <span className="font-tactical font-black text-xs tracking-wider text-white">
            FOCO NA FARDA
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 space-y-10">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-bold font-mono uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Sustentabilidade Comunitária & Independente</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-tactical font-black text-white uppercase tracking-wider">
            APOIE O FOCO NA FARDA
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            O Foco na Farda nasceu com a proposta de ajudar pessoas que estão se preparando para concursos públicos. Se a plataforma estiver sendo útil para você e quiser contribuir com sua manutenção, sua doação ajuda a manter o projeto funcionando.
          </p>
        </section>

        {/* Voluntary Agreement Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-[#0D1829] border border-slate-800 p-5 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-tactical font-black text-white uppercase tracking-wider">
              100% Livre & Gratuito
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Todas as questões, simulados, diagnósticos e radares permanecem acessíveis para todos os estudantes, independente de doação.
            </p>
          </div>

          <div className="rounded-2xl bg-[#0D1829] border border-slate-800 p-5 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-tactical font-black text-white uppercase tracking-wider">
              Apoio Voluntário
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sem vantagens artificiais ou cobranças escondidas. Você doa apenas se puder e se a plataforma estiver gerando valor real para sua rotina.
            </p>
          </div>

          <div className="rounded-2xl bg-[#0D1829] border border-slate-800 p-5 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-tactical font-black text-white uppercase tracking-wider">
              Custos Reais
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              A arrecadação é direcionada à infraestrutura de servidores em nuvem, base de dados e atualização contínua de editais e questões.
            </p>
          </div>
        </section>

        {/* Contribution Selection Card */}
        <section className="rounded-3xl bg-gradient-to-b from-[#0D1829] to-[#0A1322] border border-amber-500/30 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-tactical font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Escolha o valor da sua contribuição
            </h2>
            <p className="text-xs text-slate-400">
              Qualquer valor faz a diferença e ajuda a cobrir os custos operacionais da plataforma.
            </p>
          </div>

          {/* Frequency Toggle */}
          <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <button
              onClick={() => setFrequency('once')}
              className={`px-4 py-2 rounded-lg font-bold transition ${
                frequency === 'once'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Contribuição Única
            </button>
            <button
              onClick={() => setFrequency('monthly')}
              className={`px-4 py-2 rounded-lg font-bold transition ${
                frequency === 'monthly'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Apoio Mensal Recorrente
            </button>
          </div>

          {/* Amount Options Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {PRESET_AMOUNTS.map((amt) => {
              const isSelected = selectedAmount === amt;
              return (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setSelectedAmount(amt)}
                  className={`py-3.5 px-4 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-0.5 ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg shadow-amber-500/10'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-mono text-amber-400 font-bold">R$</span>
                  <span className="text-xl font-tactical font-black">{amt}</span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setSelectedAmount('custom')}
              className={`py-3.5 px-4 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-0.5 ${
                selectedAmount === 'custom'
                  ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg shadow-amber-500/10'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <span className="text-xs font-mono text-amber-400 font-bold">Outro</span>
              <span className="text-sm font-tactical font-black uppercase">Valor</span>
            </button>
          </div>

          {/* Custom Value Input */}
          {selectedAmount === 'custom' && (
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 animate-fade-in">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Digite o valor que deseja doar (R$):
              </label>
              <div className="relative max-w-xs">
                <span className="absolute left-3.5 top-2.5 text-sm font-bold text-amber-400 font-mono">
                  R$
                </span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  placeholder="30"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-base font-bold focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleDonateClick}
              disabled={finalAmount <= 0}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-tactical font-black text-sm uppercase tracking-widest transition shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Heart className="w-5 h-5 fill-slate-950" />
              <span>
                Doar R$ {finalAmount.toFixed(2).replace('.', ',')}{' '}
                {frequency === 'monthly' ? '/ mês' : ''}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              Ambiente preparado para integração com PIX e Gateway de pagamento seguro. Sem taxas abusivas.
            </span>
          </div>
        </section>

        {/* Clarification & FAQ */}
        <section className="space-y-4">
          <h3 className="text-base font-tactical font-black text-white uppercase tracking-wider">
            Perguntas Frequentes sobre o Apoio
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-xl bg-[#0D1829] border border-slate-800 space-y-1.5">
              <h4 className="font-bold text-slate-200">
                Se eu não puder doar, meu acesso será bloqueado?
              </h4>
              <p className="text-slate-400 leading-relaxed">
                De forma alguma. O Foco na Farda é e continuará sendo um projeto educacional de acesso livre. Todas as funcionalidades, banco de questões, simulados, diagnósticos e radares permanecem 100% gratuitos para todos os candidatos.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0D1829] border border-slate-800 space-y-1.5">
              <h4 className="font-bold text-slate-200">
                Quem doa recebe algum conteúdo exclusivo ou vantagem?
              </h4>
              <p className="text-slate-400 leading-relaxed">
                Não. A doação é estritamente um gesto voluntário de apoio para custear os servidores e ferramentas da plataforma. Acreditamos que a preparação para concursos públicos deve ser justa e democrática para todos.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0D1829] border border-slate-800 space-y-1.5">
              <h4 className="font-bold text-slate-200">
                Como os recursos são utilizados?
              </h4>
              <p className="text-slate-400 leading-relaxed">
                Os valores cobrem custos de infraestrutura em nuvem, bancos de dados, armazenamento, domínio e manutenção do ecossistema de estudo, sem necessidade de anúncios invasivos ou pop-ups publicitários que atrapalhem o foco do candidato.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Transparent Integration Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-[#0D1829] border border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
              <Heart className="w-6 h-6 fill-amber-400/20" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-tactical font-black text-white uppercase tracking-wider">
                MUITO OBRIGADO PELO APOIO!
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Você escolheu apoiar o Foco na Farda com o valor de{' '}
                <strong className="text-amber-400 font-bold font-mono">
                  R$ {finalAmount.toFixed(2).replace('.', ',')}
                </strong>
                {frequency === 'monthly' ? ' (mensal)' : ''}.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <Info className="w-4 h-4 shrink-0" />
                <span>Integração de Pagamento em Homologação</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                O módulo oficial de checkout (PIX / Gateway de doações) está sendo configurado no servidor da plataforma. Em conformidade com nossas diretrizes de segurança e transparência, não exibimos chaves financeiras fictícias nem realizamos cobranças não autorizadas.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowStatusModal(false)}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-tactical font-bold text-xs uppercase tracking-wider transition"
            >
              Compreendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
