/**
 * Enhanced Multi-Agent Orchestrator for LLM-OS
 * Provides advanced task coordination, dependency management, and load balancing
 */

import { LLMService } from '../llm/service';
import { memoryManager } from '../memory/memoryManager';
import { AutonomyLevel, AgentAction, AgentActionType, EnhancedAgentAction } from '../../types';

// Enhanced interfaces for multi-agent coordination
export interface Agent {
  id: string;
  name: string;
  type: 'executor' | 'coordinator' | 'specialist';
  capabilities: string[];
  currentLoad: number;
  maxLoad: number;
  status: 'idle' | 'busy' | 'offline';
  specializations: string[];
}

export interface TaskDependency {
  taskId: string;
  dependsOn: string[];
  dependents: string[];
  priority: number;
}

export interface AgentTask {
  id: string;
  description: string;
  type: 'simple' | 'complex' | 'coordination';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'assigned' | 'executing' | 'completed' | 'failed';  assignedAgent?: string;
  dependencies: TaskDependency[];
  actions: EnhancedAgentAction[];
  deadline?: Date;
  context: Record<string, any>;
  estimatedDuration?: number;
  actualDuration?: number;
}

export interface MultiAgentResponse {
  taskId: string;
  actions: AgentAction[];
  response: string;
  assignedAgents: string[];
  dependencies: TaskDependency[];
  estimatedCompletion: Date;
}

export class EnhancedAgentOrchestrator {
  private llm: LLMService;
  private currentAutonomyLevel: AutonomyLevel = AutonomyLevel.EXECUTE_WITH_APPROVAL;
  private agents: Map<string, Agent> = new Map();
  private tasks: Map<string, AgentTask> = new Map();
  private executionQueue: string[] = [];
  private completedTasks: string[] = [];

  constructor() {
    this.llm = new LLMService();
    this.initializeAgents();
  }

  /**
   * Initialize the default agent pool
   */
  private initializeAgents(): void {
    const defaultAgents: Agent[] = [
      {
        id: 'coordinator-001',
        name: 'Task Coordinator',
        type: 'coordinator',
        capabilities: ['task_analysis', 'dependency_management', 'resource_allocation'],
        currentLoad: 0,
        maxLoad: 5,
        status: 'idle',
        specializations: ['planning', 'coordination', 'optimization']
      },
      {
        id: 'executor-001',
        name: 'File Operations Agent',
        type: 'executor',
        capabilities: ['file_read', 'file_write', 'file_management'],
        currentLoad: 0,
        maxLoad: 10,
        status: 'idle',
        specializations: ['filesystem', 'data_processing']
      },
      {
        id: 'executor-002',
        name: 'Web Research Agent',
        type: 'executor',
        capabilities: ['web_search', 'api_calls', 'data_extraction'],
        currentLoad: 0,
        maxLoad: 8,
        status: 'idle',
        specializations: ['research', 'information_gathering']
      },
      {
        id: 'specialist-001',
        name: 'Code Analysis Agent',
        type: 'specialist',
        capabilities: ['code_execution', 'code_analysis', 'debugging'],
        currentLoad: 0,
        maxLoad: 6,
        status: 'idle',
        specializations: ['programming', 'analysis', 'debugging']
      }
    ];

    defaultAgents.forEach(agent => {
      this.agents.set(agent.id, agent);
    });
  }

  /**
   * Enhanced task execution with multi-agent coordination
   */
  async executeTask(
    task: string,
    context: string[] = [],
    options?: {
      priority?: 'low' | 'medium' | 'high' | 'critical';
      deadline?: Date;
      maxAgents?: number;
    }
  ): Promise<MultiAgentResponse> {
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Analyze task complexity and requirements
    const taskAnalysis = await this.analyzeTaskComplexity(task, context);
    
    // Create structured task
    const agentTask: AgentTask = {
      id: taskId,
      description: task,
      type: taskAnalysis.complexity,
      priority: options?.priority || 'medium',
      status: 'pending',
      dependencies: [],
      actions: [],
      context: {
        userContext: context,
        autonomyLevel: this.currentAutonomyLevel,
        maxAgents: options?.maxAgents || 3
      },
      deadline: options?.deadline,
      estimatedDuration: taskAnalysis.estimatedDuration
    };

    this.tasks.set(taskId, agentTask);

    // Decompose task into subtasks and create dependency graph
    const decomposition = await this.decomposeTask(agentTask);
    agentTask.actions = decomposition.actions;
    agentTask.dependencies = decomposition.dependencies;

    // Assign agents based on capabilities and load
    const assignedAgents = await this.assignAgents(agentTask);
    
    // Execute with coordination
    const executionResult = await this.coordinateExecution(agentTask, assignedAgents);

    // Learn from execution for future optimization
    await this.learnFromExecution(agentTask, executionResult);

    return {
      taskId,
      actions: agentTask.actions,
      response: executionResult.response,
      assignedAgents: assignedAgents.map(a => a.id),
      dependencies: agentTask.dependencies,
      estimatedCompletion: new Date(Date.now() + (agentTask.estimatedDuration || 60000))
    };
  }

