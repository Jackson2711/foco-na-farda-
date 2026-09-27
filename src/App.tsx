/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { UserProfile, Contest } from './types';
import { FocoDataEngineStore } from './services/store';
import { AuthService, NativeSession } from './services/authService';
import { AdminService } from './services/adminService';

// Auth Pages & Components
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './components/auth/ResetPasswordPage';
import { AuthCallbackPage } from './components/auth/AuthCallbackPage';

// Institutional & Privacy Pages
import { TermsPage } from './components/institutional/TermsPage';
import { PrivacyPage } from './components/institutional/PrivacyPage';
import { CookiesPolicyPage } from './components/institutional/CookiesPolicyPage';
import { AboutPage } from './components/institutional/AboutPage';
import { ContactPage } from './components/institutional/ContactPage';
import { FaqPage } from './components/institutional/FaqPage';
import { AccessibilityPage } from './components/institutional/AccessibilityPage';
import { DonationPage } from './components/institutional/DonationPage';

// Cookie & Footer Components
import { CookieConsentBanner } from './components/cookies/CookieConsentBanner';
import { CookiePreferencesModal } from './components/cookies/CookiePreferencesModal';
import { InstitutionalFooter } from './components/common/InstitutionalFooter';

// Common Components
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { MobileNav } from './components/common/MobileNav';
import { OfflineIndicator } from './components/common/OfflineIndicator';

// Feature Views
import { Dashboard } from './components/dashboard/Dashboard';
import { ContestRadar } from './components/radar/ContestRadar';
import { MyContestView } from './components/mycontest/MyContestView';
import { QuestionSolver } from './components/questions/QuestionSolver';
import { SimulationsView } from './components/simulations/SimulationsView';
import { StudyTimer } from './components/timer/StudyTimer';
import { ReviewsView } from './components/reviews/ReviewsView';
import { DisciplinesView } from './components/disciplines/DisciplinesView';
import { PerformanceView } from './components/performance/PerformanceView';
import { RankingView } from './components/ranking/RankingView';
import { NewsView } from './components/news/NewsView';
import { FavoritesView } from './components/favorites/FavoritesView';
import { ProfileView } from './components/profile/ProfileView';
import { AdminPanel } from './components/admin/AdminPanel';
import { PsychometricsView } from './components/psychometrics/PsychometricsView';
import { AdaptiveRetestView } from './components/retest/AdaptiveRetestView';
import { Shield, Loader2 } from 'lucide-react';

// Mapeamento canônico entre Paths e Tabs
const PATH_TO_TAB_MAP: Record<string, string> = {
  '/dashboard': 'dashboard',
  '/perfil': 'profile',
  '/configuracoes': 'configuracoes',
  '/estudar': 'timer',
  '/questoes': 'questions',
  '/simulados': 'simulations',
  '/diagnostico': 'psychometrics',
  '/radar': 'radar',
  '/concursos': 'radar',
  '/reteste': 'retest',
  '/meu-concurso': 'mycontest',
  '/disciplinas': 'disciplines',
  '/revisoes': 'reviews',
  '/desempenho': 'performance',
  '/ranking': 'ranking',
  '/noticias': 'news',
  '/favoritos': 'favorites',
  '/doar': 'doar',
  '/admin': 'admin',
};

const TAB_TO_PATH_MAP: Record<string, string> = {
  dashboard: '/dashboard',
  profile: '/perfil',
  configuracoes: '/configuracoes',
  timer: '/estudar',
  questions: '/questoes',
  simulations: '/simulados',
  psychometrics: '/diagnostico',
  radar: '/radar',
  retest: '/reteste',
  mycontest: '/meu-concurso',
  disciplines: '/disciplinas',
  reviews: '/revisoes',
  performance: '/desempenho',
  ranking: '/ranking',
  news: '/noticias',
  favorites: '/favoritos',
  doar: '/doar',
  admin: '/admin',
};

// Páginas públicas institucionais e de autenticação (acesso livre)
const PUBLIC_INSTITUTIONAL_PAGES = [
  '/termos-de-uso',
  '/politica-de-privacidade',
  '/politica-de-cookies',
  '/sobre',
  '/contato',
  '/faq',
  '/acessibilidade',
  '/doar',
];

