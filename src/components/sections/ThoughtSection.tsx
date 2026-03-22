import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export default function ThoughtSection() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const pillars = t('thought.pillars', { returnObjects: true }) as Array<{ icon: string; title: string; body: string }>;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.pillar-item',
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 68%' } });
      gsap.fromTo('.central-quote',
        { opacity: 0 },
        { opacity: 1, duration: 1.1, ease: 'power2.out',
          scrollTrigger: { trigger: '.central-quote', start: 'top 82%' } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="thought" ref={sectionRef} style={{
      padding: 'var(--space-section) var(--space-gutter)',
      pointerEvents: 'auto',
      borderTop: '1px solid rgba(255,255,255,0.04)',
    }}>
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}>

        <div className="section-rule">
          <span className="label-tag">{t('thought.label')}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '4rem', marginBottom: '4rem' }} className="thought-grid">
          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 400, color: 'rgba(235,228,215,0.95)', lineHeight: 1.2, marginBottom: '1rem' }}>
              {t('thought.title')}
            </h2>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: 'rgba(160,165,175,0.65)', lineHeight: 1.8, fontWeight: 300 }}>
              {t('thought.subtitle')}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {pillars.map((pillar, i) => (
              <div key={i} className="pillar-item" style={{
                padding: '1.5rem 0',
                borderBottom: i < pillars.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                display: 'grid', gridTemplateColumns: '28px 1fr', gap: '1rem',
                alignItems: 'start',
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(180,155,90,0.6)', paddingTop: '2px' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 500, color: 'rgba(220,215,205,0.9)', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                    {pillar.title}
                  </h3>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'rgba(155,160,170,0.7)', lineHeight: 1.8, fontWeight: 300 }}>
                    {pillar.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Central quote — editorial pullquote style */}
        <div className="central-quote" style={{
          padding: '2.5rem 3rem',
          borderTop: '1px solid rgba(180,155,90,0.15)',
          borderBottom: '1px solid rgba(180,155,90,0.15)',
          position: 'relative',
        }}>
          <span style={{ position: 'absolute', top: '-0.7rem', left: '3rem', background: 'var(--ink-900)', padding: '0 0.5rem', fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(180,155,90,0.45)' }}>
            {t('thought.quote_author')}
          </span>
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.1rem, 2.5vw, 1.55rem)',
            fontStyle: 'italic', fontWeight: 400,
            color: 'rgba(210,205,190,0.85)', lineHeight: 1.65,
            maxWidth: '860px',
          }}>
            {t('thought.central_quote')}
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .thought-grid { grid-template-columns: 1fr !important; gap: 2rem !important; } }
      `}</style>
    </section>
  );
}
