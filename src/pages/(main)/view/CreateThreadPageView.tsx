import React from 'react';
import { Navbar } from '../../../components/Navbar';
import { ThreadForm } from '../../../components/ThreadForm';
import { useCreateThreadPage } from '../logic/CreateThreadPage';

export const CreateThreadPage: React.FC = () => {
  const {
    isLoading,
    error,
    handleSubmit
  } = useCreateThreadPage();

  return (
    <div className="bg-[#0d0d0d] min-h-screen text-neutral-100">
      <Navbar />
      <main className="max-w-[1100px] mx-auto py-8 px-4 flex gap-8">
        <div className="flex-1 bg-[#1a1a1a] p-8 rounded-xl border border-[#2a2a2a]">
          <h1 className="text-2xl font-bold mb-8">Ask a public question</h1>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <ThreadForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        <aside className="w-[300px] hidden lg:block">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
            <div className="bg-[#222] p-3 border-b border-[#2a2a2a] font-medium text-[15px] text-neutral-300">
              Step 1: Draft your question
            </div>
            <div className="p-4 text-sm text-neutral-400 space-y-4">
              <p>The community is here to help you with specific coding, algorithm, or language problems.</p>
              <p>Avoid asking opinion-based questions.</p>
              <ul className="list-disc pl-4 space-y-2 text-neutral-500">
                <li>Summarize your problem in a one-line title.</li>
                <li>Describe your problem in more detail.</li>
                <li>Describe what you tried and what you expected to happen.</li>
                <li>Add "tags" which help help people find your question.</li>
              </ul>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

