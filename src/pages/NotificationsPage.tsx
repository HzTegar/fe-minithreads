import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { notificationService, type Notification } from '../services/notificationService';
import { formatTimeAgo } from '../utils/formatDate';
import { Link } from 'react-router-dom';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getAll();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, read_at: new Date().toISOString() })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <main style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ margin: 0 }}>Notifications</h1>
          {notifications.some(n => !n.read_at) && (
            <button 
              onClick={handleMarkAllAsRead}
              style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '0.875rem' }}
            >
              Mark all as read
            </button>
          )}
        </div>

        {isLoading ? (
          <p style={{ textAlign: 'center' }}>Loading...</p>
        ) : notifications.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {notifications.map(notification => (
              <div 
                key={notification.id}
                onClick={() => !notification.read_at && handleMarkAsRead(notification.id)}
                style={{ 
                  padding: '1rem', 
                  backgroundColor: notification.read_at ? '#ffffff' : '#eff6ff', 
                  borderRadius: '8px', 
                  border: '1px solid #e5e7eb',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <p style={{ margin: '0 0 0.25rem 0', color: '#111827' }}>
                    {notification.data.message}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {formatTimeAgo(notification.created_at)}
                  </span>
                </div>
                {notification.data.post_id && (
                  <Link 
                    to={`/thread/${notification.data.post_id}`}
                    style={{ fontSize: '0.875rem', color: '#2563eb', textDecoration: 'none' }}
                  >
                    View
                  </Link>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#6b7280', padding: '3rem' }}>No notifications yet.</p>
        )}
      </main>
    </div>
  );
};
