import { motion } from 'motion/react';

const partners = [
  { name: "Stellar", icon: "simple-icons:stellar" },
  { name: "Soroban", icon: "lucide:blocks" },
  { name: "Circle (USDC)", icon: "cryptocurrency:usdc" },
  { name: "BRZ Token", icon: "lucide:circle-dollar-sign" },
  { name: "Kivo Network", icon: "lucide:hexagon" },
  { name: "Velo", icon: "lucide:zap" },
  { name: "MoneyGram", icon: "simple-icons:moneygram" },
  { name: "Mercado Bitcoin", icon: "lucide:bitcoin" },
  { name: "Transfero", icon: "lucide:arrow-right-left" },
];

export default function InfiniteMarquee() {
  return (
    <section className="py-12 bg-neutral-950 border-t border-b border-white/5 overflow-hidden flex flex-col justify-center relative">
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-neutral-950 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-neutral-950 to-transparent z-10 pointer-events-none"></div>
      
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ ease: "linear", duration: 30, repeat: Infinity }}
        className="flex whitespace-nowrap items-center w-max"
      >
        {[...partners, ...partners, ...partners].map((partner, idx) => (
          <motion.div 
            key={idx} 
            className="flex items-center mx-10 md:mx-14 group cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="text-white/20 group-hover:text-emerald-400 group-hover:drop-shadow-[0_0_15px_rgba(16,185,129,0.8)] transition-all duration-300 mr-4 md:mr-6 flex items-center justify-center">
              {/* @ts-ignore */}
              <iconify-icon icon={partner.icon} width="36"></iconify-icon>
            </div>
            <span className="text-xl md:text-2xl font-bricolage text-white/30 font-medium tracking-wide uppercase group-hover:text-white transition-all duration-300">
              {partner.name}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}