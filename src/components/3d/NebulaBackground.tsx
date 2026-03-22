/**
 * AcademicBackground — replaces the cosmic nebula
 * Minimal dark environment with subtle geometric grid and depth
 * Inspired by high-end architecture / editorial photography
 */
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function AcademicBackground() {
  const gridRef = useRef<THREE.Group>(null);

  // Fine grid of dots — like academic graph paper, infinite
  const dotField = useMemo(() => {
    const count = 1200;
    const pos   = new Float32Array(count * 3);
    const cols  = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i*3]   = (Math.random() - 0.5) * 40;
      pos[i*3+1] = (Math.random() - 0.5) * 40;
      pos[i*3+2] = (Math.random() - 0.5) * 20 - 5;
      // Very subtle warm white dots
      const b = 0.3 + Math.random() * 0.4;
      cols[i*3]   = b * 0.95;
      cols[i*3+1] = b * 0.92;
      cols[i*3+2] = b * 0.85;
    }
    return { pos, cols };
  }, []);

  // Geometric lines — subtle structural elements
  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const verts: number[] = [];
    // Horizontal lines
    for (let y = -6; y <= 6; y += 2) {
      verts.push(-20, y, -8,  20, y, -8);
    }
    // Vertical lines
    for (let x = -18; x <= 18; x += 3) {
      verts.push(x, -8, -8,  x, 8, -8);
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (!gridRef.current) return;
    // Very slow drift — almost imperceptible
    gridRef.current.rotation.y = state.clock.elapsedTime * 0.008;
    gridRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.004) * 0.02;
  });

  return (
    <group ref={gridRef}>
      {/* Dot field */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dotField.pos, 3]} />
          <bufferAttribute attach="attributes-color"    args={[dotField.cols, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.018} vertexColors transparent opacity={0.35}
          sizeAttenuation depthWrite={false}
        />
      </points>

      {/* Structural grid lines */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial
          color="#b4946a" transparent opacity={0.04}
          depthWrite={false}
        />
      </lineSegments>

      {/* Gradient fog */}
      <fog attach="fog" args={['#0a0a0f', 15, 45]} />
    </group>
  );
}
