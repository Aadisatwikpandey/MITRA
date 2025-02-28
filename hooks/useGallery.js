// hooks/useGallery.js
import { useState, useEffect, useRef, useCallback } from 'react';
import { galleryService } from '../lib/galleryService';

/**
 * Custom hook for managing gallery with pagination, filtering, and lazy loading
 * @param {Object} options - Hook options
 * @param {number} options.itemsPerPage - Number of items to load per page
 * @param {string} options.initialCategory - Initial category to filter by
 * @returns {Object} Gallery state and functions
 */
export const useGallery = ({ itemsPerPage = 12, initialCategory = 'all' } = {}) => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [error, setError] = useState(null);
  
  // Reference for intersection observer
  const observer = useRef();
  
  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch categories
        const cats = await galleryService.getGalleryCategories();
        setCategories(cats);
        
        // Load initial gallery items
        await loadMoreItems(true);
        
      } catch (err) {
        console.error('Error fetching initial gallery data:', err);
        setError('Failed to load gallery. Please try again.');
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);
  
  // Reset gallery when category changes
  useEffect(() => {
    const resetAndLoadItems = async () => {
      setGalleryItems([]);
      setLastDoc(null);
      setHasMore(true);
      
      await loadMoreItems(true);
    };
    
    // Only run if not initial loading
    if (!initialLoading) {
      resetAndLoadItems();
    }
  }, [activeCategory, initialLoading]);
  
  // Set up intersection observer for the last item
  const lastItemRef = useCallback(node => {
    if (loading) return;
    
    if (observer.current) {
      observer.current.disconnect();
    }
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreItems();
      }
    });
    
    if (node) {
      observer.current.observe(node);
    }
  }, [loading, hasMore]);
  
  // Load more items
  const loadMoreItems = async (isInitial = false) => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let result;
      
      if (activeCategory === 'all') {
        result = await galleryService.getPaginatedGalleryItems(
          isInitial ? null : lastDoc, 
          itemsPerPage
        );
      } else {
        result = await galleryService.getGalleryItemsByCategory(
          activeCategory,
          isInitial ? null : lastDoc,
          itemsPerPage
        );
      }
      
      const { items, lastDoc: newLastDoc } = result;
      
      if (isInitial) {
        setGalleryItems(items);
      } else {
        setGalleryItems(prev => [...prev, ...items]);
      }
      
      setLastDoc(newLastDoc);
      setHasMore(items.length === itemsPerPage);
    } catch (err) {
      console.error('Error loading gallery items:', err);
      setError('Failed to load more images. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle category change
  const handleCategoryChange = (category) => {
    if (category === activeCategory) return;
    setActiveCategory(category);
  };
  
  return {
    galleryItems,
    categories,
    activeCategory,
    loading,
    initialLoading,
    hasMore,
    error,
    lastItemRef,
    handleCategoryChange,
    loadMoreItems
  };
};

export default useGallery;