import React from 'react';
import { Navbar } from '../../../components/Navbar';
import { ThreadCard } from '../../../components/ThreadCard';
import { RoleBadge } from '../../../components/common/RoleBadge';
import { useHomePage } from '../logic/HomePage';
import { HiUser } from 'react-icons/hi';

export const HomePage: React.FC = () => {
  const {
    threads,
    isLoading,
    user,
    isAuthenticated,
    reputation,
    currentRank,
    progress,
    threadCount,
  } = useHomePage();

  return (
    <div style={{ backgroundColor: '#f8f9f9', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 600 }}>Top Questions</h1>
            {isAuthenticated && (
              <a href="/create-thread" style={{ 
                backgroundColor: '#0a95ff', 
                color: 'white', 
                padding: '0.6rem 1rem', 
                borderRadius: '4px', 
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: '0.875rem',
                boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.4)'
              }}>
                Ask Question
              </a>
            )}
          </div>
          
          {isLoading ? (
            <p style={{ textAlign: 'center', padding: '2rem' }}>Loading threads...</p>
          ) : (
            <div>
              {Array.isArray(threads) && threads.length > 0 ? (
                threads.map(thread => (
                  <ThreadCard key={thread?.id || Math.random()} thread={thread} />
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', border: '1px solid #e3e6e8', borderRadius: '4px' }}>
                  <p style={{ color: '#6b7280', marginBottom: 0 }}>No threads found. Be the first to start a conversation!</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside>
          {isAuthenticated ? (
            <div style={{ backgroundColor: 'white', border: '1px solid #e3e6e8', borderRadius: '4px', padding: '1.5rem', position: 'sticky', top: '5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '48px', height: '48px', backgroundColor: '#e1ecf4', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#6b7280' }}>
                  <HiUser />
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{user?.username}</div>
                  <RoleBadge role={user?.level || 'user'} showIcon={false} />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#6a737c' }}>Reputation</span>
                  <span style={{ fontWeight: 'bold', color: '#232629' }}>{reputation.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#6a737c' }}>Current Rank</span>
                  <span style={{ fontWeight: 'bold', color: '#0074cc' }}>{currentRank.name}</span>
                </div>
                
                {/* Progress Bar */}
                <div style={{ width: '100%', height: '8px', backgroundColor: '#e3e6e8', borderRadius: '4px', overflow: 'hidden', marginTop: '1rem' }}>
                  <div style={{ width: `${progress}%`, height: '100%', backgroundColor: '#f48225', transition: 'width 0.3s ease' }} />
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6a737c', marginTop: '0.5rem', textAlign: 'right' }}>
                  {currentRank.next === Infinity ? 'Max Rank Reached' : `${currentRank.next - reputation} points to next rank`}
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e3e6e8', paddingTop: '1rem' }}>
                <div style={{ fontSize: '0.875rem', color: '#3b4045', fontWeight: 500, marginBottom: '0.75rem' }}>Quick Stats</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div style={{ backgroundColor: '#f8f9f9', padding: '0.5rem', borderRadius: '4px', textAlign: 'center' }}>
                    <div style={{ fontWeight: 'bold' }}>{reputation.toLocaleString()}</div>
                    <div style={{ fontSize: '0.7rem', color: '#6a737c', textTransform: 'uppercase' }}>Points</div>
                  </div>
                  <div style={{ backgroundColor: '#f8f9f9', padding: '0.5rem', borderRadius: '4px', textAlign: 'center' }}>
                    <div style={{ fontWeight: 'bold' }}>{threadCount}</div>
                    <div style={{ fontSize: '0.7rem', color: '#6a737c', textTransform: 'uppercase' }}>Threads</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ backgroundColor: '#fdf7e3', border: '1px solid #e6dbb9', borderRadius: '4px', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: '#3b4045' }}>Join the community</h3>
              <p style={{ fontSize: '0.875rem', color: '#6a737c', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                MiniThreads is a place to share knowledge and help others. Build your reputation and unlock new privileges!
              </p>
              <a href="/register" style={{ 
                display: 'block',
                backgroundColor: '#0a95ff', 
                color: 'white', 
                padding: '0.6rem', 
                borderRadius: '4px', 
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: '0.875rem',
                textAlign: 'center'
              }}>
                Sign up today
              </a>
            </div>
          )}
          
          <div style={{ marginTop: '2rem', padding: '0 1rem' }}>
            <h4 style={{ fontSize: '0.875rem', color: '#232629', marginBottom: '1rem' }}>Points Guide</h4>
            <ul style={{ padding: 0, margin: 0, listStyle: 'none', fontSize: '0.8rem', color: '#6a737c' }}>
              <li style={{ marginBottom: '0.5rem' }}>• Create thread: <span style={{ color: '#2e7d32' }}>+20 pts</span></li>
              <li style={{ marginBottom: '0.5rem' }}>• Answer accepted: <span style={{ color: '#2e7d32' }}>+15 pts</span></li>
              <li style={{ marginBottom: '0.5rem' }}>• Receive like: <span style={{ color: '#2e7d32' }}>+10 pts</span></li>
              <li style={{ marginBottom: '0.5rem' }}>• Give vote: <span style={{ color: '#2e7d32' }}>+5 pts</span></li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
};

