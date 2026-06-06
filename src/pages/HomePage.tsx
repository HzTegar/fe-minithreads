import React from 'react';
import { Navbar } from '../components/Navbar';
import { ThreadCard } from '../components/ThreadCard';
import { Thread } from '../types/thread.type';

export const HomePage: React.FC = () => {
  // Mock data for initial skeleton
  const mockThreads: Thread[] = [
    {
      id: '1',
      title: 'Welcome to MiniThreads!',
      content: 'This is a simple forum built with React and TypeScript. Start by creating a new thread!',
      authorId: 'admin',
      author: { id: 'admin', username: 'admin', email: 'admin@example.com', createdAt: new Date().toISOString() },
      category: 'General',
      tags: ['welcome', 'react'],
      likesCount: 10,
      commentsCount: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  return (
    <div>
      <Navbar />
      <main style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ margin: 0 }}>Recent Threads</h1>
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
        </div>
        
        <div>
          {mockThreads.map(thread => (
            <ThreadCard key={thread.id} thread={thread} />
          ))}
        </div>
      </main>
    </div>
  );
};
