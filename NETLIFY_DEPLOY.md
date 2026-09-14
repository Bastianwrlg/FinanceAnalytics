# Panduan Deploy ke Netlify (PODA Finance & Analytics)

Aplikasi ini sudah dikonfigurasi penuh untuk **Netlify**, mencakup Single Page Application (SPA), routing otomatis, dan Netlify Functions untuk API.

---

## CARA 1: Paling Mudah & Otomatis via GitHub (Rekomendasi)

Jika repositori GitHub Anda (`BastianWrlg/FinanceAnalytics`) sudah ter-update:

1. Buka dan login ke [Netlify Dashboard](https://app.netlify.com/).
2. Klik tombol **Add new site** (di kanan atas) > pilih **Import an existing project**.
3. Pilih penyedia Git: **GitHub** dan berikan izin akses ke repo Anda.
4. Pilih repositori: **`BastianWrlg/FinanceAnalytics`**.
5. Netlify akan **otomatis membaca file `netlify.toml`**, sehingga Anda tidak perlu mengetik konfigurasi apa pun:
   - **Branch to deploy**: `main`
   - **Base directory**: *(kosongkan / default)*
   - **Build command**: `npm run build:client` *(otomatis terisi dari netlify.toml)*
   - **Publish directory**: `dist` *(otomatis terisi dari netlify.toml)*
6. *(Opsional)* Jika ingin mengaktifkan fitur AI Advisory di cloud, tambahkan di **Environment variables**:
   - Key: `GEMINI_API_KEY`
   - Value: `[API Key Gemini Anda]`
7. Klik tombol biru **Deploy BastianWrlg/FinanceAnalytics**.
8. Web Anda akan langsung aktif dalam ~1 menit dengan URL gratis misalnya:
   `https://financeanalytics-poda.netlify.app`

---

## CARA 2: Netlify Drop (Instan tanpa Git, Langsung Drag & Drop)

Jika Anda ingin situs langsung online dalam 10 detik tanpa setting apa pun:

1. Di komputer Anda, jalankan perintah build:
   ```bash
   npm install
   npm run build:client
   ```
2. Buka browser dan pergi ke halaman: **[https://app.netlify.com/drop](https://app.netlify.com/drop)**
3. Buka File Explorer di laptop Anda, tarik (**drag & drop**) folder **`dist`** langsung ke kotak Netlify Drop di browser.
4. Selesai! Web langsung online seketika.

---

## CARA 3: Deploy dari Terminal (Netlify CLI)

Jalankan satu perintah ini di terminal proyek:
```bash
npm run deploy:netlify
```
Netlify CLI akan mengompilasi Vite dan langsung menerbitkan ke server produksi Netlify.

---

## Fitur yang Sudah Dikonfigurasi Otomatis:
- [x] **File `netlify.toml`**: Mengatur build Vite, publish folder `dist`, dan Node versi 20.
- [x] **Routing SPA (`public/_redirects`)**: Menjamin tidak ada error 404 saat Anda me-refresh halaman di rute mana pun.
- [x] **Netlify Functions (`netlify/functions/`)**: Menyediakan endpoint `/api/sync-sheet`, `/api/health`, dan `/api/ai-financial-summary` agar fitur sinkronisasi Google Sheets dan analisis AI tetap berjalan lancar di Netlify.
