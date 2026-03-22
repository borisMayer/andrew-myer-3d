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

// Lazy load 3D scene for performance
const HeroScene = lazy(() => import('./components/3d/HeroScene'));

// Detect WebGL support
function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

// Loading screen
function LoadingScreen() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: '#020008',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: '1.5rem',
    }}>
      <div style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize:   '2rem', fontWeight: 300, color: '#c9a227',
        animation:  'pulseGlow 2s ease-in-out infinite',
        letterSpacing: '0.1em',
      }}>
        ◈
      </div>
      <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: '11px', letterSpacing: '0.3em', color: 'rgba(226,217,243,0.5)', textTransform: 'uppercase' }}>
        Abriendo el portal...
      </p>
      {/* Loading bar */}
      <div style={{ width: '120px', height: '1px', background: 'rgba(201,162,39,0.2)', borderRadius: '1px', overflow: 'hidden' }}>
        <div style={{
          height: '100%', background: 'linear-gradient(90deg, #7c3aed, #c9a227)',
          borderRadius: '1px',
          animation: 'shimmer 1.5s ease-in-out infinite',
          backgroundSize: '200% 100%',
        }} />
      </div>
    </div>
  );
}

export default function App() {
  const [mouseX,     setMouseX]     = useState(0);
  const [mouseY,     setMouseY]     = useState(0);
  const [scrollY,    setScrollY]    = useState(0);
  const [showBooks,  setShowBooks]  = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [loaded,     setLoaded]     = useState(false);
  const [webgl,      setWebgl]      = useState(true);
  const [isMobile,   setIsMobile]   = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check WebGL and mobile
    setWebgl(hasWebGL());
    setIsMobile(window.innerWidth < 768 || /Android|iPhone|iPad/i.test(navigator.userAgent));

    // Simulate loading
    const timer = setTimeout(() => setLoaded(true), 1200);

    // Mouse tracking
    const onMouse = (e: MouseEvent) => {
      setMouseX((e.clientX / window.innerWidth  - 0.5) * 2);
      setMouseY((e.clientY / window.innerHeight - 0.5) * 2);
    };

    // Scroll tracking
    const onScroll = () => {
      const s = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      setScrollY(s);
      // Show books when scrolled to books section
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

  // Fallback: mobile 2D
  if (isMobile || !webgl) {
    const MobileFallback = lazy(() => import('./components/ui/MobileWarning'));
    return (
      <Suspense fallback={<LoadingScreen />}>
        <MobileFallback />
      </Suspense>
    );
  }

  return (
    <div style={{ background: '#020008', minHeight: '100vh' }}>
      {!loaded && <LoadingScreen />}

      {/* Fixed 3D canvas — background layer */}
      <Suspense fallback={null}>
        <HeroScene
          mouseX={mouseX}
          mouseY={mouseY}
          scrollY={scrollY}
          onSelect={setSelectedBook}
          showBooks={showBooks}
        />
      </Suspense>

      {/* Fixed navigation */}
      <Navigation />

      {/* Scrollable content — sits on top of 3D */}
      <div ref={contentRef} style={{ position: 'relative', zIndex: 10 }}>
        {/* Sections are spacers + overlays */}
        <HeroSection />

        {/* Spacer so the 3D scene has room */}
        <div style={{ height: '20vh' }} />

        <AuthorSection />

        <div style={{ height: '10vh' }} />

        <BooksSection onSelectBook={setSelectedBook} />

        {/* Footer */}
        <footer style={{
          padding:    '4rem 2rem',
          textAlign:  'center',
          borderTop:  '1px solid rgba(124,58,237,0.15)',
          background: 'rgba(2,0,8,0.8)',
          backdropFilter: 'blur(20px)',
        }}>
          <p style={{
            fontFamily:   "'Cormorant Garamond', Georgia, serif",
            fontSize:     '1.5rem',
            fontWeight:   300,
            color:        '#c9a227',
            marginBottom: '0.5rem',
          }}>
            Andrew Myer
          </p>
          <p style={{
            fontFamily:  "'Raleway', sans-serif",
            fontSize:    '12px',
            letterSpacing: '0.15em',
            color:       'rgba(226,217,243,0.35)',
            textTransform: 'uppercase',
          }}>
            Navegando por el Océano del Infinito
          </p>
          <p style={{ marginTop: '1.5rem', color: 'rgba(226,217,243,0.25)', fontSize: '12px', fontFamily: "'Raleway', sans-serif" }}>
            © {new Date().getFullYear()} Andrew Myer. Todos los derechos reservados.
          </p>
        </footer>
      </div>

      {/* Book detail modal */}
      {selectedBook && (
        <BookModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </div>
  );
}
