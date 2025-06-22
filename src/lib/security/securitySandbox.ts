/**
 * Security Sandbox for LLM-OS
 * Provides isolated execution environments and permission control
 */

export interface SecurityPermission {
  id: string;
  name: string;
  description: string;
  level: 'low' | 'medium' | 'high' | 'critical';
  category: 'filesystem' | 'network' | 'system' | 'data' | 'ai';
  granted: boolean;
  requestedBy: string;
  requestTime: Date;
  grantedTime?: Date;
}

export interface SandboxProfile {
  id: string;
  name: string;
  description: string;
  permissions: SecurityPermission[];
  resourceLimits: ResourceLimits;
  networkAccess: NetworkAccess;
  aiAccess: AIAccess;
  dataAccess: DataAccess;
}

export interface ResourceLimits {
  maxMemoryMB: number;
  maxCpuPercent: number;
  maxExecutionTimeMs: number;
  maxFileSize: number;
  maxNetworkRequests: number;
}

export interface NetworkAccess {
  allowedDomains: string[];
  blockedDomains: string[];
  allowHTTPS: boolean;
  allowHTTP: boolean;
  allowLocalhost: boolean;
  maxRequestSize: number;
}

export interface AIAccess {
  allowLLMAccess: boolean;
  allowRemoteAI: boolean;
  allowLocalAI: boolean;
  allowTraining: boolean;
  maxTokensPerRequest: number;
  allowedModels: string[];
}

export interface DataAccess {
  allowUserData: boolean;
  allowSystemData: boolean;
  allowSensitiveData: boolean;
  allowCrossUserData: boolean;
  encryptionRequired: boolean;
  auditRequired: boolean;
}

export interface SandboxExecution {
  id: string;
  profileId: string;
  code: string;
  language: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'timeout' | 'blocked';
  startTime: Date;
  endTime?: Date;
  result?: any;
  error?: string;
  resourceUsage: ResourceUsage;
  permissionRequests: SecurityPermission[];
  violations: SecurityViolation[];
}

export interface ResourceUsage {
  memoryUsedMB: number;
  cpuTimeMs: number;
  executionTimeMs: number;
  networkRequests: number;
  filesAccessed: string[];
  bytesTransferred: number;
}

export interface SecurityViolation {
  id: string;
  type: 'permission' | 'resource' | 'network' | 'data' | 'ai';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: Date;
  blocked: boolean;
  executionId: string;
}

export class SecuritySandbox {
  private profiles: Map<string, SandboxProfile> = new Map();
  private executions: Map<string, SandboxExecution> = new Map();
  private violations: SecurityViolation[] = [];
  private isEnabled: boolean = true;

  constructor() {
    this.initializeDefaultProfiles();
  }

