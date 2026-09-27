import {
  Region,
  State,
  City,
  Organization,
  Career,
  Position,
  Contest,
  Discipline,
  Topic,
  Question,
  QuestionAnswerRecord,
  StudySession,
  ReviewItem,
  SimulationResult,
  UserProfile,
  FavoriteItem,
  NewsItem,
  AlertNotification,
  UserAlertPreferences,
  Flashcard,
  MilitaryRank,
  ErrorType,
  ConfidenceLevel,
  DistractorRole,
  AdaptiveRetestItem,
  PsychometricMetrics,
} from '../types';
import { SupabaseDataService } from './supabaseService';

// ==========================================
// SEED DATA: HIERARQUIA NACIONAL BRASILEIRA
// ==========================================

export const INITIAL_REGIONS: Region[] = [
  { id: 'reg-fed', name: 'Federal / Nacional' },
  { id: 'reg-no', name: 'Norte' },
  { id: 'reg-ne', name: 'Nordeste' },
  { id: 'reg-co', name: 'Centro-Oeste' },
  { id: 'reg-se', name: 'Sudeste' },
  { id: 'reg-sul', name: 'Sul' },
];

export const INITIAL_STATES: State[] = [
  // Federal
  { id: 'st-br', code: 'BR', name: 'Âmbito Federal', regionId: 'reg-fed' },
  // Centro-Oeste
  { id: 'st-df', code: 'DF', name: 'Distrito Federal', regionId: 'reg-co' },
  { id: 'st-go', code: 'GO', name: 'Goiás', regionId: 'reg-co' },
  { id: 'st-mt', code: 'MT', name: 'Mato Grosso', regionId: 'reg-co' },
  { id: 'st-ms', code: 'MS', name: 'Mato Grosso do Sul', regionId: 'reg-co' },
  // Sudeste
  { id: 'st-sp', code: 'SP', name: 'São Paulo', regionId: 'reg-se' },
  { id: 'st-rj', code: 'RJ', name: 'Rio de Janeiro', regionId: 'reg-se' },
  { id: 'st-mg', code: 'MG', name: 'Minas Gerais', regionId: 'reg-se' },
  { id: 'st-es', code: 'ES', name: 'Espírito Santo', regionId: 'reg-se' },
  // Nordeste
  { id: 'st-ce', code: 'CE', name: 'Ceará', regionId: 'reg-ne' },
  { id: 'st-ba', code: 'BA', name: 'Bahia', regionId: 'reg-ne' },
  { id: 'st-pe', code: 'PE', name: 'Pernambuco', regionId: 'reg-ne' },
  { id: 'st-ma', code: 'MA', name: 'Maranhão', regionId: 'reg-ne' },
  { id: 'st-pb', code: 'PB', name: 'Paraíba', regionId: 'reg-ne' },
  { id: 'st-rn', code: 'RN', name: 'Rio Grande do Norte', regionId: 'reg-ne' },
  { id: 'st-al', code: 'AL', name: 'Alagoas', regionId: 'reg-ne' },
  { id: 'st-se', code: 'SE', name: 'Sergipe', regionId: 'reg-ne' },
  { id: 'st-pi', code: 'PI', name: 'Piauí', regionId: 'reg-ne' },
  // Sul
  { id: 'st-pr', code: 'PR', name: 'Paraná', regionId: 'reg-sul' },
  { id: 'st-rs', code: 'RS', name: 'Rio Grande do Sul', regionId: 'reg-sul' },
  { id: 'st-sc', code: 'SC', name: 'Santa Catarina', regionId: 'reg-sul' },
  // Norte
  { id: 'st-am', code: 'AM', name: 'Amazonas', regionId: 'reg-no' },
  { id: 'st-pa', code: 'PA', name: 'Pará', regionId: 'reg-no' },
  { id: 'st-ro', code: 'RO', name: 'Rondônia', regionId: 'reg-no' },
  { id: 'st-ac', code: 'AC', name: 'Acre', regionId: 'reg-no' },
  { id: 'st-ap', code: 'AP', name: 'Amapá', regionId: 'reg-no' },
  { id: 'st-rr', code: 'RR', name: 'Roraima', regionId: 'reg-no' },
  { id: 'st-to', code: 'TO', name: 'Tocantins', regionId: 'reg-no' },
];

export const INITIAL_CITIES: City[] = [
  { id: 'ct-brasilia', name: 'Brasília', stateId: 'st-df', ibgeCode: '5300108' },
  { id: 'ct-sp', name: 'São Paulo', stateId: 'st-sp', ibgeCode: '3550308' },
  { id: 'ct-campinas', name: 'Campinas', stateId: 'st-sp', ibgeCode: '3509502' },
  { id: 'ct-rj', name: 'Rio de Janeiro', stateId: 'st-rj', ibgeCode: '3304557' },
  { id: 'ct-niteroi', name: 'Niterói', stateId: 'st-rj', ibgeCode: '3303302' },
  { id: 'ct-bh', name: 'Belo Horizonte', stateId: 'st-mg', ibgeCode: '3106200' },
  { id: 'ct-fortaleza', name: 'Fortaleza', stateId: 'st-ce', ibgeCode: '2304400' },
  { id: 'ct-salvador', name: 'Salvador', stateId: 'st-ba', ibgeCode: '2927408' },
  { id: 'ct-recife', name: 'Recife', stateId: 'st-pe', ibgeCode: '2611606' },
  { id: 'ct-curitiba', name: 'Curitiba', stateId: 'st-pr', ibgeCode: '4106902' },
  { id: 'ct-poa', name: 'Porto Alegre', stateId: 'st-rs', ibgeCode: '4314902' },
  { id: 'ct-manaus', name: 'Manaus', stateId: 'st-am', ibgeCode: '1302603' },
  { id: 'ct-belem', name: 'Belém', stateId: 'st-pa', ibgeCode: '1501402' },
  { id: 'ct-goiania', name: 'Goiânia', stateId: 'st-go', ibgeCode: '5208707' },
];

export const INITIAL_CAREERS: Career[] = [
  { id: 'car-pm', name: 'Polícia Militar', category: 'Segurança Pública Estadual', description: 'Policiamento ostensivo e preservação da ordem pública' },
  { id: 'car-pc', name: 'Polícia Civil', category: 'Polícia Judiciária Estadual', description: 'Investigação policial e apuração de infrações penais' },
  { id: 'car-pp', name: 'Polícia Penal', category: 'Execução Penal', description: 'Segurança dos estabelecimentos prisionais em esferas federal e estadual' },
  { id: 'car-pf', name: 'Polícia Federal', category: 'Polícia da União', description: 'Segurança nacional, fronteiras, crimes federais e interestaduais' },
  { id: 'car-prf', name: 'Polícia Rodoviária Federal', category: 'Polícia da União', description: 'Fiscalização e policiamento ostensivo das rodovias federais' },
  { id: 'car-gm', name: 'Guarda Municipal', category: 'Segurança Municipal', description: 'Proteção de bens, serviços, instalações e cidadãos nos municípios' },
  { id: 'car-detran', name: 'DETRAN', category: 'Trânsito e Fiscalização Estadual', description: 'Departamentos Estaduais de Trânsito, fiscalização, habilitação e vistoria' },
  { id: 'car-agente-transito', name: 'Agente de Trânsito', category: 'Fiscalização Viária Municipal', description: 'Autarquias municipais de trânsito, engenharia de tráfego e fiscalização viária' },
  { id: 'car-transito', name: 'Trânsito e Mobilidade Urbana', category: 'Fiscalização Viária Geral', description: 'Órgãos executivos e rodoviários de trânsito em âmbito nacional' },
  { id: 'car-judiciario', name: 'Judiciário', category: 'Poder Judiciário', description: 'Tribunais de Justiça, TRFs, TRTs, TSE, STJ e STF (Analista e Técnico)' },
  { id: 'car-legislativo', name: 'Legislativo', category: 'Poder Legislativo', description: 'Câmara dos Deputados, Senado Federal, Assembleias Legislativas e Câmaras Municipais' },
  { id: 'car-administrativo', name: 'Administrativo', category: 'Gestão e Administração', description: 'Carreiras de gestão pública, analista e técnico administrativo' },
  { id: 'car-fiscalizacao', name: 'Fiscalização', category: 'Fiscalização e Auditoria', description: 'IBAMA, ICMBio, Receita Federal, fiscais de posturas e tributários' },
  { id: 'car-petrobras', name: 'Petrobras', category: 'Economia Mista / Energia', description: 'Petróleo Brasileiro S.A. - Operações, segurança e nível técnico/superior' },
  { id: 'car-transpetro', name: 'Transpetro', category: 'Logística de Combustíveis', description: 'Petrobras Transporte S.A. - Dutos, terminais marítimos e navegação' },
  { id: 'car-bancos', name: 'Bancos Públicos', category: 'Setor Financeiro Público', description: 'Banco do Brasil, Caixa Econômica Federal e BNB' },
  { id: 'car-empresas-publicas', name: 'Empresas Públicas', category: 'Empresas Estatais', description: 'Correios, Dataprev, Serpro, Conab e empresas estatais federais' },
  { id: 'car-cbm', name: 'Corpo de Bombeiros Militar', category: 'Militar Estadual', description: 'Defesa civil, combate a incêndios e busca e salvamento' },
  { id: 'car-pcient', name: 'Polícia Científica / Perícia', category: 'Perícia Técnica', description: 'Produção de provas periciais técnicas e criminológicas' },
  { id: 'car-fa', name: 'Forças Armadas', category: 'Defesa da Pátria', description: 'Exército, Marinha e Aeronáutica' },
];

