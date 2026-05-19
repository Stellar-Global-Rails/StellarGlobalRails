import { useState, useEffect } from 'react';

export default function KivoA11yToggle() {
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  return (
    <button 
      onClick={() => setHighContrast(!highContrast)}
      className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-medium"
      aria-label="Alternar modo de alto contraste"
      title="Alternar Modo de Alto Contraste"
    >
      {/* @ts-ignore */}
      <iconify-icon icon={highContrast ? "solar:eye-bold" : "solar:eye-closed-bold"}></iconify-icon>
      <span className="hidden md:inline">Alto Contraste</span>
    </button>
  );
}
