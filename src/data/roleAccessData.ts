import { RolePermissionConfig, UserAccountItem } from '../types';

export const DEFAULT_ROLES_CONFIG: RolePermissionConfig[] = [
  {
    roleCode: 'BOD',
    roleName: 'BOD (Board of Directors)',
    roleTitle: 'Board of Directors',
    department: 'Executive Board & Strategic Leadership',
    badgeColor: 'amber',
    description:
      'Akses eksekutif untuk pengawasan laba kotor & bersih, volume penjualan 128 SKU, margin ekspansi bisnis, serta otorisasi strategis.',
    permissions: {
      canViewDashboard: true,
      canViewSales: true,
      canViewBahanBaku: true,
      canViewHpp: true,
      canViewOpex: true,
      canViewMarketing: true,
      canViewArAp: true,
      canExportReports: true,
      canSyncSpreadsheet: true,
      canEditConfig: true,
      canViewExecutiveKPI: true,
      canViewDetailedAccounting: false,
      canManageRoles: true,
      canUploadLogo: true,
    },
  },
  {
    roleCode: 'HEAD_FAT',
    roleName: 'Head FAT',
    roleTitle: 'Head of Finance, Accounting & Tax',
    department: 'Finance, Accounting & Tax Division',
    badgeColor: 'emerald',
    description:
      'Kontrol penuh akuntansi & audit: HPP/Cukai REL per botol, rekonsiliasi kas, aging AR/AP distributor & vendor, OPEX pabrik, serta sinkronisasi data.',
    permissions: {
      canViewDashboard: true,
      canViewSales: true,
      canViewBahanBaku: true,
      canViewHpp: true,
      canViewOpex: true,
      canViewMarketing: true,
      canViewArAp: true,
      canExportReports: true,
      canSyncSpreadsheet: true,
      canEditConfig: true,
      canViewExecutiveKPI: true,
      canViewDetailedAccounting: true,
      canManageRoles: true,
      canUploadLogo: true,
    },
  },
  {
    roleCode: 'FAT_STAFF',
    roleName: 'Staff FAT',
    roleTitle: 'Finance & Accounting Specialist',
    department: 'Finance, Accounting & Tax Division',
    badgeColor: 'blue',
    description:
      'Akses operasional harian untuk input penagihan AR distributor, verifikasi AP vendor, pencatatan beban pemasaran, dan biaya operasional.',
    permissions: {
      canViewDashboard: true,
      canViewSales: true,
      canViewBahanBaku: true,
      canViewHpp: false,
      canViewOpex: true,
      canViewMarketing: true,
      canViewArAp: true,
      canExportReports: true,
      canSyncSpreadsheet: false,
      canEditConfig: false,
      canViewExecutiveKPI: false,
      canViewDetailedAccounting: true,
      canManageRoles: false,
      canUploadLogo: false,
    },
  },
  {
    roleCode: 'INTERNAL_AUDITOR',
    roleName: 'Internal Auditor',
    roleTitle: 'Financial & Compliance Auditor',
    department: 'Internal Audit & Risk Governance',
    badgeColor: 'purple',
    description:
      'Akses audit independen untuk verifikasi kepatuhan tarif cukai rokok elektrik (REL), pemeriksaan stok bahan baku USP, dan validasi rekonsiliasi piutang.',
    permissions: {
      canViewDashboard: true,
      canViewSales: true,
      canViewBahanBaku: true,
      canViewHpp: true,
      canViewOpex: true,
      canViewMarketing: true,
      canViewArAp: true,
      canExportReports: true,
      canSyncSpreadsheet: false,
      canEditConfig: false,
      canViewExecutiveKPI: true,
      canViewDetailedAccounting: true,
      canManageRoles: false,
      canUploadLogo: false,
    },
  },
  {
    roleCode: 'OPERATIONAL_MGR',
    roleName: 'Manager Operasional',
    roleTitle: 'Plant & Production Manager',
    department: 'Operations & Supply Chain',
    badgeColor: 'rose',
    description:
      'Pemantauan stok bahan baku cairan (PG/VG, Nikotin, Essence), lead time pasokan supplier, dan efisiensi utilitas mesin pengisian botol.',
    permissions: {
      canViewDashboard: false,
      canViewSales: true,
      canViewBahanBaku: true,
      canViewHpp: true,
      canViewOpex: true,
      canViewMarketing: false,
      canViewArAp: false,
      canExportReports: true,
      canSyncSpreadsheet: false,
      canEditConfig: false,
      canViewExecutiveKPI: false,
      canViewDetailedAccounting: false,
      canManageRoles: false,
      canUploadLogo: false,
    },
  },
];

