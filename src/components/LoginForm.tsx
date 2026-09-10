import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, Award, Calculator, CheckCircle2 } from 'lucide-react';
import { PodaLogo } from './PodaLogo';
import { UserSession, UserRole } from '../types';

export type { UserSession };

interface LoginFormProps {
  onLogin: (user: UserSession) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [selectedRolePreset, setSelectedRolePreset] = useState<UserRole>('BOD');
  const [username, setUsername] = useState('bod');
  const [password, setPassword] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSelectRolePreset = (role: UserRole) => {
    setSelectedRolePreset(role);
    setErrorMessage('');
    if (role === 'BOD') {
      setUsername('bod');
      setPassword('admin');
    } else {
      setUsername('headfat');
      setPassword('admin');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanUsername) {
      setErrorMessage('Silakan masukkan username atau user ID.');
      return;
    }

    if (!cleanPassword) {
      setErrorMessage('Silakan masukkan kata sandi.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      // Check credentials for BOD
      const isBodUser =
        cleanUsername === 'bod' ||
        cleanUsername === 'admin' ||
        cleanUsername === 'bod@poda.co.id' ||
        cleanUsername === 'admin@poda.co.id';
      const isBodPass = cleanPassword === 'admin' || cleanPassword === 'bod' || cleanPassword === 'bod123';

      // Check credentials for Head FAT
      const isFatUser =
        cleanUsername === 'headfat' ||
        cleanUsername === 'head_fat' ||
        cleanUsername === 'fat' ||
        cleanUsername === 'headfat@poda.co.id' ||
        cleanUsername === 'fat@poda.co.id';
      const isFatPass = cleanPassword === 'admin' || cleanPassword === 'fat' || cleanPassword === 'fat123' || cleanPassword === 'headfat';

      let authenticatedUser: UserSession | null = null;

      if (isBodUser && isBodPass) {
        authenticatedUser = {
          name: 'BOD',
          username: 'bod',
          role: 'BOD',
          roleCode: 'BOD',
          roleTitle: 'Board of Directors',
          department: 'Executive Board & Strategic Leadership',
          lastLogin: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          avatarInitials: 'BOD',
          permissions: {
            canExportReports: true,
            canSyncSpreadsheet: true,
            canEditConfig: true,
            canViewExecutiveKPI: true,
            canViewDetailedAccounting: false,
          },
        };
      } else if (isFatUser && isFatPass) {
        authenticatedUser = {
          name: 'Head FAT',
          username: 'headfat',
          role: 'Head FAT',
          roleCode: 'HEAD_FAT',
          roleTitle: 'Head of Finance, Accounting & Tax',
          department: 'Finance, Accounting & Tax Division',
          lastLogin: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          avatarInitials: 'FAT',
          permissions: {
            canExportReports: true,
            canSyncSpreadsheet: true,
            canEditConfig: true,
            canViewExecutiveKPI: true,
            canViewDetailedAccounting: true,
          },
        };
      } else {
        setErrorMessage(
          'Kredensial tidak cocok. Pilihan akun:\n• BOD: user "bod" / pass "admin"\n• Head FAT: user "headfat" / pass "admin"'
        );
        return;
      }

      if (rememberMe) {
        localStorage.setItem('poda_auth_user', JSON.stringify(authenticatedUser));
      } else {
        sessionStorage.setItem('poda_auth_user', JSON.stringify(authenticatedUser));
      }

      onLogin(authenticatedUser);
    }, 350);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col justify-center items-center px-4 py-10 selection:bg-amber-500 selection:text-slate-950">
      {/* Subtle background blur accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-100/60 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-slate-100/70 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-lg">
        {/* Card Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-7 sm:p-9">
          {/* Header Brand */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <PodaLogo size="lg" className="shadow-lg shadow-black/20" />
            </div>
            <span className="inline-block mt-1 px-3 py-1 text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 rounded-full">
              Finance &amp; Operations Portal
            </span>
            <p className="text-xs text-slate-500 mt-2">
              Sistem analitik finansial, akuntansi, dan manufaktur PT PODA E-Liquid
            </p>
          </div>

          {/* Role Access Selector Buttons */}
          <div className="mb-6">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Pilih Role Akses
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {/* Role: BOD */}
              <button
                type="button"
                onClick={() => handleSelectRolePreset('BOD')}
                className={`relative p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  selectedRolePreset === 'BOD'
                    ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/20 shadow-xs'
                    : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black text-xs shadow-xs">
                    <Award className="w-4 h-4" />
                  </span>
                  {selectedRolePreset === 'BOD' && (
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">BOD</div>
                  <div className="text-[10px] text-slate-500 leading-snug">
                    Board of Directors
                  </div>
                </div>
                <div className="mt-2 text-[9px] text-amber-800 font-semibold bg-amber-100/80 px-1.5 py-0.5 rounded-md inline-block self-start">
                  Eksekutif &amp; Laporan
                </div>
              </button>

              {/* Role: Head FAT */}
              <button
                type="button"
                onClick={() => handleSelectRolePreset('HEAD_FAT')}
                className={`relative p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  selectedRolePreset === 'HEAD_FAT'
                    ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-400/20 shadow-xs'
                    : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-600 text-white font-black text-xs shadow-xs">
                    <Calculator className="w-4 h-4" />
                  </span>
                  {selectedRolePreset === 'HEAD_FAT' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Head FAT</div>
                  <div className="text-[10px] text-slate-500 leading-snug">
                    Finance, Accounting &amp; Tax
                  </div>
                </div>
                <div className="mt-2 text-[9px] text-emerald-800 font-semibold bg-emerald-100/80 px-1.5 py-0.5 rounded-md inline-block self-start">
                  Kontrol Biaya &amp; Cukai
                </div>
              </button>
            </div>

            {/* Role Responsibility Brief */}
            <div className="mt-2.5 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600">
              {selectedRolePreset === 'BOD' ? (
                <span>
                  <strong className="text-slate-900">Fokus BOD:</strong> Pengawasan performa penjualan 128 SKU, margin laba kotor &amp; bersih, EBITDA, serta ekspor laporan komprehensif.
                </span>
              ) : (
                <span>
                  <strong className="text-slate-900">Fokus Head FAT:</strong> Audit biaya HPP &amp; Cukai REL, pengawasan stok bahan baku e-liquid, OPEX per departemen, AR/AP, dan sinkronisasi Spreadsheet.
                </span>
              )}
            </div>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5"></span>
              <span className="whitespace-pre-line leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Username / User ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="login-username">
                Username / User ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="login-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={selectedRolePreset === 'BOD' ? 'bod' : 'headfat'}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition font-medium"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700" htmlFor="login-password">
                  Kata Sandi
                </label>
                <span className="text-[10px] text-slate-400">
                  Default pass: <span className="font-mono text-slate-600 font-semibold">admin</span>
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center space-x-2 text-xs text-slate-600 cursor-pointer select-none">
                <input
                  id="login-remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
                />
                <span>Ingat sesi saya di perangkat ini</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              id="login-btn-submit"
              type="submit"
              disabled={isLoading}
              className={`w-full mt-2 py-2.5 px-4 rounded-xl text-slate-950 font-bold text-sm shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-60 ${
                selectedRolePreset === 'BOD'
                  ? 'bg-amber-500 hover:bg-amber-400 active:bg-amber-600 shadow-amber-500/20'
                  : 'bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white shadow-emerald-500/20'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <span>Memverifikasi Akses {selectedRolePreset === 'BOD' ? 'BOD' : 'Head FAT'}...</span>
                </>
              ) : (
                <>
                  <span>Masuk sebagai {selectedRolePreset === 'BOD' ? 'BOD' : 'Head FAT'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security footnote */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center space-x-2 text-slate-400 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Koneksi aman multi-role PT PODA E-Liquid</span>
          </div>
        </div>

        {/* Brand note bottom */}
        <p className="text-center text-xs text-slate-400 mt-5">
          &copy; {new Date().getFullYear()} PODA E-Liquid Company. All rights reserved.
        </p>
      </div>
    </div>
  );
};
