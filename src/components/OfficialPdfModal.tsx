import React from 'react';
import { BudgetProposal } from '../types';
import { Printer, Download, X, CheckCircle2, ShieldCheck, FileText, Building2, MapPin, Calendar, Clock } from 'lucide-react';

interface OfficialPdfModalProps {
  proposal: BudgetProposal;
  onClose: () => void;
}

export const OfficialPdfModal: React.FC<OfficialPdfModalProps> = ({ proposal, onClose }) => {
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
  <title>Proposta Oficial - ${proposal.protocol} - ${proposal.condoName}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #ffffff; color: #1e293b; padding: 32px; max-width: 850px; margin: 0 auto; line-height: 1.5; font-size: 12px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 11px; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
    th { background: #f8fafc; font-weight: bold; }
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
    link.download = `Proposta_Oficial_${proposal.protocol}_${proposal.condoName.replace(/\s+/g, '_')}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-2xl bg-white text-slate-900 rounded-2xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden">
        {/* Floating Controls Bar (Not Printed) */}
        <div className="p-3 bg-[#0a192f] text-white flex items-center justify-between border-b border-amber-500/30 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white">Visualização de Impressão • PDF Oficial</span>
            <span className="text-[10px] font-mono bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-bold">
              {proposal.protocol}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow active:scale-95 transition cursor-pointer hover:brightness-105"
              title="Abrir diálogo de impressão e salvar como PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Salvar PDF</span>
            </button>
            <button
              onClick={handleDownloadHtml}
              className="px-2.5 py-1.5 rounded-lg bg-[#0f2744] border border-slate-700 hover:border-amber-400 text-slate-200 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
              title="Baixar cópia HTML/Offline da proposta"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Baixar Doc</span>
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
        <div id="printable-official-proposal" className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 text-xs font-sans bg-white print:p-0 print:overflow-visible">
          {/* Header with Official Logo & Company Credentials */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 border border-slate-200 rounded-xl p-1 bg-white shadow-xs">
                <img
                  src="/assets/aistudio/Logotipo_Renovar_51718f31.jpg"
                  alt="Renovar SC - Soluções Prediais"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                  RENOVAR SC - SOLUÇÕES PREDIAIS LTDA
                </h1>
                <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-wider">
                  Recuperação de Fachadas • Laudos Periciais • Restauração Predial
                </p>
                <div className="text-[10px] text-slate-500 font-mono mt-1 space-y-0.5">
                  <p>CNPJ: 34.819.520/0001-90 | Inscrição Municipal: 149.201-8</p>
                  <p>Rua 1500, nº 420 - Centro, Balneário Camboriú - SC | CEP: 88330-000</p>
                  <p>Contato: (47) 99842-1920 | comercial@renovarsc.com.br</p>
                </div>
              </div>
            </div>

            <div className="text-right flex-shrink-0 hidden sm:block">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                PROPOSTA OFICIAL
              </span>
              <p className="text-xs font-mono font-bold text-slate-900 mt-1">{proposal.protocol}</p>
              <p className="text-[10px] text-slate-500">
                Data: {new Date(proposal.createdAt).toLocaleDateString('pt-BR')}
              </p>
              <p className="text-[10px] text-slate-500">Validade: 30 dias</p>
            </div>
          </div>

          {/* Dados do Cliente / Tomador */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
              Dados do Contratante / Tomador de Serviços
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500 text-[10px] block">Contratante / Edificação:</span>
                <span className="font-bold text-slate-900 text-sm">{proposal.condoName}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Localização:</span>
                <span className="font-semibold text-slate-800">{proposal.location}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Porte da Edificação:</span>
                <span className="font-medium text-slate-700">
                  {proposal.towers} torre(s) • {proposal.floors} pavimentos ({proposal.estimatedArea.toLocaleString('pt-BR')} m² de fachada)
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Grau de Urgência / Risco:</span>
                <span className="font-bold text-amber-700">{proposal.urgency}</span>
              </div>
            </div>
          </div>

          {/* 1. Diagnóstico e Resumo Executivo */}
          <div className="space-y-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              1. Memorial Descritivo & Diagnóstico Preliminar
            </h2>
            <p className="text-slate-700 leading-relaxed text-justify pt-1">
              {proposal.executiveSummary}
            </p>
          </div>

          {/* 2. Normas Técnicas e Regulamentadoras */}
          <div className="space-y-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              2. Normas Técnicas ABNT e Segurança do Trabalho
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1 text-[11px] text-slate-700">
              {proposal.norms.map((norm, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{norm}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Metodologia Executiva */}
          {proposal.methodologyHighlights && (
            <div className="space-y-1.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                3. Metodologia Executiva de Campo
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {proposal.methodologyHighlights.map((m, idx) => (
                  <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-900 block text-[11px]">
                      {m.step}. {m.title}
                    </span>
                    <p className="text-[10px] text-slate-600 mt-0.5 leading-snug">{m.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Planilha Orçamentária Discriminada */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              4. Planilha Orçamentária Discriminada
            </h2>

            <div className="border border-slate-300 rounded-lg overflow-hidden">
              <table className="w-full text-left text-[11px] border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                    <th className="py-2 px-2.5">Item</th>
                    <th className="py-2 px-2.5">Descrição dos Serviços e Metodologia</th>
                    <th className="py-2 px-2 text-center">Un.</th>
                    <th className="py-2 px-2 text-center">Qtd.</th>
                    <th className="py-2 px-2.5 text-right">Unitário</th>
                    <th className="py-2 px-2.5 text-right">Total (R$)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  {proposal.services.map((item, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                      <td className="py-1.5 px-2.5 font-bold text-slate-900 align-top">{item.code}</td>
                      <td className="py-1.5 px-2.5 align-top">
                        <span className="font-semibold text-slate-900 block">{item.description}</span>
                        <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">{item.methodology}</span>
                      </td>
                      <td className="py-1.5 px-2 text-center align-top">{item.unit}</td>
                      <td className="py-1.5 px-2 text-center align-top font-mono">{item.quantity.toLocaleString('pt-BR')}</td>
                      <td className="py-1.5 px-2.5 text-right align-top font-mono">{formatCurrency(item.unitPrice)}</td>
                      <td className="py-1.5 px-2.5 text-right align-top font-bold font-mono text-slate-900">
                        {formatCurrency(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totais do Orçamento */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-300 space-y-1 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Direto (Materiais, Balancins e Mão de Obra):</span>
                <span className="font-mono">{formatCurrency(proposal.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>BDI Corporativo e Encargos ({proposal.bdiPercent}%):</span>
                <span className="font-mono">{formatCurrency(proposal.totalPrice - proposal.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-1.5 border-t border-slate-300">
                <span>VALOR TOTAL PROPOSTO:</span>
                <span className="text-amber-600 font-mono text-base">{formatCurrency(proposal.totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Condições Comerciais */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-500 block">Prazo de Execução:</span>
              <span className="font-bold text-slate-900">{proposal.timelineWeeks} semanas de cronograma</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Garantia Contratual:</span>
              <span className="font-bold text-slate-900">{proposal.warrantyYears} anos de garantia</span>
            </div>
            <div className="col-span-2">
              <span className="text-[10px] text-slate-500 block">Condições de Pagamento:</span>
              <span className="text-slate-800">{proposal.paymentConditions}</span>
            </div>
          </div>

          {/* Termo de Aceite & Assinatura Digital do Contratante */}
          <div className="border-t-2 border-slate-900 pt-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
              5. Termo de Aceite, Homologação & Assinatura Digital
            </h2>

            {proposal.contractAcceptance?.signed ? (
              <div className="bg-emerald-50 border-2 border-emerald-500 rounded-xl p-4 text-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>CONTRATO HOMOLOGADO DIGITALMENTE</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                    Protocolo: {proposal.contractAcceptance.protocolHash}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div>
                    <p className="text-slate-700 text-[11px] leading-relaxed">
                      O contratante / responsável legal declara ter conferido as especificações técnicas, 
                      metodologia de balancins e planilha orçamentária, aprovando o início dos serviços.
                    </p>
                    <div className="mt-2 text-[11px] text-slate-800 space-y-0.5">
                      <p><strong>Signatário:</strong> {proposal.contractAcceptance.clientName}</p>
                      <p><strong>Cargo / Representação:</strong> {proposal.contractAcceptance.clientRole}</p>
                      <p><strong>CPF / Documento:</strong> {proposal.contractAcceptance.clientDocument}</p>
                      <p><strong>Assinado em:</strong> {new Date(proposal.contractAcceptance.signedAt).toLocaleString('pt-BR')}</p>
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
                  Aguardando assinatura digital do contratante/cliente na tela do aplicativo para homologação do contrato.
                </p>
              </div>
            )}
          </div>

          {/* Footer Signature of Renovar SC */}
          <div className="pt-6 border-t border-slate-200 flex justify-between items-end text-[11px] text-slate-600">
            <div>
              <p className="font-bold text-slate-900">RENOVAR SC - SOLUÇÕES PREDIAIS</p>
              <p className="text-[10px] text-slate-500">Departamento Operacional e Técnico</p>
            </div>
            <div className="text-right text-[10px] text-slate-400 font-mono">
              Documento emitido eletronicamente via Sistema Renovar SC • {proposal.protocol}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
