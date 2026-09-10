import React, { useState, useMemo } from 'react';
import { ArAfiliasiItem } from '../../../types';
import { formatRupiah } from '../../../utils/formatters';
import { Search, Filter, ShieldCheck, Building2 } from 'lucide-react';

interface ArAfiliasiTableProps {
  items: ArAfiliasiItem[];
  onUpdateItems?: (items: ArAfiliasiItem[]) => void;
}

export const ArAfiliasiTable: React.FC<ArAfiliasiTableProps> = ({ items, onUpdateItems }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        item.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.relationship.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [items, searchTerm, statusFilter]);

  const totals = useMemo(() => {
    return filteredItems.reduce(
      (acc, item) => ({
        jan: acc.jan + (item.months.jan || 0),
        feb: acc.feb + (item.months.feb || 0),
        mar: acc.mar + (item.months.mar || 0),
        apr: acc.apr + (item.months.apr || 0),
        mei: acc.mei + (item.months.mei || 0),
        juni: acc.juni + (item.months.juni || 0),
        juli: acc.juli + (item.months.juli || 0),
        total: acc.total + item.total,
        paid: acc.paid + item.paid,
        balance: acc.balance + item.balance,
      }),
      { jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, juni: 0, juli: 0, total: 0, paid: 0, balance: 0 }
    );
  }, [filteredItems]);

  const handleStatusChange = (id: string, newStatus: ArAfiliasiItem['status']) => {
    if (!onUpdateItems) return;
    const updated = items.map((i) => (i.id === id ? { ...i, status: newStatus } : i));
    onUpdateItems(updated);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
      {/* Table Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wider bg-cyan-100 text-cyan-800 rounded-md">
              Sheet Tab: Receivable Afiliansi
            </span>
            <span className="text-xs text-slate-400 font-mono">({filteredItems.length} Entitas Afiliasi)</span>
          </div>
          <h3 className="text-base font-bold text-slate-900 mt-1">
            Receivable Afiliansi — Piutang Internal &amp; Mitra Afiliasi per Bulan
          </h3>
          <p className="text-xs text-slate-500">
            Penagihan dan konsolidasi saldo piutang direct store, official lounge, sister company, dan perwakilan regional
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari afiliasi atau unit usaha..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-cyan-500 w-52"
            />
          </div>

          {/* Filter Status */}
          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-700 focus:outline-none font-medium cursor-pointer"
            >
              <option value="all">Semua Status</option>
              <option value="Lancar">Lancar</option>
              <option value="Rekonsiliasi">Rekonsiliasi</option>
              <option value="Dalam Proses">Dalam Proses</option>
              <option value="Lunas">Lunas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Spreadsheet Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-300">
              <th className="py-2.5 px-2 text-center w-12 min-w-[48px] border-r border-slate-200">No</th>
              <th className="py-2.5 px-3 min-w-[240px] max-w-[280px] sticky left-0 bg-slate-100/95 z-10 border-r border-slate-200 shadow-[1px_0_0_0_#cbd5e1]">
                Nama Entitas Afiliasi
              </th>
              <th className="py-2.5 px-3 min-w-[140px] border-r border-slate-200">Hubungan Bisnis</th>
              <th className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] border-r border-slate-200">JAN</th>
              <th className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] border-r border-slate-200">FEB</th>
              <th className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] border-r border-slate-200">MAR</th>
              <th className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] border-r border-slate-200">APR</th>
              <th className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] border-r border-slate-200">MEI</th>
              <th className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] border-r border-slate-200">JUNI</th>
              <th className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] border-r border-slate-200">JULI</th>
              <th className="py-2.5 px-3 text-right font-mono font-bold w-[125px] min-w-[125px] bg-cyan-50/60 text-cyan-950 border-r border-slate-200">
                TOTAL BILLING
              </th>
              <th className="py-2.5 px-2.5 text-right font-mono w-[115px] min-w-[115px] text-emerald-800 bg-emerald-50/60 border-r border-slate-200">
                TERBAYAR
              </th>
              <th className="py-2.5 px-3 text-right font-mono font-black w-[125px] min-w-[125px] text-cyan-950 bg-cyan-100/70 border-r border-slate-200">
                SISA PIUTANG
              </th>
              <th className="py-2.5 px-3 text-center w-[130px] min-w-[130px] border-r border-slate-200">STATUS</th>
              <th className="py-2.5 px-3 min-w-[180px]">Catatan / Keterangan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredItems.map((item, idx) => (
              <tr key={item.id} className="hover:bg-cyan-50/30 transition">
                <td className="py-2.5 px-2 text-center text-slate-400 font-mono w-12 min-w-[48px] border-r border-slate-100">
                  {item.no || idx + 1}
                </td>
                <td className="py-2.5 px-3 font-semibold text-slate-900 min-w-[240px] max-w-[280px] sticky left-0 bg-white z-10 border-r border-slate-200 shadow-[1px_0_0_0_#e2e8f0]">
                  <div className="flex items-center space-x-1.5">
                    <Building2 className="w-3.5 h-3.5 text-cyan-600 flex-shrink-0" />
                    <span className="truncate" title={item.entityName}>
                      {item.entityName}
                    </span>
                  </div>
                </td>
                <td className="py-2.5 px-3 min-w-[140px] text-slate-600 border-r border-slate-100 font-medium">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                    {item.relationship}
                  </span>
                </td>
                <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-slate-700 border-r border-slate-100">
                  {formatRupiah(item.months.jan, true)}
                </td>
                <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-slate-700 border-r border-slate-100">
                  {formatRupiah(item.months.feb, true)}
                </td>
                <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-slate-700 border-r border-slate-100">
                  {formatRupiah(item.months.mar, true)}
                </td>
                <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-slate-700 border-r border-slate-100">
                  {formatRupiah(item.months.apr, true)}
                </td>
                <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-slate-700 border-r border-slate-100">
                  {formatRupiah(item.months.mei, true)}
                </td>
                <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-slate-700 border-r border-slate-100">
                  {formatRupiah(item.months.juni, true)}
                </td>
                <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-slate-700 border-r border-slate-100">
                  {formatRupiah(item.months.juli, true)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-bold w-[125px] min-w-[125px] tabular-nums text-slate-900 bg-cyan-50/40 border-r border-slate-200">
                  {formatRupiah(item.total, true)}
                </td>
                <td className="py-2.5 px-2.5 text-right font-mono w-[115px] min-w-[115px] tabular-nums text-emerald-700 bg-emerald-50/30 border-r border-slate-200">
                  {formatRupiah(item.paid, true)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-bold w-[125px] min-w-[125px] tabular-nums text-cyan-950 bg-cyan-100/40 border-r border-slate-200">
                  {formatRupiah(item.balance, true)}
                </td>
                <td className="py-2.5 px-3 text-center w-[130px] min-w-[130px] border-r border-slate-100">
                  <select
                    value={item.status}
                    onChange={(e) => handleStatusChange(item.id, e.target.value as ArAfiliasiItem['status'])}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border cursor-pointer ${
                      item.status === 'Lancar'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : item.status === 'Rekonsiliasi'
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : item.status === 'Dalam Proses'
                        ? 'bg-blue-50 text-blue-800 border-blue-300'
                        : 'bg-slate-100 text-slate-800 border-slate-300'
                    }`}
                  >
                    <option value="Lancar">Lancar</option>
                    <option value="Rekonsiliasi">Rekonsiliasi</option>
                    <option value="Dalam Proses">Dalam Proses</option>
                    <option value="Lunas">Lunas</option>
                  </select>
                </td>
                <td className="py-2.5 px-3 text-slate-500 text-[11px] min-w-[180px] truncate" title={item.notes}>
                  {item.notes || '-'}
                </td>
              </tr>
            ))}
          </tbody>
          {/* Summary Row */}
          <tfoot>
            <tr className="bg-slate-900 text-white font-bold border-t-2 border-slate-800">
              <td colSpan={3} className="py-3 px-3 text-right uppercase tracking-wider text-[11px] sticky left-0 bg-slate-900 z-10 border-r border-slate-700 shadow-[1px_0_0_0_#334155]">
                TOTAL RECEIVABLE AFILIANSI:
              </td>
              <td className="py-3 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-cyan-300 border-r border-slate-700">
                {formatRupiah(totals.jan, true)}
              </td>
              <td className="py-3 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-cyan-300 border-r border-slate-700">
                {formatRupiah(totals.feb, true)}
              </td>
              <td className="py-3 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-cyan-300 border-r border-slate-700">
                {formatRupiah(totals.mar, true)}
              </td>
              <td className="py-3 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-cyan-300 border-r border-slate-700">
                {formatRupiah(totals.apr, true)}
              </td>
              <td className="py-3 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-cyan-300 border-r border-slate-700">
                {formatRupiah(totals.mei, true)}
              </td>
              <td className="py-3 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-cyan-300 border-r border-slate-700">
                {formatRupiah(totals.juni, true)}
              </td>
              <td className="py-3 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-cyan-300 border-r border-slate-700">
                {formatRupiah(totals.juli, true)}
              </td>
              <td className="py-3 px-3 text-right font-mono font-black w-[125px] min-w-[125px] tabular-nums text-cyan-400 bg-slate-800 border-r border-slate-700">
                {formatRupiah(totals.total, true)}
              </td>
              <td className="py-3 px-2.5 text-right font-mono w-[115px] min-w-[115px] tabular-nums text-emerald-400 bg-slate-800/80 border-r border-slate-700">
                {formatRupiah(totals.paid, true)}
              </td>
              <td className="py-3 px-3 text-right font-mono font-black w-[125px] min-w-[125px] tabular-nums text-cyan-300 bg-slate-800 border-r border-slate-700">
                {formatRupiah(totals.balance, true)}
              </td>
              <td colSpan={2} className="py-3 px-3 text-center text-slate-400 text-[11px]">
                {formatRupiah(totals.balance)} Outstanding
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
