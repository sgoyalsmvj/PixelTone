"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthResponseSchema = exports.NotificationsListResponseSchema = exports.NotificationResponseSchema = exports.StatsResponseSchema = exports.NLPParseResponseSchema = exports.ExportResponseSchema = exports.UploadResponseSchema = exports.MediaFileResponseSchema = exports.GenerationStatusResponseSchema = exports.GenerationResultResponseSchema = exports.GenerationJobResponseSchema = exports.FollowResponseSchema = exports.LikeResponseSchema = exports.CommentsListResponseSchema = exports.CommentResponseSchema = exports.TrendingResponseSchema = exports.SearchResponseSchema = exports.CreateCreationResponseSchema = exports.CreationsListResponseSchema = exports.CreationResponseSchema = exports.UsersListResponseSchema = exports.UserResponseSchema = exports.RefreshTokenResponseSchema = exports.AuthResponseSchema = exports.BaseResponseSchema = void 0;
const zod_1 = require("zod");
// Base Response Schema
exports.BaseResponseSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    message: zod_1.z.string().optional(),
    timestamp: zod_1.z.string().datetime(),
});
// Authentication Responses
exports.AuthResponseSchema = exports.BaseResponseSchema.extend({
    data: zod_1.z.object({
        user: zod_1.z.any(), // UserSchema
        accessToken: zod_1.z.string(),
        refreshToken: zod_1.z.string(),
        expiresIn: zod_1.z.number().int(), // seconds
    }).optional(),
});
exports.RefreshTokenResponseSchema = exports.BaseResponseSchema.extend({
    data: zod_1.z.object({
        accessToken: zod_1.z.string(),
        expiresIn: zod_1.z.number().int(),
    }).optional(),
});
// User Responses
exports.UserResponseSchema = exports.BaseResponseSchema.extend({
    data: zod_1.z.any().optional(), // UserSchema
});
exports.UsersListResponseSchema = exports.BaseResponseSchema.extend({
    data: zod_1.z.object({
        users: zod_1.z.array(zod_1.z.any()), // UserSchema[]
        total: zod_1.z.number().int(),
        hasMore: zod_1.z.boolean(),
        nextOffset: zod_1.z.number().int().optional(),
    }).optional(),
});
// Creation Responses
exports.CreationResponseSchema = exports.BaseResponseSchema.extend({
    data: zod_1.z.any().optional(), // CreationSchema or CreationWithInteractionsSchema
});
exports.CreationsListResponseSchema = exports.BaseResponseSchema.extend({
    data: zod_1.z.object({
        creations: zod_1.z.array(zod_1.z.any()), // CreationSchema[] or CreationWithInteractionsSchema[]
        total: zod_1.z.number().int(),
        hasMore: zod_1.z.boolean(),
        nextOffset: zod_1.z.number().int().optional(),
        nextCursor: zod_1.z.string().optional(),
    }).optional(),
});
exports.CreateCreationResponseSchema = exports.BaseResponseSchema.extend({
    data: zod_1.z.object({
        id: zod_1.z.string().uuid(),
        creation: zod_1.z.any(), // CreationSchema
    }).optional(),
});
// Gallery Responses
exports.SearchResponseSchema = exports.BaseResponseSchema.extend({
    data: zod_1.z.object({
        results: zod_1.z.array(zod_1.z.any()), // CreationWithInteractionsSchema[]
        total: zod_1.z.number().int(),
        hasMore: zod_1.z.boolean(),
        nextOffset: zod_1.z.number().int().optional(),
        facets: zod_1.z.object({
            tags: zod_1.z.array(zod_1.z.object({
                tag: zod_1.z.string(),
                count: zod_1.z.number().int(),
            })),
            authors: zod_1.z.array(zod_1.z.object({
                authorId: zod_1.z.string().uuid(),
                authorName: zod_1.z.string(),
                count: zod_1.z.number().int(),
            })),
        }).optional(),
    }).optional(),
});
exports.TrendingResponseSchema = exports.BaseResponseSchema.extend({
    data: zod_1.z.object({
        trending: zod_1.z.array(zod_1.z.any()), // CreationWithInteractionsSchema[]
        timeframe: zod_1.z.enum(['hour', 'day', 'week', 'month']),
    }).optional(),
});
// Social Responses
exports.CommentResponseSchema = exports.BaseResponseSchema.extend({
    data: zod_1.z.any().optional(), // CommentSchema
});
exports.CommentsListResponseSchema = exports.BaseResponseSchema.extend({
    data: zod_1.z.object({
        comments: zod_1.z.array(zod_1.z.any()), // CommentSchema[]
        total: zod_1.z.number().int(),
        hasMore: zod_1.z.boolean(),
        nextOffset: zod_1.z.number().int().optional(),
    }).optional(),
});
exports.LikeResponseSchema = exports.BaseResponseSchema.extend({
    data: zod_1.z.object({
        liked: zod_1.z.boolean(),
        totalLikes: zod_1.z.number().int(),
    }).optional(),
});
exports.FollowResponseSchema = exports.BaseResponseSchema.extend({
    data: zod_1.z.object({
        following: zod_1.z.boolean(),
        totalFollowers: zod_1.z.number().int(),
    }).optional(),
});
// Generation Responses
exports.GenerationJobResponseSchema = exports.BaseResponseSchema.extend({
    data: zod_1.z.object({
        jobId: zod_1.z.string().uuid(),
        status: zod_1.z.enum(['pending', 'processing', 'completed', 'failed', 'cancelled']),
        estimatedTime: zod_1.z.number().int().optional(), // seconds
    }).optional(),
});
exports.GenerationResultResponseSchema = exports.BaseResponseSchema.extend({
    data: zod_1.z.any().optional(), // GenerationResultSchema
});
exports.GenerationStatusResponseSchema = exports.BaseResponseSchema.extend({
    data: zod_1.z.object({
        jobId: zod_1.z.string().uuid(),
        status: zod_1.z.enum(['pending', 'processing', 'completed', 'failed', 'cancelled']),
        progress: zod_1.z.number().min(0).max(100),
        currentStep: zod_1.z.string().optional(),
        estimatedTimeRemaining: zod_1.z.number().min(0).optional(),
        result: zod_1.z.any().optional(), // GenerationResultSchema
        error: zod_1.z.string().optional(),
    }).optional(),
});
// Media Responses
exports.MediaFileResponseSchema = exports.BaseResponseSchema.extend({
    data: zod_1.z.any().optional(), // MediaFileSchema
});
exports.UploadResponseSchema = exports.BaseResponseSchema.extend({
    data: zod_1.z.object({
        mediaFile: zod_1.z.any(), // MediaFileSchema
        uploadTime: zod_1.z.number().min(0),
    }).optional(),
});
exports.ExportResponseSchema = exports.BaseResponseSchema.extend({
    data: zod_1.z.object({
        exportId: zod_1.z.string().uuid(),
        downloadUrl: zod_1.z.string().url(),
        expiresAt: zod_1.z.string().datetime(),
        format: zod_1.z.any(), // ExportFormatSchema
    }).optional(),
});
// NLP Responses
exports.NLPParseResponseSchema = exports.BaseResponseSchema.extend({
    data: zod_1.z.object({
        parameters: zod_1.z.any(), // ParsedParametersSchema
        confidence: zod_1.z.number().min(0).max(1),
        ambiguities: zod_1.z.array(zod_1.z.object({
            field: zod_1.z.string(),
            possibleValues: zod_1.z.array(zod_1.z.string()),
            suggestion: zod_1.z.string().optional(),
        })),
        suggestions: zod_1.z.array(zod_1.z.string()),
        processingTime: zod_1.z.number().min(0),
    }).optional(),
});
// Statistics Responses
exports.StatsResponseSchema = exports.BaseResponseSchema.extend({
    data: zod_1.z.object({
        user: zod_1.z.object({
            totalCreations: zod_1.z.number().int(),
            totalLikes: zod_1.z.number().int(),
            totalViews: zod_1.z.number().int(),
            totalFollowers: zod_1.z.number().int(),
            totalFollowing: zod_1.z.number().int(),
        }).optional(),
        platform: zod_1.z.object({
            totalUsers: zod_1.z.number().int(),
            totalCreations: zod_1.z.number().int(),
            totalGenerations: zod_1.z.number().int(),
            activeUsers: zod_1.z.number().int(),
        }).optional(),
    }).optional(),
});
// Notification Responses
exports.NotificationResponseSchema = exports.BaseResponseSchema.extend({
    data: zod_1.z.any().optional(), // NotificationSchema
});
exports.NotificationsListResponseSchema = exports.BaseResponseSchema.extend({
    data: zod_1.z.object({
        notifications: zod_1.z.array(zod_1.z.any()), // NotificationSchema[]
        unreadCount: zod_1.z.number().int(),
        hasMore: zod_1.z.boolean(),
        nextOffset: zod_1.z.number().int().optional(),
    }).optional(),
});
// Health Check Response
exports.HealthResponseSchema = exports.BaseResponseSchema.extend({
    data: zod_1.z.object({
        status: zod_1.z.enum(['healthy', 'degraded', 'unhealthy']),
        services: zod_1.z.record(zod_1.z.object({
            status: zod_1.z.enum(['up', 'down', 'degraded']),
            responseTime: zod_1.z.number().optional(),
            lastCheck: zod_1.z.string().datetime(),
        })),
        version: zod_1.z.string(),
        uptime: zod_1.z.number().int(),
    }).optional(),
});
