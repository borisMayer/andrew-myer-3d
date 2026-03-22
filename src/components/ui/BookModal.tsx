import { useEffect, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { useTranslation } from 'react-i18next';
import * as THREE from 'three';
import type { Book } from '../../lib/books';
import FloatingCrystal from '../3d/FloatingCrystal';

interface Props { book: Book; onClose: () => void; }

function ModalBook({ book }: { book: Book }) {
  const W = 1.35, H = 1.85, D = 0.14;
  const coverCol = new THREE.Color(book.coverColor);
  const glowCol  = new THREE.Color(book.glowColor);

  return (
    <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.4}>
      <group>
        {/* Body */}
        <mesh castShadow>
          <boxGeometry args={[W, H, D]} />
          <meshStandardMaterial color={coverCol} emissive={glowCol} emissiveIntensity={0.35} roughness={0.2} metalness={0.55} />
        </mesh>
        {/* Spine */}
        <mesh position={[-W / 2 - 0.01, 0, 0]}>
          <boxGeometry args={[0.025, H, D]} />
          <meshStandardMaterial color={book.spineColor} roughness={0.55} />
        </mesh>
        {/* Pages */}
        <mesh position={[W / 2 + 0.01, 0, 0]}>
          <boxGeometry args={[0.025, H, D]} />
          <meshStandardMaterial color="#ede8df" roughness={0.9} />
        </mesh>
        {/* Halo */}
        <mesh>
          <sphereGeometry args={[1.15, 16, 16]} />
          <meshBasicMaterial color={book.glowColor} transparent opacity={0.05} blending={THREE.AdditiveBlending} side={THREE.BackSide} depthWrite={false} />
        </mesh>
        <pointLight color={book.glowColor} intensity={3} distance={5} decay={2} />
      </group>
    </Float>
  );
}

