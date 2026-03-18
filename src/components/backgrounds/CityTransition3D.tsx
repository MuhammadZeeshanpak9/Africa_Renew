import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { useScroll, useSpring } from 'framer-motion';
import * as THREE from 'three';

// ── CUSTOM SHADER MATERIALS FOR RECONSTRUCTION EFFECT ──
// We patch standard ThreeJS materials to clip them based on a global Y height (scanning upward).
const oldScannableMaterial = new THREE.MeshStandardMaterial({
  color: '#a3988f', // Aged stone/brick
  roughness: 0.9,
  metalness: 0.1,
  side: THREE.DoubleSide
});
oldScannableMaterial.onBeforeCompile = (shader) => {
  shader.uniforms.uScanY = { value: 0 };
  shader.vertexShader = `
    varying vec3 vWorldPos;
    ${shader.vertexShader}
  `.replace(
    `#include <worldpos_vertex>`,
    `#include <worldpos_vertex>
     vWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;`
  );
  shader.fragmentShader = `
    uniform float uScanY;
    varying vec3 vWorldPos;
    ${shader.fragmentShader}
  `.replace(
    `#include <dithering_fragment>`,
    `#include <dithering_fragment>
     if (vWorldPos.y < uScanY) discard; // Hide old building BELOW the scan
    `
  );
  oldScannableMaterial.userData.shader = shader;
};

// Darker older roofs/ledges
const oldScannableDarkMaterial = oldScannableMaterial.clone();
oldScannableDarkMaterial.color.set('#5a544f');

const newScannableMaterial = new THREE.MeshPhysicalMaterial({
  color: '#ffffff', // Clean white/glass base
  transmission: 0.95, // Glass-like
  opacity: 1,
  metalness: 0.8,
  roughness: 0.05,
  ior: 1.5,
  thickness: 2,
  side: THREE.DoubleSide
});
newScannableMaterial.onBeforeCompile = (shader) => {
  shader.uniforms.uScanY = { value: 0 };
  shader.vertexShader = `
    varying vec3 vWorldPos;
    ${shader.vertexShader}
  `.replace(
    `#include <worldpos_vertex>`,
    `#include <worldpos_vertex>
     vWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;`
  );
  shader.fragmentShader = `
    uniform float uScanY;
    varying vec3 vWorldPos;
    ${shader.fragmentShader}
  `.replace(
    `#include <dithering_fragment>`,
    `#include <dithering_fragment>
     if (vWorldPos.y > uScanY) discard; // Hide new building ABOVE the scan
     
     // Glowing hot reconstruction edge
     float dist = uScanY - vWorldPos.y;
     if (dist < 0.3) {
       gl_FragColor += vec4(0.0, 0.5, 1.0, 1.0) * (1.0 - (dist / 0.3));
     }
    `
  );
  newScannableMaterial.userData.shader = shader;
};

const newScannableSolidMaterial = new THREE.MeshStandardMaterial({
  color: '#e0e5eb', // Steel/concrete frames
  roughness: 0.2,
  metalness: 0.6,
});
newScannableSolidMaterial.onBeforeCompile = newScannableMaterial.userData.shader ? Math.random : (shader) => {
  shader.uniforms.uScanY = { value: 0 };
  shader.vertexShader = `
    varying vec3 vWorldPos;
    ${shader.vertexShader}
  `.replace(
    `#include <worldpos_vertex>`,
    `#include <worldpos_vertex>
     vWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;`
  );
  shader.fragmentShader = `
    uniform float uScanY;
    varying vec3 vWorldPos;
    ${shader.fragmentShader}
  `.replace(
    `#include <dithering_fragment>`,
    `#include <dithering_fragment>
     if (vWorldPos.y > uScanY) discard;
     float dist = uScanY - vWorldPos.y;
     if (dist < 0.2) {
       gl_FragColor += vec4(0.0, 0.8, 1.0, 1.0) * (1.0 - (dist / 0.2));
     }
    `
  );
  newScannableSolidMaterial.userData.shader = shader;
};