export const DEFAULT_USER_ACCOUNTS: UserAccountItem[] = [
  {
    id: 'usr-1',
    name: 'Dewan Direksi PODA',
    username: 'bod',
    email: 'bod@poda.co.id',
    roleCode: 'BOD',
    roleName: 'BOD (Board of Directors)',
    department: 'Executive Board & Strategic Leadership',
    avatarInitials: 'BOD',
    status: 'Aktif',
    lastLogin: 'Hari ini, 09:15 WIB',
    isSystemUser: true,
  },
  {
    id: 'usr-2',
    name: 'Bambang Wijaya, SE, Ak',
    username: 'headfat',
    email: 'headfat@poda.co.id',
    roleCode: 'HEAD_FAT',
    roleName: 'Head FAT',
    department: 'Finance, Accounting & Tax Division',
    avatarInitials: 'BW',
    status: 'Aktif',
    lastLogin: 'Hari ini, 08:30 WIB',
    isSystemUser: true,
  },
  {
    id: 'usr-3',
    name: 'Rina Kartika',
    username: 'fat_staff',
    email: 'rina.fat@poda.co.id',
    roleCode: 'FAT_STAFF',
    roleName: 'Staff FAT',
    department: 'Finance, Accounting & Tax Division',
    avatarInitials: 'RK',
    status: 'Aktif',
    lastLogin: 'Kemarin, 16:45 WIB',
  },
  {
    id: 'usr-4',
    name: 'Hendra Pratama, CPA',
    username: 'auditor',
    email: 'h.pratama@poda.co.id',
    roleCode: 'INTERNAL_AUDITOR',
    roleName: 'Internal Auditor',
    department: 'Internal Audit & Risk Governance',
    avatarInitials: 'HP',
    status: 'Aktif',
    lastLogin: '05 Sep 2026',
  },
  {
    id: 'usr-5',
    name: 'Dedi Supriyadi, ST',
    username: 'ops_mgr',
    email: 'dedi.ops@poda.co.id',
    roleCode: 'OPERATIONAL_MGR',
    roleName: 'Manager Operasional',
    department: 'Operations & Supply Chain',
    avatarInitials: 'DS',
    status: 'Aktif',
    lastLogin: '07 Sep 2026',
  },
];

const STORAGE_ROLES_KEY = 'poda_roles_config';
const STORAGE_USERS_KEY = 'poda_user_accounts';

export function getStoredRoles(): RolePermissionConfig[] {
  try {
    const saved = localStorage.getItem(STORAGE_ROLES_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load roles config:', e);
  }
  return DEFAULT_ROLES_CONFIG;
}

export function saveStoredRoles(roles: RolePermissionConfig[]): void {
  try {
    localStorage.setItem(STORAGE_ROLES_KEY, JSON.stringify(roles));
  } catch (e) {
    console.error('Failed to save roles config:', e);
  }
}

export function getStoredUsers(): UserAccountItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_USERS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load user accounts:', e);
  }
  return DEFAULT_USER_ACCOUNTS;
}

export function saveStoredUsers(users: UserAccountItem[]): void {
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save user accounts:', e);
  }
}
