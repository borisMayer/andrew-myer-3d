import { useEffect, useState } from 'react';
import { AGENTS, loadTasks, saveTasks, makeTasks, qualityWarnings, exportTasksCsv, exportTasksJson, importTasksJson, retailerAudit } from '../lib/editorialAgents';
import type { Task, TaskStatus } from '../lib/editorialAgents';

export default function AgentWorkspace() {
  const [tasks,setTasks] = useState<Task[]>([]);
  const [language,setLanguage] = useState<'es'|'en'>('es');
  const [active,setActive] = useState('');
  useEffect(()=>{setTasks(loadTasks());},[]);
  const update=(items:Task[])=>{setTasks(items);saveTasks(items);};
  const change=(id:string,status:TaskStatus)=>update(tasks.map(t=>t.id===id?{...t,status,updatedAt:new Date().toISOString()}:t));
  function download(name:string,body:string,mime:string) {
    const blob=new Blob([body],{type:mime});
    const url=URL.createObjectURL(blob);
    const anchor=document.createElement('a');
    anchor.href=url;anchor.download=name;anchor.click();
    window.setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  async function restore(file:File|undefined) {
    if(!file)return;
    try {
      if(file.size>2000000)throw new Error('File too large');
      const restored=importTasksJson(await file.text());
      if(window.confirm('Replace the current local task list with the imported backup?')){update(restored);setActive('');}
    }catch(error){window.alert(error instanceof Error?error.message:'Invalid backup');}
  }
  const audit=retailerAudit();
  const selected=tasks.find(t=>t.id===active);
  const warnings=selected?qualityWarnings(selected):[];
  return <section style={{marginTop:24,color:'#e8dfd0'}}>
    <h2 style={{fontFamily:'Georgia,serif'}}>Centro de agentes editoriales</h2>
    <p>Automatización local sin servicios de pago. Toda publicación requiere aprobación.</p>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:12}}>
      {AGENTS.map(a=><article key={a.id} style={{padding:16,border:'1px solid #6b5938',borderRadius:8}}><strong>{language==='es'?a.es:a.en}</strong><p style={{fontSize:12}}>{a.responsibility}</p></article>)}
    </div>
    <div style={{margin:'22px 0',display:'flex',gap:12,flexWrap:'wrap'}}>
      <select aria-label="Idioma" value={language} onChange={e=>setLanguage(e.target.value as 'es'|'en')}><option value="es">Español</option><option value="en">English</option></select>
      <button type="button" onClick={()=>update([...tasks,...makeTasks(language)])}>Crear siete borradores</button>
      <button type="button" onClick={()=>download('andrew-myer-calendar.csv',exportTasksCsv(tasks),'text/csv;charset=utf-8')} disabled={!tasks.length}>Exportar CSV</button>
      <button type="button" onClick={()=>download('andrew-myer-backup.json',exportTasksJson(tasks),'application/json')} disabled={!tasks.length}>Copia de seguridad</button>
      <label style={{cursor:'pointer'}}>Restaurar JSON <input aria-label="Restaurar copia de seguridad" type="file" accept=".json,application/json" onChange={e=>{void restore(e.target.files?.[0]);e.target.value='';}} /></label>
      <span>{tasks.length} tareas · {tasks.filter(t=>t.status==='approved').length} aprobadas</span>
    </div>
    <details style={{marginBottom:18,padding:12,border:'1px solid #665333',borderRadius:6}}>
      <summary>Auditoría Amazon · {audit.filter(a=>a.specific).length}/{audit.length} enlaces directos a libros</summary>
      <p style={{fontSize:12}}>Un enlace a la página general del autor no equivale a un enlace directo de compra. Los enlaces se comprueban por formato, no mediante solicitudes de red.</p>
      {audit.map(a=><p key={a.id} style={{fontSize:12}}>{a.specific?'✓':a.valid?'⚠':'✕'} {a.title} — {a.specific?'Ficha de producto':'Revisar enlace específico'}</p>)}
    </details>
    {tasks.map(t=><button type="button" key={t.id} onClick={()=>setActive(t.id)} style={{display:'block',width:'100%',padding:12,marginBottom:8,textAlign:'left',background:'#24202b',color:'#eee',border:'1px solid #665333',borderRadius:6}}>{t.scheduledDate} · {t.title} · {t.status}</button>)}
    {selected&&<article style={{border:'1px solid #665333',padding:16,marginTop:18}}>
      <h3>{selected.title}</h3>
      <textarea aria-label="Borrador" rows={10} value={selected.content} onChange={e=>update(tasks.map(t=>t.id===selected.id?{...t,content:e.target.value,status:'draft'}:t))} style={{width:'100%',background:'#211b27',color:'#fff',padding:12,boxSizing:'border-box'}}/>
      {warnings.map(w=><p key={w} role="status">⚠ {w}</p>)}
      <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
        <button type="button" onClick={()=>change(selected.id,'review')}>Revisar</button>
        <button type="button" disabled={selected.status!=='review'||warnings.length>0} onClick={()=>change(selected.id,'approved')}>Aprobar</button>
        <button type="button" disabled={selected.status!=='approved'} onClick={()=>change(selected.id,'done')}>Marcar publicado manualmente</button>
        <button type="button" onClick={()=>navigator.clipboard.writeText(selected.content)}>Copiar</button>
      </div>
      <p style={{fontSize:12}}>Aprobar no publica automáticamente. Los borradores se guardan en este navegador, no en un servidor.</p>
    </article>}
  </section>;
}
