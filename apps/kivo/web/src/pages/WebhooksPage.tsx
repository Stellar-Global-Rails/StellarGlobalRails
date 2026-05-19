import { Icon } from '@iconify/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { PageHeader } from '@/components/ui/PageHeader';
import { SecretReveal } from '@/components/ui/SecretReveal';
import { WorkspaceContextBanner } from '@/components/WorkspaceContextBanner';
import { useAsyncData } from '@/hooks/useAsyncData';
import { kivoClient } from '@/services/kivoClient';
import { useNotificationStore } from '@/stores';
import { formatDateTime, statusLabel } from '@/utils/format';

const defaultEvents = ['payment.confirmed', 'payment.failed', 'payment.expired'];

export default function WebhooksPage() {
  const webhooks = useAsyncData(() => kivoClient.listWebhooks(), []);
  const deliveries = useAsyncData(() => kivoClient.listWebhookDeliveries(), []);
  const notify = useNotificationStore((state) => state.add);
  const [modalOpen, setModalOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [secret, setSecret] = useState<string | undefined>();
  const [busyId, setBusyId] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const created = await kivoClient.createWebhook({ url, events: defaultEvents });
    setSecret(created.secret);
    notify({ type: 'success', title: 'Webhook criado', message: 'Guarde o signing secret exibido uma unica vez.' });
    await webhooks.reload();
  };

  const runWebhookAction = async (id: string, action: () => Promise<void>) => {
    setBusyId(id);
    try {
      await action();
    } finally {
      setBusyId(null);
    }
  };

  const toggle = (id: string, active: boolean) =>
    runWebhookAction(id, async () => {
      await kivoClient.toggleWebhook(id, active);
      notify({ type: 'success', title: active ? 'Webhook ativado' : 'Webhook pausado' });
      await webhooks.reload();
    });

  const test = (id: string) =>
    runWebhookAction(id, async () => {
      const result = await kivoClient.testWebhook(id);
      notify({ type: 'success', title: 'Teste enviado', message: `${result.responseCode} em ${result.latencyMs}ms` });
      await Promise.all([webhooks.reload(), deliveries.reload()]);
    });

  const remove = (id: string) =>
    runWebhookAction(id, async () => {
      await kivoClient.deleteWebhook(id);
      notify({ type: 'warning', title: 'Webhook removido', message: 'O endpoint saiu da lista ativa do workspace.' });
      await Promise.all([webhooks.reload(), deliveries.reload()]);
    });

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Event-driven"
        title="Webhooks"
        icon="solar:widget-2-bold-duotone"
        description="Receba eventos HMAC-signed de pagamentos, falhas e expiracao."
        action={<button type="button" onClick={() => setModalOpen(true)} className="rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black">Novo webhook</button>}
      />

      <WorkspaceContextBanner
        eyebrow="Jornada do integrador"
        title="Eventos que conectam Kivo ao produto do cliente"
        icon="solar:widget-2-bold-duotone"
        tone="ready"
        description="Webhooks sao a ponte entre pagamentos reais e a experiencia final: liberar acesso, registrar sessao, avisar financeiro ou acionar um worker."
        checkpoints={['Assinatura HMAC', 'Retry e falha visiveis', 'Entrega auditavel']}
        primaryAction={{ to: '/integrations', label: 'Hub de integracao' }}
        secondaryAction={{ to: '/finance', label: 'Impacto financeiro' }}
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <h2 className="font-bricolage text-xl font-bold text-white">Endpoints</h2>
          <div className="mt-4 divide-y divide-white/5">
            {(webhooks.data ?? []).map((webhook) => (
              <div key={webhook.id} className="py-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <p className="break-all font-mono text-sm text-white">{webhook.url}</p>
                    <p className="mt-1 text-xs text-neutral-500">{webhook.events.join(', ')}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={webhook.active ? 'active' : 'paused'}>{webhook.active ? 'Ativo' : 'Pausado'}</Badge>
                    <Badge tone={webhook.lastDeliveryStatus}>{statusLabel(webhook.lastDeliveryStatus)}</Badge>
                  </div>
                </div>
                <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <p className="text-xs text-neutral-600">{webhook.deliveryCount} entregas · {webhook.secretPreview}</p>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" disabled={busyId === webhook.id} onClick={() => toggle(webhook.id, !webhook.active)} className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-neutral-300 transition-colors hover:bg-white/10 disabled:opacity-40">
                      <Icon icon={webhook.active ? 'solar:pause-circle-bold' : 'solar:play-circle-bold'} />
                      {webhook.active ? 'Pausar' : 'Ativar'}
                    </button>
                    <button type="button" disabled={busyId === webhook.id} onClick={() => test(webhook.id)} className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-300 transition-colors hover:bg-emerald-500/15 disabled:opacity-40">
                      <Icon icon="solar:plain-2-bold" />
                      Testar
                    </button>
                    <button type="button" disabled={busyId === webhook.id} onClick={() => remove(webhook.id)} className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-300 transition-colors hover:bg-red-500/15 disabled:opacity-40">
                      <Icon icon="solar:trash-bin-trash-bold" />
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-bricolage text-xl font-bold text-white">Ultimas entregas</h2>
          <div className="mt-4 space-y-3">
            {(deliveries.data ?? []).map((delivery) => (
              <div key={delivery.id} className="rounded-xl bg-black/25 p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-white">{delivery.event}</span>
                  <Badge tone={delivery.status}>{statusLabel(delivery.status)}</Badge>
                </div>
                <p className="mt-1 text-xs text-neutral-500">{delivery.attempts} tentativas · {delivery.responseCode ?? 'sem resposta'}</p>
                <p className="mt-1 text-xs text-neutral-600">{formatDateTime(delivery.createdAt)}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Modal open={modalOpen} title="Cadastrar webhook" onClose={() => setModalOpen(false)}>
        <form onSubmit={submit} className="space-y-4">
          <input value={url} onChange={(event) => setUrl(event.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-emerald-500" />
          <div className="flex flex-wrap gap-2">
            {defaultEvents.map((event) => <span key={event} className="rounded-lg bg-white/5 px-2 py-1 text-xs text-neutral-400">{event}</span>)}
          </div>
          <button className="rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black">Criar webhook</button>
        </form>
        {secret && <div className="mt-5"><SecretReveal label="Webhook signing secret" value={secret} /></div>}
      </Modal>
    </div>
  );
}
