import React from 'react';
import { Link } from 'react-router-dom';

interface UserLinkProps {
  username?: string | null;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Renders a username as a clickable link to /users/:username.
 * Falls back to "Anonymous" if username is not provided.
 */
export const UserLink: React.FC<UserLinkProps> = ({ username, className, style }) => {
  if (!username) return <span style={{ color: '#6b7280' }}>Anonymous</span>;

  return (
    <Link
      to={`/users/${encodeURIComponent(username)}`}
      className={className}
      style={{ color: '#0074cc', textDecoration: 'none', fontWeight: 500, ...style }}
      onClick={e => e.stopPropagation()}
    >
      {username}
    </Link>
  );
};
