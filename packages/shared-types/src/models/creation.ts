import { z } from 'zod';

// Creation Stats Schema
export const CreationStatsSchema = z.object({
  views: z.number().int().min(0).default(0),
  likes: z.number().int().min(0).default(0),
  remixes: z.number().int().min(0).default(0),
  comments: z.number().int().min(0).default(0),
  exports: z.number().int().min(0).default(0),
});

// Parsed Parameters Schemas
export const VisualParametersSchema = z.object({
  style: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
  mood: z.string().default(''),
  composition: z.string().default(''),
  themes: z.array(z.string()).default([]),
});

export const AudioParametersSchema = z.object({
  genre: z.array(z.string()).default([]),
  instruments: z.array(z.string()).default([]),
  tempo: z.number().int().min(60).max(200).default(120),
  mood: z.string().default(''),
  structure: z.string().default(''),
});

export const ParsedParametersSchema = z.object({
  visual: VisualParametersSchema.optional(),
  audio: AudioParametersSchema.optional(),
  confidence: z.number().min(0).max(1).default(0),
  ambiguities: z.array(z.string()).default([]),
});

// Creation Schema
export const CreationSchema = z.object({
  id: z.string().uuid(),
  authorId: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).default(''),
  originalSpec: z.string().min(1).max(2000),
  parsedParameters: ParsedParametersSchema,
  mediaFileIds: z.array(z.string().uuid()).default([]),
  tags: z.array(z.string().min(1).max(50)).default([]),
  isPublic: z.boolean().default(true),
  remixedFrom: z.string().uuid().optional(),
  stats: CreationStatsSchema.default({}),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// TypeScript Types
export type CreationStats = z.infer<typeof CreationStatsSchema>;
export type VisualParameters = z.infer<typeof VisualParametersSchema>;
export type AudioParameters = z.infer<typeof AudioParametersSchema>;
export type ParsedParameters = z.infer<typeof ParsedParametersSchema>;
export type Creation = z.infer<typeof CreationSchema>;

// Input Types for Creation/Updates
export type CreateCreationInput = Omit<Creation, 'id' | 'stats' | 'createdAt' | 'updatedAt'>;
export type UpdateCreationInput = Partial<Pick<Creation, 'title' | 'description' | 'tags' | 'isPublic'>>;

// Search and Filter Types
export type CreationSortBy = 'recent' | 'popular' | 'trending' | 'mostLiked' | 'mostRemixed';
export type CreationFilter = {
  authorId?: string;
  tags?: string[];
  hasVisual?: boolean;
  hasAudio?: boolean;
  isPublic?: boolean;
  remixedFrom?: string;
};