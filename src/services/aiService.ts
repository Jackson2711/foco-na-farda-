import { PsychometricMetrics, Question, ErrorType, DistractorRole } from '../types';

export interface AIExplainParams {
  question: string;
  options: { letter: string; text: string }[];
  correctAnswer: string;
  explanation?: string;
  promptType: 'beginner' | 'tactical' | 'summary' | 'why_wrong' | 'flashcards' | 'custom';
  selectedOption?: string;
  customQuery?: string;
}

export async function explainWithAI(params: AIExplainParams): Promise<string> {
  try {
    const res = await fetch('/api/ai/explain', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Erro HTTP ${res.status}`);
    }

    const data = await res.json();
    return data.reply;
  } catch (error: any) {
    console.error('Falha ao conectar com o serviço de IA:', error);
    throw error;
  }
}

export async function generateAIStudyPlan(params: {
  targetCareer: string;
  targetContest: string;
  hoursPerDay: number;
  daysPerWeek: number;
  weakSubjects: string[];
  examDate?: string;
}): Promise<string> {
  try {
    const res = await fetch('/api/ai/study-plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Erro HTTP ${res.status}`);
    }

    const data = await res.json();
    return data.plan;
  } catch (error: any) {
    console.error('Falha ao gerar plano de estudos com IA:', error);
    throw error;
  }
}

export async function getMicroReviewWithAI(params: {
  question: string;
  chosenOption: string;
  correctOption: string;
  errorType?: ErrorType;
  distractorRole?: DistractorRole;
  explanation?: string;
}): Promise<string> {
  try {
    const res = await fetch('/api/ai/micro-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Erro HTTP ${res.status}`);
    }

    const data = await res.json();
    return data.microReview;
  } catch (error: any) {
    console.error('Falha ao obter micro-revisão:', error);
    throw error;
  }
}

export async function diagnosePatternsWithAI(params: {
  metrics: PsychometricMetrics;
  targetCareer?: string;
  targetContest?: string;
}): Promise<string> {
  try {
    const res = await fetch('/api/ai/diagnose-patterns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Erro HTTP ${res.status}`);
    }

    const data = await res.json();
    return data.diagnosticReport;
  } catch (error: any) {
    console.error('Falha ao obter laudo psicométrico:', error);
    throw error;
  }
}

export async function generateVariantQuestionWithAI(params: {
  originalQuestion: Question;
  errorType?: ErrorType;
  distractorRole?: DistractorRole;
}): Promise<Partial<Question> | null> {
  try {
    const res = await fetch('/api/ai/generate-variant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Erro HTTP ${res.status}`);
    }

    const data = await res.json();
    return data.variant;
  } catch (error: any) {
    console.error('Falha ao gerar variante autoral adaptativa:', error);
    throw error;
  }
}

export async function getRecoveryPlanWithAI(params: {
  topic: string;
  discipline: string;
  failureRate?: number;
}): Promise<string> {
  try {
    const res = await fetch('/api/ai/recovery-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Erro HTTP ${res.status}`);
    }

    const data = await res.json();
    return data.recoveryPlan;
  } catch (error: any) {
    console.error('Falha ao gerar plano de recuperação:', error);
    throw error;
  }
}

export async function getDistractorDeepDiveWithAI(params: {
  question: string;
  chosenOptionText: string;
  correctOptionText: string;
  distractorType?: string;
}): Promise<string> {
  try {
    const res = await fetch('/api/ai/distractor-deepdive', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Erro HTTP ${res.status}`);
    }

    const data = await res.json();
    return data.deepDive;
  } catch (error: any) {
    console.error('Falha ao analisar distrator:', error);
    throw error;
  }
}

export interface EditalInfo {
  title?: string;
  banca?: string;
  situacao?: string;
  requisitos?: string;
  observacoes?: string;
  fases?: string;
}

export interface SimulationGenerationParams {
  contestTitle?: string;
  careerName?: string;
  positionName?: string;
  organizationName?: string;
  locationState?: string;
  locationCity?: string;
  disciplineName: string;
  topicName?: string;
  examiningBoard?: string;
  difficulty?: 'Fácil' | 'Média' | 'Médio' | 'Difícil';
  quantity?: number;
  editalInfo?: EditalInfo;
}

export async function generateSimulationQuestions(
  params: SimulationGenerationParams
): Promise<{ questions: Question[]; context: any }> {
  try {
    const res = await fetch('/api/ai/generate-simulation-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Erro ao gerar simulado (HTTP ${res.status})`);
    }

    const data = await res.json();
    return {
      questions: data.questions || [],
      context: data.context || {},
    };
  } catch (error: any) {
    console.error('Falha em generateSimulationQuestions:', error);
    throw error;
  }
}

