import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CommentHistoryModalProps {
  commentId: string;
}

export const CommentHistoryModal = ({ commentId }: CommentHistoryModalProps) => {
  const [histories, setHistories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/comments/${commentId}/history`);
      const result = await response.json();
      
      if (result.success) {
        setHistories(result.data);
      }
    } catch (err) {
      console.error("Gagal mengambil riwayat:", err);
    } finally {
      setLoading(false);
    }
  };

  const sortedHistories = [...histories].sort((a, b) => b.edit_number - a.edit_number);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button onClick={fetchHistory} variant="outline" size="sm" className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 text-slate-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          Riwayat Edit
        </Button>
      </DialogTrigger>
      
      <DialogContent className="w-[95vw] md:w-[90vw] max-w-7xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            Riwayat Perubahan Komentar
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-5">
          {loading ? (
            <p className="text-center py-10 text-slate-500">Memuat riwayat...</p>
          ) : histories.length === 0 ? (
            <p className="text-center py-10 text-slate-500">Belum ada riwayat perubahan.</p>
          ) : (
            sortedHistories.map((history) => {
              const formattedDate = new Date(history.created_at).toLocaleString("id-ID", {
                dateStyle: "medium",
                timeStyle: "short",
              });

              return (
                <div key={history.id} className="border rounded-xl overflow-hidden shadow-sm bg-slate-50/50 w-full">
                  <div className="bg-slate-100 px-4 py-2.5 flex flex-wrap justify-between items-center gap-3 border-b text-xs text-slate-600">
                    <span className="font-bold text-slate-700 bg-white border px-2.5 py-1 rounded-md shadow-sm">
                      Edit ke-{history.edit_number}
                    </span>
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="bg-white/80 px-2.5 py-1 rounded-md border border-slate-200">
                        Editor User ID: <strong className="text-slate-800">{history.user_id}</strong>
                      </span>
                      <span className="bg-white/80 px-2.5 py-1 rounded-md border border-slate-200">
                        Waktu: <strong className="text-slate-800">{formattedDate}</strong>
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-white w-full">
                    <div className="bg-red-50/40 p-4 rounded-lg border border-red-100">
                      <span className="text-[10px] font-extrabold text-red-600">SEBELUMNYA</span>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap break-all pt-1">{history.old_content}</p>
                    </div>
                    <div className="bg-green-50/40 p-4 rounded-lg border border-green-100">
                      <span className="text-[10px] font-extrabold text-green-600">SESUDAHNYA</span>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap break-all pt-1">{history.new_content}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};