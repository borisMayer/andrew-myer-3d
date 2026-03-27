import { useState, useEffect, useCallback } from 'react';

interface Book {
  id: string; slug: string;
  title_es: string; title_en: string;
  subtitle_es?: string; subtitle_en?: string;
  description_es: string; description_en: string;
  cover_url?: string; pdf_url?: string;
  isbn?: string; year?: number;
  is_published: boolean; sort_order: number;
  prices: Price[];
}
interface Price { id: string; book_id: string; currency: string; amount: number; is_active: boolean; }
interface Sale { id: string; book_id: string; title_es: string; buyer_email: string; buyer_name?: string; amount: number; currency: string; status: string; created_at: string; }

const CURRENCIES = ['CLP','ARS','USD','MXN','COP'];
const API = '/api';

// Styles
const inp = { width:'100%', padding:'0.6rem 0.8rem', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'3px', color:'rgba(220,215,205,0.9)', fontSize:'0.875rem', outline:'none', boxSizing:'border-box' as const };
const lbl = { display:'block', fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase' as const, color:'rgba(160,155,145,0.5)', marginBottom:'0.3rem', fontFamily:'monospace' };
const btnGold = { padding:'0.5rem 1.1rem', background:'rgba(180,155,90,0.15)', border:'1px solid rgba(180,155,90,0.45)', borderRadius:'3px', color:'rgba(205,178,90,0.95)', fontSize:'11px', letterSpacing:'0.08em', cursor:'pointer', fontFamily:'monospace' };
const btnGray = { padding:'0.4rem 0.85rem', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'3px', color:'rgba(160,155,145,0.7)', fontSize:'11px', cursor:'pointer', fontFamily:'monospace' };
const btnRed  = { padding:'0.4rem 0.85rem', background:'rgba(200,70,55,0.1)', border:'1px solid rgba(200,70,55,0.3)', borderRadius:'3px', color:'rgba(220,110,90,0.85)', fontSize:'11px', cursor:'pointer', fontFamily:'monospace' };

function Field({ label, value, onChange, type='text', placeholder='' }: { label:string; value:string|number; onChange:(v:any)=>void; type?:string; placeholder?:string }) {
  return (
    <div>
      <label style={lbl}>{label}</label>
      <input style={inp} type={type} value={value ?? ''} placeholder={placeholder}
        onChange={e => onChange(type==='number' ? Number(e.target.value) : e.target.value)} />
    </div>
  );
}

function LoginScreen({ onLogin }: { onLogin:(t:string)=>void }) {
  const [email,setEmail]=useState(''); const [pw,setPw]=useState(''); const [err,setErr]=useState(''); const [loading,setLoading]=useState(false);
  const submit = async () => {
    setLoading(true); setErr('');
    try {
      const r = await fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'include',body:JSON.stringify({email,password:pw})});
      const d = await r.json();
      if(!r.ok) throw new Error(d.error);
      onLogin(d.token);
    } catch(e:any){setErr(e.message);} finally{setLoading(false);}
  };
  return (
    <div style={{minHeight:'100vh',background:'#09080d',display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem'}}>
      <div style={{width:'min(380px,95vw)',background:'rgba(14,13,18,0.98)',border:'1px solid rgba(255,255,255,0.07)',borderTop:'2px solid rgba(180,155,90,0.5)',borderRadius:'4px',padding:'2rem'}}>
        <p style={{fontFamily:'monospace',fontSize:'9px',letterSpacing:'0.18em',textTransform:'uppercase',color:'rgba(180,155,90,0.5)',marginBottom:'0.4rem'}}>Panel de administración</p>
        <h1 style={{fontFamily:"'EB Garamond',serif",fontSize:'1.5rem',fontWeight:400,color:'rgba(235,228,215,0.95)',marginBottom:'1.5rem'}}>Andrew Myer</h1>
        <label style={lbl}>Email</label>
        <input style={{...inp,marginBottom:'0.75rem'}} type="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <label style={lbl}>Contraseña</label>
        <input style={{...inp,marginBottom:'1.1rem'}} type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submit()} />
        {err && <p style={{color:'rgba(220,110,90,0.9)',fontSize:'0.8rem',marginBottom:'0.75rem'}}>{err}</p>}
        <button style={{...btnGold,width:'100%',display:'block'}} onClick={submit} disabled={loading}>{loading?'Autenticando…':'Ingresar'}</button>
      </div>
    </div>
  );
}

