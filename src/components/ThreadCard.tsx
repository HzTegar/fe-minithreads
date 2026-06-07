import React from 'react';
import type { Thread } from '../types/thread.type';
import { formatTimeAgo } from '../utils/formatDate';

interface ThreadCardProps {
  thread: Thread;
}

export const ThreadCard: React.FC<ThreadCardProps> = ({ thread }) => {
  const cardStyle: React.CSSProperties = {
    padding: '1.5rem',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    marginBottom: '1rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  };

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
        <span>{thread.author?.username || 'Anonymous'}</span>
        <span>•</span>
        <span>{formatTimeAgo(thread.createdAt)}</span>
        <span>•</span>
        <span style={{ color: '#2563eb', fontWeight: 500 }}>{thread.category}</span>
      </div>
      <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>
        <a href={`/thread/${thread.id}`} style={{ textDecoration: 'none', color: '#111827' }}>
          {thread.title}
        </a>
      </h3>
      <p style={{ color: '#4b5563', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {thread.content}
      </p>
      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
        <span>{thread.likesCount} likes</span>
        <span>{thread.commentsCount} comments</span>
      </div>
    </div>
  );
};
