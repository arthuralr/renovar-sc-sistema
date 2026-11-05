import React, { useState } from 'react';
import { FinancialStats, Obra, User } from '../types';
import { TabKey } from './BottomNav';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Building,
  ArrowUpRight,
  Wind,
  ShieldCheck,
  Camera,
  Sparkles,
  UserCheck,
  MapPin,
  ChevronRight,
  DollarSign,
  CalendarRange,
} from 'lucide-react';

interface DashboardViewProps {
  user: User;
  financialStats: FinancialStats;
  obras: Obra[];
  onNavigateTab: (tab: TabKey) => void;
  onOpenQuickPhoto?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  financialStats,
  obras,
  onNavigateTab,
  onOpenQuickPhoto,
}) => {
  const [selectedObraModal, setSelectedObraModal] = useState<Obra | null>(null);

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const totalAreaM2 = obras.reduce((acc, o) => acc + o.facadeAreaM2, 0);
  const totalCrew = obras.reduce((acc, o) => acc + o.crewCount, 0);

  return (
    <div className="space-y-6 lg:space-y-7 pb-nav lg:pb-8">
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 lg:p-6 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-[0.04] pointer-events-none">
          <Building className="w-36 h-36 lg:w-48 lg:h-48 text-[#0a192f]" />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center justify-between lg:justify-start gap-3 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                Canteiro Conectado • SC
              </span>
              <span className="text-[10px] text-slate-600 bg-slate-50 px-2.5 py-0.5 rounded-md border border-slate-200 font-medium">
                {new Date().toLocaleDateString('pt-BR', {
                  weekday: 'short',
                  day: '2-digit',
                  month: 'short',
                })}
              </span>
            </div>
            <h2 className="text-lg lg:text-2xl font-bold text-[#0f172a]">
              Olá, <span className="text-amber-700">{user.name.split(' ')[0]}</span>
            </h2>
            <p className="text-xs lg:text-sm text-slate-500 mt-0.5">
              Painel Operacional • {user.roleLabel} — Gestão de Fachadas e Obras Corporativas
            </p>
          </div>

          {/* Desktop Executive Summary Pills */}
          <div className="hidden lg:grid grid-cols-3 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                Área Sob Gestão
              </span>
              <span className="text-base font-bold text-[#0f172a] font-mono">
                {totalAreaM2.toLocaleString('pt-BR')} m²
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                Efetivo em Altura
              </span>
              <span className="text-base font-bold text-[#0f172a] font-mono">
                {totalCrew} operadores
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                Segurança NR-35
              </span>
              <span className="text-base font-bold text-amber-700">100% Aprovado</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Financial Indicators Cards — 2 cols on mobile, 4 cols on desktop */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f172a] flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-amber-600" />
            Indicadores Financeiros Reais
          </h3>
          <span className="text-[10px] text-slate-500 font-medium">Ciclo Operacional Vigente</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {/* Entradas: R$ 27.000,00 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-xs font-semibold">Entradas</span>
              <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200 text-[#0a192f] flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
              </div>
            </div>
            <div className="text-base sm:text-lg lg:text-xl font-bold text-[#0f172a] tracking-tight">
              {formatCurrency(financialStats.entradas)}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1">
              <span>Medições liquidadas</span>
            </div>
          </div>

          {/* Saídas: R$ 14.100,00 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-xs font-semibold">Saídas</span>
              <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 flex items-center justify-center">
                <TrendingDown className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-base sm:text-lg lg:text-xl font-bold text-slate-700 tracking-tight">
              {formatCurrency(financialStats.saidas)}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1">
              <span>Insumos & Folha Campo</span>
            </div>
          </div>

          {/* A Receber: R$ 18.200,00 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-xs font-semibold">A Receber</span>
              <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 flex items-center justify-center">
                <Clock className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-base sm:text-lg lg:text-xl font-bold text-slate-700 tracking-tight">
              {formatCurrency(financialStats.aReceber)}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1">
              <span>NFS-e em compensação</span>
            </div>
          </div>

          {/* Resultado de Obra: R$ 12.900,00 */}
          <div className="bg-white border border-amber-300 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-600 mb-1.5">
              <span className="text-xs font-bold text-[#0a192f]">Resultado Obra</span>
              <div className="w-7 h-7 rounded-lg bg-[#0a192f] text-amber-400 font-bold flex items-center justify-center">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-base sm:text-lg lg:text-xl font-bold text-amber-700 tracking-tight">
              {formatCurrency(financialStats.resultadoObra)}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-600 font-medium mt-1">
              <span>Margem líquida +47,7%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Responsive Grid: Single-column on mobile, 12-column Dashboard on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
        {/* Left Operational Column on Desktop (Cronograma + Shortcuts + Wind Widget) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Featured Card: Cronograma Físico-Financeiro (Semanas 1 a 12) */}
          <div
            onClick={() => onNavigateTab('cronograma')}
            className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-sm cursor-pointer transition group"
          >
            <div className="flex items-start justify-between mb-3.5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0a192f] text-amber-400 flex items-center justify-center font-bold">
                  <CalendarRange className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#0f172a] group-hover:text-amber-700 transition">
                      Cronograma Físico-Financeiro
                    </h4>
                    <span className="text-[9px] bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded font-bold">
                      12 SEMANAS
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Planejamento Semanas 1 a 12 • Frentes de Serviço
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0f172a] transition" />
            </div>

            {/* Mini progress milestone bar */}
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
              <div className="flex justify-between text-[11px] text-slate-700 mb-1.5 font-medium">
                <span>Obra Ativa: Condomínio Royal Palace</span>
                <span className="text-amber-700 font-bold">Semana 8 de 12 (74%)</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-[#0a192f] rounded-full"
                  style={{ width: '74%' }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-2">
                <span>Frente: Tratamento de Armaduras & Juntas MS</span>
                <span className="text-[#0f172a] font-semibold">R$ 107.300 executados</span>
              </div>
            </div>
          </div>

          {/* Quick Field Shortcuts */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f172a] mb-2.5">
              Atalhos Rápidos de Operação
            </h3>
            <div className="grid grid-cols-4 gap-2.5">
              {/* Novo Laudo */}
              <button
                onClick={() => {
                  if (onOpenQuickPhoto) onOpenQuickPhoto();
                  else onNavigateTab('photos');
                }}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-center transition cursor-pointer shadow-sm"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-50 text-[#0a192f] flex items-center justify-center mb-1.5 border border-slate-200">
                  <Camera className="w-4 h-4 text-amber-600" />
                </div>
                <span className="text-[11px] font-bold text-[#0f172a] leading-tight">Novo Laudo</span>
                <span className="text-[9px] text-slate-500 mt-0.5">Com Foto</span>
              </button>

              {/* Gerador IA */}
              <button
                onClick={() => onNavigateTab('budget')}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-center transition cursor-pointer shadow-sm"
              >
                <div className="w-9 h-9 rounded-lg bg-[#0a192f] text-amber-400 flex items-center justify-center mb-1.5 font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-[#0f172a] leading-tight">Orçamento</span>
                <span className="text-[9px] text-amber-700 font-semibold mt-0.5">Memorial IA</span>
              </button>

              {/* Cronograma */}
              <button
                onClick={() => onNavigateTab('cronograma')}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-center transition cursor-pointer shadow-sm"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-50 text-[#0a192f] flex items-center justify-center mb-1.5 border border-slate-200">
                  <CalendarRange className="w-4 h-4 text-amber-600" />
                </div>
                <span className="text-[11px] font-bold text-[#0f172a] leading-tight">Cronograma</span>
                <span className="text-[9px] text-slate-500 mt-0.5">12 Semanas</span>
              </button>

              {/* Bater Ponto */}
              <button
                onClick={() => onNavigateTab('timesheet')}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-center transition cursor-pointer shadow-sm"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-50 text-[#0a192f] flex items-center justify-center mb-1.5 border border-slate-200">
                  <UserCheck className="w-4 h-4 text-amber-600" />
                </div>
                <span className="text-[11px] font-bold text-[#0f172a] leading-tight">Ponto</span>
                <span className="text-[9px] text-slate-500 mt-0.5">Jornada GPS</span>
              </button>
            </div>
          </div>

          {/* Safety & NR-35 Coastal Wind Condition Widget */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between text-xs shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 text-amber-600 flex items-center justify-center flex-shrink-0">
                <Wind className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-[#0f172a] flex items-center gap-2">
                  <span>Vento Litoral SC: 14 km/h</span>
                  <span className="text-[9px] bg-slate-100 text-[#0a192f] border border-slate-200 px-1.5 py-0.5 rounded font-semibold">
                    OPERACIONAL
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Balancins e trabalho em altura liberados (Limite NR-35: 35 km/h)
                </p>
              </div>
            </div>
            <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0" />
          </div>
        </div>

        {/* Right Column on Desktop: Active Obras / Canteiros Grid */}
        <div className="lg:col-span-7">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f172a] flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-amber-600" />
              Obras e Canteiros sob Gestão ({obras.filter((o) => o.status === 'em_andamento').length} em execução)
            </h3>
            <span className="text-[10px] text-slate-500">Santa Catarina</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {obras.map((obra) => (
              <div
                key={obra.id}
                onClick={() => setSelectedObraModal(obra)}
                className="bg-white hover:bg-slate-50/60 border border-slate-200 hover:border-slate-300 rounded-2xl p-4.5 p-4 cursor-pointer transition shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-[#0f172a] flex flex-wrap items-center gap-1.5">
                        <span>{obra.name}</span>
                        {obra.status === 'concluida' ? (
                          <span className="text-[9px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 px-1.5 py-0.5 rounded">
                            CONCLUÍDA
                          </span>
                        ) : (
                          <span className="text-[9px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded">
                            EM EXECUÇÃO
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-amber-600 flex-shrink-0" />
                        <span>
                          {obra.location} • {obra.city}
                        </span>
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0 mt-1" />
                  </div>

                  {/* Pathology tag */}
                  <div className="bg-slate-50 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-700 border border-slate-200 mb-3 truncate">
                    <span className="font-semibold text-slate-500">Escopo: </span>
                    {obra.primaryPathology}
                  </div>
                </div>

                <div>
                  {/* Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-700 mb-1.5 font-medium">
                      <span>Avanço Físico de Obra</span>
                      <span className="text-amber-700 font-bold">{obra.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#0a192f] transition-all duration-500"
                        style={{ width: `${obra.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-3 pt-2.5 border-t border-slate-100">
                    <span>
                      {obra.towers} torre(s) • {obra.floors} pav. ({obra.facadeAreaM2.toLocaleString('pt-BR')} m²)
                    </span>
                    <span className="text-slate-700 font-semibold">Equipe: {obra.crewCount} operários</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Obra Details Modal */}
      {selectedObraModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 p-5 shadow-xl text-[#0f172a] relative max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-3 border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                  Ficha Técnica de Canteiro
                </span>
                <h3 className="text-base font-bold text-[#0f172a]">{selectedObraModal.name}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-amber-600" />
                  {selectedObraModal.location}, {selectedObraModal.city}
                </p>
              </div>
              <button
                onClick={() => setSelectedObraModal(null)}
                className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-[#0f172a] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500">Área de Fachada</span>
                  <p className="text-sm font-bold text-[#0f172a]">
                    {selectedObraModal.facadeAreaM2.toLocaleString('pt-BR')} m²
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500">Pavimentos</span>
                  <p className="text-sm font-bold text-[#0f172a]">
                    {selectedObraModal.floors} andares ({selectedObraModal.towers} torre)
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block mb-1">
                  Diagnóstico Principal de Campo
                </span>
                <p className="text-amber-800 font-semibold">{selectedObraModal.primaryPathology}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Responsável de Campo:</span>
                  <span className="text-[#0f172a] font-semibold">{selectedObraModal.manager}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Efetivo Alocado:</span>
                  <span className="text-amber-700 font-semibold">
                    {selectedObraModal.crewCount} colaboradores
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Início:</span>
                  <span className="text-slate-700">{selectedObraModal.startDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Previsão Término:</span>
                  <span className="text-slate-700">{selectedObraModal.estimatedEndDate}</span>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => {
                    setSelectedObraModal(null);
                    onNavigateTab('cronograma');
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#0a192f] hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <CalendarRange className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ver Cronograma Completo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
