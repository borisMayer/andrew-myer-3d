import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from './components/ui/Navigation';
import HeroSection from './components/sections/HeroSection';
import AuthorSection from './components/sections/AuthorSection';
import BooksSection from './components/sections/BooksSection';
import BookModal from './components/ui/BookModal';
import type { Book } from './lib/books';

gsap.registerPlugin(ScrollTrigger);

const HeroScene = lazy(() => import('./components/3d/HeroScene'));

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch { return false; }
}

function LoadingScreen() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: '#020008',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '1.5rem',
    }}>
      <div style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: '3rem', fontWeight: 300, color: '#c9a227',
        letterSpacing: '0.1em', textShadow: '0 0 40px rgba(201,162,39,0.8)',
      }}>◈</div>
      <p style={{
        fontFamily: "'Raleway', sans-serif", fontSize: '11px',
        letterSpacing: '0.3em', color: 'rgba(226,217,243,0.5)', textTransform: 'uppercase',
      }}>Abriendo el portal...</p>
      <div style={{ width: '120px', height: '1px', background: 'rgba(201,162,39,0.2)', borderRadius: '1px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, transparent, #c9a227, #7c3aed, transparent)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s ease-in-out infinite',
        }} />
      </div>
    </div>
  );
}

export default function App() {
  const [mouseX,       setMouseX]       = useState(0);
  const [mouseY,       setMouseY]       = useState(0);
  const [scrollY,      setScrollY]      = useState(0);
  const [showBooks,    setShowBooks]    = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [loaded,       setLoaded]       = useState(false);
  const [webgl,        setWebgl]        = useState(true);
  const [isMobile,     setIsMobile]     = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setWebgl(hasWebGL());
    setIsMobile(window.innerWidth < 768);
    const timer = setTimeout(() => setLoaded(true), 1400);

    const onMouse = (e: MouseEvent) => {
      setMouseX((e.clientX / window.innerWidth  - 0.5) * 2);
      setMouseY((e.clientY / window.innerHeight - 0.5) * 2);
    };
    const onScroll = () => {
      const s = window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setScrollY(s);
      setShowBooks(s > 0.35);
    };

    window.addEventListener('mousemove', onMouse,  { passive: true });
    window.addEventListener('scroll',    onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('scroll',    onScroll);
    };
  }, []);

  if (isMobile || !webgl) {
    const MobileFallback = lazy(() => import('./components/ui/MobileWarning'));
    return (
      <Suspense fallback={<LoadingScreen />}>
        <MobileFallback />
      </Suspense>
    );
  }

  return (
    <div style={{ background: '#020008', minHeight: '400vh' }}>
      {!loaded && <LoadingScreen />}

      {/* Fixed 3D canvas — z-index 1 */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 1 }}>
        <Suspense fallback={null}>
          <HeroScene
            mouseX={mouseX} mouseY={mouseY} scrollY={scrollY}
            onSelect={setSelectedBook} showBooks={showBooks}
          />
        </Suspense>
      </div>

      {/* Fixed navigation — z-index 50 */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}>
        <Navigation />
      </div>

      {/* Scrollable content — z-index 10, pointer-events none on wrapper */}
      <div ref={contentRef} style={{ position: 'relative', zIndex: 10 }}>

        {/* HERO — full viewport height */}
        <section style={{
          height: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '0 1.5rem',
          pointerEvents: 'none',
        }}>
          <HeroSection />
        </section>

        {/* Spacer */}
        <div style={{ height: '40vh' }} />

        {/* AUTHOR */}
        <section style={{ pointerEvents: 'auto' }}>
          <AuthorSection />
        </section>

        <div style={{ height: '20vh' }} />

        {/* BOOKS */}
        <section id="books" style={{ pointerEvents: 'auto' }}>
          <BooksSection onSelectBook={setSelectedBook} />
        </section>

        {/* FOOTER */}
        <footer style={{
          padding: '5rem 2rem', textAlign: 'center',
          background: 'linear-gradient(to top, rgba(2,0,8,0.98), rgba(7,0,31,0.9))',
          borderTop: '1px solid rgba(124,58,237,0.15)',
          backdropFilter: 'blur(20px)',
          pointerEvents: 'auto',
        }}>
          {/* Decorative line */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
            <div style={{ flex: 1, maxWidth: '120px', height: '1px', background: 'linear-gradient(to right, transparent, rgba(201,162,39,0.5))' }} />
            <span style={{ color: '#c9a227', fontSize: '1.2rem' }}>◆</span>
            <div style={{ flex: 1, maxWidth: '120px', height: '1px', background: 'linear-gradient(to left, transparent, rgba(201,162,39,0.5))' }} />
          </div>

          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '2rem', fontWeight: 300, color: '#c9a227', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
            Andrew Myer
          </p>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: '11px', letterSpacing: '0.3em', color: 'rgba(226,217,243,0.3)', textTransform: 'uppercase', marginBottom: '2rem' }}>
            Navegando por el Océano del Infinito
          </p>

          {/* Social / links placeholder */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
            {['Amazon', 'Goodreads', 'Contacto'].map(link => (
              <a key={link} href="#" style={{
                fontFamily: "'Raleway', sans-serif", fontSize: '12px',
                color: 'rgba(201,162,39,0.5)', textDecoration: 'none',
                letterSpacing: '0.1em', transition: 'color 0.3s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#c9a227')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(201,162,39,0.5)')}>
                {link}
              </a>
            ))}
          </div>

          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: '11px', color: 'rgba(226,217,243,0.2)' }}>
            © {new Date().getFullYear()} Andrew Myer. Todos los derechos reservados.
          </p>
        </footer>
      </div>

      {/* Book modal — z-index 100 */}
      {selectedBook && (
        <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </div>
  );
}
