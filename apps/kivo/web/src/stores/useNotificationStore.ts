import { create } from 'zustand';

export interface NotificationItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}

interface NotificationState {
  notifications: NotificationItem[];
  add: (notification: Omit<NotificationItem, 'id'>) => void;
  remove: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  add: (notification) =>
    set((state) => ({
      notifications: [{ ...notification, id: `notif_${Date.now()}_${Math.random().toString(16).slice(2)}` }, ...state.notifications].slice(0, 4),
    })),
  remove: (id) => set((state) => ({ notifications: state.notifications.filter((item) => item.id !== id) })),
}));