  /**
   * Initialize default security profiles
   */
  private initializeDefaultProfiles(): void {
    // Restricted Profile - Minimal permissions
    const restrictedProfile: SandboxProfile = {
      id: 'restricted',
      name: 'Restricted',
      description: 'Minimal permissions for basic operations',
      permissions: [
        this.createPermission('read_public_data', 'Read public data', 'low', 'data'),
        this.createPermission('basic_ai_access', 'Basic AI interactions', 'low', 'ai')
      ],
      resourceLimits: {
        maxMemoryMB: 50,
        maxCpuPercent: 10,
        maxExecutionTimeMs: 5000,
        maxFileSize: 1024 * 1024, // 1MB
        maxNetworkRequests: 5
      },
      networkAccess: {
        allowedDomains: ['api.openai.com'],
        blockedDomains: [],
        allowHTTPS: true,
        allowHTTP: false,
        allowLocalhost: false,
        maxRequestSize: 1024 * 100 // 100KB
      },
      aiAccess: {
        allowLLMAccess: true,
        allowRemoteAI: true,
        allowLocalAI: false,
        allowTraining: false,
        maxTokensPerRequest: 1000,
        allowedModels: ['gpt-3.5-turbo']
      },
      dataAccess: {
        allowUserData: false,
        allowSystemData: false,
        allowSensitiveData: false,
        allowCrossUserData: false,
        encryptionRequired: true,
        auditRequired: true
      }
    };

    // Standard Profile - Balanced permissions
    const standardProfile: SandboxProfile = {
      id: 'standard',
      name: 'Standard',
      description: 'Balanced permissions for typical operations',
      permissions: [
        this.createPermission('read_user_data', 'Read user data', 'medium', 'data'),
        this.createPermission('write_user_data', 'Write user data', 'medium', 'data'),
        this.createPermission('network_access', 'Network access', 'medium', 'network'),
        this.createPermission('ai_access', 'AI model access', 'medium', 'ai'),
        this.createPermission('file_operations', 'File operations', 'medium', 'filesystem')
      ],
      resourceLimits: {
        maxMemoryMB: 200,
        maxCpuPercent: 30,
        maxExecutionTimeMs: 30000,
        maxFileSize: 10 * 1024 * 1024, // 10MB
        maxNetworkRequests: 20
      },
      networkAccess: {
        allowedDomains: ['*'],
        blockedDomains: ['malicious-site.com'],
        allowHTTPS: true,
        allowHTTP: true,
        allowLocalhost: true,
        maxRequestSize: 1024 * 1024 // 1MB
      },
      aiAccess: {
        allowLLMAccess: true,
        allowRemoteAI: true,
        allowLocalAI: true,
        allowTraining: false,
        maxTokensPerRequest: 4000,
        allowedModels: ['gpt-3.5-turbo', 'gpt-4']
      },
      dataAccess: {
        allowUserData: true,
        allowSystemData: false,
        allowSensitiveData: false,
        allowCrossUserData: false,
        encryptionRequired: true,
        auditRequired: true
      }
    };

    // Admin Profile - Full permissions
    const adminProfile: SandboxProfile = {
      id: 'admin',
      name: 'Administrator',
      description: 'Full system access for administrative tasks',
      permissions: [
        this.createPermission('full_system_access', 'Full system access', 'critical', 'system'),
        this.createPermission('all_data_access', 'All data access', 'critical', 'data'),
        this.createPermission('unrestricted_network', 'Unrestricted network', 'high', 'network'),
        this.createPermission('advanced_ai_access', 'Advanced AI access', 'high', 'ai'),
        this.createPermission('system_modification', 'System modification', 'critical', 'system')
      ],
      resourceLimits: {
        maxMemoryMB: 1000,
        maxCpuPercent: 80,
        maxExecutionTimeMs: 300000,
        maxFileSize: 100 * 1024 * 1024, // 100MB
        maxNetworkRequests: 100
      },
      networkAccess: {
        allowedDomains: ['*'],
        blockedDomains: [],
        allowHTTPS: true,
        allowHTTP: true,
        allowLocalhost: true,
        maxRequestSize: 10 * 1024 * 1024 // 10MB
      },
      aiAccess: {
        allowLLMAccess: true,
        allowRemoteAI: true,
        allowLocalAI: true,
        allowTraining: true,
        maxTokensPerRequest: 16000,
        allowedModels: ['*']
      },
      dataAccess: {
        allowUserData: true,
        allowSystemData: true,
        allowSensitiveData: true,
        allowCrossUserData: true,
        encryptionRequired: false,
        auditRequired: true
      }
    };

    this.profiles.set(restrictedProfile.id, restrictedProfile);
    this.profiles.set(standardProfile.id, standardProfile);
    this.profiles.set(adminProfile.id, adminProfile);
  }

