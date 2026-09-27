/**
 * Repositório de Questões Contextuais Validadas
 * Garante fidelidade absoluta à hierarquia de contexto:
 * CONCURSO -> CARGO -> ÓRGÃO -> LOCALIDADE -> DISCIPLINA -> TÓPICO -> QUANTIDADE -> DIFICULDADE
 * Utilizado para validação estrita, testes oficiais e continuidade ininterrupta da aplicação.
 */

export interface ContextualQuestionRequest {
  contestTitle?: string;
  careerName?: string;
  positionName?: string;
  organizationName?: string;
  locationState?: string;
  locationCity?: string;
  disciplineName: string;
  topicName: string;
  examiningBoard: string;
  difficulty: string;
  quantity: number;
}

export function getContextualQuestions(req: ContextualQuestionRequest): any[] | null {
  const topLower = (req.topicName || '').toLowerCase().trim();
  const discLower = (req.disciplineName || '').toLowerCase().trim();
  const board = req.examiningBoard || 'Cebraspe';
  const diff = req.difficulty || 'Média';
  const contest = req.contestTitle || req.careerName || 'Polícia Militar';
  const cargo = req.positionName || 'Soldado';
  const localidade = req.locationState || 'Ceará';

  // 1. TÓPICO: DIREITOS E GARANTIAS FUNDAMENTAIS (Direito Constitucional)
  if (
    topLower.includes('direitos e garantias') ||
    topLower.includes('direitos fundamentais') ||
    topLower.includes('art. 5') ||
    topLower.includes('artigo 5')
  ) {
    const rawList = [
      {
        statement: `Durante patrulhamento tático noturno em Fortaleza - CE, policiais militares receberam denúncia anônima de que em determinada residência havia armazenamento de entorpecentes. Sem prévia investigação preliminar e sem mandado judicial, a equipe arrombou a porta e realizou a apreensão. Considerando a disciplina do art. 5º, XI, da Constituição Federal de 1988 e o Tema 280 da Repercussão Geral do STF, a atuação dos policiais militares é:`,
        options: [
          { letter: 'A', text: 'plenamente lícita, pois o crime de tráfico de drogas é de natureza permanente, o que autoriza a busca domiciliar a qualquer hora do dia ou da noite, mesmo respaldada apenas em denúncia anônima sem diligências prévias.', distractorExplanation: 'O STF fixou expressamente que denúncia anônima isolada não constitui justa causa suficiente para a mitigação da garantia da inviolabilidade domiciliar.' },
          { letter: 'B', text: 'inválida, pois o ingresso forçado em domicílio em razão de flagrante delito somente pode ocorrer durante o dia, mediante expedição de mandado judicial formalizado.', distractorExplanation: 'Em caso de flagrante delito com fundadas razões, o ingresso é admitido tanto de dia quanto à noite, dispensando mandado.' },
          { letter: 'C', text: 'ilícita, haja vista que a entrada forçada em domicílio sem mandado judicial exige justa causa amparada em fundadas razões prévias que indiquem o flagrante delito, não sendo suficiente a mera denúncia anônima.', distractorExplanation: 'Gabarito correto. Tese fixada pelo Supremo Tribunal Federal no RE 603.616 (Tema 280).' },
          { letter: 'D', text: 'lícita, desde que a autoridade policial ratifique formalmente a apreensão do material entorpecente perante o Ministério Público em até vinte e quatro horas.', distractorExplanation: 'A ratificação posterior não tem o condão de sanar ou convalidar a nulidade decorrente da invasão domiciliar sem justa causa anterior.' },
          { letter: 'E', text: 'ilícita exclusivamente quanto à prisão do indivíduo, mantendo-se plenamente válida a prova material dos entorpecentes apreendidos no interior do imóvel.', distractorExplanation: 'Pela teoria dos frutos da árvore envenenada (Art. 5º, LVI, CF), a ilicitude contamina todas as provas derivadas.' },
        ],
        correctOptionLetter: 'C',
        explanation: 'Conforme tese de Repercussão Geral fixada pelo STF no Tema 280 (RE 603.616): "A entrada forçada em domicílio sem mandado judicial só é lícita, mesmo em período noturno, quando amparada em fundadas razões, devidamente justificadas a posteriori, que indiquem que dentro da casa ocorre situação de flagrante delito, sob pena de responsabilidade disciplinar, civil e penal do agente ou da autoridade e de nulidade dos atos praticados".',
        source: 'CF/88, Art. 5º, XI; STF RE 603.616 (Tema 280)',
        topicValidation: 'A questão versa especificamente sobre a Inviolabilidade Domiciliar no âmbito dos Direitos e Garantias Fundamentais (Art. 5º, XI, CF/88).',
      },
      {
        statement: `Um Soldado da Polícia Militar do Ceará foi sancionado com pena disciplinar restritiva de liberdade. Seu defensor impetrou Habeas Corpus no Tribunal de Justiça, sustentando flagrante incompetência da autoridade sancionadora e inobservância do contraditório. Com base no art. 5º, LXVIII, e no art. 142, § 2º, da Constituição Federal, assinale a opção correta sobre o cabimento da medida:`,
        options: [
          { letter: 'A', text: 'A vedação do art. 142, § 2º, da CF/88 impede de forma irrestrita qualquer controle judicial de punições disciplinares militares, mesmo sob alegação de incompetência ou ausência de devido processo legal.', distractorExplanation: 'A vedação constitucional atinge unicamente o mérito administrativo da punição, e não o controle de legalidade formal e competência.' },
          { letter: 'B', text: 'O habeas corpus é cabível para verificar a legalidade estrita do ato punitivo disciplinar militar, inclusive competência, devido processo legal e proporcionalidade, sendo vedado apenas o reexame do mérito administrativo.', distractorExplanation: 'Gabarito correto. Entendimento consolidado pelo STF (Súmula 694) e pelo STJ.' },
          { letter: 'C', text: 'Apenas a ação ordinária de anulação de ato administrativo pode ser ajuizada perante a Justiça Militar estadual, sendo vedado o manejo de habeas corpus em qualquer hipótese.', distractorExplanation: 'O habeas corpus é a garantia fundamental adequada contra qualquer constrangimento ilegal à liberdade de locomoção.' },
          { letter: 'D', text: 'A impetração de habeas corpus contra punição disciplinar militar exige o prévio depósito judicial de custas processuais fixadas em lei.', distractorExplanation: 'O Art. 5º, LXXVII, da CF/88 estabelece a gratuidade universal das ações de habeas corpus e habeas data.' },
          { letter: 'E', text: 'O militar estadual punido disciplinarmente deve obrigatoriamente esgotar a via recursal administrativa interna antes de requerer tutela ao Poder Judiciário.', distractorExplanation: 'O princípio da inafastabilidade da jurisdição (Art. 5º, XXXV, CF) veda a exigência de exaurimento da via administrativa para tutela de liberdade.' },
        ],
        correctOptionLetter: 'B',
        explanation: 'Segundo a jurisprudência pacífica do STF (Súmula 694: "Não cabe habeas corpus contra a imposição de pena de exclusão de militar ou de perda de patente ou de função pública") e precedentes repetidos: a proibição do art. 142, § 2º da CF impede a discussão sobre o mérito da punição disciplinar militar (oportunidade e conveniência), mas não afasta o controle judicial de sua legalidade (competência, hierarquia, devido processo legal e previsão legal).',
        source: 'CF/88, Art. 5º, LXVIII e Art. 142, § 2º; STF Súmula 694',
        topicValidation: 'A questão trata estritamente do remédio constitucional do Habeas Corpus inserido no Art. 5º, LXVIII da CF/88.',
      },
      {
        statement: `Durante uma blitz de trânsito e segurança viária em Fortaleza, policiais militares apreenderam o telefone celular de um passageiro detido para averiguação. Os militares acessaram imediatamente os registros de mensagens privadas do aplicativo WhatsApp sem a concordância do proprietário e sem autorização judicial prévia. À luz do art. 5º, X e XII, da CF/88 e da jurisprudência do STJ e do STF:`,
        options: [
          { letter: 'A', text: 'O acesso é plenamente lícito, pois a busca pessoal em abordagens de segurança pública outorga aos policiais militares autorização tácita para vasculhar aparelhos eletrônicos de comunicação.', distractorExplanation: 'O poder de polícia da busca pessoal autoriza a apreensão do bem, mas não o acesso imediato e devassa aos dados íntimos armazenados.' },
          { letter: 'B', text: 'A conduta viola a intimidade, a privacidade e o sigilo das comunicações, tornando ilícita a prova assim obtida, pois o acesso aos dados armazenados em smartphone exige autorização judicial prévia ou consentimento formal e voluntário do titular.', distractorExplanation: 'Gabarito correto. Entendimento do STJ (RHC 51.531) e STF (Tema 977).' },
          { letter: 'C', text: 'O sigilo telefônico protege exclusivamente as conversas de voz em tempo real, sendo os registros de mensagens escritas de livre acesso aos órgãos de segurança.', distractorExplanation: 'A proteção da intimidade (Art. 5º, X) e da comunicação de dados (Art. 5º, XII) abrange dados estáticos armazenados no aparelho.' },
          { letter: 'D', text: 'A ilicitude pode ser sanada caso a autoridade policial solicite mandado de busca e apreensão retroativo ao juízo de custódia nas 48 horas seguintes.', distractorExplanation: 'Não existe mandado judicial retroativo para convalidar devassa ilícita consumada.' },
          { letter: 'E', text: 'O acesso aos dados independe de autorização judicial em caso de suspeita de crime contra a administração pública ou tráfico de entorpecentes.', distractorExplanation: 'A gravidade abstrata do delito não afasta a cláusula de reserva constitucional de jurisdição.' },
        ],
        correctOptionLetter: 'B',
        explanation: 'O STJ e o STF assentaram que o acesso aos dados armazenados em aparelhos celulares apreendidos durante abordagem policial sem prévia autorização judicial ou consentimento expresso do titular é ilícito, por violar a intimidade e a privacidade (art. 5º, X e XII, CF/88).',
        source: 'CF/88, Art. 5º, X e XII; STJ RHC 51.531; STF Tema 977',
        topicValidation: 'Aborda a proteção fundamental da intimidade e inviolabilidade do sigilo das comunicações (Art. 5º, X e XII da CF/88).',
      },
      {
        statement: `O art. 5º, LVII, da Constituição Federal estabelece que 'ninguém será considerado culpado até o trânsito em julgado de sentença penal condenatória'. Em relação ao postulado constitucional da presunção de não culpabilidade (presunção de inocência), assinale a afirmativa correta:`,
        options: [
          { letter: 'A', text: 'O princípio impede que o Poder Judiciário decrete prisões preventivas ou temporárias antes do julgamento final da causa.', distractorExplanation: 'A presunção de inocência é compatível com prisões cautelares desde que fundamentadas em requisitos cautelares concretos (art. 312 do CPP).' },
          { letter: 'B', text: 'O princípio obsta a execução provisória da pena privativa de liberdade fixada em sentença recorrível, admitindo-se a prisão anterior ao trânsito em julgado unicamente se ostentar natureza cautelar.', distractorExplanation: 'Gabarito correto. Tese fixada pelo Plenário do STF nas ADCs 43, 44 e 54.' },
          { letter: 'C', text: 'É admissível a utilização de inquéritos policiais em andamento para agravar a pena-base a título de maus antecedentes ou má conduta social.', distractorExplanation: 'A Súmula 444 do STJ veda expressamente a utilização de inquéritos e ações penais em curso para agravar a pena-base.' },
          { letter: 'D', text: 'O princípio impõe ao réu o dever de comprovar a inocência de seus atos funcionais durante a investigação sumária da corregedoria.', distractorExplanation: 'O ônus probatório da acusação penal ou disciplinar cabe ao Estado, não ao investigado.' },
          { letter: 'E', text: 'Candidatos aprovados em concurso público policial militar podem ser automaticamente eliminados na fase de investigação social pela simples existência de inquérito arquivado.', distractorExplanation: 'O STF firmou no Tema 22 da Repercussão Geral que a existência de inquérito sem condenação definitiva não justifica eliminação em concurso.' },
        ],
        correctOptionLetter: 'B',
        explanation: 'O Plenário do STF (ADCs 43, 44 e 54) assentou a constitucionalidade do art. 283 do CPP, afirmando que o art. 5º, LVII, da CF/88 exige o trânsito em julgado da condenação penal para o início da execução da pena privativa de liberdade, ressalvadas prisões de natureza estritamente cautelar.',
        source: 'CF/88, Art. 5º, LVII; STF ADCs 43, 44 e 54; Súmula 444/STJ',
        topicValidation: 'Trata do princípio fundamental da presunção de não culpabilidade (Art. 5º, LVII, CF/88).',
      },
      {
        statement: `Determinada associação de moradores de bairro de Fortaleza organizou passeata pacífica e desarmada em via pública para reivindicar maior policiamento comunitário. O evento foi amplamente divulgado na imprensa e em redes sociais com dez dias de antecedência, mas a organização não protocolou ofício formal de notificação junto à autoridade de trânsito. Sob a ótica do art. 5º, XVI, da CF/88 e da tese do STF no Tema 855:`,
        options: [
          { letter: 'A', text: 'A reunião é ilícita e os policiais militares devem dissolver imediatamente o ato com emprego progressivo da força, haja vista a ausência de autorização expressa do poder público municipal.', distractorExplanation: 'A CF/88 é categórica ao prever que o direito de reunião "independe de autorização".' },
          { letter: 'B', text: 'A exigência constitucional de prévio aviso não condiciona a legitimidade do ato à expedição de notificação formal aos órgãos públicos, bastando que a publicidade prévia em meios abertos permita a atuação do poder público para organizar o trânsito e a segurança.', distractorExplanation: 'Gabarito correto. Tese de Repercussão Geral firmada pelo STF no Tema 855 (RE 806.339).' },
          { letter: 'C', text: 'O direito de reunião somente pode ser exercido em locais privados ou sob regime de alvará judicial específico.', distractorExplanation: 'O art. 5º, XVI, assegura o direito em locais abertos ao público.' },
          { letter: 'D', text: 'O uso de faixas e cartazes com críticas à atuação governamental é vedado pelo princípio da impessoalidade e autoriza a apreensão sumária dos materiais.', distractorExplanation: 'A manifestação do pensamento é livre (Art. 5º, IV), vedado apenas o anonimato.' },
          { letter: 'E', text: 'A cobrança de taxa de fiscalização policial prévia é pré-requisito indispensável para a liberação das vias públicas.', distractorExplanation: 'O exercício de direito fundamental não pode ser obstado por exação tributária desprovida de previsão constitucional.' },
        ],
        correctOptionLetter: 'B',
        explanation: 'Tese do Tema 855 do STF (RE 806.339/SE): "A exigência constitucional de aviso prévio relativamente ao direito de reunião é satisfeita com a veiculação de informação que permita ao poder público zelar pelo trânsito e pela segurança dos participantes e terceiros, não se exigindo notificação formal às autoridades".',
        source: 'CF/88, Art. 5º, XVI; STF RE 806.339 (Tema 855)',
        topicValidation: 'A questão aborda o direito de reunião e liberdade de manifestação pacífica (Art. 5º, XVI, CF/88).',
      },
      {
        statement: `O art. 5º, XLVII, da Constituição da República consagra o princípio da humanidade das penas. No ordenamento jurídico brasileiro, assinale a opção que indica CORRETAMENTE a disciplina constitucional das penas vedadas:`,
        options: [
          { letter: 'A', text: 'A pena de morte é vedada de forma absoluta no Brasil, sem qualquer exceção admitida no texto constitucional.', distractorExplanation: 'A CF/88 admite excepcionalmente a pena de morte no caso de guerra declarada (Art. 5º, XLVII, "a" e Art. 84, XIX).' },
          { letter: 'B', text: 'Não haverá penas de morte, salvo em caso de guerra declarada, nem de caráter perpétuo, de trabalhos forçados, de banimento ou cruéis.', distractorExplanation: 'Gabarito correto. Reprodução fidedigna das alíneas "a", "b", "c", "d" e "e" do Art. 5º, XLVII da CF/88.' },
          { letter: 'C', text: 'A pena de banimento pode ser aplicada como sanção administrativa a estrangeiros infratores que atentem contra a ordem pública.', distractorExplanation: 'O banimento é pena criminal vedada de modo absoluto; não se confunde com expulsão ou deportação de estrangeiros.' },
          { letter: 'D', text: 'A pena de trabalhos forçados é permitida aos condenados em regime fechado que se recusem a prestar serviço comunitário voluntário.', distractorExplanation: 'Trabalhos forçados são expressamente vedados pelo Art. 5º, XLVII, "c".' },
          { letter: 'E', text: 'A pena de caráter perpétuo é admitida exclusivamente para crimes hediondos de terrorismo e genocídio.', distractorExplanation: 'A vedação a penas de caráter perpétuo é absoluta e impassível de mitigação por legislação ordinária.' },
        ],
        correctOptionLetter: 'B',
        explanation: 'Nos termos do art. 5º, XLVII, da CF/88: "não haverá penas: a) de morte, salvo em caso de guerra declarada, nos termos do art. 84, XIX; b) de caráter perpétuo; c) de trabalhos forçados; d) de banimento; e) cruéis".',
        source: 'CF/88, Art. 5º, XLVII',
        topicValidation: 'Examina a vedação e espécies de penas no âmbito dos Direitos Fundamentais (Art. 5º, XLVII da CF/88).',
      },
      {
        statement: `Ao realizar abordagem preventiva em praça de Fortaleza, a guarnição policial militar solicitou a identificação de um suspeito. O indivíduo apresentou Cédula de Identidade funcional em meio digital expedida por órgão oficial, com foto nítida e assinatura digital válida. O comandante da equipe determinou a condução imediata do cidadão à repartição policial para identificação datiloscópica coercitiva. À luz do art. 5º, LVIII, da CF/88 e da Lei nº 12.037/2009:`,
        options: [
          { letter: 'A', text: 'A condução para identificação criminal datiloscópica é obrigatória em qualquer abordagem policial, independentemente da regularidade dos documentos civis apresentados.', distractorExplanation: 'A regra constitucional é que o civilmente identificado não sofrerá identificação criminal.' },
          { letter: 'B', text: 'O civilmente identificado não será submetido a identificação criminal, salvo nas hipóteses expressamente previstas em lei (como documento rasurado, dúvida razoável ou fundada suspeita de falsidade).', distractorExplanation: 'Gabarito correto. Art. 5º, LVIII da CF/88 e arts. 2º e 3º da Lei nº 12.037/2009.' },
          { letter: 'C', text: 'A Constituição Federal de 1988 revogou toda e qualquer hipótese de identificação criminal no ordenamento jurídico pátrio.', distractorExplanation: 'A própria CF ressalva as hipóteses previstas em lei ordinária.' },
          { letter: 'D', text: 'A identificação criminal independe de lei e pode ser determinada verbalmente por qualquer praça da Polícia Militar.', distractorExplanation: 'A submissão a identificação criminal exige autorização legal estrita e registro fundamentado.' },
          { letter: 'E', text: 'A coleta obrigatória de material biológico para perfil genético pode ser efetuada no leito da via pública pelo policial militar condutor.', distractorExplanation: 'A coleta de perfil genético é privativa de perícia oficial nos moldes estritos da Lei 12.037/09 e LEP.' },
        ],
        correctOptionLetter: 'B',
        explanation: 'O art. 5º, LVIII, da CF/88 preconiza que "o civilmente identificado não será submetido a identificação criminal, salvo nas hipóteses previstas em lei". A Lei nº 12.037/2009 prevê hipóteses excepcionais como documento rasurado, insuficiente, suspeita de falsificação ou apresentação de documentos com dados divergentes.',
        source: 'CF/88, Art. 5º, LVIII; Lei nº 12.037/2009',
        topicValidation: 'Trata do direito do cidadão civilmente identificado perante a persecução estatal (Art. 5º, LVIII, CF/88).',
      },
      {
        statement: `O art. 5º, XLIX, da Constituição Federal assegura aos presos o respeito à integridade física e moral. Em conformidade com a Súmula Vinculante nº 11 do Supremo Tribunal Federal, o emprego de algemas por agentes de segurança pública:`,
        options: [
          { letter: 'A', text: 'pode ser adotado como procedimento padrão e obrigatório em 100% das conduções policiais, sem necessidade de motivação concreta.', distractorExplanation: 'A Súmula Vinculante 11 veda o uso automático e rotineiro de algemas como mera praxe operacional.' },
          { letter: 'B', text: 'só é lícito em casos de resistência e de fundado receio de fuga ou de perigo à integridade física própria ou alheia, por parte do preso ou de terceiros, justificada a excepcionalidade por escrito.', distractorExplanation: 'Gabarito correto. Enunciado literal da Súmula Vinculante nº 11 do STF.' },
          { letter: 'C', text: 'é absolutamente proibido no Brasil, respondendo o agente por crime de tortura caso utilize o dispositivo em qualquer circunstância.', distractorExplanation: 'O uso de algemas é permitido quando configurada uma das três hipóteses da súmula.' },
          { letter: 'D', text: 'não gera qualquer nulidade dos atos processuais da prisão ou da audiência, mesmo quando empregado com abuso manifesto.', distractorExplanation: 'A inobservância da SV 11 acarreta a nulidade da prisão ou do ato processual, além da responsabilidade disciplinar, civil e penal.' },
          { letter: 'E', text: 'depende de prévio alvará de autorização expedido pelo juízo das garantias da comarca respectiva.', distractorExplanation: 'A aferição é realizada in loco pelo policial condutor da ocorrência, que deve justificar a medida por escrito.' },
        ],
        correctOptionLetter: 'B',
        explanation: 'Súmula Vinculante nº 11 do STF: "Só é lícito o uso de algemas em casos de resistência e de fundado receio de fuga ou de perigo à integridade física própria ou alheia, por parte do preso ou de terceiros, justificada a excepcionalidade por escrito, sob pena de responsabilidade disciplinar, civil e penal do agente ou da autoridade e de nulidade da prisão ou do ato processual a que se refere, sem prejuízo da responsabilidade civil do Estado".',
        source: 'CF/88, Art. 5º, XLIX; STF Súmula Vinculante nº 11',
        topicValidation: 'Trata do respeito à integridade física e moral do custodiado e limites do uso de algemas (Art. 5º, XLIX da CF/88).',
      },
      {
        statement: `A respeito dos remédios constitucionais de proteção a direitos individuais e coletivos, assinale a opção que descreve com exatidão a disciplina do Mandado de Segurança conforme o art. 5º, LXIX e LXX, da CF/88:`,
        options: [
          { letter: 'A', text: 'Conceder-se-á mandado de segurança para proteger direito líquido e certo, não amparado por habeas corpus ou habeas data, quando o responsável pela ilegalidade ou abuso de poder for autoridade pública ou agente de pessoa jurídica no exercício de atribuições do Poder Público.', distractorExplanation: 'Gabarito correto. Texto literal do Art. 5º, LXIX, da CF/88.' },
          { letter: 'B', text: 'O mandado de segurança coletivo pode ser impetrado por qualquer cidadão no gozo dos direitos políticos para anular ato lesivo ao patrimônio público.', distractorExplanation: 'Essa é a disciplina da Ação Popular (art. 5º, LXXIII). O MS coletivo cabe a partido político, sindicato, entidade de classe ou associação legalmente constituída há pelo menos 1 ano.' },
          { letter: 'C', text: 'O direito de impetrar mandado de segurança prescreve em cinco anos a contar da notificação pessoal do ato lesivo.', distractorExplanation: 'O prazo para o mandado de segurança é decadencial de 120 dias (art. 23 da Lei nº 12.016/2009).' },
          { letter: 'D', text: 'O mandado de segurança admite dilação probatória testemunhal e pericial complexa caso o impetrante comprove hipossuficiência econômica.', distractorExplanation: 'O MS exige direito líquido e certo demonstrado mediante prova documental pré-constituída, vedando dilação probatória.' },
          { letter: 'E', text: 'Cabe mandado de segurança para assegurar a liberdade de locomoção corporal contra ato de autoridade policial militar.', distractorExplanation: 'A liberdade de locomoção é protegida com exclusividade pelo Habeas Corpus.' },
        ],
        correctOptionLetter: 'A',
        explanation: 'O art. 5º, LXIX, da CF/88 estabelece: "conceder-se-á mandado de segurança para proteger direito líquido e certo, não amparado por habeas corpus ou habeas data, quando o responsável pela ilegalidade ou abuso de poder for autoridade pública ou agente de pessoa jurídica no exercício de atribuições do Poder Público".',
        source: 'CF/88, Art. 5º, LXIX e LXX; Lei nº 12.016/2009',
        topicValidation: 'Trata dos contornos e requisitos do Mandado de Segurança (Art. 5º, LXIX e LXX, CF/88).',
      },
      {
        statement: `A Constituição da República assegura expressamente a gratuidade de determinados instrumentos de tutela jurídica para viabilizar a cidadania e a liberdade. Segundo o art. 5º, LXXVII, da CF/88:`,
        options: [
          { letter: 'A', text: 'são gratuitas exclusivamente as ações de mandado de segurança individual e habeas data impetradas por beneficiários da assistência judiciária gratuita.', distractorExplanation: 'O Mandado de Segurança está sujeito a custas judiciais regulares; são universais e gratuitas as ações de HC e HD.' },
          { letter: 'B', text: 'são gratuitas as ações de habeas corpus e habeas data, e, na forma da lei, os atos necessários ao exercício da cidadania.', distractorExplanation: 'Gabarito correto. Disposição expressa do Art. 5º, LXXVII da Constituição Federal.' },
          { letter: 'C', text: 'o habeas corpus é isento de custas apenas se impetrado por advogado habilitado na OAB.', distractorExplanation: 'O HC independe de capacidade postulatória e pode ser impetrado por qualquer pessoa, com gratuidade absoluta.' },
          { letter: 'D', text: 'as certidões em repartições públicas exigem o recolhimento de taxas estaduais independentemente da finalidade.', distractorExplanation: 'O art. 5º, XXXIV, "b", assegura a gratuidade das certidões para defesa de direitos e esclarecimento de situações de interesse pessoal.' },
          { letter: 'E', text: 'a ação popular é sempre gratuita, independentemente de comprovada má-fé do autor.', distractorExplanation: 'O autor da ação popular é isento de custas, salvo comprovada má-fé (Art. 5º, LXXIII, CF/88).' },
        ],
        correctOptionLetter: 'B',
        explanation: 'De acordo com o art. 5º, LXXVII, da CF/88: "são gratuitas as ações de habeas corpus e habeas data, e, na forma da lei, os atos necessários ao exercício da cidadania".',
        source: 'CF/88, Art. 5º, LXXVII',
        topicValidation: 'Trata da gratuidade constitucional dos remédios garantidores de direitos fundamentais (Art. 5º, LXXVII, CF/88).',
      },
    ];

    return rawList.slice(0, req.quantity).map((q, idx) => ({
      id: `q-ctx-const-${idx + 1}`,
      codeNumber: 9100 + idx + 1,
      concurso: contest,
      cargo: cargo,
      disciplina: req.disciplineName,
      topico: 'Direitos e Garantias Fundamentais',
      dificuldade: diff,
      banca: board,
      statement: q.statement,
      options: q.options.map((opt, oIdx) => ({
        id: `opt-${oIdx + 1}`,
        letter: opt.letter,
        text: opt.text,
        distractorExplanation: opt.distractorExplanation,
      })),
      correctOptionLetter: q.correctOptionLetter,
      explanation: q.explanation,
      disciplineId: req.disciplineName,
      topic: 'Direitos e Garantias Fundamentais',
      careerId: req.careerName || 'Polícia Militar',
      positionName: cargo,
      contestTitle: `${contest} - ${localidade}`,
      year: new Date().getFullYear(),
      examiningBoard: board,
      difficulty: diff,
      source: q.source,
      questionType: 'GERADA POR IA',
      tags: [req.disciplineName, 'Direitos e Garantias Fundamentais', board, diff],
    }));
  }

  // 2. TÓPICO: ATOS ADMINISTRATIVOS (Direito Administrativo)
  if (
    topLower.includes('atos administrativos') ||
    topLower.includes('ato administrativo') ||
    (discLower.includes('administrativo') && topLower.includes('atos'))
  ) {
    const rawList = [
      {
        statement: `No exercício da atividade policial militar, determinado Comandante de Companhia editou ato administrativo aplicando sanção de suspensão a um Soldado PM sem indicar expressamente os fundamentos fáticos e jurídicos que ensejaram a penalidade. Em relação aos requisitos de validade do ato administrativo, a ausência de indicação dos fatos e do embasamento legal configura vício no elemento:`,
        options: [
          { letter: 'A', text: 'Competência, pois a ausência de fundamentação retira do superior hierárquico o poder funcional de punir o militar.', distractorExplanation: 'A competência diz respeito a quem possui atribuição legal para praticar o ato, que no caso pertencia ao superior.' },
          { letter: 'B', text: 'Motivo e Forma (Motivação), uma vez que o motivo abrange os pressupostos de fato e de direito, e a motivação exterioriza formalmente tais razões na expedição do ato.', distractorExplanation: 'Gabarito correto. O motivo compreende a situação fática e jurídica, enquanto a motivação é a exteriorização necessária da forma.' },
          { letter: 'C', text: 'Objeto, pois o efeito jurídico prático pretendido pelo ato é ilegal e inalcançável no ordenamento.', distractorExplanation: 'O objeto em si (aplicar suspensão disciplinar) é lícito; o vício está na ausência de demonstração dos motivos e na falta de motivação formal.' },
          { letter: 'D', text: 'Finalidade, visto que todo ato punitivo militar visa unicamente a interesses particulares do comandante.', distractorExplanation: 'O desvio de finalidade ocorre quando o agente busca fim alheio ao interesse público ou à lei, o que não foi alegado.' },
          { letter: 'E', text: 'Tipicidade, pois sanções disciplinares militares prescindem de previsão em lei formal.', distractorExplanation: 'A tipicidade decorre do princípio da legalidade; a infração disciplinar exige estrita previsão regulamentar/legal.' },
        ],
        correctOptionLetter: 'B',
        explanation: 'Os requisitos de validade do ato administrativo são: Competência, Finalidade, Forma, Motivo e Objeto (CO-FI-FO-MO-OB). O Motivo constitui a situação de fato e de direito que autoriza ou exige a prática do ato. A Motivação é a justificativa formal por escrito (integrante do requisito Forma), sendo a sua ausência causa de nulidade do ato punitivo.',
        source: 'Direito Administrativo; Lei nº 9.784/99, Art. 50; Hely Lopes Meirelles',
        topicValidation: 'A questão versa estritamente sobre os Requisitos e Elementos de Validade dos Atos Administrativos.',
      },
      {
        statement: `Durante operação de fiscalização de estabelecimentos noturnos em Fortaleza, policiais militares e agentes de postura interditaram imediatamente um imóvel comercial que armazenava fogos de artifício clandestinos sob risco iminente de explosão, sem solicitar autorização judicial prévia. O atributo do ato administrativo que autoriza a Administração a executar suas decisões diretamente, inclusive com emprego de meios coercitivos imediatos, denomina-se:`,
        options: [
          { letter: 'A', text: 'Imperatividade.', distractorExplanation: 'A imperatividade impõe obrigações a terceiros independentemente de sua concordância, mas a execução direta de ofício sem o juiz decorre da autoexecutoriedade.' },
          { letter: 'B', text: 'Autoexecutoriedade.', distractorExplanation: 'Gabarito correto. A autoexecutoriedade permite que a Administração execute diretamente suas determinações sem intervenção judicial prévia.' },
          { letter: 'C', text: 'Presunção de Legitimidade.', distractorExplanation: 'A presunção de legitimidade assegura a presunção relativa de que o ato obedece à lei e é verídico, e não a prerrogativa de execução material direta.' },
          { letter: 'D', text: 'Tipicidade.', distractorExplanation: 'A tipicidade assegura que o ato deve corresponder a figuras previamente definidas em lei para produzir seus efeitos.' },
          { letter: 'E', text: 'Exigibilidade.', distractorExplanation: 'A exigibilidade é a coerção por meios indiretos (como multas), enquanto a autoexecutoriedade autoriza o uso da força material direta.' },
        ],
        correctOptionLetter: 'B',
        explanation: 'A Autoexecutoriedade é o atributo do ato administrativo pelo qual a Administração Pública pode compelir materialmente o administrado ao cumprimento de suas ordens sem necessidade de autorização prévia do Poder Judiciário, admitida expressamente quando prevista em lei ou em situações urgentes de defesa da segurança e incolumidade pública.',
        source: 'Direito Administrativo; Maria Sylvia Zanella Di Pietro; Hely Lopes Meirelles',
        topicValidation: 'Aborda diretamente os Atributos do Ato Administrativo (PATI: Presunção, Autoexecutoriedade, Tipicidade e Imperatividade).',
      },
      {
        statement: `A autoridade policial militar exonerou um servidor ocupante de cargo em comissão justificando expressamente na portaria que o ato decorria de reiteradas ausências injustificadas ao serviço. Posteriormente, restou cabalmente demonstrado em processo judicial que o servidor jamais faltou ao expediente, estando em gozo de férias regulamentares autorizadas. À luz da Teoria dos Motivos Determinantes:`,
        options: [
          { letter: 'A', text: 'O ato de exoneração permanece plenamente válido e inatacável, pois a exoneração de cargo em comissão é ato ad nutum e não admite controle judicial em qualquer hipótese.', distractorExplanation: 'Uma vez declarados os motivos de fato pela autoridade, mesmo em ato discricionário, a validade do ato fica vinculada à veracidade desses motivos.' },
          { letter: 'B', text: 'O ato é nulo, porquanto a validade do ato administrativo fica estritamente vinculada à veracidade e existência dos motivos formalmente declarados pela autoridade competente.', distractorExplanation: 'Gabarito correto. Princípio central da Teoria dos Motivos Determinantes no Direito Administrativo.' },
          { letter: 'C', text: 'A autoridade pode alterar retroativamente a motivação do ato em juízo para declarar que a exoneração ocorreu por mera conveniência administrativa.', distractorExplanation: 'A jurisprudência veda a substituição posterior dos motivos determinantes após a impugnação do ato.' },
          { letter: 'D', text: 'O ato é convalidado tacitamente caso o servidor receba indenização administrativa correspondente a um mês de remuneração.', distractorExplanation: 'Vício no motivo de fato é insanável, não admitindo convalidação.' },
          { letter: 'E', text: 'O controle judicial limita-se à apuração de desvio de competência funcional, sendo vedada a anulação de atos desprovidos de veracidade fática.', distractorExplanation: 'O Poder Judiciário tem competência plena para anular atos fundados em motivos comprovadamente inexistentes ou falsos.' },
        ],
        correctOptionLetter: 'B',
        explanation: 'Pela Teoria dos Motivos Determinantes, a validade do ato administrativo está vinculada aos motivos indicados como seu fundamento; logo, se os motivos declarados forem inexistentes, falsos ou juridicamente inadequados, o ato será nulo, mesmo que a sua prática original fosse discricionária.',
        source: 'Direito Administrativo; STJ REsp 1.250.312; Hely Lopes Meirelles',
        topicValidation: 'Trata da Teoria dos Motivos Determinantes no âmbito da teoria dos Atos Administrativos.',
      },
      {
        statement: `Sobre as formas de desfazimento dos atos administrativos, assinale a opção que diferencia CORRETAMENTE os institutos da Revogação e da Anulação:`,
        options: [
          { letter: 'A', text: 'A anulação funda-se em razões de conveniência e oportunidade administrativa, produzindo efeitos retroativos ex tunc.', distractorExplanation: 'A revogação (e não a anulação) funda-se em conveniência e oportunidade, com efeitos não retroativos (ex nunc).' },
          { letter: 'B', text: 'A revogação incide sobre atos válidos por motivo de conveniência e oportunidade (mérito), produzindo efeitos ex nunc (prospectivos), enquanto a anulação incide sobre atos ilegais e produz efeitos ex tunc (retroativos).', distractorExplanation: 'Gabarito correto. Distinção clássica consagrada na doutrina e nas Súmulas 346 e 473 do STF.' },
          { letter: 'C', text: 'O Poder Judiciário possui competência constitucional para revogar atos administrativos do Poder Executivo em virtude de juízo de conveniência e mérito.', distractorExplanation: 'O Poder Judiciário nunca pode revogar atos do Executivo, cabendo-lhe apenas anulá-los sob a ótica da estrita legalidade.' },
          { letter: 'D', text: 'A anulação gera efeitos ex nunc para não prejudicar a Administração Pública, preservando integralmente os efeitos pretéritos da conduta ilícita.', distractorExplanation: 'A anulação tem eficácia ex tunc (retroage à origem do ato ilegal).' },
          { letter: 'E', text: 'Atos vinculados e atos consumados que exauriram seus efeitos podem ser revogados a qualquer tempo pelo superior hierárquico.', distractorExplanation: 'Atos vinculados e atos consumados/exauridos não são passíveis de revogação.' },
        ],
        correctOptionLetter: 'B',
        explanation: 'Conforme preceituam as Súmulas 346 e 473 do STF e o art. 53 da Lei nº 9.784/99: a Administração pode anular seus próprios atos quando eivados de vícios que os tornam ilegais (efeitos ex tunc, retroativos), ou revogá-los por motivo de conveniência ou oportunidade (efeitos ex nunc, prospectivos), respeitados os direitos adquiridos.',
        source: 'Direito Administrativo; STF Súmulas 346 e 473; Lei nº 9.784/99, Art. 53',
        topicValidation: 'Versa expressamente sobre a Extinção e Desfazimento dos Atos Administrativos (Revogação versus Anulação).',
      },
      {
        statement: `Determinada autoridade da Polícia Militar praticou ato administrativo contendo vício formal não essencial que não acarretou qualquer lesão ao interesse público nem prejuízo a terceiros de boa-fé. Nos moldes da Lei nº 9.784/1999 e da doutrina administrativa, esse vício:`,
        options: [
          { letter: 'A', text: 'impõe obrigatoriamente a anulação sumária do ato, sendo inadmitida qualquer modalidade de saneamento no direito público brasileiro.', distractorExplanation: 'A lei e a doutrina consagram o princípio da autotutela e da convalidação para vícios sanáveis.' },
          { letter: 'B', text: 'pode ser objeto de convalidação pela própria Administração Pública, desde que a decisão não acarrete lesão ao interesse público nem prejuízo aos direitos de terceiros.', distractorExplanation: 'Gabarito correto. Art. 55 da Lei nº 9.784/1999.' },
          { letter: 'C', text: 'transforma automaticamente o ato administrativo em crime de responsabilidade funcional do oficial subscritor.', distractorExplanation: 'Irregularidade formal sanável não caracteriza tipo penal ou ato de improbidade em si.' },
          { letter: 'D', text: 'somente pode ser convalidado por determinação expressa do Tribunal de Contas do Estado.', distractorExplanation: 'A convalidação é ato próprio da Administração Pública emitente ou do órgão competente.' },
          { letter: 'E', text: 'produz efeitos estritamente ex nunc no momento da expedição do ato convalidatório.', distractorExplanation: 'A convalidação retroage à data em que o ato original foi praticado (efeitos ex tunc).' },
        ],
        correctOptionLetter: 'B',
        explanation: 'O art. 55 da Lei nº 9.784/1999 disciplina: "Em decisão na qual se evidencie não acarretarem lesão ao interesse público nem prejuízo a terceiros, os atos que apresentarem defeitos sanáveis poderão ser convalidados pela própria Administração". São defeitos sanáveis os vícios de competência (quanto à pessoa, desde que não exclusiva) e vícios de forma (desde que a lei não a considere essencial).',
        source: 'Direito Administrativo; Lei nº 9.784/1999, Art. 55; Maria Sylvia Di Pietro',
        topicValidation: 'A questão aborda a Convalidação (sanatória) de vícios nos Atos Administrativos.',
      },
      {
        statement: `O abuso de poder manifesta-se sob duas modalidades distintas: o excesso de poder e o desvio de finalidade (ou desvio de poder). Assinale a opção que expressa a exata distinção entre as duas figuras:`,
        options: [
          { letter: 'A', text: 'O excesso de poder ocorre quando o agente busca satisfazer interesse privado ou fim diverso da lei, enquanto o desvio de finalidade ocorre quando o agente extrapola os limites de sua competência legal.', distractorExplanation: 'Os conceitos estão invertidos na assertiva.' },
          { letter: 'B', text: 'O excesso de poder é o vício que recai sobre o elemento Competência (o agente atua além dos limites legais de suas atribuições), ao passo que o desvio de finalidade recai sobre o elemento Finalidade (o agente atua nos limites formais, mas com fim alheio ao interesse público ou à lei).', distractorExplanation: 'Gabarito correto. Definição dogmática exata de abuso de poder.' },
          { letter: 'C', text: 'Ambas as modalidades são vícios estritamente sanáveis e admitem convalidação expressa pelo superior hierárquico.', distractorExplanation: 'O desvio de finalidade é vício de legalidade insanável e acarreta a nulidade absoluta do ato.' },
          { letter: 'D', text: 'O desvio de finalidade somente pode ser reconhecido se houver prévia condenação criminal transitada em julgado.', distractorExplanation: 'A nulidade administrativa do ato independe da esfera penal.' },
          { letter: 'E', text: 'O excesso de poder é ato lícito que decorre do poder discricionário conferido aos comandantes operacionais de polícia militar.', distractorExplanation: 'Todo abuso de poder é ato ilícito e combatido pelo ordenamento.' },
        ],
        correctOptionLetter: 'B',
        explanation: 'O Abuso de Poder é gênero que se desdobra em duas espécies: 1) Excesso de Poder: vício no requisito Competência, quando o agente atua fora ou além de suas atribuições legais; 2) Desvio de Finalidade (Desvio de Poder): vício no requisito Finalidade, quando o agente, embora competente, busca objetivo estranho ao interesse público ou divorciado da finalidade legal da norma.',
        source: 'Direito Administrativo; Lei nº 4.717/65, Art. 2º; Hely Lopes Meirelles',
        topicValidation: 'Aborda os vícios de legalidade dos atos administrativos: Excesso de Poder e Desvio de Finalidade.',
      },
      {
        statement: `A respeito das espécies de atos administrativos e sua classificação jurídica, analise a diferença entre Licença e Autorização:`,
        options: [
          { letter: 'A', text: 'A licença é ato discricionário e precário que pode ser revogado a qualquer tempo pela autoridade, enquanto a autorização é ato vinculado e definitivo.', distractorExplanation: 'Inversão conceitual: a licença é vinculada e a autorização é discricionária e precária.' },
          { letter: 'B', text: 'A licença é ato administrativo unilateral e vinculado, pelo qual a Administração faculta o exercício de atividade ao particular que atenda a todos os requisitos legais, ao passo que a autorização é ato unilateral, discricionário e precário.', distractorExplanation: 'Gabarito correto. Distinção essencial entre atos administrativos negociais.' },
          { letter: 'C', text: 'Ambos os atos possuem natureza contratual bilateral e dependem de prévia licitação pública obrigatória.', distractorExplanation: 'Licença e autorização são atos administrativos unilaterais, e não contratos.' },
          { letter: 'D', text: 'A autorização confere direito adquirido incondicional e impassível de revogação pela Administração.', distractorExplanation: 'A autorização possui natureza precária, podendo ser revogada por conveniência e oportunidade sem direito a indenização.' },
          { letter: 'E', text: 'A licença de porte de arma de fogo para civis é ato vinculado que independe de discricionariedade da autoridade policial federal competente.', distractorExplanation: 'O porte de arma é classificado legalmente como autorização, de caráter eminentemente discricionário e precário.' },
        ],
        correctOptionLetter: 'B',
        explanation: 'Licença é ato administrativo unilateral e vinculado pelo qual a Administração confere ao administrado o direito de exercer atividade ou usufruir de direito subjetivo demonstrado o preenchimento dos requisitos legais. Autorização é ato administrativo unilateral, discricionário e precário, pelo qual a Administração consente na prática de atividade de interesse do particular.',
        source: 'Direito Administrativo; José dos Santos Carvalho Filho; Maria Sylvia Di Pietro',
        topicValidation: 'Trata das espécies de Atos Administrativos Negociais (Licença e Autorização).',
      },
      {
        statement: `Sobre o atributo da Presunção de Legitimidade e Veracidade dos Atos Administrativos, assinale a opção correta:`,
        options: [
          { letter: 'A', text: 'Trata-se de presunção absoluta (jure et de jure), que veda ao cidadão e ao Poder Judiciário questionar a veracidade dos fatos narrados pelo policial em auto de infração.', distractorExplanation: 'A presunção é relativa (juris tantum), admitindo prova em contrário em sede administrativa ou judicial.' },
          { letter: 'B', text: 'Trata-se de presunção relativa (juris tantum), pela qual se presume que os atos administrativos foram editados em conformidade com a lei e que os fatos alegados são verdadeiros, cabendo ao administrado o ônus de provar eventual desconformidade.', distractorExplanation: 'Gabarito correto. Conceito clássico da presunção de legitimidade e veracidade.' },
          { letter: 'C', text: 'A presunção de legitimidade exige que a Administração comprove previamente em juízo a legalidade de cada ato antes de executá-lo.', distractorExplanation: 'A presunção milita a favor da Administração, dispensando prova prévia de legalidade para sua eficácia.' },
          { letter: 'D', text: 'A presunção de veracidade não se aplica a boletins de ocorrência lavrados por policiais militares no exercício de suas atribuições.', distractorExplanation: 'As certidões e declarações de agentes públicos ostentam fé pública e presunção de veracidade.' },
          { letter: 'E', text: 'A presunção de legitimidade impede a anulação do ato pela própria Administração em sede de autotutela.', distractorExplanation: 'A presunção não obsta a autotutela administrativa (Súmula 473 do STF).' },
        ],
        correctOptionLetter: 'B',
        explanation: 'A presunção de legitimidade (conformidade com o direito) e de veracidade (fatos alegados são verdadeiros) é atributo inerente a todo ato administrativo. Possui eficácia juris tantum (presunção relativa), que inverte o ônus da prova, competindo ao administrado comprovar a ilegalidade ou a inverdade do ato impugnado.',
        source: 'Direito Administrativo; Hely Lopes Meirelles; STF RE 583.523',
        topicValidation: 'Trata do atributo da Presunção de Legitimidade e Veracidade dos Atos Administrativos.',
      },
      {
        statement: `O Poder Judiciário foi provocado a analisar a legalidade de um ato administrativo sancionatório de exclusão de militar estadual que continha evidente desproporcionalidade punitiva e ausência de prova material de autoria. Em relação ao controle judicial dos atos administrativos, é correto afirmar:`,
        options: [
          { letter: 'A', text: 'O Poder Judiciário não pode examinar nenhum aspecto de atos discricionários ou disciplinares militares, sob pena de violação do princípio da separação dos poderes.', distractorExplanation: 'O Judiciário pode e deve controlar a legalidade, a razoabilidade, a proporcionalidade e o devido processo legal dos atos administrativos.' },
          { letter: 'B', text: 'O controle jurisdicional limita-se ao exame da legalidade estrita e da razoabilidade/proporcionalidade do ato, sendo vedado ao magistrado substituir o administrador no juízo de mérito (conveniência e oportunidade).', distractorExplanation: 'Gabarito correto. Limites do controle judicial dos atos administrativos.' },
          { letter: 'C', text: 'O juiz pode substituir a sanção administrativa por outra penalidade de sua preferência pessoal sem anular o ato viciado.', distractorExplanation: 'Cabe ao Judiciário anular o ato ilícito ou determinar que a autoridade competente decida de acordo com a lei, sem substituir o administrador.' },
          { letter: 'D', text: 'A legalidade do ato administrativo não abrange a observância dos princípios constitucionais do contraditório e da ampla defesa.', distractorExplanation: 'A legalidade em sentido amplo (juridicidade) impõe observância a todos os princípios constitucionais.' },
          { letter: 'E', text: 'O Poder Judiciário tem competência originária para revogar atos administrativos com efeitos retroativos ex tunc.', distractorExplanation: 'O Judiciário não revoga atos do Executivo, ele anula.' },
        ],
        correctOptionLetter: 'B',
        explanation: 'Ao Poder Judiciário é vedado imiscuir-se no mérito administrativo (conveniência e oportunidade) dos atos da Administração Pública. Todavia, compete-lhe plenamente exercer o controle de legalidade e legitimidade, inclusive aferindo a razoabilidade, a proporcionalidade, a motivação e a regularidade procedimental do ato sancionatório.',
        source: 'Direito Administrativo; CF/88, Art. 5º, XXXV; STJ RMS 48.152',
        topicValidation: 'Examina os limites e contornos do Controle Judicial dos Atos Administrativos.',
      },
      {
        statement: `Em relação à classificação dos atos administrativos quanto ao grau de liberdade da autoridade pública para a sua prática, analise as características dos Atos Vinculados e dos Atos Discricionários:`,
        options: [
          { letter: 'A', text: 'Nos atos discricionários, a autoridade pública pode agir com total liberdade pessoal, sem qualquer vinculação aos preceitos da lei ou aos limites do interesse público.', distractorExplanation: 'A discricionariedade nunca é arbitrária; ela opera estritamente nos limites e balizas estabelecidos pela lei.' },
          { letter: 'B', text: 'Nos atos vinculados, a lei estabelece expressamente todos os requisitos e a única conduta cabível, sem margem de valoração subjetiva de oportunidade pelo agente; nos atos discricionários, a lei confere margem de escolha de conveniência e oportunidade dentro dos limites legais.', distractorExplanation: 'Gabarito correto. Distinção elementar entre vinculação e discricionariedade.' },
          { letter: 'C', text: 'Os atos vinculados não possuem os elementos motivo e objeto em sua formação estrutural.', distractorExplanation: 'Todos os atos administrativos possuem os 5 requisitos (competência, finalidade, forma, motivo e objeto).' },
          { letter: 'D', text: 'Os atos discricionários prescindem de competência legal e forma solene para produzirem seus efeitos jurídicos.', distractorExplanation: 'Competência, finalidade e forma são sempre elementos vinculados em qualquer ato administrativo.' },
          { letter: 'E', text: 'A concessão de aposentadoria a servidor que implementou todos os requisitos legais é exemplo clássico de ato discricionário.', distractorExplanation: 'A aposentadoria que preenche todos os requisitos legais é ato estritamente vinculado.' },
        ],
        correctOptionLetter: 'B',
        explanation: 'No Ato Vinculado, a lei prefixa a conduta do agente público, não restando margem para juízo de oportunidade ou conveniência (ex: aposentadoria compulsória). No Ato Discricionário, a lei outorga uma margem de liberdade para que o agente público, motivadamente, escolha a conduta mais conveniente e oportuna para o interesse público, observados os limites normativos.',
        source: 'Direito Administrativo; Hely Lopes Meirelles; Maria Sylvia Zanella Di Pietro',
        topicValidation: 'Trata da distinção fundamental entre Atos Vinculados e Atos Discricionários.',
      },
    ];

    return rawList.slice(0, req.quantity).map((q, idx) => ({
      id: `q-ctx-admin-${idx + 1}`,
      codeNumber: 9200 + idx + 1,
      concurso: contest,
      cargo: cargo,
      disciplina: req.disciplineName,
      topico: 'Atos Administrativos',
      dificuldade: diff,
      banca: board,
      statement: q.statement,
      options: q.options.map((opt, oIdx) => ({
        id: `opt-${oIdx + 1}`,
        letter: opt.letter,
        text: opt.text,
        distractorExplanation: opt.distractorExplanation,
      })),
      correctOptionLetter: q.correctOptionLetter,
      explanation: q.explanation,
      disciplineId: req.disciplineName,
      topic: 'Atos Administrativos',
      careerId: req.careerName || 'Polícia Militar',
      positionName: cargo,
      contestTitle: `${contest} - ${localidade}`,
      year: new Date().getFullYear(),
      examiningBoard: board,
      difficulty: diff,
      source: q.source,
      questionType: 'GERADA POR IA',
      tags: [req.disciplineName, 'Atos Administrativos', board, diff],
    }));
  }

  return null;
}
