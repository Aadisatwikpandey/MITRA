// Enhanced GalleryGrid.js with improved responsive design
import { useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { useInView } from 'react-intersection-observer';
import { FaPlay, FaVideo } from 'react-icons/fa';

const GridContainer = styled.div`
  margin-top: 2rem;
  width: 100%;
`;

// Enhanced grid with improved responsive design
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  
  /* More granular responsive breakpoints */
  @media (max-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
  }
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.8rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  background-color: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  aspect-ratio: 1/1;
  
  &:hover {
    transform: scale(1.03);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }
  
  &:hover .image-overlay {
    opacity: 1;
  }
  
  /* Better touch device handling */
  @media (hover: none) {
    .image-overlay {
      opacity: 0.8;
    }
  }
`;

const PlayButton = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  
  svg {
    color: #1E8449;
    font-size: 24px;
    margin-left: 4px; /* Slightly offset for play icon */
  }
  
  /* Responsive sizing for play button */
  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    
    svg {
      font-size: 20px;
    }
  }
  
  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    
    svg {
      font-size: 16px;
    }
  }
`;

const VideoPlaceholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #2C3E50;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  
  svg {
    font-size: 40px;
    margin-bottom: 10px;
  }
  
  /* Responsive adjustments for placeholder */
  @media (max-width: 768px) {
    svg {
      font-size: 32px;
      margin-bottom: 8px;
    }
  }
`;

const VideoLabel = styled.div`
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
  padding: 0 10px;
  
  /* Better text handling for smaller screens */
  @media (max-width: 768px) {
    font-size: 12px;
    margin-top: 5px;
  }
  
  /* Show less text on very small screens */
  @media (max-width: 480px) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 90%;
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
  
  /* Improved overlay for touch devices */
  @media (hover: none) {
    padding: 1rem;
  }
  
  /* More compact on smaller screens */
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ImageTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  
  /* Responsive font sizing */
  @media (max-width: 992px) {
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const ImageDescription = styled.p`
  margin: 0.25rem 0 0;
  font-size: 0.9rem;
  opacity: 0.9;
  
  /* Responsive font sizing and truncation */
  @media (max-width: 992px) {
    font-size: 0.8rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  @media (max-width: 480px) {
    -webkit-line-clamp: 1;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
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

const NoItems = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: #f8f8f8;
  border-radius: 8px;
  margin: 2rem 0;
`;

const BlurImage = styled.div`
  position: absolute;
  inset: 0;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  filter: blur(10px);
  transform: scale(1.1);
  z-index: 1;
  opacity: 0.5;
`;

// Responsive grid container that maintains consistent spacing
const ResponsiveContainer = styled.div`
  padding: 0 1rem;
  
  @media (max-width: 480px) {
    padding: 0 0.5rem;
  }
`;

// Improved load more button with better responsive behavior
const LoadMoreButton = styled.button`
  display: block;
  margin: 2rem auto;
  padding: 0.75rem 2rem;
  background-color: transparent;
  color: ${props => props.theme.colors.primary};
  border: 2px solid ${props => props.theme.colors.primary};
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
  
  /* Responsive button on smaller screens */
  @media (max-width: 768px) {
    width: 80%;
    padding: 0.75rem 1rem;
  }
  
  @media (max-width: 480px) {
    width: 100%;
  }
`;

// Video file extensions
const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.flv', '.wmv', '.mkv'];

// Helper function to check if a URL is a video
const isVideoURL = (url) => {
  if (!url) return false;
  return videoExtensions.some(ext => url.toLowerCase().includes(ext));
};

const GalleryItem = ({ item, index, onClick, isLastItem, lastItemRef }) => {
  const [loaded, setLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px',
  });
  
  // Determine if the item is a video - check both mediaType and URL
  const isVideo = item.mediaType === 'video' || isVideoURL(item.firebaseUrl);
  
  // Determine the proper URL to display
  // For videos, use thumbnailUrl first, then we'll fall back to a placeholder
  const displayUrl = isVideo 
    ? (item.thumbnailUrl || '/images/video-thumbnail-placeholder.jpg')
    : (item.cloudinaryUrl || item.firebaseUrl || '/images/image-placeholder.jpg');
  
  // Combine refs for last item
  const combineRefs = (el) => {
    ref(el);
    if (isLastItem && lastItemRef) {
      lastItemRef(el);
    }
  };
  
  // Extract the file name from the URL for display
  const getFileNameFromURL = (url) => {
    if (!url) return "Video";
    try {
      // Try to extract filename from URL
      const urlParts = url.split('/');
      let fileName = urlParts[urlParts.length - 1];
      
      // Remove query parameters
      if (fileName.includes('?')) {
        fileName = fileName.split('?')[0];
      }
      
      // URL decode
      fileName = decodeURIComponent(fileName);
      
      // Keep it reasonably short
      if (fileName.length > 20) {
        fileName = fileName.substring(0, 17) + '...';
      }
      
      return fileName;
    } catch {
      return "Video";
    }
  };
  
  const handleImageError = () => {
    console.log("Image failed to load:", displayUrl);
    setImageError(true);
  };
  
  return (
    <ImageContainer 
      ref={combineRefs}
      onClick={() => onClick(index)}
    >
      {inView && (
        <>
          {isVideo ? (
            <>
              {!imageError && item.thumbnailUrl ? (
                // Use the video thumbnail if available
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <Image
                    src={displayUrl}
                    alt={item.title || 'Video thumbnail'}
                    fill
                    sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 992px) 33vw, (max-width: 1200px) 25vw, 20vw"
                    style={{ objectFit: 'cover' }}
                    loading="lazy"
                    onError={handleImageError}
                    onLoad={() => setLoaded(true)}
                  />
                  <PlayButton>
                    <FaPlay />
                  </PlayButton>
                </div>
              ) : (
                // Fallback to a video placeholder if no thumbnail or error loading
                <VideoPlaceholder>
                  <FaVideo />
                  <VideoLabel>{item.title || getFileNameFromURL(item.firebaseUrl)}</VideoLabel>
                  <PlayButton>
                    <FaPlay />
                  </PlayButton>
                </VideoPlaceholder>
              )}
            </>
          ) : (
            // Regular image
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              {!loaded && <BlurImage src="/images/image-placeholder.jpg" />}
              <Image
                src={displayUrl}
                alt={item.title || 'Gallery item'}
                fill
                sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 992px) 33vw, (max-width: 1200px) 25vw, 20vw"
                style={{ objectFit: 'cover' }}
                loading="lazy"
                onError={handleImageError}
                onLoad={() => setLoaded(true)}
              />
            </div>
          )}
          
          <ImageOverlay className="image-overlay">
            {item.title && <ImageTitle>{item.title}</ImageTitle>}
            {item.description && <ImageDescription>{item.description}</ImageDescription>}
          </ImageOverlay>
        </>
      )}
    </ImageContainer>
  );
};

const GalleryGrid = ({ items = [], onImageClick, loading = false, lastItemRef, hasMore = false, onLoadMore = null }) => {
  if (loading && items.length === 0) {
    return (
      <LoadingContainer>
        <Spinner />
      </LoadingContainer>
    );
  }
  
  if (items.length === 0 && !loading) {
    return (
      <NoItems>
        <h3>No Items Found</h3>
        <p>There are no images or videos available in this category.</p>
      </NoItems>
    );
  }
  
  return (
    <ResponsiveContainer>
      <GridContainer>
        <Grid>
          {items.map((item, index) => (
            <GalleryItem
              key={item.id || index}
              item={item}
              index={index}
              onClick={onImageClick}
              isLastItem={index === items.length - 1}
              lastItemRef={lastItemRef}
            />
          ))}
        </Grid>
        
        {hasMore && !loading && onLoadMore && (
          <LoadMoreButton onClick={onLoadMore}>
            Load More
          </LoadMoreButton>
        )}
        
        {loading && items.length > 0 && (
          <LoadingContainer>
            <Spinner />
          </LoadingContainer>
        )}
      </GridContainer>
    </ResponsiveContainer>
  );
};

export default GalleryGrid;