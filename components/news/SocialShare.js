    // components/news/SocialShare.js
import { FaFacebookF, FaTwitter, FaWhatsapp, FaLinkedinIn, FaEnvelope } from 'react-icons/fa';
import { trackNewsShare } from '../../utils/analytics';
import styles from '../../styles/news/SocialShare.module.css';

const SocialShare = ({ url, title, newsId }) => {
  // Use window object only on the client side
  const shareUrl = typeof window !== 'undefined' ? 
    url || window.location.href : 
    url || '';

  const handleShare = (platform) => {
    if (newsId) {
      trackNewsShare(newsId, platform);
    }
    
    let shareLink = '';
    
    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title || '')}`;
        break;
      case 'whatsapp':
        shareLink = `https://api.whatsapp.com/send?text=${encodeURIComponent((title || '') + ' ' + shareUrl)}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'email':
        shareLink = `mailto:?subject=${encodeURIComponent(title || '')}&body=${encodeURIComponent(shareUrl)}`;
        break;
    }
    
    if (shareLink) {
      if (platform === 'email') {
        window.location.href = shareLink;
      } else {
        window.open(shareLink, '_blank', 'width=600,height=400');
      }
    }
  };
  
  return (
    <div className={styles.shareContainer}>
      <div className={styles.shareLabel}>Share:</div>
      
      <div className={styles.socialIcons}>
        <div 
          className={`${styles.shareIcon} ${styles.facebook}`}
          onClick={() => handleShare('facebook')}
          role="button"
          aria-label="Share on Facebook"
        >
          <FaFacebookF />
        </div>
        
        <div 
          className={`${styles.shareIcon} ${styles.twitter}`}
          onClick={() => handleShare('twitter')}
          role="button"
          aria-label="Share on Twitter"
        >
          <FaTwitter />
        </div>
        
        <div 
          className={`${styles.shareIcon} ${styles.whatsapp}`}
          onClick={() => handleShare('whatsapp')}
          role="button"
          aria-label="Share on WhatsApp"
        >
          <FaWhatsapp />
        </div>
        
        <div 
          className={`${styles.shareIcon} ${styles.linkedin}`}
          onClick={() => handleShare('linkedin')}
          role="button"
          aria-label="Share on LinkedIn"
        >
          <FaLinkedinIn />
        </div>
        
        <div 
          className={`${styles.shareIcon} ${styles.email}`}
          onClick={() => handleShare('email')}
          role="button"
          aria-label="Share via Email"
        >
          <FaEnvelope />
        </div>
      </div>
    </div>
  );
};

export default SocialShare;