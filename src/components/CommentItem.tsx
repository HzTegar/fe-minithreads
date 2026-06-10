import React from 'react';
import type { Comment } from '../types/comment.type';
import { formatTimeAgo } from '../utils/formatDate';
import { useAuth } from '../hooks/useAuth';
import { RoleBadge } from './common/RoleBadge';
import { 
  HiChevronUp, 
  HiChevronDown, 
  HiFlag, 
  HiPencilAlt, 
  HiTrash,
  HiCheckCircle
} from 'react-icons/hi';

interface CommentItemProps {
  comment: Comment;
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  const { user: currentUser } = useAuth();
  
  const canModerate = currentUser?.level === 'admin' || currentUser?.level === 'moderator';
  const isOwner = currentUser?.id === comment.user_id;

  return (
    <div className="flex gap-4 py-4 border-b border-[#e3e6e8]">
      {/* Sidebar: Voting + Accepted Check */}
      <div className="flex flex-col items-center w-12 pt-1">
        <button className="text-[#bbc0c4] hover:text-orange-500 transition-colors text-3xl">
          <HiChevronUp />
        </button>
        <span className="text-lg font-medium text-[#6a737c] my-1">
          {comment.vote_score || 0}
        </span>
        <button className="text-[#bbc0c4] hover:text-orange-500 transition-colors text-3xl">
          <HiChevronDown />
        </button>
        
        {comment.is_accepted && (
          <div className="text-[#2e7d32] mt-2 text-3xl" title="The question owner accepted this as the best answer">
            <HiCheckCircle />
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="so-post-body mb-4 whitespace-pre-wrap">
          {comment.body}
        </div>
        
        <div className="flex justify-between items-end">
          <div className="flex gap-3 text-xs text-[#6a737c]">
            {!isOwner && (
              <button className="hover:text-[#0074cc] flex items-center gap-1">
                <HiFlag className="w-3 h-3" />
                Report
              </button>
            )}
            
            {(isOwner || canModerate) && (
              <button className="hover:text-[#0074cc] flex items-center gap-1 text-[#0074cc]">
                <HiPencilAlt className="w-3 h-3" />
                Edit
              </button>
            )}
            
            {canModerate && (
              <button className="hover:text-red-600 flex items-center gap-1 text-red-500 font-medium">
                <HiTrash className="w-3 h-3" />
                Delete
              </button>
            )}
          </div>
          
          <div className="so-user-card">
            <div className="text-[#6a737c] mb-1">
              answered {formatTimeAgo(comment.created_at)}
            </div>
            <div className="flex gap-2 items-center">
              <div className="size-8 bg-gray-200 rounded flex items-center justify-center text-[10px]">
                {comment.user?.username?.substring(0,2)?.toUpperCase() || '??'}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-[#0074cc] hover:text-[#0a95ff] cursor-pointer font-medium">
                    {comment.user?.username || 'Anonymous'}
                  </span>
                </div>
                {comment.user?.level && comment.user.level !== 'user' && (
                  <RoleBadge role={comment.user.level} showIcon={false} />
                )}
                <span className="text-[#6a737c] font-bold text-[10px]">{comment.user?.reputation_points || 0} rep</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
