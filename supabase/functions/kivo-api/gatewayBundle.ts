export interface GatewayBundleOptions {
  apiUrl: string;
  gatewayId: string;
  gatewayToken: string;
  gatewayName: string;
  adapter: "raspberry" | "simulator";
  totemName: string;
  totemResource: string;
  price: string;
  asset: string;
  durationSeconds: number;
}

interface ZipFile {
  path: string;
  content: string;
}

const encoder = new TextEncoder();

export function deriveKivoApiUrl(requestUrl: string): string {
  const url = new URL(requestUrl);
  const marker = "/v1/";
  const markerIndex = url.pathname.lastIndexOf(marker);
  if (markerIndex >= 0) {
    url.pathname = url.pathname.slice(0, markerIndex);
  }
  url.search = "";
  url.hash = "";
  return url.toString().replace(/\/$/, "");
}

export function buildGatewayBundleZip(options: GatewayBundleOptions): Uint8Array {
  return createStoredZip(buildGatewayBundleFiles(options));
}

export function buildGatewayBundleFiles(
  options: GatewayBundleOptions,
): ZipFile[] {
  const env = gatewayEnv(options);
  return [
    { path: ".env", content: env },
    { path: ".env.example", content: gatewayEnv({ ...options, gatewayToken: "kgw_replace_me" }) },
    { path: "docker-compose.yml", content: dockerCompose() },
    { path: "README.md", content: bundleReadme(options) },
    { path: "gateway/Dockerfile", content: gatewayDockerfile() },
    { path: "gateway/package.json", content: gatewayPackageJson() },
    { path: "gateway/src/index.js", content: gatewayRuntimeJs() },
    { path: "totem-ui/index.html", content: totemUiHtml(options) },
  ];
}

function gatewayEnv(options: GatewayBundleOptions): string {
  return [
    `KIVO_API_URL=${options.apiUrl}`,
    `KIVO_GATEWAY_ID=${options.gatewayId}`,
    `KIVO_GATEWAY_TOKEN=${options.gatewayToken}`,
    `KIVO_GATEWAY_NAME=${escapeEnv(options.gatewayName)}`,
    `KIVO_TOTEM_NAME=${escapeEnv(options.totemName)}`,
    `KIVO_TOTEM_RESOURCE=${options.totemResource}`,
    `KIVO_SESSION_DURATION_SECONDS=${options.durationSeconds}`,
    `KIVO_GATEWAY_ADAPTER=${options.adapter}`,
    "KIVO_GATEWAY_POLL_INTERVAL_MS=3000",
    "KIVO_LOCAL_API_PORT=8787",
    "KIVO_DATABASE_URL=postgres://kivo:kivo@local-db:5432/kivo_gateway",
    "KIVO_GATEWAY_ENABLE_COMMAND=",
    "KIVO_GATEWAY_DISABLE_COMMAND=",
    "POSTGRES_DB=kivo_gateway",
    "POSTGRES_USER=kivo",
    "POSTGRES_PASSWORD=kivo",
    "",
  ].join("\n");
}

function escapeEnv(value: string): string {
  if (/^[A-Za-z0-9._:/@ -]+$/.test(value)) {
    return value;
  }
  return JSON.stringify(value);
}

function dockerCompose(): string {
  return `services:
  local-db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: \${POSTGRES_DB}
      POSTGRES_USER: \${POSTGRES_USER}
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
    volumes:
      - kivo-local-db:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U \${POSTGRES_USER} -d \${POSTGRES_DB}"]
      interval: 5s
      timeout: 5s
      retries: 12

  gateway:
    build: ./gateway
    restart: unless-stopped
    env_file: .env
    depends_on:
      local-db:
        condition: service_healthy
    ports:
      - "\${KIVO_LOCAL_API_PORT:-8787}:8787"

  totem-ui:
    image: nginx:1.27-alpine
    restart: unless-stopped
    volumes:
      - ./totem-ui:/usr/share/nginx/html:ro
    ports:
      - "8088:80"
    depends_on:
      - gateway

volumes:
  kivo-local-db:
`;
}