export const INITIAL_ORGANIZATIONS: Organization[] = [
  // Federais
  { id: 'org-pf', name: 'Departamento de Polícia Federal', acronym: 'PF', sphere: 'Federal', stateId: 'st-br', websiteUrl: 'https://www.gov.br/pf' },
  { id: 'org-prf', name: 'Polícia Rodoviária Federal', acronym: 'PRF', sphere: 'Federal', stateId: 'st-br', websiteUrl: 'https://www.gov.br/prf' },
  { id: 'org-senappen', name: 'Secretaria Nacional de Políticas Penais (Polícia Penal Federal)', acronym: 'SENAPPEN', sphere: 'Federal', stateId: 'st-br', websiteUrl: 'https://www.gov.br/senappen' },
  // São Paulo
  { id: 'org-pmesp', name: 'Polícia Militar do Estado de São Paulo', acronym: 'PMESP', sphere: 'Estadual', stateId: 'st-sp', websiteUrl: 'https://www.policiamilitar.sp.gov.br' },
  { id: 'org-pcsp', name: 'Polícia Civil do Estado de São Paulo', acronym: 'PCSP', sphere: 'Estadual', stateId: 'st-sp', websiteUrl: 'https://www.policiacivil.sp.gov.br' },
  { id: 'org-gcm-sp', name: 'Guarda Civil Metropolitana de São Paulo', acronym: 'GCM-SP', sphere: 'Municipal', stateId: 'st-sp', cityId: 'ct-sp', websiteUrl: 'https://capital.sp.gov.br/web/seguranca_urbana' },
  // Rio de Janeiro
  { id: 'org-pmerj', name: 'Polícia Militar do Estado do Rio de Janeiro', acronym: 'PMERJ', sphere: 'Estadual', stateId: 'st-rj', websiteUrl: 'https://sepm.rj.gov.br' },
  { id: 'org-pcerj', name: 'Polícia Civil do Estado do Rio de Janeiro', acronym: 'PCERJ', sphere: 'Estadual', stateId: 'st-rj', websiteUrl: 'https://policiacivilrj.net.br' },
  { id: 'org-cbmerj', name: 'Corpo de Bombeiros Militar do Estado do Rio de Janeiro', acronym: 'CBMERJ', sphere: 'Estadual', stateId: 'st-rj', websiteUrl: 'https://www.cbmerj.rj.gov.br' },
  // Minas Gerais
  { id: 'org-pmmg', name: 'Polícia Militar de Minas Gerais', acronym: 'PMMG', sphere: 'Estadual', stateId: 'st-mg', websiteUrl: 'https://www.policiamilitar.mg.gov.br' },
  { id: 'org-pcmg', name: 'Polícia Civil do Estado de Minas Gerais', acronym: 'PCMG', sphere: 'Estadual', stateId: 'st-mg', websiteUrl: 'https://www.policiacivil.mg.gov.br' },
  { id: 'org-ppmg', name: 'Polícia Penal do Estado de Minas Gerais', acronym: 'PPMG', sphere: 'Estadual', stateId: 'st-mg', websiteUrl: 'https://www.seguranca.mg.gov.br' },
  // Ceará
  { id: 'org-pmce', name: 'Polícia Militar do Ceará', acronym: 'PMCE', sphere: 'Estadual', stateId: 'st-ce', websiteUrl: 'https://www.pm.ce.gov.br' },
  { id: 'org-pcce', name: 'Polícia Civil do Estado do Ceará', acronym: 'PCCE', sphere: 'Estadual', stateId: 'st-ce', websiteUrl: 'https://www.policiacivil.ce.gov.br' },
  { id: 'org-gmf', name: 'Guarda Municipal de Fortaleza', acronym: 'GMF', sphere: 'Municipal', stateId: 'st-ce', cityId: 'ct-fortaleza', websiteUrl: 'https://www.fortaleza.ce.gov.br/seguranca' },
  // Distrito Federal
  { id: 'org-pmdf', name: 'Polícia Militar do Distrito Federal', acronym: 'PMDF', sphere: 'Distrital', stateId: 'st-df', websiteUrl: 'https://www.pmdf.df.gov.br' },
  { id: 'org-pcdf', name: 'Polícia Civil do Distrito Federal', acronym: 'PCDF', sphere: 'Distrital', stateId: 'st-df', websiteUrl: 'https://www.pcdf.df.gov.br' },
  // Bahia
  { id: 'org-pmba', name: 'Polícia Militar da Bahia', acronym: 'PMBA', sphere: 'Estadual', stateId: 'st-ba', websiteUrl: 'http://www.pm.ba.gov.br' },
  { id: 'org-pcba', name: 'Polícia Civil do Estado da Bahia', acronym: 'PCBA', sphere: 'Estadual', stateId: 'st-ba', websiteUrl: 'http://www.policiacivil.ba.gov.br' },
  // Trânsito & Fiscalização (Estaduais e Municipais)
  { id: 'org-detran-sp', name: 'Departamento Estadual de Trânsito de São Paulo', acronym: 'DETRAN-SP', sphere: 'Estadual', stateId: 'st-sp', websiteUrl: 'https://www.detran.sp.gov.br' },
  { id: 'org-detran-ce', name: 'Departamento Estadual de Trânsito do Ceará', acronym: 'DETRAN-CE', sphere: 'Estadual', stateId: 'st-ce', websiteUrl: 'https://www.detran.ce.gov.br' },
  { id: 'org-amc', name: 'Autarquia Municipal de Trânsito e Cidadania de Fortaleza', acronym: 'AMC', sphere: 'Municipal', stateId: 'st-ce', cityId: 'ct-fortaleza', websiteUrl: 'https://transito.fortaleza.ce.gov.br' },
  { id: 'org-cet-sp', name: 'Companhia de Engenharia de Tráfego de São Paulo', acronym: 'CET-SP', sphere: 'Municipal', stateId: 'st-sp', cityId: 'ct-sp', websiteUrl: 'https://www.cetsp.com.br' },
  // Judiciário & Tribunais
  { id: 'org-tjsp', name: 'Tribunal de Justiça do Estado de São Paulo', acronym: 'TJ-SP', sphere: 'Estadual', stateId: 'st-sp', websiteUrl: 'https://www.tjsp.jus.br' },
  { id: 'org-trf1', name: 'Tribunal Regional Federal da 1ª Região', acronym: 'TRF-1', sphere: 'Federal', stateId: 'st-df', websiteUrl: 'https://www.trf1.jus.br' },
  // Legislativo
  { id: 'org-senado', name: 'Senado Federal', acronym: 'SENADO', sphere: 'Federal', stateId: 'st-df', websiteUrl: 'https://www12.senado.leg.br' },
  { id: 'org-camara', name: 'Câmara dos Deputados', acronym: 'CD', sphere: 'Federal', stateId: 'st-df', websiteUrl: 'https://www.camara.leg.br' },
  // Fiscalização & Meio Ambiente
  { id: 'org-ibama', name: 'Instituto Brasileiro do Meio Ambiente e dos Recursos Naturais Renováveis', acronym: 'IBAMA', sphere: 'Federal', stateId: 'st-df', websiteUrl: 'https://www.gov.br/ibama' },
  // Empresas Públicas & Estatais
  { id: 'org-petrobras', name: 'Petróleo Brasileiro S.A.', acronym: 'PETROBRAS', sphere: 'Federal', stateId: 'st-rj', websiteUrl: 'https://petrobras.com.br' },
  { id: 'org-transpetro', name: 'Petrobras Transporte S.A.', acronym: 'TRANSPETRO', sphere: 'Federal', stateId: 'st-rj', websiteUrl: 'https://transpetro.com.br' },
  { id: 'org-caixa', name: 'Caixa Econômica Federal', acronym: 'CAIXA', sphere: 'Federal', stateId: 'st-df', websiteUrl: 'https://www.caixa.gov.br' },
  { id: 'org-bb', name: 'Banco do Brasil S.A.', acronym: 'BB', sphere: 'Federal', stateId: 'st-df', websiteUrl: 'https://www.bb.com.br' },
  { id: 'org-correios', name: 'Empresa Brasileira de Correios e Telégrafos', acronym: 'CORREIOS', sphere: 'Federal', stateId: 'st-df', websiteUrl: 'https://www.correios.com.br' },
];

export const INITIAL_POSITIONS: Position[] = [
  // PM
  { id: 'pos-pm-soldado', name: 'Soldado QPPM', careerId: 'car-pm', educationLevel: 'Médio', requirements: 'Ensino Médio completo, CNH B, idade de 18 a 30 anos' },
  { id: 'pos-pm-oficial', name: 'Aluno Oficial / Cadete', careerId: 'car-pm', educationLevel: 'Superior', requirements: 'Nível Superior (Direito ou Qualquer Área dependendo do Estado)' },
  // PC
  { id: 'pos-pc-investigador', name: 'Investigador de Polícia', careerId: 'car-pc', educationLevel: 'Superior', requirements: 'Nível Superior completo em qualquer área e CNH B' },
  { id: 'pos-pc-escrivao', name: 'Escrivão de Polícia', careerId: 'car-pc', educationLevel: 'Superior', requirements: 'Nível Superior completo em qualquer área e CNH B' },
  { id: 'pos-pc-delegado', name: 'Delegado de Polícia', careerId: 'car-pc', educationLevel: 'Superior em Direito', requirements: 'Bacharelado em Direito + 3 anos de atividade jurídica ou policial' },
  { id: 'pos-pc-papiloscopista', name: 'Papiloscopista Policial', careerId: 'car-pc', educationLevel: 'Superior', requirements: 'Nível Superior completo e CNH B' },
  // PF
  { id: 'pos-pf-agente', name: 'Agente de Polícia Federal', careerId: 'car-pf', educationLevel: 'Superior', requirements: 'Nível Superior em qualquer área e CNH B' },
  { id: 'pos-pf-escrivao', name: 'Escrivão de Polícia Federal', careerId: 'car-pf', educationLevel: 'Superior', requirements: 'Nível Superior em qualquer área e CNH B' },
  { id: 'pos-pf-delegado', name: 'Delegado de Polícia Federal', careerId: 'car-pf', educationLevel: 'Superior em Direito', requirements: 'Bacharelado em Direito + 3 anos de atividade jurídica ou policial' },
  { id: 'pos-pf-perito', name: 'Perito Criminal Federal', careerId: 'car-pf', educationLevel: 'Superior', requirements: 'Nível Superior em área específica exigida no edital' },
  // PRF
  { id: 'pos-prf-policial', name: 'Policial Rodoviário Federal', careerId: 'car-prf', educationLevel: 'Superior', requirements: 'Nível Superior em qualquer área e CNH B' },
  // Polícia Penal
  { id: 'pos-pp-policial', name: 'Policial Penal', careerId: 'car-pp', educationLevel: 'Superior', requirements: 'Nível Superior e CNH B' },
  // Guarda Municipal
  { id: 'pos-gm-guarda', name: 'Guarda Municipal 3ª Classe', careerId: 'car-gm', educationLevel: 'Médio', requirements: 'Ensino Médio completo e CNH A/B' },
  // Bombeiros
  { id: 'pos-cbm-soldado', name: 'Soldado Bombeiro Militar', careerId: 'car-cbm', educationLevel: 'Médio', requirements: 'Ensino Médio e aptidão física rigorosa' },
  { id: 'pos-cbm-oficial', name: 'Oficial Bombeiro Militar', careerId: 'car-cbm', educationLevel: 'Superior', requirements: 'Nível Superior' },
  // Trânsito & Fiscalização
  { id: 'pos-detran-oficial', name: 'Oficial Estadual de Trânsito', careerId: 'car-detran', educationLevel: 'Médio', requirements: 'Ensino Médio completo e CNH categoria B' },
  { id: 'pos-detran-agente', name: 'Agente Estadual de Trânsito', careerId: 'car-detran', educationLevel: 'Superior', requirements: 'Nível Superior em qualquer área e CNH B' },
  { id: 'pos-amc-agente', name: 'Agente de Operação e Fiscalização de Trânsito', careerId: 'car-agente-transito', educationLevel: 'Médio', requirements: 'Ensino Médio completo e CNH categoria B' },
  { id: 'pos-cet-gestor', name: 'Gestor de Tráfego e Fiscalização Viária', careerId: 'car-agente-transito', educationLevel: 'Superior', requirements: 'Nível Superior (Engenharia, Direito ou correlatas) e CNH B' },
  // Judiciário
  { id: 'pos-tj-escrevente', name: 'Escrevente Técnico Judiciário', careerId: 'car-judiciario', educationLevel: 'Médio', requirements: 'Ensino Médio completo' },
  { id: 'pos-trf-analista', name: 'Analista Judiciário - Área Judiciária', careerId: 'car-judiciario', educationLevel: 'Superior em Direito', requirements: 'Bacharelado em Direito' },
  // Legislativo
  { id: 'pos-policia-legislativa', name: 'Policial Legislativo Federal', careerId: 'car-legislativo', educationLevel: 'Superior', requirements: 'Nível Superior em qualquer área e CNH B' },
  // Fiscalização & Meio Ambiente
  { id: 'pos-ibama-analista', name: 'Analista Ambiental / Fiscal', careerId: 'car-fiscalizacao', educationLevel: 'Superior', requirements: 'Nível Superior em qualquer área' },
  // Petrobras & Transpetro
  { id: 'pos-petro-seguranca', name: 'Técnico de Segurança e Operação', careerId: 'car-petrobras', educationLevel: 'Médio/Técnico', requirements: 'Ensino Médio Técnico e registro no conselho profissional' },
  { id: 'pos-transpetro-tecnico', name: 'Profissional de Logística e Navegação', careerId: 'car-transpetro', educationLevel: 'Médio/Técnico', requirements: 'Ensino Médio Técnico' },
  // Bancos Públicos
  { id: 'pos-bb-escriturario', name: 'Escriturário - Agente Comercial / TI', careerId: 'car-bancos', educationLevel: 'Médio', requirements: 'Ensino Médio completo' },
  { id: 'pos-caixa-tecnico', name: 'Técnico Bancário Novo', careerId: 'car-bancos', educationLevel: 'Médio', requirements: 'Ensino Médio completo' },
  // Empresas Públicas
  { id: 'pos-correios-agente', name: 'Agente de Correios - Carteiro / Atendente', careerId: 'car-empresas-publicas', educationLevel: 'Médio', requirements: 'Ensino Médio completo' },
];

export const INITIAL_DISCIPLINES: Discipline[] = [
  { id: 'disc-const', name: 'Direito Constitucional', description: 'Direitos e garantias fundamentais, organização do Estado e da Segurança Pública (Art. 144 CF/88)', topicsCount: 8 },
  { id: 'disc-penal', name: 'Direito Penal', description: 'Parte Geral (aplicação da lei penal, crime, imputabilidade, penas) e Parte Especial (crimes contra pessoa e patrimônio)', topicsCount: 9 },
  { id: 'disc-proc-penal', name: 'Direito Processual Penal', description: 'Inquérito policial, ação penal, provas, prisões cautelares e medidas cautelares', topicsCount: 7 },
  { id: 'disc-admin', name: 'Direito Administrativo', description: 'Princípios da administração, atos administrativos, poderes, agentes públicos e responsabilidade civil', topicsCount: 7 },
  { id: 'disc-port', name: 'Língua Portuguesa', description: 'Interpretação e compreensão de textos, sintaxe, concordância, crase, pontuação e regência', topicsCount: 10 },
  { id: 'disc-rlm', name: 'Raciocínio Lógico e Matemático', description: 'Lógica proposicional, equivalências, diagramas lógicos, porcentagem e análise combinatória', topicsCount: 6 },
  { id: 'disc-info', name: 'Informática', description: 'Sistemas operacionais, redes, segurança da informação, computação em nuvem e ferramentas de escritório', topicsCount: 6 },
  { id: 'disc-leg-esp', name: 'Legislação Especial', description: 'Estatuto do Desarmamento, Lei de Drogas, Lei Maria da Penha, Crimes Hediondos e Abuso de Autoridade', topicsCount: 8 },
  { id: 'disc-dh', name: 'Direitos Humanos', description: 'Declaração Universal dos Direitos Humanos, Pacto de San José da Costa Rica e uso diferenciado da força', topicsCount: 5 },
  { id: 'disc-penal-mil', name: 'Direito Penal Militar', description: 'Código Penal Militar (crimes militares em tempo de paz, motim, insubordinação e deserção)', topicsCount: 5 },
  { id: 'disc-proc-mil', name: 'Processo Penal Militar', description: 'Código de Processo Penal Militar, polícia judiciária militar e inquérito policial militar (IPM)', topicsCount: 4 },
  { id: 'disc-crim', name: 'Criminologia', description: 'Teorias criminológicas, fatores sociais da criminalidade, vitimologia e prevenção criminal', topicsCount: 4 },
  { id: 'disc-med-leg', name: 'Medicina Legal', description: 'Traumatologia forense, tanatologia, asfixiologia e toxicologia forense', topicsCount: 5 },
  { id: 'disc-transito', name: 'Legislação de Trânsito', description: 'Código de Trânsito Brasileiro (CTB - Lei 9.503/97), normas de circulação, infrações e resoluções do CONTRAN', topicsCount: 8 },
  { id: 'disc-atual', name: 'Atualidades e Conhecimentos Gerais', description: 'Segurança pública no Brasil, relações internacionais, geopolítica e cidadania', topicsCount: 4 },
];

