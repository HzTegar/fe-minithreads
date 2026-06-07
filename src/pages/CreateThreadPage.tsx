import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { ThreadForm } from '../components/ThreadForm';
import { threadService } from '../services/threadService';

export const CreateThreadPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    setError('');
    try {
      await threadService.create(data);
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message || 'Failed to create thread.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <main style={{ maxWidth: '600px', margin: '2rem auto', padding: '0 1rem' }}>
        <h1 style={{ marginBottom: '2rem' }}>Create New Thread</h1>
        {error && <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>}
        <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <ThreadForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
};
