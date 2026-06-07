import type { User } from './user.type';

export interface Thread {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author?: User;
  category: string;
  tags: string[];
  likesCount: number;
  commentsCount: number;
  accepted_answer_id?: string | null;
  is_answered?: boolean;
  version?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateThreadInput {
  title: string;
  content: string;
  category: string;
  tags: string[];
}
