// ============================================================
// Stellar Global Rails — Product Suite Data
// 3 Core Products with integrated features (ex-modules)
// ============================================================

export interface AIAgent {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  icon: string;
  originModule: string;
}

export interface Product {
  id: string;
  path: string;
  icon: string;
  color: string;
  gradient: string;
  name: string;
  tagline: string;
  hero: {
    title: string;
    subtitle: string;
    ctas: string[];
  };
  problem: {
    title: string;
    items: string[];
  };
  solution: {
    title: string;
    description: string;
  };
  responsibilities: string[];
  aiAgents: AIAgent[];
  features: Feature[];
  differentials: string[];
  steps: string[];
  forWhom: string[];
  benefits: {
    icon: string;
    title: string;
    description: string;
  }[];
  techDetails: {
    description: string;
    points: string[];
  };
  faq: {
    question: string;
    answer: string;
  }[];
  finalCta: string;
  apiSnippet?: {
    method: string;
    endpoint: string;
    body: string;
  };
}

// ============================================================
// PRODUCT 1: SocialPay — Identidade & Interface Social
// ============================================================

const socialPay: Product = {
  id: "socialpay",
  path: "/products/socialpay",
  icon: "solar:users-group-rounded-linear",
  color: "#EC4899",
  gradient: "from-pink-500 to-rose-600",
  name: "SocialPay",
  tagline: "Onde a economia ganha um rosto humano.",
  hero: {
    title: "A porta de entrada humana para o ecossistema Web3.",
    subtitle: "Identidades digitais verificáveis, transações via @handle e um feed auditável. O SocialPay resolve a complexidade da blockchain com uma interface intuitiva e social.",
    ctas: ["Criar identidade", "Ver como funciona"]
  },
  problem: {
    title: "Blockchain ainda é complexa demais para as pessoas.",
    items: [
      "Endereços alfanuméricos impossíveis de memorizar",
      "Nenhuma camada de identidade verificável",
      "Zero interação social entre partes de uma transação",
      "Dados sensíveis expostos sem controle do usuário"
    ]
  },
  solution: {
    title: "Uma rede social financeira com identidade on-chain.",
    description: "O SocialPay cria identidades verificáveis, facilita transações via @handle e mantém um feed auditável. É a blockchain com cara de app — sem chaves expostas, sem complexidade."
  },
  responsibilities: [
    "Identidade Digital: Criação e gestão de identidades verificáveis para usuários e empresas",
    "Interação Social: Comunicação e transação entre partes de forma amigável via @handles",
    "Conexão com ONYX: Integração com compliance para garantir conformidade",
    "Casos de Uso: Saúde 360 Wallet (gestão privada de dados de saúde) e mais"
  ],
  aiAgents: [
    {
      id: "identity",
      title: "Agente de Identidade Digital",
      description: "IA para validar documentos, detectar fraudes e garantir conformidade regulatória em tempo real.",
      icon: "solar:shield-user-linear"
    },
    {
      id: "engagement",
      title: "Agente de Engajamento Social",
      description: "IA que sugere conexões, interações e campanhas de engajamento baseadas em comportamento do usuário.",
      icon: "solar:chat-round-dots-linear"
    },
    {
      id: "health",
      title: "Agente de Saúde Digital",
      description: "IA que interpreta dados de carteiras de saúde (Saúde 360 Wallet) e sugere alertas ou recomendações personalizadas.",
      icon: "solar:heart-pulse-2-linear"
    }
  ],
  features: [
    {
      id: "data-vault",
      name: "Cofre de Dados Privados",
      description: "Gestão de dados sensíveis com criptografia ponta a ponta. Você decide quem acessa seus dados de saúde e pode monetizá-los — quando um laboratório compra acesso, os fundos são transferidos automaticamente.",
      icon: "solar:health-linear",
      originModule: "Saúde 360"
    },
    {
      id: "community-marketplace",
      name: "Community Marketplace",
      description: "Infraestrutura para marketplaces sociais e p2p. Compre e venda serviços ou produtos digitais diretamente via @handle, com reputação on-chain e feed de transações sociais.",
      icon: "solar:shop-2-linear",
      originModule: "Stellar Marketplace"
    },
    {
      id: "p2p-split",
      name: "Split de Pagamento Social",
      description: "Divida contas com amigos instantaneamente. O motor de split roteia automaticamente as transações, calcula a cota de cada um e liquida diretamente no ledger sem fricção.",
      icon: "solar:pie-chart-2-linear",
      originModule: "Payments"
    },
    {
      id: "reputation-score",
      name: "Score de Reputação On-chain",
      description: "Construa seu trust score baseado nas suas conexões sociais e histórico de transações. Um score verificável e inalterável que abre portas para crédito global sem intermediários.",
      icon: "solar:star-fall-linear",
      originModule: "Trust Engine"
    }
  ],
  differentials: [
    "Identidade digital verificável via DID (Decentralized Identifier)",
    "UX simplificada para Web3 — zero chaves expostas",
    "Feed auditável com cada transação rastreável",
    "Monetização de dados pessoais com consentimento explícito"
  ],
  steps: [
    "Crie seu @handle verificável em segundos",
    "Defina seu perfil e permissões de dados",
    "Conecte-se com outros usuários via @handle",
    "Transacione, doe ou receba pagamentos sociais",
    "Acompanhe tudo em um feed auditável em tempo real"
  ],
  forWhom: [
    "Usuários que querem transacionar sem complexidade de blockchain",
    "Pacientes que querem controle e monetização dos seus dados de saúde",
    "Comunidades e coletivos com necessidade de identidade verificável"
  ],
  benefits: [
    { icon: "lucide:fingerprint", title: "Identidade Verificável", description: "Seu @handle é sua identidade digital, verificável on-chain e reconhecida globalmente." },
    { icon: "lucide:shield-check", title: "Privacidade com Controle", description: "Dados cifrados ponta a ponta. A blockchain guarda apenas as chaves de posse, nunca os dados." },
    { icon: "lucide:coins", title: "Monetização de Dados", description: "Pesquisadores pagam em USDC pelo acesso consentido aos seus dados. Você recebe diretamente." }
  ],
  techDetails: {
    description: "O SocialPay combina Identidade Descentralizada (DID) com criptografia Zero-Trust e tokens de permissão on-chain para criar uma camada social segura sobre a Stellar.",
    points: [
      "Decentralized Identity (DID) com resolução on-chain",
      "Criptografia ponta a ponta para dados sensíveis",
      "Tokens de permissão revogáveis via smart contract Soroban",
      "Feed de atividades em tempo real via Horizon API"
    ]
  },
  faq: [
    { question: "Preciso entender de blockchain para usar?", answer: "Não. A experiência é idêntica a um app social comum. Chaves, transações e tokens são totalmente abstraídos." },
    { question: "Meus dados de saúde ficam na blockchain?", answer: "Nunca. Os dados ficam cifrados na nuvem. A blockchain guarda apenas as chaves de posse e consentimento." },
    { question: "Como funciona a monetização dos dados?", answer: "Quando um pesquisador solicita acesso, você aprova ou recusa. Se aprovar, o pagamento em USDC é automático via Kivo Pay." }
  ],
  finalCta: "Criar minha identidade digital",
  apiSnippet: {
    method: "POST",
    endpoint: "/v1/social/identity/create",
    body: '{"handle": "lucas.vital", "did_method": "stellar"}'
  }
};

