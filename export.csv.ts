import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { stringify } from 'csv-stringify/sync';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const s = createClient(url, key);
  const { city, trade } = req.query as any;
  let q = s.from('events').select('*').order('first_seen_at', { ascending:false }).limit(500);
  if (city) {
    const { data: srcs } = await s.from('sources').select('id').eq('city', city);
    if (srcs?.length) q = q.in('source_id', srcs.map(x=>x.id));
  }
  if (trade) q = q.contains('payload', { trade });
  const { data, error } = await q;
  if (error) return res.status(500).json({ error: error.message });
  const rows = (data||[]).map((e:any)=>({ id:e.id, event_type:e.event_type, first_seen_at:e.first_seen_at, change_summary:e.change_summary }));
  const csv = stringify(rows, { header:true });
  res.setHeader('Content-Type', 'text/csv');
  res.send(csv);
}
