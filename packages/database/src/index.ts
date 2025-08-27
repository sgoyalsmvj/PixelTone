// Export the Prisma client
export { default as prisma } from './client'
export { prisma as db } from './client'

// Export configuration
export { getDatabaseConfig, databaseConfig } from './config'
export type { DatabaseConfig } from './config'

// Export types
export * from './types'

// Export repositories
export * from './repositories'

// Re-export Prisma for convenience
export { Prisma } from '@prisma/client'