// ── PROCEDURAL CITY GENERATOR (No generic blocks) ──
type BuildingData = {
  id: number;
  x: number; z: number;
  oldHeight: number; w: number; d: number;
  newHeight: number;
  oldType: 'factory' | 'classic' | 'block';
  newType: 'glass-tower' | 'cylinder' | 'tiered';
  roofDir: 'left' | 'right';
};

const generateCityMap = () => {
  const b: BuildingData[] = [];
  let seed = 9182;
  const rng = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  
  // Create a grid with some noise
  for (let x = -40; x <= 40; x += 6) {
    for (let z = -20; z >= -60; z -= 8) {
      if (rng() > 0.8) continue; // Leaves natural gaps/streets
      
      const dist = Math.sqrt(x*x + z*z);
      const isCenter = dist < 25;
      
      b.push({
        id: b.length,
        x: x + (rng() * 2 - 1),
        z: z + (rng() * 2 - 1),
        w: 3 + rng() * 2.5,
        d: 3 + rng() * 2.5,
        oldHeight: 2 + rng() * 6 + (isCenter ? 4 : 0),
        newHeight: 8 + rng() * 15 + (isCenter ? 25 : 0),
        oldType: rng() > 0.6 ? 'factory' : (rng() > 0.3 ? 'classic' : 'block'),
        newType: rng() > 0.7 ? 'cylinder' : (rng() > 0.4 ? 'tiered' : 'glass-tower'),
        roofDir: rng() > 0.5 ? 'left' : 'right'
      });
    }
  }
  return b;
};

const CITY_DATA = generateCityMap();

// ── COMPOSITE ARCHITECTURAL MODULES ──

const RightTriangleRoof = ({ w, d, dir, y }: { w: number, d: number, dir: 'left' | 'right', y: number }) => {
  const shape = React.useMemo(() => {
    const s = new THREE.Shape();
    if (dir === 'left') {
      s.moveTo(-w/2, 0); 
      s.lineTo(w/2, 0);
      s.lineTo(-w/2, w); // Isosceles right triangle
      s.lineTo(-w/2, 0);
    } else {
      s.moveTo(-w/2, 0);
      s.lineTo(w/2, 0);
      s.lineTo(w/2, w); // Peak right
      s.lineTo(-w/2, 0);
    }
    return s;
  }, [w, dir]);

  return (
    <mesh material={newScannableMaterial} position={[0, y, -d/2]} castShadow>
      <extrudeGeometry args={[shape, { depth: d, bevelEnabled: false }]} />
    </mesh>
  );
};

