import { motion } from 'motion/react';

interface ComparisonRow {
  label: string;
  fiat: string;
  stellar: string;
  metric?: string;
}

interface ComparisonTableProps {
  rows: ComparisonRow[];
}

export default function ComparisonTable({ rows }: ComparisonTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02]">
              <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Property</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white/60">Fiat Traditional</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-400">Stellar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((row, idx) => (
              <motion.tr
                key={idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={idx % 2 === 0 ? 'bg-white/[0.005]' : 'bg-transparent'}
              >
                <td className="px-6 py-4 text-sm font-medium text-white">{row.label}</td>
                <td className="px-6 py-4 text-sm text-white/60">{row.fiat}</td>
                <td className="px-6 py-4 text-sm font-semibold text-emerald-400">{row.stellar}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
