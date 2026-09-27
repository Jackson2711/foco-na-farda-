import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldAlert,
  Users,
  Award,
  BookOpen,
  FileText,
  Building,
  Briefcase,
  Layers,
  HelpCircle,
  FileQuestion,
  Brain,
  BarChart3,
  ListFilter,
  Lock,
  Settings,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Trash2,
  Edit,
  Eye,
  Calendar,
  DollarSign,
  MapPin,
  ExternalLink,
  Power,
  ChevronRight,
  UserCheck,
  UserX,
  X,
  Zap,
} from 'lucide-react';
import { UserProfile, AdminDashboardMetrics, AdminUserListItem } from '../../types';
import { AdminService, VerifyAccessResult } from '../../services/adminService';
import { AdminAccessDenied } from './AdminAccessDenied';

interface AdminPanelProps {
  currentUser: UserProfile;
  onNavigate: (tab: string) => void;
  onLogout: () => void;
  onSwitchToAdminAccount?: () => void;
}

type AdminMenuTab =
  | 'dashboard'
  | 'usuarios'
  | 'concursos'
  | 'editais'
  | 'orgaos'
  | 'cargos'
  | 'disciplinas'
  | 'topicos'
  | 'questoes'
  | 'simulados'
  | 'ia'
  | 'estatisticas'
  | 'logs'
  | 'seguranca'
  | 'configuracoes';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  currentUser,
  onNavigate,
  onLogout,
  onSwitchToAdminAccount,
}) => {
  // Estado de verificação autoritativa do Backend
  const [authStatus, setAuthStatus] = useState<VerifyAccessResult | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(true);

  // Tab ativa entre os 15 módulos
  const [activeTab, setActiveTab] = useState<AdminMenuTab>('dashboard');

  // Dados dos módulos
  const [metrics, setMetrics] = useState<AdminDashboardMetrics | null>(null);
  const [usersList, setUsersList] = useState<AdminUserListItem[]>([]);
  const [userSearch, setUserSearch] = useState<string>('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [userStatusFilter, setUserStatusFilter] = useState<string>('all');
  const [selectedUserDetail, setSelectedUserDetail] = useState<AdminUserListItem | null>(null);

  // Módulos adicionais
  const [contests, setContests] = useState<any[]>([]);
  const [editais, setEditais] = useState<any[]>([]);
  const [orgaos, setOrgaos] = useState<any[]>([]);
  const [cargos, setCargos] = useState<any[]>([]);
  const [disciplinas, setDisciplinas] = useState<any[]>([]);
  const [topicos, setTopicos] = useState<any[]>([]);
  const [questoes, setQuestoes] = useState<any[]>([]);
  const [simulados, setSimulados] = useState<any[]>([]);
  const [iaConfig, setIaConfig] = useState<any>(null);
  const [statsData, setStatsData] = useState<any>(null);
  const [logsList, setLogsList] = useState<any[]>([]);
  const [securityData, setSecurityData] = useState<any>(null);
  const [systemConfig, setSystemConfig] = useState<any>(null);

  // Modais de Criação
  const [showAddContestModal, setShowAddContestModal] = useState<boolean>(false);
  const [showAddQuestionModal, setShowAddQuestionModal] = useState<boolean>(false);
  const [showAddEditalModal, setShowAddEditalModal] = useState<boolean>(false);

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // 1. Verificação autoritativa do Backend ao carregar
  useEffect(() => {
    let mounted = true;
    async function checkServerAuthorization() {
      setIsVerifying(true);
      try {
        const result = await AdminService.verifyAccess();
        if (mounted) {
          setAuthStatus(result);
          if (result.authorized) {
            loadInitialData();
          }
        }
      } catch (err: any) {
        if (mounted) {
          setAuthStatus({
            authorized: false,
            status: 500,
            error: 'Erro ao validar autorização com o backend.',
          });
        }
      } finally {
        if (mounted) setIsVerifying(false);
      }
    }

    checkServerAuthorization();
    return () => {
      mounted = false;
    };
  }, []);

  const loadInitialData = async () => {
    const [m, u] = await Promise.all([
      AdminService.getDashboardMetrics(),
      AdminService.getUsers(),
    ]);
    if (m) setMetrics(m);
    setUsersList(u);
  };

  // Carrega dados específicos ao trocar de tab
  useEffect(() => {
    if (!authStatus?.authorized) return;

    switch (activeTab) {
      case 'dashboard':
        AdminService.getDashboardMetrics().then((m) => m && setMetrics(m));
        break;
      case 'usuarios':
        AdminService.getUsers({
          search: userSearch,
          role: userRoleFilter,
          status: userStatusFilter,
        }).then((u) => setUsersList(u));
        break;
      case 'concursos':
        AdminService.getContests().then((c) => setContests(c));
        break;
      case 'editais':
        AdminService.getEditais().then((e) => setEditais(e));
        break;
      case 'orgaos':
        AdminService.getOrgaos().then((o) => setOrgaos(o));
        break;
      case 'cargos':
        AdminService.getCargos().then((c) => setCargos(c));
        break;
      case 'disciplinas':
        AdminService.getDisciplinas().then((d) => setDisciplinas(d));
        break;
      case 'topicos':
        AdminService.getTopicos().then((t) => setTopicos(t));
        break;
      case 'questoes':
        AdminService.getQuestoes().then((q) => setQuestoes(q));
        break;
      case 'simulados':
        AdminService.getSimulados().then((s) => setSimulados(s));
        break;
      case 'ia':
        AdminService.getIAConfig().then((ia) => setIaConfig(ia));
        break;
      case 'estatisticas':
        AdminService.getEstatisticas().then((st) => setStatsData(st));
        break;
      case 'logs':
        AdminService.getLogs().then((l) => setLogsList(l));
        break;
      case 'seguranca':
        AdminService.getSeguranca().then((sec) => setSecurityData(sec));
        break;
      case 'configuracoes':
        AdminService.getConfiguracoes().then((cfg) => setSystemConfig(cfg));
        break;
    }
  }, [activeTab, authStatus?.authorized]);

  // Se estiver verificando credenciais com o servidor
  if (isVerifying) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 animate-pulse">
          <Shield className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-tactical font-black text-white uppercase tracking-wider">
          Validando Autorização no Servidor...
        </h3>
        <p className="text-xs text-slate-400 mt-2 font-mono">
          Checando perfil RBAC e credenciais criptográficas com o backend.
        </p>
      </div>
    );
  }

  // Se o backend rejeitou o acesso (401 ou 403 Forbidden)
  if (!authStatus?.authorized) {
    return (
      <AdminAccessDenied
        user={currentUser}
        errorMessage={authStatus?.error}
        onNavigate={onNavigate}
        onLogout={onLogout}
        onSwitchToAdminAccount={onSwitchToAdminAccount}
      />
    );
  }

  // Ações de Usuário
  const handleToggleBlockUser = async (user: AdminUserListItem) => {
    const nextStatus = !user.isBlocked;
    const res = await AdminService.updateUserStatus(user.id, nextStatus);
    if (res.success) {
      showToast(
        nextStatus
          ? `Usuário ${user.name} bloqueado com sucesso.`
          : `Usuário ${user.name} desbloqueado com sucesso.`
      );
      setUsersList((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isBlocked: nextStatus } : u))
      );
      if (selectedUserDetail?.id === user.id) {
        setSelectedUserDetail({ ...selectedUserDetail, isBlocked: nextStatus });
      }
    } else {
      showToast(res.error || 'Falha ao atualizar status.', 'error');
    }
  };

  const handleChangeRole = async (userId: string, newRole: string) => {
    const res = await AdminService.updateUserRole(userId, newRole);
    if (res.success) {
      showToast(`Papel de usuário atualizado para '${newRole}'.`);
      setUsersList((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole as any } : u))
      );
      if (selectedUserDetail?.id === userId) {
        setSelectedUserDetail({ ...selectedUserDetail, role: newRole as any });
      }
    } else {
      showToast(res.error || 'Falha ao alterar papel.', 'error');
    }
  };

  const handleToggleKillSwitch = async (active: boolean) => {
    const res = await AdminService.toggleAIKillSwitch(active);
    if (res?.success) {
      showToast(res.message);
      setIaConfig((prev: any) => ({
        ...prev,
        settings: { ...prev?.settings, killSwitchActive: active },
        metrics: {
          ...prev?.metrics,
          killSwitchStatus: active ? 'ATIVADO (IA BLOQUEADA)' : 'DESATIVADO (IA OPERACIONAL)',
        },
      }));
    }
  };

  // 15 Itens do Menu Admin
  const menuItems: { id: AdminMenuTab; label: string; icon: any; count?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'usuarios', label: 'Usuários', icon: Users, count: metrics?.totalUsers },
    { id: 'concursos', label: 'Concursos', icon: Award, count: metrics?.totalContests },
    { id: 'editais', label: 'Editais', icon: FileText, count: metrics?.totalEditais },
    { id: 'orgaos', label: 'Órgãos', icon: Building },
    { id: 'cargos', label: 'Cargos', icon: Briefcase },
    { id: 'disciplinas', label: 'Disciplinas', icon: BookOpen },
    { id: 'topicos', label: 'Tópicos', icon: Layers },
    { id: 'questoes', label: 'Questões', icon: FileQuestion, count: metrics?.totalQuestions },
    { id: 'simulados', label: 'Simulados', icon: HelpCircle },
    { id: 'ia', label: 'IA & Kill Switch', icon: Brain },
    { id: 'estatisticas', label: 'Estatísticas', icon: Zap },
    { id: 'logs', label: 'Logs & Auditoria', icon: ListFilter },
    { id: 'seguranca', label: 'Segurança', icon: ShieldAlert },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
  ];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Super Admin
          </span>
        );
      case 'admin':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Admin
          </span>
        );
      case 'editor':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
            Editor
          </span>
        );
      case 'moderator':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Moderador
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
            Aluno (user)
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border text-xs font-bold transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-950 border-emerald-500/50 text-emerald-200'
              : 'bg-red-950 border-red-500/50 text-red-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-400" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top Header Administrativo */}
      <div className="rounded-3xl bg-[#0B132B] border border-slate-800 p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-wider">
                Centro de Comando Tático
              </span>
              <span className="text-slate-500 text-xs">•</span>
              <span className="text-slate-400 text-xs font-mono">RBAC Backend Ativo</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black font-tactical text-white uppercase tracking-wider mt-1">
              Painel Administrativo Privado
            </h1>
            <p className="text-xs text-slate-400">
              Operando como <strong className="text-white">{authStatus.user?.name}</strong> ({authStatus.user?.email}) • Role:{' '}
              <span className="text-amber-400 font-bold uppercase">{authStatus.user?.role}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-xs font-bold text-slate-300 transition-all cursor-pointer"
          >
            Visão do Aluno
          </button>
          <button
            onClick={onLogout}
            className="px-3.5 py-2 rounded-xl bg-red-950/40 border border-red-800/40 hover:bg-red-900/40 text-xs font-bold text-red-300 transition-all cursor-pointer"
          >
            Encerrar Sessão
          </button>
        </div>
      </div>

      {/* Menu com os 15 Módulos Exigidos */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800 border-b border-slate-800/80">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/70 border border-slate-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
              {typeof item.count === 'number' && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ==================================================================== */}
      {/* 1. ABA DASHBOARD (8 Métricas Exigidas) */}
      {/* ==================================================================== */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Métrica 1: Total de Usuários */}
            <div className="rounded-2xl bg-[#0D1829] border border-slate-800 p-5 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Total de Usuários</span>
                <Users className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-3xl font-black font-tactical text-white">
                {metrics?.totalUsers ?? '...'}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Candidatos e administradores</p>
            </div>

            {/* Métrica 2: Usuários Ativos */}
            <div className="rounded-2xl bg-[#0D1829] border border-slate-800 p-5 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Usuários Ativos</span>
                <UserCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-3xl font-black font-tactical text-emerald-400">
                {metrics?.activeUsers ?? '...'}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Contas não bloqueadas</p>
            </div>

            {/* Métrica 3: Total de Questões */}
            <div className="rounded-2xl bg-[#0D1829] border border-slate-800 p-5 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Total de Questões</span>
                <FileQuestion className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-3xl font-black font-tactical text-white">
                {metrics?.totalQuestions ?? '...'}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">No banco nacional</p>
            </div>

            {/* Métrica 4: Total de Concursos */}
            <div className="rounded-2xl bg-[#0D1829] border border-slate-800 p-5 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Total de Concursos</span>
                <Award className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-3xl font-black font-tactical text-white">
                {metrics?.totalContests ?? '...'}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Mapeados no Radar</p>
            </div>

            {/* Métrica 5: Total de Editais */}
            <div className="rounded-2xl bg-[#0D1829] border border-slate-800 p-5 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Total de Editais</span>
                <FileText className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="text-3xl font-black font-tactical text-white">
                {metrics?.totalEditais ?? '...'}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Sincronizados e vigentes</p>
            </div>

            {/* Métrica 6: Questões Respondidas */}
            <div className="rounded-2xl bg-[#0D1829] border border-slate-800 p-5 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Questões Respondidas</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-3xl font-black font-tactical text-white">
                {metrics?.questionsAnswered?.toLocaleString('pt-BR') ?? '...'}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Volume acumulado de treinos</p>
            </div>

            {/* Métrica 7: Uso da IA */}
            <div className="rounded-2xl bg-[#0D1829] border border-slate-800 p-5 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Uso da IA</span>
                <Brain className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-3xl font-black font-tactical text-white">
                {metrics?.aiUsage?.totalCalls ?? '...'}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-mono">
                Tokens: ~{(metrics?.aiUsage?.tokensEstimated ?? 0) / 1000}k • Cache:{' '}
                {metrics?.aiUsage?.cacheHitRatePercentage}%
              </p>
            </div>

            {/* Métrica 8: Conteúdos Pendentes de Revisão */}
            <div className="rounded-2xl bg-[#0D1829] border border-slate-800 p-5 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Pendentes de Revisão</span>
                <HelpCircle className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-3xl font-black font-tactical text-amber-400">
                {metrics?.pendingReviewsCount ?? '...'}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Aguardando aprovação</p>
            </div>
          </div>

          {/* Quick Actions & Status Geral */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-3xl bg-[#0D1829] border border-slate-800 p-6 space-y-4">
              <h3 className="text-sm font-tactical font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Ações Rápidas de Gestão
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <button
                  onClick={() => setActiveTab('usuarios')}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-left transition-all cursor-pointer"
                >
                  <Users className="w-4 h-4 text-amber-400 mb-1" />
                  <div className="font-bold text-white">Gerenciar Usuários</div>
                  <div className="text-[10px] text-slate-400">Pesquisar, bloquear e roles</div>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('concursos');
                    setShowAddContestModal(true);
                  }}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-left transition-all cursor-pointer"
                >
                  <Award className="w-4 h-4 text-purple-400 mb-1" />
                  <div className="font-bold text-white">Novo Concurso</div>
                  <div className="text-[10px] text-slate-400">Adicionar edital ou vaga</div>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('questoes');
                    setShowAddQuestionModal(true);
                  }}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-left transition-all cursor-pointer"
                >
                  <FileQuestion className="w-4 h-4 text-blue-400 mb-1" />
                  <div className="font-bold text-white">Nova Questão</div>
                  <div className="text-[10px] text-slate-400">Cadastrar no banco</div>
                </button>
                <button
                  onClick={() => setActiveTab('ia')}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-left transition-all cursor-pointer"
                >
                  <Power className="w-4 h-4 text-red-400 mb-1" />
                  <div className="font-bold text-white">Kill Switch IA</div>
                  <div className="text-[10px] text-slate-400">Controle de emergência</div>
                </button>
              </div>
            </div>

            <div className="rounded-3xl bg-[#0D1829] border border-slate-800 p-6 space-y-4">
              <h3 className="text-sm font-tactical font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                Blindagem e Governança do Backend
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">Validação de Sessão:</span>
                  <span className="text-emerald-400 font-mono font-bold">100% Autoritativa no Servidor</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">Controle de Permissões:</span>
                  <span className="text-amber-400 font-mono font-bold">RBAC com 5 Níveis de Acesso</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">Proteção contra Elevação:</span>
                  <span className="text-white font-mono font-bold">Role não-editável no frontend</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. ABA USUÁRIOS (Pesquisa, Status, Role, Bloqueio, Cadastro, Sem Senha) */}
      {/* ==================================================================== */}
      {activeTab === 'usuarios' && (
        <div className="space-y-4">
          <div className="rounded-3xl bg-[#0D1829] border border-slate-800 p-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-tactical font-black text-white uppercase tracking-wider">
                  Diretório Administrativo de Usuários
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pesquise, visualize papéis, gerencie bloqueios e status dos candidatos e operadores.
                </p>
              </div>

              {/* Filtros de Pesquisa */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Pesquisar por nome ou e-mail..."
                    className="pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500 w-56 sm:w-64"
                  />
                </div>

                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="all">Todas as Roles</option>
                  <option value="user">user (Aluno)</option>
                  <option value="moderator">moderator</option>
                  <option value="editor">editor</option>
                  <option value="admin">admin</option>
                  <option value="super_admin">super_admin</option>
                </select>

                <select
                  value={userStatusFilter}
                  onChange={(e) => setUserStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="all">Todos os Status</option>
                  <option value="active">Ativos</option>
                  <option value="blocked">Bloqueados</option>
                </select>
              </div>
            </div>

            {/* Tabela de Usuários */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Candidato / Usuário</th>
                    <th className="p-3.5">Papel (Role)</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Data de Cadastro</th>
                    <th className="p-3.5">Carreira Alvo</th>
                    <th className="p-3.5 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                  {usersList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-500">
                        Nenhum usuário localizado com os filtros informados.
                      </td>
                    </tr>
                  ) : (
                    usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5">
                          <div className="font-bold text-white">{u.name}</div>
                          <div className="text-slate-400 text-[11px] font-mono">{u.email}</div>
                        </td>
                        <td className="p-3.5">{getRoleBadge(u.role)}</td>
                        <td className="p-3.5">
                          {u.isBlocked ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-400">
                              <XCircle className="w-3.5 h-3.5" /> Bloqueado
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Ativo
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                          {new Date(u.createdAt).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="p-3.5 text-slate-300">{u.targetCareer || 'Geral'}</td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => setSelectedUserDetail(u)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold transition-all cursor-pointer"
                          >
                            Visualizar
                          </button>
                          {authStatus.user?.role === 'super_admin' || authStatus.user?.role === 'admin' ? (
                            <button
                              onClick={() => handleToggleBlockUser(u)}
                              disabled={u.role === 'super_admin'}
                              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                u.isBlocked
                                  ? 'bg-emerald-950/80 text-emerald-300 hover:bg-emerald-900 border border-emerald-800/50'
                                  : 'bg-red-950/80 text-red-300 hover:bg-red-900 border border-red-800/50'
                              } disabled:opacity-40 disabled:cursor-not-allowed`}
                            >
                              {u.isBlocked ? 'Desbloquear' : 'Bloquear'}
                            </button>
                          ) : null}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal / Drawer de Visualização de Detalhes do Usuário (Sem Senha!) */}
          {selectedUserDetail && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
              <div className="max-w-lg w-full bg-[#0D1829] border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400 font-bold">
                      {selectedUserDetail.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{selectedUserDetail.name}</h4>
                      <p className="text-slate-400 text-xs font-mono">{selectedUserDetail.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedUserDetail(null)}
                    className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-400">Papel Atual:</span>
                    <div>{getRoleBadge(selectedUserDetail.role)}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-400">Status da Conta:</span>
                    <span
                      className={`font-bold ${
                        selectedUserDetail.isBlocked ? 'text-red-400' : 'text-emerald-400'
                      }`}
                    >
                      {selectedUserDetail.isBlocked ? 'BLOQUEADO' : 'ATIVO'}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-400">Data de Cadastro:</span>
                    <span className="text-slate-200">
                      {new Date(selectedUserDetail.createdAt).toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-400">Questões Respondidas:</span>
                    <span className="text-amber-400 font-bold">
                      {selectedUserDetail.questionsAnsweredCount || 0}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-400">Concurso Alvo:</span>
                    <span className="text-slate-200">
                      {selectedUserDetail.targetContest || 'Não definido'}
                    </span>
                  </div>
                </div>

                {/* Alteração de Papel (Apenas Super Admin) */}
                {authStatus.user?.role === 'super_admin' && (
                  <div className="pt-2 border-t border-slate-800">
                    <label className="block text-xs font-bold text-slate-300 mb-2">
                      Alterar Role deste Usuário (Super Admin Only):
                    </label>
                    <div className="flex gap-2">
                      <select
                        defaultValue={selectedUserDetail.role}
                        id="new-role-select"
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                      >
                        <option value="user">user (Aluno Padrão)</option>
                        <option value="moderator">moderator</option>
                        <option value="editor">editor</option>
                        <option value="admin">admin</option>
                        <option value="super_admin">super_admin</option>
                      </select>
                      <button
                        onClick={() => {
                          const sel = document.getElementById('new-role-select') as HTMLSelectElement;
                          if (sel) handleChangeRole(selectedUserDetail.id, sel.value);
                        }}
                        className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase cursor-pointer"
                      >
                        Salvar
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setSelectedUserDetail(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* 3. ABA CONCURSOS */}
      {/* ==================================================================== */}
      {activeTab === 'concursos' && (
        <div className="rounded-3xl bg-[#0D1829] border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-tactical font-black text-white uppercase tracking-wider">
                Gestão de Concursos Públicos
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Editais e certames da segurança pública nacional.</p>
            </div>
            <button
              onClick={() => setShowAddContestModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Novo Concurso
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contests.map((c) => (
              <div key={c.id} className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold uppercase">
                    {c.sphere} • {c.state}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-400">{c.situation}</span>
                </div>
                <h4 className="font-bold text-white text-sm leading-snug">{c.title}</h4>
                <div className="text-xs text-slate-400 space-y-1">
                  <div>Banca: <strong className="text-slate-200">{c.examiningBoard}</strong></div>
                  <div>Vagas: <strong className="text-slate-200">{c.vacancies}</strong> • Salário: <strong className="text-emerald-400">R$ {c.salary}</strong></div>
                  <div>Data Prova: <strong className="text-slate-200">{c.examDate}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 4. ABA EDITAIS */}
      {/* ==================================================================== */}
      {activeTab === 'editais' && (
        <div className="rounded-3xl bg-[#0D1829] border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-tactical font-black text-white uppercase tracking-wider">
                Monitoramento de Editais Oficiais
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Sincronização com Diários Oficiais estaduais e federais.</p>
            </div>
            <button
              onClick={() => setShowAddEditalModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Cadastrar Edital
            </button>
          </div>

          <div className="divide-y divide-slate-800">
            {editais.map((ed) => (
              <div key={ed.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold uppercase">
                      {ed.status}
                    </span>
                    <span className="text-slate-400 text-xs font-mono">{ed.publishedAt}</span>
                  </div>
                  <h4 className="font-bold text-white text-sm mt-1">{ed.title}</h4>
                  <p className="text-xs text-slate-400">{ed.contestTitle} • {ed.organization}</p>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  Fonte: {ed.officialGazette}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 5. ABA ÓRGÃOS */}
      {/* ==================================================================== */}
      {activeTab === 'orgaos' && (
        <div className="rounded-3xl bg-[#0D1829] border border-slate-800 p-6 space-y-4">
          <h3 className="text-base font-tactical font-black text-white uppercase tracking-wider">
            Órgãos de Segurança Pública Cadastrados
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orgaos.map((org) => (
              <div key={org.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-bold font-mono text-xs">
                    {org.acronym}
                  </span>
                  <span className="text-[11px] text-slate-400">{org.sphere}</span>
                </div>
                <h4 className="font-bold text-white text-sm">{org.name}</h4>
                <div className="text-xs text-slate-400">
                  Sede: {org.headquarters} • Categoria: {org.category}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 6. ABA CARGOS */}
      {/* ==================================================================== */}
      {activeTab === 'cargos' && (
        <div className="rounded-3xl bg-[#0D1829] border border-slate-800 p-6 space-y-4">
          <h3 className="text-base font-tactical font-black text-white uppercase tracking-wider">
            Cargos e Requisitos Funcionais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cargos.map((crg) => (
              <div key={crg.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-white text-sm">{crg.title}</h4>
                  <p className="text-xs text-slate-400">{crg.career} ({crg.organization}) • Escolaridade: {crg.educationLevel}</p>
                  <p className="text-xs text-slate-400 font-mono">Exigência: {crg.cnhRequired}</p>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 font-bold font-mono text-sm">
                    R$ {crg.baseSalary.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 7. ABA DISCIPLINAS */}
      {/* ==================================================================== */}
      {activeTab === 'disciplinas' && (
        <div className="rounded-3xl bg-[#0D1829] border border-slate-800 p-6 space-y-4">
          <h3 className="text-base font-tactical font-black text-white uppercase tracking-wider">
            Disciplinas do Conteúdo Programático
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {disciplinas.map((d) => (
              <div key={d.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase">
                  {d.category}
                </span>
                <h4 className="font-bold text-white text-sm">{d.name}</h4>
                <div className="text-xs text-slate-400 flex justify-between">
                  <span>{d.topicsCount} tópicos</span>
                  <span>{d.questionsCount} questões</span>
                  <span>Peso: {d.weight}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 8. ABA TÓPICOS */}
      {/* ==================================================================== */}
      {activeTab === 'topicos' && (
        <div className="rounded-3xl bg-[#0D1829] border border-slate-800 p-6 space-y-4">
          <h3 className="text-base font-tactical font-black text-white uppercase tracking-wider">
            Tópicos e Subtemas Específicos
          </h3>
          <div className="divide-y divide-slate-800">
            {topicos.map((top) => (
              <div key={top.id} className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-xs">{top.name}</h4>
                  <p className="text-[11px] text-slate-400">{top.disciplineName}</p>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-slate-400">{top.questionsCount} questões</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold">
                    Relevância {top.relevance}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 9. ABA QUESTÕES */}
      {/* ==================================================================== */}
      {activeTab === 'questoes' && (
        <div className="rounded-3xl bg-[#0D1829] border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-tactical font-black text-white uppercase tracking-wider">
                Banco de Questões e Moderação
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Controle de qualidade, gabaritos e aprovação editorial.</p>
            </div>
            <button
              onClick={() => setShowAddQuestionModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Cadastrar Questão
            </button>
          </div>

          <div className="space-y-3">
            {questoes.map((q) => (
              <div key={q.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-bold text-[10px] uppercase font-mono">
                      {q.disciplineName}
                    </span>
                    <span className="text-slate-400 text-xs font-mono">{q.examiningBoard} • {q.year}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                      q.status === 'PUBLISHED'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : q.status === 'REVIEW'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {q.status}
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{q.statement}</p>
                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <span>Gabarito: <strong className="text-emerald-400 font-bold">({q.correctLetter})</strong> • Cadastrado por: {q.author}</span>
                  <div className="flex gap-2">
                    {q.status !== 'PUBLISHED' && (
                      <button
                        onClick={async () => {
                          await AdminService.updateQuestaoStatus(q.id, 'PUBLISHED');
                          showToast('Questão aprovada e publicada!');
                          setQuestoes((prev) =>
                            prev.map((item) => (item.id === q.id ? { ...item, status: 'PUBLISHED' } : item))
                          );
                        }}
                        className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 font-bold text-[10px] uppercase hover:bg-emerald-900 cursor-pointer"
                      >
                        Aprovar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 10. ABA SIMULADOS */}
      {/* ==================================================================== */}
      {activeTab === 'simulados' && (
        <div className="rounded-3xl bg-[#0D1829] border border-slate-800 p-6 space-y-4">
          <h3 className="text-base font-tactical font-black text-white uppercase tracking-wider">
            Simulados Oficiais da Plataforma
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {simulados.map((s) => (
              <div key={s.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase">
                    {s.careerTarget}
                  </span>
                  <span className="text-[11px] text-emerald-400 font-bold">{s.status}</span>
                </div>
                <h4 className="font-bold text-white text-sm">{s.title}</h4>
                <div className="text-xs text-slate-400 flex justify-between font-mono">
                  <span>{s.totalQuestions} questões</span>
                  <span>{s.durationMinutes} minutos</span>
                  <span>{s.participationsCount} participações</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 11. ABA IA */}
      {/* ==================================================================== */}
      {activeTab === 'ia' && (
        <div className="rounded-3xl bg-[#0D1829] border border-slate-800 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-tactical font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Brain className="w-5 h-5 text-amber-400" />
                Governança da Inteligência Artificial
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Controle de custos, métricas de consumo de tokens e Kill Switch de emergência.
              </p>
            </div>

            {/* Kill Switch Toggle */}
            <div className="flex items-center gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold text-slate-300">KILL SWITCH GERAL:</span>
              <button
                onClick={() => handleToggleKillSwitch(!iaConfig?.settings?.killSwitchActive)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
                  iaConfig?.settings?.killSwitchActive
                    ? 'bg-red-500 text-slate-950 animate-pulse'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {iaConfig?.settings?.killSwitchActive ? 'DESLIGAR KILL SWITCH' : 'ACIONAR KILL SWITCH'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-mono">Status Operacional</span>
              <div className="text-lg font-black text-white mt-1">
                {iaConfig?.metrics?.killSwitchStatus || 'DESATIVADO (IA OPERACIONAL)'}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-mono">Chamadas Realizadas</span>
              <div className="text-lg font-black text-amber-400 mt-1">
                {iaConfig?.metrics?.totalCalls ?? '312'}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-mono">Respostas em Cache</span>
              <div className="text-lg font-black text-emerald-400 mt-1">
                {iaConfig?.metrics?.cachedRepliesCount ?? '64'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 12. ABA ESTATÍSTICAS */}
      {/* ==================================================================== */}
      {activeTab === 'estatisticas' && (
        <div className="rounded-3xl bg-[#0D1829] border border-slate-800 p-6 space-y-4">
          <h3 className="text-base font-tactical font-black text-white uppercase tracking-wider">
            Estatísticas da Plataforma
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-amber-400 uppercase font-mono">Desempenho Médio por Disciplina</h4>
              <div className="space-y-2 text-xs">
                {statsData?.disciplinePerformance?.map((dp: any) => (
                  <div key={dp.discipline} className="flex justify-between items-center">
                    <span className="text-slate-300">{dp.discipline}:</span>
                    <span className="font-mono font-bold text-white">{dp.accuracyRate}% ({dp.questionsAnswered} reps)</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-emerald-400 uppercase font-mono">Métricas de Engajamento</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total de Cadastros:</span>
                  <span className="text-white font-bold">{statsData?.metrics?.totalRegisteredUsers || 7}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sessões de Estudo Registradas:</span>
                  <span className="text-white font-bold">{statsData?.metrics?.studySessionsCount || 4120}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Horas Totais Acumuladas:</span>
                  <span className="text-white font-bold">{statsData?.metrics?.totalStudyHoursRecorded || 8240}h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 13. ABA LOGS */}
      {/* ==================================================================== */}
      {activeTab === 'logs' && (
        <div className="rounded-3xl bg-[#0D1829] border border-slate-800 p-6 space-y-4">
          <h3 className="text-base font-tactical font-black text-white uppercase tracking-wider">
            Trilha de Auditoria do Sistema
          </h3>
          <div className="divide-y divide-slate-800 font-mono text-xs">
            {logsList.map((log) => (
              <div key={log.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="text-white font-bold">{log.action}</div>
                  <div className="text-slate-500 text-[11px]">{log.actorEmail} • Recurso: {log.resourceType}</div>
                </div>
                <span className="text-slate-400 text-[11px]">
                  {new Date(log.timestamp).toLocaleTimeString('pt-BR')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 14. ABA SEGURANÇA */}
      {/* ==================================================================== */}
      {activeTab === 'seguranca' && (
        <div className="rounded-3xl bg-[#0D1829] border border-slate-800 p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-tactical font-black text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-500" />
                Monitoramento Ativo de Segurança e Firewall
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Tentativas de acesso indevido bloqueadas pelo backend.</p>
            </div>
            <div className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold">
              FIREWALL ATIVO
            </div>
          </div>

          <div className="divide-y divide-slate-800 font-mono text-xs">
            {securityData?.events?.length === 0 ? (
              <p className="text-slate-500 py-4">Nenhum incidente de segurança registrado.</p>
            ) : (
              securityData?.events?.map((ev: any) => (
                <div key={ev.id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 text-[10px] font-bold uppercase mr-2">
                      {ev.severity} • {ev.eventType}
                    </span>
                    <span className="text-slate-300">{ev.details}</span>
                  </div>
                  <span className="text-slate-500 text-[11px]">
                    {new Date(ev.timestamp).toLocaleTimeString('pt-BR')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 15. ABA CONFIGURAÇÕES */}
      {/* ==================================================================== */}
      {activeTab === 'configuracoes' && (
        <div className="rounded-3xl bg-[#0D1829] border border-slate-800 p-6 space-y-6">
          <h3 className="text-base font-tactical font-black text-white uppercase tracking-wider">
            Configurações Globais da Plataforma
          </h3>

          <div className="space-y-4 max-w-xl text-xs">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white">Modo de Manutenção</h4>
                <p className="text-slate-400 text-[11px]">Bloqueia temporariamente o acesso geral dos alunos.</p>
              </div>
              <button
                onClick={async () => {
                  const next = !systemConfig?.settings?.maintenanceMode;
                  await AdminService.updateConfiguracoes({ maintenanceMode: next });
                  showToast(next ? 'Manutenção ativada.' : 'Manutenção desativada.');
                  setSystemConfig((prev: any) => ({
                    ...prev,
                    settings: { ...prev?.settings, maintenanceMode: next },
                  }));
                }}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer ${
                  systemConfig?.settings?.maintenanceMode
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {systemConfig?.settings?.maintenanceMode ? 'ATIVADO' : 'DESATIVADO'}
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white">Inscrições e Cadastros Abertos</h4>
                <p className="text-slate-400 text-[11px]">Permite novos registros em /cadastro.</p>
              </div>
              <button
                onClick={async () => {
                  const next = !systemConfig?.settings?.registrationsOpen;
                  await AdminService.updateConfiguracoes({ registrationsOpen: next });
                  showToast(next ? 'Cadastros liberados.' : 'Cadastros pausados.');
                  setSystemConfig((prev: any) => ({
                    ...prev,
                    settings: { ...prev?.settings, registrationsOpen: next },
                  }));
                }}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer ${
                  systemConfig?.settings?.registrationsOpen
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-red-500 text-slate-950'
                }`}
              >
                {systemConfig?.settings?.registrationsOpen ? 'ABERTOS' : 'FECHADOS'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Adicionar Concurso */}
      {showAddContestModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#0D1829] border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <h4 className="font-bold text-white text-sm">Adicionar Novo Concurso</h4>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const title = (form.elements.namedItem('title') as HTMLInputElement).value;
                const org = (form.elements.namedItem('org') as HTMLInputElement).value;
                const vacancies = Number((form.elements.namedItem('vacancies') as HTMLInputElement).value);
                const salary = Number((form.elements.namedItem('salary') as HTMLInputElement).value);
                await AdminService.createContest({
                  title,
                  organization: org,
                  vacancies,
                  salary,
                  sphere: 'Estadual',
                  career: 'Polícia Militar',
                  state: 'SP',
                  examiningBoard: 'Vunesp',
                  situation: 'Edital publicado',
                  examDate: '2026-11-15',
                });
                showToast('Concurso cadastrado com sucesso!');
                setShowAddContestModal(false);
                AdminService.getContests().then((c) => setContests(c));
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-400 mb-1">Título do Concurso:</label>
                <input
                  name="title"
                  required
                  placeholder="Ex: PMESP Soldado 2ª Classe"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Órgão:</label>
                <input
                  name="org"
                  required
                  placeholder="Ex: Polícia Militar de SP"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Vagas:</label>
                  <input
                    name="vacancies"
                    type="number"
                    defaultValue={1000}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Salário (R$):</label>
                  <input
                    name="salary"
                    type="number"
                    defaultValue={4850}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddContestModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold"
                >
                  Salvar Concurso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Adicionar Questão */}
      {showAddQuestionModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-[#0D1829] border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <h4 className="font-bold text-white text-sm">Cadastrar Nova Questão</h4>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const statement = (form.elements.namedItem('statement') as HTMLTextAreaElement).value;
                const board = (form.elements.namedItem('board') as HTMLInputElement).value;
                const correctLetter = (form.elements.namedItem('correctLetter') as HTMLSelectElement).value;
                await AdminService.createQuestao({
                  statement,
                  examiningBoard: board,
                  correctLetter,
                  disciplineName: 'Direito Constitucional',
                  disciplineId: 'disc-const',
                  topic: 'Geral',
                  year: 2026,
                  difficulty: 'Médio',
                  status: 'PUBLISHED',
                });
                showToast('Questão cadastrada com sucesso!');
                setShowAddQuestionModal(false);
                AdminService.getQuestoes().then((q) => setQuestoes(q));
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-400 mb-1">Enunciado da Questão:</label>
                <textarea
                  name="statement"
                  rows={4}
                  required
                  placeholder="Digite o enunciado completo..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Banca Examinadora:</label>
                  <input
                    name="board"
                    defaultValue="Cebraspe"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Gabarito Correto:</label>
                  <select
                    name="correctLetter"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddQuestionModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold"
                >
                  Salvar Questão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
