import React, { useState, useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatRupiah, formatNumber } from '../../utils/formatters';
import { Boxes, AlertTriangle, CheckCircle, Search, Filter, RefreshCw, Truck, ArrowDownRight } from 'lucide-react';

export const BahanBakuView: React.FC = () => {
  const { bahanBaku } = useFinance();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filtered
  const filteredItems = useMemo(() => {
    return bahanBaku.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.code.toLowerCase().includes(search.toLowerCase()) ||
        item.supplier.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [bahanBaku, search, selectedCategory]);

  const totalInventoryValue = useMemo(() => {
    return bahanBaku.reduce((acc, curr) => acc + curr.currentStock * curr.unitPrice, 0);
  }, [bahanBaku]);

  const criticalCount = useMemo(() => {
    return bahanBaku.filter((b) => b.status === 'Kritis' || b.status === 'Menipis').length;
  }, [bahanBaku]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Manajemen &amp; Valuasi Bahan Baku
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Pemantauan stok formulasi kimia (PG, VG, Nikotin USP, Essence) dan inventori packaging
          </p>
        </div>

        {criticalCount > 0 && (
          <div className="flex items-center space-x-2 px-3.5 py-2 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 shadow-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              <strong>{criticalCount} Item</strong> mendekati atau di bawah batas minimum reorder!
            </span>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Valuasi Stok Gudang
          </span>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
            {formatRupiah(totalInventoryValue, true)}
          </h3>
          <p className="text-[11px] text-emerald-600 mt-1 font-semibold">
            {bahanBaku.length} Komponen Terdaftar
          </p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Stok Botol Kemasan Siap Isi
          </span>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
            227.000 <span className="text-sm font-normal text-slate-500">pcs</span>
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            85k Chubby 60ml + 142k Unicorn 30ml
          </p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Stok Nikotin USP Terkunci
          </span>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
            155 <span className="text-sm font-normal text-slate-500">Liter</span>
          </h3>
          <p className="text-[11px] text-amber-600 mt-1 font-semibold">
            Freebase 35L (Menipis) • Salt 120L
          </p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Stok Cairan Dasar (PG/VG)
          </span>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
            110 <span className="text-sm font-normal text-slate-500">Drum</span>
          </h3>
          <p className="text-[11px] text-emerald-600 mt-1 font-semibold">
            48 Drum PG + 62 Drum VG (Aman 45 hari)
          </p>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Boxes className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900">
              Katalog Inventori Bahan Baku &amp; Titik Pesan Ulang (ROP)
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari kode / nama / vendor..."
                className="pl-8 pr-3 py-1.5 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 w-52 transition"
              />
            </div>

            {/* Category */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
            >
              <option value="All">Semua Kategori</option>
              <option value="Cairan Dasar (PG/VG)">Cairan Dasar (PG/VG)</option>
              <option value="Nikotin USP">Nikotin USP</option>
              <option value="Flavoring & Essence">Flavoring &amp; Essence</option>
              <option value="Additives (WS-23/Sweetener)">Additives (WS-23)</option>
              <option value="Packaging & Kemasan">Packaging &amp; Kemasan</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Kode SKU</th>
                <th className="py-2.5 px-3">Deskripsi Bahan Baku</th>
                <th className="py-2.5 px-3">Kategori</th>
                <th className="py-2.5 px-3 text-right">Stok Saat Ini</th>
                <th className="py-2.5 px-3 text-right">Min. Reorder</th>
                <th className="py-2.5 px-3 text-right">Harga Satuan</th>
                <th className="py-2.5 px-3 text-right">Total Valuasi</th>
                <th className="py-2.5 px-3">Supplier Utama</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => {
                const totalVal = item.currentStock * item.unitPrice;
                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3 font-mono font-semibold text-amber-700">{item.code}</td>
                    <td className="py-3 px-3 font-semibold text-slate-900 max-w-xs">{item.name}</td>
                    <td className="py-3 px-3 text-slate-600">{item.category}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                      {formatNumber(item.currentStock)} {item.unit}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-500">
                      {formatNumber(item.minStock)} {item.unit}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-600">
                      {formatRupiah(item.unitPrice)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600">
                      {formatRupiah(totalVal, true)}
                    </td>
                    <td className="py-3 px-3 text-slate-600 text-[11px]">
                      {item.supplier}
                      <span className="block text-slate-400 text-[10px]">Lead time: {item.leadTimeDays} hari</span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'Aman'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : item.status === 'Menipis'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
