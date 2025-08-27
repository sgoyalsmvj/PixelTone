import { z } from 'zod';
import { ParameterState, ParameterUpdate } from '../models/generation';

// Parameter Update Request Schema
export const ParameterUpdateRequestSchema = z.object({
  sessionId: z.string().uuid(),
  path: z.string().min(1), // e.g., 'visual.mood', 'audio.tempo'
  value: z.any(),
  debounceMs: z.number().int().min(0).default(300),
});

// Parameter History Entry Schema
export const ParameterHistoryEntrySchema = z.object({
  id: z.string().uuid(),
  sessionId: z.string().uuid(),
  parameters: z.any(), // ParameterState
  timestamp: z.date(),
  description: z.string().optional(), // user-provided description
});

// Parameter Conflict Schema
export const ParameterConflictSchema = z.object({
  sessionId: z.string().uuid(),
  conflictingUpdates: z.array(z.object({
    userId: z.string().uuid(),
    update: ParameterUpdateRequestSchema,
    timestamp: z.date(),
  })),
  resolution: z.enum(['last-writer-wins', 'merge', 'user-choice']),
});

// WebSocket Event Schemas
export const ParameterUpdateEventSchema = z.object({
  type: z.literal('parameter-update'),
  sessionId: z.string().uuid(),
  update: ParameterUpdateRequestSchema,
  userId: z.string().uuid(),
});

export const ParameterStateEventSchema = z.object({
  type: z.literal('parameter-state'),
  sessionId: z.string().uuid(),
  state: z.any(), // ParameterState
});

export const GenerationTriggeredEventSchema = z.object({
  type: z.literal('generation-triggered'),
  sessionId: z.string().uuid(),
  jobId: z.string().uuid(),
  parameters: z.any(), // ParameterState
});

// TypeScript Types
export type ParameterUpdateRequest = z.infer<typeof ParameterUpdateRequestSchema>;
export type ParameterHistoryEntry = z.infer<typeof ParameterHistoryEntrySchema>;
export type ParameterConflict = z.infer<typeof ParameterConflictSchema>;
export type ParameterUpdateEvent = z.infer<typeof ParameterUpdateEventSchema>;
export type ParameterStateEvent = z.infer<typeof ParameterStateEventSchema>;
export type GenerationTriggeredEvent = z.infer<typeof GenerationTriggeredEventSchema>;

// WebSocket Event Union Type
export type WebSocketEvent = ParameterUpdateEvent | ParameterStateEvent | GenerationTriggeredEvent;

// Callback Types
export type ParameterUpdateCallback = (update: ParameterUpdate) => void;
export type ParameterStateCallback = (state: ParameterState) => void;
export type GenerationCallback = (jobId: string, parameters: ParameterState) => void;

// Service Interface
export interface ParameterControlService {
  /**
   * Update a specific parameter in the session
   */
  updateParameter(request: ParameterUpdateRequest): Promise<void>;
  
  /**
   * Get the current parameter state for a session
   */
  getParameterState(sessionId: string): Promise<ParameterState>;
  
  /**
   * Reset parameters to original parsed values
   */
  resetParameters(sessionId: string): Promise<void>;
  
  /**
   * Save current parameter state to history
   */
  saveToHistory(sessionId: string, description?: string): Promise<string>;
  
  /**
   * Get parameter history for a session
   */
  getParameterHistory(sessionId: string): Promise<ParameterHistoryEntry[]>;
  
  /**
   * Restore parameters from a history entry
   */
  restoreFromHistory(sessionId: string, historyId: string): Promise<void>;
  
  /**
   * Subscribe to parameter updates for a session
   */
  subscribeToUpdates(sessionId: string, callback: ParameterUpdateCallback): () => void;
  
  /**
   * Subscribe to parameter state changes for a session
   */
  subscribeToState(sessionId: string, callback: ParameterStateCallback): () => void;
  
  /**
   * Subscribe to generation events for a session
   */
  subscribeToGeneration(sessionId: string, callback: GenerationCallback): () => void;
  
  /**
   * Handle parameter conflicts in collaborative sessions
   */
  resolveConflict(conflict: ParameterConflict, resolution: 'accept' | 'reject' | 'merge'): Promise<void>;
  
  /**
   * Lock parameters to prevent changes (for collaborative editing)
   */
  lockParameters(sessionId: string, userId: string, parameterPaths: string[]): Promise<void>;
  
  /**
   * Unlock parameters
   */
  unlockParameters(sessionId: string, userId: string, parameterPaths: string[]): Promise<void>;
  
  /**
   * Get locked parameters for a session
   */
  getLockedParameters(sessionId: string): Promise<Record<string, string>>; // path -> userId
}