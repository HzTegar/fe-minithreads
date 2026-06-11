import React from 'react';
import { HiUser } from 'react-icons/hi';

interface UserAvatarProps {
  username?: string | null;
  avatarUrl?: string | null;
  size?: number; // px
  className?: string;
}

/**
 * Renders user avatar image if available, otherwise a 2-letter initial fallback.
 */
export const UserAvatar: React.FC<UserAvatarProps> = ({
  username,
  avatarUrl,
  size = 32,
  className,
}) => {
  const initials = username
    ? username.substring(0, 2).toUpperCase()
    : null;

  const style: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: '4px',
    overflow: 'hidden',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: size * 0.35,
    backgroundColor: '#e5e7eb',
    color: '#6b7280',
  };

  return (
    <div style={style} className={className}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={username ?? 'user'}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />
      ) : initials ? (
        <span style={{ fontWeight: 600, lineHeight: 1 }}>{initials}</span>
      ) : (
        <HiUser style={{ fontSize: size * 0.55 }} />
      )}
    </div>
  );
};
