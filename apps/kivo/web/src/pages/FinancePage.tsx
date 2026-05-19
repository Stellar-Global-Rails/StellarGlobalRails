import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { useAsyncData } from '@/hooks/useAsyncData';
import { kivoClient } from '@/services/kivoClient';
import { formatCurrency, formatDateTime, shortId, statusLabel } from '@/utils/format';

export default function FinancePage() {
  const summary = useAsyncData(() => kivoClient.getDashboardSummary(), []);
  const payments = useAsyncData(() => kivoClient.listPayments(), []);

  const confirmed = (payments.data ?? []).filter((payment) => payment.status === 'confirmed');
  const pending = (payments.data ?? []).filter((payment) => payment.status === 'pending' || payment.status === 'processing');
  const failed = (payments.data ?? []).filter((payment) => payment.status === 'failed');
  const estimatedFees = confirmed.reduce((total, payment) => total + Number(payment.feeCharged || 0), 0);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Financeiro"
        title="Recebiveis e conciliacao"
        icon="solar:chart-square-bold-duotone"
        description="Visao para quem precisa confiar no dinheiro: volume, status, falhas, taxas e provas de liquidacao."
        action={<Link to="/payments" className="rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black hover:bg-emerald-400">Ver pagamentos</Link>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Volume USDC" value={formatCurrency(summary.data?.totalVolumeUsdc ?? 0)} icon="solar:wallet-money-bold-duotone" tone="blue" />
        <StatCard title="Confirmados" value={confirmed.length.toString()} detail="liquidados ou finalizados" icon="solar:check-circle-bold-duotone" />
        <StatCard title="Pendentes" value={pending.length.toString()} detail="em liquidacao" icon="solar:hourglass-bold-duotone" tone="amber" />
        <StatCard title="Taxas" value={formatCurrency(estimatedFees)} detail="estimativa informada" icon="solar:bill-check-bold-duotone" tone="violet" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-bricolage text-xl font-bold text-white">Ledger financeiro</h2>
              <p className="text-sm text-neutral-500">Pagamentos com status e provas para auditoria.</p>
            </div>
            <Badge tone={failed.length ? 'warning' : 'ready'}>{failed.length ? `${failed.length} falhas` : 'sem falhas'}</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-neutral-500">
                <tr className="border-b border-white/5">
                  <th className="py-3">Pagamento</th>
                  <th>Valor</th>
                  <th>Status</th>
                  <th>Hash Stellar</th>
                  <th>Criado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(payments.data ?? []).slice(0, 8).map((payment) => (
                  <tr key={payment.id} className="hover:bg-white/[0.02]">
                    <td className="py-4">
                      <Link to={`/payments/${payment.id}`} className="font-mono text-xs text-emerald-400 hover:text-emerald-300">{shortId(payment.id)}</Link>
                      <p className="mt-1 text-xs text-neutral-500">{payment.memo ?? 'sem memo'}</p>
                    </td>
                    <td className="font-bold text-white">{payment.amount} {payment.assetCode}</td>
                    <td><Badge tone={payment.status}>{statusLabel(payment.status)}</Badge></td>
                    <td className="font-mono text-xs text-neutral-400">{payment.stellarHash ? shortId(payment.stellarHash, 10, 8) : 'aguardando'}</td>
                    <td className="text-neutral-500">{formatDateTime(payment.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <h2 className="font-bricolage text-xl font-bold text-white">Conciliacao</h2>
            <div className="mt-5 space-y-3">
              {[
                ['Receita confirmada', confirmed.length, 'confirmed'],
                ['Aguardando settlement', pending.length, 'pending'],
                ['Falhas para revisar', failed.length, failed.length ? 'warning' : 'ready'],
              ].map(([label, value, tone]) => (
                <div key={label} className="flex items-center justify-between rounded-xl bg-black/30 p-3">
                  <span className="text-sm text-neutral-300">{label}</span>
                  <Badge tone={String(tone)}>{String(value)}</Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="font-bricolage text-xl font-bold text-white">Provas e exports</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-500">Use os hashes Stellar e detalhes do pagamento como trilha de auditoria do MVP.</p>
            <div className="mt-5 grid gap-3">
              <Link to="/payments" className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 text-sm font-bold text-white hover:bg-white/10">
                Abrir pagamentos
                <Icon icon="solar:arrow-right-linear" />
              </Link>
              <Link to="/webhooks" className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 text-sm font-bold text-white hover:bg-white/10">
                Ver entregas de webhook
                <Icon icon="solar:arrow-right-linear" />
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
