import React from "react";
import { Link } from "react-router-dom";
import { useAdminReports } from "../logic/AdminReportsPage";
import { Navbar } from "@/components/Navbar";

const AdminReportsPageView: React.FC = () => {
  const { reports, loading, filterStatus, setFilterStatus, handleUpdateStatus } = useAdminReports();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">User Reports Management</h1>
          
          <div className="flex gap-2 bg-gray-200 p-1 rounded-lg text-sm font-medium">
            {["pending", "resolved", "dismissed"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-md capitalize transition-all ${
                  filterStatus === status
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading reports...</div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200 text-gray-500">
            No {filterStatus} reports found.
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-gray-50 text-gray-700 font-semibold uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-6 py-4">Reporter</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Reason</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-600">
                {reports.map((report: any) => (
                  <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{report.reporter?.name}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 capitalize">
                        {report.report_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate">{report.reason}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${
                        report.status === "pending" ? "bg-amber-100 text-amber-800" :
                        report.status === "resolved" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        to={`/admin/reports/${report.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Review
                      </Link>
                      {report.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(report.id, "resolved")}
                            className="text-green-600 hover:text-green-800 font-medium text-xs ml-2"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(report.id, "dismissed")}
                            className="text-red-600 hover:text-red-800 font-medium text-xs ml-2"
                          >
                            Dismiss
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReportsPageView;