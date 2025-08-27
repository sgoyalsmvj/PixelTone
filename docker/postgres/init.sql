-- Initialize AI Creative Studio Database
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create initial database structure will be handled by Prisma migrations
-- This file ensures the database is ready for Prisma
SELECT 'AI Creative Studio database initialized' as status;