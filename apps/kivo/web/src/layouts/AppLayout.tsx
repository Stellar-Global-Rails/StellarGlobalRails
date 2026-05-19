import type { CSSProperties } from 'react';
import { Outlet } from 'react-router-dom';
import { useUIStore } from '@/stores';
import BottomNav from './BottomNav';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import CommandPalette from '@/components/CommandPalette';
import ToastStack from '@/components/ToastStack';

export default function AppLayout() {
  const collapsed = useUIStore((state) => state.sidebarCollapsed);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="bg-grain" />
      <Sidebar />
      <div className="relative z-10 pb-20 transition-all duration-300 md:pb-0 md:ml-[var(--sidebar-width)]" style={{ '--sidebar-width': collapsed ? '76px' : '270px' } as CSSProperties}>
        <Topbar />
        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
      <BottomNav />
      <CommandPalette />
      <ToastStack />
    </div>
  );
}
