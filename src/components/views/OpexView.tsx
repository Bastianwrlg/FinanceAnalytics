import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatRupiah, formatPercent } from '../../utils/formatters';
import { Building2, TrendingDown, CheckCircle2, AlertCircle, DollarSign, PieChart as PieChartIcon } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

export const OpexView: React.FC = () => {
  const { opexList, kpis } = useFinance();
  const [selectedDept, setSelectedDept] = useState<string>('All');

  // Total OPEX
  const totalOpex = opexList.reduce((acc, curr) => acc + curr.totalSpend, 0);
  const totalBudget = opexList.reduce((acc, curr) => acc + curr.budgetAllocated, 0);
  const opexRatio = (totalOpex / kpis.totalGrossRevenue) * 100;

  // Monthly aggregated OPEX
  const monthlyOpexData = [
    { month: 'Jan', spend: 350000000 },
    { month: 'Feb', spend: 412000000 },
    { month: 'Mar', spend: 406000000 },
    { month: 'Apr', spend: 520000000 }, // THR & operational spike
    { month: 'Mei', spend: 379000000 },
    { month: 'Juni', spend: 376000000 },
    { month: 'Juli', spend: 404000000 },
  ];

  const filteredOpex = opexList.filter(
    (item) => selectedDept === 'All' || item.category === selectedDept
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Biaya Operasional Perusahaan (OPEX)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Realisasi pengeluaran non-produksi, gaji manajemen, fasilitas cleanroom, logistik, dan legalitas
          </p>
        </div>

        <div className="flex items-center space-x-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-600 shadow-xs">
          <span className="text-slate-500">Rasio OPEX / Omset:</span>
          <span className="font-bold text-emerald-600">{formatPercent(opexRatio)}</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-700 font-medium">Sangat Sehat (&lt; 8%)</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total OPEX Jan - Jul 2026
          </span>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
            {formatRupiah(totalOpex, true)}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            Realisasi dari Plafon {formatRupiah(totalBudget, true)}
          </p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Rata-rata Pengeluaran / Bulan
          </span>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
            {formatRupiah(totalOpex / 7, true)}
          </h3>
          <p className="text-[11px] text-emerald-600 mt-1 font-semibold">
            Stabil di kisaran Rp 370M - Rp 410M
          </p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Beban Gaji &amp; Personalia
          </span>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
            {formatRupiah(1130000000, true)}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            39.7% dari total seluruh OPEX
          </p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Efisiensi Anggaran (Variance)
          </span>
          <h3 className="text-2xl font-black text-emerald-600 tracking-tight mt-2">
            + {formatRupiah(totalBudget - totalOpex, true)}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            Hemat 3.9% di bawah batas pagu budget
          </p>
        </div>
      </div>

      {/* Monthly Chart */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center space-x-2">
          <Building2 className="w-4 h-4 text-purple-600" />
          <span>Tren Realisasi OPEX per Bulan (IDR)</span>
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Puncak pengeluaran pada April dipengaruhi pembayaran THR karyawan &amp; lonjakan pengiriman logistik luar pulau
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyOpexData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis
                stroke="#94a3b8"
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickFormatter={(val) => `Rp ${(val / 1e6).toFixed(0)}Jt`}
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
                formatter={(val: any) => [formatRupiah(Number(val)), 'Total Biaya']}
              />
              <Bar dataKey="spend" name="Realisasi OPEX" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* OPEX Items Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <h3 className="text-base font-bold text-slate-900">
            Rincian Pos Beban Operasional per Bulan
          </h3>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
          >
            <option value="All">Semua Kategori Pos Biaya</option>
            <option value="Gaji & Personalia">Gaji &amp; Personalia</option>
            <option value="Fasilitas & Utilitas">Fasilitas &amp; Utilitas</option>
            <option value="Maintenance & Mesin">Maintenance &amp; Mesin</option>
            <option value="Logistik & Ekspedisi">Logistik &amp; Ekspedisi</option>
            <option value="Legalitas, Cukai & Sertifikasi">Legalitas &amp; Cukai</option>
            <option value="Admin & IT">Admin &amp; IT</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Nama Pos Pengeluaran</th>
                <th className="py-2.5 px-3">Departemen</th>
                <th className="py-2.5 px-2 text-right">Jan</th>
                <th className="py-2.5 px-2 text-right">Feb</th>
                <th className="py-2.5 px-2 text-right">Mar</th>
                <th className="py-2.5 px-2 text-right">Apr</th>
                <th className="py-2.5 px-2 text-right">Mei</th>
                <th className="py-2.5 px-2 text-right">Jun</th>
                <th className="py-2.5 px-2 text-right">Jul</th>
                <th className="py-2.5 px-3 text-right bg-amber-50 text-amber-900 font-bold">Total Realisasi</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredOpex.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-3 font-sans font-semibold text-slate-900 max-w-xs">{item.name}</td>
                  <td className="py-3 px-3 font-sans text-slate-600">{item.department}</td>
                  <td className="py-3 px-2 text-right text-slate-500">{(item.monthlySpend.jan / 1e6).toFixed(0)} Jt</td>
                  <td className="py-3 px-2 text-right text-slate-500">{(item.monthlySpend.feb / 1e6).toFixed(0)} Jt</td>
                  <td className="py-3 px-2 text-right text-slate-500">{(item.monthlySpend.mar / 1e6).toFixed(0)} Jt</td>
                  <td className="py-3 px-2 text-right text-slate-500">{(item.monthlySpend.apr / 1e6).toFixed(0)} Jt</td>
                  <td className="py-3 px-2 text-right text-slate-500">{(item.monthlySpend.mei / 1e6).toFixed(0)} Jt</td>
                  <td className="py-3 px-2 text-right text-slate-500">{(item.monthlySpend.juni / 1e6).toFixed(0)} Jt</td>
                  <td className="py-3 px-2 text-right text-slate-500">{(item.monthlySpend.juli / 1e6).toFixed(0)} Jt</td>
                  <td className="py-3 px-3 text-right font-bold text-amber-900 bg-amber-50/60">
                    {formatRupiah(item.totalSpend, true)}
                  </td>
                  <td className="py-3 px-3 text-center font-sans">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'Efisien'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : item.status === 'Normal'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
