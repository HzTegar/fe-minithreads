import React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../../../components/Navbar";
import { formatTimeAgo } from "../../../utils/formatDate";
import { useNotificationsPage } from "../logic/NotificationsPage";
import { useAuth } from "../../../hooks/useAuth";
import { Skeleton } from "../../../components/ui/skeleton";
import { Footer } from "../../../components/Footer";
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

const NOTIF_META: Record<
  string,
  { icon: React.ReactNode; color: string; bg: string }
> = {
  new_comment: {
    icon: <HiChat />,
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.12)",
  },
  post_liked: {
    icon: <HiHeart />,
    color: "#f87171",
    bg: "rgba(248,113,113,0.12)",
  },
  post_voted: {
    icon: <HiThumbUp />,
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.12)",
  },
  answer_accepted: {
    icon: <HiCheckCircle />,
    color: "#4ade80",
    bg: "rgba(74,222,128,0.12)",
  },
  user_followed: {
    icon: <HiUserAdd />,
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.12)",
  },
  comment_replied: {
    icon: <HiChat />,
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.12)",
  },
  report_approved: {
    icon: <HiExclamation />,
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.12)",
  },
  report_submitted: {
    icon: <HiExclamation />,
    color: "#f87171",
    bg: "rgba(248,113,113,0.12)",
  },
};

const getNotifMeta = (notif: Notification) => {
  const type = notif.data?.type ?? "";
  return (
    NOTIF_META[type] ?? { icon: <HiBell />, color: "#737373", bg: "rgba(115,115,115,0.12)" }
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
    <div className="bg-background min-h-screen text-foreground">
      <Navbar />
      <main className="max-w-[800px] mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <span className="bg-indigo-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4 flex items-start gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-xl gap-3">
            <div className="text-5xl text-muted-foreground">
              <HiBell />
            </div>
            <h2 className="text-lg font-medium text-foreground">
              No notifications yet
            </h2>
            <p className="text-sm text-muted-foreground">
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
                  className={`rounded-xl border transition-all flex items-start gap-3 p-4 ${
                    isUnread
                      ? "bg-primary/10 border-indigo-500/30"
                      : "bg-card border-border"
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
                    {notif.data.username && (
                      <Link
                        to={`/users/${encodeURIComponent(notif.data.username)}`}
                        className="font-semibold text-indigo-400 hover:text-indigo-300 text-sm no-underline"
                      >
                        {notif.data.username}
                      </Link>
                    )}{" "}
                    <span
                      className={`text-sm ${isUnread ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {notif.data.username
                        ? notif.data.message.replace(
                            new RegExp(`^${notif.data.username}\\s*`),
                            "",
                          )
                        : notif.data.message}
                    </span>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(notif.created_at)}
                      </span>
                      {isUnread && (
                        <button
                          onClick={() => handleMarkAsRead(notif.id)}
                          className="text-xs text-indigo-400 hover:underline"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right side: View/Review link + Delete */}
                  <div className="flex items-center gap-2 shrink-0">
                    {isReportNotif && isAdmin && notif.data.report_id && (
                      <Link
                        to={`/admin/reports/${notif.data.report_id}`}
                        className="text-xs font-bold text-white hover:opacity-90 px-2.5 py-1 rounded bg-red-600 no-underline uppercase tracking-wide"
                      >
                        Review
                      </Link>
                    )}

                    {!isReportNotif && notif.data.post_id && (
                      <Link
                        to={`/thread/${notif.data.post_id}`}
                        className="text-xs font-bold text-indigo-300 hover:bg-indigo-500/20 px-2.5 py-1 rounded bg-muted no-underline uppercase tracking-wide"
                      >
                        View
                      </Link>
                    )}

                    <button
                      onClick={() => handleDelete(notif.id)}
                      className="text-muted-foreground hover:text-foreground text-lg transition-colors p-1 rounded"
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
      <Footer />
    </div>
  );
};
