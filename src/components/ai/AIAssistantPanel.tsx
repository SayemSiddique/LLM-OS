'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Brain, 
  Zap, 
  Eye, 
  MessageSquare, 
  Lightbulb,
  TrendingUp,
  Clock,
  Target,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Settings,
  RefreshCw
} from 'lucide-react';
import { useLLMOSStore } from '../../lib/store';
import { contextualEngine } from '../../lib/intelligence/contextualEngine';
import { adaptiveLearningSystem } from '../../lib/intelligence/adaptiveLearning';

interface AIInsight {
  id: string;
  type: 'pattern' | 'suggestion' | 'prediction' | 'optimization';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  timestamp: Date;
  category: 'workflow' | 'performance' | 'learning' | 'user_behavior';
}

interface ContextualSuggestion {
  id: string;
  type: 'command' | 'workflow' | 'setting' | 'app';
  title: string;
  description: string;
  action: string;
  relevance: number;
  icon: React.ComponentType<any>;
}

export function AIAssistantPanel() {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [suggestions, setSuggestions] = useState<ContextualSuggestion[]>([]);
  const [contextualData, setContextualData] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<'insights' | 'suggestions' | 'context'>('insights');
  const [isLoading, setIsLoading] = useState(false);
  const { user, autonomyLevel } = useLLMOSStore();

  useEffect(() => {
    loadAIData();
    const interval = setInterval(loadAIData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadAIData = async () => {
    setIsLoading(true);
    try {
      // Generate mock insights
      const mockInsights: AIInsight[] = [
        {
          id: '1',
          type: 'pattern',
          title: 'Workflow Pattern Detected',
          description: 'You frequently use terminal commands followed by app launches. Consider creating a workflow automation.',
          confidence: 0.89,
          actionable: true,
          timestamp: new Date(),
          category: 'workflow'
        },
        {
          id: '2',
          type: 'suggestion',
          title: 'Memory Optimization',
          description: 'Your memory usage could be improved by archiving older conversation contexts.',
          confidence: 0.76,
          actionable: true,
          timestamp: new Date(),
          category: 'performance'
        },
        {
          id: '3',
          type: 'prediction',
          title: 'Usage Prediction',
          description: 'Based on your patterns, you might need the code generator app in the next hour.',
          confidence: 0.67,
          actionable: false,
          timestamp: new Date(),
          category: 'user_behavior'
        }
      ];

      // Generate contextual suggestions
      const mockSuggestions: ContextualSuggestion[] = [
        {
          id: '1',
          type: 'command',
          title: 'Quick Status Check',
          description: 'Run system status to see current performance',
          action: 'status',
          relevance: 0.92,
          icon: Eye
        },
        {
          id: '2',
          type: 'workflow',
          title: 'Create Agent Task',
          description: 'Automate your current workflow with an AI agent',
          action: 'agent create workflow automation',
          relevance: 0.84,
          icon: Bot
        },
        {
          id: '3',
          type: 'setting',
          title: 'Adjust Autonomy',
          description: 'Consider increasing autonomy level for faster execution',
          action: 'Open autonomy settings',
          relevance: 0.71,
          icon: Settings
        }
      ];

      setInsights(mockInsights);
      setSuggestions(mockSuggestions);
      setContextualData({
        currentIntent: 'system_monitoring',
        contextAccuracy: 0.94,
        learningProgress: 0.78,
        memoryEfficiency: 0.91
      });
    } catch (error) {
      console.error('Failed to load AI data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'pattern': return TrendingUp;
      case 'suggestion': return Lightbulb;
      case 'prediction': return Target;
      case 'optimization': return Zap;
      default: return Brain;
    }
  };

  const getInsightColor = (type: AIInsight['type']) => {
    switch (type) {
      case 'pattern': return 'rgb(var(--secondary))';
      case 'suggestion': return 'rgb(var(--warning))';
      case 'prediction': return 'rgb(var(--accent))';
      case 'optimization': return 'rgb(var(--primary))';
      default: return 'rgb(var(--foreground-muted))';
    }
  };

  const formatConfidence = (confidence: number) => {
    return `${Math.round(confidence * 100)}% confidence`;
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full max-w-md bg-background-card border border-background-border rounded-xl shadow-cyber overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-background-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">AI Assistant</h3>
              <p className="text-sm text-foreground-muted">Intelligent insights & suggestions</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={loadAIData}
              disabled={isLoading}
              className="p-2 rounded-lg hover:bg-background-hover transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg hover:bg-background-hover transition-colors"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Tab Navigation */}
            <div className="flex border-b border-background-border">
              {(['insights', 'suggestions', 'context'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? 'text-primary border-b-2 border-primary bg-primary/10'
                      : 'text-foreground-muted hover:text-foreground'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-4 max-h-96 overflow-y-auto custom-scrollbar">
              {activeTab === 'insights' && (
                <div className="space-y-3">
                  {insights.map((insight) => {
                    const Icon = getInsightIcon(insight.type);
                    
                    return (
                      <motion.div
                        key={insight.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-background-secondary/50 rounded-lg border border-background-border/50 hover:bg-background-hover/50 transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <Icon
                            className="w-5 h-5 flex-shrink-0 mt-0.5"
                            style={{ color: getInsightColor(insight.type) }}
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-sm font-semibold">{insight.title}</h4>
                              <span className="text-xs px-2 py-1 rounded-full bg-background-border text-foreground-muted">
                                {insight.type}
                              </span>
                            </div>
                            <p className="text-sm text-foreground-muted mb-2">
                              {insight.description}
                            </p>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-foreground-muted">
                                {formatConfidence(insight.confidence)}
                              </span>
                              <span className="text-foreground-muted">
                                {formatTimestamp(insight.timestamp)}
                              </span>
                            </div>
                            {insight.actionable && (
                              <button className="mt-2 text-xs text-primary hover:text-primary-hover transition-colors">
                                Take Action →
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'suggestions' && (
                <div className="space-y-3">
                  {suggestions.map((suggestion) => {
                    const Icon = suggestion.icon;
                    
                    return (
                      <motion.div
                        key={suggestion.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-background-secondary/50 rounded-lg border border-background-border/50 hover:bg-background-hover/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold mb-1">{suggestion.title}</h4>
                            <p className="text-sm text-foreground-muted mb-2">
                              {suggestion.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <code className="text-xs bg-background-card px-2 py-1 rounded">
                                {suggestion.action}
                              </code>
                              <div className="flex items-center">
                                <div className="w-16 h-1 bg-background-border rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-primary rounded-full"
                                    style={{ width: `${suggestion.relevance * 100}%` }}
                                  />
                                </div>
                                <span className="text-xs text-foreground-muted ml-2">
                                  {Math.round(suggestion.relevance * 100)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'context' && contextualData && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-background-secondary/50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Eye className="w-4 h-4 text-secondary" />
                        <span className="text-sm font-medium">Context</span>
                      </div>
                      <div className="text-xs text-foreground-muted mb-1">Accuracy</div>
                      <div className="text-lg font-bold">
                        {Math.round(contextualData.contextAccuracy * 100)}%
                      </div>
                    </div>
                    
                    <div className="p-3 bg-background-secondary/50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Learning</span>
                      </div>
                      <div className="text-xs text-foreground-muted mb-1">Progress</div>
                      <div className="text-lg font-bold">
                        {Math.round(contextualData.learningProgress * 100)}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-background-secondary/50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Brain className="w-4 h-4 text-accent" />
                      <span className="text-sm font-medium">Current Intent</span>
                    </div>
                    <div className="text-sm text-foreground">
                      {contextualData.currentIntent.replace('_', ' ').toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="p-3 bg-background-secondary/50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-warning" />
                      <span className="text-sm font-medium">Memory Efficiency</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 h-2 bg-background-border rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-primary rounded-full"
                          style={{ width: `${contextualData.memoryEfficiency * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold">
                        {Math.round(contextualData.memoryEfficiency * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
