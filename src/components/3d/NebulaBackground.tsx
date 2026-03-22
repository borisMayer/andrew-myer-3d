import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function NebulaBackground() {
  const mesh1 = useRef<THREE.Mesh>(null);
  const mesh2 = useRef<THREE.Mesh>(null);
  const mesh3 = useRef<THREE.Mesh>(null);

  // Nebula shader material
  const nebulaMat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime:   { value: 0 },
      uColor1: { value: new THREE.Color('#1a0a3d') },
      uColor2: { value: new THREE.Color('#0d1f4a') },
      uColor3: { value: new THREE.Color('#2d1b69') },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      void main() {
        vUv       = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform vec3 uColor3;
      varying vec2 vUv;
      varying vec3 vPosition;

      float noise(vec3 p) {
        return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
      }

      float smoothNoise(vec3 p) {
        vec3 i = floor(p);
        vec3 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(mix(noise(i), noise(i+vec3(1,0,0)), f.x),
              mix(noise(i+vec3(0,1,0)), noise(i+vec3(1,1,0)), f.x), f.y),
          mix(mix(noise(i+vec3(0,0,1)), noise(i+vec3(1,0,1)), f.x),
              mix(noise(i+vec3(0,1,1)), noise(i+vec3(1,1,1)), f.x), f.y), f.z
        );
      }

      void main() {
        vec2 uv = vUv;
        float t  = uTime * 0.05;

        float n1 = smoothNoise(vec3(uv * 3.0, t));
        float n2 = smoothNoise(vec3(uv * 6.0 + 1.0, t * 1.3));
        float n3 = smoothNoise(vec3(uv * 2.0 - 0.5, t * 0.7));
        float n  = (n1 * 0.5 + n2 * 0.3 + n3 * 0.2);

        vec3 col = mix(uColor1, uColor2, n);
        col      = mix(col, uColor3, n2 * 0.5);

        // Vignette
        float d = length(uv - 0.5) * 1.5;
        col    *= (1.0 - d * d);

        // Stars
        float stars = step(0.998, smoothNoise(vec3(uv * 80.0, 0.0)));
        col += stars * vec3(0.8, 0.8, 1.0) * 0.6;

        gl_FragColor = vec4(col, 1.0);
      }
    `,
    side: THREE.BackSide,
    depthWrite: false,
  }), []);

  useFrame((state) => {
    nebulaMat.uniforms.uTime.value = state.clock.elapsedTime;
    if (mesh1.current) mesh1.current.rotation.y += 0.0002;
    if (mesh2.current) mesh2.current.rotation.y -= 0.0001;
  });

  return (
    <>
      {/* Main nebula sphere */}
      <mesh ref={mesh1}>
        <sphereGeometry args={[50, 32, 32]} />
        <primitive object={nebulaMat} />
      </mesh>

      {/* Secondary glow layer */}
      <mesh ref={mesh2} scale={[0.98, 0.98, 0.98]}>
        <sphereGeometry args={[50, 16, 16]} />
        <meshBasicMaterial
          color="#07001f"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Ambient cosmic fog */}
      <fog attach="fog" args={['#020008', 20, 60]} />
    </>
  );
}
