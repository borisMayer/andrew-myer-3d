import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export default function AuthorSection() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef   = useRef<HTMLDivElement>(null);
  const textRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(photoRef.current,
        { opacity: 0, x: -50, filter: 'blur(8px)' },
        { opacity: 1, x: 0, filter: 'blur(0px)', duration: 1.4, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' } });
      gsap.fromTo(textRef.current,
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 1.4, ease: 'power3.out', delay: 0.2,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const tags = t('author.tags', { returnObjects: true }) as string[];

  return (
    <section id="author" ref={sectionRef} style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      padding: 'clamp(5rem,9vw,9rem) clamp(1.5rem,5vw,6rem)',
      pointerEvents: 'auto',
    }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
        <p style={{ color: '#c9a227', fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '3.5rem', fontFamily: "'Raleway', sans-serif" }}>
          ◆ {t('author.label')}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '4rem', alignItems: 'center' }}>
          {/* Photo */}
          <div ref={photoRef}>
            <div style={{
              position: 'relative', width: '100%', maxWidth: '340px',
              aspectRatio: '3/4', borderRadius: '1.75rem', overflow: 'hidden',
              background: 'linear-gradient(135deg, #12062a, #07001f)',
              border: '1px solid rgba(124,58,237,0.25)',
              boxShadow: '0 0 50px rgba(124,58,237,0.18), 0 0 100px rgba(201,162,39,0.08)',
            }}>
              {/* Placeholder — replace with <img src="/author-photo.jpg" ... /> */}
              <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'1.2rem', opacity: 0.4 }}>
                <div style={{ width:'72px', height:'72px', borderRadius:'50%', background:'rgba(124,58,237,0.3)', border:'2px solid rgba(124,58,237,0.4)' }} />
                <div style={{ width:'110px', height:'150px', background:'rgba(124,58,237,0.12)', borderRadius:'4px' }} />
              </div>
              <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 35% 20%, rgba(124,58,237,0.12) 0%, transparent 55%)', pointerEvents:'none' }} />
              {/* Corner accents */}
              {[[{top:'1.2rem',right:'1.2rem'},{borderTop:'1.5px solid rgba(201,162,39,0.5)',borderRight:'1.5px solid rgba(201,162,39,0.5)'}],[{bottom:'1.2rem',left:'1.2rem'},{borderBottom:'1.5px solid rgba(201,162,39,0.5)',borderLeft:'1.5px solid rgba(201,162,39,0.5)'}]].map(([pos,bord],i) => (
                <div key={i} style={{ position:'absolute', width:'32px', height:'32px', ...pos as React.CSSProperties, ...bord as React.CSSProperties }} />
              ))}
            </div>
            <p style={{ marginTop:'0.9rem', color:'rgba(226,217,243,0.35)', fontSize:'11px', letterSpacing:'0.12em', fontFamily:"'Raleway', sans-serif", textAlign:'center' }}>
              {t('author.photo_caption')}
            </p>
          </div>

          {/* Text */}
          <div ref={textRef}>
            <h2 style={{ fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:'clamp(2rem,4vw,3.2rem)', fontWeight:300, color:'#ffffff', lineHeight:1.2, marginBottom:'1.75rem' }}>
              {t('author.title').split(t('author.title_em')).map((part, i, arr) => (
                <span key={i}>{part}{i < arr.length - 1 && <em style={{ color:'#c9a227' }}>{t('author.title_em')}</em>}</span>
              ))}
            </h2>

            <div style={{ display:'flex', flexDirection:'column', gap:'1.1rem', color:'rgba(226,217,243,0.7)', lineHeight:1.85, fontSize:'0.97rem', fontFamily:"'Raleway', sans-serif", fontWeight:300 }}>
              <p>{t('author.bio_1')}</p>
              <p>{t('author.bio_2')}</p>
              <p>{t('author.bio_3')}</p>
            </div>

            {/* Quote */}
            <blockquote style={{
              marginTop:'2.2rem', padding:'1.3rem 1.8rem',
              borderLeft:'2px solid rgba(201,162,39,0.55)',
              background:'rgba(201,162,39,0.04)',
              borderRadius:'0 1rem 1rem 0',
            }}>
              <p style={{ fontFamily:"'Cormorant Garamond', Georgia, serif", color:'rgba(201,162,39,0.88)', fontSize:'1.05rem', fontStyle:'italic', lineHeight:1.65 }}>
                {t('author.quote')}
              </p>
              <cite style={{ display:'block', marginTop:'0.6rem', color:'rgba(201,162,39,0.45)', fontSize:'11px', letterSpacing:'0.16em', textTransform:'uppercase', fontStyle:'normal', fontFamily:"'Raleway', sans-serif" }}>
                — Andrew Myer
              </cite>
            </blockquote>

            {/* Tags */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:'0.65rem', marginTop:'1.8rem' }}>
              {tags.map(tag => (
                <span key={tag} style={{
                  padding:'0.35rem 0.9rem', borderRadius:'9999px',
                  border:'1px solid rgba(124,58,237,0.28)',
                  color:'rgba(124,58,237,0.85)', fontSize:'11px', letterSpacing:'0.05em',
                  fontFamily:"'Raleway', sans-serif", background:'rgba(124,58,237,0.07)',
                }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
