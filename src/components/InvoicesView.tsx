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
          <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Liquidada
          </span>
        );
      case 'emitida':
        return (
          <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" />
            Emitida
          </span>
        );
      case 'aguardando_retencao':
        return (
          <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-blue-400" />
            Aguardando Retenção
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 pb-nav">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-1.5">
            <ReceiptText className="w-4 h-4 text-amber-400" />
            Gestão Fiscal & NFS-e
          </h2>
          <p className="text-xs text-slate-400">
            Notas fiscais eletrônicas para tomadores de serviços e clientes
          </p>
        </div>

        <button
          onClick={() => setShowNewInvoiceModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Emitir NFS-e</span>
        </button>
      </div>

      {/* Fiscal Totals Bar — 2 cols on mobile, 4 cols on desktop */}
      <div className="bg-[#0f2744] border border-slate-700 rounded-2xl p-3.5 lg:p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
          <span className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5 text-amber-400" />
            Balanço Fiscal de Serviços
          </span>
          <span className="text-[10px] text-slate-400">SC • Simples / Lucro Presumido</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
          <div className="bg-[#0a192f] p-2.5 lg:p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400">Faturamento Bruto</span>
            <p className="text-base lg:text-lg font-black text-white">{formatCurrency(totalGross)}</p>
          </div>
          <div className="bg-[#0a192f] p-2.5 lg:p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400">Total Líquido a Receber</span>
            <p className="text-base lg:text-lg font-black text-emerald-400">{formatCurrency(totalNet)}</p>
          </div>
          <div className="bg-[#0a192f] p-2.5 lg:p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400">Retenção INSS (11%)</span>
            <p className="text-sm lg:text-base font-bold text-amber-400">{formatCurrency(totalInss)}</p>
          </div>
          <div className="bg-[#0a192f] p-2.5 lg:p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400">ISS Retido (2%~3%)</span>
            <p className="text-sm lg:text-base font-bold text-amber-400">{formatCurrency(totalIss)}</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por contratante, cliente, cidade ou nº da nota..."
            className="w-full pl-9 pr-3 py-2 bg-[#0f2744] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {[
            { key: 'todos', label: 'Todas' },
            { key: 'emitida', label: 'Emitidas' },
            { key: 'paga', label: 'Liquidadas' },
            { key: 'aguardando_retencao', label: 'Aguardando Retenção' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key as any)}
              className={`flex-shrink-0 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                statusFilter === tab.key
                  ? 'bg-amber-400 text-slate-950 border-amber-400'
                  : 'bg-[#0f2744] text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices List — 1 col on mobile, 2 cols on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        {filteredInvoices.map((inv) => (
          <div
            key={inv.id}
            onClick={() => setSelectedInvoiceModal(inv)}
            className="bg-[#0f2744] hover:bg-[#14294b] border border-slate-700/80 hover:border-amber-400/50 rounded-xl p-3.5 cursor-pointer transition shadow-md"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/30">
                    NFS-e nº {inv.invoiceNumber}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {inv.rpsNumber}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mt-1.5">{inv.condoName}</h4>
                <p className="text-[11px] text-slate-400">
                  CNPJ: {inv.condoCnpj} • {inv.city}
                </p>
              </div>

              <div>{getStatusBadge(inv.status)}</div>
            </div>

            <div className="bg-[#0a192f] p-2 rounded-lg text-xs mb-2 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Referência da Medição:</span>
              <p className="text-white font-medium truncate">{inv.measurementReference}</p>
            </div>

            <div className="grid grid-cols-3 gap-1 text-[11px] pt-1 border-t border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 block">Valor Bruto</span>
                <span className="font-bold text-white">{formatCurrency(inv.grossAmount)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Retenções (INSS+ISS)</span>
                <span className="font-semibold text-rose-400">
                  - {formatCurrency(inv.inssRetentionAmount + inv.issRetentionAmount)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Valor Líquido</span>
                <span className="font-bold text-emerald-400">{formatCurrency(inv.netAmount)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DANFSE Detailed Modal */}
      {selectedInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#0f2744] border border-amber-500/40 shadow-2xl text-slate-100 max-h-[92vh] flex flex-col overflow-hidden">
            <div className="p-3.5 border-b border-slate-700 flex items-center justify-between bg-[#0a192f]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  DANFSE • NFS-e nº {selectedInvoiceModal.invoiceNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInvoiceModal(null)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3.5 overflow-y-auto text-xs">
              {/* Official Header Simulation */}
              <div className="bg-[#0a192f] p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-white">
                  <span>PREFEITURA MUNICIPAL DE {selectedInvoiceModal.city.toUpperCase()}</span>
                  <span className="text-amber-400">{selectedInvoiceModal.rpsNumber}</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Secretaria da Fazenda • Nota Fiscal de Serviços Eletrônica
                </p>
                <div className="pt-1 text-[10px] font-mono text-slate-300">
                  Cód. Verificação: <strong className="text-amber-300">{selectedInvoiceModal.verificationCode}</strong>
                </div>
              </div>

              {/* Prestador */}
              <div className="bg-[#0a192f] p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                  Prestador de Serviços
                </span>
                <p className="font-bold text-white">RENOVAR SC SOLUÇÕES PREDIAIS LTDA</p>
                <p className="text-slate-400">CNPJ: 34.819.520/0001-90 • IM: 149.201-8</p>
                <p className="text-slate-400">Atividade: 7112-0/00 - Serviços de Engenharia & Restauração</p>
              </div>

              {/* Tomador (Cliente / Contratante) */}
              <div className="bg-[#0a192f] p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                  Tomador de Serviços (Contratante)
                </span>
                <p className="font-bold text-white">{selectedInvoiceModal.condoName}</p>
                <p className="text-slate-400">CNPJ: {selectedInvoiceModal.condoCnpj}</p>
                <p className="text-slate-400">Local: {selectedInvoiceModal.condoAddress}</p>
              </div>

              {/* Discriminação dos Serviços */}
              <div className="bg-[#0a192f] p-3 rounded-xl border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                  Discriminação dos Serviços Prestados
                </span>
                <p className="text-white font-semibold">{selectedInvoiceModal.measurementReference}</p>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {selectedInvoiceModal.serviceDescription}
                </p>
              </div>

              {/* Valores e Retenções */}
              <div className="bg-[#0a192f] p-3 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-white font-bold pb-2 border-b border-slate-800">
                  <span>VALOR TOTAL DOS SERVIÇOS:</span>
                  <span>{formatCurrency(selectedInvoiceModal.grossAmount)}</span>
                </div>

                <div className="space-y-1 text-slate-300 text-[11px]">
                  <div className="flex justify-between">
                    <span>(-) Retenção INSS Cessão de Mão de Obra (11%):</span>
                    <span className="text-rose-400 font-semibold">
                      - {formatCurrency(selectedInvoiceModal.inssRetentionAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>(-) Retenção ISSQN Municipal ({selectedInvoiceModal.issRetentionRate}%):</span>
                    <span className="text-rose-400 font-semibold">
                      - {formatCurrency(selectedInvoiceModal.issRetentionAmount)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-base font-black text-emerald-400 pt-2 border-t border-slate-800">
                  <span>VALOR LÍQUIDO DA NFS-E:</span>
                  <span>{formatCurrency(selectedInvoiceModal.netAmount)}</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-3 bg-[#0a192f] border-t border-slate-700/80 flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
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
                className="flex-1 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Enviar p/ Contratante</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Invoice Emission Modal */}
      {showNewInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#0f2744] border border-amber-500/40 shadow-2xl text-slate-100 max-h-[92vh] flex flex-col overflow-hidden">
            <div className="p-3.5 border-b border-slate-700 flex items-center justify-between bg-[#0a192f]">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-amber-400" />
                Emissão de NFS-e de Medição
              </h3>
              <button
                onClick={() => setShowNewInvoiceModal(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="p-4 space-y-3 overflow-y-auto text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Contratante / Tomador
                </label>
                <input
                  type="text"
                  value={newCondoName}
                  onChange={(e) => setNewCondoName(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-[#0a192f] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">CNPJ</label>
                  <input
                    type="text"
                    value={newCnpj}
                    onChange={(e) => setNewCnpj(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-[#0a192f] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Município (SC)</label>
                  <select
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0a192f] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Balneário Camboriú">Balneário Camboriú (ISS 2.5%)</option>
                    <option value="Itajaí">Itajaí (ISS 2.0%)</option>
                    <option value="Florianópolis">Florianópolis (ISS 3.0%)</option>
                    <option value="Itapema">Itapema (ISS 2.5%)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Valor Bruto da Medição (R$)
                </label>
                <input
                  type="number"
                  step="100"
                  value={newGrossAmount}
                  onChange={(e) => setNewGrossAmount(parseFloat(e.target.value) || 0)}
                  required
                  className="w-full px-3 py-2 bg-[#0a192f] border border-slate-700 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Identificação da Medição de Obra
                </label>
                <input
                  type="text"
                  value={newMeasurement}
                  onChange={(e) => setNewMeasurement(e.target.value)}
                  placeholder="Ex: 3ª Medição - Conclusão Fachada Sul"
                  required
                  className="w-full px-3 py-2 bg-[#0a192f] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Discriminação Técnica
                </label>
                <textarea
                  rows={2}
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0a192f] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              {/* Automatic Calculation Preview */}
              <div className="bg-[#0a192f] p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Retenção INSS (11%):</span>
                  <span>- {formatCurrency(newGrossAmount * 0.11)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Retenção ISS Municipal:</span>
                  <span>
                    - {formatCurrency(newGrossAmount * (newCity === 'Balneário Camboriú' ? 0.025 : 0.02))}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-emerald-400 pt-1 border-t border-slate-800">
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
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs shadow-md active:scale-95 transition"
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
