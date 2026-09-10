import React, { useState } from 'react';
import {
  ShieldCheck,
  Shield,
  Users,
  Award,
  Calculator,
  UserCheck,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Key,
  Check,
  X,
  Sparkles,
  Info,
  Lock,
  Unlock,
  Building,
} from 'lucide-react';
import { UserSession, UserRole, RolePermissionConfig, UserAccountItem } from '../../types';
import {
  getStoredRoles,
  saveStoredRoles,
  getStoredUsers,
  saveStoredUsers,
  DEFAULT_ROLES_CONFIG,
  DEFAULT_USER_ACCOUNTS,
} from '../../data/roleAccessData';

interface RoleAccessViewProps {
  currentUser?: UserSession | null;
  onSwitchRole?: (role: UserRole) => void;
}

export const RoleAccessView: React.FC<RoleAccessViewProps> = ({
  currentUser,
  onSwitchRole,
}) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'users' | 'governance'>('matrix');
  const [roles, setRoles] = useState<RolePermissionConfig[]>(getStoredRoles);
  const [users, setUsers] = useState<UserAccountItem[]>(getStoredUsers);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('ALL');

  // Add User Modal state
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<string>('FAT_STAFF');
  const [newUserDepartment, setNewUserDepartment] = useState('Finance & Accounting');

  const [notification, setNotification] = useState<{
    type: 'success' | 'info' | 'error';
    message: string;
  } | null>(null);

  const showToast = (type: 'success' | 'info' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleTogglePermission = (roleCode: string, permissionKey: keyof RolePermissionConfig['permissions']) => {
    const updated = roles.map((r) => {
      if (r.roleCode === roleCode) {
        return {
          ...r,
          permissions: {
            ...r.permissions,
            [permissionKey]: !r.permissions[permissionKey],
          },
        };
      }
      return r;
    });

    setRoles(updated);
    saveStoredRoles(updated);
    showToast('success', `Hak akses untuk role ${roleCode} berhasil diperbarui.`);
  };

  const handleResetRolesToDefault = () => {
    setRoles(DEFAULT_ROLES_CONFIG);
    saveStoredRoles(DEFAULT_ROLES_CONFIG);
    showToast('info', 'Matriks wewenang hak akses dikembalikan ke standar default.');
  };

  const handleToggleUserStatus = (userId: string) => {
    const updated = users.map((u) => {
      if (u.id === userId) {
        const nextStatus: 'Aktif' | 'Nonaktif' = u.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
        return { ...u, status: nextStatus };
      }
      return u;
    });
    setUsers(updated);
    saveStoredUsers(updated);
    showToast('info', 'Status keaktifan pengguna diperbarui.');
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserUsername.trim()) {
      showToast('error', 'Nama dan Username wajib diisi.');
      return;
    }

    const roleObj = roles.find((r) => r.roleCode === newUserRole) || roles[0];
    const initials = newUserName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const newUser: UserAccountItem = {
      id: `usr-${Date.now()}`,
      name: newUserName.trim(),
      username: newUserUsername.trim().toLowerCase(),
      email: newUserEmail.trim() || `${newUserUsername.trim().toLowerCase()}@poda.co.id`,
      roleCode: roleObj.roleCode,
      roleName: roleObj.roleName,
      department: newUserDepartment.trim() || roleObj.department,
      avatarInitials: initials,
      status: 'Aktif',
      lastLogin: 'Baru dibuat',
    };

    const updated = [...users, newUser];
    setUsers(updated);
    saveStoredUsers(updated);

    setIsAddUserModalOpen(false);
    setNewUserName('');
    setNewUserUsername('');
    setNewUserEmail('');
    showToast('success', `Akun pengguna ${newUser.name} (${roleObj.roleName}) berhasil ditambahkan!`);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'ALL' || u.roleCode === filterRole;
    return matchesSearch && matchesRole;
  });

  const permissionItems: {
    key: keyof RolePermissionConfig['permissions'];
    label: string;
    description: string;
    category: string;
  }[] = [
    {
      key: 'canViewDashboard',
      label: 'Dashboard Eksekutif',
      description: 'Melihat ringkasan KPI eksekutif, revenue, dan total volume',
      category: 'MODUL UTAMA',
    },
    {
      key: 'canViewSales',
      label: 'Sales (128 SKU E-Liquid)',
      description: 'Melihat rincian penjualan brand Bequ, Orama, Bites, dan Tester',
      category: 'MODUL UTAMA',
    },
    {
      key: 'canViewBahanBaku',
      label: 'Bahan Baku (Raw Materials)',
      description: 'Memantau stok PG, VG, Nikotin USP, perasa, dan kemasan',
      category: 'MODUL BIAYA & PABRIK',
    },
    {
      key: 'canViewHpp',
      label: 'HPP & Tarif Cukai Rokok Elektrik (REL)',
      description: 'Akses formula HPP, Cukai REL 32.8%, dan margin per botol',
      category: 'MODUL BIAYA & PABRIK',
    },
    {
      key: 'canViewOpex',
      label: 'Beban Operasional (OPEX)',
      description: 'Audit gaji, utilitas cleanroom pabrik, dan legalitas lab',
      category: 'MODUL BIAYA & PABRIK',
    },
    {
      key: 'canViewMarketing',
      label: 'Marketing Expense',
      description: 'Monitoring anggaran vape influencer, expo, dan POSM toko',
      category: 'MODUL BIAYA & PABRIK',
    },
    {
      key: 'canViewArAp',
      label: 'Piutang & Utang (AR/AP)',
      description: 'Pemeriksaan aging schedule distributor, afiliasi, & vendor',
      category: 'KAS & KEUANGAN',
    },
    {
      key: 'canViewDetailedAccounting',
      label: 'Akses Akuntansi Rinci',
      description: 'Fasilitas audit neraca rinci dan rekonsiliasi faktur',
      category: 'KAS & KEUANGAN',
    },
    {
      key: 'canExportReports',
      label: 'Ekspor Laporan Finansial',
      description: 'Unduh laporan berkas PDF, Excel, dan format CSV',
      category: 'OTORISASI & DATA',
    },
    {
      key: 'canSyncSpreadsheet',
      label: 'Sinkronisasi Spreadsheet Online',
      description: 'Menyambungkan data langsung ke Google Sheets PODA',
      category: 'OTORISASI & DATA',
    },
    {
      key: 'canManageRoles',
      label: 'Kelola Role & Pengaturan Akses',
      description: 'Mengubah wewenang dan menugaskan peran staf',
      category: 'ADMINISTRASI SISTEM',
    },
    {
      key: 'canUploadLogo',
      label: 'Upload & Ubah Foto Logo',
      description: 'Mengganti logo brand perusahaan di seluruh antarmuka',
      category: 'ADMINISTRASI SISTEM',
    },
  ];

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

      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>KONTROL HAK AKSES & KEAMANAN</span>
            </span>
            <span className="text-xs text-slate-500">• Multi-Role Access Control (RBAC)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-2">
            Pengaturan Role & Wewenang Akses Sistem
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-1">
            Konfigurasi batasan wewenang untuk Direksi (BOD), Kepala Keuangan (Head FAT), Auditor, dan staf operasional pabrik e-liquid.
          </p>
        </div>

        {/* Current Active Session & Quick Switcher */}
        {currentUser && (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center space-x-3 shrink-0">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-xs ${
                currentUser.roleCode === 'BOD'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {currentUser.roleCode === 'BOD' ? (
                <Award className="w-5 h-5" />
              ) : (
                <Calculator className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Role Aktif Anda:</div>
              <div className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                <span>{currentUser.role}</span>
                <span className="text-[10px] text-slate-500 font-normal">({currentUser.username})</span>
              </div>
            </div>
            {onSwitchRole && (
              <button
                type="button"
                onClick={() =>
                  onSwitchRole(currentUser.roleCode === 'BOD' ? 'HEAD_FAT' : 'BOD')
                }
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 transition"
              >
                Ganti Role
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-slate-200 space-x-1">
        {[
          { id: 'matrix', label: 'Matriks Hak Akses Peran', icon: ShieldCheck },
          { id: 'users', label: 'Daftar Akun Pengguna', icon: Users },
          { id: 'governance', label: 'SOP & Tata Kelola Keamanan', icon: Info },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center space-x-2 ${
                isActive
                  ? 'border-amber-500 text-amber-700 bg-amber-50/40'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PERMISSION MATRIX */}
      {activeTab === 'matrix' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Matriks Granular Hak Akses Fitur Keuangan
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Klik ikon centang untuk memberikan atau mencabut akses setiap modul bagi masing-masing role.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetRolesToDefault}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition flex items-center space-x-1.5 self-start sm:self-center"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Matriks Default</span>
            </button>
          </div>

          {/* Matrix Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                    <th className="py-3.5 px-4 w-72">Fitur & Modul Sistem</th>
                    {roles.map((role) => (
                      <th key={role.roleCode} className="py-3.5 px-3 text-center min-w-[130px]">
                        <div className="flex flex-col items-center">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${
                              role.roleCode === 'BOD'
                                ? 'bg-amber-100 text-amber-900 border-amber-300'
                                : role.roleCode === 'HEAD_FAT'
                                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                : role.roleCode === 'FAT_STAFF'
                                ? 'bg-blue-100 text-blue-900 border-blue-300'
                                : role.roleCode === 'INTERNAL_AUDITOR'
                                ? 'bg-purple-100 text-purple-900 border-purple-300'
                                : 'bg-rose-100 text-rose-900 border-rose-300'
                            }`}
                          >
                            {role.roleName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal mt-0.5 truncate max-w-[120px]">
                            {role.department}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {permissionItems.map((perm, idx) => (
                    <tr key={perm.key} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{perm.label}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                          {perm.description}
                        </div>
                        <span className="inline-block text-[9px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
                          {perm.category}
                        </span>
                      </td>

                      {roles.map((role) => {
                        const isGranted = !!role.permissions[perm.key];
                        return (
                          <td key={role.roleCode} className="py-3 px-3 text-center align-middle">
                            <button
                              type="button"
                              onClick={() => handleTogglePermission(role.roleCode, perm.key)}
                              className={`w-8 h-8 rounded-xl inline-flex items-center justify-center transition ${
                                isGranted
                                  ? 'bg-emerald-500 text-white shadow-xs hover:bg-emerald-600'
                                  : 'bg-slate-100 text-slate-300 hover:bg-slate-200 hover:text-slate-400'
                              }`}
                              title={`${isGranted ? 'Cabut' : 'Berikan'} akses ${perm.label} untuk ${role.roleName}`}
                            >
                              {isGranted ? <Check className="w-4 h-4 stroke-[3]" /> : <X className="w-4 h-4" />}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER ACCOUNTS */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Daftar Akun Pengguna & Penugasan Role
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Kelola akun anggota tim, status aktif, serta penugasan peran jabatan operasional.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddUserModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xs transition flex items-center space-x-1.5 self-start sm:self-center"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Pengguna Baru</span>
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama, username, atau email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500 shrink-0">Filter Role:</span>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="text-xs py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="ALL">Semua Role</option>
                {roles.map((r) => (
                  <option key={r.roleCode} value={r.roleCode}>
                    {r.roleName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* User Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                    <th className="py-3.5 px-4">Nama Pengguna</th>
                    <th className="py-3.5 px-3">Username & Email</th>
                    <th className="py-3.5 px-3">Role / Jabatan</th>
                    <th className="py-3.5 px-3">Departemen</th>
                    <th className="py-3.5 px-3 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        Tidak ada pengguna yang cocok dengan pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => {
                      const isCurrentActive =
                        currentUser?.username.toLowerCase() === user.username.toLowerCase();

                      return (
                        <tr key={user.id} className="hover:bg-slate-50/70 transition">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-slate-800 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0">
                                {user.avatarInitials}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                                  <span>{user.name}</span>
                                  {user.isSystemUser && (
                                    <span className="text-[9px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded font-semibold border">
                                      Sistem
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-400">Login: {user.lastLogin}</div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-3">
                            <div className="font-mono text-slate-700 font-semibold">{user.username}</div>
                            <div className="text-slate-400 text-[11px]">{user.email}</div>
                          </td>

                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                                user.roleCode === 'BOD'
                                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                                  : user.roleCode === 'HEAD_FAT'
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                  : 'bg-blue-100 text-blue-900 border-blue-300'
                              }`}
                            >
                              {user.roleName}
                            </span>
                          </td>

                          <td className="py-3 px-3 text-slate-600">{user.department}</td>

                          <td className="py-3 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleUserStatus(user.id)}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition ${
                                user.status === 'Aktif'
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                              }`}
                            >
                              {user.status}
                            </button>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              {onSwitchRole && (
                                <button
                                  type="button"
                                  onClick={() => onSwitchRole(user.roleCode as UserRole)}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
                                    isCurrentActive
                                      ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                                  }`}
                                  title="Beralih ke role user ini"
                                >
                                  {isCurrentActive ? 'Role Aktif' : 'Simulasi Role'}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GOVERNANCE & AUDIT */}
      {activeTab === 'governance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: BOD Governance */}
          <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-xs space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Tupoksi & Wewenang Dewan Direksi (BOD)
                </h3>
                <p className="text-xs text-slate-500">Prinsip Fiduciary & Pengawasan Strategis</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dewan Direksi berwenang mengawasi kinerja menyeluruh 128 SKU produk e-liquid (Bequ, Orama, Bites), mengevaluasi Net Margin target 35%+, meninjau laba operasi EBITDA, mengotorisasi ekspansi kapasitas pabrik, dan mengambil keputusan investasi belanja modal (CAPEX).
            </p>
            <ul className="text-xs text-slate-700 space-y-1.5 pt-2 border-t border-slate-100">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Otorisasi strategi penetapan harga wholesale botol 60ml & 30ml</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Persetujuan plafon anggaran promosi & event vape fair</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Ekspor laporan konsolidasi eksekutif bulanan</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Head FAT Governance */}
          <div className="bg-white rounded-2xl border border-emerald-200 p-6 shadow-xs space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Tupoksi & Wewenang Head FAT (Keuangan & Pajak)
                </h3>
                <p className="text-xs text-slate-500">Pengendalian Biaya, Cukai & Rekonsiliasi Kas</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Head of Finance, Accounting & Tax bertanggung jawab atas akurasi biaya COGS/HPP per botol, kepatuhan pembayaran tarif Cukai Rokok Elektrik (REL) 32.8% ke Bea Cukai, pengendalian anggaran OPEX bulanan, penagihan piutang distributor (AR Aging), dan rekonsiliasi arus kas.
            </p>
            <ul className="text-xs text-slate-700 space-y-1.5 pt-2 border-t border-slate-100">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Simulasi akurat tarif pita cukai REL dan PPN rokok elektrik</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Sinkronisasi langsung data penjualan dari Google Spreadsheet</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Penyusunan audit neraca saldo dan rekonsiliasi bank mitra</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Modal: Add New User */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">Tambah Akun Pengguna Baru</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddUserModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap Pegawai / Direksi:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ahmad Fauzi, SE"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Username Akun (Login ID):
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: fauzi_fat"
                  value={newUserUsername}
                  onChange={(e) => setNewUserUsername(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Perusahaan:
                </label>
                <input
                  type="email"
                  placeholder="Contoh: fauzi@poda.co.id"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pilihan Role:
                  </label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {roles.map((r) => (
                      <option key={r.roleCode} value={r.roleCode}>
                        {r.roleName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Departemen:
                  </label>
                  <input
                    type="text"
                    value={newUserDepartment}
                    onChange={(e) => setNewUserDepartment(e.target.value)}
                    placeholder="Departemen"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl shadow-xs transition"
                >
                  Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
