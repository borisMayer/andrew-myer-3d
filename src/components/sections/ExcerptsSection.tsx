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
      gsap.fromTo('.excerpt-container',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 68%' } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Auto-cycle excerpts
  useEffect(() => {
    const timer = setInterval(() => setActive(a => (a + 1) % excerpts.length), 5000);
    return () => clearInterval(timer);
  }, [excerpts.length]);

  return (
    <section id="excerpts" ref={sectionRef} style={{
      padding: 'clamp(5rem,9vw,9rem) clamp(1.5rem,5vw,6rem)',
      pointerEvents: 'auto',
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', textAlign: 'center' }}>
        <p style={{ color: '#c9a227', fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '1rem', fontFamily: "'Raleway', sans-serif" }}>
          ◆ {t('excerpts.label')}
        </p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 300, color: '#ffffff', lineHeight: 1.2, marginBottom: '0.75rem' }}>
          {t('excerpts.title')}
        </h2>
        <p style={{ color: 'rgba(226,217,243,0.5)', fontFamily: "'Raleway', sans-serif", fontSize: '0.9rem', marginBottom: '3.5rem' }}>
          {t('excerpts.subtitle')}
        </p>

        {/* Excerpt display */}
        <div className="excerpt-container" style={{
          padding: '3rem 2.5rem',
          background: 'rgba(7,0,31,0.65)',
          border: '1px solid rgba(124,58,237,0.2)',
          borderRadius: '1.5rem',
          backdropFilter: 'blur(20px)',
          minHeight: '220px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(124,58,237,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />

          {excerpts.map((item, i) => (
            <div key={i} style={{
              transition: 'opacity 0.8s ease, transform 0.8s ease',
              opacity: active === i ? 1 : 0,
              transform: active === i ? 'translateY(0)' : 'translateY(10px)',
              position: active === i ? 'relative' : 'absolute',
              pointerEvents: active === i ? 'auto' : 'none',
            }}>
              <p style={{ color: 'rgba(201,162,39,0.55)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: "'Raleway', sans-serif", marginBottom: '1.25rem' }}>
                {item.book}
              </p>
              <blockquote style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(1.1rem, 2.8vw, 1.55rem)',
                fontStyle: 'italic', fontWeight: 400,
                color: 'rgba(226,217,243,0.88)', lineHeight: 1.75, margin: 0,
              }}>
                {item.text}
              </blockquote>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', marginTop: '1.75rem' }}>
          {excerpts.map((_, i) => (
            <button key={i} onClick={() => setActive(i)}
              style={{
                width: active === i ? '24px' : '6px', height: '6px',
                borderRadius: '9999px',
                background: active === i ? '#c9a227' : 'rgba(201,162,39,0.25)',
                border: 'none', cursor: 'pointer',
                transition: 'all 0.4s ease',
                padding: 0,
              }} />
          ))}
        </div>
      </div>
    </section>
  );
}
