"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = exports.UserPreferencesSchema = exports.UserProfileSchema = void 0;
const zod_1 = require("zod");
// User Profile Schema
exports.UserProfileSchema = zod_1.z.object({
    displayName: zod_1.z.string().min(1).max(100),
    bio: zod_1.z.string().max(500).optional(),
    avatar: zod_1.z.string().url().optional(),
    socialLinks: zod_1.z.array(zod_1.z.string().url()).optional(),
});
// User Preferences Schema
exports.UserPreferencesSchema = zod_1.z.object({
    theme: zod_1.z.enum(['light', 'dark', 'auto']).default('auto'),
    notifications: zod_1.z.object({
        email: zod_1.z.boolean().default(true),
        push: zod_1.z.boolean().default(true),
        comments: zod_1.z.boolean().default(true),
        likes: zod_1.z.boolean().default(true),
        remixes: zod_1.z.boolean().default(true),
    }).default({}),
    privacy: zod_1.z.object({
        showProfile: zod_1.z.boolean().default(true),
        showCreations: zod_1.z.boolean().default(true),
        allowRemixes: zod_1.z.boolean().default(true),
    }).default({}),
});
// User Schema
exports.UserSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    username: zod_1.z.string().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/),
    email: zod_1.z.string().email(),
    profile: exports.UserProfileSchema,
    preferences: exports.UserPreferencesSchema,
    createdAt: zod_1.z.date(),
    lastActive: zod_1.z.date(),
});
