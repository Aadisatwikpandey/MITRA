// lib/authService.js
import { 
    signInWithEmailAndPassword, 
    signOut as firebaseSignOut,
    onAuthStateChanged,
    sendPasswordResetEmail
  } from 'firebase/auth';
  import { auth } from './firebase';
  
  export const authService = {
    // Sign in
    signIn: async (email, password) => {
      try {
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
        await firebaseSignOut(auth);
        return true;
      } catch (error) {
        console.error('Error signing out:', error);
        throw error;
      }
    },
    
    // Get current user
    getCurrentUser: () => {
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
      return onAuthStateChanged(auth, callback);
    },
    
    // Send password reset email
    sendPasswordResetEmail: async (email) => {
      try {
        await sendPasswordResetEmail(auth, email);
        return true;
      } catch (error) {
        console.error('Error sending password reset email:', error);
        throw error;
      }
    },
    
    // Check if user is admin
    isAdmin: async (user) => {
      if (!user) return false;
      
      try {
        // Get ID token result which contains custom claims
        const idTokenResult = await user.getIdTokenResult();
        
        // Check if user has admin role
        return idTokenResult.claims.admin === true;
      } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
    }
  };
  
  export default authService;