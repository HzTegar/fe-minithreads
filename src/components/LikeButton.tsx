import React from 'react';

interface LikeButtonProps {
  count: number;
  isLiked?: boolean;
  onLike: () => void;
}

export const LikeButton: React.FC<LikeButtonProps> = ({ count, isLiked, onLike }) => {
  return (
    <button
      onClick={onLike}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: isLiked ? '#ef4444' : '#6b7280',
        padding: '4px 8px',
        borderRadius: '4px',
        backgroundColor: isLiked ? '#fee2e2' : 'transparent',
        transition: 'all 0.2s',
      }}
    >
      <span style={{ fontSize: '18px' }}>{isLiked ? '❤️' : '🤍'}</span>
      <span style={{ fontWeight: 500 }}>{count}</span>
    </button>
  );
};
