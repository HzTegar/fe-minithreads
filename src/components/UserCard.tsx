import React from 'react';
import { Link } from 'react-router-dom';
import type { User } from '../types/user.type';

interface UserCardProps {
  user: User;
}

export const UserCard: React.FC<UserCardProps> = ({ user }) => {
  if (!user) return null;

  return (
    <div style={{ padding: '1rem', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#e5e7eb', overflow: 'hidden' }}>
        {user.avatar_url ? (
          <img src={user.avatar_url} alt={user.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', color: '#9ca3af' }}>
            {user.username.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div>
        <h4 style={{ margin: 0 }}>
          <Link to={`/users/${encodeURIComponent(user.username)}`} style={{ textDecoration: 'none', color: '#111827' }}>
            @{user.username}
          </Link>
        </h4>
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
          {user.bio || 'No bio available.'}
        </p>
      </div>
    </div>
  );
};
