/**
 * Contextual Understanding Engine for LLM-OS
 * Provides natural language intent analysis, context preservation, and predictive capabilities
 */

import { memoryManager } from '../memory/memoryManager';
import { LLMService } from '../llm/service';

export interface IntentAnalysis {
  intent: string;
  entities: Entity[];
  confidence: number;
  domain: string;
  complexity: 'simple' | 'moderate' | 'complex';
  requiredActions: string[];
  contextDependencies: string[];
}

export interface Entity {
  name: string;
  type: 'file' | 'application' | 'command' | 'concept' | 'parameter';
  value: string;
  confidence: number;
  position: [number, number]; // start, end indices
}

export interface ContextualSession {
  id: string;
  userId: string;
  startTime: Date;
  lastActivity: Date;
  domain: string;
  conversationHistory: ConversationTurn[];
  extractedContext: ExtractedContext;
  userPreferences: UserPreferences;
  predictedNeeds: PredictedNeed[];
}

export interface ConversationTurn {
  id: string;
  timestamp: Date;
  userInput: string;
  systemResponse: string;
  intentAnalysis: IntentAnalysis;
  actionsTaken: string[];
  contextUsed: string[];
  satisfaction?: 'positive' | 'negative' | 'neutral';
}

export interface ExtractedContext {
  currentTask: string;
  workingDirectory: string;
  activeApplications: string[];
  recentFiles: string[];
  userGoals: string[];
  technicalContext: Record<string, any>;
}

export interface UserPreferences {
  communicationStyle: 'concise' | 'detailed' | 'technical' | 'friendly';
  preferredTools: string[];
  workflowPatterns: string[];
  automationLevel: 'minimal' | 'moderate' | 'aggressive';
  domainExpertise: Record<string, number>; // domain -> expertise level (0-1)
}

export interface PredictedNeed {
  id: string;
  description: string;
  probability: number;
  suggestedAction: string;
  timeframe: 'immediate' | 'short-term' | 'medium-term';
  reasoning: string;
}

export class ContextualUnderstandingEngine {
  private llm: LLMService;
  private activeSessions: Map<string, ContextualSession> = new Map();
  private intentPatterns: Map<string, RegExp> = new Map();
  private domainClassifiers: Map<string, string[]> = new Map();

  constructor() {
    this.llm = new LLMService();
    this.initializeIntentPatterns();
    this.initializeDomainClassifiers();
  }

  /**
   * Initialize common intent patterns for quick recognition
   */
  private initializeIntentPatterns(): void {
    const patterns = new Map([
      ['file_operation', /(?:create|make|write|read|open|delete|copy|move|find)\s+(?:file|folder|directory)/i],
      ['app_launch', /(?:launch|open|start|run)\s+(?:app|application|program)/i],
      ['search_query', /(?:search|find|look\s+for|query)\s+(?:for\s+)?(.+)/i],
      ['code_request', /(?:write|create|generate|show)\s+(?:code|script|function|class)/i],
      ['help_request', /(?:help|how\s+to|explain|tutorial|guide)/i],
      ['system_config', /(?:configure|setup|install|settings|preferences)/i],
      ['data_analysis', /(?:analyze|examine|review|study|investigate)/i],
      ['automation', /(?:automate|schedule|recurring|batch|script)/i]
    ]);

    patterns.forEach((pattern, intent) => {
      this.intentPatterns.set(intent, pattern);
    });
  }

  /**
   * Initialize domain-specific keyword classifiers
   */
  private initializeDomainClassifiers(): void {
    const domains = new Map([
      ['development', ['code', 'programming', 'function', 'class', 'variable', 'debugging', 'git', 'repository']],
      ['data_science', ['data', 'analysis', 'visualization', 'machine learning', 'statistics', 'dataset', 'model']],
      ['system_admin', ['server', 'network', 'security', 'backup', 'deployment', 'monitoring', 'logs']],
      ['content_creation', ['write', 'document', 'article', 'blog', 'presentation', 'design', 'media']],
      ['project_management', ['task', 'project', 'deadline', 'milestone', 'team', 'collaboration', 'planning']],
      ['research', ['study', 'investigate', 'analyze', 'compare', 'evaluate', 'academic', 'paper']]
    ]);

    domains.forEach((keywords, domain) => {
      this.domainClassifiers.set(domain, keywords);
    });
  }

