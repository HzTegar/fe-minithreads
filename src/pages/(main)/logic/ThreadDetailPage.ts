import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { threadService } from "../../../services/threadService";
import { commentService } from "../../../services/commentService";
import { bookmarkService } from "../../../services/bookmarkService";
import { useAuth } from "../../../hooks/useAuth";
import type { Thread } from "../../../types/thread.type";
import type { Comment } from "../../../types/comment.type";

export const useThreadDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [thread, setThread] = useState<Thread | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingBody, setEditingBody] = useState("");

  const canModerate =
    currentUser?.level === "admin" || currentUser?.level === "moderator";
  
  const isOwner = (authorId: string) => currentUser?.id === authorId;

  const isLimitReached = useMemo(() => {
    if (!thread) return false;
    return (thread.edit_count ?? 0) >= 3;
  }, [thread]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const threadData = await threadService.getById(id);
        setThread(threadData);
        
        const rawComments: Comment[] = threadData.comments || [];
        setComments(rawComments.filter((c) => !c.parent_id));
        setIsBookmarked(false);
      } catch (error) {
        console.error("Failed to fetch thread detail:", error);
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
      console.error(error);
    }
  };

  const handleVote = async (type: "up" | "down") => {
    if (!id || !thread) return;
    try {
      const response = await threadService.vote(id, type);
      setThread({ ...thread, vote_score: response.vote_score });
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleLike = async () => {
    if (!id || !thread) return;
    try {
      const response = await threadService.like(id);
      setThread({
        ...thread,
        likes_count: response.likes_count,
        is_liked: response.is_liked,
      });
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!id || !thread) return;
    if (!confirm("Yakin mau hapus thread ini?")) return;
    try {
      await threadService.delete(id);
      navigate("/");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleCommentSubmit = async (body: string) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      const newComment = await commentService.create(id, { body });
      setComments((prev) => [...prev, newComment]);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplySubmit = async (parentId: string, body: string) => {
    if (!id) return;
    try {
      const newReply = await commentService.create(id, {
        body,
        parent_id: parentId,
      });
      
      // Update replies secara rekursif
      const addReplyToTree = (items: Comment[]): Comment[] => {
        return items.map((c) => {
          if (c.id === parentId) {
            return { ...c, replies: [...(c.replies || []), newReply] };
          }
          if (c.replies && c.replies.length > 0) {
            return { ...c, replies: addReplyToTree(c.replies) };
          }
          return c;
        });
      };

      setComments((prev) => addReplyToTree(prev));
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleCommentVote = async (commentId: string, type: "up" | "down") => {
    try {
      const response = await commentService.vote(commentId, type);
      const updateVoteTree = (items: Comment[]): Comment[] => {
        return items.map((c) => {
          if (c.id === commentId) return { ...c, vote_score: response.vote_score };
          if (c.replies && c.replies.length > 0) return { ...c, replies: updateVoteTree(c.replies) };
          return c;
        });
      };
      setComments((prev) => updateVoteTree(prev));
    } catch (error: any) {
      alert(error.message);
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

  // --- REKURSIF UPDATE ---
  const handleCommentUpdate = async (commentId: string) => {
    if (!editingBody.trim()) return;
    try {
      const updated = await commentService.update(commentId, { body: editingBody });
      
      const updateTree = (items: Comment[]): Comment[] => {
        return items.map((c) => {
          if (c.id === commentId) {
            return { ...c, body: updated.body, edit_count: updated.edit_count };
          }
          if (c.replies && c.replies.length > 0) {
            return { ...c, replies: updateTree(c.replies) };
          }
          return c;
        });
      };

      setComments((prev) => updateTree(prev));
      cancelEditComment();
    } catch (error: any) {
      alert(error.message);
    }
  };

  // --- REKURSIF DELETE ---
  const handleCommentDelete = async (commentId: string) => {
    if (!confirm("Yakin mau hapus jawaban ini?")) return;
    try {
      await commentService.delete(commentId);
      
      const deleteFromTree = (items: Comment[]): Comment[] => {
        return items
          .filter((c) => c.id !== commentId)
          .map((c) => ({
            ...c,
            replies: c.replies ? deleteFromTree(c.replies) : []
          }));
      };

      setComments((prev) => deleteFromTree(prev));
    } catch (error: any) {
      alert(error.message);
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
    isLimitReached,
    editingCommentId,
    editingBody,
    setEditingBody,
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