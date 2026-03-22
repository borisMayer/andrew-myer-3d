import { useEffect, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import * as THREE from 'three';
import type { Book } from '../../lib/books';
import FloatingCrystal from '../3d/FloatingCrystal';

interface Props {
  book:    Book;
  onClose: () => void;
}

// Rotating book model inside the modal
function ModalBook({ book }: { book: Book }) {
  const W = 1.4, H = 1.9, D = 0.15;
  const coverCol = new THREE.Color(book.coverColor);
  const glowCol  = new THREE.Color(book.glowColor);

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group>
        {/* Book body */}
        <mesh castShadow>
          <boxGeometry args={[W, H, D]} />
          <meshStandardMaterial
            color={coverCol}
            emissive={glowCol}
            emissiveIntensity={0.4}
            roughness={0.2}
            metalness={0.5}
          />
        </mesh>
        {/* Spine */}
        <mesh position={[-W / 2 - 0.01, 0, 0]}>
          <boxGeometry args={[0.03, H, D]} />
          <meshStandardMaterial color={book.spineColor} roughness={0.5} />
        </mesh>
        {/* Glow halo */}
        <mesh>
          <sphereGeometry args={[1.2, 16, 16]} />
          <meshBasicMaterial
            color={book.glowColor}
            transparent opacity={0.06}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
          />
        </mesh>
        {/* Point light */}
        <pointLight color={book.glowColor} intensity={3} distance={5} decay={2} />
      </group>
    </Float>
  );
}

export default function BookModal({ book, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

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

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      className="modal-backdrop"
      onClick={handleOverlayClick}
    >
      <div
        className="glass-panel rounded-2xl overflow-hidden"
        style={{
          width:    'min(90vw, 900px)',
          maxHeight: '90vh',
          display:  'flex',
          flexDirection: 'column',
          border:   `1px solid ${book.glowColor}40`,
          boxShadow: `0 0 60px ${book.glowColor}30, 0 0 120px ${book.glowColor}15`,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase mb-1" style={{ color: book.glowColor }}>
              {book.series}
            </p>
            <h2 className="font-display text-2xl md:text-3xl text-white">{book.titleEs}</h2>
            {book.titleEn !== book.titleEs && (
              <p className="font-display text-lg text-white/50 italic mt-1">{book.titleEn}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all text-xl"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row flex-1 overflow-auto">
          {/* 3D Book viewer */}
          <div style={{ width: '100%', maxWidth: '360px', minHeight: '320px', position: 'relative' }}>
            <Canvas
              gl={{ antialias: true, alpha: true }}
              camera={{ position: [0, 0, 4], fov: 50 }}
            >
              <ambientLight intensity={0.3} />
              <pointLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
              <ModalBook book={book} />
              <FloatingCrystal position={[ 2, 1, 0]} color={book.glowColor} scale={0.4} speed={1.2} />
              <FloatingCrystal position={[-2, -1, 0]} color="#c9a227" scale={0.3} speed={0.8} />
              <OrbitControls
                enablePan={false}
                enableZoom={false}
                autoRotate
                autoRotateSpeed={2}
              />
              <EffectComposer>
                <Bloom intensity={1.5} luminanceThreshold={0.3} mipmapBlur />
              </EffectComposer>
            </Canvas>
            <p className="text-center text-xs text-white/30 pb-2">Arrastra para rotar</p>
          </div>

          {/* Book info */}
          <div className="flex-1 p-6 flex flex-col gap-4 overflow-auto">
            {book.subtitle && (
              <p className="font-display text-lg italic text-white/60">{book.subtitle}</p>
            )}
            <p className="text-white/80 leading-relaxed text-base">{book.description}</p>

            {/* Mystical separator */}
            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${book.glowColor}60)` }} />
              <span style={{ color: book.glowColor, fontSize: '18px' }}>◆</span>
              <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${book.glowColor}60)` }} />
            </div>

            {/* Instructions */}
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { icon: '🌀', label: 'Arrastra', sub: 'para rotar' },
                { icon: '✨', label: 'Explora', sub: 'en 360°' },
                { icon: '🔮', label: 'Descubre', sub: 'la energía' },
              ].map(item => (
                <div key={item.label} className="rounded-xl p-3" style={{ background: `${book.glowColor}15`, border: `1px solid ${book.glowColor}25` }}>
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className="text-white text-xs font-semibold">{item.label}</div>
                  <div className="text-white/40 text-xs">{item.sub}</div>
                </div>
              ))}
            </div>

            {/* Buy button */}
            <a
              href={book.amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto block text-center py-4 px-8 rounded-xl font-body font-semibold text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background:  `linear-gradient(135deg, ${book.glowColor}, #c9a227)`,
                color:        '#020008',
                boxShadow:   `0 0 30px ${book.glowColor}50, 0 0 60px ${book.glowColor}20`,
                textDecoration: 'none',
              }}
            >
              🛒 Comprar en Amazon
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
