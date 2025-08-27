import { ParsedParameters } from '../models/generation';
import { ValidationResult } from '../utils/validation';

export interface NLPService {
  parseCreativeInput(
    input: string, 
    type: 'visual' | 'audio' | 'mixed'
  ): Promise<ParsedParameters>;
  
  validateParameters(params: ParsedParameters): ValidationResult;
  
  suggestImprovements(params: ParsedParameters): string[];
  
  extractIntent(input: string): Promise<CreativeIntent>;
  
  analyzeSentiment(input: string): Promise<SentimentAnalysis>;
}

export interface CreativeIntent {
  type: 'visual' | 'audio' | 'mixed';
  confidence: number;
  keywords: string[];
  entities: NamedEntity[];
}

export interface NamedEntity {
  text: string;
  label: string;
  confidence: number;
  start: number;
  end: number;
}

export interface SentimentAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  emotions: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
  };
}

export interface NLPProcessingOptions {
  language?: string;
  includeEntities?: boolean;
  includeSentiment?: boolean;
  customVocabulary?: string[];
}