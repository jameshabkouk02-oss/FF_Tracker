import { Redis } from "@upstash/redis";

// The Vercel Marketplace (Upstash) integration injects these env vars automatically.
// It may use either the KV_* names (legacy) or the UPSTASH_* names depending on the
// integration version, so we accept whichever pair is present.
const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
});

// One JSON blob holds the whole collection: { fin: {...}, fic: {...} }
const KEY = "ff:collection";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const data = await redis.get(KEY); // @upstash/redis returns the parsed object
      return res.status(200).json(data || { fin: {}, fic: {} });
    }

    if (req.method === "POST") {
      const body =
        typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
      const fin = body.fin && typeof body.fin === "object" ? body.fin : {};
      const fic = body.fic && typeof body.fic === "object" ? body.fic : {};
      await redis.set(KEY, { fin, fic });
      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    return res.status(500).json({ error: String(e && e.message ? e.message : e) });
  }
}
