import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AuthorSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef     = useRef<HTMLDivElement>(null);
  const textRef    = useRef<HTMLDivElement>(null);
  const quoteRef   = useRef<HTMLQuoteElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image reveal
      gsap.fromTo(imgRef.current,
        { opacity: 0, x: -60, filter: 'blur(20px)' },
        {
          opacity: 1, x: 0, filter: 'blur(0px)', duration: 1.4, ease: 'power3.out',
          scrollTrigger: { trigger: imgRef.current, start: 'top 80%', once: true },
        }
      );
      // Text reveal
      const textEls = textRef.current?.querySelectorAll('p, h2');
      if (!textEls) return;
      gsap.fromTo(textEls,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power2.out', stagger: 0.15,
          scrollTrigger: { trigger: textRef.current, start: 'top 80%', once: true },
        }
      );
      // Quote
      gsap.fromTo(quoteRef.current,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out',
          scrollTrigger: { trigger: quoteRef.current, start: 'top 85%', once: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const milestones = [
    { icon: '🌊', label: 'Experiencia cercana a la muerte', year: '2020' },
    { icon: '✝️', label: 'Formado en Teología',            year: 'Académico' },
    { icon: '🧠', label: 'Filosofía y Psicología',         year: 'Académico' },
    { icon: '📖', label: 'Autor de la serie fundacional',  year: '2021–' },
  ];

  return (
    <section
      id="author"
      ref={sectionRef}
      className="section-overlay"
      style={{
        minHeight:    '100vh',
        padding:      'clamp(4rem, 10vh, 8rem) clamp(1.5rem, 5vw, 6rem)',
        display:      'flex',
        alignItems:   'center',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>

        {/* Section label */}
        <p style={{ color: '#c9a227', fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '1rem', fontFamily: "'Raleway', sans-serif" }}>
          ◆ El Autor
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>

          {/* Photo placeholder */}
          <div ref={imgRef}>
            <div
              style={{
                width:        '100%',
                maxWidth:     '380px',
                aspectRatio:  '3/4',
                borderRadius: '16px',
                background:   'linear-gradient(135deg, #1a0a3d 0%, #07001f 60%, #2d1b69 100%)',
                border:       '1px solid rgba(124,58,237,0.3)',
                boxShadow:    '0 0 60px rgba(124,58,237,0.2)',
                display:      'flex',
                flexDirection:'column',
                alignItems:   'center',
                justifyContent: 'center',
                gap:          '1rem',
                position:     'relative',
                overflow:     'hidden',
              }}
            >
              {/* Replace this div with <img src="/author-photo.jpg" /> */}
              <div style={{ fontSize: '80px', opacity: 0.4 }}>◈</div>
              <p style={{ color: 'rgba(201,162,39,0.5)', fontSize: '12px', letterSpacing: '0.15em', fontFamily: "'Raleway', sans-serif" }}>
                ANDREW MYER
              </p>
              {/* Decorative corner lines */}
              {[
                { top: '16px',   left:  '16px',  borderTop:  '1px solid rgba(201,162,39,0.4)', borderLeft: '1px solid rgba(201,162,39,0.4)', width: '30px', height: '30px' },
                { top: '16px',   right: '16px',  borderTop:  '1px solid rgba(201,162,39,0.4)', borderRight:'1px solid rgba(201,162,39,0.4)', width: '30px', height: '30px' },
                { bottom:'16px', left:  '16px',  borderBottom:'1px solid rgba(201,162,39,0.4)',borderLeft: '1px solid rgba(201,162,39,0.4)', width: '30px', height: '30px' },
                { bottom:'16px', right: '16px',  borderBottom:'1px solid rgba(201,162,39,0.4)',borderRight:'1px solid rgba(201,162,39,0.4)', width: '30px', height: '30px' },
              ].map((s, i) => (
                <div key={i} style={{ position: 'absolute', ...s }} />
              ))}
            </div>

            {/* Milestones */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '1.5rem', maxWidth: '380px' }}>
              {milestones.map(m => (
                <div key={m.label} style={{
                  background: 'rgba(13,7,40,0.7)', border: '1px solid rgba(124,58,237,0.2)',
                  borderRadius: '10px', padding: '12px',
                  backdropFilter: 'blur(10px)',
                }}>
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>{m.icon}</div>
                  <div style={{ color: '#ffffff', fontSize: '12px', fontWeight: 500, lineHeight: 1.3, fontFamily: "'Raleway', sans-serif" }}>{m.label}</div>
                  <div style={{ color: '#c9a227', fontSize: '11px', marginTop: '2px', fontFamily: "'Raleway', sans-serif" }}>{m.year}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Text content */}
          <div ref={textRef}>
            <h2 style={{
              fontFamily:   "'Cormorant Garamond', Georgia, serif",
              fontSize:     'clamp(2.2rem, 5vw, 3.5rem)',
              fontWeight:   300,
              color:        '#ffffff',
              lineHeight:   1.2,
              marginBottom: '1.5rem',
            }}>
              Una vida en el<br />
              <span style={{
                background: 'linear-gradient(90deg, #c9a227, #f5e27d, #c9a227)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'shimmer 4s linear infinite',
              }}>
                umbral del infinito
              </span>
            </h2>

            {/* Bio — real text from Amazon */}
            {[
              'Andrew Myer experimentó una conexión profunda con el mundo espiritual desde temprana edad.',
              'Su experiencia cercana a la muerte durante la pandemia de COVID-19 le reveló verdades extraordinarias sobre las realidades más allá del mundo físico.',
              'Formado en teología, filosofía y psicología, dedica su vida a compartir las enseñanzas recibidas del otro lado.',
            ].map((para, i) => (
              <p key={i} style={{
                color:        'rgba(226,217,243,0.8)',
                lineHeight:   1.9,
                marginBottom: '1rem',
                fontSize:     'clamp(0.9rem, 1.8vw, 1.05rem)',
                fontFamily:   "'Raleway', sans-serif",
                fontWeight:   300,
              }}>
                {i === 0 && <span style={{ color: '#c9a227', fontSize: '1.5em', fontFamily: "'Cormorant Garamond', serif", lineHeight: 1 }}>"</span>}
                {para}
              </p>
            ))}

            {/* Decorative quote */}
            <blockquote
              ref={quoteRef}
              style={{
                borderLeft:  '2px solid #c9a227',
                paddingLeft: '1.5rem',
                marginTop:   '2rem',
                fontFamily:  "'Cormorant Garamond', Georgia, serif",
                fontSize:    'clamp(1.1rem, 2.5vw, 1.4rem)',
                fontStyle:   'italic',
                color:       'rgba(226,217,243,0.9)',
                lineHeight:  1.6,
              }}
            >
              "Las verdades más profundas no se aprenden — se recuerdan desde el otro lado del velo."
              <footer style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#c9a227', fontStyle: 'normal', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                — Andrew Myer
              </footer>
            </blockquote>

            {/* Social / contact */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '2rem', flexWrap: 'wrap' }}>
              {[
                { label: 'Amazon', icon: '📚', href: 'https://amazon.com/author/andrewmyer' },
                { label: 'Goodreads', icon: '⭐', href: '#' },
              ].map(link => (
                <a key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '8px 16px', borderRadius: '9999px',
                    border: '1px solid rgba(201,162,39,0.3)',
                    color: 'rgba(201,162,39,0.8)',
                    textDecoration: 'none', fontSize: '13px',
                    fontFamily: "'Raleway', sans-serif",
                    transition: 'all 0.2s',
                    backdropFilter: 'blur(10px)',
                    background: 'rgba(13,7,40,0.5)',
                  }}
                >
                  <span>{link.icon}</span> {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
