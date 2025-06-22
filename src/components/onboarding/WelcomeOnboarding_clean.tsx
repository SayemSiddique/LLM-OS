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
  Sparkles,
  Eye,
  Layers,
  Atom,
  Globe,
  Users,
  Target,
  Cpu,
  Lock,
  Heart,
  MonitorSpeaker,
  MousePointer,
  Headphones
} from 'lucide-react';
import { useLLMOSStore } from '../../lib/store';

interface OnboardingStep {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<any>;
  content: React.ReactNode;
  features?: string[];
  action?: {
    label: string;
    onClick: () => void;
  };
  interactive?: boolean;
}

interface WelcomeOnboardingProps {
  onComplete?: () => void;
}

export function WelcomeOnboarding({ onComplete }: WelcomeOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [userProgress, setUserProgress] = useState<Record<string, boolean>>({});
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
      subtitle: 'The Future of AI Computing',
      description: 'Experience the world\'s most advanced AI operating system. Built for the next generation of human-AI collaboration.',
      icon: Rocket,
      features: [
        'Revolutionary AI-powered interface',
        'Quantum-grade security and privacy',
        'Holographic 3D interactions',
        'Emotional intelligence monitoring'
      ],
      content: (
        <div className="text-center space-y-6">
          <motion.div
            className="w-24 h-24 mx-auto bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center shadow-glow"
            animate={{ 
              scale: [1, 1.1, 1],
              boxShadow: [
                '0 0 20px rgba(var(--accent), 0.5)',
                '0 0 40px rgba(var(--accent), 0.8)',
                '0 0 20px rgba(var(--accent), 0.5)',
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Rocket className="w-12 h-12 text-white" />
          </motion.div>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-foreground">Ready to explore the future?</h3>
            <p className="text-foreground-secondary">
              Let's take you on a journey through the most advanced AI operating system ever created.
            </p>
          </div>
        </div>
      ),
      interactive: true
    },
    {
      id: 'neural-visualization',
      title: 'Neural Visualization',
      subtitle: 'Watch AI Think in Real-Time',
      description: 'Our advanced neural visualization engine lets you see how AI processes information, makes decisions, and learns from interactions.',
      icon: Brain,
      features: [
        'Real-time neural network activity',
        'Thought stream visualization',
        'Cognitive load monitoring',
        'AI decision-making insights'
      ],
      content: (
        <div className="space-y-6">
          <div className="bg-background-secondary/50 rounded-xl p-6 border border-background-border">
            <div className="grid grid-cols-4 gap-3 mb-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="aspect-square bg-background-elevated rounded-lg border border-background-border flex items-center justify-center"
                  animate={{
                    borderColor: ['#3b82f6', '#8b5cf6', '#10b981', '#3b82f6'],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    delay: i * 0.1 
                  }}
                >
                  <div className="w-3 h-3 bg-accent rounded-full" />
                </motion.div>
              ))}
            </div>
            <div className="text-center">
              <div className="text-sm text-accent font-medium">AI is thinking...</div>
              <div className="text-xs text-foreground-muted mt-1">Processing patterns and connections</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'quantum-computing',
      title: 'Quantum Computing',
      subtitle: 'Harness Quantum Power',
      description: 'Experience quantum computing capabilities with our 16-qubit processor simulation and post-quantum cryptography.',
      icon: Atom,
      features: [
        '16-qubit quantum simulation',
        'Quantum entanglement visualization',
        'Post-quantum cryptography',
        'Superposition processing'
      ],
      content: (
        <div className="space-y-6">
          <div className="bg-background-secondary/50 rounded-xl p-6 border border-background-border">
            <div className="grid grid-cols-4 gap-2 mb-4">
              {Array.from({ length: 16 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="aspect-square bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                  animate={{
                    rotate: [0, 180, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    delay: i * 0.2 
                  }}
                >
                  Q{i}
                </motion.div>
              ))}
            </div>
            <div className="text-center">
              <div className="text-sm text-blue-400 font-medium">Quantum Coherence: 94.7%</div>
              <div className="text-xs text-foreground-muted mt-1">Qubits in superposition</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'holographic-interface',
      title: 'Holographic Interface',
      subtitle: '3D Spatial Computing',
      description: 'Interact with data in three dimensions using gesture recognition and spatial computing technologies.',
      icon: Layers,
      features: [
        '3D data visualization',
        'Gesture recognition',
        'Spatial computing',
        'Holographic interactions'
      ],
      content: (
        <div className="space-y-6">
          <div className="bg-background-secondary/50 rounded-xl p-6 border border-background-border relative overflow-hidden">
            <div className="relative h-32">
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-8 h-8 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: '50%',
                    transform: 'translateY(-50%)',
                  }}
                  animate={{
                    y: [0, -20, 0],
                    rotateY: [0, 180, 360],
                    z: [0, 50, 0]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    delay: i * 0.3 
                  }}
                >
                  <Layers className="w-4 h-4 text-white" />
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-4">
              <div className="text-sm text-cyan-400 font-medium">Holographic Mode Active</div>
              <div className="text-xs text-foreground-muted mt-1">3D objects in space</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'bio-authentication',
      title: 'Bio-Authentication',
      subtitle: 'Advanced Security & Wellness',
      description: 'Experience multi-layered biometric security with emotional intelligence monitoring for your wellbeing.',
      icon: Shield,
      features: [
        'Fingerprint & iris scanning',
        'Voice recognition',
        'Heart rate monitoring',
        'Emotional intelligence'
      ],
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Eye, label: 'Iris Scan', status: 'verified', color: 'text-success' },
              { icon: Heart, label: 'Heart Rate', status: '72 BPM', color: 'text-warning' },
              { icon: MousePointer, label: 'Fingerprint', status: 'verified', color: 'text-success' },
              { icon: Brain, label: 'Emotion', status: 'focused', color: 'text-blue-400' }
            ].map((item, i) => (
              <motion.div
                key={i}
                className="bg-background-secondary/50 rounded-lg p-4 border border-background-border text-center"
                animate={{
                  borderColor: item.color === 'text-success' ? '#10b981' : 
                              item.color === 'text-warning' ? '#f59e0b' : '#3b82f6'
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <item.icon className={`w-6 h-6 mx-auto mb-2 ${item.color}`} />
                <div className="text-xs text-foreground">{item.label}</div>
                <div className={`text-xs font-medium ${item.color}`}>{item.status}</div>
              </motion.div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'dashboard-tour',
      title: 'System Dashboard',
      subtitle: 'Monitor & Control Everything',
      description: 'Your mission control center with real-time system monitoring, AI insights, and performance metrics.',
      icon: MonitorSpeaker,
      features: [
        'Real-time system metrics',
        'AI module status',
        'Performance analytics',
        'Health monitoring'
      ],
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background-secondary/50 rounded-lg p-3 border border-background-border">
              <div className="flex items-center space-x-2 mb-2">
                <Cpu className="w-4 h-4 text-accent" />
                <span className="text-xs text-foreground">CPU Usage</span>
              </div>
              <div className="text-lg font-bold text-accent">23%</div>
            </div>
            <div className="bg-background-secondary/50 rounded-lg p-3 border border-background-border">
              <div className="flex items-center space-x-2 mb-2">
                <Brain className="w-4 h-4 text-primary" />
                <span className="text-xs text-foreground">AI Load</span>
              </div>
              <div className="text-lg font-bold text-primary">High</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'complete',
      title: 'Ready to Launch',
      subtitle: 'Your AI Journey Begins Now',
      description: 'You\'re all set! LLM-OS is configured and ready to revolutionize how you interact with AI.',
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
    if (onComplete) {
      onComplete();
    }
  };

  const skipOnboarding = () => {
    localStorage.setItem('llm-os-onboarding-completed', 'true');
    setIsVisible(false);
    if (onComplete) {
      onComplete();
    }
  };

  if (!isVisible) return null;

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const CurrentIcon = currentStepData.icon;

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
                <CurrentIcon className="w-6 h-6 text-primary" />
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
