// pages/admin/news/index.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaPlus, FaEdit, FaTrash, FaEye, FaStar, FaSearch, FaNewspaper, FaUsers, FaChartBar } from 'react-icons/fa';import { formatFullDate } from '../../../utils/dateFormatter';
import { newsService } from '../../../lib/newsService';
import AdminLayout from '../../../components/admin/AdminLayout';
import styles from '../../../styles/admin/Dashboard.module.css';

const NewsDashboard = () => {
  const router = useRouter();
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    featured: 0,
    categories: {}
  });
  const itemsPerPage = 10;
  
  // Load news data
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        // Get all news items
        const allNews = await newsService.getAllNews();
        setNews(allNews);
        setFilteredNews(allNews);
        
        // Get statistics
        const statistics = await newsService.getStatistics();
        setStats({
          total: statistics.totalNews,
          featured: statistics.featuredCount,
          categories: statistics.categories
        });
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news items. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNews();
  }, []);
  
  // Categories derived from news items
  const categories = ['All', ...Object.keys(stats.categories).sort()];
  
  // Filter news based on search and category
  useEffect(() => {
    let results = news;
    
    // Filter by category
    if (categoryFilter !== 'All') {
      results = results.filter(item => item.category === categoryFilter);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(item => 
        item.title.toLowerCase().includes(term) || 
        item.category.toLowerCase().includes(term) ||
        item.excerpt?.toLowerCase().includes(term)
      );
    }
    
    setFilteredNews(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, categoryFilter, news]);
  
  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle category filter
  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
  };
  
  // Handle delete confirmation
  const openDeleteModal = (newsItem) => {
    setNewsToDelete(newsItem);
    setDeleteModalOpen(true);
  };
  
  // Close delete modal
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setNewsToDelete(null);
  };
  
  // Handle delete
  const confirmDelete = async () => {
    if (!newsToDelete) return;
    
    try {
      await newsService.deleteNews(newsToDelete.id);
      
      // Remove from state
      setNews(prev => prev.filter(item => item.id !== newsToDelete.id));
      
      // Show success message
      alert('News item deleted successfully!');
      
      closeDeleteModal();
    } catch (err) {
      console.error('Error deleting news:', err);
      setError('Failed to delete news item. Please try again.');
      closeDeleteModal();
    }
  };
  
  // Handle set featured
  const handleSetFeatured = async (newsId) => {
    try {
      // Get current news item
      const currentItem = news.find(item => item.id === newsId);
      if (!currentItem) return;
      
      // First, remove featured flag from all items
      const updatedItems = await Promise.all(
        news
          .filter(item => item.featured)
          .map(item => newsService.updateNews(item.id, { featured: false }))
      );
      
      // Then set the selected item as featured
      await newsService.updateNews(newsId, { featured: true });
      
      // Update state
      setNews(prev => 
        prev.map(item => ({
          ...item,
          featured: item.id === newsId
        }))
      );
      
      // Show success message
      alert('Featured news updated successfully!');
    } catch (err) {
      console.error('Error setting featured news:', err);
      setError('Failed to update featured status. Please try again.');
    }
  };
  
  // Pagination
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  // Generate array of page numbers
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };
  
  return (
    <AdminLayout>
      <Head>
        <title>News Management | MITRA Admin</title>
      </Head>
      
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>News Management</h1>
          <Link href="/admin/news/create">
            <button className={styles.createButton}>
              <FaPlus /> Add New
            </button>
          </Link>
        </div>
        
        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.card}>
            <div className={styles.cardIconContainer} style={{ backgroundColor: 'rgba(30, 132, 73, 0.1)' }}>
              <div className={styles.cardIcon} style={{ color: '#1E8449' }}>
                <FaNewspaper />
              </div>
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>Total News</h3>
              <p className={styles.cardValue}>{stats.total}</p>
            </div>
          </div>
          
          <div className={styles.card}>
            <div className={styles.cardIconContainer} style={{ backgroundColor: 'rgba(243, 156, 18, 0.1)' }}>
              <div className={styles.cardIcon} style={{ color: '#F39C12' }}>
                <FaStar />
              </div>
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>Featured</h3>
              <p className={styles.cardValue}>{stats.featured}</p>
            </div>
          </div>
          
          <div className={styles.card}>
            <div className={styles.cardIconContainer} style={{ backgroundColor: 'rgba(52, 152, 219, 0.1)' }}>
              <div className={styles.cardIcon} style={{ color: '#3498DB' }}>
                <FaEye />
              </div>
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>Categories</h3>
              <p className={styles.cardValue}>{Object.keys(stats.categories).length}</p>
            </div>
          </div>
        </div>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <div className={styles.filterSection}>
          <div className={styles.searchContainer}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search news..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          <select 
            className={styles.filterDropdown}
            value={categoryFilter}
            onChange={handleCategoryChange}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category} {category !== 'All' ? `(${stats.categories[category] || 0})` : ''}
              </option>
            ))}
          </select>
        </div>
        
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading news items...</p>
          </div>
        ) : paginatedNews.length === 0 ? (
          <div className={styles.noResults}>
            <h3>No news items found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Likes</th>
                  <th>Views</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedNews.map(item => (
                  <tr key={item.id}>
                    <td>{item.title}</td>
                    <td>{item.category}</td>
                    <td>{formatFullDate(item.publishDate)}</td>
                    <td>{item.likes || 0}</td>
                    <td>{item.viewCount || 0}</td>
                    <td>
                      {item.featured ? (
                        <span className={styles.featured}>Featured</span>
                      ) : (
                        <button
                          className={styles.featuredButton}
                          onClick={() => handleSetFeatured(item.id)}
                          title="Set as featured"
                        >
                          <FaStar />
                        </button>
                      )}
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <Link href={`/news-events/${item.slug}`} target="_blank">
                          <button className={styles.viewButton} title="View">
                            <FaEye />
                          </button>
                        </Link>
                        
                        <Link href={`/admin/news/${item.id}/edit`}>
                          <button className={styles.editButton} title="Edit">
                            <FaEdit />
                          </button>
                        </Link>
                        
                        <button 
                          className={styles.deleteButton} 
                          onClick={() => openDeleteModal(item)}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {totalPages > 1 && (
          <div className={styles.pagination}>
            {getPageNumbers().map(page => (
              <button
                key={page}
                className={`${styles.pageButton} ${
                  currentPage === page ? styles.pageButtonActive : ''
                }`}
                onClick={() => handlePageChange(page)}
                disabled={currentPage === page}
              >
                {page}
              </button>
            ))}
          </div>
        )}
        
        {/* Delete Confirmation Modal */}
        {deleteModalOpen && (
          <div className={styles.deleteModal}>
            <div className={styles.modalContent}>
              <h3 className={styles.modalTitle}>Confirm Deletion</h3>
              <p className={styles.modalText}>
                Are you sure you want to delete "{newsToDelete?.title}"? This action cannot be undone.
              </p>
              <div className={styles.modalButtons}>
                <button 
                  className={styles.cancelButton}
                  onClick={closeDeleteModal}
                >
                  Cancel
                </button>
                <button 
                  className={styles.confirmButton}
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default NewsDashboard;