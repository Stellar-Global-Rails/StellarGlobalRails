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
    name: 'Power Totem',
    shortName: 'Power Totem',
    availability: 'available',
    status: 'functional',
    isFunctionalHackathonTemplate: true,
    category: 'Template funcional',
    surface: 'hybrid',
    badge: 'Hackathon ready',
    tagline: 'Venda acesso fisico ou digital com checkout x402 e release via Kivo Gateway.',
    description:
      'Um template completo para criar um ponto de energia, bancada, demo presencial, API guard ou recurso pago. No hackathon, a versao funcional foca no totem fisico com Raspberry Pi, tela local e Gateway Docker.',
    outcome:
      'O usuario adquire o template, configura preco e sessao, provisiona um Gateway real e baixa um bundle Docker pronto para rodar perto do recurso.',
    primaryRuntime: 'Raspberry Pi, mini PC ou gateway digital equivalente',
    acquisitionLabel: 'Adquirir template',
    heroPoints: [
      'Checkout x402 com fluxo visivel',
      'Etherfuse/Stellar testnet na validacao',
      'Gateway local com heartbeat, eventos e fila curta',
    ],
    idealFor: [
      'Demos presenciais no Stellar Village',
      'Totens, bancadas, relays e recursos locais',
      'Primeiro produto de cliente final para validar monetizacao M2M/H2M',
    ],
    includes: [
      'Modelo de flow do Power Totem',
      'Config de preco, unidade e duracao da sessao',
      'Download do Gateway Docker depois da configuracao',
      'UI local do totem para Raspberry Pi',
      'Checklist de validacao com x402, Etherfuse e release',
    ],
    requirements: [
      'Conta Kivo autenticada',
      'Supabase Edge Function kivo-api configurada',
      'X402 platform key e Etherfuse Devnet configurados',
      'Docker no Raspberry Pi, mini PC ou ambiente local',
    ],
    architecture: [
      {
        label: 'Template',
        detail: 'Define o produto, preco, unidade, tempo de sessao e regra de liberacao.',
      },
      {
        label: 'Gateway',
        detail: 'Runtime local ou digital que consulta autorizacao, envia heartbeat e publica eventos.',
      },
      {
        label: 'Checkout',
        detail: 'Cria sessao, recebe desafio x402 e registra pagamento antes da liberacao.',
      },
      {
        label: 'Release',
        detail: 'Gateway libera o recurso fisico ou digital e salva evento operacional.',
      },
    ],
    validation: [
      'Criar Power Totem real na API',
      'Gerar bundle Docker com gatewayId e gatewayToken',
      'Rodar runtime local',
      'Executar checkout x402',
      'Confirmar autorizacao e evento de release',
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
    roadmapReason: 'Mantido como futuro para nao abrir escopo antes do Power Totem fechar.',
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
