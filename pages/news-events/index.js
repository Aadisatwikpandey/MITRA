// pages/news-events/index.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { newsService } from '../../lib/newsService';
import { initAnalytics, trackPageView } from '../../utils/analytics';
import FeaturedNews from '../../components/news/FeaturedNews';
import NewsGrid from '../../components/news/NewsGrid';
import NewsFilters from '../../components/news/NewsFilters';
import Pagination from '../../components/news/Pagination';
import styles from '../../styles/news/NewsEventsPage.module.css';

// Number of items to show per page
const ITEMS_PER_PAGE = 6;

// Helper function to convert Date objects to ISO strings for serialization
const serializeData = (item) => {
  if (!item) return null;
  
  // Create a new object with serialized data
  const serialized = { ...item };
  
  // Convert Date objects to ISO strings
  if (serialized.publishDate instanceof Date) {
    serialized.publishDate = serialized.publishDate.toISOString();
  }
  
  // Remove non-serializable fields (or convert them if needed)
  if (serialized.updatedAt) {
    // Convert Timestamp to ISO string if it has toDate()
    if (typeof serialized.updatedAt.toDate === 'function') {
      serialized.updatedAt = serialized.updatedAt.toDate().toISOString();
    } else {
      // If it's already a Date
      serialized.updatedAt = new Date(serialized.updatedAt).toISOString();
    }
  }
  
  if (serialized.createdAt) {
    // Convert Timestamp to ISO string if it has toDate()
    if (typeof serialized.createdAt.toDate === 'function') {
      serialized.createdAt = serialized.createdAt.toDate().toISOString();
    } else {
      // If it's already a Date
      serialized.createdAt = new Date(serialized.createdAt).toISOString();
    }
  }
  
  return serialized;
};

// Helper function to convert arrays with Date objects
const serializeArray = (array) => {
  if (!array || !Array.isArray(array)) return [];
  
  return array.map(item => serializeData(item));
};

export default function NewsEvents({ initialNews = [], initialFeatured = null, categories = [], error = null }) {
  // Convert ISO date strings back to Date objects for client-side use
  const parseDate = (item) => {
    if (!item) return null;
    
    return {
      ...item,
      publishDate: item.publishDate ? new Date(item.publishDate) : null,
      updatedAt: item.updatedAt ? new Date(item.updatedAt) : null,
      createdAt: item.createdAt ? new Date(item.createdAt) : null
    };
  };
  
  // Parse initial data
  const parsedInitialNews = Array.isArray(initialNews) 
    ? initialNews.map(parseDate) 
    : [];
  
  const parsedFeatured = parseDate(initialFeatured);
  
  const [news, setNews] = useState(parsedInitialNews);
  const [filteredNews, setFilteredNews] = useState(parsedInitialNews);
  const [featuredNews, setFeaturedNews] = useState(parsedFeatured);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState(error || null);
  
  // Get unique categories from news items
  const uniqueCategories = [...new Set(news.map(item => item.category))].filter(Boolean);
  
  // Initialize analytics
  useEffect(() => {
    initAnalytics();
    trackPageView('/news-events');
  }, []);
  
  // Filter news based on category and search term
  useEffect(() => {
    let results = news;
    
    // Filter by category
    if (activeCategory !== 'All') {
      results = results.filter(item => item.category === activeCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(item => 
        item.title.toLowerCase().includes(term) || 
        item.excerpt?.toLowerCase().includes(term) ||
        item.content.toLowerCase().includes(term)
      );
    }
    
    setFilteredNews(results);
    setCurrentPage(1);
  }, [activeCategory, searchTerm, news]);
  
  // Fetch news if no initial data
  useEffect(() => {
    const fetchNews = async () => {
      if (news.length === 0 && !loading) {
        setLoading(true);
        try {
          const allNews = await newsService.getAllNews();
          setNews(allNews);
          setFilteredNews(allNews);
          
          const featured = await newsService.getFeaturedNews();
          setFeaturedNews(featured);
        } catch (error) {
          console.error('Error fetching news:', error);
          setPageError('Failed to load news. Please try again later.');
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchNews();
  }, [news.length, loading]);
  
  // Handle category change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };
  
  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
  };
  
  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    
    // Scroll to top of news grid
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: document.getElementById('news-grid')?.offsetTop - 100 || 0,
        behavior: 'smooth'
      });
    }
  };
  
  // Handle like
  const handleLike = (newsId) => {
    setNews(prev => 
      prev.map(item => 
        item.id === newsId ? 
          { ...item, likes: (item.likes || 0) + 1 } : 
          item
      )
    );
  };
  
  // Calculate current page items and total pages based on filtered news
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
  
  return (
    <>
      <Head>
        <title>News & Events | MITRA</title>
        <meta name="description" content="Stay updated with the latest news, events, and happenings at MITRA." />
      </Head>
      
      <div className={styles.pageContainer}>
        <header className={styles.heroSection}>
          <h1 className={styles.pageTitle}>News & Events</h1>
        </header>
        
        <div className={styles.contentContainer}>
          {pageError ? (
            <div className={styles.error}>
              <p>{pageError}</p>
            </div>
          ) : (
            <>
              <NewsFilters 
                categories={['All', ...uniqueCategories]}
                activeCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
                onSearch={handleSearch}
              />
              
              {loading ? (
                <div className={styles.loading}>
                  <div className={styles.spinner}></div>
                </div>
              ) : (
                <>
                  {featuredNews && activeCategory === 'All' && !searchTerm && currentPage === 1 && (
                    <FeaturedNews news={featuredNews} />
                  )}
                  
                  <div id="news-grid">
                    <NewsGrid 
                      news={paginatedNews}
                      title={
                        searchTerm 
                          ? `Search Results for "${searchTerm}"` 
                          : activeCategory !== 'All' 
                            ? activeCategory
                            : 'Latest News & Events'
                      }
                      onLike={handleLike}
                    />
                    
                    {totalPages > 1 && (
                      <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

// This function will fetch data server-side
export async function getServerSideProps() {
  try {
    // Fetch initial data
    const allNews = await newsService.getAllNews();
    const featuredNews = await newsService.getFeaturedNews();
    
    // Get unique categories
    const categories = [...new Set(allNews.map(item => item.category))].filter(Boolean);
    
    // Serialize data to make it safe for Next.js props
    return {
      props: {
        initialNews: serializeArray(allNews),
        initialFeatured: serializeData(featuredNews),
        categories,
        error: null
      }
    };
  } catch (error) {
    console.error('Error fetching news:', error);
    return {
      props: {
        initialNews: [],
        initialFeatured: null,
        categories: [],
        error: 'Failed to load news. Please try again later.'
      }
    };
  }
}