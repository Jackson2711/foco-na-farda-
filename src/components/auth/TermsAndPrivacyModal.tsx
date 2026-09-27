import React from 'react';
import { Shield, FileText, Check, X } from 'lucide-react';

interface TermsAndPrivacyModalProps {
  type: 'terms' | 'privacy' | null;
  onClose: () => void;
}

export const TermsAndPrivacyModal: React.FC<TermsAndPrivacyModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl bg-[#0D1829] border border-amber-500/40 p-6 sm:p-8 shadow-2xl space-y-5 text-slate-100 relative max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold">
              {type === 'terms' ? <FileText className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-tactical font-black text-white uppercase tracking-wider">
                {type === 'terms' ? 'Termos de Uso da Plataforma' : 'Política de Privacidade e LGPD'}
              </h3>
              <p className="text-xs text-amber-400/90 font-mono-code">
                Versão 1.0.0 • Vigência 2026 • FOCO NA FARDA
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 text-xs text-slate-300 leading-relaxed">
          {type === 'terms' ? (
            <>
              <section className="space-y-1.5">
                <h4 className="font-bold text-white uppercase tracking-wide text-xs">
                  1. Objeto e Finalidade da Plataforma
                </h4>
                <p>
                  A plataforma <strong>FOCO NA FARDA</strong> é um ambiente de tecnologia educacional e simulador tático de alto rendimento voltado à preparação de candidatos para concursos públicos de segurança pública e carreiras afins no Brasil (Polícia Militar, Polícia Civil, Polícia Federal, Polícia Rodoviária Federal, Polícia Penal, Guardas Municipais e órgãos de trânsito).
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-bold text-white uppercase tracking-wide text-xs">
                  2. Cadastro, Acesso e Responsabilidade pelas Credenciais
                </h4>
                <p>
                  O cadastro é estritamente pessoal e intransferível. A autenticação é gerida via Supabase Auth, assegurando criptografia ponta a ponta. O usuário é o único responsável pela guarda e confidencialidade de sua senha e por todas as atividades realizadas em sua conta.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-bold text-white uppercase tracking-wide text-xs">
                  3. Propriedade Intelectual e Uso do Conteúdo
                </h4>
                <p>
                  As questões oficiais possuem fonte pública expressamente citada (bancas examinadoras e diários oficiais). As variantes adaptativas, explicações táticas, algoritmos de psicometria e análises de distratores constituem propriedade intelectual do FOCO NA FARDA. É expressamente vedada a reprodução comercial desautorizada, raspagem de dados (scraping) ou compartilhamento massivo de credenciais.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-bold text-white uppercase tracking-wide text-xs">
                  4. Conduta Ética e Disciplina do Candidato
                </h4>
                <p>
                  O candidato concorda em utilizar a plataforma com respeito, integridade e foco no aprendizado, não praticando atos que possam comprometer a integridade dos rankings públicos, fóruns ou sistemas de auditoria.
                </p>
              </section>
            </>
          ) : (
            <>
              <section className="space-y-1.5">
                <h4 className="font-bold text-white uppercase tracking-wide text-xs">
                  1. Conformidade com a Lei Geral de Proteção de Dados (LGPD)
                </h4>
                <p>
                  O <strong>FOCO NA FARDA</strong> respeita integralmente a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018). Coletamos e tratamos somente os dados estritamente necessários para o fornecimento do serviço educacional.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-bold text-white uppercase tracking-wide text-xs">
                  2. Dados Coletados e Sua Destinação
                </h4>
                <ul className="list-disc list-inside space-y-1 pl-1">
                  <li><strong>Dados de identificação:</strong> Nome, endereço de e-mail e identificador de autenticação único (UUID gerado pelo Supabase Auth).</li>
                  <li><strong>Dados pedagógicos e de estudo:</strong> Respostas a questões, tempo de resolução, nível de confiança (Certeza/Dúvida/Chute), diagnósticos de erro e retestes adaptativos.</li>
                  <li><strong>Segurança:</strong> Senhas NÃO são armazenadas no banco de dados da aplicação. Toda a autenticação e verificação de hash utilizam a infraestrutura segura do Supabase Auth.</li>
                </ul>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-bold text-white uppercase tracking-wide text-xs">
                  3. Direitos do Titular dos Dados
                </h4>
                <p>
                  Você pode a qualquer momento consultar seus dados cadastrais através da página de Perfil, solicitar a exclusão de sua conta, exportação de seu histórico de estudos ou revogação de consentimentos concedidos.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-bold text-white uppercase tracking-wide text-xs">
                  4. Compartilhamento e Sigilo
                </h4>
                <p>
                  Nenhum dado pessoal de candidatos é comercializado ou compartilhado com terceiros para fins de marketing ou publicidade. As métricas de rankings comunitários utilizam apenas o nome de guerra ou identificador público escolhido pelo candidato.
                </p>
              </section>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
