// Netlify Function for /api/health
export default async (_req: Request) => {
  return new Response(
    JSON.stringify({
      status: "ok",
      platform: "netlify",
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