  /**
   * Analyze user input for intent, entities, and context
   */
  async analyzeIntent(
    userInput: string, 
    sessionId: string, 
    conversationHistory: string[] = []
  ): Promise<IntentAnalysis> {    // Quick pattern matching for common intents
    let detectedIntent = 'general';
    let confidence = 0.5;

    Array.from(this.intentPatterns.entries()).forEach(([intent, pattern]) => {
      if (pattern.test(userInput)) {
        detectedIntent = intent;
        confidence = 0.8;
        return;
      }
    });

    // Enhanced intent analysis using LLM
    const enhancedAnalysis = await this.performDeepIntentAnalysis(
      userInput, 
      conversationHistory, 
      detectedIntent
    );

    // Extract entities
    const entities = await this.extractEntities(userInput);

    // Determine domain
    const domain = this.classifyDomain(userInput);

    // Assess complexity
    const complexity = this.assessComplexity(userInput, entities, conversationHistory);

    return {
      intent: enhancedAnalysis.intent || detectedIntent,
      entities,
      confidence: Math.max(confidence, enhancedAnalysis.confidence || 0.5),
      domain,
      complexity,
      requiredActions: enhancedAnalysis.requiredActions || [],
      contextDependencies: enhancedAnalysis.contextDependencies || []
    };
  }

  /**
   * Perform deep intent analysis using LLM
   */
  private async performDeepIntentAnalysis(
    userInput: string,
    conversationHistory: string[],
    preliminaryIntent: string
  ): Promise<{
    intent: string;
    confidence: number;
    requiredActions: string[];
    contextDependencies: string[];
  }> {
    const analysisPrompt = `
Analyze this user input for intent and context:

User Input: "${userInput}"
Preliminary Intent: ${preliminaryIntent}
Recent Conversation: ${conversationHistory.slice(-3).join('\n')}

Available Intent Categories:
- file_operation, app_launch, search_query, code_request, help_request
- system_config, data_analysis, automation, general

Consider:
1. What does the user actually want to accomplish?
2. What actions would be needed to fulfill this request?
3. What context from previous conversations is relevant?
4. How confident are you in this interpretation?

Return JSON:
{
  "intent": "specific_intent_category",
  "confidence": 0.0-1.0,
  "requiredActions": ["action1", "action2"],
  "contextDependencies": ["context1", "context2"],
  "reasoning": "explanation of analysis"
}`;

    try {
      const result = await this.llm.sendMessage(analysisPrompt);
      const analysis = JSON.parse(result.content);
      
      return {
        intent: analysis.intent || preliminaryIntent,
        confidence: analysis.confidence || 0.5,
        requiredActions: analysis.requiredActions || [],
        contextDependencies: analysis.contextDependencies || []
      };
    } catch (error) {
      console.error('Deep intent analysis failed:', error);
      return {
        intent: preliminaryIntent,
        confidence: 0.3,
        requiredActions: [],
        contextDependencies: []
      };
    }
  }

