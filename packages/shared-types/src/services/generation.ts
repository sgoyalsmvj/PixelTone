import { z } from 'zod';
import { 
  GenerationJob, 
  GenerationResult, 
  GenerationStatus,
  GenerationStatusSchema,
  ParameterState 
} from '../models/generation';
import { VisualParameters, AudioParameters, VisualParametersSchema, AudioParametersSchema } from '../models/creation';

// Generation Request Schema
export const GenerationRequestSchema = z.object({
  sessionId: z.string().uuid(),
  type: z.enum(['visual', 'audio']),
  parameters: z.union([VisualParametersSchema, AudioParametersSchema]),
  priority: z.number().int().min(0).max(10).default(5),
  options: z.object({
    seed: z.number().int().optional(),
    steps: z.number().int().min(1).max(100).optional(),
    guidance: z.number().min(0).max(20).optional(),
    model: z.string().optional(),
  }).optional(),
});

// Generation Progress Schema
export const GenerationProgressSchema = z.object({
  jobId: z.string().uuid(),
  status: GenerationStatusSchema,
  progress: z.number().min(0).max(100).default(0),
  currentStep: z.string().optional(),
  estimatedTimeRemaining: z.number().min(0).optional(), // in seconds
  message: z.string().optional(),
});

// TypeScript Types
export type GenerationRequest = z.infer<typeof GenerationRequestSchema>;
export type GenerationProgress = z.infer<typeof GenerationProgressSchema>;

// Service Interface
export interface GenerationService {
  /**
   * Generate visual content from parameters
   */
  generateVisual(request: GenerationRequest): Promise<GenerationResult>;
  
  /**
   * Generate audio content from parameters
   */
  generateAudio(request: GenerationRequest): Promise<GenerationResult>;
  
  /**
   * Get the current status of a generation job
   */
  getGenerationStatus(jobId: string): Promise<GenerationProgress>;
  
  /**
   * Cancel an ongoing generation job
   */
  cancelGeneration(jobId: string): Promise<void>;
  
  /**
   * Get generation history for a session
   */
  getGenerationHistory(sessionId: string): Promise<GenerationResult[]>;
  
  /**
   * Retry a failed generation job
   */
  retryGeneration(jobId: string): Promise<GenerationResult>;
  
  /**
   * Get available AI models and their capabilities
   */
  getAvailableModels(): Promise<{
    visual: Array<{
      id: string;
      name: string;
      description: string;
      capabilities: string[];
      maxResolution: { width: number; height: number };
    }>;
    audio: Array<{
      id: string;
      name: string;
      description: string;
      capabilities: string[];
      maxDuration: number; // in seconds
    }>;
  }>;
}