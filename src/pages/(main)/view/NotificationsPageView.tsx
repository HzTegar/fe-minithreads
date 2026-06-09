import React from 'react';
import { Navbar } from '../../../components/Navbar';
import { formatTimeAgo } from '../../../utils/formatDate';
import { Link } from 'react-router-dom';
import { useNotificationsPage } from '../logic/NotificationsPage';

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    isLoading,
    handleMarkAsRead,
    handleMarkAllAsRead
  } = useNotificationsPage();

  return (
    <div className="bg-[#f8f9f9] min-h-screen">
      <Navbar />
      <main className="max-w-[800px] mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#232629]">Notifications</h1>
          {notifications.some(n => !n.read_at) && (
            <button 
              onClick={handleMarkAllAsRead}
              className="text-sm text-[#0074cc] hover:text-[#0a95ff] font-medium transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-[#e3e6e8] rounded-lg">
            <p className="text-[#6a737c]">Loading your notifications...</p>
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map(notification => (
              <div 
                key={notification.id}
                onClick={() => !notification.read_at && handleMarkAsRead(notification.id)}
                className={`p-4 rounded-lg border transition-all cursor-pointer flex justify-between items-start gap-4 ${
                  notification.read_at 
                    ? 'bg-white border-[#e3e6e8] opacity-80' 
                    : 'bg-[#f0f8ff] border-[#b3d3f1] shadow-sm'
                }`}
              >
                <div className="flex gap-3">
                  <div className={`mt-1 size-2 rounded-full shrink-0 ${notification.read_at ? 'bg-transparent' : 'bg-[#0074cc]'}`} />
                  <div>
                    <p className={`text-[15px] mb-1 ${notification.read_at ? 'text-[#4b5563]' : 'text-[#232629] font-medium'}`}>
                      {notification.data.message}
                    </p>
                    <span className="text-xs text-[#6a737c]">
                      {formatTimeAgo(notification.created_at)}
                    </span>
                  </div>
                </div>
                {notification.data.post_id && (
                  <Link 
                    to={`/thread/${notification.data.post_id}`}
                    className="text-xs font-bold text-[#0074cc] hover:bg-[#e1ecf4] px-3 py-1.5 rounded bg-[#f1f2f3] no-underline uppercase tracking-wide"
                  >
                    View
                  </Link>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-[#e3e6e8] rounded-lg">
            <div className="text-4xl mb-4">🔔</div>
            <h2 className="text-lg font-medium text-[#3b4045] mb-1">No notifications yet</h2>
            <p className="text-[#6a737c]">When someone interacts with your posts, you'll see it here.</p>
          </div>
        )}
      </main>
    </div>
  );
};

