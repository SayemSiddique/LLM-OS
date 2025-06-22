'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, 
  HardDrive, 
  Network, 
  Brain, 
  Shield, 
  Lock, 
  Gauge,
  Activity,
  Database,
  Eye,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import { useLLMOSStore } from '../../lib/store';

interface SystemMetric {
  name: string;
  value: string;
  status: 'healthy' | 'warning' | 'critical';
  icon: React.ComponentType<any>;
  description: string;
  trend?: 'up' | 'down' | 'stable';
}

interface SystemModule {
  name: string;
  status: 'active' | 'inactive' | 'error';
  version: string;
  description: string;
  icon: React.ComponentType<any>;
  metrics: SystemMetric[];
}

export function SystemDashboard() {
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [modules, setModules] = useState<SystemModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { systemHealth, user } = useLLMOSStore();

  useEffect(() => {
    loadSystemData();
    const interval = setInterval(loadSystemData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadSystemData = async () => {
    try {
      const coreMetrics: SystemMetric[] = [
        {
          name: 'CPU Usage',
          value: '23%',
          status: 'healthy',
          icon: Cpu,
          description: 'System processing load',
          trend: 'stable'
        },
        {
          name: 'Memory',
          value: `${Math.round(Math.random() * 40 + 30)}%`,
          status: 'healthy',
          icon: HardDrive,
          description: 'Memory utilization',
          trend: 'up'
        },
        {
          name: 'Network',
          value: 'Connected',
          status: 'healthy',
          icon: Network,
          description: 'Network connectivity',
          trend: 'stable'
        },
        {
          name: 'AI Models',
          value: '4 Active',
          status: 'healthy',
          icon: Brain,
          description: 'LLM model availability',
          trend: 'stable'
        },
        {
          name: 'Security',
          value: 'Protected',
          status: 'healthy',
          icon: Shield,
          description: 'Security status',
          trend: 'stable'
        },
        {
          name: 'Privacy',
          value: 'Compliant',
          status: 'healthy',
          icon: Lock,
          description: 'Privacy protection level',
          trend: 'stable'
        }
      ];

      const systemModules: SystemModule[] = [
        {
          name: 'Memory Manager',
          status: 'active',
          version: '1.0.0',
          description: 'MemGPT-style memory management',
          icon: Database,
          metrics: [
            {
              name: 'Active Memories',
              value: '156',
              status: 'healthy',
              icon: Activity,
              description: 'Number of active memory entries'
            },
            {
              name: 'Memory Efficiency',
              value: '94%',
              status: 'healthy',
              icon: Gauge,
              description: 'Memory management efficiency'
            }
          ]
        },
        {
          name: 'Intelligence Engine',
          status: 'active',
          version: '1.0.0',
          description: 'Contextual understanding and learning',
          icon: Brain,
          metrics: [
            {
              name: 'Context Accuracy',
              value: '97%',
              status: 'healthy',
              icon: Eye,
              description: 'Contextual understanding accuracy'
            },
            {
              name: 'Learning Rate',
              value: '89%',
              status: 'healthy',
              icon: Sparkles,
              description: 'Adaptive learning efficiency'
            }
          ]
        }
      ];

      setMetrics(coreMetrics);
      setModules(systemModules);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load system data:', error);
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'rgb(var(--success))';
      case 'warning': return 'rgb(var(--warning))';
      case 'critical': return 'rgb(var(--error))';
      case 'active': return 'rgb(var(--success))';
      case 'inactive': return 'rgb(var(--foreground-muted))';
      case 'error': return 'rgb(var(--error))';
      default: return 'rgb(var(--foreground-muted))';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'active':
        return CheckCircle;
      case 'warning':
        return AlertTriangle;
      case 'critical':
      case 'error':
        return XCircle;
      default:
        return Activity;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="loading-spinner"></div>
        <span className="ml-2 text-sm text-foreground-muted">Loading system data...</span>
      </div>
    );
  }

  return (
    <div className="h-full p-6 overflow-y-auto custom-scrollbar">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gradient-cyber mb-2">
            System Dashboard
          </h1>
          <p className="text-foreground-secondary">
            Monitor system health, performance, and AI capabilities
          </p>
        </motion.div>

        {/* Core Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8"
        >
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            const StatusIcon = getStatusIcon(metric.status);
            
            return (
              <motion.div
                key={metric.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="glass p-4 rounded-xl border border-background-border hover:glass-hover transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <Icon 
                    className="w-5 h-5" 
                    style={{ color: getStatusColor(metric.status) }}
                  />
                  <StatusIcon 
                    className="w-4 h-4" 
                    style={{ color: getStatusColor(metric.status) }}
                  />
                </div>
                <div className="text-2xl font-bold mb-1">{metric.value}</div>
                <div className="text-sm text-foreground-muted">{metric.name}</div>
                {metric.trend && (
                  <div className="flex items-center mt-2 text-xs">
                    <span className={`px-2 py-1 rounded-full ${
                      metric.trend === 'up' ? 'bg-success/20 text-success' :
                      metric.trend === 'down' ? 'bg-error/20 text-error' :
                      'bg-foreground-muted/20 text-foreground-muted'
                    }`}>
                      {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'} {metric.trend}
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* System Modules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-semibold text-foreground mb-4">
            System Modules
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {modules.map((module, index) => {
              const Icon = module.icon;
              const StatusIcon = getStatusIcon(module.status);
              
              return (
                <motion.div
                  key={module.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="glass p-6 rounded-xl border border-background-border hover:glass-hover transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${getStatusColor(module.status)}20` }}
                      >
                        <Icon 
                          className="w-6 h-6" 
                          style={{ color: getStatusColor(module.status) }}
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{module.name}</h3>
                        <p className="text-sm text-foreground-muted">{module.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-foreground-muted">v{module.version}</span>
                      <StatusIcon 
                        className="w-5 h-5" 
                        style={{ color: getStatusColor(module.status) }}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {module.metrics.map((metric) => {
                      const MetricIcon = metric.icon;
                      
                      return (
                        <div 
                          key={metric.name}
                          className="bg-background-card/50 p-3 rounded-lg border border-background-border/50"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <MetricIcon 
                              className="w-4 h-4" 
                              style={{ color: getStatusColor(metric.status) }}
                            />
                            <span className="text-lg font-semibold">{metric.value}</span>
                          </div>
                          <div className="text-sm text-foreground-muted">{metric.name}</div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* System Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass p-6 rounded-xl border border-background-border"
        >
          <h3 className="text-lg font-semibold mb-4">System Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-foreground-muted mb-1">LLM-OS Version</div>
              <div className="font-medium">v0.1.0-beta</div>
            </div>
            <div>
              <div className="text-foreground-muted mb-1">Uptime</div>
              <div className="font-medium">{systemHealth.uptime || 0}ms</div>
            </div>
            <div>
              <div className="text-foreground-muted mb-1">Active Connections</div>
              <div className="font-medium">{systemHealth.activeConnections || 0}</div>
            </div>
            <div>
              <div className="text-foreground-muted mb-1">User</div>
              <div className="font-medium">{user?.email || 'Guest'}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
