// Common utility types used across the application

// Pagination Types
export interface PaginationMeta {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
  nextOffset?: number;
  nextCursor?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// Cursor-based Pagination
export interface CursorPagination {
  cursor?: string;
  limit: number;
}

export interface CursorPaginatedResponse<T> {
  data: T[];
  nextCursor?: string;
  hasMore: boolean;
}

// Sorting Types
export type SortOrder = 'asc' | 'desc';

export interface SortOptions {
  field: string;
  order: SortOrder;
}

// Filter Types
export type FilterOperator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'contains' | 'startsWith' | 'endsWith';

export interface FilterCondition {
  field: string;
  operator: FilterOperator;
  value: any;
}

export interface FilterGroup {
  conditions: FilterCondition[];
  operator: 'and' | 'or';
}

// Date Range Types
export interface DateRange {
  from?: Date;
  to?: Date;
}

// File Types
export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  lastModified: Date;
}

// API Response Wrapper
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  timestamp: string;
}

// WebSocket Message Types
export interface WebSocketMessage<T = any> {
  type: string;
  payload: T;
  timestamp: Date;
  id?: string;
}

// Event Types
export interface EventPayload<T = any> {
  type: string;
  data: T;
  userId?: string;
  sessionId?: string;
  timestamp: Date;
}

// Cache Types
export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  tags?: string[]; // Cache tags for invalidation
}

// Search Types
export interface SearchOptions {
  query?: string;
  filters?: FilterGroup[];
  sort?: SortOptions[];
  pagination?: PaginationMeta | CursorPagination;
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  facets?: Record<string, Array<{ value: string; count: number }>>;
  suggestions?: string[];
}

// Validation Types
export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings?: ValidationError[];
}

// Async Operation Types
export type AsyncOperationStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface AsyncOperation<T = any> {
  id: string;
  status: AsyncOperationStatus;
  progress?: number; // 0-100
  result?: T;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

// Configuration Types
export interface ServiceConfig {
  enabled: boolean;
  endpoint?: string;
  timeout?: number;
  retries?: number;
  rateLimit?: {
    requests: number;
    window: number; // in seconds
  };
}

// Metrics Types
export interface Metrics {
  timestamp: Date;
  values: Record<string, number>;
  tags?: Record<string, string>;
}

// Health Check Types
export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';

export interface HealthCheck {
  service: string;
  status: HealthStatus;
  responseTime?: number;
  lastCheck: Date;
  details?: Record<string, any>;
}

// Utility Type Helpers
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & globalThis.Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// ID Types
export type UUID = string;
export type Timestamp = Date;

// Environment Types
export type Environment = 'development' | 'staging' | 'production';

// Feature Flag Types
export interface FeatureFlag {
  name: string;
  enabled: boolean;
  rolloutPercentage?: number;
  conditions?: Record<string, any>;
}

// Audit Types
export interface AuditLog {
  id: UUID;
  userId?: UUID;
  action: string;
  resource: string;
  resourceId?: UUID;
  changes?: Record<string, { from: any; to: any }>;
  metadata?: Record<string, any>;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}