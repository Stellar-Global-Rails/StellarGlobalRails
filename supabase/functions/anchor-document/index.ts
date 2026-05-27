import "@supabase/functions-js/edge-runtime.d.ts";
import {
  Asset,
  Keypair,
  Memo,
  Networks,
  Operation,
  TransactionBuilder,
  Horizon,
} from "@stellar/stellar-sdk";
import { createClient } from "jsr:@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const env = (key: string, fallback = "") =>
  Deno.env.get(key)?.trim() || fallback;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const { documentHash, recordId, network = "testnet" } =
      await req.json() as {
        documentHash: string;
        recordId?: string;
        network?: "testnet" | "mainnet";
      };

    // SHA-256 = 64 hex chars = 32 bytes
    if (!documentHash || !/^[0-9a-f]{64}$/i.test(documentHash)) {
      return new Response(JSON.stringify({ error: "hash inválido" }), {
        status: 400,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const sponsorSecret =
      env("STELLAR_SECRET_KEY") || env("SOROBAN_SPONSOR_SECRET");
    if (!sponsorSecret) throw new Error("STELLAR_SECRET_KEY não configurado");

    const sponsorKeypair = Keypair.fromSecret(sponsorSecret);
    const isMainnet = network === "mainnet";
    const horizonUrl = isMainnet
      ? "https://horizon.stellar.org"
      : "https://horizon-testnet.stellar.org";
    const networkPassphrase = isMainnet ? Networks.PUBLIC : Networks.TESTNET;

    const server = new Horizon.Server(horizonUrl, { allowHttp: false });
    const account = await server.loadAccount(sponsorKeypair.publicKey());

    // SHA-256 cabe exatamente em Memo.hash (32 bytes)
    const hashBytes = Buffer.from(documentHash, "hex");

    const tx = new TransactionBuilder(account, {
      fee: "200",
      networkPassphrase,
    })
      .addOperation(
        // Self-payment mínimo (1 stroop) para ter uma operação válida
        Operation.payment({
          destination: sponsorKeypair.publicKey(),
          asset: Asset.native(),
          amount: "0.0000001",
        }),
      )
      .addMemo(Memo.hash(hashBytes))
      .setTimeout(60)
      .build();

    tx.sign(sponsorKeypair);

    const result = await server.submitTransaction(tx);

    // Atualiza o registro no banco via service-role
    const supabase = createClient(
      env("SUPABASE_URL"),
      env("SUPABASE_SERVICE_ROLE_KEY"),
    );

    if (recordId) {
      await supabase
        .from("document_authentications")
        .update({
          stellar_tx_hash: result.hash,
          stellar_ledger: (result as any).ledger ?? null,
          stellar_network: network,
          anchored_at: new Date().toISOString(),
          status: "anchored",
        })
        .eq("id", recordId);
    }

    return new Response(
      JSON.stringify({
        stellarTxHash: result.hash,
        stellarLedger: (result as any).ledger ?? null,
        network,
        explorerUrl: isMainnet
          ? `https://stellar.expert/explorer/public/tx/${result.hash}`
          : `https://stellar.expert/explorer/testnet/tx/${result.hash}`,
      }),
      { headers: { ...CORS, "Content-Type": "application/json" } },
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[anchor-document]", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});
