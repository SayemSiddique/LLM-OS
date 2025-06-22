// Backward compatibility layer - redirects to enhanced orchestrator
export { EnhancedAgentOrchestrator as AgentOrchestrator } from './enhancedOrchestrator';

// Also export the enhanced version directly
export { EnhancedAgentOrchestrator } from './enhancedOrchestrator';

// Export additional types for enhanced orchestration
export type { Agent, TaskDependency, AgentTask, MultiAgentResponse } from './enhancedOrchestrator';
