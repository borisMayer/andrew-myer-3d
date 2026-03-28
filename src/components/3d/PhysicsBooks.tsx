/**
 * PhysicsBooks — libros flotantes con portada real en textura 3D
 */
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import type { RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { useTexture, Text } from '@react-three/drei';
import { BOOKS } from '../../lib/books';
import type { Book } from '../../lib/books';

// Single book with real cover texture
function PhysicsBook({ book, position, index, onSelect }: {
  book: Book; position: [number, number, number]; index: number; onSelect: (b: Book) => void;
}) {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const glowRef = useRef<THREE.PointLight>(null);
  const hovered = useRef(false);
  const baseY = position[1];

  // Load real cover texture if available
  const texture = useTexture(book.coverImage || '/covers/placeholder.png');
  texture.colorSpace = THREE.SRGBColorSpace;

  // Build materials: front=cover, back=plain, sides=spine/pages
  const W = 1.1, H = 1.5, D = 0.11;
  const coverCol  = useMemo(() => new THREE.Color(book.coverColor), [book.coverColor]);
  const spineCol  = useMemo(() => new THREE.Color(book.spineColor), [book.spineColor]);
  const glowCol   = useMemo(() => new THREE.Color(book.glowColor),  [book.glowColor]);

  const materials = useMemo(() => {
    const spine  = new THREE.MeshStandardMaterial({ color: spineCol, roughness: 0.7 });
    const pages  = new THREE.MeshStandardMaterial({ color: '#ede8de', roughness: 0.9 });
    const top    = new THREE.MeshStandardMaterial({ color: spineCol, roughness: 0.8 });
    const bottom = new THREE.MeshStandardMaterial({ color: spineCol, roughness: 0.8 });
    const back   = new THREE.MeshStandardMaterial({ color: coverCol, roughness: 0.5 });
    const front  = book.coverImage
      ? new THREE.MeshStandardMaterial({ map: texture, roughness: 0.3, metalness: 0.1 })
      : new THREE.MeshStandardMaterial({ color: coverCol, emissive: glowCol, emissiveIntensity: 0.2, roughness: 0.3, metalness: 0.5 });
    // BoxGeometry face order: +X(right/pages), -X(left/spine), +Y(top), -Y(bottom), +Z(front/cover), -Z(back)
    return [pages, spine, top, bottom, front, back];
  }, [texture, coverCol, spineCol, glowCol, book.coverImage]);

  useFrame((state) => {
    if (!rigidBodyRef.current) return;
    const t = state.clock.elapsedTime + index * 1.7;
    const targetY = baseY + Math.sin(t * 0.55) * 0.3;
    const targetX = position[0] + Math.sin(t * 0.3 + index) * 0.08;
    const current = rigidBodyRef.current.translation();
    rigidBodyRef.current.setLinvel({
      x: (targetX - current.x) * 0.06 * 60,
      y: (targetY - current.y) * 0.06 * 60,
      z: (position[2] - current.z) * 0.04 * 60,
    }, true);
    const angVel = rigidBodyRef.current.angvel();
    const targetAngY = hovered.current ? 0.6 : Math.sin(t * 0.25) * 0.12;
    rigidBodyRef.current.setAngvel({
      x: angVel.x * 0.9,
      y: (targetAngY - (rigidBodyRef.current.rotation().y % (Math.PI * 2))) * 2,
      z: angVel.z * 0.9 + Math.sin(t * 0.4) * 0.01,
    }, true);
    if (glowRef.current) {
      glowRef.current.intensity = hovered.current
        ? 2.5 + Math.sin(t * 5) * 0.5
        : 0.4 + Math.sin(t * 2 + index) * 0.15;
    }
  });

  return (
    <RigidBody ref={rigidBodyRef} position={position} gravityScale={0} linearDamping={8} angularDamping={6} colliders={false}>
      <CuboidCollider args={[W / 2, H / 2, D / 2]} />
      <group
        onPointerOver={() => { hovered.current = true;  document.body.style.cursor = 'pointer'; }}
        onPointerOut={() =>  { hovered.current = false; document.body.style.cursor = 'auto'; }}
        onClick={(e) => { e.stopPropagation(); onSelect(book); }}
      >
        <mesh castShadow material={materials}>
          <boxGeometry args={[W, H, D]} />
        </mesh>

        {/* Glow light */}
        <pointLight ref={glowRef} color={book.glowColor} intensity={0.4} distance={2.8} decay={2} />

        {/* Soft glow halo */}
        <mesh>
          <sphereGeometry args={[0.85, 8, 8]} />
          <meshBasicMaterial color={book.glowColor} transparent opacity={0.035}
            blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.BackSide} />
        </mesh>

        {/* Title on front if no cover image */}
        {!book.coverImage && (
          <>
            <Text position={[0, 0.25, D / 2 + 0.008]} fontSize={0.08} maxWidth={0.95}
              textAlign="center" color="#ffffff" anchorX="center" anchorY="middle">
              {book.titleEs}
            </Text>
            <Text position={[0, -0.5, D / 2 + 0.008]} fontSize={0.052} maxWidth={0.9}
              textAlign="center" color={book.glowColor} anchorX="center" anchorY="middle">
              Andrew Myer
            </Text>
          </>
        )}

        {/* Orbit ring */}
        <OrbitRing color={book.glowColor} />
      </group>
    </RigidBody>
  );
}

function OrbitRing({ color }: { color: string }) {
  const ringRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ringRef.current) return;
    ringRef.current.rotation.y = state.clock.elapsedTime * 1.5;
    ringRef.current.rotation.x = state.clock.elapsedTime * 0.4;
  });
  return (
    <group ref={ringRef}>
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.9, Math.sin(a * 0.5) * 0.2, Math.sin(a) * 0.9]}>
            <sphereGeometry args={[0.018, 4, 4]} />
            <meshBasicMaterial color={color} transparent opacity={0.6} blending={THREE.AdditiveBlending} />
          </mesh>
        );
      })}
    </group>
  );
}

export default function PhysicsBooks({ onSelect }: { onSelect: (b: Book) => void }) {
  const cols = 3, xSpan = 2.8, ySpan = 2.0;
  return (
    <Physics gravity={[0, 0, 0]} timeStep="vary">
      {BOOKS.filter(b => !b.comingSoon).map((book, i) => (
        <PhysicsBook key={book.id} book={book} position={[
          (i % cols - (cols - 1) / 2) * xSpan,
          Math.floor(i / cols) * -ySpan + 0.5, 0
        ]} index={i} onSelect={onSelect} />
      ))}
    </Physics>
  );
}
