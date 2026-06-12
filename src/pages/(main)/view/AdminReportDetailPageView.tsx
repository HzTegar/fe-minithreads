import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdminReportDetail } from "../logic/AdminReportsPage";
import reportService from "../../../services/reportService";
import { Navbar } from "@/components/Navbar";

const AdminReportDetailPageView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { report, loading } = useAdminReportDetail(id) as { report: any; loading: boolean };

  const handleAction = async (status: "resolved" | "dismissed") => {
    if (!id) return;
    if (confirm(`Are you sure you want to mark this report as ${status}?`)) {
      try {
        await reportService.updateReportStatus(id, status);
        navigate("/admin/reports");
      } catch (error) {
        console.error("Action failed:", error);
      }
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading report details...</div>;
  if (!report) return <div className="text-center py-20 text-red-500">Report not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button 
          onClick={() => navigate(-1)} 
          className="text-sm text-gray-600 hover:text-gray-900 mb-4 inline-flex items-center gap-1"
        >
          ← Back to Reports
        </button>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
          <div className="border-b border-gray-100 pb-4 flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Report Ticket #{report.id?.substring(0, 8)}</h2>
              <p className="text-sm text-gray-500 mt-1">
                Reported by <span className="font-semibold">{report.reporter?.name}</span>
              </p>
            </div>
            <span className={`px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider ${
              report.status === "pending" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-800"
            }`}>
              {report.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
            <div>
              <span className="text-gray-400 block text-xs font-medium uppercase">Content Type</span>
              <span className="font-semibold text-gray-700 capitalize">{report.report_type}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-xs font-medium uppercase">Reason</span>
              <span className="text-gray-700 font-medium">{report.reason}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">Reported Content Preview</h3>
            <div className="border border-red-100 bg-red-50/30 rounded-xl p-4">
              {report.report_type === "post" && (
                <div>
                  <p className="font-bold text-gray-900 mb-1">{report.content_preview?.title || "No Title"}</p>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">{report.content_preview?.body}</p>
                </div>
              )}
              {report.report_type === "comment" && (
                <p className="text-gray-700 text-sm italic">"{report.content_preview?.comment_text || report.content_preview?.body}"</p>
              )}
              {report.report_type === "user" && (
                <div>
                  <p className="text-sm text-gray-600">Username: <span className="font-bold text-gray-900">@{report.content_preview?.username}</span></p>
                  <p className="text-sm text-gray-600">Email: {report.content_preview?.email}</p>
                </div>
              )}
            </div>
          </div>

          {report.status === "pending" && (
            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => handleAction("dismissed")}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Dismiss / Ignore
              </button>
              <button
                onClick={() => handleAction("resolved")}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                Approve & Take Action
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReportDetailPageView;