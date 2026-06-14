import React, { useState } from "react";
import { Navbar } from "../../../components/Navbar";
import { RoleBadge } from "../../../components/common/RoleBadge";
import { ThreadCard } from "../../../components/ThreadCard";
import { useUserProfilePage } from "../logic/UserProfilePage";
import { ReportModal } from "../../../components/common/ReportModal";
import { HiUser, HiUserAdd, HiUserRemove } from "react-icons/hi";
import { resolveAvatarUrl } from "../../../utils/constants";
import { Skeleton } from "../../../components/ui/skeleton";
import { Footer } from "../../../components/Footer";

export const UserProfilePage: React.FC = () => {
  const {
    profile,
    isLoading,
    notFound,
    isAuthenticated,
    isOwnProfile,
    isFollowing,
    followersCount,
    isFollowLoading,
    handleToggleFollow,
    canAssignRole,
    selectedRole,
    setSelectedRole,
    isRoleUpdating,
    roleMessage,
    roleError,
    handleAssignRole,
  } = useUserProfilePage();

  const [isReportOpen, setIsReportOpen] = useState(false);

  if (isLoading)
    return (
      <div className="bg-background min-h-screen text-foreground">
        <Navbar />
        <main className="max-w-[800px] mx-auto py-8 px-4 space-y-6">
          <div className="bg-card border border-border rounded-xl p-8 space-y-4">
            <div className="flex flex-col items-center gap-3">
              <Skeleton className="size-20 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-4 w-20 rounded-full" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="flex justify-center gap-12 py-4 border-y border-border">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <Skeleton className="h-5 w-10" />
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-3">
              <Skeleton className="h-9 w-28 rounded-lg" />
            </div>
          </div>
        </main>
      </div>
    );

  if (notFound || !profile)
    return (
      <div className="bg-background min-h-screen text-foreground">
        <Navbar />
        <div className="text-center mt-12 text-muted-foreground">
          User tidak ditemukan.
        </div>
      </div>
    );

  const { user, threads } = profile;
  const avatarSrc = resolveAvatarUrl(user.avatar_url);

  return (
    <div className="bg-background min-h-screen text-foreground">
      <Navbar />
      <main
        style={{ maxWidth: "800px", margin: "2rem auto", padding: "0 1rem" }}
      >
        {/* Profile Card */}
        <div
          style={{
            backgroundColor: "var(--card)",
            padding: "2rem",
            borderRadius: "12px",
            border: "1px solid #2a2a2a",
            textAlign: "center",
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              backgroundColor: "var(--border)",
              margin: "0 auto 1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "3rem",
              color: "var(--muted-foreground)",
              overflow: "hidden",
            }}
          >
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={user.username}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <HiUser />
            )}
          </div>

          {/* Badges */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "0.5rem",
              marginBottom: "1rem",
              flexWrap: "wrap",
            }}
          >
            <RoleBadge role={user.level} />
            <span
              style={{
                display: "inline-block",
                backgroundColor: "rgba(251,191,36,0.15)",
                color: "#fbbf24",
                fontSize: "0.75rem",
                fontWeight: 600,
                padding: "0.2rem 0.75rem",
                borderRadius: "9999px",
                border: "1px solid rgba(251,191,36,0.3)",
              }}
            >
              {user.rank_level}
            </span>
          </div>

          <h1 style={{ margin: "0 0 0.5rem 0", fontSize: "1.5rem", color: "var(--foreground)" }}>
            {user.username}
          </h1>

          {user.bio && (
            <p
              style={{
                maxWidth: "500px",
                margin: "0 auto 1.25rem",
                color: "var(--muted-foreground)",
                fontSize: "0.9rem",
              }}
            >
              {user.bio}
            </p>
          )}

          {/* Follow & Report buttons */}
          {isAuthenticated && !isOwnProfile && (
            <div
              style={{
                marginBottom: "1.5rem",
                display: "flex",
                justifyContent: "center",
                gap: "0.75rem",
              }}
            >
              <button
                onClick={handleToggleFollow}
                disabled={isFollowLoading}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.5rem 1.25rem",
                  borderRadius: "6px",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  cursor: isFollowLoading ? "not-allowed" : "pointer",
                  border: "1px solid",
                  transition: "all 0.15s",
                  backgroundColor: isFollowing ? "transparent" : "#6366f1",
                  color: isFollowing ? "#f87171" : "#ffffff",
                  borderColor: isFollowing ? "#f87171" : "#6366f1",
                  opacity: isFollowLoading ? 0.7 : 1,
                }}
              >
                {isFollowing ? <HiUserRemove /> : <HiUserAdd />}
                {isFollowLoading ? "..." : isFollowing ? "Unfollow" : "Follow"}
              </button>

              <button
                onClick={() => setIsReportOpen(true)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.5rem 1.25rem",
                  borderRadius: "6px",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  border: "1px solid #dc2626",
                  backgroundColor: "transparent",
                  color: "#f87171",
                  transition: "all 0.15s",
                }}
              >
                🚩 Laporkan
              </button>
            </div>
          )}

          {/* Admin: Role Switcher */}
          {canAssignRole && (
            <div
              style={{
                marginTop: "1rem",
                marginBottom: "1rem",
                padding: "1rem",
                borderTop: "1px solid #2a2a2a",
                borderBottom: "1px solid #2a2a2a",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.75rem",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "var(--foreground)",
                  }}
                >
                  Change Role:
                </span>
                <select
                  value={selectedRole}
                  onChange={(e) =>
                    setSelectedRole(e.target.value as "user" | "moderator" | "admin")
                  }
                  style={{
                    padding: "0.4rem 0.75rem",
                    borderRadius: "6px",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                    fontSize: "0.875rem",
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
                <button
                  onClick={handleAssignRole}
                  disabled={isRoleUpdating}
                  style={{
                    padding: "0.4rem 1rem",
                    borderRadius: "6px",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    border: "none",
                    backgroundColor: "#6366f1",
                    color: "#ffffff",
                    cursor: isRoleUpdating ? "not-allowed" : "pointer",
                    opacity: isRoleUpdating ? 0.7 : 1,
                  }}
                >
                  {isRoleUpdating ? "Updating..." : "Update Role"}
                </button>
              </div>
              {roleMessage && (
                <p
                  style={{
                    margin: "0.5rem 0 0",
                    fontSize: "0.8rem",
                    color: "#4ade80",
                    textAlign: "center",
                  }}
                >
                  {roleMessage}
                </p>
              )}
              {roleError && (
                <p
                  style={{
                    margin: "0.5rem 0 0",
                    fontSize: "0.8rem",
                    color: "#f87171",
                    textAlign: "center",
                  }}
                >
                  {roleError}
                </p>
              )}
            </div>
          )}

          {/* Stats */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "2.5rem",
              padding: "1rem 0",
              borderTop: "1px solid #2a2a2a",
              borderBottom: "1px solid #2a2a2a",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#818cf8" }}>
                {(user.reputation_points ?? 0).toLocaleString()}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Reputation
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#818cf8" }}>
                {threads.length}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Threads
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#818cf8" }}>
                {followersCount}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Followers
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#818cf8" }}>
                {user.following_count ?? 0}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Following
              </div>
            </div>
          </div>
        </div>

        {/* Threads */}
        <div style={{ marginTop: "3rem" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>
            Threads by {user.username} ({threads.length})
          </h2>
          {threads.length > 0 ? (
            threads.map((thread) => (
              <ThreadCard key={thread.id} thread={thread} />
            ))
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                backgroundColor: "var(--card)",
                border: "1px solid #2a2a2a",
                borderRadius: "12px",
              }}
            >
              <p style={{ color: "var(--muted-foreground)" }}>User ini belum punya threads.</p>
            </div>
          )}
        </div>
      </main>

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        targetId={user.id}
        targetType="user"
        targetTitle={`User: ${user.username}`}
      />
      <Footer />
    </div>
  );
};
