import { useRef, useState, useCallback } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Text, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import type { Book } from '../../lib/books';

interface Props {
  book:     Book;
  position: [number, number, number];
  index:    number;
  onSelect: (book: Book) => void;
}

export default function BookMesh({ book, position, index, onSelect }: Props) {
  const group      = useRef<THREE.Group>(null);
  const coverMesh  = useRef<THREE.Mesh>(null);
  const [hovered,  setHovered]  = useState(false);
  const [active,   setActive]   = useState(false);
  const glowRef    = useRef<THREE.PointLight>(null);

  const handlePointerOver = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  }, []);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  }, []);

  const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setActive(true);
    onSelect(book);
    setTimeout(() => setActive(false), 300);
  }, [book, onSelect]);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime + index * 1.3;

    // Float animation
    group.current.position.y = position[1] + Math.sin(t * 0.6) * 0.25;
    // Gentle tilt
    group.current.rotation.y = Math.sin(t * 0.3) * 0.15 + (hovered ? 0.3 : 0);
    group.current.rotation.z = Math.sin(t * 0.4) * 0.05;

    // Hover scale
    const targetScale = hovered ? 1.12 : active ? 0.95 : 1;
    group.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    );

    // Glow intensity
    if (glowRef.current) {
      glowRef.current.intensity = hovered
        ? 2 + Math.sin(state.clock.elapsedTime * 4) * 0.5
        : 0.3 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.2;
    }
  });

  const coverCol = new THREE.Color(book.coverColor);
  const glowCol  = new THREE.Color(book.glowColor);
  const W = 1.2, H = 1.6, D = 0.12;

  return (
    <group
      ref={group}
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {/* Dynamic glow light */}
      <pointLight
        ref={glowRef}
        color={book.glowColor}
        intensity={0.4}
        distance={3}
        decay={2}
      />

      {/* Book cover (front face) */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[W, H, D]} />
        <meshStandardMaterial
          color={coverCol}
          emissive={hovered ? glowCol : coverCol}
          emissiveIntensity={hovered ? 0.6 : 0.1}
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>

      {/* Spine */}
      <mesh position={[-W / 2 - 0.01, 0, 0]}>
        <boxGeometry args={[0.02, H, D]} />
        <meshStandardMaterial color={book.spineColor} roughness={0.5} />
      </mesh>

      {/* Cover glow plane (visible only on hover) */}
      {hovered && (
        <mesh position={[0, 0, D / 2 + 0.001]}>
          <planeGeometry args={[W, H]} />
          <meshBasicMaterial
            color={book.glowColor}
            transparent
            opacity={0.15}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Title text on cover */}
      <Text
        position={[0, 0.3, D / 2 + 0.01]}
        fontSize={0.09}
        maxWidth={1}
        textAlign="center"
        color={hovered ? '#ffffff' : '#e2d9f3'}
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/cormorantgaramond/v22/co3WmX5slCNuHLi8bLeY9MK7whWMhyjornFLsS6V7w.woff2"
      >
        {book.titleEs}
      </Text>

      {/* Author name */}
      <Text
        position={[0, -0.55, D / 2 + 0.01]}
        fontSize={0.055}
        maxWidth={1}
        textAlign="center"
        color={book.glowColor}
        anchorX="center"
        anchorY="middle"
      >
        Andrew Myer
      </Text>

      {/* Hover orbit particles */}
      {hovered && <OrbitParticles color={book.glowColor} />}
    </group>
  );
}

// Small particles orbiting the book on hover
function OrbitParticles({ color }: { color: string }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y  = state.clock.elapsedTime * 2;
    ref.current.rotation.x  = state.clock.elapsedTime * 0.7;
  });

  return (
    <group ref={ref}>
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const r     = 1;
        return (
          <mesh key={i} position={[Math.cos(angle) * r, Math.sin(angle * 0.5) * 0.3, Math.sin(angle) * r]}>
            <sphereGeometry args={[0.02, 4, 4]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.8}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        );
      })}
    </group>
  );
}
