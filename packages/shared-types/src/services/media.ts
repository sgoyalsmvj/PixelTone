import { MediaFile, ExportFormat, ExportResult } from '../models/media';
import { ValidationResult } from '../utils/validation';

export interface MediaService {
  uploadFile(file: File, metadata?: Record<string, any>): Promise<MediaFile>;
  
  getFile(id: string): Promise<MediaFile | null>;
  
  deleteFile(id: string): Promise<void>;
  
  exportCreation(creationId: string, format: ExportFormat): Promise<ExportResult>;
  
  generateThumbnail(mediaUrl: string, options?: ThumbnailOptions): Promise<string>;
  
  optimizeForWeb(mediaUrl: string, options?: OptimizationOptions): Promise<string>;
  
  validateMediaFile(file: File): ValidationResult;
  
  getUploadUrl(filename: string, contentType: string): Promise<UploadUrlResult>;
  
  processMediaFile(fileId: string): Promise<void>;
}

export interface ThumbnailOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

export interface OptimizationOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  format?: string;
  progressive?: boolean;
}

export interface UploadUrlResult {
  uploadUrl: string;
  fileId: string;
  expiresAt: Date;
}

export interface MediaProcessingJob {
  id: string;
  fileId: string;
  type: 'thumbnail' | 'optimization' | 'conversion';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  result?: string;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}