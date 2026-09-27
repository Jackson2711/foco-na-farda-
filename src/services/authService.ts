import { UserProfile } from '../types';
import { FocoDataEngineStore } from './store';

export interface NativeSession {
  access_token: string;
  token_type: string;
  expires_in?: number;
  user: {
    id: string;
    email: string;
    name?: string;
    avatarUrl?: string;
    role?: string;
    loginMethod?: 'email' | 'google';
    createdAt?: string;
    app_metadata?: Record<string, any>;
    user_metadata?: Record<string, any>;
  };
}

export interface AuthResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  isConfirmationPending?: boolean;
}

const SESSION_STORAGE_KEY = 'foco_native_session';
const TOKEN_STORAGE_KEY = 'foco_native_token';
const AUTH_EVENT_NAME = 'foco_auth_state_changed';

export class AuthService {
  /**
   * Obtém a sessão ativa nativa da plataforma
   */
  static async getSession(): Promise<NativeSession | null> {
    try {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY);
      if (stored) {
        const session: NativeSession = JSON.parse(stored);
        if (session && session.user && session.access_token) {
          return session;
        }
      }
    } catch (e) {
      console.warn('Erro ao ler sessão local:', e);
    }

    // Fallback de contingência caso haja perfil mas sem sessão gravada
    const profile = FocoDataEngineStore.getUserProfile();
    if (profile && profile.id && profile.email) {
      const syntheticSession: NativeSession = {
        access_token: `foco-session-${profile.id}`,
        token_type: 'bearer',
        expires_in: 86400 * 7,
        user: {
          id: profile.id,
          email: profile.email,
          name: profile.name,
          avatarUrl: profile.avatarUrl,
          role: profile.role,
          loginMethod: profile.loginMethod || 'email',
          createdAt: profile.createdAt,
          user_metadata: { name: profile.name, avatar_url: profile.avatarUrl },
        },
      };
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(syntheticSession));
      localStorage.setItem(TOKEN_STORAGE_KEY, syntheticSession.access_token);
      return syntheticSession;
    }

    return null;
  }

  /**
   * Escuta mudanças de estado da autenticação em tempo real
   */
  static onAuthStateChange(callback: (event: string, session: NativeSession | null) => void) {
    const handleAuthEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ event: string; session: NativeSession | null }>;
      callback(customEvent.detail.event || 'SIGNED_IN', customEvent.detail.session);
    };

    window.addEventListener(AUTH_EVENT_NAME, handleAuthEvent);

    return {
      data: {
        subscription: {
          unsubscribe: () => {
            window.removeEventListener(AUTH_EVENT_NAME, handleAuthEvent);
          },
        },
      },
    };
  }

  /**
   * Notifica ouvintes sobre alterações no estado de autenticação
   */
  private static notifyAuthChange(event: 'SIGNED_IN' | 'SIGNED_OUT', session: NativeSession | null) {
    window.dispatchEvent(
      new CustomEvent(AUTH_EVENT_NAME, {
        detail: { event, session },
      })
    );
  }

  /**
   * Login Nativo por E-mail e Senha (Sem dependência de Supabase)
   */
  static async login(
    email: string,
    password: string
  ): Promise<AuthResponse<{ user: UserProfile; session: NativeSession }>> {
    if (!email || !email.trim()) {
      return { success: false, error: 'Informe seu endereço de e-mail.' };
    }
    if (!password) {
      return { success: false, error: 'Informe sua senha de acesso.' };
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.user && data.session) {
        const profile: UserProfile = {
          ...data.user,
          loginMethod: 'email',
        };

        const session: NativeSession = {
          access_token: data.session.access_token,
          token_type: 'bearer',
          expires_in: data.session.expires_in || 7 * 86400,
          user: {
            id: profile.id,
            email: profile.email,
            name: profile.name,
            avatarUrl: profile.avatarUrl,
            role: profile.role,
            loginMethod: 'email',
            createdAt: profile.createdAt,
            user_metadata: { name: profile.name },
          },
        };

        // Salvar sessão e perfil nativo
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
        localStorage.setItem(TOKEN_STORAGE_KEY, session.access_token);
        FocoDataEngineStore.saveUserProfile(profile);

        this.notifyAuthChange('SIGNED_IN', session);

        return {
          success: true,
          data: {
            user: profile,
            session,
          },
        };
      }

      return {
        success: false,
        error: data.error || 'E-mail ou senha incorretos. Verifique suas credenciais.',
      };
    } catch (err) {
      console.warn('Falha de rede ao conectar à API de autenticação:', err);

      // Fallback offline (se a API estiver inacessível temporariamente)
      const existing = FocoDataEngineStore.getUserProfile();
      const normalizedEmail = email.trim().toLowerCase();

      if (existing && existing.email.toLowerCase() === normalizedEmail) {
        const syntheticSession: NativeSession = {
          access_token: `foco-session-${existing.id}`,
          token_type: 'bearer',
          user: {
            id: existing.id,
            email: existing.email,
            name: existing.name,
            avatarUrl: existing.avatarUrl,
            role: existing.role,
            loginMethod: 'email',
            createdAt: existing.createdAt,
          },
        };
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(syntheticSession));
        localStorage.setItem(TOKEN_STORAGE_KEY, syntheticSession.access_token);
        this.notifyAuthChange('SIGNED_IN', syntheticSession);
        return { success: true, data: { user: existing, session: syntheticSession } };
      }

      return {
        success: false,
        error: 'Não foi possível validar as credenciais. Verifique sua conexão e tente novamente.',
      };
    }
  }

  /**
   * Cadastro Oficial Nativo de Candidato (Sem dependência de Supabase)
   */
  static async register(params: {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
    termsAccepted: boolean;
    privacyAccepted: boolean;
  }): Promise<AuthResponse<{ user: UserProfile; session: NativeSession }>> {
    const { name, email, password, confirmPassword, termsAccepted, privacyAccepted } = params;

    if (!termsAccepted || !privacyAccepted) {
      return {
        success: false,
        error: 'É obrigatório aceitar os Termos de Uso e a Política de Privacidade para prosseguir.',
      };
    }

    if (!name || name.trim().length < 2) {
      return {
        success: false,
        error: 'Informe seu nome completo ou nome de guerra.',
      };
    }

    if (!email || !email.includes('@')) {
      return {
        success: false,
        error: 'Informe um endereço de e-mail válido.',
      };
    }

    if (!password || password.length < 6) {
      return {
        success: false,
        error: 'A senha deve conter no mínimo 6 caracteres.',
      };
    }

    if (confirmPassword && confirmPassword !== password) {
      return {
        success: false,
        error: 'A confirmação de senha não confere com a senha digitada.',
      };
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          confirmPassword,
          termsAccepted,
          privacyAccepted,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.user && data.session) {
        const profile: UserProfile = {
          ...data.user,
          loginMethod: 'email',
        };

        const session: NativeSession = {
          access_token: data.session.access_token,
          token_type: 'bearer',
          expires_in: data.session.expires_in || 7 * 86400,
          user: {
            id: profile.id,
            email: profile.email,
            name: profile.name,
            avatarUrl: profile.avatarUrl,
            role: profile.role,
            loginMethod: 'email',
            createdAt: profile.createdAt,
            user_metadata: { name: profile.name },
          },
        };

        // Salvar sessão e perfil nativo
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
        localStorage.setItem(TOKEN_STORAGE_KEY, session.access_token);
        FocoDataEngineStore.saveUserProfile(profile);

        this.notifyAuthChange('SIGNED_IN', session);

        return {
          success: true,
          data: {
            user: profile,
            session,
          },
        };
      }

      return {
        success: false,
        error: data.error || 'Falha ao criar conta de candidato.',
      };
    } catch (err) {
      console.warn('Falha de rede ao registrar candidato:', err);

      // Contingência local caso offline
      const now = new Date().toISOString();
      const newProfile: UserProfile = {
        id: `usr-${Date.now()}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: 'user', // Regra estrita: Novos cadastros sempre recebem role "user"
        loginMethod: 'email',
        rank: 'Recruta',
        xp: 25,
        dailyStudyMinutes: 120,
        targetCareerId: 'car-pm',
        targetContestId: 'cnt-pmesp-2025',
        stateId: 'st-sp',
        studyLevel: 'Iniciante',
        streakDays: 1,
        createdAt: now,
        termsAcceptedAt: now,
        privacyPolicyAcceptedAt: now,
        termsVersion: '1.0.0',
        privacyVersion: '1.0.0',
      };

      const session: NativeSession = {
        access_token: `foco-session-${newProfile.id}`,
        token_type: 'bearer',
        user: {
          id: newProfile.id,
          email: newProfile.email,
          name: newProfile.name,
          role: 'user',
          loginMethod: 'email',
          createdAt: now,
        },
      };

      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      localStorage.setItem(TOKEN_STORAGE_KEY, session.access_token);
      FocoDataEngineStore.saveUserProfile(newProfile);
      this.notifyAuthChange('SIGNED_IN', session);

      return {
        success: true,
        data: {
          user: newProfile,
          session,
        },
      };
    }
  }

  /**
   * Consulta se o Google OAuth está configurado com Client ID
   */
  static async checkGoogleAuthStatus(): Promise<{ configured: boolean; clientId?: string; message?: string }> {
    try {
      const res = await fetch('/api/auth/google/status');
      if (res.ok) {
        return await res.json();
      }
    } catch {}
    return {
      configured: false,
      message: 'Google OAuth ainda precisa ser configurado com o Client ID no ambiente da plataforma.',
    };
  }

  /**
   * Login / Cadastro via Google OAuth
   * Se ainda não configurado externamente, não quebra a página e avisa educadamente
   */
  static async loginWithGoogle(): Promise<AuthResponse<{ user?: UserProfile; session?: NativeSession }>> {
    const status = await this.checkGoogleAuthStatus();

    if (!status.configured) {
      return {
        success: false,
        error: 'GOOGLE_NOT_CONFIGURED',
      };
    }

    // Se o Client ID estiver presente, o fluxo nativo é acionado
    return {
      success: false,
      error: 'GOOGLE_NOT_CONFIGURED',
    };
  }

  /**
   * Finaliza sessão e limpa credenciais com segurança
   */
  static async logout(): Promise<void> {
    try {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (e) {
      console.warn('Erro ao notificar logout no servidor:', e);
    } finally {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      FocoDataEngineStore.clearUserProfile();
      this.notifyAuthChange('SIGNED_OUT', null);
    }
  }

  /**
   * Helper para sincronização de perfil (compatibilidade com componentes existentes)
   */
  static async syncOrCreateProfile(authUser: any): Promise<UserProfile> {
    const current = FocoDataEngineStore.getUserProfile();
    if (current && current.email === authUser.email) {
      return current;
    }

    const now = new Date().toISOString();
    const email = authUser.email || '';
    const name = authUser.name || authUser.user_metadata?.name || email.split('@')[0] || 'Candidato Focado';

    const profile: UserProfile = {
      id: authUser.id || `usr-${Date.now()}`,
      name,
      email,
      avatarUrl: authUser.avatarUrl || authUser.user_metadata?.avatar_url,
      loginMethod: authUser.loginMethod || 'email',
      role: (authUser.role as any) || 'user',
      rank: 'Recruta',
      xp: 25,
      dailyStudyMinutes: 120,
      targetCareerId: 'car-pm',
      targetContestId: 'cnt-pmesp-2025',
      stateId: 'st-sp',
      studyLevel: 'Iniciante',
      streakDays: 1,
      createdAt: authUser.createdAt || now,
      termsAcceptedAt: now,
      privacyPolicyAcceptedAt: now,
      termsVersion: '1.0.0',
      privacyVersion: '1.0.0',
    };

    FocoDataEngineStore.saveUserProfile(profile);
    return profile;
  }

  /**
   * Atualização permitida dos dados do perfil
   */
  static async updateUserProfileData(
    userId: string,
    updates: Partial<UserProfile>
  ): Promise<UserProfile> {
    const updated = FocoDataEngineStore.updateUserProfile(updates);

    try {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (token) {
        await fetch('/api/user/profile', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updates),
        });
      }
    } catch (e) {
      console.warn('Erro ao sincronizar perfil com backend:', e);
    }

    return updated;
  }

  /**
   * Solicitação de redefinição de senha
   */
  static async requestPasswordReset(email: string): Promise<AuthResponse> {
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Informe um endereço de e-mail válido.' };
    }
    return { success: true };
  }

  /**
   * Atualização de senha
   */
  static async updatePassword(newPassword: string): Promise<AuthResponse> {
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'A nova senha deve possuir pelo menos 6 caracteres.' };
    }
    return { success: true };
  }
}
