// components/admin/LogoutButton.js
import { FaSignOutAlt } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { authService } from '../../lib/authService';
import styled from 'styled-components';

const LogoutButtonContainer = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #c0392b;
    transform: translateY(-2px);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.3);
  }
`;

const LogoutButton = () => {
  const router = useRouter();
  
  const handleLogout = async () => {
    try {
      await authService.signOut();
      router.replace('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to logout. Please try again.');
    }
  };
  
  return (
    <LogoutButtonContainer onClick={handleLogout}>
      <FaSignOutAlt />
      <span>Logout</span>
    </LogoutButtonContainer>
  );
};

export default LogoutButton;