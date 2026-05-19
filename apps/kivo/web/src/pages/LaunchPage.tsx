import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import { Link, useSearchParams } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { kivoClient } from '@/services/kivoClient';
import type { StudioLaunchOption } from '@/types/kivo';

type LaunchOptionView = StudioLaunchOption & {
  status: string;
};

const staticOptions: LaunchOptionView[] = [
  {
    id: 'private_mainnet',
    label: 'Private mainnet',
    enabled: false,
    status: 'awaiting validation',
    description: 'Pago e privado. Fica desabilitado ate Gateway, x402, Etherfuse, pagamento e release passarem pela validacao real.',
    reason: 'Valide um flow antes de publicar privado.',
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
  const [searchParams] = useSearchParams();
  const flowId = searchParams.get('flowId') ?? '';
  const [options, setOptions] = useState<LaunchOptionView[]>(staticOptions);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const launchOptionsRequestId = useRef(0);

  const loadLaunchOptions = useCallback(async () => {
    const requestId = launchOptionsRequestId.current + 1;
    launchOptionsRequestId.current = requestId;

    if (!flowId) {
      setOptions(staticOptions);
      setError('');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const apiOptions = await kivoClient.listStudioLaunchOptions(flowId);
      if (launchOptionsRequestId.current !== requestId) {
        return;
      }
      setOptions(apiOptions.map((option) => ({
        ...option,
        status: option.enabled ? 'enabled' : 'disabled',
      })));
    } catch (caught) {
      if (launchOptionsRequestId.current !== requestId) {
        return;
      }
      setError(caught instanceof Error ? caught.message : 'Nao foi possivel carregar opcoes de launch.');
      setOptions(staticOptions);
    } finally {
      if (launchOptionsRequestId.current === requestId) {
        setLoading(false);
      }
    }
  }, [flowId]);

  useEffect(() => {
    void loadLaunchOptions();
  }, [loadLaunchOptions]);

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
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={loadLaunchOptions}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-200 transition hover:bg-emerald-500/15 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon icon={loading ? 'solar:refresh-linear' : 'solar:refresh-circle-linear'} />
            {loading ? 'Carregando' : 'Atualizar opcoes'}
          </button>
          {flowId ? <Badge tone="neutral">flow {flowId}</Badge> : <Badge tone="warning">Valide um flow antes de publicar privado.</Badge>}
        </div>
        {error && (
          <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs leading-5 text-red-200">
            {error}
          </p>
        )}
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
            {option.reason && <p className="mt-3 text-xs leading-5 text-amber-200">{option.reason}</p>}
          </Card>
        ))}
      </div>
    </div>
  );
}
