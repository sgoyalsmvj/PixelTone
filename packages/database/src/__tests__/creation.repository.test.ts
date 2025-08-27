import { describe, it, expect, beforeEach } from 'vitest'
import { CreationRepository } from '../repositories/creation.repository'
import { UserRepository } from '../repositories/user.repository'
import { testDb } from './setup'

describe('CreationRepository', () => {
  let creationRepo: CreationRepository
  let userRepo: UserRepository
  let testUser: any

  beforeEach(async () => {
    creationRepo = new CreationRepository(testDb)
    userRepo = new UserRepository(testDb)

    // Create a test user for creations
    testUser = await userRepo.create({
      username: 'testcreator',
      email: 'creator@example.com',
      displayName: 'Test Creator'
    })
  })

  describe('create', () => {
    it('should create a new creation', async () => {
      const creationData = {
        title: 'Test Creation',
        description: 'A test creation',
        originalSpec: 'Create a beautiful landscape',
        parsedParameters: {
          visual: {
            style: ['landscape'],
            colors: ['blue', 'green'],
            mood: 'peaceful'
          }
        },
        tags: ['landscape', 'nature'],
        author: {
          connect: { id: testUser.id }
        }
      }

      const creation = await creationRepo.create(creationData)

      expect(creation.title).toBe('Test Creation')
      expect(creation.authorId).toBe(testUser.id)
      expect(creation.tags).toEqual(['landscape', 'nature'])
      expect(creation.isPublic).toBe(true) // default value
      expect(creation.views).toBe(0) // default value
    })
  })

  describe('findById', () => {
    it('should find creation with details', async () => {
      const creation = await creationRepo.create({
        title: 'Test Creation',
        description: 'A test creation',
        originalSpec: 'Create a beautiful landscape',
        parsedParameters: { visual: { style: 'landscape' } },
        tags: ['landscape'],
        author: {
          connect: { id: testUser.id }
        }
      })

      // Add a media file
      await testDb.mediaFile.create({
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

      const foundCreation = await creationRepo.findById(creation.id)

      expect(foundCreation).toBeDefined()
      expect(foundCreation?.title).toBe('Test Creation')
      expect(foundCreation?.author.username).toBe('testcreator')
      expect(foundCreation?.mediaFiles).toHaveLength(1)
      expect(foundCreation?.mediaFiles[0].type).toBe('IMAGE')
      expect(foundCreation?._count.likes).toBe(0)
      expect(foundCreation?._count.comments).toBe(0)
    })

    it('should return null for non-existent creation', async () => {
      const foundCreation = await creationRepo.findById('non-existent-id')
      expect(foundCreation).toBeNull()
    })
  })

  describe('incrementViews', () => {
    it('should increment view count', async () => {
      const creation = await creationRepo.create({
        title: 'Test Creation',
        description: 'A test creation',
        originalSpec: 'Create a beautiful landscape',
        parsedParameters: { visual: { style: 'landscape' } },
        tags: ['landscape'],
        author: {
          connect: { id: testUser.id }
        }
      })

      expect(creation.views).toBe(0)

      await creationRepo.incrementViews(creation.id)
      await creationRepo.incrementViews(creation.id)

      const updatedCreation = await testDb.creation.findUnique({
        where: { id: creation.id }
      })

      expect(updatedCreation?.views).toBe(2)
    })
  })

  describe('search', () => {
    beforeEach(async () => {
      // Create test creations
      await creationRepo.create({
        title: 'Beautiful Landscape',
        description: 'A scenic mountain view',
        originalSpec: 'Mountain landscape with sunset',
        parsedParameters: { visual: { style: 'landscape' } },
        tags: ['landscape', 'mountain'],
        author: { connect: { id: testUser.id } }
      })

      await creationRepo.create({
        title: 'Abstract Art',
        description: 'Colorful abstract composition',
        originalSpec: 'Abstract colorful artwork',
        parsedParameters: { visual: { style: 'abstract' } },
        tags: ['abstract', 'colorful'],
        author: { connect: { id: testUser.id } }
      })

      await creationRepo.create({
        title: 'Private Creation',
        description: 'This is private',
        originalSpec: 'Private artwork',
        parsedParameters: { visual: { style: 'private' } },
        tags: ['private'],
        isPublic: false,
        author: { connect: { id: testUser.id } }
      })
    })

    it('should search by title', async () => {
      const results = await creationRepo.search({
        query: 'Landscape'
      })

      expect(results).toHaveLength(1)
      expect(results[0].title).toBe('Beautiful Landscape')
    })

    it('should search by description', async () => {
      const results = await creationRepo.search({
        query: 'Colorful'
      })

      expect(results).toHaveLength(1)
      expect(results[0].title).toBe('Abstract Art')
    })

    it('should filter by tags', async () => {
      const results = await creationRepo.search({
        tags: ['landscape']
      })

      expect(results).toHaveLength(1)
      expect(results[0].title).toBe('Beautiful Landscape')
    })

    it('should filter by author', async () => {
      const results = await creationRepo.search({
        authorId: testUser.id
      })

      expect(results).toHaveLength(2) // Only public ones
    })

    it('should filter by public status', async () => {
      const publicResults = await creationRepo.search({
        isPublic: true
      })

      const privateResults = await creationRepo.search({
        isPublic: false
      })

      expect(publicResults).toHaveLength(2)
      expect(privateResults).toHaveLength(1)
      expect(privateResults[0].title).toBe('Private Creation')
    })

    it('should sort by creation date', async () => {
      const results = await creationRepo.search(
        {},
        { field: 'createdAt', direction: 'asc' }
      )

      expect(results[0].title).toBe('Beautiful Landscape')
      expect(results[1].title).toBe('Abstract Art')
    })

    it('should handle pagination', async () => {
      const page1 = await creationRepo.search({}, undefined, 1, 1)
      const page2 = await creationRepo.search({}, undefined, 2, 1)

      expect(page1).toHaveLength(1)
      expect(page2).toHaveLength(1)
      expect(page1[0].id).not.toBe(page2[0].id)
    })
  })

  describe('getByAuthor', () => {
    it('should get creations by author', async () => {
      await creationRepo.create({
        title: 'Public Creation',
        description: 'Public work',
        originalSpec: 'Public artwork',
        parsedParameters: { visual: { style: 'public' } },
        tags: ['public'],
        author: { connect: { id: testUser.id } }
      })

      await creationRepo.create({
        title: 'Private Creation',
        description: 'Private work',
        originalSpec: 'Private artwork',
        parsedParameters: { visual: { style: 'private' } },
        tags: ['private'],
        isPublic: false,
        author: { connect: { id: testUser.id } }
      })

      const publicOnly = await creationRepo.getByAuthor(testUser.id, false)
      const includePrivate = await creationRepo.getByAuthor(testUser.id, true)

      expect(publicOnly).toHaveLength(1)
      expect(includePrivate).toHaveLength(2)
    })
  })

  describe('getRemixes', () => {
    it('should get remixes of a creation', async () => {
      const original = await creationRepo.create({
        title: 'Original Creation',
        description: 'Original work',
        originalSpec: 'Original artwork',
        parsedParameters: { visual: { style: 'original' } },
        tags: ['original'],
        author: { connect: { id: testUser.id } }
      })

      const remix = await creationRepo.create({
        title: 'Remix Creation',
        description: 'Remixed work',
        originalSpec: 'Remixed artwork',
        parsedParameters: { visual: { style: 'remix' } },
        tags: ['remix'],
        remixedFromId: original.id,
        author: { connect: { id: testUser.id } }
      })

      const remixes = await creationRepo.getRemixes(original.id)

      expect(remixes).toHaveLength(1)
      expect(remixes[0].id).toBe(remix.id)
      expect(remixes[0].title).toBe('Remix Creation')
    })
  })

  describe('getTrending', () => {
    it('should get trending creations', async () => {
      const creation1 = await creationRepo.create({
        title: 'Popular Creation',
        description: 'Very popular',
        originalSpec: 'Popular artwork',
        parsedParameters: { visual: { style: 'popular' } },
        tags: ['popular'],
        author: { connect: { id: testUser.id } }
      })

      const creation2 = await creationRepo.create({
        title: 'Less Popular Creation',
        description: 'Less popular',
        originalSpec: 'Less popular artwork',
        parsedParameters: { visual: { style: 'less-popular' } },
        tags: ['less-popular'],
        author: { connect: { id: testUser.id } }
      })

      // Add likes to make creation1 more popular
      await testDb.like.create({
        data: {
          creationId: creation1.id,
          userId: testUser.id
        }
      })

      const trending = await creationRepo.getTrending('week', 10)

      expect(trending).toHaveLength(2)
      expect(trending[0].id).toBe(creation1.id) // Should be first due to likes
    })
  })
})