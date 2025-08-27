import { z } from 'zod';
import { ParsedParameters, ParsedParametersSchema } from '../models/creation';

// NLP Input Schema
export const NLPInputSchema = z.object({
  text: z.string().min(1).max(2000),
  type: z.enum(['visual', 'audio', 'mixed']),
  context: z.object({
    previousParameters: z.any().optional(), // ParsedParameters
    userPreferences: z.record(z.any()).optional(),
  }).optional(),
});

// Validation Result Schema
export const ValidationResultSchema = z.object({
  isValid: z.boolean(),
  errors: z.array(z.object({
    field: z.string(),
    message: z.string(),
    code: z.string(),
  })).default([]),
  warnings: z.array(z.object({
    field: z.string(),
    message: z.string(),
    suggestion: z.string().optional(),
  })).default([]),
});

// NLP Response Schema
export const NLPResponseSchema = z.object({
  parameters: z.any(), // ParsedParameters
  confidence: z.number().min(0).max(1),
  ambiguities: z.array(z.object({
    field: z.string(),
    possibleValues: z.array(z.string()),
    suggestion: z.string().optional(),
  })).default([]),
  suggestions: z.array(z.string()).default([]),
  processingTime: z.number().min(0),
});

// TypeScript Types
export type NLPInput = z.infer<typeof NLPInputSchema>;
export type ValidationResult = z.infer<typeof ValidationResultSchema>;
export type NLPResponse = z.infer<typeof NLPResponseSchema>;

// Service Interface
export interface NLPService {
  /**
   * Parse natural language input into structured parameters
   */
  parseCreativeInput(input: NLPInput): Promise<NLPResponse>;
  
  /**
   * Validate parsed parameters for completeness and correctness
   */
  validateParameters(parameters: ParsedParameters): Promise<ValidationResult>;
  
  /**
   * Suggest improvements for ambiguous or incomplete parameters
   */
  suggestImprovements(parameters: ParsedParameters): Promise<string[]>;
  
  /**
   * Extract intent from user input (visual, audio, or mixed)
   */
  classifyIntent(text: string): Promise<'visual' | 'audio' | 'mixed'>;
  
  /**
   * Analyze sentiment and mood from text input
   */
  analyzeSentiment(text: string): Promise<{
    sentiment: 'positive' | 'negative' | 'neutral';
    mood: string;
    confidence: number;
  }>;
}