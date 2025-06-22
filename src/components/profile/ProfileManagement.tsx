'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  MapPin, 
  Briefcase, 
  Star,
  Shield,
  Zap,
  Upload,
  Camera,
  Save,
  Edit,
  Settings,
  Bell,
  Lock,
  Trash2,
  Download,
  RefreshCw,
  Eye,
  EyeOff,
  ChevronRight,
  X,
  Check,
  Heart,
  Globe
} from 'lucide-react';
import { Button, Input, Textarea } from '../ui/index';
import { useLLMOSStore } from '../../lib/store';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  location: string;
  profession: string;
  bio: string;
  interests: string[];
  experienceLevel: string;
  avatar?: string;
  preferences: {
    theme: string;
    notifications: boolean;
    dataSharing: boolean;
    analytics: boolean;
    privacy: string;
  };
  stats: {
    sessionsCompleted: number;
    totalUptime: string;
    commandsExecuted: number;
    aiInteractions: number;
  };
}

interface ProfileManagementProps {
  onClose?: () => void;
}

export function ProfileManagement({ onClose }: ProfileManagementProps) {
  const { setActiveView } = useLLMOSStore();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Mock user data - in real app this would come from API/state
  const [profile, setProfile] = useState<UserProfile>({
    firstName: 'Alex',
    lastName: 'Chen',
    email: 'alex.chen@example.com',
    username: 'alexchen_ai',
    location: 'San Francisco, CA',
    profession: 'AI Research Engineer',
    bio: 'Passionate about pushing the boundaries of artificial intelligence and creating systems that augment human intelligence. Working on next-generation language models and their applications.',
    interests: ['Artificial Intelligence', 'Machine Learning', 'Quantum Computing', 'Neural Networks'],
    experienceLevel: 'advanced',
    avatar: '', // In real app, this would be a URL
    preferences: {
      theme: 'dark',
      notifications: true,
      dataSharing: false,
      analytics: true,
      privacy: 'private'
    },
    stats: {
      sessionsCompleted: 247,
      totalUptime: '156h 23m',
      commandsExecuted: 3421,
      aiInteractions: 1567
    }
  });

  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceChange = (field: keyof UserProfile['preferences'], value: any) => {
    setEditedProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value
      }
    }));
  };

  const saveChanges = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const exportData = () => {
    const dataStr = JSON.stringify(profile, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'llm-os-profile.json';
    link.click();
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'analytics', label: 'Analytics', icon: Zap },
  ];

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 p-3 rounded-full">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                Profile Management
              </h1>
              <p className="text-gray-400">Manage your LLM-OS account and preferences</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={cancelEdit}
                  className="border-gray-600 hover:bg-gray-700"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={saveChanges}
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="border-gray-600 hover:bg-gray-700"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
            
            {onClose && (
              <Button
                variant="ghost"
                onClick={onClose}
                className="hover:bg-gray-700"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl border border-gray-700/50 p-6">
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-green-600/20 border border-blue-500/30 text-white'
                          : 'hover:bg-gray-700/50 text-gray-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                      <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${
                        isActive ? 'rotate-90' : ''
                      }`} />
                    </motion.button>
                  );
                })}
              </div>
              
              {/* Quick Stats */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Sessions</span>
                    <span className="text-white font-medium">{profile.stats.sessionsCompleted}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Uptime</span>
                    <span className="text-white font-medium">{profile.stats.totalUptime}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Commands</span>
                    <span className="text-white font-medium">{profile.stats.commandsExecuted}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl border border-gray-700/50 p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Profile Tab */}
                  {activeTab === 'profile' && (
                    <div className="space-y-8">
                      <div className="text-center">
                        <h2 className="text-2xl font-bold text-white mb-2">Personal Information</h2>
                        <p className="text-gray-400">Manage your basic profile information</p>
                      </div>

                      {/* Avatar Section */}
                      <div className="flex items-center justify-center mb-8">
                        <div className="relative">
                          <div className="w-32 h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                            {profile.firstName[0]}{profile.lastName[0]}
                          </div>
                          {isEditing && (
                            <button className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 p-2 rounded-full text-white transition-colors">
                              <Camera className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Profile Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-white">First Name</label>
                          {isEditing ? (
                            <Input
                              value={editedProfile.firstName}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('firstName', e.target.value)}
                            />
                          ) : (
                            <div className="p-3 bg-gray-700/30 rounded-lg text-white">{profile.firstName}</div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-white">Last Name</label>
                          {isEditing ? (
                            <Input
                              value={editedProfile.lastName}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('lastName', e.target.value)}
                            />
                          ) : (
                            <div className="p-3 bg-gray-700/30 rounded-lg text-white">{profile.lastName}</div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-white">Email</label>
                          {isEditing ? (
                            <Input
                              type="email"
                              value={editedProfile.email}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
                            />
                          ) : (
                            <div className="p-3 bg-gray-700/30 rounded-lg text-white flex items-center">
                              <Mail className="w-4 h-4 mr-2 text-gray-400" />
                              {profile.email}
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-white">Username</label>
                          {isEditing ? (
                            <Input
                              value={editedProfile.username}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('username', e.target.value)}
                            />
                          ) : (
                            <div className="p-3 bg-gray-700/30 rounded-lg text-white">@{profile.username}</div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-white">Location</label>
                          {isEditing ? (
                            <Input
                              value={editedProfile.location}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('location', e.target.value)}
                            />
                          ) : (
                            <div className="p-3 bg-gray-700/30 rounded-lg text-white flex items-center">
                              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                              {profile.location}
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-white">Profession</label>
                          {isEditing ? (
                            <Input
                              value={editedProfile.profession}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('profession', e.target.value)}
                            />
                          ) : (
                            <div className="p-3 bg-gray-700/30 rounded-lg text-white flex items-center">
                              <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                              {profile.profession}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">Bio</label>
                        {isEditing ? (
                          <Textarea
                            value={editedProfile.bio}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('bio', e.target.value)}
                            rows={4}
                          />
                        ) : (
                          <div className="p-4 bg-gray-700/30 rounded-lg text-white">{profile.bio}</div>
                        )}
                      </div>

                      {/* Interests */}
                      <div className="space-y-4">
                        <label className="block text-sm font-medium text-white">Interests</label>
                        <div className="flex flex-wrap gap-2">
                          {profile.interests.map((interest, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-green-600/20 border border-blue-500/30 rounded-full text-sm text-white"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Preferences Tab */}
                  {activeTab === 'preferences' && (
                    <div className="space-y-8">
                      <div className="text-center">
                        <h2 className="text-2xl font-bold text-white mb-2">System Preferences</h2>
                        <p className="text-gray-400">Customize your LLM-OS experience</p>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-white">Appearance</h3>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-white">Theme</label>
                            <select 
                              value={isEditing ? editedProfile.preferences.theme : profile.preferences.theme}
                              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handlePreferenceChange('theme', e.target.value)}
                              disabled={!isEditing}
                              className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white disabled:opacity-50"
                            >
                              <option value="dark">Dark Mode</option>
                              <option value="light">Light Mode</option>
                              <option value="auto">Auto (System)</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-white">Notifications</h3>
                          <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                            <div>
                              <div className="font-medium text-white">System Notifications</div>
                              <div className="text-sm text-gray-400">Receive alerts about system status and updates</div>
                            </div>
                            <input
                              type="checkbox"
                              checked={isEditing ? editedProfile.preferences.notifications : profile.preferences.notifications}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePreferenceChange('notifications', e.target.checked)}
                              disabled={!isEditing}
                              className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded disabled:opacity-50"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Privacy Tab */}
                  {activeTab === 'privacy' && (
                    <div className="space-y-8">
                      <div className="text-center">
                        <h2 className="text-2xl font-bold text-white mb-2">Privacy & Security</h2>
                        <p className="text-gray-400">Control your data and privacy settings</p>
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                          <div>
                            <div className="font-medium text-white">Data Analytics</div>
                            <div className="text-sm text-gray-400">Allow anonymous usage analytics to improve LLM-OS</div>
                          </div>
                          <input
                            type="checkbox"
                            checked={isEditing ? editedProfile.preferences.analytics : profile.preferences.analytics}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePreferenceChange('analytics', e.target.checked)}
                            disabled={!isEditing}
                            className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded disabled:opacity-50"
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                          <div>
                            <div className="font-medium text-white">Data Sharing</div>
                            <div className="text-sm text-gray-400">Share anonymized data for research purposes</div>
                          </div>
                          <input
                            type="checkbox"
                            checked={isEditing ? editedProfile.preferences.dataSharing : profile.preferences.dataSharing}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePreferenceChange('dataSharing', e.target.checked)}
                            disabled={!isEditing}
                            className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded disabled:opacity-50"
                          />
                        </div>

                        <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
                          <h3 className="text-lg font-semibold text-orange-400 mb-4">Danger Zone</h3>
                          <div className="space-y-4">
                            <Button
                              variant="outline"
                              onClick={exportData}
                              className="w-full border-gray-600 hover:bg-gray-700"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Export My Data
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => setShowDeleteConfirm(true)}
                              className="w-full"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Account
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Analytics Tab */}
                  {activeTab === 'analytics' && (
                    <div className="space-y-8">
                      <div className="text-center">
                        <h2 className="text-2xl font-bold text-white mb-2">Usage Analytics</h2>
                        <p className="text-gray-400">View your LLM-OS usage statistics</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-6 text-center">
                          <Zap className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                          <div className="text-2xl font-bold text-white">{profile.stats.sessionsCompleted}</div>
                          <div className="text-sm text-gray-400">Sessions Completed</div>
                        </div>
                        <div className="bg-purple-600/10 border border-purple-500/30 rounded-lg p-6 text-center">
                          <Globe className="w-8 h-8 text-purple-400 mx-auto mb-4" />
                          <div className="text-2xl font-bold text-white">{profile.stats.totalUptime}</div>
                          <div className="text-sm text-gray-400">Total Uptime</div>
                        </div>
                        <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-6 text-center">
                          <Settings className="w-8 h-8 text-green-400 mx-auto mb-4" />
                          <div className="text-2xl font-bold text-white">{profile.stats.commandsExecuted}</div>
                          <div className="text-sm text-gray-400">Commands Executed</div>
                        </div>
                        <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-lg p-6 text-center">
                          <Heart className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
                          <div className="text-2xl font-bold text-white">{profile.stats.aiInteractions}</div>
                          <div className="text-sm text-gray-400">AI Interactions</div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-md mx-4"
            >
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center mx-auto">
                  <Trash2 className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Delete Account</h3>
                <p className="text-gray-400">
                  This action cannot be undone. This will permanently delete your account and remove all your data.
                </p>
                <div className="flex space-x-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 border-gray-600 hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      // Handle account deletion
                      setShowDeleteConfirm(false);
                    }}
                    className="flex-1"
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
