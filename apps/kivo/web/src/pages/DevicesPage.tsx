import { Icon } from '@iconify/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { PageHeader } from '@/components/ui/PageHeader';
import { SecretReveal } from '@/components/ui/SecretReveal';
import { WorkspaceContextBanner } from '@/components/WorkspaceContextBanner';
import { useAsyncData } from '@/hooks/useAsyncData';
import { kivoClient } from '@/services/kivoClient';
import type { DeviceRegistrationResult } from '@/types/kivo';
import { formatDateTime, shortId, statusLabel } from '@/utils/format';

export default function DevicesPage() {
  const devices = useAsyncData(() => kivoClient.listDevices(), []);
  const [modalOpen, setModalOpen] = useState(false);
  const [created, setCreated] = useState<DeviceRegistrationResult | null>(null);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [model, setModel] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const result = await kivoClient.registerDevice({ name, metadata: { location, model, type: 'custom' } });
    setCreated(result);
    await devices.reload();
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Device layer"
        title="Devices registrados"
        icon="solar:devices-bold-duotone"
        description="Carteiras de máquina, chaves de API e metadata operacional para pagamentos autônomos."
        action={
          <button onClick={() => setModalOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black hover:bg-emerald-400">
            Registrar device
            <Icon icon="solar:add-circle-bold" />
          </button>
        }
      />

      <WorkspaceContextBanner
        eyebrow="Jornada do operador"
        title="Ativos que geram receita no workspace"
        icon="solar:station-bold-duotone"
        tone="ready"
        description="Esta tela representa a camada fisica e logica do negocio: estacoes, sensores, agentes ou servicos que podem cobrar, receber e provar uso."
        checkpoints={['Wallet Stellar por device', 'API key aparece uma vez', 'Status afeta operacao']}
        primaryAction={{ to: '/operations', label: 'Ver operacao' }}
        secondaryAction={{ to: '/checkout', label: 'Testar uso pago' }}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {(devices.data ?? []).map((device) => (
          <Link key={device.id} to={`/devices/${device.id}`} className="group rounded-2xl border border-white/5 bg-neutral-900 p-5 hover:border-emerald-500/25 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Icon icon={device.metadata.type === 'ai-agent' ? 'solar:cpu-bolt-bold' : 'solar:devices-bold'} className="text-2xl" />
                </div>
                <div>
                  <h2 className="font-bold text-white group-hover:text-emerald-400">{device.name}</h2>
                  <p className="text-xs text-neutral-500">{device.metadata.location}</p>
                </div>
              </div>
              <Badge tone={device.status}>{statusLabel(device.status)}</Badge>
            </div>
            <div className="mt-5 space-y-2 rounded-xl bg-black/25 p-3">
              <p className="text-xs text-neutral-500">Stellar wallet</p>
              <code className="block text-xs text-neutral-300">{shortId(device.stellarPublicKey, 12, 8)}</code>
              <p className="text-xs text-neutral-500">API key · {device.apiKeyPreview}</p>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-neutral-500">
              <span>{device.balances[0]?.amount ?? '0'} USDC</span>
              <span>{formatDateTime(device.createdAt)}</span>
            </div>
          </Link>
        ))}
      </div>

      <Modal open={modalOpen} title="Registrar novo device" onClose={() => setModalOpen(false)}>
        <form onSubmit={submit} className="space-y-4">
          <input value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-emerald-500" placeholder="Nome do device" />
          <div className="grid gap-3 sm:grid-cols-2">
            <input value={location} onChange={(event) => setLocation(event.target.value)} className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-emerald-500" placeholder="Localização" />
            <input value={model} onChange={(event) => setModel(event.target.value)} className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-emerald-500" placeholder="Modelo" />
          </div>
          <button disabled={!name} className="rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black disabled:cursor-not-allowed disabled:opacity-50">Criar wallet e API key</button>
        </form>
        {created && (
          <div className="mt-5 space-y-4">
            <SecretReveal label="API key raw" value={created.apiKey} />
            <p className="text-xs text-neutral-500">Device criado: {created.device.name}</p>
          </div>
        )}
      </Modal>

      {devices.loading && <Card>Carregando devices...</Card>}
    </div>
  );
}
