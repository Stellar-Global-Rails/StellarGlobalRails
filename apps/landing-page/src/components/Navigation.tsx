import { motion, useScroll, useMotionValueEvent } from 'motion/react';
import { useState, useEffect } from 'react';
import { RailsLogo } from './ui/Logo';
import { useTranslation } from '../hooks/useTranslation';
import MagneticButton from './ui/MagneticButton';

export default function Navigation() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const { t, lang } = useTranslation();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setHidden(true); // 'hidden' actually means 'scrolled' now
    } else {
      setHidden(false); // 'hidden' false means at top
    }
  });

  const [profile, setProfile] = useState<'ceo' | 'dev'>('ceo');

  useEffect(() => {
    const currentProfile = localStorage.getItem('kivo_profile') || 'ceo';
    setProfile(currentProfile as 'ceo' | 'dev');

    const handleProfileChange = (e: CustomEvent) => {
      setProfile(e.detail);
    };

    window.addEventListener('kivo_profile_change', handleProfileChange as EventListener);
    return () => window.removeEventListener('kivo_profile_change', handleProfileChange as EventListener);
  }, []);

  const playToggleSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.05);
      
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
      
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      console.log('Audio disabled');
    }
  };

  const toggleProfile = (newProfile: 'ceo' | 'dev') => {
    if (newProfile !== profile) {
      playToggleSound();
    }
    setProfile(newProfile);
    localStorage.setItem('kivo_profile', newProfile);
    window.dispatchEvent(new CustomEvent('kivo_profile_change', { detail: newProfile }));
  };

  const toggleLang = (newLang: string) => {
    localStorage.setItem('sgr-lang', newLang);
    window.dispatchEvent(new CustomEvent('sgr-lang-changed', { detail: newLang }));
  };

  const languageFlags: Record<string, string> = {
    'pt-br': 'circle-flags:br',
    'en': 'circle-flags:us',
    'es': 'circle-flags:es',
    'zh': 'circle-flags:cn',
    'ko': 'circle-flags:kr',
    'ar': 'circle-flags:sa'
  };

  return (
    <motion.div 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed z-[100] top-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-6xl pointer-events-none"
    >
      <nav className={`pointer-events-auto flex w-full items-center justify-between rounded-[2rem] border transition-all duration-500 ${hidden ? 'bg-[#050505]/70 backdrop-blur-2xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] py-3 px-6' : 'bg-transparent border-transparent py-4 px-2'}`}>
        <a href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-black to-neutral-900 border border-white/20 flex items-center justify-center text-white group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:border-emerald-500/30 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <RailsLogo className="w-7 h-7" />
          </div>
          <div className={`flex flex-col transition-opacity duration-300 ${hidden ? 'md:flex hidden' : 'flex'}`}>
            <span className="font-bricolage text-xl tracking-tight font-medium text-white leading-none group-hover:text-emerald-400 transition-colors">
              STELLAR
            </span>
            <span className="text-[10px] text-white/50 tracking-[0.2em] font-mono leading-none mt-1 group-hover:text-white/70 transition-colors">GLOBAL RAILS</span>
          </div>
        </a>

        <div className={`hidden md:flex items-center gap-8 text-sm font-medium transition-all duration-300 ${hidden ? 'text-white/60' : 'bg-neutral-900/80 border-white/10 border rounded-full pt-2 pb-2 px-6 shadow-xl backdrop-blur-xl text-white/60'}`}>
          <a href="/" className="hover:text-white transition-colors">
            {t('nav.platform')}
          </a>
          <a href="/#products" className="hover:text-white transition-colors">
            {t('nav.products')}
          </a>
          
          <div className="h-4 w-px bg-white/10 mx-2"></div>
          
          <div className="flex bg-black/50 p-1 rounded-full border border-white/5">
            <button 
              onClick={() => toggleProfile('ceo')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${profile === 'ceo' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-white/50 hover:text-white'}`}
            >
              {t('profile.business')}
            </button>
            <button 
              onClick={() => toggleProfile('dev')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${profile === 'dev' ? 'bg-white text-black shadow-lg shadow-white/20' : 'text-white/50 hover:text-white'}`}
            >
              {t('profile.developer')}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-1 backdrop-blur-md">
            {Object.entries(languageFlags).map(([l, icon]) => (
              <button 
                key={l}
                onClick={() => toggleLang(l)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${lang === l ? 'bg-white/20 shadow-lg' : 'opacity-40 grayscale hover:opacity-100 hover:grayscale-0'}`}
                title={l.toUpperCase()}
              >
                {/* @ts-ignore */}
                <iconify-icon icon={icon} width="20"></iconify-icon>
              </button>
            ))}
          </div>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white bg-neutral-900/80 border border-white/10 hover:bg-white/10 backdrop-blur-xl transition-colors md:hidden"
          >
            {/* @ts-ignore */}
            <iconify-icon icon="solar:hamburger-menu-linear" width="20"></iconify-icon>
          </motion.button>
        </div>
      </nav>
    </motion.div>
  );
}