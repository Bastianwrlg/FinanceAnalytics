import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Boxes,
  Scale,
  Building2,
  Megaphone,
  CreditCard,
  X,
  ChevronRight,
  Link2,
  Award,
  Calculator,
  RefreshCw,
  ShieldCheck,
  UploadCloud,
} from 'lucide-react';
import { ActiveTab, UserSession, UserRole } from '../types';
import { useFinance } from '../context/FinanceContext';
import { PodaLogo } from './PodaLogo';

interface NavigationProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  onOpenSyncModal?: () => void;
  currentUser?: UserSession | null;
  onSwitchRole?: (role: UserRole) => void;
}

interface NavItem {
  id: ActiveTab;
  label: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  roleBadge?: { text: string; forBod?: boolean; forFat?: boolean };
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onChangeTab,
  isMobileOpen = false,
  onCloseMobile,
  onOpenSyncModal,
  currentUser,
  onSwitchRole,
}) => {
  const { syncStatus } = useFinance();
  const isBod = currentUser?.roleCode === 'BOD' || currentUser?.role === 'BOD';

  const navGroups: NavGroup[] = [
    {
      title: 'IKHTISAR UTAMA',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard Eksekutif',
          description: 'Ringkasan KPI & Analisis',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: 'ANALISIS KEUANGAN & BIAYA',
      items: [
        {
          id: 'sales',
          label: 'Sales (Penjualan)',
          description: '128 SKU E-Liquid',
          icon: TrendingUp,
        },
        {
          id: 'bahan-baku',
          label: 'Bahan Baku',
          description: 'PG, VG, Nikotin & Essen',
          icon: Boxes,
        },
        {
          id: 'hpp',
          label: 'HPP & Cukai',
          description: 'COGS & Tarif REL',
          icon: Scale,
        },
        {
          id: 'opex',
          label: 'Beban Operasional',
          description: 'Gaji, Utilitas, Lab',
          icon: Building2,
        },
        {
          id: 'marketing',
          label: 'Marketing Expense',
          description: 'Event & Brand Promo',
          icon: Megaphone,
        },
      ],
    },
    {
      title: 'KONTROL ARUS KAS',
      items: [
        {
          id: 'ar-ap',
          label: 'Piutang & Utang (AR/AP)',
          description: 'Aging Schedule Mitra',
          icon: CreditCard,
        },
      ],
    },
    {
      title: 'PENGATURAN SISTEM',
      items: [
        {
          id: 'role-access',
          label: 'Pengaturan Role Akses',
          description: 'Matriks Wewenang & Akun',
          icon: ShieldCheck,
        },
        {
          id: 'upload-logo',
          label: 'Upload Foto Logo',
          description: 'Kustomisasi Brand & Ikon',
          icon: UploadCloud,
        },
      ],
    },
  ];

  const handleSelectTab = (tabId: ActiveTab) => {
    onChangeTab(tabId);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const navContent = (
    <div className="flex flex-col h-full justify-between">
      {/* Top Section: Active Role Card & Navigation Items */}
      <div className="space-y-5">
        {/* Active Role Card */}
        {currentUser && (
          <div
            className={`p-3 rounded-xl border transition ${
              isBod
                ? 'bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-amber-300/80 shadow-xs'
                : 'bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-300/80 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shadow-2xs ${
                    isBod ? 'bg-amber-500 text-slate-950' : 'bg-emerald-600 text-white'
                  }`}
                >
                  {isBod ? <Award className="w-4 h-4" /> : <Calculator className="w-4 h-4" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    {currentUser.role}
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight">
                    {isBod ? 'Board of Directors' : 'Finance, Acct & Tax'}
                  </div>
                </div>
              </div>

              {/* Role Tag */}
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${
                  isBod
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                }`}
              >
                {isBod ? 'Akses BOD' : 'Akses FAT'}
              </span>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed mb-2.5">
              {isBod
                ? 'Mode eksekutif untuk pengawasan performa penjualan 128 SKU & margin laba.'
                : 'Mode kontrol akuntansi untuk audit HPP/Cukai, bahan baku, OPEX, & rekonsiliasi kas.'}
            </p>

            {/* Quick Switch Button */}
            {onSwitchRole && (
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">Ganti profil role:</span>
                <button
                  type="button"
                  onClick={() => onSwitchRole(isBod ? 'HEAD_FAT' : 'BOD')}
                  className={`text-[10px] font-bold px-2 py-1 rounded-md border transition flex items-center space-x-1 ${
                    isBod
                      ? 'bg-white hover:bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-white hover:bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Switch ke {isBod ? 'Head FAT' : 'BOD'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Scrollable Navigation Groups */}
        <div className="space-y-5">
          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1.5">
              <div className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>{group.title}</span>
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  const isRoleRecommended =
                    (isBod && item.roleBadge?.forBod) || (!isBod && item.roleBadge?.forFat);

                  return (
                    <button
                      key={item.id}
                      id={`nav-tab-${item.id}`}
                      onClick={() => handleSelectTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition duration-150 group text-left ${
                        isActive
                          ? isBod
                            ? 'bg-amber-500 text-slate-950 font-bold shadow-xs ring-1 ring-amber-400/40'
                            : 'bg-emerald-600 text-white font-bold shadow-xs ring-1 ring-emerald-500/40'
                          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 font-medium'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div
                          className={`p-1.5 rounded-lg shrink-0 transition ${
                            isActive
                              ? isBod
                                ? 'bg-slate-950/10 text-slate-950'
                                : 'bg-white/20 text-white'
                              : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-800'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 truncate">
                          <div className="flex items-center space-x-1.5">
                            <span className="block truncate text-xs">{item.label}</span>
                            {item.roleBadge && !isActive && (
                              <span
                                className={`text-[9px] font-semibold px-1 py-0.2 rounded ${
                                  isRoleRecommended
                                    ? isBod
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-emerald-100 text-emerald-800'
                                    : 'bg-slate-100 text-slate-500'
                                }`}
                              >
                                {item.roleBadge.text}
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <span
                              className={`block text-[10px] truncate leading-tight mt-0.5 ${
                                isActive
                                  ? isBod
                                    ? 'text-slate-800 font-normal'
                                    : 'text-emerald-100 font-normal'
                                  : 'text-slate-400 font-normal'
                              }`}
                            >
                              {item.description}
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-3.5 h-3.5 shrink-0 transition ${
                          isActive
                            ? isBod
                              ? 'text-slate-950 translate-x-0.5'
                              : 'text-white translate-x-0.5'
                            : 'text-slate-300 opacity-0 group-hover:opacity-100 group-hover:text-slate-500'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Sidebar Widgets */}
      <div className="mt-8 pt-4 border-t border-slate-200 space-y-3">
        {/* Quick Action Shortcuts */}
        <div className="space-y-1.5">
          {onOpenSyncModal && (
            <button
              onClick={() => {
                onOpenSyncModal();
                if (onCloseMobile) onCloseMobile();
              }}
              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 transition text-left"
            >
              <Link2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Sinkronkan Spreadsheet</span>
            </button>
          )}
        </div>

        {/* Database Status Card */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center space-x-2 text-[11px]">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                syncStatus === 'connected'
                  ? 'bg-emerald-500 ring-2 ring-emerald-200'
                  : 'bg-amber-500'
              }`}
            />
            <span className="font-semibold text-slate-700">
              {syncStatus === 'connected' ? 'Data Aktif Terhubung' : 'Pembaruan Siap'}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            128 SKU Penjualan • Jan - Jul 2026
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Vertical Sidebar (Always visible on lg and up) */}
      <aside className="hidden lg:block w-64 xl:w-72 bg-white border-r border-slate-200 p-4 shrink-0 min-h-[calc(100vh-4.5rem)] sticky top-18 self-start overflow-y-auto max-h-[calc(100vh-4.5rem)] scrollbar-thin">
        {navContent}
      </aside>

      {/* Mobile Drawer (Visible on small screens when triggered) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />

          {/* Drawer Panel */}
          <div className="relative flex flex-col w-72 max-w-[85vw] bg-white p-5 shadow-2xl z-10 min-h-screen overflow-y-auto">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
              <PodaLogo size="sm" className="shadow-xs" />
              <button
                onClick={onCloseMobile}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu items */}
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
