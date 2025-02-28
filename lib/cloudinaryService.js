// lib/cloudinaryService.js
// Browser-compatible Cloudinary service

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

/**
 * Cloudinary service for client-side URL generation
 */
export const cloudinaryService = {
  /**
   * Generate optimized URLs for different sizes
   * @param {string} publicId - Cloudinary public ID
   * @param {Object} options - Transformation options
   * @returns {string} - Optimized Cloudinary URL
   */
  getOptimizedUrl: (publicId, options = {}) => {
    if (!publicId) return '';
    
    const { width, height, quality = 'auto', format = 'auto', crop = 'fill' } = options;
    
    let transformations = [];
    
    // Add width/height/crop if provided
    if (width || height) {
      let cropParams = `c_${crop}`;
      if (width) cropParams += `,w_${width}`;
      if (height) cropParams += `,h_${height}`;
      transformations.push(cropParams);
    }
    
    // Add quality parameter
    if (quality) {
      transformations.push(`q_${quality}`);
    }
    
    // Add format parameter
    if (format) {
      transformations.push(`f_${format}`);
    }
    
    // Add responsive transformations
    transformations.push('dpr_auto');
    
    // Construct the URL
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformations.join('/')}/${publicId}`;
  },
  
  /**
   * Get thumbnail URL
   * @param {string} publicId - Cloudinary public ID
   * @param {number} width - Thumbnail width
   * @returns {string} - Thumbnail URL
   */
  getThumbnailUrl: (publicId, width = 300) => {
    if (!publicId) return '';
    
    return cloudinaryService.getOptimizedUrl(publicId, {
      width,
      height: width,
      crop: 'fill',
      quality: 'auto',
      format: 'auto'
    });
  }
};

export default cloudinaryService;