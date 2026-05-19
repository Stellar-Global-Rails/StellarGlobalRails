export default function Divider({ label }: { label: string }) {
  return (
    <div className="w-full bg-neutral-950 py-12 flex items-center justify-center relative z-20 overflow-hidden">
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-white/10"></div>
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent w-3/4 mx-auto"></div>
      
      <div className="relative bg-neutral-950 px-6 py-2 border border-white/5 rounded-full flex items-center gap-4 shadow-2xl">
        <div className="flex gap-1">
          <div className="w-0.5 h-3 bg-white/20"></div>
          <div className="w-0.5 h-3 bg-white/20"></div>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30">
          {label}
        </span>
        <div className="flex gap-1">
          <div className="w-0.5 h-3 bg-white/20"></div>
          <div className="w-0.5 h-3 bg-emerald-500"></div>
        </div>
      </div>
    </div>
  );
}