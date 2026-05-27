import "@supabase/functions-js/edge-runtime.d.ts";
import {
  Address,
  BASE_FEE,
  Contract,
  Keypair,
  Networks,
  Operation,
  TransactionBuilder,
  nativeToScVal,
  rpc as SorobanRpc,
  xdr,
} from "@stellar/stellar-sdk";

// ─── ENV ────────────────────────────────────────────────────────────────────

const env = (key: string, fallback = "") =>
  Deno.env.get(key)?.trim() || fallback;

const supabaseUrl = () => env("SUPABASE_URL").replace(/\/$/, "");
const serviceRole = () => env("SUPABASE_SERVICE_ROLE_KEY");
const anonKey = () =>
  env("SUPABASE_ANON_KEY") || env("SUPABASE_PUBLISHABLE_KEY");
const sponsorSecret = () =>
  env("SOROBAN_SPONSOR_SECRET") || env("STELLAR_SECRET_KEY");

const TESTNET_RPC = "https://soroban-testnet.stellar.org";
const MAINNET_RPC = "https://soroban-rpc.stellar.org";

// ─── CORS ───────────────────────────────────────────────────────────────────

const corsHeaders = (req: Request): Record<string, string> => {
  const origin = req.headers.get("Origin") ?? "";
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Headers":
      "authorization,apikey,content-type,x-client-info",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Vary": "Origin",
  };
};

const json = (req: Request, status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(req), "Content-Type": "application/json" },
  });

// ─── AUTH ───────────────────────────────────────────────────────────────────

