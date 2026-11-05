import React, { useState, useEffect } from 'react';
import { AppNotification } from '../types';
import {
  X,
  Bell,
  Calendar,
  CheckCircle2,
  Trash2,
  CheckCheck,
  Sparkles,
  AlertTriangle,
  Clock,
  Shield,
  ChevronRight,
  Send,
  Radio
} from 'lucide-react';
import {
  getStoredNotifications,
  saveNotifications,
  requestPushPermission,
  getPushPermissionStatus,
  triggerPushNotification
} from '../services/notificationService';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | 'unsupported'>('default');
  const [permissionRequested, setPermissionRequested] = useState(false);

  const loadNotifications = () => {
    setNotifications(getStoredNotifications());
    setPermissionStatus(getPushPermissionStatus());
  };

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleUpdate = () => {
      setNotifications(getStoredNotifications());
    };
    window.addEventListener('renovar_notifications_updated', handleUpdate);
    return () => window.removeEventListener('renovar_notifications_updated', handleUpdate);
  }, []);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const res = await requestPushPermission();
    setPermissionStatus(res);
    setPermissionRequested(true);
  };

  const handleMarkAsRead = (id: string) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    saveNotifications(updated);
  };

  const handleMarkAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    saveNotifications(updated);
  };

  const handleClearAll = () => {
    setNotifications([]);
    saveNotifications([]);
  };

  const handleItemClick = (notif: AppNotification) => {
    handleMarkAsRead(notif.id);
    if (notif.actionTab) {
      onNavigateTab(notif.actionTab);
      onClose();
    }
  };

  const handleTestCronogramaAlert = () => {
    triggerPushNotification({
      title: '⏳ Prazo de Cronograma: Semana 6',
      message: 'Atenção Gestor: A Frente 03 (Recuperação de Armaduras) da obra Condomínio Royal Palace encerra na Semana 6. Necessário vistoria de medição!',
      category: 'cronograma',
      urgency: 'alta',
      actionTab: 'cronograma',
    });
  };

  const handleTestBudgetAlert = () => {
    triggerPushNotification({
      title: '🎉 Novo Orçamento Aprovado!',
      message: 'O Contratante Roberto Albuquerque aprovou digitalmente o contrato RSC-2026-9482 (R$ 148.000,00) para Condomínio Terraços da Brava.',
      category: 'orcamento_aprovado',
      urgency: 'alta',
      actionTab: 'budget',
    });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatRelativeTime = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffMinutes = Math.floor(diffMs / (60 * 1000));
      if (diffMinutes < 1) return 'Agora mesmo';
      if (diffMinutes < 60) return `há ${diffMinutes} min`;
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return `há ${diffHours} h`;
      const diffDays = Math.floor(diffHours / 24);
      return `há ${diffDays} d`;
    } catch {
      return 'Recente';
    }
  };

  const getCategoryBadge = (category: AppNotification['category']) => {
    switch (category) {
      case 'cronograma':
        return (
          <span className="text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded flex items-center gap-1">
            <Clock className="w-2.5 h-2.5 text-amber-600" />
            Cronograma
          </span>
        );
      case 'orcamento_aprovado':
        return (
          <span className="text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-amber-600" />
            Orçamento Aprovado
          </span>
        );
      case 'fiscal':
        return (
          <span className="text-[9px] font-bold bg-slate-100 text-[#0f172a] border border-slate-200 px-2 py-0.5 rounded">
            Fiscal / NFS-e
          </span>
        );
      default:
        return (
          <span className="text-[9px] font-bold bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded">
            Geral
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] text-[#0f172a]">
        {/* Header */}
        <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0a192f] flex items-center justify-center text-amber-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#0f172a]">Central de Notificações</h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold bg-[#0a192f] text-white px-2 py-0.5 rounded-full">
                    {unreadCount} nova{unreadCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500">
                Alertas push de prazos de obras e orçamentos aprovados
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-[#0f172a] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Browser Push Permission Status Banner */}
        <div className="p-3.5 bg-white border-b border-slate-200 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700 flex items-center gap-1.5 text-[11px]">
              <Radio className="w-3.5 h-3.5 text-amber-600" />
              Notificações no Dispositivo:
            </span>

            {permissionStatus === 'granted' ? (
              <span className="text-[10px] font-bold text-[#0f172a] bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-amber-600" />
                Ativas no Navegador
              </span>
            ) : permissionStatus === 'denied' ? (
              <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                Alertas em Tela Ativos
              </span>
            ) : (
              <button
                type="button"
                onClick={handleRequestPermission}
                className="text-[10px] font-bold bg-[#0a192f] hover:bg-slate-800 text-white px-2.5 py-1 rounded-lg transition cursor-pointer"
              >
                Ativar Push no Celular
              </button>
            )}
          </div>

          {/* Quick Simulation Action Buttons for Testing */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
              Simular Notificação:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleTestCronogramaAlert}
                className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[10px] font-semibold text-[#0f172a] flex items-center gap-1 transition cursor-pointer"
                title="Testar alerta de prazo de cronograma vencendo"
              >
                <Clock className="w-3 h-3 text-amber-600" />
                <span>Prazo Obra</span>
              </button>
              <button
                type="button"
                onClick={handleTestBudgetAlert}
                className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[10px] font-semibold text-[#0f172a] flex items-center gap-1 transition cursor-pointer"
                title="Testar alerta de orçamento aprovado pelo contratante"
              >
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Orçamento</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Notification List */}
        <div className="p-3.5 overflow-y-auto space-y-2.5 text-xs flex-1 max-h-[50vh]">
          {notifications.length === 0 ? (
            <div className="text-center py-8 space-y-2 text-slate-500">
              <Bell className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-[#0f172a]">Nenhuma notificação no momento</p>
              <p className="text-xs">
                Você será avisado automaticamente quando prazos de obras vencerem ou contratos forem aprovados.
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleItemClick(notif)}
                className={`p-3.5 rounded-xl border transition cursor-pointer relative space-y-1.5 ${
                  notif.read
                    ? 'bg-slate-50/70 border-slate-200 hover:border-slate-300 text-slate-600'
                    : 'bg-white border-amber-300 hover:border-amber-400 text-[#0f172a] shadow-sm'
                }`}
              >
                {/* Header row */}
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5">
                    {getCategoryBadge(notif.category)}
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-amber-600" />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {formatRelativeTime(notif.createdAt)}
                  </span>
                </div>

                {/* Title */}
                <h4 className="font-bold text-xs text-[#0f172a] leading-snug">
                  {notif.title}
                </h4>

                {/* Body message */}
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {notif.message}
                </p>

                {/* Action footer */}
                {notif.actionTab && (
                  <div className="flex items-center justify-between pt-1 text-[10px] text-amber-700 font-bold">
                    <span className="flex items-center gap-0.5">
                      Ver no módulo {notif.actionTab}
                      <ChevronRight className="w-3 h-3" />
                    </span>
                    {!notif.read && (
                      <span className="text-slate-400 text-[9px] font-normal">Toque para abrir</span>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {notifications.length > 0 && (
          <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-[#0f172a] transition cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Marcar todas lidas</span>
            </button>

            <button
              type="button"
              onClick={handleClearAll}
              className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-[#0f172a] transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar histórico</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
