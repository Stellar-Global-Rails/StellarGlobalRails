import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { gatewayModes } from '@/data/studioExperience';

const contract = [
  { label: 'Heartbeat', description: 'Gateway prova que o runtime esta vivo antes de liberar qualquer recurso.', icon: 'solar:pulse-2-linear' },
  { label: 'Authorization', description: 'Runtime recebe decisao de acesso depois do challenge e pagamento x402.', icon: 'solar:shield-keyhole-linear' },
  { label: 'Events', description: 'Cada tentativa, liberacao, timeout e falha volta para o historico do flow.', icon: 'solar:calendar-mark-linear' },
  { label: 'Health', description: 'Estado operacional separa pronto, pendente, offline e bloqueado sem inventar sucesso.', icon: 'solar:heart-pulse-linear' },
];

const modeCopy = {
  physical: {
    title: 'Modos fisicos',
    description: 'Raspberry Pi, edge device e totem rodam perto do recurso real para acionar relay, tela, sensor ou controlador local.',
    tone: 'ready',
  },
  digital: {
    title: 'Modos digitais',
    description: 'Proxy, middleware, sidecar, worker, API guard, plugin e serverless function protegem software, dados e automacoes.',
    tone: 'processing',
  },
} as const;

export default function GatewayPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Kivo Gateway"
        title="Runtime que libera o recurso real"
        icon="solar:server-square-cloud-linear"
        description="O Gateway fica entre a validacao de pagamento e aquilo que precisa ser liberado: energia, API, dado, job, ferramenta de agente ou qualquer recurso com regra de acesso. Ele pode ser fisico ou gateway digital."
        action={
          <div className="flex flex-wrap gap-2">
            <Link to="/totem-simulator" className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black hover:bg-emerald-400">
              <Icon icon="solar:gamepad-linear" />
              Simular totem
            </Link>
            <Link to="/sdk" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-neutral-200 hover:bg-white/10">
              <Icon icon="solar:code-square-linear" />
              Ver SDK
            </Link>
          </div>
        }
      />

      <Card className="border-emerald-500/15 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_34%),rgba(15,23,42,0.72)]">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <Badge tone="ready">contrato minimo</Badge>
            <h2 className="mt-4 font-bricolage text-2xl font-bold text-white">Um runtime, muitas superficies</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-300">
              O Studio escolhe o modo; o SDK entrega adaptadores; o Gateway reporta estado real antes de qualquer launch.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {contract.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/5 bg-black/25 p-4">
                <Icon icon={item.icon} className="text-2xl text-emerald-300" />
                <p className="mt-3 text-sm font-bold text-white">{item.label}</p>
                <p className="mt-1 text-xs leading-5 text-neutral-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        {(['physical', 'digital'] as const).map((surface) => (
          <Card key={surface}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-bricolage text-xl font-bold text-white">{modeCopy[surface].title}</h2>
                <p className="mt-2 text-sm leading-6 text-neutral-400">{modeCopy[surface].description}</p>
              </div>
              <Badge tone={modeCopy[surface].tone}>{surface}</Badge>
            </div>
            <div className="mt-5 grid gap-3">
              {gatewayModes.filter((mode) => mode.surface === surface).map((mode) => (
                <div key={mode.id} className="rounded-2xl border border-white/5 bg-black/25 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-bold text-white">{mode.label}</p>
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">{mode.id.replaceAll('_', ' ')}</span>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-neutral-400">{mode.bestFor}</p>
                  <p className="mt-2 text-xs leading-5 text-emerald-200">{mode.runtime}</p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
