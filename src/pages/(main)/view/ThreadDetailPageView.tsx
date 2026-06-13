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
// IMPORT MODAL BARU DISINI
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
  // Tambahan icon history jika ingin serasi
} from "react-icons/hi";
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
    currentUser,
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
  } = useThreadDetailPage();

  const [isReportOpen, setIsReportOpen] = useState(false);

  if (isLoading)
    return (
      <div>
        <Navbar />
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          Loading thread...
        </div>
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
    <div className="bg-[#0a0a0a] min-h-screen text-neutral-100 pb-12">
      <Navbar />
      <main className="max-w-[800px] mx-auto py-8 px-6">
        {/* Header */}
        <div className="border-b border-white/[0.08] pb-5 mb-6">
          <div className="flex justify-between items-start mb-3">
            <h1 className="text-2xl text-white font-bold leading-snug flex-1">
              {thread.title}
            </h1>
            {isAuthenticated && (
              <a
                href="/create-thread"
                className="bg-white hover:bg-neutral-200 text-black px-4 py-2 rounded-full text-xs font-semibold transition-colors no-underline shadow-sm ml-4"
              >
                Ask Question
              </a>
            )}
          </div>
          <div className="flex gap-4 text-xs text-neutral-500">
            <span>
              Asked{" "}
              <span className="text-neutral-300">
                {formatTimeAgo(thread.created_at)}
              </span>
            </span>
            <span>
              Viewed{" "}
              <span className="text-neutral-300">
                {thread.view_count || 0} times
              </span>
            </span>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex gap-6 mb-8">
              {/* Vote Sidebar */}
              <div className="flex flex-col items-center w-12 pt-1 gap-2">
                <button
                  onClick={() => handleVote("up")}
                  className="text-neutral-500 hover:text-indigo-400 transition-colors text-4xl cursor-pointer"
                >
                  <HiChevronUp />
                </button>
                <span className="text-lg font-bold text-neutral-200">
                  {thread.vote_score || 0}
                </span>
                <button
                  onClick={() => handleVote("down")}
                  className="text-neutral-500 hover:text-indigo-400 transition-colors text-4xl cursor-pointer"
                >
                  <HiChevronDown />
                </button>

                <button
                  onClick={handleLike}
                  className="mt-3 text-neutral-500 hover:text-red-500 flex flex-col items-center gap-1 transition-colors cursor-pointer"
                >
                  <div className="text-2xl">
                    {thread.is_liked ? (
                      <HiHeart className="text-red-500" />
                    ) : (
                      <HiOutlineHeart />
                    )}
                  </div>
                  <span className="text-xs font-bold">
                    {thread.likes_count || 0}
                  </span>
                </button>

                <button
                  onClick={handleBookmark}
                  className={`mt-2 hover:text-indigo-400 transition-colors text-2xl cursor-pointer ${isBookmarked ? "text-indigo-400" : "text-neutral-500"}`}
                >
                  {isBookmarked ? <HiBookmark /> : <HiOutlineBookmark />}
                </button>
              </div>

              {/* Post body */}
              <div className="flex-1 min-w-0 bg-[#121212] border border-white/[0.08] rounded-xl p-6 shadow-sm">
                <div className="text-[0.95rem] leading-relaxed text-neutral-300 mb-6 whitespace-pre-wrap break-words">
                  {thread.body}
                </div>

                <div className="flex gap-2 mb-6 flex-wrap">
                  {thread.tags?.map((tag) => (
                    <span
                      key={tag.id}
                      className="bg-neutral-800 text-indigo-300 border border-white/[0.04] px-2.5 py-0.5 rounded-full text-xs hover:bg-neutral-700 transition-colors cursor-pointer"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>

                {/* Post meta row */}
                <div className="flex justify-between items-center flex-wrap gap-4 border-t border-white/[0.04] pt-5 mt-4">
                  <div className="flex gap-4 items-center text-xs text-neutral-500">
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
                        className="hover:text-indigo-300 flex items-center gap-1 text-indigo-400 no-underline font-medium transition-colors"
                      >
                        <HiPencilAlt className="w-3.5 h-3.5" /> Edit
                      </a>
                    )}

                    {isOwner(thread.user_id) && isLimitReached && (
                      <span className="text-red-400 italic flex items-center gap-1">
                        Limit edit (3x) tercapai
                      </span>
                    )}

                    {(isOwner(thread.user_id) || canModerate) && (
                      <button
                        onClick={handleDelete}
                        className="hover:text-red-400 flex items-center gap-1 text-red-500 font-medium cursor-pointer transition-colors"
                      >
                        <HiTrash className="w-3.5 h-3.5" /> Delete
                      </button>
                    )}

                    {/* DISINI TEMPAT MODAL HISTORY UNTUK MODERATOR/ADMIN */}
                    {canModerate &&
                      thread.edit_histories &&
                      thread.edit_histories.length > 0 && (
                        <div className="border-l border-white/[0.08] pl-4">
                          <ThreadHistoryModal
                            histories={thread.edit_histories}
                          />
                        </div>
                      )}
                  </div>

                  {/* User Profile Card */}
                  <div className="flex gap-2.5 items-center bg-neutral-900 border border-white/[0.04] p-3 rounded-lg min-w-[180px]">
                    <UserAvatar
                      username={thread.user?.username}
                      avatarUrl={thread.user?.avatar_url}
                      size={32}
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] text-neutral-500">
                        asked {formatTimeAgo(thread.created_at)}
                      </span>
                      <UserLink username={thread.user?.username} />
                      <div className="mt-0.5 flex items-center gap-1.5 flex-wrap">
                        {thread.user?.level && thread.user.level !== "user" && (
                          <RoleBadge
                            role={thread.user.level}
                            showIcon={false}
                          />
                        )}
                        <span className="text-neutral-500 text-[10px] font-bold">
                          {thread.user?.reputation_points || 0} rep
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Answers Section */}
                <div className="border-t border-white/[0.08] pt-6 mt-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-white tracking-tight">
                      {comments.length} Answer{comments.length !== 1 ? "s" : ""}
                    </h2>
                  </div>

                  <div className="space-y-4">
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
                      />
                    ))}
                  </div>
                </div>

                {currentUser ? (
                  <div className="mt-8 border-t border-white/[0.08] pt-6">
                    <h2 className="text-base font-bold text-white mb-4 tracking-tight">
                      Your Answer
                    </h2>
                    <CommentForm
                      onSubmit={handleCommentSubmit}
                      isLoading={isSubmitting}
                      placeholder="Write your answer here..."
                    />
                  </div>
                ) : (
                  <div className="mt-8 p-4 bg-yellow-950/20 border border-yellow-900/40 rounded-xl text-sm text-yellow-200/80">
                    Please{" "}
                    <a href="/login" className="text-indigo-400 font-semibold hover:underline">
                      log in
                    </a>{" "}
                    to post an answer.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        targetId={thread.id}
        targetType="post"
        targetTitle={thread.title}
      />
    </div>
  );
};
