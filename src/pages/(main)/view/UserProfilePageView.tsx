import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../../components/Navbar';
import { RoleBadge } from '../../../components/common/RoleBadge';
import { ThreadCard } from '../../../components/ThreadCard';
import { useUserProfilePage } from '../logic/UserProfilePage';
import { ReportModal } from '../../../components/common/ReportModal';
import { HiUser, HiUserAdd, HiUserRemove } from 'react-icons/hi';

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

  if (isLoading) return (
    <div>
      <Navbar />
      <div style={{ textAlign: 'center', marginTop: '3rem', color: '#6b7280' }}>Loading profile...</div>
    </div>
  );

  if (notFound || !profile) return (
    <div>
      <Navbar />
      <div style={{ textAlign: 'center', marginTop: '3rem', color: '#6b7280' }}>User tidak ditemukan.</div>
    </div>
  );

  const { user, threads } = profile;

  return (
    <div style={{ backgroundColor: '#f8f9f9', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>

        {/* Profile Card */}
        <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center' }}>

          {/* Avatar */}
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#e5e7eb', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: '#6b7280', overflow: 'hidden' }}>
            {user.avatar_url
              ? <img src={user.avatar_url} alt={user.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <HiUser />
            }
          </div>

          {/* Badges */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <RoleBadge role={user.level} />
            <span style={{
              display: 'inline-block',
              backgroundColor: '#fef3c7',
              color: '#92400e',
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '0.2rem 0.75rem',
              borderRadius: '9999px',
              border: '1px solid #fde68a',
            }}>
              {user.rank_level}
            </span>
          </div>

          <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>{user.username}</h1>

          {user.bio && (
            <p style={{ maxWidth: '500px', margin: '0 auto 1.25rem', color: '#4b5563', fontSize: '0.9rem' }}>
              {user.bio}
            </p>
          )}

          {/* Follow & Report buttons */}
          {isAuthenticated && !isOwnProfile && (
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
              <button
                onClick={handleToggleFollow}
                disabled={isFollowLoading}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: isFollowLoading ? 'not-allowed' : 'pointer',
                  border: '1px solid',
                  transition: 'all 0.15s',
                  backgroundColor: isFollowing ? '#ffffff' : '#0a95ff',
                  color: isFollowing ? '#e53e3e' : '#ffffff',
                  borderColor: isFollowing ? '#e53e3e' : '#0a95ff',
                  opacity: isFollowLoading ? 0.7 : 1,
                }}
              >
                {isFollowing ? <HiUserRemove /> : <HiUserAdd />}
                {isFollowLoading ? '...' : isFollowing ? 'Unfollow' : 'Follow'}
              </button>

              <button
                onClick={() => setIsReportOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: '1px solid #dc2626',
                  backgroundColor: '#ffffff',
                  color: '#dc2626',
                  transition: 'all 0.15s',
                }}
              >
                🚩 Laporkan
              </button>
            </div>
          )}

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', padding: '1rem 0', borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#2563eb' }}>
                {(user.reputation_points ?? 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Reputation
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#2563eb' }}>
                {threads.length}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Threads
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#2563eb' }}>
                {followersCount}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Followers
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#2563eb' }}>
                {user.following_count ?? 0}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Following
              </div>
            </div>
          </div>

          {/* Own profile link */}
          {isOwnProfile && (
            <div style={{ marginTop: '1rem' }}>
              <Link
                to="/profile"
                style={{ fontSize: '0.85rem', color: '#0074cc', textDecoration: 'none' }}
              >
                Edit your profile →
              </Link>
            </div>
          )}
        </div>

        {/* Threads */}
        <div style={{ marginTop: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
            Threads by {user.username} ({threads.length})
          </h2>
          {threads.length > 0 ? (
            threads.map(thread => (
              <ThreadCard key={thread.id} thread={thread} />
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <p style={{ color: '#6b7280' }}>User ini belum punya threads.</p>
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
