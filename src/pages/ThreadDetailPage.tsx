import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { CommentItem } from '../components/CommentItem';
import { CommentForm } from '../components/CommentForm';
import { threadService } from '../services/threadService';
import { commentService } from '../services/commentService';
import type { Thread } from '../types/thread.type';
import type { Comment } from '../types/comment.type';
import { formatTimeAgo } from '../utils/formatDate';
import { useAuth } from '../hooks/useAuth';
import { RoleBadge } from '../components/common/RoleBadge';

import { bookmarkService } from '../services/bookmarkService';

export const ThreadDetailPage: React.FC = () => {
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

  if (isLoading) return (
    <div>
      <Navbar />
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading thread...</div>
    </div>
  );

  if (!thread) return (
    <div>
      <Navbar />
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>Thread not found.</div>
    </div>
  );

  return (
    <div className="bg-[#f8f9f9] min-h-screen">
      <Navbar />
      <main className="max-w-[1100px] mx-auto py-6 px-4">
        {/* Header Section */}
        <div className="border-b border-[#e3e6e8] pb-4 mb-4">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-[27px] text-[#3b4045] leading-normal flex-1 font-normal">
              {thread.title}
            </h1>
            <a href="/create-thread" className="bg-[#0a95ff] hover:bg-[#0074cc] text-white px-3 py-2 rounded text-sm font-medium transition-colors no-underline">
              Ask Question
            </a>
          </div>
          <div className="flex gap-4 text-xs text-[#6a737c]">
            <span>Asked <span className="text-[#232629]">{formatTimeAgo(thread.created_at)}</span></span>
            <span>Viewed <span className="text-[#232629]">{thread.view_count || 0} times</span></span>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex gap-4 mb-8">
              {/* Vote Sidebar */}
              <div className="flex flex-col items-center w-12 pt-1 gap-2">
                <button onClick={() => handleVote('up')} className="text-[#bbc0c4] hover:text-orange-500 transition-colors" title="This question shows research effort; it is useful and clear">
                  <svg className="w-9 h-9" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m5 15 7-7 7 7"/>
                  </svg>
                </button>
                <span className="text-xl font-medium text-[#6a737c]">{thread.vote_score || 0}</span>
                <button onClick={() => handleVote('down')} className="text-[#bbc0c4] hover:text-orange-500 transition-colors" title="This question does not show any research effort; it is unclear or not useful">
                  <svg className="w-9 h-9" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7"/>
                  </svg>
                </button>
                
                <button onClick={handleLike} className="mt-2 text-[#bbc0c4] hover:text-red-500 flex flex-col items-center gap-1 transition-colors" title="Like this thread">
                  <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill={thread.is_liked ? 'currentColor' : 'none'} viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"/>
                  </svg>
                  <span className="text-xs font-bold">{thread.likes_count || 0}</span>
                </button>

                <button onClick={handleBookmark} className={`mt-2 hover:text-orange-500 transition-colors ${isBookmarked ? 'text-orange-500' : 'text-[#bbc0c4]'}`} title="Bookmark this thread">
                  <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill={isBookmarked ? 'currentColor' : 'none'} viewBox="0 0 14 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 20a1 1 0 0 1-.64-.231L7 15.3l-5.36 4.469A1 1 0 0 1 0 19V2a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v17a1 1 0 0 1-1 1Z"/>
                  </svg>
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <div className="so-post-body mb-6 whitespace-pre-wrap">
                  {thread.body}
                </div>
                
                <div className="flex gap-2 mb-8">
                  {thread.tags?.map(tag => (
                    <span key={tag.id} className="bg-[#e1ecf4] text-[#39739d] px-1.5 py-0.5 rounded text-xs hover:bg-[#d0e3f1] cursor-pointer">
                      {tag.name}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-end mb-8">
                  <div className="flex gap-3 text-xs text-[#6a737c]">
                    {!isOwner(thread.user_id) && (
                      <button className="hover:text-[#0074cc] flex items-center gap-1">
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 14v7M5 4.971c0-1.642 1.333-2.97 3-2.97 1.667 0 3 1.328 3 2.97v10.058c0 1.642-1.333 2.971-3 2.971-1.667 0-3-1.33-3-2.97V4.97Z"/>
                        </svg>
                        Report
                      </button>
                    )}
                    {(isOwner(thread.user_id) || canModerate) && (
                      <a href={`/edit-thread/${thread.id}`} className="hover:text-[#0074cc] flex items-center gap-1 text-[#0074cc] no-underline">
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M11.3 6.2H5a2 2 0 0 0-2 2V19a2 2 0 0 0 2 2h11c1.1 0 2-1 2-2v-6.3l-1.6 1.6V19a.4.4 0 0 1-.4.4H5a.4.4 0 0 1-.4-.4V8.2c0-.2.2-.4.4-.4h6.3l1.6-1.6Zm1.8 1.8L13 6.4 17.6 2l3.4 3.4-4.6 4.6-1.6-1.6Zm-1.8 1.8 1.8 1.8-1.8 1.8-1.8-1.8 1.8-1.8Z" clipRule="evenodd"/>
                          <path d="M19.8 8 16 4.2l-1.4 1.4 3.8 3.8L19.8 8Z"/>
                        </svg>
                        Edit
                      </a>
                    )}
                    {canModerate && (
                      <button className="hover:text-red-600 flex items-center gap-1 text-red-500 font-medium">
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                        </svg>
                        Delete
                      </button>
                    )}
                  </div>
                  
                  <div className="so-user-card">
                    <div className="text-[#6a737c] mb-1 text-[10px]">asked {formatTimeAgo(thread.created_at)}</div>
                    <div className="flex gap-2 items-center">
                      <div className="size-8 bg-[#000000] rounded flex items-center justify-center text-white text-[10px]">
                        {thread.user?.username?.substring(0,2)?.toUpperCase() || '??'}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <span className="text-[#0074cc] hover:text-[#0a95ff] cursor-pointer">{thread.user?.username}</span>
                        </div>
                        {thread.user?.level && thread.user.level !== 'user' && (
                          <RoleBadge role={thread.user.level} showIcon={false} />
                        )}
                        <span className="text-[#6a737c] font-bold text-[10px]">{thread.user?.reputation_points || 0} rep</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#e3e6e8] pt-6 flex justify-between items-center mb-4">
                  <h2 className="text-[19px] text-[#232629] font-normal">{comments.length} Answers</h2>
                </div>

                <div className="space-y-4">
                  {comments.map(comment => (
                    <CommentItem key={comment.id} comment={comment} />
                  ))}
                </div>

                <div className="mt-8">
                  <h2 className="text-[19px] text-[#232629] font-normal mb-4">Your Answer</h2>
                  <CommentForm onSubmit={handleCommentSubmit} isLoading={isSubmitting} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
