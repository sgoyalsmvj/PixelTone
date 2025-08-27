// Common utility types used across the application

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type Timestamp = string; // ISO 8601 timestamp
export type UUID = string;
export type URL = string;

export interface PaginationOptions {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface SortOptions<T = string> {
  sortBy?: T;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterOptions {
  [key: string]: any;
}

export interface SearchOptions extends PaginationOptions, SortOptions {
  query?: string;
  filters?: FilterOptions;
}

export type EventHandler<T = any> = (event: T) => void | Promise<void>;

export interface EventEmitter<T extends Record<string, any> = Record<string, any>> {
  on<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void;
  off<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void;
  emit<K extends keyof T>(event: K, data: T[K]): void;
}

export type AsyncReturnType<T extends (...args: any) => Promise<any>> = 
  T extends (...args: any) => Promise<infer R> ? R : any;

export type Constructor<T = {}> = new (...args: any[]) => T;

export interface Serializable {
  toJSON(): Record<string, any>;
}

export interface Comparable<T> {
  equals(other: T): boolean;
}

export interface Cloneable<T> {
  clone(): T;
}