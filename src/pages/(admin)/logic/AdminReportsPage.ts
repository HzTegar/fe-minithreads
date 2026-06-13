import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { reportService } from '../../../services/reportService';
import { useAuth } from '../../../hooks/useAuth';
import type { ReportStatus, Report } from '../../../types/report.type';

export const useAdminReportsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Redirect if unauthorized
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user && user.level !== 'admin' && user.level !== 'moderator') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  // Filters and state
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [moderatorNotes, setModeratorNotes] = useState<string>('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Fetch reports list
  const {
    data: reportsData,
    isLoading: isLoadingReports,
    isError: isErrorReports,
    error: reportsError,
  } = useQuery({
    queryKey: ['admin-reports', statusFilter, searchKeyword, page],
    queryFn: () => reportService.getAll({ status: statusFilter, keyword: searchKeyword, page }),
    enabled: !!isAuthenticated && (user?.level === 'admin' || user?.level === 'moderator'),
  });

  // Fetch single report details (if selected)
  const {
    data: selectedReportDetail,
    isLoading: isLoadingDetail,
  } = useQuery({
    queryKey: ['admin-report-detail', selectedReportId],
    queryFn: () => reportService.getById(selectedReportId!),
    enabled: !!selectedReportId,
  });

  // Sync moderator notes when report detail is loaded
  useEffect(() => {
    if (selectedReportDetail) {
      setModeratorNotes(selectedReportDetail.moderator_notes || '');
    }
  }, [selectedReportDetail]);

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: ReportStatus; notes: string }) =>
      reportService.update(id, { status, moderator_notes: notes }),
    onSuccess: (data) => {
      setActionSuccess(`Status laporan berhasil diubah menjadi ${data.status || 'selesai'}.`);
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
      queryClient.invalidateQueries({ queryKey: ['admin-report-detail', selectedReportId] });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setActionSuccess(null);
      }, 3500);
    },
    onError: (err: any) => {
      setActionError(err?.message || 'Gagal mengubah status laporan.');
      setTimeout(() => {
        setActionError(null);
      }, 3500);
    },
  });

  const handleUpdateStatus = (status: ReportStatus) => {
    if (!selectedReportId) return;
    updateStatusMutation.mutate({
      id: selectedReportId,
      status,
      notes: moderatorNotes.trim(),
    });
  };

  const handleSelectReport = (id: string) => {
    setSelectedReportId(id);
    setActionSuccess(null);
    setActionError(null);
  };

  const reportsList: Report[] = reportsData?.data || [];
  const pagination = {
    current_page: reportsData?.current_page || 1,
    last_page: reportsData?.last_page || 1,
    total: reportsData?.total || 0,
    per_page: reportsData?.per_page || 15,
  };

  return {
    user,
    reportsList,
    pagination,
    isLoadingReports,
    isErrorReports,
    reportsError: (reportsError as any)?.message || null,
    selectedReport: selectedReportDetail || null,
    isLoadingDetail,
    statusFilter,
    setStatusFilter: (s: string) => {
      setStatusFilter(s);
      setPage(1);
      setSelectedReportId(null);
    },
    searchKeyword,
    setSearchKeyword: (k: string) => {
      setSearchKeyword(k);
      setPage(1);
      setSelectedReportId(null);
    },
    page,
    setPage,
    moderatorNotes,
    setModeratorNotes,
    handleUpdateStatus,
    handleSelectReport,
    isUpdating: updateStatusMutation.isPending,
    actionSuccess,
    actionError,
  };
};
