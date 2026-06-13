import React from 'react';
import { Navbar } from '../../../components/Navbar';
import { Input } from '../../../components/common/Input';
import { ThreadCard } from '../../../components/ThreadCard';
import { UserCard } from '../../../components/UserCard';
import { useSearchPage } from '../logic/SearchPage';
import { HiSearch } from 'react-icons/hi';

export const SearchPage: React.FC = () => {
  const {
    query,
    setQuery,
    results,
    isLoading
  } = useSearchPage();

  const totalResults = results.posts.length + results.users.length + results.tags.length + results.categories.length + results.comments.length;

  return (
    <div>
      <Navbar />
      <main style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
        <h1 style={{ marginBottom: '1.5rem' }}>Search</h1>
        <div style={{ marginBottom: '2rem', position: 'relative' }}>
          <div style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', zIndex: 1, display: 'flex', alignItems: 'center' }}>
            <HiSearch fontSize="25px" />
          </div>
          <div style={{ paddingLeft: '42px' }}>
            <Input 
              placeholder="Search for threads, users, categories..." 
              value={query} 
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        
        {isLoading ? (
          <p style={{ textAlign: 'center', padding: '3rem' }}>Searching...</p>
        ) : query.length >= 1 ? (
          <div>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              {totalResults > 0 ? `Showing results for "${query}"` : `No results found for "${query}"`}
            </p>
            
            {results.users.length > 0 && (
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '2px solid #f3f4f6', paddingBottom: '0.5rem' }}>Users</h2>
                <div>
                  {results.users.map(user => (
                    <UserCard key={user.id} user={user} />
                  ))}
                </div>
              </section>
            )}

            {results.posts.length > 0 && (
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '2px solid #f3f4f6', paddingBottom: '0.5rem' }}>Threads</h2>
                <div>
                  {results.posts.map(thread => (
                    <ThreadCard key={thread.id} thread={thread} />
                  ))}
                </div>
              </section>
            )}

            {totalResults === 0 && (
              <p style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
                Try searching for something else.
              </p>
            )}
          </div>
        ) : (
          <p style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>Type to search for threads, users, and more.</p>
        )}
      </main>
    </div>
  );
};

