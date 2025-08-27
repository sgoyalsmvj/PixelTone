"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerationSessionSchema = exports.ParameterStateSchema = exports.GenerationJobSchema = exports.GenerationResultSchema = exports.GenerationMetadataSchema = exports.GenerationStatusSchema = void 0;
const zod_1 = require("zod");
const creation_1 = require("./creation");
// Generation Status Schema
exports.GenerationStatusSchema = zod_1.z.enum([
    'pending',
    'processing',
    'completed',
    'failed',
    'cancelled'
]);
// Generation Metadata Schema
exports.GenerationMetadataSchema = zod_1.z.object({
    model: zod_1.z.string(),
    version: zod_1.z.string().optional(),
    seed: zod_1.z.number().int().optional(),
    steps: zod_1.z.number().int().optional(),
    guidance: zod_1.z.number().optional(),
    sampler: zod_1.z.string().optional(),
});
// Generation Result Schema
exports.GenerationResultSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    type: zod_1.z.enum(['visual', 'audio']),
    status: exports.GenerationStatusSchema,
    mediaFileId: zod_1.z.string().uuid().optional(),
    url: zod_1.z.string().url().optional(),
    metadata: exports.GenerationMetadataSchema,
    processingTime: zod_1.z.number().min(0).optional(), // in milliseconds
    error: zod_1.z.string().optional(),
    createdAt: zod_1.z.date(),
    completedAt: zod_1.z.date().optional(),
});
// Generation Job Schema
exports.GenerationJobSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    userId: zod_1.z.string().uuid(),
    sessionId: zod_1.z.string().uuid(),
    type: zod_1.z.enum(['visual', 'audio']),
    parameters: creation_1.ParsedParametersSchema,
    priority: zod_1.z.number().int().min(0).max(10).default(5),
    status: exports.GenerationStatusSchema.default('pending'),
    result: exports.GenerationResultSchema.optional(),
    retryCount: zod_1.z.number().int().min(0).default(0),
    maxRetries: zod_1.z.number().int().min(0).default(3),
    createdAt: zod_1.z.date(),
    startedAt: zod_1.z.date().optional(),
    completedAt: zod_1.z.date().optional(),
});
// Parameter State Schema for real-time updates
exports.ParameterStateSchema = zod_1.z.object({
    visual: zod_1.z.object({
        style: zod_1.z.array(zod_1.z.string()).default([]),
        colors: zod_1.z.array(zod_1.z.string()).default([]),
        mood: zod_1.z.string().default(''),
        composition: zod_1.z.string().default(''),
        themes: zod_1.z.array(zod_1.z.string()).default([]),
    }).optional(),
    audio: zod_1.z.object({
        genre: zod_1.z.array(zod_1.z.string()).default([]),
        instruments: zod_1.z.array(zod_1.z.string()).default([]),
        tempo: zod_1.z.number().int().min(60).max(200).default(120),
        mood: zod_1.z.string().default(''),
        structure: zod_1.z.string().default(''),
    }).optional(),
    lastModified: zod_1.z.date(),
    version: zod_1.z.number().int().min(0).default(0),
});
// Generation Session Schema
exports.GenerationSessionSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    userId: zod_1.z.string().uuid(),
    currentParameters: exports.ParameterStateSchema,
    generationHistory: zod_1.z.array(zod_1.z.string().uuid()).default([]), // GenerationResult IDs
    isActive: zod_1.z.boolean().default(true),
    createdAt: zod_1.z.date(),
    lastActivity: zod_1.z.date(),
});
