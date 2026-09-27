import React from 'react';
import { FileText, Shield, AlertTriangle, CheckCircle2, Mail, Info } from 'lucide-react';
import { InstitutionalHeader } from './InstitutionalHeader';

interface TermsPageProps {
  onNavigate: (path: string) => void;
  isAuthenticated?: boolean;
}

// Configurações institucionais oficiais (claramente configuráveis sem dados fictícios)
export const PLATFORM_INFO = {
  platformName: 'FOCO NA FARDA',
  responsibleParty: 'Equipe de Coordenação Educacional FOCO NA FARDA',
  contactEmail: 'contato@foconafarda.com.br',
  dpoEmail: 'privacidade@foconafarda.com.br',
  businessDescription: 'Plataforma digital independente de apoio, simulação e estudo dirigido para concursos públicos',
  lastUpdated: '26 de setembro de 2026',
  termsVersion: '1.0.0',
};

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate, isAuthenticated = false }) => {
  return (
    <div className="min-h-screen bg-[#070D1E] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      <InstitutionalHeader onNavigate={onNavigate} isAuthenticated={isAuthenticated} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Banner de Título */}
        <div className="rounded-2xl bg-gradient-to-r from-[#0C152B] via-slate-900 to-[#0A1128] border border-amber-500/30 p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-amber-400">
                DOCUMENTO LEGAL OFICIAL • VERSÃO {PLATFORM_INFO.termsVersion}
              </span>
              <h1 className="text-2xl sm:text-3xl font-tactical font-black text-white uppercase tracking-wider">
                Termos de Uso da Plataforma
              </h1>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Estes Termos de Uso regulam o acesso, cadastro e a utilização de todos os recursos, simulados e conteúdos do <strong>{PLATFORM_INFO.platformName}</strong>. A leitura atenta é indispensável para todo candidato.
          </p>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap gap-4">
            <span>Última atualização: <strong>{PLATFORM_INFO.lastUpdated}</strong></span>
            <span>Canal de contato: <strong className="text-amber-300">{PLATFORM_INFO.contactEmail}</strong></span>
          </div>
        </div>

        {/* Quadro Informativo de Responsabilidade */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-2">
          <h3 className="font-bold text-white uppercase tracking-wide flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400" />
            Informações sobre a Gestão da Plataforma
          </h3>
          <p>
            <strong>Responsável:</strong> {PLATFORM_INFO.responsibleParty}
          </p>
          <p>
            <strong>Natureza do Serviço:</strong> {PLATFORM_INFO.businessDescription}. Não atuamos como órgão público militar, policial ou banca examinadora, prestando serviços exclusivamente educacionais e preparatórios.
          </p>
          <p>
            <strong>Contato Institucional:</strong> {PLATFORM_INFO.contactEmail}
          </p>
        </div>

        {/* Seções dos Termos */}
        <div className="space-y-6 text-xs text-slate-300 leading-relaxed">
          {/* 1. Utilização da Plataforma */}
          <section className="rounded-2xl bg-[#0D1829] border border-slate-800 p-6 space-y-3">
            <h2 className="text-sm font-tactical font-bold text-white uppercase tracking-wider text-amber-400">
              1. Utilização da Plataforma
            </h2>
            <p>
              Ao acessar, navegar ou se cadastrar no <strong>{PLATFORM_INFO.platformName}</strong>, o usuário declara ter capacidade civil plena e anui integralmente às disposições destes Termos de Uso.
            </p>
            <p>
              A plataforma foi desenvolvida como ferramenta tática de aprendizado, resolução de questões, acompanhamento de editais oficiais e mensuração de métricas de retenção para candidatos de concursos públicos (carreiras policiais, trânsito, bombeiros militares, guardas municipais e administrativas afins).
            </p>
          </section>

          {/* 2. Criação de Conta */}
          <section className="rounded-2xl bg-[#0D1829] border border-slate-800 p-6 space-y-3">
            <h2 className="text-sm font-tactical font-bold text-white uppercase tracking-wider text-amber-400">
              2. Criação de Conta, Segurança e Acesso
            </h2>
            <p>
              Para usufruir de ferramentas personalizadas (resolução de questões, histórico, simulados, cronômetro e diagnósticos), é necessário criar uma conta individual e intransferível, fornecendo nome e endereço de e-mail autêntico.
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-1 text-slate-300">
              <li>O usuário é o único responsável pela confidencialidade e guarda de sua senha e de seu acesso.</li>
              <li>É expressamente proibido ceder, emprestar, vender ou compartilhar credenciais de acesso com terceiros.</li>
              <li>Toda atividade realizada com suas credenciais será considerada de sua responsabilidade exclusiva.</li>
              <li>Caso suspeite de uso indevido de sua conta, o usuário deve comunicar imediatamente a equipe pelo e-mail {PLATFORM_INFO.contactEmail}.</li>
            </ul>
          </section>

          {/* 3. Conteúdo Educacional e Fontes Oficiais */}
          <section className="rounded-2xl bg-[#0D1829] border border-slate-800 p-6 space-y-3">
            <h2 className="text-sm font-tactical font-bold text-white uppercase tracking-wider text-amber-400">
              3. Conteúdo Educacional e Fontes Oficiais
            </h2>
            <p>
              O <strong>{PLATFORM_INFO.platformName}</strong> zela pela precisão pedagógica de todo material disponibilizado. As informações relativas a editais, prazos de inscrição, requisitos de investidura, remuneração e vagas baseiam-se em publicações oficiais de bancas examinadoras e diários oficiais.
            </p>
            <p>
              Em caso de divergência ou retificação de edital, o documento publicado no Diário Oficial e na página da banca examinadora competente sempre prevalece de forma absoluta.
            </p>
          </section>

          {/* 4. Questões e Simulados */}
          <section className="rounded-2xl bg-[#0D1829] border border-slate-800 p-6 space-y-3">
            <h2 className="text-sm font-tactical font-bold text-white uppercase tracking-wider text-amber-400">
              4. Banco de Questões, Gabaritos e Simulados
            </h2>
            <p>
              As questões disponibilizadas na plataforma subdividem-se em:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-1 text-slate-300">
              <li><strong>Oficiais:</strong> Extraídas de provas de concursos públicos pretéritos realizados por bancas idôneas, com citação expressa do órgão, cargo, banca e ano.</li>
              <li><strong>Autorais e Adaptativas:</strong> Desenvolvidas para treinamento cognitivo e reteste de padrões específicos de erro.</li>
            </ul>
            <p>
              Os simulados têm finalidade estritamente pedagógica de autoavaliação, não garantindo aprovação ou classificação em certames oficiais.
            </p>
          </section>

          {/* 5. Inteligência Artificial e Limitações */}
          <section className="rounded-2xl bg-[#0D1829] border border-slate-800 p-6 space-y-3">
            <h2 className="text-sm font-tactical font-bold text-white uppercase tracking-wider text-amber-400">
              5. Inteligência Artificial e suas Limitações
            </h2>
            <p>
              A plataforma disponibiliza assistentes de IA destinados a explicações táticas, resumos conceituais, mnemônicos e geração de retestes adaptativos.
            </p>
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Limitações Relevantes da Tecnologia de IA:</span>
              </div>
              <p>
                A inteligência artificial opera como ferramenta auxiliar de apoio pedagógico. Embora seja calibrada com foco na legislação e na jurisprudência brasileira, modelos de linguagem estão sujeitos a imprecisões ou alucinações. O candidato deve sempre manter o estudo fundamentado na letra da lei seca e nas súmulas dos tribunais superiores.
              </p>
            </div>
          </section>

          {/* 6. Responsabilidade do Usuário */}
          <section className="rounded-2xl bg-[#0D1829] border border-slate-800 p-6 space-y-3">
            <h2 className="text-sm font-tactical font-bold text-white uppercase tracking-wider text-amber-400">
              6. Responsabilidade e Conduta do Usuário
            </h2>
            <p>
              É terminantemente proibido ao usuário:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-1 text-slate-300">
              <li>Utilizar robôs, scripts, rastreadores (crawlers/scrapers) ou métodos automatizados para extrair conteúdos ou o banco de questões da plataforma;</li>
              <li>Realizar engenharia reversa, descompilação ou ataques cibernéticos contra a infraestrutura do sistema;</li>
              <li>Adotar condutas difamatórias, abusivas, discriminatórias ou ofensivas em canais de suporte, comentários ou rankings públicos;</li>
              <li>Tentar burlar pontuações, métricas ou mecanismos de segurança.</li>
            </ul>
          </section>

          {/* 7. Propriedade Intelectual */}
          <section className="rounded-2xl bg-[#0D1829] border border-slate-800 p-6 space-y-3">
            <h2 className="text-sm font-tactical font-bold text-white uppercase tracking-wider text-amber-400">
              7. Propriedade Intelectual
            </h2>
            <p>
              A marca <strong>FOCO NA FARDA</strong>, interface gráfica, logotipos, arquitetura de software, algoritmos psicométricos de mapeamento de distratores, textos autorais e metodologias pertencem aos seus criadores e são protegidos pela legislação de direitos autorais e propriedade industrial.
            </p>
            <p>
              É vedada a cópia, comercialização, distribuição ou reprodução pública não autorizada de qualquer elemento da plataforma.
            </p>
          </section>

          {/* 8. Suspensão de Contas */}
          <section className="rounded-2xl bg-[#0D1829] border border-slate-800 p-6 space-y-3">
            <h2 className="text-sm font-tactical font-bold text-white uppercase tracking-wider text-amber-400">
              8. Suspensão e Cancelamento de Contas
            </h2>
            <p>
              A coordenação do <strong>{PLATFORM_INFO.platformName}</strong> reserva-se o direito de advertir, suspender temporariamente ou cancelar em definitivo o acesso de qualquer usuário que descumprir as regras estabelecidas nestes Termos de Uso ou na legislação vigente, sem prejuízo das medidas cíveis e criminais cabíveis.
            </p>
          </section>

          {/* 9. Alterações dos Termos */}
          <section className="rounded-2xl bg-[#0D1829] border border-slate-800 p-6 space-y-3">
            <h2 className="text-sm font-tactical font-bold text-white uppercase tracking-wider text-amber-400">
              9. Alterações dos Termos
            </h2>
            <p>
              Estes Termos de Uso poderão ser revisados e atualizados periodicamente para refletir melhorias do produto ou adequações legais. Qualquer alteração substancial será informada com destaque na plataforma. A continuidade do uso após a publicação das alterações configura aceitação tácita.
            </p>
          </section>

          {/* 10. Foro e Contato */}
          <section className="rounded-2xl bg-[#0D1829] border border-slate-800 p-6 space-y-3">
            <h2 className="text-sm font-tactical font-bold text-white uppercase tracking-wider text-amber-400">
              10. Canal de Dúvidas e Atendimento
            </h2>
            <p>
              Em caso de dúvidas a respeito destes Termos de Uso ou sobre as políticas da plataforma, entre em contato através do e-mail <strong>{PLATFORM_INFO.contactEmail}</strong>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};
