import { Creation, RemixSession, CreationStats } from '../models/creation';
import { Interaction } from '../models/social';

export interface GalleryService {
  saveCreation(creation: Omit<Creation, 'id' | 'createdAt' | 'updatedAt'>): Promise<string>;
  
  getCreation(id: string): Promise<Creation | null>;
  
  updateCreation(id: string, updates: Partial<Creation>): Promise<Creation>;
  
  deleteCreation(id: string): Promise<void>;
  
  searchCreations(query: SearchQuery): Promise<SearchResult>;
  
  getFeaturedCreations(limit?: number): Promise<Creation[]>;
  
  getUserCreations(userId: string, options?: UserCreationsOptions): Promise<Creation[]>;
  
  remixCreation(id: string, userId: string): Promise<RemixSession>;
  
  addInteraction(creationId: string, interaction: Interaction): Promise<void>;
  
  getCreationStats(creationId: string): Promise<CreationStats>;
}

export interface SearchQuery {
  text?: string;
  tags?: string[];
  author?: string;
  type?: 'visual' | 'audio' | 'mixed';
  dateRange?: {
    start: Date;
    end: Date;
  };
  sortBy?: 'relevance' | 'popularity' | 'recent' | 'trending';
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  creations: Creation[];
  total: number;
  facets: {
    tags: { tag: string; count: number }[];
    authors: { author: string; count: number }[];
    types: { type: string; count: number }[];
  };
}

export interface UserCreationsOptions {
  includePrivate?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: 'recent' | 'popular' | 'title';
}