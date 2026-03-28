import { useEffect, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { useTranslation } from 'react-i18next';
import * as THREE from 'three';
import type { Book } from '../../lib/books';
import { useState } from 'react';
import BuyModal from './BuyModal';
import GeometricAccent from '../3d/FloatingCrystal';

interface Props { book: Book; onClose: () => void; }

function ModalBook({ book }: { book: Book }) {
  const W = 1.35, H = 1.85, D = 0.14;
  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.35}>
      <group>
        <mesh castShadow>
          <boxGeometry args={[W, H, D]} />
          <meshStandardMaterial
            color={new THREE.Color(book.coverColor)}
            emissive={new THREE.Color(book.glowColor)}
            emissiveIntensity={0.2} roughness={0.25} metalness={0.6}
          />
        </mesh>
        <mesh position={[-W/2 - 0.01, 0, 0]}>
          <boxGeometry args={[0.025, H, D]} />
          <meshStandardMaterial color={book.spineColor} roughness={0.6} />
        </mesh>
        <mesh position={[W/2 + 0.01, 0, 0]}>
          <boxGeometry args={[0.022, H, D]} />
          <meshStandardMaterial color="#e8e0d5" roughness={0.9} />
        </mesh>
        <mesh>
          <sphereGeometry args={[1.1, 16, 16]} />
          <meshBasicMaterial color={book.glowColor} transparent opacity={0.04} blending={THREE.AdditiveBlending} side={THREE.BackSide} depthWrite={false} />
        </mesh>
        <pointLight color={book.glowColor} intensity={2} distance={5} decay={2} />
      </group>
    </Float>
  );
}

