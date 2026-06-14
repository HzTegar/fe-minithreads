import React, { useState } from "react";
import { Navbar } from "../../../components/Navbar";
import { CommentItem } from "../../../components/CommentItem";
import { CommentForm } from "../../../components/CommentForm";
import { formatTimeAgo } from "../../../utils/formatDate";
import { RoleBadge } from "../../../components/common/RoleBadge";
import { UserLink } from "../../../components/common/UserLink";
import { useThreadDetailPage } from "../logic/ThreadDetailPage";
import { ReportModal } from "../../../components/common/ReportModal";
import { UserAvatar } from "../../../components/common/UserAvatar";
import { Footer } from "../../../components/Footer";
import {
  HiChevronUp,
  HiChevronDown,
  HiHeart,
  HiOutlineHeart,
  HiBookmark,
  HiOutlineBookmark,
  HiFlag,
  HiPencilAlt,
  HiTrash,
  HiLockClosed,
} from "react-icons/hi";
import { Skeleton } from "../../../components/ui/skeleton";
import { ThreadHistoryModal } from "@/components/ThreadsHistoryModal";

export const ThreadDetailPage: React.FC = () => {
  const {
    thread,
    comments,
    isLoading,
    isSubmitting,
    isBookmarked,
    canModerate,
    isOwner,
    isLimitReached,
    isClosed,
    isArchiving,
    currentUser,
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
  } = useThreadDetailPage();

  const [isReportOpen, setIsReportOpen] = useState(false);

  if (isLoading)
    return (
      <div className="bg-background min-h-screen text-foreground">
        <Navbar />
        <main className="max-w-[900px] mx-auto py-8 px-4">
          {/* Thread skeleton */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex items-center gap-4 pt-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-8 w-8" />
              <div className="flex gap-4 ml-auto">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>

          {/* Comments skeleton */}
          <div className="mt-8 space-y-4">
            <Skeleton className="h-6 w-32" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3 py-4 border-b border-border">
                <div className="flex flex-col items-center gap-2 w-12">
                  <Skeleton className="h-6 w-6" />
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-6 w-6" />
                </div>
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );

  if (!thread)
    return (
      <div>
        <Navbar />
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          Thread not found.
        </div>
      </div>
    );

  return (
    <div className="bg-background min-h-screen text-foreground pb-12">
      <Navbar />
      <main className="max-w-[800px] mx-auto py-8 px-6">

        {/* ==============================
            HEADER (Judul + meta)
        ============================== */}
        <div className="border-b border-border pb-5 mb-6">
          <div className="flex justify-between items-start mb-3">
            <h1 className="text-2xl text-foreground font-bold leading-snug flex-1">
              {thread.title}
            </h1>
            {currentUser && (
              <a
                href="/create-thread"
                className="bg-inverted-bg hover:bg-inverted-hover text-inverted px-4 py-2 rounded-full text-xs font-semibold transition-colors no-underline shadow-sm ml-4"
              >
                Ask Question
              </a>
            )}
          </div>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span>
              Asked{" "}
              <span className="text-foreground">
                {formatTimeAgo(thread.created_at)}
              </span>
            </span>
            <span>
              Viewed{" "}
              <span className="text-foreground">
                {thread.view_count || 0} times
              </span>
            </span>
          </div>
        </div>

        {/* ==============================
            SECTION 1: THREAD / POST
        ============================== */}
        <div className="flex gap-6 mb-10">
          {/* Vote Sidebar Thread */}
          <div className="flex flex-col items-center w-12 pt-1 gap-2">
            <button
              onClick={() => handleVote("up")}
              className="text-muted-foreground hover:text-primary transition-colors text-4xl cursor-pointer"
            >
              <HiChevronUp />
            </button>
            <span className="text-lg font-bold text-foreground">
              {thread.vote_score || 0}
            </span>
            <button
              onClick={() => handleVote("down")}
              className="text-muted-foreground hover:text-primary transition-colors text-4xl cursor-pointer"
            >
              <HiChevronDown />
            </button>

            <button
              onClick={handleLike}
              className="mt-3 text-muted-foreground hover:text-red-500 flex flex-col items-center gap-1 transition-colors cursor-pointer"
            >
              <div className="text-2xl">
                {thread.is_liked ? (
                  <HiHeart className="text-red-500" />
                ) : (
                  <HiOutlineHeart />
                )}
              </div>
              <span className="text-xs font-bold">{thread.likes_count || 0}</span>
            </button>

            <button
              onClick={handleBookmark}
              className={`mt-2 hover:text-primary transition-colors text-2xl cursor-pointer ${
                isBookmarked ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {isBookmarked ? <HiBookmark /> : <HiOutlineBookmark />}
            </button>
          </div>

          {/* Thread Body Card */}
          <div className="flex-1 min-w-0 bg-card border border-border rounded-xl p-6 shadow-sm">
            {isClosed && (
              <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-amber-900/20 border border-amber-700/40 rounded-lg text-xs text-amber-300 font-medium">
                <HiLockClosed className="w-4 h-4" />
                Thread ini ditutup — tidak dapat menerima jawaban baru.
              </div>
            )}

            <div className="text-[0.95rem] leading-relaxed text-foreground mb-6 whitespace-pre-wrap break-words">
              {thread.body}
            </div>

            <div className="flex gap-2 mb-6 flex-wrap">
              {thread.tags?.map((tag) => (
                <span
                  key={tag.id}
                  className="px-2.5 py-0.5 rounded-full text-xs transition-colors"
                  style={{
                    backgroundColor: `${tag.color}1A`,
                    color: tag.color,
                    border: `1px solid ${tag.color}33`,
                  }}
                >
                  {tag.name}
                </span>
              ))}
            </div>

            {/* Thread Meta Row */}
            <div className="flex justify-between items-center flex-wrap gap-4 border-t border-border pt-5 mt-4">
              <div className="flex gap-4 items-center text-xs text-muted-foreground">
                {currentUser && !isOwner(thread.user_id) && (
                  <button
                    onClick={() => setIsReportOpen(true)}
                    className="hover:text-red-400 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <HiFlag className="w-3.5 h-3.5" />
                    Report
                  </button>
                )}

                {isOwner(thread.user_id) && !isLimitReached && (
                  <a
                    href={`/edit-thread/${thread.id}`}
                    className="hover:text-primary flex items-center gap-1 text-primary no-underline font-medium transition-colors"
                  >
                    <HiPencilAlt className="w-3.5 h-3.5" /> Edit
                  </a>
                )}

                {isOwner(thread.user_id) && isLimitReached && (
                  <span className="text-red-400 italic flex items-center gap-1">
                    Limit edit (3x) tercapai
                  </span>
                )}

                {isOwner(thread.user_id) && (
                  <button
                    onClick={handleToggleArchive}
                    disabled={isArchiving || (isClosed && !thread.can_reopen)}
                    className={`flex items-center gap-1 font-medium cursor-pointer transition-colors ${
                      isClosed
                        ? thread.can_reopen
                          ? "text-green-400 hover:text-green-300"
                          : "text-muted-foreground opacity-50 cursor-not-allowed"
                        : "text-amber-400 hover:text-amber-300"
                    }`}
                    title={
                      isClosed
                        ? thread.can_reopen
                          ? "Klik untuk membuka kembali thread"
                          : "Thread sudah ditutup permanen"
                        : "Arsipkan thread"
                    }
                  >
                    <HiLockClosed className="w-3.5 h-3.5" />
                    {isArchiving
                      ? "Loading..."
                      : isClosed
                        ? thread.can_reopen
                          ? "Reopen"
                          : "Closed"
                        : "Archive"}
                  </button>
                )}

                {(isOwner(thread.user_id) || canModerate) && (
                  <button
                    onClick={handleDelete}
                    className="hover:text-red-400 flex items-center gap-1 text-red-500 font-medium cursor-pointer transition-colors"
                  >
                    <HiTrash className="w-3.5 h-3.5" /> Delete
                  </button>
                )}

                {canModerate &&
                  thread.edit_histories &&
                  thread.edit_histories.length > 0 && (
                    <div className="border-l border-border pl-4">
                      <ThreadHistoryModal histories={thread.edit_histories} />
                    </div>
                  )}
              </div>

              {/* User Profile Card */}
              <div className="flex gap-2.5 items-center bg-card border border-border p-3 rounded-lg min-w-[180px]">
                <UserAvatar
                  username={thread.user?.username}
                  avatarUrl={thread.user?.avatar_url}
                  size={32}
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] text-muted-foreground">
                    asked {formatTimeAgo(thread.created_at)}
                  </span>
                  <UserLink username={thread.user?.username} />
                  <div className="mt-0.5 flex items-center gap-1.5 flex-wrap">
                    {thread.user?.level && thread.user.level !== "user" && (
                      <RoleBadge role={thread.user.level} showIcon={false} />
                    )}
                    <span className="text-muted-foreground text-[10px] font-bold">
                      {thread.user?.reputation_points || 0} rep
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==============================
            SECTION 2: ANSWERS / COMMENTS
            (dipisah dari thread di atas)
        ============================== */}
        <div className="border-t border-border pt-8">
          {/* Header Answers */}
          <h2 className="text-lg font-bold text-foreground tracking-tight mb-6">
            {comments.length} Answer{comments.length !== 1 ? "s" : ""}
          </h2>

          {/* List Comments */}
          <div className="space-y-0">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                activeEditId={editingCommentId}
                editingBody={editingBody}
                onEditBodyChange={setEditingBody}
                onVote={handleCommentVote}
                onEdit={startEditComment}
                onEditSave={handleCommentUpdate}
                onEditCancel={cancelEditComment}
                onDelete={handleCommentDelete}
                onReply={handleReplySubmit}
                onAccept={handleToggleAccept}
                isThreadOwner={!!currentUser?.id && String(currentUser.id) === String(thread.user_id)}
              />
            ))}
          </div>

          {/* Form Answer */}
          {currentUser ? (
            isClosed ? (
              <div className="mt-8 p-4 bg-card border border-border rounded-xl text-sm text-muted-foreground">
                Thread ini ditutup. Tidak dapat menambahkan jawaban baru.
              </div>
            ) : (
              <div className="mt-8 border-t border-border pt-6">
                <h2 className="text-base font-bold text-foreground mb-4 tracking-tight">
                  Your Answer
                </h2>
                <CommentForm
                  onSubmit={handleCommentSubmit}
                  isLoading={isSubmitting}
                  placeholder="Write your answer here..."
                />
              </div>
            )
          ) : (
            <div className="mt-8 p-4 bg-yellow-950/20 border border-yellow-900/40 rounded-xl text-sm text-yellow-200/80">
              Please{" "}
              <a
                href="/login"
                className="text-primary font-semibold hover:underline"
              >
                log in
              </a>{" "}
              to post an answer.
            </div>
          )}
        </div>

      </main>

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        targetId={thread.id}
        targetType="post"
        targetTitle={thread.title}
      />
      <Footer />
    </div>
  );
};