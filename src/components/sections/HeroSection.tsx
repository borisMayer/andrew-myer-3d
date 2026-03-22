import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function HeroSection() {
  const badgeRef    = useRef<HTMLDivElement>(null);
  const titleRef    = useRef<HTMLHeadingElement>(null);
  const nameRef     = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);
  const scrollRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 1.2 });
    tl
      .fromTo(badgeRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' })
      .fromTo(titleRef.current,
        { opacity: 0, y: 50, filter: 'blur(15px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.6, ease: 'power3.out' }, '-=0.4')
      .fromTo(nameRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' }, '-=1.0')
      .fromTo(subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, '-=0.6')
      .fromTo(ctaRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.5')
      .fromTo(scrollRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6 }, '-=0.2');

    // Scroll dot animation
    gsap.to('.scroll-dot', {
      y: 14, duration: 1.4, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2,
    });
  }, []);

  return (
    <>
      {/* Series badge */}
      <div ref={badgeRef} style={{
        marginBottom: '1.5rem', opacity: 0,
        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.375rem 1.25rem',
        border: '1px solid rgba(201,162,39,0.35)',
        borderRadius: '9999px',
        background: 'rgba(201,162,39,0.06)',
        backdropFilter: 'blur(10px)',
      }}>
        <span style={{ color: '#c9a227', fontSize: '8px' }}>◆</span>
        <span style={{
          fontFamily: "'Raleway', sans-serif", fontSize: '10px',
          letterSpacing: '0.25em', color: 'rgba(201,162,39,0.85)',
          textTransform: 'uppercase',
        }}>
          Navegando por el Océano del Infinito
        </span>
        <span style={{ color: '#c9a227', fontSize: '8px' }}>◆</span>
      </div>

      {/* Main title */}
      <h1 ref={titleRef} style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: 'clamp(3.5rem, 10vw, 8rem)',
        fontWeight: 300, lineHeight: 1.05,
        color: '#ffffff', marginBottom: '0.5rem', opacity: 0,
        textShadow: '0 0 80px rgba(124,58,237,0.4)',
        letterSpacing: '-0.02em',
      }}>
        Andrew
      </h1>

      {/* Shimmer name */}
      <span ref={nameRef} style={{
        display: 'block',
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: 'clamp(3.5rem, 10vw, 8rem)',
        fontWeight: 700, lineHeight: 1.05,
        marginBottom: '2rem', opacity: 0,
        fontStyle: 'italic',
        background: 'linear-gradient(90deg, #a67c00, #f5e27d, #c9a227, #f5e27d, #a67c00)',
        backgroundSize: '300% auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: 'shimmer 5s linear infinite',
        letterSpacing: '-0.01em',
      }}>
        Myer
      </span>

      {/* Subtitle */}
      <p ref={subtitleRef} style={{
        fontFamily: "'Raleway', sans-serif",
        fontSize: 'clamp(0.8rem, 2vw, 1rem)',
        color: 'rgba(226,217,243,0.6)',
        maxWidth: '480px', lineHeight: 1.8,
        marginBottom: '3rem', opacity: 0,
        fontWeight: 300, letterSpacing: '0.04em',
      }}>
        Autor espiritual y metafísico.<br />
        Revelaciones del más allá que transforman la comprensión de la existencia.
      </p>

      {/* CTA buttons */}
      <div ref={ctaRef} style={{
        display: 'flex', gap: '1rem', flexWrap: 'wrap',
        justifyContent: 'center', marginBottom: '0', opacity: 0,
      }}>
        <a href="#books" style={{
          padding: '0.9rem 2.2rem',
          background: 'linear-gradient(135deg, #7c3aed 0%, #c9a227 100%)',
          color: '#ffffff', borderRadius: '9999px',
          textDecoration: 'none',
          fontFamily: "'Raleway', sans-serif", fontWeight: 600,
          fontSize: '0.8rem', letterSpacing: '0.1em',
          textTransform: 'uppercase',
          boxShadow: '0 0 40px rgba(124,58,237,0.5), 0 0 80px rgba(201,162,39,0.2)',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 0 60px rgba(124,58,237,0.7), 0 0 100px rgba(201,162,39,0.3)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(124,58,237,0.5), 0 0 80px rgba(201,162,39,0.2)'; }}>
          ✦ Explorar la Obra
        </a>
        <a href="#author" style={{
          padding: '0.9rem 2.2rem',
          background: 'rgba(7,0,31,0.6)',
          color: 'rgba(226,217,243,0.8)',
          border: '1px solid rgba(124,58,237,0.4)',
          borderRadius: '9999px', textDecoration: 'none',
          fontFamily: "'Raleway', sans-serif", fontWeight: 300,
          fontSize: '0.8rem', letterSpacing: '0.1em',
          textTransform: 'uppercase',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,162,39,0.6)'; e.currentTarget.style.color = '#fff'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)'; e.currentTarget.style.color = 'rgba(226,217,243,0.8)'; }}>
          Conocer al Autor
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
          fontFamily: "'Raleway', sans-serif", fontSize: '9px',
          letterSpacing: '0.25em', textTransform: 'uppercase',
          color: 'rgba(201,162,39,0.5)',
        }}>
          Descubre
        </span>
        <div style={{ width: '1px', height: '44px', background: 'rgba(201,162,39,0.25)', position: 'relative', overflow: 'hidden', borderRadius: '1px' }}>
          <div className="scroll-dot" style={{
            width: '3px', height: '10px',
            background: 'linear-gradient(to bottom, transparent, #c9a227)',
            borderRadius: '2px', position: 'absolute', left: '-1px', top: 0,
          }} />
        </div>
        <svg width="12" height="6" viewBox="0 0 12 6" fill="none">
          <path d="M1 1L6 5L11 1" stroke="rgba(201,162,39,0.5)" strokeWidth="1" strokeLinecap="round"/>
        </svg>
      </div>
    </>
  );
}