  /**
   * Extract entities from user input
   */
  private async extractEntities(userInput: string): Promise<Entity[]> {
    const entities: Entity[] = [];

    // File path patterns
    const filePattern = /(?:\/[^\s]+|[a-zA-Z]:\\[^\s]+|\.?[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+)/g;
    let match;
    while ((match = filePattern.exec(userInput)) !== null) {
      entities.push({
        name: match[0],
        type: 'file',
        value: match[0],
        confidence: 0.9,
        position: [match.index, match.index + match[0].length]
      });
    }

    // Application names
    const appPattern = /(?:vs\s*code|visual\s*studio|chrome|firefox|git|docker|npm|node|python|javascript|typescript)/gi;
    while ((match = appPattern.exec(userInput)) !== null) {
      entities.push({
        name: match[0],
        type: 'application',
        value: match[0].toLowerCase().replace(/\s+/g, ''),
        confidence: 0.8,
        position: [match.index, match.index + match[0].length]
      });
    }

    // Command patterns
    const commandPattern = /(?:^|\s)(ls|cat|cd|mkdir|rm|cp|mv|git|npm|pip|curl|grep|find|chmod)\s/g;
    while ((match = commandPattern.exec(userInput)) !== null) {
      entities.push({
        name: match[1],
        type: 'command',
        value: match[1],
        confidence: 0.95,
        position: [match.index + match[0].length - match[1].length - 1, match.index + match[0].length - 1]
      });
    }

    return entities;
  }

  /**
   * Classify the domain of the user input
   */
  private classifyDomain(userInput: string): string {
    const input = userInput.toLowerCase();    let maxScore = 0;
    let detectedDomain = 'general';

    Array.from(this.domainClassifiers.entries()).forEach(([domain, keywords]) => {
      const score = keywords.reduce((acc: number, keyword: string) => {
        return acc + (input.includes(keyword.toLowerCase()) ? 1 : 0);
      }, 0) / keywords.length;

      if (score > maxScore) {
        maxScore = score;
        detectedDomain = domain;
      }
    });

    return maxScore > 0.2 ? detectedDomain : 'general';
  }

  /**
   * Assess the complexity of the user request
   */
  private assessComplexity(
    userInput: string, 
    entities: Entity[], 
    conversationHistory: string[]
  ): 'simple' | 'moderate' | 'complex' {
    let complexityScore = 0;

    // Length and structure
    if (userInput.length > 100) complexityScore += 1;
    if (userInput.split(' ').length > 15) complexityScore += 1;

    // Multiple entities
    if (entities.length > 3) complexityScore += 1;
    if (entities.some(e => e.type === 'file') && entities.some(e => e.type === 'command')) {
      complexityScore += 1;
    }

    // Context dependencies
    if (conversationHistory.length > 0 && userInput.includes('that') || userInput.includes('this')) {
      complexityScore += 1;
    }

    // Multi-step indicators
    const multiStepIndicators = ['and then', 'after that', 'next', 'also', 'additionally', 'then'];
    if (multiStepIndicators.some(indicator => userInput.toLowerCase().includes(indicator))) {
      complexityScore += 2;
    }

    if (complexityScore <= 1) return 'simple';
    if (complexityScore <= 3) return 'moderate';
    return 'complex';
  }

  /**
   * Create or update a contextual session
   */
  async createSession(
    userId: string, 
    initialInput: string, 
    domain: string = 'general'
  ): Promise<ContextualSession> {
    const sessionId = `session_${userId}_${Date.now()}`;
    
    // Load user preferences from memory
    const userMemories = await memoryManager.retrieveMemories(
      `user preferences ${userId}`,
      10,
      { userId }
    );

    const userPreferences: UserPreferences = {
      communicationStyle: 'detailed', // Default, will be learned
      preferredTools: [],
      workflowPatterns: [],
      automationLevel: 'moderate',
      domainExpertise: {}
    };

    // Extract preferences from memory
    userMemories.forEach(memory => {
      if (memory.type === 'user_preference') {
        // Parse and update preferences based on stored memories
        this.updatePreferencesFromMemory(userPreferences, memory.content);
      }
    });

    const session: ContextualSession = {
      id: sessionId,
      userId,
      startTime: new Date(),
      lastActivity: new Date(),
      domain,
      conversationHistory: [],
      extractedContext: {
        currentTask: '',
        workingDirectory: './',
        activeApplications: [],
        recentFiles: [],
        userGoals: [],
        technicalContext: {}
      },
      userPreferences,
      predictedNeeds: []
    };

    this.activeSessions.set(sessionId, session);

    // Initial intent analysis
    const intentAnalysis = await this.analyzeIntent(initialInput, sessionId);
    
    // Update context based on initial input
    await this.updateSessionContext(sessionId, initialInput, intentAnalysis);

    return session;
  }

  /**
   * Update session context based on new interaction
   */
  async updateSessionContext(
    sessionId: string,
    userInput: string,
    intentAnalysis: IntentAnalysis,
    systemResponse?: string
  ): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) return;

    // Add conversation turn
    const turn: ConversationTurn = {
      id: `turn_${Date.now()}`,
      timestamp: new Date(),
      userInput,
      systemResponse: systemResponse || '',
      intentAnalysis,
      actionsTaken: [],
      contextUsed: []
    };

    session.conversationHistory.push(turn);
    session.lastActivity = new Date();

    // Update extracted context
    await this.updateExtractedContext(session, userInput, intentAnalysis);

    // Generate predictions for next needs
    session.predictedNeeds = await this.generatePredictedNeeds(session);

