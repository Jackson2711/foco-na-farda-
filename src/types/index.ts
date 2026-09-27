export type Sphere = 'Federal' | 'Estadual' | 'Distrital' | 'Municipal';

export type ContestSituation =
  | 'Previsto'
  | 'Autorizado'
  | 'Comissão formada'
  | 'Banca definida'
  | 'Edital publicado'
  | 'Inscrições abertas'
  | 'Inscrições encerradas'
  | 'Prova realizada'
  | 'Resultado'
  | 'Convocação'
  | 'Encerrado';

export type MilitaryRank =
  | 'Recruta'
  | 'Aluno'
  | 'Operacional'
  | 'Aspirante'
  | 'Cadete'
  | 'Oficial';

export interface Region {
  id: string;
  name: string;
}

export interface State {
  id: string;
  code: string; // e.g., 'SP', 'RJ', 'CE', 'DF', 'MG'
  name: string;
  regionId: string;
}

export interface City {
  id: string;
  name: string;
  stateId: string;
  ibgeCode?: string;
}

export interface Organization {
  id: string;
  name: string; // e.g. "Polícia Federal", "Polícia Militar do Estado de São Paulo"
  acronym: string; // "PF", "PMESP"
  sphere: Sphere;
  stateId?: string; // Optional if Federal
  cityId?: string; // Optional if not municipal
  websiteUrl?: string;
}

export interface Career {
  id: string;
  name: string; // e.g. "Polícia Militar", "Polícia Civil", "Polícia Federal", etc.
  description?: string;
  category: string;
}

export interface Position {
  id: string;
  name: string; // e.g. "Soldado", "Investigador", "Agente", "Oficial"
  careerId: string;
  educationLevel: 'Médio' | 'Médio/Técnico' | 'Superior' | 'Superior em Direito' | 'Qualquer Área';
  requirements?: string;
}

export interface ContestPhase {
  id: string;
  name: string; // e.g. 'Prova Objetiva', 'TAF', 'Psicotécnico'
  description?: string;
}

export interface Contest {
  id: string;
  title: string;
  organizationId: string;
  careerId: string;
  positionId: string;
  sphere: Sphere;
  stateId?: string;
  cityId?: string;
  situation: ContestSituation;
  vacancies: number;
  salary: number;
  examDate?: string;
  registrationStart?: string;
  registrationEnd?: string;
  examiningBoard: string; // e.g. "Cebraspe", "Vunesp", "FGV", "IDECAN"
  isOfficialSource: boolean;
  sourceName: string;
  sourceUrl: string;
  publishedAt: string;
  updatedAt: string;
  edictUrl?: string;
  isHistorical?: boolean;
  requirements?: string;
  phases?: ContestPhase[];
  observations?: string;
  status?: ContentStatus;
  version?: number;
  authorId?: string;
  reviewerId?: string;
  isDeleted?: boolean;
}

export interface Discipline {
  id: string;
  name: string;
  description: string;
  topicsCount?: number;
}

export interface Topic {
  id: string;
  disciplineId: string;
  name: string;
  summary?: string;
}

export type ErrorType =
  | 'Conceito'
  | 'Interpretacao_Pegadinha'
  | 'Atencao_Leitura'
  | 'Memorizacao'
  | 'Chute';

export type ConfidenceLevel = 'Certeza' | 'Duvida' | 'Chute';

export type DistractorRole =
  | 'Conceitual'
  | 'InversaoRegra'
  | 'PrazoNumero'
  | 'PegadinhaSemantica'
  | 'GeneralizacaoIndevida'
  | 'Extrapolacao'
  | 'Gabarito';

export interface DistractorAnalysis {
  letter: 'A' | 'B' | 'C' | 'D' | 'E';
  role: DistractorRole;
  roleDescription: string;
  trapExplanation: string; // Como a banca montou essa armadilha
}

export interface QuestionOption {
  id: string;
  letter: 'A' | 'B' | 'C' | 'D' | 'E';
  text: string;
  distractorRole?: DistractorRole;
  distractorExplanation?: string;
}

