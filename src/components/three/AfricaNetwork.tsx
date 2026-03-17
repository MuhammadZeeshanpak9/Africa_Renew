import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Line } from '@react-three/drei';
import * as THREE from 'three';

// Africa continent outline points (simplified)
const AFRICA_POINTS: [number, number][] = [
  // Northern coast
  [-6, 36], [0, 37], [10, 37], [20, 33], [30, 31], [35, 25], [40, 12], [51, 12],
  // Eastern coast
  [51, 0], [42, -12], [40, -20], [35, -26], [32, -29],
  // Southern coast
  [27, -34], [20, -35], [15, -30], [10, -25],
  // Western coast
  [5, -20], [0, -15], [-5, -8], [-10, 5], [-17, 11], [-17, 16], [-6, 36]
];

interface NodeNetworkProps {
  scrollProgress: React.MutableRefObject<number>;
  mousePosition: React.MutableRefObject<{ x: number; y: number }>;
}

function NodeNetwork({ scrollProgress, mousePosition }: NodeNetworkProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.Group>(null);
  
  // Generate nodes based on Africa shape
  const { positions, targetPositions, nodeCount } = useMemo(() => {
    const count = 400;
    const positions = new Float32Array(count * 3);
    const targetPositions = new Float32Array(count * 3);
    
    // Create Africa shape boundary
    const africaShape = new THREE.Shape();
    AFRICA_POINTS.forEach((point, i) => {
      const [lon, lat] = point;
      const x = (lon / 60) * 4;
      const y = (lat / 40) * 3;
      if (i === 0) africaShape.moveTo(x, y);
      else africaShape.lineTo(x, y);
    });
    
    for (let i = 0; i < count; i++) {
      // Random scattered position (chaotic state)
      const angle = Math.random() * Math.PI * 2;
      const radius = 2 + Math.random() * 3;
      const scatterX = Math.cos(angle) * radius;
      const scatterY = Math.sin(angle) * radius;
      const scatterZ = (Math.random() - 0.5) * 2;
      
      positions[i * 3] = scatterX;
      positions[i * 3 + 1] = scatterY;
      positions[i * 3 + 2] = scatterZ;
      
      // Target position within Africa shape (unified state)
      let targetX, targetY, targetZ;
      let attempts = 0;
      
      do {
        const lon = -17 + Math.random() * 68;
        const lat = -35 + Math.random() * 72;
        targetX = (lon / 60) * 4;
        targetY = (lat / 40) * 3;
        targetZ = (Math.random() - 0.5) * 0.5;
        attempts++;
      } while (attempts < 10);
      
      targetPositions[i * 3] = targetX;
      targetPositions[i * 3 + 1] = targetY;
      targetPositions[i * 3 + 2] = targetZ;
    }
    
    return { positions, targetPositions, nodeCount: count };
  }, []);
  
  // Current positions for animation
  const currentPositions = useRef(new Float32Array(positions));
  
  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const progress = scrollProgress.current;
    const time = state.clock.elapsedTime;
    
    // Update positions based on scroll progress
    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < nodeCount; i++) {
      const i3 = i * 3;
      
      // Interpolate between scattered and unified positions
      const targetX = targetPositions[i3];
      const targetY = targetPositions[i3 + 1];
      const targetZ = targetPositions[i3 + 2];
      
      const startX = positions[i3];
      const startY = positions[i3 + 1];
      const startZ = positions[i3 + 2];
      
      // Eased progress
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      // Add subtle floating animation
      const floatX = Math.sin(time * 0.5 + i * 0.1) * 0.02;
      const floatY = Math.cos(time * 0.3 + i * 0.1) * 0.02;
      
      posArray[i3] = startX + (targetX - startX) * easedProgress + floatX;
      posArray[i3 + 1] = startY + (targetY - startY) * easedProgress + floatY;
      posArray[i3 + 2] = startZ + (targetZ - startZ) * easedProgress;
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Update connection lines
    if (linesRef.current && progress > 0.3) {
      const lineOpacity = Math.min(1, (progress - 0.3) / 0.4);
      linesRef.current.children.forEach((child) => {
        const line = child as THREE.Line;
        if (line.material) {
          (line.material as THREE.LineBasicMaterial).opacity = lineOpacity * 0.6;
        }
      });
    }
    
    // Mouse parallax effect on camera
    const parallaxX = mousePosition.current.x * 0.3;
    const parallaxY = mousePosition.current.y * 0.3;
    state.camera.position.x += (parallaxX - state.camera.position.x) * 0.05;
    state.camera.position.y += (parallaxY - state.camera.position.y) * 0.05;
    state.camera.lookAt(0, 0, 0);
  });
  
  // Generate connection lines between nearby nodes
  const lineSegments = useMemo(() => {
    const segments: [THREE.Vector3, THREE.Vector3][] = [];
    const connectionDistance = 0.4;
    
    for (let i = 0; i < nodeCount; i += 5) {
      for (let j = i + 1; j < nodeCount; j += 5) {
        const i3 = i * 3;
        const j3 = j * 3;
        
        const dx = targetPositions[i3] - targetPositions[j3];
        const dy = targetPositions[i3 + 1] - targetPositions[j3 + 1];
        const dz = targetPositions[i3 + 2] - targetPositions[j3 + 2];
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        if (distance < connectionDistance) {
          segments.push([
            new THREE.Vector3(targetPositions[i3], targetPositions[i3 + 1], targetPositions[i3 + 2]),
            new THREE.Vector3(targetPositions[j3], targetPositions[j3 + 1], targetPositions[j3 + 2])
          ]);
        }
      }
    }
    
    return segments.slice(0, 150);
  }, [targetPositions, nodeCount]);
  
  return (
    <group>
      {/* Nodes */}
      <Points ref={pointsRef} positions={currentPositions.current}>
        <PointMaterial
          size={0.04}
          color="#9f81b9"
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
      
      {/* Connection Lines */}
      <group ref={linesRef}>
        {lineSegments.map((segment, i) => (
          <Line
            key={i}
            points={segment}
            color="#4fc3f7"
            lineWidth={1}
            transparent
            opacity={0}
          />
        ))}
      </group>
      
      {/* Glow effect */}
      <mesh position={[0, 0, -1]}>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial
          color="#9f81b9"
          transparent
          opacity={0.05}
        />
      </mesh>
    </group>
  );
}

