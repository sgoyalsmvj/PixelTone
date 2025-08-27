export interface ValidationResult {
  isValid: boolean;
  errors: ValidationFieldError[];
  warnings?: ValidationWarning[];
}

export interface ValidationFieldError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

export interface ValidationWarning {
  field: string;
  message: string;
  code: string;
  value?: any;
}

export interface ValidationRule<T = any> {
  field: string;
  validate: (value: T) => ValidationResult;
  required?: boolean;
}

export interface ValidationSchema {
  rules: ValidationRule[];
  strict?: boolean; // If true, unknown fields cause validation errors
}

export type ValidatorFunction<T = any> = (value: T) => boolean | string;

// Common validation patterns
export const ValidationPatterns = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/
} as const;

// Common validation error codes
export enum ValidationErrorCode {
  REQUIRED = 'REQUIRED',
  INVALID_FORMAT = 'INVALID_FORMAT',
  TOO_SHORT = 'TOO_SHORT',
  TOO_LONG = 'TOO_LONG',
  TOO_SMALL = 'TOO_SMALL',
  TOO_LARGE = 'TOO_LARGE',
  INVALID_TYPE = 'INVALID_TYPE',
  NOT_ALLOWED = 'NOT_ALLOWED',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  NOT_FOUND = 'NOT_FOUND',
  INVALID_RANGE = 'INVALID_RANGE',
  INVALID_ENUM = 'INVALID_ENUM'
}

// File validation specific types
export interface FileValidationOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[]; // MIME types
  allowedExtensions?: string[];
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  aspectRatio?: number;
}

export interface FileValidationResult extends ValidationResult {
  fileInfo?: {
    size: number;
    type: string;
    extension: string;
    dimensions?: {
      width: number;
      height: number;
    };
  };
}