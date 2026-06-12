import React, { useState } from 'react';
import type { Comment } from '../types/comment.type';
import { formatTimeAgo } from '../utils/formatDate';
import { useAuth } from '../hooks/useAuth';
import { RoleBadge } from './common/RoleBadge';
import { UserLink } from './common/UserLink';
import { UserAvatar } from './common/UserAvatar';
import { CommentForm } from './CommentForm';
import {
  HiChevronUp,
  HiChevronDown,
  HiFlag,
  HiPencilAlt,
  HiTrash,
  HiCheckCircle,
  HiReply,
} from 'react-icons/hi';

interface CommentItemProps {
  comment: Comment;
  activeEditId: string | null; // Perubahan: Ganti isEditing boolean ke activeEditId
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
  activeEditId, // Ambil ini
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

  // Hitung status edit secara lokal berdasarkan activeEditId
  const isEditing = activeEditId === comment.id;

  const canModerate = currentUser?.level === 'admin' || currentUser?.level === 'moderator';
  const isOwner = currentUser?.id === comment.user_id;

  // Logika: Hanya bisa edit jika pemilik DAN belum pernah edit (edit_count < 1)
  const canEdit = isOwner && (comment.edit_count ?? 0) < 1;

  const handleReplySubmit = (body: string) => {
    onReply(comment.id, body);
    setShowReplyForm(false);
  };

  return (
    <div className="flex gap-4 py-4 border-b border-[#e3e6e8]">
      {/* ... (bagian Vote & Header tetap sama) ... */}
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
            <div className="so-post-body whitespace-pre-wrap">{comment.body}</div>
            {(comment.edit_count ?? 0) > 0 && <p className="text-[10px] text-gray-500 italic mt-1">Edited</p>}
          </div>
        )}

        <div className="flex justify-between items-end">
          <div className="flex gap-3 text-xs text-[#6a737c]">
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
          </div>
        </div>

        {showReplyForm && <div className="mt-4 pl-4 border-l-2 border-[#e3e6e8]"><CommentForm onSubmit={handleReplySubmit} /></div>}

        {/* RECURSIVE RENDER: Pastikan semua props dioper ke bawah */}
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