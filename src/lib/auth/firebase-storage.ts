import type {
  NodeSavedSession,
  NodeSavedSessionStore,
  NodeSavedState,
  NodeSavedStateStore,
} from "@atproto/oauth-client-node";

import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

/**
 * Recursively removes undefined values from an object
 */
function removeUndefined<T extends Record<string, any>>(obj: T): T {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  return Object.entries(obj).reduce((acc, [key, value]) => {
    // Skip undefined values
    if (value === undefined) {
      return acc;
    }

    // Handle nested objects
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const cleaned = removeUndefined(value);
      // Only add if the object is not empty after cleaning
      if (Object.keys(cleaned).length > 0) {
        (acc as Record<string, any>)[key] = cleaned;
      }
    } 
    // Handle arrays
    else if (Array.isArray(value)) {
      const cleanedArray = value
        .map(item => (item && typeof item === 'object' ? removeUndefined(item) : item))
        .filter(item => item !== undefined);
      
      if (cleanedArray.length > 0) {
        (acc as Record<string, any>)[key] = cleanedArray;
      }
    } 
    // Handle primitive values
    else {
      (acc as Record<string, any>)[key] = value;
    }

    return acc;
  }, {} as Record<string, any>) as T;
}

export class FirebaseStateStore implements NodeSavedStateStore {
  private collection = 'authStates';
  private db = db;

  async get(key: string): Promise<NodeSavedState | undefined> {
    try {
      const docRef = doc(db, this.collection, key);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return undefined;
      }
      
      const data = docSnap.data();
      if (!data) return undefined;
      
      // Handle both direct data and nested state object
      if ('state' in data) {
        return data.state as NodeSavedState;
      }
      
      return data as NodeSavedState;
    } catch (error) {
      console.error('Error getting auth state:', error);
      return undefined;
    }
  }

  async set(key: string, state: NodeSavedState): Promise<void> {
    try {
      const cleanedState = removeUndefined(state);
      console.log(`Setting ${this.collection} ${key}:`, cleanedState);
      await setDoc(doc(this.db, this.collection, key), cleanedState);
      console.log(`Successfully set ${this.collection} ${key}`);
    } catch (error) {
      console.error(`Error setting ${this.collection} ${key}:`, error);
      // For development, rethrow the error with more context
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to set ${this.collection} ${key}: ${errorMessage}`);
    }
  }

  async del(key: string): Promise<void> {
    try {
      const docRef = doc(this.db, this.collection, key);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting ${this.collection} ${key}:`, error);
      // For development, rethrow the error with more context
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to delete ${this.collection} ${key}: ${errorMessage}`);
    }
  }
}

export class FirebaseSessionStore implements NodeSavedSessionStore {
  private collection = 'authSessions';
  private db = db;

  async get(key: string): Promise<NodeSavedSession | undefined> {
    try {
      console.log(`Getting ${this.collection} ${key}`);
      const docSnap = await getDoc(doc(this.db, this.collection, key));
      const result = docSnap.exists() ? (docSnap.data() as NodeSavedSession) : undefined;
      console.log(`Retrieved ${this.collection} ${key}:`, result);
      return result;
    } catch (error) {
      console.error(`Error getting ${this.collection} ${key}:`, error);
      // For development, log the full error but still return undefined
      return undefined;
    }
  }

  async set(key: string, session: NodeSavedSession): Promise<void> {
    try {
      const cleanedSession = removeUndefined(session);
      console.log(`Setting ${this.collection} ${key}:`, cleanedSession);
      await setDoc(doc(this.db, this.collection, key), cleanedSession);
      console.log(`Successfully set ${this.collection} ${key}`);
    } catch (error) {
      console.error(`Error setting ${this.collection} ${key}:`, error);
      // For development, rethrow the error with more context
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to set ${this.collection} ${key}: ${errorMessage}`);
    }
  }

  async del(key: string): Promise<void> {
    try {
      const docRef = doc(this.db, this.collection, key);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting ${this.collection} ${key}:`, error);
      // For development, rethrow the error with more context
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to delete ${this.collection} ${key}: ${errorMessage}`);
    }
  }
}
