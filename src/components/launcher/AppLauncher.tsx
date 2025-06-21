'use client';

import { useState, useEffect } from 'react';
import { Play, Code, FileText, Zap, Search, Settings, Loader } from 'lucide-react';
import { useLLMOSStore } from '../../lib/store';
import { LLMApp, SessionStatus } from '../../types';

const getIcon = (iconName: string) => {
  const icons: { [key: string]: any } = {
    FileText,
    Code,
    Search,
    Zap,
    Settings,
  };
  return icons[iconName] || FileText;
};

export function AppLauncher() {
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [availableApps, setAvailableApps] = useState<LLMApp[]>([]);
  const { installedApps, runningApps } = useLLMOSStore();

  // Load available apps from JSON files
  useEffect(() => {
    const loadApps = async () => {
      try {
        setIsLoading(true);
        
        // In a real implementation, this would be an API call
        // For now, we'll simulate loading the app JSON files
        const appIds = ['writer-ai', 'code-agent', 'research-assistant'];
        const apps: LLMApp[] = [];
        
        for (const appId of appIds) {
          try {
            const response = await fetch(`/apps/${appId}.json`);
            if (response.ok) {
              const appData = await response.json();
              apps.push({
                ...appData,
                isInstalled: installedApps.some(app => app.id === appId),
                isRunning: runningApps.includes(appId),
                createdAt: new Date(appData.createdAt || Date.now()),
                updatedAt: new Date(appData.updatedAt || Date.now()),
                metadata: {
                  category: appData.category || 'productivity',
                  tags: appData.tags || [],
                  featured: appData.featured || false,
                  downloadCount: appData.downloadCount || 0,
                  rating: appData.rating || 0,
                  compatibility: appData.compatibility || []
                }
              });
            }
          } catch (error) {
            console.warn(`Failed to load app ${appId}:`, error);
          }
        }
        
        setAvailableApps(apps);
      } catch (error) {
        console.error('Failed to load apps:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadApps();
  }, [installedApps, runningApps]);

  const filteredApps = availableApps.filter(app => 
    filter === 'all' || app.metadata?.category === filter
  );

  const categories = ['all', 'productivity', 'development', 'research', 'automation'];
  const handleLaunchApp = async (appId: string) => {
    try {
      console.log(`Launching app: ${appId}`);
      
      const app = availableApps.find(a => a.id === appId);
      if (!app) {
        console.error('App not found:', appId);
        return;
      }      // Create a specialized prompt session for this app
      const appSession = {
        id: Date.now().toString(),
        userId: 'user-1', // TODO: Get from auth system
        appId: appId,
        messages: [{
          id: '1',
          role: 'system' as const,
          content: `🚀 ${app.name} Initialized
${app.description}

${app.promptTemplate}

Available tools: ${app.tools.join(', ')}
Ready to assist you with ${app.metadata.category} tasks.`,
          timestamp: new Date(),
        }],
        context: {
          workingDirectory: '/',
          openFiles: [],          userPreferences: {
            theme: 'dark' as const,
            defaultAutonomyLevel: useLLMOSStore.getState().autonomyLevel,
            preferredModel: 'gpt-4',
            enableNotifications: true,
            autoSave: true,
            privacyMode: false,
            customPrompts: {},
          },
          environmentVars: {},
          memory: [],
        },
        autonomyLevel: useLLMOSStore.getState().autonomyLevel,
        status: SessionStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Update store with new session
      useLLMOSStore.getState().setCurrentSession(appSession);
      
      // Switch back to shell to interact with the app
      useLLMOSStore.getState().setActiveView('shell');
      
      console.log('App launched successfully:', app.name);
      
    } catch (error) {
      console.error('Failed to launch app:', error);
    }
  };
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Enhanced Header */}
      <div className="border-b border-card-border p-3 sm:p-4 lg:p-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-2 text-text-primary">App Launcher</h1>
        <p className="text-xs sm:text-sm text-text-secondary">Launch prompt-powered applications</p>
      </div>

      {/* Enhanced Category Filter */}
      <div className="border-b border-card-border p-3 sm:p-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                filter === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-text-secondary hover:bg-card-hover hover:text-text-primary border border-card-border'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>      {/* Enhanced Apps Grid */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 custom-scrollbar">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-sm text-text-secondary">Loading apps...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {filteredApps.map((app) => {
            const IconComponent = getIcon(app.icon || 'FileText');
            
            return (
              <div
                key={app.id}
                className={`bg-card border border-card-border rounded-lg p-3 sm:p-4 hover:bg-card-hover transition-all cursor-pointer ${selectedApp === app.id ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setSelectedApp(app.id)}
              >
                <div className="flex flex-col space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    {app.metadata?.featured && (
                      <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
                        Featured
                      </span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-semibold text-text-primary truncate">{app.name}</h3>
                    <p className="text-xs sm:text-sm text-text-secondary mt-1 line-clamp-2">
                      {app.description}
                    </p>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-gray-500 capitalize">
                        {app.metadata?.category || 'other'}
                      </span>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLaunchApp(app.id);
                        }}
                        className="flex items-center space-x-1 bg-llm-accent hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        <Play className="w-3 h-3" />
                        <span>Launch</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );          })}
        </div>
        
        {filteredApps.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-llm-light rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-300 mb-2">No apps found</h3>
            <p className="text-gray-500">Try adjusting your filter or check back later for new apps.</p>
          </div>
        )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-llm-light p-4">
        <div className="text-center">
          <p className="text-sm text-gray-500">
            {filteredApps.length} apps available
          </p>
        </div>
      </div>
    </div>
  );
}
