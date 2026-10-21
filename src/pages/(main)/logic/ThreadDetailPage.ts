import { useState, useMemo, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { threadService } from "../../../services/threadService";
import { commentService } from "../../../services/commentService";
import { bookmarkService } from "../../../services/bookmarkService";
import { useAuth } from "../../../hooks/useAuth";

import type { Comment } from "../../../types/comment.type";
import type { Thread } from "../../../types/thread.type";

/**
 * Key-prefix cache list thread yang dipakai halaman lain.
 * Kalau user like/bookmark di halaman detail, list di home/profil ikut
 * di-patch seketika supaya angkanya ga meleset saat user balik ke list.
 */
const THREAD_LIST_KEYS = [
  ["threads"],
  ["my-threads"],
  ["user-threads"],
  ["liked-threads"],
  ["home-search"],
];

/**
 * Patch satu thread di dalam payload list (bisa berupa array polos
 * atau object `{ data: { data: [...] } }` hasil pagination Laravel).
 */
const patchThreadInList = (
  old: unknown,
  postId: string,
  patch: Partial<Thread>
): unknown => {
  if (!old) return old;

  // Bentuk: Thread[]
  if (Array.isArray(old)) {
    if (!old.some((t) => t?.id === postId)) return old;
    return old.map((t) => (t?.id === postId ? { ...t, ...patch } : t));
  }

  // Bentuk: { data: Thread[] } atau { data: { data: Thread[] } }
  const obj = old as { data?: Thread[] | { data?: Thread[] } };
  const arr = Array.isArray(obj.data) ? obj.data : obj.data?.data;
  if (!Array.isArray(arr)) return old;
  if (!arr.some((t) => t?.id === postId)) return old;

  const nextArr = arr.map((t) => (t?.id === postId ? { ...t, ...patch } : t));

  if (Array.isArray(obj.data)) return { ...obj, data: nextArr };
  return { ...obj, data: { ...(obj.data as object), data: nextArr } };
};

export const useThreadDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBookmarkPending, setIsBookmarkPending] = useState(false);
  const [isLikePending, setIsLikePending] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingBody, setEditingBody] = useState("");
  const [isArchiving, setIsArchiving] = useState(false);

  // Vote yang SEDANG dipunyai user (dipakai buat hitung delta optimistic)
  const myVotes = useRef<Record<string, "up" | "down">>({});

  const canModerate =
    currentUser?.level === "admin" || currentUser?.level === "moderator";
  const isOwner = (authorId: string) => currentUser?.id === authorId;

  // Fetch thread detail with React Query
  const { data: thread, isLoading } = useQuery({
    queryKey: ["thread", id],
    queryFn: () => threadService.getById(id || ""),
    enabled: !!id,
    // Optimistic update (like/bookmark/komentar) menulis ke cache ini.
    // staleTime + refetchOnWindowFocus dipakai biar refetch background
    // tidak menimpa nilai optimistic sebelum server sempat merespons.
    staleTime: 10_000,
    refetchOnWindowFocus: false,
  });

  const comments: Comment[] = (thread?.comments || []).filter(
    (c: Comment) => !c.parent_id,
  );

  const isClosed = thread?.status === 'closed';

  const isLimitReached = useMemo(() => {
    if (!thread) return false;
    return (thread.edit_count ?? 0) >= 3;
  }, [thread]);

  /**
   * Update data thread di cache TANPA nunggu server (optimistic update).
   * Dipakai untuk like, bookmark, vote, dan Accept Answer.
   */
  const patchThread = useCallback(
    (patch: Partial<Thread>) => {
      if (!id) return;

      queryClient.setQueryData(["thread", id], (old: Thread | undefined) =>
        old ? { ...old, ...patch } : old,
      );

      // Samakan juga list thread di halaman lain (home/profil/liked)
      THREAD_LIST_KEYS.forEach((prefix) => {
        queryClient.setQueriesData(
          { queryKey: prefix },
          (old: unknown) => patchThreadInList(old, id, patch),
        );
      });
    },
    [queryClient, id],
  );

  /**
   * Update daftar komentar di cache (optimistic).
   *  - append  : tambah komentar baru (top-level atau balasan)
   *  - replace : ganti isi komentar lama
   *  - remove  : hapus komentar
   */
  const patchComments = useCallback(
    (
      mode: "append" | "replace" | "remove",
      payload: Partial<Comment> & { id: string },
      parentId?: string | null,
    ) => {
      if (!id) return;

      queryClient.setQueryData(["thread", id], (old: Thread | undefined) => {
        if (!old) return old;

        const list: Comment[] = Array.isArray(old.comments)
          ? [...old.comments]
          : [];

        if (mode === "append") {
          const newComment = payload as Comment;

          // Balasan -> sisipkan ke array replies milik komentar induknya
          if (parentId) {
            const parentIdx = list.findIndex((c) => c.id === parentId);
            if (parentIdx >= 0) {
              const parent = list[parentIdx];
              list[parentIdx] = {
                ...parent,
                replies: [...(parent.replies || []), newComment],
              };
            }
            return {
              ...old,
              comments: list,
              comments_count: (old.comments_count || 0) + 1,
            };
          }

          // Komentar utama -> taruh paling atas biar langsung kelihatan
          list.unshift(newComment);
          return {
            ...old,
            comments: list,
            comments_count: (old.comments_count || 0) + 1,
          };
        }

        if (mode === "replace") {
          const idx = list.findIndex((c) => c.id === payload.id);
          if (idx >= 0) list[idx] = { ...list[idx], ...payload };

          // Balasan bisa tersimpan di level `replies`
          for (let i = 0; i < list.length; i++) {
            if (list[i].replies?.some((r) => r.id === payload.id)) {
              list[i] = {
                ...list[i],
                replies: list[i].replies!.map((r) =>
                  r.id === payload.id ? { ...r, ...payload } : r,
                ),
              };
            }
          }
          return { ...old, comments: list };
        }

        // mode === "remove"
        const next = list
          .filter((c) => c.id !== payload.id)
          .map((c) => ({
            ...c,
            replies: c.replies?.filter((r) => r.id !== payload.id),
          }));
        return {
          ...old,
          comments: next,
          comments_count: Math.max(0, (old.comments_count || 0) - 1),
        };
      });
    },
    [queryClient, id],
  );

  /**
   * Status bookmark dibaca LANGSUNG dari cache query (`thread.is_bookmarked`),
   * jadi nilainya selalu sinkron dengan server + optimistic update.
   * Dulu `isBookmarked` cuma state lokal yg SELALU false, jadi user
   * ga pernah liat icon bookmark-nya terisi walau udah di-bookmark.
   */
  const isBookmarked = thread?.is_bookmarked ?? false;

  // --- Thread handlers ---

  const handleBookmark = async () => {
    if (!id || isBookmarkPending) return;

    const prev = isBookmarked;
    const next = !prev;

    setIsBookmarkPending(true);
    // Optimistic: icon berubah seketika, ga nunggu round-trip
    patchThread({ is_bookmarked: next });

    try {
      const response = await bookmarkService.toggle(id);
      const serverValue =
        typeof response?.is_bookmarked === "boolean"
          ? response.is_bookmarked
          : next;
      patchThread({ is_bookmarked: serverValue });

      // Daftar bookmark di halaman profil/sidebar harus ikut berubah
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    } catch (error) {
      // Rollback kalau request gagal
      patchThread({ is_bookmarked: prev });
      console.error(error);
    } finally {
      setIsBookmarkPending(false);
    }
  };

  const handleVote = async (type: "up" | "down") => {
    if (!id || !thread) return;

    const voteKey = `post:${id}`;
    const current = myVotes.current[voteKey];
    const currentScore = thread.vote_score || 0;

    // Hitung delta: baru / ganti / batal
    let delta: number;
    if (!current) delta = type === "up" ? 1 : -1;
    else if (current === type) delta = type === "up" ? -1 : 1;
    else delta = type === "up" ? 2 : -2;

    const nextVote = current === type ? undefined : type;

    if (nextVote) myVotes.current[voteKey] = nextVote;
    else delete myVotes.current[voteKey];

    patchThread({ vote_score: currentScore + delta });

    try {
      const res = await threadService.vote(id, type);
      if (typeof res?.vote_score === "number") {
        patchThread({ vote_score: res.vote_score });
      }
    } catch (error: unknown) {
      // Rollback
      if (current) myVotes.current[voteKey] = current;
      else delete myVotes.current[voteKey];
      patchThread({ vote_score: currentScore });
      alert(error instanceof Error ? error.message : "Failed to vote");
    }
  };

  const handleLike = async () => {
    if (!id || !thread || isLikePending) return;

    const prevLiked = !!thread.is_liked;
    const prevCount = thread.likes_count || 0;
    const nextLiked = !prevLiked;
    const nextCount = Math.max(0, prevCount + (nextLiked ? 1 : -1));

    setIsLikePending(true);
    // Optimistic: jumlah like + ikon hati berubah seketika
    patchThread({ is_liked: nextLiked, likes_count: nextCount });

    try {
      const res = await threadService.like(id);
      patchThread({
        is_liked:
          typeof res?.is_liked === "boolean" ? res.is_liked : nextLiked,
        likes_count:
          typeof res?.likes_count === "number" ? res.likes_count : nextCount,
      });
    } catch (error: unknown) {
      // Rollback kalau request gagal
      patchThread({ is_liked: prevLiked, likes_count: prevCount });
      console.error(error);
    } finally {
      setIsLikePending(false);
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

  const buildOptimisticComment = (
    body: string,
    parentId: string | null
  ): Comment => {
    const now = new Date().toISOString();
    const tempId = `optimistic-${parentId ? "reply" : "comment"}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;
    return {
      id: tempId,
      post_id: id ?? "",
      body,
      user_id: currentUser?.id ?? "",
      user: currentUser ?? undefined,
      parent_id: parentId,
      replies: [],
      is_accepted: false,
      vote_score: 0,
      likes_count: 0,
      edit_count: 0,
      created_at: now,
      updated_at: now,
    };
  };

  const handleCommentSubmit = async (body: string) => {
    if (!id) return;
    setIsSubmitting(true);

    const optimistic = buildOptimisticComment(body, null);

    // Optimistic: komentar LANGSIH nongol tanpa nunggu server
    patchComments("append", optimistic, null);

    try {
      const created = await commentService.create(id, { body });
      // Ganti yang sementara dengan data asli dari server
      patchComments("remove", { id: optimistic.id });
      patchComments("append", { ...optimistic, ...created, id: created.id }, null);
    } catch (error: unknown) {
      // Rollback: hapus komentar yg gagal dikirim
      patchComments("remove", optimistic);
      alert(error instanceof Error ? error.message : "Failed to post answer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplySubmit = async (parentId: string, body: string) => {
    if (!id) return;

    const optimistic = buildOptimisticComment(body, parentId);

    // Optimistic: balasan langsung nongol di bawah komentar induknya
    patchComments("append", optimistic, parentId);

    try {
      const created = await commentService.create(id, {
        body,
        parent_id: parentId,
      });
      patchComments("remove", optimistic, parentId);
      patchComments(
        "append",
        { ...optimistic, ...created, id: created.id },
        parentId
      );
    } catch (error: unknown) {
      patchComments("remove", optimistic, parentId);
      alert(error instanceof Error ? error.message : "Failed to post reply");
    }
  };

  const handleCommentVote = async (commentId: string, type: "up" | "down") => {
    const voteKey = `comment:${commentId}`;
    const current = myVotes.current[voteKey];

    let delta: number;
    if (!current) delta = type === "up" ? 1 : -1;
    else if (current === type) delta = type === "up" ? -1 : 1;
    else delta = type === "up" ? 2 : -2;

    const nextVote = current === type ? undefined : type;
    if (nextVote) myVotes.current[voteKey] = nextVote;
    else delete myVotes.current[voteKey];

    // Optimistic: skor vote komentar langsung berubah
    queryClient.setQueryData(["thread", id], (old: Thread | undefined) => {
      if (!old) return old;
      const list = (old.comments || []).map((c) => {
        if (c.id === commentId) {
          return { ...c, vote_score: (c.vote_score || 0) + delta };
        }
        if (c.replies?.some((r) => r.id === commentId)) {
          return {
            ...c,
            replies: c.replies.map((r) =>
              r.id === commentId
                ? { ...r, vote_score: (r.vote_score || 0) + delta }
                : r,
            ),
          };
        }
        return c;
      });
      return { ...old, comments: list };
    });

    try {
      const res = await commentService.vote(commentId, type);
      if (typeof res?.vote_score === "number") {
        queryClient.setQueryData(["thread", id], (old: Thread | undefined) => {
          if (!old) return old;
          const list = (old.comments || []).map((c) => {
            if (c.id === commentId) {
              return { ...c, vote_score: res.vote_score };
            }
            if (c.replies?.some((r) => r.id === commentId)) {
              return {
                ...c,
                replies: c.replies.map((r) =>
                  r.id === commentId ? { ...r, vote_score: res.vote_score } : r,
                ),
              };
            }
            return c;
          });
          return { ...old, comments: list };
        });
      }
    } catch (error: unknown) {
      if (current) myVotes.current[voteKey] = current;
      else delete myVotes.current[voteKey];
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

    const previousBody = thread?.comments
      ?.flatMap((c) => [c, ...(c.replies || [])])
      .find((c) => c.id === commentId)?.body;

    // Optimistic: isi komentar langsung berubah
    patchComments("replace", { id: commentId, body: editingBody });

    try {
      await commentService.update(commentId, { body: editingBody });
      cancelEditComment();
    } catch (error: unknown) {
      // Rollback isi komentar
      if (previousBody !== undefined) {
        patchComments("replace", { id: commentId, body: previousBody });
      }
      alert(error instanceof Error ? error.message : "Failed to update comment");
    }
  };

  const handleCommentDelete = async (commentId: string) => {
    if (!confirm("Yakin mau hapus jawaban ini?")) return;

    // Optimistic: komentar langsung hilang dari list
    patchComments("remove", { id: commentId });

    try {
      await commentService.delete(commentId);
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Failed to delete comment");
      queryClient.invalidateQueries({ queryKey: ["thread", id] });
    }
  };

  const handleToggleAccept = async (commentId: string) => {
    if (!id) return;

    const target = thread?.comments?.find((c) => c.id === commentId);
    const wasAccepted = !!target?.is_accepted;

    // Optimistic: ikon centang hijau langsung muncul/hilang
    queryClient.setQueryData(["thread", id], (old: Thread | undefined) => {
      if (!old) return old;
      return {
        ...old,
        accepted_answer_id: wasAccepted ? null : commentId,
        comments: (old.comments || []).map((c) =>
          c.id === commentId
            ? { ...c, is_accepted: !wasAccepted }
            : { ...c, is_accepted: false },
        ),
      };
    });

    try {
      await commentService.toggleAccept(id, commentId);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Gagal mengubah jawaban terbaik";
      console.error('Toggle accept error:', error);
      alert(message);
      queryClient.invalidateQueries({ queryKey: ["thread", id] });
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
    isBookmarkPending,
    isLikePending,
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
