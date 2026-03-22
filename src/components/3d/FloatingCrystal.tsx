import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  position: [number, number, number];
  color?:   string;
  scale?:   number;
  speed?:   number;
  offset?:  number;
}

export default function FloatingCrystal({
  position, color = '#7c3aed', scale = 1, speed = 1, offset = 0,
}: Props) {
  const group = useRef<THREE.Group>(null);
  const glow  = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime * speed + offset;
    group.current.position.x = position[0] + Math.sin(t * 0.5) * 0.15;
    group.current.position.y = position[1] + Math.sin(t * 0.8) * 0.5;
    group.current.position.z = position[2] + Math.cos(t * 0.3) * 0.1;
    group.current.rotation.y += 0.012 * speed;
    group.current.rotation.x += 0.006 * speed;
    group.current.rotation.z += 0.004 * speed;
    const s = scale * (1 + Math.sin(t * 1.4) * 0.1);
    group.current.scale.setScalar(s);
    // Pulsing glow
    if (glow.current) {
      (glow.current.material as THREE.MeshBasicMaterial).opacity =
        0.12 + Math.sin(t * 2) * 0.05;
    }
  });

  const col = new THREE.Color(color);

  return (
    <group ref={group} position={position}>
      {/* Crystal body — elongated octahedron */}
      <mesh castShadow>
        <octahedronGeometry args={[0.5, 0]} />
        <meshPhongMaterial
          color={col}
          emissive={col}
          emissiveIntensity={0.8}
          shininess={200}
          specular={new THREE.Color('#ffffff')}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Inner bright core */}
      <mesh scale={[0.5, 0.5, 0.5]}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshBasicMaterial color={'#ffffff'} transparent opacity={0.3} />
      </mesh>

      {/* Outer glow sphere */}
      <mesh ref={glow} scale={[1.8, 1.8, 1.8]}>
        <octahedronGeometry args={[0.5, 1]} />
        <meshBasicMaterial
          color={color}
          transparent opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Point light */}
      <pointLight color={color} intensity={0.8} distance={2.5} decay={2} />
    </group>
  );
}

export function CrystalCluster({ position }: { position: [number, number, number] }) {
  const crystals = useMemo(() =>
    Array.from({ length: 5 }, (_, i) => ({
      pos: [
        position[0] + (Math.random() - 0.5) * 2,
        position[1] + (Math.random() - 0.5) * 1.5,
        position[2] + (Math.random() - 0.5) * 1.5,
      ] as [number, number, number],
      color:  ['#7c3aed','#c9a227','#06b6d4','#9333ea','#ec4899'][i % 5],
      scale:  0.25 + Math.random() * 0.5,
      speed:  0.6 + Math.random() * 1.2,
      offset: Math.random() * Math.PI * 2,
    })),
  [position]);

  return <>{crystals.map((c, i) => <FloatingCrystal key={i} {...c} />)}</>;
}
