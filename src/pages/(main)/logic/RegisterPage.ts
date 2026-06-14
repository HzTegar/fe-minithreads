import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { authService } from '../../../services/authService';

export const useRegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    username: Yup.string().min(3, 'Username must be at least 3 characters').required('Username is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Password confirmation is required'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setError('');

      try {
        await authService.register(values);
        navigate('/login');
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Registration failed.');
      } finally {
        setIsLoading(false);
      }
    },
  });

  return {
    formik,
    isLoading,
    error
  };
};

