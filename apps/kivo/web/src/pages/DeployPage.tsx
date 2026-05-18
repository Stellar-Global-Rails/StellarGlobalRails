import { Icon } from '@iconify/react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { PageHeader } from '@/components/ui/PageHeader';
import { WorkspaceContextBanner } from '@/components/WorkspaceContextBanner';
import { formatProviderModeLabel } from '@/config/productMode';
import { useAsyncData } from '@/hooks/useAsyncData';
import { kivoClient } from '@/services/kivoClient';
import { formatDateTime, statusLabel } from '@/utils/format';

const envTemplate = `# Supabase Edge Function secrets
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
CORS_ORIGINS=https://<your-vercel-domain>,http://localhost:5174,http://127.0.0.1:5174
STELLAR_NETWORK=testnet
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
X402_PLATFORM_KEY=G...
USDC_ISSUER=GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5
ETHERFUSE_MODE=devnet
ETHERFUSE_BASE_URL=https://api.sand.etherfuse.com
ETHERFUSE_API_KEY=ef_sand_...
ETHERFUSE_WEBHOOK_URL=https://<project-ref>.supabase.co/functions/v1/kivo-api/v1/etherfuse/webhook
ETHERFUSE_WEBHOOK_SECRET=...
ETHERFUSE_WEBHOOK_VERIFY=true

# Vercel frontend env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=...
VITE_KIVO_API_URL=https://<project-ref>.supabase.co/functions/v1/kivo-api`;

const releaseCommands = `supabase functions deploy kivo-api --project-ref <project-ref> --use-api --no-verify-jwt
cd apps/kivo/web
npm install
npm run lint
npm test
npm run build`;

const supabaseServices = [
  { name: 'Database', value: '10 tabelas kivo_* com RLS', icon: 'solar:database-bold-duotone' },
  { name: 'Auth', value: 'profiles por trigger auth.users', icon: 'solar:user-check-bold-duotone' },
  { name: 'Realtime', value: 'payments, deliveries e orders', icon: 'solar:translation-2-bold-duotone' },
  { name: 'Storage', value: 'kivo-proofs e device-assets privados', icon: 'solar:cloud-storage-bold-duotone' },
  { name: 'Edge Function', value: 'kivo-api', icon: 'solar:bolt-bold-duotone' },
  { name: 'MCP', value: 'kivo-api /mcp em migracao', icon: 'solar:cpu-bolt-bold-duotone' },
];

const scopeIcon: Record<string, string> = {
  frontend: 'solar:monitor-bold-duotone',
  api: 'solar:server-square-cloud-bold-duotone',
  workers: 'solar:queue-bold-duotone',
  stellar: 'solar:star-fall-bold-duotone',
  security: 'solar:shield-check-bold-duotone',
};

