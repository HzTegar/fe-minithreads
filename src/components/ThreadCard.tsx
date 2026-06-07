import React from 'react';
import { Link } from 'react-router-dom';
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
        <span>{thread.user?.username || 'Anonymous'}</span>
        <span>•</span>
        <span>{formatTimeAgo(thread.created_at)}</span>
        <span>•</span>
        <span style={{ color: '#2563eb', fontWeight: 500 }}>{thread.category?.name}</span>
      </div>
      <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>
        <Link to={`/thread/${thread.id}`} style={{ textDecoration: 'none', color: '#111827' }}>
          {thread.title}
        </Link>
      </h3>
      <p style={{ color: '#4b5563', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {thread.body}
      </p>
      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
        <span>{thread.likes_count || 0} likes</span>
        <span>{thread.comments?.length || 0} comments</span>
      </div>
    </div>
  );
};
