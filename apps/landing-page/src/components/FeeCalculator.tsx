import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';

export default function FeeCalculator() {
  const { t } = useTranslation();
  const [amount, setAmount] = useState(1000);
  
  const sgrFee = amount * 0.005; // 0.5%
  const bankFee = amount * 0.03 + 30; // 3% + $30
  const savings = bankFee - sgrFee;

  return (
    <div className="p-8 my-10 rounded-3xl bg-neutral-900 border border-emerald-500/20 shadow-2xl shadow-emerald-500/5">
      <h3 className="text-xl font-bricolage font-bold text-white mb-6 flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" stroke-width="2"/></svg>
        </span>
        {t('calc.title')}
      </h3>

      <div className="space-y-6">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-white/30 font-bold mb-2">{t('calc.label')}</label>
          <input 
            type="range" 
            min="100" 
            max="10000" 
            step="100"
            value={amount} 
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="mt-4 text-3xl font-bricolage font-bold text-white">
            ${amount.toLocaleString()} <span className="text-sm font-normal text-white/40">USD</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold block mb-1">{t('calc.bank_fee')}</span>
            <span className="text-xl font-bold text-rose-400">${bankFee.toFixed(2)}</span>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
            <span className="text-[10px] uppercase tracking-widest text-emerald-500/50 font-bold block mb-1">{t('calc.sgr_fee')}</span>
            <span className="text-xl font-bold text-emerald-400">${sgrFee.toFixed(2)}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-transparent border border-emerald-500/20 text-center">
          <span className="text-sm text-white/60 block mb-1">{t('calc.savings_label')}</span>
          <span className="text-2xl font-bricolage font-black text-emerald-400">
            ${savings.toFixed(2)} <span className="text-sm font-normal opacity-50">USD</span>
          </span>
        </div>
      </div>
    </div>
  );
}
