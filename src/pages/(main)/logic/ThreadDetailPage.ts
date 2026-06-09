import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { threadService } from '../../../services/threadService';
import { commentService } from '../../../services/commentService';
import { bookmarkService } from '../../../services/bookmarkService';
import { useAuth } from '../../../hooks/useAuth';
import type { Thread } from '../../../types/thread.type';
import type { Comment } from '../../../types/comment.type';

export const useThreadDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const [thread, setThread] = useState<Thread | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const canModerate = currentUser?.level === 'admin' || currentUser?.level === 'moderator';
  const isOwner = (authorId: string) => currentUser?.id === authorId;

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const threadData = await threadService.getById(id);
        setThread(threadData);
        setComments(threadData.comments || []);
      } catch (error) {
        console.error('Failed to fetch thread detail:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleBookmark = async () => {
    if (!id) return;
    try {
      const response = await bookmarkService.toggle(id);
      setIsBookmarked(response.is_bookmarked);
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }
  };

  const handleVote = async (type: 'up' | 'down') => {
    if (!id || !thread) return;
    try {
      const response = await threadService.vote(id, type);
      setThread({ ...thread, vote_score: response.vote_score });
    } catch (error: any) {
      alert(error.message || 'Failed to vote');
    }
  };

  const handleLike = async () => {
    if (!id || !thread) return;
    try {
      const response = await threadService.like(id);
      setThread({ ...thread, likes_count: response.likes_count });
    } catch (error) {
      console.error('Failed to like thread:', error);
    }
  };

  const handleCommentSubmit = async (body: string) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      const newComment = await commentService.create({ thread_id: id, body });
      setComments([...comments, newComment]);
    } catch (error: any) {
      alert(error.message || 'Failed to post answer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    id,
    currentUser,
    thread,
    comments,
    isLoading,
    isSubmitting,
    isBookmarked,
    canModerate,
    isOwner,
    handleBookmark,
    handleVote,
    handleLike,
    handleCommentSubmit
  };
};