  /**
   * Analyze task complexity and requirements
   */
  private async analyzeTaskComplexity(task: string, context: string[]): Promise<{
    complexity: 'simple' | 'complex' | 'coordination';
    estimatedDuration: number;
    requiredCapabilities: string[];
  }> {
    const analysisPrompt = `
Analyze this task for complexity, duration, and required capabilities:

Task: ${task}
Context: ${context.join('\n')}

Consider:
- How many steps are involved?
- Does it require coordination between different systems?
- What specialized knowledge is needed?
- Are there dependencies between subtasks?

Return JSON:
{
  "complexity": "simple|complex|coordination",
  "estimatedDuration": <milliseconds>,
  "requiredCapabilities": ["cap1", "cap2"],
  "reasoning": "explanation"
}`;

    try {
      const result = await this.llm.sendMessage(analysisPrompt);
      const analysis = JSON.parse(result.content);
      
      return {
        complexity: analysis.complexity || 'simple',
        estimatedDuration: analysis.estimatedDuration || 30000,
        requiredCapabilities: analysis.requiredCapabilities || []
      };
    } catch (error) {
      console.error('Task analysis failed:', error);
      return {
        complexity: 'simple',
        estimatedDuration: 30000,
        requiredCapabilities: ['general']
      };
    }
  }

  /**
   * Decompose complex tasks into subtasks with dependencies
   */
  private async decomposeTask(task: AgentTask): Promise<{
    actions: AgentAction[];
    dependencies: TaskDependency[];
  }> {
    const decompositionPrompt = `
Break down this task into specific actions with dependencies:

Task: ${task.description}
Context: ${JSON.stringify(task.context)}
Type: ${task.type}

Available action types:
- FILE_READ, FILE_WRITE, WEB_SEARCH, CODE_EXECUTION, API_CALL

Return JSON:
{
  "actions": [
    {
      "type": "ACTION_TYPE",
      "description": "what this does",
      "payload": {"specific": "parameters"},
      "dependencies": ["action_id1", "action_id2"],
      "priority": 1-10
    }
  ],
  "dependencies": [
    {
      "taskId": "action_id",
      "dependsOn": ["prereq_ids"],
      "priority": 1-10
    }
  ]
}`;

    try {
      const result = await this.llm.sendMessage(decompositionPrompt);
      const decomposition = JSON.parse(result.content);
        const actions: EnhancedAgentAction[] = decomposition.actions.map((action: any, index: number) => ({
        id: `${task.id}_action_${index}`,
        sessionId: 'current',
        type: action.type as AgentActionType,
        description: action.description,
        payload: action.payload,
        status: this.shouldRequireApproval(action.type) ? 'pending' : 'approved',
        autonomyLevel: this.currentAutonomyLevel,
        timestamp: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        priority: action.priority || 5,
        dependencies: action.dependencies || []
      }));

      const dependencies: TaskDependency[] = decomposition.dependencies.map((dep: any) => ({
        taskId: dep.taskId,
        dependsOn: dep.dependsOn || [],
        dependents: [],
        priority: dep.priority || 5
      }));

      return { actions, dependencies };
    } catch (error) {
      console.error('Task decomposition failed:', error);
      // Fallback to simple single action
      return {        actions: [{
          id: `${task.id}_action_0`,
          sessionId: 'current',
          type: AgentActionType.API_CALL,
          description: task.description,
          payload: { task: task.description },
          status: 'approved',
          autonomyLevel: this.currentAutonomyLevel,
          timestamp: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        }],
        dependencies: []
      };
    }
  }

