import { useEffect, useRef } from 'react';
import createGlobe from 'cobe';

export default function KivoGlobalMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;
    let initialPhi = 0;
    let initialTheta = 0.3;

    // Item 37: Detecção Inteligente de Localização
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data && data.latitude && data.longitude) {
          // Approximate conversion from lat/lon to phi/theta
          initialPhi = (data.longitude * Math.PI) / 180;
          initialTheta = (data.latitude * Math.PI) / 180;
        }
      }).catch(() => {});

    if (!canvasRef.current) return;
    
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 800,
      height: 800,
      phi: initialPhi,
      theta: initialTheta,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.1, 0.1, 0.1], 
      markerColor: [0.1, 0.8, 0.4], 
      glowColor: [0.05, 0.4, 0.2],
      markers: [
        { location: [-23.5505, -46.6333], size: 0.1 }, 
        { location: [40.7128, -74.0060], size: 0.08 }, 
        { location: [51.5074, -0.1278], size: 0.08 }, 
        { location: [35.6762, 139.6503], size: 0.1 }, 
        { location: [-1.2921, 36.8219], size: 0.05 },
      ],
      onRender: (state) => {
        state.phi = initialPhi + phi;
        state.theta = initialTheta;
        phi += 0.005;
      },
    });

    return () => globe.destroy();
  }, []);

  return (
    <div className="flex justify-center items-center w-full max-w-[500px] aspect-square mx-auto opacity-80 mix-blend-screen">
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', contain: 'layout paint size' }}
      />
    </div>
  );
}
