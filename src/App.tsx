import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from './components/ui/Navigation';
import HeroSection from './components/sections/HeroSection';
import AuthorSection from './components/sections/AuthorSection';
import ThoughtSection from './components/sections/ThoughtSection';
import BooksSection from './components/sections/BooksSection';
import ExcerptsSection from './components/sections/ExcerptsSection';
import NewsletterContactSection from './components/sections/NewsletterContactSection';
import BookModal from './components/ui/BookModal';
import type { Book } from './lib/books';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

const HeroScene = lazy(() => import('./components/3d/HeroScene'));

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch { return false; }
}

function LoadingScreen() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200, background: '#020008',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem',
    }}>
      <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '3rem', fontWeight: 300, color: '#c9a227', letterSpacing: '0.1em', textShadow: '0 0 40px rgba(201,162,39,0.7)' }}>◈</div>
      <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: '10px', letterSpacing: '0.3em', color: 'rgba(226,217,243,0.4)', textTransform: 'uppercase' }}>Abriendo el portal...</p>
      <div style={{ width: '100px', height: '1px', background: 'rgba(201,162,39,0.15)', borderRadius: '1px', overflow: 'hidden' }}>
        <div style={{ height: '100%', background: 'linear-gradient(90deg, transparent, #c9a227, transparent)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s ease-in-out infinite' }} />
      </div>
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
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setWebgl(hasWebGL());
    setIsMobile(window.innerWidth < 768);
    const timer = setTimeout(() => setLoaded(true), 1400);
    const onMouse  = (e: MouseEvent)  => { setMouseX((e.clientX / window.innerWidth - 0.5) * 2); setMouseY((e.clientY / window.innerHeight - 0.5) * 2); };
    const onScroll = () => { const s = window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight); setScrollY(s); setShowBooks(s > 0.35); };
    window.addEventListener('mousemove', onMouse,  { passive: true });
    window.addEventListener('scroll',    onScroll, { passive: true });
    return () => { clearTimeout(timer); window.removeEventListener('mousemove', onMouse); window.removeEventListener('scroll', onScroll); };
  }, []);

  if (isMobile || !webgl) {
    const MobileFallback = lazy(() => import('./components/ui/MobileWarning'));
    return <Suspense fallback={<LoadingScreen />}><MobileFallback /></Suspense>;
  }

  return (
    <div style={{ background: '#020008', minHeight: '100vh' }}>
      {!loaded && <LoadingScreen />}

      {/* Fixed 3D canvas */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 1 }}>
        <Suspense fallback={null}>
          <HeroScene mouseX={mouseX} mouseY={mouseY} scrollY={scrollY} onSelect={setSelectedBook} showBooks={showBooks} />
        </Suspense>
      </div>

      {/* Fixed navigation */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}>
        <Navigation />
      </div>

      {/* Scrollable content */}
      <div ref={contentRef} style={{ position: 'relative', zIndex: 10 }}>

        {/* Hero */}
        <section style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 1.5rem', pointerEvents: 'none' }}>
          <HeroSection />
        </section>

        <div style={{ height: '30vh' }} />
        <AuthorSection />
        <div style={{ height: '10vh' }} />
        <ThoughtSection />
        <div style={{ height: '10vh' }} />
        <section id="books" style={{ pointerEvents: 'auto' }}>
          <BooksSection onSelectBook={setSelectedBook} />
        </section>
        <div style={{ height: '5vh' }} />
        <ExcerptsSection />
        <NewsletterContactSection />

        {/* Footer */}
        <footer style={{
          padding: '5rem 2rem', textAlign: 'center',
          background: 'linear-gradient(to top, rgba(2,0,8,0.99), rgba(7,0,31,0.92))',
          borderTop: '1px solid rgba(124,58,237,0.12)',
          backdropFilter: 'blur(20px)', pointerEvents: 'auto',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
            <div style={{ flex: 1, maxWidth: '100px', height: '1px', background: 'linear-gradient(to right, transparent, rgba(201,162,39,0.4))' }} />
            <span style={{ color: '#c9a227', fontSize: '1rem' }}>◆</span>
            <div style={{ flex: 1, maxWidth: '100px', height: '1px', background: 'linear-gradient(to left, transparent, rgba(201,162,39,0.4))' }} />
          </div>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.8rem', fontWeight: 300, color: '#c9a227', marginBottom: '0.4rem' }}>Andrew Myer</p>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: '10px', letterSpacing: '0.3em', color: 'rgba(226,217,243,0.25)', textTransform: 'uppercase', marginBottom: '2rem' }}>
            {i18n.language.startsWith('en') ? 'Voyaging Across the Boundless Sea' : 'Navegando por el Océano del Infinito'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
            {['Amazon', 'Goodreads', 'Academia.edu'].map(link => (
              <a key={link} href="#" style={{ fontFamily: "'Raleway', sans-serif", fontSize: '11px', color: 'rgba(201,162,39,0.4)', textDecoration: 'none', letterSpacing: '0.08em', transition: 'color 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#c9a227'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(201,162,39,0.4)'; }}>
                {link}
              </a>
            ))}
          </div>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: '10px', color: 'rgba(226,217,243,0.18)' }}>
            © {new Date().getFullYear()} Andrew Myer. {i18n.language.startsWith('en') ? 'All rights reserved.' : 'Todos los derechos reservados.'}
          </p>
        </footer>
      </div>

      {selectedBook && <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />}
    </div>
  );
}
