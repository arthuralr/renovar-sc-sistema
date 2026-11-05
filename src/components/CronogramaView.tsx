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
          <span className="text-[10px] font-semibold bg-[#0a192f] text-slate-200 border border-slate-700 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-amber-400" />
            Concluído
          </span>
        );
      case 'em_andamento':
        return (
          <span className="text-[10px] font-semibold bg-amber-400/10 text-amber-400 border border-amber-400/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Em Andamento
          </span>
        );
      case 'programado':
        return (
          <span className="text-[10px] font-medium bg-[#0a192f] text-slate-400 border border-slate-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-500" />
            Programado
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-nav">
      {/* Module Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <CalendarRange className="w-4 h-4 text-amber-400" />
            Cronograma Físico-Financeiro
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Planejamento semanal de canteiro • Semanas 1 a 12
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Export CSV Button */}
          <button
            type="button"
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs transition bg-amber-400 hover:bg-amber-300 text-slate-950 cursor-pointer"
            title="Exportar cronograma físico-financeiro para arquivo CSV estruturado"
          >
            {exportSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>CSV Baixado!</span>
              </>
            ) : (
              <>
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Exportar CSV</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0f2744] border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 transition cursor-pointer"
            title="Imprimir visualização"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Imprimir</span>
          </button>
        </div>
      </div>

      {/* Export Feedback Banner */}
      {exportSuccess && (
        <div className="p-3.5 rounded-xl bg-[#0f2744] border border-amber-400/30 text-slate-200 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>Arquivo CSV estruturado baixado com sucesso! Pronto para auditorias e relatórios de clientes.</span>
          </div>
          <span className="text-[10px] text-amber-400 font-mono bg-[#0a192f] px-2 py-0.5 rounded border border-slate-800">
            Excel / UTF-8
          </span>
        </div>
      )}

      {/* Top Control & Summary Grid: Stacked on Mobile, 12-Col Grid on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Obra Selector Dropdown */}
        <div className="lg:col-span-5 bg-[#0f2744] border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-2.5">
          <label className="block text-xs font-semibold text-slate-300">
            Canteiro de Obras Selecionado
          </label>
          <div className="relative">
            <select
              value={selectedObraId}
              onChange={(e) => {
                setSelectedObraId(e.target.value);
                setSelectedWeekFilter(null);
              }}
              className="w-full pl-3 pr-8 py-2.5 bg-[#0a192f] border border-slate-800 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-amber-400 appearance-none cursor-pointer"
            >
              {cronogramas.map((c) => (
                <option key={c.obraId} value={c.obraId}>
                  {c.obraName}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <span className="text-[10px] text-slate-400 hidden lg:block">
            Cronograma contratual homologado com o Contratante / Cliente
          </span>
        </div>

        {/* Financial & Time Summary Cards */}
        <div className="lg:col-span-7 grid grid-cols-2 gap-4 text-xs">
          {/* Physical Time Progress */}
          <div className="bg-[#0f2744] border border-slate-800 rounded-xl p-4 space-y-2 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] uppercase font-semibold tracking-wider">Tempo Decorrido</span>
              <Clock className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl lg:text-2xl font-bold text-white">
                Semana {activeCronograma.currentWeek}
              </span>
              <span className="text-xs text-slate-400">/ 12</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#0a192f] overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full"
                style={{ width: `${(activeCronograma.currentWeek / 12) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 font-medium block pt-0.5">
              {Math.round((activeCronograma.currentWeek / 12) * 100)}% da janela de execução
            </span>
          </div>

          {/* Financial Execution */}
          <div className="bg-[#0f2744] border border-slate-800 rounded-xl p-4 space-y-2 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] uppercase font-semibold tracking-wider">Avanço Financeiro</span>
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-lg lg:text-2xl font-bold text-white tracking-tight">
              {formatCurrency(activeCronograma.executedFinancial)}
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#0a192f] overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full"
                style={{
                  width: `${Math.round(
                    (activeCronograma.executedFinancial / activeCronograma.totalBudget) * 100
                  )}%`,
                }}
              />
            </div>
            <span className="text-[10px] text-slate-400 flex justify-between pt-0.5">
              <span>Orçamento: {formatCurrency(activeCronograma.totalBudget)}</span>
            </span>
          </div>
        </div>
      </div>

      {/* CSV Audit & Client Report Bar */}
      <div className="bg-[#0f2744] border border-slate-800 rounded-xl p-3.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#0a192f] border border-slate-800 flex items-center justify-center text-amber-400 flex-shrink-0">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-white block text-xs">
              Relatório Gerencial de Auditoria & Clientes (CSV)
            </span>
            <p className="text-[11px] text-slate-400">
              Planilha com avanço físico das 12 semanas, peso contratual e valores medidos
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0a192f] hover:bg-slate-800/80 border border-slate-700 text-amber-400 font-semibold text-[11px] transition cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Baixar CSV</span>
        </button>
      </div>

      {/* 12-Week Interactive Bar Grid (Gantt Navigation) */}
      <div className="bg-[#0f2744] border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Trilha de Semanas (Toque para filtrar frentes ativas)
          </span>
          {selectedWeekFilter !== null && (
            <button
              onClick={() => setSelectedWeekFilter(null)}
              className="text-[11px] text-amber-400 hover:underline cursor-pointer"
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
                className={`py-2 px-1 rounded-lg border flex flex-col items-center justify-center transition cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
                    : isCurrent
                    ? 'bg-amber-400/10 border-amber-400/50 text-amber-400 font-semibold'
                    : isPast
                    ? 'bg-[#0a192f] border-slate-700 text-slate-200 font-medium'
                    : 'bg-[#0a192f]/60 border-slate-800 text-slate-500 hover:border-slate-700'
                }`}
              >
                <span className="text-[10px] uppercase font-semibold tracking-tight">SEM</span>
                <span className="text-xs font-bold">{weekNum}</span>
                {isCurrent && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-0.5" />
                )}
                {isPast && !isCurrent && (
                  <span className="text-[9px] text-amber-400/80 mt-0.5 font-bold">✓</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-400" /> Semanas Concluídas
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> Semana Vigente ({activeCronograma.currentWeek})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-700" /> Programadas
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
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer ${
              filterStatus === tab.key
                ? 'bg-amber-400 text-slate-950 border-amber-400'
                : 'bg-[#0f2744] text-slate-400 border-slate-800 hover:text-white'
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
            className="bg-[#0f2744] border border-slate-800 rounded-xl p-5 space-y-3.5 hover:border-slate-700 transition"
          >
            {/* Stage Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-semibold bg-[#0a192f] text-amber-400 border border-slate-800 px-2 py-0.5 rounded">
                    Frente {String(stage.stageNumber).padStart(2, '0')} • Semanas {stage.startWeek} a {stage.endWeek}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {stage.category}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mt-1.5 leading-snug">
                  {stage.title}
                </h3>
              </div>

              <div>{getStatusBadge(stage.status)}</div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-300 leading-relaxed">
              {stage.description}
            </p>

            {/* Progress Bar & Financial Metric */}
            <div className="space-y-2 bg-[#0a192f] p-3.5 rounded-lg border border-slate-800 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[11px]">Progresso da Frente:</span>
                <span className="text-amber-400 font-bold">{stage.progressPercent}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300 bg-amber-400"
                  style={{ width: `${stage.progressPercent}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
                <span>Peso no Contrato: {stage.weightPercent}%</span>
                <span className="text-white font-semibold font-mono">
                  {formatCurrency(stage.financialAmount)}
                </span>
              </div>
            </div>

            {/* Critical Quality & Safety Checklist */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                Controle de Qualidade & Segurança de Canteiro:
              </span>
              <div className="space-y-1.5">
                {stage.criticalChecklist.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-[11px] text-slate-300 bg-[#0a192f]/70 px-3 py-1.5 rounded-lg border border-slate-800"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
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
