import React, { useEffect } from 'react';
import { getBaghdadStyles } from './BaghdadStyles';
import { useTranslation } from 'react-i18next';

const Baghdad = ({ formData, customSettings, darkMode, isPdfMode = false }) => {
  const { t } = useTranslation();
 
  // Create a normalized version of the data with consistent property names
  const data = {
    ...formData,
    personal_info: formData.personal_info || {
      full_name: t('resume.personal_info.full_name_placeholder'),
      title: t('resume.personal_info.title_placeholder'),
      email: t('resume.personal_info.email_placeholder'),
      mobile: t('resume.personal_info.mobile_placeholder'),
      city: t('resume.personal_info.city_placeholder'),
    },
    educations: formData.educations || [],
    experiences: formData.experiences || [],
    skills: formData.skills || [],
    languages: formData.languages?.map(lang => ({
      ...lang,
      language: lang.name || lang.language,
      name: lang.name || lang.language,
      level: lang.level || lang.proficiency
    })) || [],
    internships: formData.internships || [],
    courses: formData.courses || [],
    hobbies: formData.hobbies || [],
    extracurriculars: formData.extracurriculars || [],
    referrals: formData.referrals || []
  };
   
  // Default custom settings with Middle Eastern color palette
  const settings = {
    accentColor: customSettings?.accentColor || '#9C7C38', // Golden accent color
    fontFamily: customSettings?.fontFamily || 'Roboto, "Noto Kufi Arabic", Arial, sans-serif',
    lineSpacing: customSettings?.lineSpacing || 1.6,
    headingsUppercase: customSettings?.headingsUppercase || false,
    hideSkillLevel: customSettings?.hideSkillLevel || false
  };

  // Get the styles specific to this template
  const styles = getBaghdadStyles(darkMode, settings, isPdfMode);

  // Format date helper with internationalization support
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    
    try {
      const [year, month] = dateStr.split('-').map(num => parseInt(num, 10));
      const dateObj = new Date(year, month - 1);
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
  // CSS classes for animations and transitions
  const cssClasses = isPdfMode ? {
    // PDF-specific classes (no animations)
    container: "print:bg-white",
    card: "print:shadow-none",
    section: "print:break-inside-avoid",
  } : {
    // Interactive UI classes
    container: "transition-all duration-300",
    card: "transition-all duration-300 hover:translate-y-[-4px] hover:shadow-lg",
    entry: "animate-fade-in",
    detail: "hover:bg-opacity-50 transition-all duration-300",
    hobby: "hover:bg-opacity-80 hover:border-opacity-80 transition-all duration-300",
  };

  // Function to get the appropriate skill dots (filled/unfilled)
  const getSkillDots = (level) => {
    const maxDots = 5;
    let filledDots = 0;
    
    switch(level) {
      case 'Beginner': filledDots = 1; break;
      case 'Elementary': filledDots = 2; break;
      case 'Intermediate': filledDots = 3; break;
      case 'Advanced': filledDots = 4; break;
      case 'Expert': 
      case 'Native': 
      case 'Fluent': filledDots = 5; break;
      case 'Proficient': filledDots = 4; break;
      case 'Conversational': filledDots = 3; break;
      case 'Basic': filledDots = 1; break;
      default: filledDots = Math.ceil(maxDots / 2);
    }
    
    return Array(maxDots).fill().map((_, i) => i < filledDots);
  };

  // Function to get language proficiency percentage
  const getLanguageProficiencyPercentage = (level) => {
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
  };

  // Function to get language proficiency translation
  const getProficiencyTranslation = (proficiency, t) => {
    const proficiencies = {
      'Native': t('resume.languages.levels.native'),
      'Fluent': t('resume.languages.levels.fluent'),
      'Advanced': t('resume.languages.levels.advanced'),
      'Intermediate': t('resume.languages.levels.intermediate'),
      'Beginner': t('resume.languages.levels.beginner'),
      
    };
    
    return proficiencies[proficiency] || proficiency;
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
  
  return (
    <div style={styles.container} className={`baghdad-template ${cssClasses.container}`}>
      {/* Distinctive header with Middle Eastern design elements */}
      <header style={styles.header} className="baghdad-header">
        <div style={styles.headerPattern}></div>
        
        <div style={styles.headerInner}>
          <div style={styles.headerLeft}>
            <h1 style={styles.name}>{data.personal_info.full_name}</h1>
            <div style={styles.title}>{data.personal_info.title}</div>
            
            {/* Contact Information */}
            <div style={styles.contactContainer}>
              {data.personal_info.email && (
                <div style={styles.contactItem} className="baghdad-contact-item">
                  <span style={styles.contactIcon}>✉</span>
                  <span>{data.personal_info.email}</span>
                </div>
              )}
              
              {data.personal_info.mobile && (
                <div style={styles.contactItem} className="baghdad-contact-item">
                  <span style={styles.contactIcon}>📱</span>
                  <span>{data.personal_info.mobile}</span>
                </div>
              )}
              
              {data.personal_info.linkedin && (
                <div style={styles.contactItem} className="baghdad-contact-item">
                  <span style={styles.contactIcon}>🔗</span>
                  <span>{data.personal_info.linkedin}</span>
                </div>
              )}
              
              {data.personal_info.website && (
                <div style={styles.contactItem} className="baghdad-contact-item">
                  <span style={styles.contactIcon}>🌐</span>
                  <span>{data.personal_info.website}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Profile Image with ornamental border */}
          <div style={styles.headerRight}>
            <div style={styles.profileContainer}>
              <div style={styles.profileContainerInner}>
                <img 
                  src={profileImage}
                  alt={data.personal_info.full_name} 
                  style={styles.profileImage} 
                  className="baghdad-profile-image"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative element */}
        {!isPdfMode && (
          <div style={styles.decorativeArc}></div>
        )}
      </header>
      
      {/* Main content with two-column layout */}
      <div style={styles.mainContent}>
        {/* Main column (left) */}
        <div style={styles.leftColumn}>
          {/* Professional Summary */}
          {data.personal_info.summary && (
            <div style={styles.section} className="baghdad-section">
              <h2 style={styles.sectionTitle}>
                <span style={styles.sectionTitleIcon}>📝</span>
                {t('resume.personal_info.summary')}
              </h2>
              <div style={styles.summary} className="baghdad-summary">
                {data.personal_info.summary}
              </div>
            </div>
          )}
          
          {/* Work Experience */}
          {hasExperiences() && (
            <div style={styles.section} className="baghdad-section">
              <h2 style={styles.sectionTitle}>
                <span style={styles.sectionTitleIcon}>💼</span>
                {t('resume.experience.title')}
              </h2>
              
              <div style={styles.cardsList}>
                {data.experiences
                  .filter(exp => exp && exp.company)
                  .map((exp, index) => (
                    <div 
                      key={index} 
                      style={{...styles.card, ...styles.cardWithAccent}} 
                      className={`baghdad-card ${cssClasses.card}`}
                    >
                      <div style={styles.cardHeader}>
                        <h3 style={styles.cardTitle}>{exp.position}</h3>
                        <div style={styles.cardDate}>
                          <span style={styles.cardDateIcon}>📅</span>
                          {formatDate(exp.start_date)} - {exp.current ? t('resume.experience.current_work') : formatDate(exp.end_date)}
                        </div>
                      </div>
                      
                      <div style={styles.cardCompany}>{exp.company}</div>
                      {exp.location && (
                        <div style={styles.cardLocation}>
                          <span>📍</span> {exp.location}
                        </div>
                      )}
                      
                      {exp.description && <div style={styles.cardContent}>{exp.description}</div>}
                      {!isPdfMode && <div style={styles.ornamentalCorner}></div>}
                    </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Education */}
          {hasEducation() && (
            <div style={styles.section} className="baghdad-section">
              <h2 style={styles.sectionTitle}>
                <span style={styles.sectionTitleIcon}>🎓</span>
                {t('resume.education.title')}
              </h2>
              
              <div style={styles.cardsList}>
                {data.educations
                  .filter(edu => edu && edu.institution)
                  .map((edu, index) => (
                    <div 
                      key={index} 
                      style={{...styles.card, ...styles.cardWithAccent}} 
                      className={`baghdad-card ${cssClasses.card}`}
                    >
                      <div style={styles.cardHeader}>
                        <h3 style={styles.cardTitle}>
                          {edu.degree} {edu.field_of_study && t('common.in') + ` ${edu.field_of_study}`}
                        </h3>
                        <div style={styles.cardDate}>
                          <span style={styles.cardDateIcon}>📅</span>
                          {formatDate(edu.start_date)} - {edu.current ? t('resume.education.currently_studying') : formatDate(edu.end_date)}
                        </div>
                      </div>
                      
                      <div style={styles.cardCompany}>{edu.institution}</div>
                      {edu.location && (
                        <div style={styles.cardLocation}>
                          <span>📍</span> {edu.location}
                        </div>
                      )}
                      
                      {edu.gpa && (
                        <div style={styles.cardContent}>
                          {t('resume.education.gpa')}: {edu.gpa}
                        </div>
                      )}
                      {!isPdfMode && <div style={styles.ornamentalCorner}></div>}
                    </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Internships */}
          {hasInternships() && (
            <div style={styles.section} className="baghdad-section">
              <h2 style={styles.sectionTitle}>
                <span style={styles.sectionTitleIcon}>🔍</span>
                {t('resume.internships.title')}
              </h2>
              
              <div style={styles.cardsList}>
                {data.internships
                  .filter(internship => internship && internship.company)
                  .map((internship, index) => (
                    <div 
                      key={index} 
                      style={{...styles.card, ...styles.cardWithAccent}} 
                      className={`baghdad-card ${cssClasses.card}`}
                    >
                      <div style={styles.cardHeader}>
                        <h3 style={styles.cardTitle}>{internship.position}</h3>
                        <div style={styles.cardDate}>
                          <span style={styles.cardDateIcon}>📅</span>
                          {formatDate(internship.start_date)} - {internship.current ? t('resume.internships.current_work') : formatDate(internship.end_date)}
                        </div>
                      </div>
                      
                      <div style={styles.cardCompany}>{internship.company}</div>
                      {internship.location && (
                        <div style={styles.cardLocation}>
                          <span>📍</span> {internship.location}
                        </div>
                      )}
                      
                      {internship.description && <div style={styles.cardContent}>{internship.description}</div>}
                      {!isPdfMode && <div style={styles.ornamentalCorner}></div>}
                    </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Courses & Certifications */}
          {hasCourses() && (
            <div style={styles.section} className="baghdad-section">
              <h2 style={styles.sectionTitle}>
                <span style={styles.sectionTitleIcon}>📜</span>
                {t('resume.courses.title')}
              </h2>
              
              <div style={styles.cardsList}>
                {data.courses
                  .filter(course => course && course.name)
                  .map((course, index) => (
                    <div 
                      key={index} 
                      style={styles.card} 
                      className={`baghdad-card ${cssClasses.card}`}
                    >
                      <div style={styles.cardHeader}>
                        <h3 style={styles.cardTitle}>{course.name}</h3>
                        {course.date && (
                          <div style={styles.cardDate}>
                            <span style={styles.cardDateIcon}>📅</span>
                            {formatDate(course.date)}
                          </div>
                        )}
                      </div>
                      
                      {course.institution && <div style={styles.cardCompany}>{course.institution}</div>}
                      {course.description && <div style={styles.cardContent}>{course.description}</div>}
                      {!isPdfMode && <div style={styles.ornamentalCorner}></div>}
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
                <div key={`custom-${sectionIndex}`} style={styles.section} className="baghdad-section">
                  <h2 style={styles.sectionTitle}>
                    <span style={styles.sectionTitleIcon}>📋</span>
                    {section.title || t('resume.custom_sections.title')}
                  </h2>
                  
                  <div style={styles.cardsList}>
                    {/* If the section has items array, render them as individual entries */}
                    {section.items && section.items.length > 0 ? (
                      section.items.map((item, itemIndex) => (
                        <div 
                          key={`custom-item-${sectionIndex}-${itemIndex}`} 
                          style={styles.card} 
                          className={`baghdad-card ${cssClasses.card}`}
                        >
                          <div style={styles.cardHeader}>
                            <h3 style={styles.cardTitle}>{item.title}</h3>
                            {item.date && (
                              <div style={styles.cardDate}>
                                <span style={styles.cardDateIcon}>📅</span>
                                {item.date}
                              </div>
                            )}
                          </div>
                          
                          {item.subtitle && <div style={styles.cardCompany}>{item.subtitle}</div>}
                          {item.content && <div style={styles.cardContent}>{item.content}</div>}
                          {!isPdfMode && <div style={styles.ornamentalCorner}></div>}
                        </div>
                      ))
                    ) : (
                      // Otherwise just render the section content as a block
                      <div style={styles.card} className={`baghdad-card ${cssClasses.card}`}>
                        {section.content && <div style={styles.cardContent}>{section.content}</div>}
                        {!isPdfMode && <div style={styles.ornamentalCorner}></div>}
                      </div>
                    )}
                  </div>
                </div>
              ))
          }
          
          {/* Extra Curricular Activities */}
          {hasExtracurriculars() && (
            <div style={styles.section} className="baghdad-section">
              <h2 style={styles.sectionTitle}>
                <span style={styles.sectionTitleIcon}>🏆</span>
                {t('resume.extracurricular.activity')}
              </h2>
              
              <div style={styles.cardsList}>
                {data.extracurriculars.map((activity, index) => (
                  <div 
                    key={index} 
                    style={styles.card} 
                    className={`baghdad-card ${cssClasses.card}`}
                  >
                    <div style={styles.cardHeader}>
                      <h3 style={styles.cardTitle}>{activity.title}</h3>
                    </div>
                    
                    {activity.description && <div style={styles.cardContent}>{activity.description}</div>}
                    {!isPdfMode && <div style={styles.ornamentalCorner}></div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Sidebar (right column) */}
        <div style={styles.rightColumn}>
          {/* Personal Information */}
          {hasPersonalDetails() && (
            <div style={styles.sidebarSection} className="baghdad-sidebar-section">
              <h3 style={styles.sidebarTitle}>
                <span style={styles.sidebarTitleIcon}>👤</span>
                {t('resume.personal_info.title')}
              </h3>
              
              <div style={styles.detailsList}>
                {data.personal_info.address && (
                  <div style={styles.detailItem} className={`baghdad-detail-item ${cssClasses.detail}`}>
                    <span style={styles.detailIcon}>🏠</span>
                    <div style={styles.detailContent}>
                      <span style={styles.detailLabel}>{t('resume.personal_info.address')}</span>
                      {data.personal_info.address}
                    </div>
                  </div>
                )}
                
                {data.personal_info.postal_code && (
                  <div style={styles.detailItem} className={`baghdad-detail-item ${cssClasses.detail}`}>
                    <span style={styles.detailIcon}>📮</span>
                    <div style={styles.detailContent}>
                      <span style={styles.detailLabel}>{t('resume.personal_info.postal_code')}</span>
                      {data.personal_info.postal_code} {data.personal_info.city}
                    </div>
                  </div>
                )}
                
                {data.personal_info.driving_license && (
                  <div style={styles.detailItem} className={`baghdad-detail-item ${cssClasses.detail}`}>
                    <span style={styles.detailIcon}>🚗</span>
                    <div style={styles.detailContent}>
                      <span style={styles.detailLabel}>{t('resume.personal_info.driving_license')}</span>
                      {data.personal_info.driving_license}
                    </div>
                  </div>
                )}
                
                {data.personal_info.nationality && (
                  <div style={styles.detailItem} className={`baghdad-detail-item ${cssClasses.detail}`}>
                    <span style={styles.detailIcon}>🌍</span>
                    <div style={styles.detailContent}>
                      <span style={styles.detailLabel}>{t('resume.personal_info.nationality')}</span>
                      {data.personal_info.nationality}
                    </div>
                  </div>
                )}
                
                {data.personal_info.place_of_birth && (
                  <div style={styles.detailItem} className={`baghdad-detail-item ${cssClasses.detail}`}>
                    <span style={styles.detailIcon}>📍</span>
                    <div style={styles.detailContent}>
                      <span style={styles.detailLabel}>{t('resume.personal_info.place_of_birth')}</span>
                      {data.personal_info.place_of_birth}
                    </div>
                  </div>
                )}
                
                {data.personal_info.date_of_birth && (
                  <div style={styles.detailItem} className={`baghdad-detail-item ${cssClasses.detail}`}>
                    <span style={styles.detailIcon}>🎂</span>
                    <div style={styles.detailContent}>
                      <span style={styles.detailLabel}>{t('resume.personal_info.date_of_birth')}</span>
                      {formatDate(data.personal_info.date_of_birth)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Skills with dot indicators */}
          {hasSkills() && (
            <div style={styles.sidebarSection} className="baghdad-sidebar-section">
              <h3 style={styles.sidebarTitle}>
                <span style={styles.sidebarTitleIcon}>⚙️</span>
                {t('resume.skills.title')}
              </h3>
              
              <div style={styles.skillsList}>
                {data.skills
                  .filter(skill => skill && skill.name)
                  .map((skill, index) => (
                    <div key={index} style={styles.skillItem} className="baghdad-skill-item">
                      <div style={styles.skillName}>{skill.name}</div>
                      
                      {skill.level && !settings.hideSkillLevel && (
                        <div style={styles.skillLevel} className="baghdad-skill-level">
                          {getSkillDots(skill.level).map((isFilled, dotIndex) => (
                            <div
                              key={dotIndex}
                              style={{
                                ...styles.skillDot,
                                ...(isFilled ? styles.skillDotFilled : {})
                              }}
                              className="baghdad-skill-dot"
                            ></div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
          
          {/* Languages with progress bars */}
          {hasLanguages() && (
            <div style={styles.sidebarSection} className="baghdad-sidebar-section">
              <h3 style={styles.sidebarTitle}>
                <span style={styles.sidebarTitleIcon}>🗣️</span>
                {t('resume.languages.title')}
              </h3>
              
              <div style={styles.languagesList}>
                {data.languages.map((lang, index) => (
                  <div key={index} style={styles.languageItem} className="baghdad-language-item">
                    <div style={styles.languageName}>
                      {lang.name} - {getProficiencyTranslation(lang.level, t)}
                    </div>
                    
                    <div style={styles.languageBar} className="baghdad-language-bar">
                      <div 
                        style={{
                          ...styles.languageProgress,
                          width: getLanguageProficiencyPercentage(lang.level)
                        }}
                        className="baghdad-language-progress"
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Hobbies & Interests with ornamental styling */}
          {hasHobbies() && (
            <div style={styles.sidebarSection} className="baghdad-sidebar-section">
              <h3 style={styles.sidebarTitle}>
                <span style={styles.sidebarTitleIcon}>🌟</span>
                {t('resume.hobbies.title')}
              </h3>
              
              {typeof data.hobbies === 'string' ? (
                <p>{data.hobbies}</p>
              ) : (
                <div style={styles.hobbiesList}>
                  {data.hobbies
                    .filter(hobby => hobby && (typeof hobby === 'string' ? hobby : hobby.name))
                    .map((hobby, index) => (
                      <div 
                        key={index} 
                        style={styles.hobbyItem} 
                        className={`baghdad-hobby-item ${cssClasses.hobby}`}
                      >
                        {typeof hobby === 'string' ? hobby : hobby.name}
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
          
          {/* References with Middle Eastern aesthetic */}
          {hasReferences() && (
            <div style={styles.sidebarSection} className="baghdad-sidebar-section">
              <h3 style={styles.sidebarTitle}>
                <span style={styles.sidebarTitleIcon}>👥</span>
                {t('resume.references.title')}
              </h3>
              
              <div>
                {data.referrals?.providedOnRequest ? (
                  <div style={styles.card} className="baghdad-reference-item">
                    {t('resume.references.provide_upon_request')}
                  </div>
                ) : (
                  data.referrals && data.referrals.map((reference, index) => (
                    <div key={index} style={styles.card} className="baghdad-reference-item">
                      <div style={styles.cardTitle}>{reference.name}</div>
                      {reference.relation && <div style={styles.cardCompany}>{reference.relation}</div>}
                      
                      {reference.email && (
                        <div style={styles.cardLocation}>
                          ✉️ {reference.email}
                        </div>
                      )}
                      
                      {reference.phone && (
                        <div style={styles.cardLocation}>
                          📱 {reference.phone}
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
      
      {/* Animation styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideInRight {
          from {
            transform: translateX(20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideInLeft {
          from {
            transform: translateX(-20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .baghdad-card {
          animation: slideInRight 0.5s ease-out forwards;
          animation-delay: calc(var(--i, 0) * 0.1s);
        }
        
        .baghdad-sidebar-section {
          animation: slideInLeft 0.5s ease-out forwards;
          animation-delay: calc(var(--i, 0) * 0.1s);
        }
        
        @media print {
          .baghdad-card, .baghdad-sidebar-section {
            animation: none !important;
          }
          
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .baghdad-card {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          
          .baghdad-section, .baghdad-sidebar-section {
            page-break-inside: avoid-page !important;
            break-inside: avoid-page !important;
          }
        }
      `}} />
    </div>
  );
};

export default Baghdad;