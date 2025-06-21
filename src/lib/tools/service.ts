import { AgentAction, AgentActionType, AutonomyLevel } from '../../types';

export interface ToolResult {
  success: boolean;
  data?: any;
  error?: string;
  metadata?: Record<string, any>;
}

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
  relevanceScore?: number;
}

export interface FileOperation {
  path: string;
  content?: string;
  operation: 'read' | 'write' | 'delete' | 'create' | 'list';
  options?: {
    encoding?: string;
    recursive?: boolean;
    backup?: boolean;
  };
}

export interface CodeExecution {
  language: 'python' | 'javascript' | 'bash' | 'typescript';
  code: string;
  environment?: 'sandbox' | 'local';
  timeout?: number;
  allowedModules?: string[];
}

export class ToolService {
  // Web Search Implementation
  static async webSearch(query: string, maxResults = 10): Promise<ToolResult> {
    try {
      // Using SerpAPI or similar service for real web search
      const response = await fetch(`/api/tools/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, maxResults })
      });

      if (!response.ok) {
        throw new Error('Search request failed');
      }

      const results = await response.json();
      
      return {
        success: true,
        data: results.results as SearchResult[],
        metadata: {
          query,
          totalResults: results.totalResults,
          searchTime: results.searchTime,
          source: 'web_search'
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Search failed',
        metadata: { query }
      };
    }
  }

  // File System Operations
  static async executeFileOperation(operation: FileOperation): Promise<ToolResult> {
    try {
      const response = await fetch(`/api/tools/filesystem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(operation)
      });

      if (!response.ok) {
        throw new Error('File operation failed');
      }

      const result = await response.json();
      
      return {
        success: true,
        data: result.data,
        metadata: {
          operation: operation.operation,
          path: operation.path,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'File operation failed',
        metadata: { operation: operation.operation, path: operation.path }
      };
    }
  }

