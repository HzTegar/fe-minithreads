import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '6px',
    border: `1px solid ${error ? '#dc2626' : '#333'}`,
    fontSize: '16px',
    marginTop: '4px',
    backgroundColor: '#1a1a1a',
    color: '#e5e5e5',
  };

  return (
    <div style={{ marginBottom: '16px', width: '100%' }}>
      {label && (
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#a3a3a3' }}>
          {label}
        </label>
      )}
      <input
        className={`focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none ${className}`}
        style={inputStyle}
        {...props}
      />
      {error && (
        <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
          {error}
        </p>
      )}
    </div>
  );
};
