// pages/gallery/Gallery.js - Fixed lightbox close button
import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styled from 'styled-components';
import GalleryCategories from '../../components/gallery/GalleryCategories';
// Import startAfter correctly
import { db, collection, getDocs, query, where, orderBy, limit } from '../../lib/firebase';
// Import startAfter from Firebase directly if needed
import { startAfter as fsStartAfter } from 'firebase/firestore';

const ITEMS_PER_PAGE = 15; // Increased to match 3 rows of 5 images

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

// Updated grid to display 5 items per row
const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr); // 5 columns instead of auto-fill
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr); // 3 columns on medium screens
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr); // 2 columns on smaller screens
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr; // 1 column on very small screens
  }
`;

const GalleryItem = styled.div`
  position: relative;
  background-color: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  aspect-ratio: 1/1;
  cursor: pointer;
  
  &:hover {
    transform: scale(1.03);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }
  
  &:hover .image-overlay {
    opacity: 1;
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 60%);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.5rem;
  color: white;
  z-index: 10;
`;

const ImageTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
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
  margin: 2rem 0;
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

const NoItems = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: #f8f8f8;
  border-radius: 8px;
  margin: 2rem 0;
`;

// Lightbox components
const LightboxOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LightboxContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LightboxImage = styled.img`
  max-width: 90%;
  max-height: 80vh;
  object-fit: contain;
`;

// Updated Close Button
const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1200; /* Higher z-index to ensure it's clickable */
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.1);
  }
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
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [error, setError] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  
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
      }
    };
    
    fetchInitialData();
  }, []);
  
  // Reset gallery when category changes
  useEffect(() => {
    if (activeCategory) {
      setGalleryItems([]);
      setLastDoc(null);
      setHasMore(true);
      loadMoreItems(true);
    }
  }, [activeCategory]);
  
  // Load more items
  const loadMoreItems = async (isInitial = false) => {
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
            fsStartAfter(lastDoc), // Use imported startAfter
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
            fsStartAfter(lastDoc), // Use imported startAfter
            limit(ITEMS_PER_PAGE)
          );
        }
      }
      
      const querySnapshot = await getDocs(galleryQuery);
      
      const docs = querySnapshot.docs;
      const newLastDoc = docs.length > 0 ? docs[docs.length - 1] : null;
      
      const items = docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...convertTimestamps(data)
        };
      });
      
      console.log(`Loaded ${items.length} items, hasMore: ${items.length === ITEMS_PER_PAGE}`);
      
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
  
  // Improved lightbox implementation with better event handling
  const SimpleLightbox = ({ item, onClose }) => {
    if (!item) return null;
    
    // Handle background click to close
    const handleBackgroundClick = (e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };
    
    // Handle close button click
    const handleCloseClick = (e) => {
      e.stopPropagation(); // Prevent event from bubbling to parent
      onClose();
    };
    
    // Handle escape key press to close
    useEffect(() => {
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      window.addEventListener('keydown', handleEscape);
      return () => {
        window.removeEventListener('keydown', handleEscape);
      };
    }, [onClose]);
    
    return (
      <LightboxOverlay onClick={handleBackgroundClick}>
        <CloseButton onClick={handleCloseClick}>×</CloseButton>
        <LightboxContent>
          <LightboxImage 
            src={item.firebaseUrl || item.cloudinaryUrl} 
            alt={item.title || 'Gallery image'} 
            onClick={(e) => e.stopPropagation()} // Prevent image click from closing
          />
        </LightboxContent>
      </LightboxOverlay>
    );
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
          
          {loading && galleryItems.length === 0 ? (
            <Loading>
              <Spinner />
            </Loading>
          ) : galleryItems.length === 0 ? (
            <NoItems>
              <h3>No Images Found</h3>
              <p>There are no images available in this category.</p>
            </NoItems>
          ) : (
            <GalleryGrid>
              {galleryItems.map((item, index) => (
                <GalleryItem 
                  key={item.id} 
                  onClick={() => openLightbox(index)}
                >
                  {(item.firebaseUrl || item.cloudinaryUrl) && (
                    <Image
                      src={item.firebaseUrl || item.cloudinaryUrl}
                      alt={item.title || 'Gallery image'}
                      fill
                      sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      style={{ objectFit: 'cover' }}
                    />
                  )}
                  <ImageOverlay className="image-overlay">
                    {item.title && <ImageTitle>{item.title}</ImageTitle>}
                  </ImageOverlay>
                </GalleryItem>
              ))}
            </GalleryGrid>
          )}
          
          {loading && galleryItems.length > 0 && (
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
            <SimpleLightbox 
              item={galleryItems[lightboxIndex]} 
              onClose={closeLightbox} 
            />
          )}
        </ContentContainer>
      </GalleryContainer>
    </>
  );
}