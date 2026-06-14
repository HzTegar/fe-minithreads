import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "../../../components/Navbar";
import { Button } from "../../../components/common/Button";
import { RoleBadge } from "../../../components/common/RoleBadge";
import { ThreadCard } from "../../../components/ThreadCard";
import { useProfilePage } from "../logic/ProfilePage";
import { HiUser, HiCamera, HiX, HiBookmark, HiCollection, HiSearch, HiHeart, HiPencilAlt } from "react-icons/hi";
import { resolveAvatarUrl } from "../../../utils/constants";
import { bookmarkService } from "../../../services/bookmarkService";
import { threadService } from "../../../services/threadService";
import type { Thread } from "../../../types/thread.type";

export const ProfilePage: React.FC = () => {
  const {
    authUser,
    reputation,
    rankName,
    myThreads,
    isLoadingThreads,
    isEditOpen,
    avatarPreview,
    avatarError,
    fileInputRef,
    saveError,
    saveSuccess,
    openEdit,
    closeEdit,
    handleAvatarChange,
    handleAskQuestion, // 👈 tambahan
    formik,
    handleLogout,
  } = useProfilePage();

  const [activeTab, setActiveTab] = useState<"threads" | "bookmarks" | "liked">("threads");

  // ── Bookmarks query ──
  const { data: bookmarks = [], isLoading: isLoadingBookmarks } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: async () => {
      const response: any = await bookmarkService.getAll();
      return (response.data?.data || response.data || []).map((b: any) => b.post || b);
    },
    enabled: activeTab === "bookmarks",
  });

  // ── Liked posts query ──
  const { data: likedThreads = [], isLoading: isLoadingLiked } = useQuery({
    queryKey: ["liked-threads", authUser?.username],
    queryFn: async () => {
      const response: any = await threadService.getAll({ liked_by: authUser?.username } as any);
      return Array.isArray(response) ? response : [];
    },
    enabled: activeTab === "liked" && !!authUser?.username,
  });

  if (!authUser) {
    return (
      <div className="bg-background min-h-screen text-foreground">
        <Navbar />
        <div className="text-center mt-12 text-muted-foreground">
          Please{" "}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300">
            log in
          </Link>{" "}
          to view your profile.
        </div>
      </div>
    );
  }

  const avatarSrc = avatarPreview || resolveAvatarUrl(authUser.avatar_url);

  const tabStyle = (active: boolean): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    padding: "0.6rem 1.2rem",
    fontSize: "0.9rem",
    fontWeight: 600,
    cursor: "pointer",
    background: "none",
    border: "none",
    borderBottom: active ? "2px solid #818cf8" : "2px solid transparent",
    color: active ? "#818cf8" : "var(--muted-foreground)",
    transition: "all 0.15s",
    marginBottom: "-1px",
  });

  const emptyBox = (children: React.ReactNode) => (
    <div style={{ textAlign: "center", padding: "2.5rem", backgroundColor: "var(--card)", border: "1px solid #2a2a2a", borderRadius: "12px" }}>
      {children}
    </div>
  );

  return (
    <div className="bg-background min-h-screen text-foreground">
      <Navbar />
      <main className="max-w-[800px] mx-auto py-8 px-4">

        {/* ── Profile Card ── */}
        <div style={{ backgroundColor: "var(--card)", padding: "2rem", borderRadius: "12px", border: "1px solid #2a2a2a", textAlign: "center" }}>

          {/* Avatar */}
          <div style={{ width: "100px", height: "100px", borderRadius: "50%", backgroundColor: "var(--border)", margin: "0 auto 1rem", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem", color: "var(--muted-foreground)", overflow: "hidden" }}>
            {avatarSrc ? (
              <img src={avatarSrc} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <HiUser />
            )}
          </div>

          {/* Badges */}
          <div style={{ marginBottom: "0.5rem" }}>
            <RoleBadge role={authUser.level} />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <span style={{ display: "inline-block", backgroundColor: "rgba(251,191,36,0.15)", color: "#fbbf24", fontSize: "0.75rem", fontWeight: 600, padding: "0.2rem 0.75rem", borderRadius: "9999px", border: "1px solid rgba(251,191,36,0.3)" }}>
              {rankName}
            </span>
          </div>

          <h1 style={{ margin: "0 0 0.25rem 0", fontSize: "1.5rem", color: "var(--foreground)" }}>{authUser.username}</h1>
          <p style={{ color: "var(--muted-foreground)", marginBottom: "1rem", fontSize: "0.9rem" }}>{authUser.email}</p>
          <p style={{ maxWidth: "500px", margin: "0 auto 1.5rem", color: "var(--muted-foreground)" }}>
            {authUser.bio ? authUser.bio : (
              <span style={{ fontStyle: "italic", color: "var(--muted-foreground)" }}>No bio yet. Click Edit Profile to add one.</span>
            )}
          </p>

          {/* Stats */}
          <div style={{ display: "flex", justifyContent: "center", gap: "3rem", marginBottom: "2rem", padding: "1rem 0", borderTop: "1px solid #2a2a2a", borderBottom: "1px solid #2a2a2a" }}>
            {[
              { label: "Reputation", value: reputation.toLocaleString() },
              { label: "Threads", value: myThreads.length },
              { label: "Followers", value: authUser.followers_count ?? 0 },
              { label: "Following", value: authUser.following_count ?? 0 },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#818cf8" }}>{stat.value}</div>
                <div style={{ fontSize: "0.7rem", color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            <Button variant="outline" onClick={openEdit}>Edit Profile</Button>
            {/* 👇 Button Ask Question */}
            <Button variant="primary" onClick={handleAskQuestion}>
              <HiPencilAlt style={{ marginRight: "0.4rem", fontSize: "1rem" }} />
              Ask Question
            </Button>
            <Button variant="danger" onClick={handleLogout}>Logout</Button>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div style={{ marginTop: "3rem" }}>
          <div style={{ display: "flex", gap: "0.25rem", borderBottom: "1px solid #2a2a2a", marginBottom: "1.5rem" }}>
            <button onClick={() => setActiveTab("threads")} style={tabStyle(activeTab === "threads")}>
              <HiCollection style={{ fontSize: "1rem" }} />
              My Threads ({myThreads.length})
            </button>
            <button onClick={() => setActiveTab("bookmarks")} style={tabStyle(activeTab === "bookmarks")}>
              <HiBookmark style={{ fontSize: "1rem" }} />
              Bookmarks
            </button>
            <button onClick={() => setActiveTab("liked")} style={tabStyle(activeTab === "liked")}>
              <HiHeart style={{ fontSize: "1rem" }} />
              Liked
            </button>
          </div>

          {/* Tab: Threads */}
          {activeTab === "threads" && (
            isLoadingThreads ? (
              <p style={{ color: "var(--muted-foreground)" }}>Loading your threads...</p>
            ) : myThreads.length > 0 ? (
              myThreads.map((thread) => <ThreadCard key={thread.id} thread={thread} />)
            ) : (
              emptyBox(
                <>
                  <p style={{ color: "var(--muted-foreground)", marginBottom: "1rem" }}>You haven't posted any threads yet.</p>
                  <Link to="/create-thread" style={{ backgroundColor: "#6366f1", color: "white", padding: "0.5rem 1.25rem", borderRadius: "6px", textDecoration: "none", fontSize: "0.875rem" }}>
                    Ask a Question
                  </Link>
                </>
              )
            )
          )}

          {/* Tab: Bookmarks */}
          {activeTab === "bookmarks" && (
            isLoadingBookmarks ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "var(--muted-foreground)" }}>
                Loading your bookmarks...
              </div>
            ) : (bookmarks as Thread[]).length > 0 ? (
              (bookmarks as Thread[]).map((thread) => <ThreadCard key={thread.id} thread={thread} />)
            ) : (
              emptyBox(
                <>
                  <HiBookmark style={{ fontSize: "2.5rem", color: "var(--muted-foreground)", marginBottom: "0.75rem" }} />
                  <p style={{ color: "var(--muted-foreground)", marginBottom: "1.25rem" }}>
                    No bookmarks yet. Save threads to see them here!
                  </p>
                  <Link
                    to="/"
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", backgroundColor: "#6366f1", color: "white", padding: "0.5rem 1.25rem", borderRadius: "6px", textDecoration: "none", fontSize: "0.875rem", fontWeight: 600 }}
                  >
                    <HiSearch style={{ fontSize: "1rem" }} />
                    Explore Threads
                  </Link>
                </>
              )
            )
          )}

          {/* Tab: Liked */}
          {activeTab === "liked" && (
            isLoadingLiked ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "var(--muted-foreground)" }}>
                Loading liked threads...
              </div>
            ) : (likedThreads as Thread[]).length > 0 ? (
              (likedThreads as Thread[]).map((thread) => <ThreadCard key={thread.id} thread={thread} />)
            ) : (
              emptyBox(
                <>
                  <HiHeart style={{ fontSize: "2.5rem", color: "var(--muted-foreground)", marginBottom: "0.75rem" }} />
                  <p style={{ color: "var(--muted-foreground)", marginBottom: "1.25rem" }}>
                    Belum ada thread yang kamu like.
                  </p>
                  <Link
                    to="/"
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", backgroundColor: "#6366f1", color: "white", padding: "0.5rem 1.25rem", borderRadius: "6px", textDecoration: "none", fontSize: "0.875rem", fontWeight: 600 }}
                  >
                    <HiSearch style={{ fontSize: "1rem" }} />
                    Explore Threads
                  </Link>
                </>
              )
            )
          )}
        </div>
      </main>

      {/* ── Edit Profile Modal ── */}
      {isEditOpen && (
        <div
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}
          onClick={(e) => { if (e.target === e.currentTarget) closeEdit(); }}
        >
          <div style={{ backgroundColor: "var(--card)", borderRadius: "12px", width: "100%", maxWidth: "480px", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.5)", border: "1px solid #2a2a2a" }}>
            {/* Modal header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 1.5rem", borderBottom: "1px solid #2a2a2a" }}>
              <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600, color: "var(--foreground)" }}>Edit Profile</h2>
              <button type="button" onClick={closeEdit} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)", fontSize: "1.25rem", display: "flex" }}>
                <HiX />
              </button>
            </div>

            {/* Modal body */}
            <form onSubmit={formik.handleSubmit} style={{ padding: "1.5rem" }}>
              {/* Avatar upload */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "1.5rem" }}>
                <div style={{ position: "relative", marginBottom: "0.75rem" }}>
                  <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", color: "var(--muted-foreground)", overflow: "hidden" }}>
                    {avatarPreview || resolveAvatarUrl(authUser.avatar_url) ? (
                      <img src={avatarPreview || resolveAvatarUrl(authUser.avatar_url)!} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : <HiUser />}
                  </div>
                  <button type="button" onClick={() => fileInputRef.current?.click()} style={{ position: "absolute", bottom: 0, right: 0, backgroundColor: "#6366f1", color: "white", border: "none", borderRadius: "50%", width: "26px", height: "26px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem" }} title="Change avatar">
                    <HiCamera />
                  </button>
                </div>
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/jpg" style={{ display: "none" }} onChange={handleAvatarChange} />
                <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>JPEG / PNG, maks 2MB</span>
                {avatarError && <span style={{ fontSize: "0.75rem", color: "#f87171", marginTop: "0.25rem" }}>{avatarError}</span>}
              </div>

              {/* Username */}
              <div style={{ marginBottom: "1.25rem" }}>
                <label htmlFor="username" style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "var(--muted-foreground)", marginBottom: "0.5rem" }}>Username</label>
                <input id="username" name="username" type="text" value={formik.values.username} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Username kamu"
                  style={{ width: "100%", padding: "0.6rem 0.75rem", border: `1px solid ${formik.touched.username && formik.errors.username ? "#f87171" : "var(--border)"}`, borderRadius: "6px", fontSize: "0.875rem", boxSizing: "border-box", outline: "none", backgroundColor: "var(--background)", color: "var(--foreground)" }} />
                {formik.touched.username && formik.errors.username && <div style={{ fontSize: "0.75rem", color: "#f87171", marginTop: "0.25rem" }}>{formik.errors.username}</div>}
              </div>

              {/* Bio */}
              <div style={{ marginBottom: "1.25rem" }}>
                <label htmlFor="bio" style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "var(--muted-foreground)", marginBottom: "0.5rem" }}>Bio</label>
                <textarea id="bio" name="bio" value={formik.values.bio} onChange={formik.handleChange} onBlur={formik.handleBlur} maxLength={500} rows={4} placeholder="Ceritakan sedikit tentang dirimu..."
                  style={{ width: "100%", padding: "0.6rem 0.75rem", border: `1px solid ${formik.touched.bio && formik.errors.bio ? "#f87171" : "var(--border)"}`, borderRadius: "6px", fontSize: "0.875rem", resize: "vertical", boxSizing: "border-box", outline: "none", backgroundColor: "var(--background)", color: "var(--foreground)" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
                  <span style={{ color: "#f87171" }}>{formik.touched.bio && formik.errors.bio}</span>
                  <span>{formik.values.bio.length}/500</span>
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: "1.25rem" }}>
                <label htmlFor="password" style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "var(--muted-foreground)", marginBottom: "0.5rem" }}>
                  Password Baru <span style={{ fontWeight: 400 }}>(opsional)</span>
                </label>
                <input id="password" name="password" type="password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Kosongkan jika tidak ingin mengubah"
                  style={{ width: "100%", padding: "0.6rem 0.75rem", border: `1px solid ${formik.touched.password && formik.errors.password ? "#f87171" : "var(--border)"}`, borderRadius: "6px", fontSize: "0.875rem", boxSizing: "border-box", outline: "none", backgroundColor: "var(--background)", color: "var(--foreground)" }} />
                {formik.touched.password && formik.errors.password && <div style={{ fontSize: "0.75rem", color: "#f87171", marginTop: "0.25rem" }}>{formik.errors.password}</div>}
              </div>

              {/* Confirm Password */}
              {formik.values.password && (
                <div style={{ marginBottom: "1.25rem" }}>
                  <label htmlFor="confirmPassword" style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "var(--muted-foreground)", marginBottom: "0.5rem" }}>Konfirmasi Password Baru</label>
                  <input id="confirmPassword" name="confirmPassword" type="password" value={formik.values.confirmPassword} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Ulangi password baru"
                    style={{ width: "100%", padding: "0.6rem 0.75rem", border: `1px solid ${formik.touched.confirmPassword && formik.errors.confirmPassword ? "#f87171" : "var(--border)"}`, borderRadius: "6px", fontSize: "0.875rem", boxSizing: "border-box", outline: "none", backgroundColor: "var(--background)", color: "var(--foreground)" }} />
                  {formik.touched.confirmPassword && formik.errors.confirmPassword && <div style={{ fontSize: "0.75rem", color: "#f87171", marginTop: "0.25rem" }}>{formik.errors.confirmPassword}</div>}
                </div>
              )}

              {/* Read-only info */}
              <div style={{ backgroundColor: "var(--card)", borderRadius: "6px", padding: "0.75rem 1rem", marginBottom: "1.5rem", fontSize: "0.8rem", color: "var(--muted-foreground)" }}>
                <strong>Email:</strong> {authUser.email} <span>(tidak bisa diubah)</span>
              </div>

              {saveSuccess && <div style={{ backgroundColor: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: "6px", padding: "0.6rem 0.75rem", marginBottom: "1rem", fontSize: "0.875rem", color: "#4ade80" }}>{saveSuccess}</div>}
              {saveError && <div style={{ backgroundColor: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: "6px", padding: "0.6rem 0.75rem", marginBottom: "1rem", fontSize: "0.875rem", color: "#f87171" }}>{saveError}</div>}

              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                <Button type="button" variant="outline" onClick={closeEdit} disabled={formik.isSubmitting}>Batal</Button>
                <Button type="submit" isLoading={formik.isSubmitting} disabled={formik.isSubmitting}>Simpan</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};