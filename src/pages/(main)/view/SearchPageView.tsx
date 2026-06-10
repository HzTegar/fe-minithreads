import React from 'react';
import { Navbar } from '../../../components/Navbar';
import { Input } from '../../../components/common/Input';
import { ThreadCard } from '../../../components/ThreadCard';
import { useSearchPage } from '../logic/SearchPage';
import { HiSearch } from 'react-icons/hi';

export const SearchPage: React.FC = () => {
  const {
    query,
    setQuery,
    results,
    isLoading
  } = useSearchPage();

  return (
    <div>
      <Navbar />
      <main style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
        <h1 style={{ marginBottom: '1.5rem' }}>Search Threads</h1>
        <div style={{ marginBottom: '2rem', position: 'relative' }}>
          <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', zIndex: 1, display: 'flex', alignItems: 'center' }}>
            <HiSearch fontSize="20px" />
          </div>
          <div style={{ paddingLeft: '32px' }}>
            <Input 
              placeholder="Search by title, content or category..." 
              value={query} 
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
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

