import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PaymentController } from './controllers/PaymentController';
import { validate, validateId, createPaymentSchema, updatePaymentSchema } from './middleware/validation';
import { requestLogger, errorLogger } from './middleware/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env['PORT'] || 3000;

// Initialize controller
const paymentController = new PaymentController();

// Global middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Basic route
app.get('/', (_req, res) => {
  res.json({ message: 'Payments API is running' });
});

// Payment routes
app.post('/payments', validate(createPaymentSchema), (req, res) => {
  paymentController.createPayment(req, res);
});

app.post('/payments/batch', (req, res) => {
  paymentController.createBatchPayments(req, res);
});

app.get('/payments', (req, res) => {
  paymentController.getAllPayments(req, res);
});

app.get('/payments/:id', validateId, (req, res) => {
  paymentController.getPayment(req, res);
});

app.put('/payments/:id', validateId, validate(updatePaymentSchema), (req, res) => {
  paymentController.updatePayment(req, res);
});

app.delete('/payments/:id', validateId, (req, res) => {
  paymentController.deletePayment(req, res);
});

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorLogger);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app; 