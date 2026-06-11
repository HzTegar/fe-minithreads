import React from 'react';
import { Navbar } from '../../../components/Navbar';
import { CommentItem } from '../../../components/CommentItem';
import { CommentForm } from '../../../components/CommentForm';
import { formatTimeAgo } from '../../../utils/formatDate';
import { RoleBadge } from '../../../components/common/RoleBadge';
import { UserLink } from '../../../components/common/UserLink';
import { useThreadDetailPage } from '../logic/ThreadDetailPage';
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
} from 'react-icons/hi';

export const ThreadDetailPage: React.FC = () => {
  const {
    thread,
    comments,
    isLoading,
    isSubmitting,
    isBookmarked,
    canModerate,
    isOwner,
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

  if (isLoading)
    return (
      <div>
        <Navbar />
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading thread...</div>
      </div>
    );

  if (!thread)
    return (
      <div>
        <Navbar />
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>Thread not found.</div>
      </div>
    );

  return (
    <div className="bg-[#f8f9f9] min-h-screen">
      <Navbar />
      <main className="max-w-[1100px] mx-auto py-6 px-4">
        {/* Header */}
        <div className="border-b border-[#e3e6e8] pb-4 mb-4">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-[27px] text-[#3b4045] leading-normal flex-1 font-normal">
              {thread.title}
            </h1>
            <a
              href="/create-thread"
              className="bg-[#0a95ff] hover:bg-[#0074cc] text-white px-3 py-2 rounded text-sm font-medium transition-colors no-underline"
            >
              Ask Question
            </a>
          </div>
          <div className="flex gap-4 text-xs text-[#6a737c]">
            <span>
              Asked <span className="text-[#232629]">{formatTimeAgo(thread.created_at)}</span>
            </span>
            <span>
              Viewed <span className="text-[#232629]">{thread.view_count || 0} times</span>
            </span>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex gap-4 mb-8">
              {/* Vote Sidebar */}
              <div className="flex flex-col items-center w-12 pt-1 gap-2">
                <button
                  onClick={() => handleVote('up')}
                  className="text-[#bbc0c4] hover:text-orange-500 transition-colors text-4xl"
                  title="This question shows research effort"
                >
                  <HiChevronUp />
                </button>
                <span className="text-xl font-medium text-[#6a737c]">
                  {thread.vote_score || 0}
                </span>
                <button
                  onClick={() => handleVote('down')}
                  className="text-[#bbc0c4] hover:text-orange-500 transition-colors text-4xl"
                  title="This question does not show research effort"
                >
                  <HiChevronDown />
                </button>

                <button
                  onClick={handleLike}
                  className="mt-2 text-[#bbc0c4] hover:text-red-500 flex flex-col items-center gap-1 transition-colors"
                  title="Like this thread"
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
                  className={`mt-2 hover:text-orange-500 transition-colors text-2xl ${
                    isBookmarked ? 'text-orange-500' : 'text-[#bbc0c4]'
                  }`}
                  title="Bookmark this thread"
                >
                  {isBookmarked ? <HiBookmark /> : <HiOutlineBookmark />}
                </button>
              </div>

              {/* Post body */}
              <div className="flex-1 min-w-0">
                <div className="so-post-body mb-6 whitespace-pre-wrap">{thread.body}</div>

                {/* Tags */}
                <div className="flex gap-2 mb-8 flex-wrap">
                  {thread.tags?.map(tag => (
                    <span
                      key={tag.id}
                      className="bg-[#e1ecf4] text-[#39739d] px-1.5 py-0.5 rounded text-xs hover:bg-[#d0e3f1] cursor-pointer"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>

                {/* Post meta row */}
                <div className="flex justify-between items-end mb-8">
                  <div className="flex gap-3 text-xs text-[#6a737c]">
                    {currentUser && !isOwner(thread.user_id) && (
                      <button className="hover:text-[#0074cc] flex items-center gap-1">
                        <HiFlag className="w-3 h-3" />
                        Report
                      </button>
                    )}
                    {(isOwner(thread.user_id) || canModerate) && (
                      <a
                        href={`/edit-thread/${thread.id}`}
                        className="hover:text-[#0074cc] flex items-center gap-1 text-[#0074cc] no-underline"
                      >
                        <HiPencilAlt className="w-3 h-3" />
                        Edit
                      </a>
                    )}
                    {(isOwner(thread.user_id) || canModerate) && (
                      <button
                        onClick={handleDelete}
                        className="hover:text-red-600 flex items-center gap-1 text-red-500 font-medium"
                      >
                        <HiTrash className="w-3 h-3" />
                        Delete
                      </button>
                    )}
                  </div>

                  <div className="so-user-card">
                    <div className="text-[#6a737c] mb-1 text-[10px]">
                      asked {formatTimeAgo(thread.created_at)}
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className="size-8 bg-[#000000] rounded flex items-center justify-center text-white text-[10px]">
                        {thread.user?.username?.substring(0, 2)?.toUpperCase() || '??'}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <UserLink username={thread.user?.username} />
                        </div>
                        {thread.user?.level && thread.user.level !== 'user' && (
                          <RoleBadge role={thread.user.level} showIcon={false} />
                        )}
                        <span className="text-[#6a737c] font-bold text-[10px]">
                          {thread.user?.reputation_points || 0} rep
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Answers section */}
                <div className="border-t border-[#e3e6e8] pt-6 flex justify-between items-center mb-4">
                  <h2 className="text-[19px] text-[#232629] font-normal">
                    {comments.length} Answer{comments.length !== 1 ? 's' : ''}
                  </h2>
                </div>

                <div className="space-y-4">
                  {comments.map(comment => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      isEditing={editingCommentId === comment.id}
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

                {/* New answer form — only for logged-in users */}
                {currentUser ? (
                  <div className="mt-8">
                    <h2 className="text-[19px] text-[#232629] font-normal mb-4">
                      Your Answer
                    </h2>
                    <CommentForm
                      onSubmit={handleCommentSubmit}
                      isLoading={isSubmitting}
                      placeholder="Write your answer here..."
                    />
                  </div>
                ) : (
                  <div className="mt-8 p-4 bg-[#fdf7e3] border border-[#e8d5a3] rounded text-sm text-[#6a737c]">
                    Please{' '}
                    <a href="/login" className="text-[#0074cc]">
                      log in
                    </a>{' '}
                    to post an answer.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
