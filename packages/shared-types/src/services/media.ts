import { z } from 'zod';
import { MediaFile, ExportFormat, ExportResult } from '../models/media';

// Upload Request Schema
export const UploadRequestSchema = z.object({
  file: z.any(), // File object in browser, Buffer in Node.js
  type: z.enum(['image', 'video', 'audio']),
  metadata: z.object({
    originalName: z.string(),
    mimeType: z.string(),
    size: z.number().int().min(0),
  }),
});

// Upload Result Schema
export const UploadResultSchema = z.object({
  mediaFile: z.any(), // MediaFile
  uploadTime: z.number().min(0), // in milliseconds
});

// Optimization Options Schema
export const OptimizationOptionsSchema = z.object({
  quality: z.number().min(0).max(100).default(80),
  maxWidth: z.number().int().min(1).optional(),
  maxHeight: z.number().int().min(1).optional(),
  format: z.string().optional(), // target format for conversion
  progressive: z.boolean().default(true), // for JPEG images
  stripMetadata: z.boolean().default(true),
});

// Thumbnail Options Schema
export const ThumbnailOptionsSchema = z.object({
  width: z.number().int().min(1).default(300),
  height: z.number().int().min(1).default(300),
  crop: z.enum(['center', 'top', 'bottom', 'left', 'right']).default('center'),
  quality: z.number().min(0).max(100).default(80),
});

// TypeScript Types
export type UploadRequest = z.infer<typeof UploadRequestSchema>;
export type UploadResult = z.infer<typeof UploadResultSchema>;
export type OptimizationOptions = z.infer<typeof OptimizationOptionsSchema>;
export type ThumbnailOptions = z.infer<typeof ThumbnailOptionsSchema>;

// Service Interface
export interface MediaService {
  /**
   * Upload a media file to storage
   */
  uploadFile(request: UploadRequest): Promise<UploadResult>;
  
  /**
   * Get a media file by ID
   */
  getMediaFile(id: string): Promise<MediaFile>;
  
  /**
   * Delete a media file
   */
  deleteMediaFile(id: string): Promise<void>;
  
  /**
   * Export a creation in the specified format
   */
  exportCreation(creationId: string, format: ExportFormat): Promise<ExportResult>;
  
  /**
   * Generate a thumbnail for an image or video
   */
  generateThumbnail(mediaId: string, options?: ThumbnailOptions): Promise<string>;
  
  /**
   * Optimize a media file for web delivery
   */
  optimizeForWeb(mediaId: string, options?: OptimizationOptions): Promise<string>;
  
  /**
   * Validate a media file for platform requirements
   */
  validateMediaFile(file: any): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
    metadata: {
      type: string;
      format: string;
      size: number;
      dimensions?: { width: number; height: number };
      duration?: number;
    };
  }>;
  
  /**
   * Get signed URL for direct file access
   */
  getSignedUrl(mediaId: string, expiresIn?: number): Promise<string>;
  
  /**
   * Batch process multiple media files
   */
  batchProcess(mediaIds: string[], operation: 'optimize' | 'thumbnail' | 'convert', options?: any): Promise<{
    successful: string[];
    failed: Array<{ mediaId: string; error: string }>;
  }>;
  
  /**
   * Get media file usage statistics
   */
  getUsageStats(userId?: string): Promise<{
    totalFiles: number;
    totalSize: number; // in bytes
    byType: Record<'image' | 'video' | 'audio', { count: number; size: number }>;
    storageQuota: number; // in bytes
    storageUsed: number; // in bytes
  }>;
}