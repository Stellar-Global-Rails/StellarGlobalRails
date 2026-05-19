import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import KivoDynamicChart from './KivoDynamicChart';

const LOCAL_NOTIFICATIONS = [
  { icon: 'solar:bolt-circle-bold', msg: 'Recarga QuiloVolt EV autorizada (0.25 USDC)' },
  { icon: 'solar:pen-bold', msg: 'Contrato inteligente assinado via ContractEase' },
  { icon: 'solar:shield-check-bold', msg: 'ONYX Risk interceptou tentativa de fraude' },
  { icon: 'solar:document-add-bold', msg: 'Lote processado: 200 transações liquidadas' },
  { icon: 'solar:health-bold', msg: 'Laboratório liquidou 15 USDC (Saúde 360)' }
];

export default function KivoLiveActivity() {
  const [activeNotification, setActiveNotification] = useState<any>(null);

  useEffect(() => {
    // 1. Fallback local notifications
    const triggerLocal = () => {
      const randomMsg = LOCAL_NOTIFICATIONS[Math.floor(Math.random() * LOCAL_NOTIFICATIONS.length)];
      setActiveNotification(randomMsg);
      setTimeout(() => setActiveNotification(null), 5000);
    };

    // 2. Real Stellar Testnet Websocket/SSE (Item 36)
    try {
      const es = new EventSource('https://horizon-testnet.stellar.org/payments?cursor=now');
      es.onmessage = (msg) => {
        const data = JSON.parse(msg.data);
        if (data.type === 'payment' && data.asset_type === 'native') {
          // It's XLM for testnet, we pretend it's a global settlement
          const amount = parseFloat(data.amount).toFixed(2);
          if (parseFloat(amount) > 0) {
            setActiveNotification({
              icon: 'solar:global-bold-duotone',
              msg: `Transação on-chain recebida: ${amount} XLM liquidado via Stellar`
            });
            setTimeout(() => setActiveNotification(null), 5000);
          }
        }
      };
      
      return () => es.close();
    } catch (e) {
      // Se falhar a conexão SSE, roda os locais
      const interval = setInterval(triggerLocal, 15000);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[9000] pointer-events-none flex flex-col items-end gap-4">
      <div className="pointer-events-auto">
        <KivoDynamicChart />
      </div>
      <AnimatePresence>
        {activeNotification && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className="bg-black/80 backdrop-blur-md border border-white/10 p-3 pr-4 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.15)] flex items-center gap-3 max-w-sm"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              {/* @ts-ignore */}
              <iconify-icon icon={activeNotification.icon}></iconify-icon>
            </div>
            <div>
              <p className="text-white/40 text-[10px] font-mono uppercase mb-0.5 tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> 
                Kivo Network Live
              </p>
              <p className="text-white/90 text-xs font-medium" aria-hidden="true">{activeNotification.msg}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Item 50: ARIA Live Region - Screen Reader Only */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {activeNotification ? activeNotification.msg : ''}
      </div>
    </div>
  );
}
