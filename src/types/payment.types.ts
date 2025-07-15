export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  merchantId: string;
  customerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export interface CreatePaymentRequest {
  amount: number;
  currency: string;
  merchantId: string;
  customerId: string;
}

export interface PaymentResponse {
  success: boolean;
  data?: Payment;
  error?: string;
} 