import React, { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const HTMLResumeViewer = ({ 
  formData, 
  darkMode, 
  onRef, 
  isPdfExport = false,
  isMobileView
}) => {
  const { t } = useTranslation();
  const resumeRef = useRef(null); 
  const containerRef = useRef(null);
  const [scale, setScale] = useState(0.6);
   // At the top of HTMLResumeViewer component
console.log('HTMLResumeViewer received data:', {
  has_formData: !!formData,
  photo_field: formData?.photo,
  photos_field: formData?.photos,
  personal_info_photo: formData?.personal_info?.photo,
  all_photo_related: Object.keys(formData || {}).filter(key => 
    key.toLowerCase().includes('photo')
  )
});
  useEffect(() => {
    if (onRef && resumeRef.current) {
      onRef(resumeRef.current);
    }
  }, [onRef, resumeRef.current]);
   
  useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current) return;
      
      // Get container width
      const containerWidth = containerRef.current.clientWidth;
      
      // A4 paper is 8.3 inches, convert to pixels (96 DPI baseline)
      const a4WidthInPixels = 8.3 * 96; 
      
      // Calculate scale to fit container with some padding
      let newScale = (containerWidth - 40) / a4WidthInPixels;
      
      // Limit scale to reasonable bounds
      newScale = Math.min(0.9, Math.max(0.3, newScale));
      
      setScale(newScale);
    };
    
    // Initial calculation
    calculateScale();
    
    // Recalculate on window resize
    const handleResize = () => calculateScale();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [containerRef.current, isMobileView]);
   
  const colorScheme = {
    light: {
      background: 'white',
      text: '#333',
      mutedText: '#666',
      headingColor: '#4299e1',
      contactBadges: {
        email: '#f0f9ff',
        address: '#f7f7f7',
        online: '#edf2ff',
        personal: '#f0f4f8'
      }
    },
    dark: {
      background: '#1a202c',
      text: '#e2e8f0',
      mutedText: '#a0aec0',
      headingColor: '#4299e1',
      contactBadges: {
        email: '#2c5282',
        address: '#2d3748',
        online: '#2a4365',
        personal: '#2c4255'
      }
    }
  };
  const currentColorScheme = darkMode ? colorScheme.dark : colorScheme.light;
   
  const hasValidData = (section, keyToCheck) => {
    return section && Array.isArray(section) && section.some(item => item[keyToCheck]);
  };
   
  const hasExperiences = hasValidData(formData.experiences, 'company');
  const hasEducations = hasValidData(formData.educations, 'institution');
  const hasSkills = hasValidData(formData.skills, 'name');
  const hasCourses = hasValidData(formData.courses, 'name');
  const hasInternships = hasValidData(formData.internships, 'company'); 
  const hasHobbies = hasValidData(formData.hobbies, 'name');
  const hasLanguages = formData.languages && 
                   Array.isArray(formData.languages) && 
                   formData.languages.some(item => item.language || item.name);
  const hasExtracurriculars = formData.extracurriculars && 
                          Array.isArray(formData.extracurriculars) && 
                          formData.extracurriculars.some(item => item.title); // Changed from item.name 
  const hasCustomSections = formData.custom_sections && 
                           Array.isArray(formData.custom_sections) && 
                           formData.custom_sections.some(section => section.title && section.content);
  const hasReferences = formData.referrals && 
                      (formData.referrals.providedOnRequest || 
                       (Array.isArray(formData.referrals) && formData.referrals.some(ref => ref.name)));
  
  return (
    <div 
      ref={containerRef}
      className={`flex flex-col items-center w-full h-full overflow-auto ${darkMode ? 'bg-gray-900' : 'bg-white'}`}
    >
      {/* Dynamic scaling container */}
      <div 
        style={{ 
          transform: isPdfExport ? 'scale(1)' : `scale(${scale})`,
          transformOrigin: 'top center',
          width: isPdfExport ? 'auto' : `${100 / scale}%`,
          maxWidth: isPdfExport ? '100%' : `${8.3 * 96 / scale}px`,
          marginTop: '1rem',
          marginBottom: '1rem'
        }}
      >
        <div 
          ref={resumeRef}
          className="resume-page"
          style={{ 
            width: '8.3in',
            minHeight: '11in',
            padding: '0.6in',
            margin: '0 auto',
            boxShadow: darkMode 
              ? '0 0 10px rgba(255, 255, 255, 0.1)' 
              : '0 0 10px rgba(0, 0, 0, 0.1)',
            backgroundColor: currentColorScheme.background,
            color: currentColorScheme.text,
            fontFamily: 'Arial, sans-serif',
            position: 'relative'
          }}
        >
          {/* Header - Personal Information */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            flexWrap: 'wrap'
          }}>
           <div style={{ 
 width: formData.photo && formData.photo.photolink 
  ? 'calc(100% - 120px)' 
  : '100%'
}}>
              <h1 style={{
                fontSize: '1.8rem',
                fontWeight: 'bold',
                margin: '0 0 0.25rem 0',
                color: currentColorScheme.text
              }}>{formData.personal_info.full_name || t('resume.personal_info.full_name_placeholder')}</h1>
              <p style={{
                fontSize: '1.2rem',
                color: currentColorScheme.mutedText,
                margin: '0 0 0.5rem 0',
              }}>{formData.personal_info.title || ''}</p>
              
              {/* Contact Information Section - Organized in logical groups */}
              <div style={{ marginBottom: '0.5rem' }}>
                {/* Essential Contact Information */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  fontSize: '0.8rem',
                  marginBottom: '0.4rem'
                }}>
                  {formData.personal_info.email && (
                    <span style={{ 
                      marginRight: '1rem',
                      backgroundColor: currentColorScheme.contactBadges.email,
                      padding: '0.15rem 0.5rem',
                      borderRadius: '4px',
                      marginBottom: '0.3rem',
                      display: 'inline-block',
                      color: currentColorScheme.text
                    }}>{formData.personal_info.email}</span>
                  )}
                  {formData.personal_info.mobile && (
                    <span style={{ 
                      marginRight: '1rem',
                      backgroundColor: currentColorScheme.contactBadges.email,
                      padding: '0.15rem 0.5rem',
                      borderRadius: '4px',
                      marginBottom: '0.3rem',
                      display: 'inline-block',
                      color: currentColorScheme.text
                    }}>{formData.personal_info.mobile}</span>
                  )}
                </div>
                
                {/* Address Information */}
                {(formData.personal_info.address || formData.personal_info.city || formData.personal_info.postal_code) && (
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    fontSize: '0.8rem',
                    marginBottom: '0.4rem'
                  }}>
                    {formData.personal_info.address && (
                      <span style={{ 
                        marginRight: '1rem',
                        backgroundColor: currentColorScheme.contactBadges.address,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                        marginBottom: '0.3rem',
                        display: 'inline-block',
                        color: currentColorScheme.text
                      }}>{formData.personal_info.address}</span>
                    )}
                    {formData.personal_info.city && (
                      <span style={{ 
                        marginRight: '1rem',
                        backgroundColor: currentColorScheme.contactBadges.address,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                        marginBottom: '0.3rem',
                        display: 'inline-block',
                        color: currentColorScheme.text
                      }}>{formData.personal_info.city}</span>
                    )}
                    {formData.personal_info.postal_code && (
                      <span style={{ 
                        marginRight: '1rem',
                        backgroundColor: currentColorScheme.contactBadges.address,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                        marginBottom: '0.3rem',
                        display: 'inline-block',
                        color: currentColorScheme.text
                      }}>{t('resume.personal_info.postal_code')}: {formData.personal_info.postal_code}</span>
                    )}
                  </div>
                )}
                
                {/* Online Presence */}
                {(formData.personal_info.linkedin || formData.personal_info.website) && (
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    fontSize: '0.8rem',
                    marginBottom: '0.4rem'
                  }}>
                    {formData.personal_info.linkedin && (
                      <span style={{ 
                        marginRight: '1rem',
                        backgroundColor: currentColorScheme.contactBadges.online,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                        marginBottom: '0.3rem',
                        display: 'inline-block',
                        color: currentColorScheme.text
                      }}>LinkedIn: {formData.personal_info.linkedin}</span>
                    )}
                    {formData.personal_info.website && (
                      <span style={{ 
                        marginRight: '1rem',
                        backgroundColor: currentColorScheme.contactBadges.online,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                        marginBottom: '0.3rem',
                        display: 'inline-block',
                        color: currentColorScheme.text
                      }}>Website: {formData.personal_info.website}</span>
                    )}
                  </div>
                )}
                
                {/* Personal Details */}
                {(formData.personal_info.nationality || formData.personal_info.driving_license || 
                  formData.personal_info.date_of_birth || formData.personal_info.place_of_birth) && (
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    fontSize: '0.8rem'
                  }}>
                    {formData.personal_info.nationality && (
                      <span style={{ 
                        marginRight: '1rem',
                        backgroundColor: currentColorScheme.contactBadges.personal,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                        marginBottom: '0.3rem',
                        display: 'inline-block',
                        color: currentColorScheme.text
                      }}>{t('resume.personal_info.nationality')}: {formData.personal_info.nationality}</span>
                    )}
                    {formData.personal_info.driving_license && (
                      <span style={{ 
                        marginRight: '1rem',
                        backgroundColor: currentColorScheme.contactBadges.personal,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                        marginBottom: '0.3rem',
                        display: 'inline-block',
                        color: currentColorScheme.text
                      }}>{t('resume.personal_info.driving_license')}: {formData.personal_info.driving_license}</span>
                    )}
                    {formData.personal_info.date_of_birth && (
                      <span style={{ 
                        marginRight: '1rem',
                        backgroundColor: currentColorScheme.contactBadges.personal,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                        marginBottom: '0.3rem',
                        display: 'inline-block',
                        color: currentColorScheme.text
                      }}>{t('resume.personal_info.date_of_birth')}: {formData.personal_info.date_of_birth}</span>
                    )}
                    {formData.personal_info.place_of_birth && (
                      <span style={{ 
                        marginRight: '1rem',
                        backgroundColor: currentColorScheme.contactBadges.personal,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                        marginBottom: '0.3rem',
                        display: 'inline-block',
                        color: currentColorScheme.text
                      }}>{t('resume.personal_info.place_of_birth')}: {formData.personal_info.place_of_birth}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {formData.photo && formData.photo.photolink && (
              <img 
                src={formData.photo.photolink}
                alt={t('resume.photo.alt')}
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: darkMode ? '3px solid #4299e1' : 'none'
                }}
              />
            )}
          </div>
          
          {/* Summary */}
          {formData.personal_info.summary && (
            <div style={{
              margin: '1rem 0',
              textAlign: 'justify',
              lineHeight: '1.4',
              color: currentColorScheme.text
            }}>
              <p>{formData.personal_info.summary}</p>
            </div>
          )}
          
          {/* Experience */}
          {hasExperiences && (
            <div style={{ margin: '1.5rem 0' }}>
              <h2 style={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: currentColorScheme.headingColor,
                borderBottom: `2px solid ${currentColorScheme.headingColor}`,
                paddingBottom: '0.25rem',
                marginBottom: '0.75rem',
              }}>{t('resume.experience.title').toUpperCase()}</h2>
              {formData.experiences
                .filter(exp => exp.company)
                .map((exp, index) => (
                  <div key={index} style={{ marginBottom: '1rem', color: currentColorScheme.text }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '0.25rem',
                      flexWrap: 'wrap',
                    }}>
                      <span style={{ fontWeight: 'bold', color: currentColorScheme.text }}>{exp.company}</span>
                      <span style={{ fontStyle: 'italic', textAlign: 'right', color: currentColorScheme.mutedText }}>{exp.position}</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.85rem',
                      color: currentColorScheme.mutedText,
                      marginBottom: '0.5rem',
                      flexWrap: 'wrap',
                    }}>
                      <span>
                        {exp.start_date} - {exp.current ? t('common.tonow') : exp.end_date || ''}
                      </span>
                      <span>{exp.location}</span>
                    </div>
                    {exp.description && (
                      <p style={{
                        marginTop: '0.5rem',
                        lineHeight: '1.4',
                        textAlign: 'justify',
                        color: currentColorScheme.text
                      }}>{exp.description}</p>
                    )}
                  </div>
                ))}
            </div>
          )}
          
          {/* Education */}
          {hasEducations && (
            <div style={{ margin: '1.5rem 0' }}>
              <h2 style={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: currentColorScheme.headingColor,
                borderBottom: `2px solid ${currentColorScheme.headingColor}`,
                paddingBottom: '0.25rem',
                marginBottom: '0.75rem',
              }}>{t('resume.education.title').toUpperCase()}</h2>
              {formData.educations
                .filter(edu => edu.institution)
                .map((edu, index) => (
                  <div key={index} style={{ marginBottom: '1rem' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '0.25rem',
                      flexWrap: 'wrap',
                    }}>
                      <span style={{ 
                        fontWeight: 'bold', 
                        color: currentColorScheme.text 
                      }}>{edu.institution}</span>
                      <span style={{ 
                        fontStyle: 'italic', 
                        textAlign: 'right',
                        color: currentColorScheme.mutedText
                      }}>
                        {edu.degree}{edu.field_of_study ? `, ${edu.field_of_study}` : ''}
                      </span>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.85rem',
                      color: currentColorScheme.mutedText,
                      marginBottom: '0.5rem',
                      flexWrap: 'wrap',
                    }}>
                      <span>
                        {edu.start_date} - {edu.current ? t('common.tonow') : edu.end_date || ''}
                      </span>
                      <span>{edu.location}</span>
                    </div>
                    {edu.gpa && (
                      <p style={{ 
                        marginTop: '0.5rem',
                        color: currentColorScheme.text
                      }}>GPA: {edu.gpa}</p>
                    )}
                  </div>
                ))}
            </div>
          )}
          
          {/* Skills */}
          {hasSkills && (
            <div style={{ margin: '1.5rem 0' }}>
              <h2 style={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: currentColorScheme.headingColor,
                borderBottom: `2px solid ${currentColorScheme.headingColor}`,
                paddingBottom: '0.25rem',
                marginBottom: '0.75rem',
              }}>{t('resume.skills.title').toUpperCase()}</h2>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                color: currentColorScheme.text
              }}>
                {formData.skills
                  .filter(skill => skill.name)
                  .map((skill, index, array) => (
                    <span key={index} style={{ marginRight: '0.25rem', color: currentColorScheme.text }}>
                      {skill.name} ({skill.level})
                      {index < array.length - 1 ? ' • ' : ''}
                    </span>
                  ))}
              </div>
            </div>
          )}
          
          {hasLanguages && (
            <div style={{ margin: '1.5rem 0' }}>
              <h2 style={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: currentColorScheme.headingColor,
                borderBottom: `2px solid ${currentColorScheme.headingColor}`,
                paddingBottom: '0.25rem',
                marginBottom: '0.75rem',
              }}>{t('resume.languages.title').toUpperCase()}</h2>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                color: currentColorScheme.text
              }}>
                {formData.languages
                  .filter(lang => lang.language || lang.name)
                  .map((lang, index, array) => (
                    <span key={index} style={{ marginRight: '0.25rem', color: currentColorScheme.text }}>
                      {lang.language || lang.name} ({lang.proficiency || lang.level})
                      {index < array.length - 1 ? ' • ' : ''}
                    </span>
                  ))}
              </div>
            </div>
          )}

          {/* Courses */}
          {hasCourses && (
            <div style={{ margin: '1.5rem 0' }}>
              <h2 style={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: currentColorScheme.headingColor,
                borderBottom: `2px solid ${currentColorScheme.headingColor}`,
                paddingBottom: '0.25rem',
                marginBottom: '0.75rem',
              }}>{t('resume.courses.title').toUpperCase()}</h2>
              {formData.courses
                .filter(course => course.name)
                .map((course, index) => (
                  <div key={index} style={{ marginBottom: '1rem' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '0.25rem',
                      flexWrap: 'wrap',
                    }}>
                      <span style={{ 
                        fontWeight: 'bold',
                        color: currentColorScheme.text
                      }}>
                        {course.name}
                        {course.institution && ` at ${course.institution}`}
                      </span>
                    </div>
                    {course.description && (
                      <p style={{
                        marginTop: '0.5rem',
                        lineHeight: '1.4',
                        textAlign: 'justify',
                        color: currentColorScheme.text
                      }}>{course.description}</p>
                    )}
                  </div>
                ))}
            </div>
          )}

          {/* Internships */}
          {hasInternships && (
            <div style={{ margin: '1.5rem 0' }}>
              <h2 style={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: currentColorScheme.headingColor,
                borderBottom: `2px solid ${currentColorScheme.headingColor}`,
                paddingBottom: '0.25rem',
                marginBottom: '0.75rem',
              }}>{t('resume.internships.title').toUpperCase()}</h2>
              {formData.internships
                .filter(internship => internship.company)
                .map((internship, index) => (
                  <div key={index} style={{ marginBottom: '1rem' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '0.25rem',
                      flexWrap: 'wrap',
                    }}>
                      <span style={{ 
                        fontWeight: 'bold',
                        color: currentColorScheme.text
                      }}>{internship.company}</span>
                      <span style={{ 
                        fontStyle: 'italic', 
                        textAlign: 'right',
                        color: currentColorScheme.mutedText
                      }}>{internship.position}</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.85rem',
                      color: currentColorScheme.mutedText,
                      marginBottom: '0.5rem',
                      flexWrap: 'wrap',
                    }}>
                      <span>
                        {internship.start_date} - {internship.current ? t('common.tonow') : internship.end_date || ''}
                      </span>
                      <span>{internship.location}</span>
                    </div>
                    {internship.description && (
                      <p style={{
                        marginTop: '0.5rem',
                        lineHeight: '1.4',
                        textAlign: 'justify',
                        color: currentColorScheme.text
                      }}>{internship.description}</p>
                    )}
                  </div>
                ))}
            </div>
          )}
             
          {/* Custom Sections */}
          {hasCustomSections && (
            <>
              {formData.custom_sections
                .filter(section => section.title && section.content)
                .map((section, index) => (
                  <div key={index} style={{ margin: '1.5rem 0' }}>
                    <h2 style={{
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      color: currentColorScheme.headingColor,
                      borderBottom: `2px solid ${currentColorScheme.headingColor}`,
                      paddingBottom: '0.25rem',
                      marginBottom: '0.75rem',
                    }}>{section.title.toUpperCase()}</h2>
                    <div style={{
                      lineHeight: '1.4',
                      textAlign: 'justify',
                      color: currentColorScheme.text
                    }}>{section.content}</div>
                  </div>
                ))}
            </>
          )}
          
          {hasExtracurriculars && (
            <div style={{ margin: '1.5rem 0' }}>
              <h2 style={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: currentColorScheme.headingColor,
                borderBottom: `2px solid ${currentColorScheme.headingColor}`,
                paddingBottom: '0.25rem',
                marginBottom: '0.75rem',
              }}>{t('resume.extracurricular.activity').toUpperCase()}</h2>
              {formData.extracurriculars
                .filter(activity => activity.title) // Changed from activity.name
                .map((activity, index) => (
                  <div key={index} style={{ marginBottom: '1rem' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '0.25rem',
                      flexWrap: 'wrap',
                    }}>
                      <span style={{ 
                        fontWeight: 'bold',
                        color: currentColorScheme.text
                      }}>{activity.title}</span> {/* Changed from activity.name */}
                      {activity.duration && (
                        <span style={{ 
                          fontSize: '0.85rem',
                          color: currentColorScheme.mutedText
                        }}>{activity.duration}</span>
                      )}
                    </div>
                    {activity.description && (
                      <p style={{
                        marginTop: '0.5rem',
                        lineHeight: '1.4',
                        textAlign: 'justify',
                        color: currentColorScheme.text
                      }}>{activity.description}</p>
                    )}
                  </div>
                ))}
            </div>
          )}
          
          {/* Hobbies */}
          {hasHobbies && (
            <div style={{ margin: '1.5rem 0' }}>
              <h2 style={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: currentColorScheme.headingColor,
                borderBottom: `2px solid ${currentColorScheme.headingColor}`,
                paddingBottom: '0.25rem',
                marginBottom: '0.75rem',
              }}>{t('resume.hobbies.title').toUpperCase()}</h2>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                color: currentColorScheme.text
              }}>
                {formData.hobbies
                  .filter(hobby => hobby.name)
                  .map((hobby, index, array) => (
                    <span key={index} style={{ marginRight: '0.25rem', color: currentColorScheme.text }}>
                      {hobby.name}
                      {index < array.length - 1 ? ' • ' : ''}
                    </span>
                  ))}
              </div>
            </div>
          )}
          
          {/* References */}
          {hasReferences && (
            <div style={{ margin: '1.5rem 0' }}>
              <h2 style={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: currentColorScheme.headingColor,
                borderBottom: `2px solid ${currentColorScheme.headingColor}`,
                paddingBottom: '0.25rem',
                marginBottom: '0.75rem',
              }}>{t('resume.references.title').toUpperCase()}</h2>
              
              {/* Check the structure of referrals */}
              {typeof formData.referrals === 'object' && formData.referrals.providedOnRequest ? (
                <p style={{ 
                  fontStyle: 'italic',
                  color: currentColorScheme.text 
                }}>{t('resume.references.provide_upon_request')}</p>
              ) : (
                Array.isArray(formData.referrals) && formData.referrals.some(ref => ref.name) && (
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '1.5rem'
                  }}>
                    {formData.referrals
                      .filter(ref => ref.name)
                      .map((ref, index) => (
                        <div key={index} style={{ 
                          marginBottom: '1rem',
                          width: '100%',
                          maxWidth: '45%',
                          color: currentColorScheme.text
                        }}>
                          <div style={{ 
                            fontWeight: 'bold',
                            color: currentColorScheme.text 
                          }}>{ref.name}</div>
                          <div style={{ 
                            fontStyle: 'italic',
                            color: currentColorScheme.mutedText 
                          }}>{ref.relation}</div>
                          <div style={{ 
                            fontSize: '0.85rem',
                            color: currentColorScheme.text
                          }}>
                            {ref.email && <div>{ref.email}</div>}
                            {ref.phone && <div>{ref.phone}</div>}
                          </div>
                        </div>
                      ))}
                  </div>
                )
              )}
            </div>
          )} 
        </div>
      </div>
    </div>
  );
};

export default HTMLResumeViewer;