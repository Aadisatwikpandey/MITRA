// pages/admin/news/index.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaPlus, FaEdit, FaTrash, FaEye, FaStar } from 'react-icons/fa';
import { formatFullDate } from '../../../utils/dateFormatter';
import { newsService } from '../../../lib/newsService';
import AdminLayout from '../../../components/admin/AdminLayout';
import styles from '../../../styles/admin/Dashboard.module.css';

// Mock data for development (to be replaced with actual Firestore data)
const MOCK_NEWS = [
  {
    id: '1',
    title: 'New Computer Lab Inauguration',
    slug: 'new-computer-lab-inauguration',
    publishDate: new Date(2024, 9, 15),
    category: 'School Updates',
    likes: 24,
    featured: true
  },
  {
    id: '2',
    title: 'Annual Cultural Festival "Sanskriti 2024"',
    slug: 'annual-cultural-festival-sanskriti-2024',
    publishDate: new Date(2024, 9, 10),
    category: 'Events',
    likes: 18,
    featured: false
  },
  {
    id: '3',
    title: 'Teacher Training Workshop',
    slug: 'teacher-training-workshop',
    publishDate: new Date(2024, 9, 5),
    category: 'Training',
    likes: 12,
    featured: false
  },
  {
    id: '4',
    title: 'Community Health Camp Success',
    slug: 'community-health-camp-success',
    publishDate: new Date(2024, 8, 28),
    category: 'Community Outreach',
    likes: 31,
    featured: false
  },
  {
    id: '5',
    title: 'New Scholarship Program for Girls',
    slug: 'new-scholarship-program-for-girls',
    publishDate: new Date(2024, 8, 20),
    category: 'Education',
    likes: 45,
    featured: false
  }
];

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
  const itemsPerPage = 10;
  
  // Categories derived from news items
  const categories = ['All', ...Array.from(new Set(news.map(item => item.category)))];
  
  // Load news data
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        // In production, this would be a call to fetch data from Firestore
        // For development, use mock data
        setNews(MOCK_NEWS);
        setFilteredNews(MOCK_NEWS);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news items. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNews();
  }, []);
  
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
        item.category.toLowerCase().includes(term)
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
      // In production, this would call the API to delete from Firestore
      // For now, just remove from local state
      setNews(prev => prev.filter(item => item.id !== newsToDelete.id));
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
      // In production, this would call the API to update Firestore
      // For now, update local state
      setNews(prev => 
        prev.map(item => ({
          ...item,
          featured: item.id === newsId
        }))
      );
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
        
        {error && <div className={styles.error}>{error}</div>}
        
        <div className={styles.filterSection}>
          <input
            type="text"
            placeholder="Search news..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={handleSearch}
          />
          
          <select 
            className={styles.filterDropdown}
            value={categoryFilter}
            onChange={handleCategoryChange}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        
        {loading ? (
          <div className={styles.loading}>Loading news items...</div>
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
                    <td>{item.likes}</td>
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