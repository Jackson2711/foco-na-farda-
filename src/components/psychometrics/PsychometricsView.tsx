import React, { useState } from 'react';
import { UserProfile, PsychometricMetrics, Career, Contest } from '../../types';
import { FocoDataEngineStore } from '../../services/store';
import { DiagnosticoBanner } from '../common/SectionBanners';
import {
  diagnosePatternsWithAI,
  getRecoveryPlanWithAI,
} from '../../services/aiService';
import {
  Brain,
  AlertTriangle,
  Target,
  Zap,
  Activity,
  Award,
  BookOpen,
  Sparkles,
  Loader2,
  ChevronRight,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  XCircle,
  HelpCircle,
  FileQuestion,
} from 'lucide-react';

interface PsychometricsViewProps {
  user: UserProfile;
  onNavigateToQuestions: () => void;
  onNavigateToRetest?: () => void;
}

export const PsychometricsView: React.FC<PsychometricsViewProps> = ({
  user,
  onNavigateToQuestions,
  onNavigateToRetest,
}) => {
  const [metrics, setMetrics] = useState<PsychometricMetrics>(() =>
    FocoDataEngineStore.getPsychometricMetrics(user.id)
  );

  // AI Diagnostic State
  const [aiReport, setAiReport] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string>('');

  // Recovery Plan State
  const [recoveryTopic, setRecoveryTopic] = useState<{ topic: string; discipline: string; errorRate: number } | null>(null);
  const [recoveryPlan, setRecoveryPlan] = useState<string>('');
  const [recoveryLoading, setRecoveryLoading] = useState<boolean>(false);

  const careers: Career[] = FocoDataEngineStore.getCareers();
  const contests: Contest[] = FocoDataEngineStore.getContests();
  const targetCareer = careers.find((c) => c.id === user.targetCareerId)?.name;
  const targetContest = contests.find((c) => c.id === user.targetContestId)?.title;

  const handleGenerateReport = async () => {
    setAiLoading(true);
    setAiError('');
    try {
      const report = await diagnosePatternsWithAI({
        metrics,
        targetCareer,
        targetContest,
      });
      setAiReport(report);
    } catch (e: any) {
      setAiError(e?.message || 'Falha ao gerar laudo psicométrico com a IA.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerateRecoveryPlan = async (item: { topic: string; discipline: string; errorRate: number }) => {
    setRecoveryTopic(item);
    setRecoveryLoading(true);
    try {
      const plan = await getRecoveryPlanWithAI({
        topic: item.topic,
        discipline: item.discipline,
        failureRate: item.errorRate,
      });
      setRecoveryPlan(plan);
    } catch {
      setRecoveryPlan(
        '1. Reler os dispositivos legais pertinentes à matéria.\n2. Resolver 15 questões de estilo da banca.\n3. Agendar reteste em 24h.'
      );
    } finally {
      setRecoveryLoading(false);
    }
  };

  // Prepara dados de tipos de erros
  const totalErrors = metrics.totalAnswered - metrics.totalCorrect;
  const errorEntries = [
    { type: 'Conceito', label: 'Erro de Conceito', count: metrics.errorDistribution.Conceito, desc: 'Lacuna na fundamentação teórica ou doutrina', color: 'bg-blue-500' },
    { type: 'Interpretacao_Pegadinha', label: 'Interpretação / Pegadinha', count: metrics.errorDistribution.Interpretacao_Pegadinha, desc: 'Capturado por distrator ativo e sutil da banca', color: 'bg-amber-500' },
    { type: 'Atencao_Leitura', label: 'Atenção e Leitura', count: metrics.errorDistribution.Atencao_Leitura, desc: 'Leitura rápida; palavras restritivas ("exceto", "vedado")', color: 'bg-rose-500' },
    { type: 'Memorizacao', label: 'Memorização e Prazos', count: metrics.errorDistribution.Memorizacao, desc: 'Esquecimento de prazos, quóruns, penas ou artigos', color: 'bg-purple-500' },
    { type: 'Chute', label: 'Chute / Insegurança', count: metrics.errorDistribution.Chute, desc: 'Marcação aleatória sem eliminação técnica', color: 'bg-slate-500' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Banner Informativo: DIAGNÓSTICO */}
      <DiagnosticoBanner
        action={{
          label: aiLoading ? 'Gerando Laudo...' : 'Emitir Laudo com IA',
          onClick: handleGenerateReport,
        }}
      />

      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-tactical font-black text-white uppercase tracking-wider flex items-center gap-2.5">
            <Brain className="w-6 h-6 text-purple-400" />
            Psicometria Educacional & Pontos Cegos
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Análise comportamental do candidato: elimine a falsa certeza (Dunning-Kruger) e identifique distratores recorrentes.
          </p>
        </div>

        {onNavigateToRetest && (
          <button
            onClick={onNavigateToRetest}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-white hover:border-purple-400 transition text-xs font-bold flex items-center gap-2 self-stretch sm:self-auto justify-center"
          >
            <Zap className="w-4 h-4 text-purple-400" />
            <span>Reteste Adaptativo</span>
          </button>
        )}
      </div>

      {/* Top 4 KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Taxa de Domínio Real */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0B132B] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Domínio Real</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono-code">
              {metrics.accuracyRate}%
            </span>
            <span className="text-[11px] text-slate-400">
              ({metrics.totalCorrect}/{metrics.totalAnswered})
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Acurácia geral em questões resolvidas</p>
        </div>

        {/* Efeito Dunning-Kruger (Erros Críticos com Certeza) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0B132B] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Pontos Cegos Críticos</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono-code">
              {metrics.blindSpotsCount}
            </span>
            <span className="text-[11px] text-amber-400/80 font-bold">
              ({metrics.dunningKrugerIndex}% dos erros)
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Erros cometidos sob a certeza de estar certo
          </p>
        </div>

        {/* Precisão sob Dúvida (50/50) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0B132B] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Precisão sob Dúvida</span>
            <Brain className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-blue-400 font-mono-code">
              {metrics.confidenceAccuracy.duvidaAccuracy}%
            </span>
            <span className="text-[11px] text-slate-400">
              ({metrics.confidenceAccuracy.duvidaCorrect}/{metrics.confidenceAccuracy.duvidaTotal})
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Taxa de acerto quando dividido entre 2 opções</p>
        </div>

        {/* Taxa de Retenção Adaptativa */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0B132B] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Retenção Consolidada</span>
            <Zap className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono-code">
              {metrics.retentionRateScore}%
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Taxa de sucesso nos ciclos de reteste</p>
        </div>
      </div>

      {/* AI Diagnostic Report Banner (Se gerado) */}
      {aiReport && (
        <div className="p-6 rounded-2xl bg-[#0D1829] border border-amber-500/40 space-y-4 animate-fade-in shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Laudo Psicométrico & Plano de Ação Estratégico
                </h3>
                <span className="text-[10px] text-amber-400 font-mono-code">
                  GERADO COM GEMINI API • FOCO NA FARDA
                </span>
              </div>
            </div>
            <button
              onClick={() => setAiReport('')}
              className="text-xs text-slate-400 hover:text-white"
            >
              Fechar
            </button>
          </div>

          <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-normal space-y-2">
            {aiReport}
          </div>
        </div>
      )}

      {/* Recovery Plan Modal / Box (Se ativado) */}
      {recoveryTopic && (
        <div className="p-6 rounded-2xl bg-[#0A1226] border border-orange-500/50 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-400" />
              <h4 className="text-sm font-bold text-white">
                Protocolo de Choque de 48 Horas: {recoveryTopic.topic}
              </h4>
            </div>
            <button
              onClick={() => setRecoveryTopic(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {recoveryLoading ? (
            <div className="flex items-center justify-center py-6 text-slate-400 gap-2">
              <Loader2 className="w-5 h-5 text-orange-400 animate-spin" />
              <span className="text-xs font-semibold">Montando protocolo de choque com a IA...</span>
            </div>
          ) : (
            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
              {recoveryPlan}
            </div>
          )}
        </div>
      )}

      {/* Main Analysis Section: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Distribuição de Tipos de Erro */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0B132B] border border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">
                Distribuição dos Tipos de Erro
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono-code">
              Total de Falhas: {totalErrors}
            </span>
          </div>

          {totalErrors === 0 ? (
            <div className="py-10 text-center text-slate-500 text-xs">
              Você ainda não registrou erros no sistema. Resolva questões para mapear seus padrões!
            </div>
          ) : (
            <div className="space-y-4">
              {errorEntries.map((item) => {
                const percentage = totalErrors > 0 ? Math.round((item.count / totalErrors) * 100) : 0;
                return (
                  <div key={item.type} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white">{item.label}</span>
                        <span className="text-[10px] text-slate-400 block">{item.desc}</span>
                      </div>
                      <span className="font-mono-code font-bold text-amber-400">
                        {item.count} ({percentage}%)
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.color} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Radar de Atração de Distratores */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0B132B] border border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-orange-400" />
              <h3 className="text-sm font-bold text-white">
                Radar de Atração de Distratores da Banca
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">Armadilhas que mais te capturam</span>
          </div>

          <div className="space-y-3.5">
            {[
              {
                role: 'InversaoRegra',
                label: 'Inversão de Regra ou Sentido',
                data: metrics.distractorVulnerabilities.InversaoRegra,
                tip: 'A banca inverte "circulando" por "ingressando", ou quem tem competência.',
              },
              {
                role: 'PrazoNumero',
                label: 'Prazos, Penas e Números Alterados',
                data: metrics.distractorVulnerabilities.PrazoNumero,
                tip: 'Troca 24h por 48h, 15 dias por 30 dias, quóruns qualificados.',
              },
              {
                role: 'PegadinhaSemantica',
                label: 'Pegadinhas Semânticas (Somente / Nunca)',
                data: metrics.distractorVulnerabilities.PegadinhaSemantica,
                tip: 'Palavras restritivas absolutas que tornam a assertiva falsa.',
              },
              {
                role: 'Conceitual',
                label: 'Confusão Conceitual / Institucional',
                data: metrics.distractorVulnerabilities.Conceitual,
                tip: 'Confunde competência da Polícia Federal com Civil, ou DETRAN com AMC.',
              },
              {
                role: 'GeneralizacaoIndevida',
                label: 'Generalização Indevida ou Extrapolação',
                data: metrics.distractorVulnerabilities.GeneralizacaoIndevida,
                tip: 'Aplica uma regra específica de forma ampla onde não há previsão.',
              },
            ].map((dist) => (
              <div key={dist.role} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/90 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">{dist.label}</span>
                  <span className="font-mono-code font-bold text-orange-400">
                    {dist.data.count} vezes ({dist.data.percentage}%)
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">{dist.tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Weak Topics & Action Table */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0B132B] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-bold text-white">
              Tópicos de Maior Vulnerabilidade (Mapa de Calor)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">Prioridade Máxima de Revisão</span>
        </div>

        {metrics.topWeakTopics.length === 0 ? (
          <div className="py-6 text-center text-slate-500 text-xs">
            Nenhum tópico crítico identificado ainda. Continue respondendo questões!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {metrics.topWeakTopics.map((top) => (
              <div
                key={top.topic}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span>{top.discipline}</span>
                    <span className="font-bold text-rose-400 font-mono-code">
                      {top.errorRate}% falha
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-xs">{top.topic}</h4>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Errou {top.errors} de {top.total} tentativas
                  </div>
                </div>

                <button
                  onClick={() => handleGenerateRecoveryPlan(top)}
                  className="w-full py-2 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-400 hover:bg-orange-500/25 text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Plano de Choque 48h</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
