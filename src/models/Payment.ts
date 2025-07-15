import { Payment as PaymentType, RecordType, Status } from '../types/payment.types';

export class Payment implements PaymentType {
  id: number;
  total: number;
  record_type: RecordType;
  status: Status;
  create_date: string;
  modified_date: string;

  constructor(data: Partial<PaymentType>) {
    this.id = data.id || 0;
    this.total = data.total || 0;
    this.record_type = data.record_type || RecordType.NONE;
    this.status = data.status || Status.PENDING;
    this.create_date = data.create_date || this.getCurrentTimestamp();
    this.modified_date = data.modified_date || this.getCurrentTimestamp();
  }

  // System field automation logic
  private getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  // Auto-update modified_date when updating
  updateModifiedDate(): void {
    this.modified_date = this.getCurrentTimestamp();
  }

  // Convert to PaymentResponse format
  toResponse(): PaymentType {
    return {
      id: this.id,
      total: this.total,
      record_type: this.record_type,
      status: this.status,
      create_date: this.create_date,
      modified_date: this.modified_date
    };
  }
} 