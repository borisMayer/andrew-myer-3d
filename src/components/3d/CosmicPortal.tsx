/**
 * GeometricMirror — replaces the cosmic portal
 * A precise geometric icosahedron with slow rotation
 * Symbolizes the mirror of knowledge / philosophical reflection
 * Formal, architectural, no "mystical" effects
 */
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function GeometricMirror() {
  const outer = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (outer.current) {
      outer.current.rotation.y = t * 0.08;
      outer.current.rotation.x = t * 0.03;
    }
    if (inner.current) {
      inner.current.rotation.y = -t * 0.12;
      inner.current.rotation.z = t * 0.04;
    }
    if (ring1.current) {
      ring1.current.rotation.z = t * 0.15;
    }
    if (ring2.current) {
      ring2.current.rotation.z = -t * 0.1;
      ring2.current.rotation.x = t * 0.05;
    }
  });

  return (
    <group position={[0, 0, -1]}>
      {/* Outer icosahedron — wireframe */}
      <mesh ref={outer}>
        <icosahedronGeometry args={[2.2, 1]} />
        <meshBasicMaterial
          color="#b4946a" wireframe transparent opacity={0.12}
        />
      </mesh>

      {/* Inner solid — glass-like */}
      <mesh ref={inner}>
        <icosahedronGeometry args={[1.3, 1]} />
        <MeshTransmissionMaterial
          backside backsideThickness={0.5}
          transmission={0.95} thickness={0.4}
          chromaticAberration={0.02}
          roughness={0.05} metalness={0.1}
          color="#1a1a2a"
          envMapIntensity={1.2}
        />
      </mesh>

      {/* Precision rings */}
      <mesh ref={ring1}>
        <torusGeometry args={[2.5, 0.008, 8, 120]} />
        <meshBasicMaterial color="#c9a227" transparent opacity={0.5} />
      </mesh>

      <mesh ref={ring2} rotation={[Math.PI / 2.8, 0, 0]}>
        <torusGeometry args={[2.8, 0.005, 8, 100]} />
        <meshBasicMaterial color="#b4946a" transparent opacity={0.3} />
      </mesh>

      {/* Subtle fill light — no dramatic colors */}
      <pointLight color="#d4b558" intensity={1.2} distance={6} decay={2} />
      <pointLight color="#c8d0e0" intensity={0.4} distance={8} decay={2} position={[3, 2, 2]} />
    </group>
  );
}
