export type BrandType = 'Bequ' | 'Orama' | 'Bites' | 'Tester' | 'Other';
export type BottleSize = '60 ML' | '30ML' | '15ML' | 'Tester';
export type ActiveTab =
  | 'dashboard'
  | 'sales'
  | 'bahan-baku'
  | 'hpp'
  | 'opex'
  | 'marketing'
  | 'ar-ap'
  | 'role-access'
  | 'upload-logo';

export type UserRole =
  | 'BOD'
  | 'HEAD_FAT'
  | 'FAT_STAFF'
  | 'INTERNAL_AUDITOR'
  | 'OPERATIONAL_MGR'
  | string;

export interface RolePermissions {
  canViewDashboard: boolean;
  canViewSales: boolean;
  canViewBahanBaku: boolean;
  canViewHpp: boolean;
  canViewOpex: boolean;
  canViewMarketing: boolean;
  canViewArAp: boolean;
  canExportReports: boolean;
  canSyncSpreadsheet: boolean;
  canEditConfig: boolean;
  canViewExecutiveKPI: boolean;
  canViewDetailedAccounting: boolean;
  canManageRoles: boolean;
  canUploadLogo: boolean;
}

export interface RolePermissionConfig {
  roleCode: string;
  roleName: string;
  roleTitle: string;
  department: string;
  badgeColor: 'amber' | 'emerald' | 'blue' | 'purple' | 'rose';
  description: string;
  permissions: RolePermissions;
}

export interface UserAccountItem {
  id: string;
  name: string;
  username: string;
  email: string;
  roleCode: string;
  roleName: string;
  department: string;
  avatarInitials: string;
  status: 'Aktif' | 'Nonaktif';
  lastLogin: string;
  isSystemUser?: boolean;
}

export interface UserSession {
  name: string;
  username: string;
  role: string;
  roleCode: UserRole;
  roleTitle: string;
  department: string;
  lastLogin: string;
  avatarInitials?: string;
  permissions: Partial<RolePermissions> & {
    canExportReports: boolean;
    canSyncSpreadsheet: boolean;
    canEditConfig: boolean;
    canViewExecutiveKPI: boolean;
    canViewDetailedAccounting: boolean;
  };
}

export interface ProductSalesRecord {
  no: number;
  name: string;
  brand: BrandType;
  size: BottleSize;
  isTester: boolean;
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  mei: number;
  juni: number;
  juli: number;
  totalVolume: number;
  estUnitPrice: number; // in IDR (wholesale)
  estRevenue: number;   // totalVolume * estUnitPrice
  estHppUnit: number;   // estimated COGS per bottle
  estTotalHpp: number;  // totalVolume * estHppUnit
}

export interface MonthlyVolumeSummary {
  category: string;
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  mei: number;
  juni: number;
  juli: number;
  total: number;
}

export interface BahanBakuItem {
  id: string;
  code: string;
  name: string;
  category: 'Cairan Dasar (PG/VG)' | 'Nikotin USP' | 'Flavoring & Essence' | 'Additives (WS-23/Sweetener)' | 'Packaging & Kemasan';
  unit: string;
  currentStock: number;
  minStock: number;
  unitPrice: number; // IDR per unit
  supplier: string;
  leadTimeDays: number;
  status: 'Aman' | 'Menipis' | 'Kritis';
  monthlyUsageKg: number;
  lastRestockDate: string;
}

export interface HppBreakdown {
  size: '60 ML' | '30ML' | '15ML';
  rawMaterial: number;     // Bahan kimia (PG, VG, Nicotine, Flavor)
  packaging: number;       // Botol Chubby, Cap, Label Foil, Dus
  directLabor: number;     // Formulasi, filling, capping, packaging labor
  cukaiHptl: number;       // Cukai Rokok Elektrik (Pita Cukai REL)
  overheadPabrik: number;  // Listrik cleanroom, depresiasi mesin
  totalHpp: number;
  wholesalePrice: number;
  grossProfit: number;
  marginPct: number;
}

