import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation       from './components/ui/Navigation';
import HeroSection      from './components/sections/HeroSection';
import AuthorSection    from './components/sections/AuthorSection';
import ThoughtSection   from './components/sections/ThoughtSection';
import BooksSection     from './components/sections/BooksSection';
import ExcerptsSection  from './components/sections/ExcerptsSection';
import NewsletterContactSection from './components/sections/NewsletterContactSection';
import BookModal        from './components/ui/BookModal';
import type { Book }    from './lib/books';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

const HeroScene = lazy(() => import('./components/3d/HeroScene'));

function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
  } catch { return false; }
}

function LoadingScreen() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200, background: '#06060b',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.25rem',
    }}>
      <div style={{
        width: '40px', height: '40px',
        border: '1px solid rgba(180,155,90,0.15)',
        borderTop: '1px solid rgba(180,155,90,0.6)',
        borderRadius: '50%',
        animation: 'spin 1.2s linear infinite',
      }} />
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(180,155,90,0.4)' }}>
        Andrew Myer
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function App() {
  const { i18n } = useTranslation();
  const [mouseX,       setMouseX]       = useState(0);
  const [mouseY,       setMouseY]       = useState(0);
  const [scrollY,      setScrollY]      = useState(0);
  const [showBooks,    setShowBooks]    = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [loaded,       setLoaded]       = useState(false);
  const [webgl,        setWebgl]        = useState(true);
  const [isMobile,     setIsMobile]     = useState(false);

  useEffect(() => {
    setWebgl(hasWebGL());
    setIsMobile(window.innerWidth < 768);
    const timer = setTimeout(() => setLoaded(true), 1200);
    const onMouse  = (e: MouseEvent)  => { setMouseX((e.clientX / window.innerWidth - 0.5) * 2); setMouseY((e.clientY / window.innerHeight - 0.5) * 2); };
    const onScroll = () => { const s = window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight); setScrollY(s); setShowBooks(s > 0.38); };
    window.addEventListener('mousemove', onMouse,  { passive: true });
    window.addEventListener('scroll',    onScroll, { passive: true });
    return () => { clearTimeout(timer); window.removeEventListener('mousemove', onMouse); window.removeEventListener('scroll', onScroll); };
  }, []);

  if (isMobile || !webgl) {
    const MobileFallback = lazy(() => import('./components/ui/MobileWarning'));
    return <Suspense fallback={<LoadingScreen />}><MobileFallback /></Suspense>;
  }

  return (
    <div style={{ background: 'var(--ink-900)', minHeight: '100vh' }}>
      {!loaded && <LoadingScreen />}

      {/* 3D canvas — fixed background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 1 }}>
        <Suspense fallback={null}>
          <HeroScene mouseX={mouseX} mouseY={mouseY} scrollY={scrollY} onSelect={setSelectedBook} showBooks={showBooks} />
        </Suspense>
      </div>

      {/* Navigation — fixed */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}>
        <Navigation />
      </div>

      {/* Scrollable content */}
      <div style={{ position: 'relative', zIndex: 10 }}>

        {/* Hero — full height */}
        <section style={{
          height: '100vh', display: 'flex', alignItems: 'center',
          padding: '0', pointerEvents: 'none',
        }}>
          <div style={{ pointerEvents: 'auto', width: '100%' }}>
            <HeroSection />
          </div>
        </section>

        {/* Glass overlay for content below hero */}
        <div style={{ background: 'linear-gradient(to bottom, transparent, rgba(6,6,11,0.96) 8%)' }}>
          <AuthorSection />
          <ThoughtSection />
          <section id="books" style={{ pointerEvents: 'auto' }}>
            <BooksSection onSelectBook={setSelectedBook} />
          </section>
          <ExcerptsSection />
          <NewsletterContactSection />

          {/* Footer */}
          <footer style={{
            padding: '4rem var(--space-gutter)',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            pointerEvents: 'auto',
          }}>
            <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'rgba(220,215,205,0.7)', marginBottom: '0.3rem' }}>
                  Andrew Myer
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(180,155,90,0.4)' }}>
                  Ph.D. Teología · M.A. Filosofía · Lic. Psicología
                </p>
              </div>
              <div style={{ display: 'flex', gap: '2rem' }}>
                {['Amazon', 'Academia.edu', 'ORCID'].map(l => (
                  <a key={l} href="#" style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.12em', color: 'rgba(155,160,170,0.35)', textDecoration: 'none', transition: 'color 0.25s', textTransform: 'uppercase' }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'rgba(180,155,90,0.6)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(155,160,170,0.35)'; }}>
                    {l}
                  </a>
                ))}
              </div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em', color: 'rgba(120,120,130,0.35)', textTransform: 'uppercase' }}>
                © {new Date().getFullYear()} Andrew Myer
              </p>
            </div>
          </footer>
        </div>
      </div>

      {selectedBook && <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />}
    </div>
  );
}
