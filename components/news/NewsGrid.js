// components/news/NewsGrid.js
import { useState } from 'react';
import NewsCard from './NewsCard';
import styles from '../../styles/news/NewsGrid.module.css';

const NewsGrid = ({ 
  news, 
  title = 'Latest News', 
  loading = false, 
  hasMore = false, 
  onLoadMore,
  onLike 
}) => {
  const handleLike = (newsId) => {
    if (onLike) {
      onLike(newsId);
    }
  };
  
  if (!news || news.length === 0) {
    return (
      <div className={styles.gridSection}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <div className={styles.noResults}>
          <h3>No news found</h3>
          <p>There are no news items matching your criteria.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={styles.gridSection}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      
      <div className={styles.grid}>
        {news.map(item => (
          <NewsCard
            key={item.id}
            news={item}
            onLike={handleLike}
          />
        ))}
      </div>
      
      {hasMore && (
        <div className={styles.loadMoreContainer}>
          <button 
            className={styles.loadMoreButton}
            onClick={onLoadMore}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className={styles.spinner}></span>
                Loading...
              </>
            ) : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default NewsGrid;