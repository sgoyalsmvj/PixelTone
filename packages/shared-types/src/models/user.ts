export interface User {
  id: string;
  username: string;
  email: string;
  profile: UserProfile;
  preferences: UserPreferences;
  createdAt: Date;
  lastActive: Date;
}

export interface UserProfile {
  displayName: string;
  bio?: string;
  avatar?: string;
  socialLinks?: string[];
}

export interface UserPreferences {
  defaultGenerationSettings: {
    visual: Partial<VisualParameters>;
    audio: Partial<AudioParameters>;
  };
  privacySettings: {
    profileVisibility: 'public' | 'private';
    creationsVisibility: 'public' | 'private' | 'friends';
  };
  notificationSettings: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    commentNotifications: boolean;
    likeNotifications: boolean;
  };
}

import { VisualParameters, AudioParameters } from './generation';