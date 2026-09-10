import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatRupiah, formatPercent } from '../../utils/formatters';
import { Megaphone, Award, Target, CheckCircle2, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const MarketingView: React.FC = () => {
  const { marketingList, kpis } = useFinance();

  const totalMarketing = marketingList.reduce((acc, curr) => acc + curr.totalSpend, 0);
  const merRatio = totalMarketing > 0 ? (kpis.totalGrossRevenue / totalMarketing).toFixed(1) : '0';

  const monthlyMarketingData = [
    { month: 'Jan', spend: 140000000 },
    { month: 'Feb', spend: 415000000 }, // Pre-ramadhan & expo
    { month: 'Mar', spend: 298000000 },
    { month: 'Apr', spend: 553000000 }, // Big expo & festive campaign
    { month: 'Mei', spend: 206000000 },
    { month: 'Juni', spend: 200000000 },
    { month: 'Juli', spend: 313000000 }, // New flavour launches
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Analisis Biaya Pemasaran (Marketing Expense)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Aktivasi kampanye influencer, sponsorship expo vape internasional, program tester store, dan promosi ritel
          </p>
        </div>

        <div className="flex items-center space-x-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 shadow-xs">
          <Target className="w-4 h-4 text-amber-600" />
          <span>Marketing Efficiency Ratio (MER): <strong className="text-amber-700">{merRatio}x</strong> Omset</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Pengeluaran Pemasaran
          </span>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
            {formatRupiah(totalMarketing, true)}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            4.1% dari total omset kotor perusahaan
          </p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Influencer &amp; Reviewer
          </span>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
            {formatRupiah(520000000, true)}
          </h3>
          <p className="text-[11px] text-emerald-600 mt-1 font-semibold">
            45 Video Review &amp; 120 Reels TikTok
          </p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Program Tester Vape Store
          </span>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
            {formatRupiah(270000000, true)}
          </h3>
          <p className="text-[11px] text-amber-600 mt-1 font-semibold">
            Mendukung 254 botol tester ke 180 store
          </p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Sponsorship &amp; Expo Vape
          </span>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
            {formatRupiah(500000000, true)}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            Booth Platinum IECIE &amp; Java Vape Town
          </p>
        </div>
      </div>

      {/* Monthly Chart */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-pink-600" />
          <span>Pengeluaran Pemasaran Bulanan (IDR)</span>
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Korelasi langsung dengan bulan puncak volume penjualan di Februari dan April
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyMarketingData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
                formatter={(val: any) => [formatRupiah(Number(val)), 'Biaya Pemasaran']}
              />
              <Bar dataKey="spend" name="Marketing Spend" fill="#ec4899" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-4">
          Daftar Inisiatif &amp; Kampanye Pemasaran PODA E-Liquid
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Kampanye / Inisiatif</th>
                <th className="py-2.5 px-3">Kategori</th>
                <th className="py-2.5 px-3">Fokus Produk</th>
                <th className="py-2.5 px-3 text-right">Total Anggaran</th>
                <th className="py-2.5 px-3">Target Deliverable &amp; Dampak</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {marketingList.map((mkt) => (
                <tr key={mkt.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-3 font-semibold text-slate-900">{mkt.campaignName}</td>
                  <td className="py-3 px-3 text-slate-600">{mkt.category}</td>
                  <td className="py-3 px-3 text-amber-700 font-medium">{mkt.targetProduct}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600">
                    {formatRupiah(mkt.totalSpend, true)}
                  </td>
                  <td className="py-3 px-3 text-slate-600 text-[11px] max-w-sm">{mkt.keyDeliverable}</td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        mkt.status === 'Selesai'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {mkt.status}
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
