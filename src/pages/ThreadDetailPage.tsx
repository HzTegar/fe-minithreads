import React from 'react';
import { Navbar } from '../components/Navbar';
import { CommentItem } from '../components/CommentItem';
import { CommentForm } from '../components/CommentForm';
import type { Thread } from '../types/thread.type';
import type { Comment } from '../types/comment.type';
import { formatTimeAgo } from '../utils/formatDate';
import { useAuth } from '../hooks/useAuth';
import { RoleBadge } from '../components/common/RoleBadge';

export const ThreadDetailPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  
  const canModerate = currentUser?.role === 'admin' || currentUser?.role === 'moderator';
  const isOwner = (authorId: string) => currentUser?.id === authorId;

  // Mock data
  const thread: Thread = {
    id: '1',
    title: 'How to implement a custom forum with React and TypeScript?',
    content: 'I am building a mini-forum application and I want to make sure I am following best practices for state management and component structure. Should I use a global state manager or is Context API enough for a simple app like this?',
    authorId: 'admin',
    author: { id: 'admin', username: 'admin', email: 'admin@example.com', role: 'admin', createdAt: new Date().toISOString() },
    category: 'Development',
    tags: ['react', 'typescript', 'frontend'],
    likesCount: 15,
    commentsCount: 2,
    version: 2,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const comments: Comment[] = [
    {
      id: '101',
      threadId: '1',
      content: 'For a simple application, the Context API combined with useReducer is often more than enough. Redux might be overkill unless you have very complex state transitions or need powerful devtools.',
      authorId: 'user1',
      author: { id: 'user1', username: 'dev_guru', email: 'guru@example.com', role: 'user', createdAt: new Date().toISOString() },
      is_accepted: true,
      version: 1,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: '102',
      threadId: '1',
      content: 'I agree with dev_guru. Start with Context and only move to Zustand or Redux if you find yourself passing too many values through providers.',
      authorId: 'user2',
      author: { id: 'user2', username: 'moderator_mike', email: 'mike@example.com', role: 'moderator', createdAt: new Date().toISOString() },
      is_accepted: false,
      version: 1,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

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
            <button className="bg-[#0a95ff] hover:bg-[#0074cc] text-white px-3 py-2 rounded text-sm font-medium transition-colors">
              Ask Question
            </button>
          </div>
          <div className="flex gap-4 text-xs text-[#6a737c]">
            <span>Asked <span className="text-[#232629]">{formatTimeAgo(thread.createdAt)}</span></span>
            <span>Modified <span className="text-[#232629]">{formatTimeAgo(thread.updatedAt)}</span></span>
            <span>Viewed <span className="text-[#232629]">452 times</span></span>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex gap-4 mb-8">
              {/* Vote Sidebar */}
              <div className="flex flex-col items-center w-12 pt-1 gap-2">
                <button className="text-[#bbc0c4] hover:text-orange-500">
                  <svg className="w-9 h-9" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m5 15 7-7 7 7"/>
                  </svg>
                </button>
                <span className="text-xl font-medium text-[#6a737c]">{thread.likesCount}</span>
                <button className="text-[#bbc0c4] hover:text-orange-500">
                  <svg className="w-9 h-9" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7"/>
                  </svg>
                </button>
                <button className="text-[#bbc0c4] mt-2 hover:text-orange-500">
                  <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 20">
                    <path d="M13 20a1 1 0 0 1-.64-.231L7 15.3l-5.36 4.469A1 1 0 0 1 0 19V2a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v17a1 1 0 0 1-1 1Z"/>
                  </svg>
                </button>
                <button className="text-[#bbc0c4] mt-2 hover:text-orange-500">
                  <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                  </svg>
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <div className="so-post-body mb-6">
                  {thread.content}
                </div>
                
                <div className="flex gap-2 mb-8">
                  {thread.tags.map(tag => (
                    <span key={tag} className="bg-[#e1ecf4] text-[#39739d] px-1.5 py-0.5 rounded text-xs hover:bg-[#d0e3f1] cursor-pointer">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-end mb-8">
                  <div className="flex gap-3 text-xs text-[#6a737c]">
                    <button className="hover:text-[#0074cc] flex items-center gap-1">
                      <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 14v7M5 4.971c0-1.642 1.333-2.97 3-2.97 1.667 0 3 1.328 3 2.97v10.058c0 1.642-1.333 2.971-3 2.971-1.667 0-3-1.33-3-2.97V4.97Z"/>
                      </svg>
                      Report
                    </button>
                    {(isOwner(thread.authorId) || canModerate) && (
                      <button className="hover:text-[#0074cc] flex items-center gap-1 text-[#0074cc]">
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M11.3 6.2H5a2 2 0 0 0-2 2V19a2 2 0 0 0 2 2h11c1.1 0 2-1 2-2v-6.3l-1.6 1.6V19a.4.4 0 0 1-.4.4H5a.4.4 0 0 1-.4-.4V8.2c0-.2.2-.4.4-.4h6.3l1.6-1.6Zm1.8 1.8L13 6.4 17.6 2l3.4 3.4-4.6 4.6-1.6-1.6Zm-1.8 1.8 1.8 1.8-1.8 1.8-1.8-1.8 1.8-1.8Z" clipRule="evenodd"/>
                          <path d="M19.8 8 16 4.2l-1.4 1.4 3.8 3.8L19.8 8Z"/>
                        </svg>
                        Edit
                      </button>
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
                    <div className="text-[#6a737c] mb-1 text-[10px]">asked {formatTimeAgo(thread.createdAt)}</div>
                    <div className="flex gap-2 items-center">
                      <div className="size-8 bg-[#000000] rounded flex items-center justify-center text-white text-[10px]">
                        {thread.author?.username?.substring(0,2).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <span className="text-[#0074cc] hover:text-[#0a95ff] cursor-pointer">{thread.author?.username}</span>
                        </div>
                        {thread.author?.role && thread.author.role !== 'user' && (
                          <RoleBadge role={thread.author.role} showIcon={false} />
                        )}
                        <span className="text-[#6a737c] font-bold text-[10px]">4,501 rep</span>
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
                  <CommentForm onSubmit={(c) => console.log('Submit', c)} />
                </div>
              </div>
            </div>
          </div>

          <div className="w-[300px] hidden lg:block">
            {currentUser && (
              <div className="bg-white border border-[#e3e6e8] p-4 rounded mb-4">
                <h3 className="font-bold text-sm mb-2">User Context</h3>
                <div className="text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[#6a737c]">Current Role:</span>
                    <RoleBadge role={currentUser.role} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#6a737c]">Mod Rights:</span>
                    <span className={canModerate ? "text-green-600 font-bold" : "text-red-500"}>
                      {canModerate ? "YES" : "NO"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
