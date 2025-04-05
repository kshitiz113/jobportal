// components/Notifications.js
'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load notifications');
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, { 
        method: 'PUT' 
      });
      if (!res.ok) throw new Error('Failed to mark as read');
      
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: 1 } : n)
      );
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update notification');
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setShowDropdown(!showDropdown)}
        className="p-2 relative hover:bg-gray-700 rounded-full"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
      
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-md shadow-lg z-50 border border-gray-600">
          <div className="p-3 border-b border-gray-600 flex justify-between items-center">
            <h3 className="font-semibold">Notifications</h3>
            <button 
              onClick={() => setShowDropdown(false)}
              className="text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-3 border-b border-gray-700 cursor-pointer hover:bg-gray-700 transition ${
                    !notification.is_read ? 'bg-gray-700/50' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <p className="text-sm">{notification.message}</p>
                  {notification.job_title && notification.company_name && (
                    <p className="text-xs text-blue-400 mt-1">
                      {notification.job_title} at {notification.company_name}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                  {!notification.is_read && (
                    <span className="text-xs text-green-400">New</span>
                  )}
                </div>
              ))
            ) : (
              <p className="p-4 text-center text-gray-400">No notifications yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}