// Action Event System for LLM-OS
// Connects Terminal actions with VisualVerifier for real-time monitoring

export interface ActionEvent {
  id: string;
  type: 'command' | 'file' | 'app' | 'network' | 'ai' | 'approval_required';
  title: string;
  description: string;
  status: 'pending' | 'executing' | 'completed' | 'failed' | 'awaiting_approval';
  timestamp: Date;
  payload?: any;
  requiresApproval?: boolean;
  autonomyLevel?: number;
  source: 'terminal' | 'app' | 'system';
}

type ActionEventListener = (event: ActionEvent) => void;

class ActionEventSystem {
  private listeners: ActionEventListener[] = [];
  private actions: ActionEvent[] = [];

  // Subscribe to action events
  subscribe(listener: ActionEventListener): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Emit a new action event
  emit(event: Omit<ActionEvent, 'id' | 'timestamp'>): ActionEvent {
    const fullEvent: ActionEvent = {
      ...event,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    };

    this.actions.push(fullEvent);
    
    // Notify all listeners
    this.listeners.forEach(listener => {
      try {
        listener(fullEvent);
      } catch (error) {
        console.error('Error in action event listener:', error);
      }
    });

    return fullEvent;
  }

  // Update an existing action
  update(actionId: string, updates: Partial<ActionEvent>): ActionEvent | null {
    const actionIndex = this.actions.findIndex(a => a.id === actionId);
    if (actionIndex === -1) return null;

    const updatedAction = { ...this.actions[actionIndex], ...updates };
    this.actions[actionIndex] = updatedAction;

    // Notify listeners of the update
    this.listeners.forEach(listener => {
      try {
        listener(updatedAction);
      } catch (error) {
        console.error('Error in action event listener:', error);
      }
    });

    return updatedAction;
  }

  // Get all actions
  getActions(): ActionEvent[] {
    return [...this.actions];
  }

  // Get actions by status
  getActionsByStatus(status: ActionEvent['status']): ActionEvent[] {
    return this.actions.filter(action => action.status === status);
  }

  // Clear old actions (keep last N)
  cleanup(keepLast: number = 50): void {
    if (this.actions.length > keepLast) {
      this.actions = this.actions.slice(-keepLast);
    }
  }
}

// Global singleton instance
export const actionEventSystem = new ActionEventSystem();

// Helper functions for common action types
export const createTerminalAction = (
  type: 'command' | 'ai' | 'app',
  title: string,
  description: string,
  payload?: any,
  autonomyLevel?: number
): ActionEvent => {
  const requiresApproval = autonomyLevel === 2 && type !== 'ai';
  
  return actionEventSystem.emit({
    type,
    title,
    description,
    status: requiresApproval ? 'awaiting_approval' : 'executing',
    payload,
    requiresApproval,
    autonomyLevel,
    source: 'terminal',
  });
};

export const createAppAction = (
  appId: string,
  action: string,
  description: string,
  payload?: any
): ActionEvent => {
  return actionEventSystem.emit({
    type: 'app',
    title: `${appId}: ${action}`,
    description,
    status: 'executing',
    payload: { appId, action, ...payload },
    source: 'app',
  });
};

export const createFileAction = (
  operation: string,
  filepath: string,
  description: string,
  autonomyLevel?: number
): ActionEvent => {
  const requiresApproval = autonomyLevel !== undefined && autonomyLevel <= 2;
  
  return actionEventSystem.emit({
    type: 'file',
    title: `File ${operation}`,
    description,
    status: requiresApproval ? 'awaiting_approval' : 'executing',
    payload: { operation, filepath },
    requiresApproval,
    autonomyLevel,
    source: 'system',
  });
};

export const createNetworkAction = (
  url: string,
  method: string,
  description: string,
  autonomyLevel?: number
): ActionEvent => {
  const requiresApproval = autonomyLevel !== undefined && autonomyLevel <= 2;
  
  return actionEventSystem.emit({
    type: 'network',
    title: `Network ${method}`,
    description,
    status: requiresApproval ? 'awaiting_approval' : 'executing',
    payload: { url, method },
    requiresApproval,
    autonomyLevel,
    source: 'system',
  });
};

// Action completion helpers
export const completeAction = (actionId: string, result?: any): void => {
  actionEventSystem.update(actionId, {
    status: 'completed',
    payload: { ...actionEventSystem.getActions().find(a => a.id === actionId)?.payload, result }
  });
};

export const failAction = (actionId: string, error: string): void => {
  actionEventSystem.update(actionId, {
    status: 'failed',
    payload: { ...actionEventSystem.getActions().find(a => a.id === actionId)?.payload, error }
  });
};

export const approveAction = (actionId: string): void => {
  actionEventSystem.update(actionId, {
    status: 'executing'
  });
};

export const rejectAction = (actionId: string, reason: string): void => {
  actionEventSystem.update(actionId, {
    status: 'failed',
    payload: { ...actionEventSystem.getActions().find(a => a.id === actionId)?.payload, rejectionReason: reason }
  });
};
