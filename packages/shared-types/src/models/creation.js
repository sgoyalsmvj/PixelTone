"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreationSchema = exports.ParsedParametersSchema = exports.AudioParametersSchema = exports.VisualParametersSchema = exports.CreationStatsSchema = void 0;
const zod_1 = require("zod");
// Creation Stats Schema
exports.CreationStatsSchema = zod_1.z.object({
    views: zod_1.z.number().int().min(0).default(0),
    likes: zod_1.z.number().int().min(0).default(0),
    remixes: zod_1.z.number().int().min(0).default(0),
    comments: zod_1.z.number().int().min(0).default(0),
    exports: zod_1.z.number().int().min(0).default(0),
});
// Parsed Parameters Schemas
exports.VisualParametersSchema = zod_1.z.object({
    style: zod_1.z.array(zod_1.z.string()).default([]),
    colors: zod_1.z.array(zod_1.z.string()).default([]),
    mood: zod_1.z.string().default(''),
    composition: zod_1.z.string().default(''),
    themes: zod_1.z.array(zod_1.z.string()).default([]),
});
exports.AudioParametersSchema = zod_1.z.object({
    genre: zod_1.z.array(zod_1.z.string()).default([]),
    instruments: zod_1.z.array(zod_1.z.string()).default([]),
    tempo: zod_1.z.number().int().min(60).max(200).default(120),
    mood: zod_1.z.string().default(''),
    structure: zod_1.z.string().default(''),
});
exports.ParsedParametersSchema = zod_1.z.object({
    visual: exports.VisualParametersSchema.optional(),
    audio: exports.AudioParametersSchema.optional(),
    confidence: zod_1.z.number().min(0).max(1).default(0),
    ambiguities: zod_1.z.array(zod_1.z.string()).default([]),
});
// Creation Schema
exports.CreationSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    authorId: zod_1.z.string().uuid(),
    title: zod_1.z.string().min(1).max(200),
    description: zod_1.z.string().max(1000).default(''),
    originalSpec: zod_1.z.string().min(1).max(2000),
    parsedParameters: exports.ParsedParametersSchema,
    mediaFileIds: zod_1.z.array(zod_1.z.string().uuid()).default([]),
    tags: zod_1.z.array(zod_1.z.string().min(1).max(50)).default([]),
    isPublic: zod_1.z.boolean().default(true),
    remixedFrom: zod_1.z.string().uuid().optional(),
    stats: exports.CreationStatsSchema.default({}),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
