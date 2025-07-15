import { Payment as PaymentType, PaymentStatus } from '../types/payment.types';

export class Payment implements PaymentType {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  merchantId: string;
  customerId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<PaymentType>) {
    this.id = data.id || this.generateId();
    this.amount = data.amount || 0;
    this.currency = data.currency || 'USD';
    this.status = data.status || PaymentStatus.PENDING;
    this.merchantId = data.merchantId || '';
    this.customerId = data.customerId || '';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  toJSON(): PaymentType {
    return {
      id: this.id,
      amount: this.amount,
      currency: this.currency,
      status: this.status,
      merchantId: this.merchantId,
      customerId: this.customerId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
} 