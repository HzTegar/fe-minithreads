import React from 'react';
import { HiUser } from 'react-icons/hi';
import { resolveAvatarUrl } from '../../utils/constants';

interface UserAvatarProps {
  username?: string | null;
  avatarUrl?: string | null;
  size?: number; // px
  className?: string;
}

/**
 * Renders user avatar image if available, otherwise a 2-letter initial fallback.
 * Shape: always circle. Avatar URL is resolved to full backend URL automatically.
 */
export const UserAvatar: React.FC<UserAvatarProps> = ({
  username,
  avatarUrl,
  size = 32,
  className,
}) => {
  const initials = username ? username.substring(0, 2).toUpperCase() : null;
  const resolvedUrl = resolveAvatarUrl(avatarUrl);

  const style: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: '50%',      // ← bulat
    overflow: 'hidden',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: size * 0.35,
    backgroundColor: '#2a2a2a',
    color: '#9ca3af',
    border: '1px solid #3a3a3a',
  };

  return (
    <div style={style} className={className}>
      {resolvedUrl ? (
        <img
          src={resolvedUrl}
          alt={username ?? 'user'}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : initials ? (
        <span style={{ fontWeight: 600, lineHeight: 1 }}>{initials}</span>
      ) : (
        <HiUser style={{ fontSize: size * 0.55 }} />
      )}
    </div>
  );
};