  /**
   * Execute code in a sandboxed environment
   */
  async executeInSandbox(
    code: string,
    language: string,
    profileId: string = 'standard',
    context?: any
  ): Promise<SandboxExecution> {
    if (!this.isEnabled) {
      throw new Error('Security sandbox is disabled');
    }

    const profile = this.profiles.get(profileId);
    if (!profile) {
      throw new Error(`Security profile '${profileId}' not found`);
    }

    const execution: SandboxExecution = {
      id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      profileId,
      code,
      language,
      status: 'queued',
      startTime: new Date(),
      resourceUsage: {
        memoryUsedMB: 0,
        cpuTimeMs: 0,
        executionTimeMs: 0,
        networkRequests: 0,
        filesAccessed: [],
        bytesTransferred: 0
      },
      permissionRequests: [],
      violations: []
    };

    this.executions.set(execution.id, execution);

    try {
      // Pre-execution security checks
      await this.performSecurityChecks(execution, profile);

      execution.status = 'running';
      const startTime = Date.now();

      // Simulate code execution with security monitoring
      const result = await this.executeCodeSecurely(execution, profile, context);

      execution.endTime = new Date();
      execution.resourceUsage.executionTimeMs = Date.now() - startTime;
      execution.result = result;
      execution.status = 'completed';

      return execution;
    } catch (error) {
      execution.status = 'failed';
      execution.error = error instanceof Error ? error.message : 'Unknown error';
      execution.endTime = new Date();
      return execution;
    }
  }

  /**
   * Check if an action is permitted
   */
  async checkPermission(
    executionId: string,
    permissionName: string,
    context?: any
  ): Promise<boolean> {
    const execution = this.executions.get(executionId);
    if (!execution) return false;

    const profile = this.profiles.get(execution.profileId);
    if (!profile) return false;

    const permission = profile.permissions.find(p => p.name === permissionName);
    if (!permission) {
      // Create violation for missing permission
      this.createViolation(execution, 'permission', 'medium', 
        `Attempted to use undeclared permission: ${permissionName}`);
      return false;
    }

    if (!permission.granted) {
      this.createViolation(execution, 'permission', 'high', 
        `Attempted to use denied permission: ${permissionName}`);
      return false;
    }

    return true;
  }

  /**
   * Monitor resource usage
   */
  monitorResourceUsage(executionId: string, usage: Partial<ResourceUsage>): boolean {
    const execution = this.executions.get(executionId);
    if (!execution) return false;

    const profile = this.profiles.get(execution.profileId);
    if (!profile) return false;

    // Update resource usage
    Object.assign(execution.resourceUsage, usage);

    // Check limits
    const violations: string[] = [];

    if (execution.resourceUsage.memoryUsedMB > profile.resourceLimits.maxMemoryMB) {
      violations.push(`Memory limit exceeded: ${execution.resourceUsage.memoryUsedMB}MB > ${profile.resourceLimits.maxMemoryMB}MB`);
    }

    if (execution.resourceUsage.executionTimeMs > profile.resourceLimits.maxExecutionTimeMs) {
      violations.push(`Execution time limit exceeded: ${execution.resourceUsage.executionTimeMs}ms > ${profile.resourceLimits.maxExecutionTimeMs}ms`);
    }

    if (execution.resourceUsage.networkRequests > profile.resourceLimits.maxNetworkRequests) {
      violations.push(`Network request limit exceeded: ${execution.resourceUsage.networkRequests} > ${profile.resourceLimits.maxNetworkRequests}`);
    }

    // Create violations
    violations.forEach(violation => {
      this.createViolation(execution, 'resource', 'high', violation);
    });

    return violations.length === 0;
  }

  /**
   * Get security report
   */
  getSecurityReport(): {
    totalExecutions: number;
    successfulExecutions: number;
    blockedExecutions: number;
    violationsByType: Record<string, number>;
    violationsBySeverity: Record<string, number>;
    topViolations: string[];
    securityScore: number;
  } {
    const executions = Array.from(this.executions.values());
    const totalExecutions = executions.length;
    const successfulExecutions = executions.filter(e => e.status === 'completed').length;
    const blockedExecutions = executions.filter(e => e.status === 'blocked').length;

    const violationsByType: Record<string, number> = {};
    const violationsBySeverity: Record<string, number> = {};

    this.violations.forEach(violation => {
      violationsByType[violation.type] = (violationsByType[violation.type] || 0) + 1;
      violationsBySeverity[violation.severity] = (violationsBySeverity[violation.severity] || 0) + 1;
    });

    // Calculate security score (0-100)
    const baseScore = 100;
    const violationPenalty = this.violations.length * 2;
    const blockedPenalty = blockedExecutions * 5;
    const securityScore = Math.max(0, baseScore - violationPenalty - blockedPenalty);

    // Get top violations
    const violationCounts = new Map<string, number>();
    this.violations.forEach(v => {
      const desc = v.description.split(':')[0]; // Get first part of description
      violationCounts.set(desc, (violationCounts.get(desc) || 0) + 1);
    });

    const topViolations = Array.from(violationCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([desc, count]) => `${desc} (${count} times)`);

    return {
      totalExecutions,
      successfulExecutions,
      blockedExecutions,
      violationsByType,
      violationsBySeverity,
      topViolations,
      securityScore
    };
  }

