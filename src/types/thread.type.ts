import type { User } from './user.type';
import type { Comment } from './comment.type';

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface Thread {
  id: string;
  title: string;
  body: string;
  user_id: string;
  user?: User;
  category_id: string;
  category?: Category;
  tags?: Tag[];
  likes_count: number;
  comments_count: number;
  view_count: number;
  accepted_answer_id?: string | null;
  is_answered?: boolean;
  status: 'open' | 'closed';
  edit_count?: number;
  vote_score?: number;
  is_liked?: boolean;
  comments?: Comment[];
  created_at: string;
  updated_at: string;
}

export interface CreateThreadInput {
  title: string;
  body: string;
  category_id: string;
  tags: string[];
}
