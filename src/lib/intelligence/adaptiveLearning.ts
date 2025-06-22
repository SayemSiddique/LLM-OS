/**
 * Adaptive Learning System for LLM-OS
 * Provides user workflow pattern recognition, automation opportunities, and personalized suggestions
 */

import { memoryManager } from '../memory/memoryManager';
import { LLMService } from '../llm/service';

export interface WorkflowPattern {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  triggers: PatternTrigger[];
  frequency: number;
  successRate: number;
  lastUsed: Date;
  confidence: number;
  domain: string;
  userId: string;
}

export interface WorkflowStep {
  id: string;
  action: string;
  parameters: Record<string, any>;
  order: number;
  optional: boolean;
  successRate: number;
  averageDuration: number;
}

export interface PatternTrigger {
  type: 'time' | 'context' | 'sequence' | 'condition';
  value: string;
  confidence: number;
}

export interface AutomationOpportunity {
  id: string;
  description: string;
  workflowPattern: WorkflowPattern;
  potentialTimeSaving: number; // in seconds
  complexity: 'low' | 'medium' | 'high';
  confidence: number;
  suggestedImplementation: string;
  prerequisites: string[];
  estimatedSetupTime: number;
}

export interface PersonalizedSuggestion {
  id: string;
  type: 'command' | 'workflow' | 'optimization' | 'tool' | 'learning';
  title: string;
  description: string;
  relevanceScore: number;
  reasoning: string;
  actionable: boolean;
  suggestedAction?: string;
  expectedBenefit: string;
  difficulty: 'easy' | 'moderate' | 'advanced';
}

export interface LearningInsight {
  id: string;
  category: 'efficiency' | 'pattern' | 'preference' | 'skill_gap' | 'optimization';
  insight: string;
  evidence: string[];
  confidence: number;
  actionableRecommendations: string[];
  impact: 'low' | 'medium' | 'high';
}

export interface UserProfile {
  userId: string;
  skillLevel: Record<string, number>; // domain -> skill level (0-1)
  preferredPatterns: string[];
  workingStyles: string[];
  learningPreferences: string[];
  productivityMetrics: ProductivityMetrics;
  adaptationHistory: AdaptationRecord[];
}

export interface ProductivityMetrics {
  commandsPerSession: number;
  averageTaskCompletionTime: number;
  errorRate: number;
  automationUsage: number;
  learningVelocity: number;
  consistencyScore: number;
}

export interface AdaptationRecord {
  timestamp: Date;
  trigger: string;
  adaptation: string;
  outcome: 'positive' | 'negative' | 'neutral';
  impactScore: number;
}

export class AdaptiveLearningSystem {
  private llm: LLMService;
  private userProfiles: Map<string, UserProfile> = new Map();
  private detectedPatterns: Map<string, WorkflowPattern[]> = new Map();
  private learningInsights: Map<string, LearningInsight[]> = new Map();

  constructor() {
    this.llm = new LLMService();
  }

  /**
   * Analyze user behavior to detect workflow patterns
   */
  async analyzeWorkflowPatterns(
    userId: string,
    recentCommands: string[],
    timeWindow: number = 7 // days
  ): Promise<WorkflowPattern[]> {
    const userMemories = await memoryManager.retrieveMemories(
      `user workflow ${userId}`,
      50,
      { userId }
    );

    // Extract command sequences from memory
    const commandSequences = this.extractCommandSequences(userMemories, recentCommands);
    
    // Detect patterns using frequency analysis and LLM insights
    const detectedPatterns = await this.detectPatternsInSequences(
      commandSequences,
      userId
    );

    // Store patterns for future reference
    this.detectedPatterns.set(userId, detectedPatterns);

    // Learn from patterns for future optimization
    await this.learnFromPatterns(userId, detectedPatterns);

    return detectedPatterns;
  }

  /**
   * Extract command sequences from memory and recent activity
   */
  private extractCommandSequences(
    memories: any[],
    recentCommands: string[]
  ): string[][] {
    const sequences: string[][] = [];
    
    // Process recent commands as a sequence
    if (recentCommands.length > 1) {
      sequences.push(recentCommands);
    }

    // Extract sequences from memory
    memories.forEach(memory => {
      if (memory.type === 'workflow_pattern' && memory.content) {
        try {
          const commands = this.parseCommandsFromMemory(memory.content);
          if (commands.length > 1) {
            sequences.push(commands);
          }
        } catch (error) {
          // Skip malformed memory entries
        }
      }
    });

    return sequences;
  }

