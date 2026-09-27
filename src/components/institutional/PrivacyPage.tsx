import React from 'react';
import { Shield, Lock, Eye, Database, Server, RefreshCw, Mail, CheckCircle2, UserCheck } from 'lucide-react';
import { InstitutionalHeader } from './InstitutionalHeader';
import { PLATFORM_INFO } from './TermsPage';

interface PrivacyPageProps {
  onNavigate: (path: string) => void;
  isAuthenticated?: boolean;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate, isAuthenticated = false }) => {
  return (
    <div className="min-h-screen bg-[#070D1E] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      <InstitutionalHeader onNavigate={onNavigate} isAuthenticated={isAuthenticated} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#0C152B] via-slate-900 to-[#0A1128] border border-amber-500/30 p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-amber-400">
                CONFORMIDADE LGPD (LEI Nº 13.709/2018) • VERSÃO {PLATFORM_INFO.termsVersion}
              </span>
              <h1 className="text-2xl sm:text-3xl font-tactical font-black text-white uppercase tracking-wider">
                Política de Privacidade
              </h1>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Esta Política de Privacidade descreve com transparência e clareza como o <strong>{PLATFORM_INFO.platformName}</strong> coleta, trata, armazena e protege os dados pessoais dos candidatos que utilizam nossa plataforma educacional.
          </p>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap gap-4">
            <span>Última revisão: <strong>{PLATFORM_INFO.lastUpdated}</strong></span>
            <span>Encarregado (DPO): <strong className="text-amber-300">{PLATFORM_INFO.dpoEmail}</strong></span>
          </div>
        </div>

        {/* Quadro Resumo */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wide text-[11px]">
              <Lock className="w-4 h-4" />
              <span>Privacidade em Primeiro Lugar</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Não comercializamos nem compartilhamos seus dados com corretores ou redes de publicidade de terceiros.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wide text-[11px]">
              <Database className="w-4 h-4" />
              <span>Finalidade Estrita</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Coletamos apenas o indispensável para autenticação segura e para o cálculo do seu progresso tático de estudos.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wide text-[11px]">
              <UserCheck className="w-4 h-4" />
              <span>Controle do Titular</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Você pode solicitar acesso, alteração ou exclusão dos seus dados a qualquer momento pelo suporte oficial.
            </p>
          </div>
        </div>

        {/* Seções Detalhadas */}
        <div className="space-y-6 text-xs text-slate-300 leading-relaxed">
          {/* 1. Quais dados podem ser coletados */}
          <section className="rounded-2xl bg-[#0D1829] border border-slate-800 p-6 space-y-3">
            <h2 className="text-sm font-tactical font-bold text-white uppercase tracking-wider text-amber-400">
              1. Quais Dados Podem Ser Coletados
            </h2>
            <p>
              O <strong>{PLATFORM_INFO.platformName}</strong> coleta estritamente as informações necessárias para operar o sistema educacional:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-1 text-slate-300">
              <li><strong>Dados de identificação cadastral:</strong> Nome ou nome de guerra fornecido pelo usuário e endereço de e-mail autêntico.</li>
              <li><strong>Dados de autenticação:</strong> Identificador único gerado na sessão e tokens criptográficos para acesso seguro.</li>
              <li><strong>Preferências de preparação:</strong> Carreira de foco escolhida (ex: Polícia Militar, Civil, Federal, Rodoviária Federal), estado de preferência, meta diária de estudos e nível declarado.</li>
              <li><strong>Registros pedagógicos de estudo:</strong> Respostas a questões, gabaritos assinalados, tempo gasto por questão, nível de convicção (certeza, dúvida ou chute), simulados concluídos e histórico de revisões.</li>
              <li><strong>Dados técnicos essenciais:</strong> Endereço IP do acesso (com anonimização/hashing para auditoria de segurança) e preferências de cookies salvas.</li>
            </ul>
          </section>

          {/* 2. Finalidade da Coleta */}
          <section className="rounded-2xl bg-[#0D1829] border border-slate-800 p-6 space-y-3">
            <h2 className="text-sm font-tactical font-bold text-white uppercase tracking-wider text-amber-400">
              2. Finalidade do Tratamento dos Dados
            </h2>
            <p>
              Todos os dados coletados possuem finalidade legítima e transparente:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-1 text-slate-300">
              <li>Autenticar o candidato e garantir que somente ele tenha acesso às suas anotações e histórico;</li>
              <li>Calcular estatísticas de acerto, tempo médio, mapas de calor por disciplina e identificar pontos cegos de estudo;</li>
              <li>Alimentar o sistema de revisão espaçada de 24h, 7 dias e 30 dias para evitar a curva de esquecimento;</li>
              <li>Permitir o envio de notificações e alertas oficiais sobre abertura de inscrições e retificações de editais;</li>
              <li>Prevenir fraudes e garantir a segurança das contas da plataforma.</li>
            </ul>
          </section>

          {/* 3. Autenticação */}
          <section className="rounded-2xl bg-[#0D1829] border border-slate-800 p-6 space-y-3">
            <h2 className="text-sm font-tactical font-bold text-white uppercase tracking-wider text-amber-400">
              3. Autenticação e Credenciais de Acesso
            </h2>
            <p>
              A segurança de acesso é tratada com rigor militar. As senhas de usuários <strong>NUNCA</strong> são armazenadas em texto plano nem mantidas no banco de dados operacional da aplicação.
            </p>
            <p>
              A gestão de credenciais e a emissão de tokens de sessão utilizam protocolos seguros com criptografia e mecanismos de recuperação direta via e-mail.
            </p>
          </section>

          {/* 4. Dados de Estudo e Histórico */}
          <section className="rounded-2xl bg-[#0D1829] border border-slate-800 p-6 space-y-3">
            <h2 className="text-sm font-tactical font-bold text-white uppercase tracking-wider text-amber-400">
              4. Dados de Estudo, Resolução e Psicometria
            </h2>
            <p>
              Os registros de resolução de questões são vinculados exclusivamente ao perfil do candidato. As classificações de rankings comunitários utilizam apenas o nome de guerra público do candidato e suas pontuações acumuladas (XP e Patente), sem expor e-mails ou dados pessoais a outros estudantes.
            </p>
          </section>

          {/* 5. Cookies */}
          <section className="rounded-2xl bg-[#0D1829] border border-slate-800 p-6 space-y-3">
            <h2 className="text-sm font-tactical font-bold text-white uppercase tracking-wider text-amber-400">
              5. Cookies e Tecnologias de Armazenamento Local
            </h2>
            <p>
              Utilizamos cookies e chaves de armazenamento local (localStorage) no seu navegador para registrar se sua sessão está ativa e para lembrar preferências como filtros e concursos favoritos.
            </p>
            <p>
              Para detalhes específicos sobre cada categoria de cookie e como gerenciar seu consentimento a qualquer instante, acesse nossa{' '}
              <button
                type="button"
                onClick={() => onNavigate('/politica-de-cookies')}
                className="text-amber-400 font-bold underline hover:text-amber-300"
              >
                Política de Cookies
              </button>
              .
            </p>
          </section>

          {/* 6. Analytics */}
          <section className="rounded-2xl bg-[#0D1829] border border-slate-800 p-6 space-y-3">
            <h2 className="text-sm font-tactical font-bold text-white uppercase tracking-wider text-amber-400">
              6. Métricas de Desempenho e Analytics
            </h2>
            <p>
              Eventuais medições de desempenho da plataforma têm por objetivo exclusivo otimizar a velocidade das páginas, identificar instabilidades técnicas e detectar falhas de carregamento em dispositivos móveis.
            </p>
            <p>
              Essas métricas são analisadas de forma agregada e despersonalizada.
            </p>
          </section>

          {/* 7. Utilização da Inteligência Artificial */}
          <section className="rounded-2xl bg-[#0D1829] border border-slate-800 p-6 space-y-3">
            <h2 className="text-sm font-tactical font-bold text-white uppercase tracking-wider text-amber-400">
              7. Utilização da Inteligência Artificial
            </h2>
            <p>
              Quando o candidato solicita uma explicação pedagógica, micro-revisão tática ou geração de variante de questão com IA, são transmitidos para a API de inteligência artificial unicamente o <strong>enunciado da questão</strong>, as alternativas e o tipo de dúvida pedagógica apresentada.
            </p>
            <p>
              <strong>Nenhum dado pessoal sensível</strong> (como senhas, documentos pessoais ou dados bancários) é enviado ou utilizado para alimentar modelos públicos de inteligência artificial.
            </p>
          </section>

          {/* 8. Armazenamento e Segurança */}
          <section className="rounded-2xl bg-[#0D1829] border border-slate-800 p-6 space-y-3">
            <h2 className="text-sm font-tactical font-bold text-white uppercase tracking-wider text-amber-400">
              8. Armazenamento e Medidas de Segurança
            </h2>
            <p>
              Adotamos práticas técnicas e organizacionais compatíveis com os padrões de mercado e com as diretrizes da Autoridade Nacional de Proteção de Dados (ANPD):
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-1 text-slate-300">
              <li>Criptografia de ponta a ponta em trânsito via protocolo HTTPS / TLS;</li>
              <li>Isolamento de privilégios de banco de dados e controle de acesso estrito;</li>
              <li>Prevenção contra injeção SQL, Cross-Site Scripting (XSS) e requisições forjadas;</li>
              <li>Logs de auditoria restritos à coordenação de segurança da informação.</li>
            </ul>
          </section>

          {/* 9. Retenção de Dados */}
          <section className="rounded-2xl bg-[#0D1829] border border-slate-800 p-6 space-y-3">
            <h2 className="text-sm font-tactical font-bold text-white uppercase tracking-wider text-amber-400">
              9. Período de Retenção e Descarte
            </h2>
            <p>
              Seus dados pessoais e histórico de estudos permanecerão armazenados enquanto sua conta estiver ativa na plataforma, para viabilizar a continuidade da sua preparação para os certames pretendidos.
            </p>
            <p>
              Mediante solicitação de encerramento de conta, os dados identificáveis serão eliminados de forma definitiva, ressalvada a guarda indispensável para cumprimento de obrigações legais ou regulatórias.
            </p>
          </section>

          {/* 10. Direitos do Titular */}
          <section className="rounded-2xl bg-[#0D1829] border border-slate-800 p-6 space-y-3">
            <h2 className="text-sm font-tactical font-bold text-white uppercase tracking-wider text-amber-400">
              10. Direitos do Titular dos Dados (Art. 18 da LGPD)
            </h2>
            <p>
              Você, como titular de dados pessoais, possui os seguintes direitos garantidos por lei:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-1 text-slate-300">
              <li><strong>Confirmação e Acesso:</strong> Obter a confirmação da existência de tratamento e consultar seus dados na tela de Perfil;</li>
              <li><strong>Correção:</strong> Solicitar a atualização de dados incompletos, inexatos ou desatualizados;</li>
              <li><strong>Eliminação:</strong> Requerer a exclusão completa dos seus dados pessoais tratados com base em consentimento;</li>
              <li><strong>Portabilidade:</strong> Solicitar cópia legível do seu histórico de desempenho e simulados;</li>
              <li><strong>Revogação de Consentimento:</strong> Revogar a qualquer tempo as autorizações de cookies ou comunicações através dos canais oficiais.</li>
            </ul>
          </section>

          {/* 11. Canal de Contato */}
          <section className="rounded-2xl bg-[#0D1829] border border-slate-800 p-6 space-y-3">
            <h2 className="text-sm font-tactical font-bold text-white uppercase tracking-wider text-amber-400">
              11. Canal de Contato do Encarregado de Privacidade
            </h2>
            <p>
              Para exercer qualquer dos seus direitos ou esclarecer dúvidas sobre esta Política de Privacidade, entre em contato com nosso Encarregado pelo tratamento de dados pessoais:
            </p>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
              <Mail className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="font-bold text-white">Canal de Privacidade e LGPD</p>
                <p className="text-slate-400 text-xs font-mono-code">{PLATFORM_INFO.dpoEmail}</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
