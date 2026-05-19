import { useState, useEffect } from 'react';
import { ui, defaultLang } from '../i18n/ui';

export function useTranslation() {
  const [lang, setLang] = useState(defaultLang);

  useEffect(() => {
    let saved = localStorage.getItem('sgr-lang');
    
    if (!saved) {
      const browserLang = navigator.language.toLowerCase();
      const supported = Object.keys(ui);
      const matched = supported.find(k => browserLang.startsWith(k));
      saved = matched || defaultLang;
      localStorage.setItem('sgr-lang', saved);
    }
    
    setLang(saved);

    const handleLangChange = (e: any) => {
      setLang(e.detail);
    };

    window.addEventListener('sgr-lang-changed', handleLangChange);
    return () => window.removeEventListener('sgr-lang-changed', handleLangChange);
  }, []);

  const t = (key: string) => {
    // @ts-ignore
    return ui[lang]?.[key] || ui[defaultLang]?.[key] || key;
  };

  return { t, lang };
}
