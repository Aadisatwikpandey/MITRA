// components/gallery/GalleryLightbox.js - Browser-compatible version
import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { FaTimes, FaArrowLeft, FaArrowRight, FaDownload } from 'react-icons/fa';
import { cloudinaryService } from '../../lib/cloudinaryService';

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

const LightboxHeader = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  z-index: 1010;
`;

const CloseButton = styled.button`
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
    transform: scale(1.1);
  }
`;

const DownloadButton = styled.a`
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  height: 40px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
    transform: scale(1.05);
  }
`;

const LightboxContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ImageContainer = styled.div`
  position: relative;
  max-width: 90%;
  max-height: 80vh;
  width: auto;
  height: auto;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledImage = styled.img`
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1010;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
  
  &.prev {
    left: 20px;
  }
  
  &.next {
    right: 20px;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    width: 40px;
    height: 40px;
    
    &.prev {
      left: 10px;
    }
    
    &.next {
      right: 10px;
    }
  }
`;

const Caption = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0));
  color: white;
  padding: 2rem 1rem 1rem;
  text-align: center;
  z-index: 1010;
`;

const ImageTitle = styled.h3`
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
`;

const ImageDescription = styled.p`
  margin: 0;
  font-size: 1rem;
  opacity: 0.9;
`;

const Counter = styled.div`
  color: white;
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  font-size: 0.9rem;
`;

const Loading = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
`;

const Spinner = styled.div`
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid white;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const GalleryLightbox = ({ items = [], startIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [loading, setLoading] = useState(true);
  
  const currentItem = items[currentIndex] || {};
  
  // Generate optimized URL for full-size image
  let fullSizeUrl = '';
  if (currentItem.cloudinaryPublicId) {
    fullSizeUrl = cloudinaryService.getOptimizedUrl(currentItem.cloudinaryPublicId, {
      quality: 'auto',
      format: 'auto'
    });
  } else {
    fullSizeUrl = currentItem.cloudinaryUrl || currentItem.firebaseUrl || '';
  }
  
  // Generate download URL
  let downloadUrl = '';
  if (currentItem.cloudinaryPublicId) {
    downloadUrl = cloudinaryService.getOptimizedUrl(currentItem.cloudinaryPublicId, {
      quality: 90,
      format: 'jpg',
      flags: 'attachment'
    });
  } else {
    downloadUrl = currentItem.cloudinaryUrl || currentItem.firebaseUrl || '';
  }
  
  // Handle image navigation
  const showPrevious = () => {
    setLoading(true);
    setCurrentIndex(prev => (prev === 0 ? items.length - 1 : prev - 1));
  };
  
  const showNext = () => {
    setLoading(true);
    setCurrentIndex(prev => (prev === items.length - 1 ? 0 : prev + 1));
  };
  
  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowLeft') {
      showPrevious();
    } else if (e.key === 'ArrowRight') {
      showNext();
    } else if (e.key === 'Escape') {
      onClose();
    }
  }, [currentIndex, items.length]);
  
  // Set up keyboard listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    
    // Disable body scroll
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      
      // Re-enable body scroll
      document.body.style.overflow = 'auto';
    };
  }, [handleKeyDown]);
  
  // Handle image load
  const handleImageLoad = () => {
    setLoading(false);
  };
  
  return (
    <LightboxOverlay onClick={onClose}>
      <LightboxHeader>
        <CloseButton onClick={onClose}>
          <FaTimes size={20} />
        </CloseButton>
        
        <Counter>{currentIndex + 1} / {items.length}</Counter>
        
        <DownloadButton 
          href={downloadUrl}
          download={`${currentItem.title || 'mitra-gallery-image'}.jpg`}
          onClick={e => e.stopPropagation()}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaDownload size={16} />
          Download
        </DownloadButton>
      </LightboxHeader>
      
      <LightboxContent onClick={e => e.stopPropagation()}>
        {loading && (
          <Loading>
            <Spinner />
            <div>Loading...</div>
          </Loading>
        )}
        
        <ImageContainer>
          <ImageWrapper>
            <StyledImage 
              src={fullSizeUrl} 
              alt={currentItem.title || 'Gallery image'}
              onLoad={handleImageLoad}
            />
          </ImageWrapper>
        </ImageContainer>
        
        {items.length > 1 && (
          <>
            <NavigationButton 
              className="prev" 
              onClick={(e) => {
                e.stopPropagation();
                showPrevious();
              }}
            >
              <FaArrowLeft size={20} />
            </NavigationButton>
            
            <NavigationButton 
              className="next" 
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
            >
              <FaArrowRight size={20} />
            </NavigationButton>
          </>
        )}
        
        {(currentItem.title || currentItem.description) && (
          <Caption>
            {currentItem.title && <ImageTitle>{currentItem.title}</ImageTitle>}
            {currentItem.description && <ImageDescription>{currentItem.description}</ImageDescription>}
          </Caption>
        )}
      </LightboxContent>
    </LightboxOverlay>
  );
};

export default GalleryLightbox;