/**
 * LiveBook — Flipbook HTML/CSS elegante
 * Páginas completas reales con animación CSS 3D transform
 * Iluminación tipo manuscrito / vela dorada
 * Sin Three.js — máxima compatibilidad y rendimiento
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';

interface LiveBookProps {
  bookId:   string;
  coverSrc: string;
  title:    string;
  onClose:  () => void;
}

interface Page {
  num:     number;
  chapter: string;
  label:   string;
  text:    string | null; // null = special page (cover, dedicatoria, etc.)
  special?: 'cover' | 'dedicatoria' | 'prefacio-title' | 'parte' | 'fin';
  title?:  string;
  subtitle?: string;
}

const PAGES: Page[] = [
  // Cover
  { num: 0, chapter: '', label: 'Portada', text: null, special: 'cover' },

  // Dedicatoria
  { num: 1, chapter: 'Dedicatoria', label: 'Dedicatoria', text: null, special: 'dedicatoria',
    title: 'Dedicatoria',
    subtitle: 'A todos aquellos que, en su comprensión limitada, creyeron que mi camino estaba marcado por la desgracia y el castigo divino, les agradezco sinceramente. Fueron sus pensamientos e intenciones negativas los que, paradójicamente, atrajeron la benevolencia Divina hacia mí.\n\nEn medio de lo que parecía ser adversidad, recibí un regalo extraordinario: el conocimiento de la vida eterna y la exploración del mundo de los muertos.\n\n— Andrew Myer, Diciembre 2023',
  },

  // Prólogo p.1
  { num: 2, chapter: 'Prólogo', label: 'Prólogo', text: 'Hay un momento en que el cuerpo deja de obedecer. No es dramático, al menos no como uno imagina. No hay oscuridad repentina ni cortina que caiga. Es más parecido a cuando el sonido de una habitación llena se apaga de golpe: un instante todo está ahí, y al siguiente ya no queda nada que sostener.\n\nYo estaba en una cama de hospital. El médico me miraba a través del vidrio con los ojos de alguien que ya ha visto demasiadas veces este final. Sus labios se movían, pero lo que yo escuchaba era otra cosa: el silencio que viene antes.\n\nFirmé un papel. Con ese gesto, entregué lo que quedaba de mi voluntad. Y entonces cerré los ojos.' },

  // Prólogo p.2
  { num: 3, chapter: 'Prólogo', label: '', text: 'Lo que ocurrió después no tiene nombre en ningún idioma que conozca. No fue un sueño, no fue una alucinación, no fue el delirio de un cuerpo en colapso. Fue, con una claridad que todavía me asombra, la experiencia más real de toda mi vida.\n\nEste libro es el intento de contarla. No espero que lo crean. Solo pido que lo lean.' },

  // Prefacio title
  { num: 4, chapter: 'Prefacio', label: 'Prefacio', text: null, special: 'prefacio-title',
    title: 'Prefacio', subtitle: '' },

  // Prefacio p.1
  { num: 5, chapter: 'Prefacio', label: '', text: 'Durante mucho tiempo, mientras recuperaba el aliento que este mundo me había negado, consideré seriamente llevarme los secretos de mi travesía a la tumba. Lo que mis ojos vieron tras el velo —las jerarquías que gobiernan las sombras, la luz extraordinaria que emana del trono de Adonay, la naturaleza real de lo que habita las dimensiones invisibles de nuestra realidad— me parecía demasiado vasto para el lenguaje humano. Y también demasiado pesado para ponerlo en manos de quienes no habían estado allí.' },

  // Prefacio p.2
  { num: 6, chapter: 'Prefacio', label: '', text: 'Sin embargo, el silencio se volvió una carga insoportable ante una verdad que no pude seguir ignorando: estas experiencias no me fueron concedidas para mi beneficio personal, sino para servir como testimonio vivo de la realidad espiritual que nos rodea.\n\nRetener un testimonio cuando se te ha ordenado darlo no es discreción. Es desobediencia.\n\nAsí nació Entre Dos Mundos: no de mi deseo de contar, sino de la obediencia a un llamado que no admitía negociación.' },

  // Parte I
  { num: 7, chapter: 'Parte I', label: 'Parte I', text: null, special: 'parte',
    title: 'Parte I', subtitle: 'Las Raíces\n\nAntes de que el cuerpo cayera, hubo una vida entera que lo preparó para caer y levantarse.' },

  // Cap 2
  { num: 8, chapter: 'Capítulo 2 · Orígenes', label: 'Cap. 2', text: 'La historia de mi alma no comienza en aquella cama de hospital, sino en la valentía indomable de dos jóvenes que decidieron desafiar al mundo armados solo con su amor y un par de maletas.\n\nMis padres, aún sin alcanzar la mayoría de edad, abandonaron todo lo conocido para construir una vida en un territorio que les era completamente ajeno. Sin red de seguridad, sin recursos, sin guía. Solo la certeza compartida de que tenían que ir.' },

  // Cap 2 p.2
  { num: 9, chapter: 'Capítulo 2 · Orígenes', label: '', text: 'Yo nací después. Y crecí sin saber que existía una promesa tejida antes de mi llegada. Una promesa que no hablaba de mis logros ni de mis elecciones, sino de un propósito que me antecedía completamente y que no dependía de mí sino de Quien me había enviado.\n\nUna promesa que explicaba, mucho años después, por qué nada de lo que intentó destruirme pudo hacerlo.' },

  // Cap 3
  { num: 10, chapter: 'Capítulo 3 · El Niño del Jardín', label: 'Cap. 3', text: 'Era como un hambre profunda que ardía en mi interior y que se intensificaba con el paso de los años, como las olas que crecen con la marea, buscando algo que todavía no tenía nombre pero cuya ausencia era perfectamente reconocible.\n\nLa Presencia de Adonay creó en mí desde temprano algo extraño: una capacidad de percibir lo que otros no percibían, de leer en el silencio de las personas y los lugares lo que ellos mismos no podían articular.' },

  // Cap 5
  { num: 11, chapter: 'Capítulo 5 · La Hora más Oscura', label: 'Cap. 5', text: 'Mis seres queridos habían sido testigos silenciosos de las revelaciones que compartí con ellos a lo largo de los años. La pandemia no fue la excepción.\n\nCon una década de anticipación, el Espíritu de Adonay me había susurrado que vendría una plaga. Lo que no imaginé fue que yo sería uno de sus blancos más devastados.\n\nEl cuerpo cedió con una velocidad que los médicos describieron como incomprensible. En días, pasé de la vida ordinaria a la unidad de cuidados intensivos.' },

  // Cap 5 p.2
  { num: 12, chapter: 'Capítulo 5 · La Hora más Oscura', label: '', text: 'Lo que ocurrió después de ese instante es lo que este libro ha estado preparando desde la primera página. Lo que mi cuerpo vivió en los meses siguientes, los médicos podrán contarlo con sus términos y sus números. Lo que mi alma vivió mientras ese cuerpo permanecía inmóvil, conectado a una máquina que respiraba por mí, es la razón por la que existo todavía.' },

  // Parte II
  { num: 13, chapter: 'Parte II', label: 'Parte II', text: null, special: 'parte',
    title: 'Parte II', subtitle: 'El Otro Lado del Velo\n\n«Lo que el mundo llama muerte,\nyo lo llamé despertar.»' },

  // Cap 7
  { num: 14, chapter: 'Capítulo 7 · La Arquitectura del Mal', label: 'Cap. 7', text: 'El primer don que se activó en ese plano fue la percepción. No la percepción ordinaria de los cinco sentidos, sino algo cualitativamente diferente: una facultad de lectura total de la realidad.\n\nDesde ese estado podía ver simultáneamente el plano físico y el espiritual. No era un sueño donde el cuerpo duerme y la mente vaga. Era presencia real en dos planos simultáneos, con plena conciencia en ambos.' },

  // Cap 7 p.2 — final page
  { num: 15, chapter: 'Capítulo 7 · La Arquitectura del Mal', label: '', text: 'El tiempo funciona de manera análoga: desde el plano físico, cada ser humano solo puede ver el fragmento temporal donde existe, su presente inmediato. Desde el plano espiritual donde me encontraba, la totalidad del tiempo era visible, navegable, habitable.\n\nEsto no era un privilegio recreativo. Era un instrumento de combate. Para pelear contra un enemigo que opera fuera del tiempo, hay que poder verlo fuera del tiempo.' },
];

// ─── Single Page component ─────────────────────────────────────────────────
function PageView({ page, coverSrc }: { page: Page; coverSrc: string }) {
  const firstChar = page.text ? page.text.replace(/^[«"¿¡]/, '').charAt(0) : '';
  const restText  = page.text ? page.text.replace(/^[«"¿¡]?/, '').slice(firstChar ? 1 : 0) : '';

  const pageStyle: React.CSSProperties = {
    width: '100%', height: '100%',
    display: 'flex', flexDirection: 'column',
    padding: '3.5rem 3rem 2.5rem',
    background: '#f7f2e8',
    position: 'relative',
    boxSizing: 'border-box',
    overflow: 'hidden',
  };

  // COVER
  if (page.special === 'cover') {
    return (
      <div style={{ ...pageStyle, padding: 0, background: '#050408' }}>
        <img src={coverSrc} alt="Portada"
          style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
        {/* Subtle vignette */}
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)', pointerEvents:'none' }} />
      </div>
    );
  }

  // DEDICATORIA
  if (page.special === 'dedicatoria') {
    return (
      <div style={{ ...pageStyle, justifyContent:'center', alignItems:'center', textAlign:'center' }}>
        <PageDecor />
        <p style={{ fontFamily:"'EB Garamond', Georgia, serif", fontSize:'0.7rem', letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(140,120,80,0.6)', marginBottom:'2.5rem' }}>
          {page.chapter}
        </p>
        {page.subtitle?.split('\n\n').map((para, i) => (
          <p key={i} style={{
            fontFamily: i < page.subtitle!.split('\n\n').length - 1
              ? "'EB Garamond', Georgia, serif" : "'EB Garamond', Georgia, serif",
            fontSize: i === 0 ? '1.05rem' : '0.82rem',
            fontStyle: i === 0 ? 'italic' : 'normal',
            color: i === page.subtitle!.split('\n\n').length - 1
              ? 'rgba(140,120,80,0.55)' : 'rgba(50,40,30,0.82)',
            lineHeight: 1.85, marginBottom: '1rem', maxWidth: '420px',
            letterSpacing: '0.01em',
          }}>
            {para}
          </p>
        ))}
        <PageNum num={page.num} />
      </div>
    );
  }

  // PREFACIO TITLE or PARTE
  if (page.special === 'prefacio-title' || page.special === 'parte') {
    return (
      <div style={{ ...pageStyle, justifyContent:'center', alignItems:'flex-start' }}>
        <PageDecor />
        <div style={{ flex: 1, display:'flex', flexDirection:'column', justifyContent:'center', paddingLeft:'2rem' }}>
          <div style={{ width:'40px', height:'1px', background:'rgba(140,120,60,0.4)', marginBottom:'2rem' }} />
          <h2 style={{ fontFamily:"'EB Garamond', Georgia, serif", fontSize:'clamp(1.8rem,4vw,2.8rem)', fontWeight:400, color:'rgba(40,30,20,0.88)', lineHeight:1.1, marginBottom:'1.5rem', letterSpacing:'-0.01em' }}>
            {page.title}
          </h2>
          {page.subtitle && page.subtitle.split('\n\n').map((s, i) => (
            <p key={i} style={{ fontFamily:"'EB Garamond', Georgia, serif", fontSize:'1rem', fontStyle:'italic', color:'rgba(80,65,45,0.65)', lineHeight:1.75, marginBottom:'0.75rem', maxWidth:'380px' }}>
              {s}
            </p>
          ))}
        </div>
        <PageNum num={page.num} />
      </div>
    );
  }

  // FIN
  if (page.special === 'fin') {
    return (
      <div style={{ ...pageStyle, justifyContent:'center', alignItems:'center', textAlign:'center' }}>
        <PageDecor />
        <p style={{ fontFamily:"'EB Garamond', Georgia, serif", fontSize:'1.2rem', fontStyle:'italic', color:'rgba(140,120,80,0.7)' }}>Fin del extracto</p>
        <div style={{ width:'40px', height:'1px', background:'rgba(140,120,60,0.3)', margin:'1rem auto' }} />
        <p style={{ fontFamily:"'EB Garamond', Georgia, serif", fontSize:'0.85rem', color:'rgba(100,85,60,0.5)' }}>Andrew Myer</p>
      </div>
    );
  }

  // NORMAL TEXT PAGE
  return (
    <div style={pageStyle}>
      <PageDecor />

      {/* Chapter header */}
      {page.chapter && (
        <p style={{ fontFamily:"'EB Garamond', Georgia, serif", fontSize:'0.65rem', letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(140,120,80,0.55)', marginBottom:'2rem', fontStyle:'italic' }}>
          {page.chapter}
        </p>
      )}

      {/* Text with drop cap */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'flex-start' }}>
        <div style={{ position:'relative' }}>
          {/* Drop cap */}
          <span style={{
            float:'left', fontFamily:"'EB Garamond', Georgia, serif",
            fontSize:'clamp(3.5rem,7vw,5.5rem)', lineHeight:0.8,
            color:'rgba(140,115,55,0.35)', marginRight:'0.06em',
            marginTop:'0.12em', fontWeight:400,
          }}>
            {firstChar}
          </span>
          {/* Text */}
          <p style={{
            fontFamily:"'EB Garamond', Georgia, serif",
            fontSize:'clamp(0.95rem,1.6vw,1.08rem)',
            lineHeight:1.9, color:'rgba(38,30,20,0.88)',
            margin:0, textAlign:'justify', letterSpacing:'0.01em',
          }}>
            {restText.split('\n\n').map((para, i) => (
              <span key={i}>
                {i > 0 && <><br/><br/></>}
                {para}
              </span>
            ))}
          </p>
        </div>
      </div>

      {/* Page number */}
      <PageNum num={page.num} />
    </div>
  );
}

function PageDecor() {
  return (
    <>
      {/* Top border rule */}
      <div style={{ position:'absolute', top:'1.5rem', left:'2.5rem', right:'2.5rem', height:'1px', background:'linear-gradient(to right, transparent, rgba(140,115,55,0.25), transparent)' }} />
      {/* Bottom border rule */}
      <div style={{ position:'absolute', bottom:'2.5rem', left:'2.5rem', right:'2.5rem', height:'1px', background:'linear-gradient(to right, transparent, rgba(140,115,55,0.2), transparent)' }} />
      {/* Corner marks */}
      {[[{top:'1rem',left:'1rem'},{borderTop:'1px solid rgba(140,115,55,0.2)',borderLeft:'1px solid rgba(140,115,55,0.2)'}],
        [{top:'1rem',right:'1rem'},{borderTop:'1px solid rgba(140,115,55,0.2)',borderRight:'1px solid rgba(140,115,55,0.2)'}]].map(([pos,bord],i) => (
        <div key={i} style={{ position:'absolute', width:'16px', height:'16px', ...pos as React.CSSProperties, ...bord as React.CSSProperties }} />
      ))}
    </>
  );
}

function PageNum({ num }: { num: number }) {
  if (num === 0) return null;
  return (
    <div style={{ position:'absolute', bottom:'1.1rem', left:0, right:0, textAlign:'center' }}>
      <span style={{ fontFamily:"'EB Garamond', Georgia, serif", fontSize:'0.75rem', color:'rgba(140,115,55,0.4)', letterSpacing:'0.1em' }}>
        {num}
      </span>
    </div>
  );
}

// ─── Main flipbook ──────────────────────────────────────────────────────────
export default function LiveBook({ bookId, coverSrc, title, onClose }: LiveBookProps) {
  const [current,    setCurrent]    = useState(0);
  const [flipping,   setFlipping]   = useState(false);
  const [flipDir,    setFlipDir]    = useState<'next'|'prev'>('next');
  const [showBack,   setShowBack]   = useState(false);
  const flipRef   = useRef<HTMLDivElement>(null);
  const wrapRef   = useRef<HTMLDivElement>(null);
  const total = PAGES.length - 1;

  // Entrance animation + hide site nav while book is open
  useEffect(() => {
    if (wrapRef.current) {
      gsap.fromTo(wrapRef.current,
        { opacity:0, scale:0.97 },
        { opacity:1, scale:1, duration:0.5, ease:'power3.out' });
    }
    const navEl = document.querySelector('nav') as HTMLElement | null;
    if (navEl) navEl.style.visibility = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      if (navEl) navEl.style.visibility = 'visible';
      document.body.style.overflow = '';
    };
  }, []);

  const goTo = useCallback((dir: 'next'|'prev') => {
    if (flipping) return;
    const next = dir === 'next' ? current + 1 : current - 1;
    if (next < 0 || next > total) return;

    setFlipDir(dir);
    setFlipping(true);
    setShowBack(false);

    // Flip animation
    const el = flipRef.current;
    if (!el) return;

    // Phase 1: fold out (0 → -90deg for next, 0 → 90deg for prev)
    const startAngle = 0;
    const midAngle   = dir === 'next' ? -90 : 90;
    const endAngle   = dir === 'next' ? -180 : 180;

    gsap.fromTo(el,
      { rotateY: startAngle, zIndex: 10 },
      {
        rotateY: midAngle,
        duration: 0.28,
        ease: 'power2.in',
        onComplete: () => {
          setCurrent(next);
          setShowBack(true);
          gsap.fromTo(el,
            { rotateY: dir === 'next' ? 90 : -90 },
            { rotateY: 0, duration: 0.28, ease: 'power2.out',
              onComplete: () => { setFlipping(false); setShowBack(false); } });
        }
      }
    );
  }, [current, flipping, total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goTo('next');
      if (e.key === 'ArrowLeft')  goTo('prev');
      if (e.key === 'Escape')     onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goTo, onClose]);

  const currentPage = PAGES[current];
  const isCover = currentPage.special === 'cover';

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:9999,
      background:'#0e0b05',
      display:'flex', flexDirection:'column',
      fontFamily:"'EB Garamond', Georgia, serif",
    }}>

      {/* close portal rendered separately below */}

      {/* ── Top bar ──────────────────────────────────────── */}
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'0.8rem 2rem', flexShrink:0,
        borderBottom:'1px solid rgba(255,255,255,0.05)',
        background:'rgba(14,11,5,0.98)',
        position:'relative', zIndex:500,
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.9rem' }}>
          <span style={{ fontFamily:"'Inter', sans-serif", fontSize:'8px', letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(180,155,90,0.45)' }}>
            Libro Vivo
          </span>
          <span style={{ width:'1px', height:'12px', background:'rgba(255,255,255,0.1)', display:'inline-block' }} />
          <span style={{ fontFamily:"'EB Garamond', Georgia, serif", fontSize:'0.92rem', fontStyle:'italic', color:'rgba(220,210,190,0.75)' }}>
            {title}
          </span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
          <span style={{ fontFamily:"'Inter', sans-serif", fontSize:'9px', letterSpacing:'0.1em', color:'rgba(150,140,115,0.4)' }}>
            {isCover ? 'Portada' : `${current} / ${total}`}
          </span>
          <button onClick={onClose} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(150,145,135,0.5)', borderRadius:'2px', width:'30px', height:'30px', cursor:'pointer', fontSize:'12px', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color='rgba(220,210,190,0.9)'; }}
            onMouseLeave={e => { e.currentTarget.style.color='rgba(150,145,135,0.5)'; }}>✕</button>
        </div>
      </div>

      {/* ── Main area ────────────────────────────────────── */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem 1rem', overflow:'hidden', position:'relative' }}>

        {/* Ambient glow behind book */}
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 50% 55%, rgba(180,140,50,0.06) 0%, transparent 65%)', pointerEvents:'none' }} />

        {/* Book container */}
        <div ref={wrapRef} style={{
          position:'relative',
          width:'min(520px, 90vw)',
          height:'min(720px, 85vh)',
          perspective:'1200px',
        }}>
          {/* Shadow under book */}
          <div style={{ position:'absolute', bottom:'-20px', left:'5%', right:'5%', height:'40px', background:'radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, transparent 70%)', filter:'blur(8px)' }} />

          {/* Book itself */}
          <div style={{
            width:'100%', height:'100%',
            position:'relative',
            boxShadow:'10px 10px 40px rgba(0,0,0,0.7), -2px 2px 12px rgba(0,0,0,0.4), inset -3px 0 6px rgba(0,0,0,0.3)',
            borderRadius:'1px 3px 3px 1px',
          }}>
            {/* Spine */}
            <div style={{
              position:'absolute', left:0, top:0, bottom:0, width:'10px',
              background:'linear-gradient(to right, #1a1510, #2a2018)',
              borderRadius:'2px 0 0 2px',
              zIndex:5,
            }} />

            {/* Page stack effect */}
            {[4,3,2,1].map(i => (
              <div key={i} style={{
                position:'absolute', inset:0, marginLeft:'10px',
                background:'#f0ead8', borderRadius:'0 2px 2px 0',
                transform:`translateX(${i * 0.6}px)`,
                boxShadow:'1px 0 2px rgba(0,0,0,0.15)',
              }} />
            ))}

            {/* Current page — flipping element */}
            <div
              ref={flipRef}
              style={{
                position:'absolute', inset:0, marginLeft:'10px',
                transformOrigin:'left center',
                transformStyle:'preserve-3d',
                zIndex:10,
                borderRadius:'0 2px 2px 0',
                overflow:'hidden',
              }}
            >
              <PageView page={currentPage} coverSrc={coverSrc} />
            </div>

            {/* Gold top/bottom edges */}
            {[{top:0},{bottom:0}].map((pos,i) => (
              <div key={i} style={{ position:'absolute', left:'10px', right:0, height:'2px', ...pos, background:'linear-gradient(to right, #9a7830, #c9a227, #b89040)', opacity:0.6, zIndex:6 }} />
            ))}
          </div>

          {/* Prev arrow */}
          <button onClick={() => goTo('prev')} disabled={current === 0 || flipping}
            style={{
              position:'absolute', left:'-50px', top:'50%', transform:'translateY(-50%)',
              background:'rgba(20,16,8,0.85)', border:'1px solid rgba(180,155,90,0.2)',
              color: current === 0 ? 'rgba(255,255,255,0.1)' : 'rgba(180,155,90,0.65)',
              borderRadius:'2px', width:'36px', height:'52px',
              cursor: current === 0 ? 'default' : 'pointer',
              fontSize:'20px', display:'flex', alignItems:'center', justifyContent:'center',
              transition:'all 0.2s', backdropFilter:'blur(4px)',
            }}
            onMouseEnter={e => { if (current > 0) { e.currentTarget.style.borderColor='rgba(180,155,90,0.5)'; e.currentTarget.style.color='rgba(200,170,80,0.9)'; }}}
            onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(180,155,90,0.2)'; e.currentTarget.style.color=current===0?'rgba(255,255,255,0.1)':'rgba(180,155,90,0.65)'; }}>
            ‹
          </button>

          {/* Next arrow */}
          <button onClick={() => goTo('next')} disabled={current >= total || flipping}
            style={{
              position:'absolute', right:'-50px', top:'50%', transform:'translateY(-50%)',
              background:'rgba(20,16,8,0.85)', border:'1px solid rgba(180,155,90,0.2)',
              color: current >= total ? 'rgba(255,255,255,0.1)' : 'rgba(180,155,90,0.65)',
              borderRadius:'2px', width:'36px', height:'52px',
              cursor: current >= total ? 'default' : 'pointer',
              fontSize:'20px', display:'flex', alignItems:'center', justifyContent:'center',
              transition:'all 0.2s', backdropFilter:'blur(4px)',
            }}
            onMouseEnter={e => { if (current < total) { e.currentTarget.style.borderColor='rgba(180,155,90,0.5)'; e.currentTarget.style.color='rgba(200,170,80,0.9)'; }}}
            onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(180,155,90,0.2)'; e.currentTarget.style.color=current>=total?'rgba(255,255,255,0.1)':'rgba(180,155,90,0.65)'; }}>
            ›
          </button>
        </div>
      </div>

      {/* ── Table of contents sidebar (collapsible) ──────── */}
      <TocSidebar current={current} onGo={(i) => { if (!flipping) { setCurrent(i); } }} pages={PAGES} />

      {/* ── Bottom bar ──────────────────────────────────── */}
      <div style={{ flexShrink:0, padding:'0.6rem 2rem', borderTop:'1px solid rgba(255,255,255,0.04)', background:'rgba(14,11,5,0.98)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem' }}>
        {/* Progress */}
        <div style={{ flex:1, height:'1px', background:'rgba(255,255,255,0.06)', borderRadius:'1px', overflow:'hidden', maxWidth:'400px' }}>
          <div style={{ height:'100%', background:'linear-gradient(to right, rgba(180,155,90,0.5), rgba(200,175,80,0.3))', transition:'width 0.4s ease', width:`${(current/total)*100}%` }} />
        </div>
        {/* Chapter label */}
        <p style={{ fontFamily:"'EB Garamond', Georgia, serif", fontStyle:'italic', fontSize:'0.8rem', color:'rgba(160,145,110,0.45)', flexShrink:0 }}>
          {currentPage.chapter || 'Entre Dos Mundos, Vol. I'}
        </p>
        {/* Keyboard hint */}
        <p style={{ fontFamily:"'Inter', sans-serif", fontSize:'7.5px', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(120,115,100,0.3)', flexShrink:0, display:'none' }} className="kb-hint">
          ← → para navegar
        </p>
      </div>

      <style>{`
        @media (min-width: 640px) { .kb-hint { display: block !important; } }
        @media (max-width: 600px) { button[style*="-50px"] { display: none !important; } }
      `}</style>

      {/* Portal close button — bypasses ALL stacking contexts */}
      {createPortal(
        <button
          onClick={onClose}
          style={{
            position: 'fixed',
            top: '8px',
            right: '8px',
            zIndex: 2147483647,
            width: '44px',
            height: '44px',
            background: 'rgba(10,8,4,0.96)',
            border: '1px solid rgba(180,155,90,0.5)',
            borderRadius: '3px',
            color: 'rgba(210,190,130,0.9)',
            fontSize: '18px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'system-ui, sans-serif',
            lineHeight: 1,
            boxShadow: '0 2px 12px rgba(0,0,0,0.6)',
          }}
          title="Cerrar (ESC)"
          aria-label="Cerrar libro"
        >
          ✕
        </button>,
        document.body
      )}
    </div>
  );
}

// ─── Table of Contents sidebar ─────────────────────────────────────────────
function TocSidebar({ current, onGo, pages }: { current: number; onGo: (i:number)=>void; pages: Page[] }) {
  const [open, setOpen] = useState(false);

  const chapters = pages.filter(p => p.label);

  return (
    <>
      {/* Toggle button */}
      <button onClick={() => setOpen(!open)}
        style={{ position:'fixed', left:'1rem', bottom:'3.5rem', background:'rgba(20,16,8,0.9)', border:'1px solid rgba(180,155,90,0.2)', color:'rgba(180,155,90,0.55)', borderRadius:'2px', padding:'0.45rem 0.8rem', cursor:'pointer', fontFamily:"'Inter', sans-serif", fontSize:'8px', letterSpacing:'0.15em', textTransform:'uppercase', backdropFilter:'blur(8px)', transition:'all 0.2s', zIndex:10 }}
        onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(180,155,90,0.45)'; e.currentTarget.style.color='rgba(200,170,80,0.85)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(180,155,90,0.2)'; e.currentTarget.style.color='rgba(180,155,90,0.55)'; }}>
        {open ? '✕ Índice' : '≡ Índice'}
      </button>

      {/* Sidebar panel */}
      {open && (
        <div style={{
          position:'fixed', left:0, top:0, bottom:0, width:'240px',
          background:'rgba(10,8,4,0.97)', backdropFilter:'blur(20px)',
          borderRight:'1px solid rgba(255,255,255,0.05)',
          zIndex:400, padding:'4rem 1.5rem 2rem',
          overflowY:'auto',
        }}>
          <p style={{ fontFamily:"'EB Garamond', Georgia, serif", fontStyle:'italic', fontSize:'1rem', color:'rgba(180,155,90,0.65)', marginBottom:'1.5rem', paddingBottom:'1rem', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
            Índice
          </p>
          {chapters.map(page => (
            <button key={page.num} onClick={() => { onGo(page.num); setOpen(false); }}
              style={{
                display:'flex', alignItems:'baseline', gap:'0.5rem',
                width:'100%', background:'none', border:'none',
                padding:'0.4rem 0', cursor:'pointer', textAlign:'left',
                borderBottom:'1px solid rgba(255,255,255,0.03)',
              }}>
              <span style={{ fontFamily:"'Inter', sans-serif", fontSize:'8px', color:'rgba(180,155,90,0.4)', width:'18px', flexShrink:0, letterSpacing:'0.05em' }}>
                {page.num === 0 ? '—' : page.num}
              </span>
              <span style={{
                fontFamily:"'EB Garamond', Georgia, serif", fontStyle:'italic', fontSize:'0.85rem',
                color: current === page.num ? 'rgba(200,175,80,0.95)' : 'rgba(180,165,135,0.55)',
                lineHeight:1.4, transition:'color 0.2s',
              }}>
                {page.label}
              </span>
            </button>
          ))}
          <button onClick={() => setOpen(false)} style={{ position:'absolute', top:'1rem', right:'1rem', background:'none', border:'none', color:'rgba(150,140,115,0.4)', cursor:'pointer', fontSize:'14px' }}>✕</button>
        </div>
      )}
    </>
  );
}
