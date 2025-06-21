'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLLMOSStore } from '@/lib/store';
import { 
  Terminal, 
  Grid, 
  Sliders, 
  Eye, 
  Settings, 
  Home,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'terminal', label: 'Terminal', icon: Terminal },
  { id: 'launcher', label: 'App Launcher', icon: Grid },
  { id: 'autonomy', label: 'Autonomy', icon: Sliders },
  { id: 'verifier', label: 'Verifier', icon: Eye },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const { activeView, setActiveView } = useLLMOSStore();

  return (
    <motion.div
      initial={{ width: isCollapsed ? 56 : 240 }}
      animate={{ width: isCollapsed ? 56 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="flex flex-col h-full bg-card border-r border-card-border backdrop-blur-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-card-border">
        {!isCollapsed && (
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg font-bold text-text-primary"
          >
            LLM-OS
          </motion.h1>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-md hover:bg-background-hover transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-foreground" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-foreground" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveView(item.id as any)}
                  className={`
                    w-full flex items-center gap-3 p-3 rounded-lg
                    transition-all duration-200 group
                    ${isActive 
                      ? 'bg-primary text-primary-foreground shadow-glow' 
                      : 'hover:bg-background-hover text-foreground'
                    }
                    ${isCollapsed ? 'justify-center' : 'justify-start'}
                  `}
                >
                  <Icon 
                    className={`
                      w-5 h-5 transition-transform duration-200
                      ${isActive ? 'scale-110' : 'group-hover:scale-105'}
                    `} 
                  />
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-background-border">
        {!isCollapsed ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xs text-muted-foreground text-center"
          >
            LLM Operating System
            <br />
            v0.1.0
          </motion.div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
