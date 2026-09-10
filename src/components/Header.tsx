import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  RefreshCw,
  Link2,
  Download,
  LogOut,
  User,
  Menu,
  Award,
  Calculator,
  ChevronDown,
  Check,
  ShieldCheck,
  UploadCloud,
} from 'lucide-react';
import { UserSession, UserRole, ActiveTab } from '../types';
import { PodaLogo } from './PodaLogo';

interface HeaderProps {
  onOpenSyncModal: () => void;
  onExportReport: () => void;
  currentUser?: UserSession | null;
  onLogout?: () => void;
  onSwitchRole?: (role: UserRole) => void;
  onToggleMobileSidebar?: () => void;
  onNavigateTo?: (tab: ActiveTab) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSyncModal,
  onExportReport,
  currentUser,
  onLogout,
  onSwitchRole,
  onToggleMobileSidebar,
  onNavigateTo,
}) => {
  const { isSyncing, syncStatus, lastSynced, syncNow } = useFinance();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const isBod = currentUser?.roleCode === 'BOD' || currentUser?.role === 'BOD';

  const timeAgo = lastSynced
    ? new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(lastSynced)
    : '-';

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Company Title */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            {onToggleMobileSidebar && (
              <button
                id="header-btn-toggle-menu"
                onClick={onToggleMobileSidebar}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition"
                title="Buka Menu Navigasi"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <PodaLogo size="md" className="shadow-sm" />
            <div className="hidden sm:block pl-1">
              <span className="inline-block px-2.5 py-0.5 text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 rounded-full">
                Finance Analytics
              </span>
            </div>
          </div>

          {/* Real-time Status & Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Live Sync Badge */}
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <span className="relative flex h-2 w-2">
                {syncStatus === 'connected' && (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </>
                )}
                {syncStatus === 'error' && (
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                )}
                {syncStatus === 'idle' && (
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                )}
              </span>

              <span className="text-slate-700 font-medium">
                {syncStatus === 'connected' ? 'Spreadsheet Terhubung' : 'Gagal Sinkron'}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 text-[11px]">{timeAgo}</span>
            </div>

            {/* Manual Sync Button */}
            <button
              id="header-btn-quick-sync"
              onClick={() => syncNow()}
              disabled={isSyncing}
              title="Sinkronisasi Ulang Data Real-time"
              className="p-2 rounded-lg bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-amber-500' : ''}`} />
            </button>

            {/* Open Sync Modal */}
            <button
              id="header-btn-open-sync-modal"
              onClick={onOpenSyncModal}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 hover:text-slate-900 transition shadow-xs"
            >
              <Link2 className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Sinkronkan Spreadsheet</span>
            </button>

            {/* Export Report */}
            <button
              id="header-btn-export"
              onClick={onExportReport}
              className="p-2 sm:px-3 sm:py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-medium flex items-center space-x-1.5 transition shadow-xs"
              title="Cetak & Unduh Laporan Finansial"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span className="hidden md:inline">Ekspor</span>
            </button>

            {/* User Session & Role Badge */}
            {currentUser && (
              <div className="relative flex items-center pl-2 border-l border-slate-200 space-x-1.5 sm:space-x-2">
                {/* Role Switcher Button / Pill */}
                <button
                  type="button"
                  onClick={() => setIsRoleDropdownOpen((prev) => !prev)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-left transition ${
                    isBod
                      ? 'bg-amber-50/80 hover:bg-amber-100/70 border-amber-200 text-amber-950'
                      : 'bg-emerald-50/80 hover:bg-emerald-100/70 border-emerald-200 text-emerald-950'
                  }`}
                  title="Klik untuk ganti Role (BOD / Head FAT)"
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 shadow-2xs ${
                      isBod ? 'bg-amber-500 text-slate-950 font-black' : 'bg-emerald-600 text-white font-black'
                    }`}
                  >
                    {isBod ? <Award className="w-3.5 h-3.5" /> : <Calculator className="w-3.5 h-3.5" />}
                  </div>
                  <div className="hidden sm:block text-left pr-0.5">
                    <div className="text-[11px] font-bold leading-tight flex items-center space-x-1">
                      <span>{currentUser.role}</span>
                      <span
                        className={`text-[9px] font-bold px-1 py-0.2 rounded ${
                          isBod ? 'bg-amber-200 text-amber-900' : 'bg-emerald-200 text-emerald-900'
                        }`}
                      >
                        {isBod ? 'BOD' : 'FAT'}
                      </span>
                    </div>
                    <div className="text-[9px] text-slate-500 leading-tight">
                      {isBod ? 'Dewan Direksi' : 'Finance, Acct & Tax'}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Role Switcher Dropdown */}
                {isRoleDropdownOpen && onSwitchRole && (
                  <div className="absolute right-10 top-12 mt-1 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                      Ganti Akses Role
                    </div>
                    
                    {/* BOD Option */}
                    <button
                      type="button"
                      onClick={() => {
                        onSwitchRole('BOD');
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition mb-1 ${
                        isBod
                          ? 'bg-amber-50 text-amber-950 font-bold border border-amber-200'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                          <Award className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div>BOD (Board of Directors)</div>
                          <div className="text-[10px] text-slate-500 font-normal">Pengawasan Laba &amp; Eksekutif</div>
                        </div>
                      </div>
                      {isBod && <Check className="w-4 h-4 text-amber-600" />}
                    </button>

                    {/* Head FAT Option */}
                    <button
                      type="button"
                      onClick={() => {
                        onSwitchRole('HEAD_FAT');
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition ${
                        !isBod
                          ? 'bg-emerald-50 text-emerald-950 font-bold border border-emerald-200'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                          <Calculator className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div>Head FAT</div>
                          <div className="text-[10px] text-slate-500 font-normal">Finance, Accounting &amp; Tax</div>
                        </div>
                      </div>
                      {!isBod && <Check className="w-4 h-4 text-emerald-600" />}
                    </button>

                    {/* Quick navigation links to settings */}
                    {onNavigateTo && (
                      <div className="pt-1.5 mt-1.5 border-t border-slate-100 space-y-0.5">
                        <button
                          type="button"
                          onClick={() => {
                            onNavigateTo('role-access');
                            setIsRoleDropdownOpen(false);
                          }}
                          className="w-full flex items-center space-x-2 p-1.5 rounded-lg text-left text-xs text-slate-700 hover:bg-slate-100 transition"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>Pengaturan Role Akses</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onNavigateTo('upload-logo');
                            setIsRoleDropdownOpen(false);
                          }}
                          className="w-full flex items-center space-x-2 p-1.5 rounded-lg text-left text-xs text-slate-700 hover:bg-slate-100 transition"
                        >
                          <UploadCloud className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Upload Foto Logo</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Logout Button */}
                {onLogout && (
                  <button
                    id="header-btn-logout"
                    onClick={onLogout}
                    title="Keluar dari Akun"
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
