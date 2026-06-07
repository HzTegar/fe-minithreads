import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Input } from '../components/common/Input';
import { api } from '../services/api';
import { ThreadCard } from '../components/ThreadCard';
import type { Thread } from '../types/thread.type';

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length > 2) {
        setIsLoading(true);
        try {
          // Menggunakan endpoint global search dari backend
          const response = await api.get<{ data: { posts: Thread[] } }>(`/search/global?q=${query}`);
          setResults(response.data.posts || []);
        } catch (error) {
          console.error('Search failed:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div>
      <Navbar />
      <main style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
        <h1 style={{ marginBottom: '1.5rem' }}>Search Threads</h1>
        <div style={{ marginBottom: '2rem' }}>
          <Input 
            placeholder="Search by title, content or category..." 
            value={query} 
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        
        {isLoading ? (
          <p style={{ textAlign: 'center', padding: '3rem' }}>Searching...</p>
        ) : query ? (
          <div>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              {results.length > 0 ? `Showing ${results.length} results for "${query}"` : `No results found for "${query}"`}
            </p>
            <div>
              {results.map(thread => (
                <ThreadCard key={thread.id} thread={thread} />
              ))}
            </div>
          </div>
        ) : (
          <p style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>Enter at least 3 characters to find threads.</p>
        )}
      </main>
    </div>
  );
};
