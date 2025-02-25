// components/news/Pagination.js
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import styles from '../../styles/news/Pagination.module.css';

const Pagination = ({ 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange
}) => {
  if (totalPages <= 1) return null;
  
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    if (onPageChange) {
      onPageChange(page);
    }
  };
  
  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5; // Max number of page numbers to show
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Calculate which pages to show for large number of pages
      const halfMax = Math.floor(maxPagesToShow / 2);
      
      if (currentPage <= halfMax + 1) {
        // Near the start
        for (let i = 1; i <= maxPagesToShow - 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - halfMax) {
        // Near the end
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - (maxPagesToShow - 2); i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Middle
        pages.push(1);
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };
  
  const pageNumbers = getPageNumbers();
  
  return (
    <div className={styles.paginationContainer}>
      <button 
        className={styles.arrowButton}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <FaChevronLeft />
      </button>
      
      {pageNumbers.map((page, index) => (
        page === 'ellipsis' ? (
          <div key={`ellipsis-${index}`} className={styles.ellipsis}>
            &hellip;
          </div>
        ) : (
          <button
            key={page}
            className={`${styles.pageButton} ${
              currentPage === page ? styles.pageButtonActive : ''
            }`}
            onClick={() => handlePageChange(page)}
            disabled={currentPage === page}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        )
      ))}
      
      <button 
        className={styles.arrowButton}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default Pagination;