export default function DeployPage() {
  const checks = useAsyncData(() => kivoClient.listDeployChecks(), []);
  const services = useAsyncData(() => kivoClient.listDeployServices(), []);
  const etherfuse = useAsyncData(() => kivoClient.getEtherfuseStatus(), []);
  const etherfuseAssets = useAsyncData(() => kivoClient.listEtherfuseAssets(), []);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Release ops"
        title="Deploy readiness"
        icon="solar:rocket-bold-duotone"
        description="Checklist operacional para publicar o front MVP, Supabase Edge API, Etherfuse e Supabase Cloud."
      />

      <WorkspaceContextBanner
        eyebrow="Readiness enterprise"
        title="Do ambiente local ao cliente"
        icon="solar:rocket-bold-duotone"
        tone="warning"
        description="Deploy continua avancado, mas agora serve para provar que o workspace pode sair do modo solo e virar operacao real com secrets, Supabase Edge, Auth/DB e Etherfuse."
        checkpoints={['Supabase Edge API', 'Supabase Auth/DB', 'Etherfuse anchor']}
        primaryAction={{ to: '/team', label: 'Ver escala' }}
        secondaryAction={{ to: '/settings', label: 'Configuracoes' }}
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <h2 className="font-bricolage text-xl font-bold text-white">Checklist MVP</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {(checks.data ?? []).map((check) => (
              <div key={check.id} className="rounded-xl border border-white/5 bg-black/25 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-emerald-300">
                      <Icon icon={scopeIcon[check.scope] ?? 'solar:check-circle-bold'} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-white">{check.label}</p>
                      <p className="text-xs text-neutral-500">{check.owner}</p>
                    </div>
                  </div>
                  <Badge tone={check.status}>{statusLabel(check.status)}</Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-neutral-400">{check.description}</p>
                {check.value && (
                  <p className="mt-2 break-all font-mono text-xs text-emerald-300">
                    {check.id === 'etherfuse' ? formatProviderModeLabel(check.value) : check.value}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-bricolage text-xl font-bold text-white">Env template</h2>
            <CopyButton value={envTemplate} label="Copiar" />
          </div>
          <pre className="mt-4 overflow-auto rounded-xl border border-white/10 bg-black/50 p-4 text-xs text-emerald-100">{envTemplate}</pre>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-bricolage text-xl font-bold text-white">Release commands</h2>
            <CopyButton value={releaseCommands} label="Copiar" />
          </div>
          <pre className="mt-4 overflow-auto rounded-xl border border-white/10 bg-black/50 p-4 text-xs text-blue-100">{releaseCommands}</pre>
        </Card>

        <Card className="xl:col-span-2">
          <h2 className="font-bricolage text-xl font-bold text-white">Servicos</h2>
          <div className="mt-4 divide-y divide-white/5">
            {(services.data ?? []).map((service) => (
              <div key={service.id} className="py-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-bold text-white">{service.name}</p>
                    <p className="mt-1 text-sm text-neutral-500">{service.description}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={service.status}>{statusLabel(service.status)}</Badge>
                    <Badge>{service.id === 'etherfuse' ? formatProviderModeLabel(service.environment) : service.environment}</Badge>
                  </div>
                </div>
                <div className="mt-3 flex flex-col gap-2 text-xs text-neutral-600 md:flex-row md:items-center md:justify-between">
                  <span>{service.region ?? 'sem regiao'} · atualizado {formatDateTime(service.updatedAt)}</span>
                  {service.url && <span className="break-all font-mono text-emerald-300">{service.url}</span>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="font-bricolage text-xl font-bold text-white">Supabase MVP</h2>
            <p className="mt-1 text-sm text-neutral-500">Auth, database, realtime, storage, edge functions e MCP local prontos para o caminho do operador.</p>
          </div>
          <Badge tone="ready">validado local</Badge>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {supabaseServices.map((service) => (
            <div key={service.name} className="rounded-xl border border-white/5 bg-black/25 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-300">
                  <Icon icon={service.icon} />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-white">{service.name}</p>
                  <p className="mt-1 break-words text-sm text-neutral-500">{service.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="font-bricolage text-xl font-bold text-white">Etherfuse Anchor</h2>
            <p className="mt-1 text-sm text-neutral-500">Status do proxy server-side para Etherfuse e Stellar. A API key nunca vai para o browser.</p>
          </div>
          {etherfuse.data && <Badge tone={etherfuse.data.configured ? 'ready' : 'warning'}>{etherfuse.data.configured ? 'configurada' : 'aguardando chave'}</Badge>}
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-white/5 bg-black/25 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Modo</p>
            <p className="mt-2 font-mono text-sm text-emerald-300">{etherfuse.data ? formatProviderModeLabel(etherfuse.data.mode) : 'carregando'}</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-black/25 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Base URL</p>
            <p className="mt-2 break-all font-mono text-sm text-emerald-300">{etherfuse.data?.base_url ?? '...'}</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-black/25 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Webhook</p>
            <p className="mt-2 break-all font-mono text-sm text-emerald-300">{etherfuse.data?.webhook_url || 'nao definido'}</p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {(etherfuseAssets.data?.assets ?? []).map((asset) => (
            <div key={asset.identifier} className="rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-white">{asset.symbol}</p>
                  <p className="text-xs text-neutral-500">{asset.name} · {asset.currency.toUpperCase()}</p>
                </div>
                <Badge tone="active">{asset.balance ?? '0'}</Badge>
              </div>
              <p className="mt-3 break-all font-mono text-xs text-emerald-200">{asset.identifier}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
