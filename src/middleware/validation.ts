import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { RecordType, Status } from '../types/payment.types';

// CreatePaymentDto validation schema
export const createPaymentSchema = Joi.object({
  total: Joi.number().positive().required(),
  record_type: Joi.string().valid(...Object.values(RecordType)).required(),
  status: Joi.string().valid(...Object.values(Status)).required()
});

// UpdatePaymentDto validation schema
export const updatePaymentSchema = Joi.object({
  total: Joi.number().positive().optional(),
  record_type: Joi.string().valid(...Object.values(RecordType)).optional(),
  status: Joi.string().valid(...Object.values(Status)).optional()
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
  
  if (!id || isNaN(Number(id))) {
    res.status(400).json({
      success: false,
      error: 'Valid payment ID is required'
    });
    return;
  }
  
  next();
}; 