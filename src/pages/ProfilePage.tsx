import React from 'react';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/common/Button';

export const ProfilePage: React.FC = () => {
  // Mock user
  const user = {
    username: 'admin',
    email: 'admin@example.com',
    bio: 'Software engineer and creator of MiniThreads.',
    createdAt: '2023-01-01T00:00:00Z',
  };

  return (
    <div>
      <Navbar />
      <main style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#e5e7eb', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
            👤
          </div>
          <h1 style={{ margin: '0 0 0.5rem 0' }}>{user.username}</h1>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>{user.email}</p>
          <p style={{ maxWidth: '500px', margin: '0 auto 2rem', color: '#4b5563' }}>{user.bio}</p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <Button variant="outline">Edit Profile</Button>
            <Button variant="danger">Logout</Button>
          </div>
        </div>
        
        <div style={{ marginTop: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>My Threads</h2>
          <p style={{ color: '#6b7280', fontStyle: 'italic' }}>You haven't posted any threads yet.</p>
        </div>
      </main>
    </div>
  );
};
