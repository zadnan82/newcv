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

const resizeImage = (file, maxWidth = 600, maxHeight = 600, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      let { width, height } = img;
      
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      
      if (ratio < 1) {
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      ctx.drawImage(img, 0, 0, width, height);
      
      const targetSizeKB = 200;
      let currentQuality = quality;
      let base64 = canvas.toDataURL('image/jpeg', currentQuality);
      
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

const handlePhotoChange = async (e) => {
  const file = e.target.files[0];
  setUploadError('');
  
  if (!file) return;

  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    setUploadError(t('resume.photo.invalid_type'));
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    setUploadError(t('resume.photo.size_limit'));
    return;
  }

  setIsProcessing(true);

  try {
    console.log('Processing image file:', file.name, 'Original size:', Math.round(file.size / 1024), 'KB');
    
    const base64Image = await resizeImage(file, 600, 600, 0.7);
    
    const finalSizeKB = Math.round(base64Image.length / 1024);
    console.log('Image converted to base64, final size:', finalSizeKB, 'KB');
    
    if (base64Image.length > 500 * 1024) {
      setUploadError(t('cloud.compressed_too_large'));
      return;
    }
    
    setCurrentPhotoUrl(base64Image);
    onChange({ photolink: base64Image });
    
    console.log('✅ Photo successfully converted to base64 and saved, size:', finalSizeKB, 'KB');
    
  } catch (error) {
    console.error('❌ Error processing photo:', error);
    setUploadError(t('resume.photo.process_error'));
  } finally {
    setIsProcessing(false);
  }
};

  const removePhoto = async () => {
    try {
      setIsProcessing(true);
      setUploadError('');
      
      setCurrentPhotoUrl('');
      onChange({ photolink: null });
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      console.log('✅ Photo removed');
      
    } catch (error) {
      console.error('❌ Error removing photo:', error);
      setUploadError(t('cloud.remove_error'));
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
        {t('resume.photo.title')}
      </h3>

      <div className="space-y-3">
        {hasPhoto ? (
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src={currentPhotoUrl} 
                alt={t('resume.photo.alt')}
                className="w-20 h-20 rounded-md object-cover border shadow-md"
                onError={(e) => {
                  console.error('Image display error:', e);
                  setUploadError(t('common.error'));
                }}
              />
              <button
                type="button"
                onClick={removePhoto}
                disabled={isProcessing}
                className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow-md disabled:opacity-50"
                aria-label={t('resume.photo.remove_photo')}
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
                  ? t('cloud.processing') 
                  : t('resume.photo.change')}
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
                ? t('cloud.processing') 
                : t('resume.photo.upload')}
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
          <p>{t('resume.photo.max_size')}</p>
          <p className="mt-1">
            {t('cloud.base64_info')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Base64PhotoUpload;