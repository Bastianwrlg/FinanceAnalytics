// Cloudflare Pages Function for /api/health
export const onRequest: any = async () => {
  return new Response(
    JSON.stringify({
      status: "ok",
      platform: "cloudflare-pages",
      timestamp: new Date().toISOString(),
    }),
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
};
