// lib/authService.js
import { 
    signInWithEmailAndPassword, 
    signOut as firebaseSignOut,
    onAuthStateChanged
  } from 'firebase/auth';
  import { auth } from './firebase';
  
  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  export const authService = {
    // Sign in
    signIn: async (email, password) => {
      try {
        // In development, allow test credentials
        if (isDevelopment && email === 'admin@mitra.org' && password === 'password') {
          return { uid: 'test-admin-uid', email: 'admin@mitra.org' };
        }
        
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
      } catch (error) {
        console.error('Error signing in:', error);
        throw error;
      }
    },
    
    // Sign out
    signOut: async () => {
      try {
        if (isDevelopment) {
          return true;
        }
        
        await firebaseSignOut(auth);
        return true;
      } catch (error) {
        console.error('Error signing out:', error);
        throw error;
      }
    },
    
    // Get current user
    getCurrentUser: () => {
      // In development mode, simulate a logged-in admin user
      if (isDevelopment) {
        return Promise.resolve({ uid: 'test-admin-uid', email: 'admin@mitra.org' });
      }
      
      return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(
          auth,
          (user) => {
            unsubscribe();
            resolve(user);
          },
          reject
        );
      });
    },
    
    // Auth state change listener
    onAuthStateChanged: (callback) => {
      // In development mode, simulate a logged-in admin user
      if (isDevelopment) {
        callback({ uid: 'test-admin-uid', email: 'admin@mitra.org' });
        return () => {}; // Return dummy unsubscribe function
      }
      
      return onAuthStateChanged(auth, callback);
    }
  };
  
  export default authService;