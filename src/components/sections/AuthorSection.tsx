import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export default function AuthorSection() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const tags = t('author.tags', { returnObjects: true }) as string[];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.author-photo', { opacity:0, x:-40 }, { opacity:1, x:0, duration:1.2, ease:'power3.out', scrollTrigger: { trigger: sectionRef.current, start:'top 70%' } });
      gsap.fromTo('.author-text',  { opacity:0, x:40  }, { opacity:1, x:0, duration:1.2, ease:'power3.out', delay:0.15, scrollTrigger: { trigger: sectionRef.current, start:'top 70%' } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="author" ref={sectionRef} style={{
      padding: 'var(--space-section) var(--space-gutter)',
      pointerEvents: 'auto',
    }}>
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', width: '100%' }}>

        {/* Section header */}
        <div className="section-rule">
          <span className="label-tag">{t('author.label')}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '4rem', alignItems: 'start' }}>

          {/* Photo */}
          <div className="author-photo">
            <div style={{
              position: 'relative', width: '100%', maxWidth: '320px',
              aspectRatio: '4/5', borderRadius: '2px', overflow: 'hidden',
              background: 'rgba(16,16,22,0.9)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              {/* Author photo */}
              <img
                src="/author-photo.jpg"
                alt="Andrew Myer"
                loading="lazy"
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover', objectPosition: 'center top',
                  display: 'block',
                }}
              />
              {/* Thin gold border accent bottom */}
              <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'2px', background:'linear-gradient(to right, transparent, rgba(180,155,90,0.4), transparent)' }} />
            </div>

            {/* Caption */}
            <div style={{ marginTop:'1rem', paddingLeft:'2px' }}>
              <p style={{ fontFamily:'var(--font-serif)', fontSize:'1rem', color:'rgba(220,215,205,0.7)', fontStyle:'italic' }}>
                Andrew Myer
              </p>
              <p style={{ fontFamily:'var(--font-mono)', fontSize:'9px', letterSpacing:'0.15em', color:'rgba(180,155,90,0.5)', marginTop:'3px', textTransform:'uppercase' }}>
                Ph.D. Th. · M.A. Phil. · Lic. Psy.
              </p>
            </div>
          </div>

          {/* Text */}
          <div className="author-text">
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              fontWeight: 400, color: 'rgba(235,228,215,0.95)',
              lineHeight: 1.15, marginBottom: '2rem',
            }}>
              {t('author.title')}
            </h2>

            <div style={{ display:'flex', flexDirection:'column', gap:'1.4rem' }}>
              {(['author.bio_1','author.bio_2','author.bio_3'] as const).map((key, i) => (
                <p key={i} style={{
                  fontFamily: 'var(--font-sans)', fontWeight: 300,
                  fontSize: 'clamp(0.875rem, 1.3vw, 0.95rem)',
                  color: 'rgba(185,180,170,0.78)',
                  lineHeight: 1.9,
                  margin: 0,
                  // Subtle first-letter treatment on first paragraph
                  ...(i === 0 ? {} : {}),
                }}>
                  {t(key)}
                </p>
              ))}
            </div>

            {/* Quote — typographic pullquote */}
            <blockquote style={{
              margin: '2rem 0 0', padding: '1.25rem 0 1.25rem 1.5rem',
              borderLeft: '2px solid rgba(180,155,90,0.35)',
            }}>
              <p style={{
                fontFamily: 'var(--font-serif)', fontSize: '1.05rem',
                fontStyle: 'italic', color: 'rgba(200,190,165,0.8)', lineHeight: 1.7,
              }}>
                {t('author.quote')}
              </p>
              <cite style={{
                display: 'block', marginTop: '0.6rem',
                fontFamily: 'var(--font-mono)', fontSize: '9px',
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: 'rgba(180,155,90,0.45)', fontStyle: 'normal',
              }}>
                — Andrew Myer
              </cite>
            </blockquote>

            {/* Academic tags */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem', marginTop:'1.75rem' }}>
              {tags.map(tag => (
                <span key={tag} style={{
                  padding:'0.3rem 0.8rem', borderRadius:'2px',
                  border:'1px solid rgba(255,255,255,0.08)',
                  color:'rgba(160,165,175,0.6)', fontSize:'10px',
                  letterSpacing:'0.08em', fontFamily:'var(--font-sans)',
                  background:'rgba(255,255,255,0.02)',
                }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
