import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface Props {
  position: [number, number, number];
  color?:   string;
  scale?:   number;
  speed?:   number;
  offset?:  number;
}

export default function FloatingCrystal({
  position,
  color  = '#7c3aed',
  scale  = 1,
  speed  = 1,
  offset = 0,
}: Props) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime * speed + offset;
    mesh.current.position.y = position[1] + Math.sin(t * 0.8) * 0.4;
    mesh.current.rotation.y += 0.01 * speed;
    mesh.current.rotation.x += 0.005 * speed;
    const s = scale * (1 + Math.sin(t * 1.2) * 0.08);
    mesh.current.scale.setScalar(s);
  });

  return (
    <mesh ref={mesh} position={position} castShadow>
      <octahedronGeometry args={[0.6, 0]} />
      <MeshDistortMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.6}
        distort={0.15}
        speed={2}
        roughness={0}
        metalness={0.9}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

// Shard cluster — multiple mini crystals
export function CrystalCluster({ position }: { position: [number, number, number] }) {
  const crystals = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => ({
      position: [
        position[0] + (Math.random() - 0.5) * 1.5,
        position[1] + (Math.random() - 0.5) * 1.5,
        position[2] + (Math.random() - 0.5) * 1.5,
      ] as [number, number, number],
      color:  ['#7c3aed', '#c9a227', '#06b6d4', '#9333ea'][Math.floor(Math.random() * 4)],
      scale:  0.2 + Math.random() * 0.6,
      speed:  0.5 + Math.random() * 1.5,
      offset: Math.random() * Math.PI * 2,
    })),
  [position]);

  return (
    <>
      {crystals.map((c, i) => (
        <FloatingCrystal
          key={i}
          position={c.position}
          color={c.color}
          scale={c.scale}
          speed={c.speed}
          offset={c.offset}
        />
      ))}
    </>
  );
}
