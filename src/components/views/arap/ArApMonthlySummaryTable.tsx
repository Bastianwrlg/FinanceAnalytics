import React from 'react';
import { ArDistriItem, ArAfiliasiItem, ApVendorItem, MonthlyAmounts } from '../../../types';
import { formatRupiah, formatPercent } from '../../../utils/formatters';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Layers } from 'lucide-react';

interface ArApMonthlySummaryTableProps {
  arDistriList: ArDistriItem[];
  arAfiliasiList: ArAfiliasiItem[];
  apVendorList: ApVendorItem[];
}

export const ArApMonthlySummaryTable: React.FC<ArApMonthlySummaryTableProps> = ({
  arDistriList,
  arAfiliasiList,
  apVendorList,
}) => {
  // Compute monthly sums
  const sumMonth = <T extends { months: MonthlyAmounts }>(
    items: T[],
    month: keyof MonthlyAmounts
  ) => items.reduce((acc, curr) => acc + (curr.months[month] || 0), 0);

  const sumProp = <T extends Record<string, any>>(items: T[], prop: string) =>
    items.reduce((acc, curr) => acc + (Number(curr[prop]) || 0), 0);

  // Distri sums
  const distriJan = sumMonth(arDistriList, 'jan');
  const distriFeb = sumMonth(arDistriList, 'feb');
  const distriMar = sumMonth(arDistriList, 'mar');
  const distriApr = sumMonth(arDistriList, 'apr');
  const distriMei = sumMonth(arDistriList, 'mei');
  const distriJun = sumMonth(arDistriList, 'juni');
  const distriJul = sumMonth(arDistriList, 'juli');
  const distriTotal = sumProp(arDistriList, 'total');
  const distriPaid = sumProp(arDistriList, 'paid');
  const distriBalance = sumProp(arDistriList, 'balance');

  // Afiliasi sums
  const afiJan = sumMonth(arAfiliasiList, 'jan');
  const afiFeb = sumMonth(arAfiliasiList, 'feb');
  const afiMar = sumMonth(arAfiliasiList, 'mar');
  const afiApr = sumMonth(arAfiliasiList, 'apr');
  const afiMei = sumMonth(arAfiliasiList, 'mei');
  const afiJun = sumMonth(arAfiliasiList, 'juni');
  const afiJul = sumMonth(arAfiliasiList, 'juli');
  const afiTotal = sumProp(arAfiliasiList, 'total');
  const afiPaid = sumProp(arAfiliasiList, 'paid');
  const afiBalance = sumProp(arAfiliasiList, 'balance');

  // Total AR
  const arTotalJan = distriJan + afiJan;
  const arTotalFeb = distriFeb + afiFeb;
  const arTotalMar = distriMar + afiMar;
  const arTotalApr = distriApr + afiApr;
  const arTotalMei = distriMei + afiMei;
  const arTotalJun = distriJun + afiJun;
  const arTotalJul = distriJul + afiJul;
  const arGrandTotal = distriTotal + afiTotal;
  const arGrandPaid = distriPaid + afiPaid;
  const arGrandBalance = distriBalance + afiBalance;

  // Split AP into Bea Cukai vs Other Vendors
  const cukaiItems = apVendorList.filter((v) => v.category === 'Pita Cukai');
  const nonCukaiItems = apVendorList.filter((v) => v.category !== 'Pita Cukai');

  const cukaiJan = sumMonth(cukaiItems, 'jan');
  const cukaiFeb = sumMonth(cukaiItems, 'feb');
  const cukaiMar = sumMonth(cukaiItems, 'mar');
  const cukaiApr = sumMonth(cukaiItems, 'apr');
  const cukaiMei = sumMonth(cukaiItems, 'mei');
  const cukaiJun = sumMonth(cukaiItems, 'juni');
  const cukaiJul = sumMonth(cukaiItems, 'juli');
  const cukaiTotal = sumProp(cukaiItems, 'total');
  const cukaiPaid = sumProp(cukaiItems, 'paid');
  const cukaiBalance = sumProp(cukaiItems, 'balance');

  const vendorJan = sumMonth(nonCukaiItems, 'jan');
  const vendorFeb = sumMonth(nonCukaiItems, 'feb');
  const vendorMar = sumMonth(nonCukaiItems, 'mar');
  const vendorApr = sumMonth(nonCukaiItems, 'apr');
  const vendorMei = sumMonth(nonCukaiItems, 'mei');
  const vendorJun = sumMonth(nonCukaiItems, 'juni');
  const vendorJul = sumMonth(nonCukaiItems, 'juli');
  const vendorTotal = sumProp(nonCukaiItems, 'total');
  const vendorPaid = sumProp(nonCukaiItems, 'paid');
  const vendorBalance = sumProp(nonCukaiItems, 'balance');

  // Total AP
  const apTotalJan = cukaiJan + vendorJan;
  const apTotalFeb = cukaiFeb + vendorFeb;
  const apTotalMar = cukaiMar + vendorMar;
  const apTotalApr = cukaiApr + vendorApr;
  const apTotalMei = cukaiMei + vendorMei;
  const apTotalJun = cukaiJun + vendorJun;
  const apTotalJul = cukaiJul + vendorJul;
  const apGrandTotal = cukaiTotal + vendorTotal;
  const apGrandPaid = cukaiPaid + vendorPaid;
  const apGrandBalance = cukaiBalance + vendorBalance;

  // Net Working Capital (AR - AP)
  const netJan = arTotalJan - apTotalJan;
  const netFeb = arTotalFeb - apTotalFeb;
  const netMar = arTotalMar - apTotalMar;
  const netApr = arTotalApr - apTotalApr;
  const netMei = arTotalMei - apTotalMei;
  const netJun = arTotalJun - apTotalJun;
  const netJul = arTotalJul - apTotalJul;
  const netGrandTotal = arGrandTotal - apGrandTotal;
  const netBalance = arGrandBalance - apGrandBalance;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Layers className="w-4 h-4 text-amber-600" />
            <span>Rekapitulasi Konsolidasi AR &amp; AP per Bulan (Matriks Arus Kas Piutang &amp; Utang)</span>
          </h3>
          <p className="text-xs text-slate-500">
            Perbandingan komparatif bulanan penagihan piutang distributor, piutang afiliasi, dan jadwal utang supplier / pita cukai
          </p>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-semibold text-slate-400">Status Data:</span>
          <span className="ml-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            Sinkron Jan - Jul 2026
          </span>
        </div>
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-300">
              <th className="py-2.5 px-3 min-w-[260px] sticky left-0 bg-slate-100/95 z-10 border-r border-slate-200 shadow-[1px_0_0_0_#cbd5e1]">
                Kategori Aliran Saldo
              </th>
              <th className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] border-r border-slate-200">JAN</th>
              <th className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] border-r border-slate-200">FEB</th>
              <th className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] border-r border-slate-200">MAR</th>
              <th className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] border-r border-slate-200">APR</th>
              <th className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] border-r border-slate-200">MEI</th>
              <th className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] border-r border-slate-200">JUNI</th>
              <th className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] border-r border-slate-200">JULI</th>
              <th className="py-2.5 px-3 text-right font-mono font-bold w-[125px] min-w-[125px] bg-amber-100/70 text-amber-950 border-r border-slate-200">
                TOTAL BILLING
              </th>
              <th className="py-2.5 px-2.5 text-right font-mono w-[115px] min-w-[115px] text-emerald-800 bg-emerald-50/60 font-semibold border-r border-slate-200">
                TERBAYAR
              </th>
              <th className="py-2.5 px-3 text-right font-mono font-black w-[125px] min-w-[125px] bg-amber-50 text-amber-950">
                SISA SALDO
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {/* 1. Receivable Distri */}
            <tr className="hover:bg-slate-50/80 transition">
              <td className="py-2.5 px-3 font-semibold text-slate-900 sticky left-0 bg-white z-10 border-r border-slate-200 shadow-[1px_0_0_0_#e2e8f0]">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0"></span>
                  <span>Receivable Distri (Piutang Distributor)</span>
                </div>
              </td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-slate-700 border-r border-slate-100">{formatRupiah(distriJan, true)}</td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-slate-700 border-r border-slate-100">{formatRupiah(distriFeb, true)}</td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-slate-700 border-r border-slate-100">{formatRupiah(distriMar, true)}</td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-slate-700 border-r border-slate-100">{formatRupiah(distriApr, true)}</td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-slate-700 border-r border-slate-100">{formatRupiah(distriMei, true)}</td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-slate-700 border-r border-slate-100">{formatRupiah(distriJun, true)}</td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-slate-700 border-r border-slate-100">{formatRupiah(distriJul, true)}</td>
              <td className="py-2.5 px-3 text-right font-mono font-bold w-[125px] min-w-[125px] tabular-nums text-amber-900 bg-amber-50/50 border-r border-slate-200">
                {formatRupiah(distriTotal, true)}
              </td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[115px] min-w-[115px] tabular-nums text-emerald-700 bg-emerald-50/40 border-r border-slate-200">
                {formatRupiah(distriPaid, true)}
              </td>
              <td className="py-2.5 px-3 text-right font-mono font-bold w-[125px] min-w-[125px] tabular-nums text-slate-900 bg-amber-50/70">
                {formatRupiah(distriBalance, true)}
              </td>
            </tr>

            {/* 2. Receivable Afiliansi */}
            <tr className="hover:bg-slate-50/80 transition">
              <td className="py-2.5 px-3 font-semibold text-slate-900 sticky left-0 bg-white z-10 border-r border-slate-200 shadow-[1px_0_0_0_#e2e8f0]">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 flex-shrink-0"></span>
                  <span>Receivable Afiliansi (Piutang Afiliasi / Sister Co)</span>
                </div>
              </td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-slate-700 border-r border-slate-100">{formatRupiah(afiJan, true)}</td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-slate-700 border-r border-slate-100">{formatRupiah(afiFeb, true)}</td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-slate-700 border-r border-slate-100">{formatRupiah(afiMar, true)}</td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-slate-700 border-r border-slate-100">{formatRupiah(afiApr, true)}</td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-slate-700 border-r border-slate-100">{formatRupiah(afiMei, true)}</td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-slate-700 border-r border-slate-100">{formatRupiah(afiJun, true)}</td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-slate-700 border-r border-slate-100">{formatRupiah(afiJul, true)}</td>
              <td className="py-2.5 px-3 text-right font-mono font-bold w-[125px] min-w-[125px] tabular-nums text-amber-900 bg-amber-50/50 border-r border-slate-200">
                {formatRupiah(afiTotal, true)}
              </td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[115px] min-w-[115px] tabular-nums text-emerald-700 bg-emerald-50/40 border-r border-slate-200">
                {formatRupiah(afiPaid, true)}
              </td>
              <td className="py-2.5 px-3 text-right font-mono font-bold w-[125px] min-w-[125px] tabular-nums text-slate-900 bg-amber-50/70">
                {formatRupiah(afiBalance, true)}
              </td>
            </tr>

            {/* Subtotal AR (Distri + Afiliasi) */}
            <tr className="bg-sky-50/70 font-bold border-t-2 border-b border-sky-200 text-sky-950">
              <td className="py-2.5 px-3 sticky left-0 bg-sky-50 z-10 border-r border-sky-200 uppercase text-[11px] tracking-wider shadow-[1px_0_0_0_#bae6fd]">
                Total Receivable (AR Konsolidasi)
              </td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums border-r border-sky-200">{formatRupiah(arTotalJan, true)}</td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums border-r border-sky-200">{formatRupiah(arTotalFeb, true)}</td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums border-r border-sky-200">{formatRupiah(arTotalMar, true)}</td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums border-r border-sky-200">{formatRupiah(arTotalApr, true)}</td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums border-r border-sky-200">{formatRupiah(arTotalMei, true)}</td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums border-r border-sky-200">{formatRupiah(arTotalJun, true)}</td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums border-r border-sky-200">{formatRupiah(arTotalJul, true)}</td>
              <td className="py-2.5 px-3 text-right font-mono font-black w-[125px] min-w-[125px] tabular-nums text-sky-950 bg-sky-100/70 border-r border-sky-300">
                {formatRupiah(arGrandTotal, true)}
              </td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[115px] min-w-[115px] tabular-nums text-emerald-800 bg-emerald-100/50 border-r border-sky-200">
                {formatRupiah(arGrandPaid, true)}
              </td>
              <td className="py-2.5 px-3 text-right font-mono font-black w-[125px] min-w-[125px] tabular-nums text-sky-950 bg-sky-100/90">
                {formatRupiah(arGrandBalance, true)}
              </td>
            </tr>

            {/* 3. Payable Pita Cukai REL */}
            <tr className="hover:bg-slate-50/80 transition">
              <td className="py-2.5 px-3 font-semibold text-slate-900 sticky left-0 bg-white z-10 border-r border-slate-200 shadow-[1px_0_0_0_#e2e8f0]">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0"></span>
                  <span>Payable Pita Cukai REL (Bea Cukai CK-1)</span>
                </div>
              </td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-slate-700 border-r border-slate-100">{formatRupiah(cukaiJan, true)}</td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-slate-700 border-r border-slate-100">{formatRupiah(cukaiFeb, true)}</td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-slate-700 border-r border-slate-100">{formatRupiah(cukaiMar, true)}</td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-slate-700 border-r border-slate-100">{formatRupiah(cukaiApr, true)}</td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-slate-700 border-r border-slate-100">{formatRupiah(cukaiMei, true)}</td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-slate-700 border-r border-slate-100">{formatRupiah(cukaiJun, true)}</td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-slate-700 border-r border-slate-100">{formatRupiah(cukaiJul, true)}</td>
              <td className="py-2.5 px-3 text-right font-mono font-bold w-[125px] min-w-[125px] tabular-nums text-amber-900 bg-amber-50/50 border-r border-slate-200">
                {formatRupiah(cukaiTotal, true)}
              </td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[115px] min-w-[115px] tabular-nums text-emerald-700 bg-emerald-50/40 border-r border-slate-200">
                {formatRupiah(cukaiPaid, true)}
              </td>
              <td className="py-2.5 px-3 text-right font-mono font-bold w-[125px] min-w-[125px] tabular-nums text-slate-900 bg-amber-50/70">
                {formatRupiah(cukaiBalance, true)}
              </td>
            </tr>

            {/* 4. Payable Vendor Bahan Baku, Kemasan & Logistik */}
            <tr className="hover:bg-slate-50/80 transition">
              <td className="py-2.5 px-3 font-semibold text-slate-900 sticky left-0 bg-white z-10 border-r border-slate-200 shadow-[1px_0_0_0_#e2e8f0]">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-500 flex-shrink-0"></span>
                  <span>Payable Bahan Baku, Botol Kemasan &amp; Ekspedisi</span>
                </div>
              </td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-slate-700 border-r border-slate-100">{formatRupiah(vendorJan, true)}</td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-slate-700 border-r border-slate-100">{formatRupiah(vendorFeb, true)}</td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-slate-700 border-r border-slate-100">{formatRupiah(vendorMar, true)}</td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-slate-700 border-r border-slate-100">{formatRupiah(vendorApr, true)}</td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-slate-700 border-r border-slate-100">{formatRupiah(vendorMei, true)}</td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-slate-700 border-r border-slate-100">{formatRupiah(vendorJun, true)}</td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-slate-700 border-r border-slate-100">{formatRupiah(vendorJul, true)}</td>
              <td className="py-2.5 px-3 text-right font-mono font-bold w-[125px] min-w-[125px] tabular-nums text-amber-900 bg-amber-50/50 border-r border-slate-200">
                {formatRupiah(vendorTotal, true)}
              </td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[115px] min-w-[115px] tabular-nums text-emerald-700 bg-emerald-50/40 border-r border-slate-200">
                {formatRupiah(vendorPaid, true)}
              </td>
              <td className="py-2.5 px-3 text-right font-mono font-bold w-[125px] min-w-[125px] tabular-nums text-slate-900 bg-amber-50/70">
                {formatRupiah(vendorBalance, true)}
              </td>
            </tr>

            {/* Subtotal AP (Total Utang) */}
            <tr className="bg-amber-50/70 font-bold border-t-2 border-b border-amber-200 text-amber-950">
              <td className="py-2.5 px-3 sticky left-0 bg-amber-50 z-10 border-r border-amber-200 uppercase text-[11px] tracking-wider shadow-[1px_0_0_0_#fde68a]">
                Total Payable (AP Konsolidasi)
              </td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums border-r border-amber-200">{formatRupiah(apTotalJan, true)}</td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums border-r border-amber-200">{formatRupiah(apTotalFeb, true)}</td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums border-r border-amber-200">{formatRupiah(apTotalMar, true)}</td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums border-r border-amber-200">{formatRupiah(apTotalApr, true)}</td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums border-r border-amber-200">{formatRupiah(apTotalMei, true)}</td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums border-r border-amber-200">{formatRupiah(apTotalJun, true)}</td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums border-r border-amber-200">{formatRupiah(apTotalJul, true)}</td>
              <td className="py-2.5 px-3 text-right font-mono font-black w-[125px] min-w-[125px] tabular-nums text-amber-950 bg-amber-100/70 border-r border-amber-300">
                {formatRupiah(apGrandTotal, true)}
              </td>
              <td className="py-2.5 px-2.5 text-right font-mono w-[115px] min-w-[115px] tabular-nums text-emerald-800 bg-emerald-100/50 border-r border-amber-200">
                {formatRupiah(apGrandPaid, true)}
              </td>
              <td className="py-2.5 px-3 text-right font-mono font-black w-[125px] min-w-[125px] tabular-nums text-amber-950 bg-amber-100/90">
                {formatRupiah(apGrandBalance, true)}
              </td>
            </tr>

            {/* Net Working Capital / Selisih Likuiditas (AR - AP) */}
            <tr className="bg-slate-900 text-white font-black">
              <td className="py-3 px-3 sticky left-0 bg-slate-900 z-10 border-r border-slate-700 uppercase text-[11px] tracking-wider shadow-[1px_0_0_0_#334155]">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                  <span>Net Working Capital (AR - AP)</span>
                </div>
              </td>
              <td className="py-3 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-emerald-400 border-r border-slate-700">{formatRupiah(netJan, true)}</td>
              <td className="py-3 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-emerald-400 border-r border-slate-700">{formatRupiah(netFeb, true)}</td>
              <td className="py-3 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-emerald-400 border-r border-slate-700">{formatRupiah(netMar, true)}</td>
              <td className="py-3 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-emerald-400 border-r border-slate-700">{formatRupiah(netApr, true)}</td>
              <td className="py-3 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-emerald-400 border-r border-slate-700">{formatRupiah(netMei, true)}</td>
              <td className="py-3 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-emerald-400 border-r border-slate-700">{formatRupiah(netJun, true)}</td>
              <td className="py-3 px-2.5 text-right font-mono w-[88px] min-w-[88px] tabular-nums text-emerald-400 border-r border-slate-700">{formatRupiah(netJul, true)}</td>
              <td className="py-3 px-3 text-right font-mono w-[125px] min-w-[125px] tabular-nums text-amber-300 bg-slate-800 border-r border-slate-700">
                {formatRupiah(netGrandTotal, true)}
              </td>
              <td className="py-3 px-2.5 text-right font-mono w-[115px] min-w-[115px] tabular-nums text-emerald-300 bg-slate-800/80 border-r border-slate-700">
                {formatRupiah(arGrandPaid - apGrandPaid, true)}
              </td>
              <td className="py-3 px-3 text-right font-mono w-[125px] min-w-[125px] tabular-nums text-amber-400 bg-slate-800">
                {formatRupiah(netBalance, true)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
