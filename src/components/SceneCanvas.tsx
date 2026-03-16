import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bounds, ContactShadows, Environment, Float, OrbitControls, PerspectiveCamera, useCursor } from '@react-three/drei';
import * as THREE from 'three';
import { ExtrudeGeometry } from 'three';
import { parseSvgToShapes } from '../lib/svg';
import { useEditorStore } from '../state';
import { createTexture } from '../lib/textures';

export function SceneCanvas() {
  return (
    <div className="viewport-shell">
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, preserveDrawingBuffer: true }}>
        <color attach="background" args={['#08090d']} />
        <PerspectiveCamera makeDefault position={[0, 0, 180]} fov={40} />
        <Scene />
      </Canvas>
    </div>
  );
}

function Scene() {
  const state = useEditorStore();
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const followLightRef = useRef<THREE.PointLight>(null);
  useCursor(hovered);

  const geometry = useMemo(() => {
    try {
      const shapes = parseSvgToShapes(state.svgText);
      const geom = new ExtrudeGeometry(shapes, {
        depth: state.extrusion.depth,
        bevelEnabled: state.extrusion.bevelEnabled,
        bevelSize: state.extrusion.bevelSize,
        bevelThickness: state.extrusion.bevelThickness,
        bevelSegments: state.extrusion.bevelSegments,
        curveSegments: state.extrusion.curveSegments,
      });
      geom.center();
      geom.computeVertexNormals();
      useEditorStore.setState({ error: '' });
      return geom;
    } catch (error) {
      useEditorStore.setState({ error: error instanceof Error ? error.message : 'Could not parse SVG' });
      return new THREE.BoxGeometry(40, 40, 12);
    }
  }, [state.svgText, state.extrusion]);

  const texture = useMemo(() => createTexture(state.texturePreset), [state.texturePreset]);

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => texture?.dispose(), [texture]);

  useFrame((clockState, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const speedMultiplier = state.animationPreset === 'turntableFast' ? 2.2 : state.animationPreset === 'turntableMedium' ? 1.1 : 0.45;

    if (state.animationPreset.startsWith('turntable')) {
      group.rotation.y += delta * state.animationSpeed * speedMultiplier;
    }

    if (state.animationPreset === 'float') {
      group.position.y = Math.sin(clockState.clock.elapsedTime * state.animationSpeed) * 4;
      group.rotation.y += delta * 0.5 * state.animationSpeed;
    }

    if (state.hoverTilt && hovered) {
      const pointerX = clockState.pointer.x * 0.18;
      const pointerY = clockState.pointer.y * 0.12;
      group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, -pointerY, 0.12);
      group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, pointerX, 0.12);
    } else {
      group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, 0, 0.08);
      group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, 0, 0.08);
    }

    if (state.mouseFollowLight && followLightRef.current) {
      followLightRef.current.position.x = THREE.MathUtils.lerp(followLightRef.current.position.x, clockState.pointer.x * 80, 0.08);
      followLightRef.current.position.y = THREE.MathUtils.lerp(followLightRef.current.position.y, clockState.pointer.y * 50 + 30, 0.08);
    }
  });

  return (
    <>
      <Environment preset={state.environmentPreset} background={state.useEnvironmentBackground} />
      <Lighting />
      {state.mouseFollowLight && <pointLight ref={followLightRef} intensity={2} distance={240} position={[0, 20, 70]} color="#ffffff" />}
      <Bounds fit clip observe margin={1.2}>
        <Float enabled={false}>
          <group ref={groupRef}>
            <mesh
              geometry={geometry}
              castShadow
              receiveShadow
              onPointerOver={() => setHovered(true)}
              onPointerOut={() => setHovered(false)}
            >
              <meshPhysicalMaterial
                color={state.materialColor}
                metalness={state.metalness}
                roughness={state.roughness}
                transmission={state.transmission}
                opacity={state.opacity}
                transparent={state.opacity < 1 || state.transmission > 0}
                ior={state.ior}
                clearcoat={state.clearcoat}
                envMapIntensity={state.environmentIntensity}
                map={texture ?? null}
                emissive={state.hoverGlow && hovered ? '#3b82f6' : '#000000'}
                emissiveIntensity={state.hoverGlow && hovered ? 0.2 : 0}
              />
            </mesh>
          </group>
        </Float>
      </Bounds>
      <ContactShadows position={[0, -40, 0]} opacity={0.45} scale={180} blur={2.5} far={120} />
      <OrbitControls enableDamping makeDefault />
      <ViewportInfo />
    </>
  );
}

function Lighting() {
  const preset = useEditorStore((state) => state.lightingPreset);

  if (preset === 'spotlight') {
    return (
      <>
        <ambientLight intensity={0.25} />
        <spotLight position={[30, 60, 70]} angle={0.28} penumbra={0.6} intensity={2200} castShadow />
        <rectAreaLight position={[-35, 15, 40]} width={40} height={40} intensity={8} />
      </>
    );
  }

  if (preset === 'dramatic') {
    return (
      <>
        <ambientLight intensity={0.1} />
        <directionalLight position={[60, 18, 40]} intensity={2.6} castShadow />
        <rectAreaLight position={[-40, 30, 20]} width={16} height={80} intensity={10} color="#6aa9ff" />
      </>
    );
  }

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[40, 50, 45]} intensity={1.7} castShadow />
      <rectAreaLight position={[-45, 20, 30]} width={50} height={40} intensity={6.5} color="#ffffff" />
      <spotLight position={[0, 60, 90]} angle={0.35} penumbra={0.7} intensity={900} />
    </>
  );
}

function ViewportInfo() {
  const { gl } = useThree();
  useEffect(() => {
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.15;
  }, [gl]);
  return null;
}
