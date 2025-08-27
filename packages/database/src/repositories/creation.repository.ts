import { Creation, Prisma } from '@prisma/client'
import { BaseRepository } from './base.repository'
import { CreationWithDetails } from '../types'

export interface CreationSearchFilters {
  authorId?: string
  tags?: string[]
  isPublic?: boolean
  query?: string
}

export interface CreationSortOptions {
  field: 'createdAt' | 'updatedAt' | 'views' | 'likes'
  direction: 'asc' | 'desc'
}

export class CreationRepository extends BaseRepository {
  async create(data: Prisma.CreationCreateInput): Promise<Creation> {
    return this.db.creation.create({
      data
    })
  }

  async findById(id: string): Promise<CreationWithDetails | null> {
    return this.db.creation.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true
          }
        },
        mediaFiles: {
          select: {
            id: true,
            type: true,
            url: true,
            format: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            remixes: true
          }
        }
      }
    }) as Promise<CreationWithDetails | null>
  }

  async update(id: string, data: Prisma.CreationUpdateInput): Promise<Creation> {
    return this.db.creation.update({
      where: { id },
      data
    })
  }

  async delete(id: string): Promise<Creation> {
    return this.db.creation.delete({
      where: { id }
    })
  }

  async incrementViews(id: string): Promise<void> {
    await this.db.creation.update({
      where: { id },
      data: {
        views: {
          increment: 1
        }
      }
    })
  }

  async search(
    filters: CreationSearchFilters = {},
    sort: CreationSortOptions = { field: 'createdAt', direction: 'desc' },
    page?: number,
    limit?: number
  ): Promise<CreationWithDetails[]> {
    const pagination = this.getPaginationParams(page, limit)
    
    const where: Prisma.CreationWhereInput = {
      ...(filters.authorId && { authorId: filters.authorId }),
      ...(filters.isPublic !== undefined && { isPublic: filters.isPublic }),
      ...(filters.tags && filters.tags.length > 0 && {
        tags: {
          hasSome: filters.tags
        }
      }),
      ...this.buildTextSearch(filters.query, ['title', 'description'])
    }

    // Handle sorting by likes count (requires special handling)
    const orderBy = sort.field === 'likes' 
      ? { likes: { _count: sort.direction } }
      : { [sort.field]: sort.direction }

    return this.db.creation.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true
          }
        },
        mediaFiles: {
          select: {
            id: true,
            type: true,
            url: true,
            format: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            remixes: true
          }
        }
      },
      orderBy,
      ...pagination
    }) as Promise<CreationWithDetails[]>
  }

  async getByAuthor(
    authorId: string,
    includePrivate: boolean = false,
    page?: number,
    limit?: number
  ): Promise<CreationWithDetails[]> {
    return this.search(
      {
        authorId,
        ...(includePrivate ? {} : { isPublic: true })
      },
      { field: 'createdAt', direction: 'desc' },
      page,
      limit
    )
  }

  async getRemixes(originalId: string, page?: number, limit?: number): Promise<CreationWithDetails[]> {
    const pagination = this.getPaginationParams(page, limit)

    return this.db.creation.findMany({
      where: {
        remixedFromId: originalId,
        isPublic: true
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true
          }
        },
        mediaFiles: {
          select: {
            id: true,
            type: true,
            url: true,
            format: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            remixes: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      ...pagination
    }) as Promise<CreationWithDetails[]>
  }

  async getTrending(timeframe: 'day' | 'week' | 'month' = 'week', limit: number = 20): Promise<CreationWithDetails[]> {
    const since = new Date()
    switch (timeframe) {
      case 'day':
        since.setDate(since.getDate() - 1)
        break
      case 'week':
        since.setDate(since.getDate() - 7)
        break
      case 'month':
        since.setMonth(since.getMonth() - 1)
        break
    }

    return this.db.creation.findMany({
      where: {
        isPublic: true,
        createdAt: {
          gte: since
        }
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true
          }
        },
        mediaFiles: {
          select: {
            id: true,
            type: true,
            url: true,
            format: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            remixes: true
          }
        }
      },
      orderBy: [
        { likes: { _count: 'desc' } },
        { views: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit
    }) as Promise<CreationWithDetails[]>
  }
}