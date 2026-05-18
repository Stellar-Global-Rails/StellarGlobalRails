import { Icon } from '@iconify/react';
import { motion } from 'motion/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores';

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await login(email, password);
      const from = (location.state as { from?: string } | null)?.from ?? '/dashboard';
      navigate(from, { replace: true });
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Nao foi possivel entrar.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-[#0a0a0a] text-white">
      <div className="bg-grain" />

      <section className="relative z-10 flex w-full flex-col justify-center px-6 py-10 sm:px-12 md:w-1/2 md:px-20 lg:px-24">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mx-auto w-full max-w-md">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 text-sm font-black text-black">
              KV
            </div>
            <span className="font-bricolage text-2xl font-bold tracking-tight">Kivo Pay</span>
          </div>

          <h1 className="font-bricolage text-3xl font-bold">Bem-vindo de volta</h1>
          <p className="mt-2 text-sm text-neutral-400">
            Entre para operar dispositivos, pagamentos x402 e a ancora Etherfuse.
          </p>

          {error ? (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              <Icon icon="solar:danger-triangle-bold" className="mt-0.5 text-lg" />
              <span>{error}</span>
            </div>
          ) : null}

          <form onSubmit={submit} className="mt-8 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-neutral-400">E-mail</span>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="nome@empresa.com"
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-neutral-600 focus:border-emerald-500/60"
              />
            </label>

            <label className="block">
              <span className="mb-1 flex items-center justify-between text-sm font-medium text-neutral-400">
                Senha
                <Link to="/forgot-password" className="text-xs text-emerald-400 hover:text-emerald-300">
                  Esqueceu?
                </Link>
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="********"
                className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-neutral-600 focus:border-emerald-500/60"
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black transition-colors hover:bg-emerald-400 disabled:cursor-wait disabled:opacity-60"
            >
              {submitting ? (
                <span className="h-5 w-5 rounded-full border-2 border-black border-t-transparent motion-safe:animate-spin" />
              ) : (
                <>
                  Acessar console
                  <Icon icon="solar:arrow-right-bold" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-neutral-400">
            Ainda nao tem uma conta?{' '}
            <Link to="/register" className="font-medium text-white hover:underline">
              Criar workspace Kivo
            </Link>
          </p>
        </motion.div>
      </section>

      <section className="relative hidden w-1/2 items-center justify-center overflow-hidden border-l border-white/5 bg-neutral-900 p-12 md:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_25%,rgba(16,185,129,0.18),transparent_24rem)]" />
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 max-w-lg">
          <div className="mb-8 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-emerald-400/30 bg-emerald-400/10 text-5xl text-emerald-300 premium-shadow">
              <Icon icon="solar:shield-keyhole-bold-duotone" />
            </div>
          </div>
          <h2 className="text-center font-bricolage text-4xl font-bold text-white">
            Infra de pagamento M2M pronta para producao.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-center text-base text-neutral-400">
            Supabase Auth, Edge Functions, Stellar testnet, x402 e Etherfuse trabalhando no mesmo console operacional.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-3">
            {['Stellar ok', 'Supabase ok', 'Etherfuse ok'].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-black/30 px-3 py-4 text-center text-xs font-semibold text-emerald-200">
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </main>
  );
}
