import React, { useState } from 'react';
import { Button } from './common/Button';
import { Input } from './common/Input';
import { CATEGORIES } from '../utils/constants';

interface ThreadFormProps {
  initialData?: {
    title: string;
    content: string;
    category: string;
    tags: string[];
  };
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export const ThreadForm: React.FC<ThreadFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState(initialData || {
    title: '',
    body: '',
    category_id: CATEGORIES[0].id,
    tags: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Input
        label="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="What's on your mind?"
        required
      />
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>
          Category
        </label>
        <select
          value={formData.category_id}
          onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
          style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #d1d5db' }}
        >
          {CATEGORIES.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>
          Content
        </label>
        <textarea
          value={formData.body}
          onChange={(e) => setFormData({ ...formData, body: e.target.value })}
          rows={6}
          style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #d1d5db', resize: 'vertical' }}
          placeholder="Share your thoughts..."
          required
        />
      </div>

      <Button type="submit" isLoading={isLoading}>
        {initialData ? 'Update Thread' : 'Post Thread'}
      </Button>
    </form>
  );
};
