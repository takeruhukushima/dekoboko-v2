// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  doc,
  getDoc,
  updateDoc,
  serverTimestamp, 
  query, 
  orderBy, 
  getDocs, 
  DocumentData, 
  Timestamp,
  Firestore
} from "firebase/firestore";
import { Post as PostType, PostType as PostTypeEnum } from "@/types/post";

// 環境変数が正しく読み込まれているか確認
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

// 必須環境変数のチェック
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars);
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// 設定値をログに出力（機密情報はマスク）
console.log('Firebase Config:', {
  ...firebaseConfig,
  apiKey: '***' + (firebaseConfig.apiKey?.slice(-4) || '')
});

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Analytics only in browser
let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

// Initialize Firestore
export const db = getFirestore(app);

// Only connect to emulator if explicitly enabled
if (process.env.NEXT_PUBLIC_USE_FIRESTORE_EMULATOR === 'true') {
  import('firebase/firestore').then(({ connectFirestoreEmulator }) => {
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.log('Using Firestore emulator');
  }).catch(console.error);
} else {
  console.log('Using production Firestore');
}

// Collections
export const POSTS_COLLECTION = 'posts';

// Firestore functions
export async function addPost(post: Omit<PostType, 'id' | 'createdAt' | 'updatedAt' | 'status'>) {
  try {
    const timestamp = serverTimestamp();
    const docRef = await addDoc(collection(db, "posts"), {
      ...post,
      userDid: post.userDid || post.userId, // 互換性のため
      createdAt: timestamp,
      updatedAt: timestamp,
      status: 'active' as const,
    });
    return { 
      id: docRef.id, 
      ...post, 
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active' as const,
    };
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
}

export async function deletePost(postId: string): Promise<void> {
  try {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      status: 'deleted',
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error deleting post: ", error);
    throw error;
  }
}

export async function getPostById(postId: string): Promise<PostType | null> {
  try {
    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);
    
    if (!postSnap.exists()) {
      return null;
    }
    
    const data = postSnap.data();
    return {
      id: postSnap.id,
      ...data,
      userDid: data.userDid || data.userId,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      status: data.status || 'active',
    } as PostType;
  } catch (error) {
    console.error("Error getting post:", error);
    throw error;
  }
}

export async function updatePost(
  postId: string, 
  updates: Partial<Omit<PostType, 'id' | 'createdAt' | 'userId' | 'userDid'>>
): Promise<void> {
  try {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
}

export const getPosts = async (): Promise<PostType[]> => {
  const q = query(
    collection(db, POSTS_COLLECTION), 
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs
    .map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        userDid: data.userDid || data.userId, // 互換性のため
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        status: data.status || 'active',
      } as PostType;
    })
    .filter(post => post.status !== 'deleted'); // 削除済みは除外
};