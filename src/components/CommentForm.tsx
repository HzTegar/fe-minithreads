import React, { useState } from 'react';
import { Button } from './common/Button';

interface CommentFormProps {
  onSubmit: (content: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export const CommentForm: React.FC<CommentFormProps> = ({ onSubmit, isLoading, placeholder = "Write a comment..." }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content);
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '0.5rem', minHeight: '100px' }}
        placeholder={placeholder}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="submit" size="sm" isLoading={isLoading} disabled={!content.trim()}>
          Post Comment
        </Button>
      </div>
    </form>
  );
};
