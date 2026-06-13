import React from 'react';
import { Navbar } from '../../../components/Navbar';
import { ThreadCard } from '../../../components/ThreadCard';
import { useBookmarksPage } from '../logic/BookmarksPage';
import { HiBookmark } from 'react-icons/hi';
import type { Thread } from '../../../types/thread.type';

export const BookmarksPage: React.FC = () => {
  const {
    bookmarks,
    isLoading
  } = useBookmarksPage();

  return (
    <div className="bg-[#0d0d0d] min-h-screen text-neutral-100">
      <Navbar />
      <main className="max-w-[1100px] mx-auto py-8 px-4 flex gap-8">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-6">My Bookmarks</h1>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl">
              <p className="text-neutral-500">Loading your bookmarks...</p>
            </div>
          ) : bookmarks.length > 0 ? (
            <div className="space-y-4">
              {bookmarks.map((thread: Thread) => (
                <ThreadCard key={thread.id} thread={thread} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl">
              <div className="text-5xl mb-4 text-neutral-700">
                <HiBookmark />
              </div>
              <h2 className="text-lg font-medium text-neutral-300 mb-1">No bookmarks yet</h2>
              <p className="text-neutral-500 mb-6">Save threads to read them later or keep track of important discussions.</p>
              <a 
                href="/" 
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-500 no-underline transition-colors"
              >
                Explore Threads
              </a>
            </div>
          )}
        </div>
        
        <aside className="w-[300px] hidden md:block">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
            <h3 className="text-[15px] font-medium text-neutral-200 mb-2">About Bookmarks</h3>
            <p className="text-sm text-neutral-500 leading-relaxed">
              Bookmarks allow you to save interesting questions and answers so you can easily find them later.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
};