function gatewayDockerfile(): string {
  return `FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY src ./src
EXPOSE 8787
CMD ["node", "src/index.js"]
`;
}

function gatewayPackageJson(): string {
  return `${JSON.stringify({
    name: "@kivo/power-totem-runtime",
    version: "0.1.0",
    private: true,
    type: "module",
    scripts: {
      start: "node src/index.js",
    },
    dependencies: {
      pg: "^8.13.1",
    },
  }, null, 2)}
`;
}

function bundleReadme(options: GatewayBundleOptions): string {
  return `# Kivo Power Totem Local Gateway

Este pacote foi gerado pelo Kivo para rodar o Power Totem perto do recurso real.

## O que vem aqui

- Docker Compose com Gateway local, Postgres local e UI local do totem.
- Gateway ID: \`${options.gatewayId}\`
- Recurso protegido: \`${options.totemResource}\`
- Preco configurado: \`${options.price} ${options.asset}\`
- Duracao por sessao: \`${options.durationSeconds}s\`

## Rodar no Raspberry Pi ou mini PC

\`\`\`bash
docker compose up --build
\`\`\`

Depois abra:

- UI local do totem: http://localhost:8088
- Health local do gateway: http://localhost:8787/health
- Status local: http://localhost:8787/status

## Acionar hardware real

Por seguranca, o pacote nao liga energia de parede diretamente. Use baixa tensao e um script seu para relay/GPIO/controlador.

Edite o arquivo \`.env\`:

\`\`\`txt
KIVO_GATEWAY_ADAPTER=raspberry
KIVO_GATEWAY_ENABLE_COMMAND=node ./relay-on.js
KIVO_GATEWAY_DISABLE_COMMAND=node ./relay-off.js
\`\`\`

O Gateway passa estas variaveis para os comandos:

- \`KIVO_SESSION_ID\`
- \`KIVO_DURATION_SECONDS\`
- \`KIVO_TOTEM_RESOURCE\`

## Como funciona

1. O Gateway local envia heartbeat para a Kivo API.
2. A Kivo API so retorna autorizacao quando existe uma sessao paga e autorizada por x402/Stellar.
3. O Gateway registra \`session.started\`, executa o comando local e guarda evento no banco local.
4. Ao terminar, registra \`session.completed\` usando apenas o Gateway token.
5. Se a internet cair durante um evento, ele fica na fila local de retry.
`;
}

