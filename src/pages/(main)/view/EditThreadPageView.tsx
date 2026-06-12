import React from 'react';
import { Navbar } from '../../../components/Navbar';
import { ThreadForm } from '../../../components/ThreadForm'; 
import { useEditThreadPage } from '../logic/EditThreadPage';

export const EditThreadPage: React.FC = () => {
  const { 
    thread, 
    isLoading, 
    isSubmitting, 
    isLimitReached, 
    handleSubmit 
  } = useEditThreadPage();

  if (isLoading) return <div><Navbar /><div className="text-center mt-10">Loading...</div></div>;
  if (!thread) return <div><Navbar /><div className="text-center mt-10">Thread tidak ditemukan.</div></div>;

  return (
    <div className="bg-[#f8f9f9] min-h-screen">
      <Navbar />
      <main className="max-w-[1100px] mx-auto py-8 px-4 flex gap-8">
        
        {/* Kolom Kiri: Form Utama */}
        <div className="flex-1 bg-white p-8 rounded-lg border border-[#e3e6e8] shadow-sm">
          <h1 className="text-2xl font-bold text-[#232629] mb-8">Edit your question</h1>
          
          {isLimitReached && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6 text-sm">
              <strong>Peringatan:</strong> Batas edit 3x sudah tercapai. Kamu tidak bisa lagi menyimpan perubahan.
            </div>
          )}

          <ThreadForm 
            initialData={{
              title: thread.title,
              body: thread.body,
              category_id: thread.category_id,
              tags: thread.tags?.map((t: any) => t.name) || [] 
            }}
            // LOGIKA PENGAMAN:
            // Jika limit tercapai, fungsi submit diganti dengan alert
            onSubmit={isLimitReached ? () => alert("Limit edit 3x sudah tercapai, tidak bisa menyimpan perubahan.") : handleSubmit} 
            // Jika limit tercapai, paksa status loading agar tombol di ThreadForm disabled
            isLoading={isSubmitting || isLimitReached} 
          />
        </div>

        {/* Kolom Kanan: Sidebar */}
        <aside className="w-[300px] hidden lg:block">
          <div className="bg-white border border-[#e3e6e8] rounded shadow-sm overflow-hidden">
            <div className="bg-[#f8f9f9] p-3 border-b border-[#e3e6e8] font-medium text-[15px]">
              Step 1: Draft your question
            </div>
            <div className="p-4 text-sm text-[#3b4045] space-y-4">
              <p>The community is here to help you with specific coding, algorithm, or language problems.</p>
              <ul className="list-disc pl-4 space-y-2 text-[#6a737c]">
                <li>Summarize your problem in a one-line title.</li>
                <li>Describe your problem in more detail.</li>
                <li>Describe what you tried and what you expected to happen.</li>
                <li>Add "tags" which help people find your question.</li>
              </ul>
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
};