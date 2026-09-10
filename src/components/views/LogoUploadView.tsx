import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  RotateCcw,
  CheckCircle2,
  Download,
  AlertCircle,
  Eye,
  Sliders,
  Sparkles,
  ShieldCheck,
  Check,
  FileCheck,
} from 'lucide-react';
import {
  useLogoConfig,
  saveLogoConfig,
  resetLogoToDefault,
  LogoConfig,
} from '../../utils/logoStorage';
import { PodaLogo } from '../PodaLogo';

export const LogoUploadView: React.FC = () => {
  const currentConfig = useLogoConfig();

  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentConfig.customLogoUrl
  );
  const [activeMode, setActiveMode] = useState<'official' | 'custom'>(
    currentConfig.mode
  );
  const [bgColor, setBgColor] = useState<'black' | 'transparent' | 'dark' | 'white'>(
    currentConfig.bgColor
  );
  const [padding, setPadding] = useState<number>(currentConfig.padding);
  const [fileMeta, setFileMeta] = useState<{
    name: string;
    size: string;
    type: string;
    dimensions?: string;
  } | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showNotification('error', 'Format file tidak didukung. Harap unggah file gambar (PNG, JPG, SVG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showNotification('error', 'Ukuran file terlalu besar. Maksimal 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreviewUrl(dataUrl);
      setActiveMode('custom');

      // Get dimensions
      const img = new Image();
      img.onload = () => {
        setFileMeta({
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          type: file.type,
          dimensions: `${img.naturalWidth} x ${img.naturalHeight} px`,
        });
      };
      img.src = dataUrl;

      showNotification(
        'info',
        `Foto logo "${file.name}" berhasil dimuat. Klik "Terapkan Logo" untuk menyimpan perubahan sistem.`
      );
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleApplyChanges = () => {
    if (activeMode === 'custom' && !previewUrl) {
      showNotification('error', 'Silakan pilih atau unggah file foto logo terlebih dahulu.');
      return;
    }

    saveLogoConfig({
      customLogoUrl: previewUrl,
      mode: activeMode,
      bgColor,
      padding,
    });

    showNotification(
      'success',
      activeMode === 'custom'
        ? 'Logo kustom berhasil diterapkan ke seluruh sistem (Header, Sidebar, Login, & Favicon)!'
        : 'Logo resmi vektor PODA berhasil diterapkan kembali sebagai standar sistem.'
    );
  };

  const handleResetToOfficial = () => {
    resetLogoToDefault();
    setPreviewUrl(null);
    setActiveMode('official');
    setBgColor('black');
    setPadding(2);
    setFileMeta(null);
    showNotification('success', 'Logo telah dikembalikan ke Logo Vektor Resmi PODA E-Liquid Company.');
  };

  const handleDownloadActiveLogo = () => {
    const link = document.createElement('a');
    if (activeMode === 'custom' && previewUrl) {
      link.href = previewUrl;
      link.download = fileMeta?.name || 'poda-custom-logo.png';
    } else {
      link.href = '/poda-brand-logo.svg';
      link.download = 'poda-brand-logo.svg';
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('info', 'File logo berhasil diunduh ke perangkat Anda.');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between shadow-lg transition animate-in fade-in duration-200 ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : notification.type === 'error'
              ? 'bg-rose-50 border-rose-300 text-rose-900'
              : 'bg-blue-50 border-blue-300 text-blue-900'
          }`}
        >
          <div className="flex items-center space-x-3">
            {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
            {notification.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
            {notification.type === 'info' && <Sparkles className="w-5 h-5 text-blue-600 shrink-0" />}
            <span className="text-xs sm:text-sm font-semibold">{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs font-bold px-2 py-1 rounded-md hover:bg-black/5"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Top Banner & Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300 flex items-center space-x-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
              <span>BRANDING & ASSET MANAGER</span>
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                currentConfig.mode === 'custom'
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-emerald-100 text-emerald-900 border-emerald-300'
              }`}
            >
              Status: {currentConfig.mode === 'custom' ? 'Logo Kustom Aktif' : 'Logo Vektor Resmi PODA'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-2">
            Pengaturan & Upload Foto Logo Perusahaan
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-1">
            Ganti atau sesuaikan logo brand PODA E-Liquid Company. Logo yang diunggah akan otomatis ditampilkan di Bilah Header, Navigasi Sidebar, Layar Login, dan Favicon Ikon aplikasi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleDownloadActiveLogo}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 shadow-xs transition flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Unduh Logo</span>
          </button>
          <button
            type="button"
            onClick={handleResetToOfficial}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs border border-slate-300 shadow-xs transition flex items-center space-x-1.5"
          >
            <RotateCcw className="w-4 h-4 text-slate-600" />
            <span>Reset ke Logo Resmi</span>
          </button>
        </div>
      </div>

      {/* Grid: Upload & Controls (Left) vs Real-time Previews (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload Area & Adjusters */}
        <div className="lg:col-span-6 space-y-6">
          {/* Mode Selector Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-amber-600" />
              <span>Pilihan Mode Logo Sistem</span>
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {/* Option 1: Official Logo */}
              <button
                type="button"
                onClick={() => setActiveMode('official')}
                className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
                  activeMode === 'official'
                    ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-400/20'
                    : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-900">Logo Resmi Vektor</span>
                  {activeMode === 'official' && (
                    <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 leading-tight">
                  Format vektor SVG resolusi tinggi dengan huruf P merah khas & badge hitam PODA.
                </p>
              </button>

              {/* Option 2: Custom Upload */}
              <button
                type="button"
                onClick={() => setActiveMode('custom')}
                className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
                  activeMode === 'custom'
                    ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-400/20'
                    : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-900">Foto Logo Kustom</span>
                  {activeMode === 'custom' && (
                    <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px]">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 leading-tight">
                  Gunakan file gambar foto Anda sendiri (PNG transparan, JPG, WebP, atau SVG).
                </p>
              </button>
            </div>
          </div>

          {/* Upload Dropzone Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 mb-1 flex items-center space-x-2">
              <UploadCloud className="w-4 h-4 text-emerald-600" />
              <span>Unggah File Foto Logo</span>
            </h2>
            <p className="text-xs text-slate-500 mb-3">
              Mendukung drag-and-drop atau klik tombol telusuri file dari perangkat Anda.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center ${
                isDragging
                  ? 'border-amber-500 bg-amber-50/60 scale-[1.01]'
                  : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-100/50'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-300 flex items-center justify-center text-amber-600 mb-3 shadow-xs">
                <UploadCloud className="w-6 h-6" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-800">
                Tarik & Lepaskan File Logo Di Sini
              </span>
              <span className="text-xs text-slate-500 mt-0.5">
                atau <span className="text-amber-600 font-semibold underline">klik untuk memilih file</span>
              </span>
              <div className="mt-3 flex items-center space-x-2 text-[10px] text-slate-400 font-medium">
                <span>PNG, JPG, SVG, WebP</span>
                <span>•</span>
                <span>Maksimal 5 MB</span>
              </div>
            </div>

            {/* File metadata info */}
            {fileMeta && (
              <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 min-w-0">
                  <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-slate-800 truncate">{fileMeta.name}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-500 text-[11px] shrink-0">
                  <span>{fileMeta.dimensions}</span>
                  <span>•</span>
                  <span>{fileMeta.size}</span>
                </div>
              </div>
            )}
          </div>

          {/* Styling & Container Adjusters */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-slate-600" />
              <span>Penyesuaian Wadah & Ruang Logo</span>
            </h2>

            {/* Background Color selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Warna Latar Belakang Wadah Logo:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'black', label: 'Hitam', bg: 'bg-black text-white' },
                  { id: 'dark', label: 'Slate Gelap', bg: 'bg-slate-900 text-white' },
                  { id: 'white', label: 'Putih Bersih', bg: 'bg-white text-slate-900 border border-slate-300' },
                  { id: 'transparent', label: 'Transparan', bg: 'bg-slate-100 text-slate-700 border border-dashed border-slate-300' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setBgColor(item.id as any)}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold transition text-center ${
                      item.bg
                    } ${
                      bgColor === item.id
                        ? 'ring-2 ring-amber-500 ring-offset-2 font-bold shadow-xs'
                        : 'opacity-80 hover:opacity-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Padding Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span>Margin Padding Dalam:</span>
                <span className="font-bold text-amber-600">{padding * 2} px</span>
              </div>
              <input
                type="range"
                min="0"
                max="4"
                step="1"
                value={padding}
                onChange={(e) => setPadding(parseInt(e.target.value, 10))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Rapat (0px)</span>
                <span>Sedang (4px)</span>
                <span>Longgar (8px)</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleApplyChanges}
                className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Terapkan Logo Sebagai Standar Sistem</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Multi-Context Previews */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 mb-1 flex items-center space-x-2">
              <Eye className="w-4 h-4 text-emerald-600" />
              <span>Simulasi & Preview Real-Time di Seluruh Antarmuka</span>
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Lihat langsung bagaimana logo Anda akan tampil di bilah atas header, sidebar, dan layar login.
            </p>

            <div className="space-y-4">
              {/* 1. Header Context Preview */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <div className="px-3 py-1.5 bg-slate-100 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Tampilan Pada Bilah Header Atas (Sticky Top)
                </div>
                <div className="p-3 bg-white border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    {/* Simulated Logo in Header */}
                    {activeMode === 'custom' && previewUrl ? (
                      <div
                        className={`inline-flex items-center justify-center rounded-xl border h-10 px-1 shadow-xs ${
                          bgColor === 'black'
                            ? 'bg-black border-neutral-800'
                            : bgColor === 'dark'
                            ? 'bg-slate-900 border-slate-800'
                            : bgColor === 'white'
                            ? 'bg-white border-slate-200'
                            : 'bg-transparent border-transparent'
                        }`}
                      >
                        <img
                          src={previewUrl}
                          alt="Preview Header"
                          className="h-full w-auto object-contain max-w-[140px]"
                        />
                      </div>
                    ) : (
                      <PodaLogo size="md" />
                    )}
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 rounded-full">
                      Finance Analytics
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="hidden sm:inline-block px-2.5 py-1 text-[10px] bg-slate-100 text-slate-600 font-medium rounded-lg border border-slate-200">
                      Live Preview
                    </span>
                    <span className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center">
                      BOD
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Navigation Sidebar Context */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <div className="px-3 py-1.5 bg-slate-100 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Tampilan Pada Mobile Drawer / Sidebar Navigasi
                </div>
                <div className="p-4 bg-white flex items-center space-x-3">
                  {activeMode === 'custom' && previewUrl ? (
                    <div
                      className={`inline-flex items-center justify-center rounded-xl border h-8 px-1 shadow-xs ${
                        bgColor === 'black'
                          ? 'bg-black border-neutral-800'
                          : bgColor === 'dark'
                          ? 'bg-slate-900 border-slate-800'
                          : bgColor === 'white'
                          ? 'bg-white border-slate-200'
                          : 'bg-transparent border-transparent'
                      }`}
                    >
                      <img
                        src={previewUrl}
                        alt="Preview Sidebar"
                        className="h-full w-auto object-contain max-w-[110px]"
                      />
                    </div>
                  ) : (
                    <PodaLogo size="sm" />
                  )}
                  <div className="text-xs font-semibold text-slate-700">
                    Menu Navigasi Mobile & Desktop
                  </div>
                </div>
              </div>

              {/* 3. Login Screen Context */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <div className="px-3 py-1.5 bg-slate-100 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Tampilan Pada Kartu Login Pengguna
                </div>
                <div className="p-6 bg-slate-100/70 flex flex-col items-center justify-center">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-md text-center max-w-sm w-full">
                    <div className="flex justify-center mb-2">
                      {activeMode === 'custom' && previewUrl ? (
                        <div
                          className={`inline-flex items-center justify-center rounded-xl border h-14 px-2 shadow-md ${
                            bgColor === 'black'
                              ? 'bg-black border-neutral-800'
                              : bgColor === 'dark'
                              ? 'bg-slate-900 border-slate-800'
                              : bgColor === 'white'
                              ? 'bg-white border-slate-200'
                              : 'bg-transparent border-transparent'
                          }`}
                        >
                          <img
                            src={previewUrl}
                            alt="Preview Login"
                            className="h-full w-auto object-contain max-w-[180px]"
                          />
                        </div>
                      ) : (
                        <PodaLogo size="lg" />
                      )}
                    </div>
                    <div className="text-xs font-bold text-slate-900">PODA E-Liquid Portal</div>
                    <div className="text-[10px] text-slate-500">Finance & Strategic Analytics</div>
                  </div>
                </div>
              </div>

              {/* 4. Contrast Grid Testing */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <div className="px-3 py-1.5 bg-slate-100 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Uji Kontras Latar Belakang (Dark & Light)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3">
                  {[
                    { title: 'Hitam Pekat', bg: 'bg-black text-white' },
                    { title: 'Slate 900', bg: 'bg-slate-900 text-white' },
                    { title: 'Abu Terang', bg: 'bg-slate-100 text-slate-800' },
                    { title: 'Putih Bersih', bg: 'bg-white text-slate-800 border border-slate-200' },
                  ].map((panel, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl flex flex-col items-center justify-center space-y-2 text-center ${panel.bg}`}
                    >
                      <span className="text-[9px] font-bold opacity-75">{panel.title}</span>
                      <div className="h-9 flex items-center justify-center">
                        {activeMode === 'custom' && previewUrl ? (
                          <img
                            src={previewUrl}
                            alt="Preview Grid"
                            className="max-h-full max-w-full object-contain"
                          />
                        ) : (
                          <PodaLogo size="sm" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
