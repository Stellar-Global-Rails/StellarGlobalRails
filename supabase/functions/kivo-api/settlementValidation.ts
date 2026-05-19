import { Asset, Networks, TransactionBuilder } from "@stellar/stellar-sdk";

type ParsedOperation = {
  type?: string;
  source?: string;
  destination?: string;
  amount?: string | number;
  asset?: unknown;
};

type ParsedTransaction = {
  source?: string;
  memo?: unknown;
  operations?: ParsedOperation[];
  innerTransaction?: {
    source?: string;
    memo?: unknown;
    operations?: ParsedOperation[];
  };
};

export type SettlementExpectation = {
  network: "mainnet" | "testnet";
  source: string;
  destination: string;
  amount: string | number;
  assetCode: string;
  assetIssuer?: string | null;
  memo?: string | null;
};

export type SettlementValidationResult =
  | { ok: true }
  | { ok: false; code: string; message: string };

const amountString = (value: string | number | null | undefined) => {
  if (value === null || value === undefined || value === "") {
    return "0.0000000";
  }
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number)) {
    return String(value);
  }
  return number.toFixed(7);
};

const expectedAsset = (assetCode: string, assetIssuer?: string | null) => {
  const code = assetCode.trim();
  const issuer = assetIssuer?.trim() ?? "";
  if (
    code.toUpperCase() === "XLM" || code.toLowerCase() === "native" ||
    code.toUpperCase() === "XLM:NATIVE"
  ) {
    return Asset.native();
  }
  if (!issuer) {
    return null;
  }
  return new Asset(code, issuer);
};

const assetsMatch = (left: Asset, right: Asset) => {
  if (left.isNative() || right.isNative()) {
    return left.isNative() && right.isNative();
  }
  return left.getCode() === right.getCode() &&
    left.getIssuer() === right.getIssuer();
};

const memoText = (memo: unknown) => {
  const candidate = memo as {
    type?: string;
    value?: unknown;
    _type?: string;
    _value?: unknown;
  };
  if ((candidate.type ?? candidate._type) !== "text") {
    return "";
  }
  const value = candidate.value ?? candidate._value;
  if (typeof value === "string") {
    return value;
  }
  if (value instanceof Uint8Array) {
    return new TextDecoder().decode(value);
  }
  return "";
};

export const validatePaymentSettlementXdr = (
  txXDR: string,
  expected: SettlementExpectation,
): SettlementValidationResult => {
  const asset = expectedAsset(expected.assetCode, expected.assetIssuer);
  if (!asset) {
    return {
      ok: false,
      code: "invalid_payment_asset",
      message: "Payment asset must be native XLM or CODE:ISSUER.",
    };
  }

  let parsed: ParsedTransaction;
  try {
    parsed = TransactionBuilder.fromXDR(
      txXDR,
      expected.network === "mainnet" ? Networks.PUBLIC : Networks.TESTNET,
    ) as unknown as ParsedTransaction;
  } catch {
    return {
      ok: false,
      code: "invalid_payment_xdr",
      message:
        "txXDR must be a signed Stellar transaction envelope for the configured network.",
    };
  }

  const transaction = parsed.innerTransaction ?? parsed;
  const txSource = transaction.source ?? parsed.source ?? "";
  if (txSource !== expected.source) {
    return {
      ok: false,
      code: "payment_source_mismatch",
      message: "Signed transaction source must match the source device.",
    };
  }

  if (expected.memo && memoText(transaction.memo) !== expected.memo) {
    return {
      ok: false,
      code: "payment_memo_mismatch",
      message: "Signed transaction memo must match the Kivo payment memo.",
    };
  }

  const expectedAmount = amountString(expected.amount);
  const hasExpectedPayment = (transaction.operations ?? []).some(
    (operation) => {
      const operationSource = operation.source ?? txSource;
      return operation.type === "payment" &&
        operationSource === expected.source &&
        operation.destination === expected.destination &&
        amountString(operation.amount as string | number) === expectedAmount &&
        operation.asset instanceof Asset &&
        assetsMatch(operation.asset, asset);
    },
  );

  if (!hasExpectedPayment) {
    return {
      ok: false,
      code: "payment_settlement_mismatch",
      message:
        "Signed transaction must pay the expected device, amount, and asset.",
    };
  }

  return { ok: true };
};
