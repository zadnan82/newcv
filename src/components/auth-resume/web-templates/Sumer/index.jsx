import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getSumerStyles } from './SumerStyles';

const Sumer = ({ formData, customSettings, darkMode, isPdfMode = false }) => {
  const { t } = useTranslation();
 
  // Default custom settings with Sumerian-inspired theme
  const settings = {
    accentColor: customSettings?.accentColor || '#B05F36', // Terracotta clay color as default
    fontFamily: customSettings?.fontFamily || '"EB Garamond", "Book Antiqua", Georgia, serif',
    lineSpacing: customSettings?.lineSpacing || 1.6,
    headingsUppercase: customSettings?.headingsUppercase !== undefined ? customSettings.headingsUppercase : true,
    hideSkillLevel: customSettings?.hideSkillLevel || false
  };

  // Create a normalized version of the data with consistent property names
  const data = {
    ...formData,
    personal_info: formData.personal_info || {
      full_name: t('resume.personal_info.full_name_placeholder'),
      title: t('resume.personal_info.title_placeholder'),
      email: t('resume.personal_info.email_placeholder'),
      mobile: t('resume.personal_info.mobile_placeholder'),
      city: t('resume.personal_info.city_placeholder'),
      // ...other fields with translations
    },
    educations: formData.educations || [],
    experiences: formData.experiences || [],
    skills: formData.skills || [],
    languages: formData.languages?.map(lang => ({
      ...lang,
      language: lang.name || lang.language, // Ensure both properties exist
      name: lang.name || lang.language,
      // Preserve the level for translations
      level: lang.level || lang.proficiency
    })) || [],
    internships: formData.internships || [],
    courses: formData.courses || [],
    hobbies: formData.hobbies || [],
    extracurriculars: formData.extracurriculars || [],
    referrals: formData.referrals || []
  };
   
  // Get the styles specific to this template with PDF mode
  const styles = getSumerStyles(darkMode, settings, isPdfMode);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Just force a re-render for responsiveness
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Add Sumerian decorative elements
  useEffect(() => {
    // Only add decorative elements when not in PDF mode
    if (!isPdfMode && typeof document !== 'undefined') {
      // Get the resume container
      const container = document.querySelector('.sumer-template');
      
      if (container) {
        // Remove any existing decorative elements
        const existingElements = container.querySelectorAll('.sumer-decorative');
        existingElements.forEach(el => el.remove());
        
        // Add decorative border to the bottom of the header
        const headerDecor = document.createElement('div');
        headerDecor.className = 'sumer-decorative sumer-header-decoration';
        headerDecor.style.position = 'absolute';
        headerDecor.style.bottom = '0';
        headerDecor.style.left = '0';
        headerDecor.style.right = '0';
        headerDecor.style.height = '10px';
        headerDecor.style.backgroundImage = darkMode ? 
          `url("data:image/svg+xml,%3Csvg width='20' height='10' viewBox='0 0 20 10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,0 L10,10 L20,0' fill='%23483C31' /%3E%3C/svg%3E")` : 
          `url("data:image/svg+xml,%3Csvg width='20' height='10' viewBox='0 0 20 10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,0 L10,10 L20,0' fill='%23D4BFA0' /%3E%3C/svg%3E")`;
        headerDecor.style.backgroundRepeat = 'repeat-x';
        headerDecor.style.backgroundSize = '20px 10px';
        
        const header = container.querySelector('.sumer-header');
        if (header) {
          header.style.position = 'relative';
          header.appendChild(headerDecor);
        }
        
        // Add decorative section headers
        const sectionHeadings = container.querySelectorAll('.sumer-section-heading-outer');
        sectionHeadings.forEach((heading) => {
          const headingBorder = document.createElement('div');
          headingBorder.className = 'sumer-decorative sumer-heading-border';
          headingBorder.style.position = 'absolute';
          headingBorder.style.bottom = '0';
          headingBorder.style.left = '20%';
          headingBorder.style.right = '20%';
          headingBorder.style.height = '5px';
          headingBorder.style.backgroundImage = darkMode ?
            `url("data:image/svg+xml,%3Csvg width='20' height='5' viewBox='0 0 20 5' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 5 L 5 0 L 10 5 L 15 0 L 20 5' stroke='%23483C31' stroke-width='1' fill='none'/%3E%3C/svg%3E")` :
            `url("data:image/svg+xml,%3Csvg width='20' height='5' viewBox='0 0 20 5' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 5 L 5 0 L 10 5 L 15 0 L 20 5' stroke='%23D4BFA0' stroke-width='1' fill='none'/%3E%3C/svg%3E")`;
          headingBorder.style.backgroundRepeat = 'repeat-x';
          headingBorder.style.backgroundSize = '20px 5px';
          
          heading.appendChild(headingBorder);
        });
        
        // Smaller decorative borders for sidebar section headings
        const sidebarSectionHeadings = container.querySelectorAll('.sumer-sidebar-section-heading-outer');
        sidebarSectionHeadings.forEach((heading) => {
          const headingBorder = document.createElement('div');
          headingBorder.className = 'sumer-decorative sumer-sidebar-heading-border';
          headingBorder.style.position = 'absolute';
          headingBorder.style.bottom = '0';
          headingBorder.style.left = '15%';
          headingBorder.style.right = '15%';
          headingBorder.style.height = '3px';
          headingBorder.style.backgroundImage = darkMode ?
            `url("data:image/svg+xml,%3Csvg width='14' height='3' viewBox='0 0 14 3' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 3 L 3.5 0 L 7 3 L 10.5 0 L 14 3' stroke='%23483C31' stroke-width='1' fill='none'/%3E%3C/svg%3E")` :
            `url("data:image/svg+xml,%3Csvg width='14' height='3' viewBox='0 0 14 3' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 3 L 3.5 0 L 7 3 L 10.5 0 L 14 3' stroke='%23D4BFA0' stroke-width='1' fill='none'/%3E%3C/svg%3E")`;
          headingBorder.style.backgroundRepeat = 'repeat-x';
          headingBorder.style.backgroundSize = '14px 3px';
          
          heading.appendChild(headingBorder);
        });
      }
    }
    
    return () => {
      // Cleanup function to remove decorative elements when component unmounts
      if (typeof document !== 'undefined') {
        const existingElements = document.querySelectorAll('.sumer-decorative');
        existingElements.forEach(el => el.remove());
      }
    };
  }, [isPdfMode, darkMode]);

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
    //console.log('Found photo.photolink:', formData.photo.photolink);
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
  // Calendar and location icons for experience items
  const calendarIcon = darkMode ? 
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23D8C9AA' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E" : 
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23645C4F' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E";

  const locationIcon = darkMode ? 
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23D8C9AA' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'%3E%3C/path%3E%3Ccircle cx='12' cy='10' r='3'%3E%3C/circle%3E%3C/svg%3E" : 
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23645C4F' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'%3E%3C/path%3E%3Ccircle cx='12' cy='10' r='3'%3E%3C/circle%3E%3C/svg%3E";

  // Sumerian-inspired animation classes
  const enhancedClasses = isPdfMode ? {
    // PDF-specific classes (no animations for PDF)
    container: "print:bg-white print:shadow-none",
    header: "print:py-4",
    section: "print:break-inside-avoid",
    expItem: "print:break-inside-avoid",
    sectionTitle: "print:break-after-avoid",
    sidebar: "print:bg-gray-50"
  } : {
    // Interactive UI classes with Sumerian-inspired animations
    container: "transition-all duration-700 ease-in-out",
    header: "transition-all duration-700 ease-in-out",
    section: "transition-all duration-700 ease-in-out",
    expItem: "transition-all duration-300 hover:translate-x-1",
    sectionTitle: "relative transition-all duration-700 ease-in-out",
    sidebar: "transition-all duration-700 ease-in-out",
    skillBar: "transition-all duration-1000 ease-out",
    hobbyItem: "transition-all duration-300 hover:scale-105",
    contactItem: "transition-all duration-300 hover:text-accent"
  };

  // Sumerian animation timing
  const getAnimationDelay = (index) => {
    return `${index * 0.1}s`;
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

  const hasExperiences = () => {
    return data.experiences && 
           Array.isArray(data.experiences) && 
           data.experiences.filter(exp => exp && exp.company).length > 0;
  };

  const hasEducation = () => {
    return data.educations && 
           Array.isArray(data.educations) && 
           data.educations.filter(edu => edu && edu.institution).length > 0;
  };

  const hasInternships = () => {
    return data.internships && 
           Array.isArray(data.internships) && 
           data.internships.filter(intern => intern && intern.company).length > 0;
  };

  const hasCourses = () => {
    return data.courses && 
           Array.isArray(data.courses) && 
           data.courses.filter(course => course && course.name).length > 0;
  };

  const hasSkills = () => {
    return data.skills && 
           Array.isArray(data.skills) && 
           data.skills.filter(skill => skill && skill.name).length > 0;
  };

  const hasLanguages = () => {
    return data.languages && 
           Array.isArray(data.languages) && 
           data.languages.filter(lang => lang && lang.language).length > 0;
  };

  const hasHobbies = () => {
    return data.hobbies && 
           ((Array.isArray(data.hobbies) && 
             data.hobbies.filter(hobby => hobby && (typeof hobby === 'string' ? hobby : hobby.name)).length > 0) || 
            (typeof data.hobbies === 'string' && data.hobbies.trim() !== ''));
  };

  const hasExtracurriculars = () => {
    return data.extracurriculars && 
           Array.isArray(data.extracurriculars) && 
           data.extracurriculars.filter(activity => activity && activity.title).length > 0;
  };

  const hasCustomSections = () => {
    return data.custom_sections && 
           Array.isArray(data.custom_sections) && 
           data.custom_sections.filter(section => section && section.title && (section.content || (section.items && section.items.length > 0))).length > 0;
  };

  const hasReferences = () => {
    if (!data.referrals) return false;
    if (data.referrals.providedOnRequest === true) return true;
    return Array.isArray(data.referrals) && 
           data.referrals.filter(ref => ref && ref.name).length > 0;
  };

  // Skill level function with Sumerian descriptions
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
  
  // Proficiency translation with appropriate language terms
  function getProficiencyTranslation(proficiency, t) {
    const proficiencies = {
      'Native': t('resume.languages.levels.native'),
      'Fluent': t('resume.languages.levels.fluent'),
      'Advanced': t('resume.languages.levels.advanced'),
      'Intermediate': t('resume.languages.levels.intermediate'),
      'Beginner': t('resume.languages.levels.beginner'),
 
    };
    
    return proficiencies[proficiency] || proficiency;
  }

  return (
    <div style={styles.container} className={`sumer-template ${enhancedClasses.container}`}>
      {/* Header banner with centered layout */}
      <div style={styles.headerBanner} className="sumer-header">
        <div style={styles.headerContent}>
          {/* Profile Image with decorative rings */}
          <div style={styles.profileArea}>
            <div style={styles.profileImageOuterRing}>
              <div style={styles.profileImageInnerCircle}>
                <img 
                  src={profileImage}
                  alt={data.personal_info.full_name} 
                  style={styles.profileImage} 
                  className="sumer-profile-image"
                />
              </div>
            </div>
          </div>
          
          {/* Name and title with decorative elements */}
          <h1 style={styles.name}>
            {data.personal_info.full_name}
          </h1>
          <div style={styles.title}>{data.personal_info.title}</div>
        </div>
        
        {/* Contact information in horizontal bar */}
        <div style={styles.contactBar}>
          {data.personal_info.email && (
            <div style={styles.contactItem} className={enhancedClasses.contactItem}>
              <span style={styles.contactIcon}>✉️</span>
              <span>{data.personal_info.email}</span>
            </div>
          )}
          {data.personal_info.mobile && (
            <div style={styles.contactItem} className={enhancedClasses.contactItem}>
              <span style={styles.contactIcon}>📱</span>
              <span>{data.personal_info.mobile}</span>
            </div>
          )}
         
          {data.personal_info.linkedin && (
            <div style={styles.contactItem} className={enhancedClasses.contactItem}>
              <span style={styles.contactIcon}>🔗</span>
              <span>{data.personal_info.linkedin}</span>
            </div>
          )}
          {data.personal_info.website && (
            <div style={styles.contactItem} className={enhancedClasses.contactItem}>
              <span style={styles.contactIcon}>🌐</span>
              <span>{data.personal_info.website}</span>
            </div>
          )}
          {data.personal_info.city && (
            <div style={styles.contactItem} className={enhancedClasses.contactItem}>
              <span style={styles.contactIcon}>🏙️</span>
              <span>{data.personal_info.city}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content container */}
      <div style={styles.contentContainer} className="sumer-content-container">
        {/* Main content area */}
        <div style={styles.mainContentArea} className="sumer-main-content">
          {/* Summary section */}
          {data.personal_info.summary && (
            <div className="sumer-summary-section">
              <div style={styles.sectionHeadingOuter} className="sumer-section-heading-outer">
                <h2 style={styles.sectionHeading}>
                  {t('resume.personal_info.summary')}
                </h2>
              </div>
              <p style={styles.summary}>{data.personal_info.summary}</p>
            </div>
          )}

          {/* Work Experience */}
          {hasExperiences() && (
            <div className="sumer-experience-section">
              <div style={styles.sectionHeadingOuter} className="sumer-section-heading-outer">
                <h2 style={styles.sectionHeading}>
                  {t('resume.experience.title')}
                </h2>
              </div>
              <div>
                {data.experiences
                  .filter(exp => exp && exp.company)
                  .map((exp, index) => (
                    <div 
                      key={index} 
                      style={styles.experienceItem} 
                      className={enhancedClasses.expItem}
                    >
                      <div style={styles.experienceItemInner}>
                        <div style={styles.expHeader}>
                          <div style={styles.expTitle}>{exp.position}</div>
                          <div style={styles.expCompany}>{exp.company}</div>
                          <div style={styles.expDateLocation}>
                            <div style={styles.expDate}>
                              <span style={{display: 'inline-block', width: '14px', height: '14px', marginRight: '5px', backgroundImage: `url(${calendarIcon})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', opacity: 0.9}}></span>
                              {formatDate(exp.start_date)} - {exp.current ? t('resume.experience.current_work') : formatDate(exp.end_date)}
                            </div>
                            {exp.location && (
                              <div style={styles.expLocation}>
                                <span style={{display: 'inline-block', width: '14px', height: '14px', marginRight: '5px', backgroundImage: `url(${locationIcon})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', opacity: 0.9}}></span>
                                {exp.location}
                              </div>
                            )}
                          </div>
                        </div>
                        {exp.description && <div style={styles.expDescription}>{exp.description}</div>}
                      </div>
                    </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Education */}
          {hasEducation() && (
            <div className="sumer-education-section">
              <div style={styles.sectionHeadingOuter} className="sumer-section-heading-outer">
                <h2 style={styles.sectionHeading}>
                  {t('resume.education.title')}
                </h2>
              </div>
              <div>
                {data.educations
                  .filter(edu => edu && edu.institution)
                  .map((edu, index) => (
                    <div 
                      key={index} 
                      style={styles.experienceItem} 
                      className={enhancedClasses.expItem}
                    >
                      <div style={styles.experienceItemInner}>
                        <div style={styles.expHeader}>
                          <div style={styles.expTitle}>
                            {edu.degree} {edu.field_of_study && t('common.in') + ` ${edu.field_of_study}`}
                          </div>
                          <div style={styles.expCompany}>{edu.institution}</div>
                          <div style={styles.expDateLocation}>
                            <div style={styles.expDate}>
                              <span style={{display: 'inline-block', width: '14px', height: '14px', marginRight: '5px', backgroundImage: `url(${calendarIcon})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', opacity: 0.9}}></span>
                              {formatDate(edu.start_date)} - {edu.current ? t('resume.education.currently_studying') : formatDate(edu.end_date)}
                            </div>
                            {edu.location && (
                              <div style={styles.expLocation}>
                                <span style={{display: 'inline-block', width: '14px', height: '14px', marginRight: '5px', backgroundImage: `url(${locationIcon})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', opacity: 0.9}}></span>
                                {edu.location}
                              </div>
                            )}
                          </div>
                        </div>
                        {edu.gpa && <div style={styles.expDescription}>{t('resume.education.gpa')}: {edu.gpa}</div>}
                      </div>
                    </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Internships */}
          {hasInternships() && (
            <div className="sumer-internships-section">
              <div style={styles.sectionHeadingOuter} className="sumer-section-heading-outer">
                <h2 style={styles.sectionHeading}>
                  {t('resume.internships.title')}
                </h2>
              </div>
              <div>
                {data.internships
                  .filter(internship => internship && internship.company)
                  .map((internship, index) => (
                    <div 
                      key={index} 
                      style={styles.experienceItem} 
                      className={enhancedClasses.expItem}
                    >
                      <div style={styles.experienceItemInner}>
                        <div style={styles.expHeader}>
                          <div style={styles.expTitle}>{internship.position}</div>
                          <div style={styles.expCompany}>{internship.company}</div>
                          <div style={styles.expDateLocation}>
                            <div style={styles.expDate}>
                              <span style={{display: 'inline-block', width: '14px', height: '14px', marginRight: '5px', backgroundImage: `url(${calendarIcon})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', opacity: 0.9}}></span>
                              {formatDate(internship.start_date)} - {internship.current ? t('resume.internships.current_work') : formatDate(internship.end_date)}
                            </div>
                            {internship.location && (
                              <div style={styles.expLocation}>
                                <span style={{display: 'inline-block', width: '14px', height: '14px', marginRight: '5px', backgroundImage: `url(${locationIcon})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', opacity: 0.9}}></span>
                                {internship.location}
                              </div>
                            )}
                          </div>
                        </div>
                        {internship.description && <div style={styles.expDescription}>{internship.description}</div>}
                      </div>
                    </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Courses & Certifications */}
          {hasCourses() && (
            <div className="sumer-courses-section">
              <div style={styles.sectionHeadingOuter} className="sumer-section-heading-outer">
                <h2 style={styles.sectionHeading}>
                  {t('resume.courses.title')}
                </h2>
              </div>
              <div>
                {data.courses
                  .filter(course => course && course.name)
                  .map((course, index) => (
                    <div 
                      key={index} 
                      style={styles.experienceItem} 
                      className={enhancedClasses.expItem}
                    >
                      <div style={styles.experienceItemInner}>
                        <div style={styles.expHeader}>
                          <div style={styles.expTitle}>{course.name}</div>
                          {course.institution && <div style={styles.expCompany}>{course.institution}</div>}
                          {course.date && (
                            <div style={styles.expDateLocation}>
                              <div style={styles.expDate}>
                                <span style={{display: 'inline-block', width: '14px', height: '14px', marginRight: '5px', backgroundImage: `url(${calendarIcon})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', opacity: 0.9}}></span>
                                {formatDate(course.date)}
                              </div>
                            </div>
                          )}
                        </div>
                        {course.description && <div style={styles.expDescription}>{course.description}</div>}
                      </div>
                    </div>
                ))}
                </div>
            </div>
          )}
          
          {/* Extra Curricular Activities */}
          {hasExtracurriculars() && (
            <div className="sumer-extracurriculars-section">
              <div style={styles.sectionHeadingOuter} className="sumer-section-heading-outer">
                <h2 style={styles.sectionHeading}>
                  {t('resume.extracurricular.activity')}
                </h2>
              </div>
              <div>
                {data.extracurriculars
                  .filter(activity => activity && activity.title)
                  .map((activity, index) => (
                    <div 
                      key={index} 
                      style={styles.experienceItem} 
                      className={enhancedClasses.expItem}
                    >
                      <div style={styles.experienceItemInner}>
                        <div style={styles.expHeader}>
                          <div style={styles.expTitle}>{activity.title}</div>
                        </div>
                        {activity.description && <div style={styles.expDescription}>{activity.description}</div>}
                      </div>
                    </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Custom Sections */}
          {hasCustomSections() && 
            data.custom_sections
              .filter(section => section && section.title && (section.content || (section.items && section.items.length > 0)))
              .map((section, sectionIndex) => (
                <div key={`custom-${sectionIndex}`} className="sumer-custom-section">
                  <div style={styles.sectionHeadingOuter} className="sumer-section-heading-outer">
                    <h2 style={styles.sectionHeading}>
                      {section.title || t('resume.custom_sections.title')}
                    </h2>
                  </div>
                  <div>
                    {/* If the section has items array, render them as individual entries */}
                    {section.items && section.items.length > 0 ? (
                      section.items.map((item, itemIndex) => (
                        <div 
                          key={`custom-item-${sectionIndex}-${itemIndex}`} 
                          style={styles.experienceItem} 
                          className={enhancedClasses.expItem}
                        >
                          <div style={styles.experienceItemInner}>
                            <div style={styles.expHeader}>
                              <div style={styles.expTitle}>{item.title}</div>
                              {item.subtitle && <div style={styles.expCompany}>{item.subtitle}</div>}
                              {item.date && (
                                <div style={styles.expDateLocation}>
                                  <div style={styles.expDate}>
                                    <span style={{display: 'inline-block', width: '14px', height: '14px', marginRight: '5px', backgroundImage: `url(${calendarIcon})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', opacity: 0.9}}></span>
                                    {item.date}
                                  </div>
                                </div>
                              )}
                            </div>
                            {item.content && <div style={styles.expDescription}>{item.content}</div>}
                          </div>
                        </div>
                      ))
                    ) : (
                      // Otherwise just render the section content as a block
                      <div style={styles.summary}>
                        {section.content}
                      </div>
                    )}
                  </div>
                </div>
              ))
          }
        </div>
        
        {/* Sidebars - split into two columns */}
        <div style={styles.sidebarColumns} className="sumer-sidebar-columns">
          {/* Left sidebar column */}
          <div style={styles.leftSidebar} className="sumer-left-sidebar">
            {/* Skills section */}
            {hasSkills() && (
              <div className="sumer-skills-section">
                <div style={styles.sidebarSectionHeadingOuter} className="sumer-sidebar-section-heading-outer">
                  <h3 style={styles.sidebarSectionHeading}>
                    {t('resume.skills.title')}
                  </h3>
                </div>
                <div style={styles.skillsGrid}>
                  {data.skills
                    .filter(skill => skill && skill.name)
                    .map((skill, index) => (
                      <div 
                        key={index} 
                        style={styles.skillItem}
                        className={enhancedClasses.expItem}
                      >
                        <div style={styles.skillNameLevel}>
                          <div style={styles.skillName}>{skill.name}</div>
                          {skill.level && !settings.hideSkillLevel && (
                            <div style={styles.skillLevelText}>{skill.level}</div>
                          )}
                        </div>
                        {skill.level && !settings.hideSkillLevel && (
                          <div style={styles.skillLevel}>
                            <div 
                              style={{
                                ...styles.skillLevelBar,
                                width: getSkillLevelWidth(skill.level)
                              }}
                              className={enhancedClasses.skillBar}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}
            
            {/* Languages section */}
            {hasLanguages() && (
              <div className="sumer-languages-section">
                <div style={styles.sidebarSectionHeadingOuter} className="sumer-sidebar-section-heading-outer">
                  <h3 style={styles.sidebarSectionHeading}>
                    {t('resume.languages.title')}
                  </h3>
                </div>
                <div style={styles.languagesGrid}>
                  {data.languages
                    .filter(lang => lang && lang.language)
                    .map((lang, index) => (
                      <div 
                        key={index} 
                        style={styles.languageItem}
                        className={enhancedClasses.expItem}
                      >
                        <div style={styles.languageName}>{lang.name}</div>
                        <div style={styles.languageProficiency}>{getProficiencyTranslation(lang.level, t)}</div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Right sidebar column */}
          <div style={styles.rightSidebar} className="sumer-right-sidebar">
            {/* Personal information */}
            {hasPersonalDetails() && (
              <div className="sumer-personal-details-section">
                <div style={styles.sidebarSectionHeadingOuter} className="sumer-sidebar-section-heading-outer">
                  <h3 style={styles.sidebarSectionHeading}>
                    {t('resume.personal_info.title')}
                  </h3>
                </div>
                <div style={styles.personalDetails}>
                  {data.personal_info.address && (
                    <div style={styles.personalDetailItem}>
                      <span style={styles.personalDetailIcon}>🏠</span>
                      <span>{data.personal_info.address}</span>
                    </div>
                  )}
                  {data.personal_info.postal_code && (
                    <div style={styles.personalDetailItem}>
                      <span style={styles.personalDetailIcon}>📮</span>
                      <span>{data.personal_info.postal_code} {data.personal_info.city}</span>
                    </div>
                  )}
                  {data.personal_info.driving_license && (
                    <div style={styles.personalDetailItem}>
                      <span style={styles.personalDetailIcon}>🚗</span>
                      <span>{t('resume.personal_info.driving_license')}: {data.personal_info.driving_license}</span>
                    </div>
                  )}
                  {data.personal_info.nationality && (
                    <div style={styles.personalDetailItem}>
                      <span style={styles.personalDetailIcon}>🌍</span>
                      <span>{t('resume.personal_info.nationality')}: {data.personal_info.nationality}</span>
                    </div>
                  )}
                  {data.personal_info.place_of_birth && (
                    <div style={styles.personalDetailItem}>
                      <span style={styles.personalDetailIcon}>📍</span>
                      <span>{t('resume.personal_info.place_of_birth')}: {data.personal_info.place_of_birth}</span>
                    </div>
                  )}
                  {data.personal_info.date_of_birth && (
                    <div style={styles.personalDetailItem}>
                      <span style={styles.personalDetailIcon}>🎂</span>
                      <span>{t('resume.personal_info.date_of_birth')}: {formatDate(data.personal_info.date_of_birth)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Hobbies & Interests */}
            {hasHobbies() && (
              <div className="sumer-hobbies-section">
                <div style={styles.sidebarSectionHeadingOuter} className="sumer-sidebar-section-heading-outer">
                  <h3 style={styles.sidebarSectionHeading}>
                    {t('resume.hobbies.title')}
                  </h3>
                </div>
                {typeof data.hobbies === 'string' ? (
                  <p style={styles.hobbiesText}>{data.hobbies}</p>
                ) : (
                  <div style={styles.hobbiesGrid}>
                    {data.hobbies
                      .filter(hobby => hobby && (typeof hobby === 'string' ? hobby : hobby.name))
                      .map((hobby, index) => (
                        <div 
                          key={index} 
                          style={styles.hobbyItem}
                          className={enhancedClasses.hobbyItem}
                        >
                          {typeof hobby === 'string' ? hobby : hobby.name}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
            
            {/* References */}
            {hasReferences() && (
              <div className="sumer-references-section">
                <div style={styles.sidebarSectionHeadingOuter} className="sumer-sidebar-section-heading-outer">
                  <h3 style={styles.sidebarSectionHeading}>
                    {t('resume.references.title')}
                  </h3>
                </div>
                <div style={styles.referralsGrid}>
                  {data.referrals?.providedOnRequest ? (
                    <div style={styles.referralItem}>
                      <p style={styles.referralsText}>{t('resume.references.provide_upon_request')}</p>
                    </div>
                  ) : (
                    data.referrals && data.referrals.map((reference, index) => (
                      <div 
                        key={`referral-${index}`} 
                        style={styles.referralItem} 
                        className={enhancedClasses.expItem}
                      >
                        <div style={styles.referralName}>{reference.name}</div>
                        {reference.relation && <div style={styles.referralPosition}>{reference.relation}</div>}
                        {reference.email && <div style={styles.referralContact}>{reference.email}</div>}
                        {reference.phone && <div style={styles.referralContact}>{reference.phone}</div>}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Sumerian-inspired CSS styles for animations and PDF mode */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate3d(0, 20px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translate3d(-20px, 0, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
        
        @keyframes growWidth {
          from {
            width: 0;
          }
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
        
        .sumer-profile-image {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .sumer-skill-level-bar {
          animation: growWidth 1.5s ease-out forwards;
        }
        
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
          
          .sumer-content-container {
            display: block !important;
          }
          
          .sumer-sidebar-columns {
            display: flex !important;
            flex-direction: row !important;
          }
          
          .sumer-exp-item, .sumer-edu-item, .sumer-skill-item, .sumer-hobby-item {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            animation: none !important;
          }
          
          .sumer-section-heading-outer, .sumer-sidebar-section-heading-outer {
            page-break-after: avoid !important;
            break-after: avoid !important;
            animation: none !important;
          }
          
          .sumer-profile-image {
            animation: none !important;
          }
          
          .sumer-skill-level-bar {
            animation: none !important;
          }
          
          p, li {
            orphans: 2 !important;
            widows: 2 !important;
          }
          
          * {
            transition: none !important;
            animation: none !important;
          }
        }
        
        /* Custom Sumerian-inspired fonts */
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Cinzel+Decorative:wght@400;700;900&display=swap');
      `}} />
    </div>
  );
};
  
export default Sumer;