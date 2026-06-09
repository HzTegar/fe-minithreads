export type UserLevel = 'user' | 'moderator' | 'admin';

export interface User {
  id: string;
  username: string;
  email: string;
  level: UserLevel;
  avatarUrl?: string;
  bio?: string;
  reputation?: number;
  points?: number;
  reputation_points?: number; // Backend uses this
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}
