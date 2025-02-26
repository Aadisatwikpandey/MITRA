// components/admin/ImageUpload.js
import { useState, useRef } from 'react';
import { FaUpload, FaTimes, FaSpinner } from 'react-icons/fa';
import styles from '../../styles/admin/ImageUpload.module.css';

const ImageUpload = ({ 
  value = '', 
  onChange, 
  className = '',
  maxSizeMB = 2,
}) => {
  const [preview, setPreview] = useState(value);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Validate file
  const validateFile = (file) => {
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return 'Please upload an image file (JPEG, PNG, GIF, or WEBP)';
    }
    
    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `Image size should be less than ${maxSizeMB}MB`;
    }
    
    return null;
  };

  // Handle file input change
  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file
    const errorMsg = validateFile(file);
    if (errorMsg) {
      setError(errorMsg);
      return;
    }
    
    // Clear any previous errors
    setError('');
    
    // Create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    // Start upload
    setLoading(true);
    
    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'mitra-news');
      
      console.log('Uploading file:', file.name);
      
      // Upload to server
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });
      
      // Check for network errors
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload response error:', response.status, errorText);
        throw new Error(`Upload failed with status: ${response.status}`);
      }
      
      // Parse the JSON response
      const data = await response.json();
      console.log('Upload response:', data);
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to upload image');
      }
      
      // Call onChange with the secure URL
      if (onChange) {
        // Return both URL and public_id for future reference (e.g., for deletion)
        onChange({
          url: data.url,
          publicId: data.publicId,
        });
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload image. Please try again.');
      // Keep the preview in case the user wants to try again
    } finally {
      setLoading(false);
    }
  };

  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Get the dropped file
    const file = e.dataTransfer.files[0];
    if (!file) return;
    
    // Update the file input and trigger change
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.files = dataTransfer.files;
      
      // Manually trigger change event
      const event = new Event('change', { bubbles: true });
      fileInputRef.current.dispatchEvent(event);
    }
  };

  // Handle remove
  const handleRemove = () => {
    setPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onChange) {
      onChange({
        url: '',
        publicId: ''
      });
    }
  };

  // Open file dialog
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        className={styles.fileInput}
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleChange}
      />
      
      {preview ? (
        <div className={styles.preview}>
          <div className={styles.imageWrapper}>
            <img src={preview} alt="Preview" className={styles.previewImage} />
            {loading && (
              <div className={styles.loadingOverlay}>
                <FaSpinner className={styles.spinner} />
              </div>
            )}
          </div>
          
          <button
            type="button"
            className={styles.removeButton}
            onClick={handleRemove}
            disabled={loading}
          >
            <FaTimes />
          </button>
        </div>
      ) : (
        <div
          className={styles.dropzone}
          onClick={openFileDialog}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className={styles.icon}>
            {loading ? <FaSpinner className={styles.spinner} /> : <FaUpload />}
          </div>
          <p className={styles.text}>
            {loading ? 'Uploading...' : 'Click or drag an image to upload'}
          </p>
          <p className={styles.hint}>
            Max size: {maxSizeMB}MB (JPEG, PNG, GIF, WEBP)
          </p>
        </div>
      )}
      
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default ImageUpload;