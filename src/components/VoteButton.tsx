import React from 'react';

interface VoteButtonProps {
  count: number;
  userVote?: 1 | -1 | 0;
  onVote: (vote: 1 | -1) => void;
}

export const VoteButton: React.FC<VoteButtonProps> = ({ count, userVote, onVote }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
      <button
        onClick={() => onVote(1)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '20px',
          color: userVote === 1 ? '#2563eb' : '#9ca3af',
        }}
      >
        ▲
      </button>
      <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{count}</span>
      <button
        onClick={() => onVote(-1)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '20px',
          color: userVote === -1 ? '#ef4444' : '#9ca3af',
        }}
      >
        ▼
      </button>
    </div>
  );
};
