import { AppNotification, BudgetProposal, ObraCronograma } from '../types';

const STORAGE_KEY = 'renovar_notifications';
const PERMISSION_KEY = 'renovar_push_permission_requested';

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-01',
    title: '⏳ Prazo de Cronograma Próximo do Vencimento',
    message: 'Frente 03 (Recuperação de Armaduras & Fissuras) da obra Condomínio Royal Palace encerra na Semana 6. Necessário vistoria de campo e medição!',
    category: 'cronograma',
    urgency: 'alta',
    actionTab: 'cronograma',
    read: false,
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25 min atrás
  },
  {
    id: 'notif-02',
    title: '🎉 Orçamento Aprovado pelo Contratante!',
    message: 'O Contratante Roberto Albuquerque assinou digitalmente o memorial e aprovou o contrato RSC-2026-9482 (R$ 148.000,00) para Condomínio Terraços da Brava.',
    category: 'orcamento_aprovado',
    urgency: 'media',
    actionTab: 'budget',
    read: false,
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), // 2h atrás
  },
  {
    id: 'notif-03',
    title: '📄 NFS-e Emitida com Retenção INSS',
    message: 'NFS-e nº 00000284 vinculada à 2ª Medição do Condomínio Royal Palace transmitida com retenção de 11% INSS e 2,5% ISS.',
    category: 'fiscal',
    urgency: 'baixa',
    actionTab: 'invoices',
    read: true,
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), // 1 dia atrás
  },
];

export function getStoredNotifications(): AppNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
}

export function saveNotifications(notifications: AppNotification[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    // Emit custom event for synchronized UI updates across components
    window.dispatchEvent(new CustomEvent('renovar_notifications_updated'));
  } catch (err) {
    console.error('Failed to save notifications to localStorage:', err);
  }
}

/**
 * Checks system Notification API permission
 */
export function getPushPermissionStatus(): NotificationPermission | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

/**
 * Requests native browser/OS push notification permission
 */
export async function requestPushPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  try {
    const permission = await Notification.requestPermission();
    localStorage.setItem(PERMISSION_KEY, 'true');
    return permission;
  } catch (err) {
    console.warn('Notification permission request was rejected or unsupported in iframe:', err);
    return Notification.permission || 'denied';
  }
}

/**
 * Emits a real push notification to the browser / OS and records it in the in-app notification center
 */
export function triggerPushNotification(params: {
  title: string;
  message: string;
  category: AppNotification['category'];
  urgency?: AppNotification['urgency'];
  actionTab?: string;
  relatedEntityId?: string;
}): AppNotification {
  const newNotification: AppNotification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    title: params.title,
    message: params.message,
    category: params.category,
    urgency: params.urgency || 'media',
    actionTab: params.actionTab,
    relatedEntityId: params.relatedEntityId,
    createdAt: new Date().toISOString(),
    read: false,
  };

  // 1. Try native Web Notification if permitted
  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'granted') {
      try {
        const nativeNotif = new Notification(params.title, {
          body: params.message,
          icon: '/assets/aistudio/Logotipo_Renovar_51718f31.jpg',
          badge: '/assets/aistudio/Logotipo_Renovar_51718f31.jpg',
          tag: newNotification.id,
        });

        nativeNotif.onclick = () => {
          window.focus();
          if (params.actionTab) {
            window.dispatchEvent(
              new CustomEvent('renovar_navigate_tab', { detail: { tab: params.actionTab } })
            );
          }
          nativeNotif.close();
        };
      } catch (e) {
        console.warn('System push notification could not be created:', e);
      }
    }
  }

  // 2. Trigger vibration on mobile if supported
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([120, 60, 120]);
    } catch {
      // Ignore vibration errors
    }
  }

  // 3. Persist in storage and notify in-app center
  const currentList = getStoredNotifications();
  const updatedList = [newNotification, ...currentList];
  saveNotifications(updatedList);

  // 4. Emit banner event for immediate in-app floating push alert
  window.dispatchEvent(
    new CustomEvent('renovar_push_banner', { detail: newNotification })
  );

  return newNotification;
}

/**
 * Checks schedule deadlines and alerts manager if a stage deadline is approaching (expiring this week)
 */
export function checkCronogramaDeadlines(cronogramas: ObraCronograma[]): void {
  const todayKey = `renovar_cronograma_checked_${new Date().toISOString().split('T')[0]}`;
  if (sessionStorage.getItem(todayKey)) {
    return; // Already checked today in this session
  }

  cronogramas.forEach((cronograma) => {
    cronograma.stages.forEach((stage) => {
      // If stage ends on current week or next week and is still in progress
      const isExpiringSoon =
        stage.status === 'em_andamento' &&
        (stage.endWeek === cronograma.currentWeek || stage.endWeek === cronograma.currentWeek + 1);

      if (isExpiringSoon) {
        const notifId = `deadline-${cronograma.obraId}-${stage.id}-sem${cronograma.currentWeek}`;
        const existing = getStoredNotifications().find((n) => n.id === notifId);

        if (!existing) {
          triggerPushNotification({
            title: `⏳ Prazo de Cronograma: Semana ${stage.endWeek}`,
            message: `A frente "${stage.title}" da obra ${cronograma.obraName} vence na Semana ${stage.endWeek}. Verifique o checklist de entrega e medição financeira!`,
            category: 'cronograma',
            urgency: 'alta',
            actionTab: 'cronograma',
            relatedEntityId: cronograma.obraId,
          });
        }
      }
    });
  });

  sessionStorage.setItem(todayKey, 'true');
}

/**
 * Triggers alert when a client approves a budget proposal
 */
export function notifyBudgetApproved(proposal: BudgetProposal): void {
  const clientName = proposal.contractAcceptance?.clientName || 'Contratante';
  const protocol = proposal.protocol;
  const totalPrice = proposal.totalPrice.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  triggerPushNotification({
    title: '🎉 Novo Orçamento Aprovado!',
    message: `O Contratante ${clientName} aprovou digitalmente o contrato ${protocol} (${totalPrice}) para ${proposal.condoName}.`,
    category: 'orcamento_aprovado',
    urgency: 'alta',
    actionTab: 'budget',
    relatedEntityId: proposal.id,
  });
}
