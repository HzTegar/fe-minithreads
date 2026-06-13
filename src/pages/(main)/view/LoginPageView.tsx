import React from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { APP_NAME } from '../../../utils/constants';
import { useLoginPage } from '../logic/LoginPage';

export const LoginPage: React.FC = () => {
  const {
    formik,
    isLoading,
    error
  } = useLoginPage();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0d0d0d' }}>
      <div style={{ maxWidth: '400px', width: '100%', padding: '2rem', backgroundColor: '#1a1a1a', borderRadius: '12px', border: '1px solid #2a2a2a', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
        <h1 style={{ textAlign: 'center', color: '#818cf8', marginBottom: '0.5rem' }}>{APP_NAME}</h1>
        <h2 style={{ textAlign: 'center', fontSize: '1.25rem', marginBottom: '2rem', color: '#d4d4d4' }}>Sign in to your account</h2>
        
        {error && <p style={{ color: '#f87171', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}

        <form onSubmit={formik.handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <Input 
              label="Email" 
              type="email" 
              name="email"
              value={formik.values.email} 
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email ? (
              <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.25rem' }}>{formik.errors.email}</p>
            ) : null}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <Input 
              label="Password" 
              type="password" 
              name="password"
              value={formik.values.password} 
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password ? (
              <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.25rem' }}>{formik.errors.password}</p>
            ) : null}
          </div>

          <Button type="submit" disabled={isLoading || !formik.isValid} style={{ width: '100%', marginTop: '1rem' }}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#737373', fontSize: '0.875rem' }}>
          Don't have an account? <Link to="/register" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 500 }}>Register</Link>
        </p>
      </div>
    </div>
  );
};

