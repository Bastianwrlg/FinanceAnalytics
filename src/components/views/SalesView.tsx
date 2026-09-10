import React, { useState, useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatRupiah, formatNumber } from '../../utils/formatters';
import { Search, Filter, Download, TrendingUp, Layers, Check, ArrowUpDown } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export const SalesView: React.FC = () => {
  const { products, monthlySummaries, kpis } = useFinance();

  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [sortField, setSortField] = useState<'no' | 'totalVolume' | 'estRevenue' | 'name'>('totalVolume');
  const [sortAsc, setSortAsc] = useState(false);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchesBrand = selectedBrand === 'All' || p.brand === selectedBrand;
        const matchesSize = selectedSize === 'All' || p.size === selectedSize;
        return matchesSearch && matchesBrand && matchesSize;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === 'string') {
          return sortAsc
            ? (valA as string).localeCompare(valB as string)
            : (valB as string).localeCompare(valA as string);
        }
        return sortAsc ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
      });
  }, [products, search, selectedBrand, selectedSize, sortField, sortAsc]);

  const handleSort = (field: 'no' | 'totalVolume' | 'estRevenue' | 'name') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const exportSalesCsv = () => {
    const headers = ['No', 'Produk', 'Brand', 'Ukuran', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Juni', 'Juli', 'Total Volume', 'Estimasi Omset (IDR)'];
    const rows = filteredProducts.map((p) => [
      p.no,
      `"${p.name}"`,
      p.brand,
      p.size,
      p.jan,
      p.feb,
      p.mar,
      p.apr,
      p.mei,
      p.juni,
      p.juli,
      p.totalVolume,
      p.estRevenue,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `PODA_Sales_Analytics_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Monthly category comparison chart
  const categoryChartData = [
    { month: 'Jan', '60ml Bequ': 12987, '60ml Orama': 11360, '30ml Bequ': 9721, '30ml Orama': 4257 },
    { month: 'Feb', '60ml Bequ': 35115, '60ml Orama': 41157, '30ml Bequ': 55271, '30ml Orama': 29112 },
    { month: 'Mar', '60ml Bequ': 32278, '60ml Orama': 32364, '30ml Bequ': 48946, '30ml Orama': 24093 },
    { month: 'Apr', '60ml Bequ': 36747, '60ml Orama': 56380, '30ml Bequ': 56194, '30ml Orama': 48170 },
    { month: 'Mei', '60ml Bequ': 22871, '60ml Orama': 21725, '30ml Bequ': 34045, '30ml Orama': 23019 },
    { month: 'Juni', '60ml Bequ': 21592, '60ml Orama': 16090, '30ml Bequ': 34465, '30ml Orama': 23969 },
    { month: 'Juli', '60ml Bequ': 25687, '60ml Orama': 20460, '30ml Bequ': 56014, '30ml Orama': 24789 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Analisis Penjualan &amp; Volume Sales
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Monitoring rekapitulasi data 128 SKU produk PODA E-Liquid periode Januari - Juli 2026
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={exportSalesCsv}
            className="flex items-center space-x-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition shadow-xs"
          >
            <Download className="w-4 h-4 text-amber-600" />
            <span>Ekspor CSV Penjualan</span>
          </button>
        </div>
      </div>

      {/* Monthly Summary Category Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center space-x-2">
          <Layers className="w-4 h-4 text-amber-500" />
          <span>Rekapitulasi Volume Sales per Kategori &amp; Ukuran Botol</span>
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Data baris teratas spreadsheet resmi PODA E-Liquid (Satuan: Botol)
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Kategori Lini</th>
                <th className="py-2.5 px-3 text-right">Jan</th>
                <th className="py-2.5 px-3 text-right">Feb</th>
                <th className="py-2.5 px-3 text-right">Mar</th>
                <th className="py-2.5 px-3 text-right">Apr</th>
                <th className="py-2.5 px-3 text-right">Mei</th>
                <th className="py-2.5 px-3 text-right">Juni</th>
                <th className="py-2.5 px-3 text-right">Juli</th>
                <th className="py-2.5 px-3 text-right bg-amber-50 text-amber-900 font-bold">
                  Total Volume
                </th>
                <th className="py-2.5 px-3 text-right">Share %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              <tr className="hover:bg-slate-50/80">
                <td className="py-2.5 px-3 font-sans font-semibold text-slate-900">60 ML Bequ</td>
                <td className="py-2.5 px-3 text-right text-slate-600">12.987</td>
                <td className="py-2.5 px-3 text-right text-slate-600">35.115</td>
                <td className="py-2.5 px-3 text-right text-slate-600">32.278</td>
                <td className="py-2.5 px-3 text-right text-slate-600">36.747</td>
                <td className="py-2.5 px-3 text-right text-slate-600">22.871</td>
                <td className="py-2.5 px-3 text-right text-slate-600">21.592</td>
                <td className="py-2.5 px-3 text-right text-slate-600">25.687</td>
                <td className="py-2.5 px-3 text-right font-bold text-amber-700 bg-amber-50/60">187.277</td>
                <td className="py-2.5 px-3 text-right text-slate-600 font-sans">21.8%</td>
              </tr>
              <tr className="hover:bg-slate-50/80">
                <td className="py-2.5 px-3 font-sans font-semibold text-slate-900">60 ML Orama</td>
                <td className="py-2.5 px-3 text-right text-slate-600">11.360</td>
                <td className="py-2.5 px-3 text-right text-slate-600">41.157</td>
                <td className="py-2.5 px-3 text-right text-slate-600">32.364</td>
                <td className="py-2.5 px-3 text-right text-slate-600">56.380</td>
                <td className="py-2.5 px-3 text-right text-slate-600">21.725</td>
                <td className="py-2.5 px-3 text-right text-slate-600">16.090</td>
                <td className="py-2.5 px-3 text-right text-slate-600">20.460</td>
                <td className="py-2.5 px-3 text-right font-bold text-amber-700 bg-amber-50/60">199.536</td>
                <td className="py-2.5 px-3 text-right text-slate-600 font-sans">23.2%</td>
              </tr>
              <tr className="hover:bg-slate-50/80">
                <td className="py-2.5 px-3 font-sans font-semibold text-slate-900">30ML Bequ</td>
                <td className="py-2.5 px-3 text-right text-slate-600">9.721</td>
                <td className="py-2.5 px-3 text-right text-slate-600">55.271</td>
                <td className="py-2.5 px-3 text-right text-slate-600">48.946</td>
                <td className="py-2.5 px-3 text-right text-slate-600">56.194</td>
                <td className="py-2.5 px-3 text-right text-slate-600">34.045</td>
                <td className="py-2.5 px-3 text-right text-slate-600">34.465</td>
                <td className="py-2.5 px-3 text-right text-slate-600">56.014</td>
                <td className="py-2.5 px-3 text-right font-bold text-amber-700 bg-amber-50/60">294.656</td>
                <td className="py-2.5 px-3 text-right text-slate-600 font-sans">34.2%</td>
              </tr>
              <tr className="hover:bg-slate-50/80">
                <td className="py-2.5 px-3 font-sans font-semibold text-slate-900">30ML Orama</td>
                <td className="py-2.5 px-3 text-right text-slate-600">4.257</td>
                <td className="py-2.5 px-3 text-right text-slate-600">29.112</td>
                <td className="py-2.5 px-3 text-right text-slate-600">24.093</td>
                <td className="py-2.5 px-3 text-right text-slate-600">48.170</td>
                <td className="py-2.5 px-3 text-right text-slate-600">23.019</td>
                <td className="py-2.5 px-3 text-right text-slate-600">23.969</td>
                <td className="py-2.5 px-3 text-right text-slate-600">24.789</td>
                <td className="py-2.5 px-3 text-right font-bold text-amber-700 bg-amber-50/60">177.409</td>
                <td className="py-2.5 px-3 text-right text-slate-600 font-sans">20.6%</td>
              </tr>
              <tr className="bg-amber-50/70 font-bold text-amber-900 border-t-2 border-amber-200">
                <td className="py-3 px-3 font-sans text-slate-900 uppercase">Grand Total Volume Sales</td>
                <td className="py-3 px-3 text-right">38.355</td>
                <td className="py-3 px-3 text-right">160.655</td>
                <td className="py-3 px-3 text-right">137.694</td>
                <td className="py-3 px-3 text-right">197.491</td>
                <td className="py-3 px-3 text-right">101.660</td>
                <td className="py-3 px-3 text-right">97.621</td>
                <td className="py-3 px-3 text-right">127.424</td>
                <td className="py-3 px-3 text-right text-emerald-700 font-black text-sm bg-emerald-100/60">
                  860.900
                </td>
                <td className="py-3 px-3 text-right font-sans">100.0%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Chart */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <span>Komparasi Volume Bulanan per Kategori Botol</span>
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Visualisasi pergerakan volume penjualan 60ML vs 30ML (Bequ vs Orama)
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
                formatter={(val: any) => [`${formatNumber(Number(val))} btl`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="30ml Bequ" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="60ml Orama" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="60ml Bequ" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="30ml Orama" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Full 128 SKU Table & Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Daftar Lengkap 128 SKU Produk &amp; Breakdown Bulanan
            </h3>
            <p className="text-xs text-slate-500">
              Menampilkan {filteredProducts.length} dari {products.length} SKU
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari rasa / varian..."
                className="pl-8 pr-3 py-1.5 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 w-44 sm:w-56 transition"
              />
            </div>

            {/* Brand Filter */}
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
            >
              <option value="All">Semua Brand</option>
              <option value="Bequ">Bequ</option>
              <option value="Orama">Orama</option>
              <option value="Bites">Bites</option>
              <option value="Tester">Tester</option>
            </select>

            {/* Size Filter */}
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
            >
              <option value="All">Semua Ukuran</option>
              <option value="60 ML">60 ML</option>
              <option value="30ML">30 ML</option>
              <option value="15ML">15 ML</option>
              <option value="Tester">Tester</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[500px] overflow-y-auto scrollbar-thin">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider sticky top-0 border-b border-slate-200 z-10">
              <tr>
                <th
                  onClick={() => handleSort('no')}
                  className="py-2.5 px-3 cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center space-x-1">
                    <span>No</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('name')}
                  className="py-2.5 px-3 cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center space-x-1">
                    <span>Nama Produk SKU</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-2.5 px-3">Brand</th>
                <th className="py-2.5 px-3">Ukuran</th>
                <th className="py-2.5 px-2 text-right">Jan</th>
                <th className="py-2.5 px-2 text-right">Feb</th>
                <th className="py-2.5 px-2 text-right">Mar</th>
                <th className="py-2.5 px-2 text-right">Apr</th>
                <th className="py-2.5 px-2 text-right">Mei</th>
                <th className="py-2.5 px-2 text-right">Jun</th>
                <th className="py-2.5 px-2 text-right">Jul</th>
                <th
                  onClick={() => handleSort('totalVolume')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-slate-900 bg-amber-50 text-amber-900"
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Total Vol</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('estRevenue')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Est. Omset</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => (
                <tr key={p.no} className="hover:bg-slate-50/80 transition">
                  <td className="py-2.5 px-3 text-slate-500 font-mono">{p.no}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900 max-w-xs truncate" title={p.name}>
                    {p.name}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.brand === 'Bequ'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : p.brand === 'Orama'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : p.brand === 'Bites'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-purple-50 text-purple-800 border border-purple-200'
                      }`}
                    >
                      {p.brand}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{p.size}</td>
                  <td className="py-2.5 px-2 text-right font-mono text-slate-500">{p.jan > 0 ? formatNumber(p.jan) : '-'}</td>
                  <td className="py-2.5 px-2 text-right font-mono text-slate-500">{p.feb > 0 ? formatNumber(p.feb) : '-'}</td>
                  <td className="py-2.5 px-2 text-right font-mono text-slate-500">{p.mar > 0 ? formatNumber(p.mar) : '-'}</td>
                  <td className="py-2.5 px-2 text-right font-mono text-slate-500">{p.apr > 0 ? formatNumber(p.apr) : '-'}</td>
                  <td className="py-2.5 px-2 text-right font-mono text-slate-500">{p.mei > 0 ? formatNumber(p.mei) : '-'}</td>
                  <td className="py-2.5 px-2 text-right font-mono text-slate-500">{p.juni > 0 ? formatNumber(p.juni) : '-'}</td>
                  <td className="py-2.5 px-2 text-right font-mono text-slate-500">{p.juli > 0 ? formatNumber(p.juli) : '-'}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-900 bg-amber-50/60">
                    {formatNumber(p.totalVolume)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-700">
                    {p.isTester ? 'Tester (Free)' : formatRupiah(p.estRevenue, true)}
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
