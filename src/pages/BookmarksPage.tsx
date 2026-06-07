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
        const data = await bookmarkService.getAll();
        setBookmarks(data);
      } catch (error) {
        console.error('Failed to fetch bookmarks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  return (
    <div>
      <Navbar />
      <main style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
        <h1 style={{ marginBottom: '2rem' }}>My Bookmarks</h1>

        {isLoading ? (
          <p style={{ textAlign: 'center' }}>Loading...</p>
        ) : bookmarks.length > 0 ? (
          <div>
            {bookmarks.map(thread => (
              <ThreadCard key={thread.id} thread={thread} />
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#6b7280', padding: '3rem' }}>You haven't bookmarked any threads yet.</p>
        )}
      </main>
    </div>
  );
};
