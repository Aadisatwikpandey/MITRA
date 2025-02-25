// components/news/NewsDetail.js
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  FaCalendarAlt, 
  FaEye, 
  FaHeart,
} from 'react-icons/fa';
import { formatFullDate } from '../../utils/dateFormatter';
import { newsService } from '../../lib/newsService';
import { trackNewsView, trackNewsLike } from '../../utils/analytics';
import SocialShare from './SocialShare';
import RelatedNews from './RelatedNews';
import styles from '../../styles/news/NewsDetail.module.css';

const NewsDetail = ({ news, relatedNews = [] }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(news?.likes || 0);
  
  // Track page view when component mounts
  useEffect(() => {
    if (news?.id) {
      trackNewsView(news.id);
    }
  }, [news?.id]);
  
  if (!news) {
    return (
      <div className={styles.container}>
        <h1>News article not found</h1>
        <p>The news article you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }
  
  const handleLike = async () => {
    if (!liked) {
      try {
        await newsService.likeNews(news.id);
        setLiked(true);
        setLikeCount(prevCount => prevCount + 1);
        
        // Track like in analytics
        trackNewsLike(news.id);
      } catch (error) {
        console.error('Error liking news:', error);
      }
    }
  };
  
  return (
    <article className={styles.container}>
      <header className={styles.header}>
        {news.category && (
          <div className={styles.category}>{news.category}</div>
        )}
        
        <h1 className={styles.title}>{news.title}</h1>
        
        <div className={styles.meta}>
          <div className={styles.date}>
            <FaCalendarAlt />
            {formatFullDate(news.publishDate)}
          </div>
          
          {news.viewCount !== undefined && (
            <div className={styles.views}>
              <FaEye />
              {news.viewCount} views
            </div>
          )}
          
          <div className={styles.likes}>
            <FaHeart />
            {likeCount} likes
          </div>
        </div>
      </header>
      
      {news.image && (
        <div className={styles.imageContainer}>
          <Image 
            src={news.image}
            alt={news.title}
            layout="fill"
            objectFit="cover"
            priority
          />
        </div>
      )}
      
      <div className={styles.content}>
        {/* If content is HTML */}
        {news.contentHtml ? (
          <div dangerouslySetInnerHTML={{ __html: news.contentHtml }} />
        ) : (
          // Otherwise, render as plain text with paragraphs
          news.content.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))
        )}
      </div>
      
      <SocialShare title={news.title} newsId={news.id} />
      
      <div className={styles.likeSection}>
        <button 
          className={`${styles.likeButton} ${liked ? styles.likeButtonActive : ''}`}
          onClick={handleLike}
          disabled={liked}
        >
          <FaHeart size={18} /> {liked ? 'Liked' : 'Like this article'}
        </button>
      </div>
      
      {relatedNews.length > 0 && (
        <RelatedNews news={relatedNews} />
      )}
    </article>
  );
};

export default NewsDetail;