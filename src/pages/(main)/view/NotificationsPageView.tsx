import React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../../../components/Navbar";
import { formatTimeAgo } from "../../../utils/formatDate";
import { useNotificationsPage } from "../logic/NotificationsPage";
import { useAuth } from "../../../hooks/useAuth";
import {
  HiBell,
  HiChat,
  HiHeart,
  HiThumbUp,
  HiUserAdd,
  HiCheckCircle,
  HiExclamation,
  HiX,
} from "react-icons/hi";
import type { Notification } from "../../../services/notificationService";

// Map notification type → icon + accent colour
const NOTIF_META: Record<
  string,
  { icon: React.ReactNode; color: string; bg: string }
> = {
  new_comment: {
    icon: <HiChat />,
    color: "#0074cc",
    bg: "#e1ecf4",
  },
  post_liked: {
    icon: <HiHeart />,
    color: "#e53e3e",
    bg: "#fff5f5",
  },
  post_voted: {
    icon: <HiThumbUp />,
    color: "#d97706",
    bg: "#fffbeb",
  },
  answer_accepted: {
    icon: <HiCheckCircle />,
    color: "#2e7d32",
    bg: "#f0fdf4",
  },
  user_followed: {
    icon: <HiUserAdd />,
    color: "#7c3aed",
    bg: "#f5f3ff",
  },
  comment_replied: {
    icon: <HiChat />,
    color: "#0074cc",
    bg: "#e1ecf4",
  },
  report_approved: {
    icon: <HiExclamation />,
    color: "#b45309",
    bg: "#fffbeb",
  },
  // notifikasi khusus admin: ada laporan masuk
  report_submitted: {
    icon: <HiExclamation />,
    color: "#dc2626",
    bg: "#fef2f2",
  },
};

const getNotifMeta = (notif: Notification) => {
  const type = notif.data?.type ?? "";
  return (
    NOTIF_META[type] ?? { icon: <HiBell />, color: "#6a737c", bg: "#f1f2f3" }
  );
};

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    unreadCount,
    isLoading,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleDelete,
  } = useNotificationsPage();

  const { user } = useAuth();
  const isAdmin = user?.level === "admin";

  return (
    <div className="bg-[#f8f9f9] min-h-screen">
      <Navbar />
      <main className="max-w-[800px] mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#232629]">Notifications</h1>
            {unreadCount > 0 && (
              <span className="bg-[#0074cc] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-[#0074cc] hover:text-[#0a95ff] font-medium transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20 bg-white border border-[#e3e6e8] rounded-lg">
            <p className="text-[#6a737c]">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-[#e3e6e8] rounded-lg gap-3">
            <div className="text-5xl text-[#c8cfd6]">
              <HiBell />
            </div>
            <h2 className="text-lg font-medium text-[#3b4045]">
              No notifications yet
            </h2>
            <p className="text-sm text-[#6a737c]">
              When someone comments, likes, or votes on your posts, it'll show
              up here.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notif) => {
              const meta = getNotifMeta(notif);
              const isUnread = !notif.read_at;
              const isReportNotif = notif.data?.type === "report_submitted";

              return (
                <div
                  key={notif.id}
                  className={`rounded-lg border transition-all flex items-start gap-3 p-4 ${
                    isUnread
                      ? "bg-[#f0f7ff] border-[#b3d3f1]"
                      : "bg-white border-[#e3e6e8]"
                  }`}
                >
                  {/* Type icon */}
                  <div
                    className="shrink-0 rounded-full p-2 text-lg mt-0.5"
                    style={{ backgroundColor: meta.bg, color: meta.color }}
                  >
                    {meta.icon}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    {/* Sender link */}
                    {notif.data.username && (
                      <Link
                        to={`/users/${encodeURIComponent(notif.data.username)}`}
                        className="font-semibold text-[#0074cc] hover:text-[#0a95ff] text-sm no-underline"
                      >
                        {notif.data.username}
                      </Link>
                    )}{" "}
                    <span
                      className={`text-sm ${isUnread ? "text-[#232629]" : "text-[#4b5563]"}`}
                    >
                      {notif.data.username
                        ? notif.data.message.replace(
                            new RegExp(`^${notif.data.username}\\s*`),
                            "",
                          )
                        : notif.data.message}
                    </span>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-[#6a737c]">
                        {formatTimeAgo(notif.created_at)}
                      </span>
                      {isUnread && (
                        <button
                          onClick={() => handleMarkAsRead(notif.id)}
                          className="text-xs text-[#0074cc] hover:underline"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right side: View/Review link + Delete */}
                  <div className="flex items-center gap-2 shrink-0">
                  

                      {/*notifikasi report(khusus admin)*/}
                    {isReportNotif && isAdmin && notif.data.report_id && (
                      <Link
                        to={`/admin/reports/${notif.data.report_id}`}
                        className="text-xs font-bold text-white hover:opacity-90 px-2.5 py-1 rounded bg-[#dc2626] no-underline uppercase tracking-wide"
                      >
                        Review
                      </Link>
                    )}

                    {!isReportNotif && notif.data.post_id && (
                      <Link
                        to={`/thread/${notif.data.post_id}`}
                        className="text-xs font-bold text-[#0074cc] hover:bg-[#e1ecf4] px-2.5 py-1 rounded bg-[#f1f2f3] no-underline uppercase tracking-wide"
                      >
                        View
                      </Link>
                    )}

                    {/* Tombol hapus notifikasi (selalu muncul) */}
                    <button
                      onClick={() => handleDelete(notif.id)}
                      className="text-[#bbc0c4] hover:text-[#6a737c] text-lg transition-colors p-1 rounded"
                      title="Delete notification"
                    >
                      <HiX />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
