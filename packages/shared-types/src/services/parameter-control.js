"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerationTriggeredEventSchema = exports.ParameterStateEventSchema = exports.ParameterUpdateEventSchema = exports.ParameterConflictSchema = exports.ParameterHistoryEntrySchema = exports.ParameterUpdateRequestSchema = void 0;
const zod_1 = require("zod");
// Parameter Update Request Schema
exports.ParameterUpdateRequestSchema = zod_1.z.object({
    sessionId: zod_1.z.string().uuid(),
    path: zod_1.z.string().min(1), // e.g., 'visual.mood', 'audio.tempo'
    value: zod_1.z.any(),
    debounceMs: zod_1.z.number().int().min(0).default(300),
});
// Parameter History Entry Schema
exports.ParameterHistoryEntrySchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    sessionId: zod_1.z.string().uuid(),
    parameters: zod_1.z.any(), // ParameterState
    timestamp: zod_1.z.date(),
    description: zod_1.z.string().optional(), // user-provided description
});
// Parameter Conflict Schema
exports.ParameterConflictSchema = zod_1.z.object({
    sessionId: zod_1.z.string().uuid(),
    conflictingUpdates: zod_1.z.array(zod_1.z.object({
        userId: zod_1.z.string().uuid(),
        update: exports.ParameterUpdateRequestSchema,
        timestamp: zod_1.z.date(),
    })),
    resolution: zod_1.z.enum(['last-writer-wins', 'merge', 'user-choice']),
});
// WebSocket Event Schemas
exports.ParameterUpdateEventSchema = zod_1.z.object({
    type: zod_1.z.literal('parameter-update'),
    sessionId: zod_1.z.string().uuid(),
    update: exports.ParameterUpdateRequestSchema,
    userId: zod_1.z.string().uuid(),
});
exports.ParameterStateEventSchema = zod_1.z.object({
    type: zod_1.z.literal('parameter-state'),
    sessionId: zod_1.z.string().uuid(),
    state: zod_1.z.any(), // ParameterState
});
exports.GenerationTriggeredEventSchema = zod_1.z.object({
    type: zod_1.z.literal('generation-triggered'),
    sessionId: zod_1.z.string().uuid(),
    jobId: zod_1.z.string().uuid(),
    parameters: zod_1.z.any(), // ParameterState
});
