import React from 'react';
import { Navbar } from '../../../components/Navbar';
import { ThreadCard } from '../../../components/ThreadCard';
import { RoleBadge } from '../../../components/common/RoleBadge';
import { useHomePage } from '../logic/HomePage';
import { UserAvatar } from '../../../components/common/UserAvatar';
import { Formik, Form, Field, ErrorMessage } from "formik";
import { categoryValidationSchema } from "../../../types/category.type";
import type { CategoryFormValues } from "../../../types/category.type";
import { HiPencil, HiTrash, HiHashtag } from "react-icons/hi";

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
  } = useHomePage();

  const isAdminOrMod = user?.level === "admin" || user?.level === "moderator";
  const isRegularUser = isAuthenticated && !isAdminOrMod;

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-neutral-100 pb-12">
      <Navbar />

      <main className="max-w-[1200px] w-full mx-auto my-8 px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-[260px_1fr_300px] gap-6 box-border">

        {/* Left Sidebar - Categories & Info */}
        <aside className="lg:sticky lg:top-20 lg:self-start space-y-4">
          {/* Categories Section */}
          <div className="bg-gradient-to-br from-[#121212] to-[#0e0e0e] border border-white/[0.08] rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <HiHashtag className="text-[rgb(0,116,204)] text-sm" />
                <h4 className="m-0 text-sm font-semibold text-neutral-300">
                  Categories
                </h4>
              </div>
              {isAdminOrMod && (
                <button
                  onClick={openCreateCatModal}
                  className="text-xs font-semibold bg-white text-black hover:bg-neutral-200 rounded-full px-2.5 py-1 transition-colors cursor-pointer"
                >
                  + Add
                </button>
              )}
            </div>

            {isCatLoading && (
              <p className="text-xs text-neutral-500 m-0">Loading...</p>
            )}
            {catError && (
              <p className="text-xs text-red-400 m-0">{catError}</p>
            )}

            {/* Categories List */}
            <div className="flex flex-col gap-1">
              {categories.map((cat, index) => (
                <div
                  key={cat.id}
                  className="group flex justify-between items-center py-2 px-2 rounded-lg hover:bg-white/[0.04] transition-all duration-200"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-1 h-1 rounded-full bg-[rgb(0,116,204)]/60 group-hover:bg-[rgb(0,116,204)] transition-colors" />
                    <span className="text-[0.85rem] text-neutral-300 font-medium truncate">
                      {cat.name}
                    </span>
                    <span className="text-[0.65rem] text-neutral-600 ml-auto">
                    </span>
                  </div>
                  {isAdminOrMod && (
                    <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditCatModal(cat)}
                        className="background-none border-none cursor-pointer text-neutral-500 hover:text-[rgb(0,116,204)] p-1 transition-colors"
                      >
                        <HiPencil size={12} />
                      </button>
                      <button
                        onClick={() => setCatDeleteTarget(cat)}
                        className="background-none border-none cursor-pointer text-neutral-500 hover:text-red-400 p-1 transition-colors"
                      >
                        <HiTrash size={12} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Category Stats Footer */}
            <div className="mt-4 pt-3 border-t border-white/[0.04]">
              <div className="flex justify-between text-[0.65rem] text-neutral-500">
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
              <ul className="p-0 m-0 list-none text-xs text-neutral-400 space-y-2">
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
              <ul className="p-0 m-0 list-none text-xs text-neutral-400 space-y-2">
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
            <h1 className="m-0 text-xl font-bold text-white tracking-tight">
              Top Questions
            </h1>
            {isAuthenticated && (
              <a
                href="/create-thread"
                className="bg-white hover:bg-neutral-200 text-black font-semibold text-xs px-4 py-2 rounded-full transition-colors shadow-sm whitespace-nowrap ml-4"
              >
                Ask Question
              </a>
            )}
          </div>

          {isLoading ? (
            <p className="text-center py-12 text-neutral-500 text-sm">
              Loading threads...
            </p>
          ) : (
            <div className="space-y-3">
              {Array.isArray(threads) && threads.length > 0 ? (
                threads.map((thread) => (
                  <ThreadCard key={thread.id} thread={thread} />
                ))
              ) : (
                <div className="text-center py-12 px-6 bg-[#121212] border border-white/[0.08] rounded-xl">
                  <p className="text-neutral-400 text-sm mb-0">
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
            <div className="bg-[#121212] border border-white/[0.08] rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <UserAvatar
                  username={user?.username}
                  avatarUrl={user?.avatar_url}
                  size={48}
                />
                <div>
                  <div className="font-semibold text-[1.05rem] text-white">
                    {user?.username}
                  </div>
                  <div className="mt-0.5">
                    <RoleBadge role={user?.level || "user"} showIcon={false} />
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-6 border-b border-white/[0.04] pb-5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-neutral-400">Reputation</span>
                  <span className="font-semibold text-neutral-200">
                    {reputation.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-neutral-400">Current Rank</span>
                  <span className="font-semibold text-[rgb(0,116,204)]">
                    {currentRank.name}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden mt-4">
                  <div
                    className="h-full bg-[rgb(0,116,204)] transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-[10px] text-neutral-500 mt-2 text-right">
                  {currentRank.next === Infinity
                    ? "Max Rank Reached"
                    : `${currentRank.next - reputation} points to next rank`}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-neutral-300 mb-3 uppercase tracking-wider">
                  Quick Stats
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-neutral-900 border border-white/[0.04] p-3 rounded-lg text-center">
                    <div className="font-bold text-sm text-neutral-200">
                      {reputation.toLocaleString()}
                    </div>
                    <div className="text-[0.625rem] text-neutral-500 font-semibold tracking-wider uppercase mt-0.5">
                      Points
                    </div>
                  </div>
                  <div className="bg-neutral-900 border border-white/[0.04] p-3 rounded-lg text-center">
                    <div className="font-bold text-sm text-neutral-200">{threadCount}</div>
                    <div className="text-[0.625rem] text-neutral-500 font-semibold tracking-wider uppercase mt-0.5">
                      Threads
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#121212] border border-white/[0.08] rounded-xl p-5 text-center shadow-sm">
              <h3 className="text-sm font-semibold text-white mb-2">
                Join the community
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                MiniThreads is a place to share knowledge and help others. Build
                your reputation and unlock new privileges!
              </p>
              <a
                href="/register"
                className="block w-full bg-white hover:bg-neutral-200 text-black font-semibold text-xs py-2.5 rounded-full transition-colors text-center"
              >
                Sign up today
              </a>
            </div>
          )}

          <div className="mt-6 px-4">
            <h4 className="text-xs font-semibold text-neutral-400 tracking-wider uppercase mb-3">
              Points Guide
            </h4>
            <ul className="p-0 m-0 list-none text-xs text-neutral-500 space-y-2">
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
          <div className="bg-[#181818] border border-white/[0.08] rounded-xl p-6 w-full max-w-[400px] shadow-xl">
            <h3 className="margin-0 mb-4 text-base font-bold text-white">
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
                    <label className="text-xs font-semibold text-neutral-400 block mb-1.5">
                      Nama
                    </label>
                    <Field
                      name="name"
                      type="text"
                      placeholder="Nama kategori"
                      className="w-full bg-[#242424] border border-white/[0.08] rounded-lg p-2 text-sm text-white focus:outline-none focus:border-[rgb(0,116,204)] box-border placeholder:text-neutral-600"
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
                      className="px-4 py-2 border border-white/[0.08] hover:bg-white/5 rounded-full text-xs text-neutral-300 font-semibold cursor-pointer transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-white hover:bg-neutral-200 text-black rounded-full text-xs font-semibold cursor-pointer transition-colors disabled:opacity-50"
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
          <div className="bg-[#181818] border border-white/[0.08] rounded-xl p-6 w-full max-w-[360px] shadow-xl">
            <h3 className="margin-0 mb-2 text-base font-bold text-white">
              Hapus Kategori
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed mb-5">
              Yakin ingin menghapus kategori{" "}
              <strong className="text-white">{catDeleteTarget.name}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setCatDeleteTarget(null)}
                className="px-4 py-2 border border-white/[0.08] hover:bg-white/5 rounded-full text-xs text-neutral-300 font-semibold cursor-pointer transition-colors"
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