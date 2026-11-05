import React, { useState } from 'react';
import { ObraCronograma, CronogramaStage } from '../types';
import {
  CalendarRange,
  Calendar,
  CheckCircle2,
  Clock,
  Building,
  TrendingUp,
  DollarSign,
  ChevronDown,
  Layers,
  ShieldCheck,
  Printer,
  Share2,
  HardHat,
  Filter,
  CheckSquare,
  FileSpreadsheet,
  Download,
  Check
} from 'lucide-react';
import { exportCronogramaToCsv } from '../utils/csvExport';

interface CronogramaViewProps {
  cronogramas: ObraCronograma[];
  onUpdateStageProgress?: (obraId: string, stageId: string, newProgress: number) => void;
}

export const CronogramaView: React.FC<CronogramaViewProps> = ({
  cronogramas,
  onUpdateStageProgress,
}) => {
  const [selectedObraId, setSelectedObraId] = useState<string>(
    cronogramas[0]?.obraId || 'obr-01'
  );
  const [filterStatus, setFilterStatus] = useState<'todos' | 'em_andamento' | 'concluido' | 'programado'>('todos');
  const [selectedWeekFilter, setSelectedWeekFilter] = useState<number | null>(null);
  const [exportSuccess, setExportSuccess] = useState(false);

  const activeCronograma =
    cronogramas.find((c) => c.obraId === selectedObraId) || cronogramas[0];

  const handleExportCsv = () => {
    if (!activeCronograma) return;
    exportCronogramaToCsv(activeCronograma);
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 4000);
  };

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const filteredStages = (activeCronograma?.stages || []).filter((stg) => {
    if (filterStatus !== 'todos' && stg.status !== filterStatus) return false;
    if (selectedWeekFilter !== null) {
      return selectedWeekFilter >= stg.startWeek && selectedWeekFilter <= stg.endWeek;
    }
    return true;
  });

  const getStatusBadge = (status: CronogramaStage['status']) => {
    switch (status) {
      case 'concluido':
        return (
          <span className="text-[10px] font-semibold bg-slate-100 text-[#0f172a] border border-slate-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-amber-600" />
            Concluído
          </span>
        );
      case 'em_andamento':
        return (
          <span className="text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            Em Andamento
          </span>
        );
      case 'programado':
        return (
          <span className="text-[10px] font-medium bg-slate-50 text-slate-500 border border-slate-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            Programado
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-nav">
      {/* Module Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#0f172a] flex items-center gap-2">
            <CalendarRange className="w-4 h-4 text-amber-600" />
            Cronograma Físico-Financeiro
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Planejamento semanal de canteiro • Semanas 1 a 12
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Export CSV Button */}
          <button
            type="button"
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs transition bg-[#0a192f] hover:bg-slate-800 text-white cursor-pointer shadow-sm"
            title="Exportar cronograma físico-financeiro para arquivo CSV estruturado"
          >
            {exportSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-amber-400" />
                <span>CSV Baixado!</span>
              </>
            ) : (
              <>
                <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
                <span>Exportar CSV</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition cursor-pointer"
            title="Imprimir visualização"
          >
            <Printer className="w-3.5 h-3.5 text-[#0a192f]" />
            <span className="hidden sm:inline">Imprimir</span>
          </button>
        </div>
      </div>

      {/* Export Feedback Banner */}
      {exportSuccess && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-[#0f172a] text-xs font-medium flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Arquivo CSV estruturado baixado com sucesso! Pronto para auditorias e relatórios de clientes.</span>
          </div>
          <span className="text-[10px] text-amber-800 font-mono bg-white px-2 py-0.5 rounded border border-amber-200">
            Excel / UTF-8
          </span>
        </div>
      )}

      {/* Top Control & Summary Grid: Stacked on Mobile, 12-Col Grid on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Obra Selector Dropdown */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-2.5 shadow-sm">
          <label className="block text-xs font-bold text-slate-700">
            Canteiro de Obras Selecionado
          </label>
          <div className="relative">
            <select
              value={selectedObraId}
              onChange={(e) => {
                setSelectedObraId(e.target.value);
                setSelectedWeekFilter(null);
              }}
              className="w-full pl-3.5 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#0f172a] focus:bg-white focus:outline-none focus:border-[#0a192f] appearance-none cursor-pointer"
            >
              {cronogramas.map((c) => (
                <option key={c.obraId} value={c.obraId}>
                  {c.obraName}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <span className="text-[10px] text-slate-500 hidden lg:block">
            Cronograma contratual homologado com o Contratante / Cliente
          </span>
        </div>

        {/* Financial & Time Summary Cards */}
        <div className="lg:col-span-7 grid grid-cols-2 gap-4 text-xs">
          {/* Physical Time Progress */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-2 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] uppercase font-bold tracking-wider">Tempo Decorrido</span>
              <Clock className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl lg:text-2xl font-bold text-[#0f172a]">
                Semana {activeCronograma.currentWeek}
              </span>
              <span className="text-xs text-slate-500">/ 12</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-[#0a192f] rounded-full"
                style={{ width: `${(activeCronograma.currentWeek / 12) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 font-medium block pt-0.5">
              {Math.round((activeCronograma.currentWeek / 12) * 100)}% da janela de execução
            </span>
          </div>

          {/* Financial Execution */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-2 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] uppercase font-bold tracking-wider">Avanço Financeiro</span>
              <DollarSign className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="text-lg lg:text-2xl font-bold text-[#0f172a] tracking-tight">
              {formatCurrency(activeCronograma.executedFinancial)}
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-amber-600 rounded-full"
                style={{
                  width: `${Math.round(
                    (activeCronograma.executedFinancial / activeCronograma.totalBudget) * 100
                  )}%`,
                }}
              />
            </div>
            <span className="text-[10px] text-slate-500 flex justify-between pt-0.5">
              <span>Orçamento: {formatCurrency(activeCronograma.totalBudget)}</span>
            </span>
          </div>
        </div>
      </div>

      {/* CSV Audit & Client Report Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between text-xs shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-amber-600 flex-shrink-0">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-[#0f172a] block text-xs">
              Relatório Gerencial de Auditoria & Clientes (CSV)
            </span>
            <p className="text-[11px] text-slate-500">
              Planilha com avanço físico das 12 semanas, peso contratual e valores medidos
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#0a192f] font-bold text-[11px] transition cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-amber-600" />
          <span>Baixar CSV</span>
        </button>
      </div>

      {/* 12-Week Interactive Bar Grid (Gantt Navigation) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0a192f] flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            Trilha de Semanas (Toque para filtrar frentes ativas)
          </span>
          {selectedWeekFilter !== null && (
            <button
              onClick={() => setSelectedWeekFilter(null)}
              className="text-[11px] text-amber-700 font-semibold hover:underline cursor-pointer"
            >
              Ver Todas (Limpar Filtro)
            </button>
          )}
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 text-center text-xs">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((weekNum) => {
            const isCurrent = weekNum === activeCronograma.currentWeek;
            const isPast = weekNum < activeCronograma.currentWeek;
            const isSelected = selectedWeekFilter === weekNum;

            return (
              <button
                key={weekNum}
                onClick={() =>
                  setSelectedWeekFilter(selectedWeekFilter === weekNum ? null : weekNum)
                }
                className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center transition cursor-pointer ${
                  isSelected
                    ? 'bg-[#0a192f] text-white border-[#0a192f] font-bold shadow-sm'
                    : isCurrent
                    ? 'bg-amber-50 border-amber-300 text-amber-800 font-bold'
                    : isPast
                    ? 'bg-slate-50 border-slate-200 text-[#0f172a] font-semibold'
                    : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                }`}
              >
                <span className="text-[10px] uppercase font-semibold tracking-tight">SEM</span>
                <span className="text-xs font-bold">{weekNum}</span>
                {isCurrent && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-0.5" />
                )}
                {isPast && !isCurrent && (
                  <span className="text-[9px] text-amber-600 mt-0.5 font-bold">✓</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-100">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#0a192f]" /> Semanas Concluídas
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-600" /> Semana Vigente ({activeCronograma.currentWeek})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-300" /> Programadas
          </span>
        </div>
      </div>

      {/* Filter Tabs by Status */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { key: 'todos', label: 'Todas as Frentes' },
          { key: 'em_andamento', label: 'Em Andamento' },
          { key: 'concluido', label: 'Concluídas' },
          { key: 'programado', label: 'Programadas' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key as any)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
              filterStatus === tab.key
                ? 'bg-[#0a192f] text-white border-[#0a192f] shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:text-[#0f172a] hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Service Fronts List (Semana 1 a 12) — 2 columns on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredStages.map((stage) => (
          <div
            key={stage.id}
            className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3.5 hover:border-slate-300 transition shadow-sm"
          >
            {/* Stage Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold bg-slate-50 text-[#0a192f] border border-slate-200 px-2 py-0.5 rounded">
                    Frente {String(stage.stageNumber).padStart(2, '0')} • Semanas {stage.startWeek} a {stage.endWeek}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {stage.category}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#0f172a] mt-1.5 leading-snug">
                  {stage.title}
                </h3>
              </div>

              <div>{getStatusBadge(stage.status)}</div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-600 leading-relaxed">
              {stage.description}
            </p>

            {/* Progress Bar & Financial Metric */}
            <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 text-[11px] font-medium">Progresso da Frente:</span>
                <span className="text-amber-700 font-bold">{stage.progressPercent}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300 bg-[#0a192f]"
                  style={{ width: `${stage.progressPercent}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
                <span>Peso no Contrato: {stage.weightPercent}%</span>
                <span className="text-[#0f172a] font-bold font-mono">
                  {formatCurrency(stage.financialAmount)}
                </span>
              </div>
            </div>

            {/* Critical Quality & Safety Checklist */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Controle de Qualidade & Segurança de Canteiro:
              </span>
              <div className="space-y-1.5">
                {stage.criticalChecklist.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-[11px] text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-amber-600" />
                    <span className="leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
