import { Icon } from '@iconify/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/services/supabase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus(null);

    if (!supabase) {
      setStatus('Supabase Auth precisa estar configurado para enviar recuperacao.');
      setSubmitting(false);
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    setStatus(error ? error.message : 'Email de recuperacao enviado pelo Supabase Auth.');
    setSubmitting(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 p-6 text-white">
      <form onSubmit={submit} className="premium-shadow w-full max-w-md rounded-3xl border border-white/10 bg-neutral-900 p-8">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-black">
          <Icon icon="solar:lock-keyhole-bold" className="text-2xl" />
        </div>
        <h1 className="text-center font-bricolage text-3xl font-bold">Recuperar senha</h1>
        <p className="mt-3 text-center text-sm text-neutral-400">
          Envia reset pelo Supabase Auth configurado.
        </p>

        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          className="mt-8 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-emerald-500"
        />

        {status ? <div className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-neutral-300">{status}</div> : null}

        <button
          disabled={submitting}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-black disabled:cursor-wait disabled:opacity-60"
        >
          {submitting ? 'Enviando...' : 'Enviar recuperacao'}
          <Icon icon="solar:arrow-right-bold" />
        </button>
        <Link to="/login" className="mt-5 block text-center text-xs text-neutral-500 hover:text-white">
          Voltar ao login
        </Link>
      </form>
    </main>
  );
}
