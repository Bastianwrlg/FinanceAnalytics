# Panduan Deploy ke Netlify (PODA Finance & Analytics)

Aplikasi ini telah dikonfigurasi sebagai **Clean Vite Single Page Application (SPA)** yang 100% mandiri, ringan, dan bebas dari kendala bundling fungsi serverless.

---

## CARA 1: Otomatis via GitHub (Rekomendasi)

1. Pastikan Anda sudah melakukan push pembaruan terbaru ke repositori GitHub:
   ```bash
   git add .
   git commit -m "Fix clean Vite SPA build for Netlify"
   git push
   ```
2. Buka [Netlify Dashboard](https://app.netlify.com/).
3. Buka proyek Anda (`financeanalytics` atau `financeanalyticspoda`).
4. Klik tab **Deploys** di menu samping.
5. Klik tombol **Trigger deploy** > pilih **Clear cache and deploy site**.
6. Netlify akan menjalankan `npm run build` yang menghasilkan folder `dist` dalam ~10 detik dan langsung **Published**.

---

## CARA 2: Netlify Drop (Paling Cepat, 10 Detik Langsung Online)

Jika Anda ingin langsung online tanpa antrean Git CI:
1. Di komputer lokal Anda, jalankan perintah:
   ```bash
   npm run build:client
   ```
2. Buka browser: **[https://app.netlify.com/drop](https://app.netlify.com/drop)**
3. Tarik (**drag & drop**) folder **`dist`** langsung ke area kotak di browser.
4. Situs langsung online seketika dengan domain gratis dari Netlify!

---

## Yang Telah Diperbaiki:
- [x] Menghapus dependensi fungsi serverless yang memicu error saat bundling Netlify.
- [x] Sinkronisasi Google Sheets kini dilengkapi **client-side direct fetch**, sehingga fitur sinkronisasi berjalan normal tanpa memerlukan server backend.
- [x] Menetapkan konfigurasi standar `netlify.toml` untuk Single Page Application dengan redirect `/* -> /index.html 200`.
- [x] Menjamin seluruh perkakas build (`vite`, `typescript`, `tailwindcss`, `esbuild`) selalu terinstal.
