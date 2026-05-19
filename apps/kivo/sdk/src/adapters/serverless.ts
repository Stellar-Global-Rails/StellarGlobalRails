import { createPaymentHeader, type CreatePaymentHeaderInput } from '../x402';

export function createServerlessPaymentHeader(input: CreatePaymentHeaderInput) {
  return createPaymentHeader(input);
}
