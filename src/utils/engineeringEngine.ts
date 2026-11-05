import {
  BudgetProposal,
  BudgetServiceItem,
  PathologyDiagnosisItem,
  TeamMemberAllocation,
  WeeklyScheduleItem,
  WarrantyClauseItem,
} from '../types';

export const RENOVAR_COMPANY_CNPJ = '57.293.244/0001-27';

export interface GenerateBudgetParams {
  condoName: string;
  location: string;
  towers: number;
  floors: number;
  estimatedArea: number;
  pathologies: string[];
  urgency: string;
  notes?: string;
  protocolOverride?: string;
  aiVariableObservation?: string;
}

/**
 * Base catalog of formal Civil Engineering Pathology Diagnostics (Padrão Oficial Renovar SC).
 * Injects building variables (Contratante/Cliente, Local, Torres, Pavimentos, Área) into each diagnosis.
 */
function buildPathologyDiagnostics(
  pathologies: string[],
  condoName: string,
  location: string,
  towers: number,
  floors: number,
  areaNum: number
): PathologyDiagnosisItem[] {
  return pathologies.map((pat, index) => {
    const code = `DIAG-${String(index + 1).padStart(2, '0')}`;
    const lower = pat.toLowerCase();

    if (lower.includes('desplacamento') || lower.includes('som cavo') || lower.includes('cerâmic') || lower.includes('pastilha')) {
      return {
        code,
        pathology: pat,
        severityLabel: 'Grau Crítico • Risco de Queda por Gravidade (ABNT NBR 13755)',
        technicalOrigin: `Perda de aderência mecânica e química na interface tardoz/argamassa colante e/ou emboço nos panos das ${towers} torre(s) (${floors} pavimentos) do ${condoName}, desencadeada por tensões tangenciais de dilatação higrotérmica, fadiga de juntas de movimentação e ação de ciclos térmicos em ${location}.`,
        riskImpact: `Risco iminente de desprendimento gravitacional de placas/revestimentos em altura sobre áreas comuns, acessos de pedestres, garagens e entorno perimetral do Contratante / Cliente, além de penetração de água pluvial pela face posterior do revestimento.`,
        normativeTherapy: `Mapeamento percussivo em 100% da área (${areaNum.toLocaleString('pt-BR')} m²), demolição seletiva controlada das áreas com som cavo, apicoamento e regularização com argamassa polimérica modificada e recomposição com argamassa colante industrializada flexível AC-III (ABNT NBR 14081) em dupla colagem e rejuntamento impermeável.`,
      };
    }

    if (lower.includes('fissura') || lower.includes('trinca') || lower.includes('cisalhamento')) {
      return {
        code,
        pathology: pat,
        severityLabel: 'Grau Alto • Comprometimento de Estanqueidade (ABNT NBR 15575)',
        technicalOrigin: `Movimentações diferenciais entre estrutura de concreto armado e alvenaria de vedação ao longo dos ${floors} pavimentos do ${condoName}, somadas à retração hidráulica da argamassa de revestimento e tensões de cisalhamento nos vértices de vãos de janelas e vigas de borda.`,
        riskImpact: `Percolação direta de água de chuva dirigida pelo vento para o interior das unidades autônomas, lixiviação da matriz cimentícia e aceleração da frente de carbonatação sobre as armaduras estruturais.`,
        normativeTherapy: `Abertura mecânica de sulco em perfil "V" com disco diamantado, limpeza pneumática isenta de óleo, aplicação de primer promotor de aderência, inserção de delimitador de profundidade (Tarucel) nos trechos profundos, calafetação com selante elastomérico Híbrido MS / Poliuretano e estruturação superficial com véu de poliéster e mástique acrílico.`,
      };
    }

    if (lower.includes('armadura') || lower.includes('corrosão') || lower.includes('ferragem') || lower.includes('concreto')) {
      return {
        code,
        pathology: pat,
        severityLabel: 'Grau Crítico • Patologia Estrutural Ativa (ABNT NBR 6118)',
        technicalOrigin: `Despassivação eletroquímica do aço estrutural por avanço da frente de carbonatação (redução do pH < 9) e difusão de íons cloreto provenientes da atmosfera de ${location}, gerando óxidos expansivos que aumentam o volume da barra em até 600% e expulsam o cobrimento de concreto (spalling).`,
        riskImpact: `Redução progressiva da seção transversal útil das armaduras de pilares, vigas e bordas de lajes nas ${towers} torre(s) do ${condoName}, com risco de queda de lascas de concreto e perda de capacidade resistente local.`,
        normativeTherapy: `Delimitação com corte ortogonal, escarificação mecânica até 2,0 cm além da barra corroída (expondo concreto são e alcalino), decapagem mecânica por escovamento até grau St-3 (ISO 8501-1), passivação catódica com primer epóxi rico em zinco, ponte de aderência estrutural e recomposição geométrica com argamassa polimérica tixotrópica estrutural classe R4 (EN 1504-3).`,
      };
    }

    if (lower.includes('eflorescência') || lower.includes('lixiviação') || lower.includes('carbonato')) {
      return {
        code,
        pathology: pat,
        severityLabel: 'Grau Médio/Alto • Degradação Físico-Química (ABNT NBR 9574)',
        technicalOrigin: `Migração de água livre através da rede capilar do revestimento e rejuntes do ${condoName}, dissolvendo sais livres e hidróxido de cálcio — Ca(OH)₂ — da pasta de cimento hidratada que, ao evaporar na superfície externa da fachada em ${location}, reage com o CO₂ atmosférico formando depósitos cristalinos insolúveis de carbonato de cálcio (CaCO₃).`,
        riskImpact: `Aumento progressivo da porosidade interna do emboço por dissolução de ligantes, manchamento estético severo da fachada e desagregação pulverulenta da película de acabamento.`,
        normativeTherapy: `Hidrojateamento pressurizado controlado a 300 bar combinado com tratamento químico neutralizante biodegradável, eliminação integral dos pontos de infiltração que alimentam o fluxo hidráulico, selamento alcalino-resistente e bloqueio hidrofugante/elastomérico.`,
      };
    }

    if (lower.includes('junta') || lower.includes('dilatação') || lower.includes('dessolidarização')) {
      return {
        code,
        pathology: pat,
        severityLabel: 'Grau Alto • Falha de Absorção Tensional (ABNT NBR 13755)',
        technicalOrigin: `Envelhecimento fotoquímico, ressecamento, perda de resiliência elástica e falha coesiva/adesiva do mastique antigo nas juntas de movimentação horizontal e vertical das ${towers} torre(s) (${floors} pavimentos) por exposição prolongada à radiação ultravioleta (UV) e amplitude térmica.`,
        riskImpact: `Transferência direta de tensões de compressão para os panos de revestimento adjacentes (provocando estufamento e desplacamento em cadeia) e infiltração franca de águas pluviais pelas frestas abertas.`,
        normativeTherapy: `Remoção integral do selante degradado, regularização e limpeza química dos lábios da junta com solvente isopropílico, instalação de corpo de apoio em polietileno expandido de células fechadas (Tarucel) respeitando fator de forma 2:1 e aplicação contínua de selante elastomérico de Polímero Híbrido MS com resistência UV certificada.`,
      };
    }

    if (lower.includes('infiltração') || lower.includes('marquise') || lower.includes('sacada') || lower.includes('pingadeira')) {
      return {
        code,
        pathology: pat,
        severityLabel: 'Grau Alto • Percolação Hidráulica e Umidade (ABNT NBR 9574)',
        technicalOrigin: `Falha nos sistemas de impermeabilização de topo, ausência ou subdimensionamento de pingadeiras/rufos com lacrimejador e fissuração nos encontros de peitoris, sacadas e marquises do ${condoName} (${location}).`,
        riskImpact: `Saturação hídrica de lajes em balanço e platibandas, corrosão acelerada da armadura negativa de marquises e formação de bolhas e descolamento de pintura no intradorso e fachadas.`,
        normativeTherapy: `Regularização de caimentos, tratamento de ralos e meias-canas, reforço com tela de poliéster nos pontos singulares, estanqueidade de encontros de esquadrias com selante PU e aplicação de sistema impermeabilizante flexível compatível com a movimentação estrutural.`,
      };
    }

    // Default / Fuligem, mofo e fungos por maresia or custom pathology
    return {
      code,
      pathology: pat,
      severityLabel: 'Grau Médio • Biodeterioração e Agressividade Marinha (ABNT NBR 5674)',
      technicalOrigin: `Deposição contínua de aerossóis marinhos (névoa salina), material particulado atmosférico e retenção de umidade superficial nas fachadas do ${condoName} (${location}), favorecendo a proliferação de biofilmes (fungos, algas e bolores) e microfissuração da película antiga.`,
      riskImpact: `Degradação estética acentuada, retenção de umidade ácida sobre o substrato, perda de hidrofugação da envoltória predial (${areaNum.toLocaleString('pt-BR')} m²) e redução da vida útil de projeto (VUP).`,
      normativeTherapy: `Lavagem técnica por hidrojateamento a 300 bar com solução fungicida/algicida sanitizante, aplicação de fundo preparador aglutinante de partículas e acabamento com sistema de pintura elastomérica impermeabilizante com aditivação biocida e barreira anti-cloretos.`,
    };
  });
}

