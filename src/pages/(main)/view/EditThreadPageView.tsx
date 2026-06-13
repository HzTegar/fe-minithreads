import React from "react";
import { Navbar } from "../../../components/Navbar";
import { ThreadForm } from "../../../components/ThreadForm";
import { useEditThreadPage } from "../logic/EditThreadPage";

export const EditThreadPage: React.FC = () => {
  const { thread, isLoading, isSubmitting, isLimitReached, handleSubmit } =
    useEditThreadPage();

  if (isLoading)
    return (
      <div className="bg-[#0d0d0d] min-h-screen text-neutral-100">
        <Navbar />
        <div className="text-center mt-10 text-neutral-500">Loading...</div>
      </div>
    );
  if (!thread)
    return (
      <div className="bg-[#0d0d0d] min-h-screen text-neutral-100">
        <Navbar />
        <div className="text-center mt-10 text-neutral-500">Thread tidak ditemukan.</div>
      </div>
    );

  return (
    <div className="bg-[#0d0d0d] min-h-screen text-neutral-100">
      <Navbar />
      <main className="max-w-275 mx-auto py-8 px-4 flex gap-8">
        {/* Kolom Kiri: Form Utama */}
        <div className="flex-1 bg-[#1a1a1a] p-8 rounded-xl border border-[#2a2a2a]">
          <h1 className="text-2xl font-bold mb-8">
            Edit your question
          </h1>

          {isLimitReached && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              <strong>Peringatan:</strong> Batas edit 3x sudah tercapai. Kamu
              tidak bisa lagi menyimpan perubahan.
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-12 text-neutral-500">
              Loading thread details...
            </div>
          ) : !thread ? (
            <div className="text-center py-12 text-neutral-500">
              Thread tidak ditemukan.
            </div>
          ) : (
            <ThreadForm
              initialData={{
                title: thread.title,
                body: thread.body,
                category_id: thread.category_id,
                tags: thread.tags?.map((t: any) => t.name) || [],
              }}
              onSubmit={
                isLimitReached
                  ? () =>
                      alert(
                        "Limit edit 3x sudah tercapai, tidak bisa menyimpan perubahan.",
                      )
                  : handleSubmit
              }
              isLoading={isSubmitting || isLimitReached}
            />
          )}
        </div>

        {/* Kolom Kanan: Sidebar */}
        <aside className="w-75 hidden lg:block">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
            <div className="bg-[#222] p-3 border-b border-[#2a2a2a] font-medium text-[15px] text-neutral-300">
              Step 1: Draft your question
            </div>
            <div className="p-4 text-sm text-neutral-400 space-y-4">
              <p>
                The community is here to help you with specific coding,
                algorithm, or language problems.
              </p>
              <ul className="list-disc pl-4 space-y-2 text-neutral-500">
                <li>Summarize your problem in a one-line title.</li>
                <li>Describe your problem in more detail.</li>
                <li>
                  Describe what you tried and what you expected to happen.
                </li>
                <li>Add "tags" which help people find your question.</li>
              </ul>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};
