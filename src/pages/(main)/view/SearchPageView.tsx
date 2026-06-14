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

  // FIX: pakai optional chaining + nullish coalescing supaya tidak error saat results belum ada
  const totalResults =
    (results?.posts?.length ?? 0) +
    (results?.users?.length ?? 0) +
    (results?.tags?.length ?? 0) +
    (results?.categories?.length ?? 0) +
    (results?.comments?.length ?? 0);

  return (
    <div className="bg-background min-h-screen text-foreground">
      <Navbar />
      <main className="max-w-[800px] mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Search</h1>
        <div className="mb-8 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10 flex items-center">
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
          <p className="text-center py-12 text-muted-foreground">Searching...</p>
        ) : query.length >= 1 ? (
          <div>
            <p className="text-muted-foreground mb-6">
              {totalResults > 0
                ? `Showing results for "${query}"`
                : `No results found for "${query}"`}
            </p>

            {/* FIX: guard results?.users sebelum .length dan .map */}
            {(results?.users?.length ?? 0) > 0 && (
              <section className="mb-8">
                <h2 className="text-lg font-semibold mb-4 border-b border-border pb-2 text-foreground">
                  Users
                </h2>
                <div>
                  {results.users.map((user) => (
                    <UserCard key={user.id} user={user} />
                  ))}
                </div>
              </section>
            )}

            {/* FIX: guard results?.posts sebelum .length dan .map */}
            {(results?.posts?.length ?? 0) > 0 && (
              <section className="mb-8">
                <h2 className="text-lg font-semibold mb-4 border-b border-border pb-2 text-foreground">
                  Threads
                </h2>
                <div>
                  {results.posts.map((thread) => (
                    <ThreadCard key={thread.id} thread={thread} />
                  ))}
                </div>
              </section>
            )}

            {totalResults === 0 && (
              <p className="text-center py-12 text-muted-foreground">
                Try searching for something else.
              </p>
            )}
          </div>
        ) : (
          <p className="text-center py-12 text-muted-foreground">
            Type to search for threads, users, and more.
          </p>
        )}
      </main>
    </div>
  );
};