export interface OpexItem {
  id: string;
  category: 'Gaji & Personalia' | 'Fasilitas & Utilitas' | 'Maintenance & Mesin' | 'Logistik & Ekspedisi' | 'Legalitas, Cukai & Sertifikasi' | 'Admin & IT';
  name: string;
  department: string;
  monthlySpend: {
    jan: number;
    feb: number;
    mar: number;
    apr: number;
    mei: number;
    juni: number;
    juli: number;
  };
  totalSpend: number;
  budgetAllocated: number;
  status: 'Normal' | 'Over Budget' | 'Efisien';
}

export interface MarketingExpenseItem {
  id: string;
  category: 'Vape Influencer & Reviewer' | 'Expo & Vape Fair' | 'Sample & Tester Store' | 'Digital Ads & Sosmed' | 'Retail POSM & Merchandise' | 'Sales Incentive';
  campaignName: string;
  targetProduct: string;
  monthlySpend: {
    jan: number;
    feb: number;
    mar: number;
    apr: number;
    mei: number;
    juni: number;
    juli: number;
  };
  totalSpend: number;
  keyDeliverable: string;
  status: 'Selesai' | 'Berjalan' | 'Perencanaan';
}

export interface AccountReceivableItem {
  id: string;
  invoiceNo: string;
  customerName: string;
  region: string;
  invoiceDate: string;
  dueDate: string;
  terms: string; // e.g. "NET 30", "NET 45"
  amount: number;
  paidAmount: number;
  remainingAmount: number;
  agingDays: number;
  agingBucket: '< 30 Hari' | '31 - 60 Hari' | '61 - 90 Hari' | '> 90 Hari';
  status: 'Lancar' | 'Segera Jatuh Tempo' | 'Terlambat' | 'Kolektibilitas Khusus';
}

export interface AccountPayableItem {
  id: string;
  poNumber: string;
  vendorName: string;
  category: 'Bahan Baku' | 'Kemasan' | 'Pita Cukai' | 'Logistik & Jasa';
  orderDate: string;
  dueDate: string;
  amount: number;
  status: 'Belum Dibayar' | 'Jatuh Tempo' | 'Lunas';
}

export interface MonthlyAmounts {
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  mei: number;
  juni: number;
  juli: number;
}

export interface ArDistriItem {
  id: string;
  no: number;
  customerName: string;
  region: string;
  creditTerm: string;
  months: MonthlyAmounts;
  total: number;
  paid: number;
  balance: number;
  status: 'Lancar' | 'Jatuh Tempo' | 'Lunas' | 'Dalam Penagihan';
  notes?: string;
}

export interface ArAfiliasiItem {
  id: string;
  no: number;
  entityName: string;
  relationship: string;
  months: MonthlyAmounts;
  total: number;
  paid: number;
  balance: number;
  status: 'Lancar' | 'Lunas' | 'Rekonsiliasi' | 'Dalam Proses';
  notes?: string;
}

export interface ApVendorItem {
  id: string;
  no: number;
  vendorName: string;
  category: 'Pita Cukai' | 'Bahan Baku' | 'Kemasan' | 'Logistik & Operasional' | 'Lainnya';
  terms: string;
  months: MonthlyAmounts;
  total: number;
  paid: number;
  balance: number;
  status: 'Belum Dibayar' | 'Jatuh Tempo' | 'Lunas' | 'Cicilan Berjalan';
  notes?: string;
}

export interface FinancialKPIs {
  totalVolume: number;
  totalGrossRevenue: number;
  totalHpp: number;
  totalGrossProfit: number;
  grossMarginPct: number;
  totalOpex: number;
  totalMarketing: number;
  operatingIncome: number; // EBITDA approx
  netProfitEst: number;
  netMarginPct: number;
  totalAr: number;
  overdueAr: number;
  totalAp: number;
  netWorkingCapital: number;
  vol60ml: number;
  vol30ml: number;
  vol15ml: number;
}
