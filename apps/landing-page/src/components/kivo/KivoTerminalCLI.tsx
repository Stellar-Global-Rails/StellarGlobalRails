import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';

export default function KivoTerminalCLI() {
  const [history, setHistory] = useState([
    { text: "Kivo CLI v1.2.0 (Stellar Mainnet)", type: "info" },
    { text: "Type 'help' to see available commands.", type: "info" }
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      if (!cmd) return;
      
      const newHistory = [...history, { text: `$ ${cmd}`, type: "cmd" }];
      setInput('');

      if (cmd === 'help') {
        newHistory.push({ text: "Available commands:\n- kivo payout --amount [x]\n- kivo invoice generate\n- clear", type: "system" });
      } else if (cmd.startsWith('kivo payout --amount')) {
        const amt = cmd.split(' ')[3] || '0';
        newHistory.push({ text: `Processing payout of ${amt} USDC...`, type: "system" });
        setTimeout(() => {
          setHistory(h => [...h, { text: `Success! TxHash: 0x${Math.random().toString(16).substr(2, 8)}`, type: "success" }]);
        }, 1000);
      } else if (cmd === 'kivo invoice generate') {
        newHistory.push({ text: "Generating smart invoice...", type: "system" });
        setTimeout(() => {
          setHistory(h => [...h, { text: `Invoice created: https://pay.kivo.com/inv_${Math.random().toString(36).substr(2, 6)}`, type: "success" }]);
        }, 800);
      } else if (cmd === 'clear') {
        setHistory([]);
        return;
      } else {
        newHistory.push({ text: `kivo: command not found: ${cmd}`, type: "error" });
      }
      
      setHistory(newHistory);
    }
  };

  return (
    <div className="w-full h-64 bg-black/80 rounded-2xl border border-white/10 p-4 font-mono text-sm overflow-y-auto flex flex-col shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md">
      {history.map((line, i) => (
        <div key={i} className={`whitespace-pre-wrap mb-1 ${
          line.type === 'error' ? 'text-red-400' : 
          line.type === 'success' ? 'text-emerald-400' : 
          line.type === 'cmd' ? 'text-white' : 
          'text-white/50'
        }`}>
          {line.text}
        </div>
      ))}
      <div className="flex items-center text-emerald-400 mt-2">
        <span className="mr-2">$</span>
        <input 
          type="text" 
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleCommand}
          className="bg-transparent outline-none flex-grow text-white caret-emerald-400"
          spellCheck={false}
          autoComplete="off"
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
}
