import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { authService } from '../../../services/authService';
import { authStore } from '../../../store/authStore';

export const useLoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setError('');

      try {
        const response = await authService.login(values);
        authStore.setAuth(response.user, response.access_token);
        navigate('/');
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Login failed. Please check your credentials.');
        console.error(err);
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

