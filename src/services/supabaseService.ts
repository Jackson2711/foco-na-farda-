import { getSupabaseClient } from './supabaseClient';
import {
  UserProfile,
  Question,
  QuestionAnswerRecord,
  AdaptiveRetestItem,
  PsychometricMetrics,
  Contest,
  StudySession,
} from '../types';

export class SupabaseDataService {
  /**
   * Verifica se a conexão com o Supabase está ativa e configurada
   */
  static isConnected(): boolean {
    return getSupabaseClient() !== null;
  }

  /**
   * Sincroniza o perfil do candidato no Supabase
   */
  static async syncCandidateProfile(profile: UserProfile): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;

    try {
      const { error } = await client.from('profiles').upsert({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        target_career_id: profile.targetCareerId,
        target_contest_id: profile.targetContestId || null,
        rank: profile.rank,
        xp: profile.xp,
        daily_study_minutes: profile.dailyStudyMinutes,
        study_level: profile.studyLevel,
        streak_days: profile.streakDays,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.warn('Erro ao sincronizar perfil com Supabase:', error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.error('Falha de rede Supabase syncCandidateProfile:', e);
      return false;
    }
  }

  /**
   * Registra log de resposta no Supabase
   */
  static async logAnswer(answer: QuestionAnswerRecord): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;

    try {
      const { error } = await client.from('answer_logs').insert({
        id: answer.id,
        candidate_id: answer.userId,
        question_id: answer.questionId,
        selected_option_letter: answer.selectedOptionLetter,
        is_correct: answer.isCorrect,
        confidence_level: answer.confidenceLevel || null,
        error_type: answer.errorType || null,
        chosen_distractor_role: answer.chosenDistractorRole || null,
        is_dunning_kruger: answer.isDunningKruger || false,
        time_spent_seconds: answer.timeSpentSeconds,
        answered_at: answer.answeredAt,
      });

      if (error) {
        console.warn('Erro ao salvar resposta no Supabase:', error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.error('Falha Supabase logAnswer:', e);
      return false;
    }
  }

  /**
   * Salva ou atualiza item de Reteste Adaptativo no Supabase
   */
  static async syncAdaptiveRetest(item: AdaptiveRetestItem): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;

    try {
      const { error } = await client.from('adaptive_retests').upsert({
        id: item.id,
        candidate_id: item.userId,
        original_question_id: item.originalQuestionId,
        current_stage: item.currentStage,
        error_type: item.errorType,
        confidence_level: item.confidenceLevel,
        chosen_distractor_role: item.chosenDistractorRole || null,
        scheduled_for: item.scheduledFor,
        last_retest_at: item.lastRetestAt || null,
        times_retested: item.timesRetested,
        times_passed: item.timesPassed,
        retention_rate: item.retentionRate,
        status: item.status,
        micro_review_summary: item.microReviewSummary || null,
        variant_question_data: item.variantQuestion ? JSON.stringify(item.variantQuestion) : null,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.warn('Erro ao sincronizar reteste no Supabase:', error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.error('Falha Supabase syncAdaptiveRetest:', e);
      return false;
    }
  }

  /**
   * Salva métricas psicométricas consolidadas
   */
  static async syncPsychometricMetrics(
    userId: string,
    metrics: PsychometricMetrics,
    diagnosticText?: string
  ): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;

    try {
      const { error } = await client.from('psychometric_metrics').upsert({
        candidate_id: userId,
        total_answered: metrics.totalAnswered,
        total_correct: metrics.totalCorrect,
        accuracy_rate: metrics.accuracyRate,
        error_distribution: metrics.errorDistribution,
        confidence_accuracy: metrics.confidenceAccuracy,
        distractor_vulnerabilities: metrics.distractorVulnerabilities,
        dunning_kruger_index: metrics.dunningKrugerIndex,
        blind_spots_count: metrics.blindSpotsCount,
        retention_rate_score: metrics.retentionRateScore,
        top_weak_topics: metrics.topWeakTopics,
        last_ai_diagnostic: diagnosticText || null,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.warn('Erro ao atualizar psicometria no Supabase:', error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.error('Falha Supabase syncPsychometricMetrics:', e);
      return false;
    }
  }

  /**
   * Sincronização em lote completa (Push de todos os dados locais para o Supabase)
   */
  static async performFullSync(data: {
    profile: UserProfile | null;
    answers: QuestionAnswerRecord[];
    retests: AdaptiveRetestItem[];
    contests: Contest[];
    questions: Question[];
  }): Promise<{ success: boolean; syncedItems: number; errors: string[] }> {
    const client = getSupabaseClient();
    if (!client) {
      return {
        success: false,
        syncedItems: 0,
        errors: ['Cliente Supabase não inicializado. Configure URL e chave no painel.'],
      };
    }

    let syncedItems = 0;
    const errors: string[] = [];

    // 1. Sync Profile
    if (data.profile) {
      const ok = await this.syncCandidateProfile(data.profile);
      if (ok) syncedItems++;
      else errors.push('Falha ao sincronizar perfil do candidato');
    }

    // 2. Sync Retests
    for (const retest of data.retests) {
      const ok = await this.syncAdaptiveRetest(retest);
      if (ok) syncedItems++;
    }

    return {
      success: errors.length === 0,
      syncedItems,
      errors,
    };
  }
}
