import { describe, it, expect } from 'vitest'
import { Prisma, MediaType, GenerationType, GenerationStatus } from '@prisma/client'

// Skip database setup for schema tests
vi.mock('./setup.ts', () => ({}))

describe('Database Schema', () => {
  describe('User model', () => {
    it('should have correct user create input type', () => {
      const userCreateInput: Prisma.UserCreateInput = {
        username: 'testuser',
        email: 'test@example.com',
        displayName: 'Test User',
        bio: 'Test bio',
        socialLinks: ['https://twitter.com/test'],
        preferences: { theme: 'dark' }
      }

      expect(userCreateInput.username).toBe('testuser')
      expect(userCreateInput.email).toBe('test@example.com')
      expect(userCreateInput.displayName).toBe('Test User')
      expect(userCreateInput.bio).toBe('Test bio')
      expect(userCreateInput.socialLinks).toEqual(['https://twitter.com/test'])
      expect(userCreateInput.preferences).toEqual({ theme: 'dark' })
    })
  })

  describe('Creation model', () => {
    it('should have correct creation create input type', () => {
      const creationCreateInput: Prisma.CreationCreateInput = {
        title: 'Test Creation',
        description: 'Test description',
        originalSpec: 'Test spec',
        parsedParameters: {
          visual: {
            style: ['abstract'],
            colors: ['blue', 'red'],
            mood: 'energetic'
          }
        },
        tags: ['abstract', 'colorful'],
        isPublic: true,
        author: {
          connect: { id: 'user-id' }
        }
      }

      expect(creationCreateInput.title).toBe('Test Creation')
      expect(creationCreateInput.description).toBe('Test description')
      expect(creationCreateInput.originalSpec).toBe('Test spec')
      expect(creationCreateInput.tags).toEqual(['abstract', 'colorful'])
      expect(creationCreateInput.isPublic).toBe(true)
    })
  })

  describe('MediaFile model', () => {
    it('should have correct media file create input type', () => {
      const mediaFileCreateInput: Prisma.MediaFileCreateInput = {
        type: 'IMAGE',
        url: 'https://example.com/image.png',
        format: 'png',
        size: 1024000,
        width: 1920,
        height: 1080,
        creation: {
          connect: { id: 'creation-id' }
        }
      }

      expect(mediaFileCreateInput.type).toBe('IMAGE')
      expect(mediaFileCreateInput.url).toBe('https://example.com/image.png')
      expect(mediaFileCreateInput.format).toBe('png')
      expect(mediaFileCreateInput.size).toBe(1024000)
      expect(mediaFileCreateInput.width).toBe(1920)
      expect(mediaFileCreateInput.height).toBe(1080)
    })
  })

  describe('Comment model', () => {
    it('should have correct comment create input type', () => {
      const commentCreateInput: Prisma.CommentCreateInput = {
        content: 'Great work!',
        creation: {
          connect: { id: 'creation-id' }
        },
        author: {
          connect: { id: 'user-id' }
        },
        parent: {
          connect: { id: 'parent-comment-id' }
        }
      }

      expect(commentCreateInput.content).toBe('Great work!')
    })
  })

  describe('GenerationSession model', () => {
    it('should have correct generation session create input type', () => {
      const sessionCreateInput: Prisma.GenerationSessionCreateInput = {
        currentParameters: {
          visual: {
            style: 'abstract',
            mood: 'energetic'
          }
        },
        isActive: true,
        user: {
          connect: { id: 'user-id' }
        }
      }

      expect(sessionCreateInput.isActive).toBe(true)
      expect(sessionCreateInput.currentParameters).toEqual({
        visual: {
          style: 'abstract',
          mood: 'energetic'
        }
      })
    })
  })

  describe('GenerationJob model', () => {
    it('should have correct generation job create input type', () => {
      const jobCreateInput: Prisma.GenerationJobCreateInput = {
        type: 'VISUAL',
        parameters: {
          prompt: 'abstract artwork',
          style: 'abstract'
        },
        status: 'PENDING',
        session: {
          connect: { id: 'session-id' }
        }
      }

      expect(jobCreateInput.type).toBe('VISUAL')
      expect(jobCreateInput.status).toBe('PENDING')
      expect(jobCreateInput.parameters).toEqual({
        prompt: 'abstract artwork',
        style: 'abstract'
      })
    })
  })

  describe('Enums', () => {
    it('should have correct MediaType enum values', () => {
      expect(MediaType.IMAGE).toBe('IMAGE')
      expect(MediaType.VIDEO).toBe('VIDEO')
      expect(MediaType.AUDIO).toBe('AUDIO')
    })

    it('should have correct GenerationType enum values', () => {
      expect(GenerationType.VISUAL).toBe('VISUAL')
      expect(GenerationType.AUDIO).toBe('AUDIO')
      expect(GenerationType.MIXED).toBe('MIXED')
    })

    it('should have correct GenerationStatus enum values', () => {
      expect(GenerationStatus.PENDING).toBe('PENDING')
      expect(GenerationStatus.PROCESSING).toBe('PROCESSING')
      expect(GenerationStatus.COMPLETED).toBe('COMPLETED')
      expect(GenerationStatus.FAILED).toBe('FAILED')
      expect(GenerationStatus.CANCELLED).toBe('CANCELLED')
    })
  })
})