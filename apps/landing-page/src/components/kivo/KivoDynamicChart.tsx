import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export default function KivoDynamicChart() {
  const [data, setData] = useState<number[]>(Array(20).fill(10));
  
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1)];
        // generate realistic looking random walk
        let nextVal = newData[newData.length - 1] + (Math.random() - 0.4) * 15;
        if (nextVal < 5) nextVal = 5;
        if (nextVal > 95) nextVal = 95;
        newData.push(nextVal);
        return newData;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const max = 100;
  const width = 300;
  const height = 100;
  const pointWidth = width / (data.length - 1);

  const points = data.map((val, i) => {
    const x = i * pointWidth;
    const y = height - (val / max) * height;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `${points} ${width},${height} 0,${height}`;

  return (
    <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="text-white text-xs font-medium">TPS (Ao Vivo)</h4>
          <p className="text-white/40 text-[10px] font-mono">Volume da Rede Kivo</p>
        </div>
        <div className="text-emerald-400 font-mono text-sm">
          {data[data.length - 1].toFixed(1)} /s
        </div>
      </div>
      
      <div className="relative" style={{ width, height }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.4"/>
              <stop offset="100%" stopColor="#10B981" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <motion.polygon 
            points={areaPoints}
            fill="url(#chartGradient)"
            transition={{ duration: 1, ease: 'linear' }}
          />
          <motion.polyline 
            points={points}
            fill="none"
            stroke="#10B981"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            transition={{ duration: 1, ease: 'linear' }}
          />
        </svg>
      </div>
    </div>
  );
}
