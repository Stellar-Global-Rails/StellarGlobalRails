export type PowerTotemExperienceStatus = 'functional' | 'roadmap';

export interface PowerTotemStep {
  id: string;
  label: string;
  description: string;
  icon: string;
}

export interface PowerTotemExperienceTemplate {
  id: string;
  name: string;
  shortName: string;
  status: PowerTotemExperienceStatus;
  resourcePattern: string;
  icon: string;
  defaultName: string;
  defaultPrice: string;
  defaultUnit: 'session' | 'minute' | 'kWh';
  defaultDurationSeconds: number;
  operatorUseCase: string;
  customerPromise: string;
  steps: PowerTotemStep[];
}

export const powerTotemTemplate: PowerTotemExperienceTemplate = {
  id: 'power-totem',
  name: 'Power Totem',
  shortName: 'Totem de energia',
  status: 'functional',
  resourcePattern: '/power-totem/{totemId}/session',
  icon: 'solar:bolt-circle-bold-duotone',
  defaultName: 'Totem de bancada',
  defaultPrice: '0.50',
  defaultUnit: 'session',
  defaultDurationSeconds: 30,
  operatorUseCase: 'Operadores que precisam liberar energia, recarga ou um rele fisico somente depois de pagamento x402 confirmado.',
  customerPromise: 'O cliente escaneia o QR, paga a sessao e ve o estado mudar de bloqueado para liberado.',
  steps: [
    {
      id: 'criar',
      label: 'Criar totem',
      icon: 'solar:add-circle-bold-duotone',
      description: 'Defina nome, preco, unidade e duracao da sessao para gerar o recurso protegido.',
    },
    {
      id: 'parear',
      label: 'Parear gateway',
      icon: 'solar:link-circle-bold-duotone',
      description: 'Emita um token de uso unico para o gateway que fala com o hardware ou simulador.',
    },
    {
      id: 'qr',
      label: 'Exibir QR',
      icon: 'solar:qr-code-bold-duotone',
      description: 'Abra a tela de display para colocar o recurso pago na frente do cliente.',
    },
    {
      id: 'testar-x402',
      label: 'Testar x402',
      icon: 'solar:shield-keyhole-bold-duotone',
      description: 'Valide o challenge e o retry pago antes de plugar a operacao real.',
    },
    {
      id: 'liberar-saida',
      label: 'Liberar saida',
      icon: 'solar:power-bold-duotone',
      description: 'O gateway consulta autorizacoes e aciona a saida quando a sessao esta autorizada.',
    },
    {
      id: 'monitorar',
      label: 'Monitorar',
      icon: 'solar:pulse-2-bold-duotone',
      description: 'Acompanhe sessoes, eventos e estado do gateway durante a demo.',
    },
  ],
};

export const futurePowerTotemTemplates = [
  {
    id: 'api-toll',
    name: 'API Toll',
    status: 'roadmap',
    icon: 'solar:code-square-bold-duotone',
    description: 'Cobrar por rota HTTP premium com limite, assinatura e analytics por chamada.',
  },
  {
    id: 'data-gate',
    name: 'Data Gate',
    status: 'roadmap',
    icon: 'solar:database-bold-duotone',
    description: 'Liberar feeds de telemetria, sensores e datasets depois da prova de pagamento.',
  },
  {
    id: 'agent-tool-paywall',
    name: 'Agent Tool Paywall',
    status: 'roadmap',
    icon: 'solar:cpu-bolt-bold-duotone',
    description: 'Exigir pagamento para uma ferramenta MCP ou acao de agente antes da execucao.',
  },
  {
    id: 'device-command',
    name: 'Device Command',
    status: 'roadmap',
    icon: 'solar:remote-controller-bold-duotone',
    description: 'Cobrar por comandos remotos como abrir, travar, reiniciar ou aplicar pulso.',
  },
  {
    id: 'compute-meter',
    name: 'Compute Meter',
    status: 'roadmap',
    icon: 'solar:server-square-cloud-bold-duotone',
    description: 'Medir tempo de CPU, inferencia ou job assinado antes de entregar resultado.',
  },
  {
    id: 'storage-unlock',
    name: 'Storage Unlock',
    status: 'roadmap',
    icon: 'solar:lock-keyhole-bold-duotone',
    description: 'Desbloquear arquivo, bundle ou conteudo privado com comprovante x402.',
  },
  {
    id: 'automation-trigger',
    name: 'Automation Trigger',
    status: 'roadmap',
    icon: 'solar:bolt-bold-duotone',
    description: 'Disparar automacoes pagas com auditoria de pagamento e evento operacional.',
  },
  {
    id: 'private-flow-template',
    name: 'Private Flow Template',
    status: 'roadmap',
    icon: 'solar:shield-user-bold-duotone',
    description: 'Criar templates internos por workspace para fluxos privados de monetizacao.',
  },
] satisfies Array<{
  id: string;
  name: string;
  status: 'roadmap';
  icon: string;
  description: string;
}>;

export const powerTotemStudioChecklist = powerTotemTemplate.steps;