    // Store updated context in memory
    await this.storeContextInMemory(session);
  }

  /**
   * Update extracted context from current interaction
   */
  private async updateExtractedContext(
    session: ContextualSession,
    userInput: string,
    intentAnalysis: IntentAnalysis
  ): Promise<void> {
    const context = session.extractedContext;

    // Update current task
    if (intentAnalysis.intent !== 'general') {
      context.currentTask = userInput;
    }

    // Extract file references
    const fileEntities = intentAnalysis.entities.filter(e => e.type === 'file');
    fileEntities.forEach(entity => {
      if (!context.recentFiles.includes(entity.value)) {
        context.recentFiles.unshift(entity.value);
        context.recentFiles = context.recentFiles.slice(0, 10); // Keep last 10
      }
    });

    // Extract application references
    const appEntities = intentAnalysis.entities.filter(e => e.type === 'application');
    appEntities.forEach(entity => {
      if (!context.activeApplications.includes(entity.value)) {
        context.activeApplications.push(entity.value);
      }
    });

    // Infer user goals
    if (intentAnalysis.complexity === 'complex') {
      context.userGoals.unshift(userInput);
      context.userGoals = context.userGoals.slice(0, 5); // Keep last 5 goals
    }

    // Update domain expertise
    session.userPreferences.domainExpertise[intentAnalysis.domain] = 
      (session.userPreferences.domainExpertise[intentAnalysis.domain] || 0) + 0.1;
  }

  /**
   * Generate predictions for user's next needs
   */
  private async generatePredictedNeeds(session: ContextualSession): Promise<PredictedNeed[]> {
    const recentTurns = session.conversationHistory.slice(-3);
    const context = session.extractedContext;
    
    const predictionPrompt = `
Based on this user's recent activity, predict what they might need next:

Recent Conversation:
${recentTurns.map(turn => `User: ${turn.userInput}\nIntent: ${turn.intentAnalysis.intent}`).join('\n')}

Current Context:
- Task: ${context.currentTask}
- Domain: ${session.domain}
- Recent Files: ${context.recentFiles.slice(0, 3).join(', ')}
- User Goals: ${context.userGoals.slice(0, 2).join(', ')}

Predict 2-3 likely next needs with probability and suggested actions.

Return JSON:
{
  "predictions": [
    {
      "description": "what user might need",
      "probability": 0.0-1.0,
      "suggestedAction": "specific action to suggest",
      "timeframe": "immediate|short-term|medium-term",
      "reasoning": "why this is likely"
    }
  ]
}`;

    try {
      const result = await this.llm.sendMessage(predictionPrompt);
      const predictions = JSON.parse(result.content);
      
      return predictions.predictions.map((pred: any, index: number) => ({
        id: `pred_${session.id}_${Date.now()}_${index}`,
        description: pred.description,
        probability: pred.probability || 0.5,
        suggestedAction: pred.suggestedAction,
        timeframe: pred.timeframe || 'short-term',
        reasoning: pred.reasoning || 'Based on conversation pattern'
      }));
    } catch (error) {
      console.error('Prediction generation failed:', error);
      return [];
    }
  }

  /**
   * Store context in memory for cross-session persistence
   */
  private async storeContextInMemory(session: ContextualSession): Promise<void> {
    const contextSummary = {
      sessionId: session.id,
      domain: session.domain,
      currentTask: session.extractedContext.currentTask,
      recentFiles: session.extractedContext.recentFiles.slice(0, 5),
      userGoals: session.extractedContext.userGoals.slice(0, 3),
      preferences: session.userPreferences
    };

    await memoryManager.storeMemory(
      `Session context: ${JSON.stringify(contextSummary)}`,
      'system_knowledge',
      { userId: session.userId, sessionId: session.id },
      ['context', 'session', session.domain]
    );
  }

  /**
   * Update user preferences from memory content
   */
  private updatePreferencesFromMemory(preferences: UserPreferences, memoryContent: string): void {
    try {
      // Simple parsing for common preference patterns
      if (memoryContent.includes('concise')) {
        preferences.communicationStyle = 'concise';
      } else if (memoryContent.includes('detailed')) {
        preferences.communicationStyle = 'detailed';
      } else if (memoryContent.includes('technical')) {
        preferences.communicationStyle = 'technical';
      }

      // Extract preferred tools
      const toolMatches = memoryContent.match(/(?:prefers?|likes?|uses?)\s+([a-zA-Z0-9_-]+)/gi);
      if (toolMatches) {
        toolMatches.forEach(match => {
          const tool = match.split(/\s+/).pop();
          if (tool && !preferences.preferredTools.includes(tool)) {
            preferences.preferredTools.push(tool);
          }
        });
      }
    } catch (error) {
      console.error('Error updating preferences from memory:', error);
    }
  }

  /**
   * Get session by ID
   */
  getSession(sessionId: string): ContextualSession | undefined {
    return this.activeSessions.get(sessionId);
  }

  /**
   * Get all active sessions for a user
   */
  getUserSessions(userId: string): ContextualSession[] {
    return Array.from(this.activeSessions.values()).filter(s => s.userId === userId);
  }

  /**
   * Clean up inactive sessions
   */  cleanupInactiveSessions(maxAgeHours: number = 24): void {
    const cutoffTime = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000);
    
    Array.from(this.activeSessions.entries()).forEach(([sessionId, session]) => {
      if (session.lastActivity < cutoffTime) {
        this.activeSessions.delete(sessionId);
      }
    });
  }
}

// Export singleton instance
export const contextualEngine = new ContextualUnderstandingEngine();
