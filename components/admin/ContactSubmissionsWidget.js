// components/admin/ContactSubmissionsWidget.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { format, formatDistanceToNow } from 'date-fns';
import { FaEnvelope, FaEye, FaExclamationCircle } from 'react-icons/fa';
import { contactSubmissionsService } from '../../lib/contactSubmissionsService';

// Styled Components
const WidgetContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const WidgetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
`;

const WidgetTitle = styled.h3`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ViewAllLink = styled(Link)`
  color: ${props => props.theme.colors.accent};
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const SubmissionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SubmissionItem = styled.div`
  display: flex;
  padding: 1rem;
  border-radius: 4px;
  background-color: ${props => props.isNew ? 'rgba(52, 152, 219, 0.1)' : '#f9f9f9'};
  position: relative;
  
  &:hover {
    background-color: ${props => props.isNew ? 'rgba(52, 152, 219, 0.15)' : '#f0f0f0'};
  }
`;

const SubmissionInfo = styled.div`
  flex: 1;
`;

const SubmissionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const SubmissionName = styled.h4`
  margin: 0;
  font-size: 1rem;
  color: ${props => props.theme.colors.text};
`;

const SubmissionTime = styled.span`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.lightText};
`;

const SubmissionSubject = styled.p`
  margin: 0;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
`;

const SubmissionPreview = styled.p`
  margin: 0.5rem 0 0;
  color: ${props => props.theme.colors.lightText};
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const ViewButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.accent};
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  margin: -0.5rem;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const NewIndicator = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.secondary};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.colors.lightText};
`;

const LoadingSpinner = styled.div`
  width: 30px;
  height: 30px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 3px solid ${props => props.theme.colors.primary};
  animation: spin 1s linear infinite;
  margin: 0 auto;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Component
// Import Firebase utilities
import { db, collection, getDocs, query, orderBy, limit as fbLimit } from '../../lib/firebase';

const ContactSubmissionsWidget = ({ limit = 5 }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        
        // Get the latest submissions
        const q = query(
          collection(db, 'contactSubmissions'),
          orderBy('createdAt', 'desc'),
          fbLimit(limit)
        );
        
        const querySnapshot = await getDocs(q);
        
        const fetchedSubmissions = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : new Date()
        }));
        
        setSubmissions(fetchedSubmissions);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubmissions();
  }, [limit]);
  
  // Get count of new (unviewed) submissions
  const newCount = submissions.filter(sub => !sub.viewed).length;
  
  // Truncate message for preview
  const truncateMessage = (message, maxLength = 100) => {
    if (!message) return '';
    return message.length > maxLength ? `${message.substring(0, maxLength)}...` : message;
  };
  
  // Handle marking as read
  const handleViewSubmission = async (submissionId) => {
    try {
      await contactSubmissionsService.markAsRead(submissionId);
      
      // Update local state
      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === submissionId ? { ...sub, viewed: true } : sub
        )
      );
      
      // Redirect to users page with focus on this submission
      window.location.href = `/admin/users?focus=${submissionId}`;
    } catch (error) {
      console.error('Error marking submission as read:', error);
    }
  };
  
  return (
    <WidgetContainer>
      <WidgetHeader>
        <WidgetTitle>
          <FaEnvelope /> Recent Contact Submissions
          {newCount > 0 && (
            <span style={{ 
              marginLeft: '8px', 
              backgroundColor: '#F39C12', 
              color: 'white', 
              fontSize: '0.7rem',
              padding: '2px 6px',
              borderRadius: '10px'
            }}>
              {newCount} new
            </span>
          )}
        </WidgetTitle>
        <ViewAllLink href="/admin/users">View All</ViewAllLink>
      </WidgetHeader>
      
      {loading ? (
        <LoadingSpinner />
      ) : submissions.length === 0 ? (
        <EmptyState>
          <FaExclamationCircle style={{ fontSize: '2rem', marginBottom: '1rem' }} />
          <p>No submissions found</p>
        </EmptyState>
      ) : (
        <SubmissionsList>
          {submissions.map(submission => (
            <SubmissionItem key={submission.id} isNew={!submission.viewed}>
              {!submission.viewed && <NewIndicator />}
              <SubmissionInfo>
                <SubmissionHeader>
                  <SubmissionName>{submission.fullName || `${submission.firstName} ${submission.lastName}`}</SubmissionName>
                  <SubmissionTime>{formatDistanceToNow(submission.createdAt, { addSuffix: true })}</SubmissionTime>
                </SubmissionHeader>
                <SubmissionSubject>Interest: {submission.interest}</SubmissionSubject>
                <SubmissionPreview>{truncateMessage(submission.message)}</SubmissionPreview>
              </SubmissionInfo>
              <ViewButton onClick={() => handleViewSubmission(submission.id)}>
                <FaEye />
              </ViewButton>
            </SubmissionItem>
          ))}
        </SubmissionsList>
      )}
    </WidgetContainer>
  );
};

export default ContactSubmissionsWidget;