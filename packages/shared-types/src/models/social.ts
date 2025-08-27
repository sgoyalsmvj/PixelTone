export interface Comment {
  id: string;
  creationId: string;
  authorId: string;
  author?: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
  };
  content: string;
  parentId?: string; // for threaded comments
  replies?: Comment[];
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Like {
  id: string;
  creationId: string;
  userId: string;
  createdAt: Date;
}

export interface Interaction {
  type: 'like' | 'unlike' | 'comment' | 'view' | 'share' | 'remix';
  creationId: string;
  userId: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'remix' | 'follow' | 'system';
  title: string;
  message: string;
  relatedId?: string; // creation ID, user ID, etc.
  isRead: boolean;
  createdAt: Date;
}

export interface UserActivity {
  id: string;
  userId: string;
  type: 'creation' | 'like' | 'comment' | 'remix' | 'follow';
  targetId: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}