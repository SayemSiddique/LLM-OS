'use client';

import { useState, useEffect } from 'react';
import { Eye, Loader, Terminal, Cpu, Activity, Zap, FileText, Code, Check, X, AlertTriangle, Clock, Play } from 'lucide-react';
import { useLLMOSStore } from '../../lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  actionEventSystem, 
  ActionEvent, 
  approveAction as approveSystemAction, 
  rejectAction as rejectSystemAction,
  completeAction,
  failAction 
} from '../../lib/events/actionSystem';

interface SystemAction {
  id: string;
  type: 'command' | 'file' | 'app' | 'network' | 'ai' | 'approval_required';
  title: string;
  description: string;
  status: 'pending' | 'executing' | 'completed' | 'failed' | 'awaiting_approval';
  timestamp: Date;
  details?: any;
  payload?: any;
  requiresApproval?: boolean;
  autonomyLevel?: number;
}

interface PendingAction {
  id: string;
  type: string;
  title: string;
  description: string;
  payload: any;
  impact: 'low' | 'medium' | 'high';
  preview?: string;
}

export function VisualVerifier() {
  const [systemActions, setSystemActions] = useState<ActionEvent[]>([]);
  const [pendingActions, setPendingActions] = useState<ActionEvent[]>([]);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const { autonomyLevel, currentSession, setActiveView } = useLLMOSStore();

  // Subscribe to real action events
  useEffect(() => {
    const unsubscribe = actionEventSystem.subscribe((event: ActionEvent) => {
      // Add to system actions list
      setSystemActions(prev => [event, ...prev.slice(0, 19)]);
      
      // Add to pending if requires approval
      if (event.requiresApproval && event.status === 'awaiting_approval') {
        setPendingActions(prev => [event, ...prev]);
      }
      
      // Remove from pending if status changes
      if (event.status !== 'awaiting_approval') {
        setPendingActions(prev => prev.filter(a => a.id !== event.id));
      }
    });

    // Load existing actions
    const existingActions = actionEventSystem.getActions().slice(-20);
    setSystemActions(existingActions);
    setPendingActions(actionEventSystem.getActionsByStatus('awaiting_approval'));

    return unsubscribe;
  }, []);

  const getActionImpact = (type: string): 'low' | 'medium' | 'high' => {
    switch (type) {
      case 'file': return 'high';
      case 'app': return 'medium';
      case 'network': return 'medium';
      default: return 'low';
    }
  };

  const generatePreview = (action: ActionEvent): string => {
    if (!action.payload) return action.description;
    
    switch (action.type) {
      case 'file': 
        return `Will ${action.payload.operation}: ${action.payload.filepath}`;
      case 'app': 
        return `Will launch: ${action.payload.appName || action.payload.appId || 'application'}`;
      case 'network': 
        return `Will ${action.payload.method} ${action.payload.url}`;
      default: 
        return action.description;
    }
  };

  const handleApprove = async (actionId: string) => {
    try {
      const action = pendingActions.find(a => a.id === actionId);
      if (!action) return;

      // Remove from pending
      setPendingActions(prev => prev.filter(a => a.id !== actionId));
      
      // Approve in action system
      approveSystemAction(actionId);
      
      // Execute the action based on type
      setTimeout(() => {
        switch (action.type) {
          case 'app':
            if (action.payload?.appName) {
              setActiveView('launcher');
              completeAction(actionId, { view: 'launcher' });
            }
            break;
          case 'file':
            // Simulate file operation
            completeAction(actionId, { filepath: action.payload?.filepath });
            break;
          case 'network':
            // Simulate network request
            completeAction(actionId, { status: 'success', data: 'mock response' });
            break;
          default:
            completeAction(actionId);
        }
      }, 1000 + Math.random() * 2000);

    } catch (error) {
      console.error('Failed to approve action:', error);
      failAction(actionId, 'Approval failed');
    }
  };

  const handleReject = async (actionId: string) => {
    try {
      // Remove from pending
      setPendingActions(prev => prev.filter(a => a.id !== actionId));
      
      // Reject in action system
      rejectSystemAction(actionId, 'Rejected by user');
      
    } catch (error) {
      console.error('Failed to reject action:', error);
    }
  };

  const getActionIcon = (type: string, status: string) => {
    if (status === 'executing') return <Loader className="w-4 h-4 animate-spin" />;
    
    switch (type) {
      case 'command': return <Terminal className="w-4 h-4" />;
      case 'file': return <FileText className="w-4 h-4" />;
      case 'app': return <Code className="w-4 h-4" />;
      case 'network': return <Activity className="w-4 h-4" />;
      case 'ai': return <Zap className="w-4 h-4" />;
      default: return <Cpu className="w-4 h-4" />;
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-900/20';
      case 'executing': return 'text-blue-400 bg-blue-900/20';
      case 'completed': return 'text-green-400 bg-green-900/20';
      case 'failed': return 'text-red-400 bg-red-900/20';
      case 'awaiting_approval': return 'text-orange-400 bg-orange-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'low': return 'text-green-400 bg-green-900/20';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20';
      case 'high': return 'text-red-400 bg-red-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };
  return (
    <div className="p-3 sm:p-4 lg:p-6 bg-background h-full overflow-y-auto">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-semibold mb-2 flex items-center text-text-primary">
          <Eye className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary" />
          <span className="hidden sm:inline">System Monitor & Verifier</span>
          <span className="sm:hidden">Monitor</span>
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary">
          Real-time AI activities and approval workflow
        </p>
      </div>

      {/* Pending Approvals Section */}
      {pendingActions.length > 0 && (
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs sm:text-sm font-medium text-text-primary flex items-center">
              <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-orange-400" />
              <span className="hidden sm:inline">Pending Approvals ({pendingActions.length})</span>
              <span className="sm:hidden">Pending ({pendingActions.length})</span>
            </h3>
            <span className="text-xs text-orange-400 bg-orange-900/20 px-2 py-1 rounded hidden sm:inline">
              Autonomy Level 2: Approval Required
            </span>
            <span className="text-xs text-orange-400 bg-orange-900/20 px-1 py-1 rounded sm:hidden">
              L2
            </span>
          </div>
          
          <div className="space-y-2">
            {pendingActions.map((action) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg border-2 border-orange-500/30 bg-orange-900/10"
              >                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-medium text-white">{action.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded ${getImpactColor(getActionImpact(action.type))}`}>
                        {getActionImpact(action.type)} impact
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{action.description}</p>
                    <div className="bg-llm-dark p-2 rounded text-xs text-gray-300 font-mono">
                      {generatePreview(action)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleApprove(action.id)}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors"
                  >
                    <Check className="w-3 h-3" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleReject(action.id)}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
                  >
                    <X className="w-3 h-3" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => setSelectedAction(selectedAction === action.id ? null : action.id)}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-xs rounded transition-colors"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Details</span>
                  </button>
                </div>
                
                {selectedAction === action.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 pt-3 border-t border-gray-600"
                  >                    <div className="text-xs text-gray-400">
                      <strong>Action ID:</strong> {action.id}<br />
                      <strong>Type:</strong> {action.type}<br />
                      <strong>Impact Level:</strong> {getActionImpact(action.type)}<br />
                      <strong>Source:</strong> {action.source}<br />
                      <strong>Payload:</strong> {JSON.stringify(action.payload, null, 2)}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* System Status */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="bg-llm-dark p-4 rounded-lg border border-llm-light">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Autonomy Level</span>
            <span className="text-xs px-2 py-1 rounded bg-llm-accent/20 text-llm-accent">
              Level {autonomyLevel}/4
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(autonomyLevel / 4) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-llm-dark p-4 rounded-lg border border-llm-light">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Active Session</span>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          </div>
          <div className="text-sm text-white">
            {currentSession?.appId || 'Shell Session'}
          </div>
        </div>
      </div>

      {/* System Activities */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-300 mb-3">Recent Activities</h3>
        
        <AnimatePresence mode="popLayout">
          {systemActions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Cpu className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recent system activities</p>
            </div>
          ) : (
            systemActions.map((action) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`p-3 rounded-lg border border-llm-light bg-llm-dark/50 cursor-pointer hover:bg-llm-light/30 transition-colors ${
                  selectedAction === action.id ? 'ring-2 ring-llm-accent' : ''
                }`}
                onClick={() => setSelectedAction(selectedAction === action.id ? null : action.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`${getStatusColor(action.status)} p-2 rounded`}>
                      {getActionIcon(action.type, action.status)}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">{action.title}</h4>
                      <p className="text-xs text-gray-400">{action.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-2 py-1 rounded text-xs ${getStatusColor(action.status)}`}>
                      {action.status}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {action.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                
                {selectedAction === action.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 pt-3 border-t border-gray-600"
                  >
                    <div className="text-xs text-gray-400">
                      <strong>Type:</strong> {action.type}<br />
                      <strong>Started:</strong> {action.timestamp.toLocaleString()}<br />
                      <strong>Status:</strong> {action.status}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Visual Feedback for Autonomy */}
      <div className="mt-6 p-4 bg-llm-dark rounded-lg border border-llm-light">
        <h3 className="text-sm font-medium text-gray-300 mb-2">Autonomy Behavior</h3>
        <div className="text-xs text-gray-400">
          {autonomyLevel === 1 && "🤖 AI provides suggestions only - all actions require manual execution"}
          {autonomyLevel === 2 && "⚡ AI can execute actions after your approval"}
          {autonomyLevel === 3 && "🚀 AI operates autonomously with oversight and monitoring"}
          {autonomyLevel === 4 && "🔥 Full autonomous operation - AI operates independently"}
        </div>
      </div>
    </div>
  );
}
