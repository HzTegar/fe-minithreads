import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '4px',
    border: `1px solid ${error ? '#dc2626' : '#d1d5db'}`,
    fontSize: '16px',
    marginTop: '4px',
  };

  return (
    <div style={{ marginBottom: '16px', width: '100%' }}>
      {label && (
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151' }}>
          {label}
        </label>
      )}
      <input
        className={`focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${className}`}
        style={inputStyle}
        {...props}
      />
      {error && (
        <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
          {error}
        </p>
      )}
    </div>
  );
};
