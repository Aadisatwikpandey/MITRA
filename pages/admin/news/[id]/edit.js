// pages/admin/news/[id]/edit.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import NewsForm from '../../../../components/admin/NewsForm';
import AdminLayout from '../../../../components/admin/AdminLayout';
import { newsService } from '../../../../lib/newsService';
import styles from '../../../../styles/admin/NewsForm.module.css';

export default function EditNews() {
  const router = useRouter();
  const { id } = router.query;
  
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchNewsItem = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const newsItem = await newsService.getNewsById(id);
        
        if (!newsItem) {
          setError('News item not found');
        } else {
          setNews(newsItem);
        }
      } catch (err) {
        console.error('Error fetching news item:', err);
        setError('Failed to load news item. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNewsItem();
  }, [id]);
  
  if (loading) {
    return (
      <AdminLayout>
        <Head>
          <title>Edit News | MITRA Admin</title>
        </Head>
        <div className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading news item...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }
  
  if (error || !news) {
    return (
      <AdminLayout>
        <Head>
          <title>Edit News | MITRA Admin</title>
        </Head>
        <div className={styles.container}>
          <div className={styles.error}>
            <h2>Error</h2>
            <p>{error || 'News item not found'}</p>
            <button 
              className={styles.cancelButton} 
              onClick={() => router.push('/admin/news')}
            >
              Back to News List
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <Head>
        <title>Edit News | MITRA Admin</title>
      </Head>
      
      <NewsForm initialData={news} isEdit={true} />
    </AdminLayout>
  );
}