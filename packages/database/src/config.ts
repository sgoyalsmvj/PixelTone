import { z } from 'zod'

const DatabaseConfigSchema = z.object({
  DATABASE_URL: z.string().url(),
  DATABASE_POOL_SIZE: z.coerce.number().min(1).max(100).default(10),
  DATABASE_TIMEOUT: z.coerce.number().min(1000).default(30000),
  DATABASE_SSL: z.coerce.boolean().default(false),
})

export type DatabaseConfig = z.infer<typeof DatabaseConfigSchema>

export function getDatabaseConfig(): DatabaseConfig {
  const config = {
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ai_creative_studio',
    DATABASE_POOL_SIZE: process.env.DATABASE_POOL_SIZE,
    DATABASE_TIMEOUT: process.env.DATABASE_TIMEOUT,
    DATABASE_SSL: process.env.DATABASE_SSL,
  }

  try {
    return DatabaseConfigSchema.parse(config)
  } catch (error) {
    console.error('Invalid database configuration:', error)
    throw new Error('Database configuration validation failed')
  }
}

export const databaseConfig = getDatabaseConfig()