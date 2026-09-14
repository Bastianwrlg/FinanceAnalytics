# Panduan Deploy ke Cloudflare (Workers & Pages)

Dokumen ini menjelaskan mengapa domain Anda (`financeanalyticspoda.bastianwrlg.workers.dev`) sebelumnya hanya memunculkan tulisan **"Hello world"**, serta cara mudah mengatasinya.

---

## 1. Mengapa Muncul Tulisan "Hello world"?

Berdasarkan URL yang Anda buka:
`financeanalyticspoda.bastianwrlg.workers.dev`

Domain berakhiran **`.workers.dev`** adalah produk **Cloudflare Workers**.
Secara bawaan (*default*), ketika Anda membuat Worker baru di Cloudflare Dashboard atau menjalankan `wrangler init`, Cloudflare memasang kode starter minimal berikut:
```javascript
export default {
  async fetch(request, env, ctx) {
    return new Response("Hello world");
  }
}
```
Hasil build React/Vite (dashboard finansial, grafik, tabel produk, dll.) belum dihubungkan ke Worker tersebut, sehingga Cloudflare hanya mengembalikan teks "Hello world" bawaan tersebut.

---

## 2. Solusi Langsung: Deploy ke Worker Anda (`*.workers.dev`)

Kami telah memperbarui konfigurasi `wrangler.toml` dan menambahkan file `worker.ts` agar Worker Anda **otomatis menyajikan seluruh aplikasi antarmuka PODA Analytics** dari folder `./dist`:

### Jalankan perintah berikut di terminal Anda:

```bash
# 1. Pastikan dependencies terpasang
npm install

# 2. Build frontend React / Vite
npm run build:client

# 3. Deploy langsung ke Cloudflare Workers
npx wrangler deploy
```
*(Atau cukup satu perintah: `npm run deploy:worker`)*

Setelah perintah selesai, buka kembali `https://financeanalyticspoda.bastianwrlg.workers.dev`.
Seluruh tampilan Dashboard Eksekutif, Penjualan 128 SKU E-Liquid, HPP & Tarif Cukai REL, Bahan Baku, OPEX, Marketing, dan AR/AP akan langsung muncul sempurna!

---

## 3. Opsi Lain: Deploy via Cloudflare Pages (`*.pages.dev`)

Jika Anda lebih memilih menggunakan **Cloudflare Pages** (sangat cocok untuk frontend React & integrasi GitHub otomatis):

### Opsi A: Menggunakan Wrangler CLI di Terminal
```bash
npm run build:client
npx wrangler pages deploy dist --project-name=financeanalyticspoda
```

### Opsi B: Menggunakan Git / GitHub di Cloudflare Dashboard
1. Buka [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Workers & Pages**.
2. Klik **Create application** > pilih tab **Pages** > **Connect to Git**.
3. Pilih repositori proyek ini.
4. Pada bagian **Build settings**:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build:client`
   - **Build output directory**: `dist`
5. Pada bagian **Environment variables**, tambahkan:
   - `NODE_VERSION` = `20`
   - *(Opsional)* `GEMINI_API_KEY` = *[API Key Gemini Anda]*
6. Klik **Save and Deploy**.
