import { Icon } from '@iconify/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore, useUIStore } from '@/stores';

const routeTitles: Record<string, { title: string; icon: string }> = {
  '/dashboard': { title: 'Power Totem Home', icon: 'solar:home-2-bold-duotone' },
  '/studio': { title: 'Kivo Studio', icon: 'solar:electric-refueling-bold-duotone' },
  '/totems': { title: 'Power Totems', icon: 'solar:electric-refueling-bold-duotone' },
  '/totem': { title: 'Power Totem', icon: 'solar:electric-refueling-bold-duotone' },
  '/totem-simulator': { title: 'Simulador do totem', icon: 'solar:bolt-circle-bold-duotone' },
  '/create-flow': { title: 'Roadmap de templates', icon: 'solar:map-arrow-right-bold-duotone' },
  '/flows': { title: 'Recursos legados', icon: 'solar:bolt-circle-bold-duotone' },
  '/team': { title: 'Time e escala', icon: 'solar:users-group-rounded-bold-duotone' },
  '/checkout': { title: 'Checkout', icon: 'solar:card-transfer-bold-duotone' },
  '/integrations': { title: 'Power Totem Gateway SDK', icon: 'solar:code-square-bold-duotone' },
  '/finance': { title: 'Financeiro', icon: 'solar:chart-square-bold-duotone' },
  '/health': { title: 'Saude', icon: 'solar:heart-pulse-bold-duotone' },
  '/status': { title: 'Status', icon: 'solar:pulse-2-bold-duotone' },
  '/payments': { title: 'Pagamentos', icon: 'solar:wallet-money-bold-duotone' },
  '/webhooks': { title: 'Webhooks', icon: 'solar:widget-2-bold-duotone' },
  '/api-keys': { title: 'API Keys', icon: 'solar:key-minimalistic-bold-duotone' },
  '/settings': { title: 'Configuracoes', icon: 'solar:settings-bold-duotone' },
};

export default function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const environment = useUIStore((state) => state.environment);
  const setEnvironment = useUIStore((state) => state.setEnvironment);
  const setCommandOpen = useUIStore((state) => state.setCommandOpen);
  const basePath = `/${location.pathname.split('/')[1] || 'dashboard'}`;
  const info = routeTitles[basePath] ?? { title: 'Kivo Pay', icon: 'solar:wallet-linear' };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/5 bg-neutral-950/85 px-4 backdrop-blur-xl md:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-emerald-400">
          <Icon icon={info.icon} className="text-xl" />
        </div>
        <div className="min-w-0">
          <h1 className="hidden truncate font-bricolage text-xl font-bold text-white sm:block">{info.title}</h1>
          <p className="hidden text-xs text-neutral-500 sm:block">Configure, cobre e libere energia pelo gateway Power Totem</p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={() => setCommandOpen(true)}
          className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-neutral-400 hover:bg-white/10 hover:text-white sm:flex"
        >
          <Icon icon="solar:magnifer-linear" />
          Buscar
          <span className="rounded bg-black/40 px-1.5 py-0.5 text-[9px] text-neutral-500">K</span>
        </button>

        <div className="flex rounded-xl border border-white/10 bg-white/5 p-1">
          {(['testnet', 'mainnet'] as const).map((env) => (
            <button
              key={env}
              onClick={() => setEnvironment(env)}
              className={`rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                environment === env ? 'bg-emerald-500 text-black' : 'text-neutral-500 hover:text-white'
              }`}
            >
              {env}
            </button>
          ))}
        </div>

        <Link to="/team" className="hidden rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-neutral-400 hover:bg-white/10 hover:text-white lg:block">
          {user?.name ?? 'Conta'}
        </Link>

        <button
          onClick={() => {
            void logout();
            navigate('/login');
          }}
          className="rounded-xl p-2 text-neutral-500 hover:bg-red-500/10 hover:text-red-400"
          title="Sair"
        >
          <Icon icon="solar:logout-2-bold" className="text-xl" />
        </button>
      </div>
    </header>
  );
}
