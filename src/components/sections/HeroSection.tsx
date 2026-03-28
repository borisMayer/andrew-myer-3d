import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';

export default function HeroSection() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');

  const containerRef = useRef<HTMLDivElement>(null);
  const eyebrowRef   = useRef<HTMLDivElement>(null);
  const preRef       = useRef<HTMLDivElement>(null);
  const titleRef     = useRef<HTMLHeadingElement>(null);
  const ruleRef      = useRef<HTMLDivElement>(null);
  const credRef      = useRef<HTMLDivElement>(null);
  const descRef      = useRef<HTMLParagraphElement>(null);
  const ctaRef       = useRef<HTMLDivElement>(null);
  const scrollRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.8 });
    tl
      .fromTo(eyebrowRef.current,  { opacity:0, letterSpacing:'0.4em' }, { opacity:1, letterSpacing:'0.22em', duration:1.2, ease:'power3.out' })
      .fromTo(preRef.current,      { opacity:0, x:-12 }, { opacity:1, x:0, duration:0.7, ease:'power2.out' }, '-=0.6')
      .fromTo(titleRef.current,    { opacity:0, y:40, filter:'blur(12px)' }, { opacity:1, y:0, filter:'blur(0px)', duration:1.6, ease:'power4.out' }, '-=0.5')
      .fromTo(ruleRef.current,     { scaleX:0, opacity:0 }, { scaleX:1, opacity:1, duration:1.1, ease:'expo.inOut', transformOrigin:'left center' }, '-=0.8')
      .fromTo(credRef.current,     { opacity:0 }, { opacity:1, duration:1.0, ease:'power2.out' }, '-=0.6')
      .fromTo(descRef.current,     { opacity:0, y:16 }, { opacity:1, y:0, duration:1.0, ease:'power2.out' }, '-=0.6')
      .fromTo(ctaRef.current,      { opacity:0, y:12 }, { opacity:1, y:0, duration:0.8, ease:'power2.out' }, '-=0.5')
      .fromTo(scrollRef.current,   { opacity:0 }, { opacity:0.35, duration:0.6 }, '-=0.2');

    // Continuous scroll indicator animation
    gsap.to('.scroll-pip', { y: 14, duration: 1.8, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 3 });
  }, []);

  const disciplines = isEn
    ? ['Reformed Theology', 'Lacanian Psychoanalysis', 'Logotherapy', 'Hebrew Spirituality']
    : ['Teología Reformada', 'Psicoanálisis Lacaniano', 'Logoterapia', 'Espiritualidad Hebrea'];

  return (
    <div ref={containerRef} style={{
      position: 'relative', height: '100vh', display: 'flex',
      alignItems: 'flex-end', justifyContent: 'flex-start',
      padding: 'clamp(3rem, 6vw, 5rem) clamp(2rem, 7vw, 7rem)',
      pointerEvents: 'none',
      zIndex: 2,
    }}>

      {/* Vertical rule — left edge accent */}
      <div style={{
        position: 'absolute', left: 'clamp(1.2rem, 3vw, 2.5rem)',
        top: '15%', bottom: '18%',
        width: '1px',
        background: 'linear-gradient(to bottom, transparent, rgba(180,155,90,0.5) 30%, rgba(180,155,90,0.5) 70%, transparent)',
      }} />

      <div style={{ maxWidth: 'min(640px, 90vw)', paddingLeft: 'clamp(1rem, 2vw, 1.5rem)' }}>

        {/* Eyebrow */}
        <div ref={eyebrowRef} style={{
          fontFamily: 'var(--font-mono)', fontSize: 'clamp(7px, 1.1vw, 9px)',
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'rgba(180,155,90,0.6)', marginBottom: '1rem',
          display: 'flex', alignItems: 'center', gap: '1rem',
          opacity: 0,
        }}>
          <span style={{ display: 'inline-block', width: '20px', height: '1px', background: 'rgba(180,155,90,0.5)' }} />
          {isEn ? 'Author · Scholar · Theologian' : 'Autor · Académico · Teólogo'}
          <span style={{ display: 'inline-block', width: '20px', height: '1px', background: 'rgba(180,155,90,0.5)' }} />
        </div>

        {/* Pre-name */}
        <div ref={preRef} style={{
          fontFamily: 'var(--font-serif)', fontSize: 'clamp(0.7rem, 1.2vw, 0.85rem)',
          color: 'rgba(180,155,90,0.7)', marginBottom: '0.2rem',
          fontStyle: 'italic', letterSpacing: '0.05em', opacity: 0,
        }}>
          Dr. · M.Sc. · Lic.
        </div>

        {/* Main title */}
        <h1 ref={titleRef} style={{
          fontFamily: 'var(--font-serif)', fontWeight: 400,
          fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
          lineHeight: 1.0,
          color: 'rgba(242,238,228,0.97)',
          margin: '0 0 1.4rem',
          letterSpacing: '-0.01em',
          opacity: 0,
        }}>
          Andrew<br />
          <span style={{ color: 'rgba(200,180,130,0.9)', fontStyle: 'italic' }}>Myer</span>
        </h1>

        {/* Golden rule */}
        <div ref={ruleRef} style={{
          height: '1px', width: '100%', marginBottom: '1.4rem',
          background: 'linear-gradient(to right, rgba(180,155,90,0.8), rgba(180,155,90,0.15) 60%, transparent)',
          opacity: 0,
        }} />

        {/* Disciplines — inline tags */}
        <div ref={credRef} style={{
          display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem', opacity: 0,
        }}>
          {disciplines.map((d, i) => (
            <span key={i} style={{
              fontFamily: 'var(--font-mono)', fontSize: 'clamp(7px, 1vw, 8.5px)',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'rgba(180,155,90,0.7)',
              padding: '3px 10px',
              border: '1px solid rgba(180,155,90,0.2)',
              borderRadius: '1px',
              background: 'rgba(180,155,90,0.05)',
            }}>{d}</span>
          ))}
        </div>

        {/* Interdisciplinary description */}
        <p ref={descRef} style={{
          fontFamily: 'var(--font-sans)', fontWeight: 300,
          fontSize: 'clamp(0.8rem, 1.3vw, 0.92rem)',
          color: 'rgba(175,168,155,0.72)', lineHeight: 1.85,
          marginBottom: '2rem', maxWidth: '520px', opacity: 0,
        }}>
          {isEn
            ? 'An interdisciplinary body of work integrating Reformed systematic theology, Lacanian psychoanalysis, and logotherapy into an original philosophical and spiritual synthesis.'
            : 'Obra interdisciplinaria que integra la teología sistemática reformada, el psicoanálisis lacaniano y la logoterapia en una propuesta filosófica y espiritual original.'}
        </p>

        {/* CTAs */}
        <div ref={ctaRef} style={{
          display: 'flex', gap: '0.75rem', flexWrap: 'wrap', opacity: 0, pointerEvents: 'all',
        }}>
          <a href="#books" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '0.7rem 1.6rem',
            background: 'rgba(180,155,90,0.18)',
            border: '1px solid rgba(180,155,90,0.55)',
            color: 'rgba(210,185,100,0.97)',
            fontFamily: 'var(--font-sans)', fontWeight: 500,
            fontSize: 'clamp(9px, 1.1vw, 11px)', letterSpacing: '0.12em', textTransform: 'uppercase',
            textDecoration: 'none', borderRadius: '1px',
            transition: 'all 0.25s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(180,155,90,0.3)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(180,155,90,0.18)'; }}>
            {isEn ? 'Explore Works' : 'Ver publicaciones'}
            <span style={{ fontSize: '14px', opacity: 0.7 }}>↓</span>
          </a>
          <a href="#about" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '0.7rem 1.4rem',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(175,168,155,0.65)',
            fontFamily: 'var(--font-sans)', fontWeight: 400,
            fontSize: 'clamp(9px, 1.1vw, 11px)', letterSpacing: '0.12em', textTransform: 'uppercase',
            textDecoration: 'none', borderRadius: '1px',
            transition: 'all 0.25s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'; e.currentTarget.style.color = 'rgba(210,205,195,0.8)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(175,168,155,0.65)'; }}>
            {isEn ? 'The Author' : 'El autor'}
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div ref={scrollRef} style={{
        position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
        opacity: 0,
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(160,155,145,0.5)' }}>
          {isEn ? 'Scroll' : 'Desplazar'}
        </span>
        <div style={{ width: '1px', height: '36px', background: 'rgba(180,155,90,0.2)', position: 'relative', overflow: 'hidden' }}>
          <div className="scroll-pip" style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '40%',
            background: 'linear-gradient(to bottom, rgba(180,155,90,0.7), transparent)',
          }} />
        </div>
      </div>

      {/* Book count badge — top right */}
      <div style={{
        position: 'absolute', top: 'clamp(2rem, 4vw, 3rem)', right: 'clamp(2rem, 5vw, 4rem)',
        display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px',
        pointerEvents: 'none',
      }}>
        <span style={{
          fontFamily: 'var(--font-serif)', fontStyle: 'italic',
          fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'rgba(180,155,90,0.15)',
          lineHeight: 1, fontWeight: 400,
        }}>5</span>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '7px', letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'rgba(160,155,145,0.35)',
        }}>{isEn ? 'published works' : 'obras publicadas'}</span>
      </div>
    </div>
  );
}