// ============================================================
// PRODUCT 2: ContractEase — Inteligência Jurídica & RWA
// ============================================================

const contractEase: Product = {
  id: "contractease",
  path: "/products/contractease",
  icon: "solar:document-text-linear",
  color: "#8B5CF6",
  gradient: "from-violet-500 to-purple-700",
  name: "ContractEase",
  tagline: "Onde os acordos se tornam imutáveis e inteligentes.",
  hero: {
    title: "Gestão inteligente de contratos B2B com IA Jurídica.",
    subtitle: "Do rascunho à assinatura imutável. IA que valida conformidade por jurisdição, wizard de criação e registro permanente na Stellar. Segurança Enterprise com workspaces multi-tenant.",
    ctas: ["Acessar plataforma", "Verificar documento"]
  },
  problem: {
    title: "Contratos B2B ainda dependem de processos manuais e ferramentas fragmentadas.",
    items: [
      "Falta de isolamento de dados entre diferentes empresas",
      "Assinaturas digitais comuns são fáceis de fraudar",
      "Validação legal manual por jurisdição — lenta e cara",
      "Sem integração nativa com fluxos de pagamento e escrow"
    ]
  },
  solution: {
    title: "O ciclo de vida completo do contrato, protegido por IA e blockchain.",
    description: "Crie contratos via wizard ou importe PDFs/DOCs. A IA Jurisdicional valida automaticamente a conformidade legal. Quando assinado, o hash criptográfico é registrado para sempre na Stellar. Escrow programável libera pagamentos automaticamente ao cumprir marcos contratuais."
  },
  responsibilities: [
    "Assinatura e Gestão Multiformato: Suporte completo para PDF, DOC e criação via wizard ou templates",
    "IA Jurisdicional: Validação automática de conformidade legal por país",
    "Gestão de Contratos inteligentes registrados na Stellar",
    "Segurança Enterprise: Workspaces multi-tenant, Magic Link, 2FA e RLS",
    "Imutabilidade: Blockchain Stellar para integridade e auditabilidade",
    "Provas ZKP: Protocolo 25 da Stellar para validação sem exposição de dados"
  ],
  aiAgents: [
    {
      id: "ia-juridica",
      title: "IA Jurídica (Jurisdicional)",
      description: "Validação automática de conformidade legal de documentos e cláusulas com a jurisdição de um país selecionado, garantindo conformidade global.",
      icon: "solar:document-text-linear"
    },
    {
      id: "ia-negociacao",
      title: "Agente de Negociação Autônoma",
      description: "IA que analisa modificações contratuais e gera contrapropostas instantâneas baseadas nos limites legais e de risco da empresa.",
      icon: "solar:diploma-verified-linear"
    },
    {
      id: "ia-arbitragem",
      title: "Agente de Resolução de Disputas",
      description: "Oráculo de IA que audita as condições do Smart Contract e dados off-chain para sugerir sentenças neutras em escrow travados.",
      icon: "solar:scale-linear"
    }
  ],
  features: [
    {
      id: "immutability-motor",
      name: "Motor de Imutabilidade",
      description: "Protocolo de registro definitivo na Stellar. Cada interação contratual gera um hash imutável e auditável, garantindo que o acordo seja a prova de violações para sempre.",
      icon: "solar:shield-check-bold",
      originModule: "Stellar Core"
    },
    {
      id: "programmable-escrow",
      name: "Escrow Programável",
      description: "Liquidação automática baseada em marcos contratuais. O dinheiro fica retido on-chain e só é liberado quando as condições do contrato são cumpridas. Disputas resolvidas via painel de arbitragem com multisig.",
      icon: "solar:shield-keyhole-linear",
      originModule: "B2B Escrow"
    },
    {
      id: "onchain-invoicing",
      name: "Faturamento On-chain",
      description: "Emissão de invoices com validade jurídica e registro em blockchain. Gere faturas B2B, envie links de pagamento em USDC e receba em segundos — sem SWIFT, sem IOF, sem intermediários.",
      icon: "solar:bill-list-linear",
      originModule: "Stellar Invoice"
    },
    {
      id: "asset-tokenization",
      name: "Asset Tokenization Wizard",
      description: "Plataforma para emissão de ativos reais (RWA). Tokenize de títulos de dívida (Bonds) a créditos de carbono, com ciclo de vida completo: emissão, distribuição e resgate automático.",
      icon: "solar:box-minimalistic-linear",
      originModule: "Stellar Bonds / Carbon"
    },
    {
      id: "compliance-ledger",
      name: "Global Compliance API",
      description: "Integração nativa com o motor ONYX. Verificação de risco em tempo real, monitoramento de sanções e auditoria on-chain automática para cada contrato e transação do ecossistema.",
      icon: "solar:magnifer-linear",
      originModule: "Onyx Risk"
    },
    {
      id: "multi-sig-workflow",
      name: "Aprovação Multi-Sig Visual",
      description: "Crie fluxos complexos de aprovação em diretoria (ex: 3 de 5 diretores precisam assinar). A interface visualiza a governança corporativa injetada diretamente na blockchain.",
      icon: "solar:users-group-rounded-bold",
      originModule: "Governança"
    }
  ],
  differentials: [
    "IA Jurisdicional — validação automática de conformidade legal por país",
    "Wizard de criação de contratos inteligentes do zero",
    "Suporte a PDF/DOC com hash imutável na Stellar",
    "Provas ZKP (Protocolo 25) para privacidade em conformidade",
    "Workspaces multi-tenant com RLS para governança corporativa"
  ],
  steps: [
    "Acesse seu Workspace corporativo isolado",
    "Autentique-se com Magic Link e validação 2FA",
    "Crie contratos via wizard/IA ou importe PDF/DOC",
    "IA Jurisdicional valida conformidade automaticamente",
    "Partes assinam digitalmente o documento",
    "Hash único registrado na blockchain Stellar",
    "Escrow programável libera pagamentos por marcos"
  ],
  forWhom: [
    "Corporações gerenciando contratos B2B complexos",
    "Escritórios de advocacia com operações internacionais",
    "Empresas de RWA (Real World Assets) e tokenização",
    "Freelancers e PMEs que faturam clientes internacionais"
  ],
  benefits: [
    { icon: "lucide:brain", title: "IA Jurisdicional", description: "Validação automática de conformidade legal por país. A IA revisa cláusulas e alerta sobre incompatibilidades." },
    { icon: "lucide:building-2", title: "Multi-Tenancy Total", description: "Isole contratos e dados por Empresa ou Grupo, com governança completa e RLS no banco de dados." },
    { icon: "lucide:lock", title: "Registro Imutável", description: "O hash criptográfico garante que o documento não foi alterado após a assinatura. Verificável via QR Code." }
  ],
  techDetails: {
    description: "ContractEase combina IA de processamento de linguagem natural com a imutabilidade da Stellar e contratos inteligentes Soroban para criar uma plataforma de gestão jurídica de próxima geração.",
    points: [
      "Isolamento de dados por Organization ID com Row Level Security (RLS)",
      "Fluxo MFA com TOTP Authenticator e Magic Link",
      "Escrow Smart Contracts em Soroban com regras de expiração e disputa",
      "Geração de QR codes Stellar URI Scheme nativo",
      "Multisig para agentes de disputa em escrows complexos",
      "IA Jurisdicional com LLM fine-tuned por legislação de 50+ países"
    ]
  },
  faq: [
    { question: "Como funciona a IA Jurisdicional?", answer: "Ao selecionar o país de destino do contrato, a IA analisa cláusulas, termos e condições contra a legislação local, alertando sobre incompatibilidades e sugerindo correções." },
    { question: "O documento fica salvo na blockchain?", answer: "Apenas o Hash do documento é salvo na Stellar, garantindo privacidade absoluta. O arquivo em si fica cifrado nos servidores seguros." },
    { question: "Como o Escrow Programável funciona?", answer: "O comprador deposita USDC em um smart contract neutro. Os fundos são liberados automaticamente quando as condições contratuais (marcos) são confirmadas por ambas as partes." },
    { question: "Posso justificar para o contador?", answer: "Sim. O sistema gera recibos unificados contendo o Tx Hash da Stellar, aceitos como comprovante verificável." }
  ],
  finalCta: "Gerenciar meus contratos agora",
  apiSnippet: {
    method: "POST",
    endpoint: "/v1/contracts/escrow/init",
    body: '{"amount": "5000.00", "asset": "USDC", "expiry": 86400}'
  }
};

