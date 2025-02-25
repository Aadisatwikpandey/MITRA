// hooks/useNews.js
import { useState, useEffect } from 'react';
import { newsService } from '../lib/newsService';

export const useNews = (options = {}) => {
  const { 
    initialData = [],
    category = null,
    featured = false,
    search = '',
    limit = 10
  } = options;
  
  const [news, setNews] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  
  useEffect(() => {
    let isMounted = true;
    
    const fetchNews = async () => {
      try {
        setLoading(true);
        let result;
        
        // Fetch data based on options
        if (featured) {
          const featuredNews = await newsService.getFeaturedNews();
          result = featuredNews ? [featuredNews] : [];
        } else if (category && category !== 'All') {
          result = await newsService.getNewsByCategory(category);
        } else if (search) {
          result = await newsService.searchNews(search);
        } else {
          const { news: newsData, lastDoc: lastVisible } = await newsService.getPaginatedNews(null, limit);
          result = newsData;
          if (isMounted) {
            setLastDoc(lastVisible);
            setHasMore(newsData.length === limit);
          }
        }
        
        if (isMounted) {
          setNews(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchNews();
    
    return () => {
      isMounted = false;
    };
  }, [category, featured, search, limit]);
  
  // Function to load more news
  const loadMore = async () => {
    if (!lastDoc || !hasMore) return;
    
    try {
      setLoading(true);
      const { news: moreNews, lastDoc: newLastDoc } = await newsService.getPaginatedNews(lastDoc, limit);
      
      setNews(prevNews => [...prevNews, ...moreNews]);
      setLastDoc(newLastDoc);
      setHasMore(moreNews.length === limit);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to refresh the news data
  const refreshNews = async () => {
    try {
      setLoading(true);
      const { news: refreshedNews, lastDoc: newLastDoc } = await newsService.getPaginatedNews(null, limit);
      
      setNews(refreshedNews);
      setLastDoc(newLastDoc);
      setHasMore(refreshedNews.length === limit);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return {
    news,
    loading,
    error,
    hasMore,
    loadMore,
    refreshNews
  };
};

export default useNews;