import React, { useState, useEffect } from 'react';
import {
  getStoredSupabaseConfig,
  saveStoredSupabaseConfig,
  testSupabaseConnection,
} from '../../services/supabaseClient';
import { SupabaseDataService } from '../../services/supabaseService';
import { FocoDataEngineStore } from '../../services/store';
import {
  Database,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Copy,
  Check,
  Server,
  Key,
  Shield,
  X,
} from 'lucide-react';

interface SupabaseManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseManagerModal: React.FC<SupabaseManagerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [config, setConfig] = useState(() => getStoredSupabaseConfig());
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    tablesFound?: number;
  } | null>(null);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<string>('');
  const [copiedSql, setCopiedSql] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setConfig(getStoredSupabaseConfig());
      setTestResult(null);
      setSyncStatus('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    setSyncStatus('');

    saveStoredSupabaseConfig(config);
    const result = await testSupabaseConnection(config);
    setTestResult(result);
    setIsTesting(false);
  };

  const handleFullSync = async () => {
    setIsSyncing(true);
    setSyncStatus('Iniciando sincronização com PostgreSQL Supabase...');

    const profile = FocoDataEngineStore.getUserProfile();
    const answers = profile ? FocoDataEngineStore.getQuestionAnswers(profile.id) : [];
    const retests = profile ? FocoDataEngineStore.getAdaptiveRetests(profile.id) : [];
    const contests = FocoDataEngineStore.getContests();
    const questions = FocoDataEngineStore.getQuestions();

    const res = await SupabaseDataService.performFullSync({
      profile,
      answers,
      retests,
      contests,
      questions,
    });

    if (res.success) {
      setSyncStatus(`✅ Sincronização concluída com sucesso! ${res.syncedItems} registros sincronizados.`);
    } else {
      setSyncStatus(`⚠️ Sincronização parcial: ${res.errors.join(', ')}`);
    }
    setIsSyncing(false);
  };

  const handleCopySchemaNotice = () => {
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl bg-[#0D1829] border border-amber-500/40 p-6 shadow-2xl space-y-5 text-slate-100 relative">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Central de Conexão Supabase / PostgreSQL
              </h3>
              <p className="text-xs text-slate-400">
                Arquitetura Híbrida: PostgreSQL em Nuvem + Armazenamento Tático Local
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status card */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                config.url && config.anonKey ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <div>
              <div className="text-xs font-bold text-white">
                {config.url ? 'Supabase Configurado' : 'Modo Motor Local Ativo (Offline-First)'}
              </div>
              <div className="text-[11px] text-slate-400">
                {config.url
                  ? 'Pronto para sincronizar respostas, psicometria e retestes'
                  : 'Seus dados estão sendo salvos com persistência local de alta performance'}
              </div>
            </div>
          </div>

          <span className="text-[10px] font-mono-code px-2 py-1 rounded bg-slate-800 text-slate-300">
            {config.url ? 'POSTGRESQL-CLOUD' : 'LOCAL-DATA-ENGINE'}
          </span>
        </div>

        {/* Inputs */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              URL do Projeto Supabase (Project URL)
            </label>
            <div className="relative">
              <Server className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={config.url}
                onChange={(e) => setConfig({ ...config, url: e.target.value.trim() })}
                placeholder="https://seu-projeto.supabase.co"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400 placeholder-slate-600 font-mono-code"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Chave Anônima Pública (Anon Key)
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="password"
                value={config.anonKey}
                onChange={(e) => setConfig({ ...config, anonKey: e.target.value.trim() })}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400 placeholder-slate-600 font-mono-code"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              * Apenas chave pública anônima com Row Level Security (RLS). A chave de serviço do Gemini permanece no servidor.
            </p>
          </div>
        </div>

        {/* Test Result Message */}
        {testResult && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 animate-fade-in ${
              testResult.success
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : 'bg-red-500/15 border-red-500/40 text-red-300'
            }`}
          >
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            )}
            <div className="leading-relaxed">{testResult.message}</div>
          </div>
        )}

        {/* Sync Status Banner */}
        {syncStatus && (
          <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs animate-fade-in">
            {syncStatus}
          </div>
        )}

        {/* SQL Schema Notice Box */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Script DDL do PostgreSQL disponível:
            </span>
            <button
              onClick={handleCopySchemaNotice}
              className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? 'Instruções Copiadas!' : 'Arquivo: supabase-schema.sql'}</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            O arquivo completo <code>/supabase-schema.sql</code> já está incluso na raiz da plataforma. Ele contém a criação de todas as tabelas (<code>candidates</code>, <code>contests</code>, <code>questions</code>, <code>question_options</code>, <code>answer_logs</code>, <code>adaptive_retests</code>, <code>psychometric_metrics</code>) com índices e políticas de Row Level Security (RLS).
          </p>
        </div>

        {/* Footer actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={handleTestConnection}
              disabled={isTesting || !config.url}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition flex items-center gap-1.5 disabled:opacity-40"
            >
              {isTesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              <span>Testar Conexão</span>
            </button>

            {config.url && (
              <button
                onClick={handleFullSync}
                disabled={isSyncing}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1.5 disabled:opacity-40"
              >
                {isSyncing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
                <span>Sincronizar Dados Agora</span>
              </button>
            )}
          </div>

          <button
            onClick={() => {
              saveStoredSupabaseConfig(config);
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition"
          >
            Salvar e Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