export interface Question {
  id: string;
  codeNumber: number;
  statement: string; // Enunciado
  options: QuestionOption[];
  correctOptionLetter: 'A' | 'B' | 'C' | 'D' | 'E';
  explanation: string;
  disciplineId: string;
  subdiscipline?: string;
  topic?: string;
  careerId: string;
  positionName: string;
  contestTitle: string;
  year: number;
  examiningBoard: string; // Banca
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  source: string;
  questionType?: 'OFICIAL' | 'AUTORAL' | 'GERADA POR IA';
  tags: string[];
  distractors?: DistractorAnalysis[];
  isAdaptiveVariant?: boolean;
  derivedFromQuestionId?: string;
  status?: ContentStatus;
  version?: number;
  authorId?: string;
  reviewerId?: string;
  isDeleted?: boolean;
}

export interface QuestionAnswerRecord {
  id: string;
  userId: string;
  questionId: string;
  selectedOptionLetter: 'A' | 'B' | 'C' | 'D' | 'E';
  isCorrect: boolean;
  answeredAt: string;
  timeSpentSeconds: number;
  confidenceLevel?: ConfidenceLevel;
  errorType?: ErrorType;
  chosenDistractorRole?: DistractorRole;
  isDunningKruger?: boolean; // Erro com alta certeza
}

export type RetestStage =
  | 'micro_review'
  | 'retest_24h'
  | 'retest_7d_variant'
  | 'retest_30d_mastery'
  | 'mastered';

export interface AdaptiveRetestItem {
  id: string;
  userId: string;
  originalQuestionId: string;
  currentStage: RetestStage;
  errorType: ErrorType;
  confidenceLevel: ConfidenceLevel;
  chosenDistractorRole?: DistractorRole;
  scheduledFor: string; // ISO date
  lastRetestAt?: string;
  timesRetested: number;
  timesPassed: number;
  retentionRate: number; // 0 to 100%
  status: 'pending' | 'ready' | 'mastered';
  notes?: string;
  microReviewSummary?: string;
  variantQuestion?: Question;
  addedAt: string;
}

export interface PsychometricMetrics {
  totalAnswered: number;
  totalCorrect: number;
  accuracyRate: number;
  errorDistribution: Record<ErrorType, number>;
  confidenceAccuracy: {
    certezaTotal: number;
    certezaCorrect: number;
    certezaAccuracy: number;
    certezaErrors: number; // Dunning-Kruger count
    duvidaTotal: number;
    duvidaCorrect: number;
    duvidaAccuracy: number;
    chuteTotal: number;
    chuteCorrect: number;
    chuteAccuracy: number;
  };
  distractorVulnerabilities: Record<DistractorRole, { count: number; percentage: number }>;
  dunningKrugerIndex: number; // % de erros cometidos sob convicção de certeza
  blindSpotsCount: number;
  retentionRateScore: number;
  topWeakTopics: {
    topic: string;
    discipline: string;
    errors: number;
    total: number;
    errorRate: number;
  }[];
}

export interface StudySession {
  id: string;
  userId: string;
  disciplineId: string;
  contestId?: string;
  durationMinutes: number;
  mode: 'pomodoro' | 'foco' | 'personalizado';
  startedAt: string;
  completedAt: string;
  notes?: string;
}

export interface ReviewItem {
  id: string;
  userId: string;
  questionId: string;
  scheduledFor: string; // ISO date string
  intervalDays: 1 | 7 | 30;
  timesReviewed: number;
  addedAt: string;
  status: 'pending' | 'completed';
}

export interface SimulationResult {
  id: string;
  userId: string;
  title: string;
  careerId?: string;
  contestId?: string;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  scorePercentage: number;
  timeSpentSeconds: number;
  completedAt: string;
  breakdownByDiscipline: {
    disciplineName: string;
    total: number;
    correct: number;
  }[];
}

export type AppRole = 'user' | 'moderator' | 'editor' | 'admin' | 'super_admin' | 'candidate';

