// components/news/RelatedNews.js
import Link from 'next/link';
import Image from 'next/image';
import { FaCalendarAlt } from 'react-icons/fa';
import { formatRelativeTime } from '../../utils/dateFormatter';
import styles from '../../styles/news/RelatedNews.module.css';

const RelatedNews = ({ news = [] }) => {
  if (!news || news.length === 0) return null;
  
  return (
    <div className={styles.relatedNews}>
      <h2 className={styles.relatedNewsTitle}>Related News</h2>
      
      <div className={styles.relatedNewsGrid}>
        {news.map(item => (
          <Link href={`/news-events/${item.slug}`} key={item.id}>
            <div className={styles.card}>
              <div className={styles.imageContainer}>
                {item.image ? (
                  <Image 
                    src={item.image} 
                    alt={item.title}
                    layout="fill"
                    objectFit="cover"
                  />
                ) : (
                  <div className={styles.fallbackImage}>
                    <span>No image</span>
                  </div>
                )}
              </div>
              
              <div className={styles.content}>
                <div className={styles.meta}>
                  <div className={styles.date}>
                    <FaCalendarAlt size={12} />
                    {formatRelativeTime(item.publishDate)}
                  </div>
                </div>
                
                <h3 className={styles.title}>{item.title}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedNews;