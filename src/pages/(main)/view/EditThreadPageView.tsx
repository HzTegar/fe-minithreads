import React from 'react';
import { Navbar } from '../../../components/Navbar';
import { ThreadForm } from '../../../components/ThreadForm';
import { useEditThreadPage } from '../logic/EditThreadPage';

export const EditThreadPage: React.FC = () => {
  const {
    initialData,
    isLoading,
    handleSubmit,
    isSubmitting
  } = useEditThreadPage();

  return (
    <div>
      <Navbar />
      <main style={{ maxWidth: '600px', margin: '2rem auto', padding: '0 1rem' }}>
        <h1 style={{ marginBottom: '2rem' }}>Edit Thread</h1>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>Loading thread details...</div>
        ) : (
          <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <ThreadForm initialData={initialData} onSubmit={handleSubmit} isLoading={isSubmitting} />
          </div>
        )}
      </main>
    </div>
  );
};

