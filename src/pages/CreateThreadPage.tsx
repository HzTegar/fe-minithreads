import React from 'react';
import { Navbar } from '../components/Navbar';
import { ThreadForm } from '../components/ThreadForm';

export const CreateThreadPage: React.FC = () => {
  const handleSubmit = (data: any) => {
    console.log('Creating thread:', data);
    // Redirect logic would go here
  };

  return (
    <div>
      <Navbar />
      <main style={{ maxWidth: '600px', margin: '2rem auto', padding: '0 1rem' }}>
        <h1 style={{ marginBottom: '2rem' }}>Create New Thread</h1>
        <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <ThreadForm onSubmit={handleSubmit} />
        </div>
      </main>
    </div>
  );
};
