"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIError = exports.ErrorStatusCodes = exports.ErrorCodes = exports.MediaErrorResponseSchema = exports.GenerationErrorResponseSchema = exports.ServerErrorResponseSchema = exports.RateLimitErrorResponseSchema = exports.NotFoundErrorResponseSchema = exports.AuthErrorResponseSchema = exports.ValidationErrorResponseSchema = exports.ErrorResponseSchema = exports.ErrorDetailSchema = void 0;
exports.createValidationError = createValidationError;
exports.createAuthError = createAuthError;
exports.createNotFoundError = createNotFoundError;
const zod_1 = require("zod");
// Error Detail Schema
exports.ErrorDetailSchema = zod_1.z.object({
    field: zod_1.z.string().optional(),
    code: zod_1.z.string(),
    message: zod_1.z.string(),
    value: zod_1.z.any().optional(),
});
// Base Error Response Schema
exports.ErrorResponseSchema = zod_1.z.object({
    success: zod_1.z.literal(false),
    error: zod_1.z.object({
        code: zod_1.z.string(),
        message: zod_1.z.string(),
        details: zod_1.z.array(exports.ErrorDetailSchema).optional(),
        requestId: zod_1.z.string().uuid().optional(),
        timestamp: zod_1.z.string().datetime(),
    }),
});
// Validation Error Schema
exports.ValidationErrorResponseSchema = exports.ErrorResponseSchema.extend({
    error: exports.ErrorResponseSchema.shape.error.extend({
        code: zod_1.z.literal('VALIDATION_ERROR'),
        details: zod_1.z.array(exports.ErrorDetailSchema),
    }),
});
// Authentication Error Schema
exports.AuthErrorResponseSchema = exports.ErrorResponseSchema.extend({
    error: exports.ErrorResponseSchema.shape.error.extend({
        code: zod_1.z.enum(['UNAUTHORIZED', 'FORBIDDEN', 'TOKEN_EXPIRED', 'INVALID_CREDENTIALS']),
    }),
});
// Not Found Error Schema
exports.NotFoundErrorResponseSchema = exports.ErrorResponseSchema.extend({
    error: exports.ErrorResponseSchema.shape.error.extend({
        code: zod_1.z.literal('NOT_FOUND'),
        resource: zod_1.z.string().optional(),
    }),
});
// Rate Limit Error Schema
exports.RateLimitErrorResponseSchema = exports.ErrorResponseSchema.extend({
    error: exports.ErrorResponseSchema.shape.error.extend({
        code: zod_1.z.literal('RATE_LIMIT_EXCEEDED'),
        retryAfter: zod_1.z.number().int().optional(), // seconds
        limit: zod_1.z.number().int().optional(),
        remaining: zod_1.z.number().int().optional(),
        resetTime: zod_1.z.string().datetime().optional(),
    }),
});
// Server Error Schema
exports.ServerErrorResponseSchema = exports.ErrorResponseSchema.extend({
    error: exports.ErrorResponseSchema.shape.error.extend({
        code: zod_1.z.enum(['INTERNAL_SERVER_ERROR', 'SERVICE_UNAVAILABLE', 'TIMEOUT']),
        service: zod_1.z.string().optional(),
    }),
});
// Generation Error Schema
exports.GenerationErrorResponseSchema = exports.ErrorResponseSchema.extend({
    error: exports.ErrorResponseSchema.shape.error.extend({
        code: zod_1.z.enum([
            'GENERATION_FAILED',
            'INVALID_PARAMETERS',
            'MODEL_UNAVAILABLE',
            'QUOTA_EXCEEDED',
            'CONTENT_POLICY_VIOLATION'
        ]),
        jobId: zod_1.z.string().uuid().optional(),
        retryable: zod_1.z.boolean().optional(),
    }),
});
// Media Error Schema
exports.MediaErrorResponseSchema = exports.ErrorResponseSchema.extend({
    error: exports.ErrorResponseSchema.shape.error.extend({
        code: zod_1.z.enum([
            'UNSUPPORTED_FORMAT',
            'FILE_TOO_LARGE',
            'INVALID_MEDIA',
            'PROCESSING_FAILED',
            'STORAGE_ERROR'
        ]),
        maxSize: zod_1.z.number().int().optional(),
        supportedFormats: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
// Error Code Enums
var ErrorCodes;
(function (ErrorCodes) {
    // Validation Errors
    ErrorCodes["VALIDATION_ERROR"] = "VALIDATION_ERROR";
    ErrorCodes["INVALID_INPUT"] = "INVALID_INPUT";
    ErrorCodes["MISSING_REQUIRED_FIELD"] = "MISSING_REQUIRED_FIELD";
    // Authentication Errors
    ErrorCodes["UNAUTHORIZED"] = "UNAUTHORIZED";
    ErrorCodes["FORBIDDEN"] = "FORBIDDEN";
    ErrorCodes["TOKEN_EXPIRED"] = "TOKEN_EXPIRED";
    ErrorCodes["INVALID_CREDENTIALS"] = "INVALID_CREDENTIALS";
    // Resource Errors
    ErrorCodes["NOT_FOUND"] = "NOT_FOUND";
    ErrorCodes["ALREADY_EXISTS"] = "ALREADY_EXISTS";
    ErrorCodes["CONFLICT"] = "CONFLICT";
    // Rate Limiting
    ErrorCodes["RATE_LIMIT_EXCEEDED"] = "RATE_LIMIT_EXCEEDED";
    ErrorCodes["QUOTA_EXCEEDED"] = "QUOTA_EXCEEDED";
    // Server Errors
    ErrorCodes["INTERNAL_SERVER_ERROR"] = "INTERNAL_SERVER_ERROR";
    ErrorCodes["SERVICE_UNAVAILABLE"] = "SERVICE_UNAVAILABLE";
    ErrorCodes["TIMEOUT"] = "TIMEOUT";
    // Generation Errors
    ErrorCodes["GENERATION_FAILED"] = "GENERATION_FAILED";
    ErrorCodes["INVALID_PARAMETERS"] = "INVALID_PARAMETERS";
    ErrorCodes["MODEL_UNAVAILABLE"] = "MODEL_UNAVAILABLE";
    ErrorCodes["CONTENT_POLICY_VIOLATION"] = "CONTENT_POLICY_VIOLATION";
    // Media Errors
    ErrorCodes["UNSUPPORTED_FORMAT"] = "UNSUPPORTED_FORMAT";
    ErrorCodes["FILE_TOO_LARGE"] = "FILE_TOO_LARGE";
    ErrorCodes["INVALID_MEDIA"] = "INVALID_MEDIA";
    ErrorCodes["PROCESSING_FAILED"] = "PROCESSING_FAILED";
    ErrorCodes["STORAGE_ERROR"] = "STORAGE_ERROR";
})(ErrorCodes || (exports.ErrorCodes = ErrorCodes = {}));
// HTTP Status Code Mapping
exports.ErrorStatusCodes = {
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
class APIError extends Error {
    code;
    statusCode;
    details;
    requestId;
    constructor(code, message, statusCode = 500, details, requestId) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;
        this.requestId = requestId;
        this.name = 'APIError';
    }
    toResponse() {
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
exports.APIError = APIError;
function createValidationError(details, requestId) {
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
function createAuthError(code, message, requestId) {
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
function createNotFoundError(resource, requestId) {
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
