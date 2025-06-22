'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Clock, 
  Users, 
  Zap, 
  Wifi, 
  Shield, 
  Database,
  Cpu,
  Eye
} from 'lucide-react';
import { useLLMOSStore } from '../../lib/store';
import { NotificationCenter, useNotifications } from '../notifications/NotificationCenter';
import { ClientOnly } from '../utils/ClientOnly';

export function SystemStatusBar() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const { systemHealth, user, autonomyLevel } = useLLMOSStore();
  const notifications = useNotifications();

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Demo notifications on mount
  useEffect(() => {
    setTimeout(() => {
      notifications.notifySuccess('System Ready', 'LLM-OS has been initialized successfully');
    }, 2000);
    
    setTimeout(() => {
      notifications.notifyInfo('Memory Manager', 'Optimized 156 memory entries for better performance');
    }, 5000);  }, []);

  const timeString = currentTime.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const dateString = currentTime.toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const getAutonomyLevelText = () => {
    switch (autonomyLevel) {
      case 1: return 'Suggest Mode';
      case 2: return 'Approval Required';
      case 3: return 'Oversight Mode';
      case 4: return 'Full Autonomous';
      default: return 'Suggest Mode';
    }
  };

  const getAutonomyColor = () => {
    switch (autonomyLevel) {
      case 1: return 'text-blue-400';
      case 2: return 'text-yellow-400';
      case 3: return 'text-orange-400';
      case 4: return 'text-red-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-background-secondary/80 backdrop-blur-sm border-b border-background-border px-4 py-2 z-20"
    >
      <div className="flex items-center justify-between max-w-full">
        {/* Left side - System status indicators */}
        <div className="flex items-center space-x-4 lg:space-x-6 text-sm overflow-hidden">
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <Activity className="w-4 h-4 text-success" />
            <span className="text-success font-medium hidden sm:inline">Online</span>
          </motion.div>
          
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-foreground-secondary hidden md:inline">AI Ready</span>
          </motion.div>
          
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <Shield className="w-4 h-4 text-secondary" />
            <span className="text-foreground-secondary hidden lg:inline">Secure</span>
          </motion.div>

          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <Eye className={`w-4 h-4 ${getAutonomyColor()}`} />
            <span className={`hidden xl:inline ${getAutonomyColor()}`}>
              {getAutonomyLevelText()}
            </span>
          </motion.div>

          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <Database className="w-4 h-4 text-accent" />
            <span className="text-foreground-secondary hidden xl:inline">
              Memory: {Math.round(Math.random() * 30 + 60)}%
            </span>
          </motion.div>
        </div>

        {/* Right side - Time, notifications, and user */}
        <div className="flex items-center space-x-3 lg:space-x-4 text-sm">
          {/* System Performance Indicator */}
          <motion.div 
            className="hidden lg:flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <Cpu className="w-4 h-4 text-warning" />
            <span className="text-foreground-secondary">CPU: 23%</span>
          </motion.div>

          {/* Network Status */}
          <motion.div 
            className="hidden md:flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <Wifi className="w-4 h-4 text-success" />
            <span className="text-foreground-secondary hidden lg:inline">Connected</span>
          </motion.div>
          
          {/* Notifications */}
          <NotificationCenter
            notifications={notifications.notifications}
            onDismiss={notifications.dismissNotification}
            onClearAll={notifications.clearAllNotifications}
          />
            {/* Time and Date */}
          <ClientOnly fallback={
            <div className="flex flex-col items-end">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-foreground-muted" />
                <span className="text-foreground font-medium">--:--</span>
              </div>
              <span className="text-xs text-foreground-muted hidden sm:inline">Loading...</span>
            </div>
          }>
            <motion.div 
              className="flex flex-col items-end"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-foreground-muted" />
                <span className="text-foreground font-medium">{timeString}</span>
              </div>
              <span className="text-xs text-foreground-muted hidden sm:inline">{dateString}</span>
            </motion.div>
          </ClientOnly>
          
          {/* User Avatar */}
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-7 h-7 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
              <span className="text-sm font-bold text-primary-foreground">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <span className="text-foreground-secondary hidden xl:inline">
              {user?.email?.split('@')[0] || 'Guest'}
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
