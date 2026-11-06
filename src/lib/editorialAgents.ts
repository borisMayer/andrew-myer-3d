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
export function qualityWarnings(task:Task):string[] {
 const warnings:string[]=[];
 if(!task.content.trim())warnings.push('Empty content');
 if(!/^https:\/\//.test(BOOKS.find(b=>b.id===task.bookId)?.amazonUrl||''))warnings.push('Missing valid HTTPS retailer URL');
 if(/\[(Revisar|Review)/.test(task.content))warnings.push('Remove editorial placeholder before approval');
 if(task.content.length>2200&&task.channel==='Instagram')warnings.push('Review Instagram caption length');
 return warnings;
}
