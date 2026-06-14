import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { threadService } from "../../../services/threadService";
import { commentService } from "../../../services/commentService";
import { bookmarkService } from "../../../services/bookmarkService";
import { useAuth } from "../../../hooks/useAuth";

import type { Comment } from "../../../types/comment.type";

export const useThreadDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingBody, setEditingBody] = useState("");
  const [isArchiving, setIsArchiving] = useState(false);

  const canModerate =
    currentUser?.level === "admin" || currentUser?.level === "moderator";
  const isOwner = (authorId: string) => currentUser?.id === authorId;

  // Fetch thread detail with React Query
  const { data: thread, isLoading } = useQuery({
    queryKey: ["thread", id],
    queryFn: () => threadService.getById(id || ""),
    enabled: !!id,
  });

  const comments: Comment[] = (thread?.comments || []).filter(
    (c: Comment) => !c.parent_id,
  );

  const isClosed = thread?.status === 'closed';

  const isLimitReached = useMemo(() => {
    if (!thread) return false;
    return (thread.edit_count ?? 0) >= 3;
  }, [thread]);

  // --- Thread handlers ---

  const handleBookmark = async () => {
    if (!id) return;
    try {
      const response = await bookmarkService.toggle(id);
      setIsBookmarked(response.is_bookmarked);
    } catch (error) {
      console.error(error);
    }
  };

  const handleVote = async (type: "up" | "down") => {
    if (!id || !thread) return;
    try {
      await threadService.vote(id, type);
      queryClient.invalidateQueries({ queryKey: ["thread", id] });
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Failed to vote");
    }
  };

  const handleLike = async () => {
    if (!id || !thread) return;
    try {
      await threadService.like(id);
      queryClient.invalidateQueries({ queryKey: ["thread", id] });
    } catch (error: unknown) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!id || !thread) return;
    if (!confirm("Yakin mau hapus thread ini?")) return;
    try {
      await threadService.delete(id);
      navigate("/");
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Failed to delete thread");
    }
  };

  const handleToggleArchive = async () => {
    if (!id) return;
    setIsArchiving(true);
    try {
      await threadService.toggleArchive(id);
      queryClient.invalidateQueries({ queryKey: ["thread", id] });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Gagal mengarsipkan thread";
      alert(message);
    } finally {
      setIsArchiving(false);
    }
  };

  // --- Comment handlers ---

  const handleCommentSubmit = async (body: string) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await commentService.create(id, { body });
      queryClient.invalidateQueries({ queryKey: ["thread", id] });
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Failed to post answer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplySubmit = async (parentId: string, body: string) => {
    if (!id) return;
    try {
      await commentService.create(id, {
        body,
        parent_id: parentId,
      });
      queryClient.invalidateQueries({ queryKey: ["thread", id] });
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Failed to post reply");
    }
  };

  const handleCommentVote = async (commentId: string, type: "up" | "down") => {
    try {
      await commentService.vote(commentId, type);
      queryClient.invalidateQueries({ queryKey: ["thread", id] });
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Failed to vote on comment");
    }
  };

  const startEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditingBody(comment.body);
  };

  const cancelEditComment = () => {
    setEditingCommentId(null);
    setEditingBody("");
  };

  const handleCommentUpdate = async (commentId: string) => {
    if (!editingBody.trim()) return;
    try {
      await commentService.update(commentId, { body: editingBody });
      cancelEditComment();
      queryClient.invalidateQueries({ queryKey: ["thread", id] });
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Failed to update comment");
    }
  };

  const handleCommentDelete = async (commentId: string) => {
    if (!confirm("Yakin mau hapus jawaban ini?")) return;
    try {
      await commentService.delete(commentId);
      queryClient.invalidateQueries({ queryKey: ["thread", id] });
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Failed to delete comment");
    }
  };

  const handleToggleAccept = async (commentId: string) => {
    if (!id) return;
    try {
      await commentService.toggleAccept(id, commentId);
      queryClient.invalidateQueries({ queryKey: ["thread", id] });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Gagal mengubah jawaban terbaik";
      console.error('Toggle accept error:', error);
      alert(message);
    }
  };

  return {
    id,
    currentUser,
    thread: thread || null,
    comments,
    isLoading,
    isSubmitting,
    isBookmarked,
    canModerate,
    isOwner,
    isLimitReached,
    isClosed,
    isArchiving,
    editingCommentId,
    editingBody,
    setEditingBody,
    handleBookmark,
    handleVote,
    handleLike,
    handleDelete,
    handleToggleArchive,
    handleCommentSubmit,
    handleReplySubmit,
    handleCommentVote,
    startEditComment,
    cancelEditComment,
    handleCommentUpdate,
    handleCommentDelete,
    handleToggleAccept,
  };
};
