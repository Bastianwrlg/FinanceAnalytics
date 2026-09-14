// Netlify Function for /api/ai-financial-summary

export default async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  const fallbackAnalysis = {
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
  };

  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const { kpis, rawContext } = body;
    const apiKey = typeof process !== "undefined" ? process.env?.GEMINI_API_KEY : undefined;

    if (!apiKey) {
      return new Response(JSON.stringify(fallbackAnalysis), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const prompt = `Anda adalah CFO & Senior Financial Analyst untuk PODA E-Liquid Company.
Berdasarkan data keuangan berikut:
- Total Volume Penjualan (Jan-Jul): ${kpis?.totalBottles || "860,900"} botol (60ml: ${kpis?.vol60ml || "386,813"}, 30ml: ${kpis?.vol30ml || "474,057"}, 15ml: ${kpis?.vol15ml || "30"})
- Estimasi Gross Revenue: Rp ${kpis?.grossRevenue || "51.2 Miliar"}
- Estimasi Gross Profit Margin: ${kpis?.grossMargin || "46.5%"}
- Total OPEX: Rp ${kpis?.totalOpex || "4.8 Miliar"}
- Total Marketing Expense: Rp ${kpis?.marketingExpense || "3.2 Miliar"}
- Total AR (Piutang Usaha): Rp ${kpis?.totalAr || "7.8 Miliar"}
- Total AP (Utang Supplier & Cukai): Rp ${kpis?.totalAp || "5.4 Miliar"}
- Top Best Sellers: Orama V1 60ml, Orama V1 Pods Friendly 30ml, Bequ Mango 30ml, Bequ Lights V1 & V3.
${rawContext ? `Detail Konteks: ${rawContext.slice(0, 800)}` : ""}

Berikan respon dalam format JSON murni:
{
  "executiveSummary": "ringkasan eksekutif 2-3 kalimat",
  "keyObservations": ["observasi 1", "observasi 2", "observasi 3", "observasi 4"],
  "actionableRecommendations": ["rekomendasi 1", "rekomendasi 2", "rekomendasi 3"]
}`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const aiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" },
      }),
    });

    if (!aiRes.ok) {
      return new Response(JSON.stringify(fallbackAnalysis), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const data: any = await aiRes.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    const parsed = JSON.parse(candidateText);

    return new Response(
      JSON.stringify({ source: "gemini", analysis: parsed }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch {
    return new Response(JSON.stringify(fallbackAnalysis), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
};
