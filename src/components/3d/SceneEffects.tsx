import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction, KernelSize } from 'postprocessing';
import * as THREE from 'three';

export default function SceneEffects() {
  return (
    <EffectComposer>
      <Bloom
        intensity={2.5}
        kernelSize={KernelSize.LARGE}
        luminanceThreshold={0.15}
        luminanceSmoothing={0.85}
        mipmapBlur
        radius={0.9}
      />
      <ChromaticAberration
        offset={new THREE.Vector2(0.0012, 0.0012)}
        blendFunction={BlendFunction.NORMAL}
        radialModulation={true}
        modulationOffset={0.6}
      />
      <Vignette
        offset={0.2}
        darkness={0.85}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}
