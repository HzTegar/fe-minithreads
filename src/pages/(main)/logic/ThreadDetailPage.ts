import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { threadService } from '../../../services/threadService';
import { commentService } from '../../../services/commentService';
import { bookmarkService } from '../../../services/bookmarkService';
import { useAuth } from '../../../hooks/useAuth';
import type { Thread } from '../../../types/thread.type';
import type { Comment } from '../../../types/comment.type';

export const useThreadDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [thread, setThread] = useState<Thread | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Edit state
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingBody, setEditingBody] = useState('');

  const canModerate = currentUser?.level === 'admin' || currentUser?.level === 'moderator';
  const isOwner = (authorId: string) => currentUser?.id === authorId;

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const threadData = await threadService.getById(id);
        setThread(threadData);
        // Backend returns nested comments inside the post
        const rawComments: Comment[] = threadData.comments || [];
        // Flatten: top-level comments + their replies
        setComments(rawComments.filter(c => !c.parent_id));
        setIsBookmarked(false); // will update if bookmark endpoint provides initial state
      } catch (error) {
        console.error('Failed to fetch thread detail:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // --- Thread actions ---

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
      setThread({ ...thread, likes_count: response.likes_count, is_liked: response.is_liked });
    } catch (error) {
      console.error('Failed to like thread:', error);
    }
  };

  const handleDelete = async () => {
    if (!id || !thread) return;
    if (!confirm('Yakin mau hapus thread ini?')) return;
    try {
      await threadService.delete(id);
      navigate('/');
    } catch (error: any) {
      alert(error.message || 'Failed to delete thread');
    }
  };

  // --- Comment submit (new top-level answer) ---

  const handleCommentSubmit = async (body: string) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      // FIX: pass postId as first arg, data as second
      const newComment = await commentService.create(id, { body });
      setComments(prev => [...prev, newComment]);
    } catch (error: any) {
      alert(error.message || 'Failed to post answer');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Comment reply ---

  const handleReplySubmit = async (parentId: string, body: string) => {
    if (!id) return;
    try {
      const newReply = await commentService.create(id, { body, parent_id: parentId });
      // Append reply under its parent in state
      setComments(prev =>
        prev.map(c =>
          c.id === parentId
            ? { ...c, replies: [...(c.replies || []), newReply] }
            : c
        )
      );
    } catch (error: any) {
      alert(error.message || 'Failed to post reply');
    }
  };

  // --- Comment vote ---

  const handleCommentVote = async (commentId: string, type: 'up' | 'down') => {
    try {
      const response = await commentService.vote(commentId, type);
      setComments(prev =>
        prev.map(c =>
          c.id === commentId ? { ...c, vote_score: response.vote_score } : c
        )
      );
    } catch (error: any) {
      alert(error.message || 'Failed to vote');
    }
  };

  // --- Comment edit ---

  const startEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditingBody(comment.body);
  };

  const cancelEditComment = () => {
    setEditingCommentId(null);
    setEditingBody('');
  };

  const handleCommentUpdate = async (commentId: string) => {
    if (!editingBody.trim()) return;
    try {
      const updated = await commentService.update(commentId, { body: editingBody });
      setComments(prev =>
        prev.map(c => (c.id === commentId ? { ...c, body: updated.body } : c))
      );
      cancelEditComment();
    } catch (error: any) {
      alert(error.message || 'Failed to update comment');
    }
  };

  // --- Comment delete ---

  const handleCommentDelete = async (commentId: string) => {
    if (!confirm('Yakin mau hapus jawaban ini?')) return;
    try {
      await commentService.delete(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (error: any) {
      alert(error.message || 'Failed to delete comment');
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
    // edit state
    editingCommentId,
    editingBody,
    setEditingBody,
    // handlers
    handleBookmark,
    handleVote,
    handleLike,
    handleDelete,
    handleCommentSubmit,
    handleReplySubmit,
    handleCommentVote,
    startEditComment,
    cancelEditComment,
    handleCommentUpdate,
    handleCommentDelete,
  };
};
