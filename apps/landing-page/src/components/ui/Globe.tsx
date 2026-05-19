import createGlobe from 'cobe';
import { useEffect, useRef } from 'react';

export default function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;

    if (!canvasRef.current) return;

    // Use a fixed size to maintain crisp resolution
    const size = 1000;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: size * 2,
      height: size * 2,
      phi: 0,
      theta: 0.2, // Slightly tilt to show Northern Hemisphere
      dark: 1, // 1 is maximum darkness (pure black ocean)
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 8,
      baseColor: [0.1, 0.1, 0.1], // Dark gray continents
      markerColor: [1, 1, 1], // Pure white markers for cities
      glowColor: [0.03, 0.03, 0.03], // Very subtle glow to keep it cinematic
      markers: [
        // Major Global Financial Hubs
        { location: [37.7595, -122.4367], size: 0.05 }, // San Francisco
        { location: [40.7128, -74.0060], size: 0.08 }, // New York
        { location: [51.5074, -0.1278], size: 0.08 }, // London
        { location: [-23.5505, -46.6333], size: 0.08 }, // São Paulo
        { location: [35.6762, 139.6503], size: 0.06 }, // Tokyo
        { location: [1.3521, 103.8198], size: 0.07 }, // Singapore
        { location: [25.2048, 55.2708], size: 0.06 }, // Dubai
      ],
      onRender: (state) => {
        // Slowly rotate the globe
        state.phi = phi;
        phi += 0.002;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <div className="absolute top-[20%] md:top-[10%] left-1/2 -translate-x-1/2 w-full max-w-[1000px] aspect-square pointer-events-none z-0 opacity-80 mix-blend-screen transition-opacity duration-1000">
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          contain: "layout paint size",
          opacity: 1,
          transition: "opacity 1s ease",
        }}
      />
    </div>
  );
}
