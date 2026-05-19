import { Icon } from '@iconify/react';
import { motion } from 'motion/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores';

export default function RegisterPage() {
  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [confirmationEmail, setConfirmationEmail] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (password.length < 6) {
      setError('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      const outcome = await register(name, email, password);
      if (outcome.requiresEmailConfirmation) {
        setConfirmationEmail(email);
        return;
      }
      navigate('/dashboard', { replace: true });
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : 'Nao foi possivel criar a conta.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-[#0a0a0a] text-white">
      <div className="bg-grain" />

      <section className="relative hidden w-1/2 items-center justify-center overflow-hidden border-r border-white/5 bg-neutral-900 p-12 md:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_30%,rgba(16,185,129,0.18),transparent_24rem)]" />
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 max-w-lg">
          <div className="mb-8 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-emerald-400/30 bg-emerald-400/10 text-5xl text-emerald-300 premium-shadow">
              <Icon icon="solar:users-group-two-rounded-bold-duotone" />
            </div>
          </div>
          <h2 className="text-center font-bricolage text-4xl font-bold text-white">
            Comece com um workspace verificavel.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-center text-base text-neutral-400">
            O primeiro acesso confirma o e-mail antes de liberar operacoes com devices, chaves e pagamentos reais.
          </p>
          <div className="mt-10 rounded-2xl border border-white/10 bg-black/30 p-5">
            <div className="mb-4 flex items-center gap-3">
              <Icon icon="solar:letter-opened-bold-duotone" className="text-2xl text-emerald-300" />
              <div>
                <p className="text-sm font-bold text-white">Confirmacao obrigatoria</p>
                <p className="text-xs text-neutral-500">Supabase Auth envia o link para ativar a conta.</p>
              </div>
            </div>
            <div className="h-2 rounded-full bg-white/10">
              <div className="h-2 w-2/3 rounded-full bg-emerald-400" />
            </div>
          </div>
        </motion.div>
      </section>

      <section className="relative z-10 flex w-full flex-col justify-center px-6 py-10 sm:px-12 md:w-1/2 md:px-20 lg:px-24">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mx-auto w-full max-w-md">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 text-sm font-black text-black">
              KV
            </div>
            <span className="font-bricolage text-2xl font-bold tracking-tight">Kivo Pay</span>
          </div>

          {confirmationEmail ? (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="py-4 text-center">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-emerald-400/30 bg-emerald-400/10 text-5xl text-emerald-300">
                <Icon icon="solar:letter-opened-bold-duotone" />
              </div>
              <h1 className="font-bricolage text-3xl font-bold">Confirme seu e-mail</h1>
              <p className="mt-3 text-sm leading-6 text-neutral-400">
                Enviamos um link de confirmacao para <span className="font-medium text-white">{confirmationEmail}</span>.
                Depois de confirmar, volte ao login para acessar o console Kivo.
              </p>
              <Link
                to="/login"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-black transition-colors hover:bg-emerald-400"
              >
                Ir para login
                <Icon icon="solar:arrow-right-bold" />
              </Link>
            </motion.div>
          ) : (
            <>
              <h1 className="font-bricolage text-3xl font-bold">Criar workspace Kivo</h1>
              <p className="mt-2 text-sm text-neutral-400">
                Cadastre o operador e confirme o e-mail para ativar o ambiente.
              </p>

              {error ? (
                <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  <Icon icon="solar:danger-triangle-bold" className="mt-0.5 text-lg" />
                  <span>{error}</span>
                </div>
              ) : null}

              <form onSubmit={submit} className="mt-8 space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-neutral-400">Nome completo</span>
                  <input
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Seu nome"
                    className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-neutral-600 focus:border-emerald-500/60"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-neutral-400">E-mail</span>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="nome@empresa.com"
                    className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-neutral-600 focus:border-emerald-500/60"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-neutral-400">Senha</span>
                  <input
                    required
                    minLength={6}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type="password"
                    placeholder="Minimo 6 caracteres"
                    className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-neutral-600 focus:border-emerald-500/60"
                  />
                </label>

                <div className="flex items-start gap-3 rounded-xl border border-emerald-400/15 bg-emerald-400/10 px-4 py-3 text-xs leading-5 text-emerald-100">
                  <Icon icon="solar:letter-bold-duotone" className="mt-0.5 text-lg text-emerald-300" />
                  <p>
                    Apos criar a conta, voce recebera um e-mail de confirmacao. O console so libera acesso depois dessa validacao.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black transition-colors hover:bg-emerald-400 disabled:cursor-wait disabled:opacity-60"
                >
                  {submitting ? (
                    <span className="h-5 w-5 rounded-full border-2 border-black border-t-transparent motion-safe:animate-spin" />
                  ) : (
                    <>
                      Criar workspace
                      <Icon icon="solar:arrow-right-bold" />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-neutral-400">
                Ja tem uma conta?{' '}
                <Link to="/login" className="font-medium text-white hover:underline">
                  Entrar
                </Link>
              </p>
            </>
          )}
        </motion.div>
      </section>
    </main>
  );
}
