import { 
  ParsedParameters, 
  VisualParameters, 
  AudioParameters 
} from '../models/generation';
import { CreationMetadata } from '../models/creation';
import { ExportFormat } from '../models/media';

// Authentication Requests
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  displayName: string;
}

// NLP Requests
export interface ParseInputRequest {
  input: string;
  type: 'visual' | 'audio' | 'mixed';
  options?: {
    language?: string;
    includeEntities?: boolean;
    includeSentiment?: boolean;
  };
}

// Generation Requests
export interface GenerateVisualRequest {
  parameters: VisualParameters;
  options?: {
    model?: string;
    seed?: number;
    iterations?: number;
  };
}

export interface GenerateAudioRequest {
  parameters: AudioParameters;
  options?: {
    model?: string;
    seed?: number;
    duration?: number;
  };
}

// Creation Requests
export interface CreateCreationRequest {
  title: string;
  description: string;
  originalSpec: string;
  parsedParameters: ParsedParameters;
  mediaFileIds: string[];
  tags: string[];
  isPublic: boolean;
}

export interface UpdateCreationRequest {
  title?: string;
  description?: string;
  tags?: string[];
  isPublic?: boolean;
}

// Gallery Requests
export interface SearchCreationsRequest {
  query?: string;
  tags?: string[];
  author?: string;
  type?: 'visual' | 'audio' | 'mixed';
  sortBy?: 'relevance' | 'popularity' | 'recent' | 'trending';
  limit?: number;
  offset?: number;
}

// Social Requests
export interface AddCommentRequest {
  creationId: string;
  content: string;
  parentId?: string;
}

export interface LikeCreationRequest {
  creationId: string;
}

// Media Requests
export interface ExportCreationRequest {
  creationId: string;
  format: ExportFormat;
}

export interface UploadMediaRequest {
  filename: string;
  contentType: string;
  size: number;
}