import { createClient } from "@supabase/supabase-js";

export default async function handler(req: any, res: any) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const s = createClient(url, key);

  const { city, trade } = req.query as any;
  let q = s.from("events").select("*").order("first_seen_at", { ascending: false }).limit(50);

  if (city) {
    const { data: srcs } = await s.from("sources").select("id").eq("city", city);
    if (srcs?.length) q = q.in("source_id", srcs.map((x: any) => x.id));
  }
  if (trade) q = q.contains("payload", { trade });

  const { data, error } = await q;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ events: data || [] });
}