function gatewayRuntimeJs(): string {
  return `import http from "node:http";
import { execFile } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import pg from "pg";

const { Pool } = pg;

const env = (key, fallback = "") => {
  const value = process.env[key]?.trim();
  return value || fallback;
};

const required = (key) => {
  const value = env(key);
  if (!value) throw new Error(\`\${key} is required\`);
  return value;
};

const config = {
  apiUrl: required("KIVO_API_URL").replace(/\\/+$/, ""),
  gatewayId: required("KIVO_GATEWAY_ID"),
  gatewayToken: required("KIVO_GATEWAY_TOKEN"),
  gatewayName: env("KIVO_GATEWAY_NAME", "Kivo Gateway"),
  totemName: env("KIVO_TOTEM_NAME", "Power Totem"),
  totemResource: env("KIVO_TOTEM_RESOURCE", "/power-totem/session"),
  adapter: env("KIVO_GATEWAY_ADAPTER", "raspberry"),
  pollIntervalMs: Number(env("KIVO_GATEWAY_POLL_INTERVAL_MS", "3000")),
  port: Number(env("KIVO_LOCAL_API_PORT", "8787")),
  enableCommand: env("KIVO_GATEWAY_ENABLE_COMMAND"),
  disableCommand: env("KIVO_GATEWAY_DISABLE_COMMAND"),
  databaseUrl: required("KIVO_DATABASE_URL"),
};

const pool = new Pool({ connectionString: config.databaseUrl });
let polling = false;
let lastAuthorizationId = "";

async function initDb() {
  await pool.query(\`
    create table if not exists gateway_state (
      key text primary key,
      value jsonb not null,
      updated_at timestamptz not null default now()
    );
    create table if not exists gateway_events (
      id bigserial primary key,
      event_type text not null,
      session_id text,
      payload jsonb not null default '{}'::jsonb,
      synced_at timestamptz,
      error text,
      created_at timestamptz not null default now()
    );
    create table if not exists retry_queue (
      id bigserial primary key,
      method text not null,
      path text not null,
      body jsonb,
      attempts integer not null default 0,
      next_attempt_at timestamptz not null default now(),
      last_error text,
      created_at timestamptz not null default now()
    );
  \`);
  await setState("runtime", {
    status: "booted",
    gatewayId: config.gatewayId,
    gatewayName: config.gatewayName,
    totemName: config.totemName,
    adapter: config.adapter,
    updatedAt: new Date().toISOString(),
  });
}

async function setState(key, value) {
  await pool.query(
    "insert into gateway_state (key, value, updated_at) values ($1, $2, now()) on conflict (key) do update set value = excluded.value, updated_at = now()",
    [key, value],
  );
}

async function getState() {
  const result = await pool.query("select key, value, updated_at from gateway_state order by key asc");
  return Object.fromEntries(result.rows.map((row) => [row.key, { ...row.value, updatedAt: row.updated_at }]));
}

async function insertLocalEvent(eventType, sessionId, payload, syncedAt = null, error = null) {
  await pool.query(
    "insert into gateway_events (event_type, session_id, payload, synced_at, error) values ($1, $2, $3, $4, $5)",
    [eventType, sessionId ?? null, payload ?? {}, syncedAt, error],
  );
}

async function enqueueRetry(method, path, body, error) {
  await pool.query(
    "insert into retry_queue (method, path, body, attempts, next_attempt_at, last_error) values ($1, $2, $3, 0, now() + interval '5 seconds', $4)",
    [method, path, body ?? null, error instanceof Error ? error.message : String(error)],
  );
}

async function apiRequest(path, init = {}) {
  const headers = new Headers(init.headers);
  headers.set("x-gateway-token", config.gatewayToken);
  if (init.body && !headers.has("content-type")) headers.set("content-type", "application/json");
  const response = await fetch(\`\${config.apiUrl}\${path}\`, { ...init, headers });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || \`Kivo API request failed with \${response.status}\`);
  }
  return response.status === 204 ? null : await response.json();
}

async function heartbeat() {
  const gateway = await apiRequest(\`/v1/gateways/\${encodeURIComponent(config.gatewayId)}/heartbeat\`, { method: "POST" });
  await setState("gateway", { status: gateway.status, lastSeenAt: gateway.lastSeenAt, updatedAt: new Date().toISOString() });
  await insertLocalEvent("gateway.heartbeat", null, { status: gateway.status }, new Date());
  return gateway;
}

async function authorization() {
  const result = await apiRequest(\`/v1/gateways/\${encodeURIComponent(config.gatewayId)}/authorization\`);
  await setState("authorization", { hasAuthorization: Boolean(result.authorization), authorization: result.authorization, updatedAt: new Date().toISOString() });
  return result.authorization;
}

async function sendGatewayEvent(eventType, sessionId, payload) {
  const body = { eventType, sessionId, payload };
  const path = \`/v1/gateways/\${encodeURIComponent(config.gatewayId)}/events\`;
  try {
    const response = await apiRequest(path, { method: "POST", body: JSON.stringify(body) });
    await insertLocalEvent(eventType, sessionId, payload, new Date());
    return response;
  } catch (error) {
    await insertLocalEvent(eventType, sessionId, payload, null, error instanceof Error ? error.message : String(error));
    await enqueueRetry("POST", path, body, error);
    throw error;
  }
}

async function retryQueuedEvents() {
  const due = await pool.query("select * from retry_queue where next_attempt_at <= now() order by id asc limit 5");
  for (const item of due.rows) {
    try {
      await apiRequest(item.path, { method: item.method, body: item.body ? JSON.stringify(item.body) : undefined });
      await pool.query("delete from retry_queue where id = $1", [item.id]);
    } catch (error) {
      await pool.query(
        "update retry_queue set attempts = attempts + 1, next_attempt_at = now() + make_interval(secs => least(300, power(2, attempts + 1)::int)), last_error = $2 where id = $1",
        [item.id, error instanceof Error ? error.message : String(error)],
      );
    }
  }
}

async function runCommand(command, authorization) {
  if (!command) return;
  const [file, ...args] = command.split(" ").filter(Boolean);
  await new Promise((resolve, reject) => {
    execFile(file, args, {
      env: {
        ...process.env,
        KIVO_SESSION_ID: authorization.id,
        KIVO_DURATION_SECONDS: String(authorization.durationSeconds),
        KIVO_TOTEM_RESOURCE: config.totemResource,
      },
    }, (error) => error ? reject(error) : resolve());
  });
}

async function runAuthorizedSession(current) {
  if (!current || current.id === lastAuthorizationId) return;
  lastAuthorizationId = current.id;
  await setState("runtime", { status: "running", sessionId: current.id, updatedAt: new Date().toISOString() });
  await sendGatewayEvent("session.started", current.id, { adapter: config.adapter, durationSeconds: current.durationSeconds });
  await runCommand(config.enableCommand, current);
  await sleep(Math.max(0, Number(current.durationSeconds ?? 0)) * 1000);
  await runCommand(config.disableCommand, current);
  await sendGatewayEvent("session.completed", current.id, { adapter: config.adapter, durationSeconds: current.durationSeconds });
  await setState("runtime", { status: "idle", lastSessionId: current.id, updatedAt: new Date().toISOString() });
}

async function pollOnce() {
  await retryQueuedEvents();
  await heartbeat();
  const current = await authorization();
  if (current) await runAuthorizedSession(current);
}

async function startLoop() {
  if (polling) return;
  polling = true;
  while (polling) {
    try {
      await pollOnce();
    } catch (error) {
      await setState("runtime", { status: "degraded", error: error instanceof Error ? error.message : String(error), updatedAt: new Date().toISOString() });
    }
    await sleep(config.pollIntervalMs);
  }
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "content-type": "application/json",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type",
  });
  res.end(JSON.stringify(payload));
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") return sendJson(res, 204, {});
  try {
    if (req.url === "/health") return sendJson(res, 200, { ok: true, gatewayId: config.gatewayId, adapter: config.adapter });
    if (req.url === "/status") return sendJson(res, 200, await getState());
    if (req.url === "/poll" && req.method === "POST") {
      await pollOnce();
      return sendJson(res, 200, await getState());
    }
    if (req.url === "/start" && req.method === "POST") {
      void startLoop();
      return sendJson(res, 202, { started: true });
    }
    sendJson(res, 404, { error: "not_found" });
  } catch (error) {
    sendJson(res, 500, { error: error instanceof Error ? error.message : String(error) });
  }
});

await initDb();
server.listen(config.port, () => {
  console.log(\`Kivo local Gateway listening on :\${config.port}\`);
});
void startLoop();
`;
}

