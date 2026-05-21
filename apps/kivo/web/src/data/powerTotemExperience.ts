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
  name: 'Kivo EV Charge',
  shortName: 'EV Charge',
  status: 'functional',
  resourcePattern: '/power-totem/{totemId}/session',
  icon: 'solar:bolt-circle-bold-duotone',
  defaultName: 'EV Charger Demo',
  defaultPrice: '0.25',
  defaultUnit: 'session',
  defaultDurationSeconds: 120,
  operatorUseCase: 'Operadores que querem vender sessoes curtas de recarga EV em wallboxes, bancadas EVSE ou estacoes locais somente depois de pagamento x402 confirmado.',
  customerPromise: 'O motorista escaneia o QR, paga a sessao e ve a estacao mudar de aguardando pagamento para recarga autorizada.',
  steps: [
    {
      id: 'criar',
      label: 'Criar estacao',
      icon: 'solar:add-circle-bold-duotone',
      description: 'Defina nome, preco e duracao para gerar a sessao protegida da estacao EV.',
    },
    {
      id: 'parear',
      label: 'Provisionar gateway',
      icon: 'solar:link-circle-bold-duotone',
      description: 'Baixe o pacote Docker que cria gatewayId, token, runtime local, banco local e UI da estacao.',
    },
    {
      id: 'qr',
      label: 'Exibir QR',
      icon: 'solar:qr-code-bold-duotone',
      description: 'Abra a tela local para colocar o checkout da recarga na frente do motorista.',
    },
    {
      id: 'testar-x402',
      label: 'Testar x402',
      icon: 'solar:shield-keyhole-bold-duotone',
      description: 'Valide o challenge e o retry pago antes de plugar a operacao real.',
    },
    {
      id: 'liberar-saida',
      label: 'Autorizar recarga',
      icon: 'solar:power-bold-duotone',
      description: 'O gateway consulta autorizacoes e sinaliza o EVSE/OCPP/controlador quando a sessao esta autorizada.',
    },
    {
      id: 'monitorar',
      label: 'Monitorar',
      icon: 'solar:pulse-2-bold-duotone',
      description: 'Acompanhe sessoes, eventos e estado do gateway local durante a operacao.',
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
