// components/gallery/GalleryGrid.js - Updated with 5-column grid and video thumbnail support
import { useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { useInView } from 'react-intersection-observer';
import { FaPlay, FaVideo } from 'react-icons/fa';
import { cloudinaryService } from '../../lib/cloudinaryService';

const GridContainer = styled.div`
  margin-top: 2rem;
`;

// Updated grid to display exactly 5 items per row
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* Exactly 5 columns */
  gap: 1rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr); /* 3 columns on medium screens */
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr); /* 2 columns on smaller screens */
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr; /* 1 column on very small screens */
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
`;

const VideoLabel = styled.div`
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
  padding: 0 10px;
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

const ImageDescription = styled.p`
  margin: 0.25rem 0 0;
  font-size: 0.9rem;
  opacity: 0.9;
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
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
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
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
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

const GalleryGrid = ({ items = [], onImageClick, loading = false, lastItemRef }) => {
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
    </GridContainer>
  );
};

export default GalleryGrid;