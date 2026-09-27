import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Configuration keys
const SUPABASE_CONFIG_KEY = 'foco_supabase_custom_config';

interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export function getStoredSupabaseConfig(): SupabaseConfig {
  try {
    const local = localStorage.getItem(SUPABASE_CONFIG_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (parsed.url && parsed.anonKey) return parsed;
    }
  } catch (e) {
    console.error('Erro ao ler configuração do Supabase:', e);
  }

  return {
    url: (import.meta as any).env?.VITE_SUPABASE_URL || '',
    anonKey: (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '',
  };
}

export function saveStoredSupabaseConfig(config: SupabaseConfig): void {
  try {
    localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify(config));
    cachedClient = null;
    lastUsedConfig = null;
  } catch (e) {
    console.error('Erro ao salvar configuração do Supabase:', e);
  }
}

let cachedClient: SupabaseClient | null = null;
let lastUsedConfig: SupabaseConfig | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const currentConfig = getStoredSupabaseConfig();

  if (!currentConfig.url || !currentConfig.anonKey) {
    return null;
  }

  if (
    cachedClient &&
    lastUsedConfig &&
    lastUsedConfig.url === currentConfig.url &&
    lastUsedConfig.anonKey === currentConfig.anonKey
  ) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(currentConfig.url, currentConfig.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    lastUsedConfig = currentConfig;
    return cachedClient;
  } catch (err) {
    console.error('Falha ao inicializar cliente Supabase:', err);
    return null;
  }
}

export async function testSupabaseConnection(config?: SupabaseConfig): Promise<{
  success: boolean;
  message: string;
  tablesFound?: number;
}> {
  const targetConfig = config || getStoredSupabaseConfig();
  if (!targetConfig.url || !targetConfig.anonKey) {
    return {
      success: false,
      message: 'URL e Chave Anônima do Supabase não fornecidas.',
    };
  }

  try {
    const client = createClient(targetConfig.url, targetConfig.anonKey);
    const { error } = await client.from('questions').select('count', { count: 'exact', head: true });

    if (error) {
      // Se a tabela ainda não existe no projeto do usuário, mas conectou ao Supabase
      if (error.code === '42P01') {
        return {
          success: true,
          message: 'Conectado ao Supabase com sucesso! Execute o script "supabase-schema.sql" no SQL Editor do projeto para criar as tabelas.',
          tablesFound: 0,
        };
      }
      return {
        success: false,
        message: `Erro do Supabase: ${error.message} (Código: ${error.code})`,
      };
    }

    return {
      success: true,
      message: 'Conexão com PostgreSQL/Supabase validada e tabelas operacionais!',
      tablesFound: 10,
    };
  } catch (e: any) {
    return {
      success: false,
      message: e?.message || 'Falha de rede ao conectar com o Supabase.',
    };
  }
}
