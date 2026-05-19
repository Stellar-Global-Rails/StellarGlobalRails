import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';

const checklist = [
  { label: 'Gateway', status: 'needs_connection', message: 'Conecte o runtime fisico ou digital antes de validar liberacao.' },
  { label: 'x402', status: 'not_configured', message: 'Challenge e payment header ainda precisam de configuracao real.' },
  { label: 'Etherfuse', status: 'pending', message: 'Onramp/offramp e confirmacao ficam pendentes ate credenciais e ambiente.' },
  { label: 'Payment', status: 'pending', message: 'Pagamento nao e marcado como sucesso sem transacao e confirmacao.' },
  { label: 'Release', status: 'pending', message: 'Liberacao do recurso espera Gateway online e autorizacao valida.' },
];

const toneByStatus: Record<string, string> = {
  needs_connection: 'warning',
  not_configured: 'blocked',
  pending: 'pending',
};

export default function ValidationPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Validacao"
        title="Validacao real com x402 + Etherfuse"
        icon="solar:shield-check-linear"
        description="Esta pagina nao mostra sucesso inventado. Ela separa o que esta conectado, configurado, pendente e bloqueado antes de permitir launch."
        action={
          <Link to="/gateway" className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black hover:bg-emerald-400">
            <Icon icon="solar:server-square-cloud-linear" />
            Conectar Gateway
          </Link>
        }
      />

      <Card className="border-amber-500/15 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.14),transparent_34%),rgba(15,23,42,0.72)]">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Badge tone="warning">sem sucesso falso</Badge>
            <h2 className="mt-4 font-bricolage text-2xl font-bold text-white">Checklist honesto de readiness</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-300">
              O objetivo e mostrar evidencia, nao maquiagem: se x402, Etherfuse, pagamento ou Gateway estiver pendente, o Studio deixa isso visivel.
            </p>
          </div>
          <div className="grid gap-3">
            {checklist.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/5 bg-black/25 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-bold text-white">{item.label}</p>
                  <Badge tone={toneByStatus[item.status]}>{item.status}</Badge>
                </div>
                <p className="mt-2 text-xs leading-5 text-neutral-400">{item.message}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        {['x402 challenge real', 'Etherfuse pendente ate credencial', 'Gateway precisa heartbeat'].map((item) => (
          <Card key={item}>
            <Icon icon="solar:check-read-linear" className="text-2xl text-emerald-300" />
            <p className="mt-3 text-sm font-bold text-white">{item}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
