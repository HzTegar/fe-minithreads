import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  const queryClient = useQueryClient();

  const [isBookmarked, setIsBookmarked] = useState(false);

  // Edit state
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingBody, setEditingBody] = useState('');

  const canModerate = currentUser?.level === 'admin' || currentUser?.level === 'moderator';
  const isOwner = (authorId: string) => currentUser?.id === authorId;

  // Fetch thread detail with React Query
  const { data: thread, isLoading } = useQuery({
    queryKey: ['thread', id],
    queryFn: () => threadService.getById(id || ''),
    enabled: !!id,
  });

  const comments: Comment[] = (thread?.comments || []).filter((c: Comment) => !c.parent_id);

  // --- Thread actions ---

  const bookmarkMutation = useMutation({
    mutationFn: () => bookmarkService.toggle(id || ''),
    onSuccess: (data) => {
      setIsBookmarked(data.is_bookmarked);
    },
  });

  const voteMutation = useMutation({
    mutationFn: (type: 'up' | 'down') => threadService.vote(id || '', type),
    onSuccess: (data) => {
      queryClient.setQueryData(['thread', id], (old: Thread) => ({
        ...old,
        vote_score: data.vote_score,
      }));
    },
    onError: (error: any) => {
      alert(error.message || 'Failed to vote');
    },
  });

  const likeMutation = useMutation({
    mutationFn: () => threadService.like(id || ''),
    onSuccess: (data) => {
      queryClient.setQueryData(['thread', id], (old: Thread) => ({
        ...old,
        likes_count: data.likes_count,
        is_liked: data.is_liked,
      }));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => threadService.delete(id || ''),
    onSuccess: () => {
      navigate('/');
    },
    onError: (error: any) => {
      alert(error.message || 'Failed to delete thread');
    },
  });

  // --- Comment submit ---

  const commentMutation = useMutation({
    mutationFn: (body: string) => commentService.create(id || '', { body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thread', id] });
    },
    onError: (error: any) => {
      alert(error.message || 'Failed to post answer');
    },
  });

  const replyMutation = useMutation({
    mutationFn: ({ parentId, body }: { parentId: string, body: string }) => 
      commentService.create(id || '', { body, parent_id: parentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thread', id] });
    },
    onError: (error: any) => {
      alert(error.message || 'Failed to post reply');
    },
  });

  // --- Comment handlers ---

  const startEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditingBody(comment.body);
  };

  const cancelEditComment = () => {
    setEditingCommentId(null);
    setEditingBody('');
  };

  const updateCommentMutation = useMutation({
    mutationFn: ({ commentId, body }: { commentId: string, body: string }) => 
      commentService.update(commentId, { body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thread', id] });
      cancelEditComment();
    },
    onError: (error: any) => {
      alert(error.message || 'Failed to update comment');
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => commentService.delete(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thread', id] });
    },
    onError: (error: any) => {
      alert(error.message || 'Failed to delete comment');
    },
  });

  return {
    id,
    currentUser,
    thread: thread || null,
    comments,
    isLoading,
    isSubmitting: commentMutation.isPending,
    isBookmarked,
    canModerate,
    isOwner,
    // edit state
    editingCommentId,
    editingBody,
    setEditingBody,
    // handlers
    handleBookmark: () => bookmarkMutation.mutate(),
    handleVote: (type: 'up' | 'down') => voteMutation.mutate(type),
    handleLike: () => likeMutation.mutate(),
    handleDelete: () => deleteMutation.mutate(),
    handleCommentSubmit: (body: string) => commentMutation.mutate(body),
    handleReplySubmit: (parentId: string, body: string) => replyMutation.mutate({ parentId, body }),
    handleCommentVote: (_commentId: string, _type: 'up' | 'down') => {
      // Logic for comment vote remains similar but can be mutation-wrapped too
    },
    startEditComment,
    cancelEditComment,
    handleCommentUpdate: (commentId: string) => updateCommentMutation.mutate({ commentId, body: editingBody }),
    handleCommentDelete: (commentId: string) => {
      if (confirm('Yakin mau hapus jawaban ini?')) {
        deleteCommentMutation.mutate(commentId);
      }
    },
  };
};
