'use client';
import { useState } from 'react';

type Msg = { role: 'user'|'assistant'|'system'; content: string };

const MODEL_OPTIONS = [
  { id: 'openai:gpt-4o-mini', label: 'OpenAI GPT-4o mini' },
  { id: 'anthropic:claude-3-5-sonnet', label: 'Claude 3.5 Sonnet' },
  { id: 'google:gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
];

export default function ChatPage(){
  const [models, setModels] = useState<string[]>([MODEL_OPTIONS[0].id, MODEL_OPTIONS[1].id]);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [runs, setRuns] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [enhance, setEnhance] = useState(true);

  async function onSend(prompt: string){
    const next = [...messages, { role: 'user', content: prompt }];
    setMessages(next);
    setLoading(true);
    const res = await fetch('/api/fanout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: next, models, enhance })
    });
    const data = await res.json();
    setRuns(data);
    setLoading(false);
  }

  return (
    <main style={{minHeight:'100vh', padding:'1rem', maxWidth:1100, margin:'0 auto'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.5rem 0'}}>
        <div style={{fontWeight:600}}>MultiModelLab</div>
        <div style={{fontSize:12, border:'1px solid #e5e7eb', padding:'4px 10px', borderRadius:999}}>
          Usage: {runs?.used ?? 0} tokens (demo)
        </div>
      </div>

      <div style={{border:'1px solid #e5e7eb', borderRadius:16, padding:12, marginBottom:12}}>
        {MODEL_OPTIONS.map(m => (
          <button key={m.id}
            onClick={()=> setModels(models.includes(m.id) ? models.filter(x=>x!==m.id) : [...models, m.id])}
            style={{
              marginRight:8, marginBottom:8, padding:'8px 12px', borderRadius:12,
              border:'1px solid #e5e7eb',
              background: models.includes(m.id) ? '#111827' : '#fff',
              color: models.includes(m.id) ? '#fff' : '#111827'
            }}>{m.label}</button>
        ))}
        <label style={{marginLeft:12, fontSize:14}}>
          <input type="checkbox" checked={enhance} onChange={e=>setEnhance(e.target.checked)} /> Prompt Enhance
        </label>
      </div>

      <PromptBox onSend={onSend} loading={loading}/>

      {loading && <div style={{fontSize:14, color:'#6b7280', marginTop:8}}>Running models…</div>}
      {runs && <ResponseGrid runs={runs}/>}
    </main>
  );
}

function PromptBox({ onSend, loading }:{ onSend:(s:string)=>void; loading:boolean; }){
  const [val, setVal] = useState('');
  return (
    <div style={{display:'flex', gap:8}}>
      <textarea rows={3} value={val} onChange={e=>setVal(e.target.value)} placeholder="Ask one question for all models…"
        style={{flex:1, border:'1px solid #e5e7eb', borderRadius:12, padding:12, resize:'vertical'}} />
      <button disabled={!val || loading} onClick={()=>{ onSend(val); setVal(''); }}
        style={{padding:'12px 16px', borderRadius:12, background:'#4f46e5', color:'#fff', opacity: (!val || loading) ? .6 : 1}}>
        Send
      </button>
    </div>
  );
}

function ResponseGrid({ runs }:{ runs:any }){
  const entries = Object.entries(runs.responses || {});
  return (
    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:12, marginTop:12}}>
      {entries.map(([model, data]: any) => (
        <div key={model} style={{border:'1px solid #e5e7eb', borderRadius:16, padding:12, background:'#fff'}}>
          <div style={{fontSize:12, textTransform:'uppercase', color:'#6b7280', marginBottom:6}}>{model}</div>
          {data.error ? (
            <div style={{color:'#b91c1c'}}>Error: {data.error}</div>
          ) : (
            <div style={{whiteSpace:'pre-wrap'}}>{data.output}</div>
          )}
          <div style={{marginTop:8, fontSize:12, color:'#6b7280'}}>
            {Math.round((data.tokens||0))} tokens · {data.latency?.toFixed?.(1)}s
          </div>
        </div>
      ))}
    </div>
  );
}
