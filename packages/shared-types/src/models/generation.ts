import { z } from 'zod';
import { ParsedParametersSchema } from './creation';

// Generation Status Schema
export const GenerationStatusSchema = z.enum([
  'pending',
  'processing',
  'completed',
  'failed',
  'cancelled'
]);

// Generation Metadata Schema
export const GenerationMetadataSchema = z.object({
  model: z.string(),
  version: z.string().optional(),
  seed: z.number().int().optional(),
  steps: z.number().int().optional(),
  guidance: z.number().optional(),
  sampler: z.string().optional(),
});

// Generation Result Schema
export const GenerationResultSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['visual', 'audio']),
  status: GenerationStatusSchema,
  mediaFileId: z.string().uuid().optional(),
  url: z.string().url().optional(),
  metadata: GenerationMetadataSchema,
  processingTime: z.number().min(0).optional(), // in milliseconds
  error: z.string().optional(),
  createdAt: z.date(),
  completedAt: z.date().optional(),
});

// Generation Job Schema
export const GenerationJobSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  sessionId: z.string().uuid(),
  type: z.enum(['visual', 'audio']),
  parameters: ParsedParametersSchema,
  priority: z.number().int().min(0).max(10).default(5),
  status: GenerationStatusSchema.default('pending'),
  result: GenerationResultSchema.optional(),
  retryCount: z.number().int().min(0).default(0),
  maxRetries: z.number().int().min(0).default(3),
  createdAt: z.date(),
  startedAt: z.date().optional(),
  completedAt: z.date().optional(),
});

// Parameter State Schema for real-time updates
export const ParameterStateSchema = z.object({
  visual: z.object({
    style: z.array(z.string()).default([]),
    colors: z.array(z.string()).default([]),
    mood: z.string().default(''),
    composition: z.string().default(''),
    themes: z.array(z.string()).default([]),
  }).optional(),
  audio: z.object({
    genre: z.array(z.string()).default([]),
    instruments: z.array(z.string()).default([]),
    tempo: z.number().int().min(60).max(200).default(120),
    mood: z.string().default(''),
    structure: z.string().default(''),
  }).optional(),
  lastModified: z.date(),
  version: z.number().int().min(0).default(0),
});

// Generation Session Schema
export const GenerationSessionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  currentParameters: ParameterStateSchema,
  generationHistory: z.array(z.string().uuid()).default([]), // GenerationResult IDs
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  lastActivity: z.date(),
});

// TypeScript Types
export type GenerationStatus = z.infer<typeof GenerationStatusSchema>;
export type GenerationMetadata = z.infer<typeof GenerationMetadataSchema>;
export type GenerationResult = z.infer<typeof GenerationResultSchema>;
export type GenerationJob = z.infer<typeof GenerationJobSchema>;
export type ParameterState = z.infer<typeof ParameterStateSchema>;
export type GenerationSession = z.infer<typeof GenerationSessionSchema>;

// Input Types
export type CreateGenerationJobInput = Omit<GenerationJob, 'id' | 'status' | 'result' | 'retryCount' | 'createdAt' | 'startedAt' | 'completedAt'>;
export type UpdateParameterStateInput = Partial<Omit<ParameterState, 'lastModified' | 'version'>>;

// Parameter Update Types for real-time control
export type ParameterUpdate = {
  sessionId: string;
  path: string; // e.g., 'visual.mood', 'audio.tempo'
  value: any;
  timestamp: Date;
};

export type ParameterUpdateCallback = (update: ParameterUpdate) => void;