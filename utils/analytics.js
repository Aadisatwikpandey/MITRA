// utils/analytics.js
import { getAnalytics, logEvent } from 'firebase/analytics';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';

let analytics;

// Initialize analytics
export const initAnalytics = () => {
  // Only initialize in browser environment and not in development
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    try {
      analytics = getAnalytics();
    } catch (error) {
      console.error('Error initializing analytics:', error);
    }
  }
};

// Track page view
export const trackPageView = (page) => {
  if (analytics) {
    logEvent(analytics, 'page_view', {
      page_path: page,
    });
  }
};

// Track news view
export const trackNewsView = async (newsId) => {
  try {
    // Track with Firebase Analytics
    if (analytics) {
      logEvent(analytics, 'news_view', {
        news_id: newsId,
      });
    }
    
    // Increment view count in Firestore
    const newsRef = doc(db, 'news', newsId);
    await updateDoc(newsRef, {
      viewCount: increment(1)
    });
  } catch (error) {
    console.error('Error tracking news view:', error);
  }
};

// Track news like
export const trackNewsLike = async (newsId) => {
  try {
    // Track with Firebase Analytics
    if (analytics) {
      logEvent(analytics, 'news_like', {
        news_id: newsId,
      });
    }
  } catch (error) {
    console.error('Error tracking news like:', error);
  }
};

// Track news share
export const trackNewsShare = (newsId, platform) => {
  if (analytics) {
    logEvent(analytics, 'news_share', {
      news_id: newsId,
      platform: platform
    });
  }
};

export default {
  initAnalytics,
  trackPageView,
  trackNewsView,
  trackNewsLike,
  trackNewsShare
};