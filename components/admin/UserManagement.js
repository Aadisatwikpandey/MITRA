// components/admin/UserManagement.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { db, collection, getDocs, query, orderBy } from '../../lib/firebase';
import { contactSubmissionsService } from '../../lib/contactSubmissionsService';

// Import modular components
import UserFilters from './users/UserFilters';
import UserTable from './users/UserTable';
import UserDetailModal from './users/UserDetailModal';
import ExportToExcel from './users/ExportToExcel';

// Styled components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
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
`;

// Main component
const UserManagement = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [interestFilter, setInterestFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState('view');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // List of possible interests (derived from form)
  const interestOptions = [
    { value: 'all', label: 'All Interests' },
    { value: 'donating', label: 'Donations' },
    { value: 'volunteering', label: 'Volunteering' },
    { value: 'sponsoring', label: 'Sponsorship' },
    { value: 'events', label: 'Events' },
    { value: 'other', label: 'Other' }
  ];
  
  // List of possible statuses
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'completed', label: 'Completed' },
    { value: 'inactive', label: 'Inactive' }
  ];
  
  // Fetch users from Firebase on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(collection(db, 'contactSubmissions'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const fetchedUsers = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Convert Firebase timestamp to JS Date
          createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : new Date()
        }));
        
        setUsers(fetchedUsers);
        setFilteredUsers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  // Check for focused submission from URL
  useEffect(() => {
    const { focus } = router.query;
    
    if (focus && users.length > 0) {
      const focusedUser = users.find(user => user.id === focus);
      if (focusedUser) {
        handleViewUser(focusedUser);
      }
    }
  }, [router.query, users]);
  
  // Filter users when search term or filters change
  useEffect(() => {
    let results = [...users];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(user => 
        user.fullName?.toLowerCase().includes(term) ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.phone?.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      results = results.filter(user => user.status === statusFilter);
    }
    
    // Apply interest filter
    if (interestFilter !== 'all') {
      results = results.filter(user => user.interest === interestFilter);
    }
    
    setFilteredUsers(results);
  }, [searchTerm, statusFilter, interestFilter, users]);
  
  // Open user modal in view mode
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setModalMode('view');
    setIsModalOpen(true);
    
    // Mark as viewed if it's new
    if (user.viewed === false) {
      markAsViewed(user.id);
    }
  };
  
  // Open user modal in edit mode
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalMode('edit');
    setIsModalOpen(true);
  };
  
  // Open user modal in delete mode
  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setModalMode('delete');
    setIsModalOpen(true);
  };
  
  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };
  
  // Update user in local state after changes
  const handleUpdateUser = (updatedUser) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      )
    );
    
    handleCloseModal();
  };
  
  // Remove user from local state after deletion
  const handleUserDeleted = (userId) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    handleCloseModal();
  };
  
  // Mark user as viewed
  const markAsViewed = async (userId) => {
    try {
      await contactSubmissionsService.markAsRead(userId);
      
      // Update local state
      setUsers(prev => 
        prev.map(user => 
          user.id === userId ? { ...user, viewed: true } : user
        )
      );
    } catch (error) {
      console.error('Error marking submission as viewed:', error);
    }
  };
  
  return (
    <Container>
      <Header>
        <div>
          <Title>User Management</Title>
          <Subtitle>Manage contact form submissions and inquiries</Subtitle>
        </div>
        <ExportToExcel users={filteredUsers} filename="MITRA_Contact_Submissions" />
      </Header>
      
      <UserFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        interestFilter={interestFilter}
        onSearchChange={setSearchTerm}
        onStatusChange={setStatusFilter}
        onInterestChange={setInterestFilter}
        statusOptions={statusOptions}
        interestOptions={interestOptions}
      />
      
      <UserTable
        users={filteredUsers}
        loading={loading}
        onView={handleViewUser}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
      />
      
      {isModalOpen && selectedUser && (
        <UserDetailModal
          user={selectedUser}
          mode={modalMode}
          onClose={handleCloseModal}
          onSave={handleUpdateUser}
          onDelete={handleUserDeleted}
          onModeChange={setModalMode}
        />
      )}
    </Container>
  );
};

export default UserManagement;