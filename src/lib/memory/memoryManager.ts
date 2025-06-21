/**
 * Advanced Memory Management System for LLM-OS
 * Inspired by MemGPT architecture with multi-level memory hierarchy
 */

// Core memory entry interface
export interface MemoryEntry {
  id: string;
  type: 'conversation' | 'user_preference' | 'system_knowledge' | 'workflow_pattern';
  content: string;
  timestamp: Date;
  metadata: {
    importance: number; // 0-1 scale
    accessCount: number;
    lastAccessed: Date;
    tags: string[];
    embedding?: number[]; // For semantic search
  };
  context: {
    sessionId?: string;
    userId: string;
    deviceType?: string;
    location?: string;
  };
}

// Memory search and filtering interfaces
export interface MemorySearchFilter extends Partial<MemoryEntry['context']> {
  type?: MemoryEntry['type'];
  minImportance?: number;
  maxAge?: number;
}

export interface MemoryContext {
  mainContext: MemoryEntry[]; // Active working memory (like RAM)
  recentContext: MemoryEntry[]; // Recently accessed (cache-like)
  longTermMemory: MemoryEntry[]; // Persistent storage (like disk)
  personalityMemory: MemoryEntry[]; // User-specific learned behaviors
}

export interface MemoryConsolidationResult {
  consolidated: MemoryEntry[];
  archived: string[]; // IDs of archived memories
  promoted: string[]; // IDs promoted to long-term
  forgotten: string[]; // IDs of forgotten memories
}

export interface UserLearningInsights {
  patterns: string[];
  preferences: string[];
  suggestions: string[];
  automationOpportunities: string[];
}

export class AdvancedMemoryManager {
  private readonly MAX_MAIN_CONTEXT = 50; // Maximum entries in active memory
  private readonly MAX_RECENT_CONTEXT = 200; // Maximum entries in recent memory
  private readonly CONSOLIDATION_THRESHOLD = 24 * 60 * 60 * 1000; // 24 hours

  constructor(
    private userId: string,
    private storage: any = null // Will integrate with Firebase/Firestore
  ) {}

  /**
   * Store a new memory entry with automatic importance scoring
   */
  async storeMemory(
    content: string,
    type: MemoryEntry['type'],
    context: Partial<MemoryEntry['context']> = {},
    tags: string[] = []
  ): Promise<string> {
    const memory: MemoryEntry = {
      id: this.generateMemoryId(),
      type,
      content,
      timestamp: new Date(),
      metadata: {
        importance: await this.calculateImportance(content, type),
        accessCount: 0,
        lastAccessed: new Date(),
        tags,
        embedding: undefined // TODO: Generate embeddings for semantic search
      },
      context: {
        ...context,
        userId: this.userId
      }
    };

    // Add to appropriate memory level based on importance and type
    await this.addToMemoryLevel(memory);
    
    // Store persistently if enabled
    if (this.storage) {
      await this.storeMemoryPersistent(memory);
    }

    return memory.id;
  }

  /**
   * Retrieve memories based on semantic similarity and context
   */
  async retrieveMemories(
    query: string,
    limit: number = 10,
    contextFilter?: Partial<MemoryEntry['context']>
  ): Promise<MemoryEntry[]> {
    const allMemories = await this.getAllMemories();
    
    // Filter by context if provided
    let filteredMemories = contextFilter 
      ? allMemories.filter(memory => this.matchesContext(memory, contextFilter))
      : allMemories;

    // Rank by relevance to query
    const rankedMemories = this.rankMemoriesByRelevance(filteredMemories, query);
    
    // Update access patterns
    const results = rankedMemories.slice(0, limit);
    await this.updateAccessPatterns(results);
    
    return results;
  }

  /**
   * Learn from user interactions and update preferences
   */
  async learnFromInteraction(
    userInput: string,
    systemResponse: string,
    feedback?: 'positive' | 'negative' | 'neutral',
    context: Partial<MemoryEntry['context']> = {}
  ): Promise<void> {
    // Store conversation memory
    await this.storeMemory(
      `User: ${userInput}\nAssistant: ${systemResponse}`,
      'conversation',
      context,
      ['interaction', feedback || 'neutral']
    );

    // Update user preferences based on feedback
    if (feedback === 'positive') {
      await this.reinforcePattern(userInput, systemResponse, context);
    } else if (feedback === 'negative') {
      await this.avoidPattern(userInput, systemResponse, context);
    }
  }

