'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, 
  Box, 
  Eye, 
  Hand, 
  Scan,
  Maximize2,
  RotateCcw,
  Volume2,
  Gamepad2
} from 'lucide-react';

interface HolographicObject {
  id: string;
  type: 'data_cube' | 'neural_network' | 'file_system' | 'process_cloud';
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: number;
  interactive: boolean;
  data?: any;
}

interface GestureCommand {
  gesture: string;
  confidence: number;
  action: string;
}

export function HolographicInterface() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [objects, setObjects] = useState<HolographicObject[]>([]);
  const [isHolographicMode, setIsHolographicMode] = useState(false);
  const [gestureRecognition, setGestureRecognition] = useState(false);
  const [currentGesture, setCurrentGesture] = useState<GestureCommand | null>(null);
  const [spatialTracking, setSpatialTracking] = useState(false);
  const [viewPerspective, setViewPerspective] = useState({ rotX: 0, rotY: 0, zoom: 1 });

  useEffect(() => {
    initializeHolographicSpace();
    const interval = setInterval(updateHolographicObjects, 100);
    return () => clearInterval(interval);
  }, []);

  const initializeHolographicSpace = () => {
    const newObjects: HolographicObject[] = [
      {
        id: 'data-cube-1',
        type: 'data_cube',
        position: { x: -100, y: 0, z: 50 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: 1,
        interactive: true,
        data: { size: '1.2TB', type: 'Memory Bank' }
      },
      {
        id: 'neural-net-1',
        type: 'neural_network',
        position: { x: 100, y: -50, z: 0 },
        rotation: { x: 45, y: 0, z: 0 },
        scale: 1.2,
        interactive: true,
        data: { layers: 12, neurons: 2048 }
      },
      {
        id: 'file-system-1',
        type: 'file_system',
        position: { x: 0, y: 100, z: -30 },
        rotation: { x: 0, y: 45, z: 0 },
        scale: 0.8,
        interactive: true,
        data: { files: 15847, directories: 234 }
      },
      {
        id: 'process-cloud-1',
        type: 'process_cloud',
        position: { x: -50, y: -100, z: 80 },
        rotation: { x: 0, y: 0, z: 30 },
        scale: 1.5,
        interactive: true,
        data: { processes: 127, cpu: '34%' }
      }
    ];
    setObjects(newObjects);
  };

  const updateHolographicObjects = () => {
    setObjects(prev => prev.map(obj => ({
      ...obj,
      rotation: {
        x: obj.rotation.x + (obj.type === 'neural_network' ? 1 : 0.5),
        y: obj.rotation.y + (obj.type === 'data_cube' ? 1 : 0.3),
        z: obj.rotation.z + 0.2
      },
      position: {
        ...obj.position,
        y: obj.position.y + Math.sin(Date.now() * 0.001 + obj.position.x * 0.01) * 0.5
      }
    })));

    // Simulate gesture recognition
    if (gestureRecognition && Math.random() > 0.7) {
      const gestures = [
        { gesture: 'pinch', confidence: 0.95, action: 'zoom_in' },
        { gesture: 'swipe_left', confidence: 0.88, action: 'rotate_left' },
        { gesture: 'point', confidence: 0.92, action: 'select' },
        { gesture: 'grab', confidence: 0.87, action: 'move_object' }
      ];
      setCurrentGesture(gestures[Math.floor(Math.random() * gestures.length)]);
      setTimeout(() => setCurrentGesture(null), 2000);
    }
  };

  const toggleHolographicMode = () => {
    setIsHolographicMode(!isHolographicMode);
    if (!isHolographicMode) {
      setSpatialTracking(true);
    }
  };
  const getObjectIcon = (type: HolographicObject['type']) => {
    switch (type) {
      case 'data_cube': return Box;
      case 'neural_network': return Layers;
      case 'file_system': return Maximize2;
      case 'process_cloud': return Volume2;
    }
  };

  const getObjectColor = (type: HolographicObject['type']) => {
    switch (type) {
      case 'data_cube': return 'from-blue-500 to-cyan-500';
      case 'neural_network': return 'from-purple-500 to-pink-500';
      case 'file_system': return 'from-green-500 to-emerald-500';
      case 'process_cloud': return 'from-orange-500 to-red-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Holographic Controls */}
      <div className="bg-background-elevated rounded-xl border border-background-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Holographic Interface</h3>
              <p className="text-sm text-foreground-secondary">3D spatial computing environment</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.button
              onClick={() => setGestureRecognition(!gestureRecognition)}
              className={`p-2 rounded-lg transition-all ${
                gestureRecognition 
                  ? 'bg-success text-success-foreground' 
                  : 'bg-background-secondary text-foreground-secondary'
              }`}
              whileHover={{ scale: 1.05 }}
            >
              <Hand className="w-4 h-4" />
            </motion.button>
            
            <motion.button
              onClick={toggleHolographicMode}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isHolographicMode 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-glow' 
                  : 'bg-background-secondary text-foreground-secondary hover:bg-background-hover'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isHolographicMode ? 'Holographic Active' : 'Activate Holographic'}
            </motion.button>
          </div>
        </div>

        {/* 3D Holographic Space */}
        <div 
          ref={containerRef}
          className={`relative h-80 bg-gradient-to-br from-background-secondary/20 via-background/50 to-background-secondary/20 rounded-xl border border-background-border overflow-hidden ${
            isHolographicMode ? 'shadow-[0_0_50px_rgba(0,255,255,0.3)]' : ''
          }`}
          style={{
            perspective: '1000px',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Holographic Grid */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={`h-${i}`}
                  className="absolute w-full h-px bg-cyan-500/30"
                  style={{ top: `${i * 10}%` }}
                />
              ))}
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={`v-${i}`}
                  className="absolute w-px h-full bg-cyan-500/30"
                  style={{ left: `${i * 10}%` }}
                />
              ))}
            </div>
          </div>

          {/* Holographic Objects */}
          <AnimatePresence>
            {isHolographicMode && objects.map((obj) => {
              const Icon = getObjectIcon(obj.type);
              return (
                <motion.div
                  key={obj.id}
                  className={`absolute w-16 h-16 rounded-xl bg-gradient-to-br ${getObjectColor(obj.type)} shadow-glow flex items-center justify-center cursor-pointer`}
                  style={{
                    left: `calc(50% + ${obj.position.x}px)`,
                    top: `calc(50% + ${obj.position.y}px)`,
                    transform: `
                      rotateX(${obj.rotation.x}deg) 
                      rotateY(${obj.rotation.y}deg) 
                      rotateZ(${obj.rotation.z}deg) 
                      scale(${obj.scale})
                      translateZ(${obj.position.z}px)
                    `,
                    transformStyle: 'preserve-3d'
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.9, scale: obj.scale }}
                  exit={{ opacity: 0, scale: 0 }}
                  whileHover={{ scale: obj.scale * 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Icon className="w-6 h-6 text-white" />
                  
                  {/* Object Info Panel */}
                  <motion.div
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-background-elevated/90 backdrop-blur rounded-lg p-2 border border-background-border min-w-24 opacity-0 hover:opacity-100 transition-opacity"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div className="text-xs text-foreground font-medium">{obj.type.replace('_', ' ')}</div>                    {obj.data && (
                      <div className="text-xs text-foreground-secondary mt-1">
                        {Object.entries(obj.data).map(([key, value]) => (
                          <div key={key}>{key}: {String(value)}</div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Gesture Recognition Overlay */}
          {currentGesture && (
            <motion.div
              className="absolute top-4 left-4 bg-background-elevated/90 backdrop-blur rounded-lg p-3 border border-accent/30"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <div className="flex items-center space-x-2">
                <Hand className="w-4 h-4 text-accent" />
                <div>
                  <div className="text-sm font-medium text-foreground">{currentGesture.gesture}</div>
                  <div className="text-xs text-foreground-secondary">
                    {(currentGesture.confidence * 100).toFixed(0)}% confidence
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Spatial Tracking Indicators */}
          {spatialTracking && (
            <div className="absolute top-4 right-4 space-y-2">
              <motion.div
                className="w-3 h-3 bg-success rounded-full"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="w-3 h-3 bg-warning rounded-full"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
              <motion.div
                className="w-3 h-3 bg-error rounded-full"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              />
            </div>
          )}
        </div>

        {/* Interface Controls */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-foreground-muted" />
              <span className="text-sm text-foreground-secondary">Tracking:</span>
              <span className={`text-sm font-medium ${spatialTracking ? 'text-success' : 'text-foreground-muted'}`}>
                {spatialTracking ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Scan className="w-4 h-4 text-foreground-muted" />
              <span className="text-sm text-foreground-secondary">Objects:</span>
              <span className="text-sm font-medium text-accent">{objects.length}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 bg-background-secondary rounded-lg hover:bg-background-hover transition-colors">
              <RotateCcw className="w-4 h-4" />
            </button>
            <button className="p-2 bg-background-secondary rounded-lg hover:bg-background-hover transition-colors">
              <Gamepad2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
