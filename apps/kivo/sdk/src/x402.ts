export interface CreatePaymentHeaderInput {
  paymentHeader: string;
}

export function createPaymentHeader({ paymentHeader }: CreatePaymentHeaderInput) {
  if (!paymentHeader.trim()) {
    throw new Error('paymentHeader is required after POST /v1/x402/pay confirms the signed XDR.');
  }
  return paymentHeader;
}
