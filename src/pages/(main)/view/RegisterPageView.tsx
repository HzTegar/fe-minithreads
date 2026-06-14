import React from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { APP_NAME } from '../../../utils/constants';
import { useRegisterPage } from '../logic/RegisterPage';
import { ThemeToggle } from '../../../components/ThemeToggle';

export const RegisterPage: React.FC = () => {
  const {
    formik,
    isLoading,
    error
  } = useRegisterPage();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--background)', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
        <ThemeToggle />
      </div>
      <div style={{ maxWidth: '400px', width: '100%', padding: '2rem', backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
        <h1 style={{ textAlign: 'center', color: 'var(--primary)', marginBottom: '0.5rem' }}>{APP_NAME}</h1>
        <h2 style={{ textAlign: 'center', fontSize: '1.25rem', marginBottom: '2rem', color: 'var(--foreground)' }}>Create an account</h2>
        
        {error && <p style={{ color: '#f87171', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}

        <form onSubmit={formik.handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <Input 
              label="Username" 
              name="username"
              value={formik.values.username} 
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.username && formik.errors.username ? (
              <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.25rem' }}>{formik.errors.username}</p>
            ) : null}
          </div>

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

          <div style={{ marginBottom: '1rem' }}>
            <Input 
              label="Confirm Password" 
              type="password" 
              name="password_confirmation"
              value={formik.values.password_confirmation} 
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password_confirmation && formik.errors.password_confirmation ? (
              <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.25rem' }}>{formik.errors.password_confirmation}</p>
            ) : null}
          </div>

          <Button type="submit" disabled={isLoading || !formik.isValid} style={{ width: '100%', marginTop: '1rem' }}>
            {isLoading ? 'Registering...' : 'Register'}
          </Button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};
