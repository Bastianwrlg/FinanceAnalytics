import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  ProductSalesRecord,
  MonthlyVolumeSummary,
  BahanBakuItem,
  HppBreakdown,
  OpexItem,
  MarketingExpenseItem,
  AccountReceivableItem,
  AccountPayableItem,
  FinancialKPIs,
  ArDistriItem,
  ArAfiliasiItem,
  ApVendorItem,
} from '../types';
import { RAW_PODA_CSV, parsePodaCsv } from '../data/rawPodaCsv';
import {
  INITIAL_BAHAN_BAKU,
  INITIAL_HPP_BREAKDOWN,
  INITIAL_OPEX,
  INITIAL_MARKETING,
  INITIAL_AR,
  INITIAL_AP,
  INITIAL_AR_DISTRI,
  INITIAL_AR_AFILIASI,
  INITIAL_AP_VENDOR,
} from '../data/mockFinanceData';

interface FinanceContextType {
  products: ProductSalesRecord[];
  monthlySummaries: MonthlyVolumeSummary[];
  bahanBaku: BahanBakuItem[];
  hppList: HppBreakdown[];
  opexList: OpexItem[];
  marketingList: MarketingExpenseItem[];
  arList: AccountReceivableItem[];
  apList: AccountPayableItem[];
  arDistriList: ArDistriItem[];
  setArDistriList: React.Dispatch<React.SetStateAction<ArDistriItem[]>>;
  arAfiliasiList: ArAfiliasiItem[];
  setArAfiliasiList: React.Dispatch<React.SetStateAction<ArAfiliasiItem[]>>;
  apVendorList: ApVendorItem[];
  setApVendorList: React.Dispatch<React.SetStateAction<ApVendorItem[]>>;
  kpis: FinancialKPIs;
  syncUrl: string;
  setSyncUrl: (url: string) => void;
  isSyncing: boolean;
  lastSynced: Date | null;
  syncStatus: 'connected' | 'idle' | 'error';
  syncError: string | null;
  autoSyncInterval: number; // in seconds (0 = off)
  setAutoSyncInterval: (sec: number) => void;
  syncNow: (customUrl?: string) => Promise<boolean>;
  resetToDefaultData: () => void;
  // Raw CSV source for inspection
  currentCsv: string;
  importCsvText: (text: string) => boolean;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const DEFAULT_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?usp=sharing';

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCsv, setCurrentCsv] = useState<string>(() => {
    const saved = localStorage.getItem('poda_financial_csv');
    return saved || RAW_PODA_CSV;
  });

  const [syncUrl, setSyncUrl] = useState<string>(() => {
    return localStorage.getItem('poda_sheet_url') || DEFAULT_SHEET_URL;
  });

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(() => {
    const saved = localStorage.getItem('poda_last_synced');
    return saved ? new Date(saved) : new Date();
  });
  const [syncStatus, setSyncStatus] = useState<'connected' | 'idle' | 'error'>('connected');
  const [syncError, setSyncError] = useState<string | null>(null);
  const [autoSyncInterval, setAutoSyncInterval] = useState<number>(0);

  // Entities
  const [bahanBaku] = useState<BahanBakuItem[]>(INITIAL_BAHAN_BAKU);
  const [hppList] = useState<HppBreakdown[]>(INITIAL_HPP_BREAKDOWN);
  const [opexList] = useState<OpexItem[]>(INITIAL_OPEX);
  const [marketingList] = useState<MarketingExpenseItem[]>(INITIAL_MARKETING);
  const [arList] = useState<AccountReceivableItem[]>(INITIAL_AR);
  const [apList] = useState<AccountPayableItem[]>(INITIAL_AP);

  const [arDistriList, setArDistriList] = useState<ArDistriItem[]>(() => {
    try {
      const saved = localStorage.getItem('poda_ar_distri');
      return saved ? JSON.parse(saved) : INITIAL_AR_DISTRI;
    } catch {
      return INITIAL_AR_DISTRI;
    }
  });

  const [arAfiliasiList, setArAfiliasiList] = useState<ArAfiliasiItem[]>(() => {
    try {
      const saved = localStorage.getItem('poda_ar_afiliasi');
      return saved ? JSON.parse(saved) : INITIAL_AR_AFILIASI;
    } catch {
      return INITIAL_AR_AFILIASI;
    }
  });

  const [apVendorList, setApVendorList] = useState<ApVendorItem[]>(() => {
    try {
      const saved = localStorage.getItem('poda_ap_vendor');
      return saved ? JSON.parse(saved) : INITIAL_AP_VENDOR;
    } catch {
      return INITIAL_AP_VENDOR;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('poda_ar_distri', JSON.stringify(arDistriList));
    } catch {
      // ignore
    }
  }, [arDistriList]);

  useEffect(() => {
    try {
      localStorage.setItem('poda_ar_afiliasi', JSON.stringify(arAfiliasiList));
    } catch {
      // ignore
    }
  }, [arAfiliasiList]);

  useEffect(() => {
    try {
      localStorage.setItem('poda_ap_vendor', JSON.stringify(apVendorList));
    } catch {
      // ignore
    }
  }, [apVendorList]);

  // Parse CSV
  const { products, monthlyVolumeSummary: monthlySummaries } = useMemo(() => {
    try {
      return parsePodaCsv(currentCsv);
    } catch (e) {
      console.error('Error parsing CSV:', e);
      return parsePodaCsv(RAW_PODA_CSV);
    }
  }, [currentCsv]);

  // Compute overall financial KPIs
  const kpis: FinancialKPIs = useMemo(() => {
    let totalVolume = 0;
    let totalGrossRevenue = 0;
    let totalHpp = 0;
    let vol60ml = 0;
    let vol30ml = 0;
    let vol15ml = 0;

    for (const p of products) {
      totalVolume += p.totalVolume;
      totalGrossRevenue += p.estRevenue;
      totalHpp += p.estTotalHpp;

      if (p.size === '60 ML') vol60ml += p.totalVolume;
      else if (p.size === '30ML') vol30ml += p.totalVolume;
      else if (p.size === '15ML') vol15ml += p.totalVolume;
    }

    const totalGrossProfit = totalGrossRevenue - totalHpp;
    const grossMarginPct = totalGrossRevenue > 0 ? (totalGrossProfit / totalGrossRevenue) * 100 : 0;

    const totalOpex = opexList.reduce((acc, curr) => acc + curr.totalSpend, 0);
    const totalMarketing = marketingList.reduce((acc, curr) => acc + curr.totalSpend, 0);

    const operatingIncome = totalGrossProfit - totalOpex - totalMarketing;
    // Estimated corporate income tax (Pph 22% in Indonesia)
    const netProfitEst = operatingIncome > 0 ? operatingIncome * 0.78 : operatingIncome;
    const netMarginPct = totalGrossRevenue > 0 ? (netProfitEst / totalGrossRevenue) * 100 : 0;

    const totalAr =
      arDistriList.reduce((acc, curr) => acc + curr.balance, 0) +
      arAfiliasiList.reduce((acc, curr) => acc + curr.balance, 0);

    const overdueAr =
      arDistriList
        .filter((ar) => ar.status === 'Jatuh Tempo' || ar.status === 'Dalam Penagihan')
        .reduce((acc, curr) => acc + curr.balance, 0) +
      arAfiliasiList
        .filter((ar) => ar.status === 'Rekonsiliasi')
        .reduce((acc, curr) => acc + curr.balance, 0);

    const totalAp = apVendorList.reduce((acc, curr) => acc + curr.balance, 0);
    const netWorkingCapital = totalAr - totalAp;

    return {
      totalVolume,
      totalGrossRevenue,
      totalHpp,
      totalGrossProfit,
      grossMarginPct,
      totalOpex,
      totalMarketing,
      operatingIncome,
      netProfitEst,
      netMarginPct,
      totalAr,
      overdueAr,
      totalAp,
      netWorkingCapital,
      vol60ml,
      vol30ml,
      vol15ml,
    };
  }, [products, opexList, marketingList, arDistriList, arAfiliasiList, apVendorList]);

  // Sync function
  const syncNow = async (customUrl?: string): Promise<boolean> => {
    const targetUrl = (customUrl || syncUrl).trim();
    if (!targetUrl) {
      setSyncStatus('error');
      setSyncError('URL spreadsheet tidak boleh kosong');
      return false;
    }

    setIsSyncing(true);
    setSyncError(null);

    try {
      const response = await fetch(`/api/sync-sheet?url=${encodeURIComponent(targetUrl)}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Gagal sinkronisasi dengan spreadsheet');
      }

      if (data.csv && data.csv.trim().length > 20) {
        setCurrentCsv(data.csv);
        localStorage.setItem('poda_financial_csv', data.csv);
      }

      setSyncStatus('connected');
      const now = new Date();
      setLastSynced(now);
      localStorage.setItem('poda_last_synced', now.toISOString());
      localStorage.setItem('poda_sheet_url', targetUrl);
      setIsSyncing(false);
      return true;
    } catch (err: any) {
      console.warn('Sync server error, checking fallback:', err);
      setSyncStatus('error');
      setSyncError(err.message || 'Koneksi ke spreadsheet terputus');
      setIsSyncing(false);
      return false;
    }
  };

  const importCsvText = (text: string): boolean => {
    try {
      const parsed = parsePodaCsv(text);
      if (parsed.products.length > 0) {
        setCurrentCsv(text);
        localStorage.setItem('poda_financial_csv', text);
        setSyncStatus('connected');
        setSyncError(null);
        const now = new Date();
        setLastSynced(now);
        localStorage.setItem('poda_last_synced', now.toISOString());
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const resetToDefaultData = () => {
    setCurrentCsv(RAW_PODA_CSV);
    localStorage.removeItem('poda_financial_csv');
    setArDistriList(INITIAL_AR_DISTRI);
    setArAfiliasiList(INITIAL_AR_AFILIASI);
    setApVendorList(INITIAL_AP_VENDOR);
    localStorage.removeItem('poda_ar_distri');
    localStorage.removeItem('poda_ar_afiliasi');
    localStorage.removeItem('poda_ap_vendor');
    setSyncStatus('connected');
    setSyncError(null);
    setLastSynced(new Date());
  };

  // Auto-sync polling
  useEffect(() => {
    if (autoSyncInterval <= 0) return;
    const interval = setInterval(() => {
      syncNow();
    }, autoSyncInterval * 1000);
    return () => clearInterval(interval);
  }, [autoSyncInterval, syncUrl]);

  return (
    <FinanceContext.Provider
      value={{
        products,
        monthlySummaries,
        bahanBaku,
        hppList,
        opexList,
        marketingList,
        arList,
        apList,
        arDistriList,
        setArDistriList,
        arAfiliasiList,
        setArAfiliasiList,
        apVendorList,
        setApVendorList,
        kpis,
        syncUrl,
        setSyncUrl,
        isSyncing,
        lastSynced,
        syncStatus,
        syncError,
        autoSyncInterval,
        setAutoSyncInterval,
        syncNow,
        resetToDefaultData,
        currentCsv,
        importCsvText,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
