import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { threadService } from '../../../services/threadService';

export const useCreateThreadPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await threadService.create(data);
      // Redirect to the newly created thread if ID is available, else to home
      const threadId = response?.id || response?.data?.id;
      if (threadId) {
        navigate(`/thread/${threadId}`);
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create thread.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    handleSubmit
  };
};

