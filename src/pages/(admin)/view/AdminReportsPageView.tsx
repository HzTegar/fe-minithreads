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
          <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-xs font-semibold">
            <HiOutlineClock className="w-3 h-3" /> Pending
          </span>
        );
      case 'reviewed':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-xs font-semibold">
            <HiOutlineExclamation className="w-3 h-3" /> Reviewed
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-xs font-semibold">
            <HiOutlineCheckCircle className="w-3 h-3" /> Resolved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded text-xs font-semibold">
            <HiOutlineXCircle className="w-3 h-3" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-white/[0.06] text-neutral-400 border border-white/[0.08] px-2 py-0.5 rounded text-xs font-semibold">
            {status}
          </span>
        );
    }
  };

  const getTargetIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('post')) return <HiOutlineDocumentText className="w-4 h-4 text-blue-400" />;
    if (t.includes('comment')) return <HiOutlineChatAlt className="w-4 h-4 text-violet-400" />;
    if (t.includes('user')) return <HiOutlineUser className="w-4 h-4 text-emerald-400" />;
    return <HiOutlineExclamation className="w-4 h-4 text-neutral-500" />;
  };

  const getTargetLabel = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('post')) return 'Postingan';
    if (t.includes('comment')) return 'Komentar';
    if (t.includes('user')) return 'Pengguna';
    return 'Lainnya';
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-neutral-100">
      <Navbar />

      <main className="max-w-[1400px] mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">Reports</h1>
          <p className="text-neutral-500 text-sm mt-1">
            Kelola dan tinjau laporan dari pengguna untuk menjaga keamanan komunitas.
          </p>
        </div>

        {/* Notifications */}
        {actionSuccess && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
            <HiOutlineCheckCircle className="w-5 h-5" />
            {actionSuccess}
          </div>
        )}
        {actionError && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
            <HiOutlineXCircle className="w-5 h-5" />
            {actionError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel */}
          <div className="lg:col-span-5 flex flex-col gap-4">

            {/* Filter Card */}
            <div className="bg-[#111111] border border-white/[0.08] rounded-xl p-4 flex flex-col gap-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari kata kunci alasan/laporan..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-neutral-100 placeholder-neutral-600 outline-none focus:border-indigo-500 transition-colors"
                />
                <HiOutlineSearch className="absolute left-3 top-2.5 text-neutral-500 w-5 h-5" />
              </div>

              {/* Status Tabs */}
              <div className="flex flex-wrap gap-1.5 border-b border-white/[0.06] pb-3">
                {['all', 'pending', 'reviewed', 'resolved', 'rejected'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                      statusFilter === status
                        ? 'bg-white text-black shadow-sm'
                        : 'bg-white/[0.04] text-neutral-400 hover:bg-white/[0.08] hover:text-neutral-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Reports List */}
            <div className="bg-[#111111] border border-white/[0.08] rounded-xl overflow-hidden flex flex-col min-h-[500px]">
              {isLoadingReports ? (
                <div className="flex flex-col items-center justify-center flex-1 p-8 text-neutral-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-400 mb-2"></div>
                  <p className="text-sm">Memuat daftar laporan...</p>
                </div>
              ) : isErrorReports ? (
                <div className="flex-1 p-8 text-center">
                  <p className="text-rose-400 font-medium mb-2">Gagal mengambil data</p>
                  <p className="text-xs text-neutral-500">{reportsError}</p>
                </div>
              ) : reportsList.length === 0 ? (
                <div className="flex-1 p-8 flex flex-col items-center justify-center text-neutral-500 text-center">
                  <HiOutlineInbox className="w-12 h-12 mb-2 text-neutral-700" />
                  <p className="text-sm font-medium text-neutral-400">Tidak ada laporan ditemukan</p>
                  <p className="text-xs text-neutral-600 max-w-[250px] mt-1">
                    Coba ubah filter status atau kata kunci pencarian Anda.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-white/[0.06] flex-1">
                  {reportsList.map((report) => (
                    <div
                      key={report.id}
                      onClick={() => handleSelectReport(report.id)}
                      className={`p-4 cursor-pointer transition-colors flex flex-col gap-2 ${
                        selectedReport?.id === report.id
                          ? 'bg-indigo-500/10 border-l-4 border-indigo-500'
                          : 'hover:bg-white/[0.03]'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium capitalize">
                          {getTargetIcon(report.target_type)}
                          {getTargetLabel(report.target_type)}
                        </span>
                        {getStatusBadge(report.status)}
                      </div>

                      <h4 className="font-semibold text-neutral-200 text-sm line-clamp-1">
                        {report.reason}
                      </h4>

                      {report.description && (
                        <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                          {report.description}
                        </p>
                      )}

                      <div className="flex justify-between items-center text-[10px] text-neutral-600 mt-1">
                        <span>Oleh: @{report.user?.username || 'user'}</span>
                        <span>{new Date(report.created_at).toLocaleDateString('id-ID')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pagination.last_page > 1 && (
                <div className="border-t border-white/[0.06] p-3 bg-white/[0.02] flex justify-between items-center text-xs">
                  <button
                    disabled={page <= 1 || isLoadingReports}
                    onClick={() => setPage(page - 1)}
                    className="px-2.5 py-1.5 border border-white/[0.08] rounded-lg bg-white/[0.04] text-neutral-400 font-medium hover:bg-white/[0.08] disabled:opacity-40 transition-colors"
                  >
                    Sebelumnya
                  </button>
                  <span className="text-neutral-500 font-medium">
                    Halaman {pagination.current_page} dari {pagination.last_page}
                  </span>
                  <button
                    disabled={page >= pagination.last_page || isLoadingReports}
                    onClick={() => setPage(page + 1)}
                    className="px-2.5 py-1.5 border border-white/[0.08] rounded-lg bg-white/[0.04] text-neutral-400 font-medium hover:bg-white/[0.08] disabled:opacity-40 transition-colors"
                  >
                    Berikutnya
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Detail */}
          <div className="lg:col-span-7">
            {selectedReport ? (
              <div className="bg-[#111111] border border-white/[0.08] rounded-xl p-6 flex flex-col gap-6 sticky top-[5.5rem] overflow-y-auto max-h-[85vh]">

                {/* Detail Header */}
                <div className="border-b border-white/[0.08] pb-4 flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-bold text-lg text-white">Laporan Detail</h3>
                    <p className="text-xs text-neutral-600 mt-1">ID: {selectedReport.id}</p>
                  </div>
                  {getStatusBadge(selectedReport.status)}
                </div>

                {/* Report Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/[0.03] border border-white/[0.06] p-4 rounded-lg text-xs">
                  <div>
                    <span className="text-neutral-600 block font-medium mb-1 tracking-wider">PENGIRIM LAPORAN</span>
                    <strong className="text-neutral-200">@{selectedReport.user?.username || 'user'}</strong>
                    <span className="text-neutral-500 block mt-0.5">Email: {selectedReport.user?.email}</span>
                  </div>
                  <div>
                    <span className="text-neutral-600 block font-medium mb-1 tracking-wider">TANGGAL LAPORAN</span>
                    <strong className="text-neutral-200">{new Date(selectedReport.created_at).toLocaleString('id-ID')}</strong>
                  </div>
                </div>

                {/* Alasan */}
                <div className="flex flex-col gap-2">
                  <h4 className="text-sm font-bold text-neutral-200">Alasan Laporan</h4>
                  <div className="bg-rose-500/[0.08] border-l-4 border-rose-500 p-4 rounded-r-lg text-neutral-300 text-sm font-semibold">
                    "{selectedReport.reason}"
                  </div>
                  {selectedReport.description && (
                    <p className="text-xs text-neutral-500 whitespace-pre-wrap bg-white/[0.03] border border-white/[0.06] p-3 rounded leading-relaxed">
                      {selectedReport.description}
                    </p>
                  )}
                </div>

                {/* Konten Terlapor */}
                <div className="flex flex-col gap-2 border-t border-white/[0.08] pt-4">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-sm font-bold text-neutral-200 flex items-center gap-1.5">
                      {getTargetIcon(selectedReport.target_type)}
                      Konten Terlapor ({getTargetLabel(selectedReport.target_type)})
                    </h4>

                    {selectedReport.target_type.toLowerCase().includes('post') && selectedReport.target && (
                      <Link
                        to={`/thread/${(selectedReport.target as any).id}`}
                        target="_blank"
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-0.5"
                      >
                        Buka Thread <HiExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}
                    {selectedReport.target_type.toLowerCase().includes('comment') && selectedReport.target && (
                      <Link
                        to={`/thread/${(selectedReport.target as any).post_id}`}
                        target="_blank"
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-0.5"
                      >
                        Buka Thread <HiExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}
                    {selectedReport.target_type.toLowerCase().includes('user') && selectedReport.target && (
                      <Link
                        to={`/users/${(selectedReport.target as any).username}`}
                        target="_blank"
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-0.5"
                      >
                        Lihat Profil <HiExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>

                  {selectedReport.target ? (
                    <div className="bg-white/[0.03] rounded-lg p-4 border border-white/[0.06]">
                      {/* Post preview */}
                      {selectedReport.target_type.toLowerCase().includes('post') && (
                        <div className="flex flex-col gap-2 text-sm">
                          <h5 className="font-bold text-neutral-200 text-[15px]">
                            {(selectedReport.target as any).title}
                          </h5>
                          <p className="text-neutral-500 whitespace-pre-wrap text-xs leading-relaxed max-h-60 overflow-y-auto">
                            {(selectedReport.target as any).body}
                          </p>
                          <div className="text-[10px] text-neutral-600 mt-2">
                            Pemilik postingan: <strong className="text-neutral-400">@{(selectedReport.target as any).user?.username || 'user'}</strong>
                          </div>
                        </div>
                      )}

                      {/* Comment preview */}
                      {selectedReport.target_type.toLowerCase().includes('comment') && (
                        <div className="flex flex-col gap-2 text-sm">
                          <p className="text-neutral-500 whitespace-pre-wrap text-xs leading-relaxed max-h-60 overflow-y-auto">
                            {(selectedReport.target as any).body}
                          </p>
                          <div className="text-[10px] text-neutral-600 mt-2">
                            Pemilik komentar: <strong className="text-neutral-400">@{(selectedReport.target as any).user?.username || 'user'}</strong>
                          </div>
                        </div>
                      )}

                      {/* User preview */}
                      {selectedReport.target_type.toLowerCase().includes('user') && (
                        <div className="flex items-center gap-3">
                          <div className="size-10 bg-neutral-800 border border-white/[0.08] rounded flex items-center justify-center text-neutral-200 text-xs font-bold uppercase">
                            {(selectedReport.target as any).username?.substring(0, 2) || '??'}
                          </div>
                          <div className="flex flex-col">
                            <strong className="text-neutral-200 text-sm">@{(selectedReport.target as any).username}</strong>
                            <span className="text-xs text-neutral-500">Email: {(selectedReport.target as any).email}</span>
                            <div className="flex gap-2 items-center mt-1">
                              <RoleBadge role={(selectedReport.target as any).level} showIcon={false} />
                              <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
                                {(selectedReport.target as any).reputation_points ?? 0} Rep
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-white/[0.02] text-neutral-600 italic text-xs p-4 rounded text-center border border-dashed border-white/[0.06]">
                      Entitas target telah dihapus dari database atau tidak ditemukan.
                    </div>
                  )}
                </div>

                {/* Catatan Moderator & Actions */}
                <div className="border-t border-white/[0.08] pt-4 flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-neutral-200">
                      Catatan Moderator
                    </label>
                    <textarea
                      disabled={isUpdating || selectedReport.status !== 'pending' && selectedReport.status !== 'reviewed'}
                      value={moderatorNotes}
                      onChange={(e) => setModeratorNotes(e.target.value)}
                      rows={3}
                      placeholder="Masukkan catatan tinjauan/penolakan/penyelesaian laporan..."
                      className="w-full p-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-neutral-200 placeholder-neutral-600 outline-none focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors resize-none"
                    />
                  </div>

                  {(selectedReport.status === 'pending' || selectedReport.status === 'reviewed') ? (
                    <div className="flex flex-wrap gap-2.5 justify-end">
                      {selectedReport.status === 'pending' && (
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => handleUpdateStatus('reviewed')}
                          className="px-4 py-2 border border-white/[0.12] text-neutral-300 bg-white/[0.04] font-semibold text-xs rounded-lg hover:bg-white/[0.08] transition-colors disabled:opacity-50"
                        >
                          Mark Reviewed
                        </button>
                      )}

                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => handleUpdateStatus('rejected')}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-lg transition-colors disabled:opacity-50"
                      >
                        Tolak Laporan (Reject)
                      </button>

                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => handleUpdateStatus('resolved')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors disabled:opacity-50"
                      >
                        Setujui & Selesaikan (Resolve)
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white/[0.03] border border-white/[0.06] p-4 rounded-lg text-xs leading-relaxed text-neutral-500">
                      <div>
                        Status laporan diselesaikan sebagai:{' '}
                        <strong className="text-neutral-300 capitalize">{selectedReport.status}</strong>
                      </div>
                      {selectedReport.moderator && (
                        <div className="mt-1">
                          Diproses oleh: <strong className="text-neutral-300">@{selectedReport.moderator.username}</strong>
                        </div>
                      )}
                      {selectedReport.updated_at && (
                        <div className="mt-0.5">
                          Pada tanggal: <strong className="text-neutral-300">{new Date(selectedReport.updated_at).toLocaleString('id-ID')}</strong>
                        </div>
                      )}
                      <div className="mt-2 text-[10px] text-amber-500/70 italic">
                        * Laporan yang sudah diselesaikan atau ditolak tidak dapat diubah kembali statusnya.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-[#111111] border border-dashed border-white/[0.08] rounded-xl p-12 text-center flex flex-col items-center justify-center min-h-[500px]">
                <HiOutlineSearch className="w-16 h-16 mb-4 text-neutral-700" />
                <h4 className="font-bold text-neutral-400 text-sm">Pilih Laporan</h4>
                <p className="text-xs text-neutral-600 max-w-[280px] mt-1.5 leading-relaxed">
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