function totemUiHtml(options: GatewayBundleOptions): string {
  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Kivo Power Totem</title>
    <style>
      :root { color-scheme: dark; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background:
          radial-gradient(circle at 18% 18%, rgba(16, 185, 129, .2), transparent 28%),
          radial-gradient(circle at 82% 78%, rgba(14, 165, 233, .14), transparent 30%),
          #030712;
        color: #f8fafc;
      }
      main { min-height: 100vh; display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(320px, .95fr); gap: 28px; padding: 32px; }
      .hero, .panel { border: 1px solid rgba(255,255,255,.1); background: rgba(2, 6, 23, .72); box-shadow: 0 24px 80px rgba(0,0,0,.35); }
      .hero { display: flex; min-height: calc(100vh - 64px); flex-direction: column; justify-content: space-between; border-radius: 28px; padding: clamp(24px, 4vw, 44px); }
      .panel { border-radius: 24px; padding: 24px; }
      .eyebrow { margin: 0 0 12px; color: #34d399; font-size: 12px; font-weight: 900; letter-spacing: .18em; text-transform: uppercase; }
      h1 { margin: 0; max-width: 780px; font-size: clamp(42px, 7vw, 92px); line-height: .96; letter-spacing: 0; }
      h2 { margin: 0; font-size: clamp(28px, 4vw, 48px); line-height: 1.05; letter-spacing: 0; }
      p { color: #94a3b8; line-height: 1.65; }
      code { color: #a7f3d0; word-break: break-all; }
      .status { display: inline-flex; align-items: center; gap: 10px; width: fit-content; border: 1px solid rgba(245, 158, 11, .28); border-radius: 999px; background: rgba(245, 158, 11, .12); padding: 10px 14px; color: #fde68a; font-size: 13px; font-weight: 900; text-transform: uppercase; letter-spacing: .08em; }
      .status::before { content: ""; width: 10px; height: 10px; border-radius: 999px; background: currentColor; box-shadow: 0 0 18px currentColor; }
      .status.ready { border-color: rgba(52, 211, 153, .32); background: rgba(16, 185, 129, .12); color: #6ee7b7; }
      .status.active { border-color: rgba(34, 211, 238, .34); background: rgba(14, 165, 233, .14); color: #67e8f9; }
      .status.offline { border-color: rgba(248, 113, 113, .34); background: rgba(239, 68, 68, .12); color: #fca5a5; }
      .checkout { display: grid; grid-template-columns: minmax(190px, 280px) 1fr; gap: 24px; align-items: center; margin-top: 32px; }
      .qr { display: grid; aspect-ratio: 1; grid-template-columns: repeat(9, 1fr); gap: 6px; border-radius: 28px; background: #fff; padding: 18px; }
      .qr span { border-radius: 4px; background: #030712; }
      .qr span.empty { background: #fff; }
      .metrics { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin-top: 32px; }
      .metric { border: 1px solid rgba(255,255,255,.08); border-radius: 18px; background: rgba(15, 23, 42, .65); padding: 16px; }
      .metric small { display: block; color: #64748b; font-size: 11px; font-weight: 900; letter-spacing: .12em; text-transform: uppercase; }
      .metric strong { display: block; margin-top: 6px; color: #f8fafc; font-size: 18px; overflow-wrap: anywhere; }
      .side { display: flex; min-height: calc(100vh - 64px); flex-direction: column; gap: 16px; }
      .output { border-color: rgba(16, 185, 129, .2); background: linear-gradient(180deg, rgba(16, 185, 129, .12), rgba(2, 6, 23, .72)); }
      .lock { display: grid; width: 76px; height: 76px; place-items: center; border-radius: 22px; background: rgba(16, 185, 129, .12); color: #6ee7b7; font-size: 42px; }
      .resource { margin-top: 14px; border: 1px solid rgba(255,255,255,.08); border-radius: 18px; background: rgba(0,0,0,.28); padding: 14px; }
      details { margin-top: auto; color: #94a3b8; }
      summary { cursor: pointer; color: #cbd5e1; font-weight: 800; }
      .diag { margin-top: 12px; display: grid; gap: 8px; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 12px; color: #94a3b8; }
      @media (max-width: 920px) {
        main { grid-template-columns: 1fr; padding: 18px; }
        .hero, .side { min-height: auto; }
        .checkout { grid-template-columns: 1fr; }
        .qr { max-width: 280px; }
        .metrics { grid-template-columns: 1fr; }
      }
    </style>
  </head>
  <body>
    <main>
      <section class="hero">
        <div>
          <p class="eyebrow">Kivo Power Totem</p>
          <h1>${escapeHtml(options.totemName)}</h1>
          <p>Aproxime a camera ou siga o checkout Kivo para liberar este recurso por ${options.durationSeconds}s com autorizacao x402/Stellar.</p>
          <span id="stateBadge" class="status">Aguardando pagamento</span>
        </div>

        <div class="checkout" aria-label="Checkout Kivo">
          <div class="qr" id="qr" aria-hidden="true"></div>
          <div>
            <h2 id="stateTitle">Escaneie para energizar</h2>
            <p id="stateCopy">Quando a Kivo confirmar a autorizacao, a saida local abre automaticamente e esta tela muda para sessao ativa.</p>
            <div class="resource">
              <p class="eyebrow">Recurso protegido</p>
              <code>${escapeHtml(options.totemResource)}</code>
            </div>
          </div>
        </div>

        <div class="metrics">
          <div class="metric"><small>Preco</small><strong>${escapeHtml(options.price)} ${escapeHtml(options.asset)}</strong></div>
          <div class="metric"><small>Duracao</small><strong>${options.durationSeconds}s</strong></div>
          <div class="metric"><small>Gateway</small><strong id="gatewayLabel">Conectando</strong></div>
        </div>
      </section>

      <aside class="side">
        <section class="panel output">
          <div class="lock" id="outputIcon">ON</div>
          <h2 id="outputTitle" style="margin-top: 22px;">Saida protegida</h2>
          <p id="outputCopy">O totem esta pronto para liberar o recurso quando uma sessao paga chegar da Kivo API.</p>
        </section>

        <section class="panel">
          <p class="eyebrow">Como usar</p>
          <p>Abra o checkout Kivo no celular, conclua a autorizacao em USDC/Stellar e mantenha esta tela aberta no equipamento local.</p>
          <p>O gateway inicia sozinho dentro do Docker e consulta a Kivo API continuamente.</p>
        </section>

        <details class="panel">
          <summary>Diagnostico do gateway</summary>
          <div class="diag">
            <span>Runtime: <strong id="runtimeLabel">carregando</strong></span>
            <span>Ultima atualizacao: <strong id="updatedAtLabel">-</strong></span>
            <span id="errorLabel"></span>
          </div>
        </details>
      </aside>
    </main>
    <script>
      const api = 'http://localhost:8787';
      const qr = document.getElementById('qr');
      for (let index = 0; index < 81; index += 1) {
        const row = Math.floor(index / 9);
        const col = index % 9;
        const finder = (row < 3 && col < 3) || (row < 3 && col > 5) || (row > 5 && col < 3);
        const filled = finder || ((row * 7 + col * 5 + index) % 4 !== 0);
        const cell = document.createElement('span');
        if (!filled) cell.className = 'empty';
        qr.appendChild(cell);
      }

      function setText(id, value) {
        document.getElementById(id).textContent = value;
      }

      function applyState(status) {
        const runtime = status.runtime || {};
        const gateway = status.gateway || {};
        const auth = status.authorization || {};
        const runtimeStatus = runtime.status || 'idle';
        const badge = document.getElementById('stateBadge');
        badge.className = 'status';
        setText('gatewayLabel', gateway.status === 'online' ? 'Online' : gateway.updatedAt ? 'Sincronizado' : 'Conectando');
        setText('runtimeLabel', runtimeStatus);
        setText('updatedAtLabel', runtime.updatedAt || gateway.updatedAt || '-');
        setText('errorLabel', runtime.error ? 'Atencao: ' + runtime.error : '');

        if (runtimeStatus === 'running' || auth.hasAuthorization) {
          badge.classList.add('active');
          setText('stateBadge', 'Sessao ativa');
          setText('stateTitle', 'Energia liberada');
          setText('stateCopy', 'A autorizacao foi confirmada. A saida local esta ativa pelo tempo contratado.');
          setText('outputIcon', 'ON');
          setText('outputTitle', 'Saida ativa');
          setText('outputCopy', 'O gateway executou a liberacao local e vai encerrar a sessao automaticamente.');
          return;
        }

        if (runtimeStatus === 'degraded') {
          badge.classList.add('offline');
          setText('stateBadge', 'Gateway precisa de atencao');
          setText('stateTitle', 'Conexao local instavel');
          setText('stateCopy', 'O checkout continua protegido, mas o gateway local precisa voltar a sincronizar para liberar a saida.');
          setText('outputIcon', 'OFF');
          setText('outputTitle', 'Saida bloqueada');
          setText('outputCopy', 'Verifique internet, variaveis do bundle e status do container gateway.');
          return;
        }

        badge.classList.add('ready');
        setText('stateBadge', 'Aguardando pagamento');
        setText('stateTitle', 'Escaneie para energizar');
        setText('stateCopy', 'Quando a Kivo confirmar a autorizacao, a saida local abre automaticamente e esta tela muda para sessao ativa.');
        setText('outputIcon', 'ON');
        setText('outputTitle', 'Saida protegida');
        setText('outputCopy', 'O totem esta pronto para liberar o recurso quando uma sessao paga chegar da Kivo API.');
      }

      async function refresh() {
        try {
          const response = await fetch(api + '/status');
          applyState(await response.json());
        } catch (_error) {
          applyState({ runtime: { status: 'degraded', error: 'runtime local indisponivel' } });
        }
      }

      refresh();
      setInterval(refresh, 3000);
    </script>
  </body>
</html>
`;
}

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(
    ">",
    "&gt;",
  ).replaceAll('"', "&quot;");
}

function createStoredZip(files: ZipFile[]): Uint8Array {
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;

  for (const file of files) {
    const name = encoder.encode(file.path);
    const data = encoder.encode(file.content);
    const crc = crc32(data);
    const localHeader = concat([
      u32(0x04034b50),
      u16(20),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(crc),
      u32(data.length),
      u32(data.length),
      u16(name.length),
      u16(0),
      name,
    ]);
    const centralHeader = concat([
      u32(0x02014b50),
      u16(20),
      u16(20),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(crc),
      u32(data.length),
      u32(data.length),
      u16(name.length),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(0),
      u32(offset),
      name,
    ]);
    localParts.push(localHeader, data);
    centralParts.push(centralHeader);
    offset += localHeader.length + data.length;
  }

  const centralOffset = offset;
  const centralDirectory = concat(centralParts);
  const end = concat([
    u32(0x06054b50),
    u16(0),
    u16(0),
    u16(files.length),
    u16(files.length),
    u32(centralDirectory.length),
    u32(centralOffset),
    u16(0),
  ]);

  return concat([...localParts, centralDirectory, end]);
}

function concat(parts: Uint8Array[]): Uint8Array {
  const size = parts.reduce((total, part) => total + part.length, 0);
  const output = new Uint8Array(size);
  let offset = 0;
  for (const part of parts) {
    output.set(part, offset);
    offset += part.length;
  }
  return output;
}

function u16(value: number): Uint8Array {
  const output = new Uint8Array(2);
  new DataView(output.buffer).setUint16(0, value, true);
  return output;
}

function u32(value: number): Uint8Array {
  const output = new Uint8Array(4);
  new DataView(output.buffer).setUint32(0, value >>> 0, true);
  return output;
}

let crcTable: Uint32Array | undefined;

function crc32(bytes: Uint8Array): number {
  const table = crcTable ?? (crcTable = makeCrcTable());
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc = table[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeCrcTable(): Uint32Array {
  const table = new Uint32Array(256);
  for (let index = 0; index < 256; index += 1) {
    let current = index;
    for (let bit = 0; bit < 8; bit += 1) {
      current = current & 1 ? 0xedb88320 ^ (current >>> 1) : current >>> 1;
    }
    table[index] = current >>> 0;
  }
  return table;
}
