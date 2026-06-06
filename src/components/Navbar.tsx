import React from 'react';
import { APP_NAME } from '../utils/constants';

export const Navbar: React.FC = () => {
  const navStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  };

  const linkStyle: React.CSSProperties = {
    marginLeft: '1.5rem',
    textDecoration: 'none',
    color: '#4b5563',
    fontWeight: 500,
  };

  return (
    <nav style={navStyle}>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>
        <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>{APP_NAME}</a>
      </div>
      <div>
        <a href="/" style={linkStyle}>Home</a>
        <a href="/search" style={linkStyle}>Search</a>
        <a href="/login" style={linkStyle}>Login</a>
        <a href="/register" style={{ ...linkStyle, color: '#2563eb' }}>Register</a>
      </div>
    </nav>
  );
};
