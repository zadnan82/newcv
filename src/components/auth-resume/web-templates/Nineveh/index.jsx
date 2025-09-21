import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getNinevehStyles } from './NinevehStyles';

const Nineveh = ({ formData, customSettings, darkMode, isPdfMode = false }) => {
  const { t } = useTranslation();
 
  // Default custom settings with ancient Mesopotamian theme
  const settings = {
    accentColor: customSettings?.accentColor || '#8B4513', // Earthy brown as default
    fontFamily: customSettings?.fontFamily || '"Cinzel", "Times New Roman", serif',
    lineSpacing: customSettings?.lineSpacing || 1.7, // More spacing for ancient manuscript feel
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
  const styles = getNinevehStyles(darkMode, settings, isPdfMode);

  // Add ancient Mesopotamian decorative elements
  useEffect(() => {
    // Only add decorative elements when not in PDF mode
    if (!isPdfMode && typeof document !== 'undefined') {
      // Get the resume container
      const container = document.querySelector('.nineveh-template');
      
      if (container) {
        // Remove any existing decorative elements
        const existingElements = container.querySelectorAll('.nineveh-decorative');
        existingElements.forEach(el => el.remove());
        
        // Add cuneiform-inspired decorative border to main container
        const topBorder = document.createElement('div');
        topBorder.className = 'nineveh-decorative nineveh-top-border';
        topBorder.style.position = 'absolute';
        topBorder.style.top = '0';
        topBorder.style.left = '0';
        topBorder.style.right = '0';
        topBorder.style.height = '15px';
        topBorder.style.backgroundImage = darkMode ? 
          'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'30\' height=\'15\' viewBox=\'0 0 30 15\'%3E%3Cpath d=\'M0,0 L10,0 L15,15 L20,0 L30,0\' fill=\'none\' stroke=\'%23594D3F\' stroke-width=\'1\'/%3E%3C/svg%3E")' : 
          'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'30\' height=\'15\' viewBox=\'0 0 30 15\'%3E%3Cpath d=\'M0,0 L10,0 L15,15 L20,0 L30,0\' fill=\'none\' stroke=\'%23B29D7C\' stroke-width=\'1\'/%3E%3C/svg%3E")';
        topBorder.style.backgroundRepeat = 'repeat-x';
        
        // Add bottom decorative border
        const bottomBorder = document.createElement('div');
        bottomBorder.className = 'nineveh-decorative nineveh-bottom-border';
        bottomBorder.style.position = 'absolute';
        bottomBorder.style.bottom = '0';
        bottomBorder.style.left = '0';
        bottomBorder.style.right = '0';
        bottomBorder.style.height = '15px';
        bottomBorder.style.backgroundImage = darkMode ? 
          'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'30\' height=\'15\' viewBox=\'0 0 30 15\'%3E%3Cpath d=\'M0,15 L10,15 L15,0 L20,15 L30,15\' fill=\'none\' stroke=\'%23594D3F\' stroke-width=\'1\'/%3E%3C/svg%3E")' : 
          'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'30\' height=\'15\' viewBox=\'0 0 30 15\'%3E%3Cpath d=\'M0,15 L10,15 L15,0 L20,15 L30,15\' fill=\'none\' stroke=\'%23B29D7C\' stroke-width=\'1\'/%3E%3C/svg%3E")';
        bottomBorder.style.backgroundRepeat = 'repeat-x';
        
        // Add the elements to the container
        container.appendChild(topBorder);
        container.appendChild(bottomBorder);
        
        // Add decorative corner elements to sections
        const sections = container.querySelectorAll('.nineveh-section, .nineveh-sidebar-section');
        sections.forEach((section) => {
          const cornerElement = document.createElement('div');
          cornerElement.className = 'nineveh-decorative nineveh-corner';
          cornerElement.style.position = 'absolute';
          cornerElement.style.top = '3px';
          cornerElement.style.right = '3px';
          cornerElement.style.width = '20px';
          cornerElement.style.height = '20px';
          cornerElement.style.backgroundImage = darkMode ? 
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'20\' height=\'20\' viewBox=\'0 0 20 20\'%3E%3Cpath d=\'M0,0 L20,0 L20,20 L15,15 L10,20 L5,15 L0,20 Z\' fill=\'none\' stroke=\'%23594D3F\' stroke-width=\'1\'/%3E%3C/svg%3E")' :
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'20\' height=\'20\' viewBox=\'0 0 20 20\'%3E%3Cpath d=\'M0,0 L20,0 L20,20 L15,15 L10,20 L5,15 L0,20 Z\' fill=\'none\' stroke=\'%23B29D7C\' stroke-width=\'1\'/%3E%3C/svg%3E")';
          section.appendChild(cornerElement);
        });
      }
    }
    
    return () => {
      // Cleanup function to remove decorative elements when component unmounts
      if (typeof document !== 'undefined') {
        const existingElements = document.querySelectorAll('.nineveh-decorative');
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
  // Ancient-themed animation classes
  const enhancedClasses = isPdfMode ? {
    // PDF-specific classes (no animations for PDF)
    container: "print:bg-white print:shadow-none",
    header: "print:py-3",
    section: "print:break-inside-avoid",
    expItem: "print:break-inside-avoid",
    sectionTitle: "print:break-after-avoid",
    sidebar: "print:bg-gray-50"
  } : {
    // Interactive UI classes with subtle animations
    container: "transition-all duration-700 ease-in-out",
    header: "transition-all duration-700 ease-in-out",
    section: "transition-all duration-700 ease-in-out",
    expItem: "transition-all duration-500 hover:translate-x-1",
    sectionTitle: "relative transition-all duration-700 ease-in-out",
    sidebar: "transition-all duration-700 ease-in-out",
    skillBar: "transition-all duration-1200 ease-out",
    hobbyItem: "transition-all duration-500 hover:bg-opacity-75",
    contactItem: "transition-all duration-500"
  };

  // Ancient script animation timing
  const getAnimationDelay = (index) => {
    return `${index * 0.15}s`;
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

  // Skill level function with ancient theme
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
  
  // Proficiency translation with ancient language
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
    <div style={styles.container} className={`nineveh-template ${enhancedClasses.container}`}>
      {/* Ancient header with profile info and contact details */}
      <header style={styles.header} className={`nineveh-header ${enhancedClasses.header}`}>
        <div style={styles.headerLeft}>
          <h1 style={styles.name}>{data.personal_info.full_name}</h1>
          <div style={styles.title}>{data.personal_info.title}</div>
          
          {/* Contact information with ancient styling */}
          <div style={styles.contactGrid}>
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
        
        <div style={styles.headerRight}>
          {/* Profile image with ancient clay tablet frame */}
          <div style={styles.profileContainer}>
            <img 
              src={profileImage}
              alt={data.personal_info.full_name} 
              style={styles.profileImage} 
              className="profile-image"
            />
          </div>
        </div>
      </header>

      {/* Ancient two-column layout */}
      <div style={styles.contentLayout}>
        {/* Main column (left) with tablet-like layout */}
        <div style={styles.mainColumn} className="nineveh-main-column">
          {/* Professional Summary with ancient styling */}
          {data.personal_info.summary && (
            <div 
              style={styles.section} 
              className={`nineveh-section ${enhancedClasses.section}`}
            >
              <h2 
                style={styles.sectionTitle} 
                className={`nineveh-section-title ${enhancedClasses.sectionTitle}`} 
                data-section="summary"
              >
                {t('resume.personal_info.summary')}
              </h2>
              <div>
                <p style={styles.summary}>{data.personal_info.summary}</p>
              </div>
            </div>
          )}

          {/* Work Experience with ancient clay tablet styling */}
          {hasExperiences() && (
            <div 
              style={styles.section} 
              className={`nineveh-section ${enhancedClasses.section}`}
            >
              <h2 
                style={styles.sectionTitle} 
                className={`nineveh-section-title ${enhancedClasses.sectionTitle}`} 
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
                      className={`nineveh-exp-item ${enhancedClasses.expItem}`}
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

          {/* Education with ancient clay tablet styling */}
          {hasEducation() && (
            <div 
              style={styles.section} 
              className={`nineveh-section ${enhancedClasses.section}`}
            >
              <h2 
                style={styles.sectionTitle} 
                className={`nineveh-section-title ${enhancedClasses.sectionTitle}`} 
                data-section="education"
              >
                {t('resume.education.title')}
              </h2>
              <div>
                {data.educations
                  .filter(edu => edu && edu.institution)
                  .map((edu, index) => (
                    <div 
                      key={index} 
                      style={{
                        ...styles.expItem,
                        animationDelay: !isPdfMode ? getAnimationDelay(index) : '0s'
                      }} 
                      className={`nineveh-edu-item ${enhancedClasses.expItem}`}
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

          {/* Internships with ancient clay tablet styling */}
          {hasInternships() && (
            <div 
              style={styles.section} 
              className={`nineveh-section ${enhancedClasses.section}`}
            >
              <h2 
                style={styles.sectionTitle} 
                className={`nineveh-section-title ${enhancedClasses.sectionTitle}`} 
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
                      style={{
                        ...styles.expItem,
                        animationDelay: !isPdfMode ? getAnimationDelay(index) : '0s'
                      }} 
                      className={`nineveh-internship-item ${enhancedClasses.expItem}`}
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

          {/* Courses & Certifications with ancient clay tablet styling */}
          {hasCourses() && (
            <div 
              style={styles.section} 
              className={`nineveh-section ${enhancedClasses.section}`}
            >
              <h2 
                style={styles.sectionTitle} 
                className={`nineveh-section-title ${enhancedClasses.sectionTitle}`} 
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
                      style={{
                        ...styles.expItem,
                        animationDelay: !isPdfMode ? getAnimationDelay(index) : '0s'
                      }} 
                      className={`nineveh-course-item ${enhancedClasses.expItem}`}
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

          {/* Custom Sections with ancient clay tablet styling */}
          {hasCustomSections() && 
            data.custom_sections
              .filter(section => section && section.title && (section.content || (section.items && section.items.length > 0)))
              .map((section, sectionIndex) => (
                <div 
                  key={`custom-${sectionIndex}`} 
                  style={styles.section} 
                  className={`nineveh-section ${enhancedClasses.section}`}
                >
                  <h2 
                    style={styles.sectionTitle} 
                    className={`nineveh-section-title ${enhancedClasses.sectionTitle}`} 
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
                          style={{
                            ...styles.expItem,
                            animationDelay: !isPdfMode ? getAnimationDelay(itemIndex) : '0s'
                          }} 
                          className={`nineveh-custom-item ${enhancedClasses.expItem}`}
                        >
                          <div style={styles.expHeader}>
                            <div style={styles.expTitle}>{item.title}</div>
                            {item.date && <div style={styles.expDate}>{item.date}</div>}
                          </div>
                          {item.subtitle && <div style={styles.expCompany}>{item.subtitle}</div>}
                          {item.content && <div style={styles.expDescription}>{item.content}</div>}
                        </div>
                      ))
                    ) : (
                      // Otherwise just render the section content as a block
                      <div 
                        style={styles.expItem} 
                        className={`nineveh-custom-content ${enhancedClasses.expItem}`}
                      >
                        {section.content && <div style={styles.expDescription}>{section.content}</div>}
                      </div>
                    )}
                  </div>
                </div>
              ))
          }

          {/* Extra Curricular Activities with ancient clay tablet styling */}
          {hasExtracurriculars() && (
            <div 
              style={styles.section} 
              className={`nineveh-section ${enhancedClasses.section}`}
            >
              <h2 
                style={styles.sectionTitle} 
                className={`nineveh-section-title ${enhancedClasses.sectionTitle}`} 
                data-section="extracurriculars"
              >
                {t('resume.extracurricular.activity')}
              </h2>
              <div>
                {data.extracurriculars.map((activity, index) => (
                  <div 
                    key={index} 
                    style={{
                      ...styles.expItem,
                      animationDelay: !isPdfMode ? getAnimationDelay(index) : '0s'
                    }} 
                    className={`nineveh-extracurricular-item ${enhancedClasses.expItem}`}
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

        {/* Sidebar (right) with ancient decorative styling */}
        <div style={styles.sidebar} className="nineveh-sidebar">
          {/* Personal Information with ancient styling */}
          {hasPersonalDetails() && (
            <div style={styles.section} className={`nineveh-sidebar-section ${enhancedClasses.section}`}>
              <h2 
                style={styles.sidebarSectionTitle} 
                className={`nineveh-sidebar-title ${enhancedClasses.sectionTitle}`} 
                data-section="personal-details"
              >
                {t('resume.personal_info.title')}
              </h2>
              <div style={styles.personalDetails}>
                {data.personal_info.address && (
                  <div style={{...styles.personalDetailItem, '::before': {content: '"🏠"'}}} 
                       className={enhancedClasses.contactItem}>
                    <span>{data.personal_info.address}</span>
                  </div>
                )}
                {data.personal_info.postal_code && (
                  <div style={{...styles.personalDetailItem, '::before': {content: '"📮"'}}}
                       className={enhancedClasses.contactItem}>
                    <span>{data.personal_info.postal_code} {data.personal_info.city}</span>
                  </div>
                )}

                {data.personal_info.driving_license && (
                  <div style={{...styles.personalDetailItem, '::before': {content: '"🚗"'}}}
                       className={enhancedClasses.contactItem}>
                    <span>{t('resume.personal_info.driving_license')}: {data.personal_info.driving_license}</span>
                  </div>
                )}
                {data.personal_info.nationality && (
                  <div style={{...styles.personalDetailItem, '::before': {content: '"🌍"'}}}
                       className={enhancedClasses.contactItem}>
                    <span>{t('resume.personal_info.nationality')}: {data.personal_info.nationality}</span>
                  </div>
                )}
                {data.personal_info.place_of_birth && (
                  <div style={{...styles.personalDetailItem, '::before': {content: '"📍"'}}}
                       className={enhancedClasses.contactItem}>
                    <span>{t('resume.personal_info.place_of_birth')}: {data.personal_info.place_of_birth}</span>
                  </div>
                )}
                {data.personal_info.date_of_birth && (
                  <div style={{...styles.personalDetailItem, '::before': {content: '"🎂"'}}}
                       className={enhancedClasses.contactItem}>
                    <span>{t('resume.personal_info.date_of_birth')}: {formatDate(data.personal_info.date_of_birth)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Skills with ancient cuneiform-inspired meters */}
          {hasSkills() && (
            <div style={styles.section} className={`nineveh-sidebar-section ${enhancedClasses.section}`}>
              <h2 
                style={styles.sidebarSectionTitle} 
                className={`nineveh-sidebar-title ${enhancedClasses.sectionTitle}`} 
                data-section="skills"
              >
                {t('resume.skills.title')}
              </h2>
              <div style={styles.skillsGrid}>
                {data.skills
                  .filter(skill => skill && skill.name)
                  .map((skill, index) => (
                    <div 
                      key={index} 
                      style={{
                        ...styles.skillItem,
                        animationDelay: !isPdfMode ? getAnimationDelay(index) : '0s'
                      }}
                    >
                      <div style={styles.skillName}>
                        {skill.name}
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

          {/* Languages with ancient styling */}
          {hasLanguages() && (
            <div style={styles.section} className={`nineveh-sidebar-section ${enhancedClasses.section}`}>
              <h2 
                style={styles.sidebarSectionTitle} 
                className={`nineveh-sidebar-title ${enhancedClasses.sectionTitle}`} 
                data-section="languages"
              >
                {t('resume.languages.title')}
              </h2>
              <div style={styles.languagesGrid}>
                {data.languages.map((lang, index) => (
                  <div 
                    key={index} 
                    style={{
                      ...styles.languageItem,
                      animationDelay: !isPdfMode ? getAnimationDelay(index) : '0s'
                    }}
                    className={enhancedClasses.hobbyItem}
                  >
                    <div style={styles.languageName}>{lang.name}</div>
                    <div style={styles.languageProficiency}>{getProficiencyTranslation(lang.level, t)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Hobbies with ancient styling */}
          {hasHobbies() && (
            <div style={styles.section} className={`nineveh-sidebar-section ${enhancedClasses.section}`}>
              <h2 
                style={styles.sidebarSectionTitle} 
                className={`nineveh-sidebar-title ${enhancedClasses.sectionTitle}`} 
                data-section="hobbies"
              >
                {t('resume.hobbies.title')}
              </h2>
              <div style={styles.hobbiesContainer}>
                {typeof data.hobbies === 'string' ? (
                  <p style={styles.hobbiesText}>{data.hobbies}</p>
                ) : (
                  <div style={styles.hobbiesGrid}>
                    {data.hobbies
                      .filter(hobby => hobby && (typeof hobby === 'string' ? hobby : hobby.name))
                      .map((hobby, index) => (
                        <div 
                          key={index} 
                          style={{
                            ...styles.hobbyItem,
                            animationDelay: !isPdfMode ? getAnimationDelay(index) : '0s'
                          }}
                          className={enhancedClasses.hobbyItem}
                        >
                          {typeof hobby === 'string' ? hobby : hobby.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          
          {/* References with ancient tablet styling */}
          {hasReferences() && (
            <div style={styles.section} className={`nineveh-sidebar-section ${enhancedClasses.section}`}>
              <h2 
                style={styles.sidebarSectionTitle} 
                className={`nineveh-sidebar-title ${enhancedClasses.sectionTitle}`} 
                data-section="referrals"
              >
                {t('resume.references.title')}
              </h2>
              <div style={styles.referralsGrid}>
                {data.referrals?.providedOnRequest ? (
                  <div style={styles.referralItem} className="transition-all duration-300">
                    <p style={styles.referralsText}>{t('resume.references.provide_upon_request')}</p>
                  </div>
                ) : ( 
                  data.referrals && data.referrals.map((reference, index) => (
                    <div 
                      key={`referral-${index}`} 
                      style={{
                        ...styles.referralItem,
                        animationDelay: !isPdfMode ? getAnimationDelay(index) : '0s'
                      }} 
                      className="transition-all duration-300"
                    >
                      <div style={styles.referralName}>{reference.name}</div>
                      {reference.relation && <div style={styles.referralPosition}>{reference.relation}</div>}
                      {reference.email && (
                        <div style={styles.referralContact} className="mt-2">
                          {reference.email}
                        </div>
                      )}
                      {reference.phone && (
                        <div style={{...styles.referralContact, marginTop: '5px'}}>
                          {reference.phone}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
  
      {/* Ancient CSS styles for animations and PDF mode */}
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
        
        .nineveh-exp-item, .nineveh-edu-item, .nineveh-internship-item, .nineveh-course-item, .nineveh-custom-item {
          animation: fadeInUp 0.8s ease-out both;
          animation-delay: var(--delay, 0s);
        }
        
        .nineveh-section-title, .nineveh-sidebar-title {
          animation: slideInLeft 0.6s ease-out both;
        }
        
        .profile-image {
          animation: fadeIn 1s ease-in-out;
        }
        
        .nineveh-skill-level-bar {
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
          
          .nineveh-exp-item, .nineveh-edu-item, .nineveh-internship-item, .nineveh-course-item, .nineveh-custom-item {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            animation: none !important;
          }
          
          .nineveh-section-title, .nineveh-sidebar-title {
            page-break-after: avoid !important;
            break-after: avoid !important;
            animation: none !important;
          }
          
          .profile-image {
            animation: none !important;
          }
          
          .nineveh-skill-level-bar {
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
        
        /* Custom Mesopotamian inspired fonts */
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cinzel:wght@400;500;600;700&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap');
      `}} />
    </div>
  );
};
  
export default Nineveh;