export const INITIAL_TOPICS: Topic[] = [
  { id: 'top-cf-direitos-fundamentais', disciplineId: 'disc-const', name: 'Direitos e Garantias Fundamentais', summary: 'Vida, liberdade, igualdade, segurança, propriedade, remédios constitucionais e direitos políticos.' },
  { id: 'top-cf-art144', disciplineId: 'disc-const', name: 'Segurança Pública na CF (Art. 144)', summary: 'Estrutura, órgãos e competências da segurança pública no Brasil.' },
  { id: 'top-cf-art5', disciplineId: 'disc-const', name: 'Direitos e Deveres Individuais e Coletivos (Art. 5º)', summary: 'Vida, liberdade, igualdade, segurança e propriedade; remédios constitucionais.' },
  { id: 'top-penal-crime', disciplineId: 'disc-penal', name: 'Teoria Geral do Crime', summary: 'Fato típico, antijurídico e culpável; excludentes de ilicitude e culpabilidade.' },
  { id: 'top-penal-patr', disciplineId: 'disc-penal', name: 'Crimes Contra o Patrimônio', summary: 'Furto, roubo, extorsão, estelionato e receptação.' },
  { id: 'top-proc-inq', disciplineId: 'disc-proc-penal', name: 'Inquérito Policial', summary: 'Conceito, características, instauração, prazos e arquivamento.' },
  { id: 'top-proc-prisao', disciplineId: 'disc-proc-penal', name: 'Prisão em Flagrante e Prisões Cautelares', summary: 'Espécies de flagrante, preventiva e temporária.' },
  { id: 'top-admin-atos', disciplineId: 'disc-admin', name: 'Atos Administrativos', summary: 'Requisitos, atributos, convalidação e extinção.' },
  { id: 'top-admin-poderes', disciplineId: 'disc-admin', name: 'Poderes Administrativos', summary: 'Poder de polícia, poder disciplinar e hierárquico.' },
  { id: 'top-port-sintaxe', disciplineId: 'disc-port', name: 'Sintaxe e Pontuação', summary: 'Termos essenciais e integrantes da oração; uso da vírgula.' },
  { id: 'top-rlm-prop', disciplineId: 'disc-rlm', name: 'Lógica Proposicional e Equivalências', summary: 'Tabelas-verdade, conectivos lógicos, negações e leis de De Morgan.' },
  { id: 'top-leg-drogas', disciplineId: 'disc-leg-esp', name: 'Lei de Drogas (Lei 11.343/06)', summary: 'Artigos 28, 33, tráfico interestadual e procedimentos processuais.' },
  { id: 'top-trans-ctb', disciplineId: 'disc-transito', name: 'Infrações e Crimes de Trânsito no CTB', summary: 'Artigos 161 ao 255 e artigos 291 ao 312-B.' },
];

