import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { APP_NAME } from '../utils/constants';
import { authStore } from '../store/authStore';

export const Navbar: React.FC = () => {
  const [authState, setAuthState] = useState(authStore.getState());
  const navigate = useNavigate();

  useEffect(() => {
    return authStore.subscribe((state) => setAuthState(state));
  }, []);

  const handleLogout = () => {
    authStore.clearAuth();
    navigate('/login');
  };

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
    cursor: 'pointer',
  };

  return (
    <nav style={navStyle}>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>{APP_NAME}</Link>
      </div>
      <div>
        <Link to="/" style={linkStyle}>Home</Link>
        <Link to="/search" style={linkStyle}>Search</Link>
        
        {authState.isAuthenticated ? (
          <>
            <Link to="/notifications" style={linkStyle}>Notifications</Link>
            <Link to="/bookmarks" style={linkStyle}>Bookmarks</Link>
            <Link to="/profile" style={linkStyle}>Profile ({authState.user?.username})</Link>
            <span onClick={handleLogout} style={{ ...linkStyle, color: '#ef4444' }}>Logout</span>
          </>
        ) : (

          <>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/register" style={{ ...linkStyle, color: '#2563eb' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};
