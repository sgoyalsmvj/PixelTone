"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NLPResponseSchema = exports.ValidationResultSchema = exports.NLPInputSchema = void 0;
const zod_1 = require("zod");
// NLP Input Schema
exports.NLPInputSchema = zod_1.z.object({
    text: zod_1.z.string().min(1).max(2000),
    type: zod_1.z.enum(['visual', 'audio', 'mixed']),
    context: zod_1.z.object({
        previousParameters: zod_1.z.any().optional(), // ParsedParameters
        userPreferences: zod_1.z.record(zod_1.z.any()).optional(),
    }).optional(),
});
// Validation Result Schema
exports.ValidationResultSchema = zod_1.z.object({
    isValid: zod_1.z.boolean(),
    errors: zod_1.z.array(zod_1.z.object({
        field: zod_1.z.string(),
        message: zod_1.z.string(),
        code: zod_1.z.string(),
    })).default([]),
    warnings: zod_1.z.array(zod_1.z.object({
        field: zod_1.z.string(),
        message: zod_1.z.string(),
        suggestion: zod_1.z.string().optional(),
    })).default([]),
});
// NLP Response Schema
exports.NLPResponseSchema = zod_1.z.object({
    parameters: zod_1.z.any(), // ParsedParameters
    confidence: zod_1.z.number().min(0).max(1),
    ambiguities: zod_1.z.array(zod_1.z.object({
        field: zod_1.z.string(),
        possibleValues: zod_1.z.array(zod_1.z.string()),
        suggestion: zod_1.z.string().optional(),
    })).default([]),
    suggestions: zod_1.z.array(zod_1.z.string()).default([]),
    processingTime: zod_1.z.number().min(0),
});
