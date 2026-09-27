import { AuthService } from './authService';
import { AdminDashboardMetrics, AdminUserListItem } from '../types';

export interface VerifyAccessResult {
  authorized: boolean;
  status: number;
  user?: {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'moderator' | 'editor' | 'admin' | 'super_admin';
    isBlocked: boolean;
    createdAt: string;
  };
  permissions?: string[];
  error?: string;
  code?: string;
}

export class AdminService {
  private static async getAuthHeaders(): Promise<HeadersInit> {
    const session = await AuthService.getSession();
    const token = session?.access_token || '';
    const email = session?.user?.email || '';

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (email) {
      headers['X-User-Email'] = email;
    }

    return headers;
  }

  /**
   * Validação autoritativa de acesso ao Admin executada no Backend
   */
  static async verifyAccess(): Promise<VerifyAccessResult> {
    try {
      const headers = await this.getAuthHeaders();
      const res = await fetch('/api/admin/verify-access', {
        method: 'GET',
        headers,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        return {
          authorized: false,
          status: res.status,
          error: data.error || 'Acesso não autorizado pelo servidor.',
          code: data.code || (res.status === 401 ? 'UNAUTHENTICATED' : 'FORBIDDEN'),
        };
      }

      return {
        authorized: Boolean(data.authorized),
        status: 200,
        user: data.user,
        permissions: data.permissions || [],
      };
    } catch (err: any) {
      console.error('Falha de conexão na verificação de acesso ao admin:', err);
      return {
        authorized: false,
        status: 503,
        error: 'Não foi possível contatar o serviço de autenticação administrativa do backend.',
        code: 'NETWORK_ERROR',
      };
    }
  }

  /**
   * Sincroniza usuário com backend garantindo role 'user'
   */
  static async syncUser(id: string, name: string, email: string): Promise<void> {
    try {
      await fetch('/api/admin/sync-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name, email }),
      });
    } catch (e) {
      console.warn('Erro ao sincronizar usuário com backend:', e);
    }
  }

  /**
   * Métricas do Dashboard (8 métricas requeridas)
   */
  static async getDashboardMetrics(): Promise<AdminDashboardMetrics | null> {
    try {
      const headers = await this.getAuthHeaders();
      const res = await fetch('/api/admin/dashboard', { headers });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.error('Erro ao obter métricas do dashboard admin:', e);
      return null;
    }
  }

