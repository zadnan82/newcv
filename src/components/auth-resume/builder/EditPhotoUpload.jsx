import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useResumeStore from '../../../stores/resumeStore';

const EditPhotoUpload = ({ darkMode, data = [], onChange }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState(''); 
  const updatePhoto = useResumeStore(state => state.updatePhoto);
  const deletePhoto = useResumeStore(state => state.deletePhoto);
  const currentResume = useResumeStore(state => state.currentResume); 
  const CLOUDINARY_CLOUD_NAME = 'dgxhrgcqz'; 

  useEffect(() => { 
    console.log('EditPhotoUpload received data:', data);
    console.log('Current resume photos:', currentResume?.photos);
    
    let photoUrl = '';
    
    // Check multiple possible sources for the photo URL with priority order
    
    // First, check if data has photolink property (modern format)
    if (data && typeof data === 'object' && data.photolink) {
      photoUrl = data.photolink;
      console.log('Using photolink from data object:', photoUrl);
    }
    // Second, check if data is an array with photo property (legacy format)
    else if (Array.isArray(data) && data.length > 0 && data[0]?.photo) {
      photoUrl = data[0].photo;
      console.log('Using photo from data array:', photoUrl);
    }
    // Third, check if currentResume has photos.photolink
    else if (currentResume?.photos?.photolink) {
      photoUrl = currentResume.photos.photolink;
      console.log('Using photolink from currentResume:', photoUrl);
    }
    
    // Update local state if we found a photo URL
    if (photoUrl && photoUrl !== currentPhotoUrl) {
      console.log('Setting currentPhotoUrl to:', photoUrl);
      setCurrentPhotoUrl(photoUrl);
    }
  }, [currentResume?.id]); 

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    setUploadError('');
    setUploadProgress(0);
    
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setUploadError(t('resume.photo.invalid_type', 'Please upload a valid image file (JPG, PNG, or GIF)'));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setUploadError(t('resume.photo.size_limit', 'Photo size should be less than 2MB'));
      return;
    }

    setIsUploading(true);

    try {
      // Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'user_cv_images');

      // Set a unique public_id for the image
      const timestamp = Date.now();
      const uniqueId = Math.floor(Math.random() * 1000);
      formData.append('public_id', `cvati/user_${uniqueId}_${timestamp}`);
      
      // Upload to Cloudinary using fetch
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Cloudinary Error:', errorText);
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }
      
      const responseData = await response.json();
      const imageUrl = responseData.secure_url;
      
      // For editing existing resume, update the database immediately
      if (currentResume?.id) {
        console.log(`Updating photo for resume ${currentResume.id} in database with URL:`, imageUrl);
        await updatePhoto(imageUrl);
      }
      
      // Update component state
      setCurrentPhotoUrl(imageUrl);
      
      // Update the parent with the consistent data format - IMPORTANT
      console.log('Calling onChange with photolink:', imageUrl);
      onChange({ photolink: imageUrl });
      
    } catch (error) {
      console.error('Error uploading photo to Cloudinary:', error);
      setUploadError(t('resume.photo.upload_error', 'Error uploading photo. Please try again.'));
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removePhoto = async () => {
    try {
      setIsUploading(true); // Show loading state
      setUploadError('');
      
      // Get the current resume ID
      const resumeId = currentResume?.server_id || currentResume?.id;
      
      // If this is a server-side resume, use the dedicated delete method
      if (resumeId && !isNaN(parseInt(resumeId))) {
        console.log(`Deleting photo for resume ${resumeId} from database`);
        await deletePhoto(resumeId);
      } else {
        // For local resumes, just update with empty string
        console.log('Updating photo to empty string (local resume)');
        await updatePhoto('');
      }
      
      // Update component state
      setCurrentPhotoUrl('');
      
      // Update parent with consistent empty photolink format - IMPORTANT
      console.log('Calling onChange with empty photolink');
      onChange({ photolink: '' });
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error removing photo:', error);
      setUploadError(t('resume.photo.remove_error', 'Error removing photo. Please try again.'));
    } finally {
      setIsUploading(false);
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
              />
              <button
                type="button"
                onClick={removePhoto}
                className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow-md"
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
              />
              <label
                htmlFor="photo-upload"
                className={`inline-block w-full px-2 py-1.5 text-sm text-center ${
                  isUploading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105'
                } text-white rounded-full transition-all duration-300 shadow-md`}
              >
                {isUploading 
                  ? t('resume.photo.uploading', 'Uploading...') 
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
            />
            <label
              htmlFor="photo-upload"
              className={`inline-block w-full px-2 py-1.5 text-sm text-center ${
                isUploading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105'
              } text-white rounded-full transition-all duration-300 shadow-md`}
            >
              {isUploading 
                ? t('resume.photo.uploading', 'Uploading...') 
                : t('resume.photo.upload', 'Upload Photo')}
            </label>
          </div>
        )}
        
        {isUploading && (
          <div className="w-full bg-gray-200 rounded-full h-1.5 my-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-1.5 rounded-full transition-all duration-300" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
        
        {uploadError && (
          <p className="text-xs text-red-500 mt-1">{uploadError}</p>
        )}
        <p className={`text-xs mt-1 ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {t('resume.photo.max_size', 'Maximum size: 2MB')}
        </p>
      </div>
    </div>
  );
};

export default EditPhotoUpload;