  // Code Execution in Sandbox
  static async executeCode(execution: CodeExecution): Promise<ToolResult> {
    try {
      const response = await fetch(`/api/tools/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(execution)
      });

      if (!response.ok) {
        throw new Error('Code execution failed');
      }

      const result = await response.json();
      
      return {
        success: true,
        data: {
          output: result.output,
          stdout: result.stdout,
          stderr: result.stderr,
          exitCode: result.exitCode,
          executionTime: result.executionTime
        },
        metadata: {
          language: execution.language,
          environment: execution.environment || 'sandbox',
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Code execution failed',
        metadata: { language: execution.language }
      };
    }
  }

  // API Integration Helper
  static async makeAPIRequest(config: {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    data?: any;
    timeout?: number;
  }): Promise<ToolResult> {
    try {
      const response = await fetch(`/api/tools/api-proxy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const result = await response.json();
      
      return {
        success: true,
        data: result.data,
        metadata: {
          url: config.url,
          method: config.method,
          statusCode: result.statusCode,
          responseTime: result.responseTime,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'API request failed',
        metadata: { url: config.url, method: config.method }
      };
    }
  }

  // Email/Communication
  static async sendEmail(config: {
    to: string[];
    subject: string;
    body: string;
    attachments?: Array<{ name: string; content: string; type: string }>;
  }): Promise<ToolResult> {
    try {
      const response = await fetch(`/api/tools/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });

      if (!response.ok) {
        throw new Error('Email sending failed');
      }

      const result = await response.json();
      
      return {
        success: true,
        data: { messageId: result.messageId },
        metadata: {
          recipients: config.to.length,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Email sending failed',
        metadata: { recipients: config.to }
      };
    }
  }

  // Database Query Execution
  static async executeDatabaseQuery(config: {
    query: string;
    parameters?: Record<string, any>;
    database?: string;
    readonly?: boolean;
  }): Promise<ToolResult> {
    try {
      const response = await fetch(`/api/tools/database`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });

      if (!response.ok) {
        throw new Error('Database query failed');
      }

      const result = await response.json();
      
      return {
        success: true,
        data: {
          rows: result.rows,
          rowCount: result.rowCount,
          affectedRows: result.affectedRows
        },
        metadata: {
          query: config.query.substring(0, 100) + (config.query.length > 100 ? '...' : ''),
          database: config.database,
          readonly: config.readonly,
          executionTime: result.executionTime,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Database query failed',
        metadata: { database: config.database }
      };
    }  }
  // Tool validation and security checks
  static validateToolAccess(
    actionType: AgentActionType, 
    autonomyLevel: AutonomyLevel, 
    payload: any
  ): { allowed: boolean; requiresApproval: boolean; reason?: string } {
    // Define base security rules
    const baseRules: Record<AgentActionType, {
      minAutonomy: AutonomyLevel;
      requiresApprovalFn: (level: AutonomyLevel) => boolean;
      validation: (payload: any) => boolean;
    }> = {
      [AgentActionType.FILE_READ]: {
        minAutonomy: AutonomyLevel.SUGGEST_ONLY,
        requiresApprovalFn: () => false,
        validation: () => true
      },
      [AgentActionType.FILE_WRITE]: {
        minAutonomy: AutonomyLevel.EXECUTE_WITH_APPROVAL,
        requiresApprovalFn: () => true,
        validation: (payload: any) => {
          // Check for sensitive file paths
          const dangerousPaths = ['/etc/', '/usr/', '/bin/', 'C:\\Windows\\', 'C:\\Program Files\\'];
          return !dangerousPaths.some(path => payload.path?.startsWith(path));
        }
      },
      [AgentActionType.CODE_EXECUTION]: {
        minAutonomy: AutonomyLevel.EXECUTE_WITH_APPROVAL,
        requiresApprovalFn: () => true,
        validation: (payload: any) => {
          // Check for dangerous code patterns
          const dangerousPatterns = ['import os', 'subprocess', 'eval(', 'exec(', 'rm -rf', 'del /f'];
          return !dangerousPatterns.some(pattern => payload.code?.includes(pattern));
        }
      },
      [AgentActionType.API_CALL]: {
        minAutonomy: AutonomyLevel.SUGGEST_ONLY,
        requiresApprovalFn: (level: AutonomyLevel) => level < AutonomyLevel.AUTONOMOUS_WITH_OVERSIGHT,
        validation: (payload: any) => {
          // Check for external API calls
          const trustedDomains = ['api.openai.com', 'localhost', '127.0.0.1'];
          try {
            const url = new URL(payload.url);
            return trustedDomains.some(domain => url.hostname.includes(domain));
          } catch {
            return false;
          }
        }
      },
      [AgentActionType.WEB_SEARCH]: {
        minAutonomy: AutonomyLevel.SUGGEST_ONLY,
        requiresApprovalFn: () => false,
        validation: () => true // Generally safe
      },
      [AgentActionType.EMAIL_SEND]: {
        minAutonomy: AutonomyLevel.EXECUTE_WITH_APPROVAL,
        requiresApprovalFn: () => true,
        validation: (payload: any) => {
          // Validate email addresses and content
          return payload.to?.every((email: string) => email.includes('@')) && payload.body?.length < 10000;
        }
      },
      [AgentActionType.DATABASE_QUERY]: {
        minAutonomy: AutonomyLevel.EXECUTE_WITH_APPROVAL,
        requiresApprovalFn: () => true,
        validation: (payload: any) => {
          // Only allow SELECT queries for lower autonomy levels
          if (autonomyLevel < AutonomyLevel.AUTONOMOUS_WITH_OVERSIGHT) {
            return payload.query?.toLowerCase().trim().startsWith('select');
          }
          return true;
        }
      },
      [AgentActionType.SYSTEM_COMMAND]: {
        minAutonomy: AutonomyLevel.AUTONOMOUS_WITH_OVERSIGHT,
        requiresApprovalFn: () => true,
        validation: (payload: any) => {
          // Very restrictive for system commands
          const allowedCommands = ['ls', 'dir', 'pwd', 'whoami', 'date'];
          const command = payload.command?.split(' ')[0];
          return allowedCommands.includes(command);
        }
      }
    };

    const rule = baseRules[actionType];
    if (!rule) {
      return { allowed: false, requiresApproval: false, reason: 'Unknown action type' };
    }

    if (autonomyLevel < rule.minAutonomy) {
      return { allowed: false, requiresApproval: false, reason: 'Insufficient autonomy level' };
    }

    if (!rule.validation(payload)) {
      return { allowed: false, requiresApproval: false, reason: 'Security validation failed' };
    }

    return {
      allowed: true,
      requiresApproval: rule.requiresApprovalFn(autonomyLevel)
    };
  }
}

export default ToolService;
