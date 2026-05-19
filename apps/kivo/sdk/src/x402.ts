export interface CreatePaymentHeaderInput {
  nonce: string;
  txXDR: string;
}

export function createPaymentHeader({ nonce, txXDR }: CreatePaymentHeaderInput) {
  return `scheme=stellar,nonce=${encodeURIComponent(nonce)},tx_xdr=${encodeURIComponent(txXDR)}`;
}
