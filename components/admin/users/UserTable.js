// components/admin/users/UserTable.js
import styled from 'styled-components';
import { format } from 'date-fns';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

// Styled Components
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const THead = styled.thead`
  background-color: #f5f5f5;
  
  th {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
  }
`;

const TBody = styled.tbody`
  tr {
    border-top: 1px solid #eee;
    
    &:hover {
      background-color: #f9f9f9;
    }
  }
  
  td {
    padding: 1rem;
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
  background-color: ${props => 
    props.status === 'new' ? 'rgba(52, 152, 219, 0.2)' : 
    props.status === 'contacted' ? 'rgba(243, 156, 18, 0.2)' : 
    props.status === 'completed' ? 'rgba(39, 174, 96, 0.2)' : 
    'rgba(189, 195, 199, 0.2)'
  };
  color: ${props => 
    props.status === 'new' ? '#3498db' : 
    props.status === 'contacted' ? '#f39c12' : 
    props.status === 'completed' ? '#27ae60' : 
    '#7f8c8d'
  };
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.view {
    background-color: rgba(52, 152, 219, 0.1);
    color: #3498db;
  }
  
  &.edit {
    background-color: rgba(243, 156, 18, 0.1);
    color: #f39c12;
  }
  
  &.delete {
    background-color: rgba(231, 76, 60, 0.1);
    color: #e74c3c;
  }
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const LoadingState = styled.div`
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

const UserTable = ({ 
  users, 
  loading, 
  onView, 
  onEdit, 
  onDelete 
}) => {
  if (loading) {
    return (
      <LoadingState>
        <Spinner />
        <p>Loading contact submissions...</p>
      </LoadingState>
    );
  }
  
  if (users.length === 0) {
    return (
      <EmptyState>
        <h3>No submissions found</h3>
        <p>Try adjusting your filters or search term.</p>
      </EmptyState>
    );
  }
  
  return (
    <Table>
      <THead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Interest</th>
          <th>Status</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </THead>
      <TBody>
        {users.map(user => (
          <tr key={user.id}>
            <td>{user.fullName || `${user.firstName} ${user.lastName}`}</td>
            <td>{user.email}</td>
            <td>{user.phone || '—'}</td>
            <td>{user.interest}</td>
            <td>
              <StatusBadge status={user.status}>
                {user.status}
              </StatusBadge>
            </td>
            <td>{user.createdAt ? format(user.createdAt, 'MMM d, yyyy') : 'N/A'}</td>
            <td>
              <ActionButtons>
                <ActionButton 
                  className="view" 
                  onClick={() => onView(user)}
                  title="View details"
                >
                  <FaEye />
                </ActionButton>
                <ActionButton 
                  className="edit" 
                  onClick={() => onEdit(user)}
                  title="Edit status"
                >
                  <FaEdit />
                </ActionButton>
                <ActionButton 
                  className="delete" 
                  onClick={() => onDelete(user)}
                  title="Delete"
                >
                  <FaTrash />
                </ActionButton>
              </ActionButtons>
            </td>
          </tr>
        ))}
      </TBody>
    </Table>
  );
};

export default UserTable;