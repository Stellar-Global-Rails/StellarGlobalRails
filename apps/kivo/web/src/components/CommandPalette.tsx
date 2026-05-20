import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '@/stores';

const commands = [
  { label: 'Home', path: '/dashboard', icon: 'solar:home-2-bold-duotone', keywords: 'home power totem workspace' },
  { label: 'Kivo Studio', path: '/studio', icon: 'solar:stars-line-duotone', keywords: 'flow solucao arquitetura sdk ai agents' },
  { label: 'Marketplace', path: '/marketplace', icon: 'solar:widget-linear', keywords: 'templates power totem adquirir comunidade roadmap' },
  { label: 'Biblioteca', path: '/library', icon: 'solar:folder-with-files-linear', keywords: 'templates adquiridos instalar docker power totem' },
  { label: 'Power Totem', path: '/templates/power-totem', icon: 'solar:bolt-circle-bold-duotone', keywords: 'template totem raspberry x402 etherfuse' },
  { label: 'Kivo Gateway', path: '/gateway', icon: 'solar:server-square-cloud-linear', keywords: 'runtime fisico digital raspberry proxy' },
  { label: 'SDK TypeScript', path: '/sdk', icon: 'solar:code-square-linear', keywords: 'download adapter x402 gateway' },
  { label: 'Validacao testnet', path: '/validation', icon: 'solar:shield-check-linear', keywords: 'x402 etherfuse stellar gateway' },
  { label: 'Pagamento x402', path: '/checkout', icon: 'solar:card-transfer-bold-duotone', keywords: 'payer usuario payment required checkout x402' },
  { label: 'Launch', path: '/launch', icon: 'solar:rocket-linear', keywords: 'mainnet privado template publico' },
  { label: 'Status do Kivo', path: '/status', icon: 'solar:pulse-2-bold-duotone', keywords: 'status sistema kivo plataforma disponibilidade' },
  { label: 'Ajustes', path: '/settings', icon: 'solar:settings-bold-duotone', keywords: 'conta workspace ambiente conexoes' },
];

export default function CommandPalette() {
  const open = useUIStore((state) => state.commandOpen);
  const setOpen = useUIStore((state) => state.setCommandOpen);
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(!open);
      }
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, setOpen]);

  const filtered = useMemo(() => {
    const lower = query.toLowerCase();
    return commands.filter((command) => `${command.label} ${command.keywords}`.toLowerCase().includes(lower));
  }, [query]);

  const run = (path: string) => {
    navigate(path);
    setOpen(false);
    setQuery('');
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[110] flex items-start justify-center p-4 pt-[16vh]">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <motion.div
            initial={{ opacity: 0, y: -18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18, scale: 0.96 }}
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 premium-shadow"
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4">
              <Icon icon="solar:magnifer-linear" className="text-xl text-neutral-500" />
              <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar Studio, Gateway, SDK ou pagamento..." className="w-full bg-transparent text-white outline-none placeholder:text-neutral-600" />
              <span className="rounded bg-white/5 px-2 py-1 text-[10px] text-neutral-500">ESC</span>
            </div>
            <div className="max-h-[50vh] overflow-y-auto p-2">
              {filtered.map((command) => (
                <button key={command.path} onClick={() => run(command.path)} className="flex w-full items-center justify-between rounded-xl p-3 text-left hover:bg-white/5">
                  <span className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                      <Icon icon={command.icon} className="text-xl" />
                    </span>
                    <span className="font-medium text-white">{command.label}</span>
                  </span>
                  <Icon icon="solar:arrow-right-linear" className="text-neutral-600" />
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
