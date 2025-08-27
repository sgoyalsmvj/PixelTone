import { z } from 'zod';

// Authentication Requests
export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const RegisterRequestSchema = z.object({
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  displayName: z.string().min(1).max(100),
});

export const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string(),
});

// User Management Requests
export const UpdateProfileRequestSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  avatar: z.string().url().optional(),
  socialLinks: z.array(z.string().url()).optional(),
});

export const UpdatePreferencesRequestSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).optional(),
  notifications: z.object({
    email: z.boolean().optional(),
    push: z.boolean().optional(),
    comments: z.boolean().optional(),
    likes: z.boolean().optional(),
    remixes: z.boolean().optional(),
  }).optional(),
  privacy: z.object({
    showProfile: z.boolean().optional(),
    showCreations: z.boolean().optional(),
    allowRemixes: z.boolean().optional(),
  }).optional(),
});

// Creation Requests
export const CreateCreationRequestSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  originalSpec: z.string().min(1).max(2000),
  parsedParameters: z.any(), // ParsedParametersSchema
  mediaFileIds: z.array(z.string().uuid()),
  tags: z.array(z.string().min(1).max(50)).max(10),
  isPublic: z.boolean().default(true),
  remixedFrom: z.string().uuid().optional(),
});

export const UpdateCreationRequestSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  tags: z.array(z.string().min(1).max(50)).max(10).optional(),
  isPublic: z.boolean().optional(),
});

// Gallery Requests
export const SearchCreationsRequestSchema = z.object({
  query: z.string().max(200).optional(),
  tags: z.array(z.string()).optional(),
  authorId: z.string().uuid().optional(),
  hasVisual: z.boolean().optional(),
  hasAudio: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  remixedFrom: z.string().uuid().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  sortBy: z.enum(['recent', 'popular', 'trending', 'mostLiked', 'mostRemixed']).default('recent'),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

// Social Interaction Requests
export const CreateCommentRequestSchema = z.object({
  creationId: z.string().uuid(),
  content: z.string().min(1).max(1000),
  parentId: z.string().uuid().optional(),
});

export const UpdateCommentRequestSchema = z.object({
  content: z.string().min(1).max(1000),
});

export const LikeCreationRequestSchema = z.object({
  creationId: z.string().uuid(),
});

export const FollowUserRequestSchema = z.object({
  userId: z.string().uuid(),
});

// Generation Requests
export const CreateGenerationRequestSchema = z.object({
  sessionId: z.string().uuid(),
  type: z.enum(['visual', 'audio']),
  parameters: z.any(), // VisualParameters or AudioParameters
  priority: z.number().int().min(0).max(10).default(5),
  options: z.object({
    seed: z.number().int().optional(),
    steps: z.number().int().min(1).max(100).optional(),
    guidance: z.number().min(0).max(20).optional(),
    model: z.string().optional(),
  }).optional(),
});

// Media Requests
export const ExportMediaRequestSchema = z.object({
  creationId: z.string().uuid(),
  format: z.object({
    type: z.enum(['image', 'video', 'audio']),
    format: z.string(),
    quality: z.enum(['low', 'medium', 'high']).default('medium'),
    dimensions: z.object({
      width: z.number().int().min(1),
      height: z.number().int().min(1),
    }).optional(),
  }),
});

// Report Requests
export const CreateReportRequestSchema = z.object({
  targetType: z.enum(['creation', 'comment', 'user']),
  targetId: z.string().uuid(),
  reason: z.enum(['spam', 'inappropriate', 'copyright', 'harassment', 'other']),
  description: z.string().max(1000).optional(),
});

// Pagination Request
export const PaginationRequestSchema = z.object({
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
  cursor: z.string().optional(),
});

// TypeScript Types
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;
export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequestSchema>;
export type UpdatePreferencesRequest = z.infer<typeof UpdatePreferencesRequestSchema>;
export type CreateCreationRequest = z.infer<typeof CreateCreationRequestSchema>;
export type UpdateCreationRequest = z.infer<typeof UpdateCreationRequestSchema>;
export type SearchCreationsRequest = z.infer<typeof SearchCreationsRequestSchema>;
export type CreateCommentRequest = z.infer<typeof CreateCommentRequestSchema>;
export type UpdateCommentRequest = z.infer<typeof UpdateCommentRequestSchema>;
export type LikeCreationRequest = z.infer<typeof LikeCreationRequestSchema>;
export type FollowUserRequest = z.infer<typeof FollowUserRequestSchema>;
export type CreateGenerationRequest = z.infer<typeof CreateGenerationRequestSchema>;
export type ExportMediaRequest = z.infer<typeof ExportMediaRequestSchema>;
export type CreateReportRequest = z.infer<typeof CreateReportRequestSchema>;
export type PaginationRequest = z.infer<typeof PaginationRequestSchema>;