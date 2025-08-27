import { z } from 'zod';

// Media Dimensions Schema
export const MediaDimensionsSchema = z.object({
  width: z.number().int().min(1),
  height: z.number().int().min(1),
});

// Media File Schema
export const MediaFileSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['image', 'video', 'audio']),
  url: z.string().url(),
  format: z.string().min(1), // e.g., 'png', 'mp4', 'wav'
  size: z.number().int().min(0), // file size in bytes
  dimensions: MediaDimensionsSchema.optional(), // for images and videos
  duration: z.number().min(0).optional(), // for videos and audio in seconds
  createdAt: z.date(),
});

// Export Format Schema
export const ExportFormatSchema = z.object({
  type: z.enum(['image', 'video', 'audio']),
  format: z.string().min(1), // 'png', 'gif', 'mp4', 'mp3', 'wav'
  quality: z.enum(['low', 'medium', 'high']).default('medium'),
  dimensions: MediaDimensionsSchema.optional(),
});

// Export Result Schema
export const ExportResultSchema = z.object({
  id: z.string().uuid(),
  originalMediaId: z.string().uuid(),
  format: ExportFormatSchema,
  url: z.string().url(),
  size: z.number().int().min(0),
  processingTime: z.number().min(0), // in milliseconds
  createdAt: z.date(),
});

// TypeScript Types
export type MediaDimensions = z.infer<typeof MediaDimensionsSchema>;
export type MediaFile = z.infer<typeof MediaFileSchema>;
export type ExportFormat = z.infer<typeof ExportFormatSchema>;
export type ExportResult = z.infer<typeof ExportResultSchema>;

// Input Types
export type CreateMediaFileInput = Omit<MediaFile, 'id' | 'createdAt'>;
export type ExportRequest = {
  mediaId: string;
  format: ExportFormat;
};

// Validation helpers for file types
export const ImageFormats = ['png', 'jpg', 'jpeg', 'gif', 'webp'] as const;
export const VideoFormats = ['mp4', 'webm', 'mov'] as const;
export const AudioFormats = ['mp3', 'wav', 'ogg', 'aac'] as const;

export type ImageFormat = typeof ImageFormats[number];
export type VideoFormat = typeof VideoFormats[number];
export type AudioFormat = typeof AudioFormats[number];

// File validation schemas
export const ImageFileSchema = MediaFileSchema.extend({
  type: z.literal('image'),
  format: z.enum(ImageFormats),
  dimensions: MediaDimensionsSchema,
});

export const VideoFileSchema = MediaFileSchema.extend({
  type: z.literal('video'),
  format: z.enum(VideoFormats),
  dimensions: MediaDimensionsSchema,
  duration: z.number().min(0),
});

export const AudioFileSchema = MediaFileSchema.extend({
  type: z.literal('audio'),
  format: z.enum(AudioFormats),
  duration: z.number().min(0),
});