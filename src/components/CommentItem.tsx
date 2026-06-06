import React from 'react';
import { Comment } from '../types/comment.type';
import { formatTimeAgo } from '../utils/formatDate';

interface CommentItemProps {
  comment: Comment;
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  return (
    <div style={{ padding: '1rem 0', borderBottom: '1px solid #f3f4f6' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
        <span style={{ fontWeight: 600 }}>{comment.author?.username || 'Anonymous'}</span>
        <span style={{ color: '#6b7280' }}>•</span>
        <span style={{ color: '#6b7280' }}>{formatTimeAgo(comment.createdAt)}</span>
      </div>
      <p style={{ color: '#374151', margin: 0 }}>{comment.content}</p>
    </div>
  );
};
