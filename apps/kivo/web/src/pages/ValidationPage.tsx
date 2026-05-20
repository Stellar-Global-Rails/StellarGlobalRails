import { useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import { Link, useSearchParams } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { kivoClient } from '@/services/kivoClient';
import type { StudioValidationRun, StudioValidationStep } from '@/types/kivo';

const checklist: StudioValidationStep[] = [
  { id: 'gateway', label: 'Gateway', status: 'needs_connection', message: 'Conecte o runtime fisico ou digital antes de validar liberacao.' },
  { id: 'x402', label: 'x402', status: 'not_configured', message: 'Challenge e payment header ainda precisam de configuracao real.' },
  { id: 'etherfuse', label: 'Etherfuse', status: 'pending', message: 'Onramp/offramp e confirmacao ficam pendentes ate credenciais e ambiente.' },
  { id: 'payment', label: 'Payment', status: 'pending', message: 'Pagamento nao e marcado como sucesso sem transacao e confirmacao.' },
  { id: 'release', label: 'Release', status: 'pending', message: 'Liberacao do recurso espera Gateway online e autorizacao valida.' },
];

const toneByStatus: Record<string, string> = {
  needs_connection: 'warning',
  not_configured: 'blocked',
  pending: 'pending',
  running: 'processing',
  passed: 'ready',
  failed: 'failed',
  needs_user_action: 'warning',
};

export default function ValidationPage() {
  const [searchParams] = useSearchParams();
  const flowId = searchParams.get('flowId') ?? '';
  const [run, setRun] = useState<StudioValidationRun | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const validationRequestId = useRef(0);
  const steps: StudioValidationStep[] = run?.steps ?? checklist;

  useEffect(() => {
    validationRequestId.current += 1;
    setRun(null);
    setError('');
    setLoading(false);
  }, [flowId]);

  const handleStartValidation = async () => {
    if (!flowId) {
      setRun(null);
      setError('Crie ou selecione um flow antes de validar.');
      return;
    }

    const requestId = validationRequestId.current + 1;
    validationRequestId.current = requestId;
    setLoading(true);
    setError('');
    setRun(null);
    try {
      const nextRun = await kivoClient.startStudioValidation(flowId);
      if (validationRequestId.current !== requestId) {
        return;
      }
      setRun(nextRun);
    } catch (caught) {
      if (validationRequestId.current !== requestId) {
        return;
      }
      setRun(null);
      setError(caught instanceof Error ? caught.message : 'Nao foi possivel iniciar a validacao.');
    } finally {
      if (validationRequestId.current === requestId) {
        setLoading(false);
      }
    }
  };

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
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleStartValidation}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Icon icon={loading ? 'solar:refresh-linear' : 'solar:shield-check-linear'} />
                {loading ? 'Validando' : 'Iniciar validacao'}
              </button>
              {flowId && <Badge tone="neutral">flow {flowId}</Badge>}
              {run && <Badge tone={toneByStatus[run.status] ?? 'neutral'}>{run.status}</Badge>}
            </div>
            {error && (
              <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs leading-5 text-red-200">
                {error}
              </p>
            )}
          </div>
          <div className="grid gap-3">
            {steps.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/5 bg-black/25 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-bold text-white">{item.label}</p>
                  <Badge tone={toneByStatus[item.status] ?? 'neutral'}>{item.status}</Badge>
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
