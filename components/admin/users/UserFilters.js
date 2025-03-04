// components/admin/users/UserFilters.js
import { useState } from 'react';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';

// Styled Components
const FiltersContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
  
  @media (max-width: 768px) {
    max-width: 100%;
    width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const UserFilters = ({ 
  searchTerm, 
  statusFilter, 
  interestFilter, 
  onSearchChange, 
  onStatusChange, 
  onInterestChange,
  statusOptions,
  interestOptions
}) => {
  // Use debouncing for search to prevent excessive updates
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setDebouncedSearch(value);
    
    // Debounce search input
    const timeoutId = setTimeout(() => {
      onSearchChange(value);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  };
  
  return (
    <FiltersContainer>
      <SearchContainer>
        <SearchIcon />
        <SearchInput 
          type="text" 
          placeholder="Search by name, email or phone..." 
          value={debouncedSearch}
          onChange={handleSearchChange}
        />
      </SearchContainer>
      
      <FilterGroup>
        <Select 
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        
        <Select 
          value={interestFilter}
          onChange={(e) => onInterestChange(e.target.value)}
        >
          {interestOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </FilterGroup>
    </FiltersContainer>
  );
};

export default UserFilters;