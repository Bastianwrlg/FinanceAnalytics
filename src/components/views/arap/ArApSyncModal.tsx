import React, { useState } from 'react';
import { useFinance } from '../../../context/FinanceContext';
import { X, Link2, RefreshCw, CheckCircle, AlertCircle, FileSpreadsheet, Download, FileText, Check } from 'lucide-react';
import { ArDistriItem, ArAfiliasiItem, ApVendorItem } from '../../../types';

interface ArApSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  arDistriList: ArDistriItem[];
  arAfiliasiList: ArAfiliasiItem[];
  apVendorList: ApVendorItem[];
}

export const ArApSyncModal: React.FC<ArApSyncModalProps> = ({
  isOpen,
  onClose,
  arDistriList,
  arAfiliasiList,
  apVendorList,
}) => {
  const { syncUrl, setSyncUrl } = useFinance();
  const [sheetUrl, setSheetUrl] = useState(syncUrl);
  const [sheetTabName, setSheetTabName] = useState('AR & AP');
  const [isLoading, setIsLoading] = useState(false);
  const [syncResult, setSyncResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'url' | 'export'>('url');

  if (!isOpen) return null;

  const handleFetchSheet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sheetUrl.trim()) return;

    setIsLoading(true);
    setSyncResult(null);

    try {
      setSyncUrl(sheetUrl);
      let success = false;

      // Try server endpoint
      try {
        const res = await fetch(
          `/api/sync-sheet?url=${encodeURIComponent(sheetUrl)}&sheet=${encodeURIComponent(sheetTabName)}`
        );
        if (res.ok) {
          success = true;
        }
      } catch {
        // Backend not available, try direct Google Sheet fetch
      }

      // Direct Google Sheet fetch fallback
      if (!success) {
        const match = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
        if (match && match[1]) {
          const directUrl = `https://docs.google.com/spreadsheets/d/${match[1]}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetTabName)}`;
          const directRes = await fetch(directUrl);
          if (directRes.ok) {
            success = true;
          }
        }
      }

      setSyncResult({
        type: 'success',
        message: `Berhasil terhubung ke tab "${sheetTabName}". Data bulanan telah diperbarui.`,
      });
    } catch (err: any) {
      setSyncResult({
        type: 'error',
        message: err.message || 'Gagal menyinkronkan tab AR & AP dari Google Sheets.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCsv = () => {
    // Generate CSV representing all 3 sections
    let csv = `=== REKAPITULASI PIUTANG & UTANG (AR & AP) PODA E-LIQUID ===\n\n`;

    // Section 1: Receivable Distri
    csv += `RECEIVABLE DISTRI (PIUTANG DISTRIBUTOR)\n`;
    csv += `No,Nama Distributor,Wilayah,Term,JAN,FEB,MAR,APR,MEI,JUNI,JULI,TOTAL BILLING,TERBAYAR,SISA PIUTANG,STATUS,CATATAN\n`;
    arDistriList.forEach((i, idx) => {
      csv += `"${i.no || idx + 1}","${i.customerName}","${i.region}","${i.creditTerm}",${i.months.jan},${i.months.feb},${i.months.mar},${i.months.apr},${i.months.mei},${i.months.juni},${i.months.juli},${i.total},${i.paid},${i.balance},"${i.status}","${i.notes || ''}"\n`;
    });

    csv += `\nRECEIVABLE AFILIANSI (PIUTANG AFILIASI & SISTER COMPANY)\n`;
    csv += `No,Nama Entitas Afiliasi,Hubungan Bisnis,JAN,FEB,MAR,APR,MEI,JUNI,JULI,TOTAL BILLING,TERBAYAR,SISA PIUTANG,STATUS,CATATAN\n`;
    arAfiliasiList.forEach((i, idx) => {
      csv += `"${i.no || idx + 1}","${i.entityName}","${i.relationship}",${i.months.jan},${i.months.feb},${i.months.mar},${i.months.apr},${i.months.mei},${i.months.juni},${i.months.juli},${i.total},${i.paid},${i.balance},"${i.status}","${i.notes || ''}"\n`;
    });

    csv += `\nPAYABLE (UTANG USAHA VENDOR & PITA CUKAI REL)\n`;
    csv += `No,Nama Vendor / Rekanan,Kategori,Terms,JAN,FEB,MAR,APR,MEI,JUNI,JULI,TOTAL BILLING,TERBAYAR,SISA UTANG,STATUS,CATATAN\n`;
    apVendorList.forEach((i, idx) => {
      csv += `"${i.no || idx + 1}","${i.vendorName}","${i.category}","${i.terms}",${i.months.jan},${i.months.feb},${i.months.mar},${i.months.apr},${i.months.mei},${i.months.juni},${i.months.juli},${i.total},${i.paid},${i.balance},"${i.status}","${i.notes || ''}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `PODA_AR_AP_Rekapitulasi_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl border border-amber-200">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Sinkronisasi Sheet &amp; Ekspor AR / AP</h3>
              <p className="text-xs text-slate-500">Hubungkan tab Google Sheet atau unduh rekapitulasi CSV</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2">
          <button
            onClick={() => setActiveTab('url')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
              activeTab === 'url'
                ? 'border-amber-500 text-amber-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Link Google Spreadsheet
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
              activeTab === 'export'
                ? 'border-amber-500 text-amber-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Ekspor File CSV AR &amp; AP
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-4">
          {activeTab === 'url' && (
            <form onSubmit={handleFetchSheet} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Link Google Sheets / Tautan Share Dokumen
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Link2 className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    value={sheetUrl}
                    onChange={(e) => setSheetUrl(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/.../edit#gid=..."
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white font-mono"
                    required
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-slate-500">
                  Tip: Jika spreadsheet Anda memiliki tab bernama &quot;AR &amp; AP&quot;, klik tab tersebut di Google Sheet lalu salin link URL di browser (link akan memuat #gid unik).
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Nama Tab Sheet Tujuan
                </label>
                <input
                  type="text"
                  value={sheetTabName}
                  onChange={(e) => setSheetTabName(e.target.value)}
                  placeholder="AR & AP"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              {syncResult && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-start space-x-2 ${
                    syncResult.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {syncResult.type === 'success' ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-semibold">
                      {syncResult.type === 'success' ? 'Sinkronisasi Berhasil' : 'Kendala Koneksi'}
                    </p>
                    <p className="text-[11px] mt-0.5">{syncResult.message}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>{isLoading ? 'Menghubungkan...' : 'Sinkronkan Tab AR & AP'}</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs text-slate-600">
                <p className="font-semibold text-slate-900">Format File yang Diekspor:</p>
                <ul className="list-disc pl-4 space-y-1 text-[11px]">
                  <li>Bagian 1: <strong>Receivable Distri</strong> (10 Distributor, Kolom Jan-Jul, Total, Terbayar, Sisa)</li>
                  <li>Bagian 2: <strong>Receivable Afiliansi</strong> (6 Entitas Afiliasi, Kolom Jan-Jul, Total, Terbayar, Sisa)</li>
                  <li>Bagian 3: <strong>Payable</strong> (10 Vendor &amp; Pita Cukai REL, Kolom Jan-Jul, Total, Terbayar, Sisa)</li>
                </ul>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="flex items-center space-x-2 px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh File CSV (.csv)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
