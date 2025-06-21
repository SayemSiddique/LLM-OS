'use client';

import { useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useLLMOSStore } from '../../lib/store';
import { AutonomyLevel } from '../../types';

export function AutonomyControls() {
  const { autonomyLevel, updateAutonomyLevel } = useLLMOSStore();

  const levels = [
    {
      level: 1,
      name: 'Suggest Only',
      description: 'AI provides suggestions, human executes',
      color: 'bg-green-500',
      textColor: 'text-green-400',
      icon: CheckCircle,
    },
    {
      level: 2,
      name: 'Execute with Approval',
      description: 'AI executes after human confirmation',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-400',
      icon: Shield,
    },
    {
      level: 3,
      name: 'Autonomous with Oversight',
      description: 'AI executes, human monitors',
      color: 'bg-orange-500',
      textColor: 'text-orange-400',
      icon: AlertTriangle,
    },
    {
      level: 4,
      name: 'Full Autonomous',
      description: 'AI operates independently',
      color: 'bg-red-500',
      textColor: 'text-red-400',
      icon: XCircle,
    },
  ];

  const currentLevel = levels[autonomyLevel - 1];
  const IconComponent = currentLevel.icon;
  return (
    <div className="p-3 sm:p-4 lg:p-6 bg-background">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-semibold mb-2 flex items-center text-text-primary">
          <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary" />
          Autonomy Control
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary">
          Control how much independence your AI agent has
        </p>
      </div>

      {/* Current Level Display */}
      <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-card rounded-lg border border-card-border">
        <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
          <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full ${currentLevel.color} flex items-center justify-center`}>
            <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          </div>
          <div>
            <h3 className={`text-sm sm:text-base font-semibold ${currentLevel.textColor}`}>
              Level {autonomyLevel}: {currentLevel.name}
            </h3>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-text-secondary ml-8 sm:ml-11">
          {currentLevel.description}
        </p>
      </div>

      {/* Autonomy Slider */}
      <div className="mb-6">
        <div className="relative">          <input
            type="range"
            min="1"
            max="4"
            step="1"
            value={autonomyLevel}
            onChange={(e) => updateAutonomyLevel(parseInt(e.target.value) as AutonomyLevel)}
            className="w-full h-2 bg-llm-dark rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, 
                #10b981 0%, #10b981 25%, 
                #f59e0b 25%, #f59e0b 50%, 
                #f97316 50%, #f97316 75%, 
                #ef4444 75%, #ef4444 100%)`
            }}
          />
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Suggest</span>
            <span>Approve</span>
            <span>Monitor</span>
            <span>Autonomous</span>
          </div>
        </div>
      </div>

      {/* Level Descriptions */}
      <div className="space-y-2">
        {levels.map((level) => {
          const LevelIcon = level.icon;
          const isActive = level.level === autonomyLevel;
          
          return (            <button
              key={level.level}
              onClick={() => updateAutonomyLevel(level.level as AutonomyLevel)}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                isActive 
                  ? 'border-llm-accent bg-llm-accent/10' 
                  : 'border-llm-light hover:border-llm-accent/50 hover:bg-llm-light/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full ${level.color} flex items-center justify-center flex-shrink-0`}>
                  <LevelIcon className="w-3 h-3 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className={`text-sm font-medium ${isActive ? level.textColor : 'text-gray-300'}`}>
                    {level.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {level.description}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Safety Notice */}
      <div className="mt-6 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-yellow-400">
            <strong>Safety Notice:</strong> Higher autonomy levels require careful monitoring. 
            Always review AI actions in critical environments.
          </div>
        </div>
      </div>
    </div>
  );
}
