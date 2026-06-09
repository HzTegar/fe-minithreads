import React from 'react';
import { Navbar } from '../../../components/Navbar';
import { ThreadForm } from '../../../components/ThreadForm';
import { useEditThreadPage } from '../logic/EditThreadPage';

export const EditThreadPage: React.FC = () => {
  const {
    initialData,
    handleSubmit
  } = useEditThreadPage();

  return (
    <div>
      <Navbar />
      <main style={{ maxWidth: '600px', margin: '2rem auto', padding: '0 1rem' }}>
        <h1 style={{ marginBottom: '2rem' }}>Edit Thread</h1>
        <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <ThreadForm initialData={initialData} onSubmit={handleSubmit} />
        </div>
      </main>
    </div>
  );
};

