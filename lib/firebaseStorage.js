// lib/firebaseStorage.js
import { getStorage, ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
import { app } from './firebase';

const storage = getStorage(app);

export const storageService = {
  // Upload file to Firebase Storage
  uploadImage: async (file, path) => {
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error('Error uploading file to Firebase Storage:', error);
      throw error;
    }
  },

  // Upload multiple files
  uploadMultiple: async (files, basePath) => {
    try {
      const results = [];
      
      for (const file of files) {
        const filePath = `${basePath}/${Date.now()}-${file.name}`;
        const url = await storageService.uploadImage(file, filePath);
        
        results.push({
          name: file.name,
          path: filePath,
          url
        });
      }
      
      return results;
    } catch (error) {
      console.error('Error uploading multiple files:', error);
      throw error;
    }
  },

  // Get list of files from a directory
  listFiles: async (directory) => {
    try {
      const listRef = ref(storage, directory);
      const res = await listAll(listRef);
      const items = await Promise.all(
        res.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          return {
            name: itemRef.name,
            fullPath: itemRef.fullPath,
            url
          };
        })
      );
      return items;
    } catch (error) {
      console.error('Error listing files from Firebase Storage:', error);
      throw error;
    }
  },

  // Delete file from Firebase Storage
  deleteFile: async (path) => {
    try {
      const fileRef = ref(storage, path);
      await deleteObject(fileRef);
      return true;
    } catch (error) {
      console.error('Error deleting file from Firebase Storage:', error);
      throw error;
    }
  }
};

export default storageService;