// pages/admin/gallery/categories.js - Updated with cascade delete functionality
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import AdminLayout from '../../../components/admin/AdminLayout';
import { db, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, Timestamp } from '../../../lib/firebase';
import { galleryService } from '../../../lib/galleryService';
import styled from 'styled-components';

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

const AddButton = styled.button`
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
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
`;

const TableHead = styled.thead`
  background-color: #f5f5f5;
`;

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
`;

const TableRow = styled.tr`
  border-top: 1px solid #eee;
  
  &:hover {
    background-color: #f9f9f9;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &.edit {
    color: #3498db;
    background-color: rgba(52, 152, 219, 0.1);
  }
  
  &.edit:hover {
    background-color: rgba(52, 152, 219, 0.2);
  }
  
  &.delete {
    color: #e74c3c;
    background-color: rgba(231, 76, 60, 0.1);
  }
  
  &.delete:hover {
    background-color: rgba(231, 76, 60, 0.2);
  }
  
  &.save {
    color: #27ae60;
    background-color: rgba(39, 174, 96, 0.1);
  }
  
  &.save:hover {
    background-color: rgba(39, 174, 96, 0.2);
  }
  
  &.cancel {
    color: #7f8c8d;
    background-color: rgba(127, 140, 141, 0.1);
  }
  
  &.cancel:hover {
    background-color: rgba(127, 140, 141, 0.2);
  }
`;

const EditableCell = styled.td`
  padding: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(30, 132, 73, 0.1);
  }
`;

const Form = styled.form`
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const FormButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const SubmitButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #166638;
    transform: translateY(-2px);
  }
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

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background-color: #f8f8f8;
  border-radius: 8px;
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

const LoadingText = styled.p`
  color: ${props => props.theme.colors.text};
`;

const NoCategories = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: #f8f8f8;
  border-radius: 8px;
  margin: 2rem 0;
`;

const ModalOverlay = styled.div`
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

const ModalContent = styled.div`
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
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ModalWarningIcon = styled(FaExclamationTriangle)`
  color: #f39c12;
`;

const ModalText = styled.p`
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const ModalWarning = styled.div`
  background-color: rgba(243, 156, 18, 0.1);
  border-left: 4px solid #f39c12;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 0 4px 4px 0;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const ConfirmButton = styled.button`
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
  
  &:disabled {
    background-color: #e57373;
    cursor: not-allowed;
  }
`;

const ConfirmInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 0.5rem;
  
  &:focus {
    outline: none;
    border-color: #e74c3c;
  }
`;

const ModalMessage = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 4px;
  background-color: ${props => props.success ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)'};
  color: ${props => props.success ? '#27ae60' : '#e74c3c'};
