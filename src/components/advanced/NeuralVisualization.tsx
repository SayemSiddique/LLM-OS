'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Activity, Cpu, Network } from 'lucide-react';

interface NeuralNode {
  id: string;
  x: number;
  y: number;
  z: number;
  activation: number;
  type: 'input' | 'hidden' | 'output' | 'memory' | 'attention';
  connections: string[];
  thinking: boolean;
}

interface ThoughtStream {
  id: string;
  content: string;
  intensity: number;
  timestamp: Date;
  pathway: string[];
}

export function NeuralVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<NeuralNode[]>([]);
  const [thoughtStreams, setThoughtStreams] = useState<ThoughtStream[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [cognitiveLoad, setCognitiveLoad] = useState(0);

  useEffect(() => {
    initializeNeuralNetwork();
    const interval = setInterval(simulateThinking, 100);
    return () => clearInterval(interval);
  }, []);

  const initializeNeuralNetwork = () => {
    const newNodes: NeuralNode[] = [];
    
    // Create a 3D neural network structure
    for (let layer = 0; layer < 6; layer++) {
      const nodesInLayer = layer === 0 || layer === 5 ? 8 : 16;
      for (let i = 0; i < nodesInLayer; i++) {
        newNodes.push({
          id: `${layer}-${i}`,
          x: (i / nodesInLayer) * 400 + 50,
          y: layer * 80 + 50,
          z: Math.sin(i * 0.5) * 20,
          activation: Math.random(),
          type: layer === 0 ? 'input' : layer === 5 ? 'output' : 'hidden',
          connections: [],
          thinking: false
        });
      }
    }
    
    setNodes(newNodes);
  };

  const simulateThinking = () => {
    setNodes(prev => prev.map(node => ({
      ...node,
      activation: Math.max(0, Math.min(1, node.activation + (Math.random() - 0.5) * 0.3)),
      thinking: Math.random() > 0.7
    })));
    
    setCognitiveLoad(Math.random() * 100);
    
    if (Math.random() > 0.8) {
      const newThought: ThoughtStream = {
        id: `thought-${Date.now()}`,
        content: generateThoughtContent(),
        intensity: Math.random(),
        timestamp: new Date(),
        pathway: []
      };
      setThoughtStreams(prev => [...prev.slice(-4), newThought]);
    }
  };

  const generateThoughtContent = () => {
    const thoughts = [
      "Analyzing user intent...",
      "Processing contextual patterns...",
      "Optimizing neural pathways...",
      "Learning from interaction...",
      "Accessing memory banks...",
      "Generating creative solutions...",
      "Cross-referencing knowledge...",
      "Adapting behavior patterns..."
    ];
    return thoughts[Math.floor(Math.random() * thoughts.length)];
  };

  return (
    <div className="bg-background-elevated rounded-xl border border-background-border p-6 h-96 overflow-hidden relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-primary rounded-lg">
            <Brain className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Neural Activity</h3>
            <p className="text-sm text-foreground-secondary">Real-time AI cognition visualization</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-foreground-muted">Cognitive Load</div>
            <div className="text-xl font-bold text-accent">{cognitiveLoad.toFixed(1)}%</div>
          </div>
          <motion.div
            animate={{ rotate: isThinking ? 360 : 0 }}
            transition={{ duration: 2, repeat: isThinking ? Infinity : 0 }}
            className="p-2 bg-accent/20 rounded-full"
          >
            <Zap className="w-4 h-4 text-accent" />
          </motion.div>
        </div>
      </div>

      {/* Neural Network Canvas */}
      <div className="relative h-48 bg-background-secondary/30 rounded-lg overflow-hidden mb-4">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          width={500}
          height={200}
        />
        
        {/* Animated Neural Nodes */}
        <div className="absolute inset-0">
          {nodes.slice(0, 20).map((node, i) => (
            <motion.div
              key={node.id}
              className={`absolute w-3 h-3 rounded-full ${
                node.thinking ? 'bg-accent shadow-glow' : 'bg-primary/60'
              }`}
              style={{
                left: `${(node.x / 500) * 100}%`,
                top: `${(node.y / 400) * 100}%`,
              }}
              animate={{
                scale: node.thinking ? [1, 1.5, 1] : 1,
                opacity: node.activation
              }}
              transition={{ duration: 0.5 }}
            />
          ))}
        </div>

        {/* Thought Streams */}
        <div className="absolute top-2 left-2 right-2">
          {thoughtStreams.slice(-2).map((thought, i) => (
            <motion.div
              key={thought.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-background-elevated/90 backdrop-blur rounded-lg p-2 mb-1 border border-accent/30"
            >
              <div className="text-xs text-accent font-medium">{thought.content}</div>
              <div className="text-xs text-foreground-muted">
                {thought.timestamp.toLocaleTimeString()}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-4 gap-4 text-center">
        <div className="bg-background-secondary/50 rounded-lg p-2">
          <Activity className="w-4 h-4 mx-auto mb-1 text-success" />
          <div className="text-xs text-foreground-muted">Neurons</div>
          <div className="text-sm font-bold text-success">{nodes.length}</div>
        </div>
        <div className="bg-background-secondary/50 rounded-lg p-2">
          <Network className="w-4 h-4 mx-auto mb-1 text-warning" />
          <div className="text-xs text-foreground-muted">Active</div>
          <div className="text-sm font-bold text-warning">{nodes.filter(n => n.thinking).length}</div>
        </div>
        <div className="bg-background-secondary/50 rounded-lg p-2">
          <Cpu className="w-4 h-4 mx-auto mb-1 text-accent" />
          <div className="text-xs text-foreground-muted">Pathways</div>
          <div className="text-sm font-bold text-accent">247</div>
        </div>
        <div className="bg-background-secondary/50 rounded-lg p-2">
          <Brain className="w-4 h-4 mx-auto mb-1 text-primary" />
          <div className="text-xs text-foreground-muted">IQ Score</div>
          <div className="text-sm font-bold text-primary">∞</div>
        </div>
      </div>
    </div>
  );
}
