export type TemplateAvailability = 'available' | 'soon';
export type TemplateStatus = 'functional' | 'planned' | 'research';
export type TemplateSurface = 'physical' | 'digital' | 'hybrid';

export interface KivoTemplateCatalogItem {
  id: string;
  name: string;
  shortName: string;
  availability: TemplateAvailability;
  status: TemplateStatus;
  isFunctionalHackathonTemplate: boolean;
  category: string;
  surface: TemplateSurface;
  badge: string;
  tagline: string;
  description: string;
  outcome: string;
  primaryRuntime: string;
  acquisitionLabel: string;
  heroPoints: string[];
  idealFor: string[];
  includes: string[];
  requirements: string[];
  architecture: Array<{
    label: string;
    detail: string;
  }>;
  validation: string[];
  roadmapReason?: string;
}

export const templateCatalog: KivoTemplateCatalogItem[] = [
  {
    id: 'power-totem',
    name: 'Kivo EV Charge',
    shortName: 'EV Charge',
    availability: 'available',
    status: 'functional',
    isFunctionalHackathonTemplate: true,
    category: 'Recarga EV funcional',
    surface: 'hybrid',
    badge: 'EV ready',
    tagline: 'Venda sessoes de recarga eletrica com checkout x402 e autorizacao via Kivo Gateway.',
    description:
      'Um template completo para transformar uma estacao AC, wallbox ou bancada EVSE em um ponto de recarga pay-per-use. A versao funcional usa Raspberry Pi ou mini PC com tela local, Gateway Docker e autorizacao Kivo antes de liberar a sessao no controlador seguro.',
    outcome:
      'O operador configura preco e duracao, provisiona um gateway local e baixa um bundle Docker pronto para rodar perto da estacao de recarga.',
    primaryRuntime: 'Raspberry Pi, mini PC ou edge gateway junto ao EVSE',
    acquisitionLabel: 'Adquirir EV Charge',
    heroPoints: [
      'QR checkout na tela da estacao',
      'x402 + Stellar/Etherfuse antes da sessao',
      'Gateway local com heartbeat, autorizacao e eventos',
    ],
    idealFor: [
      'Operadores de estacionamentos, condominios e hospitality',
      'Prototipos com OpenEVSE, OCPP wallbox ou controlador EVSE',
      'Demos presenciais com Raspberry Pi, tela e case de produto',
    ],
    includes: [
      'Modelo de flow Kivo EV Charge',
      'Config de preco, duracao e regra de autorizacao da recarga',
      'Download do Gateway Docker depois da configuracao',
      'UI local para tela da estacao ou quiosque',
      'Checklist de validacao com x402, Stellar, Etherfuse e gateway',
    ],
    requirements: [
      'Conta Kivo autenticada',
      'Supabase Edge Function kivo-api configurada',
      'X402 platform key e Etherfuse Devnet configurados',
      'Docker no Raspberry Pi, mini PC ou ambiente local',
      'EVSE, OCPP wallbox ou controlador seguro para a parte eletrica',
    ],
    architecture: [
      {
        label: 'Estacao',
        detail: 'Tela local mostra QR, preco, duracao e estado da sessao de recarga.',
      },
      {
        label: 'Gateway',
        detail: 'Runtime local consulta autorizacao, envia heartbeat e conversa com EVSE/OCPP/controlador.',
      },
      {
        label: 'Checkout',
        detail: 'Cria sessao, recebe desafio x402 e registra pagamento Stellar antes da autorizacao.',
      },
      {
        label: 'Recarga',
        detail: 'Kivo autoriza a sessao; o controlador eletrico seguro decide a energizacao fisica.',
      },
    ],
    validation: [
      'Criar estacao EV Charge real na API',
      'Gerar bundle Docker com gatewayId e gatewayToken',
      'Rodar runtime local',
      'Executar checkout x402',
      'Confirmar autorizacao e evento de sessao de recarga',
    ],
  },
  {
    id: 'api-toll',
    name: 'API Toll',
    shortName: 'API Toll',
    availability: 'soon',
    status: 'planned',
    isFunctionalHackathonTemplate: false,
    category: 'Gateway digital',
    surface: 'digital',
    badge: 'Em breve',
    tagline: 'Cobrar endpoints, datasets ou automacoes por chamada.',
    description:
      'Um gateway digital para proteger rotas premium, cobrar antes de encaminhar a request e registrar consumo por API key, agente ou cliente.',
    outcome: 'Depois do hackathon, este template deve virar um proxy/API guard instalavel.',
    primaryRuntime: 'Proxy, middleware, sidecar ou serverless function',
    acquisitionLabel: 'Em breve',
    heroPoints: ['API guard', 'Pricing por chamada', 'Logs por consumidor'],
    idealFor: ['APIs premium', 'Dados sob demanda', 'Ferramentas internas pagas por uso'],
    includes: ['Modelo de pricing por endpoint', 'Adapter HTTP', 'Eventos de consumo'],
    requirements: ['Gateway digital', 'SDK TypeScript', 'Validacao x402'],
    architecture: [
      { label: 'Guard', detail: 'Intercepta a request e exige pagamento.' },
      { label: 'Origin', detail: 'Recebe a chamada apenas depois da autorizacao.' },
    ],
    validation: ['Validar x402 por request', 'Medir latencia', 'Criar logs de consumo'],
    roadmapReason: 'Fica no marketplace futuro para nao vender runtime que ainda nao esta fechado.',
  },
  {
    id: 'agent-tool-paywall',
    name: 'Agent Tool Paywall',
    shortName: 'Agent Tools',
    availability: 'soon',
    status: 'research',
    isFunctionalHackathonTemplate: false,
    category: 'AI agents',
    surface: 'digital',
    badge: 'Em breve',
    tagline: 'Ferramentas de agentes pagas por execucao.',
    description:
      'Template para expor tools, compute ou dados premium para agentes, exigindo pagamento antes de executar a acao.',
    outcome: 'Depois do MVP, deve ser usado no Kivo Studio para criar solucao customizada com agents.',
    primaryRuntime: 'Worker, MCP server, API guard ou plugin',
    acquisitionLabel: 'Em breve',
    heroPoints: ['Tools monetizadas', 'Execucao auditavel', 'Orcamento por agente'],
    idealFor: ['Ferramentas de IA', 'Compute sob demanda', 'Dados premium para agentes'],
    includes: ['Tool contract', 'Adapter SDK', 'Eventos por execucao'],
    requirements: ['SDK TypeScript', 'Runtime digital', 'Politica de budget'],
    architecture: [
      { label: 'Agent', detail: 'Solicita uma tool paga.' },
      { label: 'Tool guard', detail: 'Exige x402 antes de executar.' },
    ],
    validation: ['Criar tool demo', 'Executar pagamento', 'Retornar output auditado'],
    roadmapReason: 'Vai depender do Studio com agents mais completo depois do hackathon.',
  },
  {
    id: 'iot-data-marketplace',
    name: 'IoT Data Marketplace',
    shortName: 'IoT Data',
    availability: 'soon',
    status: 'planned',
    isFunctionalHackathonTemplate: false,
    category: 'Dados IoT',
    surface: 'hybrid',
    badge: 'Em breve',
    tagline: 'Feeds de sensores pagos por leitura, lote ou assinatura.',
    description:
      'Template para monetizar leituras de sensores, telemetria e dados de campo com Gateway local e entrega digital.',
    outcome: 'Depois do MVP, deve conectar dispositivos reais a um feed pago com retries offline.',
    primaryRuntime: 'Edge device + API de entrega',
    acquisitionLabel: 'Em breve',
    heroPoints: ['Sensor feed', 'Fila offline curta', 'Pagamento por leitura'],
    idealFor: ['Sensores de energia', 'Dados ambientais', 'Telemetria local'],
    includes: ['Adapter de sensor', 'Modelo de consumo', 'Entrega por API'],
    requirements: ['Gateway edge', 'Fonte de dados local', 'Endpoint de entrega'],
    architecture: [
      { label: 'Sensor', detail: 'Produz leituras locais.' },
      { label: 'Feed API', detail: 'Entrega dados somente apos autorizacao.' },
    ],
    validation: ['Coletar leitura real', 'Cobrar acesso', 'Registrar entrega'],
    roadmapReason: 'Mantido como futuro para nao abrir escopo antes do EV Charge fechar.',
  },
  {
    id: 'compute-meter',
    name: 'Compute Meter',
    shortName: 'Compute',
    availability: 'soon',
    status: 'planned',
    isFunctionalHackathonTemplate: false,
    category: 'Edge compute',
    surface: 'hybrid',
    badge: 'Em breve',
    tagline: 'Cobrar jobs locais, inferencia, automacoes ou tarefas por execucao.',
    description:
      'Template para liberar computacao local ou cloud depois de um pagamento, com eventos por job e retry operacional.',
    outcome: 'Depois do hackathon, vira um worker pago plugavel no Gateway.',
    primaryRuntime: 'Worker, sidecar ou edge device',
    acquisitionLabel: 'Em breve',
    heroPoints: ['Jobs pagos', 'Eventos de execucao', 'Controle de custo'],
    idealFor: ['Inferencia local', 'Automacoes caras', 'Batch jobs premium'],
    includes: ['Worker adapter', 'Pricing por job', 'Checklist de execucao'],
    requirements: ['Runtime worker', 'SDK TypeScript', 'Fila operacional'],
    architecture: [
      { label: 'Job', detail: 'Recebe uma tarefa candidata.' },
      { label: 'Meter', detail: 'Cobra e libera a execucao.' },
    ],
    validation: ['Criar job real', 'Cobrar execucao', 'Registrar output'],
    roadmapReason: 'Roadmap para depois da API e SDK estarem estaveis.',
  },
];

export const communityTemplates: KivoTemplateCatalogItem[] = [];

export const getTemplateById = (templateId: string) =>
  templateCatalog.find((template) => template.id === templateId) ?? null;

export const getAvailableTemplates = () =>
  templateCatalog.filter((template) => template.isFunctionalHackathonTemplate);

export const getComingSoonTemplates = () =>
  templateCatalog.filter((template) => template.availability === 'soon');

export const getOwnedTemplates = (templateIds: string[]) =>
  templateIds
    .map((templateId) => getTemplateById(templateId))
    .filter((template): template is KivoTemplateCatalogItem => Boolean(template));
