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
    <div className="px-5 py-4 bg-card border border-border hover:border-foreground/20 rounded-xl mb-3 transition-colors">
      
      {/* Meta row */}
      <div className="flex gap-2 mb-2 text-[0.8rem] text-muted-foreground items-center">
        <UserLink username={thread.user?.username} />
        <span>·</span>
        <span>{thread.created_at ? formatTimeAgo(thread.created_at) : 'recently'}</span>
        <span>·</span>
        <span className="text-primary font-medium">
          {thread.category?.name || 'Uncategorized'}
        </span>
        {thread.status === 'closed' && (
          <span className="text-amber-400 flex items-center gap-0.5 text-[0.7rem]">
            · Closed
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="m-0 mb-2 text-[1.05rem] font-semibold leading-snug">
        <Link
          to={`/thread/${thread.id}`}
          className="text-foreground hover:text-indigo-300 no-underline transition-colors"
        >
          {thread.title || 'Untitled'}
        </Link>
      </h3>

      {/* Body preview */}
      <p
        className="text-muted-foreground text-[0.875rem] leading-relaxed mb-3"
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

      {/* Tags */}
      {thread.tags && thread.tags.length > 0 && (
        <div className="flex gap-1.5 mb-3 flex-wrap">
          {thread.tags.map((tag) => (
            <span
              key={tag.id}
              className="px-2 py-0.5 rounded-full text-[0.65rem]"
              style={{
                backgroundColor: `${tag.color}1A`,
                color: tag.color,
                border: `1px solid ${tag.color}33`,
              }}
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex gap-4 text-[0.78rem] text-muted-foreground">
        <span>{thread.likes_count || 0} likes</span>
        <span>{thread.comments_count || thread.comments?.length || 0} comments</span>
      </div>
    </div>
  );
};
