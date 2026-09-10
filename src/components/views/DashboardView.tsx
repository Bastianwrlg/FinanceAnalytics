import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatRupiah, formatNumber, formatPercent } from '../../utils/formatters';
import {
  TrendingUp,
  DollarSign,
  Package,
  Layers,
  PieChart as PieChartIcon,
  AlertCircle,
  ArrowUpRight,
  ShieldAlert,
  Calendar,
  Award,
  Calculator,
  CheckCircle2,
} from 'lucide-react';
import { UserSession } from '../../types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';

export const DashboardView: React.FC<{
  onNavigateTo: (tab: any) => void;
  currentUser?: UserSession | null;
}> = ({ onNavigateTo, currentUser }) => {
  const { kpis, monthlySummaries, products } = useFinance();
  const [activeMetric, setActiveMetric] = useState<'revenue' | 'volume'>('revenue');
  const isBod = currentUser?.roleCode === 'BOD' || currentUser?.role === 'BOD';

  // Prepare monthly trend data (Jan - Jul)
  const monthlyData = [
    {
      month: 'Jan',
      volume: 38355,
      revenue: 2280000000,
      hpp: 1220000000,
      grossProfit: 1060000000,
      opex: 350000000,
      netProfit: 710000000,
    },
    {
      month: 'Feb',
      volume: 160655,
      revenue: 9550000000,
      hpp: 5080000000,
      grossProfit: 4470000000,
      opex: 412000000,
      netProfit: 3260000000,
    },
    {
      month: 'Mar',
      volume: 137694,
      revenue: 8180000000,
      hpp: 4350000000,
      grossProfit: 3830000000,
      opex: 406000000,
      netProfit: 2790000000,
    },
    {
      month: 'Apr',
      volume: 197491,
      revenue: 11730000000,
      hpp: 6240000000,
      grossProfit: 5490000000,
      opex: 520000000,
      netProfit: 4010000000,
    },
    {
      month: 'Mei',
      volume: 101660,
      revenue: 6040000000,
      hpp: 3210000000,
      grossProfit: 2830000000,
      opex: 379000000,
      netProfit: 2060000000,
    },
    {
      month: 'Juni',
      volume: 97621,
      revenue: 5800000000,
      hpp: 3090000000,
      grossProfit: 2710000000,
      opex: 376000000,
      netProfit: 1980000000,
    },
    {
      month: 'Juli',
      volume: 127424,
      revenue: 7570000000,
      hpp: 4020000000,
      grossProfit: 3550000000,
      opex: 403000000,
      netProfit: 2590000000,
    },
  ];

  // Brand volume distribution
  const brandVolumes = [
    { name: 'Bequ Series (60ml & Salt)', value: 481933, color: '#f59e0b' },
    { name: 'Orama Series (FB & Pods)', value: 376945, color: '#3b82f6' },
    { name: 'Bites Series (Creamy)', value: 13, color: '#10b981' },
    { name: 'Tester Store Free Samples', value: 254, color: '#8b5cf6' },
  ];

  // Cost structure breakdown
  const costStructure = [
    { name: 'Pita Cukai REL (Bea Cukai)', value: 16800000000, pct: '32.8%', color: '#ef4444' },
    { name: 'Bahan Baku Kimia (PG/VG/Nic)', value: 6800000000, pct: '13.3%', color: '#f59e0b' },
    { name: 'Kemasan (Botol, Cap, Label)', value: 2750000000, pct: '5.4%', color: '#06b6d4' },
    { name: 'Tenaga Kerja Langsung', value: 1550000000, pct: '3.0%', color: '#8b5cf6' },
    { name: 'OPEX Operasional Pabrik', value: 2847000000, pct: '5.5%', color: '#64748b' },
    { name: 'Marketing & Event Expo', value: 2125000000, pct: '4.1%', color: '#ec4899' },
    { name: 'Laba Bersih Perusahaan', value: 18328000000, pct: '35.9%', color: '#10b981' },
  ];

  // Top 5 Best Selling SKU
  const topProducts = [...products]
    .filter((p) => !p.isTester)
    .sort((a, b) => b.totalVolume - a.totalVolume)
    .slice(0, 5);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Executive Banner */}
      <div
        className={`rounded-2xl border p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs transition ${
          isBod
            ? 'bg-gradient-to-r from-amber-500/15 via-white to-amber-500/5 border-amber-300'
            : 'bg-gradient-to-r from-emerald-500/15 via-white to-emerald-500/5 border-emerald-300'
        }`}
      >
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center space-x-1.5 ${
                isBod
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-emerald-100 text-emerald-900 border-emerald-300'
              }`}
            >
              {isBod ? <Award className="w-3.5 h-3.5" /> : <Calculator className="w-3.5 h-3.5" />}
              <span>{isBod ? 'ROLE: BOD (BOARD OF DIRECTORS)' : 'ROLE: HEAD FAT (FINANCE, ACCOUNTING & TAX)'}</span>
            </span>
            <span className="text-xs text-slate-500">• Periode Jan - Juli 2026 (860.900 Botol)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1.5">
            {isBod ? 'Ikhtisar Strategis Direksi (BOD)' : 'Pusat Kontrol Finansial & Audit (Head FAT)'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-0.5">
            {isBod
              ? 'Fasilitas evaluasi performa 128 SKU produk, net margin 35.9%, EBITDA Rp 22,7M, serta pengambilan keputusan ekspansi bisnis.'
              : 'Audit biaya HPP per botol, simulasi Cukai REL (32.8%), pengendalian OPEX pabrik, analisis Aging AR/AP, dan rekonsiliasi kas.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          {isBod ? (
            <button
              onClick={() => onNavigateTo('sales')}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xs transition flex items-center space-x-1.5"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Analisis Sales 128 SKU</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigateTo('hpp')}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition flex items-center space-x-1.5"
            >
              <Calculator className="w-4 h-4" />
              <span>Audit HPP &amp; Cukai REL</span>
            </button>
          )}

          <div className="flex items-center space-x-2 text-xs text-slate-500 bg-white/90 px-3 py-2 rounded-xl border border-slate-200">
            <Calendar className="w-4 h-4 text-slate-600" />
            <span className="font-semibold text-slate-700">Tahun Buku 2026</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Omset / Gross Revenue */}
        <div
          onClick={() => onNavigateTo('sales')}
          className="cursor-pointer group p-5 bg-white border border-slate-200 hover:border-amber-400 rounded-2xl transition shadow-xs hover:shadow-md relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Omset (Gross)
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-slate-950 transition">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {formatRupiah(kpis.totalGrossRevenue, true)}
            </h3>
            <div className="flex items-center space-x-2 mt-1.5 text-xs">
              <span className="flex items-center text-emerald-600 font-bold">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                {formatNumber(kpis.totalVolume)}
              </span>
              <span className="text-slate-500">Total Botol Terjual</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-[11px] text-slate-500">
            <span>60ML: {formatNumber(kpis.vol60ml)} btl</span>
            <span>30ML: {formatNumber(kpis.vol30ml)} btl</span>
          </div>
        </div>

        {/* HPP & Gross Margin */}
        <div
          onClick={() => onNavigateTo('hpp')}
          className="cursor-pointer group p-5 bg-white border border-slate-200 hover:border-cyan-400 rounded-2xl transition shadow-xs hover:shadow-md relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              HPP (COGS) &amp; Cukai
            </span>
            <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600 group-hover:bg-cyan-500 group-hover:text-white transition">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {formatRupiah(kpis.totalHpp, true)}
            </h3>
            <div className="flex items-center space-x-2 mt-1.5 text-xs">
              <span className="text-cyan-700 font-bold">
                Margin Kotor: {formatPercent(kpis.grossMarginPct)}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600">Laba Rp {(kpis.totalGrossProfit / 1e9).toFixed(1)}M</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-[11px] text-slate-500">
            <span>Komponen Cukai: ~62% HPP</span>
            <span className="text-cyan-600 font-medium">Detail HPP &rarr;</span>
          </div>
        </div>

        {/* OPEX & Marketing */}
        <div
          onClick={() => onNavigateTo('opex')}
          className="cursor-pointer group p-5 bg-white border border-slate-200 hover:border-purple-400 rounded-2xl transition shadow-xs hover:shadow-md relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Beban Operasional &amp; Mkt
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-500 group-hover:text-white transition">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {formatRupiah(kpis.totalOpex + kpis.totalMarketing, true)}
            </h3>
            <div className="flex items-center space-x-2 mt-1.5 text-xs">
              <span className="text-purple-700 font-bold">
                EBITDA: {formatRupiah(kpis.operatingIncome, true)}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-600 font-semibold">{formatPercent(kpis.netMarginPct)} Net</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-[11px] text-slate-500">
            <span>OPEX: {formatRupiah(kpis.totalOpex, true)}</span>
            <span>Mkt: {formatRupiah(kpis.totalMarketing, true)}</span>
          </div>
        </div>

        {/* AR vs AP (Cashflow Health) */}
        <div
          onClick={() => onNavigateTo('ar-ap')}
          className="cursor-pointer group p-5 bg-white border border-slate-200 hover:border-emerald-400 rounded-2xl transition shadow-xs hover:shadow-md relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Piutang (AR) vs Utang (AP)
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {formatRupiah(kpis.totalAr, true)}
            </h3>
            <div className="flex items-center space-x-2 mt-1.5 text-xs">
              <span className="text-slate-500">Utang Vendor:</span>
              <span className="text-amber-700 font-bold">{formatRupiah(kpis.totalAp, true)}</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-[11px] text-slate-500">
            <span className={kpis.netWorkingCapital >= 0 ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}>
              Net Capital: {formatRupiah(kpis.netWorkingCapital, true)}
            </span>
            <span className="text-emerald-600 font-medium">Aging AR &rarr;</span>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trend Area / Bar Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-amber-500" />
                <span>Tren Kinerja Finansial Bulanan (Januari - Juli 2026)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Perbandingan Omset Penjualan, Beban Pokok (HPP), dan Laba Bersih
              </p>
            </div>
            <div className="flex items-center space-x-1 p-1 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveMetric('revenue')}
                className={`px-3 py-1 rounded-lg transition ${
                  activeMetric === 'revenue'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Rupiah (Omset &amp; Laba)
              </button>
              <button
                onClick={() => setActiveMetric('volume')}
                className={`px-3 py-1 rounded-lg transition ${
                  activeMetric === 'volume'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Volume Botol
              </button>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {activeMetric === 'revenue' ? (
                <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis
                    stroke="#94a3b8"
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    tickFormatter={(val) => `Rp ${(val / 1e9).toFixed(1)}M`}
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
                    formatter={(val: any) => [formatRupiah(Number(val)), '']}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Omset Penjualan"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                  <Area
                    type="monotone"
                    dataKey="hpp"
                    name="HPP (Biaya Pokok)"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fillOpacity={0}
                  />
                  <Area
                    type="monotone"
                    dataKey="netProfit"
                    name="Estimasi Laba Bersih"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorProfit)"
                  />
                </AreaChart>
              ) : (
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis
                    stroke="#94a3b8"
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
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
                    formatter={(val: any) => [`${formatNumber(Number(val))} Botol`, 'Volume Penjualan']}
                  />
                  <Bar dataKey="volume" name="Volume Penjualan (Botol)" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Bulan Tertinggi</span>
              <span className="text-amber-600 font-bold">April (197.491 btl)</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Rata-rata Penjualan</span>
              <span className="text-slate-800 font-bold">122.985 btl / bln</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Rata-rata Omset</span>
              <span className="text-emerald-600 font-bold">Rp 7,31 M / bln</span>
            </div>
          </div>
        </div>

        {/* Cost Structure Donut Chart (1 col) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <PieChartIcon className="w-4 h-4 text-emerald-600" />
                <span>Struktur Biaya &amp; Laba</span>
              </h3>
              <span className="text-xs text-slate-500">% Omset</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Alokasi pendapatan kotor PODA E-Liquid
            </p>
          </div>

          <div className="h-52 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costStructure}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {costStructure.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#0f172a',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  formatter={(val: any) => [formatRupiah(Number(val)), '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 text-xs">
            {costStructure.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-600 truncate max-w-[140px]">{item.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-900">{item.pct}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Top Best Selling Products & Volume by Line */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 5 Products Leaderboard (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Top 5 Produk Terlaris (Kontributor Omset Terbesar)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Berdasarkan rekapitulasi data spreadsheet 860.900 botol
              </p>
            </div>
            <button
              onClick={() => onNavigateTo('sales')}
              className="text-xs text-amber-600 hover:text-amber-700 font-semibold"
            >
              Lihat Semua 128 SKU &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Peringkat</th>
                  <th className="py-2.5 px-3">Nama Produk</th>
                  <th className="py-2.5 px-3">Brand</th>
                  <th className="py-2.5 px-3">Ukuran</th>
                  <th className="py-2.5 px-3 text-right">Volume</th>
                  <th className="py-2.5 px-3 text-right">Omset (Est)</th>
                  <th className="py-2.5 px-3 text-right">Margin Kotor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topProducts.map((prod, idx) => (
                  <tr key={prod.no} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3 font-bold text-amber-600">#{idx + 1}</td>
                    <td className="py-3 px-3 font-semibold text-slate-900">{prod.name}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                          prod.brand === 'Bequ'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : prod.brand === 'Orama'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {prod.brand}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{prod.size}</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900">
                      {formatNumber(prod.totalVolume)} btl
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-600">
                      {formatRupiah(prod.estRevenue, true)}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-600 font-medium">
                      {formatRupiah(prod.estRevenue - prod.estTotalHpp, true)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Brand Volume Split (1 col) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-amber-500" />
              <span>Distribusi Volume per Brand</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pangsa volume botol Bequ vs Orama vs Bites
            </p>
          </div>

          <div className="space-y-4 my-4">
            {brandVolumes.map((item, idx) => {
              const pct = ((item.value / kpis.totalVolume) * 100).toFixed(1);
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">{item.name}</span>
                    <span className="text-slate-900">
                      {formatNumber(item.value)} btl ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-xs text-slate-600">
            <span className="text-amber-700 font-bold block mb-1">💡 Fakta Pasar:</span>
            Bequ menguasai 56.0% volume karena popularitas lini fruity salt, sedangkan Orama mendominasi pasar creamy 60ml &amp; pods friendly dengan repeat order tinggi.
          </div>
        </div>
      </div>
    </div>
  );
};
