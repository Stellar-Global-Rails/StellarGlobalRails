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

export interface ProductTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  useCase: string;
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
  templates?: ProductTemplate[];
  sdkFeatures?: string[];
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
    { question: "Como funciona a monetização dos dados?", answer: "Quando um pesquisador solicita acesso, você aprova ou recusa. Se aprovar, o pagamento em USDC é automático via Kivo payment engine." }
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
// PRODUCT 3: Kivo — Gateway fisico e digital
// ============================================================

const kivoPay: Product = {
  id: "kivopay",
  path: "/products/kivo",
  icon: "solar:server-square-cloud-linear",
  color: "#10B981",
  gradient: "from-emerald-500 to-teal-600",
  name: "Kivo",
  tagline: "Gateway fisico e digital para monetizar acesso.",
  hero: {
    title: "Gateway fisico e digital para acesso pago",
    subtitle:
      "Transforme dispositivos, APIs, agentes de IA, dados e automacoes em recursos pagos com x402, Stellar, Etherfuse e um SDK TypeScript completo.",
    ctas: ["Explorar Kivo", "Ver arquitetura"]
  },
  problem: {
    title: "Recursos reais e digitais ainda sao dificeis de monetizar com seguranca.",
    items: [
      "Dispositivos fisicos precisam liberar acesso sem expor chaves ou logica critica",
      "APIs, dados e automacoes precisam cobrar por uso sem montar um checkout do zero",
      "Agentes de IA precisam pagar por ferramentas e servicos com autorizacao verificavel",
      "Times querem validar em testnet antes de assumir risco operacional em mainnet"
    ]
  },
  solution: {
    title: "Um gateway para proteger, cobrar, validar e liberar acesso.",
    description:
      "Kivo combina Gateway fisico ou digital, Studio com AI agents, SDK TypeScript, checkout x402, liquidacao Stellar e trilha Etherfuse para transformar recursos em fluxos pagos testaveis."
  },
  responsibilities: [
    "Gateway fisico: roda perto de Raspberry Pi, totem, kiosk, edge box ou controlador local",
    "Gateway digital: protege APIs, workers, automacoes, sidecars, proxies e agent tools",
    "Studio com AI agents: guia a criacao de solucoes customizadas usando o SDK Kivo",
    "SDK TypeScript: integra checkout, autorizacao, webhooks, gateway pairing e testes",
    "x402 + Stellar + Etherfuse: valida pagamento, settlement e contexto de anchor/funding",
    "Private mainnet billing: permite manter flows validados como infraestrutura privada"
  ],
  templates: [
    {
      id: "power-totem",
      name: "Power Totem",
      description: "Template funcional do hackathon para liberar um recurso fisico via gateway",
      icon: "solar:bolt-circle-linear",
      useCase: "Raspberry Pi exibe QR, valida x402/Stellar/Etherfuse e libera uma carga segura"
    },
    {
      id: "api-toll",
      name: "API Toll",
      description: "Roadmap para cobrar acesso a endpoints, dados ou automacoes",
      icon: "solar:programming-linear",
      useCase: "Gateway digital protege uma API e libera resposta apos pagamento x402"
    },
    {
      id: "agent-tool-paywall",
      name: "Agent Tool Paywall",
      description: "Roadmap para agentes de IA pagarem por ferramentas e servicos",
      icon: "solar:cpu-bolt-linear",
      useCase: "Agente paga por tool call, compute ou dado premium antes de executar"
    }
  ],
  sdkFeatures: [
    "Typed Kivo API client",
    "x402 challenge helpers",
    "Gateway pairing helpers",
    "Resource authorization helpers",
    "Webhook verification",
    "Testnet simulator utilities",
    "Physical and digital gateway examples"
  ],
  aiAgents: [
    {
      id: "studio-architect",
      title: "Agente Arquiteto do Studio",
      description:
        "Ajuda o usuario a descrever o recurso, escolher gateway fisico ou digital, definir restricoes e montar a arquitetura Kivo.",
      icon: "solar:compass-linear"
    },
    {
      id: "integration-builder",
      title: "Agente Builder de Integracao",
      description:
        "Gera configuracao, snippets do SDK TypeScript, adapters de gateway, testes e instrucoes de deploy para o flow.",
      icon: "solar:code-square-linear"
    },
    {
      id: "testnet-validator",
      title: "Agente Validador Testnet",
      description:
        "Ajuda a validar x402, Stellar, Etherfuse, eventos do gateway, health checks e recibos antes de mainnet.",
      icon: "solar:shield-check-linear"
    },
    {
      id: "billing-advisor",
      title: "Agente de Mainnet Billing",
      description:
        "Explica o caminho comercial: manter o flow privado em mainnet ou publicar um template sanitizado com consentimento.",
      icon: "solar:wallet-money-linear"
    }
  ],
  features: [
    {
      id: "physical-gateway",
      name: "Gateway fisico",
      description:
        "Rode o Kivo perto de Raspberry Pi, totem, kiosk, edge box ou controlador local para liberar um recurso real apos autorizacao paga.",
      icon: "solar:devices-linear",
      originModule: "Gateway"
    },
    {
      id: "digital-gateway",
      name: "Gateway digital",
      description:
        "Proteja APIs, workers, automacoes, proxies, sidecars e ferramentas de agentes com cobranca por acesso via x402.",
      icon: "solar:server-square-cloud-linear",
      originModule: "Gateway"
    },
    {
      id: "studio-ai-agents",
      name: "Studio com AI agents",
      description:
        "Descreva o que quer construir e deixe agentes guiarem arquitetura, SDK, testes, adapters e validacao em testnet.",
      icon: "solar:stars-linear",
      originModule: "Studio"
    },
    {
      id: "typescript-sdk",
      name: "SDK TypeScript completo",
      description:
        "Cliente tipado, helpers x402, pairing de gateway, autorizacao de recursos, verificacao de webhooks e exemplos de deploy.",
      icon: "solar:code-square-linear",
      originModule: "SDK"
    },
    {
      id: "x402-checkout",
      name: "Checkout x402",
      description:
        "Transforme um recurso protegido em pagamento verificavel: requisito x402, liquidacao Stellar, autorizacao Kivo e recibo.",
      icon: "solar:card-recive-linear",
      originModule: "x402"
    },
    {
      id: "etherfuse-rail",
      name: "Etherfuse rail",
      description:
        "Mostre a trilha de anchor/funding junto da validacao Stellar, sem esconder a rota financeira por tras do acesso pago.",
      icon: "solar:link-round-angle-linear",
      originModule: "Etherfuse"
    },
    {
      id: "private-mainnet-billing",
      name: "Private mainnet billing",
      description:
        "Depois de validar em testnet, o usuario paga para manter o flow privado em mainnet ou opta por publicar um template sanitizado.",
      icon: "solar:lock-keyhole-linear",
      originModule: "Billing"
    },
    {
      id: "power-totem-template",
      name: "Power Totem",
      description:
        "Template funcional do hackathon: QR em um totem, pagamento x402, validacao Stellar/Etherfuse e gateway liberando uma carga segura.",
      icon: "solar:bolt-circle-linear",
      originModule: "Template"
    }
  ],
  differentials: [
    "Gateway fisico e digital no mesmo modelo de autorizacao",
    "Studio com AI agents para criar solucoes customizadas",
    "SDK TypeScript completo para integrar em sistemas reais",
    "x402 + Stellar + Etherfuse visiveis no fluxo de validacao",
    "Power Totem como template funcional do hackathon",
    "Private mainnet billing para flows validados e privados"
  ],
  steps: [
    "Descreva o recurso que voce quer monetizar no Kivo Studio",
    "Escolha gateway fisico, gateway digital ou fluxo hibrido",
    "Gere configuracao, SDK code, adapters e checklist com AI agents",
    "Valide x402, Stellar, Etherfuse, health e recibos em testnet",
    "Publique como flow privado em mainnet com billing Kivo",
    "Ou transforme a solucao em template publico sanitizado com consentimento"
  ],
  forWhom: [
    "Builders criando gateways fisicos com Raspberry Pi, totems, kiosks e edge devices",
    "Times que querem cobrar acesso a APIs, dados, automacoes e workflows",
    "Empresas que precisam monetizar recursos privados sem montar billing do zero",
    "Criadores de agentes de IA que precisam pagar ou cobrar por ferramentas",
    "Operadores que querem validar em testnet antes de publicar em mainnet"
  ],
  benefits: [
    {
      icon: "lucide:split-square-horizontal",
      title: "Fisico e digital",
      description: "O mesmo modelo protege uma carga fisica, uma API, uma automacao ou uma ferramenta de agente."
    },
    {
      icon: "lucide:bot",
      title: "Construido com AI agents",
      description: "Studio guia arquitetura, codigo, testes e publicacao sem exigir que o usuario comece do zero."
    },
    {
      icon: "lucide:shield-check",
      title: "Validacao antes da mainnet",
      description: "Testnet primeiro, pagamento privado depois, com Etherfuse e Stellar visiveis no caminho."
    }
  ],
  techDetails: {
    description:
      "Kivo coordena recurso, politica, requisito x402, validacao Stellar, contexto Etherfuse, autorizacao, gateway execution, recibos e health events.",
    points: [
      "Resource policy define preco, duracao, unidade e permissao",
      "x402 challenge bloqueia acesso ate existir pagamento valido",
      "Stellar confirma settlement e prova transacional",
      "Etherfuse aparece como trilha de anchor/funding para o ativo usado",
      "Gateway fisico ou digital libera o recurso somente apos autorizacao",
      "SDK TypeScript oferece client, helpers, webhooks e exemplos",
      "Studio com AI agents gera arquitetura, adapters, testes e setup",
      "Private mainnet billing monetiza flows que o usuario quer manter privados"
    ]
  },
  faq: [
    {
      question: "Kivo e apenas um gateway fisico?",
      answer:
        "Nao. Kivo pode rodar perto de hardware, como Raspberry Pi e totems, mas tambem pode proteger APIs, workers, automacoes, proxies, sidecars e ferramentas digitais."
    },
    {
      question: "Onde entram x402, Stellar e Etherfuse?",
      answer:
        "x402 cria o requisito de pagamento, Stellar valida settlement e prova transacional, e Etherfuse aparece como contexto de anchor/funding para o caminho financeiro."
    },
    {
      question: "O que o Kivo Studio faz?",
      answer:
        "Studio usa AI agents para ajudar o usuario a modelar a solucao, gerar SDK code, configurar gateway, criar testes e validar o flow em testnet."
    },
    {
      question: "O que existe funcional para o hackathon?",
      answer:
        "O template funcional e o Power Totem: QR checkout, pagamento x402, validacao Stellar/Etherfuse e gateway liberando um recurso fisico seguro."
    },
    {
      question: "Como Kivo ganha dinheiro?",
      answer:
        "O usuario testa em testnet. Se quiser manter um flow privado em mainnet, paga pelo private mainnet billing. Caso nao pague, pode optar por publicar um template sanitizado com consentimento."
    }
  ],
  finalCta: "Explorar Kivo",
  apiSnippet: {
    method: "POST",
    endpoint: "/v1/resources/power-totem/access",
    body:
      '{"resource_id":"power-totem-rj-01","price":"1.00","asset":"USDC","condition":"session_60_seconds"}'
  }
};

// ============================================================
// Exported Product Suite
// ============================================================

export const productsData: Product[] = [socialPay, contractEase, kivoPay];

export const modulesData = productsData;

// Helper: find product by ID or path
export function getProductBySlug(slug: string): Product | undefined {
  return productsData.find(p => 
    p.path.replace('/products/', '') === slug || 
    p.id === slug ||
    p.path === `/${slug}`
  );
}