`;

const GalleryCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState({ text: '', success: false });
  const [categoryItemsCount, setCategoryItemsCount] = useState({});
  
  // Fetch categories and count items
  useEffect(() => {
    fetchCategoriesAndCounts();
  }, []);
  
  // Fetch categories and count the number of items in each
  const fetchCategoriesAndCounts = async () => {
    try {
      setLoading(true);
      
      // Fetch categories
      const querySnapshot = await getDocs(collection(db, 'gallery-categories'));
      const fetchedCategories = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setCategories(fetchedCategories);
      
      // Count items for each category
      const counts = {};
      for (const category of fetchedCategories) {
        const itemsQuery = query(
          collection(db, 'gallery'),
          where('category', '==', category.id)
        );
        const itemsSnapshot = await getDocs(itemsQuery);
        counts[category.id] = itemsSnapshot.size;
      }
      
      setCategoryItemsCount(counts);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Category name is required');
      return;
    }
    
    try {
      setLoading(true);
      
      if (editingId) {
        // Update existing category
        const categoryRef = doc(db, 'gallery-categories', editingId);
        await updateDoc(categoryRef, {
          ...formData,
          updatedAt: Timestamp.now()
        });
      } else {
        // Create new category
        await addDoc(collection(db, 'gallery-categories'), {
          ...formData,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
      }
      
      // Reset form and fetch updated categories
      setFormData({ name: '', description: '' });
      setShowForm(false);
      setEditingId(null);
      await fetchCategoriesAndCounts();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle edit category
  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      description: category.description || ''
    });
    setEditingId(category.id);
    setShowForm(true);
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Open delete modal
  const openDeleteModal = (category) => {
    setCategoryToDelete(category);
    setDeleteConfirmation('');
    setModalMessage({ text: '', success: false });
    setDeleteModalOpen(true);
  };
  
  // Close delete modal
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setCategoryToDelete(null);
    setDeleteConfirmation('');
    setModalMessage({ text: '', success: false });
  };
  
  // Handle delete category with cascade delete
  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    
    // Check if confirmation text matches category name
    if (deleteConfirmation !== categoryToDelete.name) {
      setModalMessage({
        text: 'Confirmation text does not match category name',
        success: false
      });
      return;
    }
    
    try {
      setDeleteLoading(true);
      setModalMessage({ text: 'Deleting category and associated items...', success: false });
      
      // Use the galleryService to delete the category and all its items
      const result = await galleryService.deleteCategoryWithItems(categoryToDelete.id);
      
      setModalMessage({
        text: `Success! Deleted category "${categoryToDelete.name}" and ${result.deletedItems} associated gallery items.`,
        success: true
      });
      
      // Update categories after a short delay
      setTimeout(() => {
        fetchCategoriesAndCounts();
        closeDeleteModal();
      }, 2000);
      
    } catch (error) {
      console.error('Error deleting category:', error);
      setModalMessage({
        text: `Error: ${error.message || 'Failed to delete category'}`,
        success: false
      });
    } finally {
      setDeleteLoading(false);
    }
  };
  
  // Cancel editing
  const cancelEdit = () => {
    setFormData({ name: '', description: '' });
    setEditingId(null);
    setShowForm(false);
  };
  
  // Handle confirmation input change
  const handleConfirmationChange = (e) => {
    setDeleteConfirmation(e.target.value);
  };
  
  return (
    <AdminLayout>
      <Head>
        <title>Gallery Categories | MITRA Admin</title>
      </Head>
      
      <Container>
        <Header>
          <div>
            <Title>Gallery Categories</Title>
            <Subtitle>Manage categories for organizing gallery images</Subtitle>
          </div>
          
          {!showForm && (
            <AddButton onClick={() => setShowForm(true)}>
              <FaPlus /> Add Category
            </AddButton>
          )}
        </Header>
        
        {showForm && (
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="name">Category Name *</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="description">Description</Label>
              <Input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </FormGroup>
            
            <FormButtons>
              <CancelButton type="button" onClick={cancelEdit}>
                Cancel
              </CancelButton>
              <SubmitButton type="submit">
                {editingId ? 'Update Category' : 'Add Category'}
              </SubmitButton>
            </FormButtons>
          </Form>
        )}
        
        {loading && !showForm ? (
          <LoadingContainer>
            <Spinner />
            <LoadingText>Loading categories...</LoadingText>
          </LoadingContainer>
        ) : categories.length === 0 ? (
          <NoCategories>
            <h3>No Categories Found</h3>
            <p>Click the 'Add Category' button to create your first category.</p>
          </NoCategories>
        ) : (
          <Table>
            <TableHead>
              <tr>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Description</TableHeaderCell>
                <TableHeaderCell>Item Count</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </tr>
            </TableHead>
            <tbody>
              {categories.map(category => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description || '-'}</TableCell>
                  <TableCell>{categoryItemsCount[category.id] || 0}</TableCell>
                  <TableCell>
                    <ActionButtons>
                      <ActionButton
                        className="edit"
                        onClick={() => handleEdit(category)}
                        title="Edit category"
                      >
                        <FaEdit size={16} />
                      </ActionButton>
                      <ActionButton
                        className="delete"
                        onClick={() => openDeleteModal(category)}
                        title="Delete category"
                      >
                        <FaTrash size={16} />
                      </ActionButton>
                    </ActionButtons>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
      
      {/* Delete Confirmation Modal */}
      {deleteModalOpen && categoryToDelete && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>
              <ModalWarningIcon /> Delete Category
            </ModalTitle>
            
            <ModalText>
              Are you sure you want to delete the category "{categoryToDelete.name}"?
            </ModalText>
            
            <ModalWarning>
              <strong>Warning:</strong> This will also delete all {categoryItemsCount[categoryToDelete.id] || 0} gallery items in this category. This action cannot be undone.
            </ModalWarning>
            
            <ModalText>
              To confirm deletion, please type the category name:
            </ModalText>
            
            <ConfirmInput
              type="text"
              value={deleteConfirmation}
              onChange={handleConfirmationChange}
              placeholder={`Type "${categoryToDelete.name}" to confirm`}
              disabled={deleteLoading}
            />
            
            {modalMessage.text && (
              <ModalMessage success={modalMessage.success}>
                {modalMessage.text}
              </ModalMessage>
            )}
            
            <ModalButtons>
              <CancelButton onClick={closeDeleteModal} disabled={deleteLoading}>
                Cancel
              </CancelButton>
              <ConfirmButton 
                onClick={confirmDelete} 
                disabled={deleteConfirmation !== categoryToDelete.name || deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete Category'}
              </ConfirmButton>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}
    </AdminLayout>
  );
};

export default GalleryCategories;