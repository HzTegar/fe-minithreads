import React, { useState } from "react";
import { Navbar } from "../../../components/Navbar";
import { RoleBadge } from "../../../components/common/RoleBadge";
import { ThreadCard } from "../../../components/ThreadCard";
import { useUserProfilePage } from "../logic/UserProfilePage";
import { ReportModal } from "../../../components/common/ReportModal";
import { HiUser, HiUserAdd, HiUserRemove } from "react-icons/hi";
import { resolveAvatarUrl } from "../../../utils/constants";

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
  } = useUserProfilePage();

  const [isReportOpen, setIsReportOpen] = useState(false);

  if (isLoading)
    return (
      <div className="bg-background min-h-screen text-foreground">
        <Navbar />
        <div className="text-center mt-12 text-muted-foreground">
          Loading profile...
        </div>
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
    </div>
  );
};
