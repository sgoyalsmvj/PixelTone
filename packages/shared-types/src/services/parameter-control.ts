import { ParameterState } from '../models/generation';

export interface ParameterControlService {
  updateParameter(
    sessionId: string, 
    param: string, 
    value: any
  ): Promise<void>;
  
  subscribeToUpdates(
    sessionId: string, 
    callback: UpdateCallback
  ): void;
  
  unsubscribeFromUpdates(sessionId: string): void;
  
  getParameterState(sessionId: string): Promise<ParameterState | null>;
  
  resetParameters(sessionId: string): Promise<void>;
  
  saveParameterSnapshot(
    sessionId: string, 
    name: string
  ): Promise<ParameterSnapshot>;
  
  loadParameterSnapshot(
    sessionId: string, 
    snapshotId: string
  ): Promise<void>;
  
  getParameterHistory(sessionId: string): Promise<ParameterHistoryEntry[]>;
}

export type UpdateCallback = (update: ParameterUpdate) => void;

export interface ParameterUpdate {
  sessionId: string;
  parameter: string;
  value: any;
  timestamp: Date;
  userId?: string;
}

export interface ParameterSnapshot {
  id: string;
  sessionId: string;
  name: string;
  state: ParameterState;
  createdAt: Date;
}

export interface ParameterHistoryEntry {
  id: string;
  sessionId: string;
  parameter: string;
  oldValue: any;
  newValue: any;
  userId?: string;
  timestamp: Date;
}

export interface ParameterValidationRule {
  parameter: string;
  type: 'number' | 'string' | 'array' | 'object';
  required?: boolean;
  min?: number;
  max?: number;
  allowedValues?: any[];
  pattern?: string;
}