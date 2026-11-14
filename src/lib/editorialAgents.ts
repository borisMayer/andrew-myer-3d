import { BOOKS } from './books';

export type AgentId = 'strategy'|'editorial'|'seo'|'social'|'sales'|'analytics'|'quality';
export type TaskStatus = 'draft'|'review'|'approved'|'done';
export type Channel = 'Instagram'|'Facebook'|'TikTok'|'YouTube'|'Blog';
export type Task = { id:string; agent:AgentId; bookId:string; channel:Channel; language:'es'|'en'; title:string; content:string; status:TaskStatus; scheduledDate:string; createdAt:string; updatedAt:string };
export type Agent = { id:AgentId; es:string; en:string; responsibility:string; requiresApproval:boolean };
export const AGENTS:Agent[] = [
  {id:'strategy',es:'Estrategia editorial',en:'Editorial strategy',responsibility:'Select catalog priorities and weekly objectives',requiresApproval:true},
  {id:'editorial',es:'Redacción y adaptación',en:'Writing and adaptation',responsibility:'Create source-grounded drafts without invented quotations',requiresApproval:true},
  {id:'seo',es:'SEO y descubrimiento',en:'SEO and discovery',responsibility:'Suggest search-friendly titles and descriptions',requiresApproval:true},
  {id:'social',es:'Redes sociales',en:'Social media',responsibility:'Prepare channel-specific content and publication queue',requiresApproval:true},
  {id:'sales',es:'Conversión y ventas',en:'Sales and conversion',responsibility:'Audit book links and suggest compliant calls to action',requiresApproval:true},
  {id:'analytics',es:'Analítica',en:'Analytics',responsibility:'Report only measurable outcomes and distinguish clicks from sales',requiresApproval:false},
  {id:'quality',es:'Calidad y cumplimiento',en:'Quality and compliance',responsibility:'Flag unverifiable claims, broken links and unapproved posts',requiresApproval:true},
];
const storeKey = 'andrew-myer-editorial-v1';
export function loadTasks():Task[] {
  try { const value = JSON.parse(localStorage.getItem(storeKey)||'[]'); return Array.isArray(value) ? value.filter((x:unknown)=>isTask(x)) : []; } catch { return []; }
}
function isTask(x:unknown):x is Task { return typeof x==='object'&&x!==null&&typeof (x as Task).id==='string'&&typeof (x as Task).content==='string'&&typeof (x as Task).status==='string'; }
export function saveTasks(tasks:Task[]) { localStorage.setItem(storeKey,JSON.stringify(tasks)); }
export function makeTasks(language:'es'|'en',start:Date=new Date()):Task[] {
  const books=BOOKS.filter(b=>!b.comingSoon);
  const channels:Channel[]=['Instagram','Facebook','Blog','TikTok','YouTube'];
  if(!books.length)return [];
  return Array.from({length:7},(_,i)=>{
    const book=books[i%books.length],channel=channels[i%channels.length];
    const date=new Date(start);date.setDate(start.getDate()+i+1);
    const title=language==='es'?book.titleEs:book.titleEn;
    const description=language==='es'?book.description:(book.descriptionEn||book.description);
    const intro=language==='es'?'Una obra para explorar nuevas preguntas:':'A book that invites new questions:';
    const cta=language==='es'?'Descubre el libro y consulta su disponibilidad:':'Discover the book and check availability:';
    return {id:`task-${Date.now()}-${i}`,agent:i===2?'seo':i===6?'sales':'social',bookId:book.id,channel,language,title:`${channel} · ${title}`,content:`${intro}\n\n${title}\n\n${description.slice(0,320)}\n\n${cta}\n${book.amazonUrl}\n\n[${language==='es'?'Revisar antes de publicar':'Review before publishing'}]`,status:'draft',scheduledDate:date.toISOString().slice(0,10),createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()} as Task;
  });
}
/** US organic launch: editorial drafts, not ads or automatic social posts. */
export function makeUsLaunchTasks(start:Date=new Date()):Task[] {
  const picks=[
    {bookId:'entre-dos-mundos-vol1',channel:'Instagram' as Channel,agent:'social' as AgentId,hook:'What changes when a life is interrupted?',body:'Between Two Worlds, Vol. I recounts an intensive-care experience during the COVID-19 pandemic and reflects on faith, mortality, and meaning.'},
    {bookId:'entre-dos-mundos-vol1',channel:'Facebook' as Channel,agent:'editorial' as AgentId,hook:'A story of survival and spiritual reflection',body:'Andrew Myer explores a personal journey through critical illness and the questions that follow. For readers interested in faith, testimony, and the search for meaning.'},
    {bookId:'jesucristo-leon-de-juda',channel:'Blog' as Channel,agent:'seo' as AgentId,hook:'Reformed Theology and the Question of Divine Creation',body:'Explore Andrew Myer’s theological work on Christology, divine creation, and the concept of Tzimtzum. This introduction presents the author’s interpretation, not a consensus scholarly position.'},
    {bookId:'el-renacido',channel:'YouTube' as Channel,agent:'social' as AgentId,hook:'Can a crisis reshape the way we understand freedom?',body:'Video script outline: introduce the author’s experience, describe the themes of spiritual renewal in The Reborn, and invite viewers to explore the book. Use original visuals and narration.'},
    {bookId:'entre-dos-mundos-vol1',channel:'TikTok' as Channel,agent:'social' as AgentId,hook:'One question after surviving a life-changing illness',body:'Short-form video concept: a 20–30 second reflection on mortality and purpose, grounded in the author’s account. Avoid medical or supernatural claims presented as proven facts.'},
    {bookId:'narcisismo-primera-ley-cristalizacion',channel:'Instagram' as Channel,agent:'editorial' as AgentId,hook:'What happens when theology meets the study of narcissism?',body:'Andrew Myer approaches narcissism through theological, philosophical, and psychoanalytic lenses. This book presents an interpretive framework, not a clinical diagnostic guide.'},
    {bookId:'jesucristo-leon-de-juda',channel:'Facebook' as Channel,agent:'sales' as AgentId,hook:'Explore a different perspective on Christology',body:'Discover a theological exploration of the Lion of Judah and Tzimtzum, written for readers interested in systematic theology and religious philosophy.'}
  ];
  return picks.map((item,i)=>{
    const book=BOOKS.find(b=>b.id===item.bookId)!;
    const date=new Date(start);date.setDate(start.getDate()+i+1);
    const now=new Date().toISOString();
    return {id:`us-launch-${Date.now()}-${i}`,agent:item.agent,bookId:book.id,channel:item.channel,language:'en' as const,title:`US launch · ${item.channel} · ${book.titleEn}`,content:`${item.hook}\n\n${item.body}\n\nExplore Andrew Myer's books: https://www.andrewmyer.com/\n\n#AndrewMyer #Books #Reading\n\n[Review copy, destination and US audience fit before publishing]`,status:'draft' as const,scheduledDate:date.toISOString().slice(0,10),createdAt:now,updatedAt:now};
  });
}
export function qualityWarnings(task:Task):string[] {
 const warnings:string[]=[];
 if(!task.content.trim())warnings.push('Empty content');
 if(!/^https:\/\//.test(BOOKS.find(b=>b.id===task.bookId)?.amazonUrl||''))warnings.push('Missing valid HTTPS retailer URL');
 if(/\[(Revisar|Review)/.test(task.content))warnings.push('Remove editorial placeholder before approval');
 if(task.content.length>2200&&task.channel==='Instagram')warnings.push('Review Instagram caption length');
 return warnings;
}

export function exportTasksCsv(tasks:Task[]):string {
 const columns:(keyof Task)[]=['scheduledDate','channel','bookId','language','agent','status','title','content','createdAt','updatedAt','id'];
 const quote=(v:string)=>'"'+v.replace(/"/g,'""')+'"';
 return '\uFEFF'+[columns.join(','),...tasks.map(t=>columns.map(k=>quote(String(t[k]))).join(','))].join('\r\n');
}
export function exportTasksJson(tasks:Task[]):string {
 return JSON.stringify({format:'andrew-myer-editorial',version:1,exportedAt:new Date().toISOString(),tasks},null,2);
}
export function importTasksJson(raw:string):Task[] {
 const payload:unknown=JSON.parse(raw);
 if(!payload||typeof payload!=='object'||(payload as {format?:string}).format!=='andrew-myer-editorial'||(payload as {version?:number}).version!==1)throw new Error('Unsupported backup format');
 const items=(payload as {tasks?:unknown}).tasks;
 if(!Array.isArray(items)||items.length>1000||!items.every(isTask))throw new Error('Invalid task list');
 const allowed=new Set(['draft','review','approved','done']);
 return items.map(t=>({...t,status:allowed.has(t.status)?t.status:'draft',content:t.content.slice(0,15000)}));
}
export function retailerAudit() {
 return BOOKS.filter(b=>!b.comingSoon).map(book=>{
  let valid=false, specific=false;
  try {
   const u=new URL(book.amazonUrl);
   valid=u.protocol==='https:'&&u.hostname.toLowerCase().startsWith('www.amazon.');
   specific=valid&&(u.pathname.includes('/dp/')||u.pathname.includes('/gp/product/'));

  }catch{}
  return {id:book.id,title:book.titleEs,url:book.amazonUrl,valid,specific};
 });
}
