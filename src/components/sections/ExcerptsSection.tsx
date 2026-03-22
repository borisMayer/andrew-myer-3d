import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export default function ExcerptsSection() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const excerpts = t('excerpts.items', { returnObjects: true }) as Array<{ book: string; text: string }>;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.excerpt-wrap',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.1, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % excerpts.length), 6000);
    return () => clearInterval(t);
  }, [excerpts.length]);

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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem', alignItems: 'start' }} className="excerpts-grid">
          {/* Left — title + navigation */}
          <div>
            <h2 style={{ fontFamily:'var(--font-serif)', fontSize:'clamp(1.6rem,3vw,2.4rem)', fontWeight:400, color:'rgba(235,228,215,0.95)', lineHeight:1.15, marginBottom:'1.5rem' }}>
              {t('excerpts.title')}
            </h2>
            <p style={{ fontFamily:'var(--font-sans)', fontSize:'0.875rem', color:'rgba(155,160,170,0.6)', lineHeight:1.8, fontWeight:300, marginBottom:'2rem' }}>
              {t('excerpts.subtitle')}
            </p>

            {/* Book index */}
            <div style={{ display:'flex', flexDirection:'column', gap:'0' }}>
              {excerpts.map((item, i) => (
                <button key={i} onClick={() => setActive(i)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: '0.75rem 0',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    textAlign: 'left',
                  }}>
                  <div style={{
                    width: '2px', height: '100%', minHeight: '16px',
                    background: active === i ? 'rgba(180,155,90,0.7)' : 'rgba(255,255,255,0.08)',
                    transition: 'background 0.3s', flexShrink: 0,
                  }} />
                  <span style={{
                    fontFamily: 'var(--font-sans)', fontSize: '11px',
                    color: active === i ? 'rgba(200,170,80,0.9)' : 'rgba(150,155,165,0.55)',
                    letterSpacing: '0.04em', transition: 'color 0.3s',
                    fontWeight: active === i ? 500 : 300,
                  }}>
                    {item.book}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right — excerpt display */}
          <div className="excerpt-wrap" style={{
            padding: '2.5rem',
            background: 'rgba(10,10,16,0.6)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '2px',
            position: 'relative', overflow: 'hidden',
            minHeight: '220px', display: 'flex', alignItems: 'center',
          }}>
            {/* Thin gold line top */}
            <div style={{ position:'absolute', top:0, left:0, right:0, height:'1px', background:'linear-gradient(to right, rgba(180,155,90,0.4), transparent)' }} />

            {excerpts.map((item, i) => (
              <div key={i} style={{
                transition: 'opacity 0.7s ease, transform 0.7s ease',
                opacity: active === i ? 1 : 0,
                transform: active === i ? 'translateY(0)' : 'translateY(8px)',
                position: active === i ? 'relative' : 'absolute',
                pointerEvents: active === i ? 'auto' : 'none',
                width: '100%',
              }}>
                <p style={{ fontFamily:'var(--font-mono)', fontSize:'9px', letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(180,155,90,0.5)', marginBottom:'1.1rem' }}>
                  {item.book}
                </p>
                <blockquote style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.05rem, 2.5vw, 1.4rem)',
                  fontStyle: 'italic', fontWeight: 400,
                  color: 'rgba(210,205,195,0.88)', lineHeight: 1.75, margin: 0,
                }}>
                  {item.text}
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .excerpts-grid { grid-template-columns: 1fr !important; gap: 2rem !important; } }
      `}</style>
    </section>
  );
}
