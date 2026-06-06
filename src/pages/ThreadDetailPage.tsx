import React from 'react';
import { Navbar } from '../components/Navbar';
import { CommentItem } from '../components/CommentItem';
import { CommentForm } from '../components/CommentForm';
import { VoteButton } from '../components/VoteButton';
import { Thread } from '../types/thread.type';
import { Comment } from '../types/comment.type';

export const ThreadDetailPage: React.FC = () => {
  // Mock data
  const thread: Thread = {
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
  };

  const comments: Comment[] = [
    {
      id: '101',
      threadId: '1',
      content: 'This looks great! Can\'t wait to see it finished.',
      authorId: 'user1',
      author: { id: 'user1', username: 'developer_joe', email: 'joe@example.com', createdAt: new Date().toISOString() },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  return (
    <div>
      <Navbar />
      <main style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ marginTop: '0.5rem' }}>
            <VoteButton count={thread.likesCount} onVote={(v) => console.log('Vote', v)} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
              Posted by {thread.author?.username} • {thread.category}
            </div>
            <h1 style={{ margin: '0 0 1rem 0' }}>{thread.title}</h1>
            <div style={{ lineHeight: 1.6, color: '#374151', whiteSpace: 'pre-wrap', marginBottom: '2rem' }}>
              {thread.content}
            </div>
            
            <hr style={{ border: '0', borderTop: '1px solid #e5e7eb', margin: '2rem 0' }} />
            
            <section>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Comments ({comments.length})</h2>
              <div style={{ marginBottom: '2rem' }}>
                <CommentForm onSubmit={(c) => console.log('Submit comment', c)} />
              </div>
              <div>
                {comments.map(comment => (
                  <CommentItem key={comment.id} comment={comment} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};
