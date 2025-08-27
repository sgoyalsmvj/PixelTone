"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationRequestSchema = exports.CreateReportRequestSchema = exports.ExportMediaRequestSchema = exports.CreateGenerationRequestSchema = exports.FollowUserRequestSchema = exports.LikeCreationRequestSchema = exports.UpdateCommentRequestSchema = exports.CreateCommentRequestSchema = exports.SearchCreationsRequestSchema = exports.UpdateCreationRequestSchema = exports.CreateCreationRequestSchema = exports.UpdatePreferencesRequestSchema = exports.UpdateProfileRequestSchema = exports.RefreshTokenRequestSchema = exports.RegisterRequestSchema = exports.LoginRequestSchema = void 0;
const zod_1 = require("zod");
// Authentication Requests
exports.LoginRequestSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
});
exports.RegisterRequestSchema = zod_1.z.object({
    username: zod_1.z.string().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8).max(128),
    displayName: zod_1.z.string().min(1).max(100),
});
exports.RefreshTokenRequestSchema = zod_1.z.object({
    refreshToken: zod_1.z.string(),
});
// User Management Requests
exports.UpdateProfileRequestSchema = zod_1.z.object({
    displayName: zod_1.z.string().min(1).max(100).optional(),
    bio: zod_1.z.string().max(500).optional(),
    avatar: zod_1.z.string().url().optional(),
    socialLinks: zod_1.z.array(zod_1.z.string().url()).optional(),
});
exports.UpdatePreferencesRequestSchema = zod_1.z.object({
    theme: zod_1.z.enum(['light', 'dark', 'auto']).optional(),
    notifications: zod_1.z.object({
        email: zod_1.z.boolean().optional(),
        push: zod_1.z.boolean().optional(),
        comments: zod_1.z.boolean().optional(),
        likes: zod_1.z.boolean().optional(),
        remixes: zod_1.z.boolean().optional(),
    }).optional(),
    privacy: zod_1.z.object({
        showProfile: zod_1.z.boolean().optional(),
        showCreations: zod_1.z.boolean().optional(),
        allowRemixes: zod_1.z.boolean().optional(),
    }).optional(),
});
// Creation Requests
exports.CreateCreationRequestSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(200),
    description: zod_1.z.string().max(1000).optional(),
    originalSpec: zod_1.z.string().min(1).max(2000),
    parsedParameters: zod_1.z.any(), // ParsedParametersSchema
    mediaFileIds: zod_1.z.array(zod_1.z.string().uuid()),
    tags: zod_1.z.array(zod_1.z.string().min(1).max(50)).max(10),
    isPublic: zod_1.z.boolean().default(true),
    remixedFrom: zod_1.z.string().uuid().optional(),
});
exports.UpdateCreationRequestSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(200).optional(),
    description: zod_1.z.string().max(1000).optional(),
    tags: zod_1.z.array(zod_1.z.string().min(1).max(50)).max(10).optional(),
    isPublic: zod_1.z.boolean().optional(),
});
// Gallery Requests
exports.SearchCreationsRequestSchema = zod_1.z.object({
    query: zod_1.z.string().max(200).optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    authorId: zod_1.z.string().uuid().optional(),
    hasVisual: zod_1.z.boolean().optional(),
    hasAudio: zod_1.z.boolean().optional(),
    isPublic: zod_1.z.boolean().optional(),
    remixedFrom: zod_1.z.string().uuid().optional(),
    dateFrom: zod_1.z.string().datetime().optional(),
    dateTo: zod_1.z.string().datetime().optional(),
    sortBy: zod_1.z.enum(['recent', 'popular', 'trending', 'mostLiked', 'mostRemixed']).default('recent'),
    limit: zod_1.z.number().int().min(1).max(100).default(20),
    offset: zod_1.z.number().int().min(0).default(0),
});
// Social Interaction Requests
exports.CreateCommentRequestSchema = zod_1.z.object({
    creationId: zod_1.z.string().uuid(),
    content: zod_1.z.string().min(1).max(1000),
    parentId: zod_1.z.string().uuid().optional(),
});
exports.UpdateCommentRequestSchema = zod_1.z.object({
    content: zod_1.z.string().min(1).max(1000),
});
exports.LikeCreationRequestSchema = zod_1.z.object({
    creationId: zod_1.z.string().uuid(),
});
exports.FollowUserRequestSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
});
// Generation Requests
exports.CreateGenerationRequestSchema = zod_1.z.object({
    sessionId: zod_1.z.string().uuid(),
    type: zod_1.z.enum(['visual', 'audio']),
    parameters: zod_1.z.any(), // VisualParameters or AudioParameters
    priority: zod_1.z.number().int().min(0).max(10).default(5),
    options: zod_1.z.object({
        seed: zod_1.z.number().int().optional(),
        steps: zod_1.z.number().int().min(1).max(100).optional(),
        guidance: zod_1.z.number().min(0).max(20).optional(),
        model: zod_1.z.string().optional(),
    }).optional(),
});
// Media Requests
exports.ExportMediaRequestSchema = zod_1.z.object({
    creationId: zod_1.z.string().uuid(),
    format: zod_1.z.object({
        type: zod_1.z.enum(['image', 'video', 'audio']),
        format: zod_1.z.string(),
        quality: zod_1.z.enum(['low', 'medium', 'high']).default('medium'),
        dimensions: zod_1.z.object({
            width: zod_1.z.number().int().min(1),
            height: zod_1.z.number().int().min(1),
        }).optional(),
    }),
});
// Report Requests
exports.CreateReportRequestSchema = zod_1.z.object({
    targetType: zod_1.z.enum(['creation', 'comment', 'user']),
    targetId: zod_1.z.string().uuid(),
    reason: zod_1.z.enum(['spam', 'inappropriate', 'copyright', 'harassment', 'other']),
    description: zod_1.z.string().max(1000).optional(),
});
// Pagination Request
exports.PaginationRequestSchema = zod_1.z.object({
    limit: zod_1.z.number().int().min(1).max(100).default(20),
    offset: zod_1.z.number().int().min(0).default(0),
    cursor: zod_1.z.string().optional(),
});
