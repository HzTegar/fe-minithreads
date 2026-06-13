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
    <div className="bg-[#0d0d0d] min-h-screen text-neutral-100">
      <Navbar />
      <main className="max-w-[800px] mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Search</h1>
        <div className="mb-8 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 z-10 flex items-center">
            <HiSearch fontSize="25px" />
          </div>
          <div className="pl-[42px]">
            <Input 
              placeholder="Search for threads, users, categories..." 
              value={query} 
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        
        {isLoading ? (
          <p className="text-center py-12 text-neutral-500">Searching...</p>
        ) : query.length >= 1 ? (
          <div>
            <p className="text-neutral-500 mb-6">
              {totalResults > 0 ? `Showing results for "${query}"` : `No results found for "${query}"`}
            </p>
            
            {results.users.length > 0 && (
              <section className="mb-8">
                <h2 className="text-lg font-semibold mb-4 border-b border-[#2a2a2a] pb-2 text-neutral-200">Users</h2>
                <div>
                  {results.users.map(user => (
                    <UserCard key={user.id} user={user} />
                  ))}
                </div>
              </section>
            )}

            {results.posts.length > 0 && (
              <section className="mb-8">
                <h2 className="text-lg font-semibold mb-4 border-b border-[#2a2a2a] pb-2 text-neutral-200">Threads</h2>
                <div>
                  {results.posts.map(thread => (
                    <ThreadCard key={thread.id} thread={thread} />
                  ))}
                </div>
              </section>
            )}

            {totalResults === 0 && (
              <p className="text-center py-12 text-neutral-600">
                Try searching for something else.
              </p>
            )}
          </div>
        ) : (
          <p className="text-center py-12 text-neutral-600">Type to search for threads, users, and more.</p>
        )}
      </main>
    </div>
  );
};