  /**
   * Generate comprehensive user insights from stored memories
   */
  async generateUserInsights(): Promise<UserLearningInsights> {
    const allMemories = await this.getAllMemories();
    
    // Extract patterns from workflow memories
    const workflowMemories = allMemories.filter(m => m.type === 'workflow_pattern');
    const patterns = workflowMemories
      .filter(m => m.metadata.tags.includes('positive'))
      .map(m => m.content)
      .slice(0, 10); // Top 10 patterns

    // Extract user preferences
    const preferenceMemories = allMemories.filter(m => m.type === 'user_preference');
    const preferences = preferenceMemories
      .map(m => m.content)
      .slice(0, 10); // Top 10 preferences

    // Generate suggestions based on patterns
    const suggestions = [
      "Consider using more specific commands for better results",
      "Try setting up automation for frequently used tasks",
      "Explore new features based on your usage patterns"
    ];

    // Find automation opportunities
    const frequentCommands = this.extractFrequentCommands(allMemories);
    const automationOpportunities = frequentCommands.map(cmd => 
      `Automate "${cmd}" based on usage frequency`
    );

    return {
      patterns,
      preferences,
      suggestions,
      automationOpportunities
    };
  }

  /**
   * Extract frequently used commands from memory
   */
  private extractFrequentCommands(memories: MemoryEntry[]): string[] {
    const commandCounts: { [key: string]: number } = {};
    
    memories.forEach(memory => {
      if (memory.metadata.tags.includes('command')) {
        const command = memory.content.split(' ')[0];
        commandCounts[command] = (commandCounts[command] || 0) + 1;
      }
    });

    return Object.entries(commandCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([cmd]) => cmd);
  }

  // Private helper methods
  private generateMemoryId(): string {
    return `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async calculateImportance(content: string, type: MemoryEntry['type']): Promise<number> {
    // Simple importance calculation - can be enhanced with ML models
    let importance = 0.5; // Base importance
    
    // Type-based importance
    if (type === 'user_preference') importance += 0.3;
    if (type === 'workflow_pattern') importance += 0.2;
    if (type === 'system_knowledge') importance += 0.1;
    
    // Content-based importance (keywords, length, etc.)
    if (content.length > 100) importance += 0.1;
    if (content.includes('important') || content.includes('remember')) importance += 0.2;
    
    return Math.min(1.0, importance);
  }

  private async addToMemoryLevel(memory: MemoryEntry): Promise<void> {
    // Add to main context for immediate availability
    // Implementation depends on storage backend
  }

  private async storeMemoryPersistent(memory: MemoryEntry): Promise<void> {
    // Store in persistent storage (Firebase/Firestore)
    if (this.storage) {
      // await this.storage.collection('memories').doc(memory.id).set(memory);
    }
  }

  private async getAllMemories(): Promise<MemoryEntry[]> {
    // Retrieve all memories from storage
    // Placeholder implementation
    return [];
  }

  private matchesContext(memory: MemoryEntry, contextFilter: Partial<MemoryEntry['context']>): boolean {
    return Object.entries(contextFilter).every(([key, value]) => {
      const memoryValue = memory.context[key as keyof MemoryEntry['context']];
      return !value || memoryValue === value;
    });
  }

  private rankMemoriesByRelevance(memories: MemoryEntry[], query: string): MemoryEntry[] {
    return memories.sort((a, b) => {
      const relevanceA = this.calculateRelevanceScore(a, query);
      const relevanceB = this.calculateRelevanceScore(b, query);
      return relevanceB - relevanceA;
    });
  }

  private calculateRelevanceScore(memory: MemoryEntry, query: string): number {
    let score = 0;
    
    // Text relevance (simple for now)
    const queryLower = query.toLowerCase();
    const contentLower = memory.content.toLowerCase();
    
    if (contentLower.includes(queryLower)) score += 0.5;
    
    // Tag relevance
    const matchingTags = memory.metadata.tags.filter(tag => 
      tag.toLowerCase().includes(queryLower)
    );
    score += matchingTags.length * 0.2;
    
    // Importance and recency
    score += memory.metadata.importance * 0.3;
    score += this.getRecencyScore(memory) * 0.2;
    
    return score;
  }

  private getRecencyScore(memory: MemoryEntry): number {
    const now = Date.now();
    const age = now - memory.timestamp.getTime();
    const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
    
    return Math.max(0, 1 - (age / maxAge));
  }

  private async updateAccessPatterns(memories: MemoryEntry[]): Promise<void> {
    for (const memory of memories) {
      memory.metadata.accessCount++;
      memory.metadata.lastAccessed = new Date();
      
      if (this.storage) {
        // Update in persistent storage
      }
    }
  }

  private async reinforcePattern(userInput: string, systemResponse: string, context: Partial<MemoryEntry['context']>): Promise<void> {
    await this.storeMemory(
      `Positive pattern: ${userInput} -> ${systemResponse}`,
      'workflow_pattern',
      context,
      ['positive', 'reinforced']
    );
  }

  private async avoidPattern(userInput: string, systemResponse: string, context: Partial<MemoryEntry['context']>): Promise<void> {
    await this.storeMemory(
      `Avoid pattern: ${userInput} -> ${systemResponse}`,
      'workflow_pattern',
      context,
      ['negative', 'avoid']
    );
  }
}

// Singleton instance for global use
export const memoryManager = new AdvancedMemoryManager('default_user');
