import React, { useState } from 'react';
import {
  getStoredSupabaseConfig,
  saveStoredSupabaseConfig,
  testSupabaseConnection,
} from '../../services/supabaseClient';
import { Database, Key, CheckCircle2, AlertCircle, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

interface SupabaseConfigBannerProps {
  onConfigSaved?: () => void;
}

export const SupabaseConfigBanner: React.FC<SupabaseConfigBannerProps> = ({ onConfigSaved }) => {
  const currentConfig = getStoredSupabaseConfig();
  const isConfigured = Boolean(currentConfig.url && currentConfig.anonKey);

  const [isOpen, setIsOpen] = useState(!isConfigured);
  const [url, setUrl] = useState(currentConfig.url || '');
  const [anonKey, setAnonKey] = useState(currentConfig.anonKey || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; success: boolean } | null>(null);

  if (isConfigured && !isOpen) {
    return (
      <div className="mb-4 flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Supabase Auth conectado: <span className="font-mono-code font-bold">{currentConfig.url.replace(/^https?:\/\//, '').split('.')[0]}</span></span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="text-[11px] underline hover:text-emerald-200"
        >
          Editar credenciais
        </button>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !anonKey.trim()) {
      setMessage({ text: 'Preencha a URL e a Chave Anônima do Supabase.', success: false });
      return;
    }

    setSaving(true);
    setMessage(null);

    const newConfig = { url: url.trim(), anonKey: anonKey.trim() };
    saveStoredSupabaseConfig(newConfig);

    const test = await testSupabaseConnection(newConfig);
    setSaving(false);

    if (test.success) {
      setMessage({ text: 'Conexão com o Supabase estabelecida com sucesso!', success: true });
      if (onConfigSaved) onConfigSaved();
      setTimeout(() => setIsOpen(false), 1500);
    } else {
      setMessage({ text: test.message, success: false });
    }
  };

  return (
    <div className="mb-6 rounded-2xl bg-[#0D1829] border border-amber-500/40 p-4 sm:p-5 shadow-xl text-slate-200 animate-fade-in">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Configuração do Supabase Auth
            </h4>
            <p className="text-[11px] text-slate-400">
              Autenticação real via Supabase. Insira os dados do seu projeto.
            </p>
          </div>
        </div>
        {isConfigured && (
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-white"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        )}
      </div>

      <form onSubmit={handleSave} className="mt-3.5 space-y-3 text-xs">
        <div>
          <label className="block text-slate-300 font-semibold mb-1">
            Project URL do Supabase:
          </label>
          <input
            type="text"
            placeholder="https://xyzcompany.supabase.co"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 font-mono-code text-xs focus:border-amber-400 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">
            Chave Anônima (anon public key):
          </label>
          <input
            type="password"
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            value={anonKey}
            onChange={(e) => setAnonKey(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 font-mono-code text-xs focus:border-amber-400 focus:outline-none"
            required
          />
        </div>

        {message && (
          <div
            className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
              message.success
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                : 'bg-red-500/15 border-red-500/30 text-red-300'
            }`}
          >
            {message.success ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <p className="text-[10px] text-slate-400">
            Salvo localmente no navegador (localStorage).
          </p>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Validando...</span>
              </>
            ) : (
              <span>Conectar Supabase</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
