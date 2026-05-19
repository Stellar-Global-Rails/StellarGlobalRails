import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { PageHeader } from '@/components/ui/PageHeader';
import { futurePowerTotemTemplates, powerTotemTemplate, powerTotemStudioChecklist } from '@/data/powerTotemExperience';
import { useAsyncData } from '@/hooks/useAsyncData';
import { kivoClient } from '@/services/kivoClient';
import { useNotificationStore } from '@/stores';
import type { GatewayPairingResult, PowerTotem } from '@/types/kivo';

const unitOptions = [
  { value: 'session', label: 'sessao' },
  { value: 'minute', label: 'minuto' },
  { value: 'kWh', label: 'kWh' },
] as const;

export default function PowerTotemStudioPage() {
  const notify = useNotificationStore((state) => state.add);
  const totems = useAsyncData(() => kivoClient.listPowerTotems(), []);
  const [name, setName] = useState(powerTotemTemplate.defaultName);
  const [price, setPrice] = useState(powerTotemTemplate.defaultPrice);
  const [unit, setUnit] = useState<PowerTotem['unit']>(powerTotemTemplate.defaultUnit);
  const [duration, setDuration] = useState(powerTotemTemplate.defaultDurationSeconds);
  const [createdTotem, setCreatedTotem] = useState<PowerTotem | null>(null);
  const [pairing, setPairing] = useState<GatewayPairingResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const latestTotems = useMemo(() => (totems.data ?? []).slice(0, 5), [totems.data]);

  const createTotem = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setPairing(null);

    try {
      const totem = await kivoClient.createPowerTotem({
        name,
        price,
        unit,
        sessionDurationSeconds: duration,
        metadata: {
          studio: 'power-totem',
        },
      });
      const nextPairing = await kivoClient.createPowerTotemPairingToken(totem.id);
      setCreatedTotem(totem);
      setPairing(nextPairing);
      notify({
        type: 'success',
        title: 'Power Totem criado',
        message: `${totem.name} esta pronto para parear o gateway.`,
      });
      await totems.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nao foi possivel criar o Power Totem.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Power Totem"
        title="Studio operacional"
        icon={powerTotemTemplate.icon}
        description="Crie um totem pago, pareie o gateway e prepare a tela de QR para liberar energia depois do x402."
        action={
          <div className="flex flex-wrap gap-2">
            <Link to="/totem-simulator" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-neutral-200 hover:bg-white/10">
              <Icon icon="solar:gamepad-bold-duotone" />
              Simulador
            </Link>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="overflow-hidden border-emerald-500/15 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_36%),rgba(15,23,42,0.72)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <Badge tone="ready">funcional no hackathon</Badge>
              <h2 className="mt-4 font-bricolage text-2xl font-bold text-white">Template Power Totem</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-300">{powerTotemTemplate.operatorUseCase}</p>
            </div>
            <div className="rounded-2xl border border-emerald-500/20 bg-black/25 p-4 text-right">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">Resource pattern</p>
              <code className="mt-2 block text-sm font-bold text-emerald-200">{powerTotemTemplate.resourcePattern}</code>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {powerTotemStudioChecklist.map((step, index) => (
              <div key={step.id} className="rounded-2xl border border-white/5 bg-black/25 p-4">
                <div className="flex items-center justify-between gap-3">
                  <Icon icon={step.icon} className="text-2xl text-emerald-300" />
                  <span className="text-xs font-bold text-neutral-500">0{index + 1}</span>
                </div>
                <p className="mt-3 text-sm font-bold text-white">{step.label}</p>
                <p className="mt-1 text-xs leading-5 text-neutral-400">{step.description}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-400">Criacao</p>
              <h2 className="mt-2 font-bricolage text-xl font-bold text-white">Novo totem</h2>
            </div>
            <Badge tone={saving ? 'processing' : 'neutral'}>{saving ? 'salvando' : 'rascunho'}</Badge>
          </div>

          <form onSubmit={createTotem} className="mt-5 space-y-4">
            <Field label="Nome do totem">
              <input value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-emerald-500" required />
            </Field>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Preco">
                <input value={price} onChange={(event) => setPrice(event.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 font-mono text-white outline-none focus:border-emerald-500" required />
              </Field>
              <Field label="Unidade">
                <select value={unit} onChange={(event) => setUnit(event.target.value as PowerTotem['unit'])} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-emerald-500">
                  {unitOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </Field>
              <Field label="Duracao">
                <input type="number" min={5} max={3600} value={duration} onChange={(event) => setDuration(Number(event.target.value))} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-emerald-500" required />
              </Field>
            </div>
            <div className="rounded-xl border border-white/5 bg-black/25 px-4 py-3 text-sm leading-6 text-neutral-400">
              O gateway sera criado pela API no pareamento. O nome retornado aparece junto com o token de uso unico.
            </div>
            {error && <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</p>}
            <button type="submit" disabled={saving} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60">
              <Icon icon={saving ? 'solar:refresh-bold-duotone' : 'solar:add-circle-bold-duotone'} />
              {saving ? 'Criando totem e token...' : 'Criar totem e parear gateway'}
            </button>
          </form>
        </Card>
      </div>

      {createdTotem && pairing && (
        <Card className="border-emerald-500/20 bg-emerald-500/[0.06]">
          <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone="ready">totem criado</Badge>
                <Badge tone={pairing.gateway.status}>{pairing.gateway.status}</Badge>
              </div>
              <h2 className="mt-4 font-bricolage text-2xl font-bold text-white">{createdTotem.name}</h2>
              <p className="mt-2 text-sm leading-6 text-neutral-300">Use estes dados agora. O token completo do gateway aparece uma vez para ser salvo no hardware ou no simulador.</p>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <SecretBox label="Resource" value={createdTotem.resource} />
                <SecretBox label="Gateway" value={pairing.gateway.name} />
                <SecretBox label="Gateway token" value={pairing.gatewayToken} secret />
                <SecretBox label="Pairing token" value={pairing.pairingToken ?? 'nao retornado'} secret />
              </div>
            </div>
            <div className="rounded-2xl border border-white/5 bg-black/25 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">Proximas telas</p>
              <div className="mt-4 grid gap-3">
                <Link to={`/totems/${createdTotem.id}`} className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-neutral-200 transition-colors hover:bg-white/10">
                  <Icon icon="solar:clipboard-list-bold-duotone" />
                  <span>Ver detalhe operacional</span>
                </Link>
                <Link to={`/totem/${createdTotem.id}/display`} className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-neutral-200 transition-colors hover:bg-white/10">
                  <Icon icon="solar:monitor-bold-duotone" />
                  <span>Abrir display de QR</span>
                </Link>
                <Link to="/totem-simulator" state={{ gatewayToken: pairing.gatewayToken, gatewayId: pairing.gateway.id }} className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-neutral-200 transition-colors hover:bg-white/10">
                  <Icon icon="solar:gamepad-bold-duotone" />
                  <span>Rodar simulador local</span>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-bricolage text-xl font-bold text-white">Totems recentes</h2>
            <Badge tone={totems.loading ? 'processing' : 'neutral'}>{totems.loading ? 'carregando' : `${latestTotems.length} visiveis`}</Badge>
          </div>
          <div className="mt-4 space-y-3">
            {totems.error && <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-100">{totems.error}</p>}
            {latestTotems.map((totem) => (
              <Link key={totem.id} to={`/totems/${totem.id}`} className="block rounded-xl border border-white/5 bg-black/25 p-4 transition-colors hover:bg-white/5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-white">{totem.name}</p>
                    <p className="mt-1 break-all font-mono text-xs text-emerald-200">{totem.resource}</p>
                  </div>
                  <Badge tone={totem.status}>{totem.status}</Badge>
                </div>
              </Link>
            ))}
            {!totems.loading && latestTotems.length === 0 && <p className="rounded-xl border border-white/5 bg-black/25 p-4 text-sm text-neutral-400">Nenhum Power Totem criado neste workspace ainda.</p>}
          </div>
        </Card>

        <Card>
          <h2 className="font-bricolage text-xl font-bold text-white">Templates futuros</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {futurePowerTotemTemplates.map((template) => (
              <div key={template.id} className="rounded-xl border border-white/5 bg-black/25 p-3">
                <div className="flex items-center justify-between gap-3">
                  <Icon icon={template.icon} className="text-xl text-violet-300" />
                  <Badge tone="future">roadmap</Badge>
                </div>
                <p className="mt-3 text-sm font-bold text-white">{template.name}</p>
                <p className="mt-1 text-xs leading-5 text-neutral-500">{template.description}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function SecretBox({ label, value, secret = false }: { label: string; value: string; secret?: boolean }) {
  return (
    <div className="min-w-0 rounded-xl border border-white/5 bg-black/25 p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">{label}</p>
        <CopyButton value={value} label="Copiar" />
      </div>
      <code className={`mt-2 block break-all text-xs ${secret ? 'text-amber-200' : 'text-emerald-200'}`}>{value}</code>
    </div>
  );
}
