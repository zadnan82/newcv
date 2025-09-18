// src/components/auth-resume/view-cv/ResumePreview.jsx - Updated for Base64 images
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ResumePreview2 = ({ 
  formData, 
  darkMode, 
  hasUserStartedFilling, 
  isMobileView, 
  showPlaceholders = true,
  showToast 
}) => {
  const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);

  // Helper function to safely get photo URL
  const getPhotoUrl = () => {
    try {
      // Handle different photo data structures
      if (formData?.photo?.photolink) {
        return formData.photo.photolink;
      }
      if (formData?.photos?.photolink) {
        return formData.photos.photolink;
      }
      return null;
    } catch (error) {
      console.warn('Error getting photo URL:', error);
      return null;
    }
  };

  const photoUrl = getPhotoUrl();
  const hasPhoto = photoUrl && !imageError;

  // Handle image loading errors
  const handleImageError = (e) => {
    console.warn('Image display error:', e);
    setImageError(true);
    if (showToast) {
      showToast('Error displaying image', 'error');
    }
  };

  // Reset image error when photo changes
  React.useEffect(() => {
    setImageError(false);
  }, [photoUrl]);

  // Color scheme based on customization
  const accentColor = formData?.customization?.accent_color || '#1a5276';
  const fontFamily = formData?.customization?.font_family || 'Helvetica, Arial, sans-serif';
  
  const previewStyles = {
    fontFamily,
    '--accent-color': accentColor,
  };

  // Placeholder content for empty sections
  const getPlaceholderText = (section) => {
    if (!showPlaceholders) return '';
    
    const placeholders = {
      name: 'Your Full Name',
      email: 'your.email@example.com',
      mobile: '+1 (123) 456-7890',
      city: 'Your City',
      title: 'Your Professional Title',
      summary: 'Write a brief professional summary highlighting your key skills and experience...',
      experience: 'Add your work experience to showcase your professional background',
      education: 'Add your educational background',
      skills: 'List your key skills and expertise',
      languages: 'Add languages you speak',
    };
    
    return placeholders[section] || '';
  };

  return (
    <div 
      className={`h-full w-full ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} p-4 overflow-auto`}
      style={previewStyles}
    >
      <div className="max-w-4xl mx-auto">
        {/* Resume Container */}
        <div className={`${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        } shadow-2xl rounded-lg overflow-hidden`}>
          
          {/* Header Section */}
          <div className={`p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              
              {/* Profile Photo */}
              <div className="flex-shrink-0">
                {hasPhoto ? (
                  <div className="relative">
                    <img
                      src={photoUrl}
                      alt="Profile"
                      className="w-32 h-32 rounded-lg object-cover border-4 border-white shadow-lg"
                      onError={handleImageError}
                      onLoad={() => {
                        console.log('✅ Image loaded successfully');
                        setImageError(false);
                      }}
                    />
                    {/* Image size indicator for debugging */}
                    {photoUrl?.startsWith('data:image') && (
                      <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        ✓ Base64
                      </div>
                    )}
                  </div>
                ) : showPlaceholders ? (
                  <div className={`w-32 h-32 rounded-lg border-2 border-dashed ${
                    darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-100'
                  } flex items-center justify-center`}>
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Photo
                    </span>
                  </div>
                ) : null}
              </div>

              {/* Personal Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2" style={{ color: accentColor }}>
                  {formData?.personal_info?.full_name || getPlaceholderText('name')}
                </h1>
                
                {(formData?.personal_info?.title || showPlaceholders) && (
                  <h2 className={`text-xl mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {formData?.personal_info?.title || getPlaceholderText('title')}
                  </h2>
                )}

                <div className="flex flex-col md:flex-row md:flex-wrap gap-2 text-sm">
                  {(formData?.personal_info?.email || showPlaceholders) && (
                    <div className="flex items-center justify-center md:justify-start">
                      <span className="mr-2">📧</span>
                      <span>{formData?.personal_info?.email || getPlaceholderText('email')}</span>
                    </div>
                  )}
                  
                  {(formData?.personal_info?.mobile || showPlaceholders) && (
                    <div className="flex items-center justify-center md:justify-start">
                      <span className="mr-2">📱</span>
                      <span>{formData?.personal_info?.mobile || getPlaceholderText('mobile')}</span>
                    </div>
                  )}
                  
                  {(formData?.personal_info?.city || showPlaceholders) && (
                    <div className="flex items-center justify-center md:justify-start">
                      <span className="mr-2">📍</span>
                      <span>{formData?.personal_info?.city || getPlaceholderText('city')}</span>
                    </div>
                  )}

                  {formData?.personal_info?.linkedin && (
                    <div className="flex items-center justify-center md:justify-start">
                      <span className="mr-2">💼</span>
                      <span className="text-blue-600">{formData.personal_info.linkedin}</span>
                    </div>
                  )}

                  {formData?.personal_info?.website && (
                    <div className="flex items-center justify-center md:justify-start">
                      <span className="mr-2">🌐</span>
                      <span className="text-blue-600">{formData.personal_info.website}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Summary */}
            {(formData?.personal_info?.summary || showPlaceholders) && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3" style={{ color: accentColor }}>
                  {t('resume.personal_info.summary', 'Professional Summary')}
                </h3>
                <p className={`leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {formData?.personal_info?.summary || getPlaceholderText('summary')}
                </p>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="p-6 space-y-8">
            
            {/* Experience Section */}
            {(formData?.experiences?.length > 0 || showPlaceholders) && (
              <section>
                <h3 className="text-xl font-semibold mb-4 pb-2 border-b-2" 
                    style={{ color: accentColor, borderColor: accentColor }}>
                  {t('resume.experience.title', 'Professional Experience')}
                </h3>
                
                {formData?.experiences?.length > 0 ? (
                  <div className="space-y-4">
                    {formData.experiences.map((exp, index) => (
                      <div key={index} className="border-l-2 pl-4" style={{ borderColor: accentColor }}>
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                          <div>
                            <h4 className="font-semibold">{exp.position}</h4>
                            <h5 className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {exp.company}
                            </h5>
                          </div>
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {exp.start_date} - {exp.current ? 'Present' : exp.end_date}
                            {exp.location && <div>{exp.location}</div>}
                          </div>
                        </div>
                        {exp.description && (
                          <p className={`mt-2 leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} italic`}>
                    {getPlaceholderText('experience')}
                  </p>
                )}
              </section>
            )}

            {/* Education Section */}
            {(formData?.educations?.length > 0 || showPlaceholders) && (
              <section>
                <h3 className="text-xl font-semibold mb-4 pb-2 border-b-2" 
                    style={{ color: accentColor, borderColor: accentColor }}>
                  {t('resume.education.title', 'Education')}
                </h3>
                
                {formData?.educations?.length > 0 ? (
                  <div className="space-y-4">
                    {formData.educations.map((edu, index) => (
                      <div key={index} className="border-l-2 pl-4" style={{ borderColor: accentColor }}>
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                          <div>
                            <h4 className="font-semibold">{edu.degree}</h4>
                            <h5 className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {edu.institution}
                            </h5>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {edu.field_of_study}
                            </p>
                          </div>
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {edu.start_date} - {edu.current ? 'Present' : edu.end_date}
                            {edu.location && <div>{edu.location}</div>}
                            {edu.gpa && <div>GPA: {edu.gpa}</div>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} italic`}>
                    {getPlaceholderText('education')}
                  </p>
                )}
              </section>
            )}

            {/* Skills Section */}
            {(formData?.skills?.length > 0 || showPlaceholders) && (
              <section>
                <h3 className="text-xl font-semibold mb-4 pb-2 border-b-2" 
                    style={{ color: accentColor, borderColor: accentColor }}>
                  {t('resume.skills.title', 'Skills')}
                </h3>
                
                {formData?.skills?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <span 
                        key={index} 
                        className={`px-3 py-1 rounded-full text-sm ${
                          darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
                        }`}
                        style={{ 
                          backgroundColor: `${accentColor}20`, 
                          color: accentColor,
                          border: `1px solid ${accentColor}40`
                        }}
                      >
                        {skill.name}
                        {skill.level && !formData?.customization?.hide_skill_level && (
                          <span className="ml-1 text-xs opacity-75">
                            ({skill.level})
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} italic`}>
                    {getPlaceholderText('skills')}
                  </p>
                )}
              </section>
            )}

            {/* Languages Section */}
            {(formData?.languages?.length > 0 || showPlaceholders) && (
              <section>
                <h3 className="text-xl font-semibold mb-4 pb-2 border-b-2" 
                    style={{ color: accentColor, borderColor: accentColor }}>
                  {t('resume.languages.title', 'Languages')}
                </h3>
                
                {formData?.languages?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {formData.languages.map((lang, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{lang.language || lang.name}</span>
                        <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {lang.proficiency || lang.level}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} italic`}>
                    {getPlaceholderText('languages')}
                  </p>
                )}
              </section>
            )}

            {/* Additional sections can be added here following the same pattern */}
            
            {/* Debug info for development */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                <h4 className="font-semibold mb-2">Debug Info:</h4>
                <div className="text-xs space-y-1">
                  <div>Has photo: {hasPhoto ? 'Yes' : 'No'}</div>
                  <div>Photo type: {photoUrl?.startsWith('data:image') ? 'Base64' : photoUrl?.startsWith('http') ? 'URL' : 'None'}</div>
                  <div>Image error: {imageError ? 'Yes' : 'No'}</div>
                  {photoUrl && (
                    <div>Photo size: ~{Math.round(photoUrl.length / 1024)}KB</div>
                  )}
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview2;