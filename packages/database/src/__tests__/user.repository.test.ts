import { describe, it, expect, beforeEach } from 'vitest'
import { UserRepository } from '../repositories/user.repository'
import { testDb } from './setup'

describe('UserRepository', () => {
  let userRepo: UserRepository

  beforeEach(() => {
    userRepo = new UserRepository(testDb)
  })

  describe('create', () => {
    it('should create a new user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        displayName: 'Test User',
        bio: 'Test bio'
      }

      const user = await userRepo.create(userData)

      expect(user).toMatchObject(userData)
      expect(user.id).toBeDefined()
      expect(user.createdAt).toBeInstanceOf(Date)
    })

    it('should throw error for duplicate email', async () => {
      const userData = {
        username: 'testuser1',
        email: 'test@example.com',
        displayName: 'Test User 1'
      }

      await userRepo.create(userData)

      const duplicateData = {
        username: 'testuser2',
        email: 'test@example.com',
        displayName: 'Test User 2'
      }

      await expect(userRepo.create(duplicateData)).rejects.toThrow()
    })

    it('should throw error for duplicate username', async () => {
      const userData = {
        username: 'testuser',
        email: 'test1@example.com',
        displayName: 'Test User 1'
      }

      await userRepo.create(userData)

      const duplicateData = {
        username: 'testuser',
        email: 'test2@example.com',
        displayName: 'Test User 2'
      }

      await expect(userRepo.create(duplicateData)).rejects.toThrow()
    })
  })

  describe('findById', () => {
    it('should find user by id', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        displayName: 'Test User'
      }

      const createdUser = await userRepo.create(userData)
      const foundUser = await userRepo.findById(createdUser.id)

      expect(foundUser).toMatchObject(userData)
      expect(foundUser?.id).toBe(createdUser.id)
    })

    it('should return null for non-existent id', async () => {
      const foundUser = await userRepo.findById('non-existent-id')
      expect(foundUser).toBeNull()
    })
  })

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        displayName: 'Test User'
      }

      await userRepo.create(userData)
      const foundUser = await userRepo.findByEmail('test@example.com')

      expect(foundUser).toMatchObject(userData)
    })

    it('should return null for non-existent email', async () => {
      const foundUser = await userRepo.findByEmail('nonexistent@example.com')
      expect(foundUser).toBeNull()
    })
  })

  describe('findByUsername', () => {
    it('should find user by username', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        displayName: 'Test User'
      }

      await userRepo.create(userData)
      const foundUser = await userRepo.findByUsername('testuser')

      expect(foundUser).toMatchObject(userData)
    })

    it('should return null for non-existent username', async () => {
      const foundUser = await userRepo.findByUsername('nonexistent')
      expect(foundUser).toBeNull()
    })
  })

  describe('update', () => {
    it('should update user data', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        displayName: 'Test User'
      }

      const createdUser = await userRepo.create(userData)
      const updatedUser = await userRepo.update(createdUser.id, {
        displayName: 'Updated Name',
        bio: 'Updated bio'
      })

      expect(updatedUser.displayName).toBe('Updated Name')
      expect(updatedUser.bio).toBe('Updated bio')
      expect(updatedUser.username).toBe('testuser') // unchanged
    })
  })

  describe('updateLastActive', () => {
    it('should update last active timestamp', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        displayName: 'Test User'
      }

      const createdUser = await userRepo.create(userData)
      const originalLastActive = createdUser.lastActive

      // Wait a bit to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 10))
      
      await userRepo.updateLastActive(createdUser.id)
      const updatedUser = await userRepo.findById(createdUser.id)

      expect(updatedUser?.lastActive.getTime()).toBeGreaterThan(originalLastActive.getTime())
    })
  })

  describe('getProfile', () => {
    it('should return user profile with counts', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        displayName: 'Test User',
        bio: 'Test bio'
      }

      const user = await userRepo.create(userData)
      const profile = await userRepo.getProfile(user.id)

      expect(profile).toMatchObject({
        id: user.id,
        username: 'testuser',
        displayName: 'Test User',
        bio: 'Test bio'
      })
      expect(profile?._count).toMatchObject({
        creations: 0,
        likes: 0
      })
    })
  })

  describe('searchUsers', () => {
    it('should search users by username', async () => {
      await userRepo.create({
        username: 'alice_creator',
        email: 'alice@example.com',
        displayName: 'Alice Creator'
      })

      await userRepo.create({
        username: 'bob_musician',
        email: 'bob@example.com',
        displayName: 'Bob Musician'
      })

      const results = await userRepo.searchUsers('alice')
      expect(results).toHaveLength(1)
      expect(results[0].username).toBe('alice_creator')
    })

    it('should search users by display name', async () => {
      await userRepo.create({
        username: 'user1',
        email: 'user1@example.com',
        displayName: 'Creative Artist'
      })

      await userRepo.create({
        username: 'user2',
        email: 'user2@example.com',
        displayName: 'Digital Creator'
      })

      const results = await userRepo.searchUsers('Creative')
      expect(results).toHaveLength(1)
      expect(results[0].displayName).toBe('Creative Artist')
    })

    it('should handle pagination', async () => {
      // Create multiple users
      for (let i = 1; i <= 5; i++) {
        await userRepo.create({
          username: `user${i}`,
          email: `user${i}@example.com`,
          displayName: `User ${i}`
        })
      }

      const page1 = await userRepo.searchUsers('User', 1, 2)
      const page2 = await userRepo.searchUsers('User', 2, 2)

      expect(page1).toHaveLength(2)
      expect(page2).toHaveLength(2)
      expect(page1[0].id).not.toBe(page2[0].id)
    })
  })
})