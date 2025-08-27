import { PrismaClient } from '@prisma/client'
import { prisma } from '../client'

export abstract class BaseRepository {
  protected db: PrismaClient

  constructor(client?: PrismaClient) {
    this.db = client || prisma
  }

  /**
   * Execute a database operation within a transaction
   */
  async withTransaction<T>(
    operation: (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => Promise<T>
  ): Promise<T> {
    return this.db.$transaction(operation)
  }

  /**
   * Check if a record exists by ID
   */
  async exists(model: string, id: string): Promise<boolean> {
    const record = await (this.db as any)[model].findUnique({
      where: { id },
      select: { id: true }
    })
    return !!record
  }

  /**
   * Get pagination parameters
   */
  protected getPaginationParams(page?: number, limit?: number) {
    const pageSize = Math.min(limit || 20, 100) // Max 100 items per page
    const skip = page && page > 1 ? (page - 1) * pageSize : 0

    return {
      skip,
      take: pageSize
    }
  }

  /**
   * Build search filters for text fields
   */
  protected buildTextSearch(query?: string, fields: string[] = []) {
    if (!query || fields.length === 0) return {}

    return {
      OR: fields.map(field => ({
        [field]: {
          contains: query,
          mode: 'insensitive' as const
        }
      }))
    }
  }
}