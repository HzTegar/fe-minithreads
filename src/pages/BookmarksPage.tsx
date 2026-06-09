import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { bookmarkService } from '../services/bookmarkService';
import { ThreadCard } from '../components/ThreadCard';
import type { Thread } from '../types/thread.type';

export const BookmarksPage: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response: any = await bookmarkService.getAll();
        // Backend returns Bookmark model which has a 'post' relationship
        // and it is paginated, so it's in response.data.data
        const bookmarkedThreads = (response.data?.data || response.data || []).map((b: any) => b.post || b);
        setBookmarks(bookmarkedThreads);
      } catch (error) {
        console.error('Failed to fetch bookmarks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  return (
    <div className="bg-[#f8f9f9] min-h-screen">
      <Navbar />
      <main className="max-w-[1100px] mx-auto py-8 px-4 flex gap-8">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[#232629] mb-6">My Bookmarks</h1>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-[#e3e6e8] rounded-lg">
              <p className="text-[#6a737c]">Loading your bookmarks...</p>
            </div>
          ) : bookmarks.length > 0 ? (
            <div className="space-y-4">
              {bookmarks.map(thread => (
                <ThreadCard key={thread.id} thread={thread} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-[#e3e6e8] rounded-lg">
              <div className="text-4xl mb-4"></div>
              <h2 className="text-lg font-medium text-[#3b4045] mb-1">No bookmarks yet</h2>
              <p className="text-[#6a737c] mb-6">Save threads to read them later or keep track of important discussions.</p>
              <a 
                href="/" 
                className="bg-[#0a95ff] text-white px-4 py-2 rounded font-medium hover:bg-[#0074cc] no-underline transition-colors"
              >
                Explore Threads
              </a>
            </div>
          )}
        </div>
        
        <aside className="w-[300px] hidden md:block">
          <div className="bg-[#fdf7e3] border border-[#e6dbb9] rounded p-4">
            <h3 className="text-[15px] font-medium text-[#3b4045] mb-2">About Bookmarks</h3>
            <p className="text-sm text-[#6a737c] leading-relaxed">
              Bookmarks allow you to save interesting questions and answers so you can easily find them later.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
};
