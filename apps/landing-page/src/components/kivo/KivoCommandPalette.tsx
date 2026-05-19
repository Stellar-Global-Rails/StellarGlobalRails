import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const MODULES = [
  { id: 'invoicing', name: 'Kivo Invoicing', icon: 'solar:bill-list-linear', path: '/invoice' },
  { id: 'payouts', name: 'Kivo Payouts', icon: 'solar:buildings-linear', path: '/payouts' },
  { id: 'escrow', name: 'Kivo Safe Checkout', icon: 'solar:shield-keyhole-linear', path: '/escrow' },
  { id: 'familybridge', name: 'FamilyBridge', icon: 'solar:home-smile-linear', path: '/familybridge' },
  { id: 'vakinha', name: 'Vakinha Global', icon: 'solar:heart-pulse-linear', path: '/vakinha' },
  { id: 'quilovolt', name: 'QuiloVolt EV', icon: 'solar:bolt-circle-linear', path: '/quilovolt' },
  { id: 'contractease', name: 'ContractEase', icon: 'solar:document-text-linear', path: '/contractease' },
  { id: 'saude360', name: 'Saúde 360', icon: 'solar:health-linear', path: '/saude360' },
  { id: 'onyx', name: 'ONYX Risk', icon: 'lucide:shield-check', path: '/onyx' }
];

export default function KivoCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredModules = MODULES.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-start justify-center pt-[20vh] p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="bg-neutral-900 border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl relative z-10 overflow-hidden"
          >
            <div className="flex items-center px-4 py-4 border-b border-white/10">
              {/* @ts-ignore */}
              <iconify-icon icon="solar:magnifer-linear" width="20" class="text-white/50 mr-3"></iconify-icon>
              <input 
                type="text" 
                autoFocus
                placeholder="Buscar módulo ou funcionalidade..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-white w-full placeholder:text-white/30 text-lg"
              />
              <div className="text-[10px] bg-white/10 text-white/50 px-2 py-1 rounded font-mono">ESC</div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {filteredModules.length > 0 ? (
                filteredModules.map((mod, i) => (
                  <a 
                    key={mod.id} 
                    href={mod.path}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                         {/* @ts-ignore */}
                         <iconify-icon icon={mod.icon} width="20"></iconify-icon>
                       </div>
                       <span className="text-white font-medium">{mod.name}</span>
                    </div>
                    {/* @ts-ignore */}
                    <iconify-icon icon="solar:arrow-right-linear" width="20" class="text-white/20 group-hover:text-emerald-400 transition-all"></iconify-icon>
                  </a>
                ))
              ) : (
                <div className="p-8 text-center text-white/50">Nenhum módulo encontrado.</div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
