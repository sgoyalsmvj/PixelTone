import { describe, it, expect, beforeEach } from 'vitest'
import { UserRepository } from '../repositories/user.repository'
import { CreationRepository } from '../repositories/creation.repository'
import { testDb } from './setup'

describe('Database Relationships', () => {
  let userRepo: UserRepository
  let creationRepo: CreationRepository
  let testUser: any

  beforeEach(async () => {
    userRepo = new UserRepository(testDb)
    creationRepo = new CreationRepository(testDb)

    testUser = await userRepo.create({
      username: 'testuser',
      email: 'test@example.com',
      displayName: 'Test User'
    })
  })

  describe('User-Creation relationship', () => {
    it('should cascade delete creations when user is deleted', async () => {
      const creation = await creationRepo.create({
        title: 'Test Creation',
        description: 'Test description',
        originalSpec: 'Test spec',
        parsedParameters: { visual: { style: 'test' } },
        tags: ['test'],
        author: { connect: { id: testUser.id } }
      })

      // Verify creation exists
      const foundCreation = await creationRepo.findById(creation.id)
      expect(foundCreation).toBeDefined()

      // Delete user
      await userRepo.delete(testUser.id)

      // Verify creation is also deleted
      const deletedCreation = await creationRepo.findById(creation.id)
      expect(deletedCreation).toBeNull()
    })

    it('should maintain author relationship', async () => {
      const creation = await creationRepo.create({
        title: 'Test Creation',
        description: 'Test description',
        originalSpec: 'Test spec',
        parsedParameters: { visual: { style: 'test' } },
        tags: ['test'],
        author: { connect: { id: testUser.id } }
      })

      const foundCreation = await creationRepo.findById(creation.id)
      expect(foundCreation?.author.id).toBe(testUser.id)
      expect(foundCreation?.author.username).toBe('testuser')
    })
  })

  describe('Creation-MediaFile relationship', () => {
    it('should cascade delete media files when creation is deleted', async () => {
      const creation = await creationRepo.create({
        title: 'Test Creation',
        description: 'Test description',
        originalSpec: 'Test spec',
        parsedParameters: { visual: { style: 'test' } },
        tags: ['test'],
        author: { connect: { id: testUser.id } }
      })

      const mediaFile = await testDb.mediaFile.create({
        data: {
          creationId: creation.id,
          type: 'IMAGE',
          url: 'https://example.com/image.png',
          format: 'png',
          size: 1024000,
          width: 1920,
          height: 1080
        }
      })

      // Verify media file exists
      const foundMediaFile = await testDb.mediaFile.findUnique({
        where: { id: mediaFile.id }
      })
      expect(foundMediaFile).toBeDefined()

      // Delete creation
      await creationRepo.delete(creation.id)

      // Verify media file is also deleted
      const deletedMediaFile = await testDb.mediaFile.findUnique({
        where: { id: mediaFile.id }
      })
      expect(deletedMediaFile).toBeNull()
    })
  })

  describe('Creation-Comment relationship', () => {
    it('should cascade delete comments when creation is deleted', async () => {
      const creation = await creationRepo.create({
        title: 'Test Creation',
        description: 'Test description',
        originalSpec: 'Test spec',
        parsedParameters: { visual: { style: 'test' } },
        tags: ['test'],
        author: { connect: { id: testUser.id } }
      })

      const comment = await testDb.comment.create({
        data: {
          creationId: creation.id,
          authorId: testUser.id,
          content: 'Great work!'
        }
      })

      // Verify comment exists
      const foundComment = await testDb.comment.findUnique({
        where: { id: comment.id }
      })
      expect(foundComment).toBeDefined()

      // Delete creation
      await creationRepo.delete(creation.id)

      // Verify comment is also deleted
      const deletedComment = await testDb.comment.findUnique({
        where: { id: comment.id }
      })
      expect(deletedComment).toBeNull()
    })

    it('should support threaded comments', async () => {
      const creation = await creationRepo.create({
        title: 'Test Creation',
        description: 'Test description',
        originalSpec: 'Test spec',
        parsedParameters: { visual: { style: 'test' } },
        tags: ['test'],
        author: { connect: { id: testUser.id } }
      })

      const parentComment = await testDb.comment.create({
        data: {
          creationId: creation.id,
          authorId: testUser.id,
          content: 'Parent comment'
        }
      })

      const replyComment = await testDb.comment.create({
        data: {
          creationId: creation.id,
          authorId: testUser.id,
          content: 'Reply comment',
          parentId: parentComment.id
        }
      })

      // Verify relationship
      const foundReply = await testDb.comment.findUnique({
        where: { id: replyComment.id },
        include: { parent: true }
      })

      expect(foundReply?.parent?.id).toBe(parentComment.id)
      expect(foundReply?.parent?.content).toBe('Parent comment')
    })
  })

  describe('Creation-Like relationship', () => {
    it('should enforce unique constraint on user-creation likes', async () => {
      const creation = await creationRepo.create({
        title: 'Test Creation',
        description: 'Test description',
        originalSpec: 'Test spec',
        parsedParameters: { visual: { style: 'test' } },
        tags: ['test'],
        author: { connect: { id: testUser.id } }
      })

      // First like should succeed
      await testDb.like.create({
        data: {
          creationId: creation.id,
          userId: testUser.id
        }
      })

      // Second like from same user should fail
      await expect(
        testDb.like.create({
          data: {
            creationId: creation.id,
            userId: testUser.id
          }
        })
      ).rejects.toThrow()
    })

    it('should cascade delete likes when creation is deleted', async () => {
      const creation = await creationRepo.create({
        title: 'Test Creation',
        description: 'Test description',
        originalSpec: 'Test spec',
        parsedParameters: { visual: { style: 'test' } },
        tags: ['test'],
        author: { connect: { id: testUser.id } }
      })

      const like = await testDb.like.create({
        data: {
          creationId: creation.id,
          userId: testUser.id
        }
      })

      // Verify like exists
      const foundLike = await testDb.like.findUnique({
        where: { id: like.id }
      })
      expect(foundLike).toBeDefined()

      // Delete creation
      await creationRepo.delete(creation.id)

      // Verify like is also deleted
      const deletedLike = await testDb.like.findUnique({
        where: { id: like.id }
      })
      expect(deletedLike).toBeNull()
    })
  })

  describe('Creation remix relationship', () => {
    it('should support creation remixing', async () => {
      const original = await creationRepo.create({
        title: 'Original Creation',
        description: 'Original work',
        originalSpec: 'Original spec',
        parsedParameters: { visual: { style: 'original' } },
        tags: ['original'],
        author: { connect: { id: testUser.id } }
      })

      const remix = await creationRepo.create({
        title: 'Remix Creation',
        description: 'Remixed work',
        originalSpec: 'Remixed spec',
        parsedParameters: { visual: { style: 'remix' } },
        tags: ['remix'],
        remixedFromId: original.id,
        author: { connect: { id: testUser.id } }
      })

      // Verify remix relationship
      const foundRemix = await testDb.creation.findUnique({
        where: { id: remix.id },
        include: { remixedFrom: true }
      })

      expect(foundRemix?.remixedFrom?.id).toBe(original.id)
      expect(foundRemix?.remixedFrom?.title).toBe('Original Creation')

      // Verify reverse relationship
      const foundOriginal = await testDb.creation.findUnique({
        where: { id: original.id },
        include: { remixes: true }
      })

      expect(foundOriginal?.remixes).toHaveLength(1)
      expect(foundOriginal?.remixes[0].id).toBe(remix.id)
    })
  })

  describe('GenerationSession-GenerationJob relationship', () => {
    it('should cascade delete generation jobs when session is deleted', async () => {
      const session = await testDb.generationSession.create({
        data: {
          userId: testUser.id,
          currentParameters: { visual: { style: 'test' } }
        }
      })

      const job = await testDb.generationJob.create({
        data: {
          sessionId: session.id,
          type: 'VISUAL',
          parameters: { prompt: 'test prompt' },
          status: 'PENDING'
        }
      })

      // Verify job exists
      const foundJob = await testDb.generationJob.findUnique({
        where: { id: job.id }
      })
      expect(foundJob).toBeDefined()

      // Delete session
      await testDb.generationSession.delete({
        where: { id: session.id }
      })

      // Verify job is also deleted
      const deletedJob = await testDb.generationJob.findUnique({
        where: { id: job.id }
      })
      expect(deletedJob).toBeNull()
    })
  })
})