/**
 * SubtleParticles — very sparse, refined particle field
 * No "cosmic" colors — just near-white and warm gold dots
 */
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  count?:  number;
  radius?: number;
  color?:  string;
  size?:   number;
  speed?:  number;
}

export default function SubtleParticles({
  count  = 600,
  radius = 14,
  color  = '#c9a227',
  size   = 0.015,
  speed  = 0.04,
}: Props) {
  const mesh = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = radius * (0.4 + Math.random() * 0.6);
      pos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
      pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i*3+2] = r * Math.cos(phi);
    }
    return pos;
  }, [count, radius]);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y += speed * 0.001;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size} color={color} transparent opacity={0.25}
        sizeAttenuation depthWrite={false}
      />
    </points>
  );
}
