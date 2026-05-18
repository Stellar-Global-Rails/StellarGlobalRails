import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { WorkspaceContextBanner } from '@/components/WorkspaceContextBanner';
import { useAuthStore, useUIStore } from '@/stores';

const hostFromUrl = (value: string) => {
  if (value === 'nao configurado') {
    return value;
  }

  try {
    return new URL(value).host;
  } catch {
    return value;
  }
};

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const environment = useUIStore((state) => state.environment);
  const apiUrl = import.meta.env.VITE_KIVO_API_URL || 'nao configurado';
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'nao configurado';
  const apiHost = hostFromUrl(apiUrl);
  const supabaseHost = hostFromUrl(supabaseUrl);

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Workspace" title="Configuracoes" icon="solar:settings-bold-duotone" description="Conta, ambiente e conexoes usadas pelo Kivo." />
      <WorkspaceContextBanner
        eyebrow="Ambiente conectado"
        title="Ambiente e conexoes do workspace"
        icon="solar:settings-bold-duotone"
        tone="ready"
        description="Use esta tela para conferir se o workspace esta autenticado e conectado antes de publicar um flow."
        checkpoints={['Usuario autenticado', 'Ambiente selecionado', 'Kivo API conectada']}
        primaryAction={{ to: '/team', label: 'Time e escala' }}
        secondaryAction={{ to: '/status', label: 'Status do Kivo' }}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-bricolage text-xl font-bold text-white">Conta do workspace</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4 rounded-xl bg-black/25 p-3"><span className="text-neutral-500">Nome</span><span className="text-right text-white">{user?.name}</span></div>
            <div className="flex justify-between gap-4 rounded-xl bg-black/25 p-3"><span className="text-neutral-500">Email</span><span className="break-all text-right text-white">{user?.email}</span></div>
            <div className="flex justify-between gap-4 rounded-xl bg-black/25 p-3"><span className="text-neutral-500">Workspace</span><span className="text-right text-white">{user?.organization}</span></div>
          </div>
        </Card>
        <Card>
          <h2 className="font-bricolage text-xl font-bold text-white">Ambiente</h2>
          <p className="mt-3 text-sm text-neutral-400">Conexoes usadas para autenticar o workspace, cobrar por uso e liberar recursos pagos.</p>
          <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-300">Ambiente atual: {environment}</div>
          <div className="mt-4 grid gap-3 text-sm">
            <div className="rounded-xl bg-black/25 p-3">
              <p className="text-neutral-500">Kivo API</p>
              <p className="mt-1 break-all text-sm font-semibold text-white">{apiHost}</p>
            </div>
            <div className="rounded-xl bg-black/25 p-3">
              <p className="text-neutral-500">Supabase</p>
              <p className="mt-1 break-all text-sm font-semibold text-white">{supabaseHost}</p>
            </div>
          </div>
          <details className="mt-4 rounded-xl border border-white/10 bg-black/25 p-3 text-sm text-neutral-400">
            <summary className="cursor-pointer font-bold text-neutral-200">Ver detalhes para deploy</summary>
            <div className="mt-3 space-y-3">
              <div>
                <p className="text-neutral-500">Kivo API URL</p>
                <p className="mt-1 break-all font-mono text-xs text-white">{apiUrl}</p>
              </div>
              <div>
                <p className="text-neutral-500">Supabase URL</p>
                <p className="mt-1 break-all font-mono text-xs text-white">{supabaseUrl}</p>
              </div>
            </div>
          </details>
          <Link to="/deploy" className="mt-4 inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-neutral-300 transition-colors hover:bg-white/10 hover:text-white">
            Abrir checklist de deploy
          </Link>
        </Card>
      </div>
    </div>
  );
}
