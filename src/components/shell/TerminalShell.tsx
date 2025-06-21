'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Terminal, Loader2, Bot, User, Zap, Code, FileText, Search, Cpu, Settings, Play, CheckCircle, XCircle, Clock, HardDrive, Network, Folder } from 'lucide-react';
import { useLLMOSStore } from '@/lib/store';
import { LLMService } from '../../lib/llm/service';
import { AgentOrchestrator } from '../../lib/agents/orchestrator';
import { systemCommandProcessor } from '../../lib/system/osCommands';
import { memoryManager } from '../../lib/memory/memoryManager';
import { ChatMessage } from '../../types';
import { 
  actionEventSystem, 
  createTerminalAction, 
  createAppAction, 
  createFileAction,
  createNetworkAction,
  completeAction, 
  failAction 
} from '../../lib/events/actionSystem';

interface TerminalCommand {
  command: string;
  description: string;
  usage: string;
  category: 'system' | 'apps' | 'files' | 'ai' | 'agents';
}

interface ExecutionAction {
  id: string;
  type: 'file_operation' | 'app_launch' | 'system_command' | 'web_search' | 'code_execution' | 'agent_task';
  title: string;
  description: string;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  result?: string;
  progress?: number;
}

const TERMINAL_COMMANDS: TerminalCommand[] = [
  // System Commands
  { command: 'help', description: 'Show available commands', usage: 'help [category]', category: 'system' },
  { command: 'clear', description: 'Clear terminal history', usage: 'clear', category: 'system' },
  { command: 'status', description: 'Show system status', usage: 'status', category: 'system' },
  { command: 'settings', description: 'Open system settings', usage: 'settings [key] [value]', category: 'system' },
  { command: 'memory', description: 'Show memory usage and insights', usage: 'memory [status|insights|clear]', category: 'system' },
  { command: 'processes', description: 'Show running processes', usage: 'processes [list|kill]', category: 'system' },
  { command: 'network', description: 'Network operations', usage: 'network [ping|status] [target]', category: 'system' },
  
  // App Management
  { command: 'apps', description: 'List available applications', usage: 'apps [list|search|install]', category: 'apps' },
  { command: 'launch', description: 'Launch an application', usage: 'launch <app-name>', category: 'apps' },
  { command: 'install', description: 'Install new application', usage: 'install <package-name>', category: 'apps' },
  { command: 'kill', description: 'Close running application', usage: 'kill <app-name>', category: 'apps' },
  
  // Enhanced File Operations
  { command: 'ls', description: 'List files and directories', usage: 'ls [path]', category: 'files' },
  { command: 'cat', description: 'Display file contents', usage: 'cat <filename>', category: 'files' },
  { command: 'mkdir', description: 'Create directory', usage: 'mkdir <dirname>', category: 'files' },
  { command: 'write', description: 'Write content to file', usage: 'write <filename> <content>', category: 'files' },
  { command: 'rm', description: 'Delete files or directories', usage: 'rm <path> [-r]', category: 'files' },
  { command: 'cp', description: 'Copy files or directories', usage: 'cp <source> <destination>', category: 'files' },
  { command: 'mv', description: 'Move/rename files or directories', usage: 'mv <source> <destination>', category: 'files' },
  { command: 'find', description: 'Search for files and directories', usage: 'find <pattern> [path]', category: 'files' },
  
  // AI Features
  { command: 'ask', description: 'Ask AI a question', usage: 'ask <question>', category: 'ai' },
  { command: 'analyze', description: 'Analyze code or text', usage: 'analyze <content>', category: 'ai' },
  { command: 'generate', description: 'Generate code or content', usage: 'generate <description>', category: 'ai' },
  { command: 'search', description: 'Search web or local content', usage: 'search <query>', category: 'ai' },
  { command: 'learn', description: 'Learn from user feedback', usage: 'learn <feedback> [context]', category: 'ai' },
  
  // Agent Commands
  { command: 'agent', description: 'Create AI agent task', usage: 'agent <task-description>', category: 'agents' },
  { command: 'tasks', description: 'List active agent tasks', usage: 'tasks', category: 'agents' },
  { command: 'approve', description: 'Approve pending agent action', usage: 'approve <task-id>', category: 'agents' },
  { command: 'reject', description: 'Reject pending agent action', usage: 'reject <task-id>', category: 'agents' },
];