export interface AdminUserListItem {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'moderator' | 'editor' | 'admin' | 'super_admin';
  isBlocked: boolean;
  createdAt: string;
  updatedAt?: string;
  targetCareer?: string;
  targetContest?: string;
  questionsAnsweredCount?: number;
  lastActiveAt?: string;
}

export interface AdminDashboardMetrics {
  totalUsers: number;
  activeUsers: number;
  totalQuestions: number;
  totalContests: number;
  totalEditais: number;
  questionsAnswered: number;
  aiUsage: {
    totalCalls: number;
    tokensEstimated: number;
    cacheHitRatePercentage: number;
    killSwitchActive: boolean;
  };
  pendingReviewsCount: number;
}

export type ContentStatus = 'DRAFT' | 'REVIEW' | 'APPROVED' | 'PUBLISHED' | 'ARCHIVED';

export interface ContentVersion {
  id: string;
  contentId: string;
  contentType: 'question' | 'contest' | 'edict' | 'discipline';
  versionNumber: number;
  authorId: string;
  authorName: string;
  reviewerId?: string;
  reviewerName?: string;
  changeReason: string;
  previousSnapshot?: any;
  currentSnapshot: any;
  status: ContentStatus;
  createdAt: string;
}

export interface CookiePreferences {
  necessary: boolean; // Always true
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
  consentedAt: string;
  termsVersion: string;
  privacyVersion: string;
}

export interface AuditLog {
  id: string;
  actorUserId: string;
  actorEmail: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface SecurityEvent {
  id: string;
  eventType:
    | 'UNAUTHORIZED_ACCESS'
    | 'FORBIDDEN_ROUTE'
    | 'BRUTE_FORCE_LOGIN'
    | 'SUSPICIOUS_IDOR'
    | 'PRIVILEGE_ESCALATION'
    | 'KILL_SWITCH_TRIGGERED';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  userId?: string;
  ip?: string;
  details: string;
  timestamp: string;
}

export interface SystemSettings {
  aiKillSwitch: boolean;
  geminiModel: string;
  dailyLimitPerUser: number;
  monthlyLimitPerUser: number;
  maintenanceMode: boolean;
  registrationsOpen: boolean;
}

export interface AIUsageRecord {
  id: string;
  userId: string;
  operationType: string;
  model: string;
  tokensEstimated: number;
  durationMs: number;
  status: 'SUCCESS' | 'ERROR' | 'CACHED' | 'KILL_SWITCH';
  timestamp: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  loginMethod?: 'email' | 'google';
  role: AppRole;
  isBlocked?: boolean;
  mfaEnabled?: boolean;
  mfaVerified?: boolean;
  termsAcceptedAt?: string;
  privacyPolicyAcceptedAt?: string;
  termsVersion?: string;
  privacyVersion?: string;
  targetCareerId: string;
  targetContestId?: string;
  stateId?: string;
  cityId?: string;
  dailyStudyMinutes: number;
  studyLevel: 'Iniciante' | 'Intermediário' | 'Avançado';
  streakDays: number;
  xp: number;
  rank: MilitaryRank;
  createdAt: string;
  updatedAt?: string;
}

export interface FavoriteItem {
  id: string;
  userId: string;
  itemType: 'contest' | 'question' | 'discipline' | 'material';
  itemId: string;
  addedAt: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: 'Concursos' | 'Editais' | 'Segurança Pública' | 'Polícia' | 'Legislação' | 'Convocações' | 'Resultados';
  date: string;
  sourceName: string;
  sourceUrl: string;
  isOfficial: boolean;
}

export interface AlertNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'contest' | 'edict' | 'review' | 'system';
  isRead: boolean;
  createdAt: string;
}

export interface UserAlertPreferences {
  newContest: boolean;
  newEdict: boolean;
  openRegistrations: boolean;
  dateChange: boolean;
  results: boolean;
  convocations: boolean;
  pendingReviews: boolean;
  careerFilterId?: string;
  stateFilterId?: string;
}

export interface Flashcard {
  id: string;
  disciplineId: string;
  front: string;
  back: string;
  tag: string;
}
