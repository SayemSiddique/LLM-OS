'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Sparkles, 
  Zap, 
  Atom, 
  Shield, 
  Terminal,
  Cpu,
  Globe,
  Lock,
  Eye
} from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [showLogo, setShowLogo] = useState(false);

  const loadingPhases = [
    { text: 'Initializing Quantum Processors...', icon: Atom, color: 'text-blue-400' },
    { text: 'Loading Neural Networks...', icon: Brain, color: 'text-purple-400' },
    { text: 'Establishing Secure Connections...', icon: Shield, color: 'text-green-400' },
    { text: 'Calibrating Holographic Interface...', icon: Globe, color: 'text-cyan-400' },
    { text: 'Activating Bio-Authentication...', icon: Eye, color: 'text-orange-400' },
    { text: 'System Ready - Welcome to the Future', icon: Sparkles, color: 'text-accent' }
  ];

  useEffect(() => {
    setShowLogo(true);

    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        const newProgress = prev + Math.random() * 15 + 5;
        
        // Update phase based on progress
        const phaseIndex = Math.floor((newProgress / 100) * loadingPhases.length);
        setCurrentPhase(Math.min(phaseIndex, loadingPhases.length - 1));
        
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            onComplete();
          }, 2000);
          return 100;
        }
        return newProgress;
      });
    }, 200);

    return () => clearInterval(progressInterval);
  }, [onComplete, loadingPhases.length]);

  const logoVariants = {
    hidden: { scale: 0, rotate: -180, opacity: 0 },
    visible: { 
      scale: 1, 
      rotate: 0, 
      opacity: 1,
      transition: { 
        duration: 1.5, 
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };
  const CurrentIcon = loadingPhases[currentPhase]?.icon;
  const currentColor = loadingPhases[currentPhase]?.color;

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-gradient-to-br from-background via-background-secondary to-background flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-accent/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="text-center space-y-8 max-w-md mx-auto px-6">
        {/* Logo Animation */}
        <motion.div
          variants={logoVariants}
          initial="hidden"
          animate={showLogo ? "visible" : "hidden"}
          className="relative"
        >
          {/* Main Logo Container */}
          <div className="relative w-32 h-32 mx-auto mb-6">
            {/* Outer Ring */}
            <motion.div
              className="absolute inset-0 border-4 border-accent/30 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Middle Ring */}
            <motion.div
              className="absolute inset-2 border-2 border-primary/50 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Inner Core */}
            <motion.div
              className="absolute inset-6 bg-gradient-to-r from-accent via-primary to-accent rounded-full flex items-center justify-center shadow-glow"
              animate={{ 
                boxShadow: [
                  '0 0 20px rgba(var(--accent), 0.5)',
                  '0 0 40px rgba(var(--accent), 0.8)',
                  '0 0 20px rgba(var(--accent), 0.5)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                variants={iconVariants}
                className="relative"
              >
                <Brain className="w-8 h-8 text-white" />
                {/* Neural connections */}
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <motion.div
                  className="absolute -bottom-1 -left-1 w-2 h-2 bg-primary rounded-full"
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
                />
              </motion.div>
            </motion.div>

            {/* Orbiting Icons */}
            {[Terminal, Zap, Lock, Cpu].map((Icon, i) => (
              <motion.div
                key={i}
                className="absolute w-8 h-8 bg-background-elevated rounded-full flex items-center justify-center border border-background-border shadow-lg"
                style={{
                  left: '50%',
                  top: '50%',
                  marginLeft: '-16px',
                  marginTop: '-16px',
                }}
                animate={{
                  rotate: 360,
                  x: Math.cos((i * 90 * Math.PI) / 180) * 60,
                  y: Math.sin((i * 90 * Math.PI) / 180) * 60,
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.5
                }}
              >
                <Icon className="w-4 h-4 text-accent" />
              </motion.div>
            ))}
          </div>

          {/* Logo Text */}
          <motion.div variants={iconVariants}>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent mb-2">
              LLM-OS
            </h1>
            <p className="text-lg text-foreground-secondary font-medium">
              The Future of AI Computing
            </p>
          </motion.div>
        </motion.div>

        {/* Loading Section */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          {/* Current Phase */}
          <motion.div
            className="flex items-center justify-center space-x-3"
            key={currentPhase}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >            {CurrentIcon && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <CurrentIcon className={`w-5 h-5 ${currentColor}`} />
              </motion.div>
            )}
            <span className={`text-sm font-medium ${currentColor}`}>
              {loadingPhases[currentPhase]?.text}
            </span>
          </motion.div>

          {/* Progress Bar */}
          <div className="w-full max-w-xs mx-auto">
            <div className="flex items-center justify-between text-xs text-foreground-muted mb-2">
              <span>Initializing</span>
              <span>{Math.round(loadingProgress)}%</span>
            </div>
            <div className="h-2 bg-background-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-accent to-primary"
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Inspiring Quote */}
          <motion.div
            className="mt-8 space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <blockquote className="text-sm text-foreground-secondary italic text-center">
              "We're programming computers in English now.<br />
              This is remarkable."
            </blockquote>
            <cite className="text-xs text-foreground-muted block text-center">
              — Andrej Karpathy
            </cite>
          </motion.div>

          {/* System Status */}
          <motion.div
            className="grid grid-cols-3 gap-4 mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
          >
            <div className="space-y-1">
              <div className="w-2 h-2 bg-success rounded-full mx-auto"></div>
              <div className="text-xs text-foreground-muted">Quantum</div>
            </div>
            <div className="space-y-1">
              <div className="w-2 h-2 bg-success rounded-full mx-auto"></div>
              <div className="text-xs text-foreground-muted">Neural</div>
            </div>
            <div className="space-y-1">
              <div className="w-2 h-2 bg-success rounded-full mx-auto"></div>
              <div className="text-xs text-foreground-muted">Secure</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Version Info */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
      >
        <div className="text-xs text-foreground-muted">
          LLM-OS v2.0 • Build 2025.06.22
        </div>
        <div className="text-xs text-foreground-muted mt-1">
          Next-Generation AI Operating System
        </div>
      </motion.div>
    </motion.div>
  );
}