  /**
   * Assign agents based on capabilities and current load
   */
  private async assignAgents(task: AgentTask): Promise<Agent[]> {
    const requiredCapabilities = new Set<string>();
    
    // Extract required capabilities from actions
    task.actions.forEach(action => {
      switch (action.type) {
        case AgentActionType.FILE_READ:
        case AgentActionType.FILE_WRITE:
          requiredCapabilities.add('file_management');
          break;
        case AgentActionType.WEB_SEARCH:
          requiredCapabilities.add('web_search');
          break;
        case AgentActionType.CODE_EXECUTION:
          requiredCapabilities.add('code_execution');
          break;
        case AgentActionType.API_CALL:
          requiredCapabilities.add('api_calls');
          break;
      }
    });

    // Find suitable agents
    const suitableAgents = Array.from(this.agents.values())
      .filter(agent => {
        // Check if agent has required capabilities
        const hasCapabilities = Array.from(requiredCapabilities).some(cap =>
          agent.capabilities.includes(cap)
        );
        // Check if agent is available
        const isAvailable = agent.status === 'idle' && agent.currentLoad < agent.maxLoad;
        
        return hasCapabilities && isAvailable;
      })
      .sort((a, b) => {
        // Prioritize by load (lower is better) and capabilities match
        const aScore = a.currentLoad + (a.type === 'coordinator' ? -2 : 0);
        const bScore = b.currentLoad + (b.type === 'coordinator' ? -2 : 0);
        return aScore - bScore;
      });

    // Assign agents up to maxAgents limit
    const maxAgents = task.context.maxAgents || 3;
    const assignedAgents = suitableAgents.slice(0, maxAgents);

    // Update agent loads
    assignedAgents.forEach(agent => {
      agent.currentLoad += 1;
      agent.status = 'busy';
    });

    return assignedAgents;
  }

