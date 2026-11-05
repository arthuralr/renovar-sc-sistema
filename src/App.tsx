/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  User,
  FinancialStats,
  Obra,
  PhotoReport,
  Employee,
  TimesheetEntry,
  Invoice,
  BudgetProposal,
  ObraCronograma
} from './types';
import {
  INITIAL_USER,
  INITIAL_FINANCIAL_STATS,
  INITIAL_OBRAS,
  INITIAL_PHOTO_REPORTS,
  INITIAL_EMPLOYEES,
  INITIAL_TIMESHEETS,
  INITIAL_INVOICES,
  INITIAL_CRONOGRAMAS
} from './data/initialData';
import { AuthScreen } from './components/AuthScreen';
import { Header } from './components/Header';
import { BottomNav, TabKey } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { CronogramaView } from './components/CronogramaView';
import { BudgetGeneratorView } from './components/BudgetGeneratorView';
import { PhotoReportsView } from './components/PhotoReportsView';
import { TimesheetView } from './components/TimesheetView';
import { InvoicesView } from './components/InvoicesView';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PushNotificationToast } from './components/PushNotificationToast';
import { checkCronogramaDeadlines } from './services/notificationService';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('renovar_auth_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure legacy cached names are normalized to Gabriel
        if (parsed.name?.includes('André')) {
          const updated = {
            id: 'usr-01',
            name: 'Gabriel',
            email: 'gabriel@renovarsc.com.br',
            role: 'gestor' as const,
            roleLabel: 'Gestão Operacional',
          };
          localStorage.setItem('renovar_auth_user', JSON.stringify(updated));
          return updated;
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');

  // Application Data States with LocalStorage Sync for Offline Field Use
  const [financialStats, setFinancialStats] = useState<FinancialStats>(() => {
    try {
      const saved = localStorage.getItem('renovar_financial_stats');
      return saved ? JSON.parse(saved) : INITIAL_FINANCIAL_STATS;
    } catch {
      return INITIAL_FINANCIAL_STATS;
    }
  });

  const [obras, setObras] = useState<Obra[]>(() => {
    try {
      const saved = localStorage.getItem('renovar_obras');
      return saved ? JSON.parse(saved) : INITIAL_OBRAS;
    } catch {
      return INITIAL_OBRAS;
    }
  });

  const [cronogramas, setCronogramas] = useState<ObraCronograma[]>(() => {
    try {
      const saved = localStorage.getItem('renovar_cronogramas');
      return saved ? JSON.parse(saved) : INITIAL_CRONOGRAMAS;
    } catch {
      return INITIAL_CRONOGRAMAS;
    }
  });

  const [photoReports, setPhotoReports] = useState<PhotoReport[]>(() => {
    try {
      const saved = localStorage.getItem('renovar_photos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const healed = parsed.map((item) => {
            if (item.id === 'rep-02' && item.imageUrl?.includes('photo-1541888946425-d0fbb186c5f7')) {
              return {
                ...item,
                imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
              };
            }
            return item;
          });
          return healed;
        }
      }
      return INITIAL_PHOTO_REPORTS;
    } catch {
      return INITIAL_PHOTO_REPORTS;
    }
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    try {
      const saved = localStorage.getItem('renovar_employees');
      return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
    } catch {
      return INITIAL_EMPLOYEES;
    }
  });

  const [timesheets, setTimesheets] = useState<TimesheetEntry[]>(() => {
    try {
      const saved = localStorage.getItem('renovar_timesheets');
      return saved ? JSON.parse(saved) : INITIAL_TIMESHEETS;
    } catch {
      return INITIAL_TIMESHEETS;
    }
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    try {
      const saved = localStorage.getItem('renovar_invoices');
      return saved ? JSON.parse(saved) : INITIAL_INVOICES;
    } catch {
      return INITIAL_INVOICES;
    }
  });

  const [savedProposals, setSavedProposals] = useState<BudgetProposal[]>(() => {
    try {
      const saved = localStorage.getItem('renovar_saved_proposals');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync state to local storage for offline durability
  useEffect(() => {
    localStorage.setItem('renovar_photos', JSON.stringify(photoReports));
  }, [photoReports]);

  useEffect(() => {
    localStorage.setItem('renovar_timesheets', JSON.stringify(timesheets));
  }, [timesheets]);

  useEffect(() => {
    localStorage.setItem('renovar_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('renovar_saved_proposals', JSON.stringify(savedProposals));
  }, [savedProposals]);

  useEffect(() => {
    localStorage.setItem('renovar_cronogramas', JSON.stringify(cronogramas));
  }, [cronogramas]);

  // Check schedule deadlines & listen to notification navigation events
  useEffect(() => {
    checkCronogramaDeadlines(cronogramas);

    const handleNavigateEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ tab: TabKey }>;
      if (customEvent.detail?.tab) {
        setActiveTab(customEvent.detail.tab);
      }
    };

    window.addEventListener('renovar_navigate_tab', handleNavigateEvent);
    return () => window.removeEventListener('renovar_navigate_tab', handleNavigateEvent);
  }, [cronogramas]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('renovar_auth_user');
    setCurrentUser(null);
  };

  const handleAddPhotoReport = (newReport: PhotoReport) => {
    setPhotoReports([newReport, ...photoReports]);
  };

  const handleUpdateReportStatus = (
    id: string,
    newStatus: 'identificado' | 'em_tratamento' | 'recuperado'
  ) => {
    setPhotoReports(
      photoReports.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const handleAddTimesheetEntry = (entry: TimesheetEntry) => {
    setTimesheets([entry, ...timesheets]);
  };

  const handleAddInvoice = (newInv: Invoice) => {
    setInvoices([newInv, ...invoices]);
  };

  const handleSaveProposal = (proposal: BudgetProposal) => {
    const exists = savedProposals.find((p) => p.id === proposal.id);
    if (!exists) {
      setSavedProposals([proposal, ...savedProposals]);
    } else {
      setSavedProposals(savedProposals.map((p) => (p.id === proposal.id ? proposal : p)));
    }
  };

  const handleUpdateStageProgress = (obraId: string, stageId: string, newProgress: number) => {
    setCronogramas(
      cronogramas.map((c) => {
        if (c.obraId !== obraId) return c;
        return {
          ...c,
          stages: c.stages.map((stg) =>
            stg.id === stageId
              ? {
                  ...stg,
                  progressPercent: newProgress,
                  status: newProgress === 100 ? 'concluido' : newProgress > 0 ? 'em_andamento' : 'programado',
                }
              : stg
          ),
        };
      })
    );
  };

  const handleNavigateTab = (tab: string) => {
    setActiveTab(tab as TabKey);
  };

  // If user is not authenticated, render corporate login
  if (!currentUser) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#0a192f] text-slate-100 flex flex-col justify-between selection:bg-amber-400 selection:text-slate-900 lg:pl-72">
      {/* Offline Status Badge */}
      <OfflineIndicator />

      {/* Floating Push Notification Toast */}
      <PushNotificationToast onNavigateTab={handleNavigateTab} />

      {/* Top Header */}
      <Header
        user={currentUser}
        onLogout={handleLogout}
        activeTab={activeTab}
        onNavigateTab={handleNavigateTab}
      />

      {/* Responsive Content Frame: Mobile-First on phones, Full-Width Web Panel on Desktop */}
      <main className="flex-1 w-full max-w-md md:max-w-4xl lg:max-w-[1600px] mx-auto px-3.5 sm:px-6 lg:px-8 pt-3 lg:pt-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            user={currentUser}
            financialStats={financialStats}
            obras={obras}
            onNavigateTab={setActiveTab}
            onOpenQuickPhoto={() => setActiveTab('photos')}
          />
        )}

        {activeTab === 'cronograma' && (
          <CronogramaView
            cronogramas={cronogramas}
            onUpdateStageProgress={handleUpdateStageProgress}
          />
        )}

        {activeTab === 'budget' && (
          <BudgetGeneratorView
            savedProposals={savedProposals}
            onSaveProposal={handleSaveProposal}
          />
        )}

        {activeTab === 'photos' && (
          <PhotoReportsView
            reports={photoReports}
            onAddReport={handleAddPhotoReport}
            onUpdateReportStatus={handleUpdateReportStatus}
          />
        )}

        {activeTab === 'timesheet' && (
          <TimesheetView
            employees={employees}
            timesheets={timesheets}
            obras={obras}
            onAddTimesheetEntry={handleAddTimesheetEntry}
          />
        )}

        {activeTab === 'invoices' && (
          <InvoicesView
            invoices={invoices}
            onAddInvoice={handleAddInvoice}
          />
        )}
      </main>

      {/* Fixed Ergonomic Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        photoCount={photoReports.length}
      />
    </div>
  );
}
