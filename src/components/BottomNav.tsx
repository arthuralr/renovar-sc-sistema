import React from 'react';
import {
  LayoutDashboard,
  CalendarRange,
  Sparkles,
  Camera,
  Clock,
  ReceiptText,
  ShieldCheck,
  Building2,
  CheckCircle2,
} from 'lucide-react';

export type TabKey = 'dashboard' | 'cronograma' | 'budget' | 'photos' | 'timesheet' | 'invoices';

interface BottomNavProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  photoCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  photoCount = 5,
}) => {
  const tabs = [
    {
      key: 'dashboard' as TabKey,
      label: 'Geral',
      desktopTitle: 'Painel Operacional',
      desktopSubtitle: 'Indicadores & Obras Ativas',
      icon: LayoutDashboard,
    },
    {
      key: 'cronograma' as TabKey,
      label: 'Cronograma',
      desktopTitle: 'Cronograma 12 Semanas',
      desktopSubtitle: 'Avanço Físico-Financeiro',
      icon: CalendarRange,
      badge: '12S',
    },
    {
      key: 'budget' as TabKey,
      label: 'Orçamentos',
      desktopTitle: 'Orçamentos & Memorial',
      desktopSubtitle: 'Template Engenharia ABNT',
      icon: Sparkles,
      badge: 'IA',
    },
    {
      key: 'photos' as TabKey,
      label: 'Laudos',
      desktopTitle: 'Laudos Fotográficos',
      desktopSubtitle: 'Vistoria de Patologias',
      icon: Camera,
      count: photoCount,
    },
    {
      key: 'timesheet' as TabKey,
      label: 'Ponto',
      desktopTitle: 'Controle de Ponto GPS',
      desktopSubtitle: 'Portaria 671 MTE • Cerca',
      icon: Clock,
    },
    {
      key: 'invoices' as TabKey,
      label: 'NFS-e',
      desktopTitle: 'Gestão Fiscal & NFS-e',
      desktopSubtitle: 'Faturamento & Retenções',
      icon: ReceiptText,
    },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR NAVIGATION (Computers & Notebooks lg+) */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 bg-[#071324] border-r border-amber-500/20 select-none print:hidden">
        {/* Brand Identity Header */}
        <div className="p-5 border-b border-slate-800/90 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-white border-2 border-amber-500/50 flex items-center justify-center p-0.5 shadow-lg shadow-amber-500/15 overflow-hidden flex-shrink-0">
            <img
              src="/assets/aistudio/Logotipo_Renovar_51718f31.jpg"
              alt="Renovar SC Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black tracking-tight text-white">RENOVAR</span>
              <span className="text-base font-black text-amber-400">SC</span>
            </div>
            <p className="text-[11px] text-amber-400/90 font-semibold tracking-wide truncate">
              Soluções Prediais Ltda
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              Engenharia & Gestão de Fachadas
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1.5">
          <div className="px-2.5 pb-1.5 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Módulos de Gestão
            </span>
            <span className="text-[9px] font-mono text-amber-400/80 bg-amber-400/10 px-1.5 py-0.5 rounded">
              Web Pro
            </span>
          </div>

          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => onSelectTab(tab.key)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all cursor-pointer group relative text-left ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-400/20 via-amber-400/10 to-transparent border border-amber-400/50 text-white shadow-lg shadow-amber-500/5'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-[#0f2744]/60 border border-transparent'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-full bg-amber-400 shadow-[0_0_10px_#fbbf24]" />
                )}

                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors flex-shrink-0 ${
                      isActive
                        ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'bg-[#0f2744] text-slate-400 group-hover:text-amber-400 border border-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span
                      className={`text-xs block truncate ${
                        isActive ? 'font-bold text-amber-300' : 'font-semibold text-slate-200'
                      }`}
                    >
                      {tab.desktopTitle}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {tab.desktopSubtitle}
                    </span>
                  </div>
                </div>

                {/* Badges */}
                {tab.badge && (
                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded-full flex-shrink-0 ${
                      isActive
                        ? 'bg-amber-400 text-slate-950 shadow-xs'
                        : 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
                {tab.count !== undefined && tab.count > 0 && !tab.badge && (
                  <span className="text-[10px] font-bold bg-[#0f2744] text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full flex-shrink-0">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Corporate Engineering Credentials Card */}
        <div className="p-4 border-t border-slate-800/90 space-y-2.5 bg-[#081528]">
          <div className="p-3 rounded-xl bg-[#0f2744]/90 border border-amber-500/25 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Conformidade Técnica
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[10px] text-slate-300 leading-relaxed">
              Sistema homologado ABNT NBR 13755, NBR 6118, NR-35 e NR-18 para obras prediais e contratantes em SC.
            </p>
            <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1 border-t border-slate-800 font-mono">
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3 h-3" /> CREA-SC Ativo
              </span>
              <span>BC • Itapema • Floripa</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION (Smartphones & Tablets < lg) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a192f]/95 backdrop-blur-xl border-t border-amber-500/20 pb-safe print:hidden">
        <div className="max-w-md mx-auto px-1.5 py-1.5 flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => onSelectTab(tab.key)}
                className={`flex-1 flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all relative cursor-pointer ${
                  isActive
                    ? 'text-amber-400 font-bold scale-105'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {/* Active Golden Glow Pill Indicator */}
                {isActive && (
                  <span className="absolute -top-1 w-5 h-0.5 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]" />
                )}

                <div className="relative">
                  <Icon
                    className={`w-4 h-4 transition-transform ${
                      isActive ? 'scale-110 text-amber-400' : 'text-slate-400'
                    }`}
                  />

                  {/* Badges */}
                  {tab.badge && (
                    <span className="absolute -top-1.5 -right-2.5 text-[8px] font-black bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 px-1 rounded-full shadow-sm">
                      {tab.badge}
                    </span>
                  )}
                  {tab.count !== undefined && tab.count > 0 && !tab.badge && (
                    <span className="absolute -top-1.5 -right-2 text-[8px] font-bold bg-[#1e293b] text-amber-300 border border-amber-500/40 w-3.5 h-3.5 rounded-full flex items-center justify-center">
                      {tab.count}
                    </span>
                  )}
                </div>

                <span
                  className={`text-[9px] mt-1 transition-colors leading-tight ${
                    isActive ? 'text-amber-400 font-bold' : 'text-slate-400 font-medium'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