  /**
   * Lista de Usuários
   */
  static async getUsers(filter?: { search?: string; role?: string; status?: string }): Promise<AdminUserListItem[]> {
    try {
      const headers = await this.getAuthHeaders();
      const params = new URLSearchParams();
      if (filter?.search) params.append('search', filter.search);
      if (filter?.role) params.append('role', filter.role);
      if (filter?.status) params.append('status', filter.status);

      const url = `/api/admin/users${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await fetch(url, { headers });
      if (!res.ok) return [];
      const data = await res.json();
      return data.users || [];
    } catch (e) {
      console.error('Erro ao carregar usuários:', e);
      return [];
    }
  }

  /**
   * Bloquear / Desbloquear Usuário
   */
  static async updateUserStatus(userId: string, isBlocked: boolean): Promise<{ success: boolean; user?: any; error?: string }> {
    try {
      const headers = await this.getAuthHeaders();
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ isBlocked }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Erro ao alterar status.' };
      }
      return { success: true, user: data.user };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Erro de conexão.' };
    }
  }

  /**
   * Alterar Role do Usuário (Apenas Super Admin)
   */
  static async updateUserRole(userId: string, newRole: string): Promise<{ success: boolean; user?: any; error?: string }> {
    try {
      const headers = await this.getAuthHeaders();
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ newRole }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Erro ao alterar role.' };
      }
      return { success: true, user: data.user };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Erro de conexão.' };
    }
  }

  // --- Módulos Adicionais (15 Painéis) ---

  static async getContests(): Promise<any[]> {
    const headers = await this.getAuthHeaders();
    const res = await fetch('/api/admin/contests', { headers });
    return res.ok ? (await res.json()).contests : [];
  }

  static async createContest(data: any): Promise<boolean> {
    const headers = await this.getAuthHeaders();
    const res = await fetch('/api/admin/contests', {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    return res.ok;
  }

  static async deleteContest(id: string): Promise<boolean> {
    const headers = await this.getAuthHeaders();
    const res = await fetch(`/api/admin/contests/${id}`, { method: 'DELETE', headers });
    return res.ok;
  }

  static async getEditais(): Promise<any[]> {
    const headers = await this.getAuthHeaders();
    const res = await fetch('/api/admin/editais', { headers });
    return res.ok ? (await res.json()).editais : [];
  }

  static async createEdital(data: any): Promise<boolean> {
    const headers = await this.getAuthHeaders();
    const res = await fetch('/api/admin/editais', {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    return res.ok;
  }

  static async getOrgaos(): Promise<any[]> {
    const headers = await this.getAuthHeaders();
    const res = await fetch('/api/admin/orgaos', { headers });
    return res.ok ? (await res.json()).orgaos : [];
  }

  static async createOrgao(data: any): Promise<boolean> {
    const headers = await this.getAuthHeaders();
    const res = await fetch('/api/admin/orgaos', {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    return res.ok;
  }

  static async getCargos(): Promise<any[]> {
    const headers = await this.getAuthHeaders();
    const res = await fetch('/api/admin/cargos', { headers });
    return res.ok ? (await res.json()).cargos : [];
  }

  static async createCargo(data: any): Promise<boolean> {
    const headers = await this.getAuthHeaders();
    const res = await fetch('/api/admin/cargos', {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    return res.ok;
  }

  static async getDisciplinas(): Promise<any[]> {
    const headers = await this.getAuthHeaders();
    const res = await fetch('/api/admin/disciplinas', { headers });
    return res.ok ? (await res.json()).disciplinas : [];
  }

  static async createDisciplina(data: any): Promise<boolean> {
    const headers = await this.getAuthHeaders();
    const res = await fetch('/api/admin/disciplinas', {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    return res.ok;
  }

  static async getTopicos(): Promise<any[]> {
    const headers = await this.getAuthHeaders();
    const res = await fetch('/api/admin/topicos', { headers });
    return res.ok ? (await res.json()).topicos : [];
  }

  static async createTopico(data: any): Promise<boolean> {
    const headers = await this.getAuthHeaders();
    const res = await fetch('/api/admin/topicos', {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    return res.ok;
  }

  static async getQuestoes(filter?: { discipline?: string; status?: string }): Promise<any[]> {
    const headers = await this.getAuthHeaders();
    const params = new URLSearchParams();
    if (filter?.discipline) params.append('discipline', filter.discipline);
    if (filter?.status) params.append('status', filter.status);

    const res = await fetch(`/api/admin/questoes${params.toString() ? `?${params.toString()}` : ''}`, { headers });
    return res.ok ? (await res.json()).questoes : [];
  }

  static async createQuestao(data: any): Promise<boolean> {
    const headers = await this.getAuthHeaders();
    const res = await fetch('/api/admin/questoes', {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    return res.ok;
  }

  static async updateQuestaoStatus(id: string, status: string): Promise<boolean> {
    const headers = await this.getAuthHeaders();
    const res = await fetch(`/api/admin/questoes/${id}/status`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status }),
    });
    return res.ok;
  }

  static async deleteQuestao(id: string): Promise<boolean> {
    const headers = await this.getAuthHeaders();
    const res = await fetch(`/api/admin/questoes/${id}`, { method: 'DELETE', headers });
    return res.ok;
  }

  static async getSimulados(): Promise<any[]> {
    const headers = await this.getAuthHeaders();
    const res = await fetch('/api/admin/simulados', { headers });
    return res.ok ? (await res.json()).simulados : [];
  }

  static async createSimulado(data: any): Promise<boolean> {
    const headers = await this.getAuthHeaders();
    const res = await fetch('/api/admin/simulados', {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    return res.ok;
  }

  static async getIAConfig(): Promise<any> {
    const headers = await this.getAuthHeaders();
    const res = await fetch('/api/admin/ia', { headers });
    return res.ok ? await res.json() : null;
  }

  static async toggleAIKillSwitch(active: boolean): Promise<any> {
    const headers = await this.getAuthHeaders();
    const res = await fetch('/api/admin/ia/killswitch', {
      method: 'POST',
      headers,
      body: JSON.stringify({ active }),
    });
    return res.ok ? await res.json() : null;
  }

  static async getEstatisticas(): Promise<any> {
    const headers = await this.getAuthHeaders();
    const res = await fetch('/api/admin/estatisticas', { headers });
    return res.ok ? await res.json() : null;
  }

  static async getLogs(): Promise<any[]> {
    const headers = await this.getAuthHeaders();
    const res = await fetch('/api/admin/logs', { headers });
    return res.ok ? (await res.json()).logs : [];
  }

  static async getSeguranca(): Promise<any> {
    const headers = await this.getAuthHeaders();
    const res = await fetch('/api/admin/seguranca', { headers });
    return res.ok ? await res.json() : null;
  }

  static async getConfiguracoes(): Promise<any> {
    const headers = await this.getAuthHeaders();
    const res = await fetch('/api/admin/configuracoes', { headers });
    return res.ok ? await res.json() : null;
  }

  static async updateConfiguracoes(data: any): Promise<boolean> {
    const headers = await this.getAuthHeaders();
    const res = await fetch('/api/admin/configuracoes', {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    return res.ok;
  }
}
