import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatRupiah, formatPercent } from '../../utils/formatters';
import { Scale, Calculator, AlertCircle, TrendingUp, Sliders, ShieldCheck, FileCheck } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

export const HppView: React.FC = () => {
  const { hppList, kpis } = useFinance();

  // Margin simulation state for 60ml & 30ml
  const [simWholesale60, setSimWholesale60] = useState(65000);
  const [simCukai60, setSimCukai60] = useState(19200);

  const [simWholesale30, setSimWholesale30] = useState(55000);
  const [simCukai30, setSimCukai30] = useState(12800);

  // Computed simulation
  const simHpp60 = 9650 + 3850 + 1800 + simCukai60 + 2000;
  const simMargin60 = ((simWholesale60 - simHpp60) / simWholesale60) * 100;

  const simHpp30 = 7450 + 3100 + 1650 + simCukai30 + 1800;
  const simMargin30 = ((simWholesale30 - simHpp30) / simWholesale30) * 100;

  // Chart data
  const chartData = [
    {
      name: 'Botol 60ML',
      'Bahan Kimia': 9650,
      Kemasan: 3850,
      'Tenaga Kerja': 1800,
      'Pita Cukai REL': 19200,
      Overhead: 2000,
      'Laba Kotor': 28500,
    },
    {
      name: 'Botol 30ML',
      'Bahan Kimia': 7450,
      Kemasan: 3100,
      'Tenaga Kerja': 1650,
      'Pita Cukai REL': 12800,
      Overhead: 1800,
      'Laba Kotor': 28200,
    },
    {
      name: 'Botol 15ML',
      'Bahan Kimia': 4200,
      Kemasan: 2200,
      'Tenaga Kerja': 1300,
      'Pita Cukai REL': 7400,
      Overhead: 1400,
      'Laba Kotor': 18500,
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Analisis Harga Pokok Penjualan (HPP) &amp; Cukai
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Kalkulasi mendalam biaya produksi per botol dan struktur tarif pita cukai rokok elektrik (REL)
          </p>
        </div>

        <div className="flex items-center space-x-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-600 shadow-xs">
          <FileCheck className="w-4 h-4 text-emerald-600" />
          <span>Sesuai Regulasi PMK Kemenkeu Cukai REL Sistem Terbuka</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {hppList.map((item, idx) => (
          <div key={idx} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                Ukuran {item.size}
              </span>
              <span className="text-xs font-semibold text-emerald-600">
                Margin {formatPercent(item.marginPct)}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-500 block">Total HPP per Botol</span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                {formatRupiah(item.totalHpp)}
              </h3>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Harga Grosir Distributor</span>
                <span className="font-semibold text-slate-800">{formatRupiah(item.wholesalePrice)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Pita Cukai REL (Bea Cukai)</span>
                <span className="font-semibold text-rose-600">{formatRupiah(item.cukaiHptl)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Laba Kotor per Botol</span>
                <span className="font-bold text-emerald-600">{formatRupiah(item.grossProfit)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stacked Chart */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center space-x-2">
          <Scale className="w-4 h-4 text-amber-500" />
          <span>Komposisi HPP &amp; Laba Kotor per Botol (IDR)</span>
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Struktur harga jual grosir: Cukai rokok elektrik memakan porsi biaya terbesar (~45-52% dari HPP)
        </p>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis
                stroke="#94a3b8"
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickFormatter={(val) => `Rp ${(val / 1000).toFixed(0)}k`}
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
              <Bar dataKey="Pita Cukai REL" stackId="a" fill="#ef4444" />
              <Bar dataKey="Bahan Kimia" stackId="a" fill="#f59e0b" />
              <Bar dataKey="Kemasan" stackId="a" fill="#06b6d4" />
              <Bar dataKey="Tenaga Kerja" stackId="a" fill="#8b5cf6" />
              <Bar dataKey="Overhead" stackId="a" fill="#64748b" />
              <Bar dataKey="Laba Kotor" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Simulator: Interactive What-If Scenario */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center space-x-2 mb-2">
          <Calculator className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-bold text-slate-900">
            Simulator Sensitivitas Margin Laba &amp; Penyesuaian Tarif Cukai
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-6">
          Uji dampak kenaikan tarif cukai rokok elektrik atau perubahan harga jual distributor terhadap margin kotor perusahaan
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Simulator 60ML */}
          <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-bold text-slate-900 text-sm">Simulasi 60ML Freebase</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${simMargin60 >= 40 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                Margin: {formatPercent(simMargin60)}
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>Harga Grosir: {formatRupiah(simWholesale60)}</span>
              </div>
              <input
                type="range"
                min={55000}
                max={85000}
                step={1000}
                value={simWholesale60}
                onChange={(e) => setSimWholesale60(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>Beban Pita Cukai REL: {formatRupiah(simCukai60)}</span>
              </div>
              <input
                type="range"
                min={15000}
                max={28000}
                step={500}
                value={simCukai60}
                onChange={(e) => setSimCukai60(Number(e.target.value))}
                className="w-full accent-rose-500"
              />
            </div>

            <div className="pt-2 border-t border-slate-200 text-xs flex justify-between text-slate-700 font-semibold">
              <span>HPP Hasil Simulasi:</span>
              <span className="text-amber-600 font-bold">{formatRupiah(simHpp60)} / botol</span>
            </div>
          </div>

          {/* Simulator 30ML */}
          <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-bold text-slate-900 text-sm">Simulasi 30ML Saltnic / Pods</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${simMargin30 >= 45 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                Margin: {formatPercent(simMargin30)}
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>Harga Grosir: {formatRupiah(simWholesale30)}</span>
              </div>
              <input
                type="range"
                min={45000}
                max={75000}
                step={1000}
                value={simWholesale30}
                onChange={(e) => setSimWholesale30(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>Beban Pita Cukai REL: {formatRupiah(simCukai30)}</span>
              </div>
              <input
                type="range"
                min={10000}
                max={20000}
                step={500}
                value={simCukai30}
                onChange={(e) => setSimCukai30(Number(e.target.value))}
                className="w-full accent-rose-500"
              />
            </div>

            <div className="pt-2 border-t border-slate-200 text-xs flex justify-between text-slate-700 font-semibold">
              <span>HPP Hasil Simulasi:</span>
              <span className="text-amber-600 font-bold">{formatRupiah(simHpp30)} / botol</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