export default function BookModal({ book, onClose }: Props) {
  const [showBuy, setShowBuy] = useState(false);
  const { t, i18n } = useTranslation();
  const overlayRef  = useRef<HTMLDivElement>(null);
  const isEn        = i18n.language.startsWith('en');

  const handleKey = useCallback((e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handleKey); document.body.style.overflow = ''; };
  }, [handleKey]);

  const title    = isEn ? book.titleEn    : book.titleEs;
  const altTitle = isEn ? book.titleEs    : book.titleEn;
  const desc     = isEn ? (book.descriptionEn ?? book.description) : book.description;
  const category = isEn ? book.categoryEn : book.categoryEs;

  return (
    <div ref={overlayRef}
      style={{ position:'fixed', inset:0, zIndex:100, background:'rgba(6,6,11,0.9)', backdropFilter:'blur(12px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem' }}
      onClick={e => { if (e.target === overlayRef.current) onClose(); }}>

      <div style={{
        width:'min(94vw, 940px)', maxHeight:'90vh', display:'flex', flexDirection:'column',
        background:'rgba(10,10,16,0.97)', backdropFilter:'blur(20px)',
        border:'1px solid rgba(255,255,255,0.06)',
        borderTop:`1px solid ${book.glowColor}35`,
        borderRadius:'2px', overflow:'hidden',
        boxShadow:`0 0 60px rgba(0,0,0,0.7), 0 0 30px ${book.glowColor}18`,
      }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', padding:'1.5rem 2rem', borderBottom:'1px solid rgba(255,255,255,0.05)', flexShrink:0 }}>
          <div>
            {/* Category */}
            <p style={{ fontFamily:'var(--font-mono)', fontSize:'8px', letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(180,155,90,0.55)', marginBottom:'0.4rem' }}>
              {category}
              {book.year && <span style={{ marginLeft:'1rem', color:'rgba(140,145,155,0.4)' }}>{book.year}</span>}
              {book.isbn && <span style={{ marginLeft:'0.8rem', color:'rgba(140,145,155,0.3)' }}>ISBN {book.isbn}</span>}
            </p>
            <h2 style={{ fontFamily:'var(--font-serif)', fontSize:'clamp(1.15rem,3vw,1.7rem)', fontWeight:400, color:'rgba(235,228,215,0.97)', margin:0, lineHeight:1.2 }}>
              {title}
            </h2>
            {altTitle !== title && (
              <p style={{ fontFamily:'var(--font-serif)', fontSize:'0.95rem', color:'rgba(160,165,175,0.4)', fontStyle:'italic', margin:'0.2rem 0 0' }}>
                {altTitle}
              </p>
            )}
          </div>
          <button onClick={onClose}
            style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(160,165,175,0.5)', borderRadius:'2px', width:'32px', height:'32px', cursor:'pointer', fontSize:'13px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginLeft:'1rem', transition:'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.1)'; e.currentTarget.style.color='rgba(220,215,205,0.9)'; }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.color='rgba(160,165,175,0.5)'; }}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ display:'flex', flex:1, overflow:'hidden' }} className="modal-body">

          {/* 3D viewer */}
          <div style={{ width:'300px', minWidth:'260px', flexShrink:0, background:'rgba(6,6,11,0.7)', borderRight:'1px solid rgba(255,255,255,0.04)', position:'relative' }}>
            <Canvas gl={{ antialias:true, alpha:true }} camera={{ position:[0, 0, 4.2], fov:46 }} style={{ width:'100%', height:'100%' }}>
              <ambientLight intensity={0.3} />
              <pointLight position={[4, 4, 4]} intensity={1.2} color="#f0ead8" />
              <pointLight position={[-3, -2, 2]} intensity={0.4} color={book.glowColor} />
              <ModalBook book={book} />
              <GeometricAccent position={[1.8, 0.7, 0]} color={book.glowColor} scale={0.3} speed={1.1} offset={0} />
              <GeometricAccent position={[-1.6, -0.6, 0.3]} color="#8090a8" scale={0.22} speed={0.7} offset={2} />
              <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={1.5} />
              <EffectComposer>
                <Bloom intensity={0.8} luminanceThreshold={0.5} mipmapBlur radius={0.5} />
              </EffectComposer>
            </Canvas>
            <p style={{ position:'absolute', bottom:'0.6rem', width:'100%', textAlign:'center', color:'rgba(160,165,175,0.2)', fontSize:'9px', letterSpacing:'0.12em', fontFamily:'var(--font-mono)', pointerEvents:'none', textTransform:'uppercase' }}>
              {t('books.rotate_hint')}
            </p>
          </div>

          {/* Info */}
          <div style={{ flex:1, padding:'1.75rem 2rem', overflowY:'auto', display:'flex', flexDirection:'column', gap:'1.25rem', minWidth:0 }}>

            {/* Series + edition */}
            {book.series && (
              <p style={{ fontFamily:'var(--font-mono)', fontSize:'8.5px', letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(140,145,155,0.4)', paddingBottom:'0.75rem', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                {book.series}
                {book.edition && <span style={{ marginLeft:'1rem' }}>{book.edition}</span>}
              </p>
            )}

            {/* Subtitle */}
            {book.subtitle && (
              <p style={{ fontFamily:'var(--font-serif)', fontSize:'1rem', fontStyle:'italic', color:'rgba(185,180,170,0.6)', lineHeight:1.55 }}>
                {book.subtitle}
              </p>
            )}

            {/* Description */}
            <p style={{ fontFamily:'var(--font-sans)', fontSize:'0.88rem', color:'rgba(180,175,165,0.75)', lineHeight:1.85, fontWeight:300 }}>
              {desc}
            </p>

            {/* Thin rule */}
            <div style={{ height:'1px', background:'linear-gradient(to right, rgba(180,155,90,0.2), transparent)' }} />

            {/* Buttons */}
            <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap', marginTop:'auto' }}>
              {/* Primary: Buy with Mercado Pago */}
              <button
                onClick={() => setShowBuy(true)}
                style={{
                  display:'inline-flex', alignItems:'center', gap:'8px',
                  padding:'0.8rem 1.6rem',
                  background:'rgba(180,155,90,0.18)', border:'1px solid rgba(180,155,90,0.55)',
                  color:'rgba(210,182,95,0.97)', borderRadius:'2px', cursor:'pointer',
                  fontFamily:'var(--font-sans)', fontWeight:500, fontSize:'10px',
                  letterSpacing:'0.14em', textTransform:'uppercase', transition:'all 0.25s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(180,155,90,0.28)'; }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(180,155,90,0.18)'; }}>
                <svg width="16" height="16" viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="#009ee3"/><text x="24" y="30" textAnchor="middle" fontSize="18" fill="white" fontWeight="bold">MP</text></svg>
                {t('books.buy')}
              </button>

              {/* Secondary: Amazon */}
              <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer"
                style={{
                  display:'inline-flex', alignItems:'center', gap:'6px',
                  padding:'0.8rem 1.2rem',
                  background:'transparent', border:'1px solid rgba(255,255,255,0.12)',
                  color:'rgba(160,155,145,0.65)', borderRadius:'2px', textDecoration:'none',
                  fontFamily:'var(--font-sans)', fontWeight:400, fontSize:'10px',
                  letterSpacing:'0.14em', textTransform:'uppercase', transition:'all 0.25s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.25)'; e.currentTarget.style.color='rgba(200,195,185,0.8)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.12)'; e.currentTarget.style.color='rgba(160,155,145,0.65)'; }}>
                <span style={{ fontSize:'11px' }}>↗</span>
                Amazon
              </a>
            </div>

            {/* BuyModal */}
            {showBuy && <BuyModal book={book} onClose={() => setShowBuy(false)} />}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .modal-body { flex-direction: column !important; }
          .modal-body > div:first-child { width: 100% !important; height: 220px; border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.04); }
        }
      `}</style>
    </div>
  );
}
