// Record_type enum definition
export enum RecordType {
  INVOICE = 'invoice',
  BILL = 'bill',
  NONE = 'none'
}

// Status enum definition
export enum Status {
  PENDING = 'pending',
  VOID = 'void',
  COMPLETED = 'completed'
}

// Payment interface definition
export interface Payment {
  id: number;
  total: number;
  record_type: RecordType;
  status: Status;
  create_date: string;
  modified_date: string;
}

// CreatePaymentDto definition
export interface CreatePaymentDto {
  total: number;
  record_type: RecordType;
  status: Status;
}

// UpdatePaymentDto definition
export interface UpdatePaymentDto {
  total?: number;
  record_type?: RecordType;
  status?: Status;
}

// PaymentResponse definition
export interface PaymentResponse {
  id: number;
  total: number;
  record_type: RecordType;
  status: Status;
  modified_date: string;
} 