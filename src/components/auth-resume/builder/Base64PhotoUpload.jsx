import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const Base64PhotoUpload = ({ darkMode, data = {}, onChange }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const [uploadError, setUploadError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState('');

  useEffect(() => {
    console.log('Base64PhotoUpload - Data received:', data);
    
    // Handle different data formats
    let photoUrl = '';
    
    if (data && typeof data === 'object' && data.photolink) {
      photoUrl = data.photolink;
    } else if (typeof data === 'string') {
      photoUrl = data;
    }
    
    if (photoUrl && photoUrl !== currentPhotoUrl) {
      console.log('Setting photo URL:', photoUrl.substring(0, 50) + '...');
      setCurrentPhotoUrl(photoUrl);
    }
  }, [data, currentPhotoUrl]);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  // Update Base64PhotoUpload.jsx with better size optimization

const resizeImage = (file, maxWidth = 600, maxHeight = 600, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions - more aggressive resizing
      let { width, height } = img;
      
      // Always resize if image is larger than max dimensions
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      
      if (ratio < 1) {
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Use better image rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      // Try different qualities to get under size limit
      const targetSizeKB = 200; // Target 200KB for Base64
      let currentQuality = quality;
      let base64 = canvas.toDataURL('image/jpeg', currentQuality);
      
      // Reduce quality if still too large
      while (base64.length / 1024 > targetSizeKB && currentQuality > 0.3) {
        currentQuality -= 0.1;
        base64 = canvas.toDataURL('image/jpeg', currentQuality);
      }
      
      console.log(`📷 Image optimized: ${width}x${height}, quality: ${currentQuality.toFixed(1)}, size: ${Math.round(base64.length / 1024)}KB`);
      
      resolve(base64);
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

// Update the handlePhotoChange function in Base64PhotoUpload
const handlePhotoChange = async (e) => {
  const file = e.target.files[0];
  setUploadError('');
  
  if (!file) return;

  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    setUploadError(t('resume.photo.invalid_type', 'Please upload a valid image file (JPG, PNG, GIF, or WebP)'));
    return;
  }

  // Validate file size (10MB limit for processing, but we'll compress it down)
  if (file.size > 10 * 1024 * 1024) {
    setUploadError(t('resume.photo.size_limit', 'Photo size should be less than 10MB'));
    return;
  }

  setIsProcessing(true);

  try {
    console.log('Processing image file:', file.name, 'Original size:', Math.round(file.size / 1024), 'KB');
    
    // More aggressive resizing for smaller final size
    const base64Image = await resizeImage(file, 600, 600, 0.7);
    
    const finalSizeKB = Math.round(base64Image.length / 1024);
    console.log('Image converted to base64, final size:', finalSizeKB, 'KB');
    
    // Check final size
    if (base64Image.length > 500 * 1024) { // 500KB limit for Base64
      setUploadError(t('resume.photo.compressed_too_large', 'Image is still too large after compression. Please use a smaller image.'));
      return;
    }
    
    // Update component state
    setCurrentPhotoUrl(base64Image);
    
    // Update parent with base64 data
    onChange({ photolink: base64Image });
    
    console.log('✅ Photo successfully converted to base64 and saved, size:', finalSizeKB, 'KB');
    
  } catch (error) {
    console.error('❌ Error processing photo:', error);
    setUploadError(t('resume.photo.processing_error', 'Error processing photo. Please try a different image.'));
  } finally {
    setIsProcessing(false);
  }
};

  const removePhoto = async () => {
    try {
      setIsProcessing(true);
      setUploadError('');
      
      // Clear component state
      setCurrentPhotoUrl('');
      
      // Update parent with empty photolink
      onChange({ photolink: null });
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      console.log('✅ Photo removed');
      
    } catch (error) {
      console.error('❌ Error removing photo:', error);
      setUploadError(t('resume.photo.remove_error', 'Error removing photo. Please try again.'));
    } finally {
      setIsProcessing(false);
    }
  };

  const hasPhoto = !!currentPhotoUrl;

  return (
    <div className={`p-4 rounded-2xl border ${
      darkMode 
        ? 'border-gray-600 bg-gray-800/50' 
        : 'border-purple-500/10 bg-purple-500/5'
      } transition-all duration-300 hover:shadow-lg ${
        darkMode 
          ? 'hover:shadow-purple-500/5' 
          : 'hover:shadow-purple-500/10'
      } hover:-translate-y-0.5`}>
      <h3 className={`text-sm font-semibold mb-4 ${
        darkMode ? 'text-white' : 'text-gray-800'
      }`}>
        {t('resume.photo.title', 'Profile Photo')}
      </h3>

      <div className="space-y-3">
        {hasPhoto ? (
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src={currentPhotoUrl} 
                alt={t('resume.photo.alt', 'Profile')}
                className="w-20 h-20 rounded-md object-cover border shadow-md"
                onError={(e) => {
                  console.error('Image display error:', e);
                  setUploadError('Error displaying image');
                }}
              />
              <button
                type="button"
                onClick={removePhoto}
                disabled={isProcessing}
                className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow-md disabled:opacity-50"
                aria-label={t('resume.photo.remove_photo', 'Remove photo')}
              >
                ×
              </button>
            </div>
            <div className="flex-1">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                id="photo-upload"
                disabled={isProcessing}
              />
              <label
                htmlFor="photo-upload"
                className={`inline-block w-full px-2 py-1.5 text-sm text-center ${
                  isProcessing 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105'
                } text-white rounded-full transition-all duration-300 shadow-md`}
              >
                {isProcessing 
                  ? t('resume.photo.processing', 'Processing...') 
                  : t('resume.photo.change', 'Change Photo')}
              </label>
            </div>
          </div>
        ) : (
          <div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
              id="photo-upload"
              disabled={isProcessing}
            />
            <label
              htmlFor="photo-upload"
              className={`inline-block w-full px-2 py-1.5 text-sm text-center ${
                isProcessing 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105'
              } text-white rounded-full transition-all duration-300 shadow-md`}
            >
              {isProcessing 
                ? t('resume.photo.processing', 'Processing...') 
                : t('resume.photo.upload', 'Upload Photo')}
            </label>
          </div>
        )}
        
        {isProcessing && (
          <div className="w-full bg-gray-200 rounded-full h-1.5 my-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-1.5 rounded-full transition-all duration-300 animate-pulse" 
              style={{ width: '70%' }}
            ></div>
          </div>
        )}
        
        {uploadError && (
          <div className={`p-2 rounded-lg border ${
            darkMode 
              ? 'bg-red-900/20 border-red-700 text-red-300' 
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            <p className="text-xs">{uploadError}</p>
          </div>
        )}
        
        <div className={`text-xs ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <p>{t('resume.photo.max_size', 'Maximum size: 5MB')}</p>
          <p className="mt-1">
            {t('resume.photo.base64_info', 'Image will be stored directly in your CV file for maximum privacy.')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Base64PhotoUpload;