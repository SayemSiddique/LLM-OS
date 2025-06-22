// Core LLM-OS Type Definitions

export enum AutonomyLevel {
  SUGGEST_ONLY = 1,
  EXECUTE_WITH_APPROVAL = 2,
  AUTONOMOUS_WITH_OVERSIGHT = 3,
  FULL_AUTONOMOUS = 4,
}

export interface AutonomyConfig {
  level: AutonomyLevel;
  name: string;
  description: string;
  permissions: AgentPermission[];
  humanApprovalRequired: boolean;
  maxExecutionTime?: number;
  allowedTools?: string[];
}

export interface AgentPermission {
  action: string;
  resource: string;
  conditions?: Record<string, any>;
}

export interface LLMApp {
  id: string;
  name: string;
  description: string;
  author: string;
  version: string;
  icon?: string;
  promptTemplate: string;
  tools: string[];
  autonomyLevels: Record<string, AutonomyConfig>;
  uiComponents: UIComponent[];
  metadata: AppMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppMetadata {
  category: AppCategory;
  tags: string[];
  featured: boolean;
  downloadCount: number;
  rating: number;
  compatibility: string[];
}

export enum AppCategory {
  PRODUCTIVITY = 'productivity',
  DEVELOPMENT = 'development',
  CREATIVITY = 'creativity',
  RESEARCH = 'research',
  AUTOMATION = 'automation',
  COMMUNICATION = 'communication',
  ANALYSIS = 'analysis',
  UTILITIES = 'utilities',
}

export interface UIComponent {
  type: 'text_input' | 'editor' | 'diff_viewer' | 'file_picker' | 'image_viewer' | 'chart';
  props?: Record<string, any>;
}

export interface PromptSession {
  id: string;
  userId: string;
  appId: string;
  messages: ChatMessage[];
  context: SessionContext;
  autonomyLevel: AutonomyLevel;
  status: SessionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  metadata?: MessageMetadata;
  toolCalls?: ToolCall[];
  attachments?: Attachment[];
}

export interface MessageMetadata {
  model?: string;
  tokens?: number;
  processingTime?: number;
  confidence?: number;
  sources?: string[];
  actions?: any[]; // Actions that were extracted/executed with this message
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, any>;
  result?: any;
  status: 'pending' | 'success' | 'error';
  executedAt?: Date;
}

export interface Attachment {
  id: string;
  type: 'image' | 'file' | 'url' | 'code';
  content: string;
  metadata?: Record<string, any>;
}

export interface SessionContext {
  workingDirectory?: string;
  openFiles?: string[];
  userPreferences: UserPreferences;
  environmentVars?: Record<string, string>;
  memory: MemoryItem[];
}

export interface MemoryItem {
  id: string;
  content: string;
  embedding?: number[];
  relevanceScore?: number;
  timestamp: Date;
  tags: string[];
  sessionId: string;
}

export enum SessionStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  ERROR = 'error',
  CANCELLED = 'cancelled',
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  preferences: UserPreferences;
  usage: UsageStats;
  createdAt: Date;
  lastActiveAt: Date;
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'auto';
  defaultAutonomyLevel: AutonomyLevel;
  preferredModel: string;
  enableNotifications: boolean;
  autoSave: boolean;
  privacyMode: boolean;
  customPrompts: Record<string, string>;
}

export interface UsageStats {
  totalSessions: number;
  totalTokens: number;
  favoriteApps: string[];
  lastUsedApps: string[];
  averageSessionDuration: number;
}

export interface AgentAction {
  id: string;
  sessionId: string;
  type: AgentActionType;
  description: string;
  payload: any;
  status: 'pending' | 'approved' | 'rejected' | 'executed' | 'failed';
  autonomyLevel: AutonomyLevel;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
  executedAt?: Date;
  result?: any;
  error?: string;
}

// Enhanced AgentAction interface with dependencies for multi-agent coordination
export interface EnhancedAgentAction extends AgentAction {
  dependencies?: string[];
  priority?: number;
}

export enum AgentActionType {
  FILE_WRITE = 'file_write',
  FILE_READ = 'file_read',
  API_CALL = 'api_call',
  CODE_EXECUTION = 'code_execution',
  WEB_SEARCH = 'web_search',
  EMAIL_SEND = 'email_send',
  DATABASE_QUERY = 'database_query',
  SYSTEM_COMMAND = 'system_command',
}

export interface DiffChange {
  type: 'add' | 'remove' | 'modify';
  lineNumber: number;
  content: string;
  oldContent?: string;
  context: string[];
}

export interface VerificationResult {
  id: string;
  actionId: string;
  approved: boolean;
  feedback?: string;
  suggestedChanges?: string;
  timestamp: Date;
  userId: string;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'error';
  uptime: number;
  activeConnections: number;
  modelAvailability: Record<string, boolean>;
  lastCheck: Date;
}

export interface LLMModel {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'google' | 'openrouter';
  maxTokens: number;
  costPerToken: number;
  capabilities: ModelCapability[];
  available: boolean;
}

export enum ModelCapability {
  TEXT_GENERATION = 'text_generation',
  CODE_GENERATION = 'code_generation',
  IMAGE_ANALYSIS = 'image_analysis',
  FUNCTION_CALLING = 'function_calling',
  JSON_MODE = 'json_mode',
  STREAMING = 'streaming',
}

export interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
  retryable: boolean;
}

export interface SystemSettings {
  userId: string;
  preferences: UserPreferences;
  autonomyDefaults: {
    defaultLevel: AutonomyLevel;
    autoApprovalThreshold: number;
    allowedTools: string[];
  };
  security: {
    requireApprovalForFileOperations: boolean;
    requireApprovalForNetworkRequests: boolean;
    requireApprovalForCodeExecution: boolean;
  };
  ui: {
    theme: 'dark' | 'light' | 'auto';
    fontSize: 'small' | 'medium' | 'large';
    animations: boolean;
    compactMode: boolean;
  };
  notifications: {
    actionApprovals: boolean;
    errors: boolean;
    completions: boolean;
    email: boolean;
  };
  updatedAt?: Date;
}

// Store Types (Zustand)
export interface LLMOSStore {
  // Current session
  currentSession: PromptSession | null;
  // UI State
  activeView: 'shell' | 'launcher' | 'settings' | 'dashboard' | 'enhanced-settings' | 'ai-assistant' | 'onboarding';
  sidebarCollapsed: boolean;
  
  // AI Settings
  autonomyLevel: AutonomyLevel;
  
  // Apps
  installedApps: LLMApp[];
  runningApps: string[];
  
  // User
  user: UserProfile | null;
  
  // System
  systemHealth: SystemHealth;
  availableModels: LLMModel[];
    // Actions
  setCurrentSession: (session: PromptSession | null) => void;
  setActiveView: (view: 'shell' | 'launcher' | 'settings' | 'dashboard' | 'enhanced-settings' | 'ai-assistant' | 'onboarding') => void;
  toggleSidebar: () => void;
  addMessage: (message: ChatMessage) => void;
  updateAutonomyLevel: (level: AutonomyLevel) => void;
  executeAction: (action: AgentAction) => Promise<void>;
  approveAction: (actionId: string) => Promise<void>;
  rejectAction: (actionId: string, feedback?: string) => Promise<void>;
  
  // Database integration methods
  loadUserSession: (userId: string) => Promise<void>;
  createNewSession: (appId?: string) => Promise<PromptSession | null>;
}
