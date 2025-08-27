# AI Creative Studio Database Package

This package contains the database schema, ORM configuration, and data access layer for the AI Creative Studio application.

## Features

- **PostgreSQL Database Schema**: Complete schema for users, creations, media files, comments, likes, and generation tracking
- **Prisma ORM**: Type-safe database access with auto-generated client
- **Repository Pattern**: Clean data access layer with base repository functionality
- **Database Migrations**: Version-controlled schema changes
- **Comprehensive Testing**: Unit tests for models, repositories, and relationships
- **Type Safety**: Full TypeScript support with generated types

## Database Schema

### Core Entities

- **Users**: User accounts and profiles
- **Creations**: AI-generated content with metadata
- **MediaFiles**: Generated images, videos, and audio files
- **Comments**: Community discussions with threading support
- **Likes**: User interactions and engagement tracking
- **Tags**: Content categorization and discovery
- **GenerationSessions**: Active creation sessions
- **GenerationJobs**: Background AI generation tracking

### Key Features

- **Cascade Deletes**: Proper cleanup when users or creations are deleted
- **Unique Constraints**: Prevent duplicate likes and ensure data integrity
- **Indexing**: Optimized queries for search and filtering
- **JSON Fields**: Flexible parameter storage for AI generation
- **Relationships**: Proper foreign key relationships with referential integrity

## Installation

```bash
npm install
```

## Environment Setup

Copy the example environment file and configure your database:

```bash
cp .env.example .env
```

Update the `.env` file with your database connection details:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ai_creative_studio"
DATABASE_POOL_SIZE=10
DATABASE_TIMEOUT=30000
DATABASE_SSL=false
```

## Database Setup

1. **Start PostgreSQL** (using Docker Compose from project root):
   ```bash
   docker-compose up -d postgres
   ```

2. **Generate Prisma Client**:
   ```bash
   npm run db:generate
   ```

3. **Run Migrations**:
   ```bash
   npm run db:migrate
   ```

4. **Seed Database** (optional):
   ```bash
   npm run db:seed
   ```

## Usage

### Basic Usage

```typescript
import { prisma, UserRepository, CreationRepository } from '@ai-studio/database'

// Direct Prisma client usage
const user = await prisma.user.findUnique({
  where: { id: 'user-id' }
})

// Repository pattern usage
const userRepo = new UserRepository()
const user = await userRepo.findById('user-id')
const profile = await userRepo.getProfile('user-id')
```

### Repository Examples

```typescript
import { UserRepository, CreationRepository } from '@ai-studio/database'

const userRepo = new UserRepository()
const creationRepo = new CreationRepository()

// Create a new user
const user = await userRepo.create({
  username: 'artist123',
  email: 'artist@example.com',
  displayName: 'Digital Artist'
})

// Create a creation
const creation = await creationRepo.create({
  title: 'Abstract Landscape',
  description: 'AI-generated abstract landscape',
  originalSpec: 'Create a surreal landscape with vibrant colors',
  parsedParameters: {
    visual: {
      style: ['abstract', 'landscape'],
      colors: ['blue', 'purple', 'orange'],
      mood: 'dreamy'
    }
  },
  tags: ['abstract', 'landscape', 'surreal'],
  author: { connect: { id: user.id } }
})

// Search creations
const results = await creationRepo.search({
  query: 'landscape',
  tags: ['abstract'],
  isPublic: true
}, {
  field: 'createdAt',
  direction: 'desc'
}, 1, 20)
```

### Transaction Usage

```typescript
import { prisma } from '@ai-studio/database'

const result = await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({
    data: { username: 'newuser', email: 'new@example.com', displayName: 'New User' }
  })
  
  const creation = await tx.creation.create({
    data: {
      title: 'First Creation',
      description: 'My first AI creation',
      originalSpec: 'Create something amazing',
      parsedParameters: {},
      tags: ['first'],
      authorId: user.id
    }
  })
  
  return { user, creation }
})
```

## Available Scripts

- `npm run build` - Build TypeScript code
- `npm run dev` - Watch mode for development
- `npm run test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:migrate:deploy` - Deploy migrations (production)
- `npm run db:push` - Push schema changes (development)
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database with sample data

## Testing

The package includes comprehensive tests for:

- **Schema Validation**: Type checking and schema structure
- **Repository Operations**: CRUD operations and business logic
- **Relationships**: Foreign key constraints and cascade behavior
- **Data Integrity**: Unique constraints and validation

### Running Tests

```bash
# Run all tests (requires running database)
npm run test

# Run schema tests only (no database required)
npx vitest run --config vitest.schema.config.ts

# Run tests in watch mode
npm run test:watch
```

### Test Database

For integration tests, set up a separate test database:

```env
TEST_DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ai_creative_studio_test"
```

## Migration Management

### Creating Migrations

```bash
# Create a new migration
npx prisma migrate dev --name add_new_feature

# Reset database (development only)
npm run db:migrate:reset
```

### Production Deployment

```bash
# Deploy migrations to production
npm run db:migrate:deploy
```

## Performance Considerations

- **Indexing**: Key fields are indexed for optimal query performance
- **Connection Pooling**: Configurable connection pool size
- **Query Optimization**: Repository methods use efficient queries
- **Pagination**: Built-in pagination support to handle large datasets

## Type Safety

The package provides full TypeScript support with:

- Generated Prisma types
- Custom utility types for common operations
- Repository interfaces with proper typing
- Enum definitions for status fields

## Contributing

When making schema changes:

1. Update the Prisma schema file
2. Create a migration: `npx prisma migrate dev --name your_change`
3. Update repository methods if needed
4. Add/update tests for new functionality
5. Update documentation

## Dependencies

- **@prisma/client**: Database client with type safety
- **prisma**: Database toolkit and migration system
- **zod**: Runtime type validation for configuration
- **vitest**: Testing framework
- **typescript**: Type checking and compilation