export type UserLevel = 'user' | 'moderator' | 'admin';

export interface User {
  id: string;
  username: string;
  email: string;
  level: UserLevel;
  avatarUrl?: string;
  avatar_url?: string;
  bio?: string;
  reputation?: number;
  points?: number;
  reputation_points?: number;
  rank_level?: string;
  followers_count?: number;
  following_count?: number;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}
