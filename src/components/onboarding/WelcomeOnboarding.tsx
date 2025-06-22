'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, 
  Brain, 
  Shield, 
  Zap, 
  Terminal, 
  Grid3X3, 
  Settings,
  ChevronRight,
  ChevronLeft,
  Check,
  Play,
  Star,
  Sparkles
} from 'lucide-react';
import { useLLMOSStore } from '../../lib/store';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  content: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function WelcomeOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [hasCompleted, setHasCompleted] = useState(false);
  const { setActiveView, updateAutonomyLevel } = useLLMOSStore();

  useEffect(() => {
    // Check if user has seen onboarding before
    const hasSeenOnboarding = localStorage.getItem('llm-os-onboarding-completed');
    if (hasSeenOnboarding) {
      setIsVisible(false);
    }
  }, []);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to LLM-OS',
      description: 'The future of AI-powered operating systems',
      icon: Rocket,
      content: (
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="w-24 h-24 mx-auto bg-gradient-primary rounded-full flex items-center justify-center shadow-glow"
          >
            <Rocket className="w-12 h-12 text-primary-foreground" />
          </motion.div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gradient-cyber">Welcome to the Future</h2>
            <p className="text-foreground-secondary max-w-md mx-auto">
              LLM-OS is a revolutionary operating system designed around Large Language Models. 
              Experience AI-native computing with advanced memory management, intelligent agents, 
              and seamless human-AI collaboration.
            </p>
          </div>
          <div className="flex justify-center space-x-2">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className="w-5 h-5 text-primary fill-current" 
              />
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'terminal',
      title: 'AI-Powered Terminal',
      description: 'Command your system with natural language',
      icon: Terminal,
      content: (
        <div className="space-y-4">
          <div className="bg-background-card rounded-lg p-4 border border-background-border">
            <div className="font-mono text-sm">
              <div className="text-primary mb-2">$ help</div>
              <div className="text-foreground-muted mb-4">
                Available commands: help, clear, status, apps, agent, ask, analyze...
              </div>
              <div className="text-primary mb-2">$ ask "What can you help me with?"</div>
              <div className="text-foreground-secondary">
                I can help you with system management, running applications, 
                creating AI agents, analyzing data, and much more. Try typing 
                natural language commands!
              </div>
            </div>
          </div>
          <p className="text-foreground-secondary text-sm">
            The terminal understands both traditional commands and natural language. 
            You can ask questions, give instructions, or run system commands seamlessly.
          </p>
        </div>
      ),
      action: {
        label: 'Try Terminal',
        onClick: () => setActiveView('shell')
      }
    },
    {
      id: 'intelligence',
      title: 'AI Intelligence Layer',
      description: 'Advanced memory and contextual understanding',
      icon: Brain,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-background-secondary rounded-lg">
              <Brain className="w-6 h-6 text-secondary mb-2" />
              <h4 className="font-semibold text-sm mb-1">Memory Manager</h4>
              <p className="text-xs text-foreground-muted">
                MemGPT-style memory management for persistent context
              </p>
            </div>
            <div className="p-3 bg-background-secondary rounded-lg">
              <Sparkles className="w-6 h-6 text-primary mb-2" />
              <h4 className="font-semibold text-sm mb-1">Adaptive Learning</h4>
              <p className="text-xs text-foreground-muted">
                Learns your patterns and preferences over time
              </p>
            </div>
          </div>
          <p className="text-foreground-secondary text-sm">
            LLM-OS features advanced AI capabilities including contextual understanding, 
            workflow pattern recognition, and personalized suggestions that improve over time.
          </p>
        </div>
      )
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      description: 'Enterprise-grade protection for your data',
      icon: Shield,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center space-x-3 p-3 bg-background-secondary rounded-lg">
              <Shield className="w-5 h-5 text-success" />
              <div>
                <h4 className="font-semibold text-sm">Security Sandbox</h4>
                <p className="text-xs text-foreground-muted">Isolated execution environment</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-background-secondary rounded-lg">
              <Shield className="w-5 h-5 text-primary" />
              <div>
                <h4 className="font-semibold text-sm">Data Encryption</h4>
                <p className="text-xs text-foreground-muted">AES-256 encryption for sensitive data</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-background-secondary rounded-lg">
              <Shield className="w-5 h-5 text-secondary" />
              <div>
                <h4 className="font-semibold text-sm">Privacy Engine</h4>
                <p className="text-xs text-foreground-muted">Automatic data classification and protection</p>
              </div>
            </div>
          </div>
          <p className="text-foreground-secondary text-sm">
            Your privacy and security are paramount. All data is encrypted, 
            classified, and processed with enterprise-grade security measures.
          </p>
        </div>
      )
    },
    {
      id: 'autonomy',
      title: 'AI Autonomy Levels',
      description: 'Control how much independence AI agents have',
      icon: Zap,
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            {[
              { level: 1, name: 'Suggest Only', desc: 'AI suggests actions, you decide' },
              { level: 2, name: 'Approval Required', desc: 'AI can act with your approval' },
              { level: 3, name: 'Oversight Mode', desc: 'AI acts autonomously with monitoring' },
              { level: 4, name: 'Full Autonomous', desc: 'Complete AI independence' }
            ].map((item) => (
              <div 
                key={item.level}
                className="flex items-center justify-between p-3 bg-background-secondary rounded-lg cursor-pointer hover:bg-background-hover transition-colors"
                onClick={() => updateAutonomyLevel(item.level as any)}
              >
                <div>
                  <h4 className="font-semibold text-sm">{item.name}</h4>
                  <p className="text-xs text-foreground-muted">{item.desc}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  item.level <= 2 ? 'bg-success' : 
                  item.level === 3 ? 'bg-warning' : 'bg-error'
                }`} />
              </div>
            ))}
          </div>
          <p className="text-foreground-secondary text-sm">
            Choose your preferred autonomy level. You can always change this later in settings.
          </p>
        </div>
      )
    },
    {
      id: 'complete',
      title: 'Ready to Start!',
      description: 'Your LLM-OS is configured and ready',
      icon: Star,
      content: (
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 mx-auto bg-gradient-primary rounded-full flex items-center justify-center shadow-glow"
          >
            <Check className="w-10 h-10 text-primary-foreground" />
          </motion.div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gradient-cyber">You're All Set!</h2>
            <p className="text-foreground-secondary max-w-md mx-auto">
              LLM-OS is ready to revolutionize your computing experience. 
              Start by exploring the terminal, launching apps, or checking out the dashboard.
            </p>
          </div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setActiveView('shell')}
              className="btn-primary flex items-center space-x-2"
            >
              <Terminal className="w-4 h-4" />
              <span>Open Terminal</span>
            </button>
            <button
              onClick={() => setActiveView('dashboard')}
              className="btn-ghost flex items-center space-x-2"
            >
              <Grid3X3 className="w-4 h-4" />
              <span>View Dashboard</span>
            </button>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = () => {
    localStorage.setItem('llm-os-onboarding-completed', 'true');
    setHasCompleted(true);
    setIsVisible(false);
  };

  const skipOnboarding = () => {
    localStorage.setItem('llm-os-onboarding-completed', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-md bg-background-card border border-background-border rounded-2xl shadow-cyber overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-background-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <currentStepData.icon className="w-6 h-6 text-primary" />
                <div>
                  <h1 className="text-xl font-bold">{currentStepData.title}</h1>
                  <p className="text-sm text-foreground-muted">{currentStepData.description}</p>
                </div>
              </div>
              <button
                onClick={skipOnboarding}
                className="text-xs text-foreground-muted hover:text-foreground transition-colors"
              >
                Skip
              </button>
            </div>
            
            {/* Progress Indicator */}
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`flex-1 h-2 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-primary' : 'bg-background-border'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStepData.content}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="p-6 border-t border-background-border">
            <div className="flex items-center justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center space-x-2 text-sm text-foreground-muted hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center space-x-3">
                {currentStepData.action && (
                  <button
                    onClick={currentStepData.action.onClick}
                    className="btn-ghost text-sm"
                  >
                    {currentStepData.action.label}
                  </button>
                )}
                
                <button
                  onClick={isLastStep ? completeOnboarding : nextStep}
                  className="btn-primary flex items-center space-x-2"
                >
                  <span>{isLastStep ? 'Get Started' : 'Next'}</span>
                  {isLastStep ? (
                    <Play className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
