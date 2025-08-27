import { z } from 'zod';

// Base Response Schema
export const BaseResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  timestamp: z.string().datetime(),
});

// Authentication Responses
export const AuthResponseSchema = BaseResponseSchema.extend({
  data: z.object({
    user: z.any(), // UserSchema
    accessToken: z.string(),
    refreshToken: z.string(),
    expiresIn: z.number().int(), // seconds
  }).optional(),
});

export const RefreshTokenResponseSchema = BaseResponseSchema.extend({
  data: z.object({
    accessToken: z.string(),
    expiresIn: z.number().int(),
  }).optional(),
});

// User Responses
export const UserResponseSchema = BaseResponseSchema.extend({
  data: z.any().optional(), // UserSchema
});

export const UsersListResponseSchema = BaseResponseSchema.extend({
  data: z.object({
    users: z.array(z.any()), // UserSchema[]
    total: z.number().int(),
    hasMore: z.boolean(),
    nextOffset: z.number().int().optional(),
  }).optional(),
});

// Creation Responses
export const CreationResponseSchema = BaseResponseSchema.extend({
  data: z.any().optional(), // CreationSchema or CreationWithInteractionsSchema
});

export const CreationsListResponseSchema = BaseResponseSchema.extend({
  data: z.object({
    creations: z.array(z.any()), // CreationSchema[] or CreationWithInteractionsSchema[]
    total: z.number().int(),
    hasMore: z.boolean(),
    nextOffset: z.number().int().optional(),
    nextCursor: z.string().optional(),
  }).optional(),
});

export const CreateCreationResponseSchema = BaseResponseSchema.extend({
  data: z.object({
    id: z.string().uuid(),
    creation: z.any(), // CreationSchema
  }).optional(),
});

// Gallery Responses
export const SearchResponseSchema = BaseResponseSchema.extend({
  data: z.object({
    results: z.array(z.any()), // CreationWithInteractionsSchema[]
    total: z.number().int(),
    hasMore: z.boolean(),
    nextOffset: z.number().int().optional(),
    facets: z.object({
      tags: z.array(z.object({
        tag: z.string(),
        count: z.number().int(),
      })),
      authors: z.array(z.object({
        authorId: z.string().uuid(),
        authorName: z.string(),
        count: z.number().int(),
      })),
    }).optional(),
  }).optional(),
});

export const TrendingResponseSchema = BaseResponseSchema.extend({
  data: z.object({
    trending: z.array(z.any()), // CreationWithInteractionsSchema[]
    timeframe: z.enum(['hour', 'day', 'week', 'month']),
  }).optional(),
});

// Social Responses
export const CommentResponseSchema = BaseResponseSchema.extend({
  data: z.any().optional(), // CommentSchema
});

export const CommentsListResponseSchema = BaseResponseSchema.extend({
  data: z.object({
    comments: z.array(z.any()), // CommentSchema[]
    total: z.number().int(),
    hasMore: z.boolean(),
    nextOffset: z.number().int().optional(),
  }).optional(),
});

export const LikeResponseSchema = BaseResponseSchema.extend({
  data: z.object({
    liked: z.boolean(),
    totalLikes: z.number().int(),
  }).optional(),
});

export const FollowResponseSchema = BaseResponseSchema.extend({
  data: z.object({
    following: z.boolean(),
    totalFollowers: z.number().int(),
  }).optional(),
});

// Generation Responses
export const GenerationJobResponseSchema = BaseResponseSchema.extend({
  data: z.object({
    jobId: z.string().uuid(),
    status: z.enum(['pending', 'processing', 'completed', 'failed', 'cancelled']),
    estimatedTime: z.number().int().optional(), // seconds
  }).optional(),
});

export const GenerationResultResponseSchema = BaseResponseSchema.extend({
  data: z.any().optional(), // GenerationResultSchema
});

export const GenerationStatusResponseSchema = BaseResponseSchema.extend({
  data: z.object({
    jobId: z.string().uuid(),
    status: z.enum(['pending', 'processing', 'completed', 'failed', 'cancelled']),
    progress: z.number().min(0).max(100),
    currentStep: z.string().optional(),
    estimatedTimeRemaining: z.number().min(0).optional(),
    result: z.any().optional(), // GenerationResultSchema
    error: z.string().optional(),
  }).optional(),
});

