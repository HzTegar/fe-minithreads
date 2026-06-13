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
    formik,
    isEditOpen,
    avatarPreview,
    avatarError,
    fileInputRef,
<<<<<<< HEAD
    openEdit,
    closeEdit,
    handleAvatarChange,
    formik,
=======
    saveError,
    saveSuccess,
    openEdit,
    closeEdit,
    handleAvatarChange,
>>>>>>> origin/najwa-dev
    handleLevelChange,
    handleLogout,
  } = useProfilePage();

  if (!authUser) {
    return (
      <div>
        <Navbar />
        <div
          style={{ textAlign: "center", marginTop: "3rem", color: "#6b7280" }}
        >
          Please <Link to="/login">log in</Link> to view your profile.
        </div>
      </div>
    );
  }

  const avatarSrc = avatarPreview || authUser.avatar_url || null;

  return (
    <div style={{ backgroundColor: "#f8f9f9", minHeight: "100vh" }}>
      <Navbar />
      <main
        style={{ maxWidth: "800px", margin: "2rem auto", padding: "0 1rem" }}
      >
        {/* Profile Card */}
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "2rem",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            textAlign: "center",
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              backgroundColor: "#e5e7eb",
              margin: "0 auto 1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "3rem",
              color: "#6b7280",
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
                backgroundColor: "#fef3c7",
                color: "#92400e",
                fontSize: "0.75rem",
                fontWeight: 600,
                padding: "0.2rem 0.75rem",
                borderRadius: "9999px",
                border: "1px solid #fde68a",
              }}
            >
              {rankName}
            </span>
          </div>

          <h1 style={{ margin: "0 0 0.25rem 0", fontSize: "1.5rem" }}>
            {authUser.username}
          </h1>
          <p
            style={{
              color: "#6b7280",
              marginBottom: "1rem",
              fontSize: "0.9rem",
            }}
          >
            {authUser.email}
          </p>
          <p
            style={{
              maxWidth: "500px",
              margin: "0 auto 1.5rem",
              color: "#4b5563",
            }}
          >
            {authUser.bio ? (
              authUser.bio
            ) : (
              <span style={{ fontStyle: "italic", color: "#9ca3af" }}>
                No bio yet. Click Edit Profile to add one.
              </span>
            )}
          </p>

          {/* Stats row */}
<<<<<<< HEAD
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem', padding: '1rem 0', borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#2563eb' }}>
=======
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "3rem",
              marginBottom: "2rem",
              padding: "1rem 0",
              borderTop: "1px solid #f3f4f6",
              borderBottom: "1px solid #f3f4f6",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  color: "#2563eb",
                }}
              >
>>>>>>> origin/najwa-dev
                {reputation.toLocaleString()}
              </div>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "#6b7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Reputation
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  color: "#2563eb",
                }}
              >
                {myThreads.length}
              </div>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "#6b7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Threads
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#2563eb' }}>
                {authUser.followers_count ?? 0}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Followers
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#2563eb' }}>
                {authUser.following_count ?? 0}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Following
              </div>
            </div>
          </div>

          {/* Demo role switcher */}
          <div
            style={{
              marginBottom: "2rem",
              padding: "1rem",
              backgroundColor: "#f9fafb",
              borderRadius: "8px",
              border: "1px dashed #d1d5db",
            }}
          >
            <label
              style={{
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#374151",
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
                borderRadius: "4px",
                border: "1px solid #d1d5db",
                fontSize: "0.875rem",
              }}
            >
              <option value="user">Regular User</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          {/* Actions */}
          <div
            style={{ display: "flex", justifyContent: "center", gap: "1rem" }}
          >
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
            <p style={{ color: "#6b7280" }}>Loading your threads...</p>
          ) : myThreads.length > 0 ? (
            myThreads.map((thread) => (
              <ThreadCard key={thread.id} thread={thread} />
            ))
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            >
              <p style={{ color: "#6b7280", marginBottom: "1rem" }}>
                You haven't posted any threads yet.
              </p>
              <Link
                to="/create-thread"
                style={{
                  backgroundColor: "#0a95ff",
                  color: "white",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
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
            backgroundColor: "rgba(0,0,0,0.5)",
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
              backgroundColor: "white",
              borderRadius: "8px",
              width: "100%",
              maxWidth: "480px",
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            {/* Modal header */}
<<<<<<< HEAD
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid #e5e7eb' }}>
              <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Edit Profile</h2>
              <button type="button" onClick={closeEdit} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: '1.25rem', display: 'flex' }}>
=======
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1.25rem 1.5rem",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600 }}>
                Edit Profile
              </h2>
              <button
                onClick={closeEdit}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#6b7280",
                  fontSize: "1.25rem",
                  display: "flex",
                }}
              >
>>>>>>> origin/najwa-dev
                <HiX />
              </button>
            </div>
            {/* Modal body */}
