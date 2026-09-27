import React from 'react';
import { LucideIcon } from 'lucide-react';
import {
  SectionBanner,
  BannerTheme,
  EstudosBanner,
  SimuladosBanner,
  DiagnosticoBanner,
  ConcursosBanner,
} from './SectionBanners';

export {
  EstudosBanner,
  SimuladosBanner,
  DiagnosticoBanner,
  ConcursosBanner,
};

export interface InternalSectionBannerProps {
  badge?: string;
  title: string;
  subtitle: string;
  description?: string;
  icon: LucideIcon;
  actionButton?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  className?: string;
  accentColor?: 'amber' | 'blue' | 'emerald' | 'purple' | 'slate';
  informativeItems?: Array<{ label?: string; text: string }>;
  pedagogicalNote?: string;
}

/**
 * Enhanced InternalSectionBanner adhering to the Zero-Pill discipline,
 * sober professional educational styling, and anti-advertising rules.
 */
export const InternalSectionBanner: React.FC<InternalSectionBannerProps> = ({
  badge,
  title,
  subtitle,
  description = '',
  icon,
  actionButton,
  className = '',
  accentColor = 'amber',
  informativeItems,
  pedagogicalNote,
}) => {
  const sectionLabel = badge ? `${title} · ${badge}` : title;

  return (
    <SectionBanner
      section={sectionLabel}
      title={subtitle}
      description={description}
      icon={icon}
      theme={accentColor as BannerTheme}
      action={actionButton}
      className={className}
      informativeItems={informativeItems}
      pedagogicalNote={pedagogicalNote}
    />
  );
};
