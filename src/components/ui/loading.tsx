'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader, Cpu, Sparkles } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'cyber' | 'glow';
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

export function LoadingSpinner({ 
  size = 'md', 
  variant = 'default', 
  className 
}: LoadingSpinnerProps) {
  const baseClasses = cn(
    'animate-spin',
    sizeClasses[size],
    className
  );

  const variantClasses = {
    default: 'text-foreground',
    primary: 'text-primary',
    cyber: 'text-secondary',
    glow: 'text-primary drop-shadow-glow',
  };

  return (
    <Loader className={cn(baseClasses, variantClasses[variant])} />
  );
}

interface LoadingDotsProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingDots({ size = 'md', className }: LoadingDotsProps) {
  const dotSizes = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  const containerSizes = {
    sm: 'gap-1',
    md: 'gap-1.5',
    lg: 'gap-2',
  };

  return (
    <div className={cn('flex items-center', containerSizes[size], className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={cn(
            'bg-primary rounded-full',
            dotSizes[size]
          )}
          animate={{
            scale: [0.5, 1, 0.5],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

interface LoadingPulseProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function LoadingPulse({ size = 'md', className }: LoadingPulseProps) {
  return (
    <motion.div
      className={cn(
        'relative flex items-center justify-center',
        sizeClasses[size],
        className
      )}
      animate={{ scale: [1, 1.2, 1] }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <motion.div
        className="absolute inset-0 bg-primary rounded-full opacity-20"
        animate={{ scale: [1, 2, 1], opacity: [0.4, 0, 0.4] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute inset-0 bg-primary rounded-full opacity-30"
        animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.3,
        }}
      />
      <Cpu className="w-1/2 h-1/2 text-primary relative z-10" />
    </motion.div>
  );
}

interface LoadingWaveProps {
  className?: string;
}

export function LoadingWave({ className }: LoadingWaveProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="w-1 bg-primary rounded-full"
          animate={{
            height: [4, 16, 4],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.1,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

interface FullPageLoadingProps {
  message?: string;
  submessage?: string;
}

export function FullPageLoading({ 
  message = "Initializing LLM-OS", 
  submessage = "Loading neural networks..." 
}: FullPageLoadingProps) {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-[9999]">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background-secondary to-background-tertiary opacity-50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      {/* Loading Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center"
      >
        {/* Logo */}
        <motion.div
          className="mb-8 flex justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
          <div className="relative w-24 h-24 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow-lg">
            <Cpu className="w-12 h-12 text-primary-foreground" />
            <motion.div
              className="absolute inset-0 bg-gradient-primary rounded-2xl opacity-20"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Loading Animation */}
        <div className="mb-6">
          <LoadingPulse size="lg" className="mx-auto" />
        </div>

        {/* Text */}
        <motion.h1
          className="text-2xl font-display font-bold text-gradient mb-2"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {message}
        </motion.h1>
        
        <motion.p
          className="text-foreground-muted text-sm mb-8"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        >
          {submessage}
        </motion.p>

        {/* Loading Progress */}
        <div className="w-64 mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-foreground-muted">Loading...</span>
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          </div>
          <div className="h-1 bg-background-border rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-primary"
              animate={{ width: ['0%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

interface CardLoadingProps {
  lines?: number;
  className?: string;
}

export function CardLoading({ lines = 3, className }: CardLoadingProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Header skeleton */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-background-border rounded-lg animate-shimmer" />
        <div className="space-y-2">
          <div className="h-4 bg-background-border rounded w-32 animate-shimmer" />
          <div className="h-3 bg-background-border rounded w-24 animate-shimmer" />
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-3 bg-background-border rounded animate-shimmer',
              i === lines - 1 ? 'w-3/4' : 'w-full'
            )}
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  );
}
