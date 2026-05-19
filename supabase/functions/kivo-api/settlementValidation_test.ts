import {
  Account,
  Asset,
  Keypair,
  Memo,
  Networks,
  Operation,
  TransactionBuilder,
} from "@stellar/stellar-sdk";
import { assertEquals } from "@std/assert";
import { validatePaymentSettlementXdr } from "./settlementValidation.ts";

const buildPaymentXdr = ({
  source,
  destination,
  amount = "1.5000000",
  memo = "kivo-payment",
}: {
  source: Keypair;
  destination: string;
  amount?: string;
  memo?: string;
}) => {
  const tx = new TransactionBuilder(new Account(source.publicKey(), "1"), {
    fee: "100",
    networkPassphrase: Networks.TESTNET,
  })
    .addMemo(Memo.text(memo))
    .addOperation(
      Operation.payment({
        destination,
        asset: Asset.native(),
        amount,
      }),
    )
    .setTimeout(60)
    .build();
  tx.sign(source);
  return tx.toXDR();
};

Deno.test("validatePaymentSettlementXdr accepts a matching device payment", () => {
  const source = Keypair.random();
  const destination = Keypair.random();
  const xdr = buildPaymentXdr({
    source,
    destination: destination.publicKey(),
  });

  const result = validatePaymentSettlementXdr(xdr, {
    network: "testnet",
    source: source.publicKey(),
    destination: destination.publicKey(),
    amount: "1.5000000",
    assetCode: "XLM",
    memo: "kivo-payment",
  });

  assertEquals(result, { ok: true });
});

Deno.test("validatePaymentSettlementXdr rejects payment to a different destination", () => {
  const source = Keypair.random();
  const destination = Keypair.random();
  const attackerDestination = Keypair.random();
  const xdr = buildPaymentXdr({
    source,
    destination: attackerDestination.publicKey(),
  });

  const result = validatePaymentSettlementXdr(xdr, {
    network: "testnet",
    source: source.publicKey(),
    destination: destination.publicKey(),
    amount: "1.5000000",
    assetCode: "XLM",
    memo: "kivo-payment",
  });

  assertEquals(result.ok, false);
  if (!result.ok) {
    assertEquals(result.code, "payment_settlement_mismatch");
  }
});

Deno.test("validatePaymentSettlementXdr rejects payment from a different source device", () => {
  const source = Keypair.random();
  const registeredSource = Keypair.random();
  const destination = Keypair.random();
  const xdr = buildPaymentXdr({
    source,
    destination: destination.publicKey(),
  });

  const result = validatePaymentSettlementXdr(xdr, {
    network: "testnet",
    source: registeredSource.publicKey(),
    destination: destination.publicKey(),
    amount: "1.5000000",
    assetCode: "XLM",
    memo: "kivo-payment",
  });

  assertEquals(result.ok, false);
  if (!result.ok) {
    assertEquals(result.code, "payment_source_mismatch");
  }
});
