'use client';
import { X, Bell, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ButtonWithIcon } from '@/components/button-with-icon';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Simulate real-time notifications
    const interval = setInterval(() => {
      const newNotification: Notification = {
        id: Math.random().toString(36).substr(2, 9),
        message: `New activity detected! Agent #${Math.floor(Math.random() * 100)} executed a task.`,
        timestamp: new Date().toLocaleString(),
        read: false,
      };
      setNotifications(prev => [newNotification, ...prev]);
    }, 15000); // Add a new notification every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const unreadCount = notifications.filter(notif => !notif.read).length;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      ></div>

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-background border-l border-border/50 z-50 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } flex flex-col`}
      >
        <div className="p-4 border-b border-border/50 flex items-center justify-between">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <Bell size={20} /> Notifications {unreadCount > 0 && <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">{unreadCount}</span>}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground text-center">
              No new notifications
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {notifications.map(notif => (
                <div
                  key={notif.id}
                  className={`p-4 hover:bg-muted/20 transition-colors cursor-pointer ${notif.read ? 'text-muted-foreground' : 'font-medium'}`}
                  onClick={() => markAsRead(notif.id)}
                >
                  <p className="text-sm">{notif.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notif.timestamp}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        {notifications.length > 0 && (
          <div className="p-4 border-t border-border/50">
            <ButtonWithIcon
              icon={CheckCircle}
              label="Mark All as Read"
              onClick={markAllAsRead}
              fullWidth
              variant="secondary"
              disabled={unreadCount === 0}
            />
          </div>
        )}
      </div>
    </>
  );
}
