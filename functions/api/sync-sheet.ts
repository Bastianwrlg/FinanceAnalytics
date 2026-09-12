// Cloudflare Pages Function for /api/sync-sheet

function normalizeGoogleSheetUrl(inputUrl: string, sheetName?: string): string {
  try {
    const url = inputUrl.trim();
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      const sheetId = match[1];
      if (sheetName) {
        return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
      }
      const gidMatch = url.match(/[#&?]gid=([0-9]+)/);
      const gid = gidMatch ? gidMatch[1] : "0";
      return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
    }
    return url;
  } catch {
    return inputUrl;
  }
}

export const onRequest: any = async (context: any) => {
  // CORS Preflight
  if (context.request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  const urlObj = new URL(context.request.url);
  let rawUrl = urlObj.searchParams.get("url");
  let sheetName = urlObj.searchParams.get("sheet");

  if (!rawUrl && context.request.method === "POST") {
    try {
      const body = await context.request.json();
      rawUrl = body?.url;
      sheetName = body?.sheet;
    } catch {
      // Ignore parse failure
    }
  }

  if (!rawUrl) {
    return new Response(
      JSON.stringify({ error: "URL spreadsheet tidak boleh kosong" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }

  const csvUrl = normalizeGoogleSheetUrl(rawUrl, sheetName || undefined);

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
      return new Response(
        JSON.stringify({
          error: `Gagal mengunduh spreadsheet: HTTP ${response.status} ${response.statusText}. Pastikan link spreadsheet sudah di-'Publish to the web' atau diset 'Anyone with the link can view'.`,
        }),
        {
          status: response.status,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const csvText = await response.text();
    return new Response(
      JSON.stringify({
        success: true,
        sourceUrl: csvUrl,
        csv: csvText,
        syncedAt: new Date().toISOString(),
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        error: `Gagal menghubungi link spreadsheet: ${err.message || "Network error"}. Periksa kembali link dan hak akses publik.`,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
};
