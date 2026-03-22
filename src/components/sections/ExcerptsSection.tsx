import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

interface ExcerptItem { book: string; text: string; }

export default function ExcerptsSection() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  const excerpts = t('excerpts.items', { returnObjects: true }) as ExcerptItem[];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.ex-index-item',
        { opacity: 0, x: -16 },
        { opacity: 1, x: 0, duration: 0.7, stagger: 0.06, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' } });
      gsap.fromTo('.ex-quote-panel',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 68%' } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Auto-cycle every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      changeExcerpt((active + 1) % excerpts.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [active, excerpts.length]);

  const changeExcerpt = (idx: number) => {
    if (animating || idx === active) return;
    setAnimating(true);
    gsap.to(textRef.current, {
      opacity: 0, y: -8, duration: 0.3, ease: 'power2.in',
      onComplete: () => {
        setActive(idx);
        gsap.fromTo(textRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out',
            onComplete: () => setAnimating(false) });
      }
    });
  };

  // Parse book title and chapter from the combined string
  const parseBook = (str: string) => {
    const parts = str.split(' — ');
    return { title: parts[0], chapter: parts[1] ?? '' };
  };

  // Group excerpts by book (title without chapter)
  const bookGroups: Record<string, number[]> = {};
  excerpts.forEach((ex, i) => {
    const title = parseBook(ex.book).title;
    if (!bookGroups[title]) bookGroups[title] = [];
    bookGroups[title].push(i);
  });

  const { title: activeBookTitle, chapter: activeChapter } = parseBook(excerpts[active]?.book ?? '');

  return (
    <section id="excerpts" ref={sectionRef} style={{
      padding: 'var(--space-section) var(--space-gutter)',
      pointerEvents: 'auto',
      borderTop: '1px solid rgba(255,255,255,0.04)',
    }}>
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}>

        <div className="section-rule">
          <span className="label-tag">{t('excerpts.label')}</span>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'300px 1fr', gap:'3.5rem', alignItems:'start' }} className="ex-grid">

          {/* Left — grouped index */}
          <div>
            <h2 style={{ fontFamily:'var(--font-serif)', fontSize:'clamp(1.5rem,2.8vw,2.2rem)', fontWeight:400, color:'rgba(235,228,215,0.95)', lineHeight:1.15, marginBottom:'0.6rem' }}>
              {t('excerpts.title')}
            </h2>
            <p style={{ fontFamily:'var(--font-sans)', fontSize:'0.825rem', color:'rgba(145,150,160,0.6)', lineHeight:1.8, fontWeight:300, marginBottom:'2rem' }}>
              {t('excerpts.subtitle')}
            </p>

            {/* Index by book */}
            <div style={{ display:'flex', flexDirection:'column', gap:'0' }}>
              {Object.entries(bookGroups).map(([bookTitle, indices]) => (
                <div key={bookTitle} style={{ borderTop:'1px solid rgba(255,255,255,0.05)' }}>
                  {/* Book title header */}
                  <p style={{ fontFamily:'var(--font-serif)', fontSize:'0.82rem', color:'rgba(180,170,155,0.65)', padding:'0.75rem 0 0.4rem', fontStyle:'italic', lineHeight:1.3 }}>
                    {bookTitle}
                  </p>
                  {/* Chapter items */}
                  {indices.map(i => {
                    const { chapter } = parseBook(excerpts[i].book);
                    return (
                      <button key={i} className="ex-index-item"
                        onClick={() => changeExcerpt(i)}
                        style={{
                          display:'flex', alignItems:'center', gap:'0.6rem',
                          width:'100%', background:'none', border:'none',
                          padding:'0.35rem 0 0.35rem 0.5rem', cursor:'pointer', textAlign:'left',
                        }}>
                        <div style={{
                          width:'2px', height:'14px', flexShrink:0, borderRadius:'1px',
                          background: active === i ? 'rgba(180,155,90,0.7)' : 'rgba(255,255,255,0.08)',
                          transition:'background 0.3s',
                        }} />
                        <span style={{
                          fontFamily:'var(--font-mono)', fontSize:'9px', letterSpacing:'0.08em',
                          color: active === i ? 'rgba(195,168,80,0.9)' : 'rgba(130,135,145,0.5)',
                          transition:'color 0.3s', lineHeight:1.4,
                        }}>
                          {chapter || bookTitle}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Right — quote display */}
          <div className="ex-quote-panel" style={{
            padding:'2.5rem 2.75rem',
            background:'rgba(10,10,15,0.7)',
            border:'1px solid rgba(255,255,255,0.05)',
            borderRadius:'2px',
            position:'relative', overflow:'hidden',
            minHeight:'280px', display:'flex', flexDirection:'column', justifyContent:'space-between',
          }}>
            {/* Gold accent line top */}
            <div style={{ position:'absolute', top:0, left:0, right:0, height:'1px', background:'linear-gradient(to right, rgba(180,155,90,0.4), transparent)' }} />

            {/* Quote */}
            <div ref={textRef} style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center' }}>
              <blockquote style={{
                fontFamily:'var(--font-serif)',
                fontSize:'clamp(1.05rem, 2.4vw, 1.4rem)',
                fontStyle:'italic', fontWeight:400,
                color:'rgba(215,208,196,0.9)', lineHeight:1.75, margin:0,
              }}>
                {excerpts[active]?.text}
              </blockquote>
            </div>

            {/* Source attribution */}
            <div style={{ marginTop:'1.75rem', paddingTop:'1rem', borderTop:'1px solid rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'0.5rem' }}>
              <div>
                <p style={{ fontFamily:'var(--font-serif)', fontSize:'0.85rem', fontStyle:'italic', color:'rgba(160,155,145,0.65)', margin:0 }}>
                  {activeBookTitle}
                </p>
                {activeChapter && (
                  <p style={{ fontFamily:'var(--font-mono)', fontSize:'8px', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(180,155,90,0.4)', margin:'3px 0 0' }}>
                    {activeChapter}
                  </p>
                )}
              </div>

              {/* Prev / Next */}
              <div style={{ display:'flex', gap:'0.5rem' }}>
                {[
                  { label:'←', onClick: () => changeExcerpt((active - 1 + excerpts.length) % excerpts.length) },
                  { label:'→', onClick: () => changeExcerpt((active + 1) % excerpts.length) },
                ].map(btn => (
                  <button key={btn.label} onClick={btn.onClick}
                    style={{ background:'transparent', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(155,160,170,0.5)', borderRadius:'2px', width:'28px', height:'28px', cursor:'pointer', fontSize:'12px', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(180,155,90,0.4)'; e.currentTarget.style.color='rgba(180,155,90,0.8)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; e.currentTarget.style.color='rgba(155,160,170,0.5)'; }}>
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Progress dots */}
            <div style={{ display:'flex', gap:'4px', marginTop:'0.75rem' }}>
              {excerpts.map((_, i) => (
                <div key={i}
                  onClick={() => changeExcerpt(i)}
                  style={{ height:'2px', borderRadius:'1px', cursor:'pointer', transition:'all 0.4s', width: active === i ? '18px' : '5px', background: active === i ? 'rgba(180,155,90,0.65)' : 'rgba(255,255,255,0.12)' }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .ex-grid { grid-template-columns: 1fr !important; gap: 2rem !important; } }
      `}</style>
    </section>
  );
}
