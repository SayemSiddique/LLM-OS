'use client';

import { Activity, Clock, Users, Zap } from 'lucide-react';

export function SystemStatusBar() {
  const currentTime = new Date().toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className="bg-llm-dark border-b border-llm-light px-6 py-2">
      <div className="flex items-center justify-between">
        {/* Left side - System info */}
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-green-400" />
            <span className="text-green-400">System Online</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-gray-300">GPT-4 Ready</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-gray-300">1 Agent Active</span>
          </div>
        </div>

        {/* Right side - Time and user */}
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300">{currentTime}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-llm-accent rounded-full flex items-center justify-center">
              <span className="text-xs font-semibold text-white">U</span>
            </div>
            <span className="text-gray-300">User</span>
          </div>
        </div>
      </div>
    </div>
  );
}
