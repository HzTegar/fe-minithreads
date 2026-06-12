export interface Reporter {
  id: string;
  name: string;
  email?: string;
}

export interface ContentPreview {
  id: string;
  title?: string;
  body?: string;
  comment_text?: string;
  username?: string;
  email?: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  report_type: "post" | "comment" | "user";
  reported_id: string;
  reason: string;
  status: "pending" | "resolved" | "dismissed";
  created_at: string;
  updated_at: string;
  reporter?: Reporter;
  content_preview?: ContentPreview;
}

const API_URL =
  (import.meta.env && import.meta.env.VITE_API_URL) ||
  "http://localhost:8000/api";

const reportService = {
  getAllReports: async (status: string = "pending"): Promise<Report[]> => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/admin/reports?status=${status}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch all reports");
    }

    const json = await response.json();
    // Backend mengembalikan paginate: { success, message, data: { data: [...] } }
    return (json?.data?.data ?? []) as Report[];
  },

  getReportDetail: async (id: string): Promise<Report> => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/admin/reports/${id}`, {
      method: "GET",
      credentials: "include", // <-- PENTING: Mengizinkan pengiriman cookie session/sanctum dari browser
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch report detail with ID: ${id}`);
    }

    const json = await response.json();
    // Backend: { success: true, data: { ...report... } }
    return json.data as Report;
  },

  updateReportStatus: async (
    id: string,
    status: "resolved" | "dismissed",
  ): Promise<unknown> => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/admin/reports/${id}/status`, {
      method: "POST",
      credentials: "include", // <-- PENTING: Mengizinkan pengiriman cookie session/sanctum dari browser
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update report status to ${status}`);
    }

    return response.json();
  },
};

export default reportService;
