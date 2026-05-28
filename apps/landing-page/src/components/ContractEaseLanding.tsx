import { motion } from 'motion/react';
import { useState } from 'react';

const APP_URL = 'https://contractease.vercel.app';

const personas = [
  {
    id: 'freelancer',
    icon: 'solar:user-id-bold-duotone',
    title: 'Sou Autônomo ou Freelancer',
    pain: 'Faço contratos com clientes todo mês — e já tomei calote por não ter como provar o que foi combinado.',
    color: '#10B981',
  },
  {
    id: 'pme',
    icon: 'solar:buildings-2-bold-duotone',
    title: 'Tenho um Negócio com Muitos Contratos',
    pain: 'Locação, prestação, vendas. Perco tempo coletando assinaturas e tenho medo de não poder auditar depois.',
    color: '#8B5CF6',
  },
  {
    id: 'advogado',
    icon: 'solar:scale-bold-duotone',
    title: 'Sou Advogado ou Escritório',
    pain: 'Preciso de rastreabilidade judicial e histórico íntegro. Hoje dependo de plataformas que podem sumir.',
    color: '#EC4899',
  },
];

const pillars = [
  {
    n: '01',
    title: 'Templates Profissionais',
    subtitle: '52 modelos jurídicos brasileiros',
    icon: 'solar:document-text-bold-duotone',
    color: '#10B981',
    description:
      'Não comece do zero. Escolha entre 52 modelos jurídicos redigidos por especialistas, organizados em 10 categorias.',
    points: [
      'Locação, prestação de serviço, NDA, compra e venda, trabalho, família, parcerias',
      'Variáveis inteligentes: datas, valores, cláusulas condicionais',
      'Preview ao vivo enquanto você preenche',
      'Adapte um modelo profissional em minutos — não em dias',
    ],
  },
  {
    n: '02',
    title: 'Contratos Inteligentes',
    subtitle: 'Dinheiro programável na blockchain',
    icon: 'solar:cpu-bolt-bold-duotone',
    color: '#06B6D4',
    description:
      'Pela primeira vez no Brasil, o pagamento pode estar dentro do contrato. Quando as condições são cumpridas, o dinheiro se executa sozinho.',
    points: [
      '20+ contratos: aluguel, freelancer por entrega, folha de pagamento, honorários quota litis',
      'Escrow on-chain: o cliente deposita, o valor fica travado, e libera por marco aprovado',
      'Execução automática: sem boleto, sem PIX manual, sem cobrança',
      'Construído em Soroban (Rust) sobre a rede Stellar',
    ],
  },
  {
    n: '03',
    title: 'Feed de Oportunidades',
    subtitle: 'Marketplace conectado a contratos',
    icon: 'solar:bolt-circle-bold-duotone',
    color: '#F59E0B',
    description:
      'Publique uma demanda, receba propostas, aceite — e o contrato já é gerado pré-preenchido. Sem intermediários cobrando 20%.',
    points: [
      'Duas vias: "quero contratar" ou "estou disponível"',
      'Quando o cliente aceita uma proposta, o smart contract nasce automaticamente',
      'Pagamento já entra no escrow no momento da formalização',
      'Vitrine pública (@handle) com reputação on-chain',
    ],
  },
  {
    n: '04',
    title: 'Verificação Pública',
    subtitle: 'Prova permanente, independente da plataforma',
    icon: 'solar:shield-check-bold-duotone',
    color: '#A855F7',
    description:
      'O hash de cada contrato fica gravado na blockchain Stellar. Qualquer pessoa pode verificar — mesmo que o ContractEase deixe de existir.',
    points: [
      'Hash SHA-256 do documento ancorado on-chain',
      'Página /verify aberta ao público — sem login',
      'Validação direta no Stellar Explorer',
      'Sua prova vive na blockchain, não nos nossos servidores',
    ],
  },
];

