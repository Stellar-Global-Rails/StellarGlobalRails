# Kivo Studio + Gateway Product Design

Data: 2026-05-19
Status: aprovado para planejamento
Escopo: visão completa de produto

## Resumo

Kivo é uma plataforma para transformar recursos físicos ou digitais em recursos monetizáveis, controláveis e verificáveis por pagamento. O produto deixa de ser apresentado como um sandbox de pagamentos e passa a ser uma solução completa composta por Kivo Gateway, Kivo Studio, SDK TypeScript, validação testnet com x402 + Etherfuse, publicação mainnet privada e marketplace futuro de templates.

O centro do produto é o Kivo Gateway. Ele é o runtime que protege, autoriza e libera o recurso real. O Kivo Studio é a camada de criação assistida por AI agents: ajuda o usuário a descrever o que quer controlar ou monetizar, escolher o ambiente físico ou digital, gerar um flow, receber SDK/config, executar testes e seguir um checklist de publicação.

## Tese Do Produto

O Kivo deve ser entendido como uma plataforma de gateways programáveis para cobrança e controle de recursos.

O usuário não deve começar escolhendo endpoints, chaves ou telas de desenvolvedor. Ele começa respondendo: "o que você quer monetizar ou controlar?". A partir disso, o Studio traduz a intenção em um flow executável e em artefatos de integração.

O Gateway é o produto central porque ele executa a política de acesso no mundo real. Ele pode rodar fisicamente em Raspberry Pi, edge device, totem ou placa compatível. Também pode rodar digitalmente como proxy, middleware, sidecar, worker, API guard, plugin, integração backend ou função serverless.

O Studio não substitui o Gateway. Ele cria, testa, explica e publica soluções sobre o Gateway. O SDK TypeScript permite que usuários técnicos integrem Kivo diretamente em seus próprios sistemas sem depender só da interface visual.

## Princípios

- O produto mostra dados reais ou estado vazio/conexão pendente. Não deve fingir integração.
- O Gateway é físico e digital. Kivo não fica preso ao Power Totem.
- O Studio usa AI agents para acelerar criação, diagnóstico, testes e checklist de publicação.
- O SDK é um produto baixável e completo, não um bloco de código solto.
- Testnet validation precisa deixar x402 e Etherfuse visíveis para o usuário.
- Mainnet privada é paga. Flows não pagos podem virar templates públicos.
- Power Totem é o único template funcional do hackathon.
- Templates adicionais ficam como roadmap ou marketplace futuro até estarem realmente implementados.

## Camadas Do Produto

### Kivo Studio

Aplicação principal do usuário. O Studio guia a criação de soluções com AI agents especializados:

- Discovery Agent: entende o recurso a monetizar/controlar.
- Flow Architect Agent: propõe o flow, gatilhos, regras, preços e condições.
- Gateway Agent: escolhe o modo de execução físico, digital ou híbrido.
- SDK Agent: gera snippets, config, adapters e testes TypeScript.
- Validation Agent: executa checklist testnet com x402 + Etherfuse.
- Launch Agent: prepara publicação privada em mainnet ou template público.

O Studio deve funcionar como um ambiente guiado, não como uma landing. A experiência principal é criar uma solução, testar e publicar.

### Kivo Gateway

Runtime central de execução. Ele recebe uma configuração de flow e decide quando um recurso pode ser liberado.

Modos físicos:

- Raspberry Pi.
- Edge device.
- Totem físico.
- Placa compatível.
- Controlador local conectado a relay, sensor, display ou atuador.

Modos digitais:

- Proxy.
- Middleware.
- Sidecar.
- Worker.
- API guard.
- Plugin.
- Função serverless.
- Integração backend.

O Gateway deve expor health, eventos, auditoria, status de autorização e estado de conectividade. Quando estiver desconectado, o Studio deve mostrar conexão pendente ou falha real.

### Kivo API

Plano de controle. A API guarda e opera:

- usuários e ambientes;
- flows;
- gateways;
- sessões;
- validações testnet;
- eventos;
- webhooks;
- chaves;
- billing privado;
- publicação mainnet;
- templates públicos.

A API não deve fabricar sucesso. Se Etherfuse, wallet, Gateway ou backend não estiver configurado, o estado deve ser explícito.

### SDK TypeScript

Pacote baixável, versionado e documentado. Deve incluir:

- client principal;
- helpers x402;
- helpers Etherfuse;
- adapters para gateway digital;
- adapters para gateway físico;
- exemplos reais;
- testes;
- snippets gerados pelo Studio;
- onboarding;
- guia de deploy;
- checklist de segurança.

O SDK precisa servir tanto para devs usando Kivo em uma aplicação própria quanto para usuários que exportam uma solução criada no Studio.

### Validation Layer

Camada que prova que a solução funciona antes de mainnet.

O fluxo de validação deve mostrar:

- challenge x402;
- headers;
- payload;
- estado do pagamento;
- assinatura/transação quando aplicável;
- chamada Etherfuse;
- estado da âncora/testnet;
- resposta do Gateway;
- liberação ou bloqueio do recurso;
- falhas reais com orientação de correção.

Se não houver backend, wallet, API key, Gateway ou Etherfuse conectado, a tela mostra pendente/não configurado. Nunca mocka sucesso.

## Jornada Principal

