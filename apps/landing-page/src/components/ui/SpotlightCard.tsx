import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

export default function SpotlightCard({ children, className = "", href, onClick }: { children: React.ReactNode, className?: string, href?: string, onClick?: () => void }) {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [opacity, setOpacity] = useState(0);

  // Framer Motion Values for 3D physics (Item 21)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), { damping: 20, stiffness: 150 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), { damping: 20, stiffness: 150 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    
    // Pixel positions for spotlight
    const xPos = e.clientX - rect.left;
    const yPos = e.clientY - rect.top;
    
    // Normalized positions for 3D Tilt (-0.5 to 0.5)
    mouseX.set(xPos / rect.width - 0.5);
    mouseY.set(yPos / rect.height - 0.5);
    
    // Fallback for CSS background
    div.style.setProperty('--mouse-x', `${xPos}px`);
    div.style.setProperty('--mouse-y', `${yPos}px`);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
    mouseX.set(0);
    mouseY.set(0);
  };

  const Component = href ? motion.a : motion.div;

  return (
    <Component
      // @ts-ignore
      href={href}
      onClick={onClick}
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className={`relative overflow-hidden rounded-[2.5rem] bg-white/[0.02] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-colors duration-500 hover:border-white/[0.15] hover:bg-white/[0.04] block ${className}`}
    >
      {/* 30. Hover "Lanterna" Aprimorado (Sharp highlight on edges + soft ambient center) */}
      <div
        className="pointer-events-none absolute -inset-px transition duration-300 z-0"
        style={{
          opacity,
          background: `
            radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.08), transparent 40%),
            radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.03), transparent 60%)
          `,
        }}
      />
      {/* Inner physical reflection */}
      <div 
        className="pointer-events-none absolute inset-0 rounded-[2.5rem] transition duration-300 z-0 mix-blend-overlay"
        style={{
          opacity: opacity * 0.5,
          background: `radial-gradient(1000px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.1), transparent 50%)`
        }}
      ></div>
      
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </Component>
  );
}
