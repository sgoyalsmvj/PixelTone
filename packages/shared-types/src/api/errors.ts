import { z } from 'zod';

// Error Detail Schema
export const ErrorDetailSchema = z.object({
  field: z.string().optional(),
  code: z.string(),
  message: z.string(),
  value: z.any().optional(),
});

// Base Error Response Schema
export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.array(ErrorDetailSchema).optional(),
    requestId: z.string().uuid().optional(),
    timestamp: z.string().datetime(),
  }),
});

// Validation Error Schema
export const ValidationErrorResponseSchema = ErrorResponseSchema.extend({
  error: ErrorResponseSchema.shape.error.extend({
    code: z.literal('VALIDATION_ERROR'),
    details: z.array(ErrorDetailSchema),
  }),
});

// Authentication Error Schema
export const AuthErrorResponseSchema = ErrorResponseSchema.extend({
  error: ErrorResponseSchema.shape.error.extend({
    code: z.enum(['UNAUTHORIZED', 'FORBIDDEN', 'TOKEN_EXPIRED', 'INVALID_CREDENTIALS']),
  }),
});

// Not Found Error Schema
export const NotFoundErrorResponseSchema = ErrorResponseSchema.extend({
  error: ErrorResponseSchema.shape.error.extend({
    code: z.literal('NOT_FOUND'),
    resource: z.string().optional(),
  }),
});

// Rate Limit Error Schema
export const RateLimitErrorResponseSchema = ErrorResponseSchema.extend({
  error: ErrorResponseSchema.shape.error.extend({
    code: z.literal('RATE_LIMIT_EXCEEDED'),
    retryAfter: z.number().int().optional(), // seconds
    limit: z.number().int().optional(),
    remaining: z.number().int().optional(),
    resetTime: z.string().datetime().optional(),
  }),
});

// Server Error Schema
export const ServerErrorResponseSchema = ErrorResponseSchema.extend({
  error: ErrorResponseSchema.shape.error.extend({
    code: z.enum(['INTERNAL_SERVER_ERROR', 'SERVICE_UNAVAILABLE', 'TIMEOUT']),
    service: z.string().optional(),
  }),
});

// Generation Error Schema
export const GenerationErrorResponseSchema = ErrorResponseSchema.extend({
  error: ErrorResponseSchema.shape.error.extend({
    code: z.enum([
      'GENERATION_FAILED',
      'INVALID_PARAMETERS',
      'MODEL_UNAVAILABLE',
      'QUOTA_EXCEEDED',
      'CONTENT_POLICY_VIOLATION'
    ]),
    jobId: z.string().uuid().optional(),
    retryable: z.boolean().optional(),
  }),
});

// Media Error Schema
export const MediaErrorResponseSchema = ErrorResponseSchema.extend({
  error: ErrorResponseSchema.shape.error.extend({
    code: z.enum([
      'UNSUPPORTED_FORMAT',
      'FILE_TOO_LARGE',
      'INVALID_MEDIA',
      'PROCESSING_FAILED',
      'STORAGE_ERROR'
    ]),
    maxSize: z.number().int().optional(),
    supportedFormats: z.array(z.string()).optional(),
  }),
});

// TypeScript Types
export type ErrorDetail = z.infer<typeof ErrorDetailSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type ValidationErrorResponse = z.infer<typeof ValidationErrorResponseSchema>;
export type AuthErrorResponse = z.infer<typeof AuthErrorResponseSchema>;
export type NotFoundErrorResponse = z.infer<typeof NotFoundErrorResponseSchema>;
export type RateLimitErrorResponse = z.infer<typeof RateLimitErrorResponseSchema>;
export type ServerErrorResponse = z.infer<typeof ServerErrorResponseSchema>;
export type GenerationErrorResponse = z.infer<typeof GenerationErrorResponseSchema>;
export type MediaErrorResponse = z.infer<typeof MediaErrorResponseSchema>;

