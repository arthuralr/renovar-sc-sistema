import React, { useState } from 'react';
import { Invoice } from '../types';
import {
  ReceiptText,
  Search,
  Filter,
  Download,
  FileCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building,
  Plus,
  X,
  Share2,
  ExternalLink,
  Printer,
  FileText
} from 'lucide-react';

interface InvoicesViewProps {
  invoices: Invoice[];
  onAddInvoice: (inv: Invoice) => void;
}

export const InvoicesView: React.FC<InvoicesViewProps> = ({
  invoices,
  onAddInvoice,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'emitida' | 'paga' | 'aguardando_retencao'>('todos');
  const [selectedInvoiceModal, setSelectedInvoiceModal] = useState<Invoice | null>(null);
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);

  // Form states for new invoice
  const [newCondoName, setNewCondoName] = useState('Condomínio Royal Palace');
  const [newCnpj, setNewCnpj] = useState('08.412.980/0001-34');
  const [newCity, setNewCity] = useState('Balneário Camboriú');
  const [newGrossAmount, setNewGrossAmount] = useState<number>(27000);
  const [newMeasurement, setNewMeasurement] = useState('3ª Medição - Conclusão Fachada Sul');
  const [newServiceDesc, setNewServiceDesc] = useState(
    'Recuperação de pastilhas cerâmicas e aplicação de selante de poliuretano nas juntas perimetrais.'
  );

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.condoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.invoiceNumber.includes(searchTerm) ||
      inv.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'todos' ? true : inv.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalGross = invoices.reduce((acc, curr) => acc + curr.grossAmount, 0);
  const totalInss = invoices.reduce((acc, curr) => acc + curr.inssRetentionAmount, 0);
  const totalIss = invoices.reduce((acc, curr) => acc + curr.issRetentionAmount, 0);
  const totalNet = invoices.reduce((acc, curr) => acc + curr.netAmount, 0);

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();

    const inssRate = 11.0;
    const issRate = newCity === 'Balneário Camboriú' ? 2.5 : newCity === 'Florianópolis' ? 3.0 : 2.0;

    const inssAmount = Math.round(newGrossAmount * (inssRate / 100));
    const issAmount = Math.round(newGrossAmount * (issRate / 100));
    const netAmount = newGrossAmount - inssAmount - issAmount;

    const nextNumber = String(invoices.length + 285).padStart(8, '0');

    const newInv: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: nextNumber,
      rpsNumber: `RPS ${invoices.length + 313}`,
      verificationCode: `${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      condoName: newCondoName,
      condoCnpj: newCnpj,
      condoAddress: `${newCity}, SC`,
      city: newCity,
      serviceDescription: newServiceDesc,
      grossAmount: newGrossAmount,
      inssRetentionRate: inssRate,
      inssRetentionAmount: inssAmount,
      issRetentionRate: issRate,
      issRetentionAmount: issAmount,
      netAmount,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      status: 'emitida',
      measurementReference: newMeasurement,
    };

    onAddInvoice(newInv);
    setShowNewInvoiceModal(false);
  };

  const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'paga':
        return (
          <span className="text-[10px] font-semibold bg-slate-100 text-[#0f172a] border border-slate-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-amber-600" />
            Liquidada
          </span>
        );
      case 'emitida':
        return (
          <span className="text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" />
            Emitida
          </span>
        );
      case 'aguardando_retencao':
        return (
          <span className="text-[10px] font-medium bg-slate-50 text-slate-600 border border-slate-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-slate-500" />
            Aguardando Retenção
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-nav">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#0f172a] flex items-center gap-2">
            <ReceiptText className="w-4 h-4 text-amber-600" />
            Gestão Fiscal & NFS-e
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Notas fiscais eletrônicas para tomadores de serviços e clientes
          </p>
        </div>

        <button
          onClick={() => setShowNewInvoiceModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0a192f] hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Emitir NFS-e</span>
        </button>
      </div>

      {/* Fiscal Totals Bar — 2 cols on mobile, 4 cols on desktop */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between text-xs border-b border-slate-200 pb-3">
          <span className="font-bold text-[#0a192f] uppercase tracking-wider text-[11px] flex items-center gap-2">
            <FileCheck className="w-3.5 h-3.5 text-amber-600" />
            Balanço Fiscal de Serviços
          </span>
          <span className="text-[10px] text-slate-500">SC • Simples / Lucro Presumido</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-semibold">Faturamento Bruto</span>
            <p className="text-base lg:text-lg font-bold text-[#0f172a] mt-0.5">{formatCurrency(totalGross)}</p>
          </div>
          <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200">
            <span className="text-[10px] text-amber-800 font-semibold">Total Líquido a Receber</span>
            <p className="text-base lg:text-lg font-bold text-amber-800 mt-0.5">{formatCurrency(totalNet)}</p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-semibold">Retenção INSS (11%)</span>
            <p className="text-sm lg:text-base font-bold text-slate-700 mt-0.5">{formatCurrency(totalInss)}</p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-semibold">ISS Retido (2%~3%)</span>
            <p className="text-sm lg:text-base font-bold text-slate-700 mt-0.5">{formatCurrency(totalIss)}</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por contratante, cliente, cidade ou nº da nota..."
            className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-[#0f172a] placeholder-slate-400 focus:outline-none focus:border-[#0a192f] shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {[
            { key: 'todos', label: 'Todas' },
            { key: 'emitida', label: 'Emitidas' },
            { key: 'paga', label: 'Liquidadas' },
            { key: 'aguardando_retencao', label: 'Aguardando Retenção' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key as any)}
              className={`flex-shrink-0 px-3.5 py-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                statusFilter === tab.key
                  ? 'bg-[#0a192f] text-white border-[#0a192f] shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:text-[#0f172a] hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices List — 1 col on mobile, 2 cols on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredInvoices.map((inv) => (
          <div
            key={inv.id}
            onClick={() => setSelectedInvoiceModal(inv)}
            className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 cursor-pointer transition shadow-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#0a192f] bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                    NFS-e nº {inv.invoiceNumber}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {inv.rpsNumber}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#0f172a] mt-1.5">{inv.condoName}</h4>
                <p className="text-[11px] text-slate-500">
                  CNPJ: {inv.condoCnpj} • {inv.city}
                </p>
              </div>

              <div>{getStatusBadge(inv.status)}</div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl text-xs mb-3 border border-slate-200">
              <span className="text-slate-500 text-[10px] block">Referência da Medição:</span>
              <p className="text-[#0f172a] font-semibold truncate">{inv.measurementReference}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[11px] pt-2.5 border-t border-slate-100">
              <div>
                <span className="text-[10px] text-slate-500 block">Valor Bruto</span>
                <span className="font-bold text-[#0f172a]">{formatCurrency(inv.grossAmount)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Retenções (INSS+ISS)</span>
                <span className="font-medium text-slate-600">
                  - {formatCurrency(inv.inssRetentionAmount + inv.issRetentionAmount)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">Valor Líquido</span>
                <span className="font-bold text-amber-700">{formatCurrency(inv.netAmount)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DANFSE Detailed Modal */}
      {selectedInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-sm p-3 sm:p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl text-[#0f172a] max-h-[92vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-[#0f172a]">
                  DANFSE • NFS-e nº {selectedInvoiceModal.invoiceNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInvoiceModal(null)}
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-[#0f172a] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3.5 overflow-y-auto text-xs">
              {/* Official Header Simulation */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-[#0f172a]">
                  <span>PREFEITURA MUNICIPAL DE {selectedInvoiceModal.city.toUpperCase()}</span>
                  <span className="text-amber-700">{selectedInvoiceModal.rpsNumber}</span>
                </div>
                <p className="text-[10px] text-slate-500">
                  Secretaria da Fazenda • Nota Fiscal de Serviços Eletrônica
                </p>
                <div className="pt-1 text-[10px] font-mono text-slate-600">
                  Cód. Verificação: <strong className="text-[#0a192f]">{selectedInvoiceModal.verificationCode}</strong>
                </div>
              </div>

              {/* Prestador */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-[#0a192f] uppercase tracking-wider block">
                  Prestador de Serviços
                </span>
                <p className="font-bold text-[#0f172a]">RENOVAR SC SOLUÇÕES PREDIAIS LTDA</p>
                <p className="text-slate-600">CNPJ: 57.293.244/0001-27 • IM: 149.201-8</p>
                <p className="text-slate-600">Atividade: 7112-0/00 - Serviços de Engenharia & Restauração</p>
              </div>

              {/* Tomador (Cliente / Contratante) */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-[#0a192f] uppercase tracking-wider block">
                  Tomador de Serviços (Contratante)
                </span>
                <p className="font-bold text-[#0f172a]">{selectedInvoiceModal.condoName}</p>
                <p className="text-slate-600">CNPJ: {selectedInvoiceModal.condoCnpj}</p>
                <p className="text-slate-600">Local: {selectedInvoiceModal.condoAddress}</p>
              </div>

              {/* Discriminação dos Serviços */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold text-[#0a192f] uppercase tracking-wider block">
                  Discriminação dos Serviços Prestados
                </span>
                <p className="text-[#0f172a] font-bold">{selectedInvoiceModal.measurementReference}</p>
                <p className="text-slate-700 leading-relaxed text-[11px]">
                  {selectedInvoiceModal.serviceDescription}
                </p>
              </div>

              {/* Valores e Retenções */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between text-[#0f172a] font-bold pb-2 border-b border-slate-200">
                  <span>VALOR TOTAL DOS SERVIÇOS:</span>
                  <span>{formatCurrency(selectedInvoiceModal.grossAmount)}</span>
                </div>

                <div className="space-y-1 text-slate-600 text-[11px]">
                  <div className="flex justify-between">
                    <span>(-) Retenção INSS Cessão de Mão de Obra (11%):</span>
                    <span className="text-[#0f172a] font-semibold">
                      - {formatCurrency(selectedInvoiceModal.inssRetentionAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>(-) Retenção ISSQN Municipal ({selectedInvoiceModal.issRetentionRate}%):</span>
                    <span className="text-[#0f172a] font-semibold">
                      - {formatCurrency(selectedInvoiceModal.issRetentionAmount)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-base font-bold text-amber-700 pt-2 border-t border-slate-200">
                  <span>VALOR LÍQUIDO DA NFS-E:</span>
                  <span>{formatCurrency(selectedInvoiceModal.netAmount)}</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-[#0f172a] font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-[#0a192f]" />
                <span>Imprimir DANFSE</span>
              </button>

              <button
                onClick={() => {
                  const msg = `*RENOVAR SC - EMISSÃO DE NFS-E*\n\n` +
                    `*Nota Fiscal Eletrônica nº:* ${selectedInvoiceModal.invoiceNumber}\n` +
                    `*Tomador:* ${selectedInvoiceModal.condoName}\n` +
                    `*Referência:* ${selectedInvoiceModal.measurementReference}\n` +
                    `*Valor Bruto:* ${formatCurrency(selectedInvoiceModal.grossAmount)}\n` +
                    `*Valor Líquido:* ${formatCurrency(selectedInvoiceModal.netAmount)}\n` +
                    `*Vencimento:* ${selectedInvoiceModal.dueDate}`;
                  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#0a192f] hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Share2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Enviar p/ Contratante</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Invoice Emission Modal */}
      {showNewInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-sm p-3 sm:p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl text-[#0f172a] max-h-[92vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-[#0f172a] flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-600" />
                Emissão de NFS-e de Medição
              </h3>
              <button
                onClick={() => setShowNewInvoiceModal(false)}
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-[#0f172a] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="p-4 space-y-3.5 overflow-y-auto text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Contratante / Tomador
                </label>
                <input
                  type="text"
                  value={newCondoName}
                  onChange={(e) => setNewCondoName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[#0f172a] focus:bg-white focus:outline-none focus:border-[#0a192f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">CNPJ</label>
                  <input
                    type="text"
                    value={newCnpj}
                    onChange={(e) => setNewCnpj(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[#0f172a] focus:bg-white focus:outline-none focus:border-[#0a192f]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Município (SC)</label>
                  <select
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[#0f172a] focus:bg-white focus:outline-none focus:border-[#0a192f]"
                  >
                    <option value="Balneário Camboriú">Balneário Camboriú (ISS 2.5%)</option>
                    <option value="Itajaí">Itajaí (ISS 2.0%)</option>
                    <option value="Florianópolis">Florianópolis (ISS 3.0%)</option>
                    <option value="Itapema">Itapema (ISS 2.5%)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Valor Bruto da Medição (R$)
                </label>
                <input
                  type="number"
                  step="100"
                  value={newGrossAmount}
                  onChange={(e) => setNewGrossAmount(parseFloat(e.target.value) || 0)}
                  required
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[#0f172a] font-bold text-sm focus:bg-white focus:outline-none focus:border-[#0a192f]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Identificação da Medição de Obra
                </label>
                <input
                  type="text"
                  value={newMeasurement}
                  onChange={(e) => setNewMeasurement(e.target.value)}
                  placeholder="Ex: 3ª Medição - Conclusão Fachada Sul"
                  required
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[#0f172a] focus:bg-white focus:outline-none focus:border-[#0a192f]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Discriminação Técnica
                </label>
                <textarea
                  rows={2}
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[#0f172a] focus:bg-white focus:outline-none focus:border-[#0a192f] resize-none"
                />
              </div>

              {/* Automatic Calculation Preview */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Retenção INSS (11%):</span>
                  <span>- {formatCurrency(newGrossAmount * 0.11)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Retenção ISS Municipal:</span>
                  <span>
                    - {formatCurrency(newGrossAmount * (newCity === 'Balneário Camboriú' ? 0.025 : 0.02))}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-amber-700 pt-1.5 border-t border-slate-200">
                  <span>Valor Líquido Estimado:</span>
                  <span>
                    {formatCurrency(
                      newGrossAmount -
                        newGrossAmount * 0.11 -
                        newGrossAmount * (newCity === 'Balneário Camboriú' ? 0.025 : 0.02)
                    )}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#0a192f] hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer shadow-sm"
              >
                Gerar e Transmitir NFS-e
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
