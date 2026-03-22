import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export default function ThoughtSection() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const pillars    = t('thought.pillars', { returnObjects: true }) as Array<{ icon: string; title: string; body: string }>;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.pillar-card',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.15,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' } });
      gsap.fromTo('.central-quote',
        { opacity: 0, scale: 0.97 },
        { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out',
          scrollTrigger: { trigger: '.central-quote', start: 'top 80%' } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="thought" ref={sectionRef} style={{
      padding: 'clamp(5rem,9vw,9rem) clamp(1.5rem,5vw,6rem)',
      pointerEvents: 'auto',
    }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
        <p style={{ color: '#c9a227', fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '1rem', fontFamily: "'Raleway', sans-serif" }}>
          ◆ {t('thought.label')}
        </p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 300, color: '#ffffff', lineHeight: 1.2, marginBottom: '1rem' }}>
          {t('thought.title')}
        </h2>
        <p style={{ color: 'rgba(226,217,243,0.55)', fontFamily: "'Raleway', sans-serif", fontSize: '0.95rem', maxWidth: '580px', lineHeight: 1.8, marginBottom: '3.5rem' }}>
          {t('thought.subtitle')}
        </p>

        {/* Three pillars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px,1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
          {pillars.map((pillar, i) => (
            <div key={i} className="pillar-card" style={{
              padding: '2rem 1.75rem',
              background: 'rgba(7,0,31,0.6)',
              border: '1px solid rgba(124,58,237,0.18)',
              borderRadius: '1.25rem',
              backdropFilter: 'blur(16px)',
              transition: 'border-color 0.3s, box-shadow 0.3s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,162,39,0.3)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(201,162,39,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.18)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ fontSize: '1.6rem', marginBottom: '1rem', color: '#c9a227', textShadow: '0 0 20px rgba(201,162,39,0.5)' }}>
                {pillar.icon}
              </div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.2rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.85rem', lineHeight: 1.3 }}>
                {pillar.title}
              </h3>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: '0.875rem', color: 'rgba(226,217,243,0.62)', lineHeight: 1.8, fontWeight: 300 }}>
                {pillar.body}
              </p>
            </div>
          ))}
        </div>

        {/* Central quote */}
        <div className="central-quote" style={{
          padding: '2.5rem 3rem',
          background: 'rgba(201,162,39,0.04)',
          border: '1px solid rgba(201,162,39,0.15)',
          borderRadius: '1.25rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative background glow */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(201,162,39,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <span style={{ color: 'rgba(201,162,39,0.3)', fontSize: '3rem', fontFamily: 'Georgia, serif', lineHeight: 1, display: 'block', marginBottom: '0.5rem' }}>"</span>
          <p style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
            fontStyle: 'italic', fontWeight: 400,
            color: 'rgba(226,217,243,0.85)', lineHeight: 1.7,
            maxWidth: '760px', margin: '0 auto',
          }}>
            {t('thought.central_quote').replace(/^"|"$/g, '')}
          </p>
          <cite style={{ display: 'block', marginTop: '1.25rem', color: 'rgba(201,162,39,0.6)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', fontStyle: 'normal', fontFamily: "'Raleway', sans-serif" }}>
            — {t('thought.quote_author')}
          </cite>
        </div>
      </div>
    </section>
  );
}
