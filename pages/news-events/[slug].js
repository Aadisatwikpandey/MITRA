// pages/news-events/[slug].js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { newsService } from '../../lib/newsService';
import { trackPageView } from '../../utils/analytics';
import NewsDetail from '../../components/news/NewsDetail';
import styles from '../../styles/news/NewsEventsPage.module.css';

// Helper function to convert Date objects to ISO strings for serialization
const serializeData = (data) => {
  if (!data) return null;
  
  // Create a new object with serialized data
  const serialized = { ...data };
  
  // Convert Date objects to ISO strings
  if (serialized.publishDate instanceof Date) {
    serialized.publishDate = serialized.publishDate.toISOString();
  }
  
  // Handle updatedAt (Firestore Timestamp)
  if (serialized.updatedAt) {
    // Convert Timestamp to ISO string if it has toDate()
    if (typeof serialized.updatedAt.toDate === 'function') {
      serialized.updatedAt = serialized.updatedAt.toDate().toISOString();
    } else if (serialized.updatedAt instanceof Date) {
      serialized.updatedAt = serialized.updatedAt.toISOString();
    } else {
      // Remove if not serializable
      delete serialized.updatedAt;
    }
  }
  
  // Handle createdAt (Firestore Timestamp)
  if (serialized.createdAt) {
    // Convert Timestamp to ISO string if it has toDate()
    if (typeof serialized.createdAt.toDate === 'function') {
      serialized.createdAt = serialized.createdAt.toDate().toISOString();
    } else if (serialized.createdAt instanceof Date) {
      serialized.createdAt = serialized.createdAt.toISOString();
    } else {
      // Remove if not serializable
      delete serialized.createdAt;
    }
  }
  
  return serialized;
};

// Helper function to convert arrays with Date objects
const serializeArray = (array) => {
  if (!array || !Array.isArray(array)) return [];
  
  return array.map(item => serializeData(item));
};

export default function NewsDetailPage({ newsItem, relatedNews, error }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState(error || null);
  
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
  
  const [newsData, setNewsData] = useState(parseDate(newsItem));
  const [relatedNewsData, setRelatedNewsData] = useState(
    Array.isArray(relatedNews) ? relatedNews.map(parseDate) : []
  );
  
  // Handle loading state for client-side routing
  useEffect(() => {
    if (router.isFallback) {
      setLoading(true);
    }
  }, [router.isFallback]);
  
  // Initialize analytics
  useEffect(() => {
    if (newsData) {
      trackPageView(`/news-events/${newsData.slug}`);
    }
  }, [newsData]);
  
  // If we have no data and the slug exists, try to fetch it client-side
  // This is for development/fallback for SSR failures
  useEffect(() => {
    const fetchNewsItem = async () => {
      if (!newsData && router.query.slug) {
        setLoading(true);
        try {
          const item = await newsService.getNewsBySlug(router.query.slug);
          
          if (item) {
            setNewsData(item);
            
            // Get related news (same category, excluding current)
            const related = await newsService.getRelatedNews(item.id, item.category, 3);
            setRelatedNewsData(related);
          } else {
            setPageError('News article not found');
          }
        } catch (err) {
          console.error('Error fetching news item:', err);
          setPageError('Failed to load news article. Please try again later.');
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchNewsItem();
  }, [router.query.slug, newsData]);
  
  // Handle case when we're still waiting for the slug
  if (router.isFallback || loading) {
    return (
      <div className={styles.contentContainer}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
        </div>
      </div>
    );
  }
  
  // Handle error state
  if (pageError || !newsData) {
    return (
      <div className={styles.contentContainer}>
        <div className={styles.error}>
          <h1>Article Not Found</h1>
          <p>{pageError || 'The article you are looking for does not exist or has been removed.'}</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>{newsData.title} | MITRA News & Events</title>
        <meta name="description" content={newsData.excerpt || newsData.content.substring(0, 160)} />
        {/* Open Graph tags for better social sharing */}
        <meta property="og:title" content={newsData.title} />
        <meta property="og:description" content={newsData.excerpt || newsData.content.substring(0, 160)} />
        {newsData.image && <meta property="og:image" content={newsData.image} />}
        <meta property="og:type" content="article" />
      </Head>
      
      <NewsDetail news={newsData} relatedNews={relatedNewsData} />
    </>
  );
}

// This function fetches data on the server side
export async function getServerSideProps({ params }) {
  try {
    const { slug } = params;
    
    // Get news item by slug
    const newsItem = await newsService.getNewsBySlug(slug);
    
    if (!newsItem) {
      return {
        props: {
          newsItem: null,
          relatedNews: [],
          error: 'News article not found'
        }
      };
    }
    
    // Get related news (same category, excluding current)
    const relatedNews = await newsService.getRelatedNews(newsItem.id, newsItem.category, 3);
    
    // Serialize the data to make it safe for Next.js props
    return {
      props: {
        newsItem: serializeData(newsItem),
        relatedNews: serializeArray(relatedNews),
        error: null
      }
    };
  } catch (error) {
    console.error('Error fetching news item:', error);
    return {
      props: {
        newsItem: null,
        relatedNews: [],
        error: 'Failed to load news article. Please try again later.'
      }
    };
  }
}