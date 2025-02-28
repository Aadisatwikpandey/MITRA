// pages/gallery/Gallery.js
import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import GalleryGrid from '../../components/gallery/GalleryGrid';
import GalleryLightbox from '../../components/gallery/GalleryLightbox';
import GalleryCategories from '../../components/gallery/GalleryCategories';
import { collection, getDocs, query, where, orderBy, limit, startAfter } from '../../lib/firebase';
import { db } from '../../lib/firebase';

const ITEMS_PER_PAGE = 12;

const GalleryContainer = styled.div`
  padding: 0;
`;

const HeroSection = styled.header`
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/gallery-hero.jpg') no-repeat center center;
  background-size: cover;
  height: 40vh;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  margin-bottom: 3rem;
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: white;
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const LoadMoreContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 3rem 0;
`;

const LoadMoreButton = styled.button`
  background-color: transparent;
  color: ${props => props.theme.colors.primary};
  border: 2px solid ${props => props.theme.colors.primary};
  padding: 0.75rem 2rem;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary};
    color: white;
    transform: translateY(-2px);
  }
  
  &:disabled {
    background-color: #f5f5f5;
    color: #aaa;
    border-color: #ddd;
    cursor: not-allowed;
    transform: none;
  }
`;

const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  width: 100%;
`;

const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid ${props => props.theme.colors.primary};
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorContainer = styled.div`
  padding: 2rem;
  background-color: rgba(231, 76, 60, 0.1);
  border-radius: 8px;
  color: #e74c3c;
  margin: 2rem 0;
  text-align: center;
`;

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

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [error, setError] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  
  // Observer for infinite scrolling
  const observer = useRef();
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
  
  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch categories
        const catsSnapshot = await getDocs(collection(db, 'gallery-categories'));
        const cats = catsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
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
    if (!initialLoading && activeCategory) {
      resetAndLoadItems();
    }
  }, [activeCategory, initialLoading]);
  
  // Load more items
  const loadMoreItems = async (isInitial = false) => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let galleryQuery;
      
      if (activeCategory === 'all') {
        // Query all gallery items
        if (isInitial || !lastDoc) {
          galleryQuery = query(
            collection(db, 'gallery'),
            orderBy('createdAt', 'desc'),
            limit(ITEMS_PER_PAGE)
          );
        } else {
          galleryQuery = query(
            collection(db, 'gallery'),
            orderBy('createdAt', 'desc'),
            startAfter(lastDoc),
            limit(ITEMS_PER_PAGE)
          );
        }
      } else {
        // Query gallery items by category
        if (isInitial || !lastDoc) {
          galleryQuery = query(
            collection(db, 'gallery'),
            where('category', '==', activeCategory),
            orderBy('createdAt', 'desc'),
            limit(ITEMS_PER_PAGE)
          );
        } else {
          galleryQuery = query(
            collection(db, 'gallery'),
            where('category', '==', activeCategory),
            orderBy('createdAt', 'desc'),
            startAfter(lastDoc),
            limit(ITEMS_PER_PAGE)
          );
        }
      }
      
      const querySnapshot = await getDocs(galleryQuery);
      
      const docs = querySnapshot.docs;
      const newLastDoc = docs.length > 0 ? docs[docs.length - 1] : null;
      
      const items = docs.map(doc => ({
        id: doc.id,
        ...convertTimestamps(doc.data())
      }));
      
      if (isInitial) {
        setGalleryItems(items);
      } else {
        setGalleryItems(prev => [...prev, ...items]);
      }
      
      setLastDoc(newLastDoc);
      setHasMore(items.length === ITEMS_PER_PAGE);
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
  
  // Open lightbox
  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };
  
  // Close lightbox
  const closeLightbox = () => {
    setLightboxOpen(false);
  };
  
  return (
    <>
      <Head>
        <title>Gallery | MITRA</title>
        <meta name="description" content="Browse through images and memories from MITRA's activities, events, and impact in the community." />
      </Head>
      
      <GalleryContainer>
        <HeroSection>
          <PageTitle>Photo Gallery</PageTitle>
        </HeroSection>
        
        <ContentContainer>
          <GalleryCategories 
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
          
          {error && (
            <ErrorContainer>
              <p>{error}</p>
            </ErrorContainer>
          )}
          
          <GalleryGrid 
            items={galleryItems}
            onImageClick={openLightbox}
            loading={initialLoading}
            lastItemRef={lastItemRef}
          />
          
          {loading && !initialLoading && (
            <Loading>
              <Spinner />
            </Loading>
          )}
          
          {hasMore && !loading && galleryItems.length > 0 && (
            <LoadMoreContainer>
              <LoadMoreButton onClick={() => loadMoreItems()}>
                Load More
              </LoadMoreButton>
            </LoadMoreContainer>
          )}
          
          {lightboxOpen && (
            <GalleryLightbox
              items={galleryItems}
              startIndex={lightboxIndex}
              onClose={closeLightbox}
            />
          )}
        </ContentContainer>
      </GalleryContainer>
    </>
  );
}