export const INITIAL_CONTESTS: Contest[] = [
  {
    id: 'cnt-pf-2025',
    title: 'Polícia Federal - Agente e Escrivão 2025/2026',
    organizationId: 'org-pf',
    careerId: 'car-pf',
    positionId: 'pos-pf-agente',
    sphere: 'Federal',
    stateId: 'st-br',
    situation: 'Autorizado',
    vacancies: 1800,
    salary: 13900.54,
    examDate: '2026-11-15',
    registrationStart: '2026-08-01',
    registrationEnd: '2026-08-25',
    examiningBoard: 'Cebraspe',
    isOfficialSource: true,
    sourceName: 'Diário Oficial da União (DOU) / Portaria MGI',
    sourceUrl: 'https://www.in.gov.br',
    publishedAt: '2026-02-14',
    updatedAt: '2026-03-10',
    edictUrl: 'https://www.cebraspe.org.br/concursos/pf_agente',
    requirements: 'Nível Superior em qualquer área de formação + CNH B',
    phases: [
      { id: 'ph-1', name: 'Prova Objetiva e Discursiva' },
      { id: 'ph-2', name: 'Exame de Aptidão Física (TAF)' },
      { id: 'ph-3', name: 'Avaliação Médica e Psicológica' },
      { id: 'ph-4', name: 'Investigação Social' },
      { id: 'ph-5', name: 'Curso de Formação Profissional (ANP)' },
    ],
    observations: 'Concurso nacional com lotação prioritária nas fronteiras da Amazônia Legal e unidades operacionais federais.',
  },
  {
    id: 'cnt-prf-2025',
    title: 'Polícia Rodoviária Federal - Policial Rodoviário Federal',
    organizationId: 'org-prf',
    careerId: 'car-prf',
    positionId: 'pos-prf-policial',
    sphere: 'Federal',
    stateId: 'st-br',
    situation: 'Comissão formada',
    vacancies: 2000,
    salary: 12253.84,
    examDate: '2026-12-06',
    examiningBoard: 'Cebraspe',
    isOfficialSource: true,
    sourceName: 'Portal Oficial da PRF / Ministério da Justiça',
    sourceUrl: 'https://www.gov.br/prf/pt-br/noticias',
    publishedAt: '2026-01-20',
    updatedAt: '2026-03-01',
    edictUrl: 'https://www.gov.br/prf/pt-br/acesso-a-informacao/concursos',
    requirements: 'Diploma de Nível Superior reconhecido pelo MEC + CNH B',
    phases: [
      { id: 'ph-1', name: 'Prova Objetiva e Redação' },
      { id: 'ph-2', name: 'Teste de Aptidão Física (TAF)' },
      { id: 'ph-3', name: 'Avaliação de Saúde e Psicológica' },
      { id: 'ph-4', name: 'Curso de Formação Profissional (UniPRF)' },
    ],
    observations: 'Comissão técnica avalia cronograma oficial e previsão de edital para o segundo semestre.',
  },
  {
    id: 'cnt-pmesp-2025',
    title: 'Polícia Militar do Estado de São Paulo - Soldado PM 2ª Classe',
    organizationId: 'org-pmesp',
    careerId: 'car-pm',
    positionId: 'pos-pm-soldado',
    sphere: 'Estadual',
    stateId: 'st-sp',
    situation: 'Inscrições abertas',
    vacancies: 2700,
    salary: 4852.21,
    examDate: '2026-07-26',
    registrationStart: '2026-05-02',
    registrationEnd: '2026-06-12',
    examiningBoard: 'Fundação Vunesp',
    isOfficialSource: true,
    sourceName: 'Diário Oficial do Estado de São Paulo (DOE-SP)',
    sourceUrl: 'https://www.doe.sp.gov.br',
    publishedAt: '2026-04-10',
    updatedAt: '2026-05-02',
    edictUrl: 'https://www.vunesp.com.br/PMES2401',
    requirements: 'Ensino Médio completo, CNH categoria B, idade entre 17 e 30 anos e estatura mínima (1,60m homem / 1,55m mulher)',
    phases: [
      { id: 'ph-1', name: 'Exames de Conhecimentos (Partes I e II)' },
      { id: 'ph-2', name: 'Exames de Aptidão Física (TAF)' },
      { id: 'ph-3', name: 'Exames de Saúde' },
      { id: 'ph-4', name: 'Exames Psicológicos' },
      { id: 'ph-5', name: 'Avaliação da Conduta Social' },
      { id: 'ph-6', name: 'Análise de Documentos' },
    ],
    observations: 'Concurso semestral tradicional da PMESP com aplicação em 14 macrorregiões do estado.',
  },
  {
    id: 'cnt-pcsp-2025',
    title: 'Polícia Civil de São Paulo - Investigador e Escrivão',
    organizationId: 'org-pcsp',
    careerId: 'car-pc',
    positionId: 'pos-pc-investigador',
    sphere: 'Estadual',
    stateId: 'st-sp',
    situation: 'Banca definida',
    vacancies: 1500,
    salary: 5879.68,
    examDate: '2026-09-20',
    examiningBoard: 'Fundação Vunesp',
    isOfficialSource: true,
    sourceName: 'Acadepol SP / Diário Oficial SP',
    sourceUrl: 'https://www.policiacivil.sp.gov.br',
    publishedAt: '2026-03-05',
    updatedAt: '2026-04-18',
    edictUrl: 'https://www.vunesp.com.br',
    requirements: 'Ensino Superior completo em qualquer área e CNH B',
    phases: [
      { id: 'ph-1', name: 'Prova Preambular (Objetiva)' },
      { id: 'ph-2', name: 'Prova Escrita (Discursiva)' },
      { id: 'ph-3', name: 'Comprovação de Idoneidade' },
      { id: 'ph-4', name: 'Prova Oral' },
      { id: 'ph-5', name: 'Prova de Títulos' },
    ],
    observations: 'Contrato com a Vunesp assinado para provimento em delegacias de todo o interior e capital.',
  },
  {
    id: 'cnt-pmerj-2025',
    title: 'Polícia Militar do Estado do Rio de Janeiro - Soldado QPMP',
    organizationId: 'org-pmerj',
    careerId: 'car-pm',
    positionId: 'pos-pm-soldado',
    sphere: 'Estadual',
    stateId: 'st-rj',
    situation: 'Edital publicado',
    vacancies: 2000,
    salary: 5233.88,
    examDate: '2026-08-30',
    registrationStart: '2026-05-15',
    registrationEnd: '2026-06-25',
    examiningBoard: 'FGV Conhecimento',
    isOfficialSource: true,
    sourceName: 'Diário Oficial do Estado do Rio de Janeiro (DOERJ)',
    sourceUrl: 'https://www.ioerj.com.br',
    publishedAt: '2026-05-02',
    updatedAt: '2026-05-10',
    edictUrl: 'https://conhecimento.fgv.br/concursos/pmerj25',
    requirements: 'Ensino Médio completo, CNH B, idade de 18 a 32 anos',
    phases: [
      { id: 'ph-1', name: 'Prova Objetiva e Discursiva' },
      { id: 'ph-2', name: 'Preenchimento do Formulário de Informações Pessoais' },
      { id: 'ph-3', name: 'Exame Antropométrico e TAF' },
      { id: 'ph-4', name: 'Exame Psicológico' },
      { id: 'ph-5', name: 'Exame de Saúde' },
      { id: 'ph-6', name: 'Pesquisa Social e Documental' },
    ],
    observations: 'Edital republicado sob supervisão da FGV.',
  },
  {
    id: 'cnt-pmce-2025',
    title: 'Polícia Militar do Ceará - Soldado PM',
    organizationId: 'org-pmce',
    careerId: 'car-pm',
    positionId: 'pos-pm-soldado',
    sphere: 'Estadual',
    stateId: 'st-ce',
    cityId: 'ct-fortaleza',
    situation: 'Edital publicado',
    vacancies: 1500,
    salary: 4983.30,
    examDate: '2026-10-18',
    registrationStart: '2026-07-01',
    registrationEnd: '2026-08-10',
    examiningBoard: 'Cebraspe',
    isOfficialSource: true,
    sourceName: 'Diário Oficial do Estado do Ceará (DOE-CE)',
    sourceUrl: 'https://www.cebraspe.org.br',
    publishedAt: '2026-06-15',
    updatedAt: '2026-06-20',
    edictUrl: 'https://www.cebraspe.org.br',
    requirements: 'Ensino Médio completo, CNH categoria B e idade de 18 a 30 anos',
    phases: [
      { id: 'ph-1', name: 'Prova Objetiva' },
      { id: 'ph-2', name: 'Exame de Saúde' },
      { id: 'ph-3', name: 'Teste de Aptidão Física (TAF)' },
      { id: 'ph-4', name: 'Avaliação Psicológica' },
      { id: 'ph-5', name: 'Investigação Social' },
      { id: 'ph-6', name: 'Curso de Formação Profissional' },
    ],
    observations: 'Concurso oficial da PMCE com banca examinadora Cebraspe.',
  },
  {
    id: 'cnt-gmf-2025',
    title: 'Guarda Municipal de Fortaleza - Guarda Municipal',
    organizationId: 'org-gmf',
    careerId: 'car-gm',
    positionId: 'pos-gm-guarda',
    sphere: 'Municipal',
    stateId: 'st-ce',
    cityId: 'ct-fortaleza',
    situation: 'Edital publicado',
    vacancies: 1000,
    salary: 4150.00,
    examDate: '2026-09-13',
    registrationStart: '2026-06-01',
    registrationEnd: '2026-07-05',
    examiningBoard: 'IDECAN',
    isOfficialSource: true,
    sourceName: 'Diário Oficial do Município de Fortaleza (DOM)',
    sourceUrl: 'https://diariooficial.fortaleza.ce.gov.br',
    publishedAt: '2026-05-20',
    updatedAt: '2026-05-25',
    edictUrl: 'https://www.idecan.org.br',
    requirements: 'Ensino Médio completo e CNH categoria A/B',
    phases: [
      { id: 'ph-1', name: 'Prova Objetiva' },
      { id: 'ph-2', name: 'Exame Médico e Toxicológico' },
      { id: 'ph-3', name: 'Teste de Aptidão Física (TAF)' },
      { id: 'ph-4', name: 'Avaliação Psicológica' },
      { id: 'ph-5', name: 'Investigação Social' },
      { id: 'ph-6', name: 'Curso de Formação Profissional' },
    ],
    observations: 'Plano de modernização e armamento da Guarda Municipal de Fortaleza.',
  },
  {
    id: 'cnt-pmmg-2025',
    title: 'Polícia Militar de Minas Gerais - Soldado CFSd',
    organizationId: 'org-pmmg',
    careerId: 'car-pm',
    positionId: 'pos-pm-soldado',
    sphere: 'Estadual',
    stateId: 'st-mg',
    situation: 'Inscrições abertas',
    vacancies: 3102,
    salary: 4360.83,
    examDate: '2026-08-16',
    registrationStart: '2026-05-10',
    registrationEnd: '2026-06-15',
    examiningBoard: 'Centro de Recrutamento e Seleção da PMMG (CRS)',
    isOfficialSource: true,
    sourceName: 'Diário Oficial de Minas Gerais / Portal CRS PMMG',
    sourceUrl: 'https://www.policiamilitar.mg.gov.br/site/crs',
    publishedAt: '2026-04-20',
    updatedAt: '2026-05-10',
    edictUrl: 'https://www.policiamilitar.mg.gov.br/site/crs',
    requirements: 'Nível Superior em qualquer área (conforme Lei Estadual MG), idade de 18 a 30 anos e CNH B',
    phases: [
      { id: 'ph-1', name: 'Prova Objetiva' },
      { id: 'ph-2', name: 'Avaliações Psicológicas e Saúde' },
      { id: 'ph-3', name: 'Avaliação Física Militar (AFM)' },
    ],
    observations: 'Aplicação descentralizada em todas as Regiões de Polícia Militar (RPM) de Minas Gerais.',
  },
  {
    id: 'cnt-hist-pf-2021',
    title: 'Polícia Federal 2021 - Agente de Polícia Federal (Histórico)',
    organizationId: 'org-pf',
    careerId: 'car-pf',
    positionId: 'pos-pf-agente',
    sphere: 'Federal',
    stateId: 'st-br',
    situation: 'Encerrado',
    vacancies: 893,
    salary: 12522.50,
    examDate: '2021-05-23',
    examiningBoard: 'Cebraspe',
    isOfficialSource: true,
    sourceName: 'Diário Oficial da União (DOU) Edital nº 1 - DGP/PF',
    sourceUrl: 'https://www.cebraspe.org.br/concursos/pf_21',
    publishedAt: '2021-01-15',
    updatedAt: '2022-03-10',
    edictUrl: 'https://www.cebraspe.org.br/concursos/pf_21',
    isHistorical: true,
    phases: [
      { id: 'ph-1', name: 'Prova Objetiva e Discursiva' },
      { id: 'ph-2', name: 'Exame de Aptidão Física' },
      { id: 'ph-3', name: 'Curso de Formação' },
    ],
    observations: 'Concurso anterior de referência nacional com prova e gabarito catalogados.',
  },
  {
    id: 'cnt-detran-sp-2026',
    title: 'DETRAN-SP - Concurso Oficial e Agente Estadual de Trânsito',
    organizationId: 'org-detran-sp',
    careerId: 'car-transito',
    positionId: 'pos-detran-oficial',
    sphere: 'Estadual',
    stateId: 'st-sp',
    situation: 'Comissão formada',
    vacancies: 1200,
    salary: 5120.00,
    examDate: '2026-10-25',
    registrationStart: '2026-07-15',
    registrationEnd: '2026-08-20',
    examiningBoard: 'Fundação VUNESP',
    isOfficialSource: true,
    sourceName: 'Diário Oficial do Estado de São Paulo (DOE-SP)',
    sourceUrl: 'https://www.doe.sp.gov.br',
    publishedAt: '2026-03-01',
    updatedAt: '2026-03-20',
    edictUrl: 'https://www.vunesp.com.br',
    requirements: 'Ensino Médio e Nível Superior para diferentes cargos + CNH B',
    phases: [
      { id: 'ph-1', name: 'Prova Objetiva (CTB e Conhecimentos Gerais)' },
      { id: 'ph-2', name: 'Prova Prática de Direção e Informática' },
      { id: 'ph-3', name: 'Curso Específico de Formação em Fiscalização' },
    ],
    observations: 'Concurso estratégico para recomposição do quadro de fiscalização e atendimento do DETRAN-SP em todo o estado.',
  },
  {
    id: 'cnt-amc-2026',
    title: 'AMC Fortaleza - Agente Municipal de Operação e Fiscalização de Trânsito',
    organizationId: 'org-amc',
    careerId: 'car-transito',
    positionId: 'pos-amc-agente',
    sphere: 'Municipal',
    stateId: 'st-ce',
    cityId: 'ct-fortaleza',
    situation: 'Edital publicado',
    vacancies: 350,
    salary: 4950.60,
    examDate: '2026-09-27',
    registrationStart: '2026-06-10',
    registrationEnd: '2026-07-18',
    examiningBoard: 'IDECAN',
    isOfficialSource: true,
    sourceName: 'Diário Oficial do Município de Fortaleza',
    sourceUrl: 'https://diariooficial.fortaleza.ce.gov.br',
    publishedAt: '2026-05-28',
    updatedAt: '2026-06-02',
    edictUrl: 'https://www.idecan.org.br',
    requirements: 'Ensino Médio completo e CNH Categoria B sem penalidades graves',
    phases: [
      { id: 'ph-1', name: 'Prova Objetiva' },
      { id: 'ph-2', name: 'Avaliação Psicológica' },
      { id: 'ph-3', name: 'Teste de Aptidão Física (TAF)' },
      { id: 'ph-4', name: 'Curso de Formação de Agente de Trânsito (CFAT)' },
    ],
    observations: 'Plano de segurança viária municipal e tecnologia de monitoramento urbano.',
  },
];

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'q-101',
    codeNumber: 101,
    statement: 'À luz do artigo 144 da Constituição Federal de 1988, que disciplina a Segurança Pública, assinale a alternativa que indica CORRETAMENTE os órgãos responsáveis pela segurança pública no âmbito da União e dos Estados:',
    options: [
      { id: 'opt-a', letter: 'A', text: 'Apenas as Forças Armadas e as Polícias Militares estaduais.' },
      { id: 'opt-b', letter: 'B', text: 'A polícia federal, a polícia rodoviária federal, a polícia ferroviária federal, as polícias civis, as polícias militares e corpos de bombeiros militares, e as polícias penais federal, estaduais e distrital.' },
      { id: 'opt-c', letter: 'C', text: 'As guardas municipais como órgãos principais de polícia judiciária e investigação da União.' },
      { id: 'opt-d', letter: 'D', text: 'Exclusivamente a polícia civil e a polícia militar, subordinadas aos prefeitos municipais.' },
      { id: 'opt-e', letter: 'E', text: 'Apenas os agentes de trânsito e fiscais tributários dos estados.' },
    ],
    correctOptionLetter: 'B',
    explanation: 'O artigo 144 da Constituição Federal de 1988 estabelece o rol taxativo dos órgãos de segurança pública: I - polícia federal; II - polícia rodoviária federal; III - polícia ferroviária federal; IV - polícias civis; V - polícias militares e corpos de bombeiros militares; VI - polícias penais federal, estaduais e distrital (incluída pela EC nº 104/2019).',
    disciplineId: 'disc-const',
    subdiscipline: 'Organização do Estado',
    topic: 'Segurança Pública na CF (Art. 144)',
    careerId: 'car-pf',
    positionName: 'Agente de Polícia',
    contestTitle: 'Polícia Federal / Concursos Policiais',
    year: 2024,
    examiningBoard: 'Cebraspe',
    difficulty: 'Fácil',
    source: 'Artigo 144 da Constituição da República Federativa do Brasil de 1988',
    tags: ['Constitucional', 'Artigo 144', 'Segurança Pública', 'Cebraspe'],
  },
  {
    id: 'q-102',
    codeNumber: 102,
    statement: 'Com base no Código Penal Brasileiro e na teoria geral do crime, considera-se em estado de necessidade quem pratica o fato:',
    options: [
      { id: 'opt-a', letter: 'A', text: 'Para salvar de perigo atual, que não provocou por sua vontade, nem podia de outro modo evitar, direito próprio ou alheio, cujo sacrifício, nas circunstâncias, não era razoável exigir-se.' },
      { id: 'opt-b', letter: 'B', text: 'Repelindo injusta agressão, atual ou iminente, a direito seu ou de outrem, usando moderadamente dos meios necessários.' },
      { id: 'opt-c', letter: 'C', text: 'Em estrito cumprimento de dever legal ou no exercício regular de direito arbitrário.' },
      { id: 'opt-d', letter: 'D', text: 'Por motivo de relevante valor moral ou social, logo em seguida a injusta provocação da vítima.' },
      { id: 'opt-e', letter: 'E', text: 'Sob coação moral irresistível de terceiro, agindo com dolo eventual.' },
    ],
    correctOptionLetter: 'A',
    explanation: 'Trata-se da redação literal do artigo 24 do Código Penal Brasileiro: "Considera-se em estado de necessidade quem pratica o fato para salvar de perigo atual, que não provocou por sua vontade, nem podia de outro modo evitar, direito próprio ou alheio, cujo sacrifício, nas circunstâncias, não era razoável exigir-se." A alternativa B traz o conceito de legítima defesa (art. 25 do CP).',
    disciplineId: 'disc-penal',
    subdiscipline: 'Parte Geral',
    topic: 'Teoria Geral do Crime',
    careerId: 'car-pm',
    positionName: 'Soldado QPPM',
    contestTitle: 'PMESP / Concurso Soldado PM',
    year: 2023,
    examiningBoard: 'Fundação Vunesp',
    difficulty: 'Médio',
    source: 'Art. 24 do Decreto-Lei nº 2.848/1940 (Código Penal)',
    tags: ['Direito Penal', 'Excludentes de Ilicitude', 'Estado de Necessidade', 'Vunesp'],
  },
  {
    id: 'q-103',
    codeNumber: 103,
    statement: 'No que concerne ao Inquérito Policial disciplinado no Código de Processo Penal (CPP), assinale a afirmativa CORRETA:',
    options: [
      { id: 'opt-a', letter: 'A', text: 'O inquérito policial é um procedimento judicial inquisitivo e contraditório, presidido pelo juiz de direito.' },
      { id: 'opt-b', letter: 'B', text: 'A autoridade policial poderá mandar arquivar autos de inquérito quando verificar manifesta atipicidade da conduta.' },
      { id: 'opt-c', letter: 'C', text: 'O inquérito policial é um procedimento administrativo informativo, de caráter inquisitorial, conduzido pela polícia judiciária com o objetivo de apurar autoria e materialidade da infração penal.' },
      { id: 'opt-d', letter: 'D', text: 'O ofendido não poderá requerer a instauração do inquérito policial nos crimes de ação penal pública incondicionada.' },
      { id: 'opt-e', letter: 'E', text: 'O Ministério Público não pode requisitar a instauração de inquérito policial à autoridade policial.' },
    ],
    correctOptionLetter: 'C',
    explanation: 'O inquérito policial possui natureza de procedimento administrativo pré-processual, informativo, preparatório da ação penal, presidido pelo Delegado de Polícia (Polícia Judiciária). O Artigo 17 do CPP veda expressamente o arquivamento pelo delegado: "A autoridade policial não poderá mandar arquivar autos de inquérito".',
    disciplineId: 'disc-proc-penal',
    subdiscipline: 'Fase Pré-Processual',
    topic: 'Inquérito Policial',
    careerId: 'car-pc',
    positionName: 'Investigador de Polícia',
    contestTitle: 'PCSP / Investigador de Polícia',
    year: 2023,
    examiningBoard: 'Fundação Vunesp',
    difficulty: 'Médio',
    source: 'Artigos 4º a 23 do Código de Processo Penal (Decreto-Lei nº 3.689/1941)',
    tags: ['Processo Penal', 'Inquérito Policial', 'Vunesp', 'Polícia Civil'],
  },
  {
    id: 'q-104',
    codeNumber: 104,
    statement: 'A respeito dos princípios expressos que regem a Administração Pública no artigo 37, caput, da Constituição Federal, assinale a opção que contém o célebre mnemônico LIMPE:',
    options: [
      { id: 'opt-a', letter: 'A', text: 'Legalidade, Ilicitude, Moralidade, Pessoalidade e Eficácia.' },
      { id: 'opt-b', letter: 'B', text: 'Legalidade, Impessoalidade, Moralidade, Publicidade e Eficiência.' },
      { id: 'opt-c', letter: 'C', text: 'Lealdade, Interesse Público, Motivação, Probidade e Economicidade.' },
      { id: 'opt-d', letter: 'D', text: 'Legitimidade, Imparcialidade, Modicidade, Presteza e Equidade.' },
      { id: 'opt-e', letter: 'E', text: 'Liberalidade, Indisponibilidade, Moralismo, Pragmatismo e Exatidão.' },
    ],
    correctOptionLetter: 'B',
    explanation: 'O art. 37, caput, da CF/88 estabelece os princípios expressos da Administração Pública direta e indireta de qualquer dos Poderes da União, dos Estados, do Distrito Federal e dos Municípios: Legalidade, Impessoalidade, Moralidade, Publicidade e Eficiência (o princípio da eficiência foi acrescentado pela Emenda Constitucional nº 19/1998).',
    disciplineId: 'disc-admin',
    subdiscipline: 'Princípios da Administração',
    topic: 'Atos Administrativos',
    careerId: 'car-prf',
    positionName: 'Policial Rodoviário Federal',
    contestTitle: 'Polícia Rodoviária Federal / Concursos Policiais',
    year: 2021,
    examiningBoard: 'Cebraspe',
    difficulty: 'Fácil',
    source: 'Artigo 37, caput, da Constituição Federal de 1988',
    tags: ['Direito Administrativo', 'Artigo 37', 'LIMPE', 'Cebraspe'],
  },
  {
    id: 'q-105',
    codeNumber: 105,
    statement: 'Assinale a alternativa em que o uso do acento grave indicativo de CRASE está inteiramente CORRETO de acordo com a norma-padrão da Língua Portuguesa:',
    options: [
      { id: 'opt-a', letter: 'A', text: 'A viatura policial deslocou-se à toda velocidade para atender a ocorrência.' },
      { id: 'opt-b', letter: 'B', text: 'Os agentes entregaram o relatório minucioso à autoridade policial competente.' },
      { id: 'opt-c', letter: 'C', text: 'A equipe começou à investigar os fatos logo nas primeiras horas da manhã.' },
      { id: 'opt-d', letter: 'D', text: 'O candidato compareceu à pé no local da prova objetiva.' },
      { id: 'opt-e', letter: 'E', text: 'A viatura prestou socorro à uma vítima ferida na rodovia.' },
    ],
    correctOptionLetter: 'B',
    explanation: 'Em B, o verbo "entregaram" é transitivo direto e indireto ("entregar algo A alguém"), exigindo a preposição "a", que se funde com o artigo definido feminino "a" que precede o substantivo "autoridade": à autoridade. Nas demais alternativas, a crase é proibida: antes de pronome indefinido (à toda), antes de verbo (à investigar), antes de palavra masculina (à pé) e antes de artigo indefinido (à uma).',
    disciplineId: 'disc-port',
    subdiscipline: 'Morfossintaxe',
    topic: 'Sintaxe e Pontuação',
    careerId: 'car-pm',
    positionName: 'Soldado QPMP',
    contestTitle: 'PMERJ / Soldado Militar',
    year: 2024,
    examiningBoard: 'FGV Conhecimento',
    difficulty: 'Médio',
    source: 'Gramática Normativa da Língua Portuguesa para Concursos',
    tags: ['Português', 'Crase', 'FGV', 'Regência'],
  },
  {
    id: 'q-106',
    codeNumber: 106,
    statement: 'Considere a proposição composta: "Se o policial está preparado, então a ocorrência é resolvida com sucesso". De acordo com a lógica sentencial, a negação lógica equivalente dessa proposição é:',
    options: [
      { id: 'opt-a', letter: 'A', text: 'O policial não está preparado ou a ocorrência não é resolvida com sucesso.' },
      { id: 'opt-b', letter: 'B', text: 'O policial está preparado e a ocorrência não é resolvida com sucesso.' },
      { id: 'opt-c', letter: 'C', text: 'Se o policial não está preparado, então a ocorrência não é resolvida com sucesso.' },
      { id: 'opt-d', letter: 'D', text: 'Se a ocorrência é resolvida com sucesso, então o policial está preparado.' },
      { id: 'opt-e', letter: 'E', text: 'O policial não está preparado e a ocorrência é resolvida com sucesso.' },
    ],
    correctOptionLetter: 'B',
    explanation: 'A negação de uma condicional "Se P, então Q" (P → Q) é dada pela regra do "MANÉ": Mantém a primeira e Nega a segunda: P ∧ ~Q. Logo: "O policial está preparado (mantém P) E a ocorrência não é resolvida com sucesso (nega Q)".',
    disciplineId: 'disc-rlm',
    subdiscipline: 'Lógica Proposicional',
    topic: 'Lógica Proposicional e Equivalências',
    careerId: 'car-pf',
    positionName: 'Agente de Polícia Federal',
    contestTitle: 'Polícia Federal / RLM',
    year: 2021,
    examiningBoard: 'Cebraspe',
    difficulty: 'Médio',
    source: 'Lógica Matemática Proposicional para Concursos Públicos',
    tags: ['RLM', 'Negação de Condicional', 'Regra do Mané', 'Cebraspe'],
  },
  {
    id: 'q-107',
    codeNumber: 107,
    statement: 'Segundo a Lei nº 11.343/2006 (Lei de Drogas), em relação ao crime de porte de drogas para consumo pessoal previsto no artigo 28, assinale a alternativa que indica CORRETAMENTE as penas cominadas ao infrator:',
    options: [
      { id: 'opt-a', letter: 'A', text: 'Reclusão de 1 a 3 anos e multa.' },
      { id: 'opt-b', letter: 'B', text: 'Detenção de 6 meses a 2 anos e prestação de serviços à comunidade.' },
      { id: 'opt-c', letter: 'C', text: 'Advertência sobre os efeitos das drogas, prestação de serviços à comunidade e medida educativa de comparecimento a programa ou curso educativo.' },
      { id: 'opt-d', letter: 'D', text: 'Prisão simples de até 30 dias em carceragem especial.' },
      { id: 'opt-e', letter: 'E', text: 'Perdão judicial automático sem qualquer registro policial.' },
    ],
    correctOptionLetter: 'C',
    explanation: 'O art. 28 da Lei 11.343/2006 prevê despenalização (ausência de penas privativas de liberdade) para o usuário, cominando as seguintes sanções: I - advertência sobre os efeitos das drogas; II - prestação de serviços à comunidade; III - medida educativa de comparecimento a programa ou curso educativo.',
    disciplineId: 'disc-leg-esp',
    subdiscipline: 'Legislação Penal Especial',
    topic: 'Lei de Drogas (Lei 11.343/06)',
    careerId: 'car-pc',
    positionName: 'Investigador de Polícia',
    contestTitle: 'PCCE / Investigador',
    year: 2021,
    examiningBoard: 'IDECAN',
    difficulty: 'Fácil',
    source: 'Artigo 28 da Lei Federal nº 11.343/2006',
    tags: ['Legislação Especial', 'Lei de Drogas', 'Art. 28', 'Despenalização'],
  },
  {
    id: 'q-108',
    codeNumber: 108,
    statement: 'Nos termos do Código de Trânsito Brasileiro (CTB - Lei nº 9.503/1997), a condução de veículo automotor sob a influência de álcool (Art. 165) ou a recusa em submeter-se ao teste de etilômetro (Art. 165-A) caracteriza infração de natureza:',
    options: [
      { id: 'opt-a', letter: 'A', text: 'Média, com retenção do veículo por 24 horas.' },
      { id: 'opt-b', letter: 'B', text: 'Grave, com multa sem suspensão do direito de dirigir.' },
      { id: 'opt-c', letter: 'C', text: 'Gravíssima, com fator multiplicador da penalidade de multa por 10 vezes e suspensão do direito de dirigir por 12 meses.' },
      { id: 'opt-d', letter: 'D', text: 'Leve, sujeita apenas a advertência por escrito pelo agente da autoridade de trânsito.' },
      { id: 'opt-e', letter: 'E', text: 'Administrativa facultativa, a critério exclusivo do condutor.' },
    ],
    correctOptionLetter: 'C',
    explanation: 'Conforme os artigos 165 e 165-A do CTB, tanto dirigir sob a influência de álcool quanto recusar-se a ser submetido a teste constituem infração gravíssima, com penalidade de multa multiplicada por dez (10x) e suspensão do direito de dirigir por doze (12) meses, além do recolhimento da CNH e retenção do veículo.',
    disciplineId: 'disc-transito',
    subdiscipline: 'Infrações de Trânsito',
    topic: 'Infrações e Crimes de Trânsito no CTB',
    careerId: 'car-prf',
    positionName: 'Policial Rodoviário Federal',
    contestTitle: 'PRF / Concurso PRF',
    year: 2021,
    examiningBoard: 'Cebraspe',
    difficulty: 'Fácil',
    source: 'Artigos 165 e 165-A do Código de Trânsito Brasileiro (Lei nº 9.503/1997)',
    tags: ['Trânsito', 'CTB', 'Art. 165', 'PRF'],
    distractors: [
      { letter: 'A', role: 'PrazoNumero', roleDescription: 'Atenuação indevida de gravidade', trapExplanation: 'Induz o candidato a achar que infrações comuns são leves ou médias.' },
      { letter: 'B', role: 'InversaoRegra', roleDescription: 'Supressão da penalidade principal', trapExplanation: 'Omite a penalidade de suspensão da CNH, muito cobrada pelas bancas.' },
      { letter: 'C', role: 'Gabarito', roleDescription: 'Gabarito oficial', trapExplanation: 'Art. 165 e 165-A do CTB.' },
      { letter: 'D', role: 'GeneralizacaoIndevida', roleDescription: 'Aplicação indevida de advertência escrita', trapExplanation: 'Confunde com infrações leves/médias que admitem advertência quando não reincidente.' },
      { letter: 'E', role: 'Conceitual', roleDescription: 'Faculdade inexistente', trapExplanation: 'Afirma falsamente que o condutor tem arbítrio para aceitar ou recusar a infração.' },
    ],
  },
  {
    id: 'q-109',
    codeNumber: 109,
    statement: 'No que diz respeito às normas gerais de circulação e conduta preconizadas no artigo 29 do Código de Trânsito Brasileiro (CTB), quando veículos, transitando por fluxos que se cruzem, se aproximarem de local não sinalizado, terá preferência de passagem:',
    options: [
      { id: 'opt-a', letter: 'A', text: 'No caso de apenas um fluxo ser proveniente de rodovia, aquele que estiver circulando por ela.' },
      { id: 'opt-b', letter: 'B', text: 'No caso de rotatória, aquele que estiver ingressando nela.' },
      { id: 'opt-c', letter: 'C', text: 'Em qualquer hipótese, o veículo de maior porte ou peso bruto total.' },
      { id: 'opt-d', letter: 'D', text: 'O que vier pela esquerda do condutor.' },
      { id: 'opt-e', letter: 'E', text: 'O veículo de transporte coletivo de passageiros, em qualquer circunstância viária.' },
    ],
    correctOptionLetter: 'A',
    explanation: 'Art. 29, III, do CTB: Quando veículos se cruzarem em local não sinalizado, a preferência é: a) de quem estiver circulando por rodovia; b) no caso de rotatória, de quem já estiver circulando por ela (e não quem estiver entrando); c) nos demais casos, do que vier pela DIREITA do condutor.',
    disciplineId: 'disc-transito',
    subdiscipline: 'Normas de Circulação',
    topic: 'Infrações e Crimes de Trânsito no CTB',
    careerId: 'car-transito',
    positionName: 'Oficial Estadual de Trânsito',
    contestTitle: 'DETRAN-SP / Fiscalização de Trânsito',
    year: 2024,
    examiningBoard: 'Fundação Vunesp',
    difficulty: 'Médio',
    source: 'Artigo 29, inciso III, do Código de Trânsito Brasileiro (Lei nº 9.503/97)',
    tags: ['Trânsito', 'DETRAN', 'Artigo 29', 'Vunesp', 'Preferência de Passagem'],
    distractors: [
      { letter: 'A', role: 'Gabarito', roleDescription: 'Gabarito oficial', trapExplanation: 'Art. 29, III, "a", do CTB.' },
      { letter: 'B', role: 'InversaoRegra', roleDescription: 'Inversão da regra da rotatória', trapExplanation: 'Inverte "circulando por ela" por "ingressando nela", a pegadinha clássica da Vunesp.' },
      { letter: 'C', role: 'Conceitual', roleDescription: 'Hierarquia física confundida com preferência legal', trapExplanation: 'O porte do veículo gera dever de cuidado (art. 29, § 2º), mas não direito de preferência de passagem.' },
      { letter: 'D', role: 'InversaoRegra', roleDescription: 'Inversão do lado da preferência', trapExplanation: 'Troca "direita" por "esquerda", pegadinha frequente de atenção.' },
      { letter: 'E', role: 'GeneralizacaoIndevida', roleDescription: 'Privilégio absoluto inexistente', trapExplanation: 'Atribui prioridade incondicionada que não existe no CTB sem sinalização específica.' },
    ],
  },
  {
    id: 'q-110',
    codeNumber: 110,
    statement: 'Sobre as competências dos órgãos do Sistema Nacional de Trânsito (SNT), assinale a opção que descreve CORRETAMENTE uma competência atribuída expressamente aos órgãos e entidades executivos de trânsito dos MUNICÍPIOS (como a AMC Fortaleza ou CET-SP), nos termos do artigo 24 do CTB:',
    options: [
      { id: 'opt-a', letter: 'A', text: 'Emitir e recolher a Carteira Nacional de Habilitação (CNH) e fiscalizar exclusivamente rodovias federais.' },
      { id: 'opt-b', letter: 'B', text: 'Planejar, projetar, regulamentar e operar o trânsito de veículos, pedestres e animais, e promover o desenvolvimento da circulação e segurança de ciclistas na via urbana municipal.' },
      { id: 'opt-c', letter: 'C', text: 'Julgar recursos de infrações aplicadas exclusivamente pela Polícia Rodoviária Federal em âmbito interestadual.' },
      { id: 'opt-d', letter: 'D', text: 'Realizar o registro, licenciamento e emplacamento de veículos automotores de todo o território estadual.' },
      { id: 'opt-e', letter: 'E', text: 'Exercer com exclusividade a polícia ostensiva de preservação da ordem pública militar em rodovias estaduais.' },
    ],
    correctOptionLetter: 'B',
    explanation: 'O Artigo 24, inciso II, do CTB confere aos órgãos executivos de trânsito dos municípios a atribuição de planejar, projetar, regulamentar e operar o trânsito de veículos, de pedestres e de animais, e promover o desenvolvimento da circulação e da segurança de ciclistas. CNH e licenciamento são competências do órgão executivo rodoviário/estadual (DETRAN, art. 22).',
    disciplineId: 'disc-transito',
    subdiscipline: 'Competências do SNT',
    topic: 'Infrações e Crimes de Trânsito no CTB',
    careerId: 'car-transito',
    positionName: 'Agente de Trânsito',
    contestTitle: 'AMC Fortaleza / Concurso Agente de Trânsito',
    year: 2024,
    examiningBoard: 'IDECAN',
    difficulty: 'Médio',
    source: 'Artigo 24 do Código de Trânsito Brasileiro (Lei Federal nº 9.503/1997)',
    tags: ['Trânsito', 'AMC', 'IDECAN', 'Competências Municipais', 'Art. 24'],
    distractors: [
      { letter: 'A', role: 'InversaoRegra', roleDescription: 'Troca de competência com DETRAN/PRF', trapExplanation: 'Atribui CNH ao município, sendo que compete ao DETRAN (Estado).' },
      { letter: 'B', role: 'Gabarito', roleDescription: 'Gabarito oficial', trapExplanation: 'Art. 24, II, do CTB.' },
      { letter: 'C', role: 'Extrapolacao', roleDescription: 'Extrapolação de instância recursal', trapExplanation: 'Coloca o município julgando recursos da União (PRF).' },
      { letter: 'D', role: 'InversaoRegra', roleDescription: 'Competência do DETRAN', trapExplanation: 'Registro e licenciamento de veículos é competência do DETRAN (Art. 22, III).' },
      { letter: 'E', role: 'Conceitual', roleDescription: 'Confusão com Polícia Militar Rodoviária', trapExplanation: 'Polícia ostensiva rodoviária é da PM estadual ou PRF.' },
    ],
  },
];

