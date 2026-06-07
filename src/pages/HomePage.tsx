import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { ThreadCard } from '../components/ThreadCard';
import { threadService } from '../services/threadService';
import { authStore } from '../store/authStore';
import type { Thread } from '../types/thread.type';

export const HomePage: React.FC = () => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(authStore.getState().isAuthenticated);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const data = await threadService.getAll();
        setThreads(data);
      } catch (error) {
        console.error('Failed to fetch threads:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchThreads();

    return authStore.subscribe((state) => {
      setIsAuthenticated(state.isAuthenticated);
    });
  }, []);

  return (
    <div>
      <Navbar />
      <main style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ margin: 0 }}>Recent Threads</h1>
          {isAuthenticated && (
            <a href="/create-thread" style={{ 
              backgroundColor: '#2563eb', 
              color: 'white', 
              padding: '0.5rem 1rem', 
              borderRadius: '4px', 
              textDecoration: 'none',
              fontWeight: 500
            }}>
              New Thread
            </a>
          )}
        </div>
        
        {isLoading ? (
          <p style={{ textAlign: 'center' }}>Loading threads...</p>
        ) : (
          <div>
            {threads.length > 0 ? (
              threads.map(thread => (
                <ThreadCard key={thread.id} thread={thread} />
              ))
            ) : (
              <p style={{ textAlign: 'center', color: '#6b7280' }}>No threads found. Be the first to start a conversation!</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
