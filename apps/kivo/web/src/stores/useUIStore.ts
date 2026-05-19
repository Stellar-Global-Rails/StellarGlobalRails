import { create } from 'zustand';

interface UIState {
  sidebarCollapsed: boolean;
  commandOpen: boolean;
  environment: 'testnet' | 'mainnet';
  toggleSidebar: () => void;
  setCommandOpen: (open: boolean) => void;
  setEnvironment: (environment: 'testnet' | 'mainnet') => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  commandOpen: false,
  environment: 'testnet',
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setCommandOpen: (commandOpen) => set({ commandOpen }),
  setEnvironment: (environment) => set({ environment }),
}));
