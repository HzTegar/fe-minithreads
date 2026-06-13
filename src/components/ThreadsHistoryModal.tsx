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
  // Kalau nggak ada riwayat, komponen nggak akan muncul
  if (!histories || histories.length === 0) return null;

  // Urutkan otomatis dari edit_number paling tinggi (terbaru) ke terlama
  const sortedHistories = [...histories].sort((a, b) => b.edit_number - a.edit_number);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Lihat Riwayat Edit ({histories.length}/3)
        </Button>
      </DialogTrigger>
      
      {/* max-w-6xl mengubah ukuran pop-up jadi jauh lebih lebar dan lega */}
      <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto w-[95vw]">
        <DialogHeader className="border-b pb-2">
          <DialogTitle className="text-xl font-semibold text-slate-800">
            Riwayat Perubahan Thread
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {sortedHistories.map((history) => {
            // Format parameter created_at jadi format tanggal lokal Indonesia yang rapi
            const formattedDate = new Date(history.created_at).toLocaleString("id-ID", {
              dateStyle: "medium",
              timeStyle: "short",
            });

            return (
              <div key={history.id} className="border rounded-xl overflow-hidden shadow-sm bg-slate-50/50 w-full">
                
                {/* Bagian Metadata: Menampilkan edit_number, user_id, dan created_at */}
                <div className="bg-slate-100 px-4 py-2.5 flex flex-wrap justify-between items-center gap-2 border-b text-xs text-slate-600">
                  <span className="font-bold text-slate-700 bg-white border px-2.5 py-1 rounded-md shadow-sm">
                    Edit ke-{history.edit_number}
                  </span>
                  
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="bg-white/80 px-2.5 py-1 rounded-md border border-slate-200">
                      Editor User ID: <strong className="text-slate-800">{history.user_id}</strong>
                    </span>
                    <span className="bg-white/80 px-2.5 py-1 rounded-md border border-slate-200">
                      Waktu Perubahan: <strong className="text-slate-800">{formattedDate}</strong>
                    </span>
                  </div>
                </div>

                {/* Grid Konten Perbandingan (dikunci pakai w-full & min-w-0) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white w-full">
                  
                  {/* Kolom Kiri: Versi Lama (old_title & old_body) */}
                  <div className="bg-red-50/50 p-4 rounded-lg border border-red-100 min-w-0 w-full">
                    <span className="text-[10px] font-extrabold text-red-600 tracking-wider bg-red-100/60 px-2 py-0.5 rounded mb-3 inline-block">
                      SEBELUMNYA
                    </span>
                    <p className="font-bold text-slate-800 mb-2 break-all text-base border-b border-dashed border-red-200 pb-1">
                      {history.old_title}
                    </p>
                    <p className="text-sm text-slate-600 whitespace-pre-wrap break-all leading-relaxed">
                      {history.old_body}
                    </p>
                  </div>

                  {/* Kolom Kanan: Versi Baru (new_title & new_body) */}
                  <div className="bg-green-50/50 p-4 rounded-lg border border-green-100 min-w-0 w-full">
                    <span className="text-[10px] font-extrabold text-green-600 tracking-wider bg-green-100/60 px-2 py-0.5 rounded mb-3 inline-block">
                      SESUDAHNYA
                    </span>
                    <p className="font-bold text-slate-800 mb-2 break-all text-base border-b border-dashed border-green-200 pb-1">
                      {history.new_title}
                    </p>
                    <p className="text-sm text-slate-600 whitespace-pre-wrap break-all leading-relaxed">
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