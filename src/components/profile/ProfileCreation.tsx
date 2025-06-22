'use client';

import { useState } from 'react';
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
  ChevronRight,
  ChevronLeft,
  Check,
  Brain,
  Globe,
  Heart,
  Settings,
  Sparkles
} from 'lucide-react';
import { Button, Input, Textarea } from '../ui/index';

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
  };
}

interface ProfileCreationProps {
  onComplete: (profile: UserProfile) => void;
  onSkip: () => void;
}

export function ProfileCreation({ onComplete, onSkip }: ProfileCreationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    location: '',
    profession: '',
    bio: '',
    interests: [],
    experienceLevel: '',
    preferences: {
      theme: 'dark',
      notifications: true,
      dataSharing: false,
      analytics: true
    }
  });

  const steps = [
    {
      id: 'basic-info',
      title: 'Basic Information',
      subtitle: 'Tell us about yourself',
      icon: User,
      progress: 25
    },
    {
      id: 'professional',
      title: 'Professional Details',
      subtitle: 'Your work and expertise',
      icon: Briefcase,
      progress: 50
    },
    {
      id: 'interests',
      title: 'Interests & Skills',
      subtitle: 'What drives your curiosity',
      icon: Star,
      progress: 75
    },
    {
      id: 'preferences',
      title: 'Preferences',
      subtitle: 'Customize your experience',
      icon: Settings,
      progress: 100
    }
  ];

  const interestOptions = [
    'Artificial Intelligence',
    'Machine Learning',
    'Quantum Computing',
    'Cybersecurity',
    'Data Science',
    'Blockchain',
    'IoT & Edge Computing',
    'Cloud Computing',
    'Robotics',
    'Natural Language Processing',
    'Computer Vision',
    'DevOps',
    'Software Development',
    'Research & Academia',
    'Product Management',
    'Entrepreneurship'
  ];

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceChange = (field: keyof UserProfile['preferences'], value: any) => {
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value
      }
    }));
  };

  const toggleInterest = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(profile);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return profile.firstName && profile.lastName && profile.email && profile.username;
      case 1:
        return profile.profession && profile.experienceLevel;
      case 2:
        return profile.interests.length > 0;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: {
        duration: 0.3
      }
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      x: -20,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/5 to-green-900/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-2xl mx-auto relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center space-x-2 mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 p-3 rounded-full">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
              Create Your Profile
            </h1>
          </motion.div>
          <p className="text-gray-300 text-lg">
            Let's personalize your LLM-OS experience
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-gray-400">
              {steps[currentStep].progress}% Complete
            </span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500"
              initial={{ width: 0 }}
              animate={{ width: `${steps[currentStep].progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <motion.div
                key={step.id}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-green-600/20 border border-blue-500/30'
                    : isCompleted
                    ? 'bg-green-600/20 border border-green-500/30'
                    : 'bg-gray-800/50 border border-gray-700/30'
                }`}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`p-2 rounded-full ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-green-600'
                    : isCompleted
                    ? 'bg-green-600'
                    : 'bg-gray-700'
                }`}>
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <StepIcon className="w-4 h-4 text-white" />
                  )}
                </div>
                <span className={`text-sm font-medium ${
                  isActive ? 'text-white' : isCompleted ? 'text-green-400' : 'text-gray-400'
                }`}>
                  {step.title}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl border border-gray-700/50 p-8 mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              {/* Step Content */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Basic Information</h2>
                    <p className="text-gray-400">Tell us about yourself to get started</p>
                  </div>                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="block text-sm font-medium text-white">First Name</label>
                      <Input
                        id="firstName"
                        value={profile.firstName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('firstName', e.target.value)}
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="block text-sm font-medium text-white">Last Name</label>
                      <Input
                        id="lastName"
                        value={profile.lastName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('lastName', e.target.value)}
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-white">Email Address</label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="username" className="block text-sm font-medium text-white">Username</label>
                    <Input
                      id="username"
                      value={profile.username}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('username', e.target.value)}
                      placeholder="Choose a unique username"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="location" className="block text-sm font-medium text-white">Location (Optional)</label>
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('location', e.target.value)}
                      placeholder="City, Country"
                    />
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Professional Details</h2>
                    <p className="text-gray-400">Help us understand your background</p>
                  </div>                  <div className="space-y-2">
                    <label htmlFor="profession" className="block text-sm font-medium text-white">Profession/Role</label>
                    <Input
                      id="profession"
                      value={profile.profession}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('profession', e.target.value)}
                      placeholder="e.g., Software Engineer, Data Scientist, Researcher"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="experienceLevel" className="block text-sm font-medium text-white">Experience Level</label>
                    <select 
                      value={profile.experienceLevel} 
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('experienceLevel', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Select your experience level</option>
                      <option value="beginner">Beginner (0-2 years)</option>
                      <option value="intermediate">Intermediate (2-5 years)</option>
                      <option value="advanced">Advanced (5-10 years)</option>
                      <option value="expert">Expert (10+ years)</option>
                      <option value="student">Student/Learning</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="bio" className="block text-sm font-medium text-white">Bio (Optional)</label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('bio', e.target.value)}
                      placeholder="Tell us a bit about yourself, your interests, and what you hope to achieve with LLM-OS"
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Interests & Skills</h2>
                    <p className="text-gray-400">Select areas that interest you most</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {interestOptions.map((interest) => {
                      const isSelected = profile.interests.includes(interest);
                      return (
                        <motion.button
                          key={interest}
                          onClick={() => toggleInterest(interest)}
                          className={`p-3 rounded-lg border transition-all text-left ${
                            isSelected
                              ? 'bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-green-600/20 border-blue-500/50 text-white'
                              : 'bg-gray-700/30 border-gray-600/50 text-gray-300 hover:bg-gray-700/50'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              isSelected ? 'bg-blue-400' : 'bg-gray-500'
                            }`} />
                            <span className="text-sm font-medium">{interest}</span>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  <div className="text-center text-sm text-gray-400">
                    Selected: {profile.interests.length} interests
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Preferences</h2>
                    <p className="text-gray-400">Customize your LLM-OS experience</p>
                  </div>                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white">Theme Preference</label>
                      <select 
                        value={profile.preferences.theme} 
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handlePreferenceChange('theme', e.target.value)}
                        className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
                      >
                        <option value="dark">Dark Mode</option>
                        <option value="light">Light Mode</option>
                        <option value="auto">Auto (System)</option>
                      </select>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                        <div>
                          <div className="font-medium text-white">Enable Notifications</div>
                          <div className="text-sm text-gray-400">Receive updates and alerts</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={profile.preferences.notifications}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePreferenceChange('notifications', e.target.checked)}
                          className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                        <div>
                          <div className="font-medium text-white">Usage Analytics</div>
                          <div className="text-sm text-gray-400">Help improve LLM-OS performance</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={profile.preferences.analytics}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePreferenceChange('analytics', e.target.checked)}
                          className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                        <div>
                          <div className="font-medium text-white">Data Sharing</div>
                          <div className="text-sm text-gray-400">Share anonymized data for research</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={profile.preferences.dataSharing}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePreferenceChange('dataSharing', e.target.checked)}
                          className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onSkip}
            className="text-gray-400 border-gray-600 hover:bg-gray-700"
          >
            Skip for now
          </Button>

          <div className="flex items-center space-x-3">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={prevStep}
                className="border-gray-600 hover:bg-gray-700"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            )}
            
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 hover:from-blue-700 hover:via-purple-700 hover:to-green-700"
            >
              {currentStep === steps.length - 1 ? 'Complete Profile' : 'Continue'}
              {currentStep < steps.length - 1 && <ChevronRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
