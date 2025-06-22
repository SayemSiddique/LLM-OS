'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Zap, 
  Atom, 
  Brain, 
  Shield, 
  Layers,
  ChevronRight,
  Settings,
  Globe,
  Cpu
} from 'lucide-react';
import { NeuralVisualization } from './NeuralVisualization';
import { QuantumCryptoInterface } from './QuantumCryptoInterface';
import { HolographicInterface } from './HolographicInterface';
import { BioAuthenticationInterface } from './BioAuthenticationInterface';

interface AdvancedFeature {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  component: React.ComponentType<any>;
  color: string;
  status: 'stable' | 'beta' | 'experimental';
  category: 'ai' | 'security' | 'interface' | 'computing';
}

export function AdvancedFeaturesPage() {
  const [selectedFeature, setSelectedFeature] = useState<string>('neural');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const features: AdvancedFeature[] = [
    {
      id: 'neural',
      name: 'Neural Visualization',
      description: 'Real-time AI cognition and neural network activity monitoring',
      icon: Brain,
      component: NeuralVisualization,
      color: 'from-purple-500 to-pink-500',
      status: 'stable',
      category: 'ai'
    },
    {
      id: 'quantum',
      name: 'Quantum Computing',
      description: 'Quantum processing units and post-quantum cryptography',
      icon: Atom,
      component: QuantumCryptoInterface,
      color: 'from-blue-500 to-cyan-500',
      status: 'experimental',
      category: 'computing'
    },
    {
      id: 'holographic',
      name: 'Holographic Interface',
      description: '3D spatial computing and gesture-based interactions',
      icon: Layers,
      component: HolographicInterface,
      color: 'from-cyan-500 to-teal-500',
      status: 'beta',
      category: 'interface'
    },
    {
      id: 'biometric',
      name: 'Bio-Authentication',
      description: 'Advanced biometric security and emotional intelligence',
      icon: Shield,
      component: BioAuthenticationInterface,
      color: 'from-emerald-500 to-green-500',
      status: 'stable',
      category: 'security'
    }
  ];

  const selectedFeatureData = features.find(f => f.id === selectedFeature);
  const SelectedComponent = selectedFeatureData?.component;

  const getStatusColor = (status: AdvancedFeature['status']) => {
    switch (status) {
      case 'stable': return 'text-success';
      case 'beta': return 'text-warning';
      case 'experimental': return 'text-accent';
    }
  };

  const getCategoryIcon = (category: AdvancedFeature['category']) => {
    switch (category) {
      case 'ai': return Brain;
      case 'security': return Shield;
      case 'interface': return Layers;
      case 'computing': return Cpu;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-accent to-primary rounded-xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Advanced Features
            </h1>
          </div>
          <p className="text-lg text-foreground-secondary max-w-2xl mx-auto">
            Experience the cutting-edge capabilities of LLM-OS with revolutionary AI, quantum computing, 
            holographic interfaces, and advanced biometric security systems.
          </p>
        </motion.div>

        {/* Feature Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            const CategoryIcon = getCategoryIcon(feature.category);
            const isSelected = selectedFeature === feature.id;
            
            return (
              <motion.button
                key={feature.id}
                onClick={() => setSelectedFeature(feature.id)}
                className={`p-6 rounded-xl border transition-all text-left group ${
                  isSelected 
                    ? 'bg-background-elevated border-accent shadow-glow' 
                    : 'bg-background-secondary/50 border-background-border hover:border-accent/50 hover:bg-background-elevated/50'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <CategoryIcon className="w-4 h-4 text-foreground-muted" />
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      feature.status === 'stable' ? 'bg-success/20 text-success' :
                      feature.status === 'beta' ? 'bg-warning/20 text-warning' :
                      'bg-accent/20 text-accent'
                    }`}>
                      {feature.status}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                  {feature.name}
                </h3>
                <p className="text-sm text-foreground-secondary mb-4 line-clamp-2">
                  {feature.description}
                </p>
                
                <div className="flex items-center text-accent text-sm font-medium">
                  Explore
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Feature Display */}
        <motion.div
          className={`bg-background-elevated rounded-xl border border-background-border p-6 ${
            isFullscreen ? 'fixed inset-4 z-50' : ''
          }`}
          layout
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              {selectedFeatureData && (
                <>
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${selectedFeatureData.color}`}>
                    <selectedFeatureData.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      {selectedFeatureData.name}
                    </h2>
                    <p className="text-foreground-secondary">
                      {selectedFeatureData.description}
                    </p>
                  </div>
                </>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              {selectedFeatureData && (
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                  selectedFeatureData.status === 'stable' ? 'bg-success/20 text-success' :
                  selectedFeatureData.status === 'beta' ? 'bg-warning/20 text-warning' :
                  'bg-accent/20 text-accent'
                }`}>
                  {selectedFeatureData.status.toUpperCase()}
                </span>
              )}
              
              <motion.button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 bg-background-secondary rounded-lg hover:bg-background-hover transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isFullscreen ? (
                  <Settings className="w-5 h-5" />
                ) : (
                  <Globe className="w-5 h-5" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Feature Component */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedFeature}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className={isFullscreen ? 'h-[calc(100vh-200px)] overflow-auto' : ''}
            >
              {SelectedComponent && <SelectedComponent />}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Technology Stack Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-gradient-to-r from-background-elevated/50 to-background-secondary/50 rounded-xl border border-background-border p-8"
        >
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Powered by Next-Generation Technology
            </h3>
            <p className="text-foreground-secondary">
              Built with cutting-edge frameworks and advanced algorithms
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mx-auto flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="font-medium text-foreground">Neural Networks</div>
              <div className="text-sm text-foreground-secondary">Advanced AI Processing</div>
            </div>
            
            <div className="space-y-2">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg mx-auto flex items-center justify-center">
                <Atom className="w-6 h-6 text-white" />
              </div>
              <div className="font-medium text-foreground">Quantum Computing</div>
              <div className="text-sm text-foreground-secondary">Superposition Processing</div>
            </div>
            
            <div className="space-y-2">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg mx-auto flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="font-medium text-foreground">Biometric Security</div>
              <div className="text-sm text-foreground-secondary">Multi-layer Authentication</div>
            </div>
            
            <div className="space-y-2">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg mx-auto flex items-center justify-center">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <div className="font-medium text-foreground">Spatial Computing</div>
              <div className="text-sm text-foreground-secondary">3D Holographic UI</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
