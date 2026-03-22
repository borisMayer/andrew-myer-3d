import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';

export default function HeroSection() {
  const { t } = useTranslation();
  const eyebrowRef  = useRef<HTMLDivElement>(null);
  const titleRef    = useRef<HTMLHeadingElement>(null);
  const lineRef     = useRef<HTMLDivElement>(null);
  const credRef     = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);
  const scrollRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 1.0 });
    tl
      .fromTo(eyebrowRef.current,  { opacity:0, y:-8 }, { opacity:1, y:0, duration:0.7, ease:'power2.out' })
      .fromTo(titleRef.current,    { opacity:0, y:32, filter:'blur(8px)' }, { opacity:1, y:0, filter:'blur(0px)', duration:1.4, ease:'power3.out' }, '-=0.3')
      .fromTo(lineRef.current,     { scaleX:0 }, { scaleX:1, duration:0.9, ease:'power2.inOut', transformOrigin:'left center' }, '-=0.7')
      .fromTo(credRef.current,     { opacity:0, y:8 }, { opacity:1, y:0, duration:0.7, ease:'power2.out' }, '-=0.5')
      .fromTo(subtitleRef.current, { opacity:0, y:12 }, { opacity:1, y:0, duration:0.9, ease:'power2.out' }, '-=0.4')
      .fromTo(ctaRef.current,      { opacity:0, y:10 }, { opacity:1, y:0, duration:0.7, ease:'power2.out' }, '-=0.4')
      .fromTo(scrollRef.current,   { opacity:0 }, { opacity:1, duration:0.5 }, '-=0.2');
    gsap.to('.scroll-dot', { y:12, duration:1.6, repeat:-1, yoyo:true, ease:'sine.inOut', delay:3 });
  }, []);

  const credentials = [
    { degree: 'Dr.', field: 'Teología Reformada' },
    { degree: 'M.Sc.', field: 'Ingeniería Industrial' },
    { degree: 'Lic.', field: 'Psicología Clínica' },
  ];

  return (
    <div style={{ width:'100%', maxWidth:'820px', textAlign:'left', padding:'0 var(--space-gutter)' }}>

      {/* Discipline classification */}
      <div ref={eyebrowRef} style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'1.75rem', opacity:0 }}>
        <span style={{ width:'24px', height:'1px', background:'rgba(180,155,90,0.4)', display:'inline-block' }} />
        <span style={{ fontFamily:'var(--font-mono)', fontSize:'9px', letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(180,155,90,0.65)' }}>
          {t('hero.series')}
        </span>
      </div>

      {/* Name */}
      <h1 ref={titleRef} style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(3.5rem, 9.5vw, 8rem)',
        fontWeight: 400, lineHeight: 1.0,
        color: 'rgba(238,232,220,0.97)',
        letterSpacing: '-0.025em',
        marginBottom: '1.5rem', opacity: 0,
      }}>
        Andrew Myer
      </h1>

      {/* Rule */}
      <div ref={lineRef} style={{
        width:'100%', height:'1px', marginBottom:'1rem',
        background:'linear-gradient(to right, rgba(180,155,90,0.5), rgba(180,155,90,0.08), transparent)',
        transformOrigin:'left center',
      }} />

      {/* Credentials row */}
      <div ref={credRef} style={{ display:'flex', flexWrap:'wrap', gap:'1.5rem', marginBottom:'1.75rem', opacity:0 }}>
        {credentials.map(c => (
          <span key={c.degree} style={{ display:'flex', alignItems:'baseline', gap:'5px' }}>
            <span style={{ fontFamily:'var(--font-mono)', fontSize:'9px', color:'rgba(180,155,90,0.75)', letterSpacing:'0.1em' }}>{c.degree}</span>
            <span style={{ fontFamily:'var(--font-sans)', fontSize:'11px', color:'rgba(160,165,175,0.6)', letterSpacing:'0.04em', fontWeight:300 }}>{c.field}</span>
          </span>
        ))}
        <span style={{ display:'flex', alignItems:'baseline', gap:'5px' }}>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:'9px', color:'rgba(130,140,160,0.5)', letterSpacing:'0.08em' }}>Chile · Europa</span>
        </span>
      </div>

      {/* Subtitle */}
      <p ref={subtitleRef} style={{
        fontFamily: 'var(--font-serif)', fontSize: 'clamp(1rem, 2.2vw, 1.2rem)',
        fontWeight: 400, fontStyle: 'italic',
        color: 'rgba(195,190,178,0.65)', maxWidth: '580px',
        lineHeight: 1.75, marginBottom: '2.5rem', opacity: 0,
      }}>
        {t('hero.subtitle')}
      </p>

      {/* CTAs */}
      <div ref={ctaRef} style={{ display:'flex', gap:'0.85rem', flexWrap:'wrap', opacity:0 }}>
        <a href="#books" style={{
          padding:'0.75rem 1.75rem',
          background:'rgba(180,155,90,0.1)', border:'1px solid rgba(180,155,90,0.4)',
          color:'rgba(195,168,80,0.9)', borderRadius:'2px', textDecoration:'none',
          fontFamily:'var(--font-sans)', fontWeight:500, fontSize:'10px',
          letterSpacing:'0.14em', textTransform:'uppercase', transition:'all 0.25s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background='rgba(180,155,90,0.18)'; e.currentTarget.style.borderColor='rgba(180,155,90,0.65)'; }}
        onMouseLeave={e => { e.currentTarget.style.background='rgba(180,155,90,0.1)'; e.currentTarget.style.borderColor='rgba(180,155,90,0.4)'; }}>
          {t('hero.cta_books')}
        </a>
        <a href="#author" style={{
          padding:'0.75rem 1.75rem',
          background:'transparent', border:'1px solid rgba(255,255,255,0.09)',
          color:'rgba(160,165,175,0.6)', borderRadius:'2px', textDecoration:'none',
          fontFamily:'var(--font-sans)', fontWeight:300, fontSize:'10px',
          letterSpacing:'0.14em', textTransform:'uppercase', transition:'all 0.25s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.22)'; e.currentTarget.style.color='rgba(200,200,210,0.85)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.09)'; e.currentTarget.style.color='rgba(160,165,175,0.6)'; }}>
          {t('hero.cta_author')}
        </a>
      </div>

      {/* Scroll indicator */}
      <div ref={scrollRef} style={{ position:'absolute', bottom:'2.5rem', left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:'6px', opacity:0 }}>
        <div style={{ width:'1px', height:'38px', background:'rgba(180,155,90,0.18)', position:'relative', overflow:'hidden' }}>
          <div className="scroll-dot" style={{ width:'2px', height:'8px', background:'linear-gradient(to bottom, transparent, rgba(180,155,90,0.65))', position:'absolute', left:'-0.5px', top:0 }} />
        </div>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:'7px', letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(180,155,90,0.3)' }}>
          {t('hero.scroll')}
        </span>
      </div>
    </div>
  );
}
