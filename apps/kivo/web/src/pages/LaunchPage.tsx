import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';

const options = [
  {
    id: 'private_mainnet',
    label: 'Private mainnet',
    enabled: false,
    status: 'awaiting validation',
    description: 'Pago e privado. Fica desabilitado ate Gateway, x402, Etherfuse, pagamento e release passarem pela validacao real.',
  },
  {
    id: 'stay_testnet',
    label: 'Stay testnet',
    enabled: true,
    status: 'enabled',
    description: 'Mantem o flow em ambiente de teste para iterar SDK, Gateway e eventos sem cobrar em mainnet.',
  },
  {
    id: 'public_template',
    label: 'Public template',
    enabled: true,
    status: 'enabled',
    description: 'Fallback para publicar o aprendizado como template publico quando mainnet privada ainda nao esta pronta.',
  },
];

export default function LaunchPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Launch"
        title="Escolha como publicar"
        icon="solar:rocket-linear"
        description="Mainnet privada e paga, template publico e fallback, testnet segue disponivel para validar sem fingir readiness."
        action={
          <Link to="/validation" className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black hover:bg-emerald-400">
            <Icon icon="solar:shield-check-linear" />
            Ver validacao
          </Link>
        }
      />

      <Card className="border-emerald-500/15 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_34%),rgba(15,23,42,0.72)]">
        <Badge tone="processing">politica de publicacao</Badge>
        <h2 className="mt-4 font-bricolage text-2xl font-bold text-white">Launch depende de evidencia</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-300">
          Kivo nao empurra um flow para mainnet privada enquanto os sinais reais nao existem. O usuario ainda pode ficar em testnet ou transformar o caso em template publico.
        </p>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {options.map((option) => (
          <Card key={option.id} className={option.enabled ? '' : 'border-amber-500/20 bg-amber-500/[0.04]'}>
            <div className="flex items-start justify-between gap-3">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${option.enabled ? 'bg-emerald-500/10 text-emerald-300' : 'bg-amber-500/10 text-amber-300'}`}>
                <Icon icon={option.enabled ? 'solar:check-circle-linear' : 'solar:lock-keyhole-linear'} className="text-2xl" />
              </div>
              <Badge tone={option.enabled ? 'ready' : 'warning'}>{option.status}</Badge>
            </div>
            <h2 className="mt-4 font-bricolage text-xl font-bold text-white">{option.label}</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-400">{option.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
