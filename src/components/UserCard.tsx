import React from 'react';
import { Link } from 'react-router-dom';
import type { User } from '../types/user.type';

interface UserCardProps {
  user: User;
}

export const UserCard: React.FC<UserCardProps> = ({ user }) => {
  if (!user) return null;

  return (
    <div className="px-5 py-4 bg-card border border-border hover:border-foreground/20 rounded-xl mb-3 transition-colors flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-muted overflow-hidden shrink-0">
        {user.avatar_url ? (
          <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xl text-neutral-500 font-semibold">
            {user.username.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div>
        <h4 className="m-0 font-semibold">
          <Link to={`/users/${encodeURIComponent(user.username)}`} className="text-neutral-100 hover:text-indigo-300 no-underline transition-colors">
            @{user.username}
          </Link>
        </h4>
        <p className="m-0 text-sm text-neutral-500">
          {user.bio || 'No bio available.'}
        </p>
      </div>
    </div>
  );
};