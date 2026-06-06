import { User } from './user.type';

export interface Comment {
  id: string;
  threadId: string;
  content: string;
  authorId: string;
  author?: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentInput {
  threadId: string;
  content: string;
}
