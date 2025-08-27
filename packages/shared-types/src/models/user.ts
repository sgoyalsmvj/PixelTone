import { z } from 'zod';

// User Profile Schema
export const UserProfileSchema = z.object({
  displayName: z.string().min(1).max(100),
  bio: z.string().max(500).optional(),
  avatar: z.string().url().optional(),
  socialLinks: z.array(z.string().url()).optional(),
});

// User Preferences Schema
export const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(true),
    comments: z.boolean().default(true),
    likes: z.boolean().default(true),
    remixes: z.boolean().default(true),
  }).default({}),
  privacy: z.object({
    showProfile: z.boolean().default(true),
    showCreations: z.boolean().default(true),
    allowRemixes: z.boolean().default(true),
  }).default({}),
});

// User Schema
export const UserSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/),
  email: z.string().email(),
  profile: UserProfileSchema,
  preferences: UserPreferencesSchema,
  createdAt: z.date(),
  lastActive: z.date(),
});

// TypeScript Types
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type UserPreferences = z.infer<typeof UserPreferencesSchema>;
export type User = z.infer<typeof UserSchema>;

// Input Types for Creation/Updates
export type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'lastActive'>;
export type UpdateUserInput = Partial<Pick<User, 'profile' | 'preferences'>>;