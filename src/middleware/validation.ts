import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

// Payment validation schema
export const createPaymentSchema = Joi.object({
  amount: Joi.number().positive().required(),
  currency: Joi.string().length(3).uppercase().required(),
  merchantId: Joi.string().required(),
  customerId: Joi.string().required()
});

export const updatePaymentSchema = Joi.object({
  status: Joi.string().valid('pending', 'processing', 'completed', 'failed', 'cancelled').optional(),
  amount: Joi.number().positive().optional(),
  currency: Joi.string().length(3).uppercase().optional()
});

// Validation middleware factory
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      res.status(400).json({
        success: false,
        error: error.details[0]?.message || 'Validation error'
      });
      return;
    }
    
    next();
  };
};

// ID validation middleware
export const validateId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  
  if (!id || id.trim() === '') {
    res.status(400).json({
      success: false,
      error: 'Payment ID is required'
    });
    return;
  }
  
  next();
}; 