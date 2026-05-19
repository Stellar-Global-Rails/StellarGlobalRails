export type PersonaId = 'operator' | 'payer' | 'integrator' | 'finance';
export type AccountScaleId = 'solo' | 'team' | 'enterprise';

export interface PersonaJourney {
  id: PersonaId;
  label: string;
  role: string;
  primaryRoute: string;
  icon: string;
  description: string;
  jobs: string[];
  proof: string;
}

export interface AccountScale {
  id: AccountScaleId;
  label: string;
  description: string;
  features: string[];
  mvpStatus: string;
  icon: string;
}

export const personaJourneys: PersonaJourney[] = [
  {
    id: 'operator',
    label: 'Operador',
    role: 'Infra M2M',
    primaryRoute: '/operations',
    icon: 'solar:station-bold-duotone',
    description: 'Controla devices, sites, sessoes, saude operacional e liquidacao dos pagamentos.',
    jobs: ['Cadastrar devices', 'Acompanhar uso em tempo real', 'Resolver falhas de pagamento'],
    proof: 'Mostra que o Kivo opera uma rede real, nao apenas endpoints.',
  },
  {
    id: 'payer',
    label: 'Usuario pagador',
    role: 'Checkout x402',
    primaryRoute: '/checkout',
    icon: 'solar:card-transfer-bold-duotone',
    description: 'Paga por um recurso, recebe confirmacao e desbloqueia acesso com X-PAYMENT.',
    jobs: ['Ver preco e condicao', 'Pagar via Stellar/x402', 'Receber acesso imediatamente'],
    proof: 'Prova a experiencia final de quem consome o servico pago.',
  },
  {
    id: 'integrator',
    label: 'Integrador',
    role: 'Builder/API',
    primaryRoute: '/integrations',
    icon: 'solar:code-square-bold-duotone',
    description: 'Conecta templates, API keys, webhooks, MCP tools e pricing rules em outro produto.',
    jobs: ['Escolher template', 'Gerar credenciais', 'Testar webhooks e MCP'],
    proof: 'Mostra que o Kivo pode ser plugado em produtos de terceiros.',
  },
  {
    id: 'finance',
    label: 'Financeiro',
    role: 'Recebiveis',
    primaryRoute: '/finance',
    icon: 'solar:chart-square-bold-duotone',
    description: 'Acompanha receita, conciliacao, falhas, taxas e provas de liquidacao.',
    jobs: ['Ver volume e status', 'Checar falhas', 'Exportar provas de pagamento'],
    proof: 'Mostra confianca operacional para quem administra dinheiro.',
  },
];

export const accountScales: AccountScale[] = [
  {
    id: 'solo',
    label: 'Solo',
    description: 'Um maker, founder ou dev consegue operar, integrar e testar pagamentos sozinho.',
    features: ['Workspace pessoal', 'Todas as funcoes liberadas', 'Onboarding curto'],
    mvpStatus: 'Implementar como experiencia padrao',
    icon: 'solar:user-id-bold-duotone',
  },
  {
    id: 'team',
    label: 'Pequena equipe',
    description: 'Times de 2 a 10 pessoas dividem operacao, integracao, financeiro e administracao.',
    features: ['Roles simples', 'Convites', 'Audit trail leve'],
    mvpStatus: 'Mostrar roles e readiness visual',
    icon: 'solar:users-group-rounded-bold-duotone',
  },
  {
    id: 'enterprise',
    label: 'Operacao grande',
    description: 'Empresas com multiplos sites, ambientes, times e demandas de governanca.',
    features: ['Multi-site', 'Ambientes testnet/mainnet', 'RBAC futuro'],
    mvpStatus: 'Sinalizar readiness, sem RBAC granular no MVP',
    icon: 'solar:buildings-3-bold-duotone',
  },
];

export const workspaceRoles = [
  { label: 'Owner', description: 'Configura workspace, billing, ambientes e membros.', icon: 'solar:crown-bold-duotone' },
  { label: 'Operator', description: 'Cuida de devices, sessoes, status e incidentes.', icon: 'solar:settings-minimalistic-bold-duotone' },
  { label: 'Developer', description: 'Gerencia API keys, webhooks, templates, MCP e x402.', icon: 'solar:code-bold-duotone' },
  { label: 'Finance', description: 'Acompanha receita, liquidacao, taxas e conciliacao.', icon: 'solar:bill-list-bold-duotone' },
];