export function TerminalShell() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'system',
      content: `🚀 LLM-OS Terminal v0.1.0 initialized
Connected to: OpenAI GPT-4
Autonomy Level: Suggest Mode
Type 'help' for commands or just talk naturally to the AI.`,
      timestamp: new Date(),
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentActions, setCurrentActions] = useState<ExecutionAction[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const llmService = useRef(new LLMService());
  const agentOrchestrator = useRef(new AgentOrchestrator());

  const { autonomyLevel, setActiveView, currentSession } = useLLMOSStore();

  // Check if we're in an app session
  const isAppSession = currentSession?.appId && currentSession.appId !== 'shell';

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus on input field on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Update terminal header based on current session
  useEffect(() => {
    if (currentSession && isAppSession) {
      // Load the app session messages if different from current messages
      if (currentSession.messages.length !== messages.length) {
        setMessages(currentSession.messages);
      }
    }
  }, [currentSession, isAppSession, messages.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      // First, check if this is a system command
      const commandResult = await processCommand(currentInput);
      if (commandResult.handled) {
        const systemMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'system',
          content: commandResult.output,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, systemMessage]);
        setIsLoading(false);
        return;
      }

      // Check if this requires environment variables
      if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
        throw new Error('OpenAI API key not configured. Please add it to your .env.local file.');
      }

      // Get conversation context
      const context = messages.slice(-5).map(msg => msg.content);
        // Enhanced AI processing with autonomy awareness
      const systemPrompt = isAppSession 
        ? `You are an AI assistant specialized for the ${currentSession?.appId} application. Current autonomy level: ${autonomyLevel}/4.
        
        You are operating within the context of this app session. Focus your responses on helping with ${currentSession?.appId}-related tasks.
        
        Based on the autonomy level:
        - Level 1 (Suggest Only): Provide detailed suggestions but don't execute actions
        - Level 2 (Execute with Approval): Suggest actions and ask for confirmation
        - Level 3 (Autonomous with Oversight): Execute actions but explain what you're doing
        - Level 4 (Full Autonomous): Execute actions autonomously with minimal explanations
        
        Available system commands: ${TERMINAL_COMMANDS.map(cmd => cmd.command).join(', ')}
        
        If the user's request involves system operations, app launching, file management, or complex tasks, 
        either execute them (if autonomy allows) or explain exactly what you would do.
        
        Be helpful, concise, and actionable. Stay in character for the current app context.`
        : `You are an AI assistant in the LLM Operating System. Current autonomy level: ${autonomyLevel}/4.
        
        Based on the autonomy level:
        - Level 1 (Suggest Only): Provide detailed suggestions but don't execute actions
        - Level 2 (Execute with Approval): Suggest actions and ask for confirmation
        - Level 3 (Autonomous with Oversight): Execute actions but explain what you're doing
        - Level 4 (Full Autonomous): Execute actions autonomously with minimal explanations
        
        Available system commands: ${TERMINAL_COMMANDS.map(cmd => cmd.command).join(', ')}
        
        If the user's request involves system operations, app launching, file management, or complex tasks, 
        either execute them (if autonomy allows) or explain exactly what you would do.
        
        Be helpful, concise, and actionable. Show system understanding.`;

      const result = await llmService.current.sendMessage(
        currentInput,
        context,
        systemPrompt
      );
      
      // Process AI response for potential actions
      const actions = await extractAndExecuteActions(result.content, currentInput);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.content,
        timestamp: new Date(),
        metadata: {
          model: result.model,
          tokens: result.tokens,
          processingTime: 0,
          actions: actions.length > 0 ? actions : undefined,
        }
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Execute actions based on autonomy level
      if (actions.length > 0) {
        await handleAutonomousActions(actions);
      }

    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'user': return 'text-blue-400';
      case 'assistant': return 'text-green-400';
      case 'system': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getRolePrefix = (role: string) => {
    switch (role) {
      case 'user': return 'user@llm-os:~$';
      case 'assistant': return 'llm-assistant>';
      case 'system': return 'system>';
      default: return '>';
    }
  };

  // Command processing function
  const processCommand = async (command: string): Promise<{ handled: boolean; output: string }> => {
    const [cmd, ...args] = command.split(' ');
    const lowerCmd = cmd.toLowerCase();

    try {
      switch (lowerCmd) {
        case 'help':
          const category = args[0];
          const filteredCommands = category 
            ? TERMINAL_COMMANDS.filter(c => c.category === category)
            : TERMINAL_COMMANDS;
          
          const output = `🚀 LLM-OS Enhanced Terminal Commands
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${category ? `📁 ${category.toUpperCase()} Commands:` : '📖 All Available Commands:'}

${filteredCommands.map(c => `  ${c.command.padEnd(15)} - ${c.description}`).join('\n')}

📂 Categories: system, apps, files, ai, agents
💡 Usage: help [category]
🗣️  Natural Language: Just describe what you want to do!

✨ NEW: Enhanced with memory management, system integration, and AI agents!`;
          return { handled: true, output };

        case 'clear':
          setMessages([{
            id: Date.now().toString(),
            role: 'system',
            content: '🚀 LLM-OS Terminal cleared. Advanced systems ready.',
            timestamp: new Date(),
          }]);
          return { handled: true, output: '' };

        case 'status':
          const memoryStats = await memoryManager.generateUserInsights();
          const statusOutput = `🚀 LLM-OS Advanced System Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 AI Status:      Connected (Enhanced with Memory & Agents)
🔧 Autonomy:       Level ${autonomyLevel}/4 (${['Suggest Only', 'Approval Required', 'Autonomous with Oversight', 'Full Autonomous'][autonomyLevel - 1]})
📱 Active Tasks:   ${currentActions.length} processes
🧠 Memory:         ${memoryStats.patterns.length} patterns learned
🤝 Agents:         Multi-agent orchestration active
🌐 Network:        Connected with system-level access
💾 Storage:        Advanced memory management enabled
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
          return { handled: true, output: statusOutput };

        case 'memory':
          const subCmd = args[0] || 'status';
          switch (subCmd) {
            case 'status':
              const insights = await memoryManager.generateUserInsights();
              const memoryOutput = `🧠 Memory System Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Learned Patterns: ${insights.patterns.length}
⚙️  User Preferences: ${insights.preferences.length}
💡 Suggestions: ${insights.suggestions.length}
🤖 Automation Opportunities: ${insights.automationOpportunities.length}

🔍 Recent Patterns:
${insights.patterns.slice(0, 3).map((p: string) => `• ${p}`).join('\n')}

💭 Top Suggestions:
${insights.suggestions.slice(0, 3).map((s: string) => `• ${s}`).join('\n')}`;
              return { handled: true, output: memoryOutput };
              
            case 'insights':
              const fullInsights = await memoryManager.generateUserInsights();
              const insightsOutput = `🧠 Detailed Memory Insights
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📈 Workflow Patterns (${fullInsights.patterns.length}):
${fullInsights.patterns.map((p: string) => `• ${p}`).join('\n')}

⚡ Automation Opportunities (${fullInsights.automationOpportunities.length}):
${fullInsights.automationOpportunities.map((a: string) => `• ${a}`).join('\n')}`;
              return { handled: true, output: insightsOutput };
              
            default:
              return { handled: true, output: 'Usage: memory [status|insights|clear]' };
          }

        // Enhanced file operations using system command processor
        case 'ls':
        case 'cat':
        case 'mkdir':
        case 'write':
        case 'rm':
        case 'cp':
        case 'mv':
        case 'find':
          const fileResult = await systemCommandProcessor.processNaturalLanguageCommand(
            `${lowerCmd} ${args.join(' ')}`,
            { userId: 'user' }
          );
          
          if (fileResult.success) {
            // Learn from successful file operations
            await memoryManager.learnFromInteraction(
              command,
              fileResult.output || 'File operation completed',
              'positive',
              { userId: 'user' }
            );
          }
          
          return { 
            handled: true, 
            output: fileResult.success 
              ? fileResult.output || 'Operation completed' 
              : `❌ Error: ${fileResult.error}`
          };

        // Network operations
        case 'network':
        case 'ping':
          const networkCmd = lowerCmd === 'network' ? `network ${args.join(' ')}` : `ping ${args.join(' ')}`;
          const networkResult = await systemCommandProcessor.processNaturalLanguageCommand(
            networkCmd,
            { userId: 'user' }
          );
          
          return { 
            handled: true, 
            output: networkResult.success 
              ? networkResult.output || 'Network operation completed' 
              : `❌ Network Error: ${networkResult.error}`
          };

        // Process management
        case 'processes':
        case 'kill':
          const processCmd = lowerCmd === 'processes' ? 'list processes' : `kill process ${args.join(' ')}`;
          const processResult = await systemCommandProcessor.processNaturalLanguageCommand(
            processCmd,
            { userId: 'user' }
          );
          
          return { 
            handled: true, 
            output: processResult.success 
              ? processResult.output || 'Process operation completed' 
              : `❌ Process Error: ${processResult.error}`
          };

        case 'apps':
          const appsOutput = `📱 Available Applications
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 writer-ai        - AI-powered writing assistant
🛠️  code-agent       - Intelligent code generation & review  
🔍 research-assistant - Web research and analysis
⚙️  settings         - System configuration
🧠 memory-manager    - Advanced memory insights
🤝 agent-orchestrator - Multi-agent task coordination

💡 Usage: launch <app-name> to start an application
🔍 Try: launch writer-ai, launch code-agent, etc.`;
          return { handled: true, output: appsOutput };

        case 'launch':
          if (!args[0]) {
            return { handled: true, output: '💡 Usage: launch <app-name>\n📱 Try: launch writer-ai, launch code-agent' };
          }
          const appName = args[0];
          
          // Store app launch in memory
          await memoryManager.storeMemory(
            `User launched application: ${appName}`,
            'user_preference',
            { userId: 'user' },
            ['app_usage', appName]
          );
          
          // Create action event for app launching
          const launchAction = createTerminalAction(
            'app',
            `Launch ${appName}`,
            `Opening application: ${appName}`,
            { appName },
            autonomyLevel
          );
          
          // If requires approval, don't execute immediately
          if (launchAction.requiresApproval) {
            return { handled: true, output: `🔍 App launch request sent for approval. Check Visual Verifier.` };
          }
          
          // Execute immediately for higher autonomy levels
          setTimeout(() => {
            setActiveView('launcher');
            completeAction(launchAction.id, { view: 'launcher' });
          }, 500);
          
          return { handled: true, output: `🚀 Launching ${appName}... Opening app launcher.` };

        // AI learning command
        case 'learn':
          if (args.length < 1) {
            return { handled: true, output: '💡 Usage: learn <feedback> [context]\n📝 Example: learn "I prefer concise responses" coding' };
          }
          
          const feedback = args[0];
          const context = args.slice(1).join(' ') || 'general';
          
          await memoryManager.storeMemory(
            `User feedback: ${feedback}`,
            'user_preference',
            { userId: 'user' },
            ['user_feedback', 'learning']
          );
          
          return { handled: true, output: `🧠 Learned: "${feedback}" in context "${context}"\n✨ This will improve future interactions!` };

        case 'tasks':
          const tasksOutput = currentActions.length > 0 
            ? `📋 Active Tasks:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${currentActions.map(action => 
  `🔄 ${action.title} [${action.status}]`
).join('\n')}`
            : '📋 No active tasks\n💡 Use "agent <task>" to create new tasks';
          return { handled: true, output: tasksOutput };

        case 'settings':
          setActiveView('settings');
          return { handled: true, output: '⚙️ Opening system settings...' };

        case 'exit':
        case 'quit':
          if (isAppSession) {
            useLLMOSStore.getState().setCurrentSession(null);
            setMessages([{
              id: Date.now().toString(),
              role: 'system',
              content: '🚀 Exited app session. Returned to main LLM-OS shell.',
              timestamp: new Date(),
            }]);
            return { handled: true, output: '' };
          }
          return { handled: true, output: '💡 Use Ctrl+C to close terminal or navigate away.' };

        // Agent command processing
        case 'agent':
          if (args.length < 1) {
            return { handled: true, output: '💡 Usage: agent <task-description>\n🤖 Example: agent "analyze this codebase and suggest improvements"' };
          }
          
          const taskDescription = args.join(' ');
            try {
            // Execute agent task using orchestrator
            const agentResult = await agentOrchestrator.current.executeTask(
              taskDescription,
              [`User session: ${currentSession?.id || 'default'}`, `Autonomy level: ${autonomyLevel}`]
            );

            // Add to current actions for tracking
            setCurrentActions(prev => [...prev, {
              id: `agent-${Date.now()}`,
              type: 'agent_task',
              title: `Agent Task: ${taskDescription.substring(0, 50)}...`,
              description: taskDescription,
              status: 'executing'
            }]);

            return { 
              handled: true, 
              output: `🤖 Agent task initiated: "${taskDescription}"\n📋 Agents are working on this task...\n\n${agentResult.response}` 
            };
          } catch (error) {
            return { 
              handled: true, 
              output: `❌ Failed to create agent task: ${error instanceof Error ? error.message : 'Unknown error'}` 
            };
          }

        // If not a system command, try natural language processing with system command processor
        default:
          // Try processing as natural language system command
          const naturalResult = await systemCommandProcessor.processNaturalLanguageCommand(
            command,
            { userId: 'user' }
          );
          
          if (naturalResult.success && naturalResult.output) {
            // Learn from successful natural language commands
            await memoryManager.learnFromInteraction(
              command,
              naturalResult.output,
              'positive',
              { userId: 'user' }
            );
            
            return { handled: true, output: naturalResult.output };
          }
          
          // If system command processor couldn't handle it, return false to let AI handle it
          return { handled: false, output: '' };
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      return { handled: true, output: `❌ Command Error: ${errorMsg}` };
    }
  };

  // Extract and prepare actions from AI response
  const extractAndExecuteActions = async (aiResponse: string, userInput: string): Promise<ExecutionAction[]> => {
    const actions: ExecutionAction[] = [];

    // Create action events for monitoring
    let actionEvent = null;

    // Simple pattern matching for common actions (in a real system, this would be more sophisticated)
    if (userInput.toLowerCase().includes('launch') || userInput.toLowerCase().includes('open')) {
      const appMatch = userInput.match(/(?:launch|open)\s+(\w+)/i);
      if (appMatch) {
        actionEvent = createTerminalAction(
          'app',
          `Launch ${appMatch[1]}`,
          `Opening application: ${appMatch[1]}`,
          { appName: appMatch[1] },
          autonomyLevel
        );
        
        actions.push({
          id: actionEvent.id,
          type: 'app_launch',
          title: `Launch ${appMatch[1]}`,
          description: `Opening application: ${appMatch[1]}`,
          status: actionEvent.requiresApproval ? 'pending' : 'executing',
        });
      }
    }

    if (userInput.toLowerCase().includes('search') || userInput.toLowerCase().includes('find')) {
      const searchMatch = userInput.match(/(?:search|find)\s+(.+)/i);
      if (searchMatch) {
        actionEvent = createNetworkAction(
          'https://api.search.example.com',
          'GET',
          `Performing web search for: ${searchMatch[1]}`,
          autonomyLevel
        );
        
        actions.push({
          id: actionEvent.id,
          type: 'web_search',
          title: `Search: ${searchMatch[1]}`,
          description: `Performing web search for: ${searchMatch[1]}`,
          status: actionEvent.requiresApproval ? 'pending' : 'executing',
        });
      }
    }

    if (userInput.toLowerCase().includes('create') || userInput.toLowerCase().includes('write')) {
      const fileMatch = userInput.match(/(?:create|write)\s+(?:file\s+)?(.+)/i);
      if (fileMatch) {
        actionEvent = createFileAction(
          'create',
          fileMatch[1] || 'new-file.txt',
          'Creating file based on user request',
          autonomyLevel
        );
        
        actions.push({
          id: actionEvent.id,
          type: 'file_operation',
          title: 'Create File',
          description: 'Creating file based on user request',
          status: actionEvent.requiresApproval ? 'pending' : 'executing',
        });
      }
    }

    return actions;
  };

  // Handle autonomous actions based on autonomy level
  const handleAutonomousActions = async (actions: ExecutionAction[]) => {
    setCurrentActions(prev => [...prev, ...actions]);

    for (const action of actions) {
      // Update action status
      setCurrentActions(prev => 
        prev.map(a => a.id === action.id ? { ...a, status: 'executing' } : a)
      );

      try {
        // Simulate action execution based on autonomy level
        if (autonomyLevel >= 2) { // Execute with approval or higher
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing

          // Execute the action
          let result = '';
          switch (action.type) {
            case 'app_launch':
              setActiveView('launcher');
              result = 'Application launcher opened';
              break;
            case 'web_search':
              result = 'Search initiated - results would appear in a new panel';
              break;
            case 'file_operation':
              result = 'File operation completed successfully';
              break;
            default:
              result = 'Action completed';
          }

          // Update action as completed
          setCurrentActions(prev => 
            prev.map(a => a.id === action.id ? { 
              ...a, 
              status: 'completed', 
              result,
              progress: 100 
            } : a)
          );

          // Add system message about the action
          const actionMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'system',
            content: `✅ Action completed: ${action.title}\n${result}`,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, actionMessage]);

        } else {
          // Level 1: Just suggest, don't execute
          const suggestionMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'system',
            content: `💡 Suggestion: ${action.title}\n${action.description}\n\nTo execute this action, increase autonomy level or run manually.`,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, suggestionMessage]);

          setCurrentActions(prev => 
            prev.map(a => a.id === action.id ? { ...a, status: 'completed', result: 'Suggested only' } : a)
          );
        }
      } catch (error) {
        setCurrentActions(prev => 
          prev.map(a => a.id === action.id ? { 
            ...a, 
            status: 'failed', 
            result: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` 
          } : a)
        );
      }
    }

    // Clean up completed actions after a delay
    setTimeout(() => {
      setCurrentActions(prev => prev.filter(a => a.status === 'executing'));
    }, 5000);
  };

  return (
    <div className="flex flex-col h-full bg-background border border-background-border rounded-lg overflow-hidden shadow-lg">
      {/* Enhanced Terminal Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-primary/10 to-accent/10 border-b border-background-border backdrop-blur-sm">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
          </div>
          <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          <span className="text-xs sm:text-sm font-medium text-text-primary">
            {isAppSession ? `${currentSession?.appId} App` : 'LLM-OS Terminal'}
          </span>
          {isAppSession && (
            <span className="hidden sm:inline text-xs text-text-secondary bg-primary/20 px-2 py-1 rounded">
              App Session
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-1 sm:space-x-2">
          <span className="text-xs text-text-secondary">
            {messages.length} msg{messages.length !== 1 ? 's' : ''}
          </span>
          {isLoading && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
            </motion.div>
          )}
        </div>
      </div>

      {/* Enhanced Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3 font-mono text-xs sm:text-sm">
        {messages.map((message) => (
          <div key={message.id} className="flex flex-col space-y-1">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className={`${getRoleColor(message.role)} font-medium`}>
                {getRolePrefix(message.role)}
              </span>
              <span>{formatTimestamp(message.timestamp)}</span>
            </div>
            <div className="pl-4 whitespace-pre-wrap leading-relaxed">
              {message.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 text-gray-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Processing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Active Actions Display */}
      {currentActions.length > 0 && (
        <div className="border-t border-llm-light p-4 bg-llm-dark/50">
          <h3 className="text-sm font-semibold text-gray-300 mb-2 flex items-center">
            <Cpu className="w-4 h-4 mr-2" />
            Active Processes
          </h3>
          <div className="space-y-2">
            {currentActions.map((action) => (
              <div key={action.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  {action.status === 'executing' && <Loader2 className="w-3 h-3 animate-spin text-blue-400" />}
                  {action.status === 'completed' && <CheckCircle className="w-3 h-3 text-green-400" />}
                  {action.status === 'failed' && <XCircle className="w-3 h-3 text-red-400" />}
                  {action.status === 'pending' && <Clock className="w-3 h-3 text-yellow-400" />}
                  <span className="text-gray-300">{action.title}</span>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  action.status === 'executing' ? 'bg-blue-900 text-blue-300' :
                  action.status === 'completed' ? 'bg-green-900 text-green-300' :
                  action.status === 'failed' ? 'bg-red-900 text-red-300' :
                  'bg-yellow-900 text-yellow-300'
                }`}>
                  {action.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Input Area */}
      <div className="border-t border-background-border p-3 sm:p-4 bg-background/50 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter command or query..."
              className="w-full bg-input border border-input-border rounded-lg px-3 py-2 sm:px-4 sm:py-3 font-mono text-xs sm:text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-primary hover:bg-primary/80 disabled:bg-primary/30 disabled:cursor-not-allowed text-white p-2 sm:p-3 rounded-lg transition-all active:scale-95"
          >
            <Send className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </form>
        <div className="mt-2 text-xs text-text-secondary font-mono hidden sm:block">
          Press Enter to send • Try: "search for X", "create a file", "analyze this code"
        </div>
        <div className="mt-1 text-xs text-text-secondary font-mono sm:hidden">
          Try: "search", "help", "status"
        </div>
      </div>
    </div>
  );
}
