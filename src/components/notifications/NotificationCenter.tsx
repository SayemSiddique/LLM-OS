'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  X,
  Bell,
  Settings,
  Cpu,
  Zap
} from 'lucide-react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  autoClose?: boolean;
  duration?: number;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary' | 'danger';
}

interface NotificationCenterProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
  onClearAll: () => void;
}

export function NotificationCenter({ notifications, onDismiss, onClearAll }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'error': return XCircle;
      case 'warning': return AlertTriangle;
      case 'info': return Info;
      default: return Info;
    }
  };

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'success': return 'rgb(var(--success))';
      case 'error': return 'rgb(var(--error))';
      case 'warning': return 'rgb(var(--warning))';
      case 'info': return 'rgb(var(--secondary))';
      default: return 'rgb(var(--foreground-muted))';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-background-hover transition-colors"
      >
        <Bell className="w-5 h-5 text-foreground" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-error rounded-full flex items-center justify-center"
          >
            <span className="text-xs font-bold text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          </motion.div>
        )}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 top-12 w-80 max-h-96 glass border border-background-border rounded-xl shadow-cyber z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-background-border">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Notifications</h3>
                  <div className="flex items-center space-x-2">
                    {notifications.length > 0 && (
                      <button
                        onClick={onClearAll}
                        className="text-xs text-foreground-muted hover:text-foreground transition-colors"
                      >
                        Clear all
                      </button>
                    )}
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-1 rounded hover:bg-background-hover transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-64 overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="w-8 h-8 text-foreground-muted mx-auto mb-2" />
                    <p className="text-foreground-muted">No notifications</p>
                  </div>
                ) : (
                  <div className="p-2">
                    {notifications.map((notification) => {
                      const Icon = getIcon(notification.type);
                      
                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="p-3 mb-2 bg-background-card/50 rounded-lg border border-background-border/50 hover:bg-background-hover/50 transition-colors"
                        >
                          <div className="flex items-start space-x-3">
                            <Icon 
                              className="w-5 h-5 flex-shrink-0 mt-0.5"
                              style={{ color: getTypeColor(notification.type) }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="text-sm font-medium truncate">
                                  {notification.title}
                                </h4>
                                <button
                                  onClick={() => onDismiss(notification.id)}
                                  className="p-1 rounded hover:bg-background-hover transition-colors flex-shrink-0"
                                >
                                  <X className="w-3 h-3 text-foreground-muted" />
                                </button>
                              </div>
                              <p className="text-sm text-foreground-muted mb-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-foreground-muted">
                                  {formatTimestamp(notification.timestamp)}
                                </span>
                                {notification.actions && notification.actions.length > 0 && (
                                  <div className="flex space-x-2">
                                    {notification.actions.map((action, index) => (
                                      <button
                                        key={index}
                                        onClick={action.action}
                                        className={`px-2 py-1 text-xs rounded transition-colors ${
                                          action.style === 'primary' ? 'bg-primary text-primary-foreground hover:bg-primary-hover' :
                                          action.style === 'danger' ? 'bg-error text-error-foreground hover:bg-error-hover' :
                                          'bg-background-border text-foreground hover:bg-background-hover'
                                        }`}
                                      >
                                        {action.label}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Hook for managing notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Auto-dismiss if specified
    if (notification.autoClose !== false) {
      const duration = notification.duration || 5000;
      setTimeout(() => {
        dismissNotification(newNotification.id);
      }, duration);
    }

    return newNotification.id;
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Predefined notification types
  const notifySuccess = (title: string, message: string) => 
    addNotification({ type: 'success', title, message });

  const notifyError = (title: string, message: string) => 
    addNotification({ type: 'error', title, message, autoClose: false });

  const notifyWarning = (title: string, message: string) => 
    addNotification({ type: 'warning', title, message });

  const notifyInfo = (title: string, message: string) => 
    addNotification({ type: 'info', title, message });

  return {
    notifications,
    addNotification,
    dismissNotification,
    clearAllNotifications,
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
  };
}
