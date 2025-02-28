// lib/galleryService.js - Browser-compatible version
import { 
    db, 
    collection, 
    getDocs, 
    getDoc, 
    query, 
    where, 
    orderBy, 
    limit, 
    doc 
  } from './firebase';
  
  // Helper to convert Firestore timestamps to JS Dates
  const convertTimestamps = (data) => {
    if (!data) return null;
    
    const result = { ...data };
    
    if (result.createdAt && typeof result.createdAt.toDate === 'function') {
      result.createdAt = result.createdAt.toDate();
    }
    
    if (result.updatedAt && typeof result.updatedAt.toDate === 'function') {
      result.updatedAt = result.updatedAt.toDate();
    }
    
    return result;
  };
  
  export const galleryService = {
    // Get all gallery items
    getAllGalleryItems: async () => {
      try {
        const querySnapshot = await getDocs(
          query(collection(db, 'gallery'), orderBy('createdAt', 'desc'))
        );
        
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...convertTimestamps(doc.data())
        }));
      } catch (error) {
        console.error('Error getting all gallery items:', error);
        throw error;
      }
    },
    
    // Get gallery categories
    getGalleryCategories: async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'gallery-categories'));
        
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Error getting gallery categories:', error);
        throw error;
      }
    },
    
    // Get gallery item by ID
    getGalleryItemById: async (id) => {
      try {
        const docRef = doc(db, 'gallery', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          return {
            id: docSnap.id,
            ...convertTimestamps(docSnap.data())
          };
        } else {
          return null;
        }
      } catch (error) {
        console.error('Error getting gallery item by ID:', error);
        throw error;
      }
    }
  };
  
  export default galleryService;