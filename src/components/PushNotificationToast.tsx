import React, { useEffect, useState } from 'react';
import { AppNotification } from '../types';
import { Bell, X, Calendar, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

interface PushNotificationToastProps {
  onNavigateTab: (tab: string) => void;
}

export const PushNotificationToast: React.FC<PushNotificationToastProps> = ({
  onNavigateTab,
}) => {
  const [activeToast, setActiveToast] = useState<AppNotification | null>(null);

  useEffect(() => {
    const handlePushBanner = (e: Event) => {
      const customEvent = e as CustomEvent<AppNotification>;
      if (customEvent.detail) {
        setActiveToast(customEvent.detail);
      }
    };

    window.addEventListener('renovar_push_banner', handlePushBanner);
    return () => window.removeEventListener('renovar_push_banner', handlePushBanner);
  }, []);

  // Auto-dismiss after 6.5s
  useEffect(() => {
    if (!activeToast) return;
    const timer = setTimeout(() => {
      setActiveToast(null);
    }, 6500);
    return () => clearTimeout(timer);
  }, [activeToast]);

  if (!activeToast) return null;

  const handleClick = () => {
    if (activeToast.actionTab) {
      onNavigateTab(activeToast.actionTab);
    }
    setActiveToast(null);
  };

  const getIcon = () => {
    if (activeToast.category === 'orcamento_aprovado') {
      return <Sparkles className="w-5 h-5 text-amber-400" />;
    }
    if (activeToast.category === 'cronograma') {
      return <Calendar className="w-5 h-5 text-amber-400" />;
    }
    return <Bell className="w-5 h-5 text-amber-400" />;
  };

  return (
    <div className="fixed top-3 left-3 right-3 sm:left-auto sm:right-4 sm:w-96 z-50 animate-in slide-in-from-top-4 duration-300">
      <div className="bg-[#0f2744] border border-slate-700 rounded-xl p-3.5 shadow-xl flex items-start gap-3 backdrop-blur-md">
        {/* Leading icon */}
        <div className="w-10 h-10 rounded-xl bg-[#0a192f] border border-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 cursor-pointer" onClick={handleClick}>
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-[#0a192f] border border-slate-800 px-1.5 py-0.5 rounded">
              Notificação Push
            </span>
            <span className="text-[9px] text-slate-400">Agora</span>
          </div>

          <h4 className="text-xs font-bold text-white mt-1 leading-snug">
            {activeToast.title}
          </h4>

          <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
            {activeToast.message}
          </p>

          {activeToast.actionTab && (
            <div className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-amber-400 hover:text-amber-300">
              <span>Toque para abrir no sistema</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setActiveToast(null);
          }}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#0a192f] transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