async function requireUser(
  req: Request,
): Promise<{ id: string; email?: string }> {
  const auth = req.headers.get("Authorization") ?? "";
  const token = auth.replace(/^Bearer\s+/i, "");
  if (!token) throw new DeployError(401, "unauthorized", "Token JWT ausente.");

  const base = supabaseUrl();
  if (!base) throw new DeployError(503, "supabase_missing", "SUPABASE_URL não configurado.");

  const res = await fetch(`${base}/auth/v1/user`, {
    headers: {
      apikey: anonKey(),
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new DeployError(401, "unauthorized", "Token inválido.");
  const user = (await res.json()) as { id?: string; email?: string };
  if (!user.id) throw new DeployError(401, "unauthorized", "Usuário não encontrado.");
  return { id: user.id, email: user.email };
}

// ─── ERRORS ─────────────────────────────────────────────────────────────────

class DeployError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly stage?: string,
  ) {
    super(message);
  }
}

// ─── WASM LOADER ────────────────────────────────────────────────────────────

async function loadWasm(templateId: string): Promise<Uint8Array> {
  const base = supabaseUrl();
  const key = serviceRole();
  if (!base || !key) {
    throw new DeployError(
      503,
      "supabase_missing",
      "SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são necessários para carregar o WASM.",
      "wasm_load",
    );
  }

  const url =
    `${base}/storage/v1/object/contracts-wasm/${templateId}.wasm`;
  const res = await fetch(url, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    if (res.status === 404) {
      throw new DeployError(
        404,
        "wasm_not_found",
        `WASM para o template "${templateId}" não encontrado no bucket "contracts-wasm". ` +
          `Execute scripts/build-all.sh && scripts/upload-wasms.sh para compilar e subir os WASMs.`,
        "wasm_load",
      );
    }
    throw new DeployError(
      502,
      "wasm_fetch_failed",
      `Falha ao buscar WASM (${res.status}): ${detail}`,
      "wasm_load",
    );
  }

  const buf = await res.arrayBuffer();
  return new Uint8Array(buf);
}

// ─── SCALAR PAYLOAD → ScVal ──────────────────────────────────────────────────

type ScValPayload =
  | { type: "address"; value: string }
  | { type: "i128"; value: string }
  | { type: "u32"; value: number }
  | { type: "u64"; value: string }
  | { type: "bool"; value: boolean }
  | { type: "string"; value: string }
  | { type: "bytes"; value: string }
  | { type: "option"; value: ScValPayload | null }
  | { type: "vec"; value: ScValPayload[] }
  | { type: "struct"; value: Record<string, ScValPayload> };

function payloadToScVal(p: ScValPayload): xdr.ScVal {
  switch (p.type) {
    case "address":
      return Address.fromString(p.value).toScVal();
    case "i128":
      return nativeToScVal(BigInt(p.value), { type: "i128" });
    case "u32":
      return xdr.ScVal.scvU32(p.value);
    case "u64":
      return nativeToScVal(BigInt(p.value), { type: "u64" });
    case "bool":
      return xdr.ScVal.scvBool(p.value);
    case "string":
      return xdr.ScVal.scvString(p.value);
    case "bytes":
      return xdr.ScVal.scvBytes(
        Uint8Array.from(
          (p.value.match(/.{1,2}/g) ?? []).map((b: string) =>
            parseInt(b, 16)
          ),
        ),
      );
    case "option":
      return p.value === null
        ? xdr.ScVal.scvVoid()
        : payloadToScVal(p.value);
    case "vec":
      return xdr.ScVal.scvVec(p.value.map(payloadToScVal));
    case "struct": {
      const entries = Object.entries(p.value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(
          ([k, v]) =>
            new xdr.ScMapEntry({
              key: xdr.ScVal.scvSymbol(k),
              val: payloadToScVal(v),
            }),
        );
      return xdr.ScVal.scvMap(entries);
    }
  }
}

// ─── TX HELPERS ─────────────────────────────────────────────────────────────

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

async function sendAndWait(
  rpc: SorobanRpc.Server,
  tx: ReturnType<TransactionBuilder["build"]>,
  sponsor: Keypair,
): Promise<{ hash: string; ledger?: number }> {
  const prepared = await rpc.prepareTransaction(tx);
  prepared.sign(sponsor);

  const sent = await rpc.sendTransaction(prepared);
  if (sent.status === "ERROR") {
    const detail = sent.errorResult
      ? JSON.stringify(sent.errorResult)
      : "erro desconhecido";
    throw new Error(`Envio falhou: ${detail}`);
  }

  for (let i = 0; i < 40; i++) {
    await delay(3000);
    const result = await rpc.getTransaction(sent.hash);
    if (
      result.status !== "NOT_FOUND" &&
      (result.status as string) !== "PENDING"
    ) {
      if (result.status !== "SUCCESS") {
        throw new Error(
          `Tx ${sent.hash} terminou com status ${result.status}`,
        );
      }
      return { hash: sent.hash, ledger: result.ledger };
    }
  }
  throw new Error(`Timeout aguardando confirmação da tx ${sent.hash}`);
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ─── DB UPDATE ──────────────────────────────────────────────────────────────

async function updateContractAddress(
  contractId: string,
  contractAddress: string,
): Promise<void> {
  const base = supabaseUrl();
  const key = serviceRole();
  if (!base || !key) return; // silencioso se DB não configurado

  // Tenta atualizar a tabela `contracts` — se não existir, ignora o erro.
  await fetch(
    `${base}/rest/v1/contracts?id=eq.${encodeURIComponent(contractId)}`,
    {
      method: "PATCH",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        soroban_contract_address: contractAddress,
        soroban_deployed_at: new Date().toISOString(),
      }),
    },
  ).catch(() => {/* silencioso */});
}

// ─── DEPLOY ─────────────────────────────────────────────────────────────────

async function deployContract(body: {
  contractId: string;
  templateId: string;
  initArgs: ScValPayload[];
  network: "testnet" | "mainnet";
}) {
  const { contractId, templateId, initArgs, network } = body;

  // 1. Sponsor keypair
  const secret = sponsorSecret();
  if (!secret) {
    throw new DeployError(
      503,
      "sponsor_not_configured",
      "SOROBAN_SPONSOR_SECRET não configurado. " +
        "Adicione um keypair Stellar com XLM nos secrets do Supabase.",
      "setup",
    );
  }
  const sponsor = Keypair.fromSecret(secret);
  const passphrase = network === "mainnet" ? Networks.PUBLIC : Networks.TESTNET;
  const rpcUrl = network === "mainnet" ? MAINNET_RPC : TESTNET_RPC;
  const rpc = new SorobanRpc.Server(rpcUrl);

  // 2. Carregar WASM do Storage
  const wasmBytes = await loadWasm(templateId);

  // 3. Upload WASM
  const sponsorAccount = await rpc.getAccount(sponsor.publicKey()).catch(() => {
    throw new DeployError(
      502,
      "sponsor_account_not_found",
      `Conta do sponsor (${sponsor.publicKey()}) não encontrada na ${network}. ` +
        `Certifique-se de que a conta existe e tem XLM suficiente.`,
      "upload_wasm",
    );
  });

  const uploadTx = new TransactionBuilder(sponsorAccount, {
    fee: BASE_FEE,
    networkPassphrase: passphrase,
  })
    .addOperation(Operation.uploadContractWasm({ wasm: wasmBytes }))
    .setTimeout(180)
    .build();

  const uploadResult = await sendAndWait(rpc, uploadTx, sponsor)
    .catch((err) => {
      throw new DeployError(502, "upload_failed", err.message, "upload_wasm");
    });

  // Extrair o wasmHash do resultado da tx
  const uploadMeta = await rpc.getTransaction(uploadResult.hash);
  let wasmHash: string;
  if (uploadMeta.status === "SUCCESS" && uploadMeta.returnValue) {
    const hashBytes = uploadMeta.returnValue.bytes();
    wasmHash = [...hashBytes].map((b) => b.toString(16).padStart(2, "0")).join(
      "",
    );
  } else {
    throw new DeployError(
      502,
      "wasm_hash_missing",
      "Não foi possível extrair o wasmHash após upload.",
      "upload_wasm",
    );
  }

  // 4. Criar instância do contrato
  const sponsorAccountAfterUpload = await rpc.getAccount(sponsor.publicKey());
  const salt = crypto.getRandomValues(new Uint8Array(32));

  const createTx = new TransactionBuilder(sponsorAccountAfterUpload, {
    fee: BASE_FEE,
    networkPassphrase: passphrase,
  })
    .addOperation(
      Operation.createCustomContract({
        address: new Address(sponsor.publicKey()),
        wasmHash: hexToBytes(wasmHash),
        salt,
      }),
    )
    .setTimeout(180)
    .build();

  const createResult = await sendAndWait(rpc, createTx, sponsor)
    .catch((err) => {
      throw new DeployError(502, "create_failed", err.message, "create_contract");
    });

  // Extrair endereço do contrato
  const createMeta = await rpc.getTransaction(createResult.hash);
  let contractAddress: string;
  if (createMeta.status === "SUCCESS" && createMeta.returnValue) {
    contractAddress = Address.fromScVal(createMeta.returnValue).toString();
  } else {
    throw new DeployError(
      502,
      "contract_address_missing",
      "Não foi possível extrair o endereço do contrato após criação.",
      "create_contract",
    );
  }

  // 5. Chamar init(...)
  const sponsorAccountFinal = await rpc.getAccount(sponsor.publicKey());
  const contract = new Contract(contractAddress);
  const scArgs = initArgs.map(payloadToScVal);

  const initTxRaw = new TransactionBuilder(sponsorAccountFinal, {
    fee: BASE_FEE,
    networkPassphrase: passphrase,
  })
    .addOperation(contract.call("init", ...scArgs))
    .setTimeout(180)
    .build();

  const initResult = await sendAndWait(rpc, initTxRaw, sponsor)
    .catch((err) => {
      throw new DeployError(502, "init_failed", err.message, "init");
    });

  // 6. Persistir endereço no DB (best-effort)
  await updateContractAddress(contractId, contractAddress);

  return {
    success: true,
    contractAddress,
    wasmHash,
    uploadTx: uploadResult.hash,
    createTx: createResult.hash,
    initTx: initResult.hash,
    network,
  };
}

// ─── HANDLER ────────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(req) });
  }

  if (req.method !== "POST") {
    return json(req, 405, {
      error: "method_not_allowed",
      message: "Apenas POST é aceito.",
    });
  }

  try {
    await requireUser(req);

    const body = await req.json().catch(() => null);
    if (!body) {
      return json(req, 400, {
        error: "invalid_body",
        message: "Body JSON inválido.",
      });
    }

    const { contractId, templateId, initArgs, network } = body as {
      contractId?: string;
      templateId?: string;
      initArgs?: unknown;
      network?: string;
    };

    if (!contractId || !templateId) {
      return json(req, 400, {
        error: "missing_fields",
        message: "contractId e templateId são obrigatórios.",
      });
    }

    const net = network === "mainnet" ? "mainnet" : "testnet";
    const args = Array.isArray(initArgs) ? (initArgs as ScValPayload[]) : [];

    const result = await deployContract({
      contractId,
      templateId,
      initArgs: args,
      network: net,
    });

    return json(req, 200, result);
  } catch (err) {
    if (err instanceof DeployError) {
      return json(req, err.status, {
        error: err.code,
        stage: err.stage,
        message: err.message,
      });
    }
    const message = err instanceof Error ? err.message : String(err);
    return json(req, 500, {
      error: "internal_error",
      message,
    });
  }
});
