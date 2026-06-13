import type { User } from './user.type';
import type { Thread } from './thread.type';
import type { Comment } from './comment.type';

export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'rejected';

export interface Report {
  id: string;
  user_id: string;
  user?: User;
  target_id: string;
  target_type: string; // 'App\\Models\\Post' | 'App\\Models\\Comment' | 'App\\Models\\User'
  target?: Thread | Comment | User;
  reason: string;
  description?: string;
  status: ReportStatus;
  resolved_by?: string | null;
  moderator?: User;
  moderator_notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateReportInput {
  target_id: string;
  target_type: 'post' | 'comment' | 'user';
  reason: string;
  description?: string;
}

export interface UpdateReportInput {
  status: ReportStatus;
  moderator_notes?: string;
}
