// Re-export Prisma types for convenience
export type {
  User,
  Creation,
  MediaFile,
  Comment,
  Like,
  Tag,
  GenerationSession,
  GenerationJob,
  MediaType,
  GenerationType,
  GenerationStatus,
  Prisma,
} from '@prisma/client'

// Additional utility types
export interface CreationWithDetails {
  id: string
  title: string
  description: string
  originalSpec: string
  parsedParameters: any
  tags: string[]
  isPublic: boolean
  views: number
  createdAt: Date
  updatedAt: Date
  author: {
    id: string
    username: string
    displayName: string
    avatar?: string
  }
  mediaFiles: {
    id: string
    type: string
    url: string
    format: string
  }[]
  _count: {
    likes: number
    comments: number
    remixes: number
  }
}

export interface UserProfile {
  id: string
  username: string
  displayName: string
  bio?: string
  avatar?: string
  socialLinks: string[]
  createdAt: Date
  _count: {
    creations: number
    likes: number
  }
}

export interface CommentWithAuthor {
  id: string
  content: string
  createdAt: Date
  updatedAt: Date
  author: {
    id: string
    username: string
    displayName: string
    avatar?: string
  }
  replies?: CommentWithAuthor[]
}

export interface GenerationJobWithSession {
  id: string
  type: string
  parameters: any
  status: string
  resultUrl?: string
  errorMessage?: string
  processingTimeMs?: number
  createdAt: Date
  completedAt?: Date
  session: {
    id: string
    userId: string
    currentParameters: any
  }
}