function ParticleField({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particlePositions = useMemo(() => {
    const count = 200;
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 3;
    }
    
    return positions;
  }, []);
  
  useFrame((state) => {
    if (!particlesRef.current) return;
    
    const time = state.clock.elapsedTime;
    const progress = scrollProgress.current;
    
    particlesRef.current.rotation.y = time * 0.02;
    particlesRef.current.rotation.x = Math.sin(time * 0.01) * 0.1;
    
    // Fade out particles as scroll progresses
    const material = particlesRef.current.material as THREE.PointsMaterial;
    material.opacity = 0.4 * (1 - progress * 0.5);
  });
  
  return (
    <Points ref={particlesRef} positions={particlePositions}>
      <PointMaterial
        size={0.02}
        color="#4fc3f7"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function Scene({ scrollProgress, mousePosition }: NodeNetworkProps) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#9f81b9" />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#4fc3f7" />
      
      <ParticleField scrollProgress={scrollProgress} />
      <NodeNetwork scrollProgress={scrollProgress} mousePosition={mousePosition} />
    </>
  );
}

interface AfricaNetworkProps {
  scrollProgress: React.MutableRefObject<number>;
}

export default function AfricaNetwork({ scrollProgress }: AfricaNetworkProps) {
  const mousePosition = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: -(e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 2]}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance'
        }}
      >
        <Scene scrollProgress={scrollProgress} mousePosition={mousePosition} />
      </Canvas>
    </div>
  );
}
