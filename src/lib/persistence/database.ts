import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  Timestamp,
  serverTimestamp,
  writeBatch,
  type Unsubscribe
} from 'firebase/firestore';
import { db } from '../firebase';
import { 
  PromptSession, 
  ChatMessage, 
  UserProfile, 
  LLMApp,
  AgentAction,
  SystemSettings,
  AutonomyLevel 
} from '../../types';

// Collection names
const COLLECTIONS = {
  USERS: 'users',
  SESSIONS: 'sessions',
  MESSAGES: 'messages',
  APPS: 'apps',
  ACTIONS: 'actions',
  SETTINGS: 'settings',
  SYSTEM_LOGS: 'system_logs',
} as const;

export class DatabaseService {
  // User Management
  static async createUser(userId: string, profile: Partial<UserProfile>): Promise<void> {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await setDoc(userRef, {
      ...profile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  static async getUser(userId: string): Promise<UserProfile | null> {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() } as UserProfile;
    }
    return null;
  }

  static async updateUser(userId: string, updates: Partial<UserProfile>): Promise<void> {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  }

  // Session Management
  static async createSession(userId: string, session: Omit<PromptSession, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const sessionRef = doc(collection(db, COLLECTIONS.SESSIONS));
    const sessionData = {
      ...session,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    await setDoc(sessionRef, sessionData);
    return sessionRef.id;
  }

  static async getSession(sessionId: string): Promise<PromptSession | null> {
    const sessionRef = doc(db, COLLECTIONS.SESSIONS, sessionId);
    const sessionSnap = await getDoc(sessionRef);
    
    if (sessionSnap.exists()) {
      const data = sessionSnap.data();
      return {
        id: sessionSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as PromptSession;
    }
    return null;
  }

  static async getUserSessions(userId: string, limitCount = 50): Promise<PromptSession[]> {
    const sessionsQuery = query(
      collection(db, COLLECTIONS.SESSIONS),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(sessionsQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as PromptSession[];
  }

  static async updateSession(sessionId: string, updates: Partial<PromptSession>): Promise<void> {
    const sessionRef = doc(db, COLLECTIONS.SESSIONS, sessionId);
    await updateDoc(sessionRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  }

  static async deleteSession(sessionId: string): Promise<void> {
    const batch = writeBatch(db);
    
    // Delete session
    const sessionRef = doc(db, COLLECTIONS.SESSIONS, sessionId);
    batch.delete(sessionRef);
    
    // Delete associated messages
    const messagesQuery = query(
      collection(db, COLLECTIONS.MESSAGES),
      where('sessionId', '==', sessionId)
    );
    const messagesSnap = await getDocs(messagesQuery);
    messagesSnap.docs.forEach(messageDoc => {
      batch.delete(messageDoc.ref);
    });
    
    await batch.commit();
  }

  // Message Management
  static async addMessage(sessionId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<string> {
    const messageRef = doc(collection(db, COLLECTIONS.MESSAGES));
    const messageData = {
      ...message,
      sessionId,
      timestamp: serverTimestamp(),
    };
    
    await setDoc(messageRef, messageData);
    
    // Update session's last activity
    await this.updateSession(sessionId, { updatedAt: new Date() });
    
    return messageRef.id;
  }

  static async getSessionMessages(sessionId: string): Promise<ChatMessage[]> {
    const messagesQuery = query(
      collection(db, COLLECTIONS.MESSAGES),
      where('sessionId', '==', sessionId),
      orderBy('timestamp', 'asc')
    );
    
    const querySnapshot = await getDocs(messagesQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date(),
    })) as ChatMessage[];
  }

  // App Management
  static async saveInstalledApp(userId: string, app: LLMApp): Promise<void> {
    const appRef = doc(db, COLLECTIONS.APPS, `${userId}_${app.id}`);
    await setDoc(appRef, {
      ...app,
      userId,
      installedAt: serverTimestamp(),
    });
  }

  static async getUserApps(userId: string): Promise<LLMApp[]> {
    const appsQuery = query(
      collection(db, COLLECTIONS.APPS),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(appsQuery);    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        author: data.author,
        version: data.version,
        icon: data.icon,
        promptTemplate: data.promptTemplate,
        tools: data.tools,
        autonomyLevels: data.autonomyLevels,
        uiComponents: data.uiComponents,
        metadata: data.metadata,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        installedAt: data.installedAt?.toDate() || new Date(),
      } as LLMApp;
    });
  }

  static async removeApp(userId: string, appId: string): Promise<void> {
    const appRef = doc(db, COLLECTIONS.APPS, `${userId}_${appId}`);
    await deleteDoc(appRef);
  }

  // Action Management
  static async createAction(action: Omit<AgentAction, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const actionRef = doc(collection(db, COLLECTIONS.ACTIONS));
    const actionData = {
      ...action,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    await setDoc(actionRef, actionData);
    return actionRef.id;
  }

  static async updateAction(actionId: string, updates: Partial<AgentAction>): Promise<void> {
    const actionRef = doc(db, COLLECTIONS.ACTIONS, actionId);
    await updateDoc(actionRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  }

  static async getAction(actionId: string): Promise<AgentAction | null> {
    const actionRef = doc(db, COLLECTIONS.ACTIONS, actionId);
    const actionSnap = await getDoc(actionRef);
      if (actionSnap.exists()) {
      const data = actionSnap.data();
      return {
        id: actionSnap.id,
        sessionId: data.sessionId,
        type: data.type,
        description: data.description,
        payload: data.payload,
        status: data.status,
        autonomyLevel: data.autonomyLevel,
        timestamp: data.timestamp?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        executedAt: data.executedAt?.toDate(),
        result: data.result,
        error: data.error,
      } as AgentAction;
    }
    return null;
  }

  static async getSessionActions(sessionId: string): Promise<AgentAction[]> {
    const actionsQuery = query(
      collection(db, COLLECTIONS.ACTIONS),
      where('sessionId', '==', sessionId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(actionsQuery);    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        sessionId: data.sessionId,
        type: data.type,
        description: data.description,
        payload: data.payload,
        status: data.status,
        autonomyLevel: data.autonomyLevel,
        timestamp: data.timestamp?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        executedAt: data.executedAt?.toDate(),
        result: data.result,
        error: data.error,
      } as AgentAction;
    });
  }

  // Settings Management
  static async saveSettings(userId: string, settings: SystemSettings): Promise<void> {
    const settingsRef = doc(db, COLLECTIONS.SETTINGS, userId);
    await setDoc(settingsRef, {
      ...settings,
      updatedAt: serverTimestamp(),
    });
  }

  static async getSettings(userId: string): Promise<SystemSettings | null> {
    const settingsRef = doc(db, COLLECTIONS.SETTINGS, userId);
    const settingsSnap = await getDoc(settingsRef);
    
    if (settingsSnap.exists()) {
      return settingsSnap.data() as SystemSettings;
    }
    return null;
  }

  // Real-time subscriptions
  static subscribeToSession(sessionId: string, callback: (session: PromptSession | null) => void): Unsubscribe {
    const sessionRef = doc(db, COLLECTIONS.SESSIONS, sessionId);
    return onSnapshot(sessionRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        callback({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as PromptSession);
      } else {
        callback(null);
      }
    });
  }

  static subscribeToSessionMessages(sessionId: string, callback: (messages: ChatMessage[]) => void): Unsubscribe {
    const messagesQuery = query(
      collection(db, COLLECTIONS.MESSAGES),
      where('sessionId', '==', sessionId),
      orderBy('timestamp', 'asc')
    );
    
    return onSnapshot(messagesQuery, (querySnapshot) => {
      const messages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      })) as ChatMessage[];
      callback(messages);
    });
  }

  static subscribeToSessionActions(sessionId: string, callback: (actions: AgentAction[]) => void): Unsubscribe {
    const actionsQuery = query(
      collection(db, COLLECTIONS.ACTIONS),
      where('sessionId', '==', sessionId),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(actionsQuery, (querySnapshot) => {      const actions = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          sessionId: data.sessionId,
          type: data.type,
          description: data.description,
          payload: data.payload,
          status: data.status,
          autonomyLevel: data.autonomyLevel,
          timestamp: data.timestamp?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          executedAt: data.executedAt?.toDate(),
          result: data.result,
          error: data.error,
        } as AgentAction;
      });
      callback(actions);
    });
  }

  // System logging
  static async logSystemEvent(event: {
    type: string;
    description: string;
    userId?: string;
    sessionId?: string;
    metadata?: Record<string, any>;
  }): Promise<void> {
    const logRef = doc(collection(db, COLLECTIONS.SYSTEM_LOGS));
    await setDoc(logRef, {
      ...event,
      timestamp: serverTimestamp(),
    });
  }
}

export default DatabaseService;
