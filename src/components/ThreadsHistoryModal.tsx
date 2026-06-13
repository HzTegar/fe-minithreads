import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { ThreadEditHistory } from "@/types/thread.type";

interface ThreadHistoryModalProps {
  histories: ThreadEditHistory[];
}

export const ThreadHistoryModal = ({ histories }: ThreadHistoryModalProps) => {
  if (!histories || histories.length === 0) return null;

  const sortedHistories = [...histories].sort((a, b) => b.edit_number - a.edit_number);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1.5 text-xs border-white/[0.12] bg-transparent text-neutral-400 hover:text-white hover:bg-white/[0.06] hover:border-white/20 transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-3.5 h-3.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          Riwayat Edit ({histories.length}/3)
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto w-[95vw] bg-[#111111] border border-white/[0.08] text-neutral-100 p-0">
        <DialogHeader className="border-b border-white/[0.08] px-6 py-4">
          <DialogTitle className="text-base font-semibold text-white flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 text-indigo-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            Riwayat Perubahan Thread
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 p-6">
          {sortedHistories.map((history) => {
            const formattedDate = new Date(history.created_at).toLocaleString("id-ID", {
              dateStyle: "medium",
              timeStyle: "short",
            });

            return (
              <div
                key={history.id}
                className="border border-white/[0.08] rounded-xl overflow-hidden bg-[#0d0d0d]"
              >
                {/* Metadata bar */}
                <div className="bg-white/[0.04] px-4 py-2.5 flex flex-wrap justify-between items-center gap-2 border-b border-white/[0.08] text-xs text-neutral-400">
                  <span className="font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-md">
                    Edit ke-{history.edit_number}
                  </span>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="bg-white/[0.04] px-2.5 py-1 rounded-md border border-white/[0.06] flex items-center gap-1.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-3 h-3 text-neutral-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                        />
                      </svg>
                      Editor ID:{" "}
                      <strong className="text-neutral-200">{history.user_id}</strong>
                    </span>
                    <span className="bg-white/[0.04] px-2.5 py-1 rounded-md border border-white/[0.06] flex items-center gap-1.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-3 h-3 text-neutral-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                      <strong className="text-neutral-200">{formattedDate}</strong>
                    </span>
                  </div>
                </div>

                {/* Comparison grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                  {/* Sebelumnya */}
                  <div className="bg-red-500/[0.05] p-4 rounded-lg border border-red-500/[0.15] min-w-0 w-full">
                    <span className="text-[10px] font-extrabold text-red-400 tracking-wider bg-red-500/10 px-2 py-0.5 rounded mb-3 inline-block">
                      SEBELUMNYA
                    </span>
                    <p className="font-semibold text-neutral-200 mb-2 break-all text-sm border-b border-red-500/[0.15] pb-2">
                      {history.old_title}
                    </p>
                    <p className="text-sm text-neutral-400 whitespace-pre-wrap break-all leading-relaxed">
                      {history.old_body}
                    </p>
                  </div>

                  {/* Sesudahnya */}
                  <div className="bg-emerald-500/[0.05] p-4 rounded-lg border border-emerald-500/[0.15] min-w-0 w-full">
                    <span className="text-[10px] font-extrabold text-emerald-400 tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded mb-3 inline-block">
                      SESUDAHNYA
                    </span>
                    <p className="font-semibold text-neutral-200 mb-2 break-all text-sm border-b border-emerald-500/[0.15] pb-2">
                      {history.new_title}
                    </p>
                    <p className="text-sm text-neutral-400 whitespace-pre-wrap break-all leading-relaxed">
                      {history.new_body}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};