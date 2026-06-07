import React from 'react';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/common/Button';
import { RoleBadge } from '../components/common/RoleBadge';
import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '../types/user.type';

export const ProfilePage: React.FC = () => {
  const { user: authUser, updateUser } = useAuth();

  // Fallback to mock if not logged in
  const displayUser = authUser || {
    id: 'mock-1',
    username: 'admin',
    email: 'admin@example.com',
    bio: 'Software engineer and creator of MiniThreads.',
    role: 'admin' as UserRole,
    reputation: 1250,
    points: 450,
    createdAt: '2023-01-01T00:00:00Z',
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (authUser) {
      updateUser({ ...authUser, role: e.target.value as UserRole });
    }
  };

  return (
    <div>
      <Navbar />
      <main style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#e5e7eb', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', position: 'relative' }}>
            👤
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <RoleBadge role={displayUser.role} />
          </div>

          <h1 style={{ margin: '0 0 0.5rem 0' }}>{displayUser.username}</h1>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>{displayUser.email}</p>
          <p style={{ maxWidth: '500px', margin: '0 auto 1.5rem', color: '#4b5563' }}>{displayUser.bio}</p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem', padding: '1rem 0', borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#2563eb' }}>{(displayUser.reputation || 0).toLocaleString()}</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reputation</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#2563eb' }}>{(displayUser.points || 0).toLocaleString()}</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Points</div>
            </div>
          </div>

          {/* Role Tester for Demo Purposes */}
          <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px dashed #d1d5db' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '0.5rem' }}>
              [Demo Only] Switch Current Role:
            </label>
            <select 
              value={displayUser.role} 
              onChange={handleRoleChange}
              style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
            >
              <option value="user">Regular User</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          
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
