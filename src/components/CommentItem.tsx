import React from 'react';
import type { Comment } from '../types/comment.type';
import { formatTimeAgo } from '../utils/formatDate';
import { useAuth } from '../hooks/useAuth';
import { RoleBadge } from './common/RoleBadge';

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
        <button className="text-[#bbc0c4] hover:text-orange-500 transition-colors">
          <svg className="w-8 h-8" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m5 15 7-7 7 7"/>
          </svg>
        </button>
        <span className="text-lg font-medium text-[#6a737c] my-1">
          {Math.floor(Math.random() * 5)}
        </span>
        <button className="text-[#bbc0c4] hover:text-orange-500 transition-colors">
          <svg className="w-8 h-8" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7"/>
          </svg>
        </button>
        
        {comment.is_accepted && (
          <div className="text-[#2e7d32] mt-2" title="The question owner accepted this as the best answer">
            <svg className="w-8 h-8" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M2 12a10 10 0 1 1 20 0 10 10 0 0 1-20 0Zm13.7-1.3a1 1 0 0 0-1.4-1.4L11 12.6l-1.8-1.8a1 1 0 0 0-1.4 1.4l2.5 2.5a1 1 0 0 0 1.4 0l4-4Z" clipRule="evenodd"/>
            </svg>
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
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 14v7M5 4.971c0-1.642 1.333-2.97 3-2.97 1.667 0 3 1.328 3 2.97v10.058c0 1.642-1.333 2.971-3 2.971-1.667 0-3-1.33-3-2.97V4.97Z"/>
                </svg>
                Report
              </button>
            )}
            
            {(isOwner || canModerate) && (
              <button className="hover:text-[#0074cc] flex items-center gap-1 text-[#0074cc]">
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M11.3 6.2H5a2 2 0 0 0-2 2V19a2 2 0 0 0 2 2h11c1.1 0 2-1 2-2v-6.3l-1.6 1.6V19a.4.4 0 0 1-.4.4H5a.4.4 0 0 1-.4-.4V8.2c0-.2.2-.4.4-.4h6.3l1.6-1.6Zm1.8 1.8L13 6.4 17.6 2l3.4 3.4-4.6 4.6-1.6-1.6Zm-1.8 1.8 1.8 1.8-1.8 1.8-1.8-1.8 1.8-1.8Z" clipRule="evenodd"/>
                  <path d="M19.8 8 16 4.2l-1.4 1.4 3.8 3.8L19.8 8Z"/>
                </svg>
                Edit
              </button>
            )}
            
            {canModerate && (
              <button className="hover:text-red-600 flex items-center gap-1 text-red-500 font-medium">
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                </svg>
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