// Error Code Enums
export enum ErrorCodes {
  // Validation Errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  
  // Authentication Errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  
  // Resource Errors
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  CONFLICT = 'CONFLICT',
  
  // Rate Limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  
  // Server Errors
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  TIMEOUT = 'TIMEOUT',
  
  // Generation Errors
  GENERATION_FAILED = 'GENERATION_FAILED',
  INVALID_PARAMETERS = 'INVALID_PARAMETERS',
  MODEL_UNAVAILABLE = 'MODEL_UNAVAILABLE',
  CONTENT_POLICY_VIOLATION = 'CONTENT_POLICY_VIOLATION',
  
  // Media Errors
  UNSUPPORTED_FORMAT = 'UNSUPPORTED_FORMAT',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  INVALID_MEDIA = 'INVALID_MEDIA',
  PROCESSING_FAILED = 'PROCESSING_FAILED',
  STORAGE_ERROR = 'STORAGE_ERROR',
}

// HTTP Status Code Mapping
export const ErrorStatusCodes: Record<string, number> = {
  [ErrorCodes.VALIDATION_ERROR]: 400,
  [ErrorCodes.INVALID_INPUT]: 400,
  [ErrorCodes.MISSING_REQUIRED_FIELD]: 400,
  [ErrorCodes.UNAUTHORIZED]: 401,
  [ErrorCodes.FORBIDDEN]: 403,
  [ErrorCodes.TOKEN_EXPIRED]: 401,
  [ErrorCodes.INVALID_CREDENTIALS]: 401,
  [ErrorCodes.NOT_FOUND]: 404,
  [ErrorCodes.ALREADY_EXISTS]: 409,
  [ErrorCodes.CONFLICT]: 409,
  [ErrorCodes.RATE_LIMIT_EXCEEDED]: 429,
  [ErrorCodes.QUOTA_EXCEEDED]: 429,
  [ErrorCodes.INTERNAL_SERVER_ERROR]: 500,
  [ErrorCodes.SERVICE_UNAVAILABLE]: 503,
  [ErrorCodes.TIMEOUT]: 504,
  [ErrorCodes.GENERATION_FAILED]: 500,
  [ErrorCodes.INVALID_PARAMETERS]: 400,
  [ErrorCodes.MODEL_UNAVAILABLE]: 503,
  [ErrorCodes.CONTENT_POLICY_VIOLATION]: 400,
  [ErrorCodes.UNSUPPORTED_FORMAT]: 400,
  [ErrorCodes.FILE_TOO_LARGE]: 413,
  [ErrorCodes.INVALID_MEDIA]: 400,
  [ErrorCodes.PROCESSING_FAILED]: 500,
  [ErrorCodes.STORAGE_ERROR]: 500,
};

// Error Helper Functions
export class APIError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: ErrorDetail[],
    public requestId?: string
  ) {
    super(message);
    this.name = 'APIError';
  }

  toResponse(): ErrorResponse {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
        details: this.details,
        requestId: this.requestId,
        timestamp: new Date().toISOString(),
      },
    };
  }
}

export function createValidationError(details: ErrorDetail[], requestId?: string): ValidationErrorResponse {
  return {
    success: false,
    error: {
      code: ErrorCodes.VALIDATION_ERROR,
      message: 'Validation failed',
      details,
      requestId,
      timestamp: new Date().toISOString(),
    },
  };
}

export function createAuthError(code: AuthErrorResponse['error']['code'], message: string, requestId?: string): AuthErrorResponse {
  return {
    success: false,
    error: {
      code,
      message,
      requestId,
      timestamp: new Date().toISOString(),
    },
  };
}

export function createNotFoundError(resource?: string, requestId?: string): NotFoundErrorResponse {
  return {
    success: false,
    error: {
      code: ErrorCodes.NOT_FOUND,
      message: resource ? `${resource} not found` : 'Resource not found',
      resource,
      requestId,
      timestamp: new Date().toISOString(),
    },
  };
}