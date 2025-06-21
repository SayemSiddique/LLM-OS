// Real Agent Orchestrator
import { LLMService } from '../llm/service';
import { AutonomyLevel, AgentAction, AgentActionType } from '../../types';

export class AgentOrchestrator {
  private llm: LLMService;
  private currentAutonomyLevel: AutonomyLevel = AutonomyLevel.EXECUTE_WITH_APPROVAL;

  constructor() {
    this.llm = new LLMService();
  }

  async executeTask(
    task: string,
    context: string[] = []
  ): Promise<{
    actions: AgentAction[];
    response: string;
  }> {
    // Analyze the task and determine what actions need to be taken
    const analysisPrompt = `
You are an AI agent orchestrator. Analyze this task and break it down into specific actions.

Task: ${task}
Context: ${context.join('\n')}

Available actions:
- FILE_READ: Read file contents
- FILE_WRITE: Write/modify files
- WEB_SEARCH: Search the web for information
- CODE_EXECUTION: Execute code snippets
- API_CALL: Make HTTP API calls

Return your analysis in this JSON format:
{
  "actions": [
    {
      "type": "ACTION_TYPE",
      "description": "What this action does",
      "payload": {
        "details": "specific parameters for the action"
      },
      "requiresApproval": true/false
    }
  ],
  "reasoning": "Why these actions are needed",
  "response": "A helpful response to the user"
}
`;

    try {
      const result = await this.llm.sendMessage(analysisPrompt);
      const parsed = JSON.parse(result.content);

      const actions: AgentAction[] = parsed.actions.map((action: any, index: number) => ({
        id: `action_${Date.now()}_${index}`,
        sessionId: 'current', // Would be actual session ID
        type: action.type as AgentActionType,
        description: action.description,
        payload: action.payload,
        status: this.shouldRequireApproval(action.type) ? 'pending' : 'approved',
        autonomyLevel: this.currentAutonomyLevel,
        timestamp: new Date(),
      }));

      return {
        actions,
        response: parsed.response || result.content
      };
    } catch (error) {
      console.error('Agent orchestration failed:', error);
      return {
        actions: [],
        response: `I encountered an error while analyzing your task: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

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

  private shouldRequireApproval(actionType: AgentActionType): boolean {
    switch (this.currentAutonomyLevel) {
      case AutonomyLevel.SUGGEST_ONLY:
        return true;
      case AutonomyLevel.EXECUTE_WITH_APPROVAL:
        return [
          AgentActionType.FILE_WRITE,
          AgentActionType.CODE_EXECUTION,
          AgentActionType.SYSTEM_COMMAND
        ].includes(actionType);
      case AutonomyLevel.AUTONOMOUS_WITH_OVERSIGHT:
        return [
          AgentActionType.SYSTEM_COMMAND,
          AgentActionType.EMAIL_SEND
        ].includes(actionType);
      case AutonomyLevel.FULL_AUTONOMOUS:
        return false;
      default:
        return true;
    }
  }

  private async readFile(path: string): Promise<string> {
    try {
      // In a real implementation, this would use a secure file API
      const response = await fetch(`/api/files/read?path=${encodeURIComponent(path)}`);
      if (!response.ok) throw new Error(`Failed to read file: ${response.statusText}`);
      return await response.text();
    } catch (error) {
      throw new Error(`File read failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async writeFile(path: string, content: string): Promise<void> {
    try {
      const response = await fetch('/api/files/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, content })
      });
      if (!response.ok) throw new Error(`Failed to write file: ${response.statusText}`);
    } catch (error) {
      throw new Error(`File write failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async webSearch(query: string): Promise<any> {
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      if (!response.ok) throw new Error(`Search failed: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      throw new Error(`Web search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async executeCode(code: string, language: string): Promise<any> {
    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language })
      });
      if (!response.ok) throw new Error(`Code execution failed: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      throw new Error(`Code execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async makeApiCall(url: string, method: string, data?: any): Promise<any> {
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: data ? JSON.stringify(data) : undefined
      });
      if (!response.ok) throw new Error(`API call failed: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      throw new Error(`API call failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  setAutonomyLevel(level: AutonomyLevel) {
    this.currentAutonomyLevel = level;
  }

  getAutonomyLevel(): AutonomyLevel {
    return this.currentAutonomyLevel;
  }
}
