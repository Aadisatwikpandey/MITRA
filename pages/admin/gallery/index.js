// pages/admin/gallery/index.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { FaUpload, FaTrash, FaEdit, FaFilm, FaImage, FaEye, FaFilter } from 'react-icons/fa';
import AdminLayout from '../../../components/admin/AdminLayout';
import { db, collection, getDocs, deleteDoc, doc, query, orderBy } from '../../../lib/firebase';
import { storageService } from '../../../lib/firebaseStorage';

const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.lightText};
  font-size: 1rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Button = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: #166638;
    transform: translateY(-2px);
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    transform: none;
  }
  
  &.secondary {
    background-color: white;
    color: ${props => props.theme.colors.primary};
    border: 1px solid ${props => props.theme.colors.primary};
    
    &:hover {
      background-color: rgba(30, 132, 73, 0.1);
    }
  }
  
  @media (max-width: 768px) {
    flex: 1;
    justify-content: center;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FilterLabel = styled.span`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
  
  @media (max-width: 768px) {
    flex: 1;
  }
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const GalleryItem = styled.div`
  position: relative;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1/1;
  background-color: #f5f5f5;
`;

const MediaTypeIcon = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const ItemContent = styled.div`
  padding: 1rem;
`;

const ItemTitle = styled.h3`
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemCategory = styled.span`
  display: inline-block;
  background-color: rgba(30, 132, 73, 0.1);
  color: ${props => props.theme.colors.primary};
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const ItemActions = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 0.5rem;
  z-index: 10;
`;

const ActionButton = styled.button`
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
  
  &.delete {
    background-color: rgba(231, 76, 60, 0.8);
  }
  
  &.view {
    background-color: rgba(52, 152, 219, 0.8);
  }
`;

const NoItems = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid ${props => props.theme.colors.primary};
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const DeleteConfirmOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const DeleteConfirmModal = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text};
`;

const ModalText = styled.p`
  margin-bottom: A2rem;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const DeleteButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #c0392b;
  }
