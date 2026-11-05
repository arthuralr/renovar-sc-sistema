import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-white border border-amber-300 text-[#0f172a] px-3.5 py-1 text-xs font-semibold shadow-md">
      <WifiOff className="w-3.5 h-3.5 text-amber-600" />
      <span>Modo Offline de Campo — Dados salvos localmente</span>
    </div>
  );
};
