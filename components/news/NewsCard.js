// components/news/NewsCard.js
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaHeart, FaArrowRight, FaCalendarAlt } from 'react-icons/fa';
import { formatRelativeTime } from '../../utils/dateFormatter';
import { newsService } from '../../lib/newsService';
import { trackNewsLike } from '../../utils/analytics';
import styles from '../../styles/news/NewsCard.module.css';

const NewsCard = ({ news, onLike }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(news.likes || 0);
  
  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!liked) {
      try {
        await newsService.likeNews(news.id);
        setLiked(true);
        setLikeCount(prevCount => prevCount + 1);
        
        // Track like in analytics
        trackNewsLike(news.id);
        
        // Call the parent component's onLike function if provided
        if (onLike) {
          onLike(news.id);
        }
      } catch (error) {
        console.error('Error liking news:', error);
      }
    }
  };
  
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        {news.image ? (
          <Image 
            src={news.image} 
            alt={news.title}
            layout="fill"
            objectFit="cover"
          />
        ) : (
          <div className={styles.fallbackImage}>
            <span>No image available</span>
          </div>
        )}
      </div>
      
      <div className={styles.content}>
        <div className={styles.meta}>
          <div className={styles.date}>
            <FaCalendarAlt size={12} style={{ marginRight: '5px' }} />
            {formatRelativeTime(news.publishDate)}
          </div>
          
          {news.category && (
            <span className={styles.category}>{news.category}</span>
          )}
        </div>
        
        <h3 className={styles.title}>{news.title}</h3>
        
        <p className={styles.excerpt}>
          {news.excerpt || news.content.substring(0, 100) + '...'}
        </p>
        
        <div className={styles.footer}>
          <Link href={`/news-events/${news.slug}`} className={styles.readMore}>
            Read More <FaArrowRight size={12} />
          </Link>
          
          <button 
            className={`${styles.likeButton} ${liked ? styles.likeButtonActive : ''}`}
            onClick={handleLike}
            aria-label="Like this article"
          >
            <FaHeart /> <span>{likeCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;