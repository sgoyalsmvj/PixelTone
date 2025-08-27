import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create sample users
  const user1 = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      username: 'alice_creator',
      email: 'alice@example.com',
      displayName: 'Alice Creator',
      bio: 'Digital artist exploring AI-generated visuals',
      preferences: {
        theme: 'dark',
        notifications: true
      }
    }
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      username: 'bob_musician',
      email: 'bob@example.com',
      displayName: 'Bob Musician',
      bio: 'Composer experimenting with AI music generation',
      preferences: {
        theme: 'light',
        notifications: false
      }
    }
  })

  // Create sample tags
  const visualTags = ['abstract', 'landscape', 'portrait', 'digital-art', 'surreal']
  const audioTags = ['ambient', 'electronic', 'classical', 'experimental', 'cinematic']

  for (const tagName of [...visualTags, ...audioTags]) {
    await prisma.tag.upsert({
      where: { name: tagName },
      update: {},
      create: { name: tagName }
    })
  }

  // Create sample creation
  const creation1 = await prisma.creation.create({
    data: {
      title: 'Ethereal Sunset Landscape',
      description: 'A dreamy landscape with vibrant sunset colors and floating elements',
      originalSpec: 'Create a surreal landscape with a vibrant sunset, floating islands, and ethereal lighting',
      parsedParameters: {
        visual: {
          style: ['surreal', 'landscape'],
          colors: ['orange', 'purple', 'pink'],
          mood: 'dreamy',
          composition: 'wide',
          themes: ['sunset', 'floating islands']
        }
      },
      tags: ['landscape', 'surreal', 'digital-art'],
      authorId: user1.id,
      isPublic: true
    }
  })

  // Create sample media file
  await prisma.mediaFile.create({
    data: {
      creationId: creation1.id,
      type: 'IMAGE',
      url: 'https://example.com/sample-image.png',
      format: 'png',
      size: 1024000,
      width: 1920,
      height: 1080
    }
  })

  // Create sample generation session
  const session = await prisma.generationSession.create({
    data: {
      userId: user1.id,
      currentParameters: {
        visual: {
          style: 'abstract',
          mood: 'energetic',
          colors: ['blue', 'green']
        }
      },
      isActive: true
    }
  })

  // Create sample generation job
  await prisma.generationJob.create({
    data: {
      sessionId: session.id,
      type: 'VISUAL',
      parameters: {
        prompt: 'abstract energetic artwork with blue and green colors',
        style: 'abstract',
        mood: 'energetic'
      },
      status: 'COMPLETED',
      resultUrl: 'https://example.com/generated-image.png',
      processingTimeMs: 1500,
      completedAt: new Date()
    }
  })

  // Create sample comment
  await prisma.comment.create({
    data: {
      creationId: creation1.id,
      authorId: user2.id,
      content: 'Amazing work! The color palette is absolutely stunning.'
    }
  })

  // Create sample like
  await prisma.like.create({
    data: {
      creationId: creation1.id,
      userId: user2.id
    }
  })

  console.log('✅ Database seeded successfully!')
  console.log(`Created users: ${user1.username}, ${user2.username}`)
  console.log(`Created creation: ${creation1.title}`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })