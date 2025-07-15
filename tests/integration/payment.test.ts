import request from 'supertest';
import app from '../../src/app';
import { db } from '../../src/utils/db';

describe('Payment API Integration Tests', () => {
  // Clean up database before each test
  beforeEach(async () => {
    await db.run('DELETE FROM payments');
  });

  afterAll(async () => {
    await db.close();
  });

  describe('CRUD Operations', () => {
    it('should create a single payment', async () => {
      const paymentData = {
        total: 100.50,
        record_type: 'invoice',
        status: 'pending'
      };

      const response = await request(app)
        .post('/payments')
        .send(paymentData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.total).toBe(100.50);
      expect(response.body.data.record_type).toBe('invoice');
      expect(response.body.data.status).toBe('pending');
      expect(response.body.data).toHaveProperty('modified_date');
      expect(response.body.data).not.toHaveProperty('create_date'); // Hidden from API
    });

    it('should get payment by ID', async () => {
      // First create a payment
      const createResponse = await request(app)
        .post('/payments')
        .send({
          total: 200.00,
          record_type: 'bill',
          status: 'completed'
        });

      const paymentId = createResponse.body.data.id;

      // Then retrieve it
      const response = await request(app)
        .get(`/payments/${paymentId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(paymentId);
      expect(response.body.data.total).toBe(200.00);
      expect(response.body.data.record_type).toBe('bill');
      expect(response.body.data.status).toBe('completed');
    });

    it('should get all payments', async () => {
      // Create multiple payments
      await request(app)
        .post('/payments')
        .send({ total: 100, record_type: 'invoice', status: 'pending' });

      await request(app)
        .post('/payments')
        .send({ total: 200, record_type: 'bill', status: 'completed' });

      const response = await request(app)
        .get('/payments')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(2);
    });

    it('should update payment', async () => {
      // Create a payment
      const createResponse = await request(app)
        .post('/payments')
        .send({
          total: 100.00,
          record_type: 'invoice',
          status: 'pending'
        });

      const paymentId = createResponse.body.data.id;

      // Update the payment
      const updateData = {
        total: 150.75,
        status: 'completed'
      };

      const response = await request(app)
        .put(`/payments/${paymentId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(paymentId);
      expect(response.body.data.total).toBe(150.75);
      expect(response.body.data.status).toBe('completed');
      expect(response.body.data.record_type).toBe('invoice'); // Unchanged
    });

    it('should delete payment', async () => {
      // Create a payment
      const createResponse = await request(app)
        .post('/payments')
        .send({
          total: 100.00,
          record_type: 'invoice',
          status: 'pending'
        });

      const paymentId = createResponse.body.data.id;

      // Delete the payment
      const response = await request(app)
        .delete(`/payments/${paymentId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Payment deleted successfully');

      // Verify it's deleted
      await request(app)
        .get(`/payments/${paymentId}`)
        .expect(404);
    });
  });

  describe('Batch Creation', () => {
    it('should create multiple payments in batch', async () => {
      const paymentsData = [
        { total: 100.50, record_type: 'invoice', status: 'pending' },
        { total: 200.75, record_type: 'bill', status: 'completed' },
        { total: 50.25, record_type: 'none', status: 'void' }
      ];

      const response = await request(app)
        .post('/payments/batch')
        .send(paymentsData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(3);

      // Verify each payment was created
      for (const payment of response.body.data) {
        expect(payment).toHaveProperty('id');
        expect(payment).toHaveProperty('total');
        expect(payment).toHaveProperty('record_type');
        expect(payment).toHaveProperty('status');
        expect(payment).toHaveProperty('modified_date');
      }
    });

    it('should handle invalid batch data', async () => {
      const invalidData = 'not an array';

      const response = await request(app)
        .post('/payments/batch')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Request body must be an array of payments');
    });
  });

  describe('Validation Tests', () => {
    it('should validate required fields', async () => {
      const invalidPayment = {
        total: 100.50
        // Missing record_type and status
      };

      const response = await request(app)
        .post('/payments')
        .send(invalidPayment)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('record_type');
    });

    it('should validate total field constraints', async () => {
      const invalidPayment = {
        total: -10, // Negative value
        record_type: 'invoice',
        status: 'pending'
      };

      const response = await request(app)
        .post('/payments')
        .send(invalidPayment)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('positive number');
    });

    it('should validate record_type enum values', async () => {
      const invalidPayment = {
        total: 100.50,
        record_type: 'invalid_type',
        status: 'pending'
      };

      const response = await request(app)
        .post('/payments')
        .send(invalidPayment)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('must be one of');
    });

    it('should validate status enum values', async () => {
      const invalidPayment = {
        total: 100.50,
        record_type: 'invoice',
        status: 'invalid_status'
      };

      const response = await request(app)
        .post('/payments')
        .send(invalidPayment)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('must be one of');
    });
  });

  describe('Error Cases', () => {
    it('should return 404 for non-existent payment', async () => {
      const response = await request(app)
        .get('/payments/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Payment not found');
    });

    it('should return 404 for invalid ID format', async () => {
      const response = await request(app)
        .get('/payments/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Valid payment ID is required');
    });

    it('should handle decimal rounding correctly', async () => {
      const paymentData = {
        total: 100.567, // Should be rounded to 100.57
        record_type: 'invoice',
        status: 'pending'
      };

      const response = await request(app)
        .post('/payments')
        .send(paymentData)
        .expect(201);

      expect(response.body.data.total).toBe(100.57);
    });

    it('should return 404 for route not found', async () => {
      const response = await request(app)
        .get('/nonexistent')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Route not found');
    });
  });
}); 