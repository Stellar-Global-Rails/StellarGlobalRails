import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'motion/react';
import { useNotificationStore } from '@/stores';

const iconByType = {
  success: 'solar:check-circle-bold',
  error: 'solar:danger-circle-bold',
  warning: 'solar:danger-triangle-bold',
  info: 'solar:info-circle-bold',
};

const toneByType = {
  success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  error: 'bg-red-500/10 border-red-500/20 text-red-400',
  warning: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  info: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
};

export default function ToastStack() {
  const notifications = useNotificationStore((state) => state.notifications);
  const remove = useNotificationStore((state) => state.remove);

  return (
    <div className="pointer-events-none fixed right-4 top-20 z-[120] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.button
            key={notification.id}
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.96 }}
            onClick={() => remove(notification.id)}
            className={`pointer-events-auto rounded-xl border px-4 py-3 text-left premium-shadow ${toneByType[notification.type]}`}
          >
            <div className="flex gap-3">
              <Icon icon={iconByType[notification.type]} className="mt-0.5 text-xl shrink-0" />
              <div>
                <p className="text-sm font-bold">{notification.title}</p>
                {notification.message && <p className="mt-1 text-xs opacity-75">{notification.message}</p>}
              </div>
            </div>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
