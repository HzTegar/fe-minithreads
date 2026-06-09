import type { User } from './user.type';

export interface Comment {
  id: string;
  post_id: string;
  body: string;
  user_id: string;
  user?: User;
  is_accepted?: boolean;
  edit_count?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateCommentInput {
  post_id: string;
  body: string;
}
