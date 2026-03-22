import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';

export default function HeroSection() {
  const { t } = useTranslation();
  const badgeRef    = useRef<HTMLDivElement>(null);
  const titleRef    = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);
  const scrollRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 1.2 });
    tl
      .fromTo(badgeRef.current,
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' })
      .fromTo(titleRef.current,
        { opacity: 0, y: 50, filter: 'blur(16px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.7, ease: 'power3.out' }, '-=0.4')
      .fromTo(subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.1, ease: 'power2.out' }, '-=0.8')
      .fromTo(ctaRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, '-=0.5')
      .fromTo(scrollRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.7 }, '-=0.3');

    gsap.to('.scroll-dot', {
      y: 14, duration: 1.4, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2.5,
    });
  }, []);

  return (
    <>
      {/* Series badge */}
      <div ref={badgeRef} style={{
        marginBottom: '1.75rem', opacity: 0,
        display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
        padding: '0.4rem 1.4rem',
        border: '1px solid rgba(201,162,39,0.3)',
        borderRadius: '9999px',
        background: 'rgba(201,162,39,0.05)',
        backdropFilter: 'blur(12px)',
      }}>
        <span style={{ color: 'rgba(201,162,39,0.7)', fontSize: '7px' }}>◆</span>
        <span style={{
          fontFamily: "'Raleway', sans-serif", fontSize: '9px',
          letterSpacing: '0.28em', color: 'rgba(201,162,39,0.8)',
          textTransform: 'uppercase',
        }}>{t('hero.series')}</span>
        <span style={{ color: 'rgba(201,162,39,0.7)', fontSize: '7px' }}>◆</span>
      </div>

      {/* Title */}
      <div ref={titleRef} style={{ opacity: 0, marginBottom: '1.75rem' }}>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(3.8rem, 11vw, 9rem)',
          fontWeight: 300, lineHeight: 1.0,
          color: '#ffffff', margin: 0,
          textShadow: '0 0 80px rgba(124,58,237,0.35)',
          letterSpacing: '-0.02em',
        }}>
          Andrew
        </h1>
        <span style={{
          display: 'block',
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(3.8rem, 11vw, 9rem)',
          fontWeight: 700, lineHeight: 1.0, fontStyle: 'italic',
          background: 'linear-gradient(90deg, #8a6500, #f5e27d, #c9a227, #f5e27d, #8a6500)',
          backgroundSize: '300% auto',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: 'shimmer 6s linear infinite',
          letterSpacing: '-0.01em',
        }}>
          Myer
        </span>
      </div>

      {/* Subtitle */}
      <p ref={subtitleRef} style={{
        fontFamily: "'Raleway', sans-serif",
        fontSize: 'clamp(0.78rem, 1.8vw, 0.98rem)',
        color: 'rgba(226,217,243,0.55)',
        maxWidth: '460px', lineHeight: 1.85,
        marginBottom: '2.75rem', opacity: 0,
        fontWeight: 300, letterSpacing: '0.04em', whiteSpace: 'pre-line',
      }}>
        {t('hero.subtitle')}
      </p>

      {/* CTAs */}
      <div ref={ctaRef} style={{
        display: 'flex', gap: '1rem', flexWrap: 'wrap',
        justifyContent: 'center', opacity: 0,
      }}>
        <a href="#books" style={{
          padding: '0.95rem 2.4rem',
          background: 'linear-gradient(135deg, #5b21b6 0%, #c9a227 100%)',
          color: '#fff', borderRadius: '9999px', textDecoration: 'none',
          fontFamily: "'Raleway', sans-serif", fontWeight: 600,
          fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase',
          boxShadow: '0 0 40px rgba(91,33,182,0.5), 0 0 80px rgba(201,162,39,0.15)',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)'; e.currentTarget.style.boxShadow = '0 6px 60px rgba(91,33,182,0.7), 0 0 100px rgba(201,162,39,0.25)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(91,33,182,0.5), 0 0 80px rgba(201,162,39,0.15)'; }}>
          ✦ {t('hero.cta_books')}
        </a>
        <a href="#author" style={{
          padding: '0.95rem 2.4rem',
          background: 'rgba(7,0,31,0.5)',
          color: 'rgba(226,217,243,0.75)',
          border: '1px solid rgba(124,58,237,0.35)',
          borderRadius: '9999px', textDecoration: 'none',
          fontFamily: "'Raleway', sans-serif", fontWeight: 300,
          fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase',
          backdropFilter: 'blur(12px)', transition: 'all 0.3s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,162,39,0.5)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.35)'; e.currentTarget.style.color = 'rgba(226,217,243,0.75)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
          {t('hero.cta_author')}
        </a>
      </div>

      {/* Scroll indicator */}
      <div ref={scrollRef} style={{
        position: 'absolute', bottom: '2.5rem', left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
        opacity: 0,
      }}>
        <span style={{
          fontFamily: "'Raleway', sans-serif", fontSize: '8px',
          letterSpacing: '0.28em', textTransform: 'uppercase',
          color: 'rgba(201,162,39,0.45)',
        }}>{t('hero.scroll')}</span>
        <div style={{ width: '1px', height: '44px', background: 'rgba(201,162,39,0.2)', position: 'relative', overflow: 'hidden', borderRadius: '1px' }}>
          <div className="scroll-dot" style={{
            width: '3px', height: '10px',
            background: 'linear-gradient(to bottom, transparent, #c9a227)',
            borderRadius: '2px', position: 'absolute', left: '-1px', top: 0,
          }} />
        </div>
      </div>
    </>
  );
}
