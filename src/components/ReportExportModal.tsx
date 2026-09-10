import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatRupiah, formatNumber, formatPercent } from '../utils/formatters';
import { X, Printer, Download, FileText, CheckCircle2 } from 'lucide-react';

interface ReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({ isOpen, onClose }) => {
  const { kpis, products, lastSynced } = useFinance();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadFullSummaryCsv = () => {
    const headers = ['Metric', 'Nilai', 'Keterangan'];
    const rows = [
      ['Total Botol Terjual', kpis.totalVolume, 'Volume Jan-Jul 2026'],
      ['Volume 60ML', kpis.vol60ml, 'Bequ & Orama Freebase'],
      ['Volume 30ML', kpis.vol30ml, 'Bequ Salt & Orama Pods Friendly'],
      ['Volume 15ML', kpis.vol15ml, 'Mini Saltnic'],
      ['Total Gross Revenue', kpis.totalGrossRevenue, 'IDR Wholesale'],
      ['Total HPP (COGS)', kpis.totalHpp, 'Termasuk Pita Cukai REL'],
      ['Total Gross Profit', kpis.totalGrossProfit, 'Margin Kotor'],
      ['Gross Margin %', `${kpis.grossMarginPct.toFixed(2)}%`, 'Persentase'],
      ['Total OPEX', kpis.totalOpex, 'Beban Operasional'],
      ['Total Marketing', kpis.totalMarketing, 'Biaya Pemasaran & Expo'],
      ['Estimasi Laba Bersih', kpis.netProfitEst, 'Setelah Pajak Badan'],
      ['Total Piutang (AR)', kpis.totalAr, 'Piutang Distributor'],
      ['Total Utang (AP)', kpis.totalAp, 'Vendor & Cukai'],
    ];

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `PODA_Executive_Finance_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden print:border-0 print:shadow-none print:bg-white print:text-black">
        {/* Modal Top Bar (hidden in print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50 print:hidden">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900">
              Ekspor &amp; Cetak Laporan Keuangan PODA
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={handleDownloadFullSummaryCsv}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200 transition"
            >
              <Download className="w-4 h-4" />
              <span>Unduh CSV Ringkasan</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Content */}
        <div className="p-8 space-y-6 max-h-[80vh] overflow-y-auto print:max-h-none print:overflow-visible print:p-6 text-slate-900">
          {/* Company Letterhead */}
          <div className="border-b border-slate-200 print:border-slate-300 pb-5 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                PODA E-LIQUID COMPANY
              </h1>
              <p className="text-xs text-amber-600 print:text-slate-600 font-bold tracking-wider uppercase">
                Laporan Kinerja Keuangan &amp; Manufaktur E-Liquid
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Fasilitas Produksi Cleanroom &bull; Izin Cukai NPPBKC Resmi
              </p>
            </div>
            <div className="text-right text-xs text-slate-500 print:text-slate-600">
              <p className="font-semibold text-slate-900">Periode: Jan - Jul 2026</p>
              <p>Waktu Cetak: {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}</p>
              <p className="text-[11px] text-emerald-600 print:text-slate-500 font-medium">Status: Audit Internal Real-Time</p>
            </div>
          </div>

          {/* Key Executive Numbers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 print:text-slate-700 mb-3">
              1. Ikhtisar Metrik Finansial Utama
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Total Volume Terjual</span>
                <span className="text-lg font-black text-slate-900">{formatNumber(kpis.totalVolume)} btl</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Gross Revenue (Omset)</span>
                <span className="text-lg font-black text-amber-700">{formatRupiah(kpis.totalGrossRevenue, true)}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Total HPP &amp; Cukai</span>
                <span className="text-lg font-black text-cyan-700">{formatRupiah(kpis.totalHpp, true)}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Gross Margin %</span>
                <span className="text-lg font-black text-emerald-700">{formatPercent(kpis.grossMarginPct)}</span>
              </div>
            </div>
          </div>

          {/* Income Statement Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 print:text-slate-700 mb-3">
              2. Laporan Laba Rugi Komprehensif (Income Statement Summary)
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <tbody className="divide-y divide-slate-200">
                  <tr className="bg-slate-50 font-bold text-slate-900">
                    <td className="py-2.5 px-4">Pendapatan Kotor (Gross Sales)</td>
                    <td className="py-2.5 px-4 text-right font-mono">{formatRupiah(kpis.totalGrossRevenue)}</td>
                    <td className="py-2.5 px-4 text-right">100.0%</td>
                  </tr>
                  <tr className="text-slate-700">
                    <td className="py-2 px-4 pl-8 text-rose-700">Dikurangi: Harga Pokok Penjualan (HPP &amp; Pita Cukai REL)</td>
                    <td className="py-2 px-4 text-right font-mono text-rose-700">({formatRupiah(kpis.totalHpp)})</td>
                    <td className="py-2 px-4 text-right text-slate-500">52.8%</td>
                  </tr>
                  <tr className="bg-emerald-50/50 font-bold text-emerald-800">
                    <td className="py-2.5 px-4 font-semibold">Laba Kotor (Gross Profit)</td>
                    <td className="py-2.5 px-4 text-right font-mono">{formatRupiah(kpis.totalGrossProfit)}</td>
                    <td className="py-2.5 px-4 text-right">{formatPercent(kpis.grossMarginPct)}</td>
                  </tr>
                  <tr className="text-slate-700">
                    <td className="py-2 px-4 pl-8 text-slate-600">Beban Operasional (OPEX)</td>
                    <td className="py-2 px-4 text-right font-mono">({formatRupiah(kpis.totalOpex)})</td>
                    <td className="py-2 px-4 text-right text-slate-500">5.5%</td>
                  </tr>
                  <tr className="text-slate-700">
                    <td className="py-2 px-4 pl-8 text-slate-600">Beban Pemasaran (Marketing &amp; Expo)</td>
                    <td className="py-2 px-4 text-right font-mono">({formatRupiah(kpis.totalMarketing)})</td>
                    <td className="py-2 px-4 text-right text-slate-500">4.1%</td>
                  </tr>
                  <tr className="bg-slate-50 font-bold text-slate-900">
                    <td className="py-2.5 px-4 font-semibold">Laba Operasional Sebelum Pajak (EBITDA)</td>
                    <td className="py-2.5 px-4 text-right font-mono">{formatRupiah(kpis.operatingIncome)}</td>
                    <td className="py-2.5 px-4 text-right">37.6%</td>
                  </tr>
                  <tr className="bg-amber-50 font-black text-amber-950 border-t-2 border-amber-300">
                    <td className="py-3 px-4 uppercase">Estimasi Laba Bersih Setelah Pajak (Net Income)</td>
                    <td className="py-3 px-4 text-right font-mono">{formatRupiah(kpis.netProfitEst)}</td>
                    <td className="py-3 px-4 text-right">{formatPercent(kpis.netMarginPct)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Cashflow & Balance Sheet Note */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 print:text-slate-700 mb-2">
              3. Posisi Piutang (AR) &amp; Utang Usaha (AP)
            </h4>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-700 block">Saldo Piutang Usaha (AR)</span>
                <p className="text-base font-bold text-slate-900 mt-1">{formatRupiah(kpis.totalAr)}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Piutang Lancar &lt;30 hari: 64.2%</p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-700 block">Saldo Utang Usaha (AP)</span>
                <p className="text-base font-bold text-amber-800 mt-1">{formatRupiah(kpis.totalAp)}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Termasuk alokasi pita cukai REL Bea Cukai</p>
              </div>
            </div>
          </div>

          {/* Signature Block for Print */}
          <div className="pt-6 border-t border-slate-200 print:border-slate-300 grid grid-cols-3 gap-4 text-center text-xs text-slate-500 print:text-slate-700">
            <div>
              <p>Disiapkan Oleh,</p>
              <div className="h-14"></div>
              <p className="font-bold text-slate-900">Finance &amp; Accounting Lead</p>
              <p className="text-[10px]">PODA E-Liquid Company</p>
            </div>
            <div>
              <p>Diverifikasi Oleh,</p>
              <div className="h-14"></div>
              <p className="font-bold text-slate-900">Chief Financial Officer (CFO)</p>
              <p className="text-[10px]">Divisi Keuangan &amp; Akuntansi</p>
            </div>
            <div>
              <p>Disetujui Oleh,</p>
              <div className="h-14"></div>
              <p className="font-bold text-slate-900">Chief Executive Officer (CEO)</p>
              <p className="text-[10px]">Direksi Perusahaan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
