"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemixSessionSchema = exports.CreationWithInteractionsSchema = exports.SearchResultSchema = exports.SearchQuerySchema = void 0;
const zod_1 = require("zod");
// Search Query Schema
exports.SearchQuerySchema = zod_1.z.object({
    query: zod_1.z.string().max(200).optional(),
    filters: zod_1.z.object({
        authorId: zod_1.z.string().uuid().optional(),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
        hasVisual: zod_1.z.boolean().optional(),
        hasAudio: zod_1.z.boolean().optional(),
        isPublic: zod_1.z.boolean().optional(),
        remixedFrom: zod_1.z.string().uuid().optional(),
        dateRange: zod_1.z.object({
            from: zod_1.z.date().optional(),
            to: zod_1.z.date().optional(),
        }).optional(),
    }).optional(),
    sort: zod_1.z.enum(['recent', 'popular', 'trending', 'mostLiked', 'mostRemixed']).default('recent'),
    limit: zod_1.z.number().int().min(1).max(100).default(20),
    offset: zod_1.z.number().int().min(0).default(0),
});
// Search Result Schema
exports.SearchResultSchema = zod_1.z.object({
    creations: zod_1.z.array(zod_1.z.any()), // Creation[]
    total: zod_1.z.number().int().min(0),
    hasMore: zod_1.z.boolean(),
    nextOffset: zod_1.z.number().int().min(0).optional(),
});
// Creation with Interactions Schema
exports.CreationWithInteractionsSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    authorId: zod_1.z.string().uuid(),
    title: zod_1.z.string(),
    description: zod_1.z.string(),
    originalSpec: zod_1.z.string(),
    parsedParameters: zod_1.z.any(),
    mediaFileIds: zod_1.z.array(zod_1.z.string().uuid()),
    tags: zod_1.z.array(zod_1.z.string()),
    isPublic: zod_1.z.boolean(),
    remixedFrom: zod_1.z.string().uuid().optional(),
    stats: zod_1.z.any(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
    interactions: zod_1.z.object({
        counts: zod_1.z.object({
            likes: zod_1.z.number().int().min(0),
            comments: zod_1.z.number().int().min(0),
            remixes: zod_1.z.number().int().min(0),
            views: zod_1.z.number().int().min(0),
        }),
        userInteractions: zod_1.z.object({
            hasLiked: zod_1.z.boolean(),
            hasCommented: zod_1.z.boolean(),
            hasRemixed: zod_1.z.boolean(),
        }),
    }),
});
// Remix Session Schema
exports.RemixSessionSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    originalCreationId: zod_1.z.string().uuid(),
    userId: zod_1.z.string().uuid(),
    inheritedParameters: zod_1.z.any(), // ParsedParameters
    currentParameters: zod_1.z.any(), // ParameterState
    createdAt: zod_1.z.date(),
});
