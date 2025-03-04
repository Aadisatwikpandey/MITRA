// components/admin/users/UserDetailModal.js
import { useState } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { db, doc, updateDoc, deleteDoc } from '../../../lib/firebase';

// Styled Components
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
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.primary};
  margin: 0;
`;

const ModalCloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
  
  &:hover {
    color: #333;
  }
`;

const ModalSection = styled.div`
  margin-bottom: 1.5rem;
`;

const ModalSectionTitle = styled.h3`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
`;

const UserInfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const UserInfoItem = styled.div`
  margin-bottom: 0.75rem;
`;

const InfoLabel = styled.span`
  font-weight: 600;
  display: block;
  margin-bottom: 0.25rem;
  color: ${props => props.theme.colors.text};
`;

const InfoValue = styled.span`
  display: block;
  color: ${props => props.theme.colors.text};
`;

const MessageSection = styled.div`
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
`;

const StatusSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: white;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const SaveButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #166638;
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

const UserDetailModal = ({ 
  user, 
  mode, 
  onClose, 
  onSave, 
  onDelete, 
  onModeChange 
}) => {
  const [editedUser, setEditedUser] = useState(user);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle status change
  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setEditedUser(prev => ({ ...prev, status: newStatus }));
  };
  
  // Save changes
  const handleSave = async () => {
    if (!editedUser) return;
    
    setIsSubmitting(true);
    try {
      const userRef = doc(db, 'contactSubmissions', editedUser.id);
      await updateDoc(userRef, {
        status: editedUser.status,
        viewed: true
      });
      
      onSave({ ...editedUser, viewed: true });
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update submission. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Delete user
  const handleDelete = async () => {
    if (!editedUser) return;
    
    setIsSubmitting(true);
    try {
      const userRef = doc(db, 'contactSubmissions', editedUser.id);
      await deleteDoc(userRef);
      
      onDelete(editedUser.id);
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete submission. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!user) return null;
  
  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            {mode === 'view' ? 'Contact Details' : 
             mode === 'edit' ? 'Edit Contact' : 
             'Delete Contact'}
          </ModalTitle>
          <ModalCloseButton onClick={onClose}>&times;</ModalCloseButton>
        </ModalHeader>
        
        {mode === 'delete' ? (
          <>
            <p>Are you sure you want to delete this contact? This action cannot be undone.</p>
            <UserInfoItem>
              <InfoLabel>Name:</InfoLabel>
              <InfoValue>{user.fullName || `${user.firstName} ${user.lastName}`}</InfoValue>
            </UserInfoItem>
            <UserInfoItem>
              <InfoLabel>Email:</InfoLabel>
              <InfoValue>{user.email}</InfoValue>
            </UserInfoItem>
            
            <ModalActions>
              <CancelButton onClick={onClose} disabled={isSubmitting}>Cancel</CancelButton>
              <DeleteButton onClick={handleDelete} disabled={isSubmitting}>
                {isSubmitting ? 'Deleting...' : 'Delete'}
              </DeleteButton>
            </ModalActions>
          </>
        ) : (
          <>
            <ModalSection>
              <ModalSectionTitle>Personal Information</ModalSectionTitle>
              <UserInfoGrid>
                <UserInfoItem>
                  <InfoLabel>First Name:</InfoLabel>
                  <InfoValue>{user.firstName}</InfoValue>
                </UserInfoItem>
                <UserInfoItem>
                  <InfoLabel>Last Name:</InfoLabel>
                  <InfoValue>{user.lastName}</InfoValue>
                </UserInfoItem>
                <UserInfoItem>
                  <InfoLabel>Email:</InfoLabel>
                  <InfoValue>{user.email}</InfoValue>
                </UserInfoItem>
                <UserInfoItem>
                  <InfoLabel>Phone:</InfoLabel>
                  <InfoValue>{user.phone || 'Not provided'}</InfoValue>
                </UserInfoItem>
                <UserInfoItem>
                  <InfoLabel>Interest:</InfoLabel>
                  <InfoValue>{user.interest}</InfoValue>
                </UserInfoItem>
                <UserInfoItem>
                  <InfoLabel>Submission Date:</InfoLabel>
                  <InfoValue>
                    {user.createdAt ? format(user.createdAt, 'MMM d, yyyy HH:mm') : 'N/A'}
                  </InfoValue>
                </UserInfoItem>
              </UserInfoGrid>
            </ModalSection>
            
            <ModalSection>
              <ModalSectionTitle>Message</ModalSectionTitle>
              <MessageSection>
                {user.message}
              </MessageSection>
            </ModalSection>
            
            {mode === 'edit' && (
              <ModalSection>
                <ModalSectionTitle>Update Status</ModalSectionTitle>
                <StatusSelect 
                  value={editedUser.status} 
                  onChange={handleStatusChange}
                  disabled={isSubmitting}
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="completed">Completed</option>
                  <option value="inactive">Inactive</option>
                </StatusSelect>
              </ModalSection>
            )}
            
            <ModalActions>
              {mode === 'view' ? (
                <>
                  <CancelButton onClick={onClose}>Close</CancelButton>
                  <SaveButton onClick={() => onModeChange('edit')}>Edit</SaveButton>
                </>
              ) : (
                <>
                  <CancelButton onClick={onClose} disabled={isSubmitting}>Cancel</CancelButton>
                  <SaveButton onClick={handleSave} disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </SaveButton>
                </>
              )}
            </ModalActions>
          </>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default UserDetailModal;