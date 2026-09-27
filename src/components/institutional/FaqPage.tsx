import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, Shield, BookOpen, Brain, Clock, Lock } from 'lucide-react';
import { InstitutionalHeader } from './InstitutionalHeader';

interface FaqPageProps {
  onNavigate: (path: string) => void;
  isAuthenticated?: boolean;
}

interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQ_DATA: FaqItem[] = [
  // 1. Conta e Acesso
  {
    id: 'f1',
    category: 'Conta e Acesso',
    question: 'Como crio minha conta de candidato no FOCO NA FARDA?',
    answer: 'Basta acessar a página de Cadastro (/cadastro), preencher seu nome completo ou nome de guerra, e-mail autêntico, definir uma senha de no mínimo 6 caracteres e aceitar os Termos de Uso e a Política de Privacidade. O acesso é imediato.',
  },
  {
    id: 'f2',
    category: 'Conta e Acesso',
    question: 'Esqueci minha senha de acesso, como posso recuperá-la?',
    answer: 'Na tela de Login, clique no link "Esqueci minha senha" ou navegue diretamente para /recuperar-senha. Digite seu e-mail cadastrado e você receberá as instruções para cadastrar uma nova senha com total segurança.',
  },
  {
    id: 'f3',
    category: 'Conta e Acesso',
    question: 'Posso compartilhar minha conta com outro candidato?',
    answer: 'Não. Conforme previsto expressamente nos Termos de Uso, a conta é individual, confidencial e intransferível. O compartilhamento compromete suas métricas de estudo, taxa de acerto psicométrico e ranking, além de poder ensejar o bloqueio do cadastro.',
  },

  // 2. Metodologia e Questões
  {
    id: 'f4',
    category: 'Questões e Metodologia',
    question: 'De onde vêm as questões do banco de dados?',
    answer: 'Nossas questões oficiais são rigorosamente extraídas de concursos públicos anteriores realizados por bancas examinadoras consagradas (como Cebraspe, Fundação Vunesp, FGV, IBFC, IDECAN e bancas estaduais), com citação expressa da fonte, ano e cargo.',
  },
  {
    id: 'f5',
    category: 'Questões e Metodologia',
    question: 'Como funciona o sistema de Reteste Adaptativo de 24h, 7d e 30d?',
    answer: 'Quando você erra uma questão, ela não é descartada. O sistema agenda automaticamente retestes nos intervalos de 24 horas, 7 dias (com variante inédita para testar a mesma regra) e 30 dias, aplicando a metodologia de repetição espaçada contra a curva do esquecimento de Ebbinghaus.',
  },
  {
    id: 'f6',
    category: 'Questões e Metodologia',
    question: 'O que significa o nível de convicção (Certeza, Dúvida, Chute)?',
    answer: 'Ao resolver cada questão, você pode indicar se respondeu com Certeza, se estava em Dúvida ou se Chutou. Isso permite ao nosso motor psicométrico calcular o Índice Dunning-Kruger (quando o candidato erra acreditando estar certo), revelando pontos cegos imperceptíveis.',
  },

  // 3. Simulados e Cronômetro
  {
    id: 'f7',
    category: 'Simulados e Ferramentas',
    question: 'Como funcionam os simulados no padrão oficial de banca?',
    answer: 'Você pode realizar simulados completos cronometrados com contagem regressiva, simulando as condições reais do dia da prova, com cálculo da nota de corte, tempo médio gasto por bloco de questões e gabarito comentado ao final.',
  },
  {
    id: 'f8',
    category: 'Simulados e Ferramentas',
    question: 'O que é o cronômetro tático de estudo (Pomodoro / Foco)?',
    answer: 'É um timer integrado que registra suas horas líquidas diárias de estudo, alimenta sua meta diária configurada no perfil e confere pontos de experiência (XP) para evolução da sua patente militar na plataforma.',
  },

  // 4. Inteligência Artificial
  {
    id: 'f9',
    category: 'Inteligência Artificial',
    question: 'Como a IA do FOCO NA FARDA é utilizada?',
    answer: 'A inteligência artificial atua exclusivamente como mentora pedagógica auxiliar. Ela pode gerar explicações no nível iniciante ou tático avançado, apontar a pegadinha do distrator que induziu ao erro, criar flashcards e formular novas questões variantes autorais para reteste.',
  },
  {
    id: 'f10',
    category: 'Inteligência Artificial',
    question: 'A IA substitui a leitura da lei seca ou o edital oficial?',
    answer: 'Nunca. Conforme destacado em nossos Termos de Uso, a IA é uma ferramenta complementar. Em qualquer hipótese de divergência entre a resposta de um modelo de linguagem e o gabarito oficial divulgado pela banca examinadora em diário oficial, a banca sempre prevalece.',
  },

  // 5. Privacidade e Segurança
  {
    id: 'f11',
    category: 'Privacidade e Segurança',
    question: 'O FOCO NA FARDA vende meus dados para empresas terceiras?',
    answer: 'Não, sob hipótese alguma. Seguimos à risca a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018). Não comercializamos cadastros nem histórico de estudos com anunciantes ou terceiros.',
  },
  {
    id: 'f12',
    category: 'Privacidade e Segurança',
    question: 'Como posso alterar minhas opções de consentimento de cookies?',
    answer: 'Você pode clicar no link "Preferências de Cookies" no rodapé de qualquer página para abrir o painel e ativar ou desativar categorias de personalização e métricas quando desejar.',
  },
];

