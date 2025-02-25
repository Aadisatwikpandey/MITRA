// components/news/NewsFilters.js
import { useState, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import styles from '../../styles/news/NewsFilters.module.css';

const NewsFilters = ({ 
  categories = ['All'],
  activeCategory = 'All',
  onCategoryChange,
  onSearch
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  // Handle search term debounce
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    
    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);
  
  // Call parent's search handler when debounced term changes
  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, onSearch]);
  
  const handleCategoryClick = (category) => {
    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const clearSearch = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
  };
  
  return (
    <div className={styles.filterSection}>
      <div className={styles.categoryFilter}>
        {categories.map(category => (
          <button
            key={category}
            className={`${styles.filterButton} ${
              activeCategory === category ? styles.filterButtonActive : ''
            }`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>
      
      <div className={styles.searchContainer}>
        <FaSearch className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search news and events..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {searchTerm && (
          <button className={styles.clearButton} onClick={clearSearch} aria-label="Clear search">
            <FaTimes />
          </button>
        )}
      </div>
    </div>
  );
};

export default NewsFilters;