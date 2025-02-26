// lib/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

/**
 * Upload image to Cloudinary
 * @param {File|String} file - File object or base64 string
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} Cloudinary upload response
 */
export const uploadImage = async (file, options = {}) => {
  try {
    const uploadOptions = {
      folder: 'mitra-news',
      ...options
    };

    // If file is a base64 data URL
    if (typeof file === 'string' && file.startsWith('data:')) {
      return await cloudinary.uploader.upload(file, uploadOptions);
    }
    
    // If file is a File object, we need to convert it to base64 first
    // This is meant for server-side uploads using API routes
    if (file && typeof file === 'object') {
      if (typeof window === 'undefined') {
        // Server-side: Use buffer upload
        return await cloudinary.uploader.upload(file.path, uploadOptions);
      } else {
        // Client-side: Convert to base64 first
        const base64 = await fileToBase64(file);
        return await cloudinary.uploader.upload(base64, uploadOptions);
      }
    }

    throw new Error('Invalid file format for upload');
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

/**
 * Delete image from Cloudinary
 * @param {String} publicId - Public ID of the image
 * @returns {Promise<Object>} Cloudinary deletion response
 */
export const deleteImage = async (publicId) => {
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

/**
 * Convert file to base64
 * @param {File} file - File object
 * @returns {Promise<String>} Base64 string
 */
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export default cloudinary;