`;

// Convert Firebase timestamp to JS Date
const convertTimestamp = (timestamp) => {
  if (!timestamp) return null;
  if (timestamp.toDate) return timestamp.toDate();
  if (timestamp.seconds) return new Date(timestamp.seconds * 1000);
  return timestamp;
};

const GalleryAdmin = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const router = useRouter();
  
  // Fetch gallery items and categories
  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const catsSnapshot = await getDocs(collection(db, 'gallery-categories'));
        const cats = catsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCategories(cats);
        
        // Fetch gallery items
        const galleryQuery = query(
          collection(db, 'gallery'),
          orderBy('createdAt', 'desc')
        );
        const gallerySnapshot = await getDocs(galleryQuery);
        const items = gallerySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: convertTimestamp(doc.data().createdAt),
          updatedAt: convertTimestamp(doc.data().updatedAt)
        }));
        
        setGalleryItems(items);
        setFilteredItems(items);
        
      } catch (err) {
        console.error('Error fetching gallery data:', err);
        setError('Failed to load gallery data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGalleryData();
  }, []);
  
  // Filter items when filters change
  useEffect(() => {
    let results = [...galleryItems];
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      results = results.filter(item => item.category === categoryFilter);
    }
    
    // Apply media type filter
    if (typeFilter !== 'all') {
      results = results.filter(item => item.mediaType === typeFilter);
    }
    
    setFilteredItems(results);
  }, [categoryFilter, typeFilter, galleryItems]);
  
  // Handle category filter change
  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
  };
  
  // Handle media type filter change
  const handleTypeChange = (e) => {
    setTypeFilter(e.target.value);
  };
  
  // Open delete confirmation modal
  const confirmDelete = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };
  
  // Close delete confirmation modal
  const cancelDelete = () => {
    setItemToDelete(null);
    setShowDeleteModal(false);
  };
  
  // Delete gallery item
  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'gallery', itemToDelete.id));
      
      // Delete from Storage if path exists
      if (itemToDelete.firebasePath) {
        await storageService.deleteFile(itemToDelete.firebasePath);
      }
      
      // Update state
      const updatedItems = galleryItems.filter(item => item.id !== itemToDelete.id);
      setGalleryItems(updatedItems);
      
      // Close modal
      cancelDelete();
      
    } catch (err) {
      console.error('Error deleting gallery item:', err);
      setError('Failed to delete item. Please try again.');
      cancelDelete();
    }
  };
  
  // Navigate to upload page
  const goToUpload = () => {
    router.push('/admin/gallery/upload');
  };
  
  // Navigate to categories page
  const goToCategories = () => {
    router.push('/admin/gallery/categories');
  };
  
  // View item in lightbox or new tab
  const viewItem = (item) => {
    // For images, open in new tab
    window.open(item.firebaseUrl, '_blank');
  };
  
  // Render content based on loading/error state
  const renderContent = () => {
    if (loading) {
      return (
        <LoadingContainer>
          <Spinner />
          <p>Loading gallery items...</p>
        </LoadingContainer>
      );
    }
    
    if (error) {
      return (
        <NoItems>
          <h3>Error</h3>
          <p>{error}</p>
        </NoItems>
      );
    }
    
    if (filteredItems.length === 0) {
      return (
        <NoItems>
          <h3>No Gallery Items Found</h3>
          <p>
            {galleryItems.length === 0
              ? 'Your gallery is empty. Upload images and videos to get started.'
              : 'No items match the current filters. Try changing your filter settings.'}
          </p>
          <Button onClick={goToUpload} style={{ margin: '1rem auto', display: 'block' }}>
            <FaUpload /> Upload Media
          </Button>
        </NoItems>
      );
    }
    
    return (
      <GalleryGrid>
        {filteredItems.map(item => (
          <GalleryItem key={item.id}>
            <ImageContainer>
              {item.mediaType === 'image' ? (
                <Image
                  src={item.firebaseUrl}
                  alt={item.title || 'Gallery image'}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div style={{ 
                  width: '100%', 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: '#f5f5f5'
                }}>
                  <FaFilm size={50} color="#999" />
                </div>
              )}
              
              <MediaTypeIcon>
                {item.mediaType === 'image' ? <FaImage size={14} /> : <FaFilm size={14} />}
              </MediaTypeIcon>
              
              <ItemActions>
                <ActionButton className="view" onClick={() => viewItem(item)}>
                  <FaEye size={14} />
                </ActionButton>
                <ActionButton className="delete" onClick={() => confirmDelete(item)}>
                  <FaTrash size={14} />
                </ActionButton>
              </ItemActions>
            </ImageContainer>
            
            <ItemContent>
              <ItemTitle title={item.title}>{item.title || 'Untitled'}</ItemTitle>
              {item.categoryName && (
                <ItemCategory>{item.categoryName}</ItemCategory>
              )}
            </ItemContent>
          </GalleryItem>
        ))}
      </GalleryGrid>
    );
  };
  
  return (
    <AdminLayout>
      <Head>
        <title>Gallery Management | MITRA Admin</title>
      </Head>
      
      <Container>
        <Header>
          <div>
            <Title>Gallery Management</Title>
            <Subtitle>Manage images and videos in the gallery</Subtitle>
          </div>
          
          <ActionButtons>
            <Button className="secondary" onClick={goToCategories}>
              <FaFilter /> Categories
            </Button>
            <Button onClick={goToUpload}>
              <FaUpload /> Upload Media
            </Button>
          </ActionButtons>
        </Header>
        
        <FilterContainer>
          <FilterGroup>
            <FilterLabel>Category:</FilterLabel>
            <Select value={categoryFilter} onChange={handleCategoryChange}>
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel>Media Type:</FilterLabel>
            <Select value={typeFilter} onChange={handleTypeChange}>
              <option value="all">All Media</option>
              <option value="image">Images Only</option>
              <option value="video">Videos Only</option>
            </Select>
          </FilterGroup>
        </FilterContainer>
        
        {renderContent()}
      </Container>
      
      {showDeleteModal && (
        <DeleteConfirmOverlay>
          <DeleteConfirmModal>
            <ModalTitle>Confirm Deletion</ModalTitle>
            <ModalText>
              Are you sure you want to delete this item? This action cannot be undone.
            </ModalText>
            <ModalButtons>
              <CancelButton onClick={cancelDelete}>Cancel</CancelButton>
              <DeleteButton onClick={handleDelete}>Delete</DeleteButton>
            </ModalButtons>
          </DeleteConfirmModal>
        </DeleteConfirmOverlay>
      )}
    </AdminLayout>
  );
};

export default GalleryAdmin;