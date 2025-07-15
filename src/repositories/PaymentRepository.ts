import { Payment, CreatePaymentDto, UpdatePaymentDto } from '../types/payment.types';
import { run, get, all } from '../utils/db';

export class PaymentRepository {
  // Create payment
  async create(paymentData: CreatePaymentDto): Promise<Payment> {
    const sql = `
      INSERT INTO payments (total, record_type, status, create_date, modified_date)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;
    
    const params = [paymentData.total, paymentData.record_type, paymentData.status];
    
    return new Promise((resolve, reject) => {
      run(sql, params)
        .then(() => {
          // Get the created payment with auto-generated ID
          return this.getLastInserted();
        })
        .then(payment => {
          if (payment) {
            resolve(payment);
          } else {
            reject(new Error('Failed to create payment'));
          }
        })
        .catch(reject);
    });
  }

  // Get payment by ID
  async findById(id: number): Promise<Payment | null> {
    const sql = 'SELECT * FROM payments WHERE id = ?';
    const payment = await get<Payment>(sql, [id]);
    return payment || null;
  }

  // Get all payments
  async findAll(): Promise<Payment[]> {
    const sql = 'SELECT * FROM payments ORDER BY create_date DESC';
    return await all<Payment>(sql);
  }

  // Update payment
  async update(id: number, updateData: UpdatePaymentDto): Promise<Payment | null> {
    const existingPayment = await this.findById(id);
    if (!existingPayment) {
      return null;
    }

    const updateFields: string[] = [];
    const params: any[] = [];

    if (updateData.total !== undefined) {
      updateFields.push('total = ?');
      params.push(updateData.total);
    }

    if (updateData.record_type !== undefined) {
      updateFields.push('record_type = ?');
      params.push(updateData.record_type);
    }

    if (updateData.status !== undefined) {
      updateFields.push('status = ?');
      params.push(updateData.status);
    }

    if (updateFields.length === 0) {
      return existingPayment;
    }

    updateFields.push('modified_date = CURRENT_TIMESTAMP');
    params.push(id);

    const sql = `UPDATE payments SET ${updateFields.join(', ')} WHERE id = ?`;
    
    await run(sql, params);
    return await this.findById(id);
  }

  // Delete payment
  async delete(id: number): Promise<boolean> {
    const sql = 'DELETE FROM payments WHERE id = ?';
    try {
      await run(sql, [id]);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Get last inserted payment (helper method)
  private async getLastInserted(): Promise<Payment | null> {
    const sql = 'SELECT * FROM payments ORDER BY id DESC LIMIT 1';
    const payment = await get<Payment>(sql);
    return payment || null;
  }

  // Transaction wrapper
  async withTransaction<T>(operation: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      // SQLite doesn't support explicit transactions in the same way as other databases
      // This is a simplified transaction wrapper
      operation()
        .then(resolve)
        .catch(reject);
    });
  }
} 