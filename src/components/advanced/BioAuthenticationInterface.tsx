'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Fingerprint, 
  Eye, 
  Heart, 
  Brain, 
  Scan,
  ShieldCheck,
  AlertCircle,
  CheckCircle,
  Activity,
  Waves,
  Mic,
  User
} from 'lucide-react';

interface BiometricData {
  type: 'fingerprint' | 'iris' | 'voice' | 'heartrate' | 'brainwave';
  confidence: number;
  status: 'scanning' | 'verified' | 'failed';
  data?: any;
}

interface EmotionalState {
  emotion: string;
  intensity: number;
  confidence: number;
  timestamp: Date;
}

interface SecurityLevel {
  level: number;
  name: string;
  requirements: string[];
  active: boolean;
}

export function BioAuthenticationInterface() {
  const [biometrics, setBiometrics] = useState<BiometricData[]>([]);
  const [emotionalState, setEmotionalState] = useState<EmotionalState | null>(null);
  const [securityLevels, setSecurityLevels] = useState<SecurityLevel[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [authenticationStatus, setAuthenticationStatus] = useState<'idle' | 'authenticating' | 'authenticated' | 'failed'>('idle');
  const [adaptiveMode, setAdaptiveMode] = useState(false);

  useEffect(() => {
    initializeBiometricSystems();
    const interval = setInterval(updateBiometricData, 500);
    return () => clearInterval(interval);
  }, []);

  const initializeBiometricSystems = () => {
    const initialBiometrics: BiometricData[] = [
      { type: 'fingerprint', confidence: 0, status: 'scanning' },
      { type: 'iris', confidence: 0, status: 'scanning' },
      { type: 'voice', confidence: 0, status: 'scanning' },
      { type: 'heartrate', confidence: 0, status: 'scanning', data: { bpm: 72 } },
      { type: 'brainwave', confidence: 0, status: 'scanning', data: { alpha: 8.5, beta: 15.2 } }
    ];
    setBiometrics(initialBiometrics);

    const levels: SecurityLevel[] = [
      {
        level: 1,
        name: 'Basic',
        requirements: ['Password'],
        active: true
      },
      {
        level: 2,
        name: 'Enhanced',
        requirements: ['Password', 'Fingerprint'],
        active: false
      },
      {
        level: 3,
        name: 'Biometric',
        requirements: ['Fingerprint', 'Iris Scan'],
        active: false
      },
      {
        level: 4,
        name: 'Neural',
        requirements: ['All Biometrics', 'Brainwave Pattern'],
        active: false
      },
      {
        level: 5,
        name: 'Quantum',
        requirements: ['Neural Auth', 'Quantum Entanglement'],
        active: false
      }
    ];
    setSecurityLevels(levels);
  };

  const updateBiometricData = () => {
    setBiometrics(prev => prev.map(bio => ({
      ...bio,
      confidence: Math.min(100, Math.max(0, bio.confidence + (Math.random() - 0.3) * 20)),
      status: bio.confidence > 85 ? 'verified' : bio.confidence < 30 ? 'failed' : 'scanning',
      data: bio.type === 'heartrate' ? 
        { bpm: Math.floor(Math.random() * 20) + 65 } :
        bio.type === 'brainwave' ?
        { alpha: Math.random() * 5 + 6, beta: Math.random() * 10 + 10 } :
        bio.data
    })));

    // Update emotional state
    if (Math.random() > 0.7) {
      const emotions = ['calm', 'focused', 'excited', 'stressed', 'creative', 'analytical'];
      setEmotionalState({
        emotion: emotions[Math.floor(Math.random() * emotions.length)],
        intensity: Math.random() * 100,
        confidence: Math.random() * 40 + 60,
        timestamp: new Date()
      });
    }
  };

  const startAuthentication = () => {
    setIsScanning(true);
    setAuthenticationStatus('authenticating');
    
    setTimeout(() => {
      const allVerified = biometrics.every(bio => bio.confidence > 80);
      setAuthenticationStatus(allVerified ? 'authenticated' : 'failed');
      setIsScanning(false);
      
      if (allVerified) {
        setSecurityLevels(prev => prev.map(level => ({
          ...level,
          active: level.level <= 4
        })));
      }
    }, 3000);
  };

  const getBiometricIcon = (type: BiometricData['type']) => {
    switch (type) {
      case 'fingerprint': return Fingerprint;
      case 'iris': return Eye;
      case 'voice': return Mic;
      case 'heartrate': return Heart;
      case 'brainwave': return Brain;
    }
  };

  const getBiometricColor = (status: BiometricData['status']) => {
    switch (status) {
      case 'scanning': return 'text-warning';
      case 'verified': return 'text-success';
      case 'failed': return 'text-error';
    }
  };

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      calm: 'text-blue-400',
      focused: 'text-purple-400',
      excited: 'text-orange-400',
      stressed: 'text-red-400',
      creative: 'text-pink-400',
      analytical: 'text-green-400'
    };
    return colors[emotion] || 'text-foreground-muted';
  };

  return (
    <div className="space-y-6">
      {/* Biometric Authentication Panel */}
      <div className="bg-background-elevated rounded-xl border border-background-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Bio-Authentication</h3>
              <p className="text-sm text-foreground-secondary">Advanced biometric security system</p>
            </div>
          </div>
          
          <motion.button
            onClick={startAuthentication}
            disabled={isScanning}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              authenticationStatus === 'authenticated'
                ? 'bg-success text-success-foreground'
                : authenticationStatus === 'failed'
                ? 'bg-error text-error-foreground'
                : 'bg-primary text-primary-foreground hover:bg-primary-hover'
            } disabled:opacity-50`}
            whileHover={{ scale: isScanning ? 1 : 1.05 }}
            whileTap={{ scale: isScanning ? 1 : 0.95 }}
          >
            {isScanning ? 'Scanning...' : 
             authenticationStatus === 'authenticated' ? 'Authenticated' :
             authenticationStatus === 'failed' ? 'Try Again' : 'Authenticate'}
          </motion.button>
        </div>

        {/* Biometric Scanners */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {biometrics.map((bio, i) => {
            const Icon = getBiometricIcon(bio.type);
            return (
              <motion.div
                key={bio.type}
                className="bg-background-secondary/50 rounded-lg p-4 text-center border border-background-border"
                animate={{
                  borderColor: bio.status === 'verified' ? '#10b981' : bio.status === 'failed' ? '#ef4444' : '#f59e0b',
                  scale: isScanning && bio.status === 'scanning' ? [1, 1.05, 1] : 1
                }}
                transition={{ duration: 0.5, repeat: isScanning && bio.status === 'scanning' ? Infinity : 0 }}
              >
                <Icon className={`w-6 h-6 mx-auto mb-2 ${getBiometricColor(bio.status)}`} />
                <div className="text-xs font-medium text-foreground capitalize mb-1">
                  {bio.type.replace('_', ' ')}
                </div>
                <div className={`text-sm font-bold ${getBiometricColor(bio.status)}`}>
                  {bio.confidence.toFixed(0)}%
                </div>
                {bio.data && (
                  <div className="text-xs text-foreground-muted mt-1">
                    {bio.type === 'heartrate' && `${bio.data.bpm} BPM`}
                    {bio.type === 'brainwave' && `α:${bio.data.alpha.toFixed(1)} β:${bio.data.beta.toFixed(1)}`}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Authentication Status */}
        <div className="flex items-center justify-center p-4 bg-background-secondary/30 rounded-lg">
          <AnimatePresence mode="wait">
            {authenticationStatus === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center space-x-2 text-foreground-muted"
              >
                <Scan className="w-5 h-5" />
                <span>Ready for authentication</span>
              </motion.div>
            )}
            
            {authenticationStatus === 'authenticating' && (
              <motion.div
                key="auth"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center space-x-2 text-warning"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Activity className="w-5 h-5" />
                </motion.div>
                <span>Scanning biometric signatures...</span>
              </motion.div>
            )}
            
            {authenticationStatus === 'authenticated' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center space-x-2 text-success"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Authentication successful - Welcome back!</span>
              </motion.div>
            )}
            
            {authenticationStatus === 'failed' && (
              <motion.div
                key="failed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center space-x-2 text-error"
              >
                <AlertCircle className="w-5 h-5" />
                <span>Authentication failed - Please try again</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Emotional Intelligence Panel */}
      <div className="bg-background-elevated rounded-xl border border-background-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Emotional Intelligence</h3>
              <p className="text-sm text-foreground-secondary">Real-time emotion and wellness monitoring</p>
            </div>
          </div>
          
          <motion.button
            onClick={() => setAdaptiveMode(!adaptiveMode)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              adaptiveMode 
                ? 'bg-accent text-accent-foreground' 
                : 'bg-background-secondary text-foreground-secondary'
            }`}
            whileHover={{ scale: 1.05 }}
          >
            Adaptive Mode
          </motion.button>
        </div>

        {emotionalState && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Emotion */}
            <div className="bg-background-secondary/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-foreground">Current State</h4>
                <Waves className="w-4 h-4 text-foreground-muted" />
              </div>
              
              <div className="text-center">
                <div className={`text-2xl font-bold capitalize ${getEmotionColor(emotionalState.emotion)}`}>
                  {emotionalState.emotion}
                </div>
                <div className="text-sm text-foreground-secondary mt-1">
                  Intensity: {emotionalState.intensity.toFixed(0)}%
                </div>
                <div className="text-xs text-foreground-muted">
                  Confidence: {emotionalState.confidence.toFixed(0)}%
                </div>
              </div>

              {/* Emotion Visualization */}
              <div className="mt-4 h-2 bg-background-secondary rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${emotionalState.emotion === 'calm' ? 'bg-blue-400' :
                    emotionalState.emotion === 'focused' ? 'bg-purple-400' :
                    emotionalState.emotion === 'excited' ? 'bg-orange-400' :
                    emotionalState.emotion === 'stressed' ? 'bg-red-400' :
                    emotionalState.emotion === 'creative' ? 'bg-pink-400' :
                    'bg-green-400'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${emotionalState.intensity}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Wellness Recommendations */}
            <div className="bg-background-secondary/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-foreground">AI Recommendations</h4>
                <Brain className="w-4 h-4 text-foreground-muted" />
              </div>
              
              <div className="space-y-2">
                {emotionalState.emotion === 'stressed' && (
                  <div className="text-sm text-foreground-secondary">
                    • Take a 5-minute breathing break
                    • Lower screen brightness
                    • Play calming background music
                  </div>
                )}
                {emotionalState.emotion === 'focused' && (
                  <div className="text-sm text-foreground-secondary">
                    • Optimize workspace lighting
                    • Block distracting notifications
                    • Enhance productivity mode
                  </div>
                )}
                {emotionalState.emotion === 'creative' && (
                  <div className="text-sm text-foreground-secondary">
                    • Enable creative tools palette
                    • Suggest brainstorming sessions
                    • Open inspiration galleries
                  </div>
                )}
                {emotionalState.emotion === 'calm' && (
                  <div className="text-sm text-foreground-secondary">
                    • Perfect state for learning
                    • Consider complex tasks
                    • Maintain current environment
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Security Levels */}
      <div className="bg-background-elevated rounded-xl border border-background-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Security Clearance Levels</h3>
            <p className="text-sm text-foreground-secondary">Progressive authentication requirements</p>
          </div>
        </div>

        <div className="space-y-3">
          {securityLevels.map((level) => (
            <motion.div
              key={level.level}
              className={`p-4 rounded-lg border transition-all ${
                level.active 
                  ? 'bg-success/10 border-success/30' 
                  : 'bg-background-secondary/30 border-background-border'
              }`}
              animate={{
                borderColor: level.active ? '#10b981' : undefined
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    level.active ? 'bg-success text-success-foreground' : 'bg-background-secondary text-foreground-muted'
                  }`}>
                    {level.level}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{level.name}</div>
                    <div className="text-sm text-foreground-secondary">
                      {level.requirements.join(', ')}
                    </div>
                  </div>
                </div>
                
                {level.active && (
                  <CheckCircle className="w-5 h-5 text-success" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
