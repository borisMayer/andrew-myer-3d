import { Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import NebulaBackground from './NebulaBackground';
import CosmicPortal from './CosmicPortal';
import CosmicParticles from './CosmicParticles';
import FloatingCrystal, { CrystalCluster } from './FloatingCrystal';
import SceneEffects from './SceneEffects';
import BookMesh from './BookMesh';
import { BOOKS } from '../../lib/books';
import type { Book } from '../../lib/books';

interface CameraRigProps {
  mouseX: number;
  mouseY: number;
  scrollY: number;
}

function CameraRig({ mouseX, mouseY, scrollY }: CameraRigProps) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 8));

  useFrame(() => {
    // Mouse parallax
    targetPos.current.x = mouseX * 0.8;
    targetPos.current.y = -mouseY * 0.4 + scrollY * -3;
    targetPos.current.z = 8 - scrollY * 4;

    camera.position.lerp(targetPos.current, 0.05);
    camera.lookAt(0, scrollY * -1, 0);
  });

  return null;
}

interface Props {
  mouseX:   number;
  mouseY:   number;
  scrollY:  number;
  onSelect: (book: Book) => void;
  showBooks: boolean;
}

export default function HeroScene({ mouseX, mouseY, scrollY, onSelect, showBooks }: Props) {
  return (
    <Canvas
      className="r3f-canvas"
      gl={{
        antialias: true,
        alpha:     false,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
      camera={{ position: [0, 0, 8], fov: 65, near: 0.1, far: 100 }}
      shadows
    >
      {/* Camera controller */}
      <CameraRig mouseX={mouseX} mouseY={mouseY} scrollY={scrollY} />

      {/* Ambient lighting */}
      <ambientLight intensity={0.2} color="#1a0a3d" />
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#c9a227" castShadow />

      <Suspense fallback={null}>
        {/* Cosmic background */}
        <NebulaBackground />
        <Stars radius={40} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

        {/* Particle field */}
        <CosmicParticles count={2500} radius={18} color="#7c3aed" size={0.025} speed={0.08} />
        <CosmicParticles count={800}  radius={12} color="#c9a227" size={0.04}  speed={0.12} />
        <CosmicParticles count={400}  radius={8}  color="#06b6d4" size={0.05}  speed={0.15} />

        {/* Hero portal */}
        <CosmicPortal />

        {/* Floating crystals around the portal */}
        <FloatingCrystal position={[-3.5,  1,  1]} color="#7c3aed" scale={0.8} speed={0.9} offset={0}   />
        <FloatingCrystal position={[ 3.5,  1.5, 0.5]} color="#c9a227" scale={0.7} speed={1.1} offset={1} />
        <FloatingCrystal position={[-2.5, -1.5, 1]} color="#06b6d4" scale={0.6} speed={0.7} offset={2}  />
        <FloatingCrystal position={[ 2.8, -1,  0.8]} color="#9333ea" scale={0.9} speed={1.3} offset={3} />
        <FloatingCrystal position={[ 0,    2.5, -1]} color="#ec4899" scale={0.5} speed={0.8} offset={4} />
        <CrystalCluster  position={[-5,    0,  -2]} />
        <CrystalCluster  position={[ 5,    0,  -2]} />

        {/* Book catalog — shown when scrolled to that section */}
        {showBooks && (
          <group position={[0, -2, 2]}>
            {BOOKS.map((book, i) => {
              const cols   = 3;
              const col    = i % cols;
              const row    = Math.floor(i / cols);
              const xSpan  = 3.0;
              const ySpan  = 2.2;
              const xOff   = (col - (cols - 1) / 2) * xSpan;
              const yOff   = row * -ySpan;
              return (
                <BookMesh
                  key={book.id}
                  book={book}
                  position={[xOff, yOff, 0]}
                  index={i}
                  onSelect={onSelect}
                />
              );
            })}
          </group>
        )}
      </Suspense>

      {/* Post-processing */}
      <SceneEffects />
    </Canvas>
  );
}