function PriceManager({ book, token, onChange }:{book:Book;token:string;onChange:()=>void}) {
  const [cur,setCur]=useState('CLP'); const [amt,setAmt]=useState(''); const [saving,setSaving]=useState(false);
  const save = async () => {
    if(!amt)return; setSaving(true);
    await fetch('/api/books/prices',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`},body:JSON.stringify({book_id:book.id,currency:cur,amount:Number(amt),is_active:true})});
    setSaving(false); setAmt(''); onChange();
  };
  const del = async (currency:string) => {
    await fetch('/api/books/prices',{method:'DELETE',headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`},body:JSON.stringify({book_id:book.id,currency})});
    onChange();
  };
  return (
    <div style={{padding:'0.75rem',background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.05)',borderRadius:'3px',marginTop:'0.75rem'}}>
      <p style={{...lbl,marginBottom:'0.5rem'}}>Precios</p>
      <div style={{display:'flex',flexWrap:'wrap',gap:'0.35rem',marginBottom:'0.65rem'}}>
        {(book.prices??[]).map(p=>(
          <span key={p.currency} style={{display:'inline-flex',alignItems:'center',gap:'4px',padding:'2px 8px',background:'rgba(180,155,90,0.1)',border:'1px solid rgba(180,155,90,0.2)',borderRadius:'2px',fontFamily:'monospace',fontSize:'11px',color:'rgba(205,178,90,0.9)'}}>
            {p.currency} {Number(p.amount).toLocaleString()}
            <button onClick={()=>del(p.currency)} style={{background:'none',border:'none',color:'rgba(200,100,80,0.7)',cursor:'pointer',fontSize:'12px',padding:'0',lineHeight:1}}>×</button>
          </span>
        ))}
        {(!book.prices||book.prices.length===0)&&<span style={{fontFamily:'monospace',fontSize:'11px',color:'rgba(140,135,125,0.5)'}}>Sin precios</span>}
      </div>
      <div style={{display:'flex',gap:'0.5rem',alignItems:'flex-end'}}>
        <div style={{flex:'0 0 90px'}}>
          <label style={lbl}>Moneda</label>
          <select value={cur} onChange={e=>setCur(e.target.value)} style={{...inp,padding:'0.5rem'}}>
            {CURRENCIES.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div style={{flex:1}}>
          <label style={lbl}>Precio</label>
          <input style={inp} type="number" value={amt} placeholder="9990" onChange={e=>setAmt(e.target.value)} />
        </div>
        <button style={btnGold} onClick={save} disabled={saving||!amt}>{saving?'…':'+ Agregar'}</button>
      </div>
    </div>
  );
}

function BookForm({ book, token, onSave, onCancel }:{book?:Book;token:string;onSave:(b:Book)=>void;onCancel:()=>void}) {
  const blank = {slug:'',title_es:'',title_en:'',subtitle_es:'',subtitle_en:'',description_es:'',description_en:'',cover_url:'',pdf_url:'',isbn:'',year:new Date().getFullYear(),is_published:false,sort_order:0};
  const [form,setForm]=useState({...blank,...(book??{})});
  const [saving,setSaving]=useState(false); const [err,setErr]=useState('');
  const set=(k:string,v:unknown)=>setForm(f=>({...f,[k]:v}));
  const save = async () => {
    if(!form.slug||!form.title_es){setErr('Slug y título ES son requeridos');return;}
    setSaving(true); setErr('');
    try {
      const r = await fetch(`/api/books${book?`/${book.id}`:''}`,{method:book?'PUT':'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`},body:JSON.stringify(form)});
      const d = await r.json();
      if(!r.ok) throw new Error(d.error);
      onSave(d.book);
    } catch(e:any){setErr(e.message);} finally{setSaving(false);}
  };
  const card = {background:'rgba(14,13,18,0.9)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'4px',padding:'1.25rem',marginBottom:'1rem'};
  const g2 = {display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem',marginBottom:'0.75rem'};
  return (
    <div style={card}>
      <p style={{fontFamily:'monospace',fontSize:'11px',color:'rgba(180,155,90,0.7)',marginBottom:'1rem',fontWeight:500}}>{book?`Editando: ${book.title_es}`:'Nuevo libro'}</p>
      <div style={g2}>
        <Field label="Slug (único) *" value={form.slug} onChange={v=>set('slug',v)} placeholder="entre-dos-mundos-vol1"/>
        <Field label="ISBN" value={form.isbn??''} onChange={v=>set('isbn',v)}/>
      </div>
      <div style={g2}>
        <Field label="Título ES *" value={form.title_es} onChange={v=>set('title_es',v)}/>
        <Field label="Título EN" value={form.title_en} onChange={v=>set('title_en',v)}/>
      </div>
      <div style={g2}>
        <Field label="Subtítulo ES" value={form.subtitle_es??''} onChange={v=>set('subtitle_es',v)}/>
        <Field label="Subtítulo EN" value={form.subtitle_en??''} onChange={v=>set('subtitle_en',v)}/>
      </div>
      <div style={{marginBottom:'0.75rem'}}>
        <label style={lbl}>Descripción ES</label>
        <textarea style={{...inp,minHeight:'70px',resize:'vertical'}} value={form.description_es} onChange={e=>set('description_es',e.target.value)}/>
      </div>
      <div style={{marginBottom:'0.75rem'}}>
        <label style={lbl}>Descripción EN</label>
        <textarea style={{...inp,minHeight:'70px',resize:'vertical'}} value={form.description_en} onChange={e=>set('description_en',e.target.value)}/>
      </div>
      <div style={g2}>
        <Field label="URL Portada" value={form.cover_url??''} onChange={v=>set('cover_url',v)} placeholder="https://..."/>
        <Field label="URL PDF" value={form.pdf_url??''} onChange={v=>set('pdf_url',v)} placeholder="https://..."/>
      </div>
      <div style={{...g2,marginBottom:'1rem'}}>
        <Field label="Año" value={form.year??''} onChange={v=>set('year',v)} type="number"/>
        <Field label="Orden" value={form.sort_order??0} onChange={v=>set('sort_order',v)} type="number"/>
      </div>
      <label style={{display:'flex',alignItems:'center',gap:'8px',cursor:'pointer',marginBottom:'1rem',fontSize:'0.875rem',color:'rgba(200,195,185,0.8)'}}>
        <input type="checkbox" checked={form.is_published} onChange={e=>set('is_published',e.target.checked)}/>
        Publicado (visible en la tienda y en el sitio)
      </label>
      {err&&<p style={{color:'rgba(220,110,90,0.9)',fontSize:'0.82rem',marginBottom:'0.75rem'}}>{err}</p>}
      <div style={{display:'flex',gap:'0.5rem'}}>
        <button style={btnGold} onClick={save} disabled={saving}>{saving?'Guardando…':book?'Guardar cambios':'Crear libro'}</button>
        <button style={btnGray} onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
}

export default function Admin() {
  const [token,setToken]=useState(()=>localStorage.getItem('am_admin_token')??'');
  const [tab,setTab]=useState<'books'|'sales'>('books');
  const [books,setBooks]=useState<Book[]>([]);
  const [sales,setSales]=useState<Sale[]>([]);
  const [editing,setEditing]=useState<Book|null|'new'>(null);
  const [loading,setLoading]=useState(false);
  const [msg,setMsg]=useState('');

  const loadBooks = useCallback(async()=>{
    setLoading(true);
    const r=await fetch('/api/books?published=false',{headers:{Authorization:`Bearer ${token}`}});
    const d=await r.json(); setBooks(d.books??[]); setLoading(false);
  },[token]);

  const loadSales = useCallback(async()=>{
    const r=await fetch('/api/admin/sales',{headers:{Authorization:`Bearer ${token}`}});
    const d=await r.json(); setSales(d.sales??[]);
  },[token]);

  useEffect(()=>{if(token){loadBooks();if(tab==='sales')loadSales();}},[token,tab,loadBooks,loadSales]);

  const handleLogin=(t:string)=>{setToken(t);localStorage.setItem('am_admin_token',t);};
  const handleLogout=()=>{setToken('');localStorage.removeItem('am_admin_token');fetch('/api/admin/logout',{method:'POST',credentials:'include'});};

  const deleteBook=async(id:string,title:string)=>{
    if(!confirm(`¿Eliminar "${title}"?`))return;
    await fetch(`/api/books/${id}`,{method:'DELETE',headers:{Authorization:`Bearer ${token}`}});
    setMsg('Libro eliminado'); loadBooks();
  };

  const togglePublish=async(book:Book)=>{
    await fetch(`/api/books/${book.id}`,{method:'PUT',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify({...book,is_published:!book.is_published})});
    loadBooks();
  };

  if(!token) return <LoginScreen onLogin={handleLogin}/>;

  const page={minHeight:'100vh',background:'#09080d',color:'rgba(220,215,205,0.9)',fontFamily:"'Inter',sans-serif"};
  const nav={display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0.85rem 2rem',borderBottom:'1px solid rgba(255,255,255,0.06)',background:'rgba(6,5,10,0.98)',position:'sticky' as const,top:0,zIndex:100};
  const main={maxWidth:'1000px',margin:'0 auto',padding:'2rem 1.5rem'};
  const card={background:'rgba(14,13,18,0.9)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'4px',padding:'1.25rem',marginBottom:'1rem'};

  return (
    <div style={page}>
      <nav style={nav}>
        <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
          <span style={{fontFamily:"'EB Garamond',serif",fontSize:'1.15rem',color:'rgba(235,228,215,0.9)'}}>Andrew Myer</span>
          <span style={{fontFamily:'monospace',fontSize:'9px',letterSpacing:'0.15em',textTransform:'uppercase',color:'rgba(180,155,90,0.5)',padding:'2px 7px',border:'1px solid rgba(180,155,90,0.2)',borderRadius:'2px'}}>Admin</span>
        </div>
        <div style={{display:'flex',gap:'0.5rem',alignItems:'center'}}>
          <a href="/" style={{fontFamily:'monospace',fontSize:'10px',color:'rgba(140,135,125,0.6)',textDecoration:'none',marginRight:'0.5rem'}}>← Sitio</a>
          {(['books','sales'] as const).map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{padding:'0.35rem 0.85rem',background:tab===t?'rgba(180,155,90,0.14)':'transparent',border:`1px solid ${tab===t?'rgba(180,155,90,0.4)':'rgba(255,255,255,0.07)'}`,borderRadius:'3px',color:tab===t?'rgba(195,170,80,0.95)':'rgba(155,150,140,0.6)',fontSize:'11px',letterSpacing:'0.08em',fontFamily:'monospace',textTransform:'uppercase',cursor:'pointer'}}>
              {t==='books'?'Libros':'Ventas'}
            </button>
          ))}
          <button onClick={handleLogout} style={btnGray}>Salir</button>
        </div>
      </nav>

      <main style={main}>
        {msg&&(
          <div style={{padding:'0.6rem 1rem',background:'rgba(60,160,80,0.12)',border:'1px solid rgba(60,160,80,0.25)',borderRadius:'3px',marginBottom:'1rem',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <span style={{fontSize:'0.85rem',color:'rgba(100,210,130,0.9)'}}>{msg}</span>
            <button onClick={()=>setMsg('')} style={{background:'none',border:'none',color:'rgba(100,210,130,0.7)',cursor:'pointer',fontSize:'16px'}}>×</button>
          </div>
        )}

        {tab==='books'&&(
          <>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1.5rem'}}>
              <h2 style={{fontFamily:"'EB Garamond',serif",fontSize:'1.4rem',fontWeight:400,color:'rgba(235,228,215,0.95)',margin:0}}>Catálogo de libros</h2>
              <button style={btnGold} onClick={()=>setEditing('new')}>+ Nuevo libro</button>
            </div>
            {editing==='new'&&<BookForm token={token} onSave={()=>{setEditing(null);setMsg('Libro creado');loadBooks();}} onCancel={()=>setEditing(null)}/>}
            {loading&&<p style={{color:'rgba(160,155,145,0.5)',fontSize:'0.85rem'}}>Cargando…</p>}
            {books.map(book=>(
              <div key={book.id}>
                {editing&&typeof editing==='object'&&editing.id===book.id?(
                  <BookForm book={editing} token={token} onSave={()=>{setEditing(null);setMsg('Guardado');loadBooks();}} onCancel={()=>setEditing(null)}/>
                ):(
                  <div style={card}>
                    <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'1rem',marginBottom:'0.65rem'}}>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:'flex',alignItems:'center',gap:'0.5rem',flexWrap:'wrap',marginBottom:'0.2rem'}}>
                          <span style={{display:'inline-block',padding:'2px 7px',borderRadius:'2px',fontSize:'10px',fontFamily:'monospace',background:book.is_published?'rgba(60,160,80,0.15)':'rgba(180,155,90,0.1)',border:`1px solid ${book.is_published?'rgba(60,160,80,0.3)':'rgba(180,155,90,0.25)'}`,color:book.is_published?'rgba(100,210,130,0.9)':'rgba(180,155,90,0.75)'}}>
                            {book.is_published?'● Publicado':'○ Borrador'}
                          </span>
                          <span style={{fontFamily:'monospace',fontSize:'10px',color:'rgba(140,135,125,0.5)'}}>{book.slug}</span>
                        </div>
                        <p style={{fontSize:'0.9rem',fontWeight:500,color:'rgba(215,208,195,0.9)',margin:'0 0 2px'}}>{book.title_es}</p>
                        {book.title_en&&<p style={{fontFamily:'monospace',fontSize:'11px',color:'rgba(140,135,125,0.5)',margin:0}}>{book.title_en}</p>}
                      </div>
                      <div style={{display:'flex',gap:'0.35rem',flexShrink:0,flexWrap:'wrap'}}>
                        <button style={btnGold} onClick={()=>setEditing(book)}>Editar</button>
                        <button style={btnGray} onClick={()=>togglePublish(book)}>{book.is_published?'Ocultar':'Publicar'}</button>
                        <button style={btnRed} onClick={()=>deleteBook(book.id,book.title_es)}>Eliminar</button>
                      </div>
                    </div>
                    <PriceManager book={book} token={token} onChange={loadBooks}/>
                    <div style={{marginTop:'0.5rem',display:'flex',gap:'0.85rem',flexWrap:'wrap'}}>
                      <span style={{fontFamily:'monospace',fontSize:'10px',color:book.pdf_url?'rgba(100,210,130,0.7)':'rgba(200,100,80,0.6)'}}>{book.pdf_url?'✓ PDF':'✗ Sin PDF'}</span>
                      <span style={{fontFamily:'monospace',fontSize:'10px',color:book.cover_url?'rgba(100,210,130,0.7)':'rgba(200,100,80,0.6)'}}>{book.cover_url?'✓ Portada':'✗ Sin portada'}</span>
                      {book.isbn&&<span style={{fontFamily:'monospace',fontSize:'10px',color:'rgba(140,135,125,0.5)'}}>ISBN: {book.isbn}</span>}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {tab==='sales'&&(
          <>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1.5rem'}}>
              <h2 style={{fontFamily:"'EB Garamond',serif",fontSize:'1.4rem',fontWeight:400,color:'rgba(235,228,215,0.95)',margin:0}}>Ventas</h2>
              <button style={btnGray} onClick={loadSales}>↻ Actualizar</button>
            </div>
            {sales.length===0&&<p style={{color:'rgba(160,155,145,0.5)',fontSize:'0.85rem'}}>Sin ventas aún.</p>}
            <div style={{...card,padding:0,overflow:'hidden'}}>
              {sales.map((sale,i)=>(
                <div key={sale.id} style={{padding:'0.85rem 1.25rem',borderBottom:i<sales.length-1?'1px solid rgba(255,255,255,0.04)':'none',display:'flex',alignItems:'center',gap:'1rem',flexWrap:'wrap'}}>
                  <div style={{flex:1,minWidth:'180px'}}>
                    <p style={{fontSize:'0.875rem',color:'rgba(215,208,195,0.88)',margin:'0 0 2px'}}>{sale.title_es}</p>
                    <p style={{fontFamily:'monospace',fontSize:'11px',color:'rgba(140,135,125,0.55)',margin:0}}>{sale.buyer_email}{sale.buyer_name?` · ${sale.buyer_name}`:''}</p>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:'0.75rem',flexShrink:0}}>
                    <span style={{fontFamily:'monospace',fontSize:'12px',color:'rgba(210,185,100,0.9)'}}>{sale.currency} {Number(sale.amount).toLocaleString()}</span>
                    <span style={{display:'inline-block',padding:'2px 7px',borderRadius:'2px',fontSize:'10px',fontFamily:'monospace',background:sale.status==='APPROVED'?'rgba(60,160,80,0.14)':sale.status==='REJECTED'?'rgba(200,70,55,0.12)':'rgba(180,155,90,0.1)',border:`1px solid ${sale.status==='APPROVED'?'rgba(60,160,80,0.3)':sale.status==='REJECTED'?'rgba(200,70,55,0.25)':'rgba(180,155,90,0.2)'}`,color:sale.status==='APPROVED'?'rgba(100,210,130,0.9)':sale.status==='REJECTED'?'rgba(220,110,90,0.85)':'rgba(180,155,90,0.8)'}}>
                      {sale.status}
                    </span>
                    <span style={{fontFamily:'monospace',fontSize:'10px',color:'rgba(130,125,115,0.45)'}}>{new Date(sale.created_at).toLocaleDateString('es-CL')}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}