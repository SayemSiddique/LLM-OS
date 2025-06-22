/**
 * Enhanced Settings Component with Phase 3 Security & Privacy Features
 * Production-ready LLM-OS configuration interface
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  Brain, 
  Cpu, 
  Network, 
  FileText, 
  Users, 
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Sparkles,
  Globe,
  Server
} from 'lucide-react';
import { useLLMOSStore } from '@/lib/store';
import { privacyEngine, PrivacySettings } from '../lib/security/privacyEngine';
import { securitySandbox, SandboxProfile } from '../lib/security/securitySandbox';

interface SettingsSection {
  id: string;
  name: string;
  icon: any;
  description: string;
  category: 'ai' | 'security' | 'privacy' | 'system' | 'interface';
}

const SETTINGS_SECTIONS: SettingsSection[] = [
  {
    id: 'ai-intelligence',
    name: 'AI Intelligence',
    icon: Brain,
    description: 'Configure AI models, learning, and autonomous behavior',
    category: 'ai'
  },
  {
    id: 'security-sandbox',
    name: 'Security Sandbox',
    icon: Shield,
    description: 'Manage execution environments and permission controls',
    category: 'security'
  },
  {
    id: 'privacy-protection',
    name: 'Privacy Protection',
    icon: Lock,
    description: 'Data classification, encryption, and local processing',
    category: 'privacy'
  },
  {
    id: 'network-access',
    name: 'Network & API',
    icon: Network,
    description: 'Control external connections and API access',
    category: 'system'
  },
  {
    id: 'interface-experience',
    name: 'Interface & UX',
    icon: Sparkles,
    description: 'Customize the visual experience and interactions',
    category: 'interface'
  }
];

export function EnhancedSettings() {
  const [activeSection, setActiveSection] = useState('ai-intelligence');
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>();
  const [securityProfiles, setSecurityProfiles] = useState<SandboxProfile[]>([]);
  const [securityReport, setSecurityReport] = useState<any>();
  const [privacyReport, setPrivacyReport] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);

  const { autonomyLevel, updateAutonomyLevel } = useLLMOSStore();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      
      // Load privacy settings
      const privacy = privacyEngine.getSettings();
      setPrivacySettings(privacy);
      
      // Load security profiles
      const profiles = securitySandbox.getProfiles();
      setSecurityProfiles(profiles);
      
      // Generate reports
      const secReport = securitySandbox.getSecurityReport();
      setSecurityReport(secReport);
      
      const privReport = privacyEngine.generatePrivacyReport();
      setPrivacyReport(privReport);
      
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePrivacySettings = (updates: Partial<PrivacySettings>) => {
    if (!privacySettings) return;
    
    const newSettings = { ...privacySettings, ...updates };
    setPrivacySettings(newSettings);
    privacyEngine.updateSettings(newSettings);
  };

  const renderAIIntelligenceSettings = () => (
    <div className="space-y-6">
      {/* AI Autonomy Level */}
      <div className="futuristic-card p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold">AI Autonomy Level</h3>
        </div>
        
        <div className="space-y-4">
          {[
            { level: 1, name: 'Suggest Only', desc: 'AI provides suggestions but takes no actions' },
            { level: 2, name: 'Execute with Approval', desc: 'AI can execute approved actions' },
            { level: 3, name: 'Autonomous with Oversight', desc: 'AI operates autonomously with monitoring' },
            { level: 4, name: 'Full Autonomous', desc: 'Complete AI autonomy (use with caution)' }
          ].map((option) => (
            <motion.div
              key={option.level}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                autonomyLevel === option.level
                  ? 'border-primary bg-primary/10'
                  : 'border-background-border hover:border-primary/50'
              }`}
              onClick={() => updateAutonomyLevel(option.level)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{option.name}</h4>
                  <p className="text-sm text-foreground-secondary">{option.desc}</p>
                </div>
                {autonomyLevel === option.level && (
                  <CheckCircle className="w-5 h-5 text-primary" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Learning & Memory */}
      <div className="futuristic-card p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Cpu className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold">Learning & Memory</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span>Adaptive Learning</span>
              <input type="checkbox" defaultChecked className="toggle-checkbox" />
            </label>
            <label className="flex items-center justify-between">
              <span>Pattern Recognition</span>
              <input type="checkbox" defaultChecked className="toggle-checkbox" />
            </label>
            <label className="flex items-center justify-between">
              <span>Contextual Memory</span>
              <input type="checkbox" defaultChecked className="toggle-checkbox" />
            </label>
          </div>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span>User Preference Learning</span>
              <input type="checkbox" defaultChecked className="toggle-checkbox" />
            </label>
            <label className="flex items-center justify-between">
              <span>Workflow Optimization</span>
              <input type="checkbox" defaultChecked className="toggle-checkbox" />
            </label>
            <label className="flex items-center justify-between">
              <span>Cross-Session Memory</span>
              <input type="checkbox" defaultChecked className="toggle-checkbox" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="futuristic-card p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-semibold">Security Overview</h3>
        </div>
        
        {securityReport && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-background-secondary p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-400">{securityReport.securityScore}</div>
              <div className="text-sm text-foreground-secondary">Security Score</div>
            </div>
            <div className="bg-background-secondary p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">{securityReport.totalExecutions}</div>
              <div className="text-sm text-foreground-secondary">Total Executions</div>
            </div>
            <div className="bg-background-secondary p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-400">{securityReport.blockedExecutions}</div>
              <div className="text-sm text-foreground-secondary">Blocked Threats</div>
            </div>
          </div>
        )}
      </div>

      {/* Security Profiles */}
      <div className="futuristic-card p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Users className="w-5 h-5 text-orange-400" />
          <h3 className="text-lg font-semibold">Security Profiles</h3>
        </div>
        
        <div className="space-y-3">
          {securityProfiles.map((profile) => (
            <div key={profile.id} className="p-4 border border-background-border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{profile.name}</h4>
                <span className={`px-2 py-1 text-xs rounded ${
                  profile.id === 'admin' ? 'bg-red-500/20 text-red-400' :
                  profile.id === 'standard' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {profile.permissions.length} permissions
                </span>
              </div>
              <p className="text-sm text-foreground-secondary mb-3">{profile.description}</p>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-foreground-muted">Memory Limit:</span>
                  <span className="ml-2">{profile.resourceLimits.maxMemoryMB}MB</span>
                </div>
                <div>
                  <span className="text-foreground-muted">Execution Time:</span>
                  <span className="ml-2">{profile.resourceLimits.maxExecutionTimeMs / 1000}s</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      {/* Privacy Controls */}
      <div className="futuristic-card p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Lock className="w-5 h-5 text-red-400" />
          <h3 className="text-lg font-semibold">Privacy Controls</h3>
        </div>
        
        {privacySettings && (
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <span className="font-medium">Local Processing Only</span>
                <p className="text-sm text-foreground-secondary">Process all data locally without external services</p>
              </div>
              <input 
                type="checkbox" 
                checked={privacySettings.localProcessingOnly}
                onChange={(e) => updatePrivacySettings({ localProcessingOnly: e.target.checked })}
                className="toggle-checkbox" 
              />
            </label>
            
            <label className="flex items-center justify-between">
              <div>
                <span className="font-medium">Differential Privacy</span>
                <p className="text-sm text-foreground-secondary">Add statistical noise to protect individual data points</p>
              </div>
              <input 
                type="checkbox" 
                checked={privacySettings.differentialPrivacy}
                onChange={(e) => updatePrivacySettings({ differentialPrivacy: e.target.checked })}
                className="toggle-checkbox" 
              />
            </label>
            
            <label className="flex items-center justify-between">
              <div>
                <span className="font-medium">Encrypt Sensitive Data</span>
                <p className="text-sm text-foreground-secondary">Automatically encrypt detected sensitive information</p>
              </div>
              <input 
                type="checkbox" 
                checked={privacySettings.encryptSensitiveData}
                onChange={(e) => updatePrivacySettings({ encryptSensitiveData: e.target.checked })}
                className="toggle-checkbox" 
              />
            </label>
          </div>
        )}
      </div>

      {/* Data Retention */}
      <div className="futuristic-card p-6">
        <div className="flex items-center space-x-3 mb-4">
          <FileText className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-semibold">Data Retention</h3>
        </div>
        
        {privacySettings && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Data Retention Period</label>
              <select 
                value={privacySettings.dataRetentionDays}
                onChange={(e) => updatePrivacySettings({ dataRetentionDays: parseInt(e.target.value) })}
                className="w-full p-2 bg-background-secondary border border-background-border rounded"
              >
                <option value={1}>1 Day</option>
                <option value={7}>1 Week</option>
                <option value={30}>1 Month</option>
                <option value={90}>3 Months</option>
                <option value={365}>1 Year</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Privacy Report */}
      {privacyReport && (
        <div className="futuristic-card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Info className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold">Privacy Report</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total Data Processed:</span>
                <span className="font-mono">{privacyReport.dataProcessed}</span>
              </div>
              <div className="flex justify-between">
                <span>Sensitive Data Detected:</span>
                <span className="font-mono text-yellow-400">{privacyReport.sensitiveDataCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Local Processing:</span>
                <span className="font-mono text-green-400">{privacyReport.localProcessingPercentage}%</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Compliance Status</h4>
              <div className="space-y-1 text-sm">
                {Object.entries(privacyReport.complianceStatus).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex items-center space-x-2">
                    {typeof value === 'boolean' ? (
                      value ? <CheckCircle className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />
                    ) : null}
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderNetworkSettings = () => (
    <div className="space-y-6">
      <div className="futuristic-card p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Network className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold">Network Access</h3>
        </div>
        
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <span>Allow External API Calls</span>
            <input type="checkbox" defaultChecked className="toggle-checkbox" />
          </label>
          <label className="flex items-center justify-between">
            <span>HTTPS Only</span>
            <input type="checkbox" defaultChecked className="toggle-checkbox" />
          </label>
          <label className="flex items-center justify-between">
            <span>Local Network Access</span>
            <input type="checkbox" className="toggle-checkbox" />
          </label>
        </div>
      </div>
    </div>
  );

  const renderInterfaceSettings = () => (
    <div className="space-y-6">
      <div className="futuristic-card p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Sparkles className="w-5 h-5 text-pink-400" />
          <h3 className="text-lg font-semibold">Interface Customization</h3>
        </div>
        
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <span>Holographic Effects</span>
            <input type="checkbox" defaultChecked className="toggle-checkbox" />
          </label>
          <label className="flex items-center justify-between">
            <span>Neural Network Animations</span>
            <input type="checkbox" defaultChecked className="toggle-checkbox" />
          </label>
          <label className="flex items-center justify-between">
            <span>Matrix Rain Effect</span>
            <input type="checkbox" className="toggle-checkbox" />
          </label>
          <label className="flex items-center justify-between">
            <span>Cyber Glitch Effects</span>
            <input type="checkbox" className="toggle-checkbox" />
          </label>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-foreground-secondary">Loading advanced settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex bg-background">
      {/* Sidebar */}
      <div className="w-80 border-r border-background-border p-6 overflow-y-auto">
        <div className="flex items-center space-x-3 mb-8">
          <Settings className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold">Advanced Settings</h1>
        </div>
        
        <nav className="space-y-2">
          {SETTINGS_SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <motion.button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full p-3 rounded-lg text-left transition-all ${
                  activeSection === section.id
                    ? 'bg-primary/10 border border-primary/30 text-primary'
                    : 'hover:bg-background-hover border border-transparent'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5" />
                  <div>
                    <div className="font-medium">{section.name}</div>
                    <div className="text-xs text-foreground-secondary">
                      {section.description}
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeSection === 'ai-intelligence' && renderAIIntelligenceSettings()}
            {activeSection === 'security-sandbox' && renderSecuritySettings()}
            {activeSection === 'privacy-protection' && renderPrivacySettings()}
            {activeSection === 'network-access' && renderNetworkSettings()}
            {activeSection === 'interface-experience' && renderInterfaceSettings()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