export const FaqPage: React.FC<FaqPageProps> = ({ onNavigate, isAuthenticated = false }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(['f1', 'f4', 'f9']));

  const categories = ['Todas', 'Conta e Acesso', 'Questões e Metodologia', 'Simulados e Ferramentas', 'Inteligência Artificial', 'Privacidade e Segurança'];

  const toggleItem = (id: string) => {
    const next = new Set(openIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setOpenIds(next);
  };

  const filteredFaqs = FAQ_DATA.filter((item) => {
    const matchesCat = selectedCategory === 'Todas' || item.category === selectedCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#070D1E] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      <InstitutionalHeader onNavigate={onNavigate} isAuthenticated={isAuthenticated} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#0C152B] via-slate-900 to-[#0A1128] border border-amber-500/30 p-6 sm:p-8 shadow-xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono-code font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Perguntas Frequentes & Manuais</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-tactical font-black text-white uppercase tracking-wider">
            Perguntas Frequentes (FAQ)
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Tire suas dúvidas sobre o funcionamento da plataforma, metodologia de resolução de questões, simulados táticos, inteligência artificial e privacidade.
          </p>

          {/* Barra de Pesquisa */}
          <div className="pt-2 relative max-w-xl">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquise por uma palavra-chave (ex: senha, simulados, IA, reteste)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-xs focus:border-amber-400 focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-5 pointer-events-none" />
          </div>
        </div>

        {/* Filtros de Categoria */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Lista de FAQs */}
        <div className="space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = openIds.has(faq.id);

              return (
                <div
                  key={faq.id}
                  className="rounded-2xl bg-[#0D1829] border border-slate-800 overflow-hidden transition"
                >
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-800/40 transition"
                  >
                    <div>
                      <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-amber-400 block mb-1">
                        {faq.category}
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-white">
                        {faq.question}
                      </h3>
                    </div>
                    <div className="p-1 rounded-lg bg-slate-900 text-slate-400 shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 animate-fade-in">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center rounded-2xl bg-[#0D1829] border border-slate-800 text-slate-400 text-xs">
              <p>Nenhuma dúvida encontrada com o termo "{search}".</p>
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('Todas');
                }}
                className="mt-2 text-amber-400 underline font-bold"
              >
                Limpar filtros de busca
              </button>
            </div>
          )}
        </div>

        {/* Box Não Encontrou */}
        <div className="p-6 rounded-2xl bg-[#0D1829] border border-slate-800 text-center space-y-3">
          <h3 className="text-sm font-tactical font-bold text-white uppercase tracking-wider">
            Não encontrou a resposta para sua dúvida?
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Nossa equipe de suporte está à disposição para auxiliá-lo em qualquer questão pedagógica ou técnica.
          </p>
          <button
            onClick={() => onNavigate('/contato')}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20"
          >
            Falar com a Central de Atendimento
          </button>
        </div>
      </main>
    </div>
  );
};
