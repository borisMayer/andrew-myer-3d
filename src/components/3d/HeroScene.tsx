import { Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import AcademicBackground  from './NebulaBackground';
import GeometricMirror     from './CosmicPortal';
import SubtleParticles     from './CosmicParticles';
import GeometricAccent, { CrystalCluster } from './FloatingCrystal';
import SceneEffects        from './SceneEffects';
import PhysicsBooks        from './PhysicsBooks';
import type { Book }       from '../../lib/books';

function CameraRig({ mouseX, mouseY, scrollY }: { mouseX: number; mouseY: number; scrollY: number }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 7));
  useFrame(() => {
    target.current.x = mouseX * 0.5;
    target.current.y = -mouseY * 0.25 - scrollY * 2;
    target.current.z = 7 - scrollY * 3;
    camera.position.lerp(target.current, 0.04);
    camera.lookAt(0, scrollY * -0.5, 0);
  });
  return null;
}

interface Props {
  mouseX: number; mouseY: number; scrollY: number;
  onSelect: (book: Book) => void; showBooks: boolean;
}

export default function HeroScene({ mouseX, mouseY, scrollY, onSelect, showBooks }: Props) {
  return (
    <Canvas
      gl={{
        antialias: true, alpha: false,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.9,
      }}
      camera={{ position: [0, 0, 7], fov: 60, near: 0.1, far: 80 }}
      style={{ width: '100%', height: '100%' }}
    >
      <CameraRig mouseX={mouseX} mouseY={mouseY} scrollY={scrollY} />

      {/* Refined lighting — directional, no color casts */}
      <ambientLight intensity={0.12} color="#e8e0d0" />
      <directionalLight position={[4, 6, 4]}  intensity={0.7} color="#f0ead8" />
      <directionalLight position={[-4, -2, 3]} intensity={0.2} color="#c8d0e0" />
      <pointLight      position={[0, 0, 2]}   intensity={0.5} color="#d4b558" decay={2} />

      <Suspense fallback={null}>
        <AcademicBackground />
        <SubtleParticles count={500}  radius={16} color="#b4946a" size={0.012} speed={0.03} />
        <SubtleParticles count={200}  radius={10} color="#8090a8" size={0.018} speed={0.05} />

        {/* Central geometric mirror */}
        <GeometricMirror />

        {/* Accent geometry — restrained positions */}
        <GeometricAccent position={[-3.5,  1.2,  0.5]} color="#b4946a" scale={0.7} speed={0.6} offset={0} />
        <GeometricAccent position={[ 3.5,  1.0,  0.3]} color="#8090a8" scale={0.6} speed={0.8} offset={1} />
        <GeometricAccent position={[-2.8, -1.5,  0.8]} color="#9aa0b0" scale={0.5} speed={0.5} offset={2} />
        <GeometricAccent position={[ 2.5, -1.2,  0.5]} color="#b4946a" scale={0.65} speed={0.9} offset={3} />
        <GeometricAccent position={[ 0.3,  2.5, -0.8]} color="#7a8898" scale={0.45} speed={0.7} offset={4} />
        <CrystalCluster  position={[-5.5,  0,   -2]} />
        <CrystalCluster  position={[ 5.5,  0,   -2]} />

        {showBooks && (
          <group position={[0, -1.5, 2]}>
            <PhysicsBooks onSelect={onSelect} />
          </group>
        )}
      </Suspense>

      <SceneEffects />
    </Canvas>
  );
}
