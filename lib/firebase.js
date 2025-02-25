// lib/firebase.js
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-auth-domain",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-storage",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "demo-sender-id",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "demo-app-id"
};

// Mock implementations for development
const mockDb = {
  collection: () => ({
    doc: () => ({
      get: async () => ({
        exists: false,
        data: () => ({}),
        id: 'mock-id'
      }),
      set: async () => {},
      update: async () => {}
    }),
    add: async () => ({ id: 'mock-id' }),
    where: () => ({
      get: async () => ({
        docs: [],
        empty: true
      })
    }),
    orderBy: () => ({
      limit: () => ({
        get: async () => ({
          docs: [],
          empty: true
        })
      })
    })
  })
};

const mockAuth = {
  signInWithEmailAndPassword: async () => ({ user: { uid: 'mock-uid' } }),
  signOut: async () => {},
  onAuthStateChanged: () => {}
};

// Initialize Firebase or use mock implementation
let app, db, auth;

try {
  // Check if Firebase app is already initialized
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  
  // Initialize Firebase services
  try {
    db = getFirestore(app);
    auth = getAuth(app);
  } catch (error) {
    console.warn('Firebase services initialization failed, using mocks', error);
    db = mockDb;
    auth = mockAuth;
  }
} catch (error) {
  console.warn('Firebase app initialization failed, using mocks', error);
  db = mockDb;
  auth = mockAuth;
}

export { db, auth };
export default app;