import type { User } from './user.type';

export interface Comment {
  id: string;
  post_id: string;
  body: string;
  user_id: string;
  user?: User;
  parent_id?: string | null;
  replies?: Comment[];
  is_accepted?: boolean;
  vote_score?: number;
  likes_count?: number;
  edit_count?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateCommentInput {
  body: string;
  parent_id?: string;
}