export const INITIAL_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-1',
    disciplineId: 'disc-const',
    front: 'Quais são os 6 órgãos de segurança pública previstos expressamente no art. 144 da CF/88?',
    back: '1. Polícia Federal\n2. Polícia Rodoviária Federal\n3. Polícia Ferroviária Federal\n4. Polícias Civis\n5. Polícias Militares e Corpos de Bombeiros Militares\n6. Polícias Penais (federal, estaduais e distrital - EC 104/19)',
    tag: 'Art. 144 CF',
  },
  {
    id: 'fc-2',
    disciplineId: 'disc-penal',
    front: 'O que diferencia o Estado de Necessidade (Art. 24 CP) da Legítima Defesa (Art. 25 CP)?',
    back: 'Estado de Necessidade: Perigo atual decorrente da natureza ou ato humano, sem agressão ilícita direcionada.\nLegítima Defesa: Injusta agressão, atual ou iminente, humana, direcionada a direito próprio ou de outrem com uso moderado dos meios.',
    tag: 'Excludentes',
  },
  {
    id: 'fc-3',
    disciplineId: 'disc-proc-penal',
    front: 'O Delegado de Polícia pode arquivar o Inquérito Policial por conta própria?',
    back: 'NÃO! Artigo 17 do CPP: "A autoridade policial não poderá mandar arquivar autos de inquérito." O arquivamento é ato de competência judicial/ministerial.',
    tag: 'Inquérito Policial',
  },
  {
    id: 'fc-4',
    disciplineId: 'disc-rlm',
    front: 'Qual a negação lógica da condicional "Se A, então B" (A → B)?',
    back: 'Regra do MANÉ:\n"A e não B" (A ∧ ~B).\nMantém a primeira (A) E nega a segunda (~B).',
    tag: 'Equivalências Lógicas',
  },
];

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'nw-1',
    title: 'Polícia Federal: Ministério da Gestão avança nos trâmites para novo edital',
    summary: 'A Polícia Federal mantém diálogo prioritário com o MGI para reposição do quadro de Agente, Escrivão e Delegado de Polícia Federal. Vagas deverão reforçar regiões estratégicas de fronteira e aeroportos internacionais.',
    category: 'Concursos',
    date: '2026-05-22',
    sourceName: 'Imprensa Nacional / Portal Oficial da PF',
    sourceUrl: 'https://www.gov.br/pf/pt-br/noticias',
    isOfficial: true,
  },
  {
    id: 'nw-2',
    title: 'PMESP publica edital de Soldado 2ª Classe com 2.700 vagas no Diário Oficial de SP',
    summary: 'As inscrições iniciam pela banca Vunesp para candidatos de 17 a 30 anos com ensino médio completo e CNH categoria B. Provas agendadas para o segundo semestre com aplicação em 14 cidades paulistas.',
    category: 'Editais',
    date: '2026-05-18',
    sourceName: 'Diário Oficial do Estado de São Paulo (DOE-SP)',
    sourceUrl: 'https://www.doe.sp.gov.br',
    isOfficial: true,
  },
  {
    id: 'nw-3',
    title: 'Guarda Municipal de Fortaleza: cronograma do TAF e edital retificado divulgado pelo IDECAN',
    summary: 'A Prefeitura de Fortaleza e o IDECAN publicaram edital de retificação com orientações específicas sobre o Teste de Aptidão Física e o conteúdo programático de Legislação Municipal e Noções de Direito.',
    category: 'Editais',
    date: '2026-05-12',
    sourceName: 'Diário Oficial do Município de Fortaleza',
    sourceUrl: 'https://diariooficial.fortaleza.ce.gov.br',
    isOfficial: true,
  },
  {
    id: 'nw-4',
    title: 'STF fixa tese sobre limites de idade e requisitos em concursos da Polícia Militar e Bombeiros',
    summary: 'O plenário do Supremo Tribunal Federal reiterou jurisprudência constitucional que exige previsão expressa em lei em sentido estrito para requisitos de idade e tatuagem nos editais militares estaduais.',
    category: 'Legislação',
    date: '2026-05-04',
    sourceName: 'Portal Oficial do Supremo Tribunal Federal (STF)',
    sourceUrl: 'https://portal.stf.jus.br',
    isOfficial: true,
  },
];