1. O usuário abre o Kivo Studio.
2. Descreve em linguagem natural o que quer monetizar ou controlar.
3. O Studio classifica o caso como físico, digital ou híbrido, e também como H2M, M2M, A2M ou fluxo misto.
4. O usuário escolhe o modo do Gateway.
5. O Studio gera um flow com regra de acesso, preço, condição de liberação, eventos, webhooks, fallback e checklist.
6. O Studio gera SDK/config para o caso de uso.
7. O usuário roda validação em testnet.
8. O sistema mostra x402 + Etherfuse de forma verificável.
9. O usuário corrige pendências até o flow estar validado.
10. O usuário escolhe publicar privado em mainnet, manter em testnet ou tornar template público.

## Mainnet Billing Privado

Depois que um flow passa pela validação testnet, o usuário pode publicar em mainnet como flow privado. Esse modo exige pagamento.

O valor pago mantém:

- flow privado;
- publicação mainnet;
- credenciais e configurações protegidas;
- histórico e auditoria;
- suporte a versão;
- possibilidade de uso comercial.

Se o usuário não quiser pagar, ele pode:

- manter a solução em testnet;
- não publicar;
- converter o flow em template público.

Templates públicos podem ser usados por outras pessoas no marketplace futuro. A regra precisa ser clara no produto: privado em mainnet é pago; público pode virar contribuição ao ecossistema.

## Templates

### Template Funcional Do Hackathon

Power Totem é o único template funcional até o fim do hackathon.

Ele deve provar o ciclo completo:

- recurso físico;
- Gateway em Raspberry Pi ou simulador compatível;
- checkout x402;
- Etherfuse em testnet;
- autorização;
- liberação do recurso;
- status/health;
- eventos;
- documentação e roteiro de demonstração.

### Templates Futuros

Os demais templates aparecem como roadmap ou marketplace futuro, sem parecerem prontos.

Possíveis categorias futuras:

- API monetizada.
- IoT data marketplace.
- Edge compute.
- Conteúdo premium.
- Agentes autônomos pagando por ferramentas.
- Energia P2P.
- Acesso temporário a serviços.
- Automação industrial leve.
- Webhook/API guard.
- Serverless paid functions.

Cada template futuro deve deixar claro seu status: planejado, em pesquisa, alpha, beta ou pronto.

## Experiência Visual Esperada

O produto deve ter cara de ferramenta operacional premium, não de sandbox. O Studio deve mostrar:

- criação guiada;
- progresso por etapas;
- outputs claros;
- validações reais;
- estados vazios honestos;
- status de conexão;
- checklist acionável;
- logs legíveis para leigos;
- detalhes técnicos expansíveis para devs.

Evitar telas que pareçam terminal. Logs, headers e payloads podem existir, mas dentro de painéis com explicação, status e próximos passos.

## Estados Obrigatórios

Toda tela relevante precisa suportar:

- não configurado;
- conexão pendente;
- conectado;
- validando;
- aprovado;
- falhou;
- precisa de ação do usuário;
- aguardando Gateway;
- aguardando Etherfuse;
- aguardando assinatura/pagamento;
- pronto para mainnet;
- publicado privado;
- publicado como template público.

## Segurança E Confiabilidade

O Kivo deve separar claramente o que roda no cliente, no Gateway e na API.

Regras de segurança:

- chaves privadas nunca aparecem no front;
- secrets ficam em ambiente seguro;
- Gateway usa token ou assinatura própria;
- webhooks são assinados;
- validações críticas rodam server-side;
- publicação mainnet exige confirmação explícita;
- billing privado não pode depender só de estado local;
- logs não exibem secrets;
- templates públicos não carregam credenciais privadas.

## Métricas De Sucesso

O produto estará bem definido quando um usuário conseguir:

- entender que Kivo é Gateway + Studio + SDK;
- criar um flow a partir de uma descrição natural;
- escolher físico, digital ou híbrido;
- receber config e SDK coerentes;
- validar x402 + Etherfuse em testnet;
- ver estados reais quando algo não está conectado;
- publicar privado em mainnet mediante pagamento;
- entender que Power Totem é o template funcional atual;
- entender que os demais templates são roadmap/marketplace.

## Fronteira Do Hackathon

Até o fim do hackathon, o foco de implementação deve ser:

- Power Totem como template funcional completo;
- Gateway físico/digital mínimo para provar runtime;
- Studio inicial focado em criação guiada e validação;
- SDK TypeScript com exemplos reais do Power Totem;
- validação testnet x402 + Etherfuse visível;
- health/status claros;
- documentação de uso e demo.

Não tentar entregar marketplace completo, IDE Tauri completa, todos os templates, multiusuário avançado ou billing mainnet finalizado antes da prova principal estar sólida.

## Pós-Hackathon

Depois do hackathon, a evolução natural é:

- Kivo Studio desktop/web com AI agents mais completos;
- Tauri Studio com experiência tipo IDE;
- marketplace de templates;
- flows privados pagos em mainnet;
- templates públicos reutilizáveis;
- multiusuário e equipes;
- adapters adicionais de Gateway;
- SDK mais amplo;
- observabilidade avançada;
- billing e planos comerciais.

## Decisão Final

A direção oficial é Gateway-core + Studio-led.

Kivo Gateway é o runtime central. Kivo Studio é a experiência inteligente de criação, validação e publicação. SDK TypeScript é o caminho técnico profissional. Power Totem é a prova funcional do hackathon. x402 + Etherfuse são parte visível da validação real. Mainnet privada é o ponto natural de monetização.
