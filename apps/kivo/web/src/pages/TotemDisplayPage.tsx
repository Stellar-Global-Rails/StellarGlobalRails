import { Icon } from '@iconify/react';
import { Link, useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { CopyButton } from '@/components/ui/CopyButton';
import { useAsyncData } from '@/hooks/useAsyncData';
import { kivoClient } from '@/services/kivoClient';

export default function TotemDisplayPage() {
  const { id = '' } = useParams();
  const totemResult = useAsyncData(() => kivoClient.getPowerTotem(id), [id]);

  const resource = totemResult.data?.resource ?? `/power-totem/${id || 'pending'}/session`;

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.12),transparent_32%)]" />
      <div className="relative z-10 grid min-h-screen gap-8 p-5 lg:grid-cols-[1fr_0.9fr] lg:p-10">
        <section className="flex min-h-[520px] flex-col justify-between rounded-[2rem] border border-white/10 bg-black/35 p-6 premium-shadow lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/25 bg-emerald-500/10 text-emerald-300">
                <Icon icon="solar:bolt-circle-bold-duotone" className="text-3xl" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-400">Kivo EV Charge</p>
                <h1 className="font-bricolage text-2xl font-bold text-white">{totemResult.data?.name ?? 'EV Charger Demo'}</h1>
              </div>
            </div>
            <Badge tone="warning">aguardando gateway</Badge>
          </div>

          <div className="grid flex-1 place-items-center py-8">
            <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-neutral-950 p-5">
              <PseudoQr />
              <p className="mt-5 text-center text-sm font-bold uppercase tracking-[0.2em] text-neutral-400">Preview do recurso</p>
              <p className="mt-2 break-all text-center font-mono text-xs text-emerald-200">{resource}</p>
              <p className="mt-3 text-center text-xs leading-5 text-neutral-500">
                O QR real entra na UI local gerada pelo bundle Docker da estacao EV Charge.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <DisplayMetric label="Preco" value={totemResult.data ? `${totemResult.data.price} USDC` : '0.50 USDC'} />
            <DisplayMetric label="Duracao" value={totemResult.data ? `${totemResult.data.sessionDurationSeconds}s` : '30s'} />
            <DisplayMetric label="Unidade" value={totemResult.data?.unit ?? 'session'} />
          </div>
        </section>

        <aside className="flex flex-col justify-between rounded-[2rem] border border-white/10 bg-neutral-900/80 p-6 premium-shadow lg:p-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-400">Estado da recarga</p>
            <div className="mt-5 rounded-[2rem] border border-amber-500/25 bg-amber-500/10 p-6">
              <Icon icon="solar:lock-keyhole-bold-duotone" className="text-6xl text-amber-300" />
              <h2 className="mt-5 font-bricolage text-4xl font-bold text-white">Aguardando runtime local</h2>
              <p className="mt-3 text-sm leading-6 text-neutral-300">
                Esta tela nao finge liberacao. Para mudar o estado real, baixe o Docker, rode o Gateway no Raspberry e deixe a autorizacao vir da Kivo API.
              </p>
            </div>

            <div className="mt-5 rounded-2xl border border-white/5 bg-black/25 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Resource protegido</p>
                <CopyButton value={resource} />
              </div>
              <code className="mt-3 block break-all text-xs text-emerald-200">{resource}</code>
              <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3">
                <p className="text-sm font-bold text-amber-100">UI local fica no bundle</p>
                <p className="mt-1 text-xs leading-5 text-amber-100/75">
                  O pacote Docker inclui a tela local da estacao e o Gateway que consulta heartbeat, autorizacao e eventos.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            <Link to="/library/power-totem" className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black hover:bg-emerald-400">
              <Icon icon="solar:download-minimalistic-bold-duotone" />
              Baixar Docker
            </Link>
            <Link to={`/totems/${id}`} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-neutral-200 hover:bg-white/10">
              <Icon icon="solar:clipboard-list-bold-duotone" />
              Voltar ao detalhe
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}

function DisplayMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-black/25 p-4 text-center">
      <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">{label}</p>
      <p className="mt-1 font-bricolage text-xl font-bold text-white">{value}</p>
    </div>
  );
}

function PseudoQr() {
  const cells = Array.from({ length: 81 }, (_, index) => {
    const row = Math.floor(index / 9);
    const col = index % 9;
    const finder = (row < 3 && col < 3) || (row < 3 && col > 5) || (row > 5 && col < 3);
    const filled = finder || ((row * 7 + col * 5 + index) % 4 !== 0);
    return filled;
  });

  return (
    <div className="grid aspect-square grid-cols-9 gap-1 rounded-3xl bg-white p-4">
      {cells.map((filled, index) => (
        <span key={index} className={`rounded-sm ${filled ? 'bg-neutral-950' : 'bg-white'}`} />
      ))}
    </div>
  );
}
