import React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../../../components/Navbar";
import { Button } from "../../../components/common/Button";
import { RoleBadge } from "../../../components/common/RoleBadge";
import { ThreadCard } from "../../../components/ThreadCard";
import { useProfilePage } from "../logic/ProfilePage";
import { HiUser, HiCamera, HiX } from "react-icons/hi";

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
    formik,
    handleLevelChange,
    handleLogout,
  } = useProfilePage();

  if (!authUser) {
    return (
      <div className="bg-[#0d0d0d] min-h-screen text-neutral-100">
        <Navbar />
        <div className="text-center mt-12 text-neutral-500">
          Please <Link to="/login" className="text-indigo-400 hover:text-indigo-300">log in</Link> to view your profile.
        </div>
      </div>
    );
  }

  const avatarSrc = avatarPreview || authUser.avatar_url || null;

  return (
    <div className="bg-[#0d0d0d] min-h-screen text-neutral-100">
      <Navbar />
      <main className="max-w-[800px] mx-auto py-8 px-4">
        {/* Profile Card */}
        <div
          style={{
            backgroundColor: "#1a1a1a",
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
              backgroundColor: "#2a2a2a",
              margin: "0 auto 1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "3rem",
              color: "#525252",
              overflow: "hidden",
            }}
          >
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt="avatar"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <HiUser />
            )}
          </div>

          {/* Role badge */}
          <div style={{ marginBottom: "0.5rem" }}>
            <RoleBadge role={authUser.level} />
          </div>

          {/* Rank badge */}
          <div style={{ marginBottom: "1rem" }}>
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
              {rankName}
            </span>
          </div>

          <h1 style={{ margin: "0 0 0.25rem 0", fontSize: "1.5rem", color: "#e5e5e5" }}>
            {authUser.username}
          </h1>
          <p style={{ color: "#737373", marginBottom: "1rem", fontSize: "0.9rem" }}>
            {authUser.email}
          </p>
          <p style={{ maxWidth: "500px", margin: "0 auto 1.5rem", color: "#a3a3a3" }}>
            {authUser.bio ? (
              authUser.bio
            ) : (
              <span style={{ fontStyle: "italic", color: "#525252" }}>
                No bio yet. Click Edit Profile to add one.
              </span>
            )}
          </p>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "3rem",
              marginBottom: "2rem",
              padding: "1rem 0",
              borderTop: "1px solid #2a2a2a",
              borderBottom: "1px solid #2a2a2a",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#818cf8" }}>
                {reputation.toLocaleString()}
              </div>
              <div style={{ fontSize: "0.7rem", color: "#737373", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Reputation
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#818cf8" }}>
                {myThreads.length}
              </div>
              <div style={{ fontSize: "0.7rem", color: "#737373", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Threads
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#818cf8' }}>
                {authUser.followers_count ?? 0}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#737373', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Followers
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#818cf8' }}>
                {authUser.following_count ?? 0}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#737373', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Following
              </div>
            </div>
          </div>

          {/* Demo role switcher */}
          <div
            style={{
              marginBottom: "2rem",
              padding: "1rem",
              backgroundColor: "#222",
              borderRadius: "8px",
              border: "1px dashed #404040",
            }}
          >
            <label
              style={{
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#a3a3a3",
                display: "block",
                marginBottom: "0.5rem",
              }}
            >
              [Demo Only] Switch Current Role:
            </label>
            <select
              value={authUser.level}
              onChange={handleLevelChange}
              style={{
                padding: "0.4rem",
                borderRadius: "6px",
                border: "1px solid #404040",
                fontSize: "0.875rem",
                backgroundColor: "#1a1a1a",
                color: "#e5e5e5",
              }}
            >
              <option value="user">Regular User</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
            <Button variant="outline" onClick={openEdit}>
              Edit Profile
            </Button>
            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        {/* My Threads */}
        <div style={{ marginTop: "3rem" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>
            My Threads ({myThreads.length})
          </h2>
          {isLoadingThreads ? (
            <p style={{ color: "#737373" }}>Loading your threads...</p>
          ) : myThreads.length > 0 ? (
            myThreads.map((thread) => (
              <ThreadCard key={thread.id} thread={thread} />
            ))
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                backgroundColor: "#1a1a1a",
                border: "1px solid #2a2a2a",
                borderRadius: "12px",
              }}
            >
              <p style={{ color: "#737373", marginBottom: "1rem" }}>
                You haven't posted any threads yet.
              </p>
              <Link
                to="/create-thread"
                style={{
                  backgroundColor: "#6366f1",
                  color: "white",
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                }}
              >
                Ask a Question
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* ── Edit Profile Modal ── */}
      {isEditOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeEdit();
          }}
        >
          <div
            style={{
              backgroundColor: "#1a1a1a",
              borderRadius: "12px",
              width: "100%",
              maxWidth: "480px",
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              border: "1px solid #2a2a2a",
            }}
          >
            {/* Modal header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1.25rem 1.5rem",
                borderBottom: "1px solid #2a2a2a",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600, color: "#e5e5e5" }}>
                Edit Profile
              </h2>
              <button
                type="button"
                onClick={closeEdit}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#737373",
                  fontSize: "1.25rem",
                  display: "flex",
                }}
              >
                <HiX />
              </button>
            </div>
            {/* Modal body */}
            <form onSubmit={formik.handleSubmit} style={{ padding: "1.5rem" }}>
              {/* Avatar upload */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginBottom: "1.5rem",
                }}
              >
                <div style={{ position: "relative", marginBottom: "0.75rem" }}>
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      backgroundColor: "#2a2a2a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "2.5rem",
                      color: "#525252",
                      overflow: "hidden",
                    }}
                  >
                    {avatarPreview || authUser.avatar_url ? (
                      <img
                        src={avatarPreview || authUser.avatar_url!}
                        alt="preview"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <HiUser />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      backgroundColor: "#6366f1",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "26px",
                      height: "26px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.8rem",
                    }}
                    title="Change avatar"
                  >
                    <HiCamera />
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  style={{ display: "none" }}
                  onChange={handleAvatarChange}
                />
                <span style={{ fontSize: "0.75rem", color: "#525252" }}>
                  JPEG / PNG, maks 2MB
                </span>
                {avatarError && (
                  <span style={{ fontSize: "0.75rem", color: "#f87171", marginTop: "0.25rem" }}>
                    {avatarError}
                  </span>
                )}
              </div>

              {/* Username */}
              <div style={{ marginBottom: "1.25rem" }}>
                <label
                  htmlFor="username"
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "#a3a3a3",
                    marginBottom: "0.5rem",
                  }}
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Username kamu"
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.75rem",
                    border: `1px solid ${formik.touched.username && formik.errors.username ? "#f87171" : "#333"}`,
                    borderRadius: "6px",
                    fontSize: "0.875rem",
                    boxSizing: "border-box",
                    outline: "none",
                    backgroundColor: "#0d0d0d",
                    color: "#e5e5e5",
                  }}
                />
                {formik.touched.username && formik.errors.username && (
                  <div style={{ fontSize: "0.75rem", color: "#f87171", marginTop: "0.25rem" }}>
                    {formik.errors.username}
                  </div>
                )}
              </div>

              {/* Bio */}
              <div style={{ marginBottom: "1.25rem" }}>
                <label
                  htmlFor="bio"
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "#a3a3a3",
                    marginBottom: "0.5rem",
                  }}
                >
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formik.values.bio}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  maxLength={500}
                  rows={4}
                  placeholder="Ceritakan sedikit tentang dirimu..."
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.75rem",
                    border: `1px solid ${formik.touched.bio && formik.errors.bio ? "#f87171" : "#333"}`,
                    borderRadius: "6px",
                    fontSize: "0.875rem",
                    resize: "vertical",
                    boxSizing: "border-box",
                    outline: "none",
                    backgroundColor: "#0d0d0d",
                    color: "#e5e5e5",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.75rem",
                    color: "#525252",
                  }}
                >
                  <span style={{ color: "#f87171" }}>
                    {formik.touched.bio && formik.errors.bio}
                  </span>
                  <span>{formik.values.bio.length}/500</span>
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: "1.25rem" }}>
                <label
                  htmlFor="password"
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "#a3a3a3",
                    marginBottom: "0.5rem",
                  }}
                >
                  Password Baru{" "}
                  <span style={{ color: "#525252", fontWeight: 400 }}>
                    (opsional)
                  </span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Kosongkan jika tidak ingin mengubah"
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.75rem",
                    border: `1px solid ${formik.touched.password && formik.errors.password ? "#f87171" : "#333"}`,
                    borderRadius: "6px",
                    fontSize: "0.875rem",
                    boxSizing: "border-box",
                    outline: "none",
                    backgroundColor: "#0d0d0d",
                    color: "#e5e5e5",
                  }}
                />
                {formik.touched.password && formik.errors.password && (
                  <div style={{ fontSize: "0.75rem", color: "#f87171", marginTop: "0.25rem" }}>
                    {formik.errors.password}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              {formik.values.password && (
                <div style={{ marginBottom: "1.25rem" }}>
                  <label
                    htmlFor="confirmPassword"
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: "#a3a3a3",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Konfirmasi Password Baru
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Ulangi password baru"
                    style={{
                      width: "100%",
                      padding: "0.6rem 0.75rem",
                      border: `1px solid ${formik.touched.confirmPassword && formik.errors.confirmPassword ? "#f87171" : "#333"}`,
                      borderRadius: "6px",
                      fontSize: "0.875rem",
                      boxSizing: "border-box",
                      outline: "none",
                      backgroundColor: "#0d0d0d",
                      color: "#e5e5e5",
                    }}
                  />
                  {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword && (
                      <div style={{ fontSize: "0.75rem", color: "#f87171", marginTop: "0.25rem" }}>
                        {formik.errors.confirmPassword}
                      </div>
                    )}
                </div>
              )}

              {/* Read-only info */}
              <div
                style={{
                  backgroundColor: "#222",
                  borderRadius: "6px",
                  padding: "0.75rem 1rem",
                  marginBottom: "1.5rem",
                  fontSize: "0.8rem",
                  color: "#737373",
                }}
              >
                <div>
                  <strong>Email:</strong> {authUser.email}{" "}
                  <span style={{ color: "#525252" }}>(tidak bisa diubah)</span>
                </div>
              </div>

              {/* Success */}
              {saveSuccess && (
                <div
                  style={{
                    backgroundColor: "rgba(74,222,128,0.1)",
                    border: "1px solid rgba(74,222,128,0.3)",
                    borderRadius: "6px",
                    padding: "0.6rem 0.75rem",
                    marginBottom: "1rem",
                    fontSize: "0.875rem",
                    color: "#4ade80",
                  }}
                >
                  {saveSuccess}
                </div>
              )}

              {/* Error */}
              {saveError && (
                <div
                  style={{
                    backgroundColor: "rgba(248,113,113,0.1)",
                    border: "1px solid rgba(248,113,113,0.3)",
                    borderRadius: "6px",
                    padding: "0.6rem 0.75rem",
                    marginBottom: "1rem",
                    fontSize: "0.875rem",
                    color: "#f87171",
                  }}
                >
                  {saveError}
                </div>
              )}

              {/* Footer buttons */}
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeEdit}
                  disabled={formik.isSubmitting}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  isLoading={formik.isSubmitting}
                  disabled={formik.isSubmitting}
                >
                  Simpan
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
