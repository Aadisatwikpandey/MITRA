// pages/admin/gallery/upload.js
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { FaUpload, FaSpinner, FaTimes, FaFileImage, FaFilm } from 'react-icons/fa';
import AdminLayout from '../../../components/admin/AdminLayout';
import { db, collection, getDocs, addDoc, Timestamp } from '../../../lib/firebase';
import { storageService } from '../../../lib/firebaseStorage';

const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.lightText};
  font-size: 1rem;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
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

const UploadIcon = styled.div`
  font-size: 3rem;
  color: #aaa;
  margin-bottom: 1rem;
`;

const UploadText = styled.p`
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
  font-size: 1.2rem;
`;

const UploadHint = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.lightText};
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(30, 132, 73, 0.1);
  }
`;

const PreviewsContainer = styled.div`
  margin-top: 2rem;
`;

const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const PreviewItem = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  aspect-ratio: 1/1;
  background-color: #f5f5f5;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PreviewVideo = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #666;
`;

const FileTypeIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const FileName = styled.div`
  font-size: 0.8rem;
  text-align: center;
  padding: 0 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
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

const ProgressContainer = styled.div`
  margin-top: 2rem;
`;

const ProgressInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const ProgressBar = styled.div`
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: ${props => props.theme.colors.primary};
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
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

const ErrorMessage = styled.div`
  color: #e74c3c;
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: rgba(231, 76, 60, 0.1);
  border-radius: 4px;
`;

const SuccessMessage = styled.div`
  color: #27ae60;
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: rgba(39, 174, 96, 0.1);
  border-radius: 4px;
`;

