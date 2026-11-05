import React from 'react';
import { BudgetProposal } from '../types';
import { ensureOfficialTemplateStructure, RENOVAR_COMPANY_CNPJ } from '../utils/engineeringEngine';
import {
  Printer,
  Download,
  X,
  CheckCircle2,
  FileText,
} from 'lucide-react';

interface OfficialPdfModalProps {
  proposal: BudgetProposal;
  onClose: () => void;
}

export const OfficialPdfModal: React.FC<OfficialPdfModalProps> = ({ proposal: rawProposal, onClose }) => {
  const proposal = ensureOfficialTemplateStructure(rawProposal);

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadHtml = () => {
    const element = document.getElementById('printable-official-proposal');
    if (!element) return;
    const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Memorial Descritivo e Orçamento Oficial - ${proposal.protocol} - ${proposal.condoName}</title>
  <style>
    body { font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; background: #ffffff; color: #0f172a; padding: 36px; max-width: 960px; margin: 0 auto; line-height: 1.55; font-size: 12px; }
    h1, h2, h3, h4 { margin: 0 0 6px 0; color: #0a192f; }
    table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 11px; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; vertical-align: top; }
    th { background: #f1f5f9; font-weight: bold; color: #0f172a; }
    .section-box { border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; margin-bottom: 14px; background: #f8fafc; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  ${element.innerHTML}
</body>
</html>`;
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Memorial_Descritivo_Oficial_${proposal.protocol}_${proposal.condoName.replace(/\s+/g, '_')}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-5xl bg-white text-slate-900 rounded-2xl shadow-xl flex flex-col max-h-[94vh] overflow-hidden border border-slate-200">
        {/* Floating Controls Bar (Not Printed) */}
        <div className="p-4 sm:px-6 bg-slate-50 text-[#0f172a] flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-amber-600" />
            <span className="text-xs sm:text-sm font-bold text-[#0f172a]">
              Memorial Descritivo de Engenharia Civil • Documento Oficial
            </span>
            <span className="text-[10px] font-mono bg-[#0a192f] text-white px-2.5 py-0.5 rounded font-bold">
              {proposal.protocol}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-[#0a192f] hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm"
              title="Abrir diálogo de impressão e salvar como PDF"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Imprimir / Salvar PDF</span>
            </button>
            <button
              onClick={handleDownloadHtml}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              title="Baixar cópia HTML/Offline do Memorial Descritivo"
            >
              <Download className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Baixar Memorial</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-[#0f172a] cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Formal Document Content */}
        <div
          id="printable-official-proposal"
          className="p-6 sm:p-10 overflow-y-auto space-y-6 text-slate-800 text-xs font-sans bg-white print:p-0 print:overflow-visible"
        >
          {/* Header with Official Logo & Company Credentials (CNPJ 57.293.244/0001-27) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-[#0a192f] pb-4 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 border border-slate-200 rounded-xl p-1 bg-white">
                <img
                  src="/assets/aistudio/Logotipo_Renovar_51718f31.jpg"
                  alt="Renovar SC - Soluções Prediais"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-black tracking-tight text-[#0a192f]">
                  RENOVAR SC — SOLUÇÕES PREDIAIS LTDA
                </h1>
                <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">
                  Engenharia de Recuperação de Fachadas • Patologia das Construções • Restauração Predial
                </p>
                <div className="text-[10px] text-slate-600 font-mono mt-1 space-y-0.5">
                  <p><strong>CNPJ: {RENOVAR_COMPANY_CNPJ}</strong> | Registro CREA-SC Ativo | NR-35 & NR-18</p>
                  <p>Atuação Corporativa: Balneário Camboriú • Itapema • Itajaí • Florianópolis - SC</p>
                  <p>Departamento de Engenharia & Orçamentos | engenharia@renovarsc.com.br</p>
                </div>
              </div>
            </div>

            <div className="sm:text-right flex-shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0a192f] bg-amber-100 px-2.5 py-0.5 rounded border border-amber-400">
                MEMORIAL DESCRITIVO OFICIAL
              </span>
              <p className="text-xs font-mono font-bold text-slate-900 mt-1">
                Protocolo: {proposal.protocol}
              </p>
              <p className="text-[10px] text-slate-500">
                Emissão: {new Date(proposal.createdAt).toLocaleDateString('pt-BR')}
              </p>
              <p className="text-[10px] text-slate-700 font-semibold">
                Garantia Contratual: 0{proposal.warrantyYears} Anos
              </p>
            </div>
          </div>

          {/* Quadro de Identificação do Contratante e Caracterização da Edificação */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-300 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#0a192f]">
                QUADRO I — IDENTIFICAÇÃO DO CONTRATANTE / CLIENTE E DADOS DA EDIFICAÇÃO
              </span>
              <span className="text-[10px] font-mono text-slate-500">Padrão ABNT NBR 13755 / 6118</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div>
                <span className="text-slate-500 text-[10px] block">Contratante / Cliente:</span>
                <span className="font-bold text-slate-900 text-sm">{proposal.condoName}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Localização / Município:</span>
                <span className="font-semibold text-slate-800">{proposal.location}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Configuração e Porte:</span>
                <span className="font-semibold text-slate-800">
                  {proposal.towers} Torre(s) • {proposal.floors} Pavimentos ({proposal.estimatedArea.toLocaleString('pt-BR')} m²)
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-500 text-[10px] block">Enquadramento Ambiental (ABNT NBR 6118):</span>
                <span className="font-medium text-slate-700">
                  {proposal.environmentalClassification || 'Classe de Agressividade Ambiental III / IV (Atmosfera Marinha / Costeira SC)'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Grau de Prioridade / Risco:</span>
                <span className="font-bold text-amber-700">{proposal.urgency}</span>
              </div>
            </div>
          </div>

          {/* 1. Objeto do Orçamento, Finalidade e Diretrizes Técnicas */}
          <div className="space-y-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-[#0a192f] border-b-2 border-slate-200 pb-1">
              1. OBJETO DO ORÇAMENTO, FINALIDADE E DIRETRIZES TÉCNICAS
            </h2>
            <div className="space-y-2 text-[11px] text-slate-700 leading-relaxed text-justify">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <strong className="text-[#0a192f] block mb-0.5 uppercase text-[10px]">
                  1.1 Objeto do Orçamento:
                </strong>
                {proposal.scopeDeclaration}
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <strong className="text-[#0a192f] block mb-0.5 uppercase text-[10px]">
                  1.2 Finalidade Técnica e Parecer de Vistoria:
                </strong>
                {proposal.executiveSummary}
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <strong className="text-[#0a192f] block mb-1 uppercase text-[10px]">
                  1.3 Diretrizes Técnicas e Normas Regulamentadoras Aplicáveis:
                </strong>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[10px] text-slate-700">
                  {proposal.norms.map((norm, idx) => (
                    <div key={idx}>• {norm}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Diagnóstico Pericial Exato das Patologias Identificadas */}
          {proposal.pathologyDiagnostics && proposal.pathologyDiagnostics.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-black uppercase tracking-wider text-[#0a192f] border-b-2 border-slate-200 pb-1">
                2. DIAGNÓSTICO PERICIAL EXATO DAS PATOLOGIAS IDENTIFICADAS ({proposal.condoName.toUpperCase()})
              </h2>
              <div className="space-y-2.5 pt-1">
                {proposal.pathologyDiagnostics.map((diag, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-slate-300 bg-slate-50/70 space-y-1.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-1 border-b border-slate-200 pb-1">
                      <span className="font-bold text-[#0a192f] text-xs">
                        [{diag.code}] Manifestação Patológica: {diag.pathology}
                      </span>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                        {diag.severityLabel}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-1 text-[11px] text-slate-700">
                      <p>
                        <strong className="text-slate-900">• Origem e Mecanismo Físico-Químico: </strong>
                        {diag.technicalOrigin}
                      </p>
                      <p>
                        <strong className="text-slate-900">• Risco Associado e Prognóstico: </strong>
                        {diag.riskImpact}
                      </p>
                      <p>
                        <strong className="text-slate-900">• Terapia Normativa Especificada: </strong>
                        {diag.normativeTherapy}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Metodologia Executiva por Fases */}
          {proposal.methodologyHighlights && (
            <div className="space-y-2">
              <h2 className="text-xs font-black uppercase tracking-wider text-[#0a192f] border-b-2 border-slate-200 pb-1">
                3. METODOLOGIA EXECUTIVA POR FASES (PROCEDIMENTO OPERACIONAL PADRÃO)
              </h2>
              <div className="space-y-2 pt-1">
                {proposal.methodologyHighlights.map((m, idx) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="font-bold text-[#0a192f] text-xs">
                        {m.phaseCode ? `${m.phaseCode} — ` : `${m.step}. `}
                        {m.title}
                      </span>
                      {m.technicalStandard && (
                        <span className="text-[10px] font-mono font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {m.technicalStandard}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-700 mt-1 leading-relaxed text-justify">
                      {m.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Planilha de Serviços com Quantitativos e Insumos */}
          <div className="space-y-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-[#0a192f] border-b-2 border-slate-200 pb-1">
              4. PLANILHA DE SERVIÇOS COM QUANTITATIVOS, INSUMOS E PREÇOS ({proposal.condoName.toUpperCase()})
            </h2>

            <div className="border border-slate-300 rounded-lg overflow-hidden">
              <table className="w-full text-left text-[11px] border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                    <th className="py-2 px-2.5">Item</th>
                    <th className="py-2 px-2.5">Discriminação dos Serviços, Metodologia e Insumos Aplicados</th>
                    <th className="py-2 px-2 text-center">Un.</th>
                    <th className="py-2 px-2 text-center">Quant.</th>
                    <th className="py-2 px-2.5 text-right">Preço Unit.</th>
                    <th className="py-2 px-2.5 text-right">Subtotal (R$)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  {proposal.services.map((item, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                      <td className="py-2 px-2.5 font-bold text-slate-900 align-top font-mono">{item.code}</td>
                      <td className="py-2 px-2.5 align-top space-y-1">
                        <span className="font-bold text-slate-900 block">{item.description}</span>
                        <span className="text-[10px] text-slate-600 block leading-snug">
                          <strong>Procedimento:</strong> {item.methodology}
                        </span>
                        {item.inputsAndMaterials && (
                          <span className="text-[10px] text-slate-700 block leading-snug bg-slate-100/80 px-2 py-1 rounded border border-slate-200">
                            <strong>Insumos & Materiais:</strong> {item.inputsAndMaterials}
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-2 text-center align-top font-mono">{item.unit}</td>
                      <td className="py-2 px-2 text-center align-top font-mono">{item.quantity.toLocaleString('pt-BR')}</td>
                      <td className="py-2 px-2.5 text-right align-top font-mono">{formatCurrency(item.unitPrice)}</td>
                      <td className="py-2 px-2.5 text-right align-top font-bold font-mono text-slate-900">
                        {formatCurrency(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-100 border-t-2 border-slate-300 text-xs">
                  <tr className="border-b border-slate-200">
                    <td colSpan={5} className="py-2 px-2.5 text-right font-semibold text-slate-700">
                      Subtotal Direto (Mão de Obra Especializada, Insumos, Balancins e EPCs):
                    </td>
                    <td className="py-2 px-2.5 text-right font-mono font-bold text-slate-900">
                      {formatCurrency(proposal.subtotal)}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td colSpan={5} className="py-2 px-2.5 text-right font-semibold text-slate-700">
                      BDI Corporativo, Tributos, Seguros, ART/CREA-SC e Administração ({proposal.bdiPercent}%):
                    </td>
                    <td className="py-2 px-2.5 text-right font-mono font-bold text-slate-900">
                      {formatCurrency(proposal.totalPrice - proposal.subtotal)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={5} className="py-2.5 px-2.5 text-right font-black text-slate-900 uppercase">
                      VALOR GLOBAL PROPOSTO ({proposal.condoName.toUpperCase()}):
                    </td>
                    <td className="py-2.5 px-2.5 text-right font-mono font-black text-sm text-amber-800">
                      {formatCurrency(proposal.totalPrice)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* 5. Tabela de Equipe Técnica e Operacional Alocada */}
          {proposal.teamAllocation && proposal.teamAllocation.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-black uppercase tracking-wider text-[#0a192f] border-b-2 border-slate-200 pb-1">
                5. TABELA DE EQUIPE TÉCNICA E OPERACIONAL ALOCADA NA OBRA
              </h2>
              <div className="border border-slate-300 rounded-lg overflow-hidden">
                <table className="w-full text-left text-[11px] border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                      <th className="py-2 px-2.5">Função / Cargo na Obra</th>
                      <th className="py-2 px-2 text-center">Efetivo</th>
                      <th className="py-2 px-2.5">Habilitação & Certificações</th>
                      <th className="py-2 px-2.5">Atribuição Técnica no Canteiro</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    {proposal.teamAllocation.map((member, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                        <td className="py-2 px-2.5 font-bold text-slate-900 align-top">{member.role}</td>
                        <td className="py-2 px-2 text-center font-mono font-bold text-slate-900 align-top">
                          {String(member.quantity).padStart(2, '0')} prof.
                        </td>
                        <td className="py-2 px-2.5 align-top">{member.qualification}</td>
                        <td className="py-2 px-2.5 align-top text-slate-600">{member.assignment}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 6. Cronograma Físico-Financeiro por Semanas */}
          {proposal.weeklySchedule && proposal.weeklySchedule.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-black uppercase tracking-wider text-[#0a192f] border-b-2 border-slate-200 pb-1">
                6. CRONOGRAMA FÍSICO-FINANCEIRO POR SEMANAS ({proposal.timelineWeeks} SEMANAS)
              </h2>
              <div className="border border-slate-300 rounded-lg overflow-hidden">
                <table className="w-full text-left text-[11px] border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                      <th className="py-2 px-2.5">Fase</th>
                      <th className="py-2 px-2.5">Período</th>
                      <th className="py-2 px-2.5">Etapa Executiva & Entrega</th>
                      <th className="py-2 px-2 text-center">Peso (%)</th>
                      <th className="py-2 px-2.5 text-right">Medição Prevista (R$)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    {proposal.weeklySchedule.map((sch, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                        <td className="py-2 px-2.5 font-mono font-bold text-slate-900 align-top whitespace-nowrap">
                          {sch.phase}
                        </td>
                        <td className="py-2 px-2.5 font-mono font-semibold text-slate-800 align-top whitespace-nowrap">
                          {sch.weeksLabel}
                        </td>
                        <td className="py-2 px-2.5 align-top">
                          <span className="font-bold text-slate-900 block">{sch.stageTitle}</span>
                          <span className="text-[10px] text-slate-600 block">Entrega: {sch.deliverable}</span>
                        </td>
                        <td className="py-2 px-2 text-center font-mono font-bold text-slate-900 align-top">
                          {sch.physicalWeightPercent}%
                        </td>
                        <td className="py-2 px-2.5 text-right font-mono font-bold text-slate-900 align-top whitespace-nowrap">
                          {formatCurrency(sch.financialAmount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 7. Termo de Garantia Contratual de 05 Anos */}
          <div className="space-y-2.5">
            <h2 className="text-xs font-black uppercase tracking-wider text-[#0a192f] border-b-2 border-slate-200 pb-1">
              7. TERMO DE GARANTIA CONTRATUAL DE 05 (CINCO) ANOS (ART. 618 CC / ABNT NBR 15575)
            </h2>

            {proposal.warrantyClauses && proposal.warrantyClauses.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {proposal.warrantyClauses.map((wc, idx) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-300 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-[#0a192f] text-[11px]">{wc.category}</span>
                    </div>
                    <span className="inline-block text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                      {wc.period} • {wc.normReference}
                    </span>
                    <p className="text-[10px] text-slate-600 leading-relaxed pt-0.5">
                      {wc.coverageDescription}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 8. Condições Comerciais, Faturamento e Responsabilidade Técnica */}
          <div className="space-y-2.5">
            <h2 className="text-xs font-black uppercase tracking-wider text-[#0a192f] border-b-2 border-slate-200 pb-1">
              8. CONDIÇÕES COMERCIAIS, DADOS DE FATURAMENTO (CNPJ {RENOVAR_COMPANY_CNPJ}) E CLÁUSULAS GERAIS
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-300">
              <div>
                <span className="text-[10px] text-slate-500 block">Entrada / Mobilização (20%):</span>
                <span className="font-bold text-slate-900 font-mono">{formatCurrency(proposal.totalPrice * 0.2)}</span>
                <span className="text-[10px] text-slate-500 block">Na assinatura p/ ART, balancins e insumos</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Saldo Parcelado (80% em Medições):</span>
                <span className="font-bold text-slate-900 font-mono">{formatCurrency(proposal.totalPrice * 0.8)}</span>
                <span className="text-[10px] text-slate-500 block">Em até 06x ou conforme cronograma semanal</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Opção À Vista (5% de Desconto):</span>
                <span className="font-bold text-amber-800 font-mono">{formatCurrency(proposal.totalPrice * 0.95)}</span>
                <span className="text-[10px] text-slate-500 block">Economia direta de {formatCurrency(proposal.totalPrice * 0.05)}</span>
              </div>
              <div className="sm:col-span-3 pt-1.5 border-t border-slate-200">
                <span className="text-[10px] text-slate-500 block">Condições Gerais de Medição e Pagamento (CNPJ {RENOVAR_COMPANY_CNPJ}):</span>
                <span className="font-semibold text-slate-800">{proposal.paymentConditions}</span>
              </div>
            </div>

            {proposal.commercialTermsList && proposal.commercialTermsList.length > 0 && (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 text-[10px] text-slate-700">
                <span className="font-bold text-slate-900 block uppercase tracking-wider">
                  Diretrizes Comerciais e Fiscais:
                </span>
                {proposal.commercialTermsList.map((term, idx) => (
                  <p key={idx} className="leading-relaxed">
                    • {term}
                  </p>
                ))}
              </div>
            )}

            {proposal.contractualTerms && proposal.contractualTerms.length > 0 && (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 text-[10px] text-slate-600">
                <span className="font-bold text-slate-800 block uppercase tracking-wider">
                  Cláusulas Gerais de Segurança, Fornecimento e Responsabilidade Civil:
                </span>
                {proposal.contractualTerms.map((term, idx) => (
                  <p key={idx} className="leading-relaxed">
                    • {term}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* 9. Termo de Aceite & Assinatura Digital do Contratante */}
          <div className="border-t-2 border-[#0a192f] pt-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-[#0a192f] mb-2">
              9. TERMO DE ACEITE, HOMOLOGAÇÃO TÉCNICA & ASSINATURA DO CONTRATANTE / CLIENTE
            </h2>

            {proposal.contractAcceptance?.signed ? (
              <div className="bg-slate-50 border-2 border-[#0a192f] rounded-xl p-4 text-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-300">
                  <div className="flex items-center gap-2 text-[#0a192f] font-bold">
                    <CheckCircle2 className="w-5 h-5 text-amber-600" />
                    <span>MEMORIAL E PROPOSTA HOMOLOGADOS DIGITALMENTE PELO CONTRATANTE</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                    Hash: {proposal.contractAcceptance.protocolHash}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div>
                    <p className="text-slate-700 text-[11px] leading-relaxed">
                      O Contratante / Cliente declara ter conferido integralmente o diagnóstico das patologias, a metodologia executiva por fases, a planilha de serviços e insumos, a tabela de equipe, o cronograma físico-financeiro e a garantia de 05 anos, autorizando a mobilização técnica.
                    </p>
                    <div className="mt-2 text-[11px] text-slate-800 space-y-0.5">
                      <p><strong>Signatário (Contratante/Cliente):</strong> {proposal.contractAcceptance.clientName}</p>
                      <p><strong>Qualificação / Representação:</strong> {proposal.contractAcceptance.clientRole}</p>
                      <p><strong>CPF / CNPJ:</strong> {proposal.contractAcceptance.clientDocument}</p>
                      <p><strong>Data e Hora do Aceite:</strong> {new Date(proposal.contractAcceptance.signedAt).toLocaleString('pt-BR')}</p>
                    </div>
                  </div>

                  {/* Signature graphic */}
                  <div className="flex flex-col items-center justify-center p-2 bg-white rounded-lg border border-slate-300">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 mb-1">
                      Assinatura Grafométrica Registrada
                    </span>
                    <img
                      src={proposal.contractAcceptance.signatureDataUrl}
                      alt="Assinatura Digital"
                      className="max-h-20 max-w-full object-contain"
                    />
                    <div className="w-48 border-t border-slate-400 mt-1 text-center">
                      <span className="text-[10px] font-bold text-slate-800 block">
                        {proposal.contractAcceptance.clientName}
                      </span>
                      <span className="text-[9px] text-slate-500">
                        {proposal.contractAcceptance.clientRole} • {proposal.condoName}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-4 text-center text-slate-500">
                <p className="text-xs">
                  Documento aguardando assinatura digital do Contratante / Cliente na tela do sistema ou assinatura física abaixo para homologação contratual.
                </p>
                <div className="grid grid-cols-2 gap-8 mt-8 pt-4 max-w-lg mx-auto text-[10px] text-slate-600">
                  <div className="border-t border-slate-400 pt-1">
                    <strong>RENOVAR SC SOLUÇÕES PREDIAIS LTDA</strong>
                    <span className="block">CNPJ: {RENOVAR_COMPANY_CNPJ} • Diretoria Técnica</span>
                  </div>
                  <div className="border-t border-slate-400 pt-1">
                    <strong>{proposal.condoName.toUpperCase()}</strong>
                    <span className="block">Contratante / Cliente / Representante Legal</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Signature of Renovar SC */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between sm:items-end gap-2 text-[11px] text-slate-600">
            <div>
              <p className="font-bold text-slate-900">
                RENOVAR SC — SOLUÇÕES PREDIAIS LTDA (CNPJ {RENOVAR_COMPANY_CNPJ})
              </p>
              <p className="text-[10px] text-slate-500">{proposal.technicalResponsible}</p>
            </div>
            <div className="sm:text-right text-[10px] text-slate-400 font-mono">
              Memorial Descritivo Padrão Oficial Emitido via Sistema Renovar SC • {proposal.protocol}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
