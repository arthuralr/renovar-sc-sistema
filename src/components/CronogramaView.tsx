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
          <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Concluído
          </span>
        );
      case 'em_andamento':
        return (
          <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Em Andamento
          </span>
        );
      case 'programado':
        return (
          <span className="text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            Programado
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 pb-nav">
      {/* Module Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-1.5">
            <CalendarRange className="w-4 h-4 text-amber-400" />
            Cronograma Físico-Financeiro
          </h2>
          <p className="text-xs text-slate-400">
            Planejamento semanal de canteiro • Semanas 1 a 12
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Export CSV Button */}
          <button
            type="button"
            onClick={handleExportCsv}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition shadow-md active:scale-95 cursor-pointer ${
              exportSuccess
                ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-500/20'
            }`}
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
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#0f2744] border border-slate-700 hover:border-amber-400/50 text-xs font-semibold text-slate-200 transition cursor-pointer"
            title="Imprimir visualização"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Imprimir</span>
          </button>
        </div>
      </div>

      {/* Export Feedback Banner */}
      {exportSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Arquivo CSV estruturado baixado com sucesso! Pronto para auditorias e relatórios de clientes.</span>
          </div>
          <span className="text-[10px] text-emerald-200 font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
            Excel / UTF-8
          </span>
        </div>
      )}

      {/* Obra Selector Dropdown */}
      <div className="bg-[#0f2744] border border-amber-500/25 rounded-2xl p-3.5 shadow-lg space-y-2">
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
            className="w-full pl-3 pr-8 py-2 bg-[#0a192f] border border-slate-700 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-amber-400 appearance-none cursor-pointer"
          >
            {cronogramas.map((c) => (
              <option key={c.obraId} value={c.obraId}>
                {c.obraName}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Financial & Time Summary Cards */}
      <div className="grid grid-cols-2 gap-2.5 text-xs">
        {/* Physical Time Progress */}
        <div className="bg-[#0f2744] border border-slate-700/80 rounded-xl p-3 space-y-1.5 shadow">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-wider">Tempo Decorrido</span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-white">Semana {activeCronograma.currentWeek}</span>
            <span className="text-xs text-slate-400">/ 12</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
              style={{ width: `${(activeCronograma.currentWeek / 12) * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-amber-300 font-semibold block pt-0.5">
            {Math.round((activeCronograma.currentWeek / 12) * 100)}% da janela de execução
          </span>
        </div>

        {/* Financial Execution */}
        <div className="bg-[#0f2744] border border-emerald-500/30 rounded-xl p-3 space-y-1.5 shadow">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-wider">Avanço Financeiro</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg font-black text-emerald-400 tracking-tight">
            {formatCurrency(activeCronograma.executedFinancial)}
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
              style={{
                width: `${Math.round(
                  (activeCronograma.executedFinancial / activeCronograma.totalBudget) * 100
                )}%`,
              }}
            />
          </div>
          <span className="text-[10px] text-slate-300 flex justify-between pt-0.5">
            <span>Orçamento: {formatCurrency(activeCronograma.totalBudget)}</span>
          </span>
        </div>
      </div>

      {/* CSV Audit & Client Report Bar */}
      <div className="bg-[#0f2744] border border-slate-700/80 rounded-xl p-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <FileSpreadsheet className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-white block text-[11px]">
              Relatório Gerencial de Auditoria & Clientes (CSV)
            </span>
            <p className="text-[10px] text-slate-400">
              Planilha com avanço físico das 12 semanas, peso contratual e valores medidos
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-bold text-[11px] transition cursor-pointer"
        >
          <Download className="w-3 h-3" />
          <span>Baixar CSV</span>
        </button>
      </div>

      {/* 12-Week Interactive Bar Grid (Gantt Navigation) */}
      <div className="bg-[#0f2744] border border-amber-500/20 rounded-2xl p-3.5 shadow-xl space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Trilha de Semanas (Toque para filtrar frentes ativas)
          </span>
          {selectedWeekFilter !== null && (
            <button
              onClick={() => setSelectedWeekFilter(null)}
              className="text-[10px] text-amber-300 hover:underline cursor-pointer"
            >
              Ver Todas (Limpar Filtro)
            </button>
          )}
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 text-center text-xs">
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
                className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center transition active:scale-95 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 border-amber-400 font-black shadow-md'
                    : isCurrent
                    ? 'bg-amber-500/25 border-amber-400 text-amber-300 font-bold ring-1 ring-amber-400/50'
                    : isPast
                    ? 'bg-[#0a192f] border-emerald-500/30 text-emerald-400 font-medium'
                    : 'bg-[#0a192f] border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="text-[10px] uppercase font-bold tracking-tight">SEM</span>
                <span className="text-xs font-black">{weekNum}</span>
                {isCurrent && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-0.5 animate-ping" />
                )}
                {isPast && !isCurrent && (
                  <span className="text-[9px] text-emerald-400 mt-0.5 font-bold">✓</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Semanas Concluídas
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> Semana Vigente ({activeCronograma.currentWeek})
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-600" /> Programadas
          </span>
        </div>
      </div>

      {/* Filter Tabs by Status */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { key: 'todos', label: 'Todas as Frentes' },
          { key: 'em_andamento', label: 'Em Andamento' },
          { key: 'concluido', label: 'Concluídas' },
          { key: 'programado', label: 'Programadas' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key as any)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
              filterStatus === tab.key
                ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                : 'bg-[#0f2744] text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Service Fronts List (Semana 1 a 12) */}
      <div className="space-y-3">
        {filteredStages.map((stage) => (
          <div
            key={stage.id}
            className="bg-[#0f2744] border border-slate-700/80 rounded-2xl p-4 space-y-3 shadow-md hover:border-amber-400/40 transition"
          >
            {/* Stage Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold bg-[#0a192f] text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded">
                    Frente {String(stage.stageNumber).padStart(2, '0')} • Semanas {stage.startWeek} a {stage.endWeek}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {stage.category}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mt-1 leading-snug">
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
            <div className="space-y-1.5 bg-[#0a192f] p-3 rounded-xl border border-slate-800 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[11px]">Progresso da Frente:</span>
                <span className="text-amber-400 font-bold">{stage.progressPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    stage.progressPercent === 100
                      ? 'bg-emerald-400'
                      : 'bg-gradient-to-r from-amber-500 to-amber-300'
                  }`}
                  style={{ width: `${stage.progressPercent}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                <span>Peso no Contrato: {stage.weightPercent}%</span>
                <span className="text-emerald-400 font-bold font-mono">
                  {formatCurrency(stage.financialAmount)}
                </span>
              </div>
            </div>

            {/* Critical Quality & Safety Checklist */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Controle de Qualidade & Segurança de Canteiro:
              </span>
              <div className="space-y-1">
                {stage.criticalChecklist.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-[11px] text-slate-300 bg-[#0a192f]/60 px-2.5 py-1.5 rounded-lg border border-slate-800/80"
                  >
                    <CheckCircle2
                      className={`w-3.5 h-3.5 flex-shrink-0 ${
                        stage.progressPercent === 100 ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    />
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