  /**
   * Coordinate execution with dependency management
   */
  private async coordinateExecution(task: AgentTask, agents: Agent[]): Promise<{
    response: string;
    results: any[];
  }> {
    const results: any[] = [];
    const completedActions = new Set<string>();
    
    // Build execution order respecting dependencies
    const executionOrder = this.buildExecutionOrder(task.actions, task.dependencies);
    
    let response = `🤖 Multi-Agent Task Execution Started\n`;
    response += `📋 Task: ${task.description}\n`;
    response += `👥 Assigned Agents: ${agents.map(a => a.name).join(', ')}\n`;
    response += `🔢 Actions: ${task.actions.length}\n\n`;

    // Execute actions in order
    for (const actionId of executionOrder) {
      const action = task.actions.find(a => a.id === actionId);
      if (!action) continue;

      // Check if dependencies are met
      const dependenciesMet = action.dependencies?.every(depId => 
        completedActions.has(depId)
      ) ?? true;

      if (!dependenciesMet) {
        response += `⏸️ Waiting for dependencies: ${action.description}\n`;
        continue;
      }

      // Find best agent for this action
      const bestAgent = agents.find(agent => 
        this.canAgentExecuteAction(agent, action)
      );

      if (!bestAgent) {
        response += `❌ No suitable agent for: ${action.description}\n`;
        continue;
      }

      try {
        response += `🔄 ${bestAgent.name} executing: ${action.description}\n`;
        const actionResult = await this.executeAction(action);
        results.push({ actionId: action.id, result: actionResult });
        completedActions.add(action.id);
        response += `✅ Completed: ${action.description}\n`;
        
        // Store successful execution pattern in memory
        await memoryManager.learnFromInteraction(          `Agent ${bestAgent.name} executed ${action.type}`,
          `Successfully completed: ${action.description}`,
          'positive',
          { userId: 'system' }
        );
      } catch (error) {
        response += `❌ Failed: ${action.description} - ${error instanceof Error ? error.message : 'Unknown error'}\n`;
        
        // Learn from failures too
        await memoryManager.learnFromInteraction(          `Agent ${bestAgent.name} failed ${action.type}`,
          `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          'negative',
          { userId: 'system' }
        );
      }
    }

    // Release agent resources
    agents.forEach(agent => {
      agent.currentLoad = Math.max(0, agent.currentLoad - 1);
      if (agent.currentLoad === 0) {
        agent.status = 'idle';
      }
    });

    response += `\n🎯 Task completed with ${results.length}/${task.actions.length} successful actions`;
    
    return { response, results };
  }
  /**
   * Build execution order respecting dependencies
   */
  private buildExecutionOrder(actions: EnhancedAgentAction[], dependencies: TaskDependency[]): string[] {
    const order: string[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (actionId: string) => {
      if (visiting.has(actionId)) {
        throw new Error(`Circular dependency detected involving ${actionId}`);
      }
      if (visited.has(actionId)) return;

      visiting.add(actionId);
      
      // Visit dependencies first
      const action = actions.find(a => a.id === actionId);
      if (action?.dependencies) {
        action.dependencies.forEach(depId => visit(depId));
      }

      visiting.delete(actionId);
      visited.add(actionId);
      order.push(actionId);
    };

    // Visit all actions
    actions.forEach(action => {
      if (!visited.has(action.id)) {
        visit(action.id);
      }
    });

    return order;
  }

  /**
   * Check if agent can execute specific action
   */
  private canAgentExecuteAction(agent: Agent, action: AgentAction): boolean {
    const actionCapabilityMap: Record<string, string[]> = {
      [AgentActionType.FILE_READ]: ['file_read', 'file_management'],
      [AgentActionType.FILE_WRITE]: ['file_write', 'file_management'],
      [AgentActionType.WEB_SEARCH]: ['web_search', 'api_calls'],
      [AgentActionType.CODE_EXECUTION]: ['code_execution', 'code_analysis'],
      [AgentActionType.API_CALL]: ['api_calls', 'web_search']
    };

    const requiredCapabilities = actionCapabilityMap[action.type] || [];
    return requiredCapabilities.some(cap => agent.capabilities.includes(cap));
  }

  /**
   * Learn from execution patterns for future optimization
   */
  private async learnFromExecution(task: AgentTask, result: any): Promise<void> {
    const executionPattern = {
      taskType: task.type,
      priority: task.priority,
      actionsCount: task.actions.length,
      estimatedDuration: task.estimatedDuration,
      actualDuration: task.actualDuration,
      success: result.results.length > 0
    };

    await memoryManager.storeMemory(      `Multi-agent execution pattern: ${JSON.stringify(executionPattern)}`,
      'workflow_pattern',
      { userId: 'system' },
      ['agent_orchestration', 'execution_pattern', task.type]
    );
  }

  // Legacy method for backward compatibility
  async executeAction(action: AgentAction): Promise<any> {
    switch (action.type) {
      case AgentActionType.FILE_READ:
        return await this.readFile(action.payload.path);
      
      case AgentActionType.FILE_WRITE:
        return await this.writeFile(action.payload.path, action.payload.content);
      
      case AgentActionType.WEB_SEARCH:
        return await this.webSearch(action.payload.query);
      
      case AgentActionType.CODE_EXECUTION:
        return await this.executeCode(action.payload.code, action.payload.language);
      
      case AgentActionType.API_CALL:
        return await this.makeApiCall(action.payload.url, action.payload.method, action.payload.data);
      
      default:
        throw new Error(`Unsupported action type: ${action.type}`);
    }
  }

  // Helper methods (simplified versions - would integrate with actual system APIs)
  private async readFile(path: string): Promise<string> {
    // In a real implementation, this would read from actual filesystem
    return `Contents of ${path}`;
  }

  private async writeFile(path: string, content: string): Promise<void> {
    // In a real implementation, this would write to actual filesystem
    console.log(`Writing to ${path}: ${content}`);
  }

  private async webSearch(query: string): Promise<any> {
    // In a real implementation, this would use actual search APIs
    return {
      query,
      results: [`Result 1 for ${query}`, `Result 2 for ${query}`],
      totalResults: 2
    };
  }

  private async executeCode(code: string, language: string): Promise<any> {
    // In a real implementation, this would execute code in sandboxed environment
    return {
      code,
      language,
      output: `Executed ${language} code`,
      success: true
    };
  }

  private async makeApiCall(url: string, method: string, data?: any): Promise<any> {
    // In a real implementation, this would make actual HTTP requests
    return {
      url,
      method,
      status: 200,
      response: `API call to ${url} successful`
    };
  }

  private shouldRequireApproval(actionType: AgentActionType): boolean {
    if (this.currentAutonomyLevel === AutonomyLevel.SUGGEST_ONLY) return true;
    if (this.currentAutonomyLevel === AutonomyLevel.EXECUTE_WITH_APPROVAL) {
      return [AgentActionType.FILE_WRITE, AgentActionType.CODE_EXECUTION].includes(actionType);
    }
    return false;
  }

  // Getter methods for monitoring
  getAgentStatus(): Agent[] {
    return Array.from(this.agents.values());
  }

  getActiveTasks(): AgentTask[] {
    return Array.from(this.tasks.values()).filter(t => 
      ['pending', 'assigned', 'executing'].includes(t.status)
    );
  }

  getTaskHistory(): AgentTask[] {
    return Array.from(this.tasks.values()).filter(t => 
      ['completed', 'failed'].includes(t.status)
    );
  }
}
