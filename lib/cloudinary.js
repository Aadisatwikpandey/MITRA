// lib/cloudinary.js
// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

let cloudinary;

// Only try to import cloudinary in production environment
if (!isDevelopment) {
  try {
    const { v2 } = require('cloudinary');
    cloudinary = v2;
    
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  } catch (error) {
    console.warn('Cloudinary initialization failed, using mock implementation', error);
    cloudinary = null;
  }
} else {
  // Mock implementation for development
  cloudinary = null;
}

// Upload function for server-side use
export const uploadImage = async (file) => {
  try {
    // In development mode, simulate a successful upload
    if (isDevelopment || !cloudinary) {
      // Wait to simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a mock URL using the file name if available
      let mockUrl;
      
      if (typeof file === 'string' && file.startsWith('data:image')) {
        // For base64 encoded images, create a generic mock URL
        mockUrl = `/images/news/mock-upload-${Date.now()}.jpg`;
      } else if (file.name) {
        // For File objects, use the file name
        mockUrl = `/images/news/${file.name}`;
      } else {
        // Generic fallback
        mockUrl = `/images/news/mock-upload-${Date.now()}.jpg`;
      }
      
      return {
        secure_url: mockUrl,
        public_id: `mitra-news/mock-${Date.now()}`,
        format: 'jpg',
        width: 800,
        height: 600
      };
    }
    
    // In production, use actual Cloudinary
    const result = await cloudinary.uploader.upload(file, {
      folder: 'mitra-news',
    });
    return result;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    
    // Even in production, provide a fallback if upload fails
    return {
      secure_url: `/images/news/fallback-image.jpg`,
      public_id: `mitra-news/fallback`,
      format: 'jpg',
      width: 800,
      height: 600
    };
  }
};

export default cloudinary;