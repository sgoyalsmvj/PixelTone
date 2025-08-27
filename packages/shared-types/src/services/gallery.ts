import { z } from 'zod';
import { Creation, CreationSortBy, CreationFilter } from '../models/creation';
import { InteractionCounts, UserInteractions } from '../models/social';

// Search Query Schema
export const SearchQuerySchema = z.object({
  query: z.string().max(200).optional(),
  filters: z.object({
    authorId: z.string().uuid().optional(),
    tags: z.array(z.string()).optional(),
    hasVisual: z.boolean().optional(),
    hasAudio: z.boolean().optional(),
    isPublic: z.boolean().optional(),
    remixedFrom: z.string().uuid().optional(),
    dateRange: z.object({
      from: z.date().optional(),
      to: z.date().optional(),
    }).optional(),
  }).optional(),
  sort: z.enum(['recent', 'popular', 'trending', 'mostLiked', 'mostRemixed']).default('recent'),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

// Search Result Schema
export const SearchResultSchema = z.object({
  creations: z.array(z.any()), // Creation[]
  total: z.number().int().min(0),
  hasMore: z.boolean(),
  nextOffset: z.number().int().min(0).optional(),
});

// Creation with Interactions Schema
export const CreationWithInteractionsSchema = z.object({
  id: z.string().uuid(),
  authorId: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  originalSpec: z.string(),
  parsedParameters: z.any(),
  mediaFileIds: z.array(z.string().uuid()),
  tags: z.array(z.string()),
  isPublic: z.boolean(),
  remixedFrom: z.string().uuid().optional(),
  stats: z.any(),
  createdAt: z.date(),
  updatedAt: z.date(),
  interactions: z.object({
    counts: z.object({
      likes: z.number().int().min(0),
      comments: z.number().int().min(0),
      remixes: z.number().int().min(0),
      views: z.number().int().min(0),
    }),
    userInteractions: z.object({
      hasLiked: z.boolean(),
      hasCommented: z.boolean(),
      hasRemixed: z.boolean(),
    }),
  }),
});

// Remix Session Schema
export const RemixSessionSchema = z.object({
  id: z.string().uuid(),
  originalCreationId: z.string().uuid(),
  userId: z.string().uuid(),
  inheritedParameters: z.any(), // ParsedParameters
  currentParameters: z.any(), // ParameterState
  createdAt: z.date(),
});

// TypeScript Types
export type SearchQuery = z.infer<typeof SearchQuerySchema>;
export type SearchResult = z.infer<typeof SearchResultSchema>;
export type CreationWithInteractions = z.infer<typeof CreationWithInteractionsSchema>;
export type RemixSession = z.infer<typeof RemixSessionSchema>;

// Service Interface
export interface GalleryService {
  /**
   * Save a new creation to the gallery
   */
  saveCreation(creation: Omit<Creation, 'id' | 'stats' | 'createdAt' | 'updatedAt'>): Promise<string>;
  
  /**
   * Search for creations based on query and filters
   */
  searchCreations(query: SearchQuery): Promise<SearchResult>;
  
  /**
   * Get a specific creation by ID with interaction data
   */
  getCreation(id: string, userId?: string): Promise<CreationWithInteractions>;
  
  /**
   * Get creations by a specific user
   */
  getUserCreations(userId: string, includePrivate?: boolean): Promise<Creation[]>;
  
  /**
   * Create a remix session from an existing creation
   */
  remixCreation(creationId: string, userId: string): Promise<RemixSession>;
  
  /**
   * Get trending creations
   */
  getTrendingCreations(limit?: number): Promise<CreationWithInteractions[]>;
  
  /**
   * Get featured creations (curated by platform)
   */
  getFeaturedCreations(limit?: number): Promise<CreationWithInteractions[]>;
  
  /**
   * Get popular tags
   */
  getPopularTags(limit?: number): Promise<Array<{ tag: string; count: number }>>;
  
  /**
   * Update creation metadata
   */
  updateCreation(id: string, updates: Partial<Pick<Creation, 'title' | 'description' | 'tags' | 'isPublic'>>): Promise<void>;
  
  /**
   * Delete a creation
   */
  deleteCreation(id: string, userId: string): Promise<void>;
  
  /**
   * Increment view count for a creation
   */
  incrementViews(creationId: string): Promise<void>;
}