const GalleryUploadPage = () => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const fileInputRef = useRef(null);
  const router = useRouter();
  
  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'gallery-categories'));
        
        const cats = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setCategories(cats);
        
        if (cats.length > 0) {
          setSelectedCategory(cats[0].id);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please refresh and try again.');
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
      return file.type.match('image.*') || file.type.match('video.*');
    });
    
    if (validFiles.length !== selectedFiles.length) {
      setError('Some files are not valid. Please upload only images and videos.');
    }
    
    // Check file sizes (max 10MB for images, 50MB for videos)
    const validSizedFiles = validFiles.filter(file => {
      const isVideo = file.type.match('video.*');
      const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
      return file.size <= maxSize;
    });
    
    if (validSizedFiles.length !== validFiles.length) {
      setError('Some files are too large. Maximum size is 10MB for images and 50MB for videos.');
    }
    
    // Create previews and add to state
    const newFiles = [...files, ...validSizedFiles];
    setFiles(newFiles);
    
    const newPreviews = validSizedFiles.map(file => {
      const isImage = file.type.match('image.*');
      
      if (isImage) {
        return {
          file,
          type: 'image',
          url: URL.createObjectURL(file),
          name: file.name
        };
      } else {
        return {
          file,
          type: 'video',
          name: file.name
        };
      }
    });
    
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
    if (newPreviews[index].url) {
      URL.revokeObjectURL(newPreviews[index].url);
    }
    
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
  

  const generateVideoThumbnail = async (videoFile) => {
    return new Promise((resolve, reject) => {
      try {
        // Create video element
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.playsInline = true;
        video.muted = true;
        
        // Set up source
        const videoUrl = URL.createObjectURL(videoFile);
        video.src = videoUrl;
        
        // Set up event handlers
        video.onloadeddata = () => {
          // Seek to 1 second or 25% of the video, whichever is less
          const seekTime = Math.min(1, video.duration * 0.25);
          video.currentTime = seekTime;
        };
        
        video.onseeked = () => {
          // Create canvas and draw video frame
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Convert to Blob
          canvas.toBlob((blob) => {
            // Clean up video element
            URL.revokeObjectURL(videoUrl);
            resolve(blob);
          }, 'image/jpeg', 0.7); // JPEG at 70% quality
        };
        
        video.onerror = () => {
          URL.revokeObjectURL(videoUrl);
          reject(new Error('Error generating video thumbnail'));
        };
        
        // Start loading the video
        video.load();
      } catch (error) {
        reject(error);
      }
    });
  };




  // Upload files
  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please select files to upload');
      return;
    }
    
    if (!selectedCategory) {
      setError('Please select a category');
      return;
    }
    
    setUploading(true);
    setProgress(0);
    setError(null);
    setSuccess(null);
    
    try {
      const category = categories.find(cat => cat.id === selectedCategory);
      const totalFiles = files.length;
      let uploadedCount = 0;
      
      for (const file of files) {
        // Determine file type
        const isVideo = file.type.match('video.*');
        const mediaType = isVideo ? 'video' : 'image';
        
        // Create path in Firebase Storage
        const path = `gallery/${category.name}/${mediaType}s/${Date.now()}-${file.name}`;
        
        // Upload to Firebase Storage
        const fileUrl = await storageService.uploadImage(file, path);
        
        // Create title from filename
        const title = file.name
          .split('.')[0]
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase());
        
        let thumbnailUrl = null;
        let thumbnailPath = null;
        
        // If it's a video, generate and upload a thumbnail
        if (isVideo) {
          try {
            // Generate thumbnail
            const thumbnailBlob = await generateVideoThumbnail(file);
            
            // Create a File object from the Blob
            const thumbnailFile = new File(
              [thumbnailBlob], 
              `thumbnail-${file.name.split('.')[0]}.jpg`, 
              { type: 'image/jpeg' }
            );
            
            // Upload thumbnail
            thumbnailPath = `gallery/${category.name}/thumbnails/${Date.now()}-thumbnail-${file.name.split('.')[0]}.jpg`;
            thumbnailUrl = await storageService.uploadImage(thumbnailFile, thumbnailPath);
            
            console.log('Generated and uploaded thumbnail:', thumbnailUrl);
          } catch (err) {
            console.error('Error generating thumbnail:', err);
            // Continue without thumbnail if generation fails
          }
        }
        
        // Add document to Firestore with thumbnail data if available
        await addDoc(collection(db, 'gallery'), {
          title,
          description: '',
          category: selectedCategory,
          categoryName: category.name,
          mediaType,
          firebaseUrl: fileUrl,
          firebasePath: path,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          thumbnailUrl,
          thumbnailPath,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
        
        // Update progress
        uploadedCount++;
        setProgress(Math.round((uploadedCount / totalFiles) * 100));
      }
      
      // Show success message
      setSuccess(`Successfully uploaded ${files.length} files to the gallery`);
      
      // Reset state
      setFiles([]);
      previews.forEach(preview => {
        if (preview.url) {
          URL.revokeObjectURL(preview.url);
        }
      });
      setPreviews([]);
      
      // Redirect after a delay
      setTimeout(() => {
        router.push('/admin/gallery');
      }, 2000);
      
    } catch (err) {
      console.error('Error uploading files:', err);
      setError('Failed to upload files. Please try again.');
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <AdminLayout>
      <Head>
        <title>Upload Gallery Media | MITRA Admin</title>
      </Head>
      
      <Container>
        <Header>
          <Title>Upload to Gallery</Title>
          <Subtitle>Upload multiple images and videos to the gallery</Subtitle>
        </Header>
        
        <Card>
          <FormGroup>
            <Label htmlFor="category">Select Category *</Label>
            <Select
              id="category"
              value={selectedCategory}
              onChange={handleCategoryChange}
              disabled={uploading}
            >
              {categories.length === 0 ? (
                <option value="">Loading categories...</option>
              ) : (
                categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))
              )}
            </Select>
          </FormGroup>
          
          <FileInput
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,video/*"
            multiple
          />
          
          <UploadArea
            isDragging={isDragging}
            onClick={openFileDialog}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <UploadIcon>
              <FaUpload />
            </UploadIcon>
            <UploadText>
              Click or drag files to upload
            </UploadText>
            <UploadHint>
              Upload multiple images and videos (JPG, PNG, GIF, MP4, etc.)
            </UploadHint>
          </UploadArea>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
          
          {previews.length > 0 && (
            <PreviewsContainer>
              <Label>Selected Files ({previews.length})</Label>
              
              <PreviewGrid>
                {previews.map((preview, index) => (
                  <PreviewItem key={index}>
                    {preview.type === 'image' ? (
                      <PreviewImage src={preview.url} alt={preview.name} />
                    ) : (
                      <PreviewVideo>
                        <FileTypeIcon>
                          <FaFilm />
                        </FileTypeIcon>
                        <FileName>{preview.name}</FileName>
                      </PreviewVideo>
                    )}
                    
                    <RemoveButton
                      onClick={() => removePreview(index)}
                      disabled={uploading}
                    >
                      <FaTimes size={12} />
                    </RemoveButton>
                  </PreviewItem>
                ))}
              </PreviewGrid>
              
              {uploading ? (
                <ProgressContainer>
                  <ProgressInfo>
                    <span>Uploading {files.length} files...</span>
                    <span>{progress}%</span>
                  </ProgressInfo>
                  <ProgressBar>
                    <ProgressFill progress={progress} />
                  </ProgressBar>
                </ProgressContainer>
              ) : (
                <Button
                  onClick={handleUpload}
                  disabled={uploading || files.length === 0 || !selectedCategory}
                  style={{ marginTop: '1.5rem' }}
                >
                  {uploading ? (
                    <>
                      <FaSpinner className="spinner" /> Uploading...
                    </>
                  ) : (
                    <>
                      <FaUpload /> Upload {files.length} Files
                    </>
                  )}
                </Button>
              )}
            </PreviewsContainer>
          )}
        </Card>
      </Container>
    </AdminLayout>
  );
};

export default GalleryUploadPage;