const trilhaFreelancer = {
  hook: 'Você já trabalhou meses em um projeto e ouviu "não tenho memória disso" na hora de receber?',
  pains: [
    {
      pain: 'Cliente diz que nunca aceitou aquele escopo',
      solution: 'Toda alteração fica registrada com hash on-chain — impossível negar.',
    },
    {
      pain: 'Não consigo cobrar judicialmente sem contrato formal',
      solution: 'Cada assinatura gera certificado com prova pública e validade jurídica.',
    },
    {
      pain: 'Cliente pede revisão eterna e some na hora de pagar',
      solution: 'Smart Contract de Freelancer trava o pagamento no início e libera por entrega aprovada.',
    },
  ],
  example:
    'Ana, designer freelancer em SP, fechou um projeto de R$ 8.000. Cliente sumiu. Com o contrato ancorado e escrow ativo no ContractEase, o pagamento foi liberado automaticamente após o prazo de revisão.',
  plan: 'Pro (R$ 97/mês)',
  cta: 'Criar meu primeiro contrato grátis',
  color: '#10B981',
};

const trilhaPME = {
  hook: 'Sua empresa gera 30 contratos por mês. Quantos deles você consegue auditar em 5 minutos?',
  pains: [
    {
      pain: 'Tempo perdido coletando assinaturas via WhatsApp',
      solution: 'Envio automático com lembretes inteligentes para cada signatário.',
    },
    {
      pain: 'Risco de adulteração do arquivo',
      solution: 'Hash imutável na Stellar — qualquer alteração é detectada na hora.',
    },
    {
      pain: 'Custo alto de DocuSign/ClickSign para volume médio',
      solution: 'Preço fixo em real, sem cobrança por assinatura individual.',
    },
  ],
  example:
    'Imobiliária com 40 contratos/mês: ClickSign cobra ~R$ 280. ContractEase Pro: R$ 97. Economia anual de R$ 2.196 — e a caução vira escrow automático na Stellar.',
  plan: 'Pro (R$ 97) ou Enterprise (R$ 297)',
  cta: 'Agendar demonstração',
  color: '#8B5CF6',
};

const trilhaAdvogado = {
  hook: 'A integridade do documento é seu ativo profissional. Hoje, ela depende de um servidor que você não controla.',
  pains: [
    {
      pain: 'Risco de questionamento sobre autenticidade em juízo',
      solution: 'Hash on-chain é prova técnica aceita por peritos digitais.',
    },
    {
      pain: 'Necessidade de comprovar cadeia de custódia',
      solution: 'Log auditável com IP, timestamp e user-agent de cada interação.',
    },
    {
      pain: 'Honorários quota litis contestados pelo cliente',
      solution: 'Smart contract de honorários executa o pagamento de sucesso sem depender da boa vontade.',
    },
  ],
  example:
    'Escritório de 12 advogados em BH passou a oferecer "contratos com rastreabilidade pública na blockchain" como diferencial. Captou 4 novos clientes corporativos em 60 dias.',
  plan: 'Enterprise (R$ 297/mês)',
  cta: 'Falar com especialista jurídico',
  color: '#EC4899',
};

