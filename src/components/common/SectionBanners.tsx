import React from 'react';
import {
  BookOpen,
  FileQuestion,
  Award,
  Clock,
  Brain,
  TrendingUp,
  Compass,
  MapPin,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  LucideIcon,
} from 'lucide-react';

export type BannerTheme = 'amber' | 'blue' | 'purple' | 'emerald' | 'slate';

export interface SectionBannerProps {
  /** Unboxed section category/kicker, e.g. "ESTUDOS" */
  section: string;
  /** Primary pedagogical slogan/headline */
  title: string;
  /** Informative contextual description (non-promotional) */
  description: string;
  /** Visual primary icon */
  icon: LucideIcon;
  /** Color theme for accents and subtle highlights */
  theme?: BannerTheme;
  /** Key informative items rendered with clean unboxed typographic separators */
  informativeItems?: Array<{ label?: string; text: string }>;
  /** Optional informational notice / guideline note */
  pedagogicalNote?: string;
  /** Optional interactive action (e.g. quick button or filter trigger) */
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  className?: string;
  /** Compact density variant for smaller container contexts */
  compact?: boolean;
}

const THEME_STYLES: Record<
  BannerTheme,
  {
    border: string;
    glow: string;
    kicker: string;
    iconContainer: string;
    iconColor: string;
    bulletDot: string;
    actionBtn: string;
  }
> = {
  amber: {
    border: 'border-amber-500/20',
    glow: 'from-amber-500/8 via-amber-500/3 to-transparent',
    kicker: 'text-amber-400',
    iconContainer: 'bg-amber-500/10 border-amber-500/25 text-amber-400',
    iconColor: 'text-amber-400',
    bulletDot: 'bg-amber-400',
    actionBtn: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold',
  },
  blue: {
    border: 'border-sky-500/20',
    glow: 'from-sky-500/8 via-sky-500/3 to-transparent',
    kicker: 'text-sky-400',
    iconContainer: 'bg-sky-500/10 border-sky-500/25 text-sky-400',
    iconColor: 'text-sky-400',
    bulletDot: 'bg-sky-400',
    actionBtn: 'bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold',
  },
  purple: {
    border: 'border-purple-500/20',
    glow: 'from-purple-500/8 via-purple-500/3 to-transparent',
    kicker: 'text-purple-400',
    iconContainer: 'bg-purple-500/10 border-purple-500/25 text-purple-400',
    iconColor: 'text-purple-400',
    bulletDot: 'bg-purple-400',
    actionBtn: 'bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold',
  },
  emerald: {
    border: 'border-emerald-500/20',
    glow: 'from-emerald-500/8 via-emerald-500/3 to-transparent',
    kicker: 'text-emerald-400',
    iconContainer: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400',
    iconColor: 'text-emerald-400',
    bulletDot: 'bg-emerald-400',
    actionBtn: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold',
  },
  slate: {
    border: 'border-slate-700/60',
    glow: 'from-slate-700/20 via-slate-800/10 to-transparent',
    kicker: 'text-slate-400',
    iconContainer: 'bg-slate-800 border-slate-700 text-slate-300',
    iconColor: 'text-slate-300',
    bulletDot: 'bg-slate-400',
    actionBtn: 'bg-slate-800 hover:bg-slate-700 text-white font-medium border border-slate-700',
  },
};

/**
 * Modern, clean, unboxed section banner designed specifically for
 * pedagogical clarity, professional dignity, and non-commercial integrity.
 */
