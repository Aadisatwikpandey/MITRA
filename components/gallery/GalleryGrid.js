// components/gallery/GalleryGrid.js - Browser-compatible version
import { useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { useInView } from 'react-intersection-observer';
import { cloudinaryService } from '../../lib/cloudinaryService';

const GridContainer = styled.div`
  margin-top: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
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
  aspect-ratio: ${props => props.aspectRatio || '1/1'};
  
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

const GalleryItem = ({ item, index, onClick, isLastItem, lastItemRef }) => {
  const [loaded, setLoaded] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px',
  });
  
  // Calculate aspect ratio
  const aspectRatio = item.width && item.height 
    ? `${item.width}/${item.height}` 
    : '1/1';
  
  // Get image URLs - use Cloudinary URL if available, fallback to regular URL
  const imageUrl = item.cloudinaryUrl || item.firebaseUrl;
  
  // If we have a Cloudinary public ID, use the Cloudinary service for optimized URLs
  const thumbnailUrl = item.cloudinaryPublicId
    ? cloudinaryService.getThumbnailUrl(item.cloudinaryPublicId, 300)
    : imageUrl;
  
  const fullUrl = item.cloudinaryPublicId
    ? cloudinaryService.getOptimizedUrl(item.cloudinaryPublicId, {
        width: 800, 
        quality: 'auto',
        format: 'auto'
      })
    : imageUrl;
  
  // Combine refs for last item
  const combineRefs = (el) => {
    ref(el);
    if (isLastItem && lastItemRef) {
      lastItemRef(el);
    }
  };
  
  return (
    <ImageContainer 
      ref={combineRefs}
      aspectRatio={aspectRatio} 
      onClick={() => onClick(index)}
    >
      {inView && (
        <>
          {!loaded && thumbnailUrl && <BlurImage src={thumbnailUrl} />}
          {fullUrl && (
            <Image
              src={fullUrl}
              alt={item.title || 'Gallery image'}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: 'cover' }}
              loading="lazy"
              onLoad={() => setLoaded(true)}
            />
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
        <h3>No Images Found</h3>
        <p>There are no images available in this category.</p>
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