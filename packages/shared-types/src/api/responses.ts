import { User } from '../models/user';
import { Creation } from '../models/creation';
import { GenerationResult, ParsedParameters } from '../models/generation';
import { MediaFile, ExportResult } from '../models/media';
import { Comment } from '../models/social';
import { ApiError } from './errors';

// Base Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Authentication Responses
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: string;
}

export interface RefreshTokenResponse {
  token: string;
  expiresAt: string;
}

// NLP Responses
export interface ParseInputResponse {
  parameters: ParsedParameters;
  processingTime: number;
}

// Generation Responses
export interface GenerationResponse {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: GenerationResult;
  estimatedTime?: number;
}

export interface GenerationStatusResponse {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  result?: GenerationResult;
  error?: string;
}

// Creation Responses
export interface CreateCreationResponse {
  creation: Creation;
}

export interface GetCreationResponse {
  creation: Creation;
}

export interface SearchCreationsResponse extends PaginatedResponse<Creation> {
  facets: {
    tags: { tag: string; count: number }[];
    authors: { author: string; count: number }[];
    types: { type: string; count: number }[];
  };
}

// Social Responses
export interface AddCommentResponse {
  comment: Comment;
}

export interface GetCommentsResponse extends PaginatedResponse<Comment> {}

export interface LikeCreationResponse {
  liked: boolean;
  totalLikes: number;
}

// Media Responses
export interface UploadMediaResponse {
  uploadUrl: string;
  fileId: string;
  expiresAt: string;
}

export interface MediaFileResponse {
  file: MediaFile;
}

export interface ExportCreationResponse {
  exportResult: ExportResult;
}

