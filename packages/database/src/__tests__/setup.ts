import { PrismaClient } from '@prisma/client'
import { beforeAll, afterAll, beforeEach } from 'vitest'

// Use a separate test database
const testDatabaseUrl = process.env.TEST_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ai_creative_studio_test'

export const testDb = new PrismaClient({
  datasources: {
    db: {
      url: testDatabaseUrl
    }
  }
})

beforeAll(async () => {
  // Connect to test database
  await testDb.$connect()
})

afterAll(async () => {
  // Disconnect from test database
  await testDb.$disconnect()
})

beforeEach(async () => {
  // Clean up test data before each test
  await testDb.generationJob.deleteMany()
  await testDb.generationSession.deleteMany()
  await testDb.like.deleteMany()
  await testDb.comment.deleteMany()
  await testDb.mediaFile.deleteMany()
  await testDb.creation.deleteMany()
  await testDb.tag.deleteMany()
  await testDb.user.deleteMany()
})