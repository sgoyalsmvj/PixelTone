export interface VisualParameters {
  style: string[];
  colors: string[];
  mood: string;
  composition: string;
  themes: string[];
  resolution: {
    width: number;
    height: number;
  };
  aspectRatio: string;
}

export interface AudioParameters {
  genre: string[];
  instruments: string[];
  tempo: number;
  mood: string;
  structure: string;
  duration: number;
  key: string;
}

export interface ParsedParameters {
  visual?: VisualParameters;
  audio?: AudioParameters;
  confidence: number;
  ambiguities: string[];
  suggestions?: string[];
}

export interface GenerationResult {
  id: string;
  type: 'visual' | 'audio';
  url: string;
  metadata: GenerationMetadata;
  processingTime: number;
  status: GenerationStatus;
  createdAt: Date;
}

export interface GenerationMetadata {
  model: string;
  version: string;
  parameters: Record<string, any>;
  seed?: number;
  iterations?: number;
  cost?: number;
}

export type GenerationStatus = 
  | 'pending'
  | 'processing' 
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface GenerationJob {
  id: string;
  userId: string;
  type: 'visual' | 'audio';
  parameters: ParsedParameters;
  status: GenerationStatus;
  progress: number;
  result?: GenerationResult;
  error?: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export interface GenerationSession {
  id: string;
  userId: string;
  currentParameters: ParameterState;
  generationHistory: GenerationResult[];
  isActive: boolean;
  createdAt: Date;
  lastActivity: Date;
}

export interface ParameterState {
  visual: VisualParameters;
  audio: AudioParameters;
  lastModified: Date;
  version: number;
}