function PersonaTrail({
  data,
  reverse = false,
}: {
  data: typeof trilhaFreelancer;
  reverse?: boolean;
}) {
  return (
    <div className={`grid lg:grid-cols-12 gap-8 ${reverse ? 'lg:flex-row-reverse' : ''}`}>
      <div className="lg:col-span-7 space-y-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-bricolage text-white leading-snug italic font-light"
          style={{ borderLeft: `3px solid ${data.color}`, paddingLeft: '1.5rem' }}
        >
          "{data.hook}"
        </motion.p>

        <div className="space-y-3 mt-8">
          {data.pains.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="grid md:grid-cols-2 gap-4 p-5 rounded-2xl border border-white/8 bg-white/[0.02]"
            >
              <div className="flex items-start gap-3">
                {/* @ts-ignore */}
                <iconify-icon icon="solar:close-circle-bold" style={{ color: '#EF4444' }} width="22" class="shrink-0 mt-0.5" />
                <p className="text-sm text-neutral-300 leading-relaxed">{p.pain}</p>
              </div>
              <div className="flex items-start gap-3">
                {/* @ts-ignore */}
                <iconify-icon icon="solar:check-circle-bold" style={{ color: data.color }} width="22" class="shrink-0 mt-0.5" />
                <p className="text-sm text-white leading-relaxed">{p.solution}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-5 flex">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-3xl p-6 md:p-8 border border-white/10 bg-gradient-to-br from-neutral-900 to-neutral-950 flex flex-col gap-5 w-full"
        >
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-mono">Exemplo real</span>
          </div>
          <p className="text-base text-neutral-300 leading-relaxed">{data.example}</p>

          <div className="border-t border-white/8 pt-5 mt-auto space-y-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1">Plano recomendado</p>
              <p className="text-sm font-bold text-white">{data.plan}</p>
            </div>
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener"
              className="group flex items-center justify-between w-full rounded-2xl p-4 font-bold transition-all"
              style={{ backgroundColor: data.color, color: '#000' }}
            >
              <span className="text-sm">{data.cta}</span>
              {/* @ts-ignore */}
              <iconify-icon icon="solar:arrow-right-bold" width="18" class="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function ContractEaseLanding() {
  const [activePersona, setActivePersona] = useState<string | null>(null);

  return (
    <div className="relative">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center px-6 md:px-12 pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">ContractEase · Mainnet em breve</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-bricolage text-white text-5xl md:text-7xl lg:text-8xl leading-[0.95] font-semibold tracking-tight max-w-5xl"
          >
            Contratos digitais com{' '}
            <span className="italic font-serif font-thin text-emerald-400">prova imutável</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-8 text-xl md:text-2xl text-neutral-300 max-w-3xl leading-relaxed font-light"
          >
            Para você nunca mais ter que provar que assinou. Assine, registre e verifique contratos com segurança jurídica e
            rastreabilidade pública na blockchain Stellar.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-12 flex flex-col sm:flex-row gap-4"
          >
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener"
              className="group flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-emerald-500 text-black font-bold text-sm uppercase tracking-wider hover:bg-emerald-400 transition-colors"
            >
              Começar grátis
              {/* @ts-ignore */}
              <iconify-icon icon="solar:arrow-right-bold" width="18" class="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#demonstracao"
              className="group flex items-center justify-center gap-3 px-8 py-4 rounded-2xl border border-white/15 bg-white/[0.03] text-white font-bold text-sm uppercase tracking-wider hover:bg-white/[0.08] transition-colors"
            >
              Agendar demonstração
              {/* @ts-ignore */}
              <iconify-icon icon="solar:calendar-bold-duotone" width="18" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-16 flex flex-wrap gap-x-12 gap-y-4 items-center"
          >
            <div>
              <p className="text-3xl font-bricolage text-white">52+</p>
              <p className="text-xs uppercase tracking-widest text-neutral-500 font-mono mt-1">Modelos jurídicos pt-BR</p>
            </div>
            <div>
              <p className="text-3xl font-bricolage text-white">20+</p>
              <p className="text-xs uppercase tracking-widest text-neutral-500 font-mono mt-1">Contratos inteligentes</p>
            </div>
            <div>
              <p className="text-3xl font-bricolage text-white">3-5s</p>
              <p className="text-xs uppercase tracking-widest text-neutral-500 font-mono mt-1">Liquidação on-chain</p>
            </div>
            <div>
              <p className="text-3xl font-bricolage text-white">100%</p>
              <p className="text-xs uppercase tracking-widest text-neutral-500 font-mono mt-1">Verificação pública</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SEGMENTAÇÃO DE PERSONAS */}
      <section className="px-6 md:px-12 py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 max-w-3xl"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-emerald-400 font-mono">Qual o seu caso?</span>
            <h2 className="font-bricolage text-white text-4xl md:text-5xl font-semibold mt-4 leading-tight">
              Cada profissional tem uma dor diferente. <span className="text-neutral-500">Veja a sua.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {personas.map((p, i) => (
              <motion.a
                key={p.id}
                href={`#trilha-${p.id}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                onMouseEnter={() => setActivePersona(p.id)}
                onMouseLeave={() => setActivePersona(null)}
                className="group relative rounded-3xl p-7 border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] transition-all overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at top left, ${p.color}15, transparent 60%)`,
                  }}
                />
                <div className="relative z-10">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                    style={{ backgroundColor: `${p.color}20`, border: `1px solid ${p.color}30` }}
                  >
                    {/* @ts-ignore */}
                    <iconify-icon icon={p.icon} width="26" style={{ color: p.color }} />
                  </div>
                  <h3 className="font-bricolage text-xl text-white font-semibold mb-3">{p.title}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed italic">"{p.pain}"</p>
                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold" style={{ color: p.color }}>
                    Ver como resolvemos
                    {/* @ts-ignore */}
                    <iconify-icon icon="solar:arrow-right-bold" width="14" class="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* PILARES — AS 4 SOLUÇÕES */}
      <section className="px-6 md:px-12 py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20 max-w-3xl"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-emerald-400 font-mono">Como o ContractEase funciona</span>
            <h2 className="font-bricolage text-white text-4xl md:text-5xl font-semibold mt-4 leading-tight">
              Quatro pilares que se conectam em um <span className="text-emerald-400">único ciclo</span>.
            </h2>
            <p className="text-lg text-neutral-400 mt-6 leading-relaxed">
              Encontre quem quer trabalhar com você, formalize com modelos profissionais, programe o pagamento dentro do
              contrato e prove a autenticidade a qualquer momento — tudo na mesma plataforma.
            </p>
          </motion.div>

          <div className="space-y-5">
            {pillars.map((p, i) => (
              <motion.div
                key={p.n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="grid md:grid-cols-12 gap-6 p-7 md:p-10 rounded-3xl border border-white/8 bg-gradient-to-br from-white/[0.02] to-transparent hover:border-white/15 transition-all"
              >
                <div className="md:col-span-4">
                  <div className="flex items-baseline gap-4 mb-5">
                    <span className="text-5xl font-bricolage font-thin" style={{ color: p.color }}>
                      {p.n}
                    </span>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${p.color}15`, border: `1px solid ${p.color}30` }}
                    >
                      {/* @ts-ignore */}
                      <iconify-icon icon={p.icon} width="22" style={{ color: p.color }} />
                    </div>
                  </div>
                  <h3 className="font-bricolage text-3xl text-white font-semibold leading-tight">{p.title}</h3>
                  <p className="text-sm mt-2 font-mono uppercase tracking-wider" style={{ color: p.color }}>
                    {p.subtitle}
                  </p>
                </div>

                <div className="md:col-span-8 flex flex-col gap-5">
                  <p className="text-lg text-neutral-300 leading-relaxed">{p.description}</p>
                  <ul className="grid sm:grid-cols-2 gap-3 mt-2">
                    {p.points.map((point) => (
                      <li key={point} className="flex items-start gap-3 text-sm text-neutral-400 leading-relaxed">
                        {/* @ts-ignore */}
                        <iconify-icon
                          icon="solar:check-circle-bold"
                          width="18"
                          style={{ color: p.color }}
                          class="shrink-0 mt-0.5"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CICLO INTEGRADO */}
      <section className="px-6 md:px-12 py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 max-w-3xl"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-emerald-400 font-mono">Ciclo completo</span>
            <h2 className="font-bricolage text-white text-4xl md:text-5xl font-semibold mt-4 leading-tight">
              Da primeira conversa ao último pagamento — <span className="text-emerald-400">tudo conectado</span>.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-4">
            {[
              {
                n: '1',
                title: 'Encontro',
                text: 'Demanda publicada no Feed. Proposta enviada. Aceita.',
                icon: 'solar:bolt-circle-bold-duotone',
                color: '#F59E0B',
              },
              {
                n: '2',
                title: 'Formalização',
                text: 'Template gerado automaticamente, já pré-preenchido com os dados da oportunidade. Partes assinam.',
                icon: 'solar:document-text-bold-duotone',
                color: '#10B981',
              },
              {
                n: '3',
                title: 'Execução',
                text: 'Smart contract recebe o depósito. Dinheiro fica em escrow. Libera por marco aprovado.',
                icon: 'solar:cpu-bolt-bold-duotone',
                color: '#06B6D4',
              },
              {
                n: '4',
                title: 'Prova',
                text: 'Hash ancorado na Stellar. Verificável publicamente — para sempre.',
                icon: 'solar:shield-check-bold-duotone',
                color: '#A855F7',
              },
            ].map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative rounded-3xl p-7 border border-white/8 bg-white/[0.02]"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: `${step.color}15`, border: `1px solid ${step.color}30` }}
                >
                  {/* @ts-ignore */}
                  <iconify-icon icon={step.icon} width="24" style={{ color: step.color }} />
                </div>
                <span className="text-[10px] uppercase tracking-[0.3em] font-mono" style={{ color: step.color }}>
                  Passo {step.n}
                </span>
                <h3 className="font-bricolage text-xl text-white font-semibold mt-2">{step.title}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed mt-3">{step.text}</p>

                {i < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                    {/* @ts-ignore */}
                    <iconify-icon icon="solar:arrow-right-bold" width="20" class="text-neutral-700" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-neutral-500 mt-10 text-sm max-w-2xl mx-auto leading-relaxed italic"
          >
            Nenhum concorrente cobre os quatro estágios. Workana cobre 1 e parcialmente 3. ClickSign cobre só 2. Stripe
            cobre só 3 — sem contrato. ContractEase é a única plataforma brasileira que oferece o ciclo inteiro.
          </motion.p>
        </div>
      </section>

      {/* TRILHA FREELANCER */}
      <section id="trilha-freelancer" className="px-6 md:px-12 py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                {/* @ts-ignore */}
                <iconify-icon icon="solar:user-id-bold-duotone" width="22" class="text-emerald-400" />
              </div>
              <span className="text-xs uppercase tracking-[0.3em] text-emerald-400 font-mono">Para Autônomos e Freelancers</span>
            </div>
            <h2 className="font-bricolage text-white text-4xl md:text-5xl font-semibold leading-tight">
              Receba pelo que entregou.{' '}
              <span className="text-neutral-500">Sem depender da boa vontade do cliente.</span>
            </h2>
          </motion.div>
          <PersonaTrail data={trilhaFreelancer} />
        </div>
      </section>

      {/* TRILHA PME */}
      <section id="trilha-pme" className="px-6 md:px-12 py-24 border-t border-white/5 bg-purple-500/[0.02]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center">
                {/* @ts-ignore */}
                <iconify-icon icon="solar:buildings-2-bold-duotone" width="22" class="text-purple-400" />
              </div>
              <span className="text-xs uppercase tracking-[0.3em] text-purple-400 font-mono">Para PMEs e Imobiliárias</span>
            </div>
            <h2 className="font-bricolage text-white text-4xl md:text-5xl font-semibold leading-tight">
              Escala sem perder o controle.{' '}
              <span className="text-neutral-500">Cada contrato auditável em segundos.</span>
            </h2>
          </motion.div>
          <PersonaTrail data={trilhaPME} reverse />
        </div>
      </section>

      {/* TRILHA ADVOGADO */}
      <section id="trilha-advogado" className="px-6 md:px-12 py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center">
                {/* @ts-ignore */}
                <iconify-icon icon="solar:scale-bold-duotone" width="22" class="text-pink-400" />
              </div>
              <span className="text-xs uppercase tracking-[0.3em] text-pink-400 font-mono">Para Advogados e Escritórios</span>
            </div>
            <h2 className="font-bricolage text-white text-4xl md:text-5xl font-semibold leading-tight">
              Rastreabilidade que se sustenta em juízo.{' '}
              <span className="text-neutral-500">Independente da plataforma.</span>
            </h2>
          </motion.div>
          <PersonaTrail data={trilhaAdvogado} />
        </div>
      </section>

      {/* COMPARATIVO */}
      <section className="px-6 md:px-12 py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 max-w-3xl"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-emerald-400 font-mono">Comparativo honesto</span>
            <h2 className="font-bricolage text-white text-4xl md:text-5xl font-semibold mt-4 leading-tight">
              Por que não é só mais um <span className="text-neutral-500">DocuSign brasileiro</span>.
            </h2>
          </motion.div>

          <div className="overflow-x-auto rounded-3xl border border-white/8">
            <table className="w-full">
              <thead className="bg-white/[0.03] border-b border-white/8">
                <tr>
                  <th className="text-left p-5 text-xs uppercase tracking-widest text-neutral-400 font-mono">Recurso</th>
                  <th className="text-center p-5 text-sm font-bold text-emerald-400">ContractEase</th>
                  <th className="text-center p-5 text-sm font-bold text-neutral-500">ClickSign</th>
                  <th className="text-center p-5 text-sm font-bold text-neutral-500">DocuSign</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  ['Preço inicial', 'Grátis', 'R$ 80/mês', 'US$ 25/mês'],
                  ['Prova blockchain', '✓ Nativo', '—', '—'],
                  ['Verificação pública sem cadastro', '✓', '—', '—'],
                  ['Templates jurídicos pt-BR', '52 prontos', 'Sim', 'Parcial'],
                  ['Smart contracts / escrow on-chain', '✓ 20+ tipos', '—', '—'],
                  ['Feed de oportunidades', '✓', '—', '—'],
                  ['LGPD nativo', '✓', '✓', 'Parcial'],
                  ['ICP-Brasil', 'Roadmap Q1 2027', '✓', '✓ Add-on'],
                  ['API pública', '✓ Pro+', 'Enterprise', 'Enterprise'],
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white/[0.01]' : ''}>
                    <td className="p-5 text-neutral-300">{row[0]}</td>
                    <td className="p-5 text-center text-emerald-400 font-semibold">{row[1]}</td>
                    <td className="p-5 text-center text-neutral-500">{row[2]}</td>
                    <td className="p-5 text-center text-neutral-500">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-neutral-500 mt-4 italic">
            Honestidade estratégica: ICP-Brasil ainda está em roadmap. Quem precisa especificamente de validade notarial
            equivalente pode aguardar Q1 2027 ou usar nossa integração híbrida.
          </p>
        </div>
      </section>

      {/* PREÇOS */}
      <section id="precos" className="px-6 md:px-12 py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 max-w-3xl"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-emerald-400 font-mono">Planos</span>
            <h2 className="font-bricolage text-white text-4xl md:text-5xl font-semibold mt-4 leading-tight">
              Preço em real. <span className="text-neutral-500">Sem cobrança por assinatura.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                name: 'Free',
                price: 'R$ 0',
                period: '/mês',
                desc: 'Para experimentar',
                features: ['5 contratos/mês', 'Ancoragem básica', '1 template salvo', 'Verificação pública', 'Sem cartão de crédito'],
                cta: 'Começar grátis',
                highlighted: false,
              },
              {
                name: 'Pro',
                price: 'R$ 97',
                period: '/mês',
                desc: 'Mais escolhido',
                features: [
                  'Contratos ilimitados',
                  'Smart contracts ilimitados',
                  'Templates ilimitados',
                  'Análise por IA (100/mês)',
                  'Lembretes automáticos',
                  'Feed de oportunidades',
                  'API básica',
                ],
                cta: 'Assinar Pro',
                highlighted: true,
              },
              {
                name: 'Enterprise',
                price: 'R$ 297',
                period: '/mês',
                desc: 'Para escritórios e cartórios',
                features: [
                  'Tudo do Pro',
                  'Multi-organização',
                  'API completa + Webhooks',
                  'SLA 99,99%',
                  'Suporte dedicado',
                  'White-label disponível',
                  'Integração ICP-Brasil (Q1/2027)',
                ],
                cta: 'Falar com vendas',
                highlighted: false,
              },
            ].map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-3xl p-8 border ${
                  plan.highlighted
                    ? 'bg-emerald-500/[0.04] border-emerald-500/30'
                    : 'bg-white/[0.02] border-white/8'
                } flex flex-col`}
              >
                {plan.highlighted && (
                  <span className="self-start px-3 py-1 mb-4 rounded-full bg-emerald-500 text-black text-[10px] font-bold uppercase tracking-widest">
                    Mais escolhido
                  </span>
                )}
                <h3 className="font-bricolage text-2xl text-white font-semibold">{plan.name}</h3>
                <p className="text-xs text-neutral-500 mt-1">{plan.desc}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="font-bricolage text-5xl text-white font-semibold">{plan.price}</span>
                  <span className="text-sm text-neutral-500">{plan.period}</span>
                </div>
                <ul className="mt-8 space-y-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-neutral-300">
                      {/* @ts-ignore */}
                      <iconify-icon
                        icon="solar:check-circle-bold"
                        width="18"
                        class={`shrink-0 mt-0.5 ${plan.highlighted ? 'text-emerald-400' : 'text-neutral-500'}`}
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={APP_URL}
                  target="_blank"
                  rel="noopener"
                  className={`mt-8 group flex items-center justify-center gap-2 rounded-2xl p-4 font-bold text-sm uppercase tracking-wider transition-colors ${
                    plan.highlighted
                      ? 'bg-emerald-500 text-black hover:bg-emerald-400'
                      : 'bg-white/8 text-white hover:bg-white/15'
                  }`}
                >
                  {plan.cta}
                  {/* @ts-ignore */}
                  <iconify-icon icon="solar:arrow-right-bold" width="16" class="group-hover:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-xs text-neutral-500 mt-8">
            Todos os planos incluem ancoragem na blockchain Stellar. Sem taxa por assinatura individual.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 md:px-12 py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-emerald-400 font-mono">Perguntas frequentes</span>
            <h2 className="font-bricolage text-white text-4xl md:text-5xl font-semibold mt-4 leading-tight">
              O que você ainda precisa saber.
            </h2>
          </motion.div>

          <div className="space-y-3">
            {[
              {
                q: 'Contratos sem ICP-Brasil têm validade jurídica?',
                a: 'Sim. A MP 2.200-2/2001, art. 10, parágrafo 2º, reconhece validade jurídica de assinaturas eletrônicas quando há aceitação entre as partes. O hash on-chain reforça a integridade do documento. Para casos que exigem ICP-Brasil (escrituras, certos atos cartoriais), nossa integração está prevista para Q1/2027.',
              },
              {
                q: 'E se a ContractEase sair do ar amanhã?',
                a: 'A prova continua na blockchain Stellar. Qualquer pessoa, sem cadastro, pode validar diretamente no Stellar Explorer usando o hash do documento. Sua prova não depende da nossa existência.',
              },
              {
                q: 'Preciso entender de blockchain para usar?',
                a: 'Não. A blockchain é transparente para o usuário. Você assina e envia como em qualquer plataforma. A ancoragem on-chain acontece automaticamente no momento em que todas as partes assinam.',
              },
              {
                q: 'Como funciona o escrow do smart contract?',
                a: 'No contrato inteligente de freelancer, por exemplo: o cliente deposita o valor total no início. O dinheiro fica travado na Stellar. A cada entrega aprovada, uma parcela é liberada automaticamente para o freelancer. Se o cliente não responde em 5 dias, o sistema libera por aprovação automática.',
              },
              {
                q: 'Meus dados ficam seguros? E a LGPD?',
                a: 'Sim. Somos LGPD-nativo. Dados pessoais são criptografados em repouso e em trânsito. Mantemos os dados estritamente necessários conforme art. 7 da LGPD. Você pode solicitar exclusão de dados a qualquer momento.',
              },
              {
                q: 'Posso migrar meus contratos antigos?',
                a: 'Sim. No plano Pro e Enterprise você pode fazer upload de contratos já assinados (PDF) e ancorar o hash retroativamente na Stellar. A data on-chain será a de quando você ancorou — não a data original do documento.',
              },
              {
                q: 'Qual o tempo para assinar um contrato?',
                a: 'Da criação à coleta de todas as assinaturas, média de 4 minutos por signatário. A ancoragem on-chain após todas as assinaturas leva 3 a 5 segundos.',
              },
            ].map((item, i) => (
              <FAQItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section id="demonstracao" className="px-6 md:px-12 py-24 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl p-10 md:p-16 border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.06] via-emerald-500/[0.02] to-transparent text-center"
          >
            <h2 className="font-bricolage text-white text-4xl md:text-6xl font-semibold leading-tight">
              Pronto para começar?
            </h2>
            <p className="text-lg text-neutral-300 mt-6 max-w-2xl mx-auto leading-relaxed">
              Sua primeira semana é grátis. Sem cartão de crédito. Cancele quando quiser.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={APP_URL}
                target="_blank"
                rel="noopener"
                className="group flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-emerald-500 text-black font-bold text-sm uppercase tracking-wider hover:bg-emerald-400 transition-colors"
              >
                Criar conta grátis
                {/* @ts-ignore */}
                <iconify-icon icon="solar:arrow-right-bold" width="18" class="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="mailto:contato@contractease.app?subject=Quero%20agendar%20uma%20demonstra%C3%A7%C3%A3o"
                className="group flex items-center justify-center gap-3 px-8 py-4 rounded-2xl border border-white/15 bg-white/[0.03] text-white font-bold text-sm uppercase tracking-wider hover:bg-white/[0.08] transition-colors"
              >
                Agendar demonstração
                {/* @ts-ignore */}
                <iconify-icon icon="solar:calendar-bold-duotone" width="18" />
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 justify-center text-xs text-neutral-500">
              <span className="flex items-center gap-2">
                {/* @ts-ignore */}
                <iconify-icon icon="solar:check-circle-bold" width="14" class="text-emerald-500" />
                Sem cartão de crédito
              </span>
              <span className="flex items-center gap-2">
                {/* @ts-ignore */}
                <iconify-icon icon="solar:check-circle-bold" width="14" class="text-emerald-500" />
                Cancele quando quiser
              </span>
              <span className="flex items-center gap-2">
                {/* @ts-ignore */}
                <iconify-icon icon="solar:check-circle-bold" width="14" class="text-emerald-500" />
                Suporte em português
              </span>
              <a href="/investidores" className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
                {/* @ts-ignore */}
                <iconify-icon icon="solar:chart-square-bold-duotone" width="14" />
                Para investidores
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-base text-white font-semibold">{q}</span>
        {/* @ts-ignore */}
        <iconify-icon
          icon="solar:alt-arrow-down-bold"
          width="20"
          class={`shrink-0 text-neutral-500 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="px-5 pb-5"
        >
          <p className="text-sm text-neutral-400 leading-relaxed">{a}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
