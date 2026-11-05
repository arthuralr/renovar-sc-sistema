import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-amber-500/95 border border-amber-300 text-slate-950 px-3.5 py-1 text-xs font-semibold shadow-xl backdrop-blur-md animate-bounce">
      <WifiOff className="w-3.5 h-3.5" />
      <span>Modo Offline de Campo — Dados salvos localmente</span>
    </div>
  );
};
