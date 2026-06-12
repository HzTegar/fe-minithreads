import React, { useState, useEffect } from 'react';
import { Button } from './common/Button';
import { Input } from './common/Input';
import { categoryService, type Category } from '../services/categoryService';
import { tagService, type Tag } from '../services/tagService';

interface ThreadFormProps {
  initialData?: {
    title: string;
    body: string;
    category_id: string;
    tags: string[];
  };
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export const ThreadForm: React.FC<ThreadFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [newTag, setNewTag] = useState('');
  
  const [formData, setFormData] = useState(initialData || {
    title: '',
    body: '',
    category_id: '',
    tags: [] as string[],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, tags] = await Promise.all([
          categoryService.getAll(),
          tagService.getAll()
        ]);
        setCategories(cats);
        setAvailableTags(tags);
        
        if (!initialData && cats.length > 0) {
          setFormData(prev => ({ ...prev, category_id: cats[0].id }));
        }
      } catch (error) {
        console.error('Failed to load form metadata:', error);
      }
    };
    fetchData();
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category_id) {
      alert('Please select a category');
      return;
    }
    // Mengembalikan ke logika asli: kirim semua data apa adanya
    onSubmit(formData);
  };

  const handleTagToggle = (tagName: string) => {
    setFormData(prev => {
      const tags = prev.tags.includes(tagName)
        ? prev.tags.filter(t => t !== tagName)
        : [...prev.tags, tagName];
      return { ...prev, tags };
    });
  };

  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    if (formData.tags.length >= 5) {
      alert("Max 5 tags allowed!");
      return;
    }
    
    const existing = availableTags.find(t => t.name.toLowerCase() === newTag.toLowerCase());
    
    if (existing) {
      if (!formData.tags.includes(existing.name)) handleTagToggle(existing.name);
    } else {
      try {
        const created = await tagService.create(newTag);
        setAvailableTags(prev => [...prev, created]);
        handleTagToggle(created.name);
      } catch (err: any) {
        alert(err.message || "Failed to create tag");
      }
    }
    setNewTag('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Input
        label="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="What is your question? Be specific."
        required
      />
      
      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#3b4045', marginBottom: '6px' }}>Category</label>
        <select value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: '4px', border: '1px solid #babfc4' }} required>
          <option value="" disabled>Select a category</option>
          {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#3b4045', marginBottom: '6px' }}>Tags (Max 5)</label>
        
        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
          <input 
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); handleAddTag(); }}}
            placeholder="Type new tag & press Enter"
            style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #babfc4' }}
          />
          <button type="button" onClick={handleAddTag} style={{ padding: '4px 12px', background: '#0a95ff', color: 'white', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>Add</button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {availableTags.map(tag => {
            const isSelected = formData.tags.includes(tag.name);
            return (
              <button 
                key={tag.id} 
                type="button" 
                onClick={() => handleTagToggle(tag.name)} 
                style={{ 
                  padding: '4px 10px', 
                  borderRadius: '3px', 
                  border: 'none', 
                  cursor: 'pointer', 
                  backgroundColor: isSelected ? '#39739d' : '#e1ecf4', 
                  color: isSelected ? '#ffffff' : '#39739d' 
                }}
              >
                {tag.name}
              </button>
            );
          })}
        </div>
      </div>

      <textarea value={formData.body} onChange={(e) => setFormData({ ...formData, body: e.target.value })} rows={10} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #babfc4' }} placeholder="Explain your problem..." required />

      <Button type="submit" isLoading={isLoading} size="lg" style={{ backgroundColor: '#0a95ff', padding: '0.8rem 2rem' }}>
        {initialData ? 'Update Thread' : 'Post Your Question'}
      </Button>
    </form>
  );
};