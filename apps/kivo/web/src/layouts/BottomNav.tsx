import { Icon } from '@iconify/react';
import { NavLink } from 'react-router-dom';

const items = [
  { to: '/dashboard', icon: 'solar:home-angle-bold-duotone', label: 'Home' },
  { to: '/create-flow', icon: 'solar:add-circle-bold-duotone', label: 'Criar' },
  { to: '/flows', icon: 'solar:bolt-circle-bold-duotone', label: 'Flows' },
  { to: '/payments', icon: 'solar:wallet-money-bold-duotone', label: 'Pay' },
  { to: '/advanced', icon: 'solar:settings-bold-duotone', label: 'Adv' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around border-t border-white/5 bg-neutral-950/95 px-1 py-1 backdrop-blur-xl md:hidden">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center justify-center rounded-xl px-1 py-2 text-[10px] font-medium transition-colors ${
              isActive ? 'bg-emerald-500/10 text-emerald-400' : 'text-neutral-500 hover:bg-white/5 hover:text-white'
            }`
          }
        >
          <Icon icon={item.icon} className="text-2xl" />
          <span className="mt-1 max-w-full truncate">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
