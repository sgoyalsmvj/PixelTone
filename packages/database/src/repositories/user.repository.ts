import { User, Prisma } from '@prisma/client'
import { BaseRepository } from './base.repository'
import { UserProfile } from '../types'

export class UserRepository extends BaseRepository {
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.db.user.create({
      data
    })
  }

  async findById(id: string): Promise<User | null> {
    return this.db.user.findUnique({
      where: { id }
    })
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.db.user.findUnique({
      where: { email }
    })
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.db.user.findUnique({
      where: { username }
    })
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.db.user.update({
      where: { id },
      data
    })
  }

  async delete(id: string): Promise<User> {
    return this.db.user.delete({
      where: { id }
    })
  }

  async updateLastActive(id: string): Promise<void> {
    await this.db.user.update({
      where: { id },
      data: { lastActive: new Date() }
    })
  }

  async getProfile(id: string): Promise<UserProfile | null> {
    const user = await this.db.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        displayName: true,
        bio: true,
        avatar: true,
        socialLinks: true,
        createdAt: true,
        _count: {
          select: {
            creations: {
              where: { isPublic: true }
            },
            likes: true
          }
        }
      }
    })

    return user as UserProfile | null
  }

  async searchUsers(query: string, page?: number, limit?: number): Promise<UserProfile[]> {
    const pagination = this.getPaginationParams(page, limit)
    const searchFilter = this.buildTextSearch(query, ['username', 'displayName'])

    return this.db.user.findMany({
      where: searchFilter,
      select: {
        id: true,
        username: true,
        displayName: true,
        bio: true,
        avatar: true,
        socialLinks: true,
        createdAt: true,
        _count: {
          select: {
            creations: {
              where: { isPublic: true }
            },
            likes: true
          }
        }
      },
      ...pagination,
      orderBy: { createdAt: 'desc' }
    }) as Promise<UserProfile[]>
  }
}