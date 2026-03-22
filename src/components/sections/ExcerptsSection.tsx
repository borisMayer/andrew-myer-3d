/**
 * ExcerptsSection — "Fragmentos Seleccionados"
 *
 * Tres experiencias combinadas:
 * 1. Índice visual por libro (nodos)
 * 2. Modo lectura inmersiva ("Lectura Ritual") — pantalla oscurecida, tipografía grande
 * 3. Capas de conocimiento: texto → interpretación → insight
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

interface ExcerptItem {
  book:    string;
  text:    string;
  layer2?: string; // philosophical interpretation
  layer3?: string; // practical / existential insight
}

// Extended excerpts with interpretive layers
const LAYERS_ES: Record<number, { layer2: string; layer3: string }> = {
  0: {
    layer2: 'La experiencia del umbral —ese instante en que el cuerpo cesa y algo permanece— es el dato primario de toda antropología filosófica. Antes que la pregunta por el alma, está este hecho bruto: algo persiste.',
    layer3: 'La proximidad a la muerte no como tragedia sino como epistemología. Saber desde adentro lo que los vivos solo pueden especular.',
  },
  1: {
    layer2: 'El lenguaje como límite y como puente. Wittgenstein escribió que "de lo que no se puede hablar, hay que callar". Myer escoge el otro camino: hablar aun cuando las palabras lleguen tarde.',
    layer3: 'El testimonio como obligación ética. Retener una verdad recibida no es discreción: es desobediencia.',
  },
  2: {
    layer2: 'La paradoja dolor/paz como categoría ontológica, no psicológica. No se trata de disociación ni de resignación, sino de la coexistencia genuina de dos planos de realidad simultáneos.',
    layer3: 'La integración de la experiencia límite: cómo se vuelve a habitar un cuerpo y una vida ordinaria cuando las coordenadas han sido radicalmente alteradas.',
  },
  3: {
    layer2: 'La convergencia entre el mito griego y la cosmología hebrea no es sincretismo sino método comparativo. Myer identifica en ambas tradiciones el mismo patrón estructural: la conciencia que se vuelve sobre sí misma hasta consumirse.',
    layer3: 'El narcisismo como clave hermenéutica universal: lo que el psicoanálisis llama estructura, la teología llama pecado original, y ambos describen el mismo fenómeno.',
  },
  4: {
    layer2: 'La "Primera Ley" como axioma metafísico: antes que la física, antes que la cosmología, hay un movimiento de la conciencia sobre sí misma. Este es el origen del mal y también —paradójicamente— el origen de la creación.',
    layer3: 'Entender el narcisismo como ley y no solo como síntoma cambia la estrategia terapéutica: no se trata de corregir una desviación sino de comprender una estructura.',
  },
  5: {
    layer2: 'El conocimiento como cartografía existencial. No se muere para aprender sino para ser mostrado. La revelación tiene una intencionalidad: prepara al receptor para elecciones futuras.',
    layer3: 'La libertad como topografía: los caminos posibles existen antes de ser recorridos. Ver las bifurcaciones no las predetermina; amplía la responsabilidad.',
  },
  6: {
    layer2: 'El espacio liminal —ese territorio entre planos— es el objeto real de estudio. No el "más allá" como destino sino como territorio con su propia geografía, jerarquías y leyes.',
    layer3: 'La encarnación invertida: si el alma desciende al cuerpo al nacer, el regreso después de la muerte no es un viaje hacia lo desconocido sino un reconocimiento.',
  },
  7: {
    layer2: 'El Tzimtzum como solución al problema de la emanación: si Dios es infinito, ¿cómo puede existir algo que no sea Dios? La "contracción" crea el espacio ontológico de la alteridad.',
    layer3: 'La teología de la kenosis (vaciamiento) en perspectiva cabalística: Dios se hace pequeño para que la creación sea posible. La misma estructura en la Encarnación cristiana.',
  },
  8: {
    layer2: 'La eficacia espiritual como problema filosófico: ¿cómo actúa lo inmaterial sobre lo material? Myer propone una causalidad trans-plano que opera por resonancia, no por contacto físico.',
    layer3: 'Reconocer la arquitectura invisible de las fuerzas que modelan la experiencia subjetiva es el primer paso de cualquier terapia que aspire a ser verdaderamente profunda.',
  },
  9: {
    layer2: 'La certeza interior como fuente epistémica independiente. Frente al racionalismo que exige evidencia externa, la tradición mística afirma la validez del conocimiento por connaturalidad.',
    layer3: 'La paradoja de la comunicación mística: se habla de lo inefable porque el silencio también tiene un costo. El testimonio no busca convencer sino acompañar al lector hasta el umbral de su propia experiencia.',
  },
};

const LAYERS_EN: Record<number, { layer2: string; layer3: string }> = {
  0: {
    layer2: 'The threshold experience —that instant when the body ceases and something remains— is the primary datum of all philosophical anthropology. Before the question of the soul comes this brute fact: something persists.',
    layer3: 'Proximity to death not as tragedy but as epistemology. Knowing from within what the living can only speculate about.',
  },
  1: {
    layer2: 'Language as limit and bridge. Wittgenstein wrote that "whereof one cannot speak, thereof one must be silent." Myer chooses the other path: to speak even when words arrive late.',
    layer3: 'Testimony as ethical obligation. Withholding a received truth is not discretion: it is disobedience.',
  },
  2: {
    layer2: 'The pain/peace paradox as ontological, not psychological, category. This is not dissociation or resignation, but the genuine coexistence of two planes of reality simultaneously.',
    layer3: 'The integration of the limit experience: how one returns to inhabit an ordinary body and life when the coordinates have been radically altered.',
  },
  3: {
    layer2: 'The convergence between Greek myth and Hebrew cosmology is not syncretism but comparative method. Myer identifies in both traditions the same structural pattern: consciousness that turns upon itself until it is consumed.',
    layer3: 'Narcissism as universal hermeneutical key: what psychoanalysis calls structure, theology calls original sin — both describe the same phenomenon.',
  },
  4: {
    layer2: 'The "First Law" as metaphysical axiom: before physics, before cosmology, there is a movement of consciousness upon itself. This is the origin of evil and also — paradoxically — the origin of creation.',
    layer3: 'Understanding narcissism as law rather than symptom changes the therapeutic strategy: not correcting a deviation but comprehending a structure.',
  },
  5: {
    layer2: 'Knowledge as existential cartography. One does not die in order to learn but in order to be shown. Revelation has intentionality: it prepares the recipient for future choices.',
    layer3: 'Freedom as topography: possible paths exist before they are travelled. Seeing the bifurcations does not predetermine them; it expands responsibility.',
  },
  6: {
    layer2: 'The liminal space —that territory between planes— is the real object of study. Not the "beyond" as destination but as territory with its own geography, hierarchies and laws.',
    layer3: 'Inverted incarnation: if the soul descends into the body at birth, the return after death is not a journey into the unknown but a recognition.',
  },
  7: {
    layer2: 'The Tzimtzum as solution to the problem of emanation: if God is infinite, how can anything exist that is not God? The "contraction" creates the ontological space of alterity.',
    layer3: 'The theology of kenosis (emptying) in Kabbalistic perspective: God makes himself small so that creation is possible. The same structure in the Christian Incarnation.',
  },
  8: {
    layer2: 'Spiritual efficacy as philosophical problem: how does the immaterial act upon the material? Myer proposes a trans-plane causality operating by resonance, not physical contact.',
    layer3: 'Recognising the invisible architecture of forces shaping subjective experience is the first step of any therapy aspiring to be truly profound.',
  },
  9: {
    layer2: 'Inner certitude as independent epistemic source. Against rationalism demanding external evidence, the mystical tradition affirms the validity of knowledge by connaturality.',
    layer3: 'The paradox of mystical communication: the ineffable is spoken because silence also has a cost. Testimony does not seek to convince but to accompany the reader to the threshold of their own experience.',
  },
};

export default function ExcerptsSection() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');
  const sectionRef = useRef<HTMLElement>(null);

  const [activeIdx,    setActiveIdx]    = useState(0);
  const [ritualMode,   setRitualMode]   = useState(false);
  const [layer,        setLayer]        = useState(1); // 1 = text, 2 = interpretation, 3 = insight
  const [transitioning,setTransitioning]= useState(false);
  const textRef    = useRef<HTMLDivElement>(null);
  const ritualRef  = useRef<HTMLDivElement>(null);

  const excerpts   = t('excerpts.items', { returnObjects: true }) as ExcerptItem[];
  const layers     = isEn ? LAYERS_EN : LAYERS_ES;
  const current    = excerpts[activeIdx];
  const curLayers  = layers[activeIdx];

  // Parse "Book — Chapter" string
  const parseBook = (str: string) => {
    const parts = str.split(' — ');
    return { title: parts[0], chapter: parts[1] ?? '' };
  };

  // Group by book title
  const bookGroups: Record<string, number[]> = {};
  excerpts.forEach((ex, i) => {
    const title = parseBook(ex.book).title;
    if (!bookGroups[title]) bookGroups[title] = [];
    bookGroups[title].push(i);
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.ex-sidebar', { opacity:0, x:-20 }, { opacity:1, x:0, duration:0.8, ease:'power2.out', scrollTrigger:{ trigger:sectionRef.current, start:'top 68%' } });
      gsap.fromTo('.ex-main',    { opacity:0, y:20  }, { opacity:1, y:0, duration:0.9, ease:'power2.out', delay:0.1, scrollTrigger:{ trigger:sectionRef.current, start:'top 68%' } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Auto-cycle (pause in ritual mode)
  useEffect(() => {
    if (ritualMode) return;
    const timer = setInterval(() => changeExcerpt((activeIdx + 1) % excerpts.length), 8000);
    return () => clearInterval(timer);
  }, [activeIdx, ritualMode, excerpts.length]);

  const changeExcerpt = useCallback((idx: number) => {
    if (transitioning || idx === activeIdx) return;
    setTransitioning(true);
    gsap.to(textRef.current, {
      opacity: 0, y: -6, duration: 0.25, ease: 'power2.in',
      onComplete: () => {
        setActiveIdx(idx);
        setLayer(1);
        gsap.fromTo(textRef.current, { opacity:0, y:10 }, { opacity:1, y:0, duration:0.35, ease:'power2.out', onComplete:() => setTransitioning(false) });
      }
    });
  }, [transitioning, activeIdx]);

  const advanceLayer = () => {
    if (layer < 3) {
      gsap.to(textRef.current, {
        opacity: 0, duration: 0.2, onComplete: () => {
          setLayer(l => l + 1);
          gsap.fromTo(textRef.current, { opacity:0 }, { opacity:1, duration:0.35 });
        }
      });
    }
  };

  const openRitual = () => {
    setRitualMode(true);
    setLayer(1);
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      if (ritualRef.current) {
        gsap.fromTo(ritualRef.current, { opacity:0 }, { opacity:1, duration:0.5, ease:'power2.out' });
      }
    });
  };

  const closeRitual = useCallback(() => {
    if (ritualRef.current) {
      gsap.to(ritualRef.current, {
        opacity: 0, duration: 0.35, ease:'power2.in',
        onComplete: () => { setRitualMode(false); setLayer(1); document.body.style.overflow = ''; }
      });
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeRitual(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [closeRitual]);

  const { chapter: activeChapter } = parseBook(current?.book ?? '');
  const activeBookTitle = parseBook(current?.book ?? '').title;

  // Layer labels
  const layerLabels = isEn
    ? ['Text', 'Interpretation', 'Insight']
    : ['Texto', 'Interpretación', 'Insight'];

  const layerContent = layer === 1
    ? current?.text
    : layer === 2
      ? curLayers?.layer2
      : curLayers?.layer3;

  return (
    <>
      <section id="excerpts" ref={sectionRef} style={{
        padding: 'var(--space-section) var(--space-gutter)',
        pointerEvents: 'auto',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}>
        <div style={{ maxWidth:'var(--max-width)', margin:'0 auto' }}>

          <div className="section-rule">
            <span className="label-tag">{t('excerpts.label')}</span>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'260px 1fr', gap:'3.5rem', alignItems:'start' }} className="ex-layout">

            {/* ── Sidebar: book nodes ───────────────────────────── */}
            <div className="ex-sidebar">
              <h2 style={{ fontFamily:'var(--font-serif)', fontSize:'clamp(1.4rem,2.5vw,2rem)', fontWeight:400, color:'rgba(235,228,215,0.95)', lineHeight:1.15, marginBottom:'0.5rem' }}>
                {t('excerpts.title')}
              </h2>
              <p style={{ fontFamily:'var(--font-sans)', fontSize:'0.8rem', color:'rgba(140,145,155,0.6)', lineHeight:1.8, fontWeight:300, marginBottom:'1.75rem' }}>
                {t('excerpts.subtitle')}
              </p>

              {Object.entries(bookGroups).map(([bookTitle, indices]) => (
                <div key={bookTitle} style={{ marginBottom:'0.25rem' }}>
                  {/* Book node */}
                  <div style={{
                    padding:'0.6rem 0',
                    borderTop:'1px solid rgba(255,255,255,0.05)',
                    display:'flex', alignItems:'center', gap:'8px',
                  }}>
                    <div style={{
                      width:'5px', height:'5px', borderRadius:'50%', flexShrink:0,
                      background: indices.some(i => i === activeIdx) ? 'rgba(180,155,90,0.8)' : 'rgba(255,255,255,0.15)',
                      transition:'background 0.3s',
                      boxShadow: indices.some(i => i === activeIdx) ? '0 0 6px rgba(180,155,90,0.5)' : 'none',
                    }} />
                    <span style={{ fontFamily:'var(--font-serif)', fontSize:'0.8rem', fontStyle:'italic', color: indices.some(i => i === activeIdx) ? 'rgba(200,190,175,0.85)' : 'rgba(155,160,170,0.55)', transition:'color 0.3s', lineHeight:1.3 }}>
                      {bookTitle}
                    </span>
                  </div>

                  {/* Chapter items */}
                  {indices.map(i => {
                    const { chapter } = parseBook(excerpts[i].book);
                    const isActive = i === activeIdx;
                    return (
                      <button key={i}
                        onClick={() => changeExcerpt(i)}
                        style={{
                          display:'flex', alignItems:'center', gap:'7px',
                          width:'100%', background:'none', border:'none',
                          padding:'0.28rem 0 0.28rem 13px', cursor:'pointer', textAlign:'left',
                        }}>
                        <div style={{
                          width:'16px', height:'1px', flexShrink:0,
                          background: isActive ? 'rgba(180,155,90,0.6)' : 'rgba(255,255,255,0.08)',
                          transition:'background 0.3s, width 0.3s',
                        }} />
                        <span style={{
                          fontFamily:'var(--font-mono)', fontSize:'8.5px', letterSpacing:'0.08em',
                          color: isActive ? 'rgba(190,165,75,0.9)' : 'rgba(120,125,135,0.5)',
                          transition:'color 0.3s', lineHeight:1.5,
                        }}>
                          {chapter || bookTitle}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* ── Main: excerpt panel ───────────────────────────── */}
            <div className="ex-main">

              {/* Layer tabs */}
              <div style={{ display:'flex', gap:'0', marginBottom:'0', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                {layerLabels.map((label, i) => {
                  const lNum = i + 1;
                  const available = lNum === 1 || (lNum === 2 && curLayers?.layer2) || (lNum === 3 && curLayers?.layer3);
                  const isActive  = layer === lNum;
                  return (
                    <button key={label}
                      onClick={() => available && gsap.to(textRef.current, { opacity:0, duration:0.2, onComplete:() => { setLayer(lNum); gsap.to(textRef.current, { opacity:1, duration:0.3 }); } })}
                      disabled={!available}
                      style={{
                        padding:'0.55rem 1.1rem',
                        background:'none', border:'none',
                        borderBottom: isActive ? '1px solid rgba(180,155,90,0.6)' : '1px solid transparent',
                        marginBottom:'-1px',
                        cursor: available ? 'pointer' : 'default',
                        fontFamily:'var(--font-mono)', fontSize:'8.5px', letterSpacing:'0.14em', textTransform:'uppercase',
                        color: isActive ? 'rgba(190,165,75,0.9)' : available ? 'rgba(130,135,145,0.55)' : 'rgba(90,95,105,0.3)',
                        transition:'all 0.2s',
                      }}>
                      {String(lNum).padStart(2,'0')} {label}
                    </button>
                  );
                })}
                <div style={{ flex:1 }} />
                {/* Ritual mode button */}
                <button onClick={openRitual} style={{
                  padding:'0.55rem 1rem',
                  background:'none', border:'none', cursor:'pointer',
                  fontFamily:'var(--font-mono)', fontSize:'8px', letterSpacing:'0.14em', textTransform:'uppercase',
                  color:'rgba(180,155,90,0.45)', transition:'color 0.2s', display:'flex', alignItems:'center', gap:'5px',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'rgba(180,155,90,0.8)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(180,155,90,0.45)'; }}>
                  <span style={{ fontSize:'10px' }}>⊙</span>
                  {isEn ? 'Immersive read' : 'Lectura inmersiva'}
                </button>
              </div>

              {/* Quote panel */}
              <div style={{
                padding:'2.25rem 2.5rem 2rem',
                background:'rgba(10,10,15,0.65)',
                border:'1px solid rgba(255,255,255,0.05)',
                borderTop:'none',
                borderRadius:'0 0 2px 2px',
                minHeight:'260px', display:'flex', flexDirection:'column',
                position:'relative', overflow:'hidden',
              }}>
                {/* Layer indicator strip */}
                <div style={{ position:'absolute', left:0, top:0, bottom:0, width:'2px', background:`linear-gradient(to bottom, rgba(180,155,90,${layer === 1 ? '0.5' : layer === 2 ? '0.3' : '0.15'}), transparent)` }} />

                <div ref={textRef} style={{ flex:1 }}>

                  {/* Layer 1 — original text */}
                  {layer === 1 && (
                    <blockquote style={{
                      fontFamily:'var(--font-serif)', fontStyle:'italic', fontWeight:400,
                      fontSize:'clamp(1.05rem,2.3vw,1.38rem)',
                      color:'rgba(218,210,198,0.92)', lineHeight:1.75, margin:0,
                    }}>
                      {current?.text}
                    </blockquote>
                  )}

                  {/* Layer 2 — philosophical interpretation */}
                  {layer === 2 && curLayers?.layer2 && (
                    <div>
                      <p style={{ fontFamily:'var(--font-mono)', fontSize:'8px', letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(180,155,90,0.45)', marginBottom:'1.1rem' }}>
                        {isEn ? 'Philosophical reading' : 'Lectura filosófica'}
                      </p>
                      <p style={{ fontFamily:'var(--font-sans)', fontSize:'0.92rem', color:'rgba(195,190,180,0.82)', lineHeight:1.9, fontWeight:300, margin:0 }}>
                        {curLayers.layer2}
                      </p>
                    </div>
                  )}

                  {/* Layer 3 — practical insight */}
                  {layer === 3 && curLayers?.layer3 && (
                    <div>
                      <p style={{ fontFamily:'var(--font-mono)', fontSize:'8px', letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(150,160,180,0.4)', marginBottom:'1.1rem' }}>
                        {isEn ? 'Existential dimension' : 'Dimensión existencial'}
                      </p>
                      <p style={{ fontFamily:'var(--font-sans)', fontSize:'0.92rem', color:'rgba(185,185,195,0.78)', lineHeight:1.9, fontWeight:300, margin:0, fontStyle:'italic' }}>
                        {curLayers.layer3}
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom bar */}
                <div style={{ marginTop:'1.75rem', paddingTop:'1rem', borderTop:'1px solid rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'0.75rem' }}>

                  {/* Attribution */}
                  <div>
                    <p style={{ fontFamily:'var(--font-serif)', fontSize:'0.82rem', fontStyle:'italic', color:'rgba(155,150,140,0.65)', margin:0, lineHeight:1.3 }}>
                      {activeBookTitle}
                    </p>
                    {activeChapter && (
                      <p style={{ fontFamily:'var(--font-mono)', fontSize:'7.5px', letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(180,155,90,0.35)', margin:'2px 0 0' }}>
                        {activeChapter}
                      </p>
                    )}
                  </div>

                  <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                    {/* Advance layer if available */}
                    {layer < 3 && curLayers?.layer2 && (
                      <button onClick={advanceLayer} style={{
                        background:'rgba(180,155,90,0.07)', border:'1px solid rgba(180,155,90,0.25)',
                        color:'rgba(180,155,90,0.65)', borderRadius:'2px',
                        padding:'0.35rem 0.9rem', cursor:'pointer',
                        fontFamily:'var(--font-mono)', fontSize:'8px', letterSpacing:'0.12em', textTransform:'uppercase',
                        transition:'all 0.2s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background='rgba(180,155,90,0.14)'; e.currentTarget.style.color='rgba(195,168,80,0.9)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background='rgba(180,155,90,0.07)'; e.currentTarget.style.color='rgba(180,155,90,0.65)'; }}>
                        {isEn ? 'Deeper →' : 'Más profundo →'}
                      </button>
                    )}

                    {/* Prev / Next */}
                    <div style={{ display:'flex', gap:'4px' }}>
                      {(['←','→'] as const).map((sym, si) => (
                        <button key={sym}
                          onClick={() => changeExcerpt(si === 0 ? (activeIdx - 1 + excerpts.length) % excerpts.length : (activeIdx + 1) % excerpts.length)}
                          style={{ background:'transparent', border:'1px solid rgba(255,255,255,0.07)', color:'rgba(140,145,155,0.5)', borderRadius:'2px', width:'26px', height:'26px', cursor:'pointer', fontSize:'11px', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(180,155,90,0.35)'; e.currentTarget.style.color='rgba(180,155,90,0.75)'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; e.currentTarget.style.color='rgba(140,145,155,0.5)'; }}>
                          {sym}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ display:'flex', gap:'3px', marginTop:'0.65rem' }}>
                {excerpts.map((_, i) => (
                  <div key={i} onClick={() => changeExcerpt(i)}
                    style={{ height:'2px', borderRadius:'1px', cursor:'pointer', transition:'all 0.4s', flex: i === activeIdx ? 3 : 1, background: i === activeIdx ? 'rgba(180,155,90,0.6)' : 'rgba(255,255,255,0.1)' }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Ritual / Immersive Mode ────────────────────────────────── */}
      {ritualMode && (
        <div ref={ritualRef}
          style={{
            position:'fixed', inset:0, zIndex:200,
            background:'rgba(4,4,7,0.97)',
            display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
            padding:'clamp(2rem,6vw,5rem) clamp(1.5rem,8vw,8rem)',
            cursor:'default',
          }}
          onClick={e => { if (e.target === ritualRef.current) closeRitual(); }}>

          {/* Top bar */}
          <div style={{ position:'absolute', top:0, left:0, right:0, padding:'1.25rem 2rem', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ display:'flex', gap:'0.6rem', alignItems:'center' }}>
              {/* Layer tabs in ritual mode */}
              {layerLabels.map((label, i) => {
                const lNum = i + 1;
                const available = lNum === 1 || (lNum === 2 && curLayers?.layer2) || (lNum === 3 && curLayers?.layer3);
                const isAct = layer === lNum;
                return (
                  <button key={label}
                    onClick={() => available && setLayer(lNum)}
                    disabled={!available}
                    style={{ background:'none', border:'none', cursor: available ? 'pointer' : 'default', fontFamily:'var(--font-mono)', fontSize:'8px', letterSpacing:'0.16em', textTransform:'uppercase', color: isAct ? 'rgba(190,165,75,0.9)' : available ? 'rgba(120,125,135,0.5)' : 'rgba(80,85,95,0.3)', padding:'0.25rem 0.5rem', transition:'color 0.2s', borderBottom: isAct ? '1px solid rgba(180,155,90,0.5)' : '1px solid transparent' }}>
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Book + chapter */}
            <p style={{ fontFamily:'var(--font-mono)', fontSize:'8px', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(155,150,140,0.35)' }}>
              {activeBookTitle}{activeChapter ? ` — ${activeChapter}` : ''}
            </p>

            <button onClick={closeRitual}
              style={{ background:'none', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(155,160,170,0.5)', borderRadius:'2px', width:'30px', height:'30px', cursor:'pointer', fontSize:'12px', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color='rgba(220,215,205,0.8)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.color='rgba(155,160,170,0.5)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; }}>
              ✕
            </button>
          </div>

          {/* Decorative top line */}
          <div style={{ position:'absolute', top:'56px', left:0, right:0, height:'1px', background:'linear-gradient(to right, transparent, rgba(180,155,90,0.2), transparent)' }} />

          {/* Main content */}
          <div style={{ maxWidth:'720px', width:'100%', textAlign:'left' }}>

            {/* Drop cap + text */}
            {layer === 1 && (
              <div style={{ position:'relative' }}>
                {/* Large decorative first letter */}
                <span style={{
                  float:'left', fontFamily:'var(--font-serif)',
                  fontSize:'clamp(4rem,9vw,7rem)', lineHeight:0.85,
                  color:'rgba(180,155,90,0.25)', marginRight:'0.1em', marginTop:'0.08em',
                  fontWeight:400,
                }}>
                  {(current?.text ?? '').replace(/^[«"]/, '').charAt(0)}
                </span>
                <blockquote style={{
                  fontFamily:'var(--font-serif)', fontStyle:'italic', fontWeight:400,
                  fontSize:'clamp(1.2rem,2.8vw,1.65rem)',
                  color:'rgba(225,218,205,0.92)', lineHeight:1.8, margin:0,
                  letterSpacing:'0.01em',
                }}>
                  {current?.text}
                </blockquote>
              </div>
            )}

            {layer === 2 && curLayers?.layer2 && (
              <div>
                <p style={{ fontFamily:'var(--font-mono)', fontSize:'8px', letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(180,155,90,0.4)', marginBottom:'1.5rem' }}>
                  {isEn ? 'Philosophical reading' : 'Lectura filosófica'}
                </p>
                <p style={{ fontFamily:'var(--font-sans)', fontSize:'clamp(0.95rem,2vw,1.15rem)', color:'rgba(200,195,185,0.85)', lineHeight:1.95, fontWeight:300, margin:0 }}>
                  {curLayers.layer2}
                </p>
              </div>
            )}

            {layer === 3 && curLayers?.layer3 && (
              <div>
                <p style={{ fontFamily:'var(--font-mono)', fontSize:'8px', letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(140,150,170,0.38)', marginBottom:'1.5rem' }}>
                  {isEn ? 'Existential dimension' : 'Dimensión existencial'}
                </p>
                <p style={{ fontFamily:'var(--font-sans)', fontSize:'clamp(0.95rem,2vw,1.15rem)', color:'rgba(190,190,200,0.82)', lineHeight:1.95, fontWeight:300, margin:0, fontStyle:'italic' }}>
                  {curLayers.layer3}
                </p>
              </div>
            )}
          </div>

          {/* Bottom controls */}
          <div style={{ position:'absolute', bottom:'1.5rem', left:'2rem', right:'2rem', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'0.75rem' }}>
            {/* Layer advance */}
            {layer < 3 && curLayers?.layer2 && (
              <button onClick={advanceLayer} style={{ background:'none', border:'1px solid rgba(180,155,90,0.2)', color:'rgba(180,155,90,0.55)', borderRadius:'2px', padding:'0.4rem 1.1rem', cursor:'pointer', fontFamily:'var(--font-mono)', fontSize:'8px', letterSpacing:'0.14em', textTransform:'uppercase', transition:'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(180,155,90,0.4)'; e.currentTarget.style.color='rgba(190,165,75,0.85)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(180,155,90,0.2)'; e.currentTarget.style.color='rgba(180,155,90,0.55)'; }}>
                {isEn ? 'Next layer →' : 'Siguiente capa →'}
              </button>
            )}

            {/* Prev/next excerpt */}
            <div style={{ display:'flex', gap:'0.5rem', marginLeft:'auto' }}>
              {[{sym:'←', idx:(activeIdx - 1 + excerpts.length) % excerpts.length},{sym:'→', idx:(activeIdx + 1) % excerpts.length}].map(btn => (
                <button key={btn.sym} onClick={() => { changeExcerpt(btn.idx); setLayer(1); }}
                  style={{ background:'transparent', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(140,145,155,0.5)', borderRadius:'2px', padding:'0.4rem 0.9rem', cursor:'pointer', fontSize:'12px', transition:'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(180,155,90,0.3)'; e.currentTarget.style.color='rgba(180,155,90,0.7)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; e.currentTarget.style.color='rgba(140,145,155,0.5)'; }}>
                  {btn.sym}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) { .ex-layout { grid-template-columns: 1fr !important; gap: 2rem !important; } }
      `}</style>
    </>
  );
}
