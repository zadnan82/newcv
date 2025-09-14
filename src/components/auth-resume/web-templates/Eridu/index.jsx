import React, { useEffect } from 'react';
import { getEriduStyles } from './EriduStyles';
import { useTranslation } from 'react-i18next';

const Eridu = ({ formData, customSettings, darkMode, isPdfMode = false }) => {
  const { t } = useTranslation();
 
  // Default custom settings with funky accent colors
  // Fix: Proper handling of boolean settings
  const settings = {
    accentColor: customSettings?.accentColor || '#FF5470', // Vibrant pink-red as default
    fontFamily: customSettings?.fontFamily || '"Poppins", "Montserrat", "Roboto", sans-serif',
    lineSpacing: customSettings?.lineSpacing || 1.6,
    headingsUppercase: customSettings?.headingsUppercase === false ? false : true, // Fix: Correctly handle boolean
    hideSkillLevel: customSettings?.hideSkillLevel === true ? true : false // Fix: Correctly handle boolean
  };

  // Create a normalized version of the data with consistent property names
  // but preserve the original translation references
  const data = {
    personal_info: formData?.personal_info || {
      full_name: t('resume.personal_info.full_name_placeholder'),
      title: t('resume.personal_info.title_placeholder'),
      email: t('resume.personal_info.email_placeholder'),
      mobile: t('resume.personal_info.mobile_placeholder'),
      city: t('resume.personal_info.city_placeholder'),
    },
    education: formData?.educations || formData?.education || [],
    experiences: formData?.experiences || [],
    skills: formData?.skills || [],
    languages: (formData?.languages || []).map(lang => ({
      language: lang?.name || lang?.language || "",
      proficiency: lang?.level || lang?.proficiency || ""
    })),
    internships: formData?.internships || [],
    courses: formData?.courses || [],
    hobbies: formData?.hobbies || [],
    extracurriculars: formData?.extracurriculars || [],
    referrals: formData?.referrals || { providedOnRequest: true, references: [] },
    custom_sections: formData?.custom_sections || [],
    photos: formData?.photos || formData?.photo || [],
  };
   
  // Get the styles specific to this template with PDF mode
  const styles = getEriduStyles(darkMode, settings, isPdfMode);

  // Format date helper with internationalization support
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    
    try {
      const [year, month] = dateStr.split('-').map(num => parseInt(num, 10));
      
      // Use Intl.DateTimeFormat for localized month names
      const dateObj = new Date(year, month - 1); // month is 0-indexed in JS Date
      const formatter = new Intl.DateTimeFormat(undefined, { month: 'long' });
      const localizedMonth = formatter.format(dateObj);
      
      return `${localizedMonth} ${year}`;
    } catch (e) {
      return dateStr;
    }
  };

  const DEFAULT_PROFILE_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23cccccc'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";
  let profileImage = DEFAULT_PROFILE_IMAGE; 
  if (formData.photo && formData.photo.photolink) {
    console.log('Found photo.photolink:', formData.photo.photolink);
    profileImage = formData.photo.photolink;
  } 
  else if (formData.photos && Array.isArray(formData.photos) && formData.photos.length > 0) {
    
    // Make sure the item has a photolink property
    if (formData.photos[0].photolink) {
      profileImage = formData.photos[0].photolink;
    }
  } 
  else if (data.photos) {
    if (Array.isArray(data.photos) && data.photos.length > 0 && data.photos[0].photolink) {
        
      profileImage = data.photos[0].photolink;
    } else if (data.photos.photolink) {
         
      profileImage = data.photos.photolink;
    }
  } 
  else if (formData.photolink) {
    console.log('Found direct photolink property');
    profileImage = formData.photolink;
  } 

  // Add funky decorative elements
  useEffect(() => {
    // Only add decorative elements when not in PDF mode
    if (!isPdfMode && typeof document !== 'undefined') {
      // Get the resume container
      const container = document.querySelector('.eridu-template');
      
      if (container) {
        // Remove any existing decorative elements
        const existingElements = container.querySelectorAll('.eridu-decorative-element');
        existingElements.forEach(element => element.remove());
        
        // Add random decorative shapes
        const shapeCount = 6;
        const shapes = [
          // Triangle
          `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 0L30 30H0L15 0Z" fill="${settings.accentColor}22"/>
          </svg>`,
          // Circle
          `<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12.5" cy="12.5" r="12.5" fill="${settings.accentColor}22"/>
          </svg>`,
          // Zigzag
          `<svg width="40" height="10" viewBox="0 0 40 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0L8 10L16 0L24 10L32 0L40 10" stroke="${settings.accentColor}44" stroke-width="2"/>
          </svg>`,
          // Square
          `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="20" height="20" fill="${settings.accentColor}22"/>
          </svg>`,
        ];
        
        for (let i = 0; i < shapeCount; i++) {
          const element = document.createElement('div');
          element.className = 'eridu-decorative-element';
          element.style.position = 'absolute';
          element.style.zIndex = '0';
          element.style.opacity = '0.7';
          element.style.pointerEvents = 'none';
          
          // Random position within the container
          const topPos = Math.floor(Math.random() * 100);
          const leftPos = Math.floor(Math.random() * 100);
          element.style.top = `${topPos}%`;
          element.style.left = `${leftPos}%`;
          
          // Random shape
          const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
          element.innerHTML = randomShape;
          
          // Random rotation
          const rotation = Math.floor(Math.random() * 360);
          element.style.transform = `rotate(${rotation}deg)`;
          
          // Random animation
          const animationDuration = Math.floor(Math.random() * 30 + 20);
          element.style.animation = `floatShape ${animationDuration}s linear infinite`;
          
          container.appendChild(element);
        }
      }
    }
    
    return () => {
      // Cleanup function to remove decorative elements when component unmounts
      if (typeof document !== 'undefined') {
        const existingElements = document.querySelectorAll('.eridu-decorative-element');
        existingElements.forEach(element => element.remove());
      }
    };
  }, [isPdfMode, settings.accentColor]);

  // Funky animation classes
  const enhancedClasses = isPdfMode ? {
    // PDF-specific classes (no animations for PDF)
    container: "print:bg-white print:shadow-none",
    header: "print:py-4",
    section: "print:break-inside-avoid print:border print:border-gray-200",
    expItem: "print:break-inside-avoid",
    sectionTitle: "print:break-after-avoid",
  } : {
    // Interactive UI classes with funky animations
    container: "transition-all duration-500 ease-in-out",
    header: "transition-all duration-500 ease-in-out",
    section: "transition-all duration-500 hover:translate-y-[-5px] hover:shadow-lg",
    expItem: "transition-all duration-300 hover:translate-x-1",
    sectionTitle: "transition-all duration-500 ease-in-out",
    skillBar: "transition-all duration-1000 ease-out",
    hobbyItem: "transition-all duration-300 hover:translate-y-[-3px]",
    contactItem: "transition-all duration-300 hover:scale-105"
  };

  // Funky animation timing for staggered entrance
  const getAnimationDelay = (index) => {
    return `${index * 0.1}s`;
  };
  
  // Helper function to check if array contains valid items with a specific key
  const hasContent = (array, keyToCheck) => {
    return array && 
           Array.isArray(array) && 
           array.filter(item => item && (keyToCheck ? item[keyToCheck] : true)).length > 0;
  };
  
  // Helper functions to check if sections have data
  const hasPersonalDetails = () => {
    return data.personal_info && (
      data.personal_info.address || 
      data.personal_info.postal_code || 
      data.personal_info.driving_license || 
      data.personal_info.nationality || 
      data.personal_info.place_of_birth || 
      data.personal_info.date_of_birth
    );
  };

  const hasReferences = () => {
    if (!data.referrals) return false;
    if (data.referrals.providedOnRequest === true) return true;
    
    // Check if referrals is an array or if it has a references array
    return (Array.isArray(data.referrals) && data.referrals.length > 0) || 
           (data.referrals.references && Array.isArray(data.referrals.references) && 
            data.referrals.references.length > 0);
  };

  // Skill level function with funky styling
  function getSkillLevelWidth(level) {
    const levels = {
      'Beginner': '20%',
      'Elementary': '40%',
      'Intermediate': '60%',
      'Advanced': '80%',
      'Expert': '100%',
      'Native': '100%',
      'Fluent': '90%',
      'Proficient': '80%',
      'Conversational': '60%',
      'Basic': '30%',
      'Novice': '15%',
      'Learning': '25%',
      'Familiar': '45%',
      'Competent': '65%',
      'Skilled': '75%',
      'Very Advanced': '85%',
      'Near Expert': '95%',
    };
    
    return levels[level] || '50%';
  }
  
  // Proficiency translation with funky language
  function getProficiencyTranslation(proficiency, t) {
    if (!proficiency) return '';
    
    const translationKeys = {
      'Native': 'resume.languages.levels.native',
      'Fluent': 'resume.languages.levels.fluent',
      'Advanced': 'resume.languages.levels.advanced',
      'Intermediate': 'resume.languages.levels.intermediate',
      'Beginner': 'resume.languages.levels.beginner',
       
    };
    
    return translationKeys[proficiency] && t(translationKeys[proficiency]) || proficiency;
  }

  // Style overrides for customized settings
  const customTitleStyle = settings.headingsUppercase ? 
    { ...styles.sectionTitle, textTransform: 'uppercase', letterSpacing: '2px' } : 
    { ...styles.sectionTitle, textTransform: 'none', letterSpacing: '0px' };

  const customNameStyle = settings.headingsUppercase ? 
    { ...styles.name, textTransform: 'uppercase', letterSpacing: '2px' } : 
    { ...styles.name, textTransform: 'none', letterSpacing: '0px' };

  return (
    <div style={styles.container} className={`eridu-template ${enhancedClasses.container}`}>
      {/* Funky header with diagonal cut */}
      <header style={styles.header} className={`eridu-header ${enhancedClasses.header}`}>
        {/* Upper header with profile and name */}
        <div style={styles.headerUpper} className="eridu-header-upper">
          {/* Profile section with funky image frame */}
          <div style={styles.profileSection} className="eridu-profile-section">
            <div style={styles.profileContainer} className="eridu-profile-container">
              <img 
                src={profileImage}
                alt={data.personal_info.full_name} 
                style={styles.profileImage} 
                className="eridu-profile-image"
              />
            </div>
            
            {/* Name and title with funky styling */}
            <div style={styles.nameSection} className="eridu-name-section">
              <h1 style={customNameStyle} className="eridu-name">{data.personal_info.full_name}</h1>
              <div style={styles.title} className="eridu-title">{data.personal_info.title}</div>
            </div>
          </div>
        </div>
        
        {/* Lower header with summary and contact */}
        <div style={styles.headerLower} className="eridu-header-lower">
          {/* Summary with funky quote styling */}
          {data.personal_info.summary && (
            <div style={styles.summary} className="eridu-summary">
              {data.personal_info.summary}
            </div>
          )}
          
          {/* Contact information with funky badge styling */}
          <div style={styles.contactGrid} className="eridu-contact-grid">
            {data.personal_info.email && (
              <div style={styles.contactItem} className={`eridu-contact-item ${enhancedClasses.contactItem}`}>
                <span style={styles.contactIcon}>✉️</span>
                <span>{data.personal_info.email}</span>
              </div>
            )}
            {data.personal_info.mobile && (
              <div style={styles.contactItem} className={`eridu-contact-item ${enhancedClasses.contactItem}`}>
                <span style={styles.contactIcon}>📱</span>
                <span>{data.personal_info.mobile}</span>
              </div>
            )}
           
            {data.personal_info.linkedin && (
              <div style={styles.contactItem} className={`eridu-contact-item ${enhancedClasses.contactItem}`}>
                <span style={styles.contactIcon}>🔗</span>
                <span>{data.personal_info.linkedin}</span>
              </div>
            )}
            {data.personal_info.website && (
              <div style={styles.contactItem} className={`eridu-contact-item ${enhancedClasses.contactItem}`}>
                <span style={styles.contactIcon}>🌐</span>
                <span>{data.personal_info.website}</span>
              </div>
            )}
            {data.personal_info.city && (
              <div style={styles.contactItem} className={`eridu-contact-item ${enhancedClasses.contactItem}`}>
                <span style={styles.contactIcon}>🏙️</span>
                <span>{data.personal_info.city}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content with two column layout */}
      <div style={styles.contentLayout} className="eridu-content-layout">
        <div style={styles.contentColumns} className="eridu-content-columns">
          {/* Left column */}
          <div style={styles.column} className="eridu-column eridu-column-left">
            {/* Work Experience with funky timeline */}
            {hasContent(data.experiences, 'company') && (
              <div 
                style={styles.section} 
                className={`eridu-section eridu-experience-section ${enhancedClasses.section}`}
              >
                <h2 
                  style={customTitleStyle} 
                  className={`eridu-section-title ${enhancedClasses.sectionTitle}`} 
                  data-section="experience"
                >
                  {t('resume.experience.title')}
                </h2>
                <div>
                  {data.experiences
                    .filter(exp => exp && exp.company)
                    .map((exp, index) => (
                      <div 
                        key={index} 
                        style={{
                          ...styles.expItem,
                          animationDelay: !isPdfMode ? getAnimationDelay(index) : '0s'
                        }} 
                        className={`eridu-exp-item ${enhancedClasses.expItem}`}
                      >
                        <div style={styles.expHeader}>
                          <div style={styles.expTitle}>{exp.position}</div>
                          <div style={styles.expCompany}>{exp.company}</div>
                          <div style={styles.expDate}>
                            {formatDate(exp.start_date)} - {exp.current ? t('resume.experience.current_work') : formatDate(exp.end_date)}
                          </div>
                        </div>

                        {exp.location && <div style={styles.expLocation}>{exp.location}</div>}
                        {exp.description && <div style={styles.expDescription}>{exp.description}</div>}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Education with funky timeline */}
            {hasContent(data.education, 'institution') && (
              <div 
                style={styles.section} 
                className={`eridu-section eridu-education-section ${enhancedClasses.section}`}
              >
                <h2 
                  style={customTitleStyle} 
                  className={`eridu-section-title ${enhancedClasses.sectionTitle}`} 
                  data-section="education"
                >
                  {t('resume.education.title')}
                </h2>
                <div>
                  {data.education
                    .filter(edu => edu && edu.institution)
                    .map((edu, index) => (
                      <div 
                        key={index} 
                        style={{
                          ...styles.expItem,
                          animationDelay: !isPdfMode ? getAnimationDelay(index) : '0s'
                        }} 
                        className={`eridu-edu-item ${enhancedClasses.expItem}`}
                      >
                        <div style={styles.expHeader}>
                          <div style={styles.expTitle}>
                            {edu.degree} {edu.field_of_study && t('common.in') + ` ${edu.field_of_study}`}
                          </div>
                          <div style={styles.expCompany}>{edu.institution}</div>
                          <div style={styles.expDate}>
                            {formatDate(edu.start_date)} - {edu.current ? t('resume.education.currently_studying') : formatDate(edu.end_date)}
                          </div>
                        </div>
                        {edu.location && <div style={styles.expLocation}>{edu.location}</div>}
                        {edu.gpa && <div style={styles.expDescription}>{t('resume.education.gpa')}: {edu.gpa}</div>}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Skills with clean layout */}
            {hasContent(data.skills, 'name') && (
              <div 
                style={styles.section} 
                className="eridu-section eridu-skills-section"
              >
                <h2 
                  style={customTitleStyle} 
                  className="eridu-section-title" 
                  data-section="skills"
                >
                  {t('resume.skills.title')}
                </h2>
                <div style={styles.skillsGrid} className="eridu-skills-grid">
                  {data.skills
                    .filter(skill => skill && skill.name)
                    .map((skill, index) => (
                      <div 
                        key={index} 
                        style={styles.skillItem}
                        className="eridu-skill-item"
                      >
                        <div style={styles.skillName} className="eridu-skill-name">
                          {skill.name}
                        </div>
                        {skill.level && !settings.hideSkillLevel && (
                          <div style={styles.skillLevel} className="eridu-skill-level">
                            <div 
                              style={{
                                ...styles.skillLevelBar,
                                width: getSkillLevelWidth(skill.level)
                              }}
                              className="eridu-skill-level-bar"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}
            
            {/* Extra Curricular Activities with clean layout */}
            {hasContent(data.extracurriculars, 'title') && (
              <div 
                style={styles.section} 
                className="eridu-section eridu-extracurriculars-section"
              >
                <h2 
                  style={customTitleStyle} 
                  className="eridu-section-title" 
                  data-section="extracurriculars"
                >
                  {t('resume.extracurricular.activity')}
                </h2>
                <div>
                  {data.extracurriculars
                    .filter(activity => activity && activity.title)
                    .map((activity, index) => (
                      <div 
                        key={index} 
                        style={styles.expItem} 
                        className="eridu-extracurricular-item"
                      >
                        <div style={styles.expHeader}>
                          <div style={styles.expTitle}>{activity.title}</div>
                        </div>
                        {activity.description && <div style={styles.expDescription}>{activity.description}</div>}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Right column */}
          <div style={styles.column} className="eridu-column eridu-column-right">
            {/* Internships with clean layout */}
            {hasContent(data.internships, 'company') && (
              <div 
                style={styles.section} 
                className="eridu-section eridu-internships-section"
              >
                <h2 
                  style={customTitleStyle} 
                  className="eridu-section-title" 
                  data-section="internships"
                >
                  {t('resume.internships.title')}
                </h2>
                <div>
                  {data.internships
                    .filter(internship => internship && internship.company)
                    .map((internship, index) => (
                      <div 
                        key={index} 
                        style={styles.expItem} 
                        className="eridu-internship-item"
                      >
                        <div style={styles.expHeader}>
                          <div style={styles.expTitle}>{internship.position}</div>
                          <div style={styles.expCompany}>{internship.company}</div>
                          <div style={styles.expDate}>
                            {formatDate(internship.start_date)} - {internship.current ? t('resume.internships.current_work') : formatDate(internship.end_date)}
                          </div>
                        </div>
                        {internship.location && <div style={styles.expLocation}>{internship.location}</div>}
                        {internship.description && <div style={styles.expDescription}>{internship.description}</div>}
                      </div>
                    ))}
                </div>
              </div>
            )}
        
            {/* Courses & Certifications with clean layout */}
            {hasContent(data.courses, 'name') && (
              <div 
                style={styles.section} 
                className="eridu-section eridu-courses-section"
              >
                <h2 
                  style={customTitleStyle} 
                  className="eridu-section-title" 
                  data-section="courses"
                >
                  {t('resume.courses.title')}
                </h2>
                <div>
                  {data.courses
                    .filter(course => course && course.name)
                    .map((course, index) => (
                      <div 
                        key={index} 
                        style={styles.expItem} 
                        className="eridu-course-item"
                      >
                        <div style={styles.expHeader}>
                          <div style={styles.expTitle}>{course.name}</div>
                          <div style={styles.expCompany}>{course.institution}</div>
                          {course.date && <div style={styles.expDate}>{formatDate(course.date)}</div>}
                        </div>
                        {course.description && <div style={styles.expDescription}>{course.description}</div>}
                      </div>
                    ))}
                </div>
              </div>
            )}
            
            {/* Languages with clean layout */}
            {hasContent(data.languages, 'language') && (
              <div 
                style={styles.section} 
                className="eridu-section eridu-languages-section"
              >
                <h2 
                  style={customTitleStyle} 
                  className="eridu-section-title" 
                  data-section="languages"
                >
                  {t('resume.languages.title')}
                </h2>
                <div style={styles.languagesGrid} className="eridu-languages-grid">
                  {data.languages
                    .filter(lang => lang && lang.language)
                    .map((lang, index) => (
                      <div 
                        key={index} 
                        style={styles.languageItem}
                        className="eridu-language-item"
                      >
                        <div style={styles.languageName} className="eridu-language-name">{lang.language}</div>
                        <div style={styles.languageProficiency} className="eridu-language-proficiency">
                          {getProficiencyTranslation(lang.proficiency, t)}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
            
            {/* Personal Information with clean layout */}
            {hasPersonalDetails() && (
              <div 
                style={styles.section} 
                className="eridu-section eridu-personal-details-section"
              >
                <h2 
                  style={customTitleStyle} 
                  className="eridu-section-title" 
                  data-section="personal-details"
                >
                  {t('resume.personal_info.title')}
                </h2>
                <div style={styles.personalDetails} className="eridu-personal-details">
                  {data.personal_info.address && (
                    <div 
                      style={styles.personalDetailItem} 
                      className="eridu-personal-detail-item"
                    >
                      <span style={styles.personalDetailIcon}>🏠</span>
                      <span>{data.personal_info.address}</span>
                    </div>
                  )}
                  {data.personal_info.postal_code && (
                    <div 
                      style={styles.personalDetailItem} 
                      className="eridu-personal-detail-item"
                    >
                      <span style={styles.personalDetailIcon}>📮</span>
                      <span>{data.personal_info.postal_code} {data.personal_info.city}</span>
                    </div>
                  )}
        
                  {data.personal_info.driving_license && (
                    <div 
                      style={styles.personalDetailItem} 
                      className="eridu-personal-detail-item"
                    >
                      <span style={styles.personalDetailIcon}>🚗</span>
                      <span>{t('resume.personal_info.driving_license')}: {data.personal_info.driving_license}</span>
                    </div>
                  )}
                  {data.personal_info.nationality && (
                    <div 
                      style={styles.personalDetailItem} 
                      className="eridu-personal-detail-item"
                    >
                      <span style={styles.personalDetailIcon}>🌍</span>
                      <span>{t('resume.personal_info.nationality')}: {data.personal_info.nationality}</span>
                    </div>
                  )}
                  {data.personal_info.place_of_birth && (
                    <div 
                      style={styles.personalDetailItem} 
                      className="eridu-personal-detail-item"
                    >
                      <span style={styles.personalDetailIcon}>📍</span>
                      <span>{t('resume.personal_info.place_of_birth')}: {data.personal_info.place_of_birth}</span>
                    </div>
                  )}
                  {data.personal_info.date_of_birth && (
                    <div 
                      style={styles.personalDetailItem} 
                      className="eridu-personal-detail-item"
                    >
                      <span style={styles.personalDetailIcon}>🎂</span>
                      <span>{t('resume.personal_info.date_of_birth')}: {formatDate(data.personal_info.date_of_birth)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Hobbies with clean layout */}
            {hasContent(data.hobbies, typeof data.hobbies[0] === 'string' ? null : 'name') && (
              <div 
                style={styles.section} 
                className="eridu-section eridu-hobbies-section"
              >
                <h2 
                  style={customTitleStyle} 
                  className="eridu-section-title" 
                  data-section="hobbies"
                >
                  {t('resume.hobbies.title')}
                </h2>
                <div>
                  {typeof data.hobbies === 'string' ? (
                    <p style={styles.hobbiesText} className="eridu-hobbies-text">{data.hobbies}</p>
                  ) : (
                    <div style={styles.hobbiesGrid} className="eridu-hobbies-grid">
                      {data.hobbies
                        .filter(hobby => hobby && (typeof hobby === 'string' ? hobby : hobby.name))
                        .map((hobby, index) => (
                          <div 
                            key={index} 
                            style={styles.hobbyItem}
                            className="eridu-hobby-item"
                          >
                            {typeof hobby === 'string' ? hobby : hobby.name}
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              </div>
            )}
            
            {/* References with clean layout */}
            {hasReferences() && (
              <div 
                style={styles.section} 
                className="eridu-section eridu-referrals-section"
              >
                <h2 
                  style={customTitleStyle} 
                  className="eridu-section-title" 
                  data-section="referrals"
                >
                  {t('resume.references.title')}
                </h2>
                <div style={styles.referralsGrid} className="eridu-referrals-grid">
                  {data.referrals?.providedOnRequest ? (
                    <div style={styles.referralItem} className="eridu-referral-item">
                      <p style={styles.referralsText}>{t('resume.references.provide_upon_request')}</p>
                    </div>
                  ) : (
                    <>
                      {Array.isArray(data.referrals) ? (
                        // Direct array of references
                        data.referrals.map((reference, index) => (
                          <div 
                            key={`referral-${index}`} 
                            style={styles.referralItem} 
                            className="eridu-referral-item"
                          >
                            <div style={styles.referralName} className="eridu-referral-name">{reference.name}</div>
                            {reference.relation && <div style={styles.referralPosition} className="eridu-referral-position">{reference.relation}</div>}
                            {reference.email && (
                              <div style={styles.referralContact} className="eridu-referral-contact">
                                {reference.email}
                              </div>
                            )}
                            {reference.phone && (
                              <div style={{...styles.referralContact, marginTop: '5px'}} className="eridu-referral-contact">
                                {reference.phone}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        // References inside a references array
                        data.referrals.references && data.referrals.references.map((reference, index) => (
                          <div 
                            key={`referral-${index}`} 
                            style={styles.referralItem} 
                            className="eridu-referral-item"
                          >
                            <div style={styles.referralName} className="eridu-referral-name">{reference.name}</div>
                            {reference.relation && <div style={styles.referralPosition} className="eridu-referral-position">{reference.relation}</div>}
                            {reference.email && (
                              <div style={styles.referralContact} className="eridu-referral-contact">
                                {reference.email}
                              </div>
                            )}
                            {reference.phone && (
                              <div style={{...styles.referralContact, marginTop: '5px'}} className="eridu-referral-contact">
                                {reference.phone}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
            
            {/* Custom Sections with clean layout */}
            {hasContent(data.custom_sections, 'title') && 
              data.custom_sections
                .filter(section => section && section.title && (section.content || (section.items && section.items.length > 0)))
                .map((section, sectionIndex) => (
                  <div 
                    key={`custom-${sectionIndex}`} 
                    style={styles.section} 
                    className="eridu-section eridu-custom-section"
                  >
                    <h2 
                      style={customTitleStyle} 
                      className="eridu-section-title" 
                      data-section={`custom-${sectionIndex}`}
                    >
                      {section.title || t('resume.custom_sections.title')}
                    </h2>
                    <div>
                      {/* If the section has items array, render them as individual entries */}
                      {section.items && section.items.length > 0 ? (
                        section.items.map((item, itemIndex) => (
                          <div 
                            key={`custom-item-${sectionIndex}-${itemIndex}`} 
                            style={styles.expItem} 
                            className="eridu-custom-item"
                          >
                            <div style={styles.expHeader}>
                              <div style={styles.expTitle}>{item.title}</div>
                              <div style={styles.expCompany}>{item.subtitle}</div>
                              {item.date && <div style={styles.expDate}>{item.date}</div>}
                            </div>
                            {item.content && <div style={styles.expDescription}>{item.content}</div>}
                          </div>
                        ))
                      ) : (
                        // Otherwise just render the section content as a block
                        <div 
                          style={styles.expItem} 
                          className="eridu-custom-content"
                        >
                          {section.content && <div style={styles.expDescription}>{section.content}</div>}
                        </div>
                      )}
                    </div>
                  </div>
                ))
            }
          </div>
        </div>
      </div>
        
      {/* Print-optimized styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* PDF-specific print styles */
        @page {
          size: A4;
          margin: 0;
        }
        
        @media print {
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .eridu-exp-item, .eridu-edu-item, .eridu-internship-item, .eridu-course-item, .eridu-custom-item {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          
          .eridu-section {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          
          .eridu-section-title {
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
          
          p, li {
            orphans: 2 !important;
            widows: 2 !important;
          }
        }
        
        /* Custom font imports */
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        
        /* Animation for decorative elements */
        @keyframes floatShape {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(10px, 10px) rotate(90deg); }
          50% { transform: translate(0, 20px) rotate(180deg); }
          75% { transform: translate(-10px, 10px) rotate(270deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }
      `}} />
    </div>
  );
};

export default Eridu;