<<<<<<< HEAD
            <form onSubmit={formik.handleSubmit}>
              <div style={{ padding: '1.5rem' }}>

                {/* Avatar upload */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: '#6b7280', overflow: 'hidden' }}>
                      {avatarPreview || authUser.avatar_url
                        ? <img src={avatarPreview || authUser.avatar_url!} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <HiUser />
                      }
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: '#0a95ff', color: 'white', border: 'none', borderRadius: '50%', width: '26px', height: '26px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}
                      title="Change avatar"
                    >
                      <HiCamera />
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    style={{ display: 'none' }}
                    onChange={handleAvatarChange}
                  />
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>JPEG / PNG, maks 2MB</span>
                  {formik.touched.avatar && formik.errors.avatar ? (
                    <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{formik.errors.avatar as string}</p>
                  ) : null}
                </div>

                {/* Bio */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formik.values.bio}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    maxLength={500}
                    rows={4}
                    placeholder="Ceritakan sedikit tentang dirimu..."
                    style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem', resize: 'vertical', boxSizing: 'border-box', outline: 'none' }}
                  />
                  {formik.touched.bio && formik.errors.bio ? (
                    <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{formik.errors.bio}</p>
                  ) : null}
                  <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#9ca3af' }}>
                    {formik.values.bio.length}/500
                  </div>
                </div>

                {/* Read-only info */}
                <div style={{ backgroundColor: '#f9fafb', borderRadius: '6px', padding: '0.75rem 1rem', marginBottom: '1.5rem', fontSize: '0.8rem', color: '#6b7280' }}>
                  <div style={{ marginBottom: '0.25rem' }}><strong>Username:</strong> {authUser.username} <span style={{ color: '#9ca3af' }}>(tidak bisa diubah)</span></div>
                  <div><strong>Email:</strong> {authUser.email} <span style={{ color: '#9ca3af' }}>(tidak bisa diubah)</span></div>
                </div>

                {/* Error */}
                {formik.status && (
                  <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', padding: '0.6rem 0.75rem', marginBottom: '1rem', fontSize: '0.875rem', color: '#dc2626' }}>
                    {formik.status}
                  </div>
                )}

                {/* Footer buttons */}
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <Button type="button" variant="outline" onClick={closeEdit} disabled={formik.isSubmitting}>
                    Batal
                  </Button>
                  <Button type="submit" isLoading={formik.isSubmitting} disabled={formik.isSubmitting || !formik.isValid}>
                    Simpan
                  </Button>
                </div>
              </div>
=======
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
                      backgroundColor: "#e5e7eb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "2.5rem",
                      color: "#6b7280",
                      overflow: "hidden",
                    }}
                  >
                    {avatarPreview || authUser.avatar_url ? (
                      <img
                        src={avatarPreview || authUser.avatar_url!}
                        alt="preview"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
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
                      backgroundColor: "#0a95ff",
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
                <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                  JPEG / PNG, maks 2MB
                </span>
                {avatarError && (
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "#dc2626",
                      marginTop: "0.25rem",
                    }}
                  >
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
                    color: "#374151",
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
                    border: `1px solid ${formik.touched.username && formik.errors.username ? "#fca5a5" : "#d1d5db"}`,
                    borderRadius: "6px",
                    fontSize: "0.875rem",
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                />
                {formik.touched.username && formik.errors.username && (
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#dc2626",
                      marginTop: "0.25rem",
                    }}
                  >
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
                    color: "#374151",
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
                    border: `1px solid ${formik.touched.bio && formik.errors.bio ? "#fca5a5" : "#d1d5db"}`,
                    borderRadius: "6px",
                    fontSize: "0.875rem",
                    resize: "vertical",
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.75rem",
                    color: "#9ca3af",
                  }}
                >
                  <span style={{ color: "#dc2626" }}>
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
                    color: "#374151",
                    marginBottom: "0.5rem",
                  }}
                >
                  Password Baru{" "}
                  <span style={{ color: "#9ca3af", fontWeight: 400 }}>
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
                    border: `1px solid ${formik.touched.password && formik.errors.password ? "#fca5a5" : "#d1d5db"}`,
                    borderRadius: "6px",
                    fontSize: "0.875rem",
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                />
                {formik.touched.password && formik.errors.password && (
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#dc2626",
                      marginTop: "0.25rem",
                    }}
                  >
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
                      color: "#374151",
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
                      border: `1px solid ${formik.touched.confirmPassword && formik.errors.confirmPassword ? "#fca5a5" : "#d1d5db"}`,
                      borderRadius: "6px",
                      fontSize: "0.875rem",
                      boxSizing: "border-box",
                      outline: "none",
                    }}
                  />
                  {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword && (
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "#dc2626",
                          marginTop: "0.25rem",
                        }}
                      >
                        {formik.errors.confirmPassword}
                      </div>
                    )}
                </div>
              )}

              {/* Read-only info */}
              <div
                style={{
                  backgroundColor: "#f9fafb",
                  borderRadius: "6px",
                  padding: "0.75rem 1rem",
                  marginBottom: "1.5rem",
                  fontSize: "0.8rem",
                  color: "#6b7280",
                }}
              >
                <div>
                  <strong>Email:</strong> {authUser.email}{" "}
                  <span style={{ color: "#9ca3af" }}>(tidak bisa diubah)</span>
                </div>
              </div>

              {/* Success */}
              {saveSuccess && (
                <div
                  style={{
                    backgroundColor: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    borderRadius: "6px",
                    padding: "0.6rem 0.75rem",
                    marginBottom: "1rem",
                    fontSize: "0.875rem",
                    color: "#16a34a",
                  }}
                >
                  {saveSuccess}
                </div>
              )}

              {/* Error */}
              {saveError && (
                <div
                  style={{
                    backgroundColor: "#fef2f2",
                    border: "1px solid #fecaca",
                    borderRadius: "6px",
                    padding: "0.6rem 0.75rem",
                    marginBottom: "1rem",
                    fontSize: "0.875rem",
                    color: "#dc2626",
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
>>>>>>> origin/najwa-dev
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
