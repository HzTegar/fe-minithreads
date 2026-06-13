import React from 'react';
import { Navbar } from '../../../components/Navbar';
import { useAdminReportsPage } from '../logic/AdminReportsPage';
import { RoleBadge } from '../../../components/common/RoleBadge';
import { Link } from 'react-router-dom';
import {
  HiOutlineExclamation,
  HiOutlineSearch,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineDocumentText,
  HiOutlineChatAlt,
  HiOutlineUser,
  HiOutlineInbox,
  HiExternalLink,
} from 'react-icons/hi';

export const AdminReportsPage: React.FC = () => {
  const {
    reportsList,
    pagination,
    isLoadingReports,
    isErrorReports,
    reportsError,
    selectedReport,
    statusFilter,
    setStatusFilter,
    searchKeyword,
    setSearchKeyword,
    page,
    setPage,
    moderatorNotes,
    setModeratorNotes,
    handleUpdateStatus,
    handleSelectReport,
    isUpdating,
    actionSuccess,
    actionError,
  } = useAdminReportsPage();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded text-xs font-semibold">
            <HiOutlineClock className="w-3 h-3" /> Pending
          </span>
        );
      case 'reviewed':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded text-xs font-semibold">
            <HiOutlineExclamation className="w-3 h-3" /> Reviewed
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-xs font-semibold">
            <HiOutlineCheckCircle className="w-3 h-3" /> Resolved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded text-xs font-semibold">
            <HiOutlineXCircle className="w-3 h-3" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-slate-50 text-slate-700 border border-slate-200 px-2 py-0.5 rounded text-xs font-semibold">
            {status}
          </span>
        );
    }
  };

  const getTargetIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('post')) return <HiOutlineDocumentText className="w-4 h-4 text-blue-500" />;
    if (t.includes('comment')) return <HiOutlineChatAlt className="w-4 h-4 text-violet-500" />;
    if (t.includes('user')) return <HiOutlineUser className="w-4 h-4 text-emerald-500" />;
    return <HiOutlineExclamation className="w-4 h-4 text-slate-500" />;
  };

  const getTargetLabel = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('post')) return 'Postingan';
    if (t.includes('comment')) return 'Komentar';
    if (t.includes('user')) return 'Pengguna';
    return 'Lainnya';
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />
      
      <main className="max-w-[1400px] mx-auto py-8 px-4">
        {/* Header Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Reports</h1>
          <p className="text-slate-500 text-sm mt-1">
            Kelola dan tinjau laporan dari pengguna untuk menjaga keamanan komunitas.
          </p>
        </div>

        {/* Top Notifications */}
        {actionSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2 shadow-sm animate-fade-in">
            <HiOutlineCheckCircle className="w-5 h-5 text-emerald-600" />
            {actionSuccess}
          </div>
        )}
        {actionError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2 shadow-sm animate-fade-in">
            <HiOutlineXCircle className="w-5 h-5 text-rose-600" />
            {actionError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Panel: Filters + List */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Filter Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col gap-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari kata kunci alasan/laporan..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 transition-colors"
                />
                <HiOutlineSearch className="absolute left-3 top-2.5 text-slate-400 w-5 h-5" />
              </div>

              {/* Status Tabs */}
              <div className="flex flex-wrap gap-1.5 border-b border-slate-100 pb-2">
                {['all', 'pending', 'reviewed', 'resolved', 'rejected'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                      statusFilter === status
                        ? 'bg-slate-800 text-white shadow-sm'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Reports List */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
              {isLoadingReports ? (
                <div className="flex flex-col items-center justify-center flex-1 p-8 text-slate-400">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800 mb-2"></div>
                  <p className="text-sm">Memuat daftar laporan...</p>
                </div>
              ) : isErrorReports ? (
                <div className="flex-1 p-8 text-center text-slate-500">
                  <p className="text-rose-500 font-medium mb-2">Gagal mengambil data</p>
                  <p className="text-xs">{reportsError}</p>
                </div>
              ) : reportsList.length === 0 ? (
                <div className="flex-1 p-8 flex flex-col items-center justify-center text-slate-400 text-center">
                  <HiOutlineInbox className="w-12 h-12 mb-2 text-slate-300" />
                  <p className="text-sm font-medium">Tidak ada laporan ditemukan</p>
                  <p className="text-xs text-slate-400 max-w-[250px] mt-1">
                    Coba ubah filter status atau kata kunci pencarian Anda.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 flex-1">
                  {reportsList.map((report) => (
                    <div
                      key={report.id}
                      onClick={() => handleSelectReport(report.id)}
                      className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors flex flex-col gap-2 ${
                        selectedReport?.id === report.id ? 'bg-blue-50/50 border-l-4 border-blue-500' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium capitalize">
                          {getTargetIcon(report.target_type)}
                          {getTargetLabel(report.target_type)}
                        </span>
                        {getStatusBadge(report.status)}
                      </div>

                      <h4 className="font-semibold text-slate-800 text-sm line-clamp-1">
                        {report.reason}
                      </h4>
                      
                      {report.description && (
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {report.description}
                        </p>
                      )}

                      <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                        <span>Oleh: @{report.user?.username || 'user'}</span>
                        <span>{new Date(report.created_at).toLocaleDateString('id-ID')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination Footer */}
              {pagination.last_page > 1 && (
                <div className="border-t border-slate-100 p-3 bg-slate-50/50 flex justify-between items-center text-xs">
                  <button
                    disabled={page <= 1 || isLoadingReports}
                    onClick={() => setPage(page - 1)}
                    className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white font-medium hover:bg-slate-50 disabled:opacity-50"
                  >
                    Sebelumnya
                  </button>
                  <span className="text-slate-500 font-medium">
                    Halaman {pagination.current_page} dari {pagination.last_page}
                  </span>
                  <button
                    disabled={page >= pagination.last_page || isLoadingReports}
                    onClick={() => setPage(page + 1)}
                    className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white font-medium hover:bg-slate-50 disabled:opacity-50"
                  >
                    Berikutnya
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Detail view */}
          <div className="lg:col-span-7">
            {selectedReport ? (
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col gap-6 sticky top-[5.5rem] overflow-y-auto max-h-[85vh]">
                
                {/* Detail Header */}
                <div className="border-b border-slate-100 pb-4 flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                      Laporan Detail
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      ID: {selectedReport.id}
                    </p>
                  </div>
                  {getStatusBadge(selectedReport.status)}
                </div>

                {/* Report Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium mb-1">PENGIRIM LAPORAN</span>
                    <strong className="text-slate-700">@{selectedReport.user?.username || 'user'}</strong>
                    <span className="text-slate-400 block mt-0.5">Email: {selectedReport.user?.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium mb-1">TANGGAL LAPORAN</span>
                    <strong className="text-slate-700">{new Date(selectedReport.created_at).toLocaleString('id-ID')}</strong>
                  </div>
                </div>

                {/* Content Details */}
                <div className="flex flex-col gap-2">
                  <h4 className="text-sm font-bold text-slate-800">Alasan Laporan</h4>
                  <div className="bg-red-50/50 border-l-4 border-red-500 p-4 rounded-r-lg text-slate-700 text-sm font-semibold">
                    "{selectedReport.reason}"
                  </div>
                  {selectedReport.description && (
                    <p className="text-xs text-slate-500 whitespace-pre-wrap bg-slate-50 p-3 rounded border border-slate-100 leading-relaxed">
                      {selectedReport.description}
                    </p>
                  )}
                </div>

                {/* Previews of the Reported Target */}
                <div className="flex flex-col gap-2 border-t border-slate-100 pt-4">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                      {getTargetIcon(selectedReport.target_type)}
                      Konten Terlapor ({getTargetLabel(selectedReport.target_type)})
                    </h4>

                    {/* Quick navigation link */}
                    {selectedReport.target_type.toLowerCase().includes('post') && selectedReport.target && (
                      <Link
                        to={`/thread/${(selectedReport.target as any).id}`}
                        target="_blank"
                        className="text-xs text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-0.5"
                      >
                        Buka Thread <HiExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}
                    {selectedReport.target_type.toLowerCase().includes('comment') && selectedReport.target && (
                      <Link
                        to={`/thread/${(selectedReport.target as any).post_id}`}
                        target="_blank"
                        className="text-xs text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-0.5"
                      >
                        Buka Thread <HiExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}
                    {selectedReport.target_type.toLowerCase().includes('user') && selectedReport.target && (
                      <Link
                        to={`/users/${(selectedReport.target as any).username}`}
                        target="_blank"
                        className="text-xs text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-0.5"
                      >
                        Lihat Profil <HiExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>

                  {selectedReport.target ? (
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      {/* Post/Thread preview */}
                      {selectedReport.target_type.toLowerCase().includes('post') && (
                        <div className="flex flex-col gap-2 text-sm">
                          <h5 className="font-bold text-slate-800 text-[15px]">
                            {(selectedReport.target as any).title}
                          </h5>
                          <p className="text-slate-600 whitespace-pre-wrap text-xs leading-relaxed max-h-60 overflow-y-auto">
                            {(selectedReport.target as any).body}
                          </p>
                          <div className="text-[10px] text-slate-400 mt-2">
                            Pemilik postingan: <strong>@{(selectedReport.target as any).user?.username || 'user'}</strong>
                          </div>
                        </div>
                      )}

                      {/* Comment preview */}
                      {selectedReport.target_type.toLowerCase().includes('comment') && (
                        <div className="flex flex-col gap-2 text-sm">
                          <p className="text-slate-600 whitespace-pre-wrap text-xs leading-relaxed max-h-60 overflow-y-auto">
                            {(selectedReport.target as any).body}
                          </p>
                          <div className="text-[10px] text-slate-400 mt-2">
                            Pemilik komentar: <strong>@{(selectedReport.target as any).user?.username || 'user'}</strong>
                          </div>
                        </div>
                      )}

                      {/* User preview */}
                      {selectedReport.target_type.toLowerCase().includes('user') && (
                        <div className="flex items-center gap-3">
                          <div className="size-10 bg-slate-800 rounded flex items-center justify-center text-white text-xs font-bold uppercase">
                            {(selectedReport.target as any).username?.substring(0, 2) || '??'}
                          </div>
                          <div className="flex flex-col">
                            <strong className="text-slate-800 text-sm">@{(selectedReport.target as any).username}</strong>
                            <span className="text-xs text-slate-400">Email: {(selectedReport.target as any).email}</span>
                            <div className="flex gap-2 items-center mt-1">
                              <RoleBadge role={(selectedReport.target as any).level} showIcon={false} />
                              <span className="text-[10px] text-amber-600 font-bold bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded">
                                {(selectedReport.target as any).reputation_points ?? 0} Rep
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-slate-100 text-slate-400 italic text-xs p-4 rounded text-center border border-dashed border-slate-200">
                      Entitas target telah dihapus dari database atau tidak ditemukan.
                    </div>
                  )}
                </div>

                {/* Moderator Resolution Notes & Action buttons */}
                <div className="border-t border-slate-100 pt-4 flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-slate-800">
                      Catatan Moderator
                    </label>
                    <textarea
                      disabled={isUpdating || selectedReport.status !== 'pending' && selectedReport.status !== 'reviewed'}
                      value={moderatorNotes}
                      onChange={(e) => setModeratorNotes(e.target.value)}
                      rows={3}
                      placeholder="Masukkan catatan tinjauan/penolakan/penyelesaian laporan..."
                      className="w-full p-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500 transition-colors resize-none"
                    />
                  </div>

                  {/* Actions for Pending/Reviewed */}
                  {(selectedReport.status === 'pending' || selectedReport.status === 'reviewed') ? (
                    <div className="flex flex-wrap gap-2.5 justify-end">
                      {selectedReport.status === 'pending' && (
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => handleUpdateStatus('reviewed')}
                          className="px-4 py-2 border border-slate-200 text-slate-700 bg-white font-semibold text-xs rounded-lg shadow-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
                        >
                          Mark Reviewed
                        </button>
                      )}
                      
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => handleUpdateStatus('rejected')}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors disabled:opacity-50"
                      >
                        Tolak Laporan (Reject)
                      </button>

                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => handleUpdateStatus('resolved')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors disabled:opacity-50"
                      >
                        Setujui & Selesaikan (Resolve)
                      </button>
                    </div>
                  ) : (
                    /* Info when already solved */
                    <div className="bg-slate-50 p-4 border border-slate-200 rounded-lg text-xs leading-relaxed text-slate-500">
                      <div>
                        Status laporan diselesaikan sebagai:{' '}
                        <strong className="text-slate-700 capitalize">{selectedReport.status}</strong>
                      </div>
                      {selectedReport.moderator && (
                        <div className="mt-1">
                          Diproses oleh: <strong>@{selectedReport.moderator.username}</strong>
                        </div>
                      )}
                      {selectedReport.updated_at && (
                        <div className="mt-0.5">
                          Pada tanggal: <strong>{new Date(selectedReport.updated_at).toLocaleString('id-ID')}</strong>
                        </div>
                      )}
                      <div className="mt-2 text-[10px] text-amber-600 italic">
                        * Laporan yang sudah diselesaikan atau ditolak tidak dapat diubah kembali statusnya.
                      </div>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              /* No selection state */
              <div className="bg-white border border-slate-200 border-dashed rounded-xl p-12 text-center text-slate-400 flex flex-col items-center justify-center min-h-[500px] shadow-sm">
               <HiOutlineSearch className="w-16 h-16 mb-4 text-slate-300" />
                <h4 className="font-bold text-slate-700 text-sm">Pilih Laporan</h4>
                <p className="text-xs text-slate-400 max-w-[280px] mt-1.5 leading-relaxed">
                  Pilih salah satu laporan dari daftar di sebelah kiri untuk melihat detail konten dan memproses moderasi.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
