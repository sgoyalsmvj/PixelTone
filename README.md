# AI Creative Studio

A collaborative digital platform that enables users to generate, customize, and share AI-generated art and music through natural language descriptions.

## Project Structure

This is a monorepo containing:

- **Frontend**: Next.js React application (`apps/frontend`)
- **API Gateway**: Express.js gateway service (`apps/api-gateway`)
- **NLP Service**: Natural language processing service (`apps/nlp-service`)
- **Generation Service**: AI generation orchestration service (`apps/generation-service`)
- **Shared Types**: Common TypeScript types and interfaces (`packages/shared-types`)

## Prerequisites

- Node.js 18+ and npm 8+
- Docker and Docker Compose
- Git

## Quick Start

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd ai-creative-studio
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start local services**
   ```bash
   npm run docker:up
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - API Gateway: http://localhost:3001
   - MinIO Console: http://localhost:9001

## Development Commands

- `npm run dev` - Start all services in development mode
- `npm run build` - Build all packages and applications
- `npm run test` - Run all tests
- `npm run lint` - Lint all code
- `npm run type-check` - Run TypeScript type checking
- `npm run clean` - Clean all build artifacts

## Docker Services

The development environment includes:

- **PostgreSQL**: Database (port 5432)
- **Redis**: Caching and job queue (port 6379)
- **MinIO**: S3-compatible file storage (ports 9000, 9001)

## Architecture

The system follows a microservices architecture with:

- **Frontend**: React/Next.js with real-time WebSocket connections
- **API Gateway**: Request routing, authentication, and rate limiting
- **NLP Service**: Natural language processing and parameter extraction
- **Generation Service**: AI model integration and job orchestration
- **Shared Types**: Common TypeScript interfaces and types

## Technology Stack

- **Frontend**: React 18, Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Caching**: Redis
- **File Storage**: MinIO (S3-compatible)
- **Build System**: Turbo (monorepo)
- **Testing**: Jest
- **Linting**: ESLint + Prettier

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new functionality
3. Update documentation as needed
4. Use conventional commit messages

## License

[License information]