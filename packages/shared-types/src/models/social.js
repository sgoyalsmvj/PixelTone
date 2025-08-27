"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivitySchema = exports.ReportSchema = exports.NotificationSchema = exports.FollowSchema = exports.LikeSchema = exports.CommentSchema = void 0;
const zod_1 = require("zod");
// Comment Schema
exports.CommentSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    creationId: zod_1.z.string().uuid(),
    authorId: zod_1.z.string().uuid(),
    content: zod_1.z.string().min(1).max(1000),
    parentId: zod_1.z.string().uuid().optional(), // for threaded comments
    isEdited: zod_1.z.boolean().default(false),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
// Like Schema
exports.LikeSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    creationId: zod_1.z.string().uuid(),
    userId: zod_1.z.string().uuid(),
    createdAt: zod_1.z.date(),
});
// Follow Schema (for following other users)
exports.FollowSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    followerId: zod_1.z.string().uuid(),
    followingId: zod_1.z.string().uuid(),
    createdAt: zod_1.z.date(),
});
// Notification Schema
exports.NotificationSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    userId: zod_1.z.string().uuid(),
    type: zod_1.z.enum(['like', 'comment', 'remix', 'follow', 'system']),
    title: zod_1.z.string().min(1).max(200),
    message: zod_1.z.string().max(500),
    relatedId: zod_1.z.string().uuid().optional(), // ID of related creation, user, etc.
    isRead: zod_1.z.boolean().default(false),
    createdAt: zod_1.z.date(),
});
// Report Schema (for content moderation)
exports.ReportSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    reporterId: zod_1.z.string().uuid(),
    targetType: zod_1.z.enum(['creation', 'comment', 'user']),
    targetId: zod_1.z.string().uuid(),
    reason: zod_1.z.enum(['spam', 'inappropriate', 'copyright', 'harassment', 'other']),
    description: zod_1.z.string().max(1000).optional(),
    status: zod_1.z.enum(['pending', 'reviewed', 'resolved', 'dismissed']).default('pending'),
    createdAt: zod_1.z.date(),
    resolvedAt: zod_1.z.date().optional(),
});
// Activity Schema (for user activity feeds)
exports.ActivitySchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    userId: zod_1.z.string().uuid(),
    type: zod_1.z.enum(['created', 'liked', 'commented', 'remixed', 'followed']),
    targetType: zod_1.z.enum(['creation', 'user']),
    targetId: zod_1.z.string().uuid(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(), // flexible metadata for different activity types
    createdAt: zod_1.z.date(),
});
