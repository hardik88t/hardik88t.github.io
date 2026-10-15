import * as THREE from 'three';
import { buildTargets, SHAPE_COUNT } from './targets';
import { FRAGMENT_SHADER, VERTEX_SHADER } from './shaders';

export function createUniforms() {
  return {
    uTime: { value: 0 },
    uMorph: { value: 0 },
    uFlow: { value: 0 },
    uIdle: { value: 1 },
    uScale: { value: 2.5 },
    uOffset: { value: new THREE.Vector2(0, 0) },
    uRotY: { value: 0 },
    uRotX: { value: 0 },
    uPixelRatio: { value: 1 },
    uSize: { value: 2.9 },
    uPointer: { value: new THREE.Vector2(0, 0) },
    uPointerAmt: { value: 0 },
  };
}

export type SwarmUniforms = ReturnType<typeof createUniforms>;

export function createMaterial(uniforms: SwarmUniforms): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
  });
}

/** One BufferGeometry holding every shape's targets plus per-particle seeds. */
export function createGeometry(count: number): THREE.BufferGeometry {
  const targets = buildTargets(count);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(targets.shapes[0], 3));
  for (let s = 0; s < SHAPE_COUNT; s++) {
    geometry.setAttribute(`aS${s}`, new THREE.BufferAttribute(targets.shapes[s], 3));
  }
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(targets.seeds, 4));
  // The shader owns positions, so skip per-frame bounds work and disable culling on the Points.
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 6);
  return geometry;
}