const AUTH_PAGES = ['/login', '/cadastro', '/recuperar-senha', '/redefinir-senha', '/auth/callback'];

export default function App() {
  const [session, setSession] = useState<NativeSession | null>(null);
  const [user, setUser] = useState<UserProfile | null>(() => FocoDataEngineStore.getUserProfile());
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');

  const [activeQuestionId, setActiveQuestionId] = useState<string | undefined>();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [showContestSelectorModal, setShowContestSelectorModal] = useState<boolean>(false);
  const [showCookieModal, setShowCookieModal] = useState<boolean>(false);

  // Navegação unificada com suporte ao History API
  const navigateTo = useCallback((target: string) => {
    let targetPath = target;
    // Se recebeu um ID de tab (ex: 'questions'), converte para path oficial (ex: '/questoes')
    if (TAB_TO_PATH_MAP[target]) {
      targetPath = TAB_TO_PATH_MAP[target];
    } else if (!targetPath.startsWith('/')) {
      targetPath = `/${target}`;
    }

    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
    setCurrentPath(targetPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Escuta botões voltar/avançar do navegador (popstate)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Escuta evento global para abertura do modal de preferências de cookies
  useEffect(() => {
    const handleOpenCookiesEvent = () => {
      setShowCookieModal(true);
    };
    window.addEventListener('open_cookie_preferences', handleOpenCookiesEvent);
    return () => window.removeEventListener('open_cookie_preferences', handleOpenCookiesEvent);
  }, []);

  // 1. Inicialização e verificação de Sessão do Candidato (Nativa)
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        const activeSession = await AuthService.getSession();
        if (isMounted) {
          if (activeSession?.user) {
            setSession(activeSession);
            const profile = await AuthService.syncOrCreateProfile(activeSession.user);
            setUser(profile);
          } else {
            setSession(null);
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Erro ao verificar sessão:', err);
      } finally {
        if (isMounted) {
          setIsAuthLoading(false);
        }
      }
    }

    initAuth();

    // Inscrição em tempo real a eventos de autenticação nativa
    const { data: authListener } = AuthService.onAuthStateChange(async (event, newSession) => {
      if (!isMounted) return;

      if (event === 'SIGNED_IN' && newSession?.user) {
        setSession(newSession);
        const profile = await AuthService.syncOrCreateProfile(newSession.user);
        setUser(profile);
      } else if (event === 'SIGNED_OUT' || !newSession) {
        setSession(null);
        setUser(null);
        FocoDataEngineStore.clearUserProfile();
      }
    });

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // 2. Proteção de Rotas com base no Usuário Autenticado
  useEffect(() => {
    if (isAuthLoading) return;

    const isPublicInstitutional = PUBLIC_INSTITUTIONAL_PAGES.includes(currentPath);
    const isAuthPage = AUTH_PAGES.includes(currentPath);

    // Páginas institucionais são SEMPRE públicas (não redirecionam)
    if (isPublicInstitutional) {
      return;
    }

    if (!user) {
      // Usuário NÃO autenticado tentando acessar rota restrita ou raiz
      if (!isAuthPage) {
        window.history.replaceState({}, '', '/login');
        setCurrentPath('/login');
      }
    } else {
      // Usuário AUTENTICADO tentando acessar páginas de login/cadastro/raiz
      if (currentPath === '/login' || currentPath === '/cadastro' || currentPath === '/' || currentPath === '/auth/callback') {
        window.history.replaceState({}, '', '/dashboard');
        setCurrentPath('/dashboard');
      }
    }
  }, [user, isAuthLoading, currentPath]);

  // Logout Real
  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch (e) {
      console.warn('Erro ao realizar logout:', e);
    }
    setSession(null);
    setUser(null);
    navigateTo('/login');
  };

  // Sucesso de Login ou Cadastro
  const handleAuthSuccess = async (loggedProfile: UserProfile) => {
    setUser(loggedProfile);
    const activeSession = await AuthService.getSession();
    if (activeSession) {
      setSession(activeSession);
    }
    AdminService.syncUser(loggedProfile.id, loggedProfile.name, loggedProfile.email);
    navigateTo('/dashboard');
  };

  // Alternar para Conta Administrativa (Para Teste e Validação Tática)
  const handleSwitchToAdminAccount = async () => {
    try {
      const res = await AuthService.login('admin@foconafarda.com.br', 'AdminFoco2026!');
      if (res.data?.user) {
        setUser(res.data.user);
        setSession(res.data.session);
        AdminService.syncUser(res.data.user.id, res.data.user.name, res.data.user.email);
        navigateTo('/admin');
      }
    } catch (e) {
      console.warn('Erro ao alternar para conta admin:', e);
    }
  };

  // Contadores de Revisões e Retestes
  const pendingReviewsCount = user
    ? FocoDataEngineStore.getReviews(user.id).filter((r) => r.status === 'pending').length
    : 0;
  const pendingRetestsCount = user
    ? FocoDataEngineStore.getAdaptiveRetests(user.id).filter(
        (r) => r.status === 'ready' || new Date(r.scheduledFor) <= new Date()
      ).length
    : 0;

  const handleUpdateUser = (updatedProfile: UserProfile) => {
    setUser(updatedProfile);
  };

  const handleSetTargetContest = (contestId: string) => {
    if (!user) return;
    const updated = FocoDataEngineStore.updateUserProfile({ targetContestId: contestId });
    setUser(updated);
    setShowContestSelectorModal(false);
  };

  const handleOpenQuestion = (questionId: string) => {
    setActiveQuestionId(questionId);
    navigateTo('/questoes');
  };

  const handleSelectDiscipline = () => {
    navigateTo('/disciplinas');
  };

  const handleOpenContest = (contest: Contest) => {
    handleSetTargetContest(contest.id);
    navigateTo('/meu-concurso');
  };

  // Tela de Carregamento Tático da Sessão
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#070D1E] flex flex-col items-center justify-center text-slate-100 p-4">
        <div className="flex flex-col items-center gap-4 animate-fade-in text-center max-w-sm">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/20">
              <Shield className="w-9 h-9" />
            </div>
            <Loader2 className="w-6 h-6 text-amber-400 animate-spin absolute -bottom-2 -right-2" />
          </div>
          <div>
            <h2 className="text-lg font-tactical font-black tracking-wider text-white uppercase">
              FOCO NA FARDA
            </h2>
            <p className="text-xs text-amber-400 font-mono-code mt-1">
              Verificando credenciais táticas...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 3. Renderização de Páginas Institucionais Públicas (Acesso livre para autenticados e visitantes)
  if (PUBLIC_INSTITUTIONAL_PAGES.includes(currentPath)) {
    return (
      <div className="min-h-screen bg-[#070D1E] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
        <OfflineIndicator />

        {currentPath === '/termos-de-uso' && (
          <TermsPage onNavigate={navigateTo} isAuthenticated={Boolean(user && session)} />
        )}

        {currentPath === '/politica-de-privacidade' && (
          <PrivacyPage onNavigate={navigateTo} isAuthenticated={Boolean(user && session)} />
        )}

        {currentPath === '/politica-de-cookies' && (
          <CookiesPolicyPage
            onNavigate={navigateTo}
            onOpenPreferences={() => setShowCookieModal(true)}
            isAuthenticated={Boolean(user && session)}
          />
        )}

        {currentPath === '/sobre' && (
          <AboutPage onNavigate={navigateTo} isAuthenticated={Boolean(user && session)} />
        )}

        {currentPath === '/contato' && (
          <ContactPage onNavigate={navigateTo} isAuthenticated={Boolean(user && session)} />
        )}

        {currentPath === '/faq' && (
          <FaqPage onNavigate={navigateTo} isAuthenticated={Boolean(user && session)} />
        )}

        {currentPath === '/acessibilidade' && (
          <AccessibilityPage onNavigate={navigateTo} isAuthenticated={Boolean(user && session)} />
        )}

        {currentPath === '/doar' && (
          <DonationPage onNavigate={navigateTo} isAuthenticated={Boolean(user && session)} />
        )}

        {/* Rodapé com todos os links exigidos */}
        <InstitutionalFooter
          onNavigate={navigateTo}
          onOpenCookiePreferences={() => setShowCookieModal(true)}
        />

        {/* Banner e Modal de Cookies */}
        <CookieConsentBanner
          onOpenPreferences={() => setShowCookieModal(true)}
          onNavigate={navigateTo}
        />
        <CookiePreferencesModal
          isOpen={showCookieModal}
          onClose={() => setShowCookieModal(false)}
          onNavigate={navigateTo}
        />
      </div>
    );
  }

  // 4. Se o usuário não está autenticado e está numa tela de autenticação
  if (!session || !user) {
    return (
      <div className="min-h-screen bg-[#070D1E] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
        <OfflineIndicator />

        <div className="flex-1 flex flex-col justify-center">
          {currentPath === '/auth/callback' && (
            <AuthCallbackPage onSuccess={handleAuthSuccess} onNavigate={navigateTo} />
          )}

          {currentPath === '/cadastro' && (
            <RegisterPage onSuccess={handleAuthSuccess} onNavigate={navigateTo} />
          )}

          {currentPath === '/recuperar-senha' && (
            <ForgotPasswordPage onNavigate={navigateTo} />
          )}

          {currentPath === '/redefinir-senha' && (
            <ResetPasswordPage onNavigate={navigateTo} />
          )}

          {(currentPath === '/login' ||
            (!['/cadastro', '/auth/callback', '/recuperar-senha', '/redefinir-senha'].includes(currentPath))) && (
            <LoginPage onSuccess={handleAuthSuccess} onNavigate={navigateTo} />
          )}
        </div>

        {/* Rodapé Institucional com links completos */}
        <InstitutionalFooter
          onNavigate={navigateTo}
          onOpenCookiePreferences={() => setShowCookieModal(true)}
        />

        {/* Banner e Modal de Cookies */}
        <CookieConsentBanner
          onOpenPreferences={() => setShowCookieModal(true)}
          onNavigate={navigateTo}
        />
        <CookiePreferencesModal
          isOpen={showCookieModal}
          onClose={() => setShowCookieModal(false)}
          onNavigate={navigateTo}
        />
      </div>
    );
  }

  // 5. Usuário AUTENTICADO: Determina a tab ativa a partir do path
  const currentTab = PATH_TO_TAB_MAP[currentPath] || 'dashboard';

  return (
    <div className="min-h-screen bg-[#070D1E] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Offline Status Warning */}
      <OfflineIndicator />

      {/* Top Tactical Navbar */}
      <Navbar
        user={user}
        activeTab={currentTab}
        onNavigate={navigateTo}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 gap-6">
        {/* Left Sidebar for Desktop & Drawer for Mobile */}
        <Sidebar
          user={user}
          activeTab={currentTab}
          onNavigate={(tab) => {
            navigateTo(tab);
            setSidebarOpen(false);
          }}
          pendingReviewsCount={pendingReviewsCount}
          pendingRetestsCount={pendingRetestsCount}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onLogout={handleLogout}
        />

        {/* Dynamic Content View Area */}
        <main className="flex-1 min-w-0 pb-20 md:pb-6">
          {currentTab === 'dashboard' && (
            <Dashboard
              user={user}
              onNavigate={navigateTo}
              onSelectContest={handleSetTargetContest}
            />
          )}

          {currentTab === 'retest' && (
            <AdaptiveRetestView
              user={user}
              onUpdateUser={handleUpdateUser}
              onNavigateToQuestions={() => navigateTo('/questoes')}
            />
          )}

          {currentTab === 'psychometrics' && (
            <PsychometricsView
              user={user}
              onNavigateToQuestions={() => navigateTo('/questoes')}
              onNavigateToRetest={() => navigateTo('/reteste')}
            />
          )}

          {currentTab === 'radar' && (
            <ContestRadar
              userId={user.id}
              onSetTargetContest={(cntId) => {
                handleSetTargetContest(cntId);
                navigateTo('/meu-concurso');
              }}
            />
          )}

          {currentTab === 'mycontest' && (
            <MyContestView
              user={user}
              onNavigate={navigateTo}
              onOpenContestSelector={() => setShowContestSelectorModal(true)}
            />
          )}

          {currentTab === 'questions' && (
            <QuestionSolver
              user={user}
              initialQuestionId={activeQuestionId}
              onUpdateUser={handleUpdateUser}
            />
          )}

          {currentTab === 'simulations' && (
            <SimulationsView
              user={user}
              onUpdateUser={handleUpdateUser}
            />
          )}

          {currentTab === 'timer' && (
            <StudyTimer
              user={user}
              onUpdateUser={handleUpdateUser}
            />
          )}

          {currentTab === 'reviews' && (
            <ReviewsView
              user={user}
              onOpenQuestion={handleOpenQuestion}
            />
          )}

          {currentTab === 'disciplines' && (
            <DisciplinesView
              onSelectDisciplineToPractice={() => {
                navigateTo('/questoes');
              }}
            />
          )}

          {currentTab === 'performance' && (
            <PerformanceView
              user={user}
              onNavigateToQuestions={() => navigateTo('/questoes')}
            />
          )}

          {currentTab === 'ranking' && (
            <RankingView user={user} />
          )}

          {currentTab === 'news' && (
            <NewsView />
          )}

          {currentTab === 'favorites' && (
            <FavoritesView
              user={user}
              onOpenContest={handleOpenContest}
              onOpenQuestion={handleOpenQuestion}
              onSelectDiscipline={handleSelectDiscipline}
            />
          )}

          {currentTab === 'profile' && (
            <ProfileView
              user={user}
              onUpdateUser={handleUpdateUser}
              onLogout={handleLogout}
            />
          )}

          {currentTab === 'admin' && (
            <AdminPanel
              currentUser={user}
              onNavigate={navigateTo}
              onLogout={handleLogout}
              onSwitchToAdminAccount={handleSwitchToAdminAccount}
            />
          )}

          {currentTab === 'configuracoes' && (
            <div className="rounded-2xl bg-[#0D1829] border border-slate-800 p-6 space-y-4">
              <div className="pb-3 border-b border-slate-800">
                <h2 className="text-xl font-tactical font-black text-white uppercase tracking-wider">
                  Configurações do Sistema
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Gerenciamento de privacidade, cookies e preferências de estudo.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase">Privacidade e Cookies</h4>
                  <p className="text-slate-400 text-xs">Ajuste suas opções de consentimento da LGPD.</p>
                </div>
                <button
                  onClick={() => setShowCookieModal(true)}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase"
                >
                  Preferências de Cookies
                </button>
              </div>
            </div>
          )}

          {currentTab === 'doar' && (
            <DonationPage onNavigate={navigateTo} isAuthenticated={true} />
          )}
        </main>
      </div>

      {/* Bottom Navigation for Mobile / PWA */}
      <MobileNav
        user={user}
        activeTab={currentTab}
        onNavigate={navigateTo}
        pendingReviewsCount={pendingReviewsCount}
        pendingRetestsCount={pendingRetestsCount}
        onLogout={handleLogout}
      />

      {/* Rodapé com links institucionais e botão de cookies */}
      <InstitutionalFooter
        onNavigate={navigateTo}
        onOpenCookiePreferences={() => setShowCookieModal(true)}
      />

      {/* Modal: Target Contest Selector */}
      {showContestSelectorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
          <div className="w-full max-w-xl rounded-2xl bg-[#0D1829] border border-amber-500/40 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                Selecione seu Concurso Alvo Principal
              </h3>
              <button
                onClick={() => setShowContestSelectorModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {FocoDataEngineStore.getContests().map((cnt) => (
                <div
                  key={cnt.id}
                  onClick={() => handleSetTargetContest(cnt.id)}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between ${
                    user.targetContestId === cnt.id
                      ? 'bg-amber-500/20 border-amber-400 text-white font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-400">{cnt.sphere}</span>
                      <span className="text-slate-400">• {cnt.situation}</span>
                    </div>
                    <h4 className="font-bold text-white mt-1">{cnt.title}</h4>
                    <span className="text-[11px] text-slate-400">
                      Banca: {cnt.examiningBoard} • R$ {cnt.salary.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs">
                    Escolher
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Banner de Cookies na primeira visita */}
      <CookieConsentBanner
        onOpenPreferences={() => setShowCookieModal(true)}
        onNavigate={navigateTo}
      />

      {/* Modal de Preferências de Cookies */}
      <CookiePreferencesModal
        isOpen={showCookieModal}
        onClose={() => setShowCookieModal(false)}
        onNavigate={navigateTo}
      />
    </div>
  );
}
