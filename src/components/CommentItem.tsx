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
  isEditing?: boolean;
  editingBody?: string;
  onEditBodyChange?: (val: string) => void;
  onVote: (id: string, type: 'up' | 'down') => void;
  onEdit: (comment: Comment) => void;
  onEditSave: (id: string) => void;
  onEditCancel: () => void;
  onDelete: (id: string) => void;
  onReply: (parentId: string, body: string) => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  isEditing = false,
  editingBody = '',
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

  const canModerate = currentUser?.level === 'admin' || currentUser?.level === 'moderator';
  const isOwner = currentUser?.id === comment.user_id;

  const handleReplySubmit = (body: string) => {
    onReply(comment.id, body);
    setShowReplyForm(false);
  };

  return (
    <div className="flex gap-4 py-4 border-b border-[#e3e6e8]">
      {/* Sidebar: Voting + Accepted Check */}
      <div className="flex flex-col items-center w-12 pt-1">
        <button
          onClick={() => onVote(comment.id, 'up')}
          className="text-[#bbc0c4] hover:text-orange-500 transition-colors text-3xl"
          title="This answer is useful"
        >
          <HiChevronUp />
        </button>
        <span className="text-lg font-medium text-[#6a737c] my-1">
          {comment.vote_score ?? 0}
        </span>
        <button
          onClick={() => onVote(comment.id, 'down')}
          className="text-[#bbc0c4] hover:text-orange-500 transition-colors text-3xl"
          title="This answer is not useful"
        >
          <HiChevronDown />
        </button>

        {comment.is_accepted && (
          <div
            className="text-[#2e7d32] mt-2 text-3xl"
            title="The question owner accepted this as the best answer"
          >
            <HiCheckCircle />
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Body or edit form */}
        {isEditing ? (
          <div className="mb-4">
            <textarea
              value={editingBody}
              onChange={e => onEditBodyChange?.(e.target.value)}
              className="w-full p-3 border border-[#bbc0c4] rounded text-sm resize-y min-h-[100px]"
              autoFocus
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => onEditSave(comment.id)}
                className="bg-[#0a95ff] hover:bg-[#0074cc] text-white px-3 py-1 rounded text-sm"
              >
                Save
              </button>
              <button
                onClick={onEditCancel}
                className="text-[#6a737c] hover:text-[#3b4045] px-3 py-1 rounded text-sm border border-[#e3e6e8]"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="so-post-body mb-4 whitespace-pre-wrap">{comment.body}</div>
        )}

        {/* Actions row */}
        <div className="flex justify-between items-end">
          <div className="flex gap-3 text-xs text-[#6a737c]">
            {/* Reply — available to anyone logged in */}
            {currentUser && !isEditing && (
              <button
                onClick={() => setShowReplyForm(v => !v)}
                className="hover:text-[#0074cc] flex items-center gap-1"
              >
                <HiReply className="w-3 h-3" />
                {showReplyForm ? 'Cancel Reply' : 'Reply'}
              </button>
            )}

            {/* Report — only for non-owners */}
            {currentUser && !isOwner && !isEditing && (
              <button className="hover:text-[#0074cc] flex items-center gap-1">
                <HiFlag className="w-3 h-3" />
                Report
              </button>
            )}

            {/* Edit — owner or moderator */}
            {(isOwner || canModerate) && !isEditing && (
              <button
                onClick={() => onEdit(comment)}
                className="hover:text-[#0074cc] flex items-center gap-1 text-[#0074cc]"
              >
                <HiPencilAlt className="w-3 h-3" />
                Edit
              </button>
            )}

            {/* Delete — moderator only */}
            {canModerate && !isEditing && (
              <button
                onClick={() => onDelete(comment.id)}
                className="hover:text-red-600 flex items-center gap-1 text-red-500 font-medium"
              >
                <HiTrash className="w-3 h-3" />
                Delete
              </button>
            )}
          </div>

          {/* Author card */}
          <div className="so-user-card">
            <div className="text-[#6a737c] mb-1">
              answered {formatTimeAgo(comment.created_at)}
            </div>
            <div className="flex gap-2 items-center">
              <UserAvatar
                username={comment.user?.username}
                avatarUrl={comment.user?.avatar_url}
                size={32}
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <UserLink username={comment.user?.username} />
                </div>
                {comment.user?.level && comment.user.level !== 'user' && (
                  <RoleBadge role={comment.user.level} showIcon={false} />
                )}
                <span className="text-[#6a737c] font-bold text-[10px]">
                  {comment.user?.reputation_points || 0} rep
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Reply form */}
        {showReplyForm && (
          <div className="mt-4 pl-4 border-l-2 border-[#e3e6e8]">
            <CommentForm
              onSubmit={handleReplySubmit}
              placeholder="Write your reply..."
            />
          </div>
        )}

        {/* Nested replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 pl-4 border-l-2 border-[#e3e6e8] space-y-2">
            {comment.replies.map(reply => (
              <CommentItem
                key={reply.id}
                comment={reply}
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
