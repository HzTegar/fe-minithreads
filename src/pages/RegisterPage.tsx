import React, { useState } from 'react';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { APP_NAME } from '../utils/constants';

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Register with:', formData);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' }}>
      <div style={{ maxWidth: '400px', width: '100%', padding: '2rem', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h1 style={{ textAlign: 'center', color: '#2563eb', marginBottom: '0.5rem' }}>{APP_NAME}</h1>
        <h2 style={{ textAlign: 'center', fontSize: '1.25rem', marginBottom: '2rem', color: '#374151' }}>Create an account</h2>
        
        <form onSubmit={handleSubmit}>
          <Input 
            label="Username" 
            value={formData.username} 
            onChange={(e) => setFormData({ ...formData, username: e.target.value })} 
            required 
          />
          <Input 
            label="Email" 
            type="email" 
            value={formData.email} 
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
            required 
          />
          <Input 
            label="Password" 
            type="password" 
            value={formData.password} 
            onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
            required 
          />
          <Input 
            label="Confirm Password" 
            type="password" 
            value={formData.confirmPassword} 
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} 
            required 
          />
          <Button type="submit" style={{ width: '100%', marginTop: '1rem' }}>
            Register
          </Button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
          Already have an account? <a href="/login" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>Sign In</a>
        </p>
      </div>
    </div>
  );
};
