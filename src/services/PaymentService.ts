import { Payment, CreatePaymentDto, UpdatePaymentDto, PaymentResponse } from '../types/payment.types';
import { PaymentRepository } from '../repositories/PaymentRepository';
import { round } from '../utils/decimal';

export class PaymentService {
  private paymentRepository: PaymentRepository;

  constructor() {
    this.paymentRepository = new PaymentRepository();
  }

  // Create single payment with business logic
  async createPayment(paymentData: CreatePaymentDto): Promise<PaymentResponse> {
    // Validate business rules
    this.validatePaymentData(paymentData);
    
    // Round total to 2 decimal places
    const roundedTotal = round(paymentData.total, 2);
    
    // Create payment with rounded total
    const payment = await this.paymentRepository.create({
      ...paymentData,
      total: roundedTotal
    });

    return this.toPaymentResponse(payment);
  }

  // Create multiple payments (batch creation)
  async createBatchPayments(paymentsData: CreatePaymentDto[]): Promise<PaymentResponse[]> {
    const results: PaymentResponse[] = [];
    
    for (const paymentData of paymentsData) {
      try {
        const result = await this.createPayment(paymentData);
        results.push(result);
      } catch (error) {
        // Log error but continue with other payments
        console.error('Failed to create payment in batch:', error);
      }
    }

    return results;
  }

  // Get payment by ID
  async getPayment(id: number): Promise<PaymentResponse | null> {
    const payment = await this.paymentRepository.findById(id);
    return payment ? this.toPaymentResponse(payment) : null;
  }

  // Get all payments
  async getAllPayments(): Promise<PaymentResponse[]> {
    const payments = await this.paymentRepository.findAll();
    return payments.map(payment => this.toPaymentResponse(payment));
  }

  // Update payment with business logic
  async updatePayment(id: number, updateData: UpdatePaymentDto): Promise<PaymentResponse | null> {
    // Validate update data
    if (updateData.total !== undefined) {
      this.validateTotal(updateData.total);
      updateData.total = round(updateData.total, 2);
    }

    if (updateData.record_type !== undefined) {
      this.validateRecordType(updateData.record_type);
    }

    if (updateData.status !== undefined) {
      this.validateStatus(updateData.status);
    }

    const payment = await this.paymentRepository.update(id, updateData);
    return payment ? this.toPaymentResponse(payment) : null;
  }

  // Delete payment
  async deletePayment(id: number): Promise<boolean> {
    return await this.paymentRepository.delete(id);
  }

  // Business validation logic
  private validatePaymentData(data: CreatePaymentDto): void {
    this.validateTotal(data.total);
    this.validateRecordType(data.record_type);
    this.validateStatus(data.status);
  }

  private validateTotal(total: number): void {
    if (total <= 0) {
      throw new Error('Total must be greater than 0');
    }
    if (total > 999999.99) {
      throw new Error('Total cannot exceed 999,999.99');
    }
  }

  private validateRecordType(recordType: string): void {
    const validTypes = ['invoice', 'bill', 'none'];
    if (!validTypes.includes(recordType)) {
      throw new Error('Invalid record type');
    }
  }

  private validateStatus(status: string): void {
    const validStatuses = ['pending', 'void', 'completed'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }
  }

  // Convert Payment to PaymentResponse
  private toPaymentResponse(payment: Payment): PaymentResponse {
    return {
      id: payment.id,
      total: payment.total,
      record_type: payment.record_type,
      status: payment.status,
      modified_date: payment.modified_date
    };
  }
} 