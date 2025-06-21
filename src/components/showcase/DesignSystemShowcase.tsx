'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  Input,
  Textarea,
  Badge,
  Progress,
  Separator 
} from '../ui';
import { 
  LoadingSpinner, 
  LoadingDots, 
  LoadingPulse, 
  LoadingWave, 
  CardLoading 
} from '../ui/loading';
import { useToast, toast } from '../ui/toast';
import { 
  Sparkles, 
  Zap, 
  Cpu, 
  Terminal, 
  Settings, 
  Info,
  CheckCircle,
  AlertTriangle,
  AlertCircle
} from 'lucide-react';

export function DesignSystemShowcase() {
  const [progressValue, setProgressValue] = useState(65);
  const { addToast } = useToast();

  const handleToastDemo = (variant: 'success' | 'error' | 'warning' | 'info') => {
    const toastMessages = {
      success: toast.success('Operation completed successfully!', {
        description: 'Your changes have been saved.',
      }),
      error: toast.error('Something went wrong', {
        description: 'Please try again later.',
      }),
      warning: toast.warning('Warning: Resource usage high', {
        description: 'Consider optimizing your queries.',
      }),
      info: toast.info('New feature available', {
        description: 'Check out the latest updates.',
      }),
    };
    
    addToast(toastMessages[variant]);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-5xl font-display font-bold text-gradient mb-4">
            LLM-OS Design System
          </h1>
          <p className="text-xl text-foreground-muted">
            A comprehensive UI/UX system for the future of AI computing
          </p>
        </motion.div>

        {/* Color Palette */}
        <section>
          <h2 className="text-3xl font-display font-bold mb-6 text-foreground">
            Color Palette
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card variant="glass">
              <CardContent className="p-6">
                <div className="w-full h-20 bg-primary rounded-lg mb-4 shadow-glow" />
                <h3 className="font-semibold text-primary">Primary</h3>
                <p className="text-sm text-foreground-muted">#00ff88</p>
              </CardContent>
            </Card>
            
            <Card variant="glass">
              <CardContent className="p-6">
                <div className="w-full h-20 bg-secondary rounded-lg mb-4" />
                <h3 className="font-semibold text-secondary">Secondary</h3>
                <p className="text-sm text-foreground-muted">#3b82f6</p>
              </CardContent>
            </Card>
            
            <Card variant="glass">
              <CardContent className="p-6">
                <div className="w-full h-20 bg-accent rounded-lg mb-4" />
                <h3 className="font-semibold text-accent">Accent</h3>
                <p className="text-sm text-foreground-muted">#8b5cf6</p>
              </CardContent>
            </Card>
            
            <Card variant="glass">
              <CardContent className="p-6">
                <div className="w-full h-20 bg-success rounded-lg mb-4" />
                <h3 className="font-semibold text-success">Success</h3>
                <p className="text-sm text-foreground-muted">#10b981</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Typography */}
        <section>
          <h2 className="text-3xl font-display font-bold mb-6 text-foreground">
            Typography
          </h2>
          <Card variant="glass">
            <CardContent className="p-8 space-y-4">
              <h1 className="text-4xl font-display font-bold text-gradient">
                Display Heading (Plus Jakarta Sans)
              </h1>
              <h2 className="text-2xl font-sans font-semibold text-foreground">
                Body Heading (Inter)
              </h2>
              <p className="text-base text-foreground-secondary">
                Regular body text with excellent readability and clean appearance.
              </p>
              <code className="text-sm font-mono bg-background-tertiary px-2 py-1 rounded text-primary">
                Monospace code text (JetBrains Mono)
              </code>
            </CardContent>
          </Card>
        </section>

        {/* Buttons */}
        <section>
          <h2 className="text-3xl font-display font-bold mb-6 text-foreground">
            Buttons
          </h2>
          <Card variant="glass">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">Default</h3>
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="accent">Accent</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">Glass</h3>
                  <Button variant="glass">Glass Effect</Button>
                  <Button variant="outline">Outlined</Button>
                  <Button variant="link">Link Style</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">Sizes</h3>
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="xl">Extra Large</Button>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">Icons</h3>
                  <Button size="icon"><Cpu className="w-4 h-4" /></Button>
                  <Button size="icon-sm"><Terminal className="w-4 h-4" /></Button>
                  <Button size="icon-lg"><Settings className="w-5 h-5" /></Button>
                  <Button><Sparkles className="w-4 h-4 mr-2" />With Icon</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Form Elements */}
        <section>
          <h2 className="text-3xl font-display font-bold mb-6 text-foreground">
            Form Elements
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Default Forms</CardTitle>
                <CardDescription>Standard form inputs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Enter your name" />
                <Input type="email" placeholder="email@example.com" />
                <Textarea placeholder="Write your message..." />
              </CardContent>
            </Card>
            
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Glass Effect Forms</CardTitle>
                <CardDescription>Glassmorphism style inputs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input variant="glass" placeholder="Glass input" />
                <Input variant="glass" type="password" placeholder="Password" />
                <Textarea variant="glass" placeholder="Glass textarea..." />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Badges and Progress */}
        <section>
          <h2 className="text-3xl font-display font-bold mb-6 text-foreground">
            Badges & Progress
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Badges</CardTitle>
                <CardDescription>Status and category indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="error">Error</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="glass">Glass</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Progress Indicators</CardTitle>
                <CardDescription>Various progress states</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{progressValue}%</span>
                  </div>
                  <Progress value={progressValue} />
                </div>
                
                <div className="space-y-2">
                  <span className="text-sm">Success</span>
                  <Progress value={100} variant="success" />
                </div>
                
                <div className="space-y-2">
                  <span className="text-sm">Warning</span>
                  <Progress value={75} variant="warning" />
                </div>
                
                <div className="space-y-2">
                  <span className="text-sm">Error</span>
                  <Progress value={25} variant="error" />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Loading States */}
        <section>
          <h2 className="text-3xl font-display font-bold mb-6 text-foreground">
            Loading States
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Spinners</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <LoadingSpinner size="sm" />
                <LoadingSpinner size="md" variant="primary" />
                <LoadingSpinner size="lg" variant="glow" />
              </CardContent>
            </Card>
            
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Dots</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <LoadingDots size="sm" />
                <LoadingDots size="md" />
                <LoadingDots size="lg" />
              </CardContent>
            </Card>
            
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Pulse</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <LoadingPulse size="lg" />
              </CardContent>
            </Card>
            
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Wave</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <LoadingWave />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Toasts */}
        <section>
          <h2 className="text-3xl font-display font-bold mb-6 text-foreground">
            Notifications
          </h2>
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Toast Notifications</CardTitle>
              <CardDescription>Interactive notification system</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <Button 
                variant="glass" 
                onClick={() => handleToastDemo('success')}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Success Toast
              </Button>
              <Button 
                variant="glass" 
                onClick={() => handleToastDemo('error')}
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                Error Toast
              </Button>
              <Button 
                variant="glass" 
                onClick={() => handleToastDemo('warning')}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Warning Toast
              </Button>
              <Button 
                variant="glass" 
                onClick={() => handleToastDemo('info')}
              >
                <Info className="w-4 h-4 mr-2" />
                Info Toast
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Card Loading States */}
        <section>
          <h2 className="text-3xl font-display font-bold mb-6 text-foreground">
            Skeleton Loading
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Loading Card 1</CardTitle>
              </CardHeader>
              <CardContent>
                <CardLoading lines={3} />
              </CardContent>
            </Card>
            
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Loading Card 2</CardTitle>
              </CardHeader>
              <CardContent>
                <CardLoading lines={5} />
              </CardContent>
            </Card>
            
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Loading Card 3</CardTitle>
              </CardHeader>
              <CardContent>
                <CardLoading lines={2} />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Interactive Demo */}
        <section>
          <h2 className="text-3xl font-display font-bold mb-6 text-foreground">
            Interactive Elements
          </h2>
          <Card variant="glow">
            <CardHeader>
              <CardTitle className="text-gradient">Live Demo</CardTitle>
              <CardDescription>
                Interact with the progress slider below
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <label className="text-sm font-medium">Progress Value: {progressValue}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progressValue}
                  onChange={(e) => setProgressValue(Number(e.target.value))}
                  className="w-full h-2 bg-background-border rounded-lg appearance-none cursor-pointer slider"
                />
                <Progress value={progressValue} className="mt-4" />
              </div>
              
              <Separator />
              
              <div className="text-center">
                <motion.div
                  animate={{ 
                    rotate: progressValue * 3.6,
                    scale: 1 + (progressValue / 200)
                  }}
                  className="inline-block"
                >
                  <Zap className="w-8 h-8 text-primary" />
                </motion.div>
                <p className="text-sm text-foreground-muted mt-2">
                  Animation responds to progress value
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
