# Panduan Deploy ke Cloudflare Pages (PODA Finance & Analytics)

Dokumen ini menjelaskan solusi mengatasi kegagalan instalasi sebelumnya serta panduan langkah-demi-langkah deploy aplikasi ini ke Cloudflare Pages.

---

## 1. Penyebab Utama Error "Gagal Installing" Sebelumnya

Pada Cloudflare Pages, kegagalan saat proses *Installing* biasanya terjadi karena 2 faktor:
1. **Adanya file `bun.lock`**: Runner bawaan Cloudflare Pages mencoba menjalankan `bun install --frozen-lockfile` menggunakan versi Bun lama yang belum kompatibel dengan format teks `bun.lock` (Bun v1.2+), sehingga instalasi langsung gagal sebelum build dimulai.
2. **Versi Node.js default terlalu lama**: Cloudflare Pages image default kadang menggunakan Node 12 atau 18. Sedangkan stack aplikasi ini (React 19, Tailwind v4, Vite 6, Typescript 5.8) membutuhkan **Node.js 20+**.
3. **Tidak adanya `package-lock.json`**: Sistem build npm memerlukan file lockfile standar npm.

### Apa yang Sudah Kami Perbaiki di Repositori:
- [x] Menghapus `bun.lock` dan membuat file `package-lock.json` resmi npm yang stabil.
- [x] Menambahkan file `.nvmrc` dan `.node-version` (diset ke **Node 20**) agar Cloudflare otomatis mendeteksi Node.js versi 20.
- [x] Menambahkan `public/_redirects` (`/* /index.html 200`) agar Single Page Application (SPA) tidak error 404 saat di-refresh.
- [x] Menambahkan fungsi serverless Edge di folder `functions/api/` (`sync-sheet.ts`, `ai-financial-summary.ts`, `health.ts`) sehingga fitur sinkronisasi Google Sheets & AI tetap berfungsi penuh di Cloudflare Pages tanpa butuh server terpisah!
- [x] Menyediakan file `wrangler.toml` dan script `build:client` di `package.json`.

---

## 2. Cara Deploy via Cloudflare Dashboard (GitHub / Git Integration)

Jika Anda menghubungkan repositori GitHub/GitLab ke Cloudflare Pages:

1. Buka [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Workers & Pages**.
2. Klik **Create application** > pilih tab **Pages** > **Connect to Git**.
3. Pilih repositori proyek ini.
4. Pada bagian **Build settings**, isi pengaturan berikut:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build:client` *(atau `npm run build`)*
   - **Build output directory**: `dist`
   - **Root directory**: *(biarkan kosong / default)*
5. Pada bagian **Environment variables (advanced)**, tambahkan variabel berikut:
   - `NODE_VERSION` = `20`
   - *(Opsional)* `GEMINI_API_KEY` = *[API Key Gemini Anda]* (jika ingin mengaktifkan fitur analisis AI otomatis di Cloudflare)
6. Klik **Save and Deploy**.
7. Proses instalasi dependencies (`npm install`) dan build akan berjalan sukses 100%!

---

## 3. Cara Deploy Cepat via Terminal (Wrangler CLI)

Jika ingin deploy langsung dari komputer lokal Anda tanpa Git:

1. Di terminal lokal proyek ini, jalankan build client:
   ```bash
   npm install
   npm run build:client
   ```
2. Deploy langsung folder `dist` ke Cloudflare Pages:
   ```bash
   npx wrangler pages deploy dist --project-name=poda-finance-analytics
   ```

---

## 4. Pengaturan Variabel Lingkungan (Environment Variables)

Jika Anda ingin fitur AI Financial Advisory menggunakan API Key Gemini di Cloudflare:
1. Masuk ke proyek Pages Anda di Cloudflare Dashboard.
2. Buka menu **Settings** > **Environment variables**.
3. Tambahkan untuk Production dan Preview:
   - `GEMINI_API_KEY`: `AIzaSy...`
4. Simpan. Cloudflare Pages Function di `functions/api/ai-financial-summary.ts` akan otomatis membaca API key tersebut.
