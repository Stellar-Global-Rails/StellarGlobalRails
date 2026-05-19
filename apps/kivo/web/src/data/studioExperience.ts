import type {
  KivoGatewayMode,
  KivoSolutionSurface,
  KivoStudioAgentId,
  StudioTemplateSummary,
} from '@/types/kivo';

export interface StudioAgentCard {
  id: KivoStudioAgentId;
  name: string;
  role: string;
  output: string;
}

export interface GatewayModeCard {
  id: KivoGatewayMode;
  label: string;
  surface: KivoSolutionSurface;
  bestFor: string;
  runtime: string;
}

export interface StudioStep {
  id: 'describe' | 'gateway' | 'flow' | 'sdk' | 'validate' | 'launch';
  label: string;
  description: string;
}

export const studioAgents: StudioAgentCard[] = [
  {
    id: 'discovery',
    name: 'Discovery Agent',
    role: 'Entende o recurso que o usuario quer monetizar ou controlar.',
    output: 'Resumo do caso, superficie fisica/digital/hibrida e modelo H2M/M2M/A2M.',
  },
  {
    id: 'flow_architect',
    name: 'Flow Architect Agent',
    role: 'Transforma a intencao em regra de acesso, preco, eventos e fallback.',
    output: 'Flow executavel com politica de liberacao.',
  },
  {
    id: 'gateway',
    name: 'Gateway Agent',
    role: 'Escolhe como o Gateway roda perto do recurso.',
    output: 'Config para Raspberry, edge, proxy, middleware, worker, API guard ou serverless.',
  },
  {
    id: 'sdk',
    name: 'SDK Agent',
    role: 'Gera integracao TypeScript para o caso de uso.',
    output: 'Snippets, adapters, exemplos e testes.',
  },
  {
    id: 'validation',
    name: 'Validation Agent',
    role: 'Executa a validacao testnet com x402 e Etherfuse.',
    output: 'Checklist real com estados pendentes, falhas e evidencias.',
  },
  {
    id: 'launch',
    name: 'Launch Agent',
    role: 'Prepara publicacao privada em mainnet ou template publico.',
    output: 'Opcao de billing privado, manter testnet ou publicar template.',
  },
];

export const gatewayModes: GatewayModeCard[] = [
  {
    id: 'raspberry',
    label: 'Raspberry Pi',
    surface: 'physical',
    bestFor: 'Totens, relays, sensores e prototipos presenciais.',
    runtime: 'Node.js local com token de Gateway e adaptador de hardware.',
  },
  {
    id: 'edge_device',
    label: 'Edge device',
    surface: 'physical',
    bestFor: 'Controladores locais proximos ao recurso.',
    runtime: 'Processo persistente com heartbeat, authorization polling e eventos.',
  },
  {
    id: 'physical_totem',
    label: 'Totem fisico',
    surface: 'physical',
    bestFor: 'Experiencias presenciais com tela, QR e atuador.',
    runtime: 'Gateway local + display + relay ou saida segura.',
  },
  {
    id: 'proxy',
    label: 'Proxy',
    surface: 'digital',
    bestFor: 'APIs existentes que precisam cobrar por acesso.',
    runtime: 'Proxy HTTP que exige X-PAYMENT antes de encaminhar.',
  },
  {
    id: 'middleware',
    label: 'Middleware',
    surface: 'digital',
    bestFor: 'Apps Node/Edge com controle no request pipeline.',
    runtime: 'Middleware que valida challenge e payment header.',
  },
  {
    id: 'sidecar',
    label: 'Sidecar',
    surface: 'digital',
    bestFor: 'Servicos que nao devem receber logica de cobranca diretamente.',
    runtime: 'Processo adjacente que guarda a politica de acesso.',
  },
  {
    id: 'worker',
    label: 'Worker',
    surface: 'digital',
    bestFor: 'Jobs, filas e automacoes pagos por execucao.',
    runtime: 'Worker que confirma pagamento antes de executar job.',
  },
  {
    id: 'api_guard',
    label: 'API guard',
    surface: 'digital',
    bestFor: 'Endpoints premium, dados e ferramentas de agentes.',
    runtime: 'Guard tipado usando SDK TypeScript.',
  },
  {
    id: 'plugin',
    label: 'Plugin',
    surface: 'digital',
    bestFor: 'Produtos que querem distribuir cobranca como extensao.',
    runtime: 'Pacote integravel no host do usuario.',
  },
  {
    id: 'serverless_function',
    label: 'Serverless function',
    surface: 'digital',
    bestFor: 'Funcoes pagas por chamada sem servidor dedicado.',
    runtime: 'Function que valida x402 antes de retornar resposta.',
  },
];

export const studioSteps: StudioStep[] = [
  {
    id: 'describe',
    label: 'Descrever',
    description: 'O usuario explica o que quer monetizar ou controlar em linguagem natural.',
  },
  {
    id: 'gateway',
    label: 'Escolher Gateway',
    description: 'O Studio recomenda execucao fisica, digital ou hibrida.',
  },
  {
    id: 'flow',
    label: 'Gerar flow',
    description: 'O Studio cria regra de acesso, preco, eventos, fallback e checklist.',
  },
  {
    id: 'sdk',
    label: 'Receber SDK/config',
    description: 'O usuario recebe pacote TypeScript, snippets, adapters e testes.',
  },
  {
    id: 'validate',
    label: 'Validar testnet',
    description: 'A validacao mostra x402, Etherfuse e Gateway com estados reais.',
  },
  {
    id: 'launch',
    label: 'Publicar',
    description: 'O usuario escolhe mainnet privada paga, testnet ou template publico.',
  },
];

export const studioTemplates: StudioTemplateSummary[] = [
  {
    id: 'power-totem',
    name: 'Power Totem',
    status: 'functional',
    description: 'Template funcional do hackathon para liberar um recurso fisico via Gateway.',
    surface: 'physical',
    isFunctionalHackathonTemplate: true,
  },
  {
    id: 'api-toll',
    name: 'API Toll',
    status: 'planned',
    description: 'Gateway digital para cobrar acesso a endpoints, dados ou automacoes.',
    surface: 'digital',
    isFunctionalHackathonTemplate: false,
  },
  {
    id: 'agent-tool-paywall',
    name: 'Agent Tool Paywall',
    status: 'research',
    description: 'Agentes autonomos pagando por ferramentas, compute ou dados premium.',
    surface: 'digital',
    isFunctionalHackathonTemplate: false,
  },
  {
    id: 'iot-data-marketplace',
    name: 'IoT Data Marketplace',
    status: 'planned',
    description: 'Feeds de sensores e leituras pagos por pacote, leitura ou assinatura.',
    surface: 'hybrid',
    isFunctionalHackathonTemplate: false,
  },
];
