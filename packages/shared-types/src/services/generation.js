"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerationProgressSchema = exports.GenerationRequestSchema = void 0;
const zod_1 = require("zod");
const generation_1 = require("../models/generation");
const creation_1 = require("../models/creation");
// Generation Request Schema
exports.GenerationRequestSchema = zod_1.z.object({
    sessionId: zod_1.z.string().uuid(),
    type: zod_1.z.enum(['visual', 'audio']),
    parameters: zod_1.z.union([creation_1.VisualParametersSchema, creation_1.AudioParametersSchema]),
    priority: zod_1.z.number().int().min(0).max(10).default(5),
    options: zod_1.z.object({
        seed: zod_1.z.number().int().optional(),
        steps: zod_1.z.number().int().min(1).max(100).optional(),
        guidance: zod_1.z.number().min(0).max(20).optional(),
        model: zod_1.z.string().optional(),
    }).optional(),
});
// Generation Progress Schema
exports.GenerationProgressSchema = zod_1.z.object({
    jobId: zod_1.z.string().uuid(),
    status: generation_1.GenerationStatusSchema,
    progress: zod_1.z.number().min(0).max(100).default(0),
    currentStep: zod_1.z.string().optional(),
    estimatedTimeRemaining: zod_1.z.number().min(0).optional(), // in seconds
    message: zod_1.z.string().optional(),
});
