import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  count?:     number;
  radius?:    number;
  color?:     string;
  size?:      number;
  speed?:     number;
}

export default function CosmicParticles({
  count  = 2000,
  radius = 15,
  color  = '#7c3aed',
  size   = 0.03,
  speed  = 0.1,
}: Props) {
  const mesh = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos  = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const c1   = new THREE.Color(color);
    const c2   = new THREE.Color('#c9a227');
    const c3   = new THREE.Color('#06b6d4');

    for (let i = 0; i < count; i++) {
      // Distribute in sphere
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = radius * (0.3 + Math.random() * 0.7);

      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      // Mix colors randomly
      const mix = Math.random();
      const col = mix < 0.6 ? c1 : mix < 0.8 ? c2 : c3;
      cols[i * 3]     = col.r;
      cols[i * 3 + 1] = col.g;
      cols[i * 3 + 2] = col.b;
    }
    return [pos, cols];
  }, [count, radius, color]);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y += speed * 0.001;
    mesh.current.rotation.x += speed * 0.0003;
    // Breathing effect
    const s = 1 + Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    mesh.current.scale.setScalar(s);
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
