import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, MeshDistortMaterial } from '@react-three/drei';

function Vault3D() {
  const mesh = useRef<any>(null);
  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.x += delta * 0.2;
      mesh.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <Box ref={mesh} args={[2, 2, 2]} radius={0.1}>
      <MeshDistortMaterial color="#10B981" attach="material" distort={0.2} speed={1} roughness={0.1} metalness={0.8} wireframe={true} />
    </Box>
  );
}

export default function OnyxVault3D() {
  return (
    <div className="w-full h-full min-h-[300px] pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Vault3D />
      </Canvas>
    </div>
  );
}
