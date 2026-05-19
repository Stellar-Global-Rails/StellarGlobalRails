import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { useInView } from 'motion/react';
import * as THREE from 'three';

function DataRing({ radiusBase, count, speed, color, size, waveFreq }: { radiusBase: number, count: number, speed: number, color: string, size: number, waveFreq: number }) {
  const ref = useRef<THREE.Points>(null!);
  
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      // Distribute points with a Gaussian-like cluster near the center of the ring
      const radiusOffset = (Math.random() + Math.random() + Math.random() - 1.5) * 1.5;
      const radius = radiusBase + radiusOffset;
      
      const x = Math.cos(angle) * radius;
      // Add a wave effect to the height
      const y = (Math.random() - 0.5) * 0.8 + Math.sin(angle * waveFreq) * 0.6;
      const z = Math.sin(angle) * radius;
      
      p[i * 3] = x;
      p[i * 3 + 1] = y;
      p[i * 3 + 2] = z;
    }
    return p;
  }, [radiusBase, count, waveFreq]);

  useFrame((state, delta) => {
    ref.current.rotation.y -= delta * speed;
    // Slight breathing tilt
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1 + speed * 10) * 0.05;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent={true}
        color={color}
        size={size} // Using fixed pixel size
        sizeAttenuation={false} // THIS WAS THE FIX: Prevents particles from blurring into grey mush at distance
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={1} // Full opacity for maximum color punch
      />
    </Points>
  );
}

export default function StellarNetwork() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "100px" });

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none opacity-100 mix-blend-screen transition-opacity duration-1000">
      <Canvas frameloop={isInView ? "always" : "demand"} camera={{ position: [0, 2, 8], fov: 60 }} gl={{ antialias: true, alpha: true }}>
        <fog attach="fog" args={['#050505', 4, 12]} />
        <group rotation={[Math.PI / 7, 0, 0]}>
          {/* Main fast rails (Pure White) */}
          <DataRing radiusBase={4} count={12000} speed={0.15} color="#ffffff" size={1.5} waveFreq={3} />
          
          {/* Outer slow rails (Intense Emerald) */}
          <DataRing radiusBase={5.5} count={6000} speed={0.08} color="#00ff88" size={2.5} waveFreq={5} />
          
          {/* Inner dense core (Intense Purple) */}
          <DataRing radiusBase={2.5} count={5000} speed={0.25} color="#a855f7" size={2} waveFreq={2} />
        </group>
      </Canvas>
    </div>
  );
}
