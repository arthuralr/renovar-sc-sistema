import { BudgetProposal, BudgetServiceItem } from '../types';

export interface GenerateBudgetParams {
  condoName: string;
  location: string;
  towers: number;
  floors: number;
  estimatedArea: number;
  pathologies: string[];
  urgency: string;
  notes?: string;
}

/**
 * High-precision local engineering engine for Renovar SC.
 * Guarantees instantaneous, bulletproof technical proposal generation
 * even when offline, with low mobile signal, or on API latency.
 */
export function generateLocalEngineeringBudget(params: {
  condoName: string;
  location: string;
  towers: number;
  floors: number;
  estimatedArea: number;
  pathologies: string[];
  urgency: string;
  notes?: string;
}): BudgetProposal {
  const condoName = params.condoName.trim() || 'Condomínio Residencial / Comercial';
  const location = params.location.trim() || 'Balneário Camboriú, SC';
  const areaNum = Number(params.estimatedArea) || 2500;
  const towersNum = Number(params.towers) || 1;
  const floorsNum = Number(params.floors) || 12;
  const pathologies = params.pathologies.length > 0 
    ? params.pathologies 
    : ['Desplacamento cerâmico / som cavo', 'Fissuras e trincas de cisalhamento'];
  const urgency = params.urgency || 'Alta / Risco de Queda';

  const baseRatePerM2 = 44.5;
  const pathologyMultiplier = 1 + pathologies.length * 0.12;
  const urgencyMultiplier = urgency === 'Alta / Risco de Queda' ? 1.25 : urgency === 'Média' ? 1.1 : 1.0;
  const computedTotal = Math.round(areaNum * baseRatePerM2 * pathologyMultiplier * urgencyMultiplier);
  const subtotal = Math.round(computedTotal / 1.22);
  const bdiPercent = 22;

  const services: BudgetServiceItem[] = [
    {
      code: '01.01',
      description: 'Montagem, ancoragem e certificação de balancins suspensos elétricos com duplo cabo de aço, trava-quedas independentes e tela fachadeira de contenção',
      methodology: 'Instalação com emissão de ART específica, testes estáticos de carga e plano de ancoragem predial conforme NR-35 e NR-18.',
      unit: 'vb',
      quantity: 1,
      unitPrice: 8500,
      total: 8500,
    },
    {
      code: '02.01',
      description: 'Ensaio sistemático de percussão manual com martelo percursor para mapeamento 100% de pastilhas/reboco com som cavo e risco de queda',
      methodology: 'Sondagem auditiva detalhada e demarcação com giz indelével de todas as áreas com desplacamento ou delaminação de substrato.',
      unit: 'm²',
      quantity: areaNum,
      unitPrice: 5.5,
      total: Math.round(areaNum * 5.5),
    },
    {
      code: '03.01',
      description: 'Hidrojateamento técnico controlado com água pressurizada a 300 bar para desincrustação profunda de sujidades, fuligem e eflorescências salinas',
      methodology: 'Limpeza e desobstrução de porosidades sem agressão ao emboço são, assegurando ancoragem química de novas argamassas.',
      unit: 'm²',
      quantity: areaNum,
      unitPrice: 12.0,
      total: Math.round(areaNum * 12.0),
    },
    {
      code: '04.01',
      description: 'Abertura em "V", limpeza pneumática e calafetação elástica de trincas com mastique de poliuretano (PU) de alta performance e fundo de junta tipo tarucel',
      methodology: 'Tratamento de descontinuidades com primer epóxi e selamento com elastômero hidrofóbico de alta flexibilidade contra choques térmicos.',
      unit: 'm',
      quantity: Math.round(areaNum * 0.15),
      unitPrice: 48.0,
      total: Math.round(areaNum * 0.15 * 48),
    },
    {
      code: '05.01',
      description: 'Recuperação estrutural de armaduras oxidadas com escovamento mecânico ST-3, aplicação de inibidor galvânico e recomposição com graute tixotrópico polimérico',
      methodology: 'Escarificação de concreto carbonatado, passivação do aço com tinta rica em zinco e reconstituição de cobrimento conforme NBR 6118.',
      unit: 'un',
      quantity: Math.max(12, Math.round(floorsNum * 2.5)),
      unitPrice: 280.0,
      total: Math.max(12, Math.round(floorsNum * 2.5)) * 280,
    },
    {
      code: '06.01',
      description: 'Aplicação de sistema de pintura impermeabilizante elastomérica premium com 3 demãos cruzadas e proteção contra maresia e radiação UV',
      methodology: 'Aplicação de selador acrílico acoplador seguido de membrana acrílica impermeável com capacidade de absorção de fissuras de até 0,3mm.',
      unit: 'm²',
      quantity: areaNum,
      unitPrice: 24.0,
      total: Math.round(areaNum * 24.0),
    },
  ];

  return {
    id: `prop-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    protocol: `RSC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    condoName,
    location,
    towers: towersNum,
    floors: floorsNum,
    estimatedArea: areaNum,
    pathologies,
    urgency,
    title: `Memorial Descritivo e Proposta Técnica de Restauração de Fachada - ${condoName}`,
    executiveSummary: `Inspeção técnica diagnóstica no imóvel ${condoName} (${location}), composto por ${towersNum} torre(s) de ${floorsNum} pavimentos com aproximadamente ${areaNum.toLocaleString('pt-BR')} m² de envoltória predial. Identificou-se incidência prioritária de ${pathologies.join(
      ', '
    )}, demandando intervenção técnica especializada com isolamento de pedestres, montagem de balancins elétricos homologados e recuperação com argamassas poliméricas tixotrópicas em conformidade com as diretrizes do litoral catarinense.`,
    norms: [
      'ABNT NBR 13755 (Revestimento de paredes externas e fachadas com placas cerâmicas)',
      'ABNT NBR 9574 (Execução de impermeabilização)',
      'ABNT NBR 15575 (Edificações habitacionais - Desempenho)',
      'NR-35 (Trabalho em Altura e Ancoragens Prediais)',
      'NR-18 (Segurança e Saúde no Trabalho na Indústria da Construção)',
    ],
    services,
    methodologyHighlights: [
      {
        step: 1,
        title: 'Isolamento de Segurança & Balancins Certificados',
        detail: 'Instalação de bandejas de proteção primárias/secundárias e balancins com duplo cabo de aço conforme NR-18 e NR-35.',
      },
      {
        step: 2,
        title: 'Mapeamento por Percussão & Tratamento Estrutural',
        detail: 'Sondagem 100% da fachada, remoção controlada de som cavo e passivação de armaduras oxidadas com primer de zinco.',
      },
      {
        step: 3,
        title: 'Tratamento de Juntas de Dilatação & Fissuras',
        detail: 'Abertura em "V" e selagem com polímero elástico híbrido MS para garantia absoluta de estanqueidade contra chuva torrencial.',
      },
      {
        step: 4,
        title: 'Pintura Elastomérica & Hidrofugação Marítima',
        detail: 'Aplicação de membrana elástica anti-fissuras de alta respirabilidade com proteção contra cloretos e névoa salina da costa de SC.',
      },
    ],
    timelineWeeks: Math.max(6, Math.round(areaNum / 350)),
    warrantyYears: 5,
    paymentConditions: 'Entrada de 20% na assinatura do contrato + saldo parcelado em medições quinzenais de serviços atestados.',
    subtotal,
    bdiPercent,
    totalPrice: computedTotal,
    technicalResponsible: 'Responsável Técnico Operacional - Renovar SC',
    createdAt: new Date().toISOString(),
  };
}
