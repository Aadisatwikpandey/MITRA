// components/admin/NewsForm.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaTimes } from 'react-icons/fa';
import { newsService } from '../../lib/newsService';
import ImageUpload from './ImageUpload';
import styles from '../../styles/admin/NewsForm.module.css';

// Predefined category options
const CATEGORIES = [
  'School Updates',
  'Events',
  'Training',
  'Community Outreach',
  'Education',
  'Environment',
  'School Events',
  'Skill Development',
  'Other'
];

const NewsForm = ({ initialData = null, isEdit = false }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'School Updates',
    excerpt: '',
    content: '',
    image: {
      url: '',
      publicId: ''
    },
    featured: false,
    publishDate: new Date().toISOString().split('T')[0] // Format as YYYY-MM-DD
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  
  // Initialize form with existing data if in edit mode
  useEffect(() => {
    if (isEdit && initialData) {
      const publishDate = initialData.publishDate instanceof Date
        ? initialData.publishDate.toISOString().split('T')[0]
        : new Date(initialData.publishDate).toISOString().split('T')[0];
      
      // Structure the image data properly
      const imageData = {
        url: initialData.image || '',
        publicId: initialData.imagePublicId || ''
      };
      
      setFormData({
        title: initialData.title || '',
        slug: initialData.slug || '',
        category: initialData.category || 'School Updates',
        excerpt: initialData.excerpt || '',
        content: initialData.content || '',
        image: imageData,
        featured: initialData.featured || false,
        publishDate
      });
    }
  }, [isEdit, initialData]);
  
  // Generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')  // Remove special characters
      .replace(/\s+/g, '-')      // Replace spaces with hyphens
      .replace(/-+/g, '-')       // Replace multiple hyphens with single hyphen
      .trim();
  };
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // If title is changing, auto-generate slug (only if slug hasn't been manually edited)
    if (name === 'title' && !formData.slug) {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        slug: generateSlug(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  // Handle image upload
  const handleImageChange = (imageData) => {
    setFormData(prev => ({
      ...prev,
      image: imageData
    }));
    
    // Clear image error
    if (errors.image) {
      setErrors(prev => ({ ...prev, image: null }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    
    if (!formData.publishDate) {
      newErrors.publishDate = 'Publish date is required';
    }
    
    if (!formData.image.url && !isEdit) {
      newErrors.image = 'Image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setSuccess('');
    
    try {
      // Prepare data for submission
      const newsData = {
        title: formData.title,
        slug: formData.slug,
        category: formData.category,
        excerpt: formData.excerpt,
        content: formData.content,
        image: formData.image.url,
        imagePublicId: formData.image.publicId,
        featured: formData.featured,
        publishDate: new Date(formData.publishDate)
      };
      
      if (isEdit) {
        // Update existing news
        await newsService.updateNews(initialData.id, newsData);
        setSuccess('News updated successfully!');
      } else {
        // Create new news
        await newsService.createNews(newsData);
        setSuccess('News created successfully!');
      }
      
      // Redirect after a delay for the success message to be visible
      setTimeout(() => {
        router.push('/admin/news');
      }, 1500);
      
    } catch (error) {
      console.error('Error saving news:', error);
      setErrors(prev => ({ 
        ...prev, 
        submit: 'Failed to save news. Please try again.' 
      }));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{isEdit ? 'Edit News' : 'Create News'}</h1>
        <p className={styles.subtitle}>
          {isEdit 
            ? 'Update existing news article' 
            : 'Create a new news article for the website'
          }
        </p>
      </div>
      
      {success && (
        <div className={styles.successMessage}>
          {success}
        </div>
      )}
      
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="title">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className={styles.formInput}
            value={formData.title}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.title && <p className={styles.error}>{errors.title}</p>}
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="slug">
            Slug *
            <span style={{ fontWeight: 'normal', marginLeft: '0.5rem', fontSize: '0.9rem' }}>
              (URL-friendly version of the title)
            </span>
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            className={styles.formInput}
            value={formData.slug}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.slug && <p className={styles.error}>{errors.slug}</p>}
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="category">
            Category *
          </label>
          <select
            id="category"
            name="category"
            className={styles.formSelect}
            value={formData.category}
            onChange={handleChange}
            disabled={loading}
          >
            {CATEGORIES.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && <p className={styles.error}>{errors.category}</p>}
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="excerpt">
            Excerpt
            <span style={{ fontWeight: 'normal', marginLeft: '0.5rem', fontSize: '0.9rem' }}>
              (Short summary for listings and previews)
            </span>
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            className={styles.formTextarea}
            value={formData.excerpt}
            onChange={handleChange}
            rows={3}
            disabled={loading}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="content">
            Content *
          </label>
          <textarea
            id="content"
            name="content"
            className={styles.formTextarea}
            value={formData.content}
            onChange={handleChange}
            rows={10}
            disabled={loading}
          />
          {errors.content && <p className={styles.error}>{errors.content}</p>}
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            Featured Image {!isEdit && '*'}
          </label>
          
          <ImageUpload 
            value={formData.image.url}
            onChange={handleImageChange}
            maxSizeMB={2}
          />
          
          {errors.image && <p className={styles.error}>{errors.image}</p>}
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="publishDate">
            Publish Date *
          </label>
          <input
            type="date"
            id="publishDate"
            name="publishDate"
            className={styles.formInput}
            value={formData.publishDate}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.publishDate && <p className={styles.error}>{errors.publishDate}</p>}
        </div>
        
        <div className={styles.formGroup}>
          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="featured"
              name="featured"
              className={`${styles.formInput} ${styles.checkbox}`}
              checked={formData.featured}
              onChange={handleChange}
              disabled={loading}
            />
            <label className={styles.formLabel} htmlFor="featured" style={{ marginBottom: 0 }}>
              Set as featured
            </label>
          </div>
        </div>
        
        {errors.submit && <p className={styles.error}>{errors.submit}</p>}
        
        <div className={styles.buttonGroup}>
          <Link href="/admin/news">
            <button type="button" className={styles.cancelButton} disabled={loading}>
              Cancel
            </button>
          </Link>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading 
              ? 'Saving...' 
              : isEdit 
                ? 'Update News' 
                : 'Create News'
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsForm;