import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { languages, defaultLang } from '../../i18n/ui';

const LANG_KEYS = Object.keys(languages);

export default function KivoLanguageSwitcher() {
  const [langKey, setLangKey] = useState('pt-br');

  useEffect(() => {
    // 1. Check local storage
    const saved = localStorage.getItem('sgr-lang');
    if (saved && LANG_KEYS.includes(saved)) {
      setLangKey(saved);
      return;
    }

    // 2. Check browser language
    const browserLang = navigator.language.toLowerCase();
    const matched = LANG_KEYS.find(k => browserLang.startsWith(k));
    
    if (matched) {
      setLangKey(matched);
      localStorage.setItem('sgr-lang', matched);
    } else {
      setLangKey(defaultLang);
      localStorage.setItem('sgr-lang', defaultLang);
    }
  }, []);

  const nextLang = () => {
    const currentIndex = LANG_KEYS.indexOf(langKey);
    const nextIndex = (currentIndex + 1) % LANG_KEYS.length;
    const nextKey = LANG_KEYS[nextIndex];
    
    setLangKey(nextKey);
    localStorage.setItem('sgr-lang', nextKey);
    
    // Notify other components
    window.dispatchEvent(new CustomEvent('sgr-lang-changed', { detail: nextKey }));
    
    // Optional: Reload page for full server-side i18n if needed
    // window.location.reload(); 
  };

  return (
    <button 
      onClick={nextLang}
      className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-medium overflow-hidden h-6 relative w-16"
      title="Mudar Idioma"
    >
      {/* @ts-ignore */}
      <iconify-icon icon="solar:global-bold"></iconify-icon>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={langKey}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute left-6"
        >
          {/* @ts-ignore */}
          {languages[langKey]}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
