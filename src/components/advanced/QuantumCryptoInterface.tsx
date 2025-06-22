'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Atom, 
  Shield, 
  Lock, 
  Unlock, 
  Zap, 
  Binary,
  Cpu,
  Activity,
  Waves
} from 'lucide-react';

interface QuantumState {
  qubit: number;
  state: 'superposition' | 'entangled' | 'collapsed';
  amplitude: number;
  phase: number;
}

interface CryptoProtocol {
  name: string;
  strength: number;
  status: 'active' | 'pending' | 'compromised';
  algorithm: string;
}

export function QuantumCryptoInterface() {
  const [quantumStates, setQuantumStates] = useState<QuantumState[]>([]);
  const [cryptoProtocols, setCryptoProtocols] = useState<CryptoProtocol[]>([]);
  const [isQuantumActive, setIsQuantumActive] = useState(false);
  const [encryptionStrength, setEncryptionStrength] = useState(2048);
  const [quantumAdvantage, setQuantumAdvantage] = useState(false);

  useEffect(() => {
    initializeQuantumSystem();
    const interval = setInterval(updateQuantumStates, 200);
    return () => clearInterval(interval);
  }, []);

  const initializeQuantumSystem = () => {
    // Initialize quantum qubits
    const qubits: QuantumState[] = Array.from({ length: 16 }, (_, i) => ({
      qubit: i,
      state: 'superposition',
      amplitude: Math.random(),
      phase: Math.random() * 2 * Math.PI
    }));
    setQuantumStates(qubits);

    // Initialize crypto protocols
    const protocols: CryptoProtocol[] = [
      { name: 'AES-256-GCM', strength: 256, status: 'active', algorithm: 'Symmetric' },
      { name: 'RSA-4096', strength: 4096, status: 'active', algorithm: 'Asymmetric' },
      { name: 'Lattice-Crypto', strength: 8192, status: 'active', algorithm: 'Post-Quantum' },
      { name: 'Quantum-Key-Dist', strength: 65536, status: 'pending', algorithm: 'Quantum' }
    ];
    setCryptoProtocols(protocols);
  };

  const updateQuantumStates = () => {
    setQuantumStates(prev => prev.map(q => ({
      ...q,
      state: Math.random() > 0.7 ? 'entangled' : Math.random() > 0.5 ? 'superposition' : 'collapsed',
      amplitude: Math.max(0, Math.min(1, q.amplitude + (Math.random() - 0.5) * 0.2)),
      phase: (q.phase + Math.random() * 0.5) % (2 * Math.PI)
    })));

    setQuantumAdvantage(Math.random() > 0.8);
    setEncryptionStrength(prev => Math.max(2048, prev + Math.floor((Math.random() - 0.5) * 1024)));
  };

  const activateQuantumMode = () => {
    setIsQuantumActive(!isQuantumActive);
    if (!isQuantumActive) {
      setCryptoProtocols(prev => prev.map(p => 
        p.name === 'Quantum-Key-Dist' ? { ...p, status: 'active' } : p
      ));
    }
  };

  const getStateColor = (state: QuantumState['state']) => {
    switch (state) {
      case 'superposition': return 'text-blue-400';
      case 'entangled': return 'text-purple-400';
      case 'collapsed': return 'text-green-400';
    }
  };

  const getProtocolColor = (status: CryptoProtocol['status']) => {
    switch (status) {
      case 'active': return 'text-success';
      case 'pending': return 'text-warning';
      case 'compromised': return 'text-error';
    }
  };

  return (
    <div className="space-y-6">
      {/* Quantum Computing Control Panel */}
      <div className="bg-background-elevated rounded-xl border border-background-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
              <Atom className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Quantum Processing Unit</h3>
              <p className="text-sm text-foreground-secondary">16-qubit quantum computer interface</p>
            </div>
          </div>
          
          <motion.button
            onClick={activateQuantumMode}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              isQuantumActive 
                ? 'bg-purple-500 text-white shadow-glow' 
                : 'bg-background-secondary text-foreground-secondary hover:bg-background-hover'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isQuantumActive ? 'Quantum Active' : 'Activate Quantum'}
          </motion.button>
        </div>

        {/* Quantum State Visualization */}
        <div className="grid grid-cols-8 gap-2 mb-6">
          {quantumStates.map((qubit, i) => (
            <motion.div
              key={i}
              className="aspect-square bg-background-secondary rounded-lg p-2 flex flex-col items-center justify-center border border-background-border relative overflow-hidden"
              animate={{
                borderColor: qubit.state === 'entangled' ? '#8b5cf6' : qubit.state === 'superposition' ? '#3b82f6' : '#10b981',
                scale: isQuantumActive ? 1.05 : 1
              }}
            >
              <div className={`text-xs font-bold ${getStateColor(qubit.state)}`}>
                Q{i}
              </div>
              <div className="text-xs text-foreground-muted mt-1">
                {(qubit.amplitude * 100).toFixed(0)}%
              </div>
              
              {/* Quantum wave animation */}
              <motion.div
                className="absolute inset-0 opacity-20"
                animate={{
                  background: `conic-gradient(from ${qubit.phase}rad, transparent, ${getStateColor(qubit.state).replace('text-', '')}, transparent)`
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          ))}
        </div>

        {/* Quantum Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-background-secondary/50 rounded-lg p-3 text-center">
            <Waves className="w-5 h-5 mx-auto mb-2 text-blue-400" />
            <div className="text-xs text-foreground-muted mb-1">Coherence</div>
            <div className="text-lg font-bold text-blue-400">94.7%</div>
          </div>
          <div className="bg-background-secondary/50 rounded-lg p-3 text-center">
            <Activity className="w-5 h-5 mx-auto mb-2 text-purple-400" />
            <div className="text-xs text-foreground-muted mb-1">Entanglement</div>
            <div className="text-lg font-bold text-purple-400">
              {quantumStates.filter(q => q.state === 'entangled').length}/16
            </div>
          </div>
          <div className="bg-background-secondary/50 rounded-lg p-3 text-center">
            <Zap className="w-5 h-5 mx-auto mb-2 text-accent" />
            <div className="text-xs text-foreground-muted mb-1">Q-Advantage</div>
            <div className={`text-lg font-bold ${quantumAdvantage ? 'text-success' : 'text-foreground-muted'}`}>
              {quantumAdvantage ? 'ACTIVE' : 'IDLE'}
            </div>
          </div>
        </div>
      </div>

      {/* Cryptography & Security Protocols */}
      <div className="bg-background-elevated rounded-xl border border-background-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Advanced Cryptography</h3>
              <p className="text-sm text-foreground-secondary">Post-quantum encryption protocols</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-foreground-muted">Encryption Strength</div>
            <div className="text-xl font-bold text-success">{encryptionStrength}-bit</div>
          </div>
        </div>

        {/* Crypto Protocols */}
        <div className="space-y-3">
          {cryptoProtocols.map((protocol, i) => (
            <motion.div
              key={protocol.name}
              className="flex items-center justify-between p-3 bg-background-secondary/30 rounded-lg border border-background-border"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-center space-x-3">
                {protocol.status === 'active' ? (
                  <Lock className={`w-4 h-4 ${getProtocolColor(protocol.status)}`} />
                ) : (
                  <Unlock className={`w-4 h-4 ${getProtocolColor(protocol.status)}`} />
                )}
                <div>
                  <div className="font-medium text-foreground">{protocol.name}</div>
                  <div className="text-sm text-foreground-secondary">{protocol.algorithm}</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-sm font-medium ${getProtocolColor(protocol.status)}`}>
                  {protocol.status.toUpperCase()}
                </div>
                <div className="text-xs text-foreground-muted">{protocol.strength}-bit</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Security Status */}
        <div className="mt-6 p-4 bg-gradient-to-r from-success/10 to-accent/10 rounded-lg border border-success/30">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-success/20 rounded-full">
              <Shield className="w-4 h-4 text-success" />
            </div>
            <div>
              <div className="font-medium text-success">Maximum Security Enabled</div>
              <div className="text-sm text-foreground-secondary">
                All communications encrypted with post-quantum algorithms
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
