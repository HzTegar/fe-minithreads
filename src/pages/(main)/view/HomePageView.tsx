import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../../components/Navbar';
import { ThreadCard } from '../../../components/ThreadCard';
import { RoleBadge } from '../../../components/common/RoleBadge';
import { useHomePage } from '../logic/HomePage';
import { UserAvatar } from '../../../components/common/UserAvatar';
import { Formik, Form, Field, ErrorMessage } from "formik";
import { categoryValidationSchema } from "../../../types/category.type";
import type { CategoryFormValues } from "../../../types/category.type";
import { HiPencil, HiTrash, HiHashtag, HiSearch } from "react-icons/hi";

export const HomePage: React.FC = () => {
  const {
    threads,
    isLoading,
    user,
    isAuthenticated,
    reputation,
    currentRank,
    progress,
    threadCount,
    categories,
    isCatLoading,
    catError,
    isCatModalOpen,
    catModalMode,
    selectedCat,
    catDeleteTarget,
    setCatDeleteTarget,
    isCatDeleting,
    openCreateCatModal,
    openEditCatModal,
    closeCatModal,
    handleCatSubmit,
    handleCatDelete,
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearchActive,
    isSearchLoading,
    selectedCategorySlug,
    setSelectedCategorySlug,
  } = useHomePage();

  const isAdminOrMod = user?.level === "admin" || user?.level === "moderator";
  const isRegularUser = isAuthenticated && !isAdminOrMod;

  const searchRef = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setShowDropdown(isSearchActive);
  }, [isSearchActive]);

  useEffect(() => {
    if (!showDropdown) return;
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowDropdown(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [showDropdown]);

  return (
    <div className="bg-background min-h-screen text-foreground pb-12">
      <Navbar />

      <main className="max-w-[1200px] w-full mx-auto my-8 px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-[260px_1fr_300px] gap-6 box-border">

        {/* Left Sidebar - Categories & Info */}
        <aside className="lg:sticky lg:top-20 lg:self-start space-y-4">
          {/* Categories Section */}
          <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <HiHashtag className="text-[rgb(0,116,204)] text-sm" />
                <h4 className="m-0 text-sm font-semibold text-foreground">
                  Categories
                </h4>
              </div>
              {isAdminOrMod && (
                <button
                  onClick={openCreateCatModal}
                  className="text-xs font-semibold bg-inverted-bg text-inverted hover:bg-inverted-hover rounded-full px-2.5 py-1 transition-colors cursor-pointer"
                >
                  + Add
                </button>
              )}
            </div>

            {isCatLoading && (
              <p className="text-xs text-muted-foreground m-0">Loading...</p>
            )}
            {catError && (
              <p className="text-xs text-red-400 m-0">{catError}</p>
            )}

            {/* Categories List */}
            <div className="flex flex-col gap-1">
              <div
                onClick={() => setSelectedCategorySlug(null)}
                className={`group flex items-center gap-2 py-2 px-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  !selectedCategorySlug ? 'bg-accent text-foreground' : 'hover:bg-accent text-muted-foreground'
                }`}
              >
                <HiHashtag className={`text-sm ${!selectedCategorySlug ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className="text-[0.85rem] font-medium">All Threads</span>
              </div>
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategorySlug(selectedCategorySlug === cat.slug ? null : cat.slug)}
                  className={`group flex justify-between items-center py-2 px-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedCategorySlug === cat.slug ? 'bg-accent text-foreground' : 'hover:bg-accent text-muted-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <div className={`w-1 h-1 rounded-full transition-colors ${
                      selectedCategorySlug === cat.slug ? 'bg-primary' : 'bg-muted-foreground/40'
                    }`} />
                    <span className="text-[0.85rem] font-medium truncate">
                      {cat.name}
                    </span>
                  </div>
                  {isAdminOrMod && (
                    <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditCatModal(cat)}
                        className="background-none border-none cursor-pointer text-muted-foreground hover:text-[rgb(0,116,204)] p-1 transition-colors"
                      >
                        <HiPencil size={12} />
                      </button>
                      <button
                        onClick={() => setCatDeleteTarget(cat)}
                        className="background-none border-none cursor-pointer text-muted-foreground hover:text-red-400 p-1 transition-colors"
                      >
                        <HiTrash size={12} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Category Stats Footer */}
            <div className="mt-4 pt-3 border-t border-border">
              <div className="flex justify-between text-[0.65rem] text-muted-foreground">
                <span>Total Categories</span>
                <span className="font-semibold text-[rgb(0,116,204)]">{categories.length}</span>
              </div>
            </div>
          </div>

          {/* Admin/Moderator Guide Section */}
          {isAdminOrMod && (
            <div className="bg-gradient-to-br from-[rgb(0,116,204)]/10 to-[rgb(0,116,204)]/5 border border-[rgb(0,116,204)]/30 rounded-xl p-4">
              <h4 className="text-xs font-semibold text-[rgb(0,116,204)] uppercase tracking-wider m-0 mb-3">
                Admin & Moderator Guide
              </h4>
              <ul className="p-0 m-0 list-none text-xs text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[rgb(0,116,204)] text-xs mt-0.5">•</span>
                  <span>Create & manage categories to organize threads</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[rgb(0,116,204)] text-xs mt-0.5">•</span>
                  <span>Pin important threads for better visibility</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[rgb(0,116,204)] text-xs mt-0.5">•</span>
                  <span>Remove inappropriate content to maintain quality</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[rgb(0,116,204)] text-xs mt-0.5">•</span>
                  <span>Help users follow community guidelines</span>
                </li>
              </ul>
            </div>
          )}

          {/* Regular User Guide Section */}
          {isRegularUser && (
            <div className="bg-gradient-to-br from-[rgb(0,116,204)]/10 to-[rgb(0,116,204)]/5 border border-[rgb(0,116,204)]/30 rounded-xl p-4">
              <h4 className="text-xs font-semibold text-[rgb(0,116,204)] uppercase tracking-wider m-0 mb-3">
                Tips for You
              </h4>
              <ul className="p-0 m-0 list-none text-xs text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[rgb(0,116,204)] text-xs mt-0.5">•</span>
                  <span>Create quality threads to earn reputation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[rgb(0,116,204)] text-xs mt-0.5">•</span>
                  <span>Help others by answering their questions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[rgb(0,116,204)] text-xs mt-0.5">•</span>
                  <span>Upvote helpful content to support the community</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[rgb(0,116,204)] text-xs mt-0.5">•</span>
                  <span>Stay active to unlock new ranks and privileges</span>
                </li>
              </ul>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <div className="min-w-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="m-0 text-xl font-bold text-foreground tracking-tight">
              Top Questions
            </h1>
            {isAuthenticated && (
              <a
                href="/create-thread"
                className="bg-inverted-bg hover:bg-inverted-hover text-inverted font-semibold text-xs px-4 py-2 rounded-full transition-colors shadow-sm whitespace-nowrap ml-4"
              >
                Ask Question
              </a>
            )}
          </div>

          {/* Search Bar with Dropdown */}
          <div ref={searchRef} className="mb-6 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10 flex items-center">
              <HiSearch fontSize="20px" />
            </div>
            <input
              type="text"
              placeholder="Search threads, users, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => isSearchActive && setShowDropdown(true)}
              className="w-full bg-muted border border-border text-foreground pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none focus:border-indigo-500 transition-colors placeholder-neutral-500"
            />

            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-muted border border-border rounded-xl shadow-2xl z-50 max-h-[70vh] overflow-y-auto">
                {isSearchLoading ? (
                  <div className="p-5 text-center text-muted-foreground text-sm">
                    Searching...
                  </div>
                ) : (
                  <>
                    {(searchResults.users?.length ?? 0) > 0 && (
                      <div>
                        <div className="px-4 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">
                          Users
                        </div>
                        {searchResults.users.map((u) => (
                          <Link
                            key={u.id}
                            to={`/users/${encodeURIComponent(u.username)}`}
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition-colors no-underline"
                          >
                            <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0 overflow-hidden">
                              {u.avatar_url ? (
                                <img src={u.avatar_url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-muted-foreground uppercase">
                                  {u.username.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium text-foreground truncate">
                                {u.username}
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                {u.bio || 'No bio'}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                    {(searchResults.posts?.length ?? 0) > 0 && (
                      <div>
                        <div className="px-4 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">
                          Threads
                        </div>
                        {searchResults.posts.map((p) => (
                          <Link
                            key={p.id}
                            to={`/thread/${p.id}`}
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition-colors no-underline"
                          >
                            <div className="w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center flex-shrink-0">
                              <HiSearch className="text-muted-foreground text-sm" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium text-foreground truncate">
                                {p.title}
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                {(p as any).body?.substring(0, 80) || ''}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                    {(searchResults.users?.length ?? 0) === 0 &&
                      (searchResults.posts?.length ?? 0) === 0 && (
                        <div className="p-6 text-center text-muted-foreground text-sm">
                          No results found for "{searchQuery}"
                        </div>
                      )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Thread List (always visible behind dropdown) */}
          {isLoading ? (
            <p className="text-center py-12 text-muted-foreground text-sm">
              Loading threads...
            </p>
          ) : (
            <div className="space-y-3">
              {Array.isArray(threads) && threads.length > 0 ? (
                threads.map((thread) => (
                  <ThreadCard key={thread.id} thread={thread} />
                ))
              ) : (
                <div className="text-center py-12 px-6 bg-card border border-border rounded-xl">
                  <p className="text-muted-foreground text-sm mb-0">
                    No threads found. Be the first to start a conversation!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          {isAuthenticated ? (
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <UserAvatar
                  username={user?.username}
                  avatarUrl={user?.avatar_url}
                  size={48}
                />
                <div>
                  <div className="font-semibold text-[1.05rem] text-foreground">
                    {user?.username}
                  </div>
                  <div className="mt-0.5">
                    <RoleBadge role={user?.level || "user"} showIcon={false} />
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-6 border-b border-border pb-5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-muted-foreground">Reputation</span>
                  <span className="font-semibold text-foreground">
                    {reputation.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-muted-foreground">Current Rank</span>
                  <span className="font-semibold text-[rgb(0,116,204)]">
                    {currentRank.name}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-4">
                  <div
                    className="h-full bg-[rgb(0,116,204)] transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-[10px] text-muted-foreground mt-2 text-right">
                  {currentRank.next === Infinity
                    ? "Max Rank Reached"
                    : `${currentRank.next - reputation} points to next rank`}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">
                  Quick Stats
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-muted border border-border p-3 rounded-lg text-center">
                    <div className="font-bold text-sm text-foreground">
                      {reputation.toLocaleString()}
                    </div>
                    <div className="text-[0.625rem] text-muted-foreground font-semibold tracking-wider uppercase mt-0.5">
                      Points
                    </div>
                  </div>
                  <div className="bg-muted border border-border p-3 rounded-lg text-center">
                    <div className="font-bold text-sm text-foreground">{threadCount}</div>
                    <div className="text-[0.625rem] text-muted-foreground font-semibold tracking-wider uppercase mt-0.5">
                      Threads
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl p-5 text-center shadow-sm">
              <h3 className="text-sm font-semibold text-foreground mb-2">
                Join the community
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                MiniThreads is a place to share knowledge and help others. Build
                your reputation and unlock new privileges!
              </p>
              <a
                href="/register"
                className="block w-full bg-inverted-bg hover:bg-inverted-hover text-inverted font-semibold text-xs py-2.5 rounded-full transition-colors text-center"
              >
                Sign up today
              </a>
            </div>
          )}

          <div className="mt-6 px-4">
            <h4 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-3">
              Points Guide
            </h4>
            <ul className="p-0 m-0 list-none text-xs text-muted-foreground space-y-2">
              <li>
                • Create thread:{" "}
                <span className="text-[rgb(0,116,204)] font-medium ml-1">+20 pts</span>
              </li>
              <li>
                • Answer accepted:{" "}
                <span className="text-[rgb(0,116,204)] font-medium ml-1">+15 pts</span>
              </li>
              <li>
                • Receive like:{" "}
                <span className="text-[rgb(0,116,204)] font-medium ml-1">+10 pts</span>
              </li>
              <li>
                • Give vote:{" "}
                <span className="text-[rgb(0,116,204)] font-medium ml-1">+5 pts</span>
              </li>
            </ul>
          </div>
        </aside>
      </main>

      {/* Modal Create/Edit Category */}
      {isCatModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-xs px-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-[400px] shadow-xl">
            <h3 className="margin-0 mb-4 text-base font-bold text-foreground">
              {catModalMode === "create" ? "Tambah Kategori" : "Edit Kategori"}
            </h3>

            <Formik<CategoryFormValues>
              initialValues={{
                name: selectedCat?.name ?? "",
              }}
              validationSchema={categoryValidationSchema}
              enableReinitialize
              onSubmit={(values, { setSubmitting, setFieldError }) => {
                handleCatSubmit(values, setSubmitting, setFieldError);
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="mb-4">
                    <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                      Nama
                    </label>
                    <Field
                      name="name"
                      type="text"
                      placeholder="Nama kategori"
                      className="w-full bg-muted border border-border rounded-lg p-2 text-sm text-foreground focus:outline-none focus:border-primary box-border placeholder:text-muted-foreground"
                    />
                    <ErrorMessage name="name">
                      {(msg) => (
                        <p className="text-red-400 text-xs mt-1 mb-0">{msg}</p>
                      )}
                    </ErrorMessage>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={closeCatModal}
                      className="px-4 py-2 border border-border hover:bg-accent rounded-full text-xs text-foreground font-semibold cursor-pointer transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-inverted-bg hover:bg-inverted-hover text-inverted rounded-full text-xs font-semibold cursor-pointer transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? "Menyimpan..." : "Simpan"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Delete */}
      {catDeleteTarget && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-xs px-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-[360px] shadow-xl">
            <h3 className="margin-0 mb-2 text-base font-bold text-foreground">
              Hapus Kategori
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-5">
              Yakin ingin menghapus kategori{" "}
              <strong className="text-foreground">{catDeleteTarget.name}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setCatDeleteTarget(null)}
                className="px-4 py-2 border border-border hover:bg-accent rounded-full text-xs text-foreground font-semibold cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleCatDelete}
                disabled={isCatDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-full text-xs font-semibold cursor-pointer transition-colors disabled:opacity-50"
              >
                {isCatDeleting ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};