import type { User } from './user.type';

export interface Comment {
  id: string;
  threadId: string;
  content: string;
  authorId: string;
  author?: User;
  is_accepted?: boolean;
  version?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentInput {
  threadId: string;
  content: string;
}
