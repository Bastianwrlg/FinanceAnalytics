import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatRupiah } from '../../utils/formatters';
import {
  CreditCard,
  Building,
  Users,
  Handshake,
  Layers,
  FileSpreadsheet,
  Download,
  Clock,
  TrendingUp,
  BarChart3,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, Line, ComposedChart } from 'recharts';
import { ArApMonthlySummaryTable } from './arap/ArApMonthlySummaryTable';
import { ArDistriTable } from './arap/ArDistriTable';
import { ArAfiliasiTable } from './arap/ArAfiliasiTable';
import { ApVendorTable } from './arap/ApVendorTable';
import { ArApSyncModal } from './arap/ArApSyncModal';

export const ArApView: React.FC = () => {
  const {
    arDistriList,
    setArDistriList,
    arAfiliasiList,
    setArAfiliasiList,
    apVendorList,
    setApVendorList,
    kpis,
    syncUrl,
  } = useFinance();

  const [activeSheetTab, setActiveSheetTab] = useState<'rekap' | 'distri' | 'afiliasi' | 'payable' | 'all'>('rekap');
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  // Computations for KPI cards
  const totalDistriBalance = arDistriList.reduce((acc, c) => acc + c.balance, 0);
  const totalDistriPaid = arDistriList.reduce((acc, c) => acc + c.paid, 0);
  const totalDistriTotal = arDistriList.reduce((acc, c) => acc + c.total, 0);

  const totalAfiliasiBalance = arAfiliasiList.reduce((acc, c) => acc + c.balance, 0);
  const totalAfiliasiPaid = arAfiliasiList.reduce((acc, c) => acc + c.paid, 0);
  const totalAfiliasiTotal = arAfiliasiList.reduce((acc, c) => acc + c.total, 0);

  const totalApBalance = apVendorList.reduce((acc, c) => acc + c.balance, 0);
  const totalApPaid = apVendorList.reduce((acc, c) => acc + c.paid, 0);
  const totalApTotal = apVendorList.reduce((acc, c) => acc + c.total, 0);

  const totalArBalance = totalDistriBalance + totalAfiliasiBalance;
  const netWorkingCapital = totalArBalance - totalApBalance;

  // Monthly aggregated data for chart (Jan - Jul)
  const monthlyChartData = [
    {
      month: 'Jan',
      distri: arDistriList.reduce((acc, c) => acc + (c.months.jan || 0), 0) / 1e9,
      afiliasi: arAfiliasiList.reduce((acc, c) => acc + (c.months.jan || 0), 0) / 1e9,
      payable: apVendorList.reduce((acc, c) => acc + (c.months.jan || 0), 0) / 1e9,
    },
    {
      month: 'Feb',
      distri: arDistriList.reduce((acc, c) => acc + (c.months.feb || 0), 0) / 1e9,
      afiliasi: arAfiliasiList.reduce((acc, c) => acc + (c.months.feb || 0), 0) / 1e9,
      payable: apVendorList.reduce((acc, c) => acc + (c.months.feb || 0), 0) / 1e9,
    },
    {
      month: 'Mar',
      distri: arDistriList.reduce((acc, c) => acc + (c.months.mar || 0), 0) / 1e9,
      afiliasi: arAfiliasiList.reduce((acc, c) => acc + (c.months.mar || 0), 0) / 1e9,
      payable: apVendorList.reduce((acc, c) => acc + (c.months.mar || 0), 0) / 1e9,
    },
    {
      month: 'Apr',
      distri: arDistriList.reduce((acc, c) => acc + (c.months.apr || 0), 0) / 1e9,
      afiliasi: arAfiliasiList.reduce((acc, c) => acc + (c.months.apr || 0), 0) / 1e9,
      payable: apVendorList.reduce((acc, c) => acc + (c.months.apr || 0), 0) / 1e9,
    },
    {
      month: 'Mei',
      distri: arDistriList.reduce((acc, c) => acc + (c.months.mei || 0), 0) / 1e9,
      afiliasi: arAfiliasiList.reduce((acc, c) => acc + (c.months.mei || 0), 0) / 1e9,
      payable: apVendorList.reduce((acc, c) => acc + (c.months.mei || 0), 0) / 1e9,
    },
    {
      month: 'Jun',
      distri: arDistriList.reduce((acc, c) => acc + (c.months.juni || 0), 0) / 1e9,
      afiliasi: arAfiliasiList.reduce((acc, c) => acc + (c.months.juni || 0), 0) / 1e9,
      payable: apVendorList.reduce((acc, c) => acc + (c.months.juni || 0), 0) / 1e9,
    },
    {
      month: 'Jul',
      distri: arDistriList.reduce((acc, c) => acc + (c.months.juli || 0), 0) / 1e9,
      afiliasi: arAfiliasiList.reduce((acc, c) => acc + (c.months.juli || 0), 0) / 1e9,
      payable: apVendorList.reduce((acc, c) => acc + (c.months.juli || 0), 0) / 1e9,
    },
  ];

  return (
    <div className="space-y-6 pb-14">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-amber-500 text-slate-950">
              Sheet: AR &amp; AP
            </span>
            <span className="text-xs text-slate-500 font-medium">Buku Besar Piutang &amp; Utang Terpadu</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Piutang &amp; Utang (Receivable Distri, Receivable Afiliansi, Payable)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Tampilan data bulanan (Januari - Juli) terdistribusi sesuai struktur sheet Google Spreadsheet PODA E-Liquid
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsSyncModalOpen(true)}
            className="flex items-center space-x-2 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl shadow-xs transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Sinkronkan Sheet AR &amp; AP</span>
          </button>
          <button
            onClick={() => setIsSyncModalOpen(true)}
            className="flex items-center space-x-2 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Receivable Distri */}
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs border-t-4 border-t-blue-500">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Receivable Distri
            </span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight mt-2">
            {formatRupiah(totalDistriBalance, true)}
          </h3>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
            <span>Billing: {formatRupiah(totalDistriTotal, true)}</span>
            <span className="text-emerald-700 font-bold">Terbayar {Math.round((totalDistriPaid / (totalDistriTotal || 1)) * 100)}%</span>
          </div>
        </div>

        {/* Card 2: Receivable Afiliansi */}
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs border-t-4 border-t-cyan-500">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Receivable Afiliansi
            </span>
            <Handshake className="w-4 h-4 text-cyan-600" />
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight mt-2">
            {formatRupiah(totalAfiliasiBalance, true)}
          </h3>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
            <span>Billing: {formatRupiah(totalAfiliasiTotal, true)}</span>
            <span className="text-emerald-700 font-bold">Terbayar {Math.round((totalAfiliasiPaid / (totalAfiliasiTotal || 1)) * 100)}%</span>
          </div>
        </div>

        {/* Card 3: Total AR Konsolidasi */}
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs border-t-4 border-t-sky-600">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Piutang (AR)
            </span>
            <CreditCard className="w-4 h-4 text-sky-600" />
          </div>
          <h3 className="text-xl font-black text-sky-950 tracking-tight mt-2">
            {formatRupiah(totalArBalance, true)}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            Gabungan Distri &amp; Afiliasi
          </p>
        </div>

        {/* Card 4: Total Payable */}
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs border-t-4 border-t-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Payable (AP)
            </span>
            <Building className="w-4 h-4 text-amber-600" />
          </div>
          <h3 className="text-xl font-black text-amber-900 tracking-tight mt-2">
            {formatRupiah(totalApBalance, true)}
          </h3>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
            <span>Vendor: {formatRupiah(totalApTotal, true)}</span>
            <span className="text-amber-800 font-bold">Cukai: Rp 2.15 M</span>
          </div>
        </div>

        {/* Card 5: Net Working Capital */}
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs border-t-4 border-t-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Net Working Capital
            </span>
            <TrendingUp className="w-4 h-4 text-slate-800" />
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight mt-2">
            {formatRupiah(netWorkingCapital, true)}
          </h3>
          <p className="text-[11px] text-emerald-600 mt-1 font-semibold">
            Posisi Likuiditas Positif (AR &gt; AP)
          </p>
        </div>
      </div>

      {/* Spreadsheet Tabs Switcher */}
      <div className="border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-xs flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setActiveSheetTab('rekap')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeSheetTab === 'rekap'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Rekapitulasi Bulanan AR &amp; AP</span>
          </button>
          <button
            onClick={() => setActiveSheetTab('distri')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeSheetTab === 'distri'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Receivable Distri</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-900 font-mono">
              {arDistriList.length}
            </span>
          </button>
          <button
            onClick={() => setActiveSheetTab('afiliasi')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeSheetTab === 'afiliasi'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Handshake className="w-4 h-4" />
            <span>Receivable Afiliansi</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-100 text-cyan-900 font-mono">
              {arAfiliasiList.length}
            </span>
          </button>
          <button
            onClick={() => setActiveSheetTab('payable')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeSheetTab === 'payable'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Payable (Utang &amp; Cukai)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 font-mono">
              {apVendorList.length}
            </span>
          </button>
          <button
            onClick={() => setActiveSheetTab('all')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeSheetTab === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Semua Sheet Sekaligus</span>
          </button>
        </div>

        <div className="px-3 text-xs text-slate-500 font-mono">
          Periode: <strong className="text-slate-800">Jan - Jul 2026</strong>
        </div>
      </div>

      {/* Monthly Trend Chart */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-amber-500" />
              <span>Grafik Komparasi Bulanan: Receivable Distri vs Receivable Afiliansi vs Payable</span>
            </h3>
            <p className="text-xs text-slate-500">
              Tren penagihan piutang dan tagihan utang per bulan (dalam satuan Miliar Rupiah)
            </p>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-blue-500"></span>
              <span className="text-slate-600 font-medium">AR Distri</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-cyan-500"></span>
              <span className="text-slate-600 font-medium">AR Afiliasi</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-amber-500"></span>
              <span className="text-slate-600 font-medium">AP Payable</span>
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis
                stroke="#94a3b8"
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickFormatter={(val) => `Rp ${val}M`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f0',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#0f172a',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                formatter={(val: any, name: any) => [
                  `Rp ${Number(val).toFixed(2)} Miliar`,
                  name === 'distri'
                    ? 'Receivable Distri'
                    : name === 'afiliasi'
                    ? 'Receivable Afiliansi'
                    : 'Payable (Utang & Cukai)',
                ]}
              />
              <Bar dataKey="distri" name="distri" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="afiliasi" name="afiliasi" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="payable" name="payable" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dynamic Tab Content */}
      {activeSheetTab === 'rekap' && (
        <ArApMonthlySummaryTable
          arDistriList={arDistriList}
          arAfiliasiList={arAfiliasiList}
          apVendorList={apVendorList}
        />
      )}

      {activeSheetTab === 'distri' && (
        <ArDistriTable items={arDistriList} onUpdateItems={setArDistriList} />
      )}

      {activeSheetTab === 'afiliasi' && (
        <ArAfiliasiTable items={arAfiliasiList} onUpdateItems={setArAfiliasiList} />
      )}

      {activeSheetTab === 'payable' && (
        <ApVendorTable items={apVendorList} onUpdateItems={setApVendorList} />
      )}

      {activeSheetTab === 'all' && (
        <div className="space-y-8">
          <ArApMonthlySummaryTable
            arDistriList={arDistriList}
            arAfiliasiList={arAfiliasiList}
            apVendorList={apVendorList}
          />
          <ArDistriTable items={arDistriList} onUpdateItems={setArDistriList} />
          <ArAfiliasiTable items={arAfiliasiList} onUpdateItems={setArAfiliasiList} />
          <ApVendorTable items={apVendorList} onUpdateItems={setApVendorList} />
        </div>
      )}

      {/* Sync & Export Modal */}
      <ArApSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        arDistriList={arDistriList}
        arAfiliasiList={arAfiliasiList}
        apVendorList={apVendorList}
      />
    </div>
  );
};
