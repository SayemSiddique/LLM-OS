'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Code, 
  FileText, 
  BarChart3, 
  Search, 
  Sparkles,
  Rocket,
  Brain,
  Zap
} from 'lucide-react';

interface DemoScenario {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  command: string;
  expectedResponse: string;
  category: 'ai' | 'code' | 'system' | 'creative';
}

interface DemoShowcaseProps {
  onRunDemo: (command: string) => void;
}

export function DemoShowcase({ onRunDemo }: DemoShowcaseProps) {
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);

  const demoScenarios: DemoScenario[] = [
    {
      id: 'ai-chat',
      title: 'AI Conversation',
      description: 'Have a natural conversation with advanced AI',
      icon: Brain,
      command: 'What are the latest breakthroughs in AI that could revolutionize computing?',
      expectedResponse: 'Detailed analysis of recent AI developments...',
      category: 'ai'
    },
    {
      id: 'code-gen',
      title: 'Code Generation',
      description: 'Generate React components with AI',
      icon: Code,
      command: 'Create a React component for a modern dashboard card with analytics',
      expectedResponse: 'Generated React component with TypeScript...',
      category: 'code'
    },
    {
      id: 'system-analysis',
      title: 'System Analysis',
      description: 'Analyze system performance with AI insights',
      icon: BarChart3,
      command: 'analyze system performance and suggest optimizations',
      expectedResponse: 'System analysis with actionable recommendations...',
      category: 'system'
    },
    {
      id: 'creative-writing',
      title: 'Creative Assistant',
      description: 'Generate creative content and ideas',
      icon: Sparkles,
      command: 'Write a compelling product description for LLM-OS targeting tech leaders',
      expectedResponse: 'Professional marketing copy...',
      category: 'creative'
    },
    {
      id: 'web-search',
      title: 'Smart Research',
      description: 'Research and synthesize information',
      icon: Search,
      command: 'research the future of human-AI collaboration and summarize key trends',
      expectedResponse: 'Comprehensive research summary...',
      category: 'ai'
    },
    {
      id: 'app-launch',
      title: 'App Management',
      description: 'Launch and manage applications via voice',
      icon: Rocket,
      command: 'launch dashboard and show me system metrics',
      expectedResponse: 'Dashboard launched with real-time metrics...',
      category: 'system'
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ai': return 'from-blue-500 to-purple-500';
      case 'code': return 'from-green-500 to-emerald-500';
      case 'system': return 'from-orange-500 to-red-500';
      case 'creative': return 'from-pink-500 to-rose-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gradient-cyber">AI Demo Scenarios</h2>
        <p className="text-foreground-secondary max-w-2xl mx-auto">
          Experience the power of LLM-OS with these interactive demonstrations. 
          Click any scenario to see AI in action.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demoScenarios.map((demo, index) => (
          <motion.div
            key={demo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative group cursor-pointer ${
              selectedDemo === demo.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedDemo(demo.id)}
          >
            <div className="bg-background-card border border-background-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 h-full">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getCategoryColor(demo.category)} flex items-center justify-center mb-4`}>
                <demo.icon className="w-6 h-6 text-white" />
              </div>
              
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {demo.title}
              </h3>
              
              <p className="text-foreground-secondary text-sm mb-4">
                {demo.description}
              </p>
              
              <div className="bg-background-elevated rounded-lg p-3 mb-4">
                <div className="text-xs text-foreground-muted mb-1">Command:</div>
                <div className="text-sm font-mono text-accent">
                  "{demo.command}"
                </div>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRunDemo(demo.command);
                }}
                className="w-full btn-primary flex items-center justify-center space-x-2 group-hover:bg-primary/90"
              >
                <Play className="w-4 h-4" />
                <span>Run Demo</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedDemo && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedDemo(null)}
        >
          <div className="bg-background-card border border-background-border rounded-xl p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Demo Preview</h3>
              <button
                onClick={() => setSelectedDemo(null)}
                className="text-foreground-muted hover:text-foreground"
              >
                ✕
              </button>
            </div>
            
            {demoScenarios.find(d => d.id === selectedDemo) && (
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-foreground-muted mb-2">You'll ask:</div>
                  <div className="bg-background-elevated rounded-lg p-4 font-mono text-sm">
                    {demoScenarios.find(d => d.id === selectedDemo)?.command}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-foreground-muted mb-2">AI will respond with:</div>
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-sm">
                    {demoScenarios.find(d => d.id === selectedDemo)?.expectedResponse}
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    const demo = demoScenarios.find(d => d.id === selectedDemo);
                    if (demo) {
                      onRunDemo(demo.command);
                      setSelectedDemo(null);
                    }
                  }}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>Start This Demo</span>
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
