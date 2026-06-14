import React from "react";
import { Navbar } from "../../../components/Navbar";
import { ThreadForm } from "../../../components/ThreadForm";
import { useEditThreadPage } from "../logic/EditThreadPage";
import { Skeleton } from "../../../components/ui/skeleton";
import { Footer } from "../../../components/Footer";

export const EditThreadPage: React.FC = () => {
  const { thread, isLoading, isSubmitting, isLimitReached, handleSubmit } =
    useEditThreadPage();

  if (isLoading)
    return (
      <div className="bg-background min-h-screen text-foreground">
        <Navbar />
        <main className="max-w-275 mx-auto py-8 px-4 flex gap-8">
          <div className="flex-1 bg-card p-8 rounded-xl border border-border space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-10" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-14 rounded-full" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-48 w-full" />
            </div>
            <Skeleton className="h-10 w-40 rounded-lg" />
          </div>
          <aside className="w-75 hidden lg:block">
            <Skeleton className="h-48 w-full rounded-xl" />
          </aside>
        </main>
      </div>
    );
  if (!thread)
    return (
      <div className="bg-background min-h-screen text-foreground">
        <Navbar />
        <div className="text-center mt-10 text-muted-foreground">Thread tidak ditemukan.</div>
      </div>
    );

  return (
    <div className="bg-background min-h-screen text-foreground">
      <Navbar />
      <main className="max-w-275 mx-auto py-8 px-4 flex gap-8">
        {/* Kolom Kiri: Form Utama */}
        <div className="flex-1 bg-card p-8 rounded-xl border border-border">
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
            <div className="space-y-6">
              <Skeleton className="h-8 w-48" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-10 w-40 rounded-lg" />
            </div>
          ) : !thread ? (
            <div className="text-center py-12 text-muted-foreground">
              Thread tidak ditemukan.
            </div>
          ) : (
            <ThreadForm
              initialData={{
                title: thread.title,
                body: thread.body,
                category_id: thread.category_id,
                tags: thread.tags?.map((t: { name: string }) => t.name) || [],
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
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="bg-muted p-3 border-b border-border font-medium text-[15px] text-foreground">
              Step 1: Draft your question
            </div>
            <div className="p-4 text-sm text-muted-foreground space-y-4">
              <p>
                The community is here to help you with specific coding,
                algorithm, or language problems.
              </p>
              <ul className="list-disc pl-4 space-y-2 text-muted-foreground">
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
      <Footer />
    </div>
  );
};
