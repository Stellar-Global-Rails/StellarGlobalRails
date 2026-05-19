import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface SimulationState {
  status: 'idle' | 'processing' | 'confirmed';
  progress: number;
  result?: {
    txId: string;
    amount: number;
    timestamp: string;
    ledger: number;
  };
}

const devices = [
  { id: 'ev-001', label: 'Electric Vehicle #1', type: 'buyer' },
  { id: 'charger-05', label: 'Charging Station #5', type: 'seller' },
  { id: 'smartmeter-12', label: 'Smart Meter #12', type: 'buyer' },
  { id: 'solar-panel-08', label: 'Solar Panel Array #8', type: 'seller' },
  { id: 'agent-ai-xyz', label: 'AI Agent #XYZ', type: 'buyer' },
];

export default function KivoM2MSimulator() {
  const [state, setState] = useState<SimulationState>({
    status: 'idle',
    progress: 0
  });

  const [formData, setFormData] = useState({
    fromDevice: 'ev-001',
    toDevice: 'charger-05',
    amount: 2.5,
    currency: 'USDC',
    condition: 'energy_delivered_kwh:10',
    timeout: 3600
  });

  // Animate progress when processing
  useEffect(() => {
    if (state.status !== 'processing') return;

    const interval = setInterval(() => {
      setState(prev => {
        const newProgress = prev.progress + Math.random() * 30;
        if (newProgress >= 100) {
          clearInterval(interval);
          // Generate mock result
          const txId = '0x' + Array.from({ length: 64 }, () =>
            Math.floor(Math.random() * 16).toString(16)
          ).join('');
          return {
            status: 'confirmed',
            progress: 100,
            result: {
              txId,
              amount: formData.amount,
              timestamp: new Date().toISOString(),
              ledger: Math.floor(45821900 + Math.random() * 1000)
            }
          };
        }
        return { ...prev, progress: newProgress };
      });
    }, 300);

    return () => clearInterval(interval);
  }, [state.status, formData.amount]);

  const handleSimulate = () => {
    setState({ status: 'processing', progress: 0 });
  };

  const handleReset = () => {
    setState({ status: 'idle', progress: 0 });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <section className="py-32 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-5xl font-bricolage font-bold text-white mb-4">
            M2M Payment Simulator
          </h2>
          <p className="text-lg text-white/60">
            Experience autonomous machine-to-machine payments on Stellar. Configure devices, amount,
            conditions, and simulate a complete transaction flow.
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 mb-8"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Payment Configuration</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* From Device */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                From Device (Payer)
              </label>
              <select
                value={formData.fromDevice}
                onChange={(e) => setFormData({ ...formData, fromDevice: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-emerald-500 focus:outline-none transition-colors"
              >
                {devices
                  .filter((d) => d.type === 'buyer')
                  .map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.label}
                    </option>
                  ))}
              </select>
            </div>

            {/* To Device */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                To Device (Payee)
              </label>
              <select
                value={formData.toDevice}
                onChange={(e) => setFormData({ ...formData, toDevice: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-emerald-500 focus:outline-none transition-colors"
              >
                {devices
                  .filter((d) => d.type === 'seller')
                  .map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.label}
                    </option>
                  ))}
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Amount: ${formData.amount.toFixed(2)}
              </label>
              <input
                type="range"
                min="0.10"
                max="100"
                step="0.10"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>

            {/* Currency */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-emerald-500 focus:outline-none transition-colors"
              >
                <option value="USDC">USDC (Stablecoin)</option>
                <option value="BRL">BRL (Brazilian Real)</option>
              </select>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Payment Condition
              </label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-emerald-500 focus:outline-none transition-colors"
              >
                <option value="energy_delivered_kwh:10">Energy Delivered (10 kWh)</option>
                <option value="time_elapsed:3600">Time Elapsed (1 hour)</option>
                <option value="service_completed">Service Completed</option>
                <option value="custom">Custom Condition</option>
              </select>
            </div>

            {/* Timeout */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Timeout: {formData.timeout}s
              </label>
              <input
                type="range"
                min="300"
                max="3600"
                step="60"
                value={formData.timeout}
                onChange={(e) => setFormData({ ...formData, timeout: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Simulation Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="p-8 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Simulation Progress</h3>
            <div className="text-sm font-mono text-emerald-400">
              {state.status === 'idle' && 'Ready'}
              {state.status === 'processing' && `${Math.round(state.progress)}%`}
              {state.status === 'confirmed' && '✓ Confirmed'}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-6">
            <motion.div
              layoutId="progress"
              initial={{ width: 0 }}
              animate={{ width: `${state.progress}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600"
            />
          </div>

          {/* Status Message */}
          <div className="text-sm text-white/70 mb-6">
            {state.status === 'idle' && 'Configure payment parameters and click "Simulate Payment" to begin.'}
            {state.status === 'processing' && 'Processing transaction on Stellar testnet...'}
            {state.status === 'confirmed' && 'Transaction confirmed and irreversible!'}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <motion.button
              onClick={state.status === 'idle' ? handleSimulate : handleReset}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={state.status === 'processing'}
              className="px-6 py-3 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {state.status === 'idle' && 'Simulate Payment'}
              {state.status === 'processing' && 'Processing...'}
              {state.status === 'confirmed' && 'Simulate Again'}
            </motion.button>
          </div>
        </motion.div>

        {/* Result Card */}
        {state.result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="p-8 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 mb-8"
          >
            <h3 className="text-xl font-semibold text-white mb-6">✓ Payment Confirmed</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-white/60 text-sm mb-2">Transaction ID</p>
                <div className="flex items-center gap-2">
                  <code className="text-emerald-400 font-mono text-sm break-all">
                    {state.result.txId.slice(0, 32)}...
                  </code>
                  <button
                    onClick={() => copyToClipboard(state.result.txId)}
                    className="text-white/40 hover:text-white/60 transition-colors"
                  >
                    {/* @ts-ignore */}
                    <iconify-icon icon="solar:copy-linear" width="16"></iconify-icon>
                  </button>
                </div>
              </div>

              <div>
                <p className="text-white/60 text-sm mb-2">Amount</p>
                <p className="text-white font-semibold text-lg">
                  {state.result.amount.toFixed(2)} {formData.currency}
                </p>
              </div>

              <div>
                <p className="text-white/60 text-sm mb-2">Ledger Sequence</p>
                <p className="text-emerald-400 font-mono font-semibold">
                  {state.result.ledger}
                </p>
              </div>

              <div>
                <p className="text-white/60 text-sm mb-2">Timestamp</p>
                <p className="text-white/80 text-sm">
                  {new Date(state.result.timestamp).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <p className="text-white/60 text-sm mb-3">
                ℹ️ This is a simulated transaction. In production, this would be recorded on Stellar Public Network.
              </p>
              <a
                href="https://horizon-testnet.stellar.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-medium"
              >
                View on Stellar Horizon →
              </a>
            </div>
          </motion.div>
        )}

        {/* Code Example */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="p-8 rounded-2xl bg-white/[0.02] border border-white/10"
        >
          <h3 className="text-xl font-semibold text-white mb-4">SDK Code Example</h3>
          <pre className="bg-black/50 p-4 rounded-lg text-sm text-emerald-300 overflow-auto max-h-64 border border-white/5">
{`const payment = await kivo.createPayment({
  from_device: '${formData.fromDevice}',
  to_device: '${formData.toDevice}',
  amount: ${formData.amount},
  currency: '${formData.currency}',
  condition: '${formData.condition}',
  timeout: ${formData.timeout}
});

const result = await payment.execute();
console.log('Tx ID:', result.tx_id);
console.log('Status:', result.status);`}
          </pre>
        </motion.div>
      </div>
    </section>
  );
}
