// api/proxy.js — Vercel Serverless Function
// 브라우저 CORS 우회용 서버 프록시

export default async function handler(req, res) {
  // CORS 허용
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: "url 파라미터가 필요합니다" });
  }

  // 허용된 도메인만 프록시
  const ALLOWED = [
    "api.mashop.kr",
    "mashop.kr",
    "api.mapleland.gg",
    "mapleland.gg",
    "api.openweathermap.org",
  ];

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return res.status(400).json({ error: "유효하지 않은 URL" });
  }

  if (!ALLOWED.some((d) => parsed.hostname === d || parsed.hostname.endsWith("." + d))) {
    return res.status(403).json({ error: "허용되지 않은 도메인: " + parsed.hostname });
  }

  try {
    const upstream = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json, text/html, */*",
        Origin: "https://mapleland.gg",
        Referer: "https://mapleland.gg/",
      },
    });

    const contentType = upstream.headers.get("content-type") || "application/json";
    const body = await upstream.text();

    res.setHeader("Content-Type", contentType);
    return res.status(upstream.status).send(body);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
