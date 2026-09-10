import React, { useState } from 'react';
import { useFinance, DEFAULT_SHEET_URL } from '../context/FinanceContext';
import { X, Link2, RefreshCw, CheckCircle, AlertCircle, FileSpreadsheet, RotateCcw, Copy, Check } from 'lucide-react';

interface SpreadsheetSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpreadsheetSyncModal: React.FC<SpreadsheetSyncModalProps> = ({ isOpen, onClose }) => {
  const {
    syncUrl,
    setSyncUrl,
    syncNow,
    isSyncing,
    syncStatus,
    syncError,
    lastSynced,
    autoSyncInterval,
    setAutoSyncInterval,
    currentCsv,
    importCsvText,
    resetToDefaultData,
  } = useFinance();

  const [inputUrl, setInputUrl] = useState(syncUrl);
  const [activeTab, setActiveTab] = useState<'url' | 'paste' | 'preview'>('url');
  const [pastedText, setPastedText] = useState('');
  const [pasteFeedback, setPasteFeedback] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSync = async (e: React.FormEvent) => {
    e.preventDefault();
    setSyncUrl(inputUrl);
    await syncNow(inputUrl);
  };

  const handleImportPaste = () => {
    if (!pastedText.trim()) return;
    const ok = importCsvText(pastedText);
    if (ok) {
      setPasteFeedback('Data CSV berhasil diimpor!');
      setTimeout(() => {
        setPasteFeedback(null);
        onClose();
      }, 1200);
    } else {
      setPasteFeedback('Format CSV tidak valid atau data produk tidak terdeteksi.');
    }
  };

  const copyCsv = () => {
    navigator.clipboard.writeText(currentCsv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-50 text-amber-700 rounded-lg border border-amber-200">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Sinkronisasi Spreadsheet Real-Time
              </h3>
              <p className="text-xs text-slate-500">
                Hubungkan data penjualan PODA E-Liquid secara langsung dari Google Sheets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
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
            onClick={() => setActiveTab('paste')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
              activeTab === 'paste'
                ? 'border-amber-500 text-amber-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Tempel CSV / Manual
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
              activeTab === 'preview'
                ? 'border-amber-500 text-amber-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Pratinjau Data Aktif (128 SKU)
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {activeTab === 'url' && (
            <form onSubmit={handleSync} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Link Google Sheets / CSV Publish URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Link2 className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    id="input-spreadsheet-url"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white focus:ring-1 focus:ring-amber-500 font-mono"
                    required
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-slate-500">
                  Mendukung link share Google Sheet publik, link CSV Google Sheet, atau tautan gviz export.
                </p>
              </div>

              {/* Polling interval */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Frekuensi Sinkronisasi Otomatis
                  </label>
                  <select
                    value={autoSyncInterval}
                    onChange={(e) => setAutoSyncInterval(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                  >
                    <option value={0}>Manual (Hanya saat tombol ditekan)</option>
                    <option value={30}>Real-time (Setiap 30 Detik)</option>
                    <option value={60}>Setiap 1 Menit</option>
                    <option value={300}>Setiap 5 Menit</option>
                    <option value={900}>Setiap 15 Menit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Status Sinkronisasi
                  </label>
                  <div className="flex items-center space-x-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                    {syncStatus === 'connected' ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span className="text-emerald-700 font-semibold">Data Terkini Terhubung</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        <span className="text-amber-700 font-semibold">Perlu Verifikasi Link</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {syncError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Peringatan Sinkronisasi:</p>
                    <p>{syncError}</p>
                    <p className="mt-1 text-[11px] text-rose-600">
                      Tips: Di Google Sheets, buka File &gt; Bagikan (Share) &gt; Publikasikan ke web (Publish to web) &gt; Pilih CSV.
                    </p>
                  </div>
                </div>
              )}

              {/* Instructions card */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
                <p className="text-slate-800 font-bold text-[11px] uppercase tracking-wider">
                  Petunjuk Menghubungkan Google Sheet:
                </p>
                <ol className="list-decimal pl-4 space-y-1 text-[11px] text-slate-600">
                  <li>Buka dokumen Spreadsheet PODA E-Liquid di browser Anda.</li>
                  <li>Pastikan hak akses dokumen disetel ke <strong>&quot;Anyone with the link can view&quot;</strong>.</li>
                  <li>Atau klik <strong>File &gt; Share &gt; Publish to web &gt; Comma-separated values (.csv)</strong> untuk sinkronisasi otomatis tercepat tanpa batasan izin.</li>
                  <li>Salin link tersebut dan tempel ke kolom di atas, lalu klik <strong>Simpan &amp; Sinkronkan</strong>.</li>
                </ol>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    resetToDefaultData();
                    setInputUrl(DEFAULT_SHEET_URL);
                  }}
                  className="flex items-center space-x-1.5 text-xs text-slate-500 hover:text-amber-700 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Data Bawaan (PODA 860k)</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSyncing}
                    className="flex items-center space-x-2 px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Menghubungkan...' : 'Simpan & Sinkronkan'}</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {activeTab === 'paste' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Tempel Konten CSV Penjualan PODA
                </label>
                <textarea
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Contoh:&#10;No,PRODUCTS,JAN,FEB,MAR,APR,MEI,JUNI,JULI,JUMLAH&#10;1,BEQU BEVERAGE COLA FB,20,,,,,,,20"
                  rows={8}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 font-mono focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              {pasteFeedback && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
                    pasteFeedback.includes('berhasil')
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border border-rose-200 text-rose-800'
                  }`}
                >
                  {pasteFeedback.includes('berhasil') ? (
                    <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                  )}
                  <span>{pasteFeedback}</span>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleImportPaste}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition shadow-xs"
                >
                  Terapkan Data CSV
                </button>
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  Data Mentah Aktif ({currentCsv.split('\n').length} baris)
                </span>
                <button
                  onClick={copyCsv}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition border border-slate-200"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin' : 'Salin CSV'}</span>
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] font-mono text-slate-700 scrollbar-thin">
                <pre className="whitespace-pre-wrap">{currentCsv.slice(0, 3000)}...</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
