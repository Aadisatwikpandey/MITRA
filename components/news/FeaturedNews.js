// components/news/FeaturedNews.js
import Link from 'next/link';
import Image from 'next/image';
import { FaCalendarAlt, FaFacebookF, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { formatRelativeTime } from '../../utils/dateFormatter';
import { trackNewsShare } from '../../utils/analytics';
import styles from '../../styles/news/FeaturedNews.module.css';

const FeaturedNews = ({ news }) => {
  if (!news) return null;
  
  const shareUrl = typeof window !== 'undefined' ? 
    `${window.location.origin}/news-events/${news.slug}` : 
    `/news-events/${news.slug}`;
    
  const handleShare = (platform) => {
    trackNewsShare(news.id, platform);
    
    let shareLink = '';
    
    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(news.title)}`;
        break;
      case 'whatsapp':
        shareLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(news.title + ' ' + shareUrl)}`;
        break;
    }
    
    if (shareLink) {
      window.open(shareLink, '_blank', 'width=600,height=400');
    }
  };
  
  return (
    <div className={styles.featuredSection}>
      <h2 className={styles.sectionTitle}>Featured</h2>
      
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          {news.image ? (
            <Image 
              src={news.image} 
              alt={news.title}
              layout="fill"
              objectFit="cover"
              priority
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
              <FaCalendarAlt size={14} style={{ marginRight: '5px' }} />
              {formatRelativeTime(news.publishDate)}
            </div>
            
            {news.category && (
              <span className={styles.category}>{news.category}</span>
            )}
          </div>
          
          <h3 className={styles.title}>{news.title}</h3>
          
          <p className={styles.description}>
            {news.excerpt || news.content.substring(0, 150) + '...'}
          </p>
          
          <div className={styles.footer}>
            <Link href={`/news-events/${news.slug}`} className={styles.button}>
              Read Full Article
            </Link>
            
            <div className={styles.socialIcons}>
              <div 
                className={styles.shareIcon} 
                onClick={() => handleShare('facebook')}
                role="button"
                aria-label="Share on Facebook"
              >
                <FaFacebookF color="#3b5998" />
              </div>
              
              <div 
                className={styles.shareIcon} 
                onClick={() => handleShare('twitter')}
                role="button"
                aria-label="Share on Twitter"
              >
                <FaTwitter color="#1da1f2" />
              </div>
              
              <div 
                className={styles.shareIcon} 
                onClick={() => handleShare('whatsapp')}
                role="button"
                aria-label="Share on WhatsApp"
              >
                <FaWhatsapp color="#25d366" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedNews;