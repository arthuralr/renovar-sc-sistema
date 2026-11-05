import { ObraCronograma } from '../types';

/**
 * Escapes CSV text fields properly with double quotes and removes line breaks
 */
function escapeCsv(value: string | number | undefined | null): string {
  if (value === undefined || value === null) return '""';
  const str = String(value).replace(/"/g, '""').replace(/[\r\n]+/g, ' ');
  return `"${str}"`;
}

/**
 * Formats numeric values to Brazilian decimal comma representation (e.g. 10800,00)
 */
function formatBrlNumber(num: number): string {
  return num.toFixed(2).replace('.', ',');
}

/**
 * Generates and downloads a structured, audit-ready CSV file for a physical-financial schedule
 */
export function exportCronogramaToCsv(cronograma: ObraCronograma): void {
  const delimiter = ';';
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('pt-BR');
  const timeFormatted = now.toLocaleTimeString('pt-BR');

  const executedPercent = cronograma.totalBudget > 0
    ? ((cronograma.executedFinancial / cronograma.totalBudget) * 100).toFixed(1).replace('.', ',')
    : '0,0';

  const rows: string[] = [];

  // --- Corporate Audit Header ---
  rows.push([escapeCsv('RENOVAR SC - SOLUÇÕES PREDIAIS LTDA')].join(delimiter));
  rows.push([escapeCsv('RELATÓRIO GERENCIAL & AUDITORIA DE CRONOGRAMA FÍSICO-FINANCEIRO')].join(delimiter));
  rows.push([escapeCsv('CNPJ'), escapeCsv('34.819.520/0001-90')].join(delimiter));
  rows.push([escapeCsv('ATIVIDADE'), escapeCsv('Engenharia, Recuperação de Fachadas & Impermeabilização')].join(delimiter));
  rows.push([escapeCsv('DATA / HORA DE EMISSÃO'), escapeCsv(`${dateFormatted} às ${timeFormatted}`)].join(delimiter));
  rows.push([escapeCsv('OBRA / EDIFICAÇÃO'), escapeCsv(cronograma.obraName)].join(delimiter));
  rows.push([escapeCsv('JANELA TOTAL DE EXECUÇÃO'), escapeCsv(`${cronograma.totalWeeks} Semanas`)].join(delimiter));
  rows.push([escapeCsv('SEMANA VIGENTE ATUAL'), escapeCsv(`Semana ${cronograma.currentWeek} de ${cronograma.totalWeeks}`)].join(delimiter));
  rows.push([escapeCsv('ORÇAMENTO TOTAL CONTRATADO (R$)'), escapeCsv(`R$ ${formatBrlNumber(cronograma.totalBudget)}`)].join(delimiter));
  rows.push([escapeCsv('VALOR EXECUTADO ATÉ O MOMENTO (R$)'), escapeCsv(`R$ ${formatBrlNumber(cronograma.executedFinancial)}`)].join(delimiter));
  rows.push([escapeCsv('AVANÇO FINANCEIRO REALIZADO (%)'), escapeCsv(`${executedPercent}%`)].join(delimiter));
  rows.push(''); // Empty line separator

  // --- Column Headers ---
  const headers = [
    'Frente de Serviço',
    'Título da Etapa',
    'Categoria Operacional',
    'Semana Inicial',
    'Semana Final',
    'Duração (Semanas)',
    'Peso Contratual (%)',
    'Valor Orçado (R$)',
    'Avanço Físico (%)',
    'Valor Medido / Executado (R$)',
    'Saldo a Executar (R$)',
    'Status Atual',
    'Memorial Resumido da Etapa',
    'Checklist de Qualidade & Auditoria'
  ];
  rows.push(headers.map(escapeCsv).join(delimiter));

  // --- Stages Data ---
  let totalBudgetCheck = 0;
  let totalExecutedCheck = 0;

  cronograma.stages.forEach((stage) => {
    const duration = stage.endWeek - stage.startWeek + 1;
    const stageExecuted = (stage.financialAmount * stage.progressPercent) / 100;
    const stageBalance = stage.financialAmount - stageExecuted;

    totalBudgetCheck += stage.financialAmount;
    totalExecutedCheck += stageExecuted;

    const statusLabel =
      stage.status === 'concluido'
        ? 'Concluído'
        : stage.status === 'em_andamento'
        ? 'Em Andamento'
        : 'Programado';

    const checklistJoined = stage.criticalChecklist.join(' | ');

    const row = [
      escapeCsv(stage.stageNumber),
      escapeCsv(stage.title),
      escapeCsv(stage.category),
      escapeCsv(stage.startWeek),
      escapeCsv(stage.endWeek),
      escapeCsv(duration),
      escapeCsv(`${stage.weightPercent.toFixed(1).replace('.', ',')}%`),
      escapeCsv(formatBrlNumber(stage.financialAmount)),
      escapeCsv(`${stage.progressPercent}%`),
      escapeCsv(formatBrlNumber(stageExecuted)),
      escapeCsv(formatBrlNumber(stageBalance)),
      escapeCsv(statusLabel),
      escapeCsv(stage.description),
      escapeCsv(checklistJoined)
    ];

    rows.push(row.join(delimiter));
  });

  // --- Total Summary Row ---
  rows.push('');
  const totalBalance = totalBudgetCheck - totalExecutedCheck;
  const summaryRow = [
    escapeCsv('TOTAL GERAL DA OBRA'),
    escapeCsv('Consolidado 12 Semanas'),
    escapeCsv('-'),
    escapeCsv('1'),
    escapeCsv(String(cronograma.totalWeeks)),
    escapeCsv(String(cronograma.totalWeeks)),
    escapeCsv('100,0%'),
    escapeCsv(formatBrlNumber(totalBudgetCheck)),
    escapeCsv(`${executedPercent}%`),
    escapeCsv(formatBrlNumber(totalExecutedCheck)),
    escapeCsv(formatBrlNumber(totalBalance)),
    escapeCsv(cronograma.currentWeek >= cronograma.totalWeeks ? 'Concluída' : 'Em Execução'),
    escapeCsv('Planejamento físico-financeiro integral auditado pela Renovar SC'),
    escapeCsv('Conforme Normas NBR 13755, NBR 9574, NR-18 e NR-35')
  ];
  rows.push(summaryRow.join(delimiter));

  // --- Create Blob and Trigger Download with UTF-8 BOM ---
  const csvContent = '\uFEFF' + rows.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const sanitizedObraName = cronograma.obraName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_');
  
  const filename = `Cronograma_Fisico_Financeiro_${sanitizedObraName}_Semana_${cronograma.currentWeek}_${now.getFullYear()}.csv`;

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
