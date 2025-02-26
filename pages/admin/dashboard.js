// pages/admin/dashboard.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FaNewspaper, FaUsers, FaChartBar, FaCalendarAlt, FaEdit } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import styles from '../../styles/admin/Dashboard.module.css';

// Dashboard card component
const DashboardCard = ({ title, value, icon, color, link }) => (
  <Link href={link} className={styles.card}>
    <div className={styles.cardIconContainer} style={{ backgroundColor: `${color}25` }}>
      <div className={styles.cardIcon} style={{ color }}>
        {icon}
      </div>
    </div>
    <div className={styles.cardContent}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardValue}>{value}</p>
    </div>
  </Link>
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    news: 0,
    events: 0,
    users: 0,
    views: 0
  });
  const [recentNews, setRecentNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // In production, this would call Firebase
        // For development, use mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setStats({
          news: 8,
          events: 4,
          users: 12,
          views: 1250
        });
        
        setRecentNews([
          {
            id: '1',
            title: 'New Computer Lab Inauguration',
            category: 'School Updates',
            publishDate: new Date(2024, 9, 15)
          },
          {
            id: '2',
            title: 'Annual Cultural Festival "Sanskriti 2024"',
            category: 'Events',
            publishDate: new Date(2024, 9, 10)
          },
          {
            id: '3',
            title: 'Teacher Training Workshop',
            category: 'Training',
            publishDate: new Date(2024, 9, 5)
          }
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <AdminLayout>
      <Head>
        <title>Dashboard | MITRA Admin</title>
      </Head>
      
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Dashboard</h1>
            <p className={styles.subtitle}>Welcome to the MITRA admin panel</p>
          </div>
        </div>
        
        <div className={styles.statsGrid}>
          <DashboardCard
            title="Total News"
            value={stats.news}
            icon={<FaNewspaper />}
            color="#1E8449"
            link="/admin/news"
          />
          
          <DashboardCard
            title="Total Events"
            value={stats.events}
            icon={<FaCalendarAlt />}
            color="#F39C12"
            link="/admin/events"
          />
          
          <DashboardCard
            title="Users"
            value={stats.users}
            icon={<FaUsers />}
            color="#3498DB"
            link="/admin/users"
          />
          
          <DashboardCard
            title="Page Views"
            value={stats.views}
            icon={<FaChartBar />}
            color="#9B59B6"
            link="/admin/analytics"
          />
        </div>
        
        <div className={styles.recentSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recent News</h2>
            <Link href="/admin/news" className={styles.viewAllLink}>
              View All
            </Link>
          </div>
          
          <div className={styles.recentList}>
            {loading ? (
              <p>Loading recent news...</p>
            ) : recentNews.length === 0 ? (
              <p>No recent news found</p>
            ) : (
              recentNews.map(item => (
                <div key={item.id} className={styles.recentItem}>
                  <div>
                    <h3 className={styles.recentItemTitle}>{item.title}</h3>
                    <div className={styles.recentItemMeta}>
                      <span>{formatDate(item.publishDate)}</span>
                      <span className={styles.recentItemCategory}>{item.category}</span>
                    </div>
                  </div>
                  <Link href={`/admin/news/${item.id}/edit`}>
                    <button className={styles.editButton} title="Edit">
                      <FaEdit />
                    </button>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className={styles.quickLinksSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Quick Links</h2>
          </div>
          
          <div className={styles.quickLinks}>
            <Link href="/admin/news/create" className={styles.quickLink}>
              Add News
            </Link>
            <Link href="/admin/events/create" className={styles.quickLink}>
              Add Event
            </Link>
            <Link href="/admin/users/invite" className={styles.quickLink}>
              Invite User
            </Link>
            <Link href="/admin/settings" className={styles.quickLink}>
              Settings
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}