// ============================================================
// PRODUCT 3: Kivo Pay — Motor de Liquidação Global
// ============================================================

const kivoPay: Product = {
  id: "kivopay",
  path: "/products/kivo",
  icon: "solar:wallet-linear",
  color: "#10B981",
  gradient: "from-emerald-500 to-teal-600",
  name: "Kivo Pay",
  tagline: "Máquinas precisam de rede. Kivo é a rede.",
  hero: {
    title: "SDK M2M + Gateway Programável + MCP para Agentes de IA",
    subtitle: "Infraestrutura de pagamentos para máquinas. Veículos elétricos carregando autonomamente, casas negociando energia, agentes de IA pagando por serviços. Tudo liquidado em 3-5 segundos na Stellar.",
    ctas: ["Explorar SDK", "Ver Demo"]
  },
  problem: {
    title: "Máquinas precisam de liquidação, não de pagamentos.",
    items: [
      "Fiat não consegue liquidar em tempo real para transações autônomas",
      "Intermediários bloqueiam autonomia das máquinas",
      "Sem programabilidade de condições em transações tradicionais",
      "Sem garantia de atomicidade e irreversibilidade instantânea"
    ]
  },
  solution: {
    title: "Uma infraestrutura nativa para a economia de máquinas.",
    description: "SDK M2M com protocolo x402, Gateway Programável com Path Payments, MCP para conectar agentes de IA. Três camadas de funcionalidade para máquinas transacionarem de forma autônoma, segura e irreversível."
  },
  responsibilities: [
    "SDK M2M: Protocolo x402 com conditional payments e smart contracts",
    "Gateway Programável: Path Payments, Atomic Bundling, Webhooks",
    "MCP: Ferramentas para conectar agentes de IA autônomos",
    "Compliance: ONYX monitora cada transação em tempo real",
    "Templates: Prontos para EV Charging, Energy Trading, AI Agents"
  ],
  templates: [
    {
      id: "ev-charging",
      name: "EV Charging Network",
      description: "Veículos elétricos pagando por energia em tempo real",
      icon: "solar:car-2-linear",
      useCase: "Eletroposte liquida pagamento de recarga em segundos"
    },
    {
      id: "energy-trading",
      name: "Energy Trading P2P",
      description: "Casas vendendo energia solar para vizinhos",
      icon: "solar:bolt-circle-linear",
      useCase: "Smart meter negocia e liquida energia automaticamente"
    },
    {
      id: "ai-agents",
      name: "Autonomous AI Agents",
      description: "Agentes pagando por serviços computacionais",
      icon: "solar:cpu-bolt-linear",
      useCase: "Agent pagando por API calls e compute resources"
    }
  ],
  sdkFeatures: [
    "M2M Protocol (x402) Support",
    "Conditional Payment Execution",
    "Zero-Knowledge Proof Integration",
    "Smart Contract Compatibility",
    "Webhooks & Real-time Callbacks",
    "Rate Limiting & Throttling",
    "Fallback & Redundancy Built-in"
  ],
  aiAgents: [
    {
      id: "settlement",
      title: "Agente de Liquidação Inteligente (H2M)",
      description: "IA que atua como um Radar de Liquidação, escolhendo a rota mais barata e rápida entre Pix, cartões e stablecoins.",
      icon: "solar:route-linear"
    },
    {
      id: "autonomous",
      title: "Agente Autônomo (M2M)",
      description: "IA embarcada em dispositivos IoT (carro elétrico, smart home) que negocia preços de energia, tempo de recarga ou microtransações sem intervenção humana.",
      icon: "solar:cpu-bolt-linear"
    },
    {
      id: "compliance",
      title: "Agente de Compliance Financeiro",
      description: "IA que monitora transações em tempo real para detectar lavagem de dinheiro, padrões suspeitos e garantir conformidade regulatória.",
      icon: "solar:shield-check-linear"
    },
    {
      id: "fraud-predictor",
      title: "Oráculo de Previsão de Fraude",
      description: "Motor neural de zero-day fraud prediction. Analisa vetores biométricos, device fingerprint e IP velocity para barrar transações fraudulentas antes que atinjam o ledger.",
      icon: "solar:radar-2-linear"
    }
  ],
  features: [
    {
      id: "m2m-protocol",
      name: "M2M Protocol (x402)",
      description: "Pagamentos autônomos via protocolo x402 sem intervenção humana. Máquinas negociando e pagando diretamente com lógica embarcada.",
      icon: "solar:cpu-bolt-linear",
      originModule: "Kivo Core"
    },
    {
      id: "conditional-payments",
      name: "Conditional Execution",
      description: "Pague apenas quando condições são cumpridas. Smart contracts Soroban integrados com lógica de negócio.",
      icon: "solar:settings-linear",
      originModule: "Soroban"
    },
    {
      id: "iot-financial",
      name: "IoT Financial",
      description: "Veículos, smart homes e dispositivos IoT transacionando autonomamente. Micropagamentos contínuos via payment channels.",
      icon: "solar:devices-linear",
      originModule: "QuiloVolt"
    },
    {
      id: "smart-contracts",
      name: "Smart Contracts",
      description: "Contratos inteligentes Soroban com lógica de negócio embarcada. Execução automática baseada em eventos.",
      icon: "solar:document-text-linear",
      originModule: "Soroban"
    },
    {
      id: "webhooks-m2m",
      name: "Webhooks & Event-Driven",
      description: "Comunicação em tempo real entre máquinas. Event-driven architecture para reatividade instantânea.",
      icon: "solar:widget-2-linear",
      originModule: "Kivo Core"
    },
    {
      id: "zero-intermediaries",
      name: "Zero Intermediários",
      description: "Comunicação P2P direta entre máquinas. Nenhum terceiro no meio. Liquidação direta na Stellar.",
      icon: "solar:shield-check-linear",
      originModule: "Stellar"
    }
  ],
  differentials: [
    "M2M Protocol (x402) — Pagamentos autônomos sem intervenção humana",
    "Liquidação T+0 — 3 a 5 segundos na Stellar Network",
    "Conditional Execution — Pague apenas quando condições são cumpridas",
    "Zero Intermediários — P2P direto entre máquinas",
    "Pronto para Agentes de IA — MCP nativo integrado e funcionando",
    "Compliance Automático — ONYX monitora cada transação em tempo real"
  ],
  steps: [
    "Integre o SDK M2M via NPM ou API Gateway",
    "Implemente contratos inteligentes com lógica de negócio",
    "Configure webhooks para comunicação em tempo real",
    "Conecte agentes de IA via MCP",
    "Teste em Stellar Testnet",
    "Deploy em produção com Stellar Public Network"
  ],
  forWhom: [
    "Operadores de redes de recarga EV (eletrificação veicular)",
    "Plataformas de trading de energia (smart grids)",
    "Startups de agentes de IA autônomos",
    "IoT industrial e dispositivos conectados",
    "Pesquisadores de economia descentralizada de máquinas"
  ],
  benefits: [
    { icon: "lucide:check-circle", title: "Zero Intermediários", description: "Comunicação direta machine-to-machine sem terceiros bloqueando autonomia." },
    { icon: "lucide:zap", title: "Autonomous Execution", description: "Agentes tomam decisões e executam pagamentos sem intervenção humana." },
    { icon: "lucide:code", title: "Programmable Payments", description: "Lógica de negócio embarcada com smart contracts Soroban." }
  ],
  techDetails: {
    description: "O Kivo Pay combina o protocolo nativo da Stellar com Soroban smart contracts para criar um motor de liquidação programável que atende tanto humanos (H2M) quanto máquinas (M2M).",
    points: [
      "Path Payment Strict Receive para conversão on-the-fly de ativos",
      "Atomic Transaction Bundling (até 100 operações por tx) para pagamentos em massa",
      "Protocolo x402 da Stellar para micropagamentos M2M autônomos",
      "Integração com âncoras locais brasileiras via SEP-24 para Pix",
      "Payment Channels para micro-pagamentos IoT contínuos",
      "Hardware NFC compatível para POS offline (Kivo Terminal)",
      "Webhook callbacks para confirmação de recebimento em tempo real",
      "Multi-sig para aprovação corporativa de lotes de alto valor"
    ]
  },
  faq: [
    { question: "Qual é a diferença entre H2M e M2M?", answer: "H2M (Human-to-Machine) é para pessoas transacionando com sistemas. M2M (Machine-to-Machine) é máquinas negociando e pagando entre si de forma autônoma, sem intervenção humana." },
    { question: "Como os agentes de IA pagam?", answer: "Agentes conectados ao MCP Kivo podem chamar kivo_create_payment para iniciar transações. O sistema executa automaticamente baseado em smart contracts pré-definidos." },
    { question: "Qual é a latência de transação?", answer: "3 a 5 segundos da criação à confirmação final e irreversibilidade na Stellar Network. Zero intermediários para bloquear ou atrasar." },
    { question: "Preciso entender de blockchain?", answer: "Para usar o SDK M2M, você só precisa entender APIs REST. A complexidade de blockchain é abstraída. Conheça a documentação sobre protocolo x402." },
    { question: "Como é garantida a conformidade?", answer: "Toda transação M2M passa pelo ONYX Compliance Engine em tempo real. Monitoramento contínuo de padrões suspeitos e conformidade regulatória." }
  ],
  finalCta: "Explorar SDK M2M",
  apiSnippet: {
    method: "POST",
    endpoint: "/v1/m2m/create-payment",
    body: '{"from_device": "EV-001", "to_device": "charger-05", "amount": 2.50, "condition": "energy_delivered_kwh:10", "timeout": 3600}'
  }
};

// ============================================================
// Exported Product Suite
// ============================================================

export const productsData: Product[] = [socialPay, contractEase, kivoPay];

// Helper: find product by ID or path
export function getProductBySlug(slug: string): Product | undefined {
  return productsData.find(p => 
    p.path.replace('/products/', '') === slug || 
    p.id === slug ||
    p.path === `/${slug}`
  );
}