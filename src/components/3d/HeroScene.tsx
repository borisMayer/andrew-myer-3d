import { Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import NebulaBackground  from './NebulaBackground';
import CosmicPortal     from './CosmicPortal';
import CosmicParticles  from './CosmicParticles';
import FloatingCrystal, { CrystalCluster } from './FloatingCrystal';
import SceneEffects     from './SceneEffects';
import PhysicsBooks     from './PhysicsBooks';
import type { Book }    from '../../lib/books';

interface CameraRigProps { mouseX: number; mouseY: number; scrollY: number; }

function CameraRig({ mouseX, mouseY, scrollY }: CameraRigProps) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 8));

  useFrame(() => {
    target.current.x = mouseX * 0.7;
    target.current.y = -mouseY * 0.35 + scrollY * -2.5;
    target.current.z = 8 - scrollY * 3.5;
    camera.position.lerp(target.current, 0.05);
    camera.lookAt(0, scrollY * -0.8, 0);
  });
  return null;
}

interface Props {
  mouseX:    number;
  mouseY:    number;
  scrollY:   number;
  onSelect:  (book: Book) => void;
  showBooks: boolean;
}

export default function HeroScene({ mouseX, mouseY, scrollY, onSelect, showBooks }: Props) {
  return (
    <Canvas
      gl={{
        antialias:           true,
        alpha:               false,
        toneMapping:         THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.3,
      }}
      camera={{ position: [0, 0, 8], fov: 65, near: 0.1, far: 100 }}
      shadows
      style={{ width: '100%', height: '100%' }}
    >
      <CameraRig mouseX={mouseX} mouseY={mouseY} scrollY={scrollY} />

      <ambientLight intensity={0.18} color="#1a0a3d" />
      <directionalLight position={[5, 8, 5]} intensity={0.6} color="#c9a227" castShadow />
      <directionalLight position={[-5, -3, 3]} intensity={0.2} color="#06b6d4" />

      <Suspense fallback={null}>
        {/* Cosmic environment */}
        <NebulaBackground />
        <Stars radius={42} depth={55} count={3500} factor={4} saturation={0} fade speed={0.8} />

        {/* Particle layers */}
        <CosmicParticles count={2200} radius={18} color="#7c3aed" size={0.022} speed={0.07} />
        <CosmicParticles count={700}  radius={12} color="#c9a227" size={0.038} speed={0.11} />
        <CosmicParticles count={350}  radius={7}  color="#06b6d4" size={0.048} speed={0.14} />

        {/* Hero portal */}
        <CosmicPortal />

        {/* Crystals */}
        <FloatingCrystal position={[-3.8,  1.2,  1.2]} color="#7c3aed" scale={0.75} speed={0.85} offset={0}   />
        <FloatingCrystal position={[ 3.8,  1.6,  0.8]} color="#c9a227" scale={0.65} speed={1.05} offset={1.2} />
        <FloatingCrystal position={[-2.8, -1.6,  1.0]} color="#06b6d4" scale={0.55} speed={0.7}  offset={2.5} />
        <FloatingCrystal position={[ 2.8, -1.2,  0.9]} color="#9333ea" scale={0.85} speed={1.2}  offset={3.8} />
        <FloatingCrystal position={[ 0.2,  2.8, -1.0]} color="#ec4899" scale={0.45} speed={0.75} offset={5.0} />
        <FloatingCrystal position={[-1.5, -2.8, -0.5]} color="#c9a227" scale={0.5}  speed={0.9}  offset={6.2} />
        <CrystalCluster  position={[-5.5,  0.5, -2.5]} />
        <CrystalCluster  position={[ 5.5, -0.5, -2.5]} />

        {/* Physics books — shown when scrolled to catalog section */}
        {showBooks && (
          <group position={[0, -1.5, 2.5]}>
            <PhysicsBooks onSelect={onSelect} />
          </group>
        )}
      </Suspense>

      <SceneEffects />
    </Canvas>
  );
}
