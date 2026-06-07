import React from 'react';
import type { UserRole } from '../../types/user.type';

interface RoleBadgeProps {
  role: UserRole;
  showIcon?: boolean;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, showIcon = true }) => {
  const config = {
    admin: {
      label: 'Admin',
      color: '#d93025',
      bgColor: '#fce8e6',
      icon: (
        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
        </svg>
      ),
    },
    moderator: {
      label: 'Moderator',
      color: '#188038',
      bgColor: '#e6f4ea',
      icon: (
        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
          <path d="M14 2a3.963 3.963 0 0 0-2 .567A3.963 3.963 0 0 0 10 2a3.963 3.963 0 0 0-2 .567A3.963 3.963 0 0 0 6 2a4 4 0 1 0 0 8h.588M14 10a4 4 0 1 0 0-8h-.588M14 10v2a4 4 0 1 1-8 0v-2m1 0h1.414A3.963 3.963 0 0 0 10 11.414 3.963 3.963 0 0 0 12.586 10H13"/>
        </svg>
      ),
    },
    user: {
      label: 'User',
      color: '#70757a',
      bgColor: '#f1f3f4',
      icon: (
        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 18">
          <path d="M7 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm2 1H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"/>
        </svg>
      ),
    },
  };

  const current = config[role];

  return (
    <span 
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 8px',
        borderRadius: '12px',
        fontSize: '0.7rem',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: current.color,
        backgroundColor: current.bgColor,
        border: `1px solid ${current.color}33`,
      }}
    >
      {showIcon && current.icon}
      {current.label}
    </span>
  );
};