// ==========================================
// STORE STORAGE ENGINE COM PERSISTÊNCIA LOCAL
// ==========================================

const STORAGE_KEYS = {
  USER_PROFILE: 'foco_user_profile',
  REGIONS: 'foco_regions',
  STATES: 'foco_states',
  CITIES: 'foco_cities',
  ORGANIZATIONS: 'foco_organizations',
  CAREERS: 'foco_careers',
  POSITIONS: 'foco_positions',
  CONTESTS: 'foco_contests',
  DISCIPLINES: 'foco_disciplines',
  TOPICS: 'foco_topics',
  QUESTIONS: 'foco_questions',
  ANSWERS: 'foco_answers',
  SESSIONS: 'foco_sessions',
  REVIEWS: 'foco_reviews',
  SIMULATIONS: 'foco_simulations',
  FAVORITES: 'foco_favorites',
  NOTIFICATIONS: 'foco_notifications',
  NEWS: 'foco_news',
  FLASHCARDS: 'foco_flashcards',
  ALERTS_PREF: 'foco_alerts_pref',
  ADMIN_LOGS: 'foco_admin_logs',
  ADAPTIVE_RETESTS: 'foco_adaptive_retests',
};

function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item);
  } catch (e) {
    console.error(`Erro ao carregar chave ${key} do storage:`, e);
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Erro ao salvar chave ${key} no storage:`, e);
  }
}

// XP and Rank calculations according to Section 22 Gamification:
// Questão respondida: +5 XP
// Questão correta: +10 XP
// Hora estudada: +50 XP
// Simulado: +100 XP
export function calculateRankFromXP(xp: number): MilitaryRank {
  if (xp >= 3000) return 'Oficial';
  if (xp >= 1800) return 'Cadete';
  if (xp >= 1000) return 'Aspirante';
  if (xp >= 500) return 'Operacional';
  if (xp >= 200) return 'Aluno';
  return 'Recruta';
}

export class FocoDataEngineStore {
  // Read state
  static getUserProfile(): UserProfile | null {
    return getFromStorage<UserProfile | null>(STORAGE_KEYS.USER_PROFILE, null);
  }

  static saveUserProfile(profile: UserProfile): void {
    saveToStorage(STORAGE_KEYS.USER_PROFILE, profile);
  }

  static clearUserProfile(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    } catch (e) {
      console.error('Erro ao limpar perfil:', e);
    }
  }

  static updateUserProfile(updates: Partial<UserProfile>): UserProfile {
    const current = this.getUserProfile() || {
      id: 'usr-1',
      name: 'Candidato Focado',
      email: 'candidato@foconafarda.com.br',
      role: 'user',
      targetCareerId: 'car-pm',
      targetContestId: 'cnt-pmesp-2025',
      stateId: 'st-sp',
      dailyStudyMinutes: 120,
      studyLevel: 'Intermediário',
      streakDays: 1,
      xp: 0,
      rank: 'Recruta',
      createdAt: new Date().toISOString(),
    };

    // Segurança: Não permitir que o usuário altere sua própria role ou status de bloqueio pelo frontend
    const sanitizedUpdates = { ...updates };
    delete sanitizedUpdates.role;
    delete sanitizedUpdates.isBlocked;

    const updated: UserProfile = { ...current, ...sanitizedUpdates };
    // Recalculate rank based on XP
    updated.rank = calculateRankFromXP(updated.xp);
    saveToStorage(STORAGE_KEYS.USER_PROFILE, updated);
    return updated;
  }

  static getRegions(): Region[] {
    return getFromStorage<Region[]>(STORAGE_KEYS.REGIONS, INITIAL_REGIONS);
  }

  static getStates(): State[] {
    return getFromStorage<State[]>(STORAGE_KEYS.STATES, INITIAL_STATES);
  }

  static addState(state: Omit<State, 'id'>): State {
    const states = this.getStates();
    const newState: State = { ...state, id: `st-${Date.now()}` };
    states.push(newState);
    saveToStorage(STORAGE_KEYS.STATES, states);
    this.logAdminAction('Criação de Estado', `Estado ${newState.code} - ${newState.name} adicionado.`);
    return newState;
  }

  static getCities(): City[] {
    return getFromStorage<City[]>(STORAGE_KEYS.CITIES, INITIAL_CITIES);
  }

  static addCity(city: Omit<City, 'id'>): City {
    const cities = this.getCities();
    const newCity: City = { ...city, id: `ct-${Date.now()}` };
    cities.push(newCity);
    saveToStorage(STORAGE_KEYS.CITIES, cities);
    this.logAdminAction('Criação de Município', `Município ${newCity.name} adicionado.`);
    return newCity;
  }

  static getCareers(): Career[] {
    return getFromStorage<Career[]>(STORAGE_KEYS.CAREERS, INITIAL_CAREERS);
  }

  static addCareer(career: Omit<Career, 'id'>): Career {
    const careers = this.getCareers();
    const newCareer: Career = { ...career, id: `car-${Date.now()}` };
    careers.push(newCareer);
    saveToStorage(STORAGE_KEYS.CAREERS, careers);
    this.logAdminAction('Criação de Carreira', `Carreira ${newCareer.name} adicionada.`);
    return newCareer;
  }

  static getPositions(): Position[] {
    return getFromStorage<Position[]>(STORAGE_KEYS.POSITIONS, INITIAL_POSITIONS);
  }

  static addPosition(position: Omit<Position, 'id'>): Position {
    const positions = this.getPositions();
    const newPos: Position = { ...position, id: `pos-${Date.now()}` };
    positions.push(newPos);
    saveToStorage(STORAGE_KEYS.POSITIONS, positions);
    this.logAdminAction('Criação de Cargo', `Cargo ${newPos.name} adicionado.`);
    return newPos;
  }

  static getOrganizations(): Organization[] {
    return getFromStorage<Organization[]>(STORAGE_KEYS.ORGANIZATIONS, INITIAL_ORGANIZATIONS);
  }

  static addOrganization(org: Omit<Organization, 'id'>): Organization {
    const orgs = this.getOrganizations();
    const newOrg: Organization = { ...org, id: `org-${Date.now()}` };
    orgs.push(newOrg);
    saveToStorage(STORAGE_KEYS.ORGANIZATIONS, orgs);
    this.logAdminAction('Criação de Órgão', `Órgão ${newOrg.acronym} (${newOrg.name}) adicionado.`);
    return newOrg;
  }

  static getContests(): Contest[] {
    return getFromStorage<Contest[]>(STORAGE_KEYS.CONTESTS, INITIAL_CONTESTS);
  }

  static addContest(contest: Omit<Contest, 'id'>): Contest {
    const contests = this.getContests();
    const newContest: Contest = { ...contest, id: `cnt-${Date.now()}` };
    contests.unshift(newContest);
    saveToStorage(STORAGE_KEYS.CONTESTS, contests);
    this.logAdminAction('Criação de Concurso', `Concurso ${newContest.title} adicionado.`);
    return newContest;
  }

  static updateContest(id: string, updates: Partial<Contest>): Contest | null {
    const contests = this.getContests();
    const index = contests.findIndex((c) => c.id === id);
    if (index === -1) return null;
    contests[index] = { ...contests[index], ...updates, updatedAt: new Date().toISOString() };
    saveToStorage(STORAGE_KEYS.CONTESTS, contests);
    this.logAdminAction('Atualização de Concurso', `Concurso ${contests[index].title} atualizado.`);
    return contests[index];
  }

  static deleteContest(id: string): boolean {
    const contests = this.getContests();
    const filtered = contests.filter((c) => c.id !== id);
    if (filtered.length === contests.length) return false;
    saveToStorage(STORAGE_KEYS.CONTESTS, filtered);
    this.logAdminAction('Exclusão de Concurso', `Concurso ID ${id} excluído.`);
    return true;
  }

  static getDisciplines(): Discipline[] {
    return getFromStorage<Discipline[]>(STORAGE_KEYS.DISCIPLINES, INITIAL_DISCIPLINES);
  }

  static addDiscipline(discipline: Omit<Discipline, 'id'>): Discipline {
    const disciplines = this.getDisciplines();
    const newDisc: Discipline = { ...discipline, id: `disc-${Date.now()}` };
    disciplines.push(newDisc);
    saveToStorage(STORAGE_KEYS.DISCIPLINES, disciplines);
    this.logAdminAction('Criação de Disciplina', `Disciplina ${newDisc.name} adicionada.`);
    return newDisc;
  }

  static getTopics(disciplineId?: string): Topic[] {
    const topics = getFromStorage<Topic[]>(STORAGE_KEYS.TOPICS, INITIAL_TOPICS);
    if (disciplineId) {
      return topics.filter((t) => t.disciplineId === disciplineId);
    }
    return topics;
  }

  static addTopic(topic: Omit<Topic, 'id'>): Topic {
    const topics = this.getTopics();
    const newTopic: Topic = { ...topic, id: `top-${Date.now()}` };
    topics.push(newTopic);
    saveToStorage(STORAGE_KEYS.TOPICS, topics);
    return newTopic;
  }

  static getQuestions(): Question[] {
    return getFromStorage<Question[]>(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);
  }

  static getQuestionsFiltered(filters: {
    careerId?: string;
    disciplineId?: string;
    topic?: string;
    difficulty?: 'Fácil' | 'Médio' | 'Difícil' | 'all';
    examiningBoard?: string;
  }): Question[] {
    let list = this.getQuestions();
    if (filters.careerId && filters.careerId !== 'all') {
      list = list.filter((q) => q.careerId === filters.careerId);
    }
    if (filters.disciplineId && filters.disciplineId !== 'all') {
      list = list.filter((q) => q.disciplineId === filters.disciplineId);
    }
    if (filters.topic && filters.topic !== 'all') {
      const targetTopic = filters.topic.toLowerCase().trim();
      list = list.filter((q) => {
        const qTopic = (q.topic || '').toLowerCase().trim();
        const qSub = (q.subdiscipline || '').toLowerCase().trim();
        return qTopic.includes(targetTopic) || targetTopic.includes(qTopic) || qSub.includes(targetTopic);
      });
    }
    if (filters.difficulty && filters.difficulty !== 'all') {
      list = list.filter((q) => q.difficulty === filters.difficulty);
    }
    if (filters.examiningBoard && filters.examiningBoard !== 'all') {
      const targetBoard = filters.examiningBoard.toLowerCase().trim();
      list = list.filter((q) => (q.examiningBoard || '').toLowerCase().includes(targetBoard));
    }
    return list;
  }

  static addQuestion(question: Omit<Question, 'id' | 'codeNumber'>): Question {
    const questions = this.getQuestions();
    const nextCode = questions.length > 0 ? Math.max(...questions.map((q) => q.codeNumber || 100)) + 1 : 101;
    const newQ: Question = {
      ...question,
      id: `q-${Date.now()}`,
      codeNumber: nextCode,
    };
    questions.push(newQ);
    saveToStorage(STORAGE_KEYS.QUESTIONS, questions);
    this.logAdminAction('Criação de Questão', `Questão #${newQ.codeNumber} cadastrada.`);
    return newQ;
  }

  static deleteQuestion(id: string): boolean {
    const questions = this.getQuestions();
    const filtered = questions.filter((q) => q.id !== id);
    if (filtered.length === questions.length) return false;
    saveToStorage(STORAGE_KEYS.QUESTIONS, filtered);
    this.logAdminAction('Exclusão de Questão', `Questão ID ${id} excluída.`);
    return true;
  }

  // User study answers & performance tracking
  static getQuestionAnswers(userId: string): QuestionAnswerRecord[] {
    const all = getFromStorage<QuestionAnswerRecord[]>(STORAGE_KEYS.ANSWERS, []);
    return all.filter((a) => a.userId === userId);
  }

  static recordAnswer(answer: Omit<QuestionAnswerRecord, 'id' | 'answeredAt'>): {
    record: QuestionAnswerRecord;
    xpGained: number;
    userProfile: UserProfile;
  } {
    const allAnswers = getFromStorage<QuestionAnswerRecord[]>(STORAGE_KEYS.ANSWERS, []);
    const isDunningKruger = !answer.isCorrect && answer.confidenceLevel === 'Certeza';

    const newRecord: QuestionAnswerRecord = {
      ...answer,
      id: `ans-${Date.now()}`,
      answeredAt: new Date().toISOString(),
      isDunningKruger,
    };
    allAnswers.push(newRecord);
    saveToStorage(STORAGE_KEYS.ANSWERS, allAnswers);

    // XP calculation: +5 for answering, +10 bonus if correct
    const xpGained = newRecord.isCorrect ? 15 : 5;
    const profile = this.getUserProfile();
    let updatedProfile: UserProfile;
    if (profile) {
      updatedProfile = this.updateUserProfile({
        xp: profile.xp + xpGained,
      });
    } else {
      updatedProfile = this.updateUserProfile({
        xp: xpGained,
      });
    }

    // Adaptive Retest schedule if user got it wrong:
    if (!newRecord.isCorrect) {
      this.scheduleReview(newRecord.userId, newRecord.questionId, 1);
      this.enqueueAdaptiveRetest(
        newRecord.userId,
        newRecord.questionId,
        newRecord.errorType || 'Conceito',
        newRecord.confidenceLevel || 'Duvida',
        newRecord.chosenDistractorRole
      );
    } else if (newRecord.confidenceLevel === 'Duvida') {
      // Se acertou na dúvida (50/50), enfileira para reforçar fixação em 7 dias
      this.scheduleReview(newRecord.userId, newRecord.questionId, 7);
    }

    // Background sync with Supabase if configured
    SupabaseDataService.logAnswer(newRecord).catch((e) =>
      console.warn('Supabase answer log background error:', e)
    );

    return { record: newRecord, xpGained, userProfile: updatedProfile };
  }

  // ==========================================
  // RETESTE ADAPTATIVO & CICLOS ESPAÇADOS
  // ==========================================
  static getAdaptiveRetests(userId: string): AdaptiveRetestItem[] {
    const all = getFromStorage<AdaptiveRetestItem[]>(STORAGE_KEYS.ADAPTIVE_RETESTS, []);
    return all.filter((r) => r.userId === userId);
  }

  static saveAdaptiveRetests(items: AdaptiveRetestItem[]): void {
    saveToStorage(STORAGE_KEYS.ADAPTIVE_RETESTS, items);
  }

  static enqueueAdaptiveRetest(
    userId: string,
    questionId: string,
    errorType: ErrorType = 'Conceito',
    confidenceLevel: ConfidenceLevel = 'Duvida',
    chosenDistractorRole?: DistractorRole,
    microReviewSummary?: string,
    variantQuestion?: Question
  ): AdaptiveRetestItem {
    const all = getFromStorage<AdaptiveRetestItem[]>(STORAGE_KEYS.ADAPTIVE_RETESTS, []);
    const existingIndex = all.findIndex(
      (r) => r.userId === userId && r.originalQuestionId === questionId && r.status !== 'mastered'
    );

    const now = new Date();
    const scheduled = new Date(now);
    // Micro-revisão imediata ou reteste em 24h
    scheduled.setDate(scheduled.getDate() + 1);

    if (existingIndex >= 0) {
      all[existingIndex].timesRetested += 1;
      all[existingIndex].errorType = errorType;
      all[existingIndex].confidenceLevel = confidenceLevel;
      if (chosenDistractorRole) all[existingIndex].chosenDistractorRole = chosenDistractorRole;
      if (microReviewSummary) all[existingIndex].microReviewSummary = microReviewSummary;
      if (variantQuestion) all[existingIndex].variantQuestion = variantQuestion;
      all[existingIndex].scheduledFor = scheduled.toISOString();
      all[existingIndex].status = 'pending';
      saveToStorage(STORAGE_KEYS.ADAPTIVE_RETESTS, all);
      return all[existingIndex];
    }

    const newItem: AdaptiveRetestItem = {
      id: `art-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId,
      originalQuestionId: questionId,
      currentStage: 'micro_review',
      errorType,
      confidenceLevel,
      chosenDistractorRole,
      scheduledFor: now.toISOString(),
      timesRetested: 0,
      timesPassed: 0,
      retentionRate: 0,
      status: 'ready',
      microReviewSummary,
      variantQuestion,
      addedAt: now.toISOString(),
    };

    all.push(newItem);
    saveToStorage(STORAGE_KEYS.ADAPTIVE_RETESTS, all);

    // Sync to Supabase in background
    SupabaseDataService.syncAdaptiveRetest(newItem).catch((err) =>
      console.warn('Supabase syncAdaptiveRetest background warning:', err)
    );

    return newItem;
  }

  static advanceAdaptiveRetestStage(
    retestId: string,
    passed: boolean,
    nextVariant?: Question
  ): AdaptiveRetestItem | null {
    const all = getFromStorage<AdaptiveRetestItem[]>(STORAGE_KEYS.ADAPTIVE_RETESTS, []);
    const idx = all.findIndex((r) => r.id === retestId);
    if (idx < 0) return null;

    const item = all[idx];
    item.timesRetested += 1;
    item.lastRetestAt = new Date().toISOString();

    if (passed) {
      item.timesPassed += 1;
    }

    item.retentionRate = Math.round((item.timesPassed / item.timesRetested) * 100);

    const now = new Date();
    if (!passed) {
      // Falhou no reteste: volta para micro-revisão e reteste de 24h
      item.currentStage = 'retest_24h';
      now.setDate(now.getDate() + 1);
      item.scheduledFor = now.toISOString();
      item.status = 'pending';
    } else {
      // Passou: avança no ciclo adaptativo
      switch (item.currentStage) {
        case 'micro_review':
          item.currentStage = 'retest_24h';
          now.setDate(now.getDate() + 1);
          item.scheduledFor = now.toISOString();
          item.status = 'pending';
          break;
        case 'retest_24h':
          item.currentStage = 'retest_7d_variant';
          now.setDate(now.getDate() + 7);
          item.scheduledFor = now.toISOString();
          item.status = 'pending';
          if (nextVariant) item.variantQuestion = nextVariant;
          break;
        case 'retest_7d_variant':
          item.currentStage = 'retest_30d_mastery';
          now.setDate(now.getDate() + 30);
          item.scheduledFor = now.toISOString();
          item.status = 'pending';
          break;
        case 'retest_30d_mastery':
        default:
          item.currentStage = 'mastered';
          item.status = 'mastered';
          break;
      }
    }

    saveToStorage(STORAGE_KEYS.ADAPTIVE_RETESTS, all);

    // Sync to Supabase in background
    SupabaseDataService.syncAdaptiveRetest(item).catch(() => {});

    return item;
  }

  // ==========================================
  // PSICOMETRIA EDUCACIONAL & DIAGNÓSTICO
  // ==========================================
  static getPsychometricMetrics(userId: string): PsychometricMetrics {
    const answers = this.getQuestionAnswers(userId);
    const questions = this.getQuestions();
    const disciplines = this.getDisciplines();
    const retests = this.getAdaptiveRetests(userId);

    const totalAnswered = answers.length;
    const totalCorrect = answers.filter((a) => a.isCorrect).length;
    const accuracyRate = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

    // Distribuição de Tipos de Erro
    const errorDistribution: Record<ErrorType, number> = {
      Conceito: 0,
      Interpretacao_Pegadinha: 0,
      Atencao_Leitura: 0,
      Memorizacao: 0,
      Chute: 0,
    };

    // Acurácia por Nível de Confiança
    const confidenceAccuracy = {
      certezaTotal: 0,
      certezaCorrect: 0,
      certezaAccuracy: 0,
      certezaErrors: 0, // Dunning-Kruger count
      duvidaTotal: 0,
      duvidaCorrect: 0,
      duvidaAccuracy: 0,
      chuteTotal: 0,
      chuteCorrect: 0,
      chuteAccuracy: 0,
    };

    // Vulnerabilidade a Distratores
    const distractorCounts: Record<DistractorRole, number> = {
      Conceitual: 0,
      InversaoRegra: 0,
      PrazoNumero: 0,
      PegadinhaSemantica: 0,
      GeneralizacaoIndevida: 0,
      Extrapolacao: 0,
      Gabarito: 0,
    };

    // Erros por Tópico
    const topicErrorMap: Record<string, { discipline: string; errors: number; total: number }> = {};

    answers.forEach((ans) => {
      const q = questions.find((item) => item.id === ans.questionId);
      const topicName = q?.topic || 'Tópico Geral';
      const disc = disciplines.find((d) => d.id === q?.disciplineId)?.name || 'Geral';

      if (!topicErrorMap[topicName]) {
        topicErrorMap[topicName] = { discipline: disc, errors: 0, total: 0 };
      }
      topicErrorMap[topicName].total += 1;

      // Confiança
      const conf = ans.confidenceLevel || 'Duvida';
      if (conf === 'Certeza') {
        confidenceAccuracy.certezaTotal += 1;
        if (ans.isCorrect) confidenceAccuracy.certezaCorrect += 1;
        else confidenceAccuracy.certezaErrors += 1;
      } else if (conf === 'Duvida') {
        confidenceAccuracy.duvidaTotal += 1;
        if (ans.isCorrect) confidenceAccuracy.duvidaCorrect += 1;
      } else {
        confidenceAccuracy.chuteTotal += 1;
        if (ans.isCorrect) confidenceAccuracy.chuteCorrect += 1;
      }

      // Análise de Erros
      if (!ans.isCorrect) {
        topicErrorMap[topicName].errors += 1;
        const errType = ans.errorType || 'Conceito';
        errorDistribution[errType] = (errorDistribution[errType] || 0) + 1;

        // Distrator que o atraiu
        if (ans.chosenDistractorRole) {
          distractorCounts[ans.chosenDistractorRole] = (distractorCounts[ans.chosenDistractorRole] || 0) + 1;
        } else if (q?.distractors) {
          const matchDist = q.distractors.find((d) => d.letter === ans.selectedOptionLetter);
          if (matchDist) {
            distractorCounts[matchDist.role] = (distractorCounts[matchDist.role] || 0) + 1;
          }
        }
      }
    });

    // Calcular percentuais de confiança
    confidenceAccuracy.certezaAccuracy =
      confidenceAccuracy.certezaTotal > 0
        ? Math.round((confidenceAccuracy.certezaCorrect / confidenceAccuracy.certezaTotal) * 100)
        : 0;
    confidenceAccuracy.duvidaAccuracy =
      confidenceAccuracy.duvidaTotal > 0
        ? Math.round((confidenceAccuracy.duvidaCorrect / confidenceAccuracy.duvidaTotal) * 100)
        : 0;
    confidenceAccuracy.chuteAccuracy =
      confidenceAccuracy.chuteTotal > 0
        ? Math.round((confidenceAccuracy.chuteCorrect / confidenceAccuracy.chuteTotal) * 100)
        : 0;

    // Índice Dunning-Kruger: % de erros cometidos quando o candidato achava que estava 100% certo
    const totalErrors = totalAnswered - totalCorrect;
    const dunningKrugerIndex =
      totalErrors > 0
        ? Math.round((confidenceAccuracy.certezaErrors / totalErrors) * 100)
        : 0;

    // Vulnerabilidades aos distratores com percentual
    const totalDistractorHits = Object.values(distractorCounts).reduce((a, b) => a + b, 0);
    const distractorVulnerabilities: Record<DistractorRole, { count: number; percentage: number }> = {
      Conceitual: { count: distractorCounts.Conceitual, percentage: totalDistractorHits > 0 ? Math.round((distractorCounts.Conceitual / totalDistractorHits) * 100) : 0 },
      InversaoRegra: { count: distractorCounts.InversaoRegra, percentage: totalDistractorHits > 0 ? Math.round((distractorCounts.InversaoRegra / totalDistractorHits) * 100) : 0 },
      PrazoNumero: { count: distractorCounts.PrazoNumero, percentage: totalDistractorHits > 0 ? Math.round((distractorCounts.PrazoNumero / totalDistractorHits) * 100) : 0 },
      PegadinhaSemantica: { count: distractorCounts.PegadinhaSemantica, percentage: totalDistractorHits > 0 ? Math.round((distractorCounts.PegadinhaSemantica / totalDistractorHits) * 100) : 0 },
      GeneralizacaoIndevida: { count: distractorCounts.GeneralizacaoIndevida, percentage: totalDistractorHits > 0 ? Math.round((distractorCounts.GeneralizacaoIndevida / totalDistractorHits) * 100) : 0 },
      Extrapolacao: { count: distractorCounts.Extrapolacao, percentage: totalDistractorHits > 0 ? Math.round((distractorCounts.Extrapolacao / totalDistractorHits) * 100) : 0 },
      Gabarito: { count: 0, percentage: 0 },
    };

    // Tópicos mais vulneráveis ordenados por taxa de erro
    const topWeakTopics = Object.entries(topicErrorMap)
      .map(([topic, data]) => ({
        topic,
        discipline: data.discipline,
        errors: data.errors,
        total: data.total,
        errorRate: data.total > 0 ? Math.round((data.errors / data.total) * 100) : 0,
      }))
      .filter((t) => t.errors > 0)
      .sort((a, b) => b.errorRate - a.errorRate || b.errors - a.errors)
      .slice(0, 5);

    // Média de retenção dos retestes
    const masteredRetests = retests.filter((r) => r.status === 'mastered').length;
    const retentionRateScore =
      retests.length > 0 ? Math.round((masteredRetests / retests.length) * 100) : 100;

    return {
      totalAnswered,
      totalCorrect,
      accuracyRate,
      errorDistribution,
      confidenceAccuracy,
      distractorVulnerabilities,
      dunningKrugerIndex,
      blindSpotsCount: confidenceAccuracy.certezaErrors,
      retentionRateScore,
      topWeakTopics,
    };
  }

  // Spaced Repetition (Revisão Espaçada)
  static getReviews(userId: string): ReviewItem[] {
    const all = getFromStorage<ReviewItem[]>(STORAGE_KEYS.REVIEWS, []);
    return all.filter((r) => r.userId === userId);
  }

  static scheduleReview(userId: string, questionId: string, intervalDays: 1 | 7 | 30 = 1): void {
    const all = getFromStorage<ReviewItem[]>(STORAGE_KEYS.REVIEWS, []);
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + intervalDays);

    const existingIndex = all.findIndex((r) => r.userId === userId && r.questionId === questionId && r.status === 'pending');
    if (existingIndex >= 0) {
      all[existingIndex].scheduledFor = scheduledDate.toISOString();
      all[existingIndex].intervalDays = intervalDays;
    } else {
      all.push({
        id: `rev-${Date.now()}`,
        userId,
        questionId,
        scheduledFor: scheduledDate.toISOString(),
        intervalDays,
        timesReviewed: 0,
        addedAt: new Date().toISOString(),
        status: 'pending',
      });
    }
    saveToStorage(STORAGE_KEYS.REVIEWS, all);
  }

  static markReviewDone(reviewId: string, nextInterval?: 7 | 30): void {
    const all = getFromStorage<ReviewItem[]>(STORAGE_KEYS.REVIEWS, []);
    const item = all.find((r) => r.id === reviewId);
    if (!item) return;

    if (nextInterval) {
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + nextInterval);
      item.intervalDays = nextInterval;
      item.scheduledFor = nextDate.toISOString();
      item.timesReviewed += 1;
      item.status = 'pending';
    } else {
      item.status = 'completed';
      item.timesReviewed += 1;
    }
    saveToStorage(STORAGE_KEYS.REVIEWS, all);
  }

  // Study Sessions (Cronômetro)
  static getStudySessions(userId: string): StudySession[] {
    const all = getFromStorage<StudySession[]>(STORAGE_KEYS.SESSIONS, []);
    return all.filter((s) => s.userId === userId);
  }

  static recordStudySession(session: Omit<StudySession, 'id'>): { session: StudySession; xpGained: number } {
    const all = getFromStorage<StudySession[]>(STORAGE_KEYS.SESSIONS, []);
    const newSession: StudySession = {
      ...session,
      id: `ses-${Date.now()}`,
    };
    all.push(newSession);
    saveToStorage(STORAGE_KEYS.SESSIONS, all);

    // XP: 50 XP per full hour studied (pro-rated)
    const hours = session.durationMinutes / 60;
    const xpGained = Math.max(10, Math.round(hours * 50));

    const profile = this.getUserProfile();
    if (profile) {
      this.updateUserProfile({
        xp: profile.xp + xpGained,
      });
    }

    return { session: newSession, xpGained };
  }

  // Simulations (Simulados)
  static getSimulations(userId: string): SimulationResult[] {
    const all = getFromStorage<SimulationResult[]>(STORAGE_KEYS.SIMULATIONS, []);
    return all.filter((s) => s.userId === userId);
  }

  static recordSimulation(result: Omit<SimulationResult, 'id'>): { result: SimulationResult; xpGained: number } {
    const all = getFromStorage<SimulationResult[]>(STORAGE_KEYS.SIMULATIONS, []);
    const newResult: SimulationResult = {
      ...result,
      id: `sim-${Date.now()}`,
    };
    all.push(newResult);
    saveToStorage(STORAGE_KEYS.SIMULATIONS, all);

    // XP: +100 XP for completing a simulation + bonus for performance
    const xpGained = 100 + Math.round((newResult.scorePercentage / 100) * 50);
    const profile = this.getUserProfile();
    if (profile) {
      this.updateUserProfile({
        xp: profile.xp + xpGained,
      });
    }

    return { result: newResult, xpGained };
  }

  // Favorites
  static getFavorites(userId: string): FavoriteItem[] {
    const all = getFromStorage<FavoriteItem[]>(STORAGE_KEYS.FAVORITES, []);
    return all.filter((f) => f.userId === userId);
  }

  static isFavorite(userId: string, itemType: FavoriteItem['itemType'], itemId: string): boolean {
    const favs = this.getFavorites(userId);
    return favs.some((f) => f.itemType === itemType && f.itemId === itemId);
  }

  static toggleFavorite(userId: string, itemType: FavoriteItem['itemType'], itemId: string): boolean {
    const all = getFromStorage<FavoriteItem[]>(STORAGE_KEYS.FAVORITES, []);
    const index = all.findIndex((f) => f.userId === userId && f.itemType === itemType && f.itemId === itemId);
    let added = false;
    if (index >= 0) {
      all.splice(index, 1);
      added = false;
    } else {
      all.push({
        id: `fav-${Date.now()}`,
        userId,
        itemType,
        itemId,
        addedAt: new Date().toISOString(),
      });
      added = true;
    }
    saveToStorage(STORAGE_KEYS.FAVORITES, all);
    return added;
  }

  // News
  static getNews(): NewsItem[] {
    return getFromStorage<NewsItem[]>(STORAGE_KEYS.NEWS, INITIAL_NEWS);
  }

  static addNews(item: Omit<NewsItem, 'id'>): NewsItem {
    const news = this.getNews();
    const newItem: NewsItem = { ...item, id: `nw-${Date.now()}` };
    news.unshift(newItem);
    saveToStorage(STORAGE_KEYS.NEWS, news);
    this.logAdminAction('Criação de Notícia', `Notícia "${newItem.title}" cadastrada.`);
    return newItem;
  }

  // Flashcards
  static getFlashcards(disciplineId?: string): Flashcard[] {
    const all = getFromStorage<Flashcard[]>(STORAGE_KEYS.FLASHCARDS, INITIAL_FLASHCARDS);
    if (disciplineId) return all.filter((f) => f.disciplineId === disciplineId);
    return all;
  }

  static addFlashcard(fc: Omit<Flashcard, 'id'>): Flashcard {
    const all = this.getFlashcards();
    const newFc: Flashcard = { ...fc, id: `fc-${Date.now()}` };
    all.push(newFc);
    saveToStorage(STORAGE_KEYS.FLASHCARDS, all);
    return newFc;
  }

  // Notifications & Alerts
  static getNotifications(userId: string): AlertNotification[] {
    const all = getFromStorage<AlertNotification[]>(STORAGE_KEYS.NOTIFICATIONS, [
      {
        id: 'notif-welcome',
        userId,
        title: 'Bem-vindo ao FOCO NA FARDA!',
        message: 'Sua plataforma nacional de preparação policial. Seu concurso. Sua preparação. Sua farda.',
        type: 'system',
        isRead: false,
        createdAt: new Date().toISOString(),
      },
    ]);
    return all.filter((n) => n.userId === userId);
  }

  static markNotificationRead(id: string): void {
    const all = getFromStorage<AlertNotification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    const item = all.find((n) => n.id === id);
    if (item) {
      item.isRead = true;
      saveToStorage(STORAGE_KEYS.NOTIFICATIONS, all);
    }
  }

  static getAlertPreferences(): UserAlertPreferences {
    return getFromStorage<UserAlertPreferences>(STORAGE_KEYS.ALERTS_PREF, {
      newContest: true,
      newEdict: true,
      openRegistrations: true,
      dateChange: true,
      results: true,
      convocations: true,
      pendingReviews: true,
    });
  }

  static saveAlertPreferences(prefs: UserAlertPreferences): void {
    saveToStorage(STORAGE_KEYS.ALERTS_PREF, prefs);
  }

  // Admin Logs
  static getAdminLogs(): { timestamp: string; action: string; details: string }[] {
    return getFromStorage(STORAGE_KEYS.ADMIN_LOGS, [
      {
        timestamp: new Date().toISOString(),
        action: 'Inicialização do Sistema',
        details: 'Foco Data Engine inicializado com catálogo nacional de carreiras, órgãos e editais oficiais.',
      },
    ]);
  }

  static logAdminAction(action: string, details: string): void {
    const logs = this.getAdminLogs();
    logs.unshift({
      timestamp: new Date().toISOString(),
      action,
      details,
    });
    if (logs.length > 100) logs.pop();
    saveToStorage(STORAGE_KEYS.ADMIN_LOGS, logs);
  }
}
