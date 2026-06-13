import React from 'react';
import type { UserLevel } from '../../types/user.type';
import { HiShieldCheck, HiShieldExclamation, HiUser } from 'react-icons/hi';

interface RoleBadgeProps {
  role: UserLevel;
  showIcon?: boolean;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, showIcon = true }) => {
  const config = {
    admin: {
      label: 'Admin',
      color: '#d93025',
      bgColor: '#fce8e6',
      icon: <HiShieldCheck className="w-3 h-3" />,
    },
    moderator: {
      label: 'Moderator',
      color: '#188038',
      bgColor: '#e6f4ea',
      icon: <HiShieldExclamation className="w-3 h-3" />,
    },
    user: {
      label: 'User',
      color: '#70757a',
      bgColor: '#f1f3f4',
      icon: <HiUser className="w-3 h-3" />,
    },
  };

  const current = config[role] || config.user;

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
      {role ? current.label : 'User'}
    </span>
  );
};
