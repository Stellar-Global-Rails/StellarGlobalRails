import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface Props {
  src: string;
  alt: string;
  className?: string;
  blurColor?: string;
}

export default function BlurImage({ src, alt, className = '', blurColor = '#10B981' }: Props) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simula o carregamento da imagem real para demonstrar o efeito de blurhash
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Fake Blurhash Canvas / Background */}
      <motion.div 
        animate={{ opacity: isLoaded ? 0 : 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 z-10"
        style={{ 
          backgroundColor: blurColor,
          filter: 'blur(20px)',
          transform: 'scale(1.2)'
        }}
      />
      
      {/* The Actual Image (Simulated) */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 1.05 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="absolute inset-0 z-20 flex items-center justify-center bg-neutral-800"
      >
        <span className="text-white/20 font-mono text-xs text-center px-4">
          [High-Res Image Loaded: {alt}]
        </span>
      </motion.div>
    </div>
  );
}
