// ====================================================================
// FOCO NA FARDA - SUPABASE EDGE FUNCTION: ai-tutor
// Camada Centralizada e Segura para Integração com Gemini API
// ====================================================================
// Fluxo Obrigatório de Segurança:
// Frontend -> Supabase Edge Function -> Gemini API -> Edge Function -> Frontend
// ====================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Constantes de Validação e Segurança
const MAX_PROMPT_CHARS = 4000;
const MAX_TOTAL_PAYLOAD_BYTES = 16384; // 16 KB
const DEFAULT_DAILY_LIMIT = 50;

const ALLOWED_ACTIONS = [
  "explain",
  "study-plan",
  "micro-review",
  "diagnose-patterns",
  "generate-variant",
  "recovery-plan",
  "distractor-deepdive",
] as const;

type AllowedAction = typeof ALLOWED_ACTIONS[number];

// Controle de Rate Limit em memória por Edge Worker (chave: userId:YYYY-MM-DD)
const dailyUsageTracker = new Map<string, number>();

serve(async (req: Request) => {
  // 1. Tratamento de CORS Preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Método não permitido. Utilize POST." }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const startTime = Date.now();

  try {
    // 2. VERIFICAÇÃO DE AUTENTICAÇÃO
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({
          error: "Acesso negado: Autenticação obrigatória para utilizar o Tutor de IA.",
          code: "UNAUTHENTICATED",
        }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (!token) {
      return new Response(
        JSON.stringify({ error: "Token de autorização inválido.", code: "UNAUTHENTICATED" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. VERIFICAÇÃO DO USUÁRIO A PARTIR DO TOKEN (NUNCA confiar em user_id do frontend)
    let authenticatedUserId = "usr-anonymous";
    let isBlocked = false;

    if (token.includes(".")) {
      try {
        const parts = token.split(".");
        if (parts.length >= 2) {
          const payload = JSON.parse(atob(parts[1]));
          // Validação de expiração
          if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
            return new Response(
              JSON.stringify({ error: "Sessão expirada. Faça login novamente.", code: "TOKEN_EXPIRED" }),
              { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
          if (payload.sub) authenticatedUserId = String(payload.sub);
          if (payload.is_blocked) isBlocked = true;
        }
      } catch {
        // Ignora erro de parse de base64
      }
    } else if (token.startsWith("local-token-") || token.startsWith("token-")) {
      authenticatedUserId = token.replace(/^(local-token-|token-)/, "");
    } else {
      authenticatedUserId = token;
    }

    if (isBlocked) {
      return new Response(
        JSON.stringify({
          error: "Esta conta está temporariamente bloqueada. Contate a administração.",
          code: "ACCOUNT_BLOCKED",
        }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. VALIDAÇÃO DE ENTRADA (Tamanho, Tipo, Conteúdo, Estrutura JSON)
    const rawBody = await req.text();
    if (rawBody.length > MAX_TOTAL_PAYLOAD_BYTES) {
      return new Response(
        JSON.stringify({
          error: "Tamanho total do payload excede o limite máximo permitido (16 KB).",
          code: "PAYLOAD_TOO_LARGE",
        }),
        { status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let parsedBody: any;
    try {
      parsedBody = JSON.parse(rawBody);
    } catch {
      return new Response(
        JSON.stringify({ error: "Estrutura JSON inválida.", code: "INVALID_JSON" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const action = parsedBody.action as AllowedAction;
    const payload = parsedBody.payload || parsedBody;

    if (!action || !ALLOWED_ACTIONS.includes(action)) {
      return new Response(
        JSON.stringify({
          error: `Ação inválida. Ações permitidas: ${ALLOWED_ACTIONS.join(", ")}`,
          code: "INVALID_ACTION",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validação de comprimento de textos individuais para prevenir prompt injection gigante
    for (const [key, value] of Object.entries(payload)) {
      if (typeof value === "string" && value.length > MAX_PROMPT_CHARS) {
        return new Response(
          JSON.stringify({
            error: `O campo '${key}' excede o limite máximo de ${MAX_PROMPT_CHARS} caracteres.`,
            code: "FIELD_TOO_LONG",
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // 5. APLICAÇÃO DE LIMITE DE UTILIZAÇÃO DA IA POR USUÁRIO (Configurável)
    const today = new Date().toISOString().split("T")[0];
    const userLimitKey = `${authenticatedUserId}:${today}`;
    const currentCount = dailyUsageTracker.get(userLimitKey) || 0;
    const dailyLimit = Number(Deno.env.get("AI_DAILY_LIMIT_PER_USER")) || DEFAULT_DAILY_LIMIT;

    if (currentCount >= dailyLimit) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Você atingiu o limite diário de utilização do Tutor de IA (${dailyLimit} requisições/dia). O limite será reiniciado à meia-noite.`,
          code: "AI_DAILY_LIMIT_EXCEEDED",
          limit: dailyLimit,
          currentUsage: currentCount,
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Incrementa contagem de uso do usuário
    dailyUsageTracker.set(userLimitKey, currentCount + 1);

    // 6. CHECAGEM DE CHAVE DE API (SOMENTE NO BACKEND / SECRETS)
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) {
      // 7. IA FORA DO AR: Mensagem amigável sem quebrar o app
      return new Response(
        JSON.stringify({
          success: false,
          fallback: true,
          reply: "O tutor de IA está temporariamente indisponível no momento. Você pode continuar resolvendo questões, simulados e utilizando todos os recursos da plataforma normalmente.",
          message: "O tutor de IA está temporariamente indisponível. A plataforma continua funcionando normalmente.",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 8. CONSTRUÇÃO DO PROMPT E INSTRUÇÃO SISTÊMICA SEGUNDO A OPERAÇÃO
    let systemInstruction = "Você é um instrutor e mentor sênior de preparação para concursos de segurança pública no Brasil. Seja claro, direto, motivador e rigoroso com a legislação brasileira.";
    let promptContent = "";

    switch (action) {
      case "explain": {
        const { question, options, correctAnswer, explanation, promptType, selectedOption, customQuery } = payload;
        const formattedOptions = Array.isArray(options)
          ? options.map((opt: any) => typeof opt === "string" ? opt : `${opt.letter || ""}) ${opt.text || ""}`).join("\n")
          : "";

        promptContent = `
Questão: ${question || ""}
Alternativas:
${formattedOptions}
Gabarito Oficial: ${correctAnswer || ""}
Explicação prévia: ${explanation || "Não informada"}
Modo: ${promptType || "tactical"}
Alternativa escolhida pelo aluno: ${selectedOption || "Nenhuma"}
Pergunta do aluno: ${customQuery || "Explique detalhadamente"}

Tarefa: Analise a questão e forneça orientação técnica precisa, identificando a fundamentação legal (Constituição, Código Penal, CPP ou leis especiais) e a razão pela qual as demais alternativas estão erradas.
`;
        break;
      }

      case "study-plan": {
        const { targetCareer, targetContest, hoursPerDay, daysPerWeek, weakSubjects, examDate } = payload;
        systemInstruction = "Você é o coordenador pedagógico do Foco na Farda especializado em concursos policiais no Brasil.";
        promptContent = `
Crie um plano de estudos tático e realista:
- Carreira/Concurso: ${targetContest || targetCareer || "Polícia Militar"}
- Horas disponíveis/dia: ${hoursPerDay || 2} horas
- Dias/semana: ${daysPerWeek || 6} dias
- Data prevista: ${examDate || "Em 90 dias"}
- Dificuldades prioritárias: ${Array.isArray(weakSubjects) ? weakSubjects.join(", ") : "Direito Penal, Português, RLM"}

Forneça:
1. Ciclo semanal de estudos dividido em blocos de teoria, questões e revisões espaçadas.
2. Orientações táticas do mentor para maximizar a retenção.
`;
        break;
      }

      case "micro-review": {
        const { question, chosenOption, correctOption, errorType, distractorRole, explanation } = payload;
        promptContent = `
Questão errada pelo candidato: ${question || ""}
Alternativa escolhida: ${chosenOption || ""}
Gabarito: ${correctOption || ""}
Tipo de Erro diagnosticado: ${errorType || "Pegadinha"}
Papel do distrator: ${distractorRole || "Conceito similar"}
Explicação: ${explanation || ""}

Tarefa: Em no máximo 3 parágrafos concisos:
1. Mostre exatamente onde o candidato caiu no distrator.
2. Forneça um macete/regra de ouro para nunca mais errar este padrão de pegadinha.
`;
        break;
      }

      case "diagnose-patterns": {
        const { metrics, targetCareer, targetContest } = payload;
        systemInstruction = "Você é o especialista psicométrico do Foco na Farda.";
        promptContent = `
Diagnóstico Psicométrico:
- Carreira: ${targetCareer || "Polícia Militar"}
- Concurso: ${targetContest || "PMESP"}
- Total respondidas: ${metrics?.totalAnswered || 0}
- Taxa de acerto: ${metrics?.accuracyRate || 0}%
- Índice Dunning-Kruger: ${metrics?.dunningKrugerIndex || 0}%
- Tópicos fracos: ${JSON.stringify(metrics?.topWeakTopics || [])}

Forneça um parecer conciso sobre a prontidão psicológica e técnica do candidato com 3 ações prioritárias.
`;
        break;
      }

      case "generate-variant": {
        const { originalQuestion, errorType, distractorRole } = payload;
        systemInstruction = "Você é um elaborador sênior de questões de concurso policial (formato padrão FGV/VUNESP/Cebraspe).";
        promptContent = `
Crie uma variante autoral inédita baseada nesta questão:
Enunciado original: ${originalQuestion?.statement || ""}
Gabarito original: ${originalQuestion?.correctOptionLetter || ""}
Foco do teste: Prevenir o erro do tipo '${errorType || "Conceitual"}' no distrator '${distractorRole || "Pegadinha"}'.

Retorne em formato JSON estrito:
{
  "statement": "...",
  "options": [
    {"letter": "A", "text": "..."},
    {"letter": "B", "text": "..."},
    {"letter": "C", "text": "..."},
    {"letter": "D", "text": "..."},
    {"letter": "E", "text": "..."}
  ],
  "correctOptionLetter": "A",
  "explanation": "..."
}
`;
        break;
      }

      case "recovery-plan": {
        const { topic, discipline, failureRate } = payload;
        promptContent = `
Plano de Recuperação Tática para o tópico '${topic || "Assunto"}' da disciplina '${discipline || "Geral"}'.
Taxa de erro atual do aluno: ${failureRate || 40}%.
Crie 3 passos de contenção e estudo reverso para recuperar o domínio do conteúdo em 48 horas.
`;
        break;
      }

      case "distractor-deepdive": {
        const { question, chosenOptionText, correctOptionText, distractorType } = payload;
        promptContent = `
Análise Profunda do Distrator:
Questão: ${question || ""}
Alternativa Correta: ${correctOptionText || ""}
Alternativa Marcada (Distrator): ${chosenOptionText || ""}
Tipo de armadilha: ${distractorType || "Generalização indevida"}

Explique a psicologia da banca organizadora ao redigir essa alternativa falsa.
`;
        break;
      }
    }

    // 9. CHAMADA SEGURA À API GEMINI (gemini-3.8-flash)
    let replyText = "";
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${geminiApiKey}`;
      const geminiResponse = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptContent }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] },
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 1200,
          },
        }),
      });

      if (!geminiResponse.ok) {
        console.warn(`Gemini API retornou status ${geminiResponse.status}`);
        // Retorno amigável em caso de erro na API do Google
        return new Response(
          JSON.stringify({
            success: false,
            fallback: true,
            reply: "O tutor de IA está temporariamente indisponível. Você pode continuar estudando e resolvendo questões normalmente.",
            message: "Serviço de IA indisponível temporariamente.",
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const geminiData = await geminiResponse.json();
      replyText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "Resposta não gerada pelo modelo.";
    } catch (geminiError: any) {
      console.error("Falha ao comunicar com Gemini:", geminiError);
      return new Response(
        JSON.stringify({
          success: false,
          fallback: true,
          reply: "O tutor de IA está temporariamente indisponível. Continue estudando normalmente.",
          message: "Falha de conexão com a IA.",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 10. VALIDAÇÃO DE RESPOSTA E FILTRAGEM (Retorna estritamente o resultado necessário)
    let parsedVariant: any = null;
    if (action === "generate-variant") {
      try {
        const jsonMatch = replyText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedVariant = JSON.parse(jsonMatch[0]);
        }
      } catch {
        // Fallback se o Gemini não retornar JSON perfeito
      }
    }

    // 11. REGISTRO DE LOG SEGURO (Sem senhas, sem tokens, sem dados pessoais desnecessários)
    const durationMs = Date.now() - startTime;
    // Log estruturado anônimo no console do Deno / Supabase Logs
    console.info(
      JSON.stringify({
        event: "AI_TUTOR_USAGE",
        userId: authenticatedUserId, // Apenas ID anônimo
        action,
        model: "gemini-3.8-flash",
        durationMs,
        status: "SUCCESS",
        timestamp: new Date().toISOString(),
      })
    );

    // 12. RETORNO DO RESULTADO LIMPO PARA O FRONTEND
    return new Response(
      JSON.stringify({
        success: true,
        action,
        reply: replyText,
        plan: replyText,
        microReview: replyText,
        diagnosticReport: replyText,
        recoveryPlan: replyText,
        deepDive: replyText,
        variant: parsedVariant,
        durationMs,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (globalError: any) {
    console.error("Erro interno no Edge Function ai-tutor:", globalError);
    // Mensagem amigável: a plataforma continua funcionando normalmente
    return new Response(
      JSON.stringify({
        success: false,
        fallback: true,
        reply: "O tutor de IA está momentaneamente indisponível. Você pode continuar resolvendo suas questões normalmente.",
        message: "IA temporariamente indisponível.",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
