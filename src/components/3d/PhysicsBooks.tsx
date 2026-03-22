/**
 * PhysicsBooks — libros flotantes con física real de @react-three/rapier
 * Usado en la escena 3D cuando showBooks=true
 * Cada libro tiene RigidBody cinemático con impulsos suaves
 */
import { useRef, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import type { RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { BOOKS } from '../../lib/books';
import type { Book } from '../../lib/books';

interface PhysicsBookProps {
  book:     Book;
  position: [number, number, number];
  index:    number;
  onSelect: (book: Book) => void;
}

function PhysicsBook({ book, position, index, onSelect }: PhysicsBookProps) {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const meshRef      = useRef<THREE.Mesh>(null);
  const glowRef      = useRef<THREE.PointLight>(null);
  const hovered      = useRef(false);
  const baseY        = position[1];

  useFrame((state) => {
    if (!rigidBodyRef.current) return;
    const t = state.clock.elapsedTime + index * 1.7;

    // Target position — float sinusoidally
    const targetY = baseY + Math.sin(t * 0.55) * 0.3;
    const targetX = position[0] + Math.sin(t * 0.3 + index) * 0.08;

    // Kinematic movement — apply as translation impulse
    const current = rigidBodyRef.current.translation();
    const dx = (targetX  - current.x) * 0.06;
    const dy = (targetY  - current.y) * 0.06;
    const dz = (position[2] - current.z) * 0.04;

    rigidBodyRef.current.setLinvel({ x: dx * 60, y: dy * 60, z: dz * 60 }, true);

    // Gentle rotation torque
    const angVel = rigidBodyRef.current.angvel();
    const targetAngY = hovered.current ? 0.6 : Math.sin(t * 0.25) * 0.12;
    rigidBodyRef.current.setAngvel({
      x: angVel.x * 0.9,
      y: (targetAngY - (rigidBodyRef.current.rotation().y % (Math.PI * 2))) * 2,
      z: angVel.z * 0.9 + Math.sin(t * 0.4) * 0.01,
    }, true);

    // Glow pulse
    if (glowRef.current) {
      glowRef.current.intensity = hovered.current
        ? 2.5 + Math.sin(t * 5) * 0.5
        : 0.4 + Math.sin(t * 2 + index) * 0.15;
    }
  });

  const W = 1.1, H = 1.5, D = 0.11;
  const coverCol = new THREE.Color(book.coverColor);
  const glowCol  = new THREE.Color(book.glowColor);

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={position}
      gravityScale={0}          // zero gravity — we control movement manually
      linearDamping={8}
      angularDamping={6}
      colliders={false}
    >
      <CuboidCollider args={[W / 2, H / 2, D / 2]} />

      <group
        onPointerOver={() => { hovered.current = true;  document.body.style.cursor = 'pointer'; }}
        onPointerOut={() =>  { hovered.current = false; document.body.style.cursor = 'auto'; }}
        onClick={(e) => { e.stopPropagation(); onSelect(book); }}
      >
        {/* Book mesh */}
        <mesh ref={meshRef} castShadow>
          <boxGeometry args={[W, H, D]} />
          <meshStandardMaterial
            color={coverCol}
            emissive={glowCol}
            emissiveIntensity={0.25}
            roughness={0.3}
            metalness={0.5}
          />
        </mesh>

        {/* Spine */}
        <mesh position={[-W / 2 - 0.008, 0, 0]}>
          <boxGeometry args={[0.018, H, D]} />
          <meshStandardMaterial color={book.spineColor} roughness={0.6} />
        </mesh>

        {/* Pages edge */}
        <mesh position={[W / 2 + 0.008, 0, 0]}>
          <boxGeometry args={[0.018, H, D]} />
          <meshStandardMaterial color="#e8e0d0" roughness={0.9} />
        </mesh>

        {/* Glow light */}
        <pointLight ref={glowRef} color={book.glowColor} intensity={0.4} distance={2.8} decay={2} />

        {/* Glow halo sphere */}
        <mesh>
          <sphereGeometry args={[0.85, 8, 8]} />
          <meshBasicMaterial
            color={book.glowColor}
            transparent opacity={0.04}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Title on cover */}
        <Text
          position={[0, 0.25, D / 2 + 0.008]}
          fontSize={0.08}
          maxWidth={0.95}
          textAlign="center"
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {book.titleEs}
        </Text>

        {/* Author */}
        <Text
          position={[0, -0.5, D / 2 + 0.008]}
          fontSize={0.052}
          maxWidth={0.9}
          textAlign="center"
          color={book.glowColor}
          anchorX="center"
          anchorY="middle"
        >
          Andrew Myer
        </Text>

        {/* Orbit ring on hover */}
        <OrbitRing color={book.glowColor} />
      </group>
    </RigidBody>
  );
}

// Subtle orbit ring that always spins
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

// Exported wrapper with Physics provider
interface Props {
  onSelect: (book: Book) => void;
}

export default function PhysicsBooks({ onSelect }: Props) {
  const cols  = 3;
  const xSpan = 2.8;
  const ySpan = 2.0;

  return (
    <Physics
      gravity={[0, 0, 0]}   // no gravity
      timeStep="vary"
    >
      {BOOKS.map((book, i) => {
        const col  = i % cols;
        const row  = Math.floor(i / cols);
        const x    = (col - (cols - 1) / 2) * xSpan;
        const y    = row * -ySpan + 0.5;
        return (
          <PhysicsBook
            key={book.id}
            book={book}
            position={[x, y, 0]}
            index={i}
            onSelect={onSelect}
          />
        );
      })}
    </Physics>
  );
}
