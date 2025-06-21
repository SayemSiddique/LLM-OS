'use client';

import { useState, useEffect } from 'react';
import { TerminalShell } from '../components/shell/TerminalShell';
import { AppLauncher } from '../components/launcher/AppLauncher';
import { AutonomyControls } from '../components/autonomy/AutonomyControls';
import { VisualVerifier } from '../components/verifier/VisualVerifier';
import { SystemStatusBar } from '../components/common/SystemStatusBar';
import { Sidebar } from '../components/common/Sidebar';
import { ToastProvider } from '../components/ui/toast';
import { DesignSystemShowcase } from '../components/showcase/DesignSystemShowcase';
import { motion, AnimatePresence } from 'framer-motion';
import { useLLMOSStore } from '../lib/store';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { Button } from '../components/ui';
import { Menu, X, Eye, Settings, Terminal, Grid3X3 } from 'lucide-react';

export default function LLMOSPage() {
  const { activeView, setActiveView, sidebarCollapsed, toggleSidebar } = useLLMOSStore();
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Responsive breakpoints
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');

  // Auto-collapse panels on smaller screens
  useEffect(() => {
    if (isMobile) {
      setRightPanelOpen(false);
      if (!sidebarCollapsed) {
        toggleSidebar(); // Ensure sidebar is collapsed on mobile
      }
    } else if (isTablet) {
      setRightPanelOpen(false);
    } else if (isDesktop) {
      setRightPanelOpen(true);
    }
  }, [isMobile, isTablet, isDesktop, sidebarCollapsed, toggleSidebar]);

  const contentVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.98 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      scale: 0.98,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const panelVariants = {
    closed: { 
      x: '100%', 
      opacity: 0,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    },
    open: { 
      x: 0, 
      opacity: 1,
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
    }
  };

  return (
    <ToastProvider>
      <div className="llm-os-container min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/5 to-green-900/10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent" />
        </div>
        
        {/* Mobile Header */}
        {isMobile && (
          <div className="lg:hidden bg-llm-dark/95 backdrop-blur-md border-b border-llm-light/20 p-4 relative z-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
                <h1 className="text-lg font-semibold text-white">LLM-OS</h1>
              </div>
              
              {/* Mobile Quick Actions */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveView('shell')}
                  className={`p-2 ${activeView === 'shell' ? 'bg-primary/20 text-primary' : ''}`}
                >
                  <Terminal className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveView('launcher')}
                  className={`p-2 ${activeView === 'launcher' ? 'bg-primary/20 text-primary' : ''}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRightPanelOpen(true)}
                  className="p-2"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Main Layout Container */}
        <div className="flex flex-col h-screen relative z-10">
          {/* System Status Bar */}
          <SystemStatusBar />
          
          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar */}
            <Sidebar 
              isCollapsed={sidebarCollapsed}
              onToggle={toggleSidebar}
            />
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              {/* Primary Content Panel */}
              <div className="flex-1 flex flex-col min-h-0">
                <AnimatePresence mode="wait">
                  {activeView === 'shell' && (
                    <motion.div
                      key="shell"
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="h-full"
                    >
                      <TerminalShell />
                    </motion.div>
                  )}
                  {activeView === 'launcher' && (
                    <motion.div
                      key="launcher"
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="h-full"
                    >
                      <AppLauncher />
                    </motion.div>
                  )}
                  {activeView === 'settings' && (
                    <motion.div
                      key="settings"
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="h-full overflow-auto"
                    >
                      <DesignSystemShowcase />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Right Panel - Responsive */}
              <AnimatePresence>
                {rightPanelOpen && (
                  <motion.div 
                    variants={panelVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    className={`
                      ${isMobile 
                        ? 'fixed inset-x-0 bottom-0 top-20 z-50 bg-llm-dark/95 backdrop-blur-md'
                        : isTablet 
                          ? 'fixed right-0 top-0 bottom-0 w-80 z-40 bg-llm-dark/95 backdrop-blur-md border-l border-llm-light/20'
                          : 'w-96 border-l border-llm-light/20'
                      } 
                      flex flex-col
                    `}
                  >
                    {/* Mobile/Tablet panel header */}
                    {(isMobile || isTablet) && (
                      <div className="flex items-center justify-between p-4 border-b border-llm-light/20">
                        <h3 className="font-medium text-white">System Monitor</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setRightPanelOpen(false)}
                          className="p-2"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    
                    {/* Autonomy Controls */}
                    <div className="border-b border-llm-light/20 flex-shrink-0">
                      <AutonomyControls />
                    </div>
                    
                    {/* Visual Verifier */}
                    <div className="flex-1 min-h-0">
                      <VisualVerifier />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Tablet/Mobile overlay for right panel */}
              {(isMobile || isTablet) && rightPanelOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-30"
                  onClick={() => setRightPanelOpen(false)}
                />
              )}
            </div>
          </div>
        </div>
        
        {/* Desktop Panel Toggle Button */}
        {isDesktop && !rightPanelOpen && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="fixed right-4 top-1/2 -translate-y-1/2 z-30"
          >
            <Button
              variant="default"
              size="sm"
              onClick={() => setRightPanelOpen(true)}
              className="rounded-full p-3 shadow-lg"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </div>
    </ToastProvider>
  );
}
