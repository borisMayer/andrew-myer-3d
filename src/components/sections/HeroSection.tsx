import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function HeroSection() {
  const titleRef    = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 });
    tl.fromTo(titleRef.current,
      { opacity: 0, y: 40, filter: 'blur(20px)' },
      { opacity: 1, y: 0,  filter: 'blur(0px)',  duration: 1.6, ease: 'power3.out' }
    )
    .fromTo(subtitleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0,  duration: 1.2, ease: 'power2.out' },
      '-=0.8'
    )
    .fromTo(scrollRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: 'power1.out' },
      '-=0.4'
    );

    // Scroll indicator animation
    if (scrollRef.current) {
      gsap.to(scrollRef.current.querySelector('.scroll-dot'), {
        y: 12, duration: 1.2, repeat: -1, yoyo: true, ease: 'power1.inOut',
      });
    }
  }, []);

  return (
    <section
      className="section-overlay"
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 1.5rem',
      }}
    >
      {/* Series label */}
      <p className="font-body text-xs tracking-[0.3em] uppercase mb-6"
        style={{ color: '#c9a227', letterSpacing: '0.3em' }}>
        Navegando por el Océano del Infinito
      </p>

      {/* Main title */}
      <h1
        ref={titleRef}
        className="font-display"
        style={{
          fontSize:      'clamp(3rem, 8vw, 7rem)',
          fontWeight:    300,
          lineHeight:    1.1,
          color:         '#ffffff',
          marginBottom:  '1.5rem',
          textShadow:    '0 0 40px rgba(124,58,237,0.5), 0 0 80px rgba(124,58,237,0.2)',
          letterSpacing: '-0.02em',
        }}
      >
        Andrew<br />
        <span className="text-gold-shimmer italic">Myer</span>
      </h1>

      {/* Subtitle */}
      <p
        ref={subtitleRef}
        className="font-body"
        style={{
          fontSize:     'clamp(0.85rem, 2.5vw, 1.1rem)',
          color:        'rgba(226,217,243,0.7)',
          maxWidth:     '520px',
          lineHeight:   1.7,
          marginBottom: '3rem',
          fontWeight:   300,
          letterSpacing: '0.05em',
        }}
      >
        Autor espiritual y metafísico. Revelaciones del más allá.<br />
        Una obra que transforma la comprensión de la existencia.
      </p>

      {/* CTA buttons */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '4rem' }}>
        <a
          href="#books"
          style={{
            padding:        '0.875rem 2rem',
            background:     'linear-gradient(135deg, #7c3aed, #c9a227)',
            color:          '#ffffff',
            borderRadius:   '9999px',
            textDecoration: 'none',
            fontFamily:     "'Raleway', sans-serif",
            fontWeight:     600,
            fontSize:       '0.875rem',
            letterSpacing:  '0.08em',
            boxShadow:      '0 0 30px rgba(124,58,237,0.4)',
            transition:     'all 0.3s ease',
          }}
        >
          ✦ Explorar la Obra
        </a>
        <a
          href="#author"
          style={{
            padding:        '0.875rem 2rem',
            background:     'transparent',
            color:          'rgba(226,217,243,0.8)',
            border:         '1px solid rgba(124,58,237,0.4)',
            borderRadius:   '9999px',
            textDecoration: 'none',
            fontFamily:     "'Raleway', sans-serif",
            fontWeight:     400,
            fontSize:       '0.875rem',
            letterSpacing:  '0.08em',
            backdropFilter: 'blur(10px)',
            transition:     'all 0.3s ease',
          }}
        >
          Conocer al Autor
        </a>
      </div>

      {/* Scroll indicator */}
      <div ref={scrollRef} style={{ position: 'absolute', bottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: 'rgba(201,162,39,0.5)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: "'Raleway', sans-serif" }}>
          Descubre
        </span>
        <div style={{ width: '1px', height: '40px', background: 'rgba(201,162,39,0.3)', position: 'relative', overflow: 'hidden' }}>
          <div className="scroll-dot" style={{ width: '3px', height: '8px', background: '#c9a227', borderRadius: '2px', position: 'absolute', left: '-1px', top: 0 }} />
        </div>
      </div>
    </section>
  );
}
