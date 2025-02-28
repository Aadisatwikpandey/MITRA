// lib/galleryService.js - Browser-compatible version
import { 
    db, 
    collection, 
    getDocs, 
    getDoc, 
    addDoc,
    deleteDoc,
    query, 
    where, 
    orderBy, 
    limit, 
    doc, 
    startAfter
  } from './firebase';
  
  import { writeBatch as fsWriteBatch } from 'firebase/firestore';

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
    
    // Get paginated gallery items
    getPaginatedGalleryItems: async (lastDocument = null, itemsPerPage = 12) => {
      try {
        let galleryQuery;
        
        if (lastDocument) {
          galleryQuery = query(
            collection(db, 'gallery'),
            orderBy('createdAt', 'desc'),
            startAfter(lastDocument),
            limit(itemsPerPage)
          );
        } else {
          galleryQuery = query(
            collection(db, 'gallery'),
            orderBy('createdAt', 'desc'),
            limit(itemsPerPage)
          );
        }
        
        const querySnapshot = await getDocs(galleryQuery);
        const docs = querySnapshot.docs;
        const lastDoc = docs.length > 0 ? docs[docs.length - 1] : null;
        
        const items = docs.map(doc => ({
          id: doc.id,
          ...convertTimestamps(doc.data())
        }));
        
        return { items, lastDoc };
      } catch (error) {
        console.error('Error getting paginated gallery items:', error);
        throw error;
      }
    },
    
    // Get gallery items by category
    getGalleryItemsByCategory: async (categoryId, lastDocument = null, itemsPerPage = 12) => {
      try {
        let galleryQuery;
        
        if (lastDocument) {
          galleryQuery = query(
            collection(db, 'gallery'),
            where('category', '==', categoryId),
            orderBy('createdAt', 'desc'),
            startAfter(lastDocument),
            limit(itemsPerPage)
          );
        } else {
          galleryQuery = query(
            collection(db, 'gallery'),
            where('category', '==', categoryId),
            orderBy('createdAt', 'desc'),
            limit(itemsPerPage)
          );
        }
        
        const querySnapshot = await getDocs(galleryQuery);
        const docs = querySnapshot.docs;
        const lastDoc = docs.length > 0 ? docs[docs.length - 1] : null;
        
        const items = docs.map(doc => ({
          id: doc.id,
          ...convertTimestamps(doc.data())
        }));
        
        return { items, lastDoc };
      } catch (error) {
        console.error('Error getting gallery items by category:', error);
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
    
    // Add a new gallery item
    addGalleryItem: async (itemData) => {
      try {
        const docRef = await addDoc(collection(db, 'gallery'), itemData);
        return docRef.id;
      } catch (error) {
        console.error('Error adding gallery item:', error);
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
    },

    deleteCategoryWithItems: async (categoryId) => {
        try {
        // Get the category details first
        const categoryRef = doc(db, 'gallery-categories', categoryId);
        const categoryDoc = await getDoc(categoryRef);
        
        if (!categoryDoc.exists()) {
            throw new Error('Category not found');
        }
        
        const categoryData = categoryDoc.data();
        console.log(`Deleting category: ${categoryData.name} (${categoryId})`);
        
        // Get all gallery items for this category
        const galleryQuery = query(
            collection(db, 'gallery'),
            where('category', '==', categoryId)
        );
        
        const querySnapshot = await getDocs(galleryQuery);
        const itemsToDelete = querySnapshot.docs;
        
        console.log(`Found ${itemsToDelete.length} gallery items to delete`);
        
        // Use a batch write to delete items in batches of 500 (Firestore limit)
        const batchSize = 500;
        const batches = Math.ceil(itemsToDelete.length / batchSize);
        
        for (let i = 0; i < batches; i++) {
            // Use the directly imported writeBatch function
            const batch = fsWriteBatch(db);
            const batchItems = itemsToDelete.slice(i * batchSize, (i + 1) * batchSize);
            
            // Add each item to the batch delete
            batchItems.forEach(item => {
            const itemRef = doc(db, 'gallery', item.id);
            batch.delete(itemRef);
            });
            
            // Commit the batch
            await batch.commit();
            console.log(`Deleted batch ${i + 1}/${batches} of items`);
        }
        
        // Finally, delete the category itself
        await deleteDoc(categoryRef);
        console.log(`Category ${categoryId} deleted successfully`);
        
        return {
            success: true,
            deletedItems: itemsToDelete.length
        };
        } catch (error) {
        console.error('Error deleting category and items:', error);
        throw error;
        }
    },
    
    // Get all gallery items
    getAllGalleryItems: async () => {
        try {
        const querySnapshot = await getDocs(
            query(collection(db, 'gallery'), orderBy('createdAt', 'desc'))
        );
        
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
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
            ...docSnap.data()
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