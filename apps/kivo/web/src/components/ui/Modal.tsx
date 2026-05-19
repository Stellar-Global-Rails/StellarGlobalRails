import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ open, title, onClose, children }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            className="relative z-10 w-full max-w-2xl rounded-2xl border border-white/10 bg-neutral-950 p-6 premium-shadow"
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="font-bricolage text-xl font-bold text-white">{title}</h2>
              <button type="button" onClick={onClose} className="rounded-lg p-2 text-neutral-500 hover:bg-white/5 hover:text-white">
                <Icon icon="solar:close-circle-linear" className="text-2xl" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
