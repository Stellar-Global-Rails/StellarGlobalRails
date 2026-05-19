import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere } from '@react-three/drei';

function FluidSphere({ color, position, speed, distort, scale }: any) {
  const ref = useRef<any>();

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.getElapsedTime() * speed * 0.2;
      ref.current.rotation.y = state.clock.getElapsedTime() * speed * 0.3;
    }
  });

  return (
    <Sphere ref={ref} args={[1, 64, 64]} position={position} scale={scale}>
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={distort}
        speed={speed}
        roughness={0.2}
        metalness={0.8}
        opacity={0.15}
        transparent
      />
    </Sphere>
  );
}

export default function KivoWebGLBackground() {
  const [lowBattery, setLowBattery] = useState(false);

  useEffect(() => {
    // @ts-ignore
    if (navigator.getBattery) {
      // @ts-ignore
      navigator.getBattery().then((battery) => {
        const updateBattery = () => {
          if (!battery.charging && battery.level <= 0.20) {
            setLowBattery(true);
          } else {
            setLowBattery(false);
          }
        };
        updateBattery();
        battery.addEventListener('levelchange', updateBattery);
        battery.addEventListener('chargingchange', updateBattery);
      });
    }
  }, []);

  if (lowBattery) return null; // Fallback para poupar bateria (Item 46)

  return (
    <div className="fixed inset-0 z-[-2] pointer-events-none opacity-80 mix-blend-screen">
      <Canvas camera={{ position: [0, 0, 10] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        
        <FluidSphere color="#10B981" position={[-6, 4, -8]} speed={2} distort={0.6} scale={6} />
        <FluidSphere color="#059669" position={[8, -6, -5]} speed={1.5} distort={0.5} scale={8} />
        <FluidSphere color="#047857" position={[0, -2, -10]} speed={1} distort={0.7} scale={7} />
      </Canvas>
    </div>
  );
}
