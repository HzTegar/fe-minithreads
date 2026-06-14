import React, { useState } from "react";
import { Link } from "react-router-dom"; // 👈 TAMBAHAN IMPORT LINK
import type { Comment, CommentEditHistory } from "../types/comment.type";
import { useAuth } from "../hooks/useAuth";
import { CommentForm } from "./CommentForm";
import { ReportModal } from "./common/ReportModal";
import { UserAvatar } from "./common/UserAvatar";
import {
  HiChevronUp,
  HiChevronDown,
  HiFlag,
  HiPencilAlt,
  HiTrash, 
  HiCheckCircle,
  HiReply,
} from "react-icons/hi";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { commentService } from "@/services/commentService";
import { Skeleton } from "@/components/ui/skeleton";

// ==========================================
// SUB-KOMPONEN: MODAL RIWAYAT (TEMA GELAP)
// ==========================================
interface CommentHistoryModalProps {
  commentId: string;
}

const CommentHistoryModal = ({ commentId }: CommentHistoryModalProps) => {
  const [histories, setHistories] = useState<CommentEditHistory[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const result = await commentService.getHistory(commentId);
      const historyData = result;
      setHistories(Array.isArray(historyData) ? historyData : []);
    } catch (err) {
      console.error("Gagal mengambil riwayat:", err);
    } finally {
      setLoading(false);
    }
  };

  const sortedHistories = [...histories].sort(
    (a, b) => b.edit_number - a.edit_number,
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          onClick={fetchHistory}
          variant="outline"
          size="sm"
          className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-3.5 h-3.5 text-slate-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          Lihat Riwayat Edit
        </Button>
      </DialogTrigger>

      {/* BERUBAH: Ditambahkan bg-slate-950 text-white border-slate-800 */}
      <DialogContent className="w-[95vw] md:w-[90vw] max-w-7xl max-h-[90vh] overflow-y-auto p-6 bg-slate-950 text-white border-slate-800">
        <DialogHeader className="border-b border-slate-800 pb-3">
          <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-[#0a95ff]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            Riwayat Perubahan Komentar
          </DialogTitle>
          <DialogDescription className="sr-only">
            Melihat riwayat perubahan teks komentar dari waktu ke waktu.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-5">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900">
                  <div className="bg-black px-4 py-2.5 flex justify-between items-center border-b border-zinc-800">
                    <Skeleton className="h-4 w-24 bg-zinc-700" />
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-32 bg-zinc-700" />
                      <Skeleton className="h-4 w-36 bg-zinc-700" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-zinc-950">
                    <Skeleton className="h-20 rounded-lg bg-zinc-800" />
                    <Skeleton className="h-20 rounded-lg bg-zinc-800" />
                  </div>
                </div>
              ))}
            </div>
          ) : histories.length === 0 ? (
            <div className="text-center py-12 bg-zinc-900 rounded-2xl border border-dashed border-zinc-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-10 h-10 mx-auto text-slate-500 mb-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <p className="font-medium text-slate-300">
                Belum ada riwayat perubahan
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Komentar ini belum pernah diedit sebelumnya.
              </p>
            </div>
          ) : (
            sortedHistories.map((history: CommentEditHistory) => {
              const formattedDate = new Date(history.created_at).toLocaleString(
                "id-ID",
                {
                  dateStyle: "medium",
                  timeStyle: "short",
                },
              );

              return (
                <div
                  key={history.id}
                  className="border border-zinc-800 rounded-xl overflow-hidden shadow-sm bg-zinc-900 w-full"
                >
                  {/* Header Item Riwayat */}
                  <div className="bg-black px-4 py-2.5 flex flex-wrap justify-between items-center gap-3 border-b border-zinc-800 text-xs text-slate-400">
                    <span className="font-bold text-white bg-zinc-800 px-2.5 py-1 rounded-md shadow-sm">
                      Edit ke-{history.edit_number}
                    </span>

                    <div className="flex flex-wrap items-center gap-4">
                      <span className="bg-zinc-800/60 px-2.5 py-1 rounded-md border border-zinc-700 flex items-center gap-1 text-slate-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-3.5 h-3.5 text-slate-400"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                          />
                        </svg>
                        Editor User ID:{" "}
                        <strong className="text-white ml-0.5">
                          {history.user_id}
                        </strong>
                      </span>
                      <span className="bg-zinc-800/60 px-2.5 py-1 rounded-md border border-zinc-700 flex items-center gap-1 text-slate-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-3.5 h-3.5 text-slate-400"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                        Waktu Perubahan:{" "}
                        <strong className="text-white ml-0.5">
                          {formattedDate}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Konten Perbandingan (Sebelum vs Sesudah) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-zinc-950 w-full">
                    {/* SEBELUMNYA */}
                    <div className="bg-red-950/30 p-4 rounded-lg border border-red-900/50 min-w-0 w-full">
                      <span className="text-[10px] font-extrabold text-red-400 tracking-wider bg-red-900/40 px-2 py-0.5 rounded mb-3 inline-block">
                        SEBELUMNYA
                      </span>
                      <p className="text-sm text-slate-200 whitespace-pre-wrap break-all leading-relaxed pt-1">
                        {history.old_content}
                      </p>
                    </div>

                    {/* SESUDAHNYA */}
                    <div className="bg-green-950/30 p-4 rounded-lg border border-green-900/50 min-w-0 w-full">
                      <span className="text-[10px] font-extrabold text-green-400 tracking-wider bg-green-900/40 px-2 py-0.5 rounded mb-3 inline-block">
                        SESUDAHNYA
                      </span>
                      <p className="text-sm text-slate-200 whitespace-pre-wrap break-all leading-relaxed pt-1">
                        {history.new_content}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ==========================================
// KOMPONEN UTAMA: COMMENT ITEM
// ==========================================
interface CommentItemProps {
  comment: Comment;
  activeEditId: string | null;
  editingBody: string;
  onEditBodyChange: (val: string) => void;
  onVote: (id: string, type: "up" | "down") => void;
  onEdit: (comment: Comment) => void;
  onEditSave: (id: string) => void;
  onEditCancel: () => void;
  onDelete: (id: string) => void;
  onReply: (parentId: string, body: string) => void;
  onAccept?: (commentId: string) => void;
  isThreadOwner?: boolean;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  activeEditId,
  editingBody,
  onEditBodyChange,
  onVote,
  onEdit,
  onEditSave,
  onEditCancel,
  onDelete, 
  onReply,
  onAccept,
  isThreadOwner,
}) => {
  const { user: currentUser } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isAcceptLoading, setIsAcceptLoading] = useState(false);

  const isEditing = activeEditId === comment.id;

  const canModerate =
    currentUser?.level === "admin" || currentUser?.level === "moderator";
    
  const isAdmin = currentUser?.level === "admin";
    
  const isOwner = currentUser?.id 
    ? String(currentUser.id) === String(comment.user_id) 
    : false;

  const handleReplySubmit = (body: string) => {
    onReply(comment.id, body);
    setShowReplyForm(false);
  };

  return (
    <div className="flex gap-4 py-4 border-b border-border">
      <div className="flex flex-col items-center w-12 pt-1">
        <button
          onClick={() => onVote(comment.id, "up")}
          className="text-muted-foreground hover:text-primary transition-colors text-3xl cursor-pointer"
        >
          <HiChevronUp />
        </button>
        <span className="text-lg font-bold text-foreground my-1">
          {comment.vote_score ?? 0}
        </span>
        <button
          onClick={() => onVote(comment.id, "down")}
          className="text-muted-foreground hover:text-primary transition-colors text-3xl cursor-pointer"
        >
          <HiChevronDown />
        </button>
        {isThreadOwner ? (
          <button
            onClick={() => {
              if (isAcceptLoading) return;
              setIsAcceptLoading(true);
              Promise.resolve(onAccept?.(comment.id)).finally(() => setIsAcceptLoading(false));
            }}
            disabled={isAcceptLoading}
            className={`mt-2 text-3xl transition-colors ${
              isAcceptLoading
                ? "text-muted-foreground animate-pulse cursor-not-allowed"
                : "cursor-pointer " + (comment.is_accepted
                    ? "text-emerald-500"
                    : "text-muted-foreground hover:text-emerald-400")
            }`}
            title={comment.is_accepted ? "Cabut jawaban terbaik" : "Tandai sebagai jawaban terbaik"}
          >
            <HiCheckCircle />
          </button>
        ) : comment.is_accepted ? (
          <div className="text-emerald-500 mt-2 text-3xl">
            <HiCheckCircle />
          </div>
        ) : null}
      </div>

      <div className="flex-1 min-w-0">
        {comment.user && (
          <Link 
            to={`/users/${comment.user.username}`}
            className="flex items-center gap-2 mb-2 w-fit hover:opacity-80 transition-opacity cursor-pointer group"
          >
            <UserAvatar
              username={comment.user.username}
              avatarUrl={comment.user.avatar_url}
              size={28}
            />
            <span className="text-sm font-semibold text-foreground group-hover:text-primary group-hover:underline transition-colors">
              {comment.user.username}
            </span>
          </Link>
        )}

        {isEditing ? (
          <div className="mb-4">
            <textarea
              value={editingBody}
              onChange={(e) => onEditBodyChange(e.target.value)}
              className="w-full bg-card border border-border text-foreground p-3 rounded-xl text-sm resize-y min-h-25 outline-none focus:border-primary transition-colors"
              autoFocus
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => onEditSave(comment.id)}
                className="bg-inverted-bg hover:bg-inverted-hover text-inverted font-semibold px-4 py-1.5 rounded-full text-xs transition-colors cursor-pointer"
              >
                Save
              </button>
              <button
                onClick={onEditCancel}
                className="text-muted-foreground hover:text-foreground px-4 py-1.5 rounded-full text-xs border border-border hover:bg-accent transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <div className="text-[0.925rem] leading-relaxed text-foreground whitespace-pre-wrap break-all">
              {comment.body}
            </div>
            {(comment.edit_count ?? 0) > 0 && (
              <p className="text-[10px] text-muted-foreground italic mt-1">Edited</p>
            )}
          </div>
        )}

        <div className="flex justify-between items-center flex-wrap gap-2">
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {currentUser && !isEditing && (
              <button
                onClick={() => setShowReplyForm((v) => !v)}
                className="hover:text-primary flex items-center gap-1 cursor-pointer transition-colors"
              >
                <HiReply className="w-3.5 h-3.5" />{" "}
                {showReplyForm ? "Cancel Reply" : "Reply"}
              </button>
            )}
            
            {currentUser && !isOwner && !isEditing && (
              <button 
                onClick={() => setIsReportOpen(true)}
                className="hover:text-primary flex items-center gap-1 cursor-pointer transition-colors"
              >
                <HiFlag className="w-3.5 h-3.5" />
                Report
              </button>
            )}

            {isOwner && !isEditing && (comment.edit_count ?? 0) < 1 && (
              <button
                onClick={() => onEdit(comment)}
                className="hover:text-primary flex items-center gap-1 text-primary font-medium cursor-pointer transition-colors"
              >
                <HiPencilAlt className="w-3.5 h-3.5" /> Edit
              </button>
            )}

            {isAdmin && !isEditing && (
              <button
                onClick={() => onDelete(comment.id)}
                className="hover:text-red-400 flex items-center gap-1 text-red-500 font-medium cursor-pointer transition-colors"
              >
                <HiTrash className="w-3.5 h-3.5" /> Delete
              </button>
            )}

            {canModerate && !isEditing && (
              <CommentHistoryModal commentId={comment.id} />
            )}
          </div>
        </div>

        {showReplyForm && (
          <div className="mt-4 pl-4 border-l-2 border-border">
            <CommentForm onSubmit={handleReplySubmit} />
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 pl-4 border-l-2 border-border space-y-2">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                activeEditId={activeEditId}
                editingBody={editingBody}
                onEditBodyChange={onEditBodyChange}
                onVote={onVote}
                onEdit={onEdit}
                onEditSave={onEditSave}
                onEditCancel={onEditCancel}
                onDelete={onDelete}
                onReply={onReply}
              />
            ))}
          </div>
        )}

        <ReportModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          targetId={comment.id}
          targetType="comment"
          targetTitle={
            comment.body.substring(0, 60) +
            (comment.body.length > 60 ? "..." : "")
          }
        />
      </div>
    </div>
  );
};