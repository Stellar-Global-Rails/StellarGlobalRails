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

const scopes = ['devices:read', 'devices:write', 'payments:read', 'payments:write', 'webhooks:write', 'mcp:use', 'x402:pay'];

export default function ApiKeysPage() {
  const keys = useAsyncData(() => kivoClient.listApiKeys(), []);
  const notify = useNotificationStore((state) => state.add);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('Nova integracao');
  const [selectedScopes, setSelectedScopes] = useState(scopes.slice(0, 4));
  const [expiresAt, setExpiresAt] = useState('');
  const [rawKey, setRawKey] = useState<string | undefined>();
  const [busyId, setBusyId] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const result = await kivoClient.createApiKey({
      name,
      scopes: selectedScopes,
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
    });
    setRawKey(result.rawKey);
    notify({ type: 'success', title: 'API key criada', message: 'O valor raw aparece uma unica vez.' });
    await keys.reload();
  };

  const toggleScope = (scope: string) => {
    setSelectedScopes((current) => (current.includes(scope) ? current.filter((item) => item !== scope) : [...current, scope]));
  };

  const revoke = async (id: string) => {
    setBusyId(id);
    try {
      await kivoClient.revokeApiKey(id);
      notify({ type: 'warning', title: 'API key revogada', message: 'A linha continua visivel para auditoria.' });
      await keys.reload();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Auth realm"
        title="API Keys"
        icon="solar:key-minimalistic-bold-duotone"
        description="Chaves nomeadas com scopes para dashboard, devices e agentes."
        action={<button type="button" onClick={() => setModalOpen(true)} className="rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black">Criar key</button>}
      />

      <WorkspaceContextBanner
        eyebrow="Jornada do integrador"
        title="Credenciais por produto, device ou agente"
        icon="solar:key-minimalistic-bold-duotone"
        tone="ready"
        description="API keys continuam tecnicas, mas agora aparecem como parte do onboarding de integracao: cada chave tem dono, escopo e ciclo de vida no workspace."
        checkpoints={['Scopes por responsabilidade', 'Revogacao auditavel', 'Raw key exibida uma vez']}
        primaryAction={{ to: '/integrations', label: 'Voltar ao hub' }}
        secondaryAction={{ to: '/team', label: 'Ver roles' }}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {(keys.data ?? []).map((key) => (
          <Card key={key.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate font-bold text-white">{key.name}</h2>
                <p className="mt-1 font-mono text-xs text-neutral-500">{key.keyPreview}</p>
              </div>
              <Badge tone={key.status}>{statusLabel(key.status)}</Badge>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {key.scopes.map((scope) => <span key={scope} className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-neutral-400">{scope}</span>)}
            </div>
            <div className="mt-4 flex flex-col gap-3 text-xs text-neutral-600 md:flex-row md:items-center md:justify-between">
              <p>Criada em {formatDateTime(key.createdAt)} · ultimo uso {formatDateTime(key.lastUsedAt)}</p>
              <button type="button" disabled={key.status === 'revoked' || busyId === key.id} onClick={() => revoke(key.id)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 font-bold text-red-300 transition-colors hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-40">
                <Icon icon="solar:forbidden-circle-bold" />
                Revogar
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={modalOpen} title="Criar API key" onClose={() => setModalOpen(false)}>
        <form onSubmit={submit} className="space-y-4">
          <input value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-emerald-500" />
          <input type="datetime-local" value={expiresAt} onChange={(event) => setExpiresAt(event.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-neutral-300 outline-none focus:border-emerald-500" />
          <div className="flex flex-wrap gap-2">
            {scopes.map((scope) => (
              <button key={scope} type="button" onClick={() => toggleScope(scope)} className={`rounded-lg border px-2 py-1 text-xs transition-colors ${selectedScopes.includes(scope) ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300' : 'border-white/10 bg-white/5 text-neutral-400'}`}>
                {scope}
              </button>
            ))}
          </div>
          <button disabled={selectedScopes.length === 0} className="rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black disabled:opacity-40">Gerar key</button>
        </form>
        {rawKey && <div className="mt-5"><SecretReveal label="API key raw" value={rawKey} /></div>}
      </Modal>
    </div>
  );
}
