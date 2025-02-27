// lib/newsService.js
import { 
    db, 
    collection, 
    getDocs, 
    getDoc, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    orderBy, 
    limit, 
    Timestamp, 
    doc, 
    increment 
  } from './firebase';
  
  // Helper to convert Firestore timestamps to JS Dates
  const convertTimestamps = (data) => {
    if (!data) return null;
    
    const result = { ...data };
    
    // Convert all potential timestamp fields to dates
    if (result.publishDate && typeof result.publishDate.toDate === 'function') {
      result.publishDate = result.publishDate.toDate();
    }
    
    if (result.createdAt && typeof result.createdAt.toDate === 'function') {
      result.createdAt = result.createdAt.toDate();
    }
    
    if (result.updatedAt && typeof result.updatedAt.toDate === 'function') {
      result.updatedAt = result.updatedAt.toDate();
    }
    
    return result;
  };
  
  export const newsService = {
    // Get all news items
    getAllNews: async () => {
      try {
        const querySnapshot = await getDocs(
          query(collection(db, 'news'), orderBy('publishDate', 'desc'))
        );
        
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...convertTimestamps(doc.data())
        }));
      } catch (error) {
        console.error('Error getting all news:', error);
        throw error;
      }
    },
    
    // Get paginated news
    getPaginatedNews: async (lastDoc = null, itemsPerPage = 10) => {
      try {
        let newsQuery;
        
        if (lastDoc) {
          newsQuery = query(
            collection(db, 'news'),
            orderBy('publishDate', 'desc'),
            startAfter(lastDoc),
            limit(itemsPerPage)
          );
        } else {
          newsQuery = query(
            collection(db, 'news'),
            orderBy('publishDate', 'desc'),
            limit(itemsPerPage)
          );
        }
        
        const querySnapshot = await getDocs(newsQuery);
        
        const docs = querySnapshot.docs;
        const lastVisible = docs.length > 0 ? docs[docs.length - 1] : null;
        
        const news = docs.map(doc => ({
          id: doc.id,
          ...convertTimestamps(doc.data())
        }));
        
        return { news, lastDoc: lastVisible };
      } catch (error) {
        console.error('Error getting paginated news:', error);
        throw error;
      }
    },
    
    // Get news by category
    getNewsByCategory: async (category) => {
      try {
        const querySnapshot = await getDocs(
          query(
            collection(db, 'news'),
            where('category', '==', category),
            orderBy('publishDate', 'desc')
          )
        );
        
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...convertTimestamps(doc.data())
        }));
      } catch (error) {
        console.error('Error getting news by category:', error);
        throw error;
      }
    },
    
    // Get featured news
    getFeaturedNews: async () => {
      try {
        const querySnapshot = await getDocs(
          query(
            collection(db, 'news'),
            where('featured', '==', true),
            orderBy('publishDate', 'desc'),
            limit(1)
          )
        );
        
        const featured = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...convertTimestamps(doc.data())
        }));
        
        return featured.length > 0 ? featured[0] : null;
      } catch (error) {
        console.error('Error getting featured news:', error);
        throw error;
      }
    },
    
    // Get news by ID
    getNewsById: async (id) => {
      try {
        const docRef = doc(db, 'news', id);
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
        console.error('Error getting news by ID:', error);
        throw error;
      }
    },
    
    // Get news by slug
    getNewsBySlug: async (slug) => {
      try {
        const querySnapshot = await getDocs(
          query(
            collection(db, 'news'),
            where('slug', '==', slug)
          )
        );
        
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          
          return {
            id: doc.id,
            ...convertTimestamps(doc.data())
          };
        } else {
          return null;
        }
      } catch (error) {
        console.error('Error getting news by slug:', error);
        throw error;
      }
    },
    
    // Create news
    createNews: async (newsData) => {
      try {
        // Format the data for Firestore
        const formattedData = {
          ...newsData,
          publishDate: Timestamp.fromDate(new Date(newsData.publishDate || new Date())),
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          likes: 0,
          viewCount: 0
        };
        
        const docRef = await addDoc(collection(db, 'news'), formattedData);
        
        return {
          id: docRef.id,
          ...convertTimestamps(formattedData)
        };
      } catch (error) {
        console.error('Error creating news:', error);
        throw error;
      }
    },
    
    // Update news
    updateNews: async (id, newsData) => {
      try {
        const docRef = doc(db, 'news', id);
        
        // Format the data for Firestore
        const formattedData = {
          ...newsData,
          updatedAt: Timestamp.now()
        };
        
        // Convert publishDate to Timestamp if it exists
        if (newsData.publishDate) {
          formattedData.publishDate = newsData.publishDate instanceof Date 
            ? Timestamp.fromDate(newsData.publishDate) 
            : Timestamp.fromDate(new Date(newsData.publishDate));
        }
        
        await updateDoc(docRef, formattedData);
        
        // Get the updated document
        const updatedDoc = await getDoc(docRef);
        
        return {
          id,
          ...convertTimestamps(updatedDoc.data())
        };
      } catch (error) {
        console.error('Error updating news:', error);
        throw error;
      }
    },
    
    // Delete news
    deleteNews: async (id) => {
      try {
        const docRef = doc(db, 'news', id);
        await deleteDoc(docRef);
        return true;
      } catch (error) {
        console.error('Error deleting news:', error);
        throw error;
      }
    },
    
    // Search news
    searchNews: async (term) => {
      try {
        // Firestore doesn't have full-text search, so we need to use a workaround
        // We'll get all news items and filter them client-side
        // In a production app, you might want to use Algolia or a similar service
        const querySnapshot = await getDocs(
          query(collection(db, 'news'), orderBy('publishDate', 'desc'))
        );
        
        const allNews = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...convertTimestamps(doc.data())
        }));
        
        // Simple search implementation
        return allNews.filter(item => 
          item.title.toLowerCase().includes(term.toLowerCase()) ||
          item.content.toLowerCase().includes(term.toLowerCase()) ||
          (item.excerpt && item.excerpt.toLowerCase().includes(term.toLowerCase()))
        );
      } catch (error) {
        console.error('Error searching news:', error);
        throw error;
      }
    },
    
    // Add like to news
    likeNews: async (id) => {
      try {
        const docRef = doc(db, 'news', id);
        await updateDoc(docRef, {
          likes: increment(1)
        });
        return true;
      } catch (error) {
        console.error('Error liking news:', error);
        throw error;
      }
    },
    
    // Increment view count
    incrementViewCount: async (id) => {
      try {
        const docRef = doc(db, 'news', id);
        await updateDoc(docRef, {
          viewCount: increment(1)
        });
        return true;
      } catch (error) {
        console.error('Error incrementing view count:', error);
        throw error;
      }
    },
    
    // Get related news
    getRelatedNews: async (currentNewsId, category, numItems = 3) => {
      try {
        const querySnapshot = await getDocs(
          query(
            collection(db, 'news'),
            where('category', '==', category),
            orderBy('publishDate', 'desc'),
            limit(numItems + 1) // Get one extra to filter out current article
          )
        );
        
        return querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...convertTimestamps(doc.data())
          }))
          .filter(item => item.id !== currentNewsId)
          .slice(0, numItems);
      } catch (error) {
        console.error('Error getting related news:', error);
        throw error;
      }
    },
    
    // Get statistics
    getStatistics: async () => {
      try {
        // Get total news count
        const newsSnapshot = await getDocs(collection(db, 'news'));
        const totalNews = newsSnapshot.size;
        
        // Get featured news
        const featuredSnapshot = await getDocs(
          query(collection(db, 'news'), where('featured', '==', true))
        );
        const featuredCount = featuredSnapshot.size;
        
        // Get total views
        let totalViews = 0;
        newsSnapshot.forEach(doc => {
          const data = doc.data();
          totalViews += data.viewCount || 0;
        });
        
        // Get total likes
        let totalLikes = 0;
        newsSnapshot.forEach(doc => {
          const data = doc.data();
          totalLikes += data.likes || 0;
        });
        
        // Get categories with counts
        const categories = {};
        newsSnapshot.forEach(doc => {
          const data = doc.data();
          const category = data.category;
          if (category) {
            categories[category] = (categories[category] || 0) + 1;
          }
        });
        
        return {
          totalNews,
          featuredCount,
          totalViews,
          totalLikes,
          categories
        };
      } catch (error) {
        console.error('Error getting statistics:', error);
        throw error;
      }
    }
  };
  
  export default newsService;