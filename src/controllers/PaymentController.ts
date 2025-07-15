import { Request, Response } from 'express';
import { PaymentService } from '../services/PaymentService';
import { CreatePaymentDto, UpdatePaymentDto } from '../types/payment.types';

export class PaymentController {
  private paymentService: PaymentService;

  constructor() {
    this.paymentService = new PaymentService();
  }

  // Create single payment
  async createPayment(req: Request, res: Response): Promise<void> {
    try {
      const paymentData: CreatePaymentDto = req.body;
      const payment = await this.paymentService.createPayment(paymentData);
      
      res.status(201).json({
        success: true,
        data: payment
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create payment'
      });
    }
  }

  // Create multiple payments (batch)
  async createBatchPayments(req: Request, res: Response): Promise<void> {
    try {
      const paymentsData: CreatePaymentDto[] = req.body;
      
      if (!Array.isArray(paymentsData)) {
        res.status(400).json({
          success: false,
          error: 'Request body must be an array of payments'
        });
        return;
      }

      const payments = await this.paymentService.createBatchPayments(paymentsData);
      
      res.status(201).json({
        success: true,
        data: payments
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create batch payments'
      });
    }
  }

  // Get payment by ID
  async getPayment(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params['id']);
      const payment = await this.paymentService.getPayment(id);
      
      if (!payment) {
        res.status(404).json({
          success: false,
          error: 'Payment not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: payment
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get payment'
      });
    }
  }

  // Get all payments
  async getAllPayments(_req: Request, res: Response): Promise<void> {
    try {
      const payments = await this.paymentService.getAllPayments();
      
      res.status(200).json({
        success: true,
        data: payments
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get payments'
      });
    }
  }

  // Update payment
  async updatePayment(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params['id']);
      const updateData: UpdatePaymentDto = req.body;
      
      const payment = await this.paymentService.updatePayment(id, updateData);
      
      if (!payment) {
        res.status(404).json({
          success: false,
          error: 'Payment not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: payment
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update payment'
      });
    }
  }

  // Delete payment
  async deletePayment(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params['id']);
      const deleted = await this.paymentService.deletePayment(id);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Payment not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Payment deleted successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete payment'
      });
    }
  }
} 