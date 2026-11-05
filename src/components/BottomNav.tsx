import React from 'react';
import { LayoutDashboard, CalendarRange, Sparkles, Camera, Clock, ReceiptText } from 'lucide-react';

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
      icon: LayoutDashboard,
    },
    {
      key: 'cronograma' as TabKey,
      label: 'Cronograma',
      icon: CalendarRange,
      badge: '12S',
    },
    {
      key: 'budget' as TabKey,
      label: 'Orçamentos',
      icon: Sparkles,
      badge: 'IA',
    },
    {
      key: 'photos' as TabKey,
      label: 'Laudos',
      icon: Camera,
      count: photoCount,
    },
    {
      key: 'timesheet' as TabKey,
      label: 'Ponto',
      icon: Clock,
    },
    {
      key: 'invoices' as TabKey,
      label: 'NFS-e',
      icon: ReceiptText,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0a192f]/95 backdrop-blur-xl border-t border-amber-500/20 pb-safe">
      <div className="max-w-md mx-auto px-1.5 py-1.5 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => onSelectTab(tab.key)}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all relative ${
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
  );
};
