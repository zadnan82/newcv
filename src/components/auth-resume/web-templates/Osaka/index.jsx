import React, { useEffect } from 'react';
import { getOsakaStyles } from './OsakaStyles';
import { useTranslation } from 'react-i18next';

const Osaka = ({ formData, customSettings, darkMode, isPdfMode = false }) => {
  const { t, i18n } = useTranslation();
  
  // Check if current language is RTL (right-to-left)
  const isRTL = i18n.dir() === 'rtl';
 
  // Create a normalized version of the data with consistent property names
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
    photos: formData?.photos || formData?.photo || null,
  };
   
  // Default custom settings
  const settings = {
    accentColor: customSettings?.accentColor || '#D81B60', // Vibrant Japanese-inspired pink
    fontFamily: customSettings?.fontFamily || 'Noto Sans, Roboto, Helvetica, Arial, sans-serif',
    lineSpacing: customSettings?.lineSpacing || 1.6,
    headingsUppercase: customSettings?.headingsUppercase === false ? false : true,
    hideSkillLevel: customSettings?.hideSkillLevel || false
  };

  // Get the styles specific to this template
  const styles = getOsakaStyles(darkMode, settings, isPdfMode, isRTL);

  // Format date helper with internationalization support
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    
    try {
      const [year, month] = dateStr.split('-').map(num => parseInt(num, 10));
      const dateObj = new Date(year, month - 1);
      const formatter = new Intl.DateTimeFormat(i18n.language, { month: 'long' });
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
  // CSS classes for transitions and animations
  const cssClasses = isPdfMode ? {
    // PDF-specific classes (no animations)
    container: "print:bg-white",
    card: "print:shadow-none",
    section: "print:break-inside-avoid",
  } : {
    // Interactive UI classes
    container: "transition-all duration-300",
    card: "transition-all duration-300 hover:translate-y-[-4px] hover:shadow-lg",
    entry: "animate-fade-in-up",
    title: "animate-slide-in",
    skill: "animate-grow-width",
    image: "animate-fade-in",
  };

  // Helper function for staggered animation delay
  const getAnimationDelay = (index) => {
    return !isPdfMode ? `${index * 0.1}s` : '0s';
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

  // Function to get skill level width percentage
  const getSkillLevelWidth = (level) => {
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
  const getProficiencyTranslation = (proficiency) => {
    if (!proficiency) return '';
    
    const translationKeys = {
      'Native': 'resume.languages.levels.native',
      'Fluent': 'resume.languages.levels.fluent',
      'Advanced': 'resume.languages.levels.advanced',
      'Intermediate': 'resume.languages.levels.intermediate',
      'Beginner': 'resume.languages.levels.beginner',
      
    };
    
    return translationKeys[proficiency] && t(translationKeys[proficiency]) || proficiency;
  };

  // Add subtle decorative elements for non-PDF mode
  useEffect(() => {
    if (!isPdfMode && typeof document !== 'undefined') {
      // Add animation classes to elements
      const mainContainer = document.querySelector('.osaka-template');
      if (mainContainer) {
        // Set animation delays for staggered entrance
        const allCards = mainContainer.querySelectorAll('.osaka-card');
        allCards.forEach((card, index) => {
          card.style.animationDelay = getAnimationDelay(index);
        });
      }
    }
    
    return () => {
      // Cleanup function if needed
    };
  }, [isPdfMode]);

  return (
    <div style={styles.container} className={`osaka-template ${cssClasses.container}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Decorative background element */}
      {!isPdfMode && <div style={styles.decorativeSquare}></div>}
      
      {/* Header section */}
      <div style={styles.headerContainer} className="osaka-header">
        <div style={styles.headerBackground}></div>
        
        {/* Profile Image */}
        <div style={styles.profileContainer}>
          <img 
            src={profileImage}
            alt={data.personal_info.full_name} 
            style={styles.profileImage} 
            className={`osaka-profile-image ${cssClasses.image}`}
          />
        </div>
        
        <div style={styles.headerContent}>
          <div style={styles.nameTitle}>
            <h1 style={styles.name}>{data.personal_info.full_name}</h1>
            <div style={styles.title}>{data.personal_info.title}</div>
          </div>
          
          {/* Contact Info */}
          <div style={styles.contactContainer}>
            {data.personal_info.email && (
              <div style={styles.contactItemHeader} className="osaka-contact-item">
                <span style={styles.contactIcon}>✉️</span>
                <span>{data.personal_info.email}</span>
              </div>
            )}
            
            {data.personal_info.mobile && (
              <div style={styles.contactItemHeader} className="osaka-contact-item">
                <span style={styles.contactIcon}>📱</span>
                <span>{data.personal_info.mobile}</span>
              </div>
            )}
            
            {data.personal_info.linkedin && (
              <div style={styles.contactItemHeader} className="osaka-contact-item">
                <span style={styles.contactIcon}>🔗</span>
                <span>{data.personal_info.linkedin}</span>
              </div>
            )}
            
            {data.personal_info.website && (
              <div style={styles.contactItemHeader} className="osaka-contact-item">
                <span style={styles.contactIcon}>🌐</span>
                <span>{data.personal_info.website}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div style={styles.mainContent}>
        {/* Left Column (Main content) */}
        <div style={styles.leftColumn}>
          {/* Professional Summary */}
          {data.personal_info.summary && (
            <div style={styles.section} className="osaka-section">
              <h2 style={styles.sectionTitle} className={`osaka-section-title ${cssClasses.title}`}>
                {t('resume.personal_info.summary')}
                <div style={styles.sectionTitleAccent}></div>
              </h2>
              <div style={styles.summary} className="osaka-summary">
                <div style={styles.summaryBackground}></div>
                <div style={styles.summaryInner}>{data.personal_info.summary}</div>
              </div>
            </div>
          )}
          
          {/* Work Experience */}
          {hasContent(data.experiences, 'company') && (
            <div style={styles.section} className="osaka-section">
              <h2 style={styles.sectionTitle} className={`osaka-section-title ${cssClasses.title}`}>
                {t('resume.experience.title')}
                <div style={styles.sectionTitleAccent}></div>
              </h2>
              
              <div style={styles.cardsList}>
                {data.experiences
                  .filter(exp => exp && exp.company)
                  .map((exp, index) => (
                    <div 
                      key={index} 
                      style={styles.card} 
                      className={`osaka-card osaka-exp-item osaka-card-with-accent ${cssClasses.card}`}
                    >
                      <div style={styles.cardHeader}>
                        <h3 style={styles.cardTitle}>{exp.position}</h3>
                        <div style={styles.cardDateBadge}>
                          {formatDate(exp.start_date)} - {exp.current ? t('resume.experience.current_work') : formatDate(exp.end_date)}
                        </div>
                      </div>
                      
                      <div style={styles.cardSubtitle}>{exp.company}</div>
                      {exp.location && <div style={styles.cardLocation}>📍 {exp.location}</div>}
                      {exp.description && <div style={styles.cardContent}>{exp.description}</div>}
                    </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Education */}
          {hasContent(data.education, 'institution') && (
            <div style={styles.section} className="osaka-section">
              <h2 style={styles.sectionTitle} className={`osaka-section-title ${cssClasses.title}`}>
                {t('resume.education.title')}
                <div style={styles.sectionTitleAccent}></div>
              </h2>
              
              <div style={styles.cardsList}>
                {data.education
                  .filter(edu => edu && edu.institution)
                  .map((edu, index) => (
                    <div 
                      key={index} 
                      style={styles.card} 
                      className={`osaka-card osaka-edu-item osaka-card-with-accent ${cssClasses.card}`}
                    >
                      <div style={styles.cardHeader}>
                        <h3 style={styles.cardTitle}>
                          {edu.degree} {edu.field_of_study && t('common.in') + ` ${edu.field_of_study}`}
                        </h3>
                        <div style={styles.cardDateBadge}>
                          {formatDate(edu.start_date)} - {edu.current ? t('resume.education.currently_studying') : formatDate(edu.end_date)}
                        </div>
                      </div>
                      
                      <div style={styles.cardSubtitle}>{edu.institution}</div>
                      {edu.location && <div style={styles.cardLocation}>📍 {edu.location}</div>}
                      {edu.gpa && <div style={styles.cardContent}>{t('resume.education.gpa')}: {edu.gpa}</div>}
                    </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Internships */}
          {hasContent(data.internships, 'company') && (
            <div style={styles.section} className="osaka-section">
              <h2 style={styles.sectionTitle} className={`osaka-section-title ${cssClasses.title}`}>
                {t('resume.internships.title')}
                <div style={styles.sectionTitleAccent}></div>
              </h2>
              
              <div style={styles.cardsList}>
                {data.internships
                  .filter(internship => internship && internship.company)
                  .map((internship, index) => (
                    <div 
                      key={index} 
                      style={styles.card} 
                      className={`osaka-card osaka-internship-item osaka-card-with-accent ${cssClasses.card}`}
                    >
                      <div style={styles.cardHeader}>
                        <h3 style={styles.cardTitle}>{internship.position}</h3>
                        <div style={styles.cardDateBadge}>
                          {formatDate(internship.start_date)} - {internship.current ? t('resume.internships.current_work') : formatDate(internship.end_date)}
                        </div>
                      </div>
                      
                      <div style={styles.cardSubtitle}>{internship.company}</div>
                      {internship.location && <div style={styles.cardLocation}>📍 {internship.location}</div>}
                      {internship.description && <div style={styles.cardContent}>{internship.description}</div>}
                    </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Courses & Certifications */}
          {hasContent(data.courses, 'name') && (
            <div style={styles.section} className="osaka-section">
              <h2 style={styles.sectionTitle} className={`osaka-section-title ${cssClasses.title}`}>
                {t('resume.courses.title')}
                <div style={styles.sectionTitleAccent}></div>
              </h2>
              
              <div style={styles.cardsList}>
                {data.courses
                  .filter(course => course && course.name)
                  .map((course, index) => (
                    <div 
                      key={index} 
                      style={styles.card} 
                      className={`osaka-card osaka-course-item ${cssClasses.card}`}
                    >
                      <div style={styles.cardHeader}>
                        <h3 style={styles.cardTitle}>{course.name}</h3>
                        {course.date && <div style={styles.cardDateBadge}>{formatDate(course.date)}</div>}
                      </div>
                      
                      {course.institution && <div style={styles.cardSubtitle}>{course.institution}</div>}
                      {course.description && <div style={styles.cardContent}>{course.description}</div>}
                    </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Custom Sections */}
          {hasContent(data.custom_sections, 'title') && 
            data.custom_sections
              .filter(section => section && section.title && (section.content || (section.items && section.items.length > 0)))
              .map((section, sectionIndex) => (
                <div key={`custom-${sectionIndex}`} style={styles.section} className="osaka-section">
                  <h2 style={styles.sectionTitle} className={`osaka-section-title ${cssClasses.title}`}>
                    {section.title || t('resume.custom_sections.title')}
                    <div style={styles.sectionTitleAccent}></div>
                  </h2>
                  
                  <div style={styles.cardsList}>
                    {/* If the section has items array, render them as individual entries */}
                    {section.items && section.items.length > 0 ? (
                      section.items.map((item, itemIndex) => (
                        <div 
                          key={`custom-item-${sectionIndex}-${itemIndex}`} 
                          style={styles.card} 
                          className={`osaka-card osaka-custom-item ${cssClasses.card}`}
                        >
                          <div style={styles.cardHeader}>
                            <h3 style={styles.cardTitle}>{item.title}</h3>
                            {item.date && <div style={styles.cardDateBadge}>{item.date}</div>}
                          </div>
                          
                          {item.subtitle && <div style={styles.cardSubtitle}>{item.subtitle}</div>}
                          {item.content && <div style={styles.cardContent}>{item.content}</div>}
                        </div>
                      ))
                    ) : (
                      // Otherwise just render the section content as a block
                      <div style={styles.card} className={`osaka-card osaka-custom-content ${cssClasses.card}`}>
                        {section.content && <div style={styles.cardContent}>{section.content}</div>}
                      </div>
                    )}
                  </div>
                </div>
              ))
          }
          
          {/* Extra Curricular Activities */}
          {hasContent(data.extracurriculars, 'title') && (
            <div style={styles.section} className="osaka-section">
              <h2 style={styles.sectionTitle} className={`osaka-section-title ${cssClasses.title}`}>
                {t('resume.extracurricular.activity')}
                <div style={styles.sectionTitleAccent}></div>
              </h2>
              
              <div style={styles.cardsList}>
                {data.extracurriculars
                  .filter(activity => activity && activity.title)
                  .map((activity, index) => (
                    <div 
                      key={index} 
                      style={styles.card} 
                      className={`osaka-card osaka-extracurricular-item ${cssClasses.card}`}
                    >
                      <div style={styles.cardHeader}>
                        <h3 style={styles.cardTitle}>{activity.title}</h3>
                      </div>
                      
                      {activity.description && <div style={styles.cardContent}>{activity.description}</div>}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Right Column (Sidebar) */}
        <div style={styles.rightColumn}>
          {/* Personal Information */}
          {hasPersonalDetails() && (
            <div style={styles.sidebarSection} className="osaka-sidebar-section">
              <h3 style={styles.sidebarTitle} className={`osaka-sidebar-title ${cssClasses.title}`}>
                {t('resume.personal_info.title')}
                <div style={styles.sidebarTitleAccent}></div>
              </h3>
              
              <div style={styles.detailsList}>
                {data.personal_info.address && (
                  <div style={styles.detailItem} className="osaka-detail-item">
                    <span style={styles.detailIcon}>🏠</span>
                    <div style={styles.detailContent}>{data.personal_info.address}</div>
                  </div>
                )}
                
                {data.personal_info.postal_code && (
                  <div style={styles.detailItem} className="osaka-detail-item">
                    <span style={styles.detailIcon}>📮</span>
                    <div style={styles.detailContent}>
                      {data.personal_info.postal_code} {data.personal_info.city}
                    </div>
                  </div>
                )}

                {data.personal_info.driving_license && (
                  <div style={styles.detailItem} className="osaka-detail-item">
                    <span style={styles.detailIcon}>🚗</span>
                    <div style={styles.detailContent}>
                      <span style={styles.detailLabel}>{t('resume.personal_info.driving_license')}:</span>
                      {data.personal_info.driving_license}
                    </div>
                  </div>
                )}
                
                {data.personal_info.nationality && (
                  <div style={styles.detailItem} className="osaka-detail-item">
                    <span style={styles.detailIcon}>🌍</span>
                    <div style={styles.detailContent}>
                      <span style={styles.detailLabel}>{t('resume.personal_info.nationality')}:</span>
                      {data.personal_info.nationality}
                    </div>
                  </div>
                )}
                
                {data.personal_info.place_of_birth && (
                  <div style={styles.detailItem} className="osaka-detail-item">
                    <span style={styles.detailIcon}>📍</span>
                    <div style={styles.detailContent}>
                      <span style={styles.detailLabel}>{t('resume.personal_info.place_of_birth')}:</span>
                      {data.personal_info.place_of_birth}
                    </div>
                  </div>
                )}
                
                {data.personal_info.date_of_birth && (
                  <div style={styles.detailItem} className="osaka-detail-item">
                    <span style={styles.detailIcon}>🎂</span>
                    <div style={styles.detailContent}>
                      <span style={styles.detailLabel}>{t('resume.personal_info.date_of_birth')}:</span>
                      {formatDate(data.personal_info.date_of_birth)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Skills */}
          {hasContent(data.skills, 'name') && (
            <div style={styles.sidebarSection} className="osaka-sidebar-section">
              <h3 style={styles.sidebarTitle} className={`osaka-sidebar-title ${cssClasses.title}`}>
                {t('resume.skills.title')}
                <div style={styles.sidebarTitleAccent}></div>
              </h3>
              
              <div style={styles.skillsList}>
                {data.skills
                  .filter(skill => skill && skill.name)
                  .map((skill, index) => (
                    <div key={index} style={styles.skillItem} className="osaka-skill-item">
                      <div style={styles.skillHeader}>
                        <div style={styles.skillName}>{skill.name}</div>
                      </div>
                      
                      {skill.level && !settings.hideSkillLevel && (
                        <div style={styles.skillLevel} className="osaka-skill-level">
                          <div 
                            style={{
                              ...styles.skillLevelBar,
                              width: getSkillLevelWidth(skill.level)
                            }}
                            className={`osaka-skill-level-bar ${cssClasses.skill}`}
                          ></div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
          
          {/* Languages */}
          {hasContent(data.languages, 'language') && (
            <div style={styles.sidebarSection} className="osaka-sidebar-section">
              <h3 style={styles.sidebarTitle} className={`osaka-sidebar-title ${cssClasses.title}`}>
                {t('resume.languages.title')}
                <div style={styles.sidebarTitleAccent}></div>
              </h3>
              
              <div style={styles.languagesList}>
                {data.languages
                  .filter(lang => lang && lang.language)
                  .map((lang, index) => (
                    <div key={index} style={styles.languageItem} className="osaka-language-item">
                      <div style={styles.languageName}>{lang.language}</div>
                      <div style={styles.languageProficiency}>
                        {getProficiencyTranslation(lang.proficiency)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
          
          {/* Hobbies & Interests */}
          {((typeof data.hobbies === 'string' && data.hobbies.trim() !== '') || 
           hasContent(data.hobbies, typeof data.hobbies[0] === 'string' ? null : 'name')) && (
            <div style={styles.sidebarSection} className="osaka-sidebar-section">
              <h3 style={styles.sidebarTitle} className={`osaka-sidebar-title ${cssClasses.title}`}>
                {t('resume.hobbies.title')}
                <div style={styles.sidebarTitleAccent}></div>
              </h3>
              
              {typeof data.hobbies === 'string' ? (
                <p>{data.hobbies}</p>
              ) : (
                <div style={styles.hobbiesList}>
                  {data.hobbies
                    .filter(hobby => hobby && (typeof hobby === 'string' ? hobby : hobby.name))
                    .map((hobby, index) => (
                      <div key={index} style={styles.hobbyItem} className="osaka-hobby-item">
                        {typeof hobby === 'string' ? hobby : hobby.name}
                        <div style={styles.hobbyItemAccent}></div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
          
          {/* References */}
          {hasReferences() && (
            <div style={styles.sidebarSection} className="osaka-sidebar-section">
              <h3 style={styles.sidebarTitle} className={`osaka-sidebar-title ${cssClasses.title}`}>
                {t('resume.references.title')}
                <div style={styles.sidebarTitleAccent}></div>
              </h3>
              
              <div style={styles.referencesList}>
                {data.referrals?.providedOnRequest ? (
                  <div style={{...styles.card, padding: '1rem'}} className="osaka-reference-item">
                    {t('resume.references.provide_upon_request')}
                  </div>
                ) : (
                  <>
                    {Array.isArray(data.referrals) ? (
                      // Direct array of references
                      data.referrals.map((reference, index) => (
                        <div key={index} style={styles.referenceItem} className="osaka-reference-item">
                          <div style={styles.referenceName}>{reference.name}</div>
                          {reference.relation && <div style={styles.referencePosition}>{reference.relation}</div>}
                          
                          {reference.email && (
                            <div style={styles.referenceContact}>
                              ✉️ {reference.email}
                            </div>
                          )}
                          
                          {reference.phone && (
                            <div style={styles.referenceContact}>
                              📱 {reference.phone}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      // References inside a references array
                      data.referrals.references && data.referrals.references.map((reference, index) => (
                        <div key={index} style={styles.referenceItem} className="osaka-reference-item">
                          <div style={styles.referenceName}>{reference.name}</div>
                          {reference.relation && <div style={styles.referencePosition}>{reference.relation}</div>}
                          
                          {reference.email && (
                            <div style={styles.referenceContact}>
                              ✉️ {reference.email}
                            </div>
                          )}
                          
                          {reference.phone && (
                            <div style={styles.referenceContact}>
                              📱 {reference.phone}
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
        </div>
      </div>
      
      {/* Animation styles */}
      <style dangerouslySetInnerHTML={{ __html: `
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
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translate3d(${isRTL ? '30px' : '-30px'}, 0, 0);
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
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        
        .animate-slide-in {
          animation: slideIn 0.5s ease-out forwards;
        }
        
        .animate-grow-width {
          animation: growWidth 1s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        
        .osaka-card {
          animation: fadeInUp 0.6s ease-out forwards;
          animation-delay: var(--delay, 0s);
        }
        
        .osaka-section-title, .osaka-sidebar-title {
          animation: slideIn 0.5s ease-out forwards;
        }
        
        .osaka-skill-level-bar {
          animation: growWidth 1s ease-out forwards;
          animation-delay: 0.3s;
        }
        
        .osaka-profile-image {
          animation: fadeIn 1s ease-out forwards;
        }
        
        /* RTL-specific overrides */
        [dir="rtl"] .osaka-contact-item,
        [dir="rtl"] .osaka-detail-item {
          flex-direction: row-reverse;
        }
        
        [dir="rtl"] .osaka-contact-icon {
          margin-right: 0;
          margin-left: 0.5rem;
        }
        
        [dir="rtl"] .osaka-detail-icon {
          margin-right: 0;
          margin-left: 0.7rem;
        }
        
        [dir="rtl"] .osaka-title {
          border-left: none;
          border-right: 3px solid;
          padding-right: 1rem;
          padding-left: 0;
        }
        
        [dir="rtl"] .osaka-section-title-accent,
        [dir="rtl"] .osaka-sidebar-title-accent {
          left: auto;
          right: 0;
        }
        
        [dir="rtl"] .osaka-card-with-accent {
          border-left: none !important;
          border-right: 3px solid ${settings.accentColor} !important;
        }
        
        [dir="rtl"] .osaka-summary-background {
          left: auto;
          right: 0;
        }
        
        [dir="rtl"] .osaka-header-background {
          right: auto;
          left: 0;
          clip-path: polygon(calc(100% - 120px) 0, 0 0, 0 100%, 100% 100%);
        }
        
        [dir="rtl"] .osaka-profile-container {
          right: auto;
          left: 3rem;
        }
        
        @media print {
          .osaka-card, .osaka-section-title, .osaka-sidebar-title, .osaka-skill-level-bar, .osaka-profile-image {
            animation: none !important;
          }
          
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .osaka-card {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          
          .osaka-section, .osaka-sidebar-section {
            page-break-inside: avoid-page !important;
            break-inside: avoid-page !important;
          }
          
          p {
            orphans: 2 !important;
            widows: 2 !important;
          }
        }
      `}} />
    </div>
  );
};

export default Osaka;