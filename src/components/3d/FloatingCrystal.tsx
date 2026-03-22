/**
 * GeometricAccent — replaces floating crystals
 * Clean tetrahedra and dodecahedra with minimal material
 * Academic / architectural feel
 */
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  position: [number, number, number];
  color?:   string;
  scale?:   number;
  speed?:   number;
  offset?:  number;
}

export default function GeometricAccent({
  position,
  color  = '#b4946a',
  scale  = 1,
  speed  = 1,
  offset = 0,
}: Props) {
  const mesh = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime * speed + offset;
    mesh.current.position.y = position[1] + Math.sin(t * 0.4) * 0.2;
    mesh.current.rotation.y += 0.004 * speed;
    mesh.current.rotation.x += 0.002 * speed;
  });

  const geo = [
    new THREE.TetrahedronGeometry(0.4, 0),
    new THREE.OctahedronGeometry(0.35, 0),
    new THREE.IcosahedronGeometry(0.3, 0),
  ][Math.floor(offset) % 3];

  const col = new THREE.Color(color);

  return (
    <group ref={mesh} position={position} scale={scale}>
      {/* Wireframe outer */}
      <mesh geometry={geo} scale={1.6}>
        <meshBasicMaterial color={col} wireframe transparent opacity={0.15} />
      </mesh>
      {/* Solid inner */}
      <mesh geometry={geo}>
        <meshPhongMaterial
          color={col} emissive={col} emissiveIntensity={0.2}
          shininess={120} transparent opacity={0.5}
        />
      </mesh>
    </group>
  );
}

export function CrystalCluster({ position }: { position: [number, number, number] }) {
  const items = [
    { position: [position[0]-0.8, position[1]+0.5, position[2]]    as [number,number,number], color:'#b4946a', scale:0.6, speed:0.7, offset:0 },
    { position: [position[0]+0.6, position[1]-0.3, position[2]+0.3] as [number,number,number], color:'#8090a8', scale:0.5, speed:0.9, offset:1 },
    { position: [position[0],     position[1]+0.8, position[2]-0.2] as [number,number,number], color:'#6a7a90', scale:0.4, speed:1.1, offset:2 },
  ];
  return <>{items.map((c,i) => <GeometricAccent key={i} {...c} />)}</>;
}
