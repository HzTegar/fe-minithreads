import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { threadService } from '../../../services/threadService';
import { useAuth } from '../../../hooks/useAuth';

export const useEditThreadPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const [thread, setThread] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Kita tetap simpan isModerator untuk pengecekan akses (bisa edit thread orang lain atau tidak)
  const isModerator = currentUser?.level === 'admin' || currentUser?.level === 'moderator';
  
  // LOGIKA LIMIT: Dibuat mutlak 3x untuk SEMUA orang
  const isLimitReached = useMemo(() => {
    if (!thread) return false;
    // Semua user, termasuk moderator, dibatasi 3 kali edit
    return (thread.edit_count || 0) >= 3;
  }, [thread]); 

  useEffect(() => {
    const fetchThread = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await threadService.getById(id);
        setThread(data);
        
        // Pengecekan akses: 
        // Moderator tetap bisa masuk ke thread orang lain, User biasa hanya miliknya sendiri
        if (data && data.user_id !== currentUser?.id && !isModerator) {
           alert("Anda tidak memiliki akses.");
           navigate('/');
        }
      } catch (err) {
        console.error('Failed to fetch thread:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchThread();
  }, [id, currentUser?.id, isModerator, navigate]);

  const handleSubmit = async (formData: any) => {
    // Tombol akan menolak aksi jika edit_count sudah >= 3 untuk siapapun
    if (isLimitReached) {
      alert("Limit edit 3x sudah tercapai.");
      return;
    }

    setIsSubmitting(true);
    try {
      await threadService.update(id!, formData);
      navigate(`/thread/${id}`);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Gagal mengupdate thread';
      alert(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { 
    thread, 
    isLoading, 
    isSubmitting, 
    isLimitReached, 
    handleSubmit 
  };
};