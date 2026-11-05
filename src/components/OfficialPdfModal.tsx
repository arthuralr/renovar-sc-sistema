import React from 'react';
import { BudgetProposal } from '../types';
import { ensureOfficialTemplateStructure } from '../utils/engineeringEngine';
import {
  Printer,
  Download,
  X,
  CheckCircle2,
  ShieldCheck,
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
    body { font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; background: #ffffff; color: #0f172a; padding: 36px; max-width: 920px; margin: 0 auto; line-height: 1.55; font-size: 12px; }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-4xl bg-white text-slate-900 rounded-2xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden">
        {/* Floating Controls Bar (Not Printed) */}
        <div className="p-3 sm:px-5 bg-[#0a192f] text-white flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/30 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            <span className="text-xs sm:text-sm font-bold text-white">
              Memorial Descritivo de Engenharia Civil • Documento Oficial
            </span>
            <span className="text-[10px] font-mono bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-bold">
              {proposal.protocol}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow active:scale-95 transition cursor-pointer hover:brightness-105"
              title="Abrir diálogo de impressão e salvar como PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Salvar PDF</span>
            </button>
            <button
              onClick={handleDownloadHtml}
              className="px-3 py-1.5 rounded-lg bg-[#0f2744] border border-slate-700 hover:border-amber-400 text-slate-200 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
              title="Baixar cópia HTML/Offline do Memorial Descritivo"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Baixar Memorial</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer ml-1"
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
          {/* Header with Official Logo & Company Credentials */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-[#0a192f] pb-4 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 border border-slate-200 rounded-xl p-1 bg-white shadow-xs">
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
                <div className="text-[10px] text-slate-500 font-mono mt-1 space-y-0.5">
                  <p>CNPJ: 34.819.520/0001-90 | Inscrição Municipal: 149.201-8 | Registro CREA-SC</p>
                  <p>Rua 1500, nº 420 - Centro, Balneário Camboriú - SC | CEP: 88330-000</p>
                  <p>Atendimento Corporativo: (47) 99842-1920 | engenharia@renovarsc.com.br</p>
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
              <p className="text-[10px] text-slate-500">Validade da Proposta: 30 dias</p>
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

          {/* 1. Objeto e Escopo Detalhado */}
          <div className="space-y-1.5">
            <h2 className="text-xs font-black uppercase tracking-wider text-[#0a192f] border-b-2 border-slate-200 pb-1">
              1. OBJETO, FINALIDADE E ESCOPO TÉCNICO DO MEMORIAL DESCRITIVO
            </h2>
            <p className="text-slate-700 leading-relaxed text-justify">
              {proposal.scopeDeclaration}
            </p>
            <p className="text-slate-700 leading-relaxed text-justify mt-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <strong>Síntese Diagnóstica de Vistoria: </strong>
              {proposal.executiveSummary}
            </p>
          </div>

          {/* 2. Diagnóstico Exato das Patologias Informadas */}
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

          {/* 3. Metodologia Executiva por Etapas */}
          {proposal.methodologyHighlights && (
            <div className="space-y-2">
              <h2 className="text-xs font-black uppercase tracking-wider text-[#0a192f] border-b-2 border-slate-200 pb-1">
                3. METODOLOGIA EXECUTIVA POR ETAPAS (PROCEDIMENTO OPERACIONAL PADRÃO)
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

          {/* 4. Normas Técnicas e Especificação de Materiais */}
          <div className="space-y-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-[#0a192f] border-b-2 border-slate-200 pb-1">
              4. ENQUADRAMENTO NORMATIVO ABNT / NR E ESPECIFICAÇÃO DE MATERIAIS HOMOLOGADOS
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-[11px] text-slate-700">
              {proposal.norms.map((norm, idx) => (
                <div key={idx} className="flex items-start gap-1.5 bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="text-amber-600 font-bold">✓</span>
                  <span>{norm}</span>
                </div>
              ))}
            </div>
            {proposal.materialSpecifications && proposal.materialSpecifications.length > 0 && (
              <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-[11px] text-slate-700">
                <span className="font-bold text-slate-900 block uppercase text-[10px] tracking-wider">
                  Insumos Industriais e Controle Tecnológico Especificados:
                </span>
                {proposal.materialSpecifications.map((mat, idx) => (
                  <p key={idx} className="leading-snug">
                    • {mat}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* 5. Planilha Orçamentária Discriminada */}
          <div className="space-y-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-[#0a192f] border-b-2 border-slate-200 pb-1">
              5. PLANILHA ORÇAMENTÁRIA ANALÍTICA E DISCRIMINADA ({proposal.condoName.toUpperCase()})
            </h2>

            <div className="border border-slate-300 rounded-lg overflow-hidden">
              <table className="w-full text-left text-[11px] border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                    <th className="py-2 px-2.5">Item</th>
                    <th className="py-2 px-2.5">Discriminação Técnica dos Serviços e Procedimento Executivo</th>
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
                      <td className="py-2 px-2.5 align-top">
                        <span className="font-bold text-slate-900 block">{item.description}</span>
                        <span className="text-[10px] text-slate-600 block leading-snug mt-0.5">{item.methodology}</span>
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
              </table>
            </div>

            {/* Totais do Orçamento */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-300 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Direto (Mão de Obra Especializada, Insumos, Balancins e EPCs):</span>
                <span className="font-mono font-semibold">{formatCurrency(proposal.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>BDI Corporativo, Tributos, Seguros, ART/CREA-SC e Administração ({proposal.bdiPercent}%):</span>
                <span className="font-mono font-semibold">{formatCurrency(proposal.totalPrice - proposal.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-300">
                <span>INVESTIMENTO GLOBAL PROPOSTO ({proposal.condoName.toUpperCase()}):</span>
                <span className="text-amber-700 font-mono text-base">{formatCurrency(proposal.totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* 6. Garantias Contratuais e Condições Comerciais */}
          <div className="space-y-2.5">
            <h2 className="text-xs font-black uppercase tracking-wider text-[#0a192f] border-b-2 border-slate-200 pb-1">
              6. TERMO DE GARANTIAS CONTRATUAIS, RESPONSABILIDADE TÉCNICA E CONDIÇÕES COMERCIAIS
            </h2>

            {proposal.warrantyClauses && proposal.warrantyClauses.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {proposal.warrantyClauses.map((wc, idx) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-300 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-[#0a192f] text-[11px]">{wc.category}</span>
                    </div>
                    <span className="inline-block text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                      {wc.period} • {wc.normReference}
                    </span>
                    <p className="text-[10px] text-slate-600 leading-relaxed pt-0.5">
                      {wc.coverageDescription}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-300">
              <div>
                <span className="text-[10px] text-slate-500 block">Prazo Estimado de Execução:</span>
                <span className="font-bold text-slate-900">{proposal.timelineWeeks} semanas de cronograma físico-financeiro</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Garantia Contratual Global:</span>
                <span className="font-bold text-slate-900">{proposal.warrantyYears} anos (Conforme Art. 618 do Código Civil e NBR 15575)</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-[10px] text-slate-500 block">Condições de Medição e Pagamento:</span>
                <span className="font-semibold text-slate-800">{proposal.paymentConditions}</span>
              </div>
            </div>

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

          {/* 7. Termo de Aceite & Assinatura Digital do Contratante */}
          <div className="border-t-2 border-[#0a192f] pt-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-[#0a192f] mb-2">
              7. TERMO DE ACEITE, HOMOLOGAÇÃO TÉCNICA & ASSINATURA DIGITAL DO CONTRATANTE / CLIENTE
            </h2>

            {proposal.contractAcceptance?.signed ? (
              <div className="bg-emerald-50 border-2 border-emerald-500 rounded-xl p-4 text-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>MEMORIAL E PROPOSTA HOMOLOGADOS DIGITALMENTE PELO CONTRATANTE</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                    Hash: {proposal.contractAcceptance.protocolHash}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div>
                    <p className="text-slate-700 text-[11px] leading-relaxed">
                      O Contratante / Cliente declara ter conferido integralmente o diagnóstico das patologias, a metodologia executiva por etapas, a planilha orçamentária e os termos de garantia, autorizando a mobilização técnica.
                    </p>
                    <div className="mt-2 text-[11px] text-slate-800 space-y-0.5">
                      <p><strong>Signatário (Contratante/Cliente):</strong> {proposal.contractAcceptance.clientName}</p>
                      <p><strong>Qualificação / Representação:</strong> {proposal.contractAcceptance.clientRole}</p>
                      <p><strong>CPF / CNPJ:</strong> {proposal.contractAcceptance.clientDocument}</p>
                      <p><strong>Data e Hora do Aceite:</strong> {new Date(proposal.contractAcceptance.signedAt).toLocaleString('pt-BR')}</p>
                    </div>
                  </div>

                  {/* Signature graphic */}
                  <div className="flex flex-col items-center justify-center p-2 bg-white rounded-lg border border-emerald-200">
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
                    <span className="block">Engenharia e Diretoria Técnica</span>
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
              <p className="font-bold text-slate-900">RENOVAR SC — SOLUÇÕES PREDIAIS LTDA</p>
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