const OldBuilding = ({ data }: { data: BuildingData }) => {
  return (
    <group position={[data.x, 0, data.z]}>
      {/* Base Structure */}
      <mesh material={oldScannableMaterial} position={[0, data.oldHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[data.w, data.oldHeight, data.d]} />
      </mesh>
      
      {/* Architectural details per type */}
      {data.oldType === 'classic' && (
        <>
          {/* Top Cornice */}
          <mesh material={oldScannableDarkMaterial} position={[0, data.oldHeight + 0.2, 0]} castShadow>
            <boxGeometry args={[data.w + 0.4, 0.4, data.d + 0.4]} />
          </mesh>
          {/* Base molding */}
          <mesh material={oldScannableDarkMaterial} position={[0, 0.5, 0]}>
            <boxGeometry args={[data.w + 0.2, 1, data.d + 0.2]} />
          </mesh>
        </>
      )}
      
      {data.oldType === 'factory' && (
        <>
          {/* Pitched Roof illusion */}
          <mesh material={oldScannableDarkMaterial} position={[0, data.oldHeight + 0.5, 0]} rotation={[Math.PI/2, Math.PI/2, 0]} castShadow>
            <cylinderGeometry args={[data.w / 2, data.w / 2, data.d, 3]} />
          </mesh>
          {/* Chimney */}
          <mesh material={oldScannableMaterial} position={[data.w / 3, data.oldHeight + 1.5, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.4, 3, 8]} />
          </mesh>
        </>
      )}
    </group>
  );
};

const NewBuilding = ({ data, progressValue }: { data: BuildingData, progressValue: React.MutableRefObject<number> }) => {
  const isCyl = data.newType === 'cylinder';
  const isTiered = data.newType === 'tiered';
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const scanY = progressValue.current * 60;
    // Top of the building rides exactly on the scanline until it reaches Y=0
    let yPos = scanY - data.newHeight;
    if (yPos > 0) yPos = 0;
    groupRef.current.position.y = yPos;
  });

  return (
    <group ref={groupRef} position={[data.x, -data.newHeight, data.z]}>
      {isCyl ? (
        <>
          {/* Cylindrical Glass Tower */}
          <mesh material={newScannableMaterial} position={[0, data.newHeight / 2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[data.w / 2.2, data.w / 2, data.newHeight, 32]} />
          </mesh>
          {/* Structural Steel Rings */}
          {[...Array(Math.floor(data.newHeight / 5))].map((_, i) => (
             <mesh key={i} material={newScannableSolidMaterial} position={[0, (i + 1) * 5, 0]}>
               <cylinderGeometry args={[data.w / 2.15, data.w / 2.15, 0.2, 32]} />
             </mesh>
          ))}
        </>
      ) : isTiered ? (
        <>
          {/* Tiered Stacked Blocks */}
          <mesh material={newScannableMaterial} position={[0, data.newHeight * 0.25, 0]} castShadow receiveShadow>
            <boxGeometry args={[data.w, data.newHeight * 0.5, data.d]} />
          </mesh>
          <mesh material={newScannableMaterial} position={[0, data.newHeight * 0.75, 0]} castShadow receiveShadow>
            <boxGeometry args={[data.w * 0.7, data.newHeight * 0.5, data.d * 0.7]} />
          </mesh>
          {/* Solid Core/Edge Pillars */}
          <mesh material={newScannableSolidMaterial} position={[data.w/2, data.newHeight/2, data.d/2]}>
            <boxGeometry args={[0.3, data.newHeight, 0.3]} />
          </mesh>
        </>
      ) : (
        <>
          {/* Sleek Modern Monolith Base */}
          <mesh material={newScannableMaterial} position={[0, (data.newHeight - data.w * 0.85) / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[data.w * 0.85, data.newHeight - data.w * 0.85, data.d * 0.85]} />
          </mesh>
          
          {/* Isosceles Right/Left Triangle Roof */}
          <RightTriangleRoof w={data.w * 0.85} d={data.d * 0.85} dir={data.roofDir} y={data.newHeight - data.w * 0.85} />
          
          {/* Vertical mullions */}
          <mesh material={newScannableSolidMaterial} position={[0, (data.newHeight - data.w * 0.85) / 2, data.d * 0.44]}>
             <boxGeometry args={[0.1, data.newHeight - data.w * 0.85, 0.1]} />
          </mesh>
        </>
      )}
    </group>
  );
};


// ── MAIN COMPONENT ──
interface SceneProps {
  progressValue: { current: number };
}

const CityScene = ({ progressValue }: SceneProps) => {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  // Animate uniforms and camera based on scroll
  useFrame((state) => {
    const p = progressValue.current;
    
    // 1. City Base Ascension: Stay buried until past Transformation Video
    const riseStart = 0.25;
    const riseEnd = 0.4;
    let globalY = 0;
    
    if (p < riseStart) {
      globalY = -80; // Keep completely hidden deep underground
    } else if (p <= riseEnd) {
      // Ascend steadily into view
      const emergeProgress = (p - riseStart) / (riseEnd - riseStart);
      globalY = -80 * (1 - emergeProgress);
    }

    if (groupRef.current) {
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, globalY, 0.1);
    }
    
    // 2. Scanline Reconstruction Logic: Starts only after city has fully emerged
    const scanStart = 0.45;
    let scanY = 0;
    if (p >= scanStart) {
      const scanProgress = (p - scanStart) / (1.0 - scanStart); // normalize 0-1
      scanY = scanProgress * 60; 
    }

    // Update global shader uniforms
    if (oldScannableMaterial.userData.shader) oldScannableMaterial.userData.shader.uniforms.uScanY.value = scanY;
    if (oldScannableDarkMaterial.userData.shader) oldScannableDarkMaterial.userData.shader.uniforms.uScanY.value = scanY;
    if (newScannableMaterial.userData.shader) newScannableMaterial.userData.shader.uniforms.uScanY.value = scanY;
    if (newScannableSolidMaterial.userData.shader) newScannableSolidMaterial.userData.shader.uniforms.uScanY.value = scanY;

    // Cinematic Parallax Camera tracking
    let targetCamY = 8 + state.pointer.y;
    let targetCamZ = 20;
    let lookTargetY = 5;
    let lookTargetZ = -20;

    if (p < 0.75) {
      // Normal parallax push-in
      const stageP = p / 0.75;
      targetCamY = 8 - stageP * 3 + state.pointer.y;
      targetCamZ = 20 - stageP * 5;
    } else {
      // Epic aerial zoom out for the finale (0.75 -> 1.0)
      const endP = (p - 0.75) / 0.25;
      targetCamY = 5 + endP * 50 + state.pointer.y; // Swoop very high
      targetCamZ = 15 + endP * 30; // Pull back out of the buildings
      lookTargetY = 5 - endP * 5; // Look down closer to the ground
      lookTargetZ = -20 - endP * 15; // Point deeper into the city block
    }

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, state.pointer.x * 2, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamY, 0.05);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCamZ, 0.05);
    camera.lookAt(0, lookTargetY, lookTargetZ);
  });

  return (
    <>
      {/* ── HIGH FIDELITY GLOBAL ILLUMINATION (White BG strictly) ── */}
      <color attach="background" args={['#ffffff']} />
      
      {/* Very soft atmospheric depth (white haze) */}
      <fog attach="fog" args={['#ffffff', 30, 90]} />
      
      {/* Soft daylight rig */}
      <ambientLight intensity={0.6} color="#ffffff" />
      <directionalLight 
        position={[20, 50, -20]} 
        intensity={2.5} 
        color="#fff5eb" 
        castShadow 
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Soft bounce light from ground (skylight emulation) */}
      <directionalLight position={[-10, 10, 20]} intensity={1.0} color="#e0f0ff" />

      {/* Screen-space reflections & premium glass need an Environment Map */}
      <Environment preset="city" environmentIntensity={0.8} />

      {/* ── SCENE GEOMETRY ── */}
      <group ref={groupRef}>
        
        {/* Soft, premium solid ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[200, 200]} />
          <meshStandardMaterial color="#f8f9fa" roughness={0.8} metalness={0.1} />
        </mesh>
        
        {/* Contact shadows for grounded realism without pure black */}
        <ContactShadows position={[0, 0.01, 0]} opacity={0.4} scale={100} blur={2} far={10} color="#4a5568" />

        {/* Instantiating Old and New modular geometry sets. 
            They sit on top of each other, but the custom shaders clip them seamlessly! */}
        {CITY_DATA.map((b) => (
           <React.Fragment key={b.id}>
             <OldBuilding data={b} />
             <NewBuilding data={b} progressValue={progressValue} />
           </React.Fragment>
        ))}

      </group>
    </>
  );
};

export default function CityTransition3D() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    restDelta: 0.001
  });
  
  const progressValueRef = useRef(0);
  useEffect(() => smoothProgress.onChange((v) => { progressValueRef.current = v; }), [smoothProgress]);

  return (
    <div className="absolute inset-0 w-full h-full bg-white z-0 overflow-hidden">
      <Canvas
        camera={{ position: [0, 8, 20], fov: 40 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
        shadows
        dpr={[1, 2]} // High res on retina screens
      >
        <CityScene progressValue={progressValueRef} />
      </Canvas>
    </div>
  );
}
