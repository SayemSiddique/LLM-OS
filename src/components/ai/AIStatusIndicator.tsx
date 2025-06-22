'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Wifi, WifiOff, Zap } from 'lucide-react';
import { liveAIService } from '../../lib/ai/liveService';

export function AIStatusIndicator() {
  const [status, setStatus] = useState<string>('Checking...');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkStatus = () => {
      const connected = liveAIService.isApiConnected();
      const statusText = liveAIService.getDemoModeStatus();
      
      setIsConnected(connected);
      setStatus(statusText);
    };

    checkStatus();
    const interval = setInterval(checkStatus, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center space-x-2 px-3 py-2 bg-background-card border border-background-border rounded-lg"
    >
      <div className="relative">
        <Brain className="w-4 h-4 text-primary" />
        <motion.div
          className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
            isConnected ? 'bg-green-500' : 'bg-yellow-500'
          }`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.7, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      <div className="flex flex-col">
        <span className="text-xs font-medium text-foreground">
          AI Status
        </span>
        <span className="text-xs text-foreground-muted">
          {status}
        </span>
      </div>
      
      {isConnected ? (
        <Wifi className="w-3 h-3 text-green-500" />
      ) : (
        <WifiOff className="w-3 h-3 text-yellow-500" />
      )}
    </motion.div>
  );
}
