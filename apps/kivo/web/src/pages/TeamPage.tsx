import { Icon } from '@iconify/react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { accountScales, workspaceRoles } from '@/data/workspaceExperience';
import { useAuthStore } from '@/stores';

export default function TeamPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Workspace"
        title="Conta, time e escala"
        icon="solar:users-group-rounded-bold-duotone"
        description="O Kivo precisa funcionar para usuario unico, pequenas equipes e operacoes maiores sem mudar de produto."
      />

      <Card>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-400">Workspace atual</p>
            <h2 className="mt-2 font-bricolage text-2xl font-bold text-white">{user?.organization?.trim() || 'Kivo workspace'}</h2>
            <p className="mt-2 text-sm text-neutral-500">{user?.email ?? 'usuario autenticado'} - modo testnet ativo</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/5 bg-black/25 p-4">
              <p className="text-xs text-neutral-500">Plano MVP</p>
              <p className="mt-2 font-bold text-white">Workspace-first</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-black/25 p-4">
              <p className="text-xs text-neutral-500">Ambiente</p>
              <p className="mt-2 font-bold text-white">Testnet</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-black/25 p-4">
              <p className="text-xs text-neutral-500">Governanca</p>
              <p className="mt-2 font-bold text-white">Roles simples</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-3">
        {accountScales.map((scale) => (
          <Card key={scale.id} className="relative overflow-hidden">
            <Icon icon={scale.icon} className="absolute -bottom-8 -right-6 text-[8rem] text-white/[0.03]" />
            <div className="relative z-10">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                  <Icon icon={scale.icon} className="text-2xl" />
                </div>
                <Badge tone={scale.id === 'solo' ? 'ready' : 'planned'}>{scale.id === 'solo' ? 'MVP' : 'readiness'}</Badge>
              </div>
              <h2 className="mt-5 font-bricolage text-xl font-bold text-white">{scale.label}</h2>
              <p className="mt-3 text-sm leading-6 text-neutral-400">{scale.description}</p>
              <div className="mt-5 space-y-2">
                {scale.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-xs text-neutral-300">
                    <Icon icon="solar:check-circle-bold" className="text-emerald-400" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <p className="mt-5 rounded-xl border border-white/10 bg-black/30 p-3 text-xs leading-5 text-neutral-500">{scale.mvpStatus}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <h2 className="font-bricolage text-xl font-bold text-white">Roles do MVP</h2>
          <p className="mt-1 text-sm text-neutral-500">Suficiente para pequenas equipes sem entrar em RBAC granular.</p>
          <div className="mt-5 space-y-3">
            {workspaceRoles.map((role) => (
              <div key={role.label} className="rounded-2xl border border-white/5 bg-black/25 p-4">
                <div className="flex items-center gap-3">
                  <Icon icon={role.icon} className="text-2xl text-emerald-400" />
                  <h3 className="font-bold text-white">{role.label}</h3>
                </div>
                <p className="mt-2 text-sm leading-6 text-neutral-500">{role.description}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-bricolage text-xl font-bold text-white">Como isso aparece para o usuario</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {[
              ['Solo', 'A pessoa entra direto no workspace e ve todas as jornadas.'],
              ['Equipe pequena', 'A home destaca funcoes por papel: operar, integrar, financeiro.'],
              ['Operacao grande', 'A UI mostra readiness para sites, ambientes e auditoria.'],
              ['Console avancado', 'Ferramentas tecnicas ficam acessiveis sem dominar a primeira tela.'],
            ].map(([title, description]) => (
              <div key={title} className="rounded-2xl border border-white/5 bg-black/25 p-4">
                <h3 className="font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-500">{description}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
