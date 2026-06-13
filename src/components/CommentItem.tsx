import React, { useState } from 'react';
import type { Comment } from '../types/comment.type';
import { formatTimeAgo } from '../utils/formatDate';
import { useAuth } from '../hooks/useAuth';
import { RoleBadge } from './common/RoleBadge';
import { UserLink } from './common/UserLink';
import { UserAvatar } from './common/UserAvatar';
import { CommentForm } from './CommentForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription, // <-- Tambahan import untuk mengatasi warning
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  HiChevronUp,
  HiChevronDown,
  HiFlag,
  HiPencilAlt,
  HiTrash,
  HiCheckCircle,
  HiReply,
} from 'react-icons/hi';
import { commentService } from '@/services/commentService';



// ==========================================
// SUB-KOMPONEN: MODAL RIWAYAT (PAKAI SERVICE)
// ==========================================
interface CommentHistoryModalProps {
  commentId: string;
}

const CommentHistoryModal = ({ commentId }: CommentHistoryModalProps) => {
  const [histories, setHistories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      // 👇 Memanggil API langsung lewat service (Base URL & Token sudah otomatis)
      const result = await commentService.getHistory(commentId);
      
      // Ambil array datanya
      const historyData = result.data ? result.data : result;
      setHistories(Array.isArray(historyData) ? historyData : []);
      
    } catch (err) {
      console.error("Gagal mengambil riwayat:", err);
    } finally {
      setLoading(false);
    }
  };

  // Urutkan data dari yang terbaru (edit_number terbesar di atas)
  const sortedHistories = [...histories].sort((a, b) => b.edit_number - a.edit_number);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button onClick={fetchHistory} variant="outline" size="sm" className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 text-slate-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          Lihat Riwayat Edit
        </Button>
      </DialogTrigger>
      
      <DialogContent className="w-[95vw] md:w-[90vw] max-w-7xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#0a95ff]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            Riwayat Perubahan Komentar
          </DialogTitle>
          {/* 👇 Menambahkan deskripsi untuk screen reader (menyembunyikan warning kuning) */}
          <DialogDescription className="sr-only">
            Melihat riwayat perubahan teks komentar dari waktu ke waktu.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-5">
          {loading ? (
             <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-2xl border border-dashed">
               <p className="font-medium text-slate-700">Memuat riwayat...</p>
             </div>
          ) : histories.length === 0 ? (
            <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-2xl border border-dashed">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mx-auto text-slate-400 mb-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <p className="font-medium text-slate-700">Belum ada riwayat perubahan</p>
              <p className="text-xs text-slate-400 mt-1">Komentar ini belum pernah diedit sebelumnya.</p>
            </div>
          ) : (
            sortedHistories.map((history: any) => {
              const formattedDate = new Date(history.created_at).toLocaleString("id-ID", {
                dateStyle: "medium",
                timeStyle: "short",
              });

              return (
                <div key={history.id} className="border rounded-xl overflow-hidden shadow-sm bg-slate-50/50 w-full">
                  <div className="bg-slate-100 px-4 py-2.5 flex flex-wrap justify-between items-center gap-3 border-b text-xs text-slate-600">
                    <span className="font-bold text-slate-700 bg-white border px-2.5 py-1 rounded-md shadow-sm">
                      Edit ke-{history.edit_number}
                    </span>
                    
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="bg-white/80 px-2.5 py-1 rounded-md border border-slate-200 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 text-slate-400">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                        Editor User ID: <strong className="text-slate-800">{history.user_id}</strong>
                      </span>
                      <span className="bg-white/80 px-2.5 py-1 rounded-md border border-slate-200 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 text-slate-400">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        Waktu Perubahan: <strong className="text-slate-800">{formattedDate}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-white w-full">
                    <div className="bg-red-50/40 p-4 rounded-lg border border-red-100 min-w-0 w-full">
                      <span className="text-[10px] font-extrabold text-red-600 tracking-wider bg-red-100/60 px-2 py-0.5 rounded mb-3 inline-block">
                        SEBELUMNYA
                      </span>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap break-all leading-relaxed pt-1">
                        {history.old_content}
                      </p>
                    </div>

                    <div className="bg-green-50/40 p-4 rounded-lg border border-green-100 min-w-0 w-full">
                      <span className="text-[10px] font-extrabold text-green-600 tracking-wider bg-green-100/60 px-2 py-0.5 rounded mb-3 inline-block">
                        SESUDAHNYA
                      </span>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap break-all leading-relaxed pt-1">
                        {history.new_content}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ==========================================
// KOMPONEN UTAMA: COMMENT ITEM
// ==========================================
interface CommentItemProps {
  comment: Comment;
  activeEditId: string | null;
  editingBody: string;
  onEditBodyChange: (val: string) => void;
  onVote: (id: string, type: 'up' | 'down') => void;
  onEdit: (comment: Comment) => void;
  onEditSave: (id: string) => void;
  onEditCancel: () => void;
  onDelete: (id: string) => void;
  onReply: (parentId: string, body: string) => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  activeEditId,
  editingBody,
  onEditBodyChange,
  onVote,
  onEdit,
  onEditSave,
  onEditCancel,
  onDelete,
  onReply,
}) => {
  const { user: currentUser } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);

  const isEditing = activeEditId === comment.id;
  
  // Pastikan pengecekan role loginmu sudah sesuai (Level Admin atau Moderator)
  const canModerate = currentUser?.level === 'admin' || currentUser?.level === 'moderator';
  const isOwner = currentUser?.id === comment.user_id;
  const canEdit = isOwner && (comment.edit_count ?? 0) < 1;

  const handleReplySubmit = (body: string) => {
    onReply(comment.id, body);
    setShowReplyForm(false);
  };

  return (
    <div className="flex gap-4 py-4 border-b border-[#e3e6e8]">
      <div className="flex flex-col items-center w-12 pt-1">
        <button onClick={() => onVote(comment.id, 'up')} className="text-[#bbc0c4] hover:text-orange-500 transition-colors text-3xl"><HiChevronUp /></button>
        <span className="text-lg font-medium text-[#6a737c] my-1">{comment.vote_score ?? 0}</span>
        <button onClick={() => onVote(comment.id, 'down')} className="text-[#bbc0c4] hover:text-orange-500 transition-colors text-3xl"><HiChevronDown /></button>
        {comment.is_accepted && <div className="text-[#2e7d32] mt-2 text-3xl"><HiCheckCircle /></div>}
      </div>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="mb-4">
            <textarea
              value={editingBody}
              onChange={e => onEditBodyChange(e.target.value)}
              className="w-full p-3 border border-[#bbc0c4] rounded text-sm resize-y min-h-[100px]"
              autoFocus
            />
            <div className="flex gap-2 mt-2">
              <button onClick={() => onEditSave(comment.id)} className="bg-[#0a95ff] hover:bg-[#0074cc] text-white px-3 py-1 rounded text-sm">Save</button>
              <button onClick={onEditCancel} className="text-[#6a737c] hover:text-[#3b4045] px-3 py-1 rounded text-sm border border-[#e3e6e8]">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <div className="so-post-body whitespace-pre-wrap break-all">{comment.body}</div>
            {(comment.edit_count ?? 0) > 0 && <p className="text-[10px] text-gray-500 italic mt-1">Edited</p>}
          </div>
        )}

        <div className="flex justify-between items-center flex-wrap gap-2">
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#6a737c]">
            {currentUser && !isEditing && (
              <button onClick={() => setShowReplyForm(v => !v)} className="hover:text-[#0074cc] flex items-center gap-1">
                <HiReply className="w-3 h-3" /> {showReplyForm ? 'Cancel Reply' : 'Reply'}
              </button>
            )}
            {currentUser && !isOwner && !isEditing && (
              <button className="hover:text-[#0074cc] flex items-center gap-1"><HiFlag className="w-3 h-3" /> Report</button>
            )}
            {canEdit && !isEditing && (
              <button onClick={() => onEdit(comment)} className="hover:text-[#0074cc] flex items-center gap-1 text-[#0074cc]">
                <HiPencilAlt className="w-3 h-3" /> Edit
              </button>
            )}
            {(isOwner || canModerate) && !isEditing && (
              <button onClick={() => onDelete(comment.id)} className="hover:text-red-600 flex items-center gap-1 text-red-500 font-medium">
                <HiTrash className="w-3 h-3" /> Delete
              </button>
            )}

            {/* Tombol View History Ditampilkan Hanya untuk Admin/Moderator */}
            {canModerate && !isEditing && (
              <CommentHistoryModal commentId={comment.id} />
            )}
          </div>
        </div>

        {showReplyForm && <div className="mt-4 pl-4 border-l-2 border-[#e3e6e8]"><CommentForm onSubmit={handleReplySubmit} /></div>}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 pl-4 border-l-2 border-[#e3e6e8] space-y-2">
            {comment.replies.map(reply => (
              <CommentItem 
                key={reply.id} 
                comment={reply} 
                activeEditId={activeEditId} 
                editingBody={editingBody}
                onEditBodyChange={onEditBodyChange}
                onVote={onVote} 
                onEdit={onEdit} 
                onEditSave={onEditSave} 
                onEditCancel={onEditCancel} 
                onDelete={onDelete} 
                onReply={onReply} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};