// Media Responses
export const MediaFileResponseSchema = BaseResponseSchema.extend({
  data: z.any().optional(), // MediaFileSchema
});

export const UploadResponseSchema = BaseResponseSchema.extend({
  data: z.object({
    mediaFile: z.any(), // MediaFileSchema
    uploadTime: z.number().min(0),
  }).optional(),
});

export const ExportResponseSchema = BaseResponseSchema.extend({
  data: z.object({
    exportId: z.string().uuid(),
    downloadUrl: z.string().url(),
    expiresAt: z.string().datetime(),
    format: z.any(), // ExportFormatSchema
  }).optional(),
});

// NLP Responses
export const NLPParseResponseSchema = BaseResponseSchema.extend({
  data: z.object({
    parameters: z.any(), // ParsedParametersSchema
    confidence: z.number().min(0).max(1),
    ambiguities: z.array(z.object({
      field: z.string(),
      possibleValues: z.array(z.string()),
      suggestion: z.string().optional(),
    })),
    suggestions: z.array(z.string()),
    processingTime: z.number().min(0),
  }).optional(),
});

// Statistics Responses
export const StatsResponseSchema = BaseResponseSchema.extend({
  data: z.object({
    user: z.object({
      totalCreations: z.number().int(),
      totalLikes: z.number().int(),
      totalViews: z.number().int(),
      totalFollowers: z.number().int(),
      totalFollowing: z.number().int(),
    }).optional(),
    platform: z.object({
      totalUsers: z.number().int(),
      totalCreations: z.number().int(),
      totalGenerations: z.number().int(),
      activeUsers: z.number().int(),
    }).optional(),
  }).optional(),
});

// Notification Responses
export const NotificationResponseSchema = BaseResponseSchema.extend({
  data: z.any().optional(), // NotificationSchema
});

export const NotificationsListResponseSchema = BaseResponseSchema.extend({
  data: z.object({
    notifications: z.array(z.any()), // NotificationSchema[]
    unreadCount: z.number().int(),
    hasMore: z.boolean(),
    nextOffset: z.number().int().optional(),
  }).optional(),
});

// Health Check Response
export const HealthResponseSchema = BaseResponseSchema.extend({
  data: z.object({
    status: z.enum(['healthy', 'degraded', 'unhealthy']),
    services: z.record(z.object({
      status: z.enum(['up', 'down', 'degraded']),
      responseTime: z.number().optional(),
      lastCheck: z.string().datetime(),
    })),
    version: z.string(),
    uptime: z.number().int(),
  }).optional(),
});

// TypeScript Types
export type BaseResponse = z.infer<typeof BaseResponseSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type RefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
export type UsersListResponse = z.infer<typeof UsersListResponseSchema>;
export type CreationResponse = z.infer<typeof CreationResponseSchema>;
export type CreationsListResponse = z.infer<typeof CreationsListResponseSchema>;
export type CreateCreationResponse = z.infer<typeof CreateCreationResponseSchema>;
export type SearchResponse = z.infer<typeof SearchResponseSchema>;
export type TrendingResponse = z.infer<typeof TrendingResponseSchema>;
export type CommentResponse = z.infer<typeof CommentResponseSchema>;
export type CommentsListResponse = z.infer<typeof CommentsListResponseSchema>;
export type LikeResponse = z.infer<typeof LikeResponseSchema>;
export type FollowResponse = z.infer<typeof FollowResponseSchema>;
export type GenerationJobResponse = z.infer<typeof GenerationJobResponseSchema>;
export type GenerationResultResponse = z.infer<typeof GenerationResultResponseSchema>;
export type GenerationStatusResponse = z.infer<typeof GenerationStatusResponseSchema>;
export type MediaFileResponse = z.infer<typeof MediaFileResponseSchema>;
export type UploadResponse = z.infer<typeof UploadResponseSchema>;
export type ExportResponse = z.infer<typeof ExportResponseSchema>;
export type NLPParseResponse = z.infer<typeof NLPParseResponseSchema>;
export type StatsResponse = z.infer<typeof StatsResponseSchema>;
export type NotificationResponse = z.infer<typeof NotificationResponseSchema>;
export type NotificationsListResponse = z.infer<typeof NotificationsListResponseSchema>;
export type HealthResponse = z.infer<typeof HealthResponseSchema>;