export default function BookModal({ book, onClose }: Props) {
  const { t, i18n } = useTranslation();
  const overlayRef  = useRef<HTMLDivElement>(null);
  const isEn        = i18n.language.startsWith('en');

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  const title       = isEn ? book.titleEn : book.titleEs;
  const altTitle    = isEn ? book.titleEs : book.titleEn;
  const description = isEn ? (book.descriptionEn ?? book.description) : book.description;

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(2,0,8,0.88)',
        backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div style={{
        width: 'min(92vw, 920px)', maxHeight: '92vh',
        display: 'flex', flexDirection: 'column',
        background: 'rgba(7,0,31,0.92)',
        backdropFilter: 'blur(24px)',
        border: `1px solid ${book.glowColor}45`,
        borderRadius: '1.5rem',
        overflow: 'hidden',
        boxShadow: `0 0 60px ${book.glowColor}28, 0 0 120px ${book.glowColor}12`,
      }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          padding: '1.5rem 2rem',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}>
          <div>
            <p style={{ color: book.glowColor, fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', fontFamily: "'Raleway', sans-serif", marginBottom: '0.4rem', opacity: 0.85 }}>
              {book.series}
            </p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.2rem,3vw,1.8rem)', fontWeight: 400, color: '#ffffff', margin: 0, lineHeight: 1.2 }}>
              {title}
            </h2>
            {altTitle !== title && (
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1rem', color: 'rgba(226,217,243,0.4)', fontStyle: 'italic', margin: '0.25rem 0 0' }}>
                {altTitle}
              </p>
            )}
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.5)', borderRadius: '50%',
            width: '36px', height: '36px', cursor: 'pointer', fontSize: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, marginLeft: '1rem', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
          aria-label="Cerrar">
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ display: 'flex', flexDirection: 'row', flex: 1, overflow: 'hidden' }} className="modal-body">
          {/* 3D viewer */}
          <div style={{ width: '340px', minWidth: '280px', flexShrink: 0, position: 'relative', background: 'rgba(2,0,8,0.5)' }}>
            <Canvas
              gl={{ antialias: true, alpha: true }}
              camera={{ position: [0, 0, 4.2], fov: 48 }}
              style={{ width: '100%', height: '100%' }}
            >
              <ambientLight intensity={0.35} />
              <pointLight position={[4, 4, 4]} intensity={1.2} color="#ffffff" />
              <pointLight position={[-3, -2, 2]} intensity={0.5} color={book.glowColor} />
              <ModalBook book={book} />
              <FloatingCrystal position={[ 1.8,  0.8, 0]} color={book.glowColor} scale={0.32} speed={1.3} offset={0} />
              <FloatingCrystal position={[-1.8, -0.8, 0]} color="#c9a227"      scale={0.25} speed={0.8} offset={2} />
              <FloatingCrystal position={[ 0.5,  1.6, -1]} color="#7c3aed"    scale={0.2}  speed={1.0} offset={4} />
              <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={1.8} />
              <EffectComposer>
                <Bloom intensity={1.8} luminanceThreshold={0.25} mipmapBlur radius={0.75} />
              </EffectComposer>
            </Canvas>
            <p style={{
              position: 'absolute', bottom: '0.75rem', width: '100%',
              textAlign: 'center', color: 'rgba(226,217,243,0.28)',
              fontSize: '10px', letterSpacing: '0.12em', fontFamily: "'Raleway', sans-serif",
              pointerEvents: 'none',
            }}>
              {t('books.rotate_hint')}
            </p>
          </div>

          {/* Info panel */}
          <div style={{
            flex: 1, padding: '1.75rem 2rem', overflowY: 'auto',
            display: 'flex', flexDirection: 'column', gap: '1.25rem',
            minWidth: 0,
          }}>
            {/* Subtitle */}
            {book.subtitle && (
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.05rem', fontStyle: 'italic', color: 'rgba(226,217,243,0.55)', lineHeight: 1.5 }}>
                {book.subtitle}
              </p>
            )}

            {/* Description */}
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: '0.9rem', color: 'rgba(226,217,243,0.72)', lineHeight: 1.85, fontWeight: 300 }}>
              {description}
            </p>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ flex: 1, height: '1px', background: `linear-gradient(to right, transparent, ${book.glowColor}50)` }} />
              <span style={{ color: book.glowColor, fontSize: '14px' }}>◆</span>
              <div style={{ flex: 1, height: '1px', background: `linear-gradient(to left, transparent, ${book.glowColor}50)` }} />
            </div>

            {/* Features grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              {[
                { icon: '🌀', label: t('books.rotate_hint').split(' ')[0], sub: t('books.rotate_hint').split(' ').slice(1).join(' ') || '360°' },
                { icon: '✨', label: t('books.explore_360').split(' ')[0], sub: t('books.explore_360').split(' ').slice(1).join(' ') || 'en 360°' },
                { icon: '🔮', label: t('books.discover').split(' ')[0], sub: t('books.discover').split(' ').slice(1).join(' ') || 'la energía' },
              ].map(item => (
                <div key={item.label} style={{
                  borderRadius: '10px', padding: '0.9rem 0.6rem', textAlign: 'center',
                  background: `${book.glowColor}12`,
                  border: `1px solid ${book.glowColor}22`,
                }}>
                  <div style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>{item.icon}</div>
                  <div style={{ color: '#ffffff', fontSize: '11px', fontWeight: 600, fontFamily: "'Raleway', sans-serif", marginBottom: '2px' }}>{item.label}</div>
                  <div style={{ color: 'rgba(226,217,243,0.4)', fontSize: '10px', fontFamily: "'Raleway', sans-serif" }}>{item.sub}</div>
                </div>
              ))}
            </div>

            {/* Buy button */}
            <a
              href={book.amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block', textAlign: 'center', marginTop: 'auto',
                padding: '1rem 2rem', borderRadius: '12px',
                background: `linear-gradient(135deg, ${book.glowColor}dd, #c9a227dd)`,
                color: '#ffffff', textDecoration: 'none',
                fontFamily: "'Raleway', sans-serif", fontWeight: 700,
                fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                boxShadow: `0 0 30px ${book.glowColor}40, 0 0 60px ${book.glowColor}18`,
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 6px 40px ${book.glowColor}60, 0 0 80px ${book.glowColor}25`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 0 30px ${book.glowColor}40, 0 0 60px ${book.glowColor}18`; }}
            >
              🛒 {t('books.buy')}
            </a>
          </div>
        </div>
      </div>

      {/* Responsive: stack vertically on small screens */}
      <style>{`
        @media (max-width: 640px) {
          .modal-body { flex-direction: column !important; }
          .modal-body > div:first-child { width: 100% !important; height: 240px; }
        }
      `}</style>
    </div>
  );
}