  // Helper methods
  private createPermission(
    name: string, 
    description: string, 
    level: SecurityPermission['level'],
    category: SecurityPermission['category']
  ): SecurityPermission {
    return {
      id: `perm_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name,
      description,
      level,
      category,
      granted: true, // Default granted for profiles
      requestedBy: 'system',
      requestTime: new Date(),
      grantedTime: new Date()
    };
  }

  private async performSecurityChecks(
    execution: SandboxExecution, 
    profile: SandboxProfile
  ): Promise<void> {
    // Check for malicious patterns
    const maliciousPatterns = [
      /eval\s*\(/gi,
      /document\.cookie/gi,
      /localStorage/gi,
      /sessionStorage/gi,
      /window\.location/gi,
      /fetch\s*\(/gi,
      /XMLHttpRequest/gi
    ];

    maliciousPatterns.forEach((pattern, index) => {
      if (pattern.test(execution.code)) {
        const descriptions = [
          'Use of eval() function',
          'Access to document.cookie',
          'Access to localStorage',
          'Access to sessionStorage', 
          'Manipulation of window.location',
          'Use of fetch API',
          'Use of XMLHttpRequest'
        ];
        
        this.createViolation(execution, 'permission', 'high', 
          `Potentially dangerous code detected: ${descriptions[index]}`);
      }
    });
  }

  private async executeCodeSecurely(
    execution: SandboxExecution,
    profile: SandboxProfile,
    context?: any
  ): Promise<any> {
    // Simulate secure code execution
    // In a real implementation, this would use Web Workers, iframe sandboxing,
    // or server-side containerization

    const mockResults: Record<string, any> = {
      javascript: { result: 'JavaScript execution simulated', success: true },
      python: { result: 'Python execution simulated', success: true },
      typescript: { result: 'TypeScript execution simulated', success: true },
      default: { result: 'Code execution simulated', success: true }
    };

    // Simulate execution time
    await new Promise(resolve => setTimeout(resolve, 100));

    // Update resource usage
    this.monitorResourceUsage(execution.id, {
      memoryUsedMB: Math.random() * 50,
      cpuTimeMs: Math.random() * 1000,
      networkRequests: Math.floor(Math.random() * 3)
    });

    return mockResults[execution.language] || mockResults.default;
  }

  private createViolation(
    execution: SandboxExecution,
    type: SecurityViolation['type'],
    severity: SecurityViolation['severity'],
    description: string
  ): void {
    const violation: SecurityViolation = {
      id: `viol_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type,
      severity,
      description,
      timestamp: new Date(),
      blocked: severity === 'critical' || severity === 'high',
      executionId: execution.id
    };

    this.violations.push(violation);
    execution.violations.push(violation);

    if (violation.blocked) {
      execution.status = 'blocked';
    }
  }

  // Public getters
  getProfiles(): SandboxProfile[] {
    return Array.from(this.profiles.values());
  }

  getProfile(id: string): SandboxProfile | undefined {
    return this.profiles.get(id);
  }

  getExecution(id: string): SandboxExecution | undefined {
    return this.executions.get(id);
  }

  getViolations(): SecurityViolation[] {
    return [...this.violations];
  }

  enable(): void {
    this.isEnabled = true;
  }

  disable(): void {
    this.isEnabled = false;
  }

  isSecurityEnabled(): boolean {
    return this.isEnabled;
  }
}

// Export singleton instance
export const securitySandbox = new SecuritySandbox();
