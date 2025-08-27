import { ParsedParameters } from './generation';
import { MediaFile } from './media';
import { User } from './user';

export interface Creation {
  id: string;
  authorId: string;
  author?: User;
  title: string;
  description: string;
  originalSpec: string;
  parsedParameters: ParsedParameters;
  generatedMedia: MediaFile[];
  tags: string[];
  isPublic: boolean;
  remixedFrom?: string;
  remixedFromCreation?: Creation;
  stats: CreationStats;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreationStats {
  views: number;
  likes: number;
  remixes: number;
  comments: number;
  exports: number;
}

export interface CreationMetadata {
  title: string;
  description: string;
  tags: string[];
  isPublic: boolean;
  customThumbnail?: string;
}

export interface RemixSession {
  id: string;
  originalCreationId: string;
  userId: string;
  parameters: ParsedParameters;
  isActive: boolean;
  createdAt: Date;
}