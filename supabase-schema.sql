-- ====================================================================
-- FOCO NA FARDA - SCHEMA POSTGRESQL & SUPABASE PRODUÇÃO
-- Camada de Segurança RLS Estrita, RBAC, Integridade & Proteção de Dados
-- ====================================================================

-- 1. Habilitar extensões recomendadas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================================================
-- 2. TABELAS DE ROLES E PERMISSÕES (RBAC)
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.roles (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO public.roles (id, name, description) VALUES
    ('user', 'Aluno / Candidato', 'Acesso aos recursos de estudo, resolução de questões, simulados e métricas pessoais.'),
    ('moderator', 'Moderador de Conteúdo', 'Pode revisar denúncias, comentários e sugestões de correção de questões.'),
    ('editor', 'Editor Pedagógico', 'Cria e edita questões, editais, concursos e disciplinas. Conteúdo inicia como DRAFT.'),
    ('admin', 'Administrador', 'Gerencia usuários, conteúdos, aprova publicações, monitora logs e IA.'),
    ('super_admin', 'Super Administrador', 'Controle operacional total, gestão de permissões críticas e infraestrutura.')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

CREATE TABLE IF NOT EXISTS public.permissions (
    id VARCHAR(64) PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO public.permissions (id, description) VALUES
    ('study:access', 'Acessar banco de questões e cronogramas'),
    ('content:create', 'Criar questões e editais em rascunho'),
    ('content:review', 'Revisar questões e enviar para aprovação'),
    ('content:publish', 'Publicar questões e editais na plataforma'),
    ('users:manage', 'Bloquear e desbloquear usuários comuns'),
    ('users:roles', 'Alterar roles de usuários (requer MFA)'),
    ('ai:killswitch', 'Ativar ou desativar o kill-switch global da IA'),
    ('security:audit', 'Visualizar trilha de auditoria e eventos de segurança')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.role_permissions (
    role_id VARCHAR(32) REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id VARCHAR(64) REFERENCES public.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

INSERT INTO public.role_permissions (role_id, permission_id) VALUES
    ('user', 'study:access'),
    ('editor', 'study:access'),
    ('editor', 'content:create'),
    ('editor', 'content:review'),
    ('moderator', 'study:access'),
    ('moderator', 'content:review'),
    ('admin', 'study:access'),
    ('admin', 'content:create'),
    ('admin', 'content:review'),
    ('admin', 'content:publish'),
    ('admin', 'users:manage'),
    ('admin', 'ai:killswitch'),
    ('admin', 'security:audit'),
    ('super_admin', 'study:access'),
    ('super_admin', 'content:create'),
    ('super_admin', 'content:review'),
    ('super_admin', 'content:publish'),
    ('super_admin', 'users:manage'),
    ('super_admin', 'users:roles'),
    ('super_admin', 'ai:killswitch'),
    ('super_admin', 'security:audit')
ON CONFLICT DO NOTHING;

-- ====================================================================
-- 3. TABELA DE PERFIS DE USUÁRIOS (PROFILES)
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'user' REFERENCES public.roles(id),
    is_blocked BOOLEAN NOT NULL DEFAULT false,
    mfa_enabled BOOLEAN NOT NULL DEFAULT false,
    terms_accepted_at TIMESTAMP WITH TIME ZONE,
    privacy_policy_accepted_at TIMESTAMP WITH TIME ZONE,
    terms_version VARCHAR(32) DEFAULT '1.0.0',
    privacy_version VARCHAR(32) DEFAULT '1.0.0',
    target_career_id VARCHAR(64) DEFAULT 'car-pm',
    target_contest_id VARCHAR(64),
    state_code VARCHAR(2) DEFAULT 'BR',
    city_name VARCHAR(120),
    rank VARCHAR(32) DEFAULT 'Recruta' CHECK (rank IN ('Recruta', 'Aluno', 'Operacional', 'Aspirante', 'Cadete', 'Oficial')),
    xp INTEGER DEFAULT 0,
    daily_study_minutes INTEGER DEFAULT 120,
    study_level VARCHAR(32) DEFAULT 'Iniciante' CHECK (study_level IN ('Iniciante', 'Intermediário', 'Avançado')),
    streak_days INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- 4. FUNÇÕES DE SUPORTE À SEGURANÇA E AUTORIZAÇÃO (SECURITY DEFINER)
-- ====================================================================

CREATE OR REPLACE FUNCTION public.get_current_user_profile_id()
RETURNS UUID AS $$
    SELECT id FROM public.profiles WHERE auth_user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS VARCHAR AS $$
    SELECT role FROM public.profiles WHERE auth_user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE auth_user_id = auth.uid()
          AND role IN ('admin', 'super_admin')
          AND is_blocked = false
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE auth_user_id = auth.uid()
          AND role IN ('moderator', 'editor', 'admin', 'super_admin')
          AND is_blocked = false
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE auth_user_id = auth.uid()
          AND role = 'super_admin'
          AND is_blocked = false
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

-- ====================================================================
-- 5. TRIGGER DE PROTEÇÃO CONTRA ALTERAÇÃO INDEVIDA DE ROLES E BLOQUEIO
-- ====================================================================

CREATE OR REPLACE FUNCTION public.check_profile_permission_changes()
RETURNS TRIGGER AS $$
BEGIN
    -- 1. Tentativa de alteração de role
    IF (OLD.role IS DISTINCT FROM NEW.role) THEN
        IF NOT public.is_super_admin() THEN
            RAISE EXCEPTION 'Acesso negado: Apenas Super Administradores podem alterar papéis (roles) de usuários.';
        END IF;
    END IF;

    -- 2. Tentativa de alteração de status de bloqueio
    IF (OLD.is_blocked IS DISTINCT FROM NEW.is_blocked) THEN
        IF NOT public.is_admin() THEN
            RAISE EXCEPTION 'Acesso negado: Apenas Administradores podem bloquear ou desbloquear contas.';
        END IF;
        IF OLD.role = 'super_admin' AND NEW.is_blocked = true THEN
            RAISE EXCEPTION 'Operação ilegal: Não é permitido bloquear uma conta de Super Administrador.';
        END IF;
    END IF;

    -- 3. Proteção contra adulteração de auth_user_id (Prevenção de IDOR)
    IF (OLD.auth_user_id IS DISTINCT FROM NEW.auth_user_id) THEN
        RAISE EXCEPTION 'Operação ilegal: O identificador de autenticação (auth_user_id) não pode ser modificado.';
    END IF;

    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_check_profile_permission_changes ON public.profiles;
CREATE TRIGGER trg_check_profile_permission_changes
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.check_profile_permission_changes();

-- ====================================================================
-- 6. TABELAS DE DADOS DO USUÁRIO (ESTUDOS, RESPOSTAS, CONFIANÇA)
-- ====================================================================

-- 6.1 Respostas e Confiança
CREATE TABLE IF NOT EXISTS public.answer_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    question_id VARCHAR(64) NOT NULL,
    selected_option_letter CHAR(1) NOT NULL CHECK (selected_option_letter IN ('A', 'B', 'C', 'D', 'E')),
    is_correct BOOLEAN NOT NULL,
    confidence_level VARCHAR(32) CHECK (confidence_level IN ('Certeza', 'Duvida', 'Chute')),
    error_type VARCHAR(64) CHECK (error_type IN ('Conceito', 'Interpretacao_Pegadinha', 'Atencao_Leitura', 'Memorizacao', 'Chute')),
    chosen_distractor_role VARCHAR(64),
    is_dunning_kruger BOOLEAN DEFAULT false,
    time_spent_seconds INTEGER DEFAULT 0,
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6.2 Sessões de Estudo
CREATE TABLE IF NOT EXISTS public.study_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    discipline_id VARCHAR(64) NOT NULL,
    contest_id VARCHAR(64),
    duration_minutes INTEGER NOT NULL,
    mode VARCHAR(32) NOT NULL CHECK (mode IN ('pomodoro', 'foco', 'personalizado')),
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6.3 Progresso do Usuário
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    discipline_id VARCHAR(64) NOT NULL,
    topic_id VARCHAR(64),
    questions_answered INTEGER DEFAULT 0,
    questions_correct INTEGER DEFAULT 0,
    accuracy_percentage NUMERIC(5,2) DEFAULT 0.00,
    study_time_minutes INTEGER DEFAULT 0,
    last_studied_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (candidate_id, discipline_id, topic_id)
);

-- 6.4 Diagnóstico Psicométrico & Pontos Cegos
CREATE TABLE IF NOT EXISTS public.psychometric_metrics (
    candidate_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    total_answered INTEGER DEFAULT 0,
    total_correct INTEGER DEFAULT 0,
    accuracy_rate NUMERIC(5,2) DEFAULT 0.00,
    error_distribution JSONB DEFAULT '{}'::jsonb,
    confidence_accuracy JSONB DEFAULT '{}'::jsonb,
    distractor_vulnerabilities JSONB DEFAULT '{}'::jsonb,
    dunning_kruger_index NUMERIC(5,2) DEFAULT 0.00,
    blind_spots_count INTEGER DEFAULT 0,
    retention_rate_score NUMERIC(5,2) DEFAULT 0.00,
    top_weak_topics JSONB DEFAULT '[]'::jsonb,
    last_ai_diagnostic TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6.5 Retestes Adaptativos & Revisões Espaçadas
CREATE TABLE IF NOT EXISTS public.adaptive_retests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    original_question_id VARCHAR(64) NOT NULL,
    current_stage VARCHAR(32) NOT NULL CHECK (current_stage IN (
        'micro_review',
        'retest_24h',
        'retest_7d_variant',
        'retest_30d_mastery',
        'mastered'
    )),
    error_type VARCHAR(64) NOT NULL,
    confidence_level VARCHAR(32) NOT NULL,
    chosen_distractor_role VARCHAR(64),
    scheduled_for DATE NOT NULL,
    last_retest_at TIMESTAMP WITH TIME ZONE,
    times_retested INTEGER DEFAULT 0,
    times_passed INTEGER DEFAULT 0,
    retention_rate NUMERIC(5,2) DEFAULT 0.00,
    status VARCHAR(32) DEFAULT 'pending' CHECK (status IN ('pending', 'ready', 'mastered')),
    micro_review_summary TEXT,
    variant_question_data JSONB,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    question_id VARCHAR(64) NOT NULL,
    scheduled_for DATE NOT NULL,
    interval_days INTEGER NOT NULL CHECK (interval_days IN (1, 7, 30)),
    times_reviewed INTEGER DEFAULT 0,
    status VARCHAR(32) DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
    added_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 6.6 Recomendações Pedagógicas de Estudo
CREATE TABLE IF NOT EXISTS public.study_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    topic_id VARCHAR(64),
    discipline_name VARCHAR(120) NOT NULL,
    priority VARCHAR(16) NOT NULL CHECK (priority IN ('ALTA', 'MEDIA', 'BAIXA')),
    action_text TEXT NOT NULL,
    generated_by VARCHAR(64) DEFAULT 'SISTEMA_PEDAGOGICO',
    is_dismissed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6.7 Resultados de Simulados
CREATE TABLE IF NOT EXISTS public.simulation_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    career_id VARCHAR(64),
    contest_id VARCHAR(64),
    total_questions INTEGER NOT NULL,
    correct_count INTEGER NOT NULL,
    wrong_count INTEGER NOT NULL,
    score_percentage NUMERIC(5,2) NOT NULL,
    time_spent_seconds INTEGER NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE NOT NULL,
    breakdown JSONB DEFAULT '[]'::jsonb
);

-- 6.8 Consentimento LGPD & Cookies
CREATE TABLE IF NOT EXISTS public.user_consents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    session_identifier VARCHAR(128),
    consent_type VARCHAR(64) NOT NULL CHECK (consent_type IN ('TERMS_OF_USE', 'PRIVACY_POLICY', 'COOKIES')),
    version VARCHAR(32) NOT NULL,
    preferences JSONB DEFAULT '{"necessary": true, "preferences": true, "analytics": false, "marketing": false}'::jsonb,
    ip_hashed VARCHAR(64),
    user_agent TEXT,
    consented_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- 7. TABELAS DE CONTEÚDO EDUCACIONAL E BANCO DE DADOS PÚBLICO
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.careers (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.contests (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    organization_id VARCHAR(64) NOT NULL,
    career_id VARCHAR(64) REFERENCES public.careers(id) ON DELETE RESTRICT,
    sphere VARCHAR(32) NOT NULL CHECK (sphere IN ('Federal', 'Estadual', 'Distrital', 'Municipal')),
    state_code VARCHAR(2),
    situation VARCHAR(64) NOT NULL,
    vacancies INTEGER DEFAULT 0,
    salary NUMERIC(12, 2) DEFAULT 0.00,
    exam_date DATE,
    examining_board VARCHAR(100) NOT NULL,
    status VARCHAR(32) DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'REVIEW', 'APPROVED', 'PUBLISHED', 'ARCHIVED')),
    is_deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.edicts (
    id VARCHAR(64) PRIMARY KEY,
    contest_id VARCHAR(64) REFERENCES public.contests(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    organization VARCHAR(120) NOT NULL,
    status VARCHAR(32) NOT NULL CHECK (status IN ('Aberto', 'Previsto', 'Em Andamento', 'Encerrado')),
    published_at DATE NOT NULL,
    official_gazette VARCHAR(255) NOT NULL,
    pdf_url TEXT,
    is_deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.disciplines (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(32) DEFAULT 'Específica' CHECK (category IN ('Básica', 'Específica', 'Legislação')),
    description TEXT,
    topics_count INTEGER DEFAULT 0,
    weight NUMERIC(3,1) DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.topics (
    id VARCHAR(64) PRIMARY KEY,
    discipline_id VARCHAR(64) REFERENCES public.disciplines(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    relevance VARCHAR(16) DEFAULT 'Alta' CHECK (relevance IN ('Alta', 'Média', 'Baixa')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.questions (
    id VARCHAR(64) PRIMARY KEY,
    statement TEXT NOT NULL,
    correct_option_letter CHAR(1) NOT NULL CHECK (correct_option_letter IN ('A', 'B', 'C', 'D', 'E')),
    explanation TEXT NOT NULL,
    discipline_id VARCHAR(64) REFERENCES public.disciplines(id) ON DELETE RESTRICT,
    topic_id VARCHAR(64) REFERENCES public.topics(id) ON DELETE SET NULL,
    examining_board VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    difficulty VARCHAR(32) NOT NULL CHECK (difficulty IN ('Fácil', 'Médio', 'Difícil')),
    status VARCHAR(32) DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'REVIEW', 'APPROVED', 'PUBLISHED', 'ARCHIVED')),
    is_deleted BOOLEAN DEFAULT false,
    author_id UUID REFERENCES public.profiles(id),
    reviewer_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- 8. TABELAS ADMINISTRATIVAS E DE GOVERNANÇA (RESTRITAS)
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    actor_email VARCHAR(255),
    action VARCHAR(120) NOT NULL,
    resource_type VARCHAR(64) NOT NULL,
    resource_id VARCHAR(128),
    metadata JSONB DEFAULT '{}'::jsonb,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.security_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(64) NOT NULL,
    severity VARCHAR(32) NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    ip_address VARCHAR(45),
    details TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.system_settings (
    key VARCHAR(64) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_by UUID REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.content_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id VARCHAR(64) NOT NULL,
    content_type VARCHAR(32) NOT NULL CHECK (content_type IN ('question', 'contest', 'edict', 'discipline')),
    version_number INTEGER NOT NULL,
    author_id UUID REFERENCES public.profiles(id),
    change_reason TEXT NOT NULL,
    current_snapshot JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- 9. HABILITAÇÃO ESTRITA DE ROW LEVEL SECURITY (RLS) EM TODAS AS TABELAS
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answer_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psychometric_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adaptive_retests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulation_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.edicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disciplines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_versions ENABLE ROW LEVEL SECURITY;

-- ====================================================================
-- 10. POLÍTICAS RLS ESPECÍFICAS
-- ====================================================================

-- --------------------------------------------------------------------
-- 10.1 PROFILES (Acesso exclusivo ao próprio perfil; Admins gerenciam)
-- --------------------------------------------------------------------
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles
    FOR SELECT USING (
        auth.uid() = auth_user_id OR public.is_admin()
    );

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own" ON public.profiles
    FOR INSERT WITH CHECK (
        (auth.uid() = auth_user_id AND role = 'user' AND is_blocked = false) OR public.is_super_admin()
    );

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles
    FOR UPDATE USING (
        auth.uid() = auth_user_id OR public.is_admin()
    ) WITH CHECK (
        -- Usuário comum só pode atualizar seu próprio perfil e NÃO pode alterar role nem bloqueio
        (auth.uid() = auth_user_id AND role = 'user' AND is_blocked = false) OR public.is_admin()
    );

DROP POLICY IF EXISTS "profiles_delete_admin_only" ON public.profiles;
CREATE POLICY "profiles_delete_admin_only" ON public.profiles
    FOR DELETE USING (
        public.is_super_admin()
    );

-- --------------------------------------------------------------------
-- 10.2 RESPOSTAS E CONFIANÇA (answer_logs)
-- Nunca confiar em user_id do frontend: valida candidate_id = get_current_user_profile_id()
-- --------------------------------------------------------------------
DROP POLICY IF EXISTS "answer_logs_select" ON public.answer_logs;
CREATE POLICY "answer_logs_select" ON public.answer_logs
    FOR SELECT USING (
        candidate_id = public.get_current_user_profile_id() OR public.is_admin()
    );

DROP POLICY IF EXISTS "answer_logs_insert" ON public.answer_logs;
CREATE POLICY "answer_logs_insert" ON public.answer_logs
    FOR INSERT WITH CHECK (
        candidate_id = public.get_current_user_profile_id()
    );

DROP POLICY IF EXISTS "answer_logs_update" ON public.answer_logs;
CREATE POLICY "answer_logs_update" ON public.answer_logs
    FOR UPDATE USING (
        candidate_id = public.get_current_user_profile_id()
    ) WITH CHECK (
        candidate_id = public.get_current_user_profile_id()
    );

-- --------------------------------------------------------------------
-- 10.3 SESSÕES DE ESTUDO (study_sessions)
-- --------------------------------------------------------------------
DROP POLICY IF EXISTS "study_sessions_select" ON public.study_sessions;
CREATE POLICY "study_sessions_select" ON public.study_sessions
    FOR SELECT USING (
        candidate_id = public.get_current_user_profile_id() OR public.is_admin()
    );

DROP POLICY IF EXISTS "study_sessions_insert" ON public.study_sessions;
CREATE POLICY "study_sessions_insert" ON public.study_sessions
    FOR INSERT WITH CHECK (
        candidate_id = public.get_current_user_profile_id()
    );

DROP POLICY IF EXISTS "study_sessions_update" ON public.study_sessions;
CREATE POLICY "study_sessions_update" ON public.study_sessions
    FOR UPDATE USING (
        candidate_id = public.get_current_user_profile_id()
    ) WITH CHECK (
        candidate_id = public.get_current_user_profile_id()
    );

-- --------------------------------------------------------------------
-- 10.4 PROGRESSO DO USUÁRIO (user_progress)
-- --------------------------------------------------------------------
DROP POLICY IF EXISTS "user_progress_select" ON public.user_progress;
CREATE POLICY "user_progress_select" ON public.user_progress
    FOR SELECT USING (
        candidate_id = public.get_current_user_profile_id() OR public.is_admin()
    );

DROP POLICY IF EXISTS "user_progress_insert" ON public.user_progress;
CREATE POLICY "user_progress_insert" ON public.user_progress
    FOR INSERT WITH CHECK (
        candidate_id = public.get_current_user_profile_id()
    );

DROP POLICY IF EXISTS "user_progress_update" ON public.user_progress;
CREATE POLICY "user_progress_update" ON public.user_progress
    FOR UPDATE USING (
        candidate_id = public.get_current_user_profile_id()
    ) WITH CHECK (
        candidate_id = public.get_current_user_profile_id()
    );

-- --------------------------------------------------------------------
-- 10.5 DIAGNÓSTICO PSICOMÉTRICO (psychometric_metrics)
-- --------------------------------------------------------------------
DROP POLICY IF EXISTS "psychometrics_select" ON public.psychometric_metrics;
CREATE POLICY "psychometrics_select" ON public.psychometric_metrics
    FOR SELECT USING (
        candidate_id = public.get_current_user_profile_id() OR public.is_admin()
    );

DROP POLICY IF EXISTS "psychometrics_upsert" ON public.psychometric_metrics;
CREATE POLICY "psychometrics_upsert" ON public.psychometric_metrics
    FOR ALL USING (
        candidate_id = public.get_current_user_profile_id() OR public.is_admin()
    ) WITH CHECK (
        candidate_id = public.get_current_user_profile_id() OR public.is_admin()
    );

-- --------------------------------------------------------------------
-- 10.6 RETESTES ADAPTATIVOS E REVISÕES (adaptive_retests, reviews)
-- --------------------------------------------------------------------
DROP POLICY IF EXISTS "adaptive_retests_all" ON public.adaptive_retests;
CREATE POLICY "adaptive_retests_all" ON public.adaptive_retests
    FOR ALL USING (
        candidate_id = public.get_current_user_profile_id() OR public.is_admin()
    ) WITH CHECK (
        candidate_id = public.get_current_user_profile_id()
    );

DROP POLICY IF EXISTS "reviews_all" ON public.reviews;
CREATE POLICY "reviews_all" ON public.reviews
    FOR ALL USING (
        candidate_id = public.get_current_user_profile_id() OR public.is_admin()
    ) WITH CHECK (
        candidate_id = public.get_current_user_profile_id()
    );

-- --------------------------------------------------------------------
-- 10.7 RECOMENDAÇÕES PEDAGÓGICAS (study_recommendations)
-- --------------------------------------------------------------------
DROP POLICY IF EXISTS "recommendations_select" ON public.study_recommendations;
CREATE POLICY "recommendations_select" ON public.study_recommendations
    FOR SELECT USING (
        candidate_id = public.get_current_user_profile_id() OR public.is_admin()
    );

DROP POLICY IF EXISTS "recommendations_update_dismiss" ON public.study_recommendations;
CREATE POLICY "recommendations_update_dismiss" ON public.study_recommendations
    FOR UPDATE USING (
        candidate_id = public.get_current_user_profile_id()
    ) WITH CHECK (
        candidate_id = public.get_current_user_profile_id()
    );

DROP POLICY IF EXISTS "recommendations_admin_manage" ON public.study_recommendations;
CREATE POLICY "recommendations_admin_manage" ON public.study_recommendations
    FOR ALL USING (
        public.is_admin()
    );

-- --------------------------------------------------------------------
-- 10.8 RESULTADOS DE SIMULADOS (simulation_results)
-- --------------------------------------------------------------------
DROP POLICY IF EXISTS "simulation_results_all" ON public.simulation_results;
CREATE POLICY "simulation_results_all" ON public.simulation_results
    FOR ALL USING (
        candidate_id = public.get_current_user_profile_id() OR public.is_admin()
    ) WITH CHECK (
        candidate_id = public.get_current_user_profile_id()
    );

-- --------------------------------------------------------------------
-- 10.9 CONSENTIMENTO LGPD (user_consents)
-- --------------------------------------------------------------------
DROP POLICY IF EXISTS "user_consents_select" ON public.user_consents;
CREATE POLICY "user_consents_select" ON public.user_consents
    FOR SELECT USING (
        user_id = public.get_current_user_profile_id() OR public.is_admin()
    );

DROP POLICY IF EXISTS "user_consents_insert" ON public.user_consents;
CREATE POLICY "user_consents_insert" ON public.user_consents
    FOR INSERT WITH CHECK (
        user_id IS NULL OR user_id = public.get_current_user_profile_id()
    );

-- --------------------------------------------------------------------
-- 10.10 CONTEÚDO EDUCACIONAL: QUESTÕES, CONCURSOS, EDITAIS
-- Usuários comuns visualizam apenas PUBLICADOS. Não podem publicar ou editar.
-- --------------------------------------------------------------------
DROP POLICY IF EXISTS "questions_select" ON public.questions;
CREATE POLICY "questions_select" ON public.questions
    FOR SELECT USING (
        (status = 'PUBLISHED' AND is_deleted = false) OR public.is_staff()
    );

DROP POLICY IF EXISTS "questions_write_staff_only" ON public.questions;
CREATE POLICY "questions_write_staff_only" ON public.questions
    FOR ALL USING (
        public.is_staff()
    ) WITH CHECK (
        public.is_staff()
    );

DROP POLICY IF EXISTS "contests_select" ON public.contests;
CREATE POLICY "contests_select" ON public.contests
    FOR SELECT USING (
        (status = 'PUBLISHED' AND is_deleted = false) OR public.is_staff()
    );

DROP POLICY IF EXISTS "contests_write_staff_only" ON public.contests;
CREATE POLICY "contests_write_staff_only" ON public.contests
    FOR ALL USING (
        public.is_staff()
    ) WITH CHECK (
        public.is_staff()
    );

DROP POLICY IF EXISTS "edicts_select" ON public.edicts;
CREATE POLICY "edicts_select" ON public.edicts
    FOR SELECT USING (
        is_deleted = false OR public.is_staff()
    );

DROP POLICY IF EXISTS "edicts_write_staff_only" ON public.edicts;
CREATE POLICY "edicts_write_staff_only" ON public.edicts
    FOR ALL USING (
        public.is_staff()
    ) WITH CHECK (
        public.is_staff()
    );

DROP POLICY IF EXISTS "disciplines_public_select" ON public.disciplines;
CREATE POLICY "disciplines_public_select" ON public.disciplines
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "disciplines_staff_manage" ON public.disciplines;
CREATE POLICY "disciplines_staff_manage" ON public.disciplines
    FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "topics_public_select" ON public.topics;
CREATE POLICY "topics_public_select" ON public.topics
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "topics_staff_manage" ON public.topics;
CREATE POLICY "topics_staff_manage" ON public.topics
    FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "careers_public_select" ON public.careers;
CREATE POLICY "careers_public_select" ON public.careers
    FOR SELECT USING (true);

-- --------------------------------------------------------------------
-- 10.11 DADOS ADMINISTRATIVOS: LOGS, EVENTOS DE SEGURANÇA E CONFIGURAÇÕES
-- Usuários comuns NUNCA podem acessar. Apenas administradores autorizados.
-- --------------------------------------------------------------------
DROP POLICY IF EXISTS "audit_logs_admin_only" ON public.audit_logs;
CREATE POLICY "audit_logs_admin_only" ON public.audit_logs
    FOR SELECT USING (
        public.is_admin()
    );

-- Logs de auditoria são IMUTÁVEIS (Nenhum UPDATE ou DELETE permitido)
DROP POLICY IF EXISTS "security_events_admin_only" ON public.security_events;
CREATE POLICY "security_events_admin_only" ON public.security_events
    FOR SELECT USING (
        public.is_admin()
    );

DROP POLICY IF EXISTS "system_settings_select" ON public.system_settings;
CREATE POLICY "system_settings_select" ON public.system_settings
    FOR SELECT USING (
        public.is_admin()
    );

DROP POLICY IF EXISTS "system_settings_manage" ON public.system_settings;
CREATE POLICY "system_settings_manage" ON public.system_settings
    FOR ALL USING (
        public.is_admin()
    ) WITH CHECK (
        public.is_admin()
    );

DROP POLICY IF EXISTS "content_versions_staff_only" ON public.content_versions;
CREATE POLICY "content_versions_staff_only" ON public.content_versions
    FOR ALL USING (
        public.is_staff()
    ) WITH CHECK (
        public.is_staff()
    );

-- ====================================================================
-- 11. TRIGGERS DE INTEGRIDADE CONTRA ADULTERAÇÃO DE IDENTIDADE (ANTI-IDOR)
-- REGRA DO PROJETO: Nunca confiar no user_id enviado pelo cliente.
-- O banco de dados e o backend utilizam SEMPRE a identidade do usuário
-- autenticado no Supabase (auth.uid()) para garantir a propriedade dos dados.
-- ====================================================================

CREATE OR REPLACE FUNCTION public.enforce_candidate_identity()
RETURNS TRIGGER AS $$
DECLARE
    current_profile_id UUID;
BEGIN
    -- Administradores executando operações de manutenção/suporte
    IF public.is_admin() THEN
        RETURN NEW;
    END IF;

    -- Obtém o ID do perfil vinculado à sessão autenticada do Supabase
    current_profile_id := public.get_current_user_profile_id();
    IF current_profile_id IS NULL THEN
        RAISE EXCEPTION 'Acesso negado: Perfil do usuário autenticado não localizado. Faça login novamente.';
    END IF;

    -- Força a propriedade do registro para o usuário autenticado no Supabase
    -- Ignora qualquer candidate_id adulterado vindo do frontend
    NEW.candidate_id := current_profile_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Triggers Anti-IDOR aplicados a todas as tabelas de dados privados de usuários
DROP TRIGGER IF EXISTS trg_enforce_identity_answer_logs ON public.answer_logs;
CREATE TRIGGER trg_enforce_identity_answer_logs
    BEFORE INSERT OR UPDATE ON public.answer_logs
    FOR EACH ROW EXECUTE FUNCTION public.enforce_candidate_identity();

DROP TRIGGER IF EXISTS trg_enforce_identity_study_sessions ON public.study_sessions;
CREATE TRIGGER trg_enforce_identity_study_sessions
    BEFORE INSERT OR UPDATE ON public.study_sessions
    FOR EACH ROW EXECUTE FUNCTION public.enforce_candidate_identity();

DROP TRIGGER IF EXISTS trg_enforce_identity_user_progress ON public.user_progress;
CREATE TRIGGER trg_enforce_identity_user_progress
    BEFORE INSERT OR UPDATE ON public.user_progress
    FOR EACH ROW EXECUTE FUNCTION public.enforce_candidate_identity();

DROP TRIGGER IF EXISTS trg_enforce_identity_psychometrics ON public.psychometric_metrics;
CREATE TRIGGER trg_enforce_identity_psychometrics
    BEFORE INSERT OR UPDATE ON public.psychometric_metrics
    FOR EACH ROW EXECUTE FUNCTION public.enforce_candidate_identity();

DROP TRIGGER IF EXISTS trg_enforce_identity_adaptive_retests ON public.adaptive_retests;
CREATE TRIGGER trg_enforce_identity_adaptive_retests
    BEFORE INSERT OR UPDATE ON public.adaptive_retests
    FOR EACH ROW EXECUTE FUNCTION public.enforce_candidate_identity();

DROP TRIGGER IF EXISTS trg_enforce_identity_reviews ON public.reviews;
CREATE TRIGGER trg_enforce_identity_reviews
    BEFORE INSERT OR UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.enforce_candidate_identity();

DROP TRIGGER IF EXISTS trg_enforce_identity_simulation_results ON public.simulation_results;
CREATE TRIGGER trg_enforce_identity_simulation_results
    BEFORE INSERT OR UPDATE ON public.simulation_results
    FOR EACH ROW EXECUTE FUNCTION public.enforce_candidate_identity();

-- --------------------------------------------------------------------
-- 11.2 Trigger de Proteção de Publicação de Conteúdo
-- Usuários comuns e editores NÃO podem publicar conteúdo diretamente.
-- Apenas Administradores (admin / super_admin) possuem autorização.
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.check_content_publishing_permission()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.status = 'PUBLISHED') AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'PUBLISHED') THEN
        IF NOT public.is_admin() THEN
            RAISE EXCEPTION 'Acesso negado: Apenas Administradores podem publicar conteúdo na plataforma.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_check_publish_questions ON public.questions;
CREATE TRIGGER trg_check_publish_questions
    BEFORE INSERT OR UPDATE ON public.questions
    FOR EACH ROW EXECUTE FUNCTION public.check_content_publishing_permission();

DROP TRIGGER IF EXISTS trg_check_publish_contests ON public.contests;
CREATE TRIGGER trg_check_publish_contests
    BEFORE INSERT OR UPDATE ON public.contests
    FOR EACH ROW EXECUTE FUNCTION public.check_content_publishing_permission();

-- --------------------------------------------------------------------
-- 11.3 Trigger de Imutabilidade Estrita de Logs e Auditoria
-- Protege a integridade legal da plataforma contra adulteração
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.prevent_log_tampering()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Operação ilegal: Registros de auditoria e segurança são estritamente imutáveis (append-only).';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_protect_audit_logs ON public.audit_logs;
CREATE TRIGGER trg_protect_audit_logs
    BEFORE UPDATE OR DELETE ON public.audit_logs
    FOR EACH ROW EXECUTE FUNCTION public.prevent_log_tampering();

DROP TRIGGER IF EXISTS trg_protect_security_events ON public.security_events;
CREATE TRIGGER trg_protect_security_events
    BEFORE UPDATE OR DELETE ON public.security_events
    FOR EACH ROW EXECUTE FUNCTION public.prevent_log_tampering();

-- ====================================================================
-- 12. SUÍTE DE TESTES DE SEGURANÇA E VALIDAÇÃO DE POLÍTICAS RLS
-- Executável no SQL Editor do Supabase para certificar conformidade dos 4 testes:
--
-- TESTE 1: Usuário acessando dados de outro usuário (Bloqueio IDOR)
--   DO $$
--   BEGIN
--     -- Configura contexto de execução como candidato Silva
--     -- SET LOCAL role TO authenticated;
--     -- SET LOCAL "request.jwt.claim.sub" TO '<auth_user_id_silva>';
--     -- SELECT * FROM public.answer_logs WHERE candidate_id = '<profile_id_souza>';
--     -- Resultado esperado: 0 linhas retornadas pelo RLS (acesso restrito aos próprios dados).
--   END $$;
--
-- TESTE 2: Usuário tentando acessar /admin (dados administrativos)
--   DO $$
--   BEGIN
--     -- SELECT * FROM public.audit_logs; -> 0 linhas retornadas (apenas is_admin() tem acesso).
--     -- SELECT * FROM public.system_settings; -> 0 linhas retornadas.
--     -- SELECT * FROM public.security_events; -> 0 linhas retornadas.
--   END $$;
--
-- TESTE 3: Usuário tentando alterar role
--   DO $$
--   BEGIN
--     -- UPDATE public.profiles SET role = 'admin' WHERE auth_user_id = auth.uid();
--     -- Resultado esperado: Exception lançada por trg_check_profile_permission_changes:
--     -- 'Acesso negado: Apenas Super Administradores podem alterar papéis (roles) de usuários.'
--   END $$;
--
-- TESTE 4: Usuário tentando alterar dados de outro usuário
--   DO $$
--   BEGIN
--     -- UPDATE public.profiles SET name = 'Invasor' WHERE id = '<outro_usuario_id>';
--     -- Resultado esperado: 0 linhas afetadas pelo RLS (profiles_update_own).
--     -- INSERT INTO public.answer_logs (candidate_id, question_id, ...) VALUES ('<outro_id>', 'qst-1', ...);
--     -- Resultado esperado: Trigger trg_enforce_identity_answer_logs substitui automaticamente
--     -- candidate_id pelo perfil do usuário autenticado no Supabase, impedindo adulteração de autoria.
--   END $$;
-- ====================================================================
