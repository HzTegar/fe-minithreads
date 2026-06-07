import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Input } from '../components/common/Input';

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');

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
        
        {query ? (
          <div>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>Showing results for "{query}"</p>
            {/* Results would be mapped here */}
            <p style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>No threads found matching your search.</p>
          </div>
        ) : (
          <p style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>Enter a search term to find threads.</p>
        )}
      </main>
    </div>
  );
};
