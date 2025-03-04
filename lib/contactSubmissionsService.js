// lib/contactSubmissionsService.js
import { 
    db, 
    collection, 
    getDocs, 
    getDoc, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    query, 
    where, 
    orderBy, 
    limit,
    Timestamp,
    serverTimestamp 
  } from './firebase';
  
  export const contactSubmissionsService = {
    // Get all submissions
    getAllSubmissions: async () => {
      try {
        const querySnapshot = await getDocs(
          query(collection(db, 'contactSubmissions'), orderBy('createdAt', 'desc'))
        );
        
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : new Date()
        }));
      } catch (error) {
        console.error('Error getting submissions:', error);
        throw error;
      }
    },
    
    // Get filtered submissions
    getFilteredSubmissions: async (filters) => {
      try {
        let q = query(collection(db, 'contactSubmissions'), orderBy('createdAt', 'desc'));
        
        // Apply filters
        if (filters.status && filters.status !== 'all') {
          q = query(q, where('status', '==', filters.status));
        }
        
        if (filters.interest && filters.interest !== 'all') {
          q = query(q, where('interest', '==', filters.interest));
        }
        
        const querySnapshot = await getDocs(q);
        
        let results = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : new Date()
        }));
        
        // Apply search filter (client-side since Firestore doesn't support full-text search)
        if (filters.searchTerm) {
          const term = filters.searchTerm.toLowerCase();
          results = results.filter(submission => 
            submission.fullName?.toLowerCase().includes(term) ||
            submission.email?.toLowerCase().includes(term) ||
            submission.phone?.toLowerCase().includes(term)
          );
        }
        
        return results;
      } catch (error) {
        console.error('Error getting filtered submissions:', error);
        throw error;
      }
    },
    
    // Get submission by ID
    getSubmissionById: async (id) => {
      try {
        const docRef = doc(db, 'contactSubmissions', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            ...data,
            createdAt: data.createdAt ? data.createdAt.toDate() : new Date()
          };
        }
        
        return null;
      } catch (error) {
        console.error('Error getting submission by ID:', error);
        throw error;
      }
    },
    
    // Create new submission
    createSubmission: async (data) => {
      try {
        const docRef = await addDoc(collection(db, 'contactSubmissions'), {
          ...data,
          fullName: `${data.firstName} ${data.lastName}`,
          status: 'new',
          viewed: false,
          createdAt: serverTimestamp()
        });
        
        return docRef.id;
      } catch (error) {
        console.error('Error creating submission:', error);
        throw error;
      }
    },
    
    // Update submission
    updateSubmission: async (id, data) => {
      try {
        const docRef = doc(db, 'contactSubmissions', id);
        await updateDoc(docRef, {
          ...data,
          updatedAt: serverTimestamp()
        });
        
        return true;
      } catch (error) {
        console.error('Error updating submission:', error);
        throw error;
      }
    },
    
    // Delete submission
    deleteSubmission: async (id) => {
      try {
        const docRef = doc(db, 'contactSubmissions', id);
        await deleteDoc(docRef);
        
        return true;
      } catch (error) {
        console.error('Error deleting submission:', error);
        throw error;
      }
    },
    
    // Get unread submissions count
    getUnreadCount: async () => {
      try {
        const q = query(
          collection(db, 'contactSubmissions'),
          where('viewed', '==', false)
        );
        
        const querySnapshot = await getDocs(q);
        return querySnapshot.size;
      } catch (error) {
        console.error('Error getting unread count:', error);
        throw error;
      }
    },
    
    // Mark submission as read
    markAsRead: async (id) => {
      try {
        const docRef = doc(db, 'contactSubmissions', id);
        await updateDoc(docRef, {
          viewed: true,
          updatedAt: serverTimestamp()
        });
        
        return true;
      } catch (error) {
        console.error('Error marking submission as read:', error);
        throw error;
      }
    }
  };
  
  export default contactSubmissionsService;