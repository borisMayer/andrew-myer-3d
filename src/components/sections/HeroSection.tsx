import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';

export default function HeroSection() {
  const { t } = useTranslation();
  const wrapRef     = useRef<HTMLDivElement>(null);
  const eyebrowRef  = useRef<HTMLDivElement>(null);
  const titleRef    = useRef<HTMLHeadingElement>(null);
  const lineRef     = useRef<HTMLDivElement>(null);
  const credRef     = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);
  const scrollRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 1 });
    tl
      .fromTo(eyebrowRef.current,
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' })
      .fromTo(titleRef.current,
        { opacity: 0, y: 32, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.4, ease: 'power3.out' }, '-=0.3')
      .fromTo(lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.9, ease: 'power2.inOut', transformOrigin: 'left center' }, '-=0.6')
      .fromTo(credRef.current,
        { opacity: 0, x: -12 },
        { opacity: 1, x: 0, duration: 0.7, ease: 'power2.out' }, '-=0.5')
      .fromTo(subtitleRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, '-=0.4')
      .fromTo(ctaRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.4')
      .fromTo(scrollRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 }, '-=0.2');

    gsap.to('.scroll-dot', {
      y: 12, duration: 1.6, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2.8,
    });
  }, []);

  return (
    <div ref={wrapRef} style={{ width: '100%', maxWidth: '800px', textAlign: 'left', padding: '0 var(--space-gutter)' }}>

      {/* Eyebrow — academic classification */}
      <div ref={eyebrowRef} style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', opacity: 0,
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(180,155,90,0.6)' }}>
          Teología · Filosofía · Psicología
        </span>
        <div style={{ width: '32px', height: '1px', background: 'rgba(180,155,90,0.3)' }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.15em', color: 'rgba(160,165,175,0.45)' }}>
          {t('hero.series')}
        </span>
      </div>

      {/* Main title — editorial serif, large */}
      <h1 ref={titleRef} style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(3.2rem, 9vw, 7.5rem)',
        fontWeight: 400, lineHeight: 1.0,
        color: 'rgba(235,228,215,0.97)',
        letterSpacing: '-0.02em',
        marginBottom: '1.5rem', opacity: 0,
      }}>
        Andrew Myer
      </h1>

      {/* Horizontal rule + credentials */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div ref={lineRef} style={{
          width: '100%', height: '1px',
          background: 'linear-gradient(to right, rgba(180,155,90,0.4), rgba(180,155,90,0.1), transparent)',
          marginBottom: '0.9rem', transformOrigin: 'left center',
        }} />
        <div ref={credRef} style={{
          display: 'flex', flexWrap: 'wrap', gap: '1.25rem', opacity: 0,
        }}>
          {[
            { tag: 'Ph.D.', label: 'Teología Reformada' },
            { tag: 'M.A.',  label: 'Filosofía' },
            { tag: 'Lic.',  label: 'Psicología' },
          ].map(c => (
            <span key={c.tag} style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(180,155,90,0.7)', letterSpacing: '0.1em' }}>
                {c.tag}
              </span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'rgba(160,165,175,0.55)', letterSpacing: '0.04em' }}>
                {c.label}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Subtitle */}
      <p ref={subtitleRef} style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(1rem, 2.2vw, 1.25rem)',
        fontWeight: 400, fontStyle: 'italic',
        color: 'rgba(200,195,185,0.6)',
        maxWidth: '560px', lineHeight: 1.75,
        marginBottom: '2.5rem', opacity: 0,
      }}>
        {t('hero.subtitle')}
      </p>

      {/* CTAs */}
      <div ref={ctaRef} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', opacity: 0 }}>
        <a href="#books" style={{
          padding: '0.8rem 1.8rem',
          background: 'rgba(180,155,90,0.12)',
          border: '1px solid rgba(180,155,90,0.4)',
          color: 'rgba(200,170,80,0.9)',
          borderRadius: '2px', textDecoration: 'none',
          fontFamily: 'var(--font-sans)', fontWeight: 500,
          fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase',
          transition: 'all 0.25s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(180,155,90,0.2)'; e.currentTarget.style.borderColor = 'rgba(180,155,90,0.7)'; e.currentTarget.style.color = 'rgba(220,185,90,1)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(180,155,90,0.12)'; e.currentTarget.style.borderColor = 'rgba(180,155,90,0.4)'; e.currentTarget.style.color = 'rgba(200,170,80,0.9)'; }}>
          {t('hero.cta_books')}
        </a>
        <a href="#author" style={{
          padding: '0.8rem 1.8rem',
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'rgba(160,165,175,0.6)',
          borderRadius: '2px', textDecoration: 'none',
          fontFamily: 'var(--font-sans)', fontWeight: 400,
          fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase',
          transition: 'all 0.25s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = 'rgba(200,200,210,0.85)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(160,165,175,0.6)'; }}>
          {t('hero.cta_author')}
        </a>
      </div>

      {/* Scroll indicator */}
      <div ref={scrollRef} style={{
        position: 'absolute', bottom: '2.5rem', left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
        opacity: 0,
      }}>
        <div style={{ width: '1px', height: '40px', background: 'rgba(180,155,90,0.2)', position: 'relative', overflow: 'hidden' }}>
          <div className="scroll-dot" style={{
            width: '2px', height: '8px',
            background: 'linear-gradient(to bottom, transparent, rgba(180,155,90,0.7))',
            position: 'absolute', left: '-0.5px', top: 0,
          }} />
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(180,155,90,0.35)' }}>
          {t('hero.scroll')}
        </span>
      </div>
    </div>
  );
}