export const SectionBanner: React.FC<SectionBannerProps> = ({
  section,
  title,
  description,
  icon: Icon,
  theme = 'amber',
  informativeItems,
  pedagogicalNote,
  action,
  className = '',
  compact = false,
}) => {
  const styles = THEME_STYLES[theme] || THEME_STYLES.amber;

  return (
    <section
      aria-label={`Painel informativo de ${section}`}
      className={`relative overflow-hidden rounded-2xl bg-[#0B132B]/95 border ${styles.border} shadow-lg transition-colors ${
        compact ? 'p-4 sm:p-5' : 'p-5 sm:p-6 lg:p-7'
      } ${className}`}
    >
      {/* Subtle non-intrusive directional gradient scrim */}
      <div
        className={`pointer-events-none absolute -right-16 -top-16 w-80 h-80 rounded-full bg-gradient-to-br ${styles.glow} blur-3xl`}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-start justify-between gap-5">
        <div className="flex items-start gap-4">
          {/* Section Icon Box */}
          <div
            className={`shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl ${styles.iconContainer} border flex items-center justify-center shadow-inner`}
          >
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
          </div>

          <div className="space-y-1.5 min-w-0 flex-1">
            {/* Unboxed Kicker (Zero-Pill Discipline) */}
            <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wider uppercase">
              <span className={styles.kicker}>{section}</span>
              <span className="text-slate-600" aria-hidden="true">
                ·
              </span>
              <span className="text-slate-400 font-normal normal-case">
                Guia Pedagógico
              </span>
            </div>

            {/* Primary Slogan Title */}
            <h2 className="text-lg sm:text-xl lg:text-2xl font-tactical font-black text-white tracking-wide leading-tight text-balance">
              {title}
            </h2>

            {/* Informative Guidance Description */}
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed pt-0.5">
              {description}
            </p>

            {/* Informative Metadata / Method Facets (Clean unboxed text with typographic separators) */}
            {informativeItems && informativeItems.length > 0 && (
              <div className="pt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-400">
                {informativeItems.map((item, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && (
                      <span className="text-slate-600 select-none" aria-hidden="true">
                        ·
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${styles.bulletDot} opacity-80 shrink-0`}
                        aria-hidden="true"
                      />
                      {item.label ? (
                        <span>
                          <strong className="text-slate-200 font-medium">
                            {item.label}:
                          </strong>{' '}
                          {item.text}
                        </span>
                      ) : (
                        <span>{item.text}</span>
                      )}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* Pedagogical Note / Practical Tip */}
            {pedagogicalNote && (
              <div className="pt-2 flex items-start gap-2 text-xs text-slate-400 bg-slate-900/60 border border-slate-800/80 rounded-xl px-3.5 py-2 mt-2">
                <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong className="text-slate-200 font-semibold">Orientação de estudo:</strong>{' '}
                  {pedagogicalNote}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Button (Optional, clean and unhyped) */}
        {action && (
          <div className="pt-1 lg:pt-0 shrink-0 self-start sm:self-auto w-full sm:w-auto">
            <button
              type="button"
              onClick={action.onClick}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition ${styles.actionBtn}`}
            >
              <span>{action.label}</span>
              {action.icon ? (
                <action.icon className="w-4 h-4" aria-hidden="true" />
              ) : (
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

/* =========================================================================
 * 1. BANNER DE ESTUDOS
 * Slogan solicitado: "Seu próximo avanço começa com uma questão."
 * ========================================================================= */
export interface EstudosBannerProps {
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  compact?: boolean;
}

export const EstudosBanner: React.FC<EstudosBannerProps> = ({
  action,
  className = '',
  compact = false,
}) => {
  return (
    <SectionBanner
      section="ESTUDOS"
      title="Seu próximo avanço começa com uma questão."
      description="A fixação ativa por assertivas comentadas consolida o raciocínio exigido pelas bancas examinadoras. Cada erro mapeado economiza pontos valiosos no dia da prova oficial."
      icon={BookOpen}
      theme="amber"
      informativeItems={[
        { label: 'Metodologia', text: 'Resolução ativa com fundamentação legal' },
        { label: 'Dissecação', text: 'Análise aprofundada de distratores e pegadinhas' },
        { label: 'Retenção', text: 'Revisão espaçada dos conceitos de maior incidência' },
      ]}
      pedagogicalNote="Antes de assinalar a alternativa, identifique o elemento normativo que valida a assertiva e justifique mentalmente a exclusão dos distratores."
      action={action}
      className={className}
      compact={compact}
    />
  );
};

/* =========================================================================
 * 2. BANNER DE SIMULADOS
 * Slogan solicitado: "Teste seu conhecimento sob pressão."
 * ========================================================================= */
export interface SimuladosBannerProps {
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  compact?: boolean;
}

export const SimuladosBanner: React.FC<SimuladosBannerProps> = ({
  action,
  className = '',
  compact = false,
}) => {
  return (
    <SectionBanner
      section="SIMULADOS"
      title="Teste seu conhecimento sob pressão."
      description="Ambiente de calibração que reproduz fielmente as condições do edital: cronômetro contínuo, gestão do tempo por questão e treino emocional contra o cansaço."
      icon={Award}
      theme="blue"
      informativeItems={[
        { label: 'Ambiente', text: 'Cronometragem ininterrupta padrão de prova' },
        { label: 'Rigor', text: 'Sem consulta a gabarito ou comentários durante a sessão' },
        { label: 'Pós-prova', text: 'Métricas instantâneas de rendimento líquido e tempo médio' },
      ]}
      pedagogicalNote="Mantenha média de 2 a 3 minutos por questão. Quando encontrar enunciados truncados, marque para revisão e garanta os pontos das assertivas diretas primeiro."
      action={action}
      className={className}
      compact={compact}
    />
  );
};

/* =========================================================================
 * 3. BANNER DE DIAGNÓSTICO
 * Slogan solicitado: "Descubra onde você precisa melhorar."
 * ========================================================================= */
export interface DiagnosticoBannerProps {
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  compact?: boolean;
}

export const DiagnosticoBanner: React.FC<DiagnosticoBannerProps> = ({
  action,
  className = '',
  compact = false,
}) => {
  return (
    <SectionBanner
      section="DIAGNÓSTICO"
      title="Descubra onde você precisa melhorar."
      description="Mapeamento pedagógico que classifica cada erro entre lacuna teórica, leitura apressada ou indução por distrator da banca, eliminando o efeito de falsa certeza."
      icon={Brain}
      theme="purple"
      informativeItems={[
        { label: 'Classificação', text: 'Separação entre erro de conceito, atenção e prazo' },
        { label: 'Falsa Certeza', text: 'Detecção de vulnerabilidades com alta convicção prévia' },
        { label: 'Recuperação', text: 'Geração de ciclo de reforço nas disciplinas críticas' },
      ]}
      pedagogicalNote="Erros recorrentes de atenção demandam desaceleração na leitura de comandos restritivos (como 'exceto', 'vedado' e 'correto')."
      action={action}
      className={className}
      compact={compact}
    />
  );
};

/* =========================================================================
 * 4. BANNER DE CONCURSOS
 * Slogan solicitado: "Encontre oportunidades em todo o Brasil."
 * ========================================================================= */
export interface ConcursosBannerProps {
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  compact?: boolean;
}

export const ConcursosBanner: React.FC<ConcursosBannerProps> = ({
  action,
  className = '',
  compact = false,
}) => {
  return (
    <SectionBanner
      section="CONCURSOS"
      title="Encontre oportunidades em todo o Brasil."
      description="Panorama contínuo de editais abertos, autorizados e comissões formadas para carreiras públicas e segurança em todas as esferas e regiões do país."
      icon={Compass}
      theme="emerald"
      informativeItems={[
        { label: 'Abrangência', text: 'Oportunidades federais, estaduais e municipais' },
        { label: 'Filtros', text: 'Seleção técnica por carreira, banca, escolaridade e remuneração' },
        { label: 'Dados Reais', text: 'Informações baseadas em publicações em Diários Oficiais' },
      ]}
      pedagogicalNote="Acompanhar comissões formadas permite iniciar o ciclo de estudos com 6 a 12 meses de antecedência em relação ao edital publicado."
      action={action}
      className={className}
      compact={compact}
    />
  );
};
