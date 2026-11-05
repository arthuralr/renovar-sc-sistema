import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { LogOut, UserCheck, Shield, ChevronDown, Bell } from 'lucide-react';
import { NotificationCenterModal } from './NotificationCenterModal';
import { getStoredNotifications } from '../services/notificationService';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  activeTab: string;
  onNavigateTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, onNavigateTab }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const updateUnread = () => {
    const list = getStoredNotifications();
    const count = list.filter((n) => !n.read).length;
    setUnreadCount(count);
  };

  useEffect(() => {
    updateUnread();
    const handleUpdate = () => updateUnread();
    window.addEventListener('renovar_notifications_updated', handleUpdate);
    return () => window.removeEventListener('renovar_notifications_updated', handleUpdate);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#0a192f]/95 backdrop-blur-md border-b border-amber-500/20 px-3.5 py-2.5 pt-safe">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Brand Logo with Official Renovar Icon & Name */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white border border-amber-500/40 flex items-center justify-center p-0.5 shadow-md shadow-amber-500/10 overflow-hidden">
            <img
              src="/assets/aistudio/Logotipo_Renovar_51718f31.jpg"
              alt="Renovar SC Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black tracking-tight text-white">RENOVAR</span>
              <span className="text-sm font-black text-amber-400">SC</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide truncate max-w-[170px]">
              Soluções Prediais • Gestão de Obras
            </p>
          </div>
        </div>

        {/* Right Actions: Notification Bell & Profile Dropdown */}
        <div className="flex items-center gap-2">
          {/* Notification Bell Button */}
          <button
            type="button"
            onClick={() => setShowNotificationModal(true)}
            className="relative p-2 rounded-xl bg-[#0f2744] border border-slate-700/80 hover:border-amber-400/50 text-slate-200 active:scale-95 transition cursor-pointer"
            title="Notificações do Gestor"
          >
            <Bell className="w-4 h-4 text-amber-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-amber-400 text-slate-950 text-[10px] font-black shadow-md shadow-amber-500/50 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User profile toggle */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-1.5 pl-2 pr-1.5 py-1 rounded-lg bg-[#0f2744] border border-slate-700/80 hover:border-amber-400/50 text-slate-200 active:scale-95 transition cursor-pointer"
              title="Perfil do Usuário"
            >
              <div className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center border border-amber-500/30">
                {user.name.charAt(0)}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Profile Drawer / Dropdown */}
            {showProfileMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowProfileMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#0f2744] border border-amber-500/30 p-3 shadow-2xl z-50 text-slate-100 animate-in fade-in zoom-in-95 duration-150">
                  <div className="pb-2.5 mb-2.5 border-b border-slate-700">
                    <p className="text-xs font-bold text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-amber-400 font-medium truncate">{user.roleLabel}</p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{user.email}</p>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-[#0a192f] text-slate-300 text-[11px]">
                      <Shield className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Sessão Corporativa Ativa</span>
                    </div>

                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-[#0a192f] text-slate-300 text-[11px]">
                      <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                      <span>NR-35 / Trabalho em Altura OK</span>
                    </div>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onLogout();
                      }}
                      className="w-full mt-2 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold transition cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sair do Sistema</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Push Notification Center Modal */}
      <NotificationCenterModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        onNavigateTab={onNavigateTab}
      />
    </header>
  );
};
