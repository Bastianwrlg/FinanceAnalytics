# Panduan Deploy ke Cloudflare (Workers & Pages)

Dokumen ini menjelaskan solusi atas error pada tahap **Deploying (15s ❌)** di Cloudflare Workers Builds.

---

## 1. Analisis Error pada Tahap "Deploying"

Dari tangkapan layar dashboard Cloudflare Anda:
- Tahap **Initializing (7s)**: Selesai ✅
- Tahap **Cloning (2s)**: Selesai ✅
- Tahap **Installing (21s)**: Selesai ✅ *(masalah installing sebelumnya sudah 100% tuntas)*
- Tahap **Building (9s)**: Selesai ✅ *(script `npm run build:client` berhasil)*
- Tahap **Deploying (15s)**: Gagal ❌ *(eksekusi `npx wrangler deploy`)*

### Penyebab Kegagalan pada Tahap Deploying:
1. **Nama Worker Berbeda (`name` di `wrangler.toml`)**:
   - Di dashboard Cloudflare Anda, nama layanannya adalah **`financeanalyticspodaeliquid`**.
   - Sebelumnya di `wrangler.toml` tertulis `name = "financeanalyticspoda"`. Cloudflare CI menolak deploy jika nama di file konfigurasi berbeda dengan nama Worker di dashboard.
2. **Konflik konfigurasi Assets di `wrangler.toml`**:
   - Pada Wrangler versi 4, opsi `binding = "ASSETS"` memunculkan error: `The name 'ASSETS' is reserved`.
3. **Paket `wrangler` belum ada di `devDependencies`**:
   - Menjalankan `npx wrangler deploy` tanpa paket `wrangler` terpasang lokal memaksa CI mengunduh ulang wrangler dari npm saat proses deploy dan sering *timeout*.
4. **Build Token**:
   - Di layar Anda tertulis **Build token: `rakerhrgaitpoda build token`**. Jika token ini dibatasi hanya untuk worker proyek lain (`rakerhrgaitpoda`), maka deploy ke `financeanalyticspodaeliquid` akan ditolak dengan error otorisasi (*unauthorized*).

---

## 2. Perbaikan yang Sudah Diterapkan di Kode

- [x] **Menyesuaikan nama worker**: `wrangler.toml` diset `name = "financeanalyticspodaeliquid"`.
- [x] **Memperbaiki konfigurasi `wrangler.toml`**:
  ```toml
  name = "financeanalyticspodaeliquid"
  compatibility_date = "2024-09-01"
  main = "worker.ts"

  [assets]
  directory = "./dist"
  not_found_handling = "single-page-application"
  run_worker_first = ["/api/*"]
  ```
- [x] **Memasang `wrangler` lokal**: `wrangler@^4.131.1` telah ditambahkan ke `devDependencies` di `package.json`.
- [x] **Dry-run Sukses**: Perintah `npx wrangler deploy --dry-run` sudah diuji dan berhasil 100% dengan status kode 0 (`✨ Read 18 files from assets directory`).

---

## 3. Langkah Selanjutnya untuk Pengguna

Setelah melakukan commit / push perubahan terbaru ini ke repositori GitHub Anda:

1. Di halaman Cloudflare Dashboard yang sedang Anda buka, klik tombol **`Retry build`** di pojok kanan atas.
2. Proses **Deploying** akan membaca konfigurasi `wrangler.toml` yang sudah sinkron dan langsung berhasil hijau ✅.
3. **Catatan Penting terkait Build Token**:
   Jika masih muncul tanda silang pada tahap Deploying, periksa bagian **Build token**:
   - Buka tab **Settings** di Worker `financeanalyticspodaeliquid` > **Builds**.
   - Pastikan Build token yang digunakan memiliki hak akses izin **Workers Scripts: Edit** untuk worker `financeanalyticspodaeliquid` (atau buat token baru jika token `rakerhrgaitpoda build token` memiliki batasan izin).
