import { useEffect, useState } from 'react';
type Event = { id:number; event_type:string; change_summary:string|null; first_seen_at:string; payload:any; };
export default function Home(){
  const [events, setEvents] = useState<Event[]>([]);
  const [city, setCity] = useState('Los Angeles');
  const [trade, setTrade] = useState('roofing');
  useEffect(()=>{ (async()=>{
    const p = new URLSearchParams({ city, trade });
    const r = await fetch(`/api/events?${p}`); const j = await r.json(); setEvents(j.events??[]);
  })(); }, [city, trade]);
  return (
    <main style={{maxWidth:900, margin:'40px auto', padding:16, fontFamily:'Inter, system-ui'}}>
      <h1>PermitPulse (MVP)</h1>
      <p style={{color:'#555'}}>Fresh permit & inspection signals. Select a territory, see the newest events.</p>
      <div style={{display:'flex', gap:8, margin:'12px 0'}}>
        <input value={city} onChange={e=>setCity(e.target.value)} placeholder="City" />
        <select value={trade} onChange={e=>setTrade(e.target.value)}>
          <option value="roofing">Roofing</option>
          <option value="ev">EV Chargers</option>
          <option value="sprayfoam">Spray Foam</option>
          <option value="hvac">HVAC</option>
        </select>
        <a href={`/api/export.csv?city=${encodeURIComponent(city)}&trade=${encodeURIComponent(trade)}`}>Export CSV</a>
      </div>
      <ul style={{listStyle:'none', padding:0}}>
        {events.map(ev=>(
          <li key={ev.id} style={{padding:12, border:'1px solid #eee', marginBottom:8, borderRadius:8}}>
            <div style={{fontSize:13, color:'#666'}}>{new Date(ev.first_seen_at).toLocaleString()}</div>
            <div style={{fontWeight:600, marginTop:4}}>{ev.event_type.toUpperCase()}</div>
            {ev.change_summary && <div>{ev.change_summary}</div>}
            <pre style={{whiteSpace:'pre-wrap', background:'#fafafa', padding:8, borderRadius:6}}>
              {JSON.stringify(ev.payload, null, 2)}
            </pre>
          </li>
        ))}
      </ul>
    </main>
  );
}
