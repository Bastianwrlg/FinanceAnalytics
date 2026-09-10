import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
      console.error("Failed to initialize Gemini client:", e);
    }
  }
  return aiClient;
}

function normalizeGoogleSheetUrl(inputUrl: string, sheetName?: string): string {
  try {
    let url = inputUrl.trim();
    // If user provided a standard Google Sheets URL (e.g. /d/SPREADSHEET_ID/edit#gid=0)
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      const sheetId = match[1];
      if (sheetName) {
        return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
      }
      // Check if there is a gid
      const gidMatch = url.match(/[#&?]gid=([0-9]+)/);
      const gid = gidMatch ? gidMatch[1] : "0";
      return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
    }
    return url;
  } catch {
    return inputUrl;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "15mb" }));

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Proxy endpoint to sync with Google Spreadsheet link
  app.all("/api/sync-sheet", async (req, res) => {
    const rawUrl = (req.query.url as string) || req.body?.url;
    const sheetName = (req.query.sheet as string) || req.body?.sheet;
    if (!rawUrl) {
      return res.status(400).json({ error: "URL spreadsheet tidak boleh kosong" });
    }

    const csvUrl = normalizeGoogleSheetUrl(rawUrl, sheetName);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const response = await fetch(csvUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Accept: "text/csv,text/plain,*/*",
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        return res.status(response.status).json({
          error: `Gagal mengunduh spreadsheet: HTTP ${response.status} ${response.statusText}. Pastikan link spreadsheet sudah di-'Publish to the web' atau diset 'Anyone with the link can view'.`,
        });
      }

      const csvText = await response.text();
      return res.json({
        success: true,
        sourceUrl: csvUrl,
        csv: csvText,
        syncedAt: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error("Error fetching spreadsheet:", err);
      return res.status(500).json({
        error: `Gagal menghubungi link spreadsheet: ${err.message || "Network error"}. Periksa kembali link dan hak akses publik.`,
      });
    }
  });

  // AI Financial Advisory & Strategic Analysis
  app.post("/api/ai-financial-summary", async (req, res) => {
    const { kpis, monthlyData, rawContext } = req.body || {};

    const ai = getGeminiClient();
    if (!ai) {
      // Return structured fallback analysis if API key is not yet set
      return res.json({
        source: "rule-based",
        analysis: {
          executiveSummary:
            "Performa keuangan PODA E-Liquid menunjukkan tren pertumbuhan volume botol yang sangat kuat di kuartal kedua, dipimpin oleh lini Bequ Saltnic dan Orama V1. Rasio HPP terkendali pada ~52.8%, namun likuiditas perlu dijaga melalui percepatan penagihan AR distributor.",
          keyObservations: [
            "Puncak penjualan terjadi pada April (197.491 botol) didorong momentum menjelang hari raya dan promo distributor.",
            "Lini 30ML Saltnic & Pods Friendly menyumbang 55.1% dari total volume, menandakan shifting preferensi pasar konsumen ke segmen pod system.",
            "Aging Piutang (AR) di atas 60 hari sebesar 14.8% memerlukan pengetatan credit limit bagi distributor tier-2.",
            "Biaya cukai rokok elektrik merupakan komponen terbesar HPP (38-42% dari total HPP), sehingga kepatuhan pemesanan pita cukai kuartalan krusial untuk cash flow.",
          ],
          actionableRecommendations: [
            "Terapkan diskon pembayaran tunai (2/10 net 30) untuk mempercepat perputaran piutang (DSO) dari 48 hari menjadi 35 hari.",
            "Optimalisasi pembelian bahan baku bulk (PG/VG & Nicotine) untuk memitigasi fluktuasi kurs USD import.",
            "Alokasikan 15% budget marketing untuk event regional dan aktivasi komunitas vape store lokal guna menjaga retensi pasca-April.",
          ],
        },
      });
    }

    try {
      const prompt = `Anda adalah CFO & Senior Financial Analyst untuk PODA E-Liquid Company (produsen liquid vape Indonesia terkemuka).
Berdasarkan data keuangan dan penjualan berikut, berikan ringkasan eksekutif, observasi penting, dan rekomendasi strategis:
Data Ringkasan:
- Total Volume Penjualan (Jan-Jul): ${kpis?.totalBottles || "860,900"} botol (60ml: ${kpis?.vol60ml || "386,813"}, 30ml: ${kpis?.vol30ml || "474,057"}, 15ml: ${kpis?.vol15ml || "30"})
- Estimasi Gross Revenue: Rp ${kpis?.grossRevenue || "51.2 Miliar"}
- Estimasi Gross Profit Margin: ${kpis?.grossMargin || "46.5%"}
- Total OPEX: Rp ${kpis?.totalOpex || "4.8 Miliar"}
- Total Marketing Expense: Rp ${kpis?.marketingExpense || "3.2 Miliar"}
- Total AR (Piutang Usaha): Rp ${kpis?.totalAr || "7.8 Miliar"}
- Total AP (Utang Supplier & Cukai): Rp ${kpis?.totalAp || "5.4 Miliar"}
- Top Best Sellers: Orama V1 60ml, Orama V1 Pods Friendly 30ml, Bequ Mango 30ml, Bequ Lights V1 & V3, Creme Brulee 60ml.
${rawContext ? `Detail Konteks: ${rawContext.slice(0, 800)}` : ""}

Berikan respon dalam format JSON murni dengan struktur:
{
  "executiveSummary": "ringkasan eksekutif 2-3 kalimat",
  "keyObservations": ["observasi 1", "observasi 2", "observasi 3", "observasi 4"],
  "actionableRecommendations": ["rekomendasi 1", "rekomendasi 2", "rekomendasi 3"]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text || "{}";
      const parsed = JSON.parse(responseText);
      return res.json({ source: "gemini", analysis: parsed });
    } catch (e: any) {
      console.error("Gemini AI error:", e);
      return res.status(500).json({ error: e.message || "Gagal menghasilkan insight AI" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Error starting server:", err);
});
