// components/admin/GalleryUpload.js
import { useState, useRef } from 'react';
import { FaUpload, FaTimes, FaSpinner } from 'react-icons/fa';
import styled from 'styled-components';
import { storageService } from '../../lib/firebaseStorage';
import { cloudinaryService } from '../../lib/cloudinaryService';
import { galleryService } from '../../lib/galleryService';

const Container = styled.div`
  margin-bottom: 2rem;
`;

const UploadArea = styled.div`
  border: 2px dashed ${props => props.isDragging ? props.theme.colors.primary : '#ddd'};
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: ${props => props.isDragging ? 'rgba(30, 132, 73, 0.05)' : 'transparent'};
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background-color: rgba(30, 132, 73, 0.05);
  }
`;

const FileInput = styled.input`
  display: none;
`;

const IconContainer = styled.div`
  font-size: 2.5rem;
  color: #aaa;
  margin-bottom: 1rem;
`;

const Text = styled.p`
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
`;

const Hint = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.lightText};
`;

const ErrorMessage = styled.p`
  color: ${props => props.theme.colors.error};
  margin-top: 1rem;
`;

const PreviewContainer = styled.div`
  margin-top: 1.5rem;
`;

const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const PreviewItem = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: rgba(255, 255, 255, 0.8);
  color: #333;
  border: none;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: white;
    transform: scale(1.1);
  }
`;

const CategorySelect = styled.select`
  padding: 0.5rem;
  margin-right: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const ProgressContainer = styled.div`
  margin-top: 1rem;
`;

const ProgressBar = styled.div`
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 0.5rem;
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: ${props => props.theme.colors.primary};
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const InfoText = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.primary};
  margin-top: 0.5rem;
`;

const Button = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: #166638;
    transform: translateY(-2px);
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const GalleryUpload = ({ onUploadComplete }) => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const fileInputRef = useRef(null);
  
  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await galleryService.getGalleryCategories();
        setCategories(cats);
        if (cats.length > 0) {
          setSelectedCategory(cats[0].id);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories');
      }
    };
    
    fetchCategories();
  }, []);
  
  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    processFiles(selectedFiles);
  };
  
  // Process and validate files
  const processFiles = (selectedFiles) => {
    setError(null);
    
    // Validate file types
    const validFiles = selectedFiles.filter(file => {
      return file.type.match('image.*');
    });
    
    if (validFiles.length !== selectedFiles.length) {
      setError('Please upload only image files');
    }
    
    // Check file sizes (max 5MB)
    const validSizedFiles = validFiles.filter(file => {
      return file.size <= 5 * 1024 * 1024;
    });
    
    if (validSizedFiles.length !== validFiles.length) {
      setError('Some files are too large. Maximum size is 5MB per image');
    }
    
    // Create previews and add to state
    const newFiles = [...files, ...validSizedFiles];
    setFiles(newFiles);
    
    const newPreviews = validSizedFiles.map(file => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name
    }));
    
    setPreviews([...previews, ...newPreviews]);
  };
  
  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };
  
  // Remove preview
  const removePreview = (index) => {
    const newPreviews = [...previews];
    const newFiles = [...files];
    
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(previews[index].url);
    
    newPreviews.splice(index, 1);
    newFiles.splice(index, 1);
    
    setPreviews(newPreviews);
    setFiles(newFiles);
  };
  
  // Open file dialog
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Handle category change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };
  
  // Upload files
  const handleUpload = async () => {
    if (files.length === 0 || !selectedCategory) {
      setError('Please select files and a category');
      return;
    }
    
    setLoading(true);
    setProgress(0);
    
    try {
      const totalFiles = files.length;
      let uploaded = 0;
      
      // Get selected category details
      const category = categories.find(cat => cat.id === selectedCategory);
      
      for (const file of files) {
        // 1. Upload to Firebase Storage first
        const path = `gallery/${category.name}/${Date.now()}-${file.name}`;
        const firebaseUrl = await storageService.uploadImage(file, path);
        
        // 2. Upload to Cloudinary for optimized delivery
        const cloudinaryResult = await cloudinaryService.uploadImage(file, {
          public_id: `mitra-gallery/${category.name}/${Date.now()}-${file.name.split('.')[0]}`,
          folder: 'mitra-gallery'
        });
        
        // 3. Save to Firestore
        await galleryService.addGalleryItem({
          title: file.name.split('.')[0].replace(/[-_]/g, ' '),
          description: '',
          category: selectedCategory,
          categoryName: category.name,
          firebaseUrl,
          cloudinaryUrl: cloudinaryResult.secure_url,
          cloudinaryPublicId: cloudinaryResult.public_id,
          width: cloudinaryResult.width,
          height: cloudinaryResult.height,
          format: cloudinaryResult.format
        });
        
        // Update progress
        uploaded++;
        setProgress(Math.round((uploaded / totalFiles) * 100));
      }
      
      // Clear files and previews after successful upload
      setFiles([]);
      previews.forEach(preview => URL.revokeObjectURL(preview.url));
      setPreviews([]);
      
      // Notify parent component
      if (onUploadComplete) {
        onUploadComplete();
      }
      
    } catch (error) {
      console.error('Error uploading files:', error);
      setError('Failed to upload images. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container>
      <FileInput
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
      />
      
      <UploadArea
        isDragging={isDragging}
        onClick={openFileDialog}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <IconContainer>
          {loading ? <FaSpinner className="spinner" /> : <FaUpload />}
        </IconContainer>
        <Text>
          {loading
            ? 'Uploading images...'
            : 'Click or drag images to upload'}
        </Text>
        <Hint>Supported formats: JPG, PNG, GIF, WebP (max 5MB per image)</Hint>
      </UploadArea>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {loading && (
        <ProgressContainer>
          <Text>Uploading {files.length} images ({progress}%)</Text>
          <ProgressBar>
            <ProgressFill progress={progress} />
          </ProgressBar>
          <InfoText>Please wait while we upload and optimize your images...</InfoText>
        </ProgressContainer>
      )}
      
      {previews.length > 0 && (
        <PreviewContainer>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <CategorySelect 
              value={selectedCategory} 
              onChange={handleCategoryChange}
              disabled={loading}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </CategorySelect>
            
            <Button 
              onClick={handleUpload}
              disabled={loading || !selectedCategory}
            >
              {loading ? (
                <>
                  <FaSpinner className="spinner" />
                  Uploading...
                </>
              ) : (
                <>
                  <FaUpload />
                  Upload {previews.length} Images
                </>
              )}
            </Button>
          </div>
          
          <PreviewGrid>
            {previews.map((preview, index) => (
              <PreviewItem key={index}>
                <PreviewImage src={preview.url} alt={preview.name} />
                <RemoveButton 
                  onClick={(e) => {
                    e.stopPropagation();
                    removePreview(index);
                  }}
                  disabled={loading}
                >
                  <FaTimes size={12} />
                </RemoveButton>
              </PreviewItem>
            ))}
          </PreviewGrid>
        </PreviewContainer>
      )}
    </Container>
  );
};

export default GalleryUpload;