/**
 * Generates the official Renovar SC Fixed-Structure Engineering Memorial & Budget Proposal.
 * The structure is 100% standardized and rigorous; only the building variables are injected.
 */
export function generateLocalEngineeringBudget(params: GenerateBudgetParams): BudgetProposal {
  const condoName = params.condoName.trim() || 'Condomínio Edifício Residencial / Corporativo';
  const location = params.location.trim() || 'Balneário Camboriú, SC';
  const areaNum = Math.max(200, Number(params.estimatedArea) || 2500);
  const towersNum = Math.max(1, Number(params.towers) || 1);
  const floorsNum = Math.max(1, Number(params.floors) || 12);
  const pathologies =
    params.pathologies && params.pathologies.length > 0
      ? params.pathologies
      : ['Desplacamento cerâmico / som cavo', 'Fissuras e trincas de cisalhamento'];
  const urgency = params.urgency || 'Alta / Risco de Queda';
  const fieldNotes =
    params.notes?.trim() ||
    'Inspeção visual e ensaio preliminar à percussão realizados em campo pela equipe técnica da Renovar SC.';

  const protocol =
    params.protocolOverride ||
    `RSC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  // Check which pathology families are present to calibrate quantities accurately
  const hasCeramics = pathologies.some((p) => /desplacamento|cavo|cerâmic|pastilha/i.test(p));
  const hasCracks = pathologies.some((p) => /fissura|trinca|cisalhamento/i.test(p));
  const hasRebar = pathologies.some((p) => /armadura|corrosão|ferragem/i.test(p));
  const hasJoints = pathologies.some((p) => /junta|dilatação/i.test(p));
  const hasEfflorescenceOrInfiltration = pathologies.some((p) => /eflorescência|lixiviação|infiltração|marquise/i.test(p));

  const urgencyFactor = urgency === 'Alta / Risco de Queda' ? 1.12 : urgency === 'Média' ? 1.05 : 1.0;

  // Build analytical budget items following the exact 7-stage engineering methodology with Quantitativos & Insumos
  const services: BudgetServiceItem[] = [
    {
      code: '01.01',
      description: `Mobilização técnica, emissão de ART/CREA-SC, engenharia de ancoragem testada e instalação de balancins elétricos/suspensos e proteções coletivas (${towersNum} torre(s) / ${floorsNum} pavimentos)`,
      methodology:
        'Montagem de plataformas suspensas com duplo cabo de aço independente, trava-quedas retráteis, linhas de vida certificadas, telas fachadeiras e bandejas de contenção conforme NR-18 e NR-35.',
      inputsAndMaterials:
        'Balancins suspensos elétricos/leves homologados, cabos de aço galvanizados Ø 8mm, olhais e chumbadores químicos inox AISI 316, telas fachadeiras de polietileno de alta densidade, trava-quedas duplos, cintos paraquedistas NR-35 e taxa de ART/CREA-SC.',
      unit: 'vb',
      quantity: towersNum,
      unitPrice: Math.round(7800 * urgencyFactor),
      total: towersNum * Math.round(7800 * urgencyFactor),
    },
    {
      code: '02.01',
      description: `Hidrojateamento técnico controlado a 300 bar e descontaminação superficial integral da envoltória predial (${condoName})`,
      methodology:
        'Lavagem pressurizada em leque para remoção de cloretos marinhos, fuligem, biofilmes (fungos/algas), eflorescências e partículas friáveis, preparando o substrato para ancoragem química.',
      inputsAndMaterials:
        'Lavadoras industriais de alta pressão (300 bar / 4.350 psi) com bico rotativo e leque calibrado, solução sanitizante fungicida/algicida biodegradável e neutralizador químico alcalino para sais solúveis.',
      unit: 'm²',
      quantity: areaNum,
      unitPrice: 11.5,
      total: Math.round(areaNum * 11.5),
    },
    {
      code: '03.01',
      description: `Ensaio percussivo sistemático em 100% dos panos de fachada (mapeamento de som cavo) e recomposição localizada de revestimento/emboço`,
      methodology: hasCeramics
        ? 'Sondagem auditiva milimétrica com martelo de percussão conforme ABNT NBR 13755, demolição seletiva das placas com som oco, apicoamento, regularização polimérica e assentamento com argamassa AC-III.'
        : 'Inspeção percussiva integral da fachada, escarificação de trechos de reboco/emboço pulverulento ou desagregado e recomposição com argamassa polimérica tixotrópica.',
      inputsAndMaterials: hasCeramics
        ? 'Argamassa colante industrializada flexível AC-III E (ABNT NBR 14081), argamassa polimérica de regularização, ponte de aderência acrílica, pastilhas/placas cerâmicas de reposição e rejunte acrílico impermeável anti-fungo.'
        : 'Argamassa polimérica industrializada fibrorreforçada de baixa retração, aditivo promotor de aderência estireno-acrílico e tela de fibra de vidro álcali-resistente nas interfaces.',
      unit: 'm²',
      quantity: areaNum,
      unitPrice: hasCeramics ? 14.0 : 8.5,
      total: Math.round(areaNum * (hasCeramics ? 14.0 : 8.5)),
    },
    {
      code: '04.01',
      description: `Recuperação estrutural localizada e passivação de armaduras com escovamento St-3, primer rico em zinco e graute tixotrópico classe R4`,
      methodology:
        'Corte ortogonal perimetral, escarificação até 2 cm além da corrosão, decapagem mecânica do aço, proteção catódica galvânica e recomposição volumétrica conforme ABNT NBR 6118.',
      inputsAndMaterials:
        'Discos diamantados de corte seco, escovas rotativas de aço carbono, primer anticorrosivo epóxi rico em zinco (passivador catódico), ponte de aderência epoxídica e argamassa estrutural tixotrópica classe R4 (> 45 MPa).',
      unit: 'un',
      quantity: hasRebar ? Math.max(16, Math.round(floorsNum * towersNum * 2.2)) : Math.max(6, Math.round(floorsNum * towersNum * 0.8)),
      unitPrice: 295.0,
      total: (hasRebar ? Math.max(16, Math.round(floorsNum * towersNum * 2.2)) : Math.max(6, Math.round(floorsNum * towersNum * 0.8))) * 295,
    },
    {
      code: '05.01',
      description: `Tratamento técnico de fissuras, trincas de cisalhamento e renovação de juntas de dilatação/movimentação com Polímero Híbrido MS / PU`,
      methodology:
        'Abertura em perfil "V", limpeza pneumática, imprimação de bordas, inserção de delimitador Tarucel (fator de forma 2:1), calafetação elastomérica UV-resistente e reforço com tela de poliéster.',
      inputsAndMaterials:
        'Selante elastomérico monocomponente à base de Polímero Híbrido MS / Poliuretano (ISO 11600 F-25LM), cordão delimitador de polietileno expandido (Tarucel), primer silano promotor de adesão e tela estruturante de poliéster.',
      unit: 'm',
      quantity: Math.round(areaNum * (hasCracks || hasJoints ? 0.18 : 0.08)),
      unitPrice: 52.0,
      total: Math.round(Math.round(areaNum * (hasCracks || hasJoints ? 0.18 : 0.08)) * 52.0),
    },
    {
      code: '06.01',
      description: `Sistema de impermeabilização, selamento acrílico alcalino-resistente e pintura elastomérica premium (03 demãos cruzadas) + hidrofugação`,
      methodology: hasEfflorescenceOrInfiltration
        ? 'Neutralização de alcalinidade, 01 demão de selador acoplador, reforço impermeabilizante em peitoris/marquises (ABNT NBR 9574) e 03 demãos de membrana elastomérica anti-fissura.'
        : 'Aplicação de 01 demão farta de selador acrílico de penetração seguida de 03 demãos cruzadas de revestimento elastomérico puro com proteção UV e barreira contra maresia.',
      inputsAndMaterials:
        'Fundo preparador aglutinante de partículas, selador acrílico pigmentado alcalino-resistente, revestimento acrílico elastomérico puro de alto desempenho (03 demãos) e hidrofugante silano-siloxano.',
      unit: 'm²',
      quantity: areaNum,
      unitPrice: hasEfflorescenceOrInfiltration ? 28.5 : 24.5,
      total: Math.round(areaNum * (hasEfflorescenceOrInfiltration ? 28.5 : 24.5)),
    },
    {
      code: '07.01',
      description: `Desmobilização operacional, limpeza fina pós-obra de vidros/esquadrias, destinação licenciada de resíduos e entrega técnica homologada`,
      methodology:
        'Desmontagem segura de balancins e ancoragens, limpeza detalhada das áreas afetadas, remoção de entulhos e vistoria conjunta com o Contratante / Cliente para emissão do Termo de Garantia.',
      inputsAndMaterials:
        'Caçambas estacionárias licenciadas com Manifesto de Transporte de Resíduos (MTR), insumos de limpeza fina para vidros e alumínio anodizado, e dossiê As-Built com Certificado de Garantia de 05 Anos.',
      unit: 'vb',
      quantity: 1,
      unitPrice: Math.round(3200 + towersNum * 1200),
      total: Math.round(3200 + towersNum * 1200),
    },
  ];

  const subtotal = services.reduce((acc, item) => acc + item.total, 0);
  const bdiPercent = 22;
  const totalPrice = Math.round(subtotal * (1 + bdiPercent / 100));

  const scopeDeclaration = `O presente MEMORIAL DESCRITIVO TÉCNICO E PROPOSTA ORÇAMENTÁRIA FORMAL, elaborado pelo Departamento de Engenharia Diagnóstica da RENOVAR SC — SOLUÇÕES PREDIAIS LTDA (CNPJ: ${RENOVAR_COMPANY_CNPJ}), estabelece de forma rigorosa as especificações executivas, diretrizes de segurança em altura, controle tecnológico de insumos, dimensionamento de equipe, cronograma físico-financeiro e condições comerciais para a execução integral dos serviços de Recuperação Estrutural, Tratamento de Patologias, Estanqueidade e Revitalização de Fachadas do empreendimento ${condoName}, localizado em ${location}. O escopo técnico abrange a totalidade da envoltória configurada por ${towersNum} torre(s) / bloco(s) e ${floorsNum} pavimentos, perfazendo área estimada de intervenção de ${areaNum.toLocaleString('pt-BR')} m², apresentado ao Contratante / Cliente para avaliação técnica, aprovação financeira e formalização contratual.`;

  const executiveSummary = `Em vistoria técnica preliminar realizada no empreendimento ${condoName} (${location}), edificação constituída por ${towersNum} torre(s) e ${floorsNum} pavimentos (área estimada de fachada de ${areaNum.toLocaleString('pt-BR')} m²), constatou-se a presença ativa das seguintes manifestações patológicas prioritárias: ${pathologies.join('; ')}. Classificado sob grau de prioridade "${urgency}", o quadro patológico diagnosticado exige intervenção corretiva sistematizada segundo os preceitos das normas ABNT NBR 13755, NBR 6118, NBR 9574 e NBR 15575, com isolamento imediato das áreas de projeção térrea, instalação de balancins suspensos certificados (NR-18 / NR-35) e emprego de sistemas poliméricos e elastoméricos de alto desempenho compatíveis com a agressividade ambiental catarinense.${params.aiVariableObservation ? ` Parecer Complementar de Vistoria: ${params.aiVariableObservation}` : ` Observações registradas em campo: ${fieldNotes}`}`;

  const pathologyDiagnostics = buildPathologyDiagnostics(
    pathologies,
    condoName,
    location,
    towersNum,
    floorsNum,
    areaNum
  );

  // Team Allocation Table dynamically scaled to building size
  const fachadeirosCount = Math.max(2, Math.min(12, towersNum * 2 + Math.floor(areaNum / 2200)));
  const restauradoresCount = Math.max(2, Math.min(8, towersNum + Math.floor(areaNum / 2500)));
  const auxiliaresCount = Math.max(1, Math.min(6, towersNum + Math.floor(areaNum / 3500)));

  const teamAllocation: TeamMemberAllocation[] = [
    {
      role: 'Engenheiro Civil Responsável Técnico',
      quantity: 1,
      qualification: 'Registro CREA-SC Ativo • Especialista em Patologia das Construções',
      assignment: `Emissão de ART, supervisão normativa ABNT, validação de ensaios de tração/percussão e aprovação das medições junto ao Contratante / Cliente (${condoName}).`,
    },
    {
      role: 'Técnico em Segurança do Trabalho (TST)',
      quantity: 1,
      qualification: 'Registro MTE • Instrutor Habilitado NR-35 e NR-18',
      assignment: 'Inspeção de pontos de ancoragem, linhas de vida, liberação de Permissão de Trabalho em Altura (PTA), DDS diário e auditoria de EPIs/EPCs.',
    },
    {
      role: 'Encarregado Geral de Canteiro / Mestre de Fachada',
      quantity: 1,
      qualification: 'Certificação NR-35 / NR-18 • +10 anos em Restauração Predial',
      assignment: `Coordenação direta das frentes de serviço nas ${towersNum} torre(s), controle de traço/consumo de insumos poliméricos e registro de diário de obra.`,
    },
    {
      role: 'Líderes Fachadeiros / Operadores de Balancim e Acesso por Corda',
      quantity: fachadeirosCount,
      qualification: 'Certificação NR-35 / NR-18 Vigente + ASO Apto para Altura',
      assignment: `Execução de hidrojateamento 300 bar, mapeamento percussivo malha a malha, abertura/selagem de fissuras em "V" e aplicação de sistema elastomérico.`,
    },
    {
      role: 'Pedreiros Restauradores / Especialistas em Recuperação Estrutural',
      quantity: restauradoresCount,
      qualification: 'Certificação NR-35 / NR-18 + Qualificação em Sistemas R4 e AC-III',
      assignment: 'Escarificação ortogonal, tratamento anticorrosivo de armaduras (St-3 + zinco), grauteamento tixotrópico e recomposição de revestimentos cerâmicos/argamassados.',
    },
    {
      role: 'Auxiliares Técnicos de Apoio Terrestre e Logística',
      quantity: auxiliaresCount,
      qualification: 'Treinamento NR-18 • Controle de Perímetro e Preparação',
      assignment: 'Isolamento de segurança no térreo, preparo mecanizado de argamassas/tintas, movimentação de insumos e organização/limpeza diária do canteiro.',
    },
  ];

  const timelineWeeks = Math.max(8, Math.min(24, Math.round(areaNum / 380) + towersNum * 2));

  // Weekly Physical-Financial Schedule dynamically scaled to timelineWeeks and totalPrice
  const w1End = Math.max(1, Math.round(timelineWeeks * 0.15));
  const w2End = Math.max(w1End + 1, Math.round(timelineWeeks * 0.30));
  const w3End = Math.max(w2End + 1, Math.round(timelineWeeks * 0.50));
  const w4End = Math.max(w3End + 1, Math.round(timelineWeeks * 0.70));
  const w5End = Math.max(w4End + 1, Math.round(timelineWeeks * 0.90));

  const weeklySchedule: WeeklyScheduleItem[] = [
    {
      phase: 'Fase 01',
      weeksLabel: `Semana 01 a ${String(w1End).padStart(2, '0')}`,
      stageTitle: 'Mobilização Técnica, ART/CREA-SC, Ancoragens e Montagem de Balancins',
      physicalWeightPercent: 12,
      financialAmount: Math.round(totalPrice * 0.12),
      deliverable: 'Canteiro isolado, laudo de ancoragem e plataformas NR-18 operacionais',
    },
    {
      phase: 'Fase 02',
      weeksLabel: `Semana ${String(w1End).padStart(2, '0')} a ${String(w2End).padStart(2, '0')}`,
      stageTitle: 'Hidrojateamento Controlado (300 bar) e Mapeamento Percussivo 100%',
      physicalWeightPercent: 16,
      financialAmount: Math.round(totalPrice * 0.16),
      deliverable: 'Substrato descontaminado e mapa topográfico de som cavo/patologias',
    },
    {
      phase: 'Fase 03',
      weeksLabel: `Semana ${String(w2End).padStart(2, '0')} a ${String(w3End).padStart(2, '0')}`,
      stageTitle: 'Recuperação Estrutural (Armaduras St-3 + Graute R4) e Recomposição de Base',
      physicalWeightPercent: 24,
      financialAmount: Math.round(totalPrice * 0.24),
      deliverable: 'Passivação concluída, cobrimento estrutural recomposto e panos regularizados',
    },
    {
      phase: 'Fase 04',
      weeksLabel: `Semana ${String(w3End).padStart(2, '0')} a ${String(w4End).padStart(2, '0')}`,
      stageTitle: 'Tratamento de Fissuras em "V", Tela de Poliéster e Juntas de Dilatação (MS/PU)',
      physicalWeightPercent: 18,
      financialAmount: Math.round(totalPrice * 0.18),
      deliverable: 'Estanqueidade de trincas e juntas de movimentação homologada',
    },
    {
      phase: 'Fase 05',
      weeksLabel: `Semana ${String(w4End).padStart(2, '0')} a ${String(w5End).padStart(2, '0')}`,
      stageTitle: 'Selamento Alcalino e Aplicação de Pintura Elastomérica (03 Demãos Cruzadas)',
      physicalWeightPercent: 22,
      financialAmount: Math.round(totalPrice * 0.22),
      deliverable: 'Envoltória impermeabilizada com película monolítica de alto desempenho',
    },
    {
      phase: 'Fase 06',
      weeksLabel: `Semana ${String(w5End).padStart(2, '0')} a ${String(timelineWeeks).padStart(2, '0')}`,
      stageTitle: 'Desmobilização, Limpeza Fina Pós-Obra, Vistoria Final e Termo de Garantia 05 Anos',
      physicalWeightPercent: 8,
      financialAmount: totalPrice - Math.round(totalPrice * 0.92),
      deliverable: 'Entrega definitiva aprovada pelo Contratante / Cliente + Certificado 05 Anos',
    },
  ];

  const methodologyHighlights = [
    {
      step: 1,
      phaseCode: 'FASE 01 • NR-18 / NR-35',
      title: 'Mobilização Técnica, Engenharia de Segurança, Ancoragens e Balancins',
      detail: `Emissão de ART de execução junto ao CREA-SC, instalação e teste estático de dispositivos de ancoragem nas ${towersNum} torre(s) do ${condoName}, montagem de balancins suspensos com duplo cabo de aço, trava-quedas independentes, telas fachadeiras e bandejas coletoras de proteção para resguardo integral de pedestres, veículos e áreas comuns do Contratante / Cliente.`,
      technicalStandard: 'NR-35 / NR-18 / ABNT NBR 16325',
    },
    {
      step: 2,
      phaseCode: 'FASE 02 • PREPARAÇÃO DE BASE',
      title: 'Hidrojateamento Técnico Controlado (300 bar) e Descontaminação Salina',
      detail: `Lavagem mecânica de alta pressão regulada a 300 bar em toda a área de ${areaNum.toLocaleString('pt-BR')} m² (${floorsNum} pavimentos) para remoção profunda de cloretos marinhos, fuligem atmosférica, carbonatos livres, fungos e partículas friáveis, promovendo a abertura controlada de porosidade do substrato sem agressão às partes sãs.`,
      technicalStandard: 'ABNT NBR 13245 / NBR 5674',
    },
    {
      step: 3,
      phaseCode: 'FASE 03 • SONDAGEM E RECOMPOSIÇÃO',
      title: 'Mapeamento Percussivo 100% (Som Cavo) e Recomposição de Revestimentos',
      detail: `Inspeção táctil-auditiva malha a malha com martelo de percussão em 100% dos panos de fachada do ${condoName}. Demarcação topográfica, demolição seletiva das regiões com perda de aderência, preparo da base com ponte de aderência acrílica/epoxídica e recomposição com argamassa polimérica e/ou argamassa colante flexível AC-III em dupla colagem.`,
      technicalStandard: 'ABNT NBR 13755 / NBR 14081 / NBR 7200',
    },
    {
      step: 4,
      phaseCode: 'FASE 04 • RECUPERAÇÃO ESTRUTURAL',
      title: 'Tratamento de Concreto Armado e Passivação Galvânica de Armaduras',
      detail: `Delaminação ortogonal com disco diamantado, escarificação mecânica até 2,0 cm além da frente oxidada, limpeza da barra de aço até padrão visual St-3, aplicação de primer anticorrosivo rico em zinco (proteção catódica) e recomposição volumétrica do cobrimento com graute tixotrópico polimérico classe R4 de retração compensada.`,
      technicalStandard: 'ABNT NBR 6118 / ISO 8501-1 / EN 1504-3',
    },
    {
      step: 5,
      phaseCode: 'FASE 05 • ESTANQUEIDADE E JUNTAS',
      title: 'Tratamento de Fissuras de Cisalhamento e Juntas de Dilatação (Polímero MS)',
      detail: `Abertura de sulco em "V" ao longo das trincas mapeadas, limpeza pneumática, imprimação de bordas, inserção de corpo de apoio em polietileno expandido (Tarucel) e vedação elástica com selante Híbrido MS / Poliuretano de baixo módulo, acrescido de tela de poliéster nos encontros alvenaria-estrutura.`,
      technicalStandard: 'ABNT NBR 15575 / ISO 11600 Classe F-25LM',
    },
    {
      step: 6,
      phaseCode: 'FASE 06 • PROTEÇÃO E ACABAMENTO',
      title: 'Sistema de Impermeabilização e Pintura Elastomérica Premium (03 Demãos)',
      detail: `Aplicação de 01 demão farta de selador acrílico alcalino-resistente para uniformização de absorção, seguida de 03 (três) demãos cruzadas de Revestimento Elastomérico Puro de alta formação de filme nos ${areaNum.toLocaleString('pt-BR')} m² do ${condoName}, formando membrana monolítica impermeável à água de chuva e permeável ao vapor.`,
      technicalStandard: 'ABNT NBR 9574 / NBR 15079 / NBR 13245',
    },
    {
      step: 7,
      phaseCode: 'FASE 07 • ENTREGA HOMOLOGADA',
      title: 'Desmobilização, Limpeza Fina Pós-Obra e Termo de Recebimento Definitivo',
      detail: `Desmontagem técnica dos balancins, limpeza detalhada de vidros, esquadrias de alumínio, peitoris e pisos térreos, remoção integral de resíduos em caçambas licenciadas e realização de Vistoria Conjunta Final com o Contratante / Cliente em ${location} para emissão do Certificado de Garantia Contratual de 05 Anos.`,
      technicalStandard: 'ABNT NBR 5674 / Código Civil Art. 618',
    },
  ];

  const materialSpecifications = [
    'Argamassas de Reparo Estrutural: Graute polimérico tixotrópico bicomponente/monocomponente classe R4, resistência à compressão > 45 MPa (Sika MonoTop / Quartzolit / Viapol ou equivalente técnico homologado).',
    'Passivador de Armaduras: Primer epóxi rico em zinco / inibidor eletroquímico de corrosão para ambientes de agressividade marinha classe III/IV.',
    'Selantes de Juntas e Fissuras: Mastique elastomérico à base de Polímero Híbrido MS (Silano Modificado) ou Poliuretano (PU) monocomponente de baixo módulo, fator de acomodação ≥ 25%, resistente à radiação UV sem amarelamento.',
    'Argamassa Colante e Rejuntamento: Argamassa colante flexível industrializada tipo AC-III E (ABNT NBR 14081) e rejunte acrílico/epóxi impermeável anti-fungo.',
    'Sistema de Pintura e Impermeabilização: Fundo preparador/selador acrílico premium + Revestimento Acrílico Elastomérico Flexível (alongamento > 200%, 03 demãos cruzadas respeitando consumo mínimo por m² do fabricante).',
  ];

  const warrantyClauses: WarrantyClauseItem[] = [
    {
      category: '1. Recuperação Estrutural e Passivação de Armaduras',
      period: '05 (cinco) anos — Garantia Legal e Contratual',
      coverageDescription: `Cobertura integral contra desplacamento do graute tixotrópico e reincidência de corrosão nos pontos efetivamente tratados e mapeados nas ${towersNum} torre(s) do ${condoName}.`,
      normReference: 'Art. 618 do Código Civil / ABNT NBR 6118',
    },
    {
      category: '2. Estanqueidade de Fachada, Fissuras Tratadas e Juntas de Dilatação',
      period: '05 (cinco) anos — Desempenho de Estanqueidade',
      coverageDescription: `Garantia contra infiltração de água pluvial nos trechos de trincas calafetadas e juntas de movimentação seladas com polímero MS/PU ao longo dos ${floorsNum} pavimentos.`,
      normReference: 'ABNT NBR 15575-4 / ABNT NBR 9574',
    },
    {
      category: '3. Aderência de Revestimentos Argamassados e Cerâmicos Recompostos',
      period: '05 (cinco) anos — Resistência de Aderência à Tração',
      coverageDescription: `Garantia de ancoragem mecânica e química das áreas de emboço e placas cerâmicas recompostas com argamassa AC-III após o mapeamento percussivo.`,
      normReference: 'ABNT NBR 13755 / ABNT NBR 13528',
    },
    {
      category: '4. Integridade da Membrana Elastomérica de Pintura (Descascamento / Bolhas)',
      period: '05 (cinco) anos — Coesão de Filme (Observada NBR 5674)',
      coverageDescription: `Garantia contra descascamento, saponificação, esfarelamento precoce e formação de bolhas na área de ${areaNum.toLocaleString('pt-BR')} m², condicionada à realização das lavagens periódicas de manutenção predial pelo Contratante / Cliente.`,
      normReference: 'ABNT NBR 15079 / ABNT NBR 5674',
    },
  ];

  const contractualTerms = [
    `Responsabilidade Técnica e Trabalhista: A RENOVAR SC (CNPJ ${RENOVAR_COMPANY_CNPJ}) assume integral responsabilidade técnica (com emissão de ART junto ao CREA-SC antes do início da montagem dos balancins) e responsabilidade trabalhista, previdenciária e securitária sobre 100% de sua equipe própria alocada no ${condoName}.`,
    `Segurança em Altura (NR-35 / NR-18): Todos os operadores possuem certificação NR-35 e NR-18 vigentes, ASO específico para trabalho em altura, seguro de vida em grupo e utilização obrigatória de cinto paraquedista com duplo talabarte e trava-quedas em linha de vida independente.`,
    `Fornecimento de Equipamentos e Medições: Estão inclusos no preço global todos os equipamentos de acesso vertical (balancins, cabos, guinchos, cadeirinhas), EPIs, EPCs e ferramentas. Os pagamentos das parcelas estão estritamente vinculados às medições físicas aferidas e aprovadas pelo Contratante / Cliente.`,
  ];

  const commercialTermsList = [
    `Forma de Pagamento — Opção 01 (Parcelamento por Medição / Cronograma): Sinal/Entrada de 20% (${(totalPrice * 0.2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}) na assinatura contratual para mobilização técnica, emissão de ART/CREA-SC e aquisição de insumos químicos/elastoméricos + Saldo de 80% (${(totalPrice * 0.8).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}) parcelado em até 06 (seis) parcelas mensais ou medições quinzenais vinculadas ao avanço físico-financeiro atestado pelo Contratante / Cliente.`,
    `Forma de Pagamento — Opção 02 (À Vista com Desconto Corporativo): Pagamento integral na homologação contratual com 5% de desconto financeiro, perfazendo o valor líquido final de ${(totalPrice * 0.95).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}.`,
    `Faturamento Direto e Regularidade Fiscal: Todos os pagamentos serão efetuados mediante emissão de Nota Fiscal de Serviços Eletrônica (NFS-e) pela RENOVAR SC SOLUÇÕES PREDIAIS LTDA (CNPJ: ${RENOVAR_COMPANY_CNPJ}), acompanhada de Certidões Negativas de Débitos (CND Federal/INSS, Estadual, Municipal, FGTS e Trabalhista) e Boletim de Medição assinado.`,
    `Regime de Empreitada Global (Insumos, Equipamentos e Taxas Inclusos): O valor global proposto contempla 100% dos materiais industriais especificados, locação e montagem de balancins NR-18, encargos sociais e trabalhistas, seguro de responsabilidade civil de engenharia e taxa de ART/CREA-SC, sem custos adicionais ou aditivos imprevistos para o Contratante / Cliente.`,
    `Validade da Proposta Orçamentária: 30 (trinta) dias corridos a contar da data de emissão deste Memorial Descritivo Oficial.`,
  ];

  return {
    id: `prop-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    protocol,
    companyCnpj: RENOVAR_COMPANY_CNPJ,
    condoName,
    location,
    towers: towersNum,
    floors: floorsNum,
    estimatedArea: areaNum,
    pathologies,
    urgency,
    notes: fieldNotes,
    title: `MEMORIAL DESCRITIVO TÉCNICO E PROPOSTA COMERCIAL DE ENGENHARIA CIVIL — ${condoName.toUpperCase()}`,
    executiveSummary,
    scopeDeclaration,
    environmentalClassification: 'Classe de Agressividade Ambiental III / IV (Atmosfera Urbana e Marinha Costeira — ABNT NBR 6118)',
    pathologyDiagnostics,
    norms: [
      'ABNT NBR 13755:2017 — Revestimentos cerâmicos de fachadas e paredes externas com emprego de argamassa colante (Procedimento e Fiscalização)',
      'ABNT NBR 6118:2023 — Projeto e recuperação de estruturas de concreto armado (Durabilidade e Cobrimento)',
      'ABNT NBR 9574:2008 / NBR 9575 — Execução e projeto de sistemas de impermeabilização predial',
      'ABNT NBR 15575-4:2021 — Edificações habitacionais — Desempenho de sistemas de vedações verticais externas (Fachadas)',
      'ABNT NBR 5674:2012 — Manutenção de edificações — Requisitos para o sistema de gestão de manutenção',
      'NR-35 e NR-18 (Ministério do Trabalho) — Trabalho em Altura, Ancoragens Prediais e Segurança na Indústria da Construção',
    ],
    services,
    teamAllocation,
    weeklySchedule,
    methodologyHighlights,
    materialSpecifications,
    warrantyClauses,
    contractualTerms,
    commercialTermsList,
    timelineWeeks,
    warrantyYears: 5,
    paymentConditions:
      'Sinal de 20% na assinatura do contrato (mobilização técnica, ART/CREA-SC e aquisição de insumos) + saldo parcelado conforme medições físicas quinzenais/mensais atestadas pelo Contratante / Cliente (ou 5% de desconto à vista).',
    subtotal,
    bdiPercent,
    totalPrice,
    technicalResponsible: `Engenharia Diagnóstica & Gestão Operacional — Renovar SC (CNPJ ${RENOVAR_COMPANY_CNPJ} • CREA-SC)`,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Ensures any legacy or externally loaded BudgetProposal has 100% of the fixed official template sections populated.
 */
export function ensureOfficialTemplateStructure(proposal: BudgetProposal): BudgetProposal {
  if (
    proposal.companyCnpj === RENOVAR_COMPANY_CNPJ &&
    proposal.scopeDeclaration &&
    proposal.pathologyDiagnostics &&
    proposal.pathologyDiagnostics.length > 0 &&
    proposal.teamAllocation &&
    proposal.teamAllocation.length > 0 &&
    proposal.weeklySchedule &&
    proposal.weeklySchedule.length > 0 &&
    proposal.warrantyClauses &&
    proposal.warrantyClauses.length > 0 &&
    proposal.materialSpecifications &&
    proposal.contractualTerms &&
    proposal.commercialTermsList
  ) {
    return proposal;
  }

  const completeTemplate = generateLocalEngineeringBudget({
    condoName: proposal.condoName,
    location: proposal.location,
    towers: proposal.towers,
    floors: proposal.floors,
    estimatedArea: proposal.estimatedArea,
    pathologies: proposal.pathologies,
    urgency: proposal.urgency,
    notes: proposal.notes,
    protocolOverride: proposal.protocol,
  });

  const mergedServices = (proposal.services && proposal.services.length > 0
    ? proposal.services
    : completeTemplate.services
  ).map((srv, idx) => ({
    ...srv,
    inputsAndMaterials:
      srv.inputsAndMaterials ||
      completeTemplate.services[idx]?.inputsAndMaterials ||
      'Insumos industriais homologados ABNT, EPIs/EPCs NR-35 e equipamentos de acesso vertical.',
  }));

  return {
    ...completeTemplate,
    ...proposal,
    companyCnpj: RENOVAR_COMPANY_CNPJ,
    services: mergedServices,
    scopeDeclaration: proposal.scopeDeclaration || completeTemplate.scopeDeclaration,
    environmentalClassification:
      proposal.environmentalClassification || completeTemplate.environmentalClassification,
    pathologyDiagnostics:
      proposal.pathologyDiagnostics && proposal.pathologyDiagnostics.length > 0
        ? proposal.pathologyDiagnostics
        : completeTemplate.pathologyDiagnostics,
    teamAllocation:
      proposal.teamAllocation && proposal.teamAllocation.length > 0
        ? proposal.teamAllocation
        : completeTemplate.teamAllocation,
    weeklySchedule:
      proposal.weeklySchedule && proposal.weeklySchedule.length > 0
        ? proposal.weeklySchedule
        : completeTemplate.weeklySchedule,
    methodologyHighlights:
      proposal.methodologyHighlights && proposal.methodologyHighlights.length >= 6
        ? proposal.methodologyHighlights
        : completeTemplate.methodologyHighlights,
    materialSpecifications:
      proposal.materialSpecifications || completeTemplate.materialSpecifications,
    warrantyClauses: proposal.warrantyClauses || completeTemplate.warrantyClauses,
    contractualTerms: proposal.contractualTerms || completeTemplate.contractualTerms,
    commercialTermsList:
      proposal.commercialTermsList || completeTemplate.commercialTermsList,
  };
}
