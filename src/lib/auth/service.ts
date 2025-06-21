import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase';
import { UserProfile, AutonomyLevel } from '../../types';
import DatabaseService from '../persistence/database';
import { useLLMOSStore } from '../store';

export interface AuthResult {
  success: boolean;
  user?: UserProfile;
  error?: string;
}

export class AuthService {
  private static googleProvider = new GoogleAuthProvider();

  // Initialize auth state listener
  static initAuthListener(): () => void {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await this.handleUserSignIn(firebaseUser);
      } else {
        this.handleUserSignOut();
      }
    });
  }

  // Handle user sign in and load their data
  private static async handleUserSignIn(firebaseUser: User): Promise<void> {
    try {
      let userProfile = await DatabaseService.getUser(firebaseUser.uid);
      
      // Create user profile if it doesn't exist
      if (!userProfile) {
        const newProfile: Partial<UserProfile> = {
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          avatar: firebaseUser.photoURL || undefined,
          preferences: {
            theme: 'dark',
            defaultAutonomyLevel: AutonomyLevel.SUGGEST_ONLY,
            preferredModel: 'gpt-4',
            enableNotifications: true,
            autoSave: true,
            privacyMode: false,
            customPrompts: {}
          },
          usage: {
            totalSessions: 0,
            totalTokens: 0,
            favoriteApps: [],
            lastUsedApps: [],
            averageSessionDuration: 0
          },
          lastActiveAt: new Date()
        };

        await DatabaseService.createUser(firebaseUser.uid, newProfile);
        userProfile = await DatabaseService.getUser(firebaseUser.uid);
      } else {
        // Update last active time
        await DatabaseService.updateUser(firebaseUser.uid, {
          lastActiveAt: new Date()
        });
      }

      if (userProfile) {
        // Load user session into store
        await useLLMOSStore.getState().loadUserSession(firebaseUser.uid);
        
        // Log system event
        await DatabaseService.logSystemEvent({
          type: 'user_signin',
          description: 'User signed in',
          userId: firebaseUser.uid,
          metadata: {
            email: firebaseUser.email,
            provider: firebaseUser.providerData[0]?.providerId || 'email'
          }
        });
      }
    } catch (error) {
      console.error('Failed to handle user sign in:', error);
    }
  }
  // Handle user sign out
  private static handleUserSignOut(): void {
    // Clear user data from store
    const store = useLLMOSStore.getState();
    store.setCurrentSession(null);
    // Note: In a full implementation, we'd add a setUser method to the store
  }

  // Sign in with email and password
  static async signInWithEmail(email: string, password: string): Promise<AuthResult> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      return {
        success: true,
        user: useLLMOSStore.getState().user || undefined
      };
    } catch (error: any) {
      return {
        success: false,
        error: this.getAuthErrorMessage(error.code)
      };
    }
  }

  // Create account with email and password
  static async createAccount(email: string, password: string, displayName: string): Promise<AuthResult> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Update display name
      await updateProfile(userCredential.user, { displayName });
      
      return {
        success: true,
        user: useLLMOSStore.getState().user || undefined
      };
    } catch (error: any) {
      return {
        success: false,
        error: this.getAuthErrorMessage(error.code)
      };
    }
  }

  // Sign in with Google
  static async signInWithGoogle(): Promise<AuthResult> {
    try {
      const result = await signInWithPopup(auth, this.googleProvider);
      
      return {
        success: true,
        user: useLLMOSStore.getState().user || undefined
      };
    } catch (error: any) {
      return {
        success: false,
        error: this.getAuthErrorMessage(error.code)
      };
    }
  }

  // Sign out
  static async signOut(): Promise<void> {
    try {
      const userId = auth.currentUser?.uid;
      if (userId) {
        await DatabaseService.logSystemEvent({
          type: 'user_signout',
          description: 'User signed out',
          userId,
          metadata: {
            sessionDuration: Date.now() - (useLLMOSStore.getState().user?.lastActiveAt?.getTime() || 0)
          }
        });
      }
      
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }

  // Get current user
  static getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!auth.currentUser;
  }

  // Get user profile from store
  static getUserProfile(): UserProfile | null {
    return useLLMOSStore.getState().user;
  }

  // Update user preferences
  static async updateUserPreferences(updates: Partial<UserProfile['preferences']>): Promise<void> {
    const user = this.getCurrentUser();
    const userProfile = this.getUserProfile();
    
    if (!user || !userProfile) {
      throw new Error('User not authenticated');
    }

    const updatedPreferences = {
      ...userProfile.preferences,
      ...updates
    };

    await DatabaseService.updateUser(user.uid, {
      preferences: updatedPreferences
    });    // Update store
    const store = useLLMOSStore.getState();
    // Note: In a full implementation, we'd need proper user state management
  }

  // Helper method to convert Firebase auth errors to user-friendly messages
  private static getAuthErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/popup-closed-by-user':
        return 'Sign in was cancelled.';
      case 'auth/popup-blocked':
        return 'Popup was blocked. Please allow popups for this site.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection and try again.';
      default:
        return 'An error occurred during authentication. Please try again.';
    }
  }

  // Initialize demo mode (for testing without authentication)
  static async initDemoMode(): Promise<void> {
    const demoUser: UserProfile = {
      id: 'demo-user',
      email: 'demo@llm-os.com',
      displayName: 'Demo User',
      preferences: {
        theme: 'dark',
        defaultAutonomyLevel: AutonomyLevel.EXECUTE_WITH_APPROVAL,
        preferredModel: 'gpt-4',
        enableNotifications: true,
        autoSave: true,
        privacyMode: false,
        customPrompts: {
          'quick-help': 'Provide a concise, helpful response to this query.',
          'detailed-analysis': 'Provide a comprehensive analysis of this topic.'
        }
      },
      usage: {
        totalSessions: 42,
        totalTokens: 15420,
        favoriteApps: ['writer-ai', 'code-agent'],
        lastUsedApps: ['research-assistant'],
        averageSessionDuration: 840
      },
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      lastActiveAt: new Date()
    };    // Set user in store (simplified for demo)
    const store = useLLMOSStore.getState();
    // Note: In production, we'd have proper user state management
    store.updateAutonomyLevel(demoUser.preferences.defaultAutonomyLevel);

    // Create a demo session
    await store.createNewSession('shell');
  }
}

export default AuthService;
