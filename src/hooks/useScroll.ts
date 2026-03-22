import { useState, useEffect, useRef } from 'react';

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [section, setSection]   = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop  = window.scrollY;
      const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
      const p          = docHeight > 0 ? scrollTop / docHeight : 0;
      setProgress(p);
      // Detect section by scroll position
      setSection(Math.floor(p * 4));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return { progress, section };
}

export function useMousePosition() {
  const pos = useRef({ x: 0, y: 0 });
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = {
        x: (e.clientX / window.innerWidth  - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
      forceUpdate(n => n + 1);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return pos.current;
}
