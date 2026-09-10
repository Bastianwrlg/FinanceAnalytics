import React, { useState } from 'react';
import { FinanceProvider } from './context/FinanceContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { LoginForm } from './components/LoginForm';
import { DashboardView } from './components/views/DashboardView';
import { SalesView } from './components/views/SalesView';
import { BahanBakuView } from './components/views/BahanBakuView';
import { HppView } from './components/views/HppView';
import { OpexView } from './components/views/OpexView';
import { MarketingView } from './components/views/MarketingView';
import { ArApView } from './components/views/ArApView';
import { RoleAccessView } from './components/views/RoleAccessView';
import { LogoUploadView } from './components/views/LogoUploadView';
import { SpreadsheetSyncModal } from './components/SpreadsheetSyncModal';
import { ReportExportModal } from './components/ReportExportModal';
import { ActiveTab, UserRole, UserSession } from './types';

const MainAppContent: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('poda_auth_user') || sessionStorage.getItem('poda_auth_user');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      // Ensure session has proper UserSession shape
      if (!parsed.roleCode || parsed.name === 'IT Infrastructure Team' || parsed.email?.includes('itinfrastructure')) {
        const isFat = parsed.role?.toLowerCase().includes('fat') || parsed.username === 'headfat';
        const updated: UserSession = isFat
          ? {
              name: 'Head FAT',
              username: 'headfat',
              role: 'Head FAT',
              roleCode: 'HEAD_FAT',
              roleTitle: 'Head of Finance, Accounting & Tax',
              department: 'Finance, Accounting & Tax Division',
              lastLogin: parsed.lastLogin || '08:30',
              avatarInitials: 'FAT',
              permissions: {
                canExportReports: true,
                canSyncSpreadsheet: true,
                canEditConfig: true,
                canViewExecutiveKPI: true,
                canViewDetailedAccounting: true,
              },
            }
          : {
              name: 'BOD',
              username: 'bod',
              role: 'BOD',
              roleCode: 'BOD',
              roleTitle: 'Board of Directors',
              department: 'Executive Board & Strategic Leadership',
              lastLogin: parsed.lastLogin || '08:30',
              avatarInitials: 'BOD',
              permissions: {
                canExportReports: true,
                canSyncSpreadsheet: true,
                canEditConfig: true,
                canViewExecutiveKPI: true,
                canViewDetailedAccounting: false,
              },
            };
        localStorage.setItem('poda_auth_user', JSON.stringify(updated));
        return updated;
      }
      return parsed;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('poda_auth_user');
    sessionStorage.removeItem('poda_auth_user');
    setCurrentUser(null);
  };

  const handleSwitchRole = (role: UserRole) => {
    const updated: UserSession =
      role === 'BOD'
        ? {
            name: 'BOD',
            username: 'bod',
            role: 'BOD',
            roleCode: 'BOD',
            roleTitle: 'Board of Directors',
            department: 'Executive Board & Strategic Leadership',
            lastLogin: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            avatarInitials: 'BOD',
            permissions: {
              canExportReports: true,
              canSyncSpreadsheet: true,
              canEditConfig: true,
              canViewExecutiveKPI: true,
              canViewDetailedAccounting: false,
            },
          }
        : {
            name: 'Head FAT',
            username: 'headfat',
            role: 'Head FAT',
            roleCode: 'HEAD_FAT',
            roleTitle: 'Head of Finance, Accounting & Tax',
            department: 'Finance, Accounting & Tax Division',
            lastLogin: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            avatarInitials: 'FAT',
            permissions: {
              canExportReports: true,
              canSyncSpreadsheet: true,
              canEditConfig: true,
              canViewExecutiveKPI: true,
              canViewDetailedAccounting: true,
            },
          };

    localStorage.setItem('poda_auth_user', JSON.stringify(updated));
    setCurrentUser(updated);
  };

  // If user is not authenticated, show Login Screen
  if (!currentUser) {
    return <LoginForm onLogin={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased selection:bg-amber-500 selection:text-slate-950">
      {/* Top Fixed / Sticky Navigation Header */}
      <Header
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        onExportReport={() => setIsExportModalOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
        onSwitchRole={handleSwitchRole}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
      />

      {/* Main Shell with Vertical Navigation & Dynamic View Area */}
      <div className="flex-1 flex w-full max-w-[1600px] mx-auto">
        {/* Vertical Sidebar Navigation */}
        <Navigation
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onOpenSyncModal={() => setIsSyncModalOpen(true)}
          currentUser={currentUser}
          onSwitchRole={handleSwitchRole}
        />

        {/* Dynamic Main View Rendering */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'dashboard' && (
            <DashboardView onNavigateTo={setActiveTab} currentUser={currentUser} />
          )}

          {activeTab === 'sales' && <SalesView />}

          {activeTab === 'bahan-baku' && <BahanBakuView />}

          {activeTab === 'hpp' && <HppView />}

          {activeTab === 'opex' && <OpexView />}

          {activeTab === 'marketing' && <MarketingView />}

          {activeTab === 'ar-ap' && <ArApView />}

          {activeTab === 'role-access' && (
            <RoleAccessView
              currentUser={currentUser}
              onSwitchRole={handleSwitchRole}
            />
          )}

          {activeTab === 'upload-logo' && <LogoUploadView />}
        </main>
      </div>

      {/* Modals */}
      <SpreadsheetSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
      />

      <ReportExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <FinanceProvider>
      <MainAppContent />
    </FinanceProvider>
  );
}
