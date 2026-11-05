import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { LogOut, UserCheck, Shield, ChevronDown, Bell, Building2, Wind } from 'lucide-react';
import { NotificationCenterModal } from './NotificationCenterModal';
import { getStoredNotifications } from '../services/notificationService';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  activeTab: string;
  onNavigateTab: (tab: string) => void;
}

const MODULE_TITLES: Record<string, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Painel de Controle & Gestão Operacional',
    subtitle: 'Monitoramento em tempo real de obras, indicadores financeiros e segurança em altura',
  },
  cronograma: {
    title: 'Cronograma Físico-Financeiro (12 Semanas)',
    subtitle: 'Planejamento semanal de frentes de serviço, medições e auditoria CSV',
  },
  budget: {
    title: 'Memorial Descritivo Oficial & Orçamentos IA',
    subtitle: 'Template estruturado padrão de engenharia civil ABNT com injeção de variáveis do Contratante',
  },
  photos: {
    title: 'Laudos Fotográficos e Diagnóstico de Fachadas',
    subtitle: 'Mapeamento percussivo, patologias prediais e registro técnico georreferenciado',
  },
  timesheet: {
    title: 'Controle de Ponto Eletrônico com GPS',
    subtitle: 'Registro de jornada em canteiro com cerca digital conforme Portaria 671 MTE',
  },
  invoices: {
    title: 'Faturamento Corporativo & Emissão de NFS-e',
    subtitle: 'Gestão fiscal de medições, retenções de INSS/ISS e comprovantes para Contratantes',
  },
};

export const Header: React.FC<HeaderProps> = ({
  user,
  onLogout,
  activeTab,
  onNavigateTab,
}) => {
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

  const currentModule = MODULE_TITLES[activeTab] || MODULE_TITLES.dashboard;

  return (
    <header className="sticky top-0 z-30 bg-[#0a192f]/95 backdrop-blur-md border-b border-slate-800/90 px-4 sm:px-6 lg:px-8 py-3 md:py-3.5 pt-safe print:hidden">
      <div className="max-w-md md:max-w-[1600px] mx-auto flex items-center justify-between gap-4">
        {/* Mobile Brand Logo (Hidden on Notebooks & Desktop where Sidebar shows Brand) */}
        <div className="flex md:hidden items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white border border-slate-700 flex items-center justify-center p-0.5 shadow-sm overflow-hidden">
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
            <p className="text-[10px] text-slate-400 font-medium tracking-wide truncate max-w-[190px]">
              Soluções Prediais • Gestão de Obras
            </p>
          </div>
        </div>

        {/* Desktop & Notebook Active Module Title & Breadcrumb (Visible on md+) */}
        <div className="hidden md:block min-w-0">
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-[#0f2744] border border-slate-800 px-2 py-0.5 rounded-md flex-shrink-0">
              Sistema Web Corporativo
            </span>
            <h1 className="text-sm lg:text-base font-bold text-white truncate">
              {currentModule.title}
            </h1>
          </div>
          <p className="text-xs text-slate-400 truncate mt-0.5">
            {currentModule.subtitle}
          </p>
        </div>

        {/* Right Actions: Desktop Telemetry + Notification Bell + Profile Dropdown */}
        <div className="flex items-center gap-2.5">
          {/* Desktop Telemetry Badges */}
          <div className="hidden xl:flex items-center gap-2 mr-1">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0f2744]/80 border border-slate-800 text-[11px] text-slate-300">
              <Wind className="w-3.5 h-3.5 text-amber-400" />
              <span>Vento Litoral SC:</span>
              <strong className="text-white">14 km/h (Seguro NR-35)</strong>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0f2744]/80 border border-slate-800 text-[11px] text-slate-300">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Canteiros Ativos:</span>
              <strong className="text-white">Santa Catarina</strong>
            </div>
          </div>

          {/* Notification Bell Button */}
          <button
            type="button"
            onClick={() => setShowNotificationModal(true)}
            className="relative p-2 lg:p-2.5 rounded-xl bg-[#0f2744] border border-slate-800 hover:border-slate-700 text-slate-200 transition cursor-pointer"
            title="Notificações do Gestor"
          >
            <Bell className="w-4 h-4 text-amber-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-amber-400 text-slate-950 text-[10px] font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User profile toggle */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 pl-2 pr-2 py-1 lg:py-1.5 rounded-xl bg-[#0f2744] border border-slate-800 hover:border-slate-700 text-slate-200 transition cursor-pointer"
              title="Perfil do Usuário"
            >
              <div className="w-6 h-6 lg:w-7 lg:h-7 rounded-lg bg-[#0a192f] text-amber-400 font-bold text-xs flex items-center justify-center border border-slate-800">
                {user.name.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-white leading-tight">{user.name}</p>
                <p className="text-[10px] text-slate-400 font-medium leading-tight">
                  {user.roleLabel}
                </p>
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
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#0f2744] border border-slate-700 p-3.5 shadow-xl z-50 text-slate-100 animate-in fade-in zoom-in-95 duration-150">
                  <div className="pb-2.5 mb-2.5 border-b border-slate-800">
                    <p className="text-xs font-bold text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-amber-400 font-medium truncate">{user.roleLabel}</p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{user.email}</p>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#0a192f] border border-slate-800/80 text-slate-300 text-[11px]">
                      <Shield className="w-3.5 h-3.5 text-amber-400" />
                      <span>Sessão Corporativa Ativa</span>
                    </div>

                    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#0a192f] border border-slate-800/80 text-slate-300 text-[11px]">
                      <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                      <span>NR-35 / Trabalho em Altura OK</span>
                    </div>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onLogout();
                      }}
                      className="w-full mt-2 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#0a192f] hover:bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-slate-400" />
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
