import { useState, useEffect, useCallback } from "react";
import reportService from "../../../services/reportService";
import type { Report } from "../../../services/reportService";

export const useAdminReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>("pending");

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const data = await reportService.getAllReports(filterStatus);
      setReports(data);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    let isMounted = true;

    const executeFetch = async () => {
      if (isMounted) {
        await fetchReports();
      }
    };

    executeFetch();

    return () => {
      isMounted = false;
    };
  }, [fetchReports]);

  const handleUpdateStatus = async (id: string, status: "resolved" | "dismissed") => {
    try {
      await reportService.updateReportStatus(id, status);
      fetchReports();
    } catch (error) {
      console.error(`Failed to update report ${id} to ${status}:`, error);
    }
  };

  return {
    reports,
    loading,
    filterStatus,
    setFilterStatus,
    handleUpdateStatus,
    refetch: fetchReports,
  };
};

export const useAdminReportDetail = (id: string | undefined) => {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await reportService.getReportDetail(id);
        if (isMounted) {
          setReport(data);
        }
      } catch (error) {
        console.error("Failed to fetch report detail:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDetail();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { report, loading };
};