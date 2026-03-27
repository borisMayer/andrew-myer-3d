/**
 * Página temporal para crear el primer admin
 * Acceder a: andrewmyer.com/setup-admin
 * ELIMINAR después de crear el admin
 */
import { useState } from 'react';

export default function AdminSetup() {
  const [email,    setEmail]    = useState('admin@andrewmyer.com');
  const [password, setPassword] = useState('');
  const [setupKey, setSetupKey] = useState('');
  const [result,   setResult]   = useState('');
  const [loading,  setLoading]  = useState(false);

  const submit = async () => {
    setLoading(true); setResult('');
    try {
      const res = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-setup-key': setupKey,
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult('✅ Admin creado. Ahora ve a /admin para ingresar.');
      } else {
        setResult('❌ Error: ' + (data.error ?? JSON.stringify(data)));
      }
    } catch (e: any) {
      setResult('❌ ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const s = {
    page:  { minHeight:'100vh', background:'#09080d', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Inter',sans-serif" },
    box:   { width:'min(380px,95vw)', background:'rgba(14,13,18,0.98)', border:'1px solid rgba(255,255,255,0.07)', borderTop:'2px solid rgba(180,155,90,0.5)', borderRadius:'4px', padding:'2rem' },
    lbl:   { display:'block', fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase' as const, color:'rgba(160,155,145,0.5)', marginBottom:'0.3rem', fontFamily:'monospace' },
    inp:   { width:'100%', padding:'0.6rem 0.8rem', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'3px', color:'rgba(220,215,205,0.9)', fontSize:'0.875rem', outline:'none', boxSizing:'border-box' as const, marginBottom:'0.85rem' },
    btn:   { width:'100%', padding:'0.7rem', background:'rgba(180,155,90,0.15)', border:'1px solid rgba(180,155,90,0.45)', borderRadius:'3px', color:'rgba(205,178,90,0.95)', fontSize:'13px', cursor:'pointer', fontFamily:'monospace' },
  };

  return (
    <div style={s.page}>
      <div style={s.box}>
        <p style={{ fontFamily:'monospace', fontSize:'9px', letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(180,155,90,0.5)', marginBottom:'0.4rem' }}>
          Configuración inicial
        </p>
        <h1 style={{ fontFamily:"'EB Garamond',serif", fontSize:'1.4rem', fontWeight:400, color:'rgba(235,228,215,0.95)', marginBottom:'1.5rem' }}>
          Crear administrador
        </h1>

        <label style={s.lbl}>Setup Key (SETUP_KEY en Vercel)</label>
        <input style={s.inp} type="password" value={setupKey} onChange={e => setSetupKey(e.target.value)} placeholder="La clave que pusiste en Vercel" />

        <label style={s.lbl}>Email del admin</label>
        <input style={s.inp} type="email" value={email} onChange={e => setEmail(e.target.value)} />

        <label style={s.lbl}>Contraseña</label>
        <input style={s.inp} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 8 caracteres" />

        <button style={s.btn} onClick={submit} disabled={loading}>
          {loading ? 'Creando…' : 'Crear admin'}
        </button>

        {result && (
          <p style={{ marginTop:'1rem', fontSize:'0.875rem', color: result.startsWith('✅') ? 'rgba(100,210,130,0.9)' : 'rgba(220,110,90,0.9)', lineHeight:1.5 }}>
            {result}
          </p>
        )}

        {result.startsWith('✅') && (
          <a href="/admin" style={{ display:'block', marginTop:'0.75rem', padding:'0.6rem', background:'rgba(180,155,90,0.1)', border:'1px solid rgba(180,155,90,0.3)', borderRadius:'3px', color:'rgba(190,165,75,0.9)', textAlign:'center', textDecoration:'none', fontFamily:'monospace', fontSize:'12px' }}>
            → Ir al panel admin
          </a>
        )}
      </div>
    </div>
  );
}
