import type { User } from './user.type';

// 1. Tambahkan tipe untuk history edit komentarnya di sini bro
export interface CommentEditHistory {
  id: string | number;
  user_id: string;
  old_content: string; // Menyesuaikan isi dari backend Laravel (old_content)
  new_content: string; // Menyesuaikan isi dari backend Laravel (new_content)
  edit_number: number;
  created_at: string;
}

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
  
  // 2. Tambahkan array relasi ini agar komponen list komentarmu bisa membaca datanya
  edit_histories?: CommentEditHistory[]; 
  
  created_at: string;
  updated_at: string;
}

export interface CreateCommentInput {
  body: string;
  parent_id?: string;
}