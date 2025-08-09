import type { GetServerSideProps } from 'next';
import { createClient } from '@supabase/supabase-js';
export const getServerSideProps: GetServerSideProps = async () => {
  const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { count } = await s.from('events').select('*', { count:'exact', head:true });
  return { props: { events: count ?? 0 } };
};
export default function Page({ events }: { events:number }) {
  return (<pre style={{fontFamily:'ui-monospace', padding:16}}>{`ActiveUsers: 0
MRR: $0
Churn: N/A
EventsToday: ${events}
AverageFreshness(min): —
CrawlerErrors(24h): 0
ServerCost(MTD): $0`}</pre>);
}
