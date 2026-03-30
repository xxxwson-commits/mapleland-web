// api/proxy.js — Vercel Serverless Function
// 브라우저 CORS 우회용 서버 프록시

export default async function handler(req, res) {
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

  const isMashop = parsed.hostname.includes("mashop.kr");
  const isMapleland = parsed.hostname.includes("mapleland.gg");

  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
    "Accept-Encoding": "gzip, deflate, br",
    "Cache-Control": "no-cache",
    "Pragma": "no-cache",
  };

  if (isMashop) {
    headers["Origin"] = "https://mashop.kr";
    headers["Referer"] = "https://mashop.kr/";
    headers["Host"] = parsed.hostname;
  } else if (isMapleland) {
    headers["Origin"] = "https://mapleland.gg";
    headers["Referer"] = "https://mapleland.gg/";
    headers["Host"] = parsed.hostname;
  }

  try {
    const upstream = await fetch(url, { headers });
    const contentType = upstream.headers.get("content-type") || "application/json";
    const body = await upstream.text();
    res.setHeader("Content-Type", contentType);
    return res.status(upstream.status).send(body);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