  /**
   * Parse commands from memory content
   */
  private parseCommandsFromMemory(content: string): string[] {
    // Extract command patterns from memory content
    const commandPattern = /(?:executed|ran|used)\s+(?:command\s+)?['"`]?([^'"`\n]+)['"`]?/gi;
    const commands: string[] = [];
    let match;

    while ((match = commandPattern.exec(content)) !== null) {
      const command = match[1].trim();
      if (command && command.length > 0) {
        commands.push(command);
      }
    }

    return commands;
  }

  /**
   * Detect patterns in command sequences using AI analysis
   */
  private async detectPatternsInSequences(
    sequences: string[][],
    userId: string
  ): Promise<WorkflowPattern[]> {
    if (sequences.length === 0) return [];

    const analysisPrompt = `
Analyze these command sequences to identify workflow patterns:

Command Sequences:
${sequences.map((seq, i) => `${i + 1}. ${seq.join(' -> ')}`).join('\n')}

Look for:
1. Recurring command combinations
2. Sequential patterns that appear multiple times
3. Common workflows that could be automated
4. Commands that frequently appear together

For each pattern found, provide:
- A descriptive name
- The sequence of steps
- How often it appears
- What triggers this pattern
- Confidence in this being a real pattern

Return JSON:
{
  "patterns": [
    {
      "name": "pattern name",
      "description": "what this workflow accomplishes",
      "steps": ["step1", "step2", "step3"],
      "frequency": <how many times observed>,
      "triggers": ["what typically starts this pattern"],
      "confidence": 0.0-1.0,
      "domain": "development|system|content|etc"
    }
  ]
}`;

    try {
      const result = await this.llm.sendMessage(analysisPrompt);
      const analysis = JSON.parse(result.content);
      
      return analysis.patterns.map((pattern: any, index: number) => ({
        id: `pattern_${userId}_${Date.now()}_${index}`,
        name: pattern.name,
        description: pattern.description,
        steps: pattern.steps.map((step: string, stepIndex: number) => ({
          id: `step_${stepIndex}`,
          action: step,
          parameters: {},
          order: stepIndex,
          optional: false,
          successRate: 0.9, // Initial assumption
          averageDuration: 5000 // 5 seconds default
        })),
        triggers: pattern.triggers.map((trigger: string) => ({
          type: 'context' as const,
          value: trigger,
          confidence: pattern.confidence || 0.7
        })),
        frequency: pattern.frequency || 1,
        successRate: 0.9,
        lastUsed: new Date(),
        confidence: pattern.confidence || 0.7,
        domain: pattern.domain || 'general',
        userId
      }));
    } catch (error) {
      console.error('Pattern detection failed:', error);
      return [];
    }
  }

  /**
   * Identify automation opportunities based on detected patterns
   */
  async identifyAutomationOpportunities(
    userId: string,
    patterns?: WorkflowPattern[]
  ): Promise<AutomationOpportunity[]> {
    const userPatterns = patterns || this.detectedPatterns.get(userId) || [];
    const opportunities: AutomationOpportunity[] = [];

    for (const pattern of userPatterns) {
      // Skip patterns that are too simple or infrequent
      if (pattern.steps.length < 2 || pattern.frequency < 2) continue;

      const opportunity = await this.evaluateAutomationPotential(pattern);
      if (opportunity) {
        opportunities.push(opportunity);
      }
    }

    // Sort by potential impact
    opportunities.sort((a, b) => 
      (b.potentialTimeSaving * b.confidence) - (a.potentialTimeSaving * a.confidence)
    );

    return opportunities;
  }

  /**
   * Evaluate automation potential for a workflow pattern
   */
  private async evaluateAutomationPotential(
    pattern: WorkflowPattern
  ): Promise<AutomationOpportunity | null> {
    const evaluationPrompt = `
Evaluate this workflow pattern for automation potential:

Pattern: ${pattern.name}
Description: ${pattern.description}
Steps: ${pattern.steps.map(s => s.action).join(' -> ')}
Frequency: ${pattern.frequency} times observed
Domain: ${pattern.domain}

Consider:
1. How repetitive is this workflow?
2. How much time could automation save?
3. What's the complexity of automating this?
4. What are the prerequisites for automation?
5. How confident are you in the automation recommendation?

Return JSON:
{
  "worthAutomating": true/false,
  "timeSavingSeconds": <estimated seconds saved per execution>,
  "complexity": "low|medium|high",
  "confidence": 0.0-1.0,
  "implementation": "how to implement this automation",
  "prerequisites": ["what's needed before automating"],
  "setupTimeMinutes": <estimated setup time>,
  "reasoning": "why this is/isn't worth automating"
}`;

    try {
      const result = await this.llm.sendMessage(evaluationPrompt);
      const evaluation = JSON.parse(result.content);
      
      if (!evaluation.worthAutomating) return null;

      return {
        id: `auto_${pattern.id}_${Date.now()}`,
        description: `Automate: ${pattern.name}`,
        workflowPattern: pattern,
        potentialTimeSaving: evaluation.timeSavingSeconds || 30,
        complexity: evaluation.complexity || 'medium',
        confidence: evaluation.confidence || 0.5,
        suggestedImplementation: evaluation.implementation,
        prerequisites: evaluation.prerequisites || [],
        estimatedSetupTime: (evaluation.setupTimeMinutes || 10) * 60
      };
    } catch (error) {
      console.error('Automation evaluation failed:', error);
      return null;
    }
  }

  /**
   * Generate personalized suggestions based on user behavior
   */
  async generatePersonalizedSuggestions(
    userId: string,
    context: {
      currentTask?: string;
      recentCommands?: string[];
      workingDomain?: string;
      timeOfDay?: string;
    }
  ): Promise<PersonalizedSuggestion[]> {
    const userProfile = await this.getUserProfile(userId);
    const patterns = this.detectedPatterns.get(userId) || [];
    const insights = this.learningInsights.get(userId) || [];

    const suggestionPrompt = `
Generate personalized suggestions for this user:

User Profile:
- Skill levels: ${JSON.stringify(userProfile.skillLevel)}
- Preferred patterns: ${userProfile.preferredPatterns.join(', ')}
- Working styles: ${userProfile.workingStyles.join(', ')}
- Productivity metrics: ${JSON.stringify(userProfile.productivityMetrics)}

Current Context:
- Task: ${context.currentTask || 'Unknown'}
- Recent commands: ${context.recentCommands?.join(', ') || 'None'}
- Domain: ${context.workingDomain || 'General'}
- Time: ${context.timeOfDay || 'Unknown'}

Detected Patterns: ${patterns.length} workflow patterns
Learning Insights: ${insights.length} insights available

Generate 3-5 actionable suggestions that would help this user be more productive.
Consider:
1. Skill level appropriate suggestions
2. Commands or workflows they might not know about
3. Optimizations for their current patterns
4. Learning opportunities
5. Tools that match their working style

Return JSON:
{
  "suggestions": [
    {
      "type": "command|workflow|optimization|tool|learning",
      "title": "suggestion title",
      "description": "detailed description",
      "relevanceScore": 0.0-1.0,
      "reasoning": "why this suggestion is relevant",
      "actionable": true/false,
      "suggestedAction": "specific action to take",
      "expectedBenefit": "what benefit user gets",
      "difficulty": "easy|moderate|advanced"
    }
  ]
}`;

    try {
      const result = await this.llm.sendMessage(suggestionPrompt);
      const analysis = JSON.parse(result.content);
      
      return analysis.suggestions.map((suggestion: any, index: number) => ({
        id: `suggestion_${userId}_${Date.now()}_${index}`,
        type: suggestion.type,
        title: suggestion.title,
        description: suggestion.description,
        relevanceScore: suggestion.relevanceScore || 0.5,
        reasoning: suggestion.reasoning,
        actionable: suggestion.actionable !== false,
        suggestedAction: suggestion.suggestedAction,
        expectedBenefit: suggestion.expectedBenefit,
        difficulty: suggestion.difficulty || 'moderate'
      }));
    } catch (error) {
      console.error('Suggestion generation failed:', error);
      return [];
    }
  }

  /**
   * Learn from user patterns and update system knowledge
   */
  private async learnFromPatterns(
    userId: string,
    patterns: WorkflowPattern[]
  ): Promise<void> {
    for (const pattern of patterns) {
      // Store pattern in memory for cross-session learning
      await memoryManager.storeMemory(
        `Workflow pattern: ${pattern.name} - ${pattern.description}. Steps: ${pattern.steps.map(s => s.action).join(' -> ')}`,
        'workflow_pattern',
        { userId },
        ['workflow', 'automation', pattern.domain, 'pattern_' + pattern.id]
      );

      // Update user profile with new insights
      await this.updateUserProfileFromPattern(userId, pattern);
    }
  }

  /**
   * Update user profile based on detected patterns
   */
  private async updateUserProfileFromPattern(
    userId: string,
    pattern: WorkflowPattern
  ): Promise<void> {
    const profile = await this.getUserProfile(userId);
    
    // Update skill level for the domain
    if (pattern.domain && pattern.domain !== 'general') {
      const currentSkill = profile.skillLevel[pattern.domain] || 0;
      const complexityBonus = pattern.steps.length > 5 ? 0.1 : 0.05;
      profile.skillLevel[pattern.domain] = Math.min(1, currentSkill + complexityBonus);
    }

    // Add to preferred patterns if high confidence and frequency
    if (pattern.confidence > 0.8 && pattern.frequency > 3) {
      if (!profile.preferredPatterns.includes(pattern.name)) {
        profile.preferredPatterns.push(pattern.name);
      }
    }

    // Update productivity metrics
    profile.productivityMetrics.commandsPerSession = 
      (profile.productivityMetrics.commandsPerSession + pattern.steps.length) / 2;

    this.userProfiles.set(userId, profile);
  }

  /**
   * Get or create user profile
   */
  private async getUserProfile(userId: string): Promise<UserProfile> {
    if (this.userProfiles.has(userId)) {
      return this.userProfiles.get(userId)!;
    }

    // Load from memory or create new profile
    const profile: UserProfile = {
      userId,
      skillLevel: {},
      preferredPatterns: [],
      workingStyles: [],
      learningPreferences: [],
      productivityMetrics: {
        commandsPerSession: 5,
        averageTaskCompletionTime: 300, // 5 minutes
        errorRate: 0.1,
        automationUsage: 0.2,
        learningVelocity: 0.3,
        consistencyScore: 0.7
      },
      adaptationHistory: []
    };

    this.userProfiles.set(userId, profile);
    return profile;
  }

  /**
   * Track adaptation and learning effectiveness
   */
  async trackAdaptation(
    userId: string,
    trigger: string,
    adaptation: string,
    outcome: 'positive' | 'negative' | 'neutral',
    impactScore: number
  ): Promise<void> {
    const profile = await this.getUserProfile(userId);
    
    profile.adaptationHistory.push({
      timestamp: new Date(),
      trigger,
      adaptation,
      outcome,
      impactScore
    });

    // Keep only last 100 adaptations
    if (profile.adaptationHistory.length > 100) {
      profile.adaptationHistory = profile.adaptationHistory.slice(-100);
    }

    // Update learning velocity based on positive adaptations
    const recentPositive = profile.adaptationHistory
      .filter(a => a.outcome === 'positive' && 
        Date.now() - a.timestamp.getTime() < 7 * 24 * 60 * 60 * 1000) // last 7 days
      .length;
    
    profile.productivityMetrics.learningVelocity = 
      Math.min(1, recentPositive / 10); // Normalize to 0-1 scale

    this.userProfiles.set(userId, profile);
  }

  /**
   * Get user's learning insights
   */
  getUserInsights(userId: string): LearningInsight[] {
    return this.learningInsights.get(userId) || [];
  }

  /**
   * Get user's detected patterns
   */
  getUserPatterns(userId: string): WorkflowPattern[] {
    return this.detectedPatterns.get(userId) || [];
  }

  /**
   * Get user profile for external access
   */
  getProfile(userId: string): UserProfile | undefined {
    return this.userProfiles.get(userId);
  }
}

// Export singleton instance
export const adaptiveLearningSystem = new AdaptiveLearningSystem();
