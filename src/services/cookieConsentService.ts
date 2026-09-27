export interface CookiePreferences {
  necessary: boolean; // Sempre true
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
  consentedAt: string;
  version: string;
}

const COOKIE_CONSENT_KEY = 'foco_cookie_consent_preferences';
const CURRENT_VERSION = '1.0';

export class CookieConsentService {
  /**
   * Obtém as preferências salvas no localStorage
   */
  static getConsent(): CookiePreferences | null {
    try {
      const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed.necessary === 'boolean') {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Erro ao ler consentimento de cookies:', e);
    }
    return null;
  }

  /**
   * Verifica se o usuário já tomou uma decisão sobre cookies
   */
  static hasAnswered(): boolean {
    return this.getConsent() !== null;
  }

  /**
   * Salva preferências customizadas
   */
  static saveConsent(prefs: {
    preferences: boolean;
    analytics: boolean;
    marketing: boolean;
  }): CookiePreferences {
    const consent: CookiePreferences = {
      necessary: true,
      preferences: Boolean(prefs.preferences),
      analytics: Boolean(prefs.analytics),
      marketing: Boolean(prefs.marketing),
      consentedAt: new Date().toISOString(),
      version: CURRENT_VERSION,
    };

    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
      window.dispatchEvent(new CustomEvent('cookie_consent_updated', { detail: consent }));
    } catch (e) {
      console.error('Erro ao salvar consentimento de cookies:', e);
    }

    return consent;
  }

  /**
   * Aceita todos os cookies
   */
  static acceptAll(): CookiePreferences {
    return this.saveConsent({
      preferences: true,
      analytics: true,
      marketing: true,
    });
  }

  /**
   * Recusa todos os cookies não essenciais
   */
  static rejectNonEssential(): CookiePreferences {
    return this.saveConsent({
      preferences: false,
      analytics: false,
      marketing: false,
    });
  }

  /**
   * Abre o modal de preferências via evento global
   */
  static openPreferencesModal(): void {
    window.dispatchEvent(new CustomEvent('open_cookie_preferences'));
  }
}
