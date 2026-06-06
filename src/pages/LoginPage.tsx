import React, { useState } from 'react';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { APP_NAME } from '../utils/constants';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login with:', { email, password });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' }}>
      <div style={{ maxWidth: '400px', width: '100%', padding: '2rem', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h1 style={{ textAlign: 'center', color: '#2563eb', marginBottom: '0.5rem' }}>{APP_NAME}</h1>
        <h2 style={{ textAlign: 'center', fontSize: '1.25rem', marginBottom: '2rem', color: '#374151' }}>Sign in to your account</h2>
        
        <form onSubmit={handleSubmit}>
          <Input 
            label="Email" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <Input 
            label="Password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <Button type="submit" style={{ width: '100%', marginTop: '1rem' }}>
            Sign In
          </Button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
          Don't have an account? <a href="/register" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>Register</a>
        </p>
      </div>
    </div>
  );
};
