import { 
  GenerationResult, 
  GenerationStatus, 
  GenerationJob,
  VisualParameters,
  AudioParameters 
} from '../models/generation';

export interface GenerationService {
  generateVisual(params: VisualParameters): Promise<GenerationResult>;
  
  generateAudio(params: AudioParameters): Promise<GenerationResult>;
  
  getGenerationStatus(jobId: string): Promise<GenerationStatus>;
  
  cancelGeneration(jobId: string): Promise<void>;
  
  getGenerationJob(jobId: string): Promise<GenerationJob>;
  
  listUserGenerations(
    userId: string, 
    options?: GenerationListOptions
  ): Promise<GenerationJob[]>;
}

export interface GenerationListOptions {
  limit?: number;
  offset?: number;
  status?: GenerationStatus;
  type?: 'visual' | 'audio';
  sortBy?: 'createdAt' | 'completedAt' | 'processingTime';
  sortOrder?: 'asc' | 'desc';
}

export interface GenerationProvider {
  name: string;
  type: 'visual' | 'audio';
  isAvailable(): Promise<boolean>;
  generate(params: any): Promise<GenerationResult>;
  getStatus(jobId: string): Promise<GenerationStatus>;
  cancel(jobId: string): Promise<void>;
}

export interface GenerationConfig {
  maxConcurrentJobs: number;
  timeoutMs: number;
  retryAttempts: number;
  providers: {
    visual: GenerationProvider[];
    audio: GenerationProvider[];
  };
}