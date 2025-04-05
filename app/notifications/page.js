// app/notifications/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { FaBell } from 'react-icons/fa';

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/notifications');
      if (!res.ok) throw new Error('Failed to fetch notifications');
      
      const data = await res.json();
      setNotifications(data.notifications);
      
      // Mark all as read
      await fetch('/api/notifications/mark-all-read', {
        method: 'PUT'
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await fetch(`/api/notifications/${id}`, { 
        method: 'PUT' 
      });
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: 1 } : n)
      );
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update notification');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6 font-sans">
      <header className="flex justify-between items-center mb-8 border-b pb-4">
        <div className="flex items-center space-x-2">
          <FaBell className="text-blue-500" size={24} />
          <h1 className="text-2xl font-semibold">Notifications</h1>
        </div>
        <Link 
          href="/dashboard" 
          className="text-blue-500 hover:text-blue-400 transition-colors"
        >
          Back to Dashboard
        </Link>
      </header>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No notifications yet</p>
          <p className="text-gray-500 mt-2">You'll see notifications here when you receive them</p>
        </div>
      ) : (
        <div className="space-y-4 max-w-3xl mx-auto">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`p-4 bg-white rounded-lg border border-gray-300 hover:border-gray-400 transition transform hover:scale-105 ${
                !notification.is_read ? 'border-l-4 border-l-blue-500' : ''
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-lg text-gray-800">{notification.message}</p>
                  {notification.job_title && notification.company_name && (
                    <p className="text-sm text-blue-500 mt-1">
                      {notification.job_title} at {notification.company_name}
                    </p>
                  )}
                </div>
                {!notification.is_read && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-500 text-white">
                    New
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {new Date(notification.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}