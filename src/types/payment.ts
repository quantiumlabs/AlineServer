export interface PaymentRequest {
  amount: number;
  description: string;
  currency?: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    company: string;
  };
  redirectUrl?: string;
  cancelUrl?: string;
}