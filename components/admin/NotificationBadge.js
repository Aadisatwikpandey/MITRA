// components/admin/NotificationBadge.js
import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { contactSubmissionsService } from '../../lib/contactSubmissionsService';

// Animation for badge pulse
const pulse = keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(243, 156, 18, 0.7);
  }
  
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(243, 156, 18, 0);
  }
  
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(243, 156, 18, 0);
  }
`;

const Badge = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: ${props => props.theme.colors.secondary};
  color: white;
  border-radius: 50%;
  width: ${props => props.count > 99 ? '22px' : '18px'};
  height: ${props => props.count > 99 ? '22px' : '18px'};
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${pulse} 2s infinite;
  z-index: 1;
`;

const NotificationBadge = ({ count: propCount, showZero = false }) => {
  const [count, setCount] = useState(propCount || 0);
  
  // If count is provided as a prop, use that instead of fetching
  useEffect(() => {
    if (propCount !== undefined) {
      setCount(propCount);
      return;
    }
    
    const fetchUnreadCount = async () => {
      try {
        const unreadCount = await contactSubmissionsService.getUnreadCount();
        setCount(unreadCount);
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };
    
    fetchUnreadCount();
    
    // Set up an interval to refresh the count every minute
    const intervalId = setInterval(fetchUnreadCount, 60000);
    
    return () => clearInterval(intervalId);
  }, [propCount]);
  
  // Don't render if count is 0 and showZero is false
  if (count === 0 && !showZero) {
    return null;
  }
  
  return <Badge count={count}>{count > 99 ? '99+' : count}</Badge>;
};

export default NotificationBadge;