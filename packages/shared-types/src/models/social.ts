import { z } from 'zod';

// Comment Schema
export const CommentSchema = z.object({
  id: z.string().uuid(),
  creationId: z.string().uuid(),
  authorId: z.string().uuid(),
  content: z.string().min(1).max(1000),
  parentId: z.string().uuid().optional(), // for threaded comments
  isEdited: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Like Schema
export const LikeSchema = z.object({
  id: z.string().uuid(),
  creationId: z.string().uuid(),
  userId: z.string().uuid(),
  createdAt: z.date(),
});

// Follow Schema (for following other users)
export const FollowSchema = z.object({
  id: z.string().uuid(),
  followerId: z.string().uuid(),
  followingId: z.string().uuid(),
  createdAt: z.date(),
});

// Notification Schema
export const NotificationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  type: z.enum(['like', 'comment', 'remix', 'follow', 'system']),
  title: z.string().min(1).max(200),
  message: z.string().max(500),
  relatedId: z.string().uuid().optional(), // ID of related creation, user, etc.
  isRead: z.boolean().default(false),
  createdAt: z.date(),
});

// Report Schema (for content moderation)
export const ReportSchema = z.object({
  id: z.string().uuid(),
  reporterId: z.string().uuid(),
  targetType: z.enum(['creation', 'comment', 'user']),
  targetId: z.string().uuid(),
  reason: z.enum(['spam', 'inappropriate', 'copyright', 'harassment', 'other']),
  description: z.string().max(1000).optional(),
  status: z.enum(['pending', 'reviewed', 'resolved', 'dismissed']).default('pending'),
  createdAt: z.date(),
  resolvedAt: z.date().optional(),
});

// Activity Schema (for user activity feeds)
export const ActivitySchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  type: z.enum(['created', 'liked', 'commented', 'remixed', 'followed']),
  targetType: z.enum(['creation', 'user']),
  targetId: z.string().uuid(),
  metadata: z.record(z.any()).optional(), // flexible metadata for different activity types
  createdAt: z.date(),
});

// TypeScript Types
export type Comment = z.infer<typeof CommentSchema>;
export type Like = z.infer<typeof LikeSchema>;
export type Follow = z.infer<typeof FollowSchema>;
export type Notification = z.infer<typeof NotificationSchema>;
export type Report = z.infer<typeof ReportSchema>;
export type Activity = z.infer<typeof ActivitySchema>;

// Input Types
export type CreateCommentInput = Omit<Comment, 'id' | 'isEdited' | 'createdAt' | 'updatedAt'>;
export type UpdateCommentInput = Pick<Comment, 'content'>;
export type CreateLikeInput = Omit<Like, 'id' | 'createdAt'>;
export type CreateFollowInput = Omit<Follow, 'id' | 'createdAt'>;
export type CreateNotificationInput = Omit<Notification, 'id' | 'isRead' | 'createdAt'>;
export type CreateReportInput = Omit<Report, 'id' | 'status' | 'createdAt' | 'resolvedAt'>;
export type CreateActivityInput = Omit<Activity, 'id' | 'createdAt'>;

// Interaction Types for API responses
export type InteractionCounts = {
  likes: number;
  comments: number;
  remixes: number;
  views: number;
};

export type UserInteractions = {
  hasLiked: boolean;
  hasCommented: boolean;
  hasRemixed: boolean;
  isFollowing?: boolean; // for user profiles
};

// Social Feed Types
export type FeedItem = {
  id: string;
  type: 'creation' | 'activity';
  creationId?: string;
  activity?: Activity;
  timestamp: Date;
};

export type SocialFeed = {
  items: FeedItem[];
  hasMore: boolean;
  nextCursor?: string;
};