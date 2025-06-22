import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { 
  LLMOSStore, 
  PromptSession, 
  LLMApp, 
  UserProfile, 
  SystemHealth, 
  LLMModel, 
  ChatMessage, 
  AutonomyLevel,
  AgentAction 
} from '../../types';
import DatabaseService from '../persistence/database';

const initialSystemHealth: SystemHealth = {
  status: 'healthy',
  uptime: 0,
  activeConnections: 0,
  modelAvailability: {},
  lastCheck: new Date(),
};

export const useLLMOSStore = create<LLMOSStore>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        currentSession: null,
        activeView: 'dashboard',
        sidebarCollapsed: false,
        autonomyLevel: AutonomyLevel.SUGGEST_ONLY,
        installedApps: [],
        runningApps: [],
        user: null,
        systemHealth: initialSystemHealth,
        availableModels: [],

        // Enhanced Actions with Database Integration
        setCurrentSession: async (session) => {
          set({ currentSession: session }, false, 'setCurrentSession');
          
          // Persist session to database if user is logged in
          if (session && get().user?.id) {
            try {
              await DatabaseService.updateSession(session.id, {
                updatedAt: new Date(),
                status: session.status
              });
            } catch (error) {
              console.error('Failed to persist session:', error);
            }
          }
        },

        setActiveView: (view) => 
          set({ activeView: view }, false, 'setActiveView'),

        toggleSidebar: () => 
          set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }), false, 'toggleSidebar'),      addMessage: async (message) => {
          const state = get();
          const updatedSession = state.currentSession ? {
            ...state.currentSession,
            messages: [...state.currentSession.messages, message],
            updatedAt: new Date(),
          } : null;

          set({
            currentSession: updatedSession
          }, false, 'addMessage');

          // Persist message to database
          if (updatedSession && state.user?.id) {
            try {
              await DatabaseService.addMessage(updatedSession.id, {
                role: message.role,
                content: message.content,
                metadata: message.metadata,
                toolCalls: message.toolCalls,
                attachments: message.attachments
              });
            } catch (error) {
              console.error('Failed to persist message:', error);
            }
          }
        },

        updateAutonomyLevel: async (level) => {
          set({ autonomyLevel: level }, false, 'updateAutonomyLevel');
          
          // Persist autonomy preference
          const state = get();
          if (state.user?.id) {
            try {
              await DatabaseService.saveSettings(state.user.id, {
                userId: state.user.id,
                preferences: {
                  ...state.user.preferences,
                  defaultAutonomyLevel: level
                },
                autonomyDefaults: {
                  defaultLevel: level,
                  autoApprovalThreshold: level >= AutonomyLevel.AUTONOMOUS_WITH_OVERSIGHT ? 0.8 : 0.95,
                  allowedTools: level >= AutonomyLevel.FULL_AUTONOMOUS ? ['*'] : ['search', 'read']
                },
                security: {
                  requireApprovalForFileOperations: level < AutonomyLevel.AUTONOMOUS_WITH_OVERSIGHT,
                  requireApprovalForNetworkRequests: level < AutonomyLevel.EXECUTE_WITH_APPROVAL,
                  requireApprovalForCodeExecution: level < AutonomyLevel.FULL_AUTONOMOUS
                },
                ui: {
                  theme: state.user.preferences.theme,
                  fontSize: 'medium',
                  animations: true,
                  compactMode: false
                },
                notifications: {
                  actionApprovals: level === AutonomyLevel.EXECUTE_WITH_APPROVAL,
                  errors: true,
                  completions: level <= AutonomyLevel.AUTONOMOUS_WITH_OVERSIGHT,
                  email: false
                }
              });
            } catch (error) {
              console.error('Failed to persist autonomy settings:', error);
            }
          }
        },

        executeAction: async (action) => {
          try {
            console.log('Executing action:', action);
            
            const state = get();
            
            // Create the action in the database first
            let actionId: string;
            if (state.user?.id) {
              actionId = await DatabaseService.createAction({
                sessionId: state.currentSession?.id || 'shell',
                type: action.type,
                description: action.description,
                payload: action.payload,
                status: 'pending',
                autonomyLevel: action.autonomyLevel,
                timestamp: new Date()
              });
            } else {
              // Fallback to API if no user session
              const response = await fetch('/api/agent/actions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  sessionId: state.currentSession?.id,
                  type: action.type,
                  description: action.description,
                  payload: action.payload,
                  autonomyLevel: action.autonomyLevel
                })
              });

              if (!response.ok) {
                throw new Error('Failed to create action');
              }

              const result = await response.json();
              actionId = result.action.id;
            }

            console.log('Action created with ID:', actionId);
            
          } catch (error) {
            console.error('Failed to execute action:', error);
            throw error;
          }
        },

        approveAction: async (actionId) => {
          try {
            console.log('Approving action:', actionId);
            
            const state = get();
            
            if (state.user?.id) {
              // Update in database
              await DatabaseService.updateAction(actionId, {
                status: 'approved',
                updatedAt: new Date()
              });
            } else {
              // Fallback to API
              const response = await fetch(`/api/agent/actions/${actionId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'approve' })
              });

              if (!response.ok) {
                throw new Error('Failed to approve action');
              }
            }

            console.log('Action approved successfully');
          } catch (error) {
            console.error('Failed to approve action:', error);
            throw error;
          }
        },

        rejectAction: async (actionId, feedback) => {
          try {
            console.log('Rejecting action:', actionId, 'with feedback:', feedback);
            
            const state = get();
            
            if (state.user?.id) {
              // Update in database
              await DatabaseService.updateAction(actionId, {
                status: 'rejected',
                error: feedback || 'Rejected by user',
                updatedAt: new Date()
              });
            } else {
              // Fallback to API
              const response = await fetch(`/api/agent/actions/${actionId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'reject', feedback })
              });

              if (!response.ok) {
                throw new Error('Failed to reject action');
              }
            }

            console.log('Action rejected successfully');
          } catch (error) {
            console.error('Failed to reject action:', error);
            throw error;
          }
        },

        // New database integration methods
        loadUserSession: async (userId: string) => {
          try {
            const user = await DatabaseService.getUser(userId);
            const sessions = await DatabaseService.getUserSessions(userId, 10);
            const apps = await DatabaseService.getUserApps(userId);
            const settings = await DatabaseService.getSettings(userId);

            set({
              user,
              installedApps: apps,
              autonomyLevel: settings?.preferences?.defaultAutonomyLevel || AutonomyLevel.SUGGEST_ONLY
            });

            // Load most recent session if available
            if (sessions.length > 0) {
              const latestSession = sessions[0];
              const messages = await DatabaseService.getSessionMessages(latestSession.id);
              set({
                currentSession: {
                  ...latestSession,
                  messages
                }
              });
            }
          } catch (error) {
            console.error('Failed to load user session:', error);
          }
        },        createNewSession: async (appId: string = 'shell') => {
          try {
            const state = get();
            if (!state.user?.id) return null;const sessionId = await DatabaseService.createSession(state.user.id, {
              userId: state.user.id,
              appId,
              messages: [],
              context: {
                userPreferences: state.user.preferences,
                memory: []
              },
              autonomyLevel: state.autonomyLevel,
              status: 'active' as any
            });

            const newSession: PromptSession = {
              id: sessionId,
              userId: state.user.id,
              appId,
              messages: [],
              context: {
                userPreferences: state.user.preferences,
                memory: []
              },
              autonomyLevel: state.autonomyLevel,
              status: 'active' as any,
              createdAt: new Date(),
              updatedAt: new Date()
            };

            set({ currentSession: newSession });
            return newSession;
          } catch (error) {
            console.error('Failed to create new session:', error);
            return null;
          }
        }
      }),
      {
        name: 'llm-os-store',
        // Only persist certain parts of the state
        partialize: (state) => ({
          activeView: state.activeView,
          sidebarCollapsed: state.sidebarCollapsed,
          autonomyLevel: state.autonomyLevel,
        }),
      }
    ),
    {
      name: 'llm-os-store',
    }
  )
);

// Selectors for better performance
export const useCurrentSession = () => useLLMOSStore(state => state.currentSession);
export const useActiveView = () => useLLMOSStore(state => state.activeView);
export const useInstalledApps = () => useLLMOSStore(state => state.installedApps);
export const useUser = () => useLLMOSStore(state => state.user);
export const useSystemHealth = () => useLLMOSStore(state => state.systemHealth);
