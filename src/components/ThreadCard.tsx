import React from 'react';
import { Link } from 'react-router-dom';
import type { Thread } from '../types/thread.type';
import { formatTimeAgo } from '../utils/formatDate';
import { UserLink } from './common/UserLink';

interface ThreadCardProps {
  thread: Thread;
}

export const ThreadCard: React.FC<ThreadCardProps> = ({ thread }) => {
  if (!thread) return null;

  return (
    <div className="px-5 py-4 bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#3a3a3a] rounded-xl mb-3 transition-colors">
      
      {/* Meta row */}
      <div className="flex gap-2 mb-2 text-[0.8rem] text-neutral-500 items-center">
        <UserLink username={thread.user?.username} />
        <span>·</span>
        <span>{thread.created_at ? formatTimeAgo(thread.created_at) : 'recently'}</span>
        <span>·</span>
        <span className="text-indigo-400 font-medium">
          {thread.category?.name || 'Uncategorized'}
        </span>
      </div>

      {/* Title */}
      <h3 className="m-0 mb-2 text-[1.05rem] font-semibold leading-snug">
        <Link
          to={`/thread/${thread.id}`}
          className="text-neutral-100 hover:text-indigo-300 no-underline transition-colors"
        >
          {thread.title || 'Untitled'}
        </Link>
      </h3>

      {/* Body preview */}
      <p
        className="text-neutral-400 text-[0.875rem] leading-relaxed mb-3"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          margin: '0 0 0.75rem',
        }}
      >
        {thread.body || 'No content available.'}
      </p>

      {/* Footer */}
      <div className="flex gap-4 text-[0.78rem] text-neutral-600">
        <span>{thread.likes_count || 0} likes</span>
        <span>{thread.comments_count || thread.comments?.length || 0} comments</span>
      </div>
    </div>
  );
};