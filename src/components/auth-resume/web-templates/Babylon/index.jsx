import React, { useEffect } from 'react';
import { getBabylonStyles } from './BabylonStyles';
import { useTranslation } from 'react-i18next';

const Babylon = ({ formData, customSettings, darkMode, isPdfMode = false }) => {
  const { t } = useTranslation();
 
  // Default custom settings with elegant gold/bronze accent
  const settings = {
    accentColor: customSettings?.accentColor || '#8B5A2B', // Bronze/copper as default accent
    fontFamily: customSettings?.fontFamily || '"Cormorant Garamond", "Baskerville", "Times New Roman", serif',
    lineSpacing: customSettings?.lineSpacing || 1.7, // Slightly more spacing for elegance
    headingsUppercase: customSettings?.headingsUppercase !== undefined ? customSettings.headingsUppercase : true,
    hideSkillLevel: customSettings?.hideSkillLevel || false
  };
 
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
  const styles = getBabylonStyles(darkMode, settings, isPdfMode);

  // Apply text transform based on settings
  const headingTextTransform = settings.headingsUppercase ? 'uppercase' : 'none';
  
  // Add text transform to section title styles
  const sectionTitleStyle = {
    ...styles.sectionTitle,
    textTransform: headingTextTransform
  };
  
  const sidebarSectionTitleStyle = {
    ...styles.sidebarSectionTitle,
    textTransform: headingTextTransform
  };

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
  // Add elegant ornamental elements
  useEffect(() => {
    // Only add decorative elements when not in PDF mode
    if (!isPdfMode && typeof document !== 'undefined') {
      // Get the resume container
      const container = document.querySelector('.babylon-template');
      
      if (container) {
        // Remove any existing decorative elements
        const existingOrnaments = container.querySelectorAll('.babylon-ornament');
        existingOrnaments.forEach(ornament => ornament.remove());
        
        // Add subtle corner ornaments to sections
        const sections = container.querySelectorAll('.babylon-section, .babylon-sidebar-section');
        
        sections.forEach((section) => {
          const cornerOrnament = document.createElement('div');
          cornerOrnament.className = 'babylon-ornament';
          cornerOrnament.style.position = 'absolute';
          cornerOrnament.style.width = '15px';
          cornerOrnament.style.height = '15px';
          cornerOrnament.style.top = '0';
          cornerOrnament.style.right = '0';
          cornerOrnament.style.borderTop = `2px solid ${darkMode ? '#d4af3755' : '#d4af3755'}`;
          cornerOrnament.style.borderRight = `2px solid ${darkMode ? '#d4af3755' : '#d4af3755'}`;
          cornerOrnament.style.pointerEvents = 'none';
          section.appendChild(cornerOrnament);
        });
      }
    }
    
    return () => {
      // Cleanup function to remove decorative elements when component unmounts
      if (typeof document !== 'undefined') {
        const existingOrnaments = document.querySelectorAll('.babylon-ornament');
        existingOrnaments.forEach(ornament => ornament.remove());
      }
    };
  }, [isPdfMode, darkMode]);

  // Elegant animation classes
  const enhancedClasses = isPdfMode ? {
    // PDF-specific classes (no animations for PDF)
    container: "print:bg-white print:shadow-none",
    header: "print:py-3",
    section: "print:break-inside-avoid",
    expItem: "print:break-inside-avoid print:border print:border-gray-200 print:shadow-none",
    sectionTitle: "print:break-after-avoid",
    sidebar: "print:bg-gray-50"
  } : {
    // Interactive UI classes with subtle animations
    container: "transition-all duration-700 ease-in-out",
    header: "transition-all duration-700 ease-in-out",
    section: "transition-all duration-700 ease-in-out",
    expItem: "transition-all duration-500 hover:shadow-md",
    sectionTitle: "relative transition-all duration-700 ease-in-out",
    sidebar: "transition-all duration-700 ease-in-out",
    skillBar: "transition-all duration-1200 ease-out",
    hobbyItem: "transition-all duration-500 hover:translate-x-1",
    contactItem: "transition-all duration-500"
  };

  // Elegant animation timing for subtle fade-in
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

  // Elegant skill level function 
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
  
  // Elegant proficiency translation
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
    <div style={styles.container} className={`babylon-template ${enhancedClasses.container}`}>
      {/* Elegant header with profile info and contact details */}
      <header style={styles.header} className={`babylon-header ${enhancedClasses.header}`}>
        <div style={styles.headerContent}>
          {/* Profile image with elegant frame */}
          <div style={styles.profileContainer}>
            <img 
              src={profileImage}
              alt={data.personal_info.full_name} 
              style={styles.profileImage} 
              className="profile-image"
            />
          </div>

          {/* Name and title with elegant typography */}
          <div style={styles.nameContainer}>
            <h1 style={styles.name}>{data.personal_info.full_name}</h1>
            <div style={styles.title}>{data.personal_info.title}</div>
          </div>
          
          {/* Contact information with refined styling */}
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
      </header>

      {/* Elegant two-column layout */}
      <div style={styles.contentLayout}>
        {/* Main column (left) with experiences, education, etc. */}
        <div style={styles.mainColumn} className="babylon-main-column">
          {/* Professional Summary with elegant styling */}
          {data.personal_info.summary && (
            <div 
              style={styles.section} 
              className={`babylon-section ${enhancedClasses.section}`}
            >
              <h2 
                style={sectionTitleStyle} 
                className={`babylon-section-title ${enhancedClasses.sectionTitle}`} 
                data-section="summary"
              >
                {t('resume.personal_info.summary')}
              </h2>
              <div>
                <p style={styles.summary}>{data.personal_info.summary}</p>
              </div>
            </div>
          )}

          {/* Work Experience with elegant cards */}
          {hasExperiences() && (
            <div 
              style={styles.section} 
              className={`babylon-section ${enhancedClasses.section}`}
            >
              <h2 
                style={sectionTitleStyle} 
                className={`babylon-section-title ${enhancedClasses.sectionTitle}`} 
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
                      className={`babylon-exp-item ${enhancedClasses.expItem}`}
                    >
                      <div style={styles.expHeader}>
                        <div style={styles.expTitle}>{exp.position}</div>
                        <div style={styles.expDate}>
                          {formatDate(exp.start_date)} - {exp.current ? t('resume.experience.current_work') : formatDate(exp.end_date)}
                        </div>
                      </div>

                      <div>
                        <div style={styles.expCompany}>{exp.company}</div>
                        {exp.location && <div style={styles.expLocation}>{exp.location}</div>}
                      </div>
                      {exp.description && <div style={styles.expDescription}>{exp.description}</div>}
                    </div>
                ))}
              </div>
            </div>
          )}

          {/* Education with elegant cards */}
          {hasEducation() && (
            <div 
              style={styles.section} 
              className={`babylon-section ${enhancedClasses.section}`}
            >
              <h2 
                style={sectionTitleStyle} 
                className={`babylon-section-title ${enhancedClasses.sectionTitle}`} 
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
                      className={`babylon-edu-item ${enhancedClasses.expItem}`}
                    >
                      <div style={styles.expHeader}>
                        <div style={styles.expTitle}>
                          {edu.degree} {edu.field_of_study && t('common.in') + ` ${edu.field_of_study}`}
                        </div>
                        <div style={styles.expDate}>
                          {formatDate(edu.start_date)} - {edu.current ? t('resume.education.currently_studying') : formatDate(edu.end_date)}
                        </div>
                      </div>
                      <div style={styles.expCompany}>{edu.institution}</div>
                      {edu.location && <div style={styles.expLocation}>{edu.location}</div>}
                      {edu.gpa && <div style={styles.expDescription}>{t('resume.education.gpa')}: {edu.gpa}</div>}
                    </div>
                ))}
              </div>
            </div>
          )}

          {/* Internships with elegant cards */}
          {hasInternships() && (
            <div 
              style={styles.section} 
              className={`babylon-section ${enhancedClasses.section}`}
            >
              <h2 
                style={sectionTitleStyle} 
                className={`babylon-section-title ${enhancedClasses.sectionTitle}`} 
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
                      className={`babylon-internship-item ${enhancedClasses.expItem}`}
                    >
                      <div style={styles.expHeader}>
                        <div style={styles.expTitle}>{internship.position}</div>
                        <div style={styles.expDate}>
                          {formatDate(internship.start_date)} - {internship.current ? t('resume.internships.current_work') : formatDate(internship.end_date)}
                        </div>
                      </div>
                      <div style={styles.expCompany}>{internship.company}</div>
                      {internship.location && <div style={styles.expLocation}>{internship.location}</div>}
                      {internship.description && <div style={styles.expDescription}>{internship.description}</div>}
                    </div>
                ))}
              </div>
            </div>
          )}

          {/* Courses & Certifications with elegant cards */}
          {hasCourses() && (
            <div 
              style={styles.section} 
              className={`babylon-section ${enhancedClasses.section}`}
            >
              <h2 
                style={sectionTitleStyle} 
                className={`babylon-section-title ${enhancedClasses.sectionTitle}`} 
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
                      className={`babylon-course-item ${enhancedClasses.expItem}`}
                    >
                      <div style={styles.expHeader}>
                        <div style={styles.expTitle}>{course.name}</div>
                        {course.date && <div style={styles.expDate}>{formatDate(course.date)}</div>}
                      </div>
                      {course.institution && <div style={styles.expCompany}>{course.institution}</div>}
                      {course.description && <div style={styles.expDescription}>{course.description}</div>}
                    </div>
                ))}
              </div>
            </div>
          )}

          {/* Custom Sections with elegant cards */}
          {hasCustomSections() && 
            data.custom_sections
              .filter(section => section && section.title && (section.content || (section.items && section.items.length > 0)))
              .map((section, sectionIndex) => (
                <div 
                  key={`custom-${sectionIndex}`} 
                  style={styles.section} 
                  className={`babylon-section ${enhancedClasses.section}`}
                >
                  <h2 
                    style={sectionTitleStyle} 
                    className={`babylon-section-title ${enhancedClasses.sectionTitle}`} 
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
                          className={`babylon-custom-item ${enhancedClasses.expItem}`}
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
                        className={`babylon-custom-content ${enhancedClasses.expItem}`}
                      >
                        {section.content && <div style={styles.expDescription}>{section.content}</div>}
                      </div>
                    )}
                  </div>
                </div>
              ))
          }

          {/* Extra Curricular Activities with elegant cards */}
          {hasExtracurriculars() && (
            <div 
              style={styles.section} 
              className={`babylon-section ${enhancedClasses.section}`}
            >
              <h2 
                style={sectionTitleStyle} 
                className={`babylon-section-title ${enhancedClasses.sectionTitle}`} 
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
                    className={`babylon-extracurricular-item ${enhancedClasses.expItem}`}
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

        {/* Elegant sidebar (right column) */}
        <div style={styles.sidebar} className={`babylon-sidebar ${enhancedClasses.sidebar}`}>
          {/* Personal Information with refined styling */}
          {hasPersonalDetails() && (
            <div 
              style={styles.section} 
              className={`babylon-sidebar-section ${enhancedClasses.section}`}
            >
              <h2 
                style={sidebarSectionTitleStyle} 
                className={`babylon-sidebar-title ${enhancedClasses.sectionTitle}`} 
                data-section="personal-details"
              >
                {t('resume.personal_info.title')}
              </h2>
              <div style={styles.personalDetails}>
                {data.personal_info.address && (
                  <div style={{...styles.personalDetailItem, '::before': {content: '"🏠"'}}} 
                       className="transition-all duration-300">
                    <span>{data.personal_info.address}</span>
                  </div>
                )}
                {data.personal_info.postal_code && (
                  <div style={{...styles.personalDetailItem, '::before': {content: '"📮"'}}}
                       className="transition-all duration-300">
                    <span>{data.personal_info.postal_code} {data.personal_info.city}</span>
                  </div>
                )}

                {data.personal_info.driving_license && (
                  <div style={{...styles.personalDetailItem, '::before': {content: '"🚗"'}}}
                       className="transition-all duration-300">
                    <span>{t('resume.personal_info.driving_license')}: {data.personal_info.driving_license}</span>
                  </div>
                )}
                {data.personal_info.nationality && (
                  <div style={{...styles.personalDetailItem, '::before': {content: '"🌍"'}}}
                       className="transition-all duration-300">
                    <span>{t('resume.personal_info.nationality')}: {data.personal_info.nationality}</span>
                  </div>
                )}
                {data.personal_info.place_of_birth && (
                  <div style={{...styles.personalDetailItem, '::before': {content: '"📍"'}}}
                       className="transition-all duration-300">
                    <span>{t('resume.personal_info.place_of_birth')}: {data.personal_info.place_of_birth}</span>
                  </div>
                )}
                {data.personal_info.date_of_birth && (
                  <div style={{...styles.personalDetailItem, '::before': {content: '"🎂"'}}}
                       className="transition-all duration-300">
                    <span>{t('resume.personal_info.date_of_birth')}: {formatDate(data.personal_info.date_of_birth)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Skills with elegant visualization */}
          {hasSkills() && (
            <div 
              style={styles.section} 
              className={`babylon-sidebar-section ${enhancedClasses.section}`}
            >
              <h2 
                style={sidebarSectionTitleStyle} 
                className={`babylon-sidebar-title ${enhancedClasses.sectionTitle}`} 
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

          {/* Languages with elegant styling */}
          {hasLanguages() && (
            <div 
              style={styles.section} 
              className={`babylon-sidebar-section ${enhancedClasses.section}`}
            >
              <h2 
                style={sidebarSectionTitleStyle} 
                className={`babylon-sidebar-title ${enhancedClasses.sectionTitle}`} 
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
                    className="transition-all duration-300"
                  >
                    <div style={styles.languageName}>{lang.name}</div>
                    <div style={styles.languageProficiency}>{getProficiencyTranslation(lang.level, t)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* References with elegant cards */}
          {hasReferences() && (
            <div 
              style={styles.section} 
              className={`babylon-sidebar-section ${enhancedClasses.section}`}
            >
              <h2 
                style={sidebarSectionTitleStyle} 
                className={`babylon-sidebar-title ${enhancedClasses.sectionTitle}`} 
                data-section="referrals"
              >
                {t('resume.references.title')}
              </h2>
              <div style={styles.referralsGrid}>
                {data.referrals?.providedOnRequest ? (
                  <div 
                    style={styles.referralItem} 
                    className="transition-all duration-300"
                  >
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

          {/* Hobbies & Interests with elegant styling */}
          {hasHobbies() && (
            <div 
              style={styles.section} 
              className={`babylon-sidebar-section ${enhancedClasses.section}`}
            >
              <h2 
                style={sidebarSectionTitleStyle} 
                className={`babylon-sidebar-title ${enhancedClasses.sectionTitle}`} 
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
          </div>
        </div>
  
        {/* Global CSS styles for animations and PDF */}
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
          
          .babylon-exp-item, .babylon-edu-item, .babylon-internship-item, .babylon-course-item, .babylon-custom-item {
            animation: fadeInUp 0.8s ease-out both;
            animation-delay: var(--delay, 0s);
          }
          
          .babylon-section-title, .babylon-sidebar-title {
            animation: slideInLeft 0.6s ease-out both;
          }
          
          .profile-image {
            animation: fadeIn 1s ease-in-out;
          }
          
          .babylon-skill-level-bar {
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
            
            .babylon-exp-item, .babylon-edu-item, .babylon-internship-item, .babylon-course-item, .babylon-custom-item {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              animation: none !important;
            }
            
            .babylon-section-title, .babylon-sidebar-title {
              page-break-after: avoid !important;
              break-after: avoid !important;
              animation: none !important;
            }
            
            .profile-image {
              animation: none !important;
            }
            
            .babylon-skill-level-bar {
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
          
          /* Custom font imports */
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
        `}} />
      </div>
    );
  };
  
  export default Babylon;