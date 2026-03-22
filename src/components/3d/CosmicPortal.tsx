import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Torus } from '@react-three/drei';
import * as THREE from 'three';

export default function CosmicPortal() {
  const outerRing = useRef<THREE.Mesh>(null);
  const innerRing = useRef<THREE.Mesh>(null);
  const core      = useRef<THREE.Mesh>(null);
  const rays      = useRef<THREE.Group>(null);

  const rayGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions: number[] = [];
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      const len   = 1.2 + Math.random() * 2;
      positions.push(0, 0, 0, Math.cos(angle) * len, Math.sin(angle) * len, 0);
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (outerRing.current) {
      outerRing.current.rotation.z = t * 0.3;
      outerRing.current.rotation.x = Math.sin(t * 0.2) * 0.1;
    }
    if (innerRing.current) {
      innerRing.current.rotation.z = -t * 0.5;
      innerRing.current.rotation.y = t * 0.15;
    }
    if (core.current) {
      core.current.rotation.y = t * 0.4;
      const s = 1 + Math.sin(t * 2) * 0.08;
      core.current.scale.setScalar(s);
    }
    if (rays.current) {
      rays.current.rotation.z = t * 0.1;
    }
  });

  return (
    <group position={[0, 0, -2]}>
      {/* Outer ring */}
      <Torus ref={outerRing} args={[2.8, 0.04, 16, 100]}>
        <meshBasicMaterial
          color="#c9a227"
          transparent opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Torus>

      {/* Mid ring */}
      <Torus ref={innerRing} args={[2.2, 0.025, 16, 80]}>
        <meshBasicMaterial
          color="#7c3aed"
          transparent opacity={0.6}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Torus>

      {/* Portal core */}
      <mesh ref={core}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <MeshDistortMaterial
          color="#07001f"
          emissive="#1a0a3d"
          emissiveIntensity={0.8}
          distort={0.4}
          speed={3}
          transparent
          opacity={0.9}
          roughness={0}
          metalness={0.2}
        />
      </mesh>

      {/* Light rays */}
      <group ref={rays}>
        <lineSegments geometry={rayGeometry}>
          <lineBasicMaterial
            color="#c9a227"
            transparent opacity={0.15}
            blending={THREE.AdditiveBlending}
          />
        </lineSegments>
      </group>

      {/* Center glow */}
      <pointLight color="#7c3aed" intensity={3} distance={8} decay={2} />
      <pointLight color="#c9a227" intensity={1.5} distance={6} decay={2} position={[0, 0, 1]} />

      {/* Outer ambient */}
      <pointLight color="#06b6d4" intensity={0.5} distance={15} decay={2} position={[3, 0, 0]} />
      <pointLight color="#9333ea" intensity={0.5} distance={15} decay={2} position={[-3, 0, 0]} />
    </group>
  );
}
