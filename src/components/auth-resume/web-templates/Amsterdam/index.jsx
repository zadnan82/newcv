import React, { useEffect } from 'react';
import { getAmsterdamStyles } from './AmsterdamStyles';
import { useTranslation } from 'react-i18next';

const Amsterdam = ({ formData, customSettings, darkMode, isPdfMode = false }) => {
  const { t } = useTranslation();
 
  // Create a normalized version of the data with consistent property names
  // but preserve the original translation references
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
   
  // Default custom settings
  const settings = {
    accentColor: customSettings?.accentColor || '#2563eb', // More vibrant default accent color
    fontFamily: customSettings?.fontFamily || 'Inter, Roboto, Helvetica, Arial, sans-serif',
    lineSpacing: customSettings?.lineSpacing || 1.6,
    headingsUppercase: customSettings?.headingsUppercase || false,
    hideSkillLevel: customSettings?.hideSkillLevel || false
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

  // Get the styles specific to this template with PDF mode
  const styles = getAmsterdamStyles(darkMode, settings, isPdfMode);

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
 
  // Add decorative circles to header
  useEffect(() => {
    // Only add decorative elements when not in PDF mode
    if (!isPdfMode && typeof document !== 'undefined') {
      const header = document.querySelector('.amsterdam-header');
      
      if (header) {
        // Remove any existing decorative elements
        const existingCircles = header.querySelectorAll('.decorative-circle');
        existingCircles.forEach(circle => circle.remove());
        
        // Add new decorative circles
        const circleCount = 5;
        for (let i = 0; i < circleCount; i++) {
          const circle = document.createElement('div');
          circle.className = 'decorative-circle';
          
          // Random size between 30px and 120px
          const size = Math.floor(Math.random() * 90 + 30);
          circle.style.width = `${size}px`;
          circle.style.height = `${size}px`;
          
          // Random position within the header
          const topPos = Math.floor(Math.random() * 100);
          const leftPos = Math.floor(Math.random() * 100);
          circle.style.top = `${topPos}%`;
          circle.style.left = `${leftPos}%`;
          
          // Semi-transparent white
          circle.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          circle.style.position = 'absolute';
          circle.style.borderRadius = '50%';
          circle.style.zIndex = '1';
          
          header.appendChild(circle);
        }
      }
    }
    
    return () => {
      // Cleanup function to remove decorative elements when component unmounts
      if (typeof document !== 'undefined') {
        const existingCircles = document.querySelectorAll('.decorative-circle');
        existingCircles.forEach(circle => circle.remove());
      }
    };
  }, [isPdfMode]);

  // Enhanced Tailwind classes with animation support
  const enhancedClasses = isPdfMode ? {
    // PDF-specific classes
    container: "print:bg-white print:shadow-none",
    header: "print:py-3",
    section: "print:break-inside-avoid",
    expItem: "print:break-inside-avoid print:border print:border-gray-200 print:shadow-none",
    sectionTitle: "print:break-after-avoid",
    sidebar: "print:bg-gray-100"
  } : {
    // Interactive UI classes
    container: "transition-all duration-300 ease-in-out",
    header: "transition-all duration-300 ease-in-out",
    section: "transition-all duration-300 ease-in-out",
    expItem: "transition-all duration-300 hover:translate-y-[-4px] hover:shadow-lg",
    sectionTitle: "relative transition-all duration-300 ease-in-out",
    sidebar: "transition-all duration-300 ease-in-out",
    skillBar: "transition-all duration-500 ease-out",
    hobbyItem: "transition-all duration-300 hover:scale-105 hover:shadow-md",
    contactItem: "transition-all duration-300 hover:bg-opacity-30 hover:translate-y-[-2px]"
  };

  // Enhanced animation timing for staggered entrance
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

  return (
    <div style={styles.container} className={`amsterdam-template ${enhancedClasses.container}`}>
      {/* Modern header with profile info and contact details */}
      <header style={styles.header} className={`amsterdam-header ${enhancedClasses.header}`}>
        {/* Asymmetric left section with profile image */}
        <div style={styles.headerLeft}>
          {/* Profile image with modern hover effect */}
          <div style={styles.profileImageContainer}>
            <img 
              src={profileImage}
              alt={data.personal_info.full_name} 
              style={styles.profileImage} 
              className="profile-image"
            />
          </div>
        </div>

        {/* Right content area with name and contact details */}
        <div style={styles.headerContent}>
          <h1 style={styles.name}>{data.personal_info.full_name}</h1>
          <div style={styles.title}>{data.personal_info.title}</div>
          
          {/* Modern contact information grid */}
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
          </div>
        </div>
      </header>

      {/* Modern two-column layout */}
      <div style={styles.contentLayout}>
        {/* Main column (left) */}
        <div style={styles.mainColumn} className="amsterdam-main-column">
          {/* Professional Summary with enhanced styling */}
          {data.personal_info.summary && (
            <div 
              style={styles.section} 
              className={`amsterdam-summary-section ${enhancedClasses.section}`}
            >
              <h2 
                style={styles.sectionTitle} 
                className={`amsterdam-section-title ${enhancedClasses.sectionTitle}`} 
                data-section="summary"
              >
                {t('resume.personal_info.summary')}
              </h2>
              <div style={styles.sectionContent}>
                <p style={styles.summary}>{data.personal_info.summary}</p>
              </div>
            </div>
          )}

          {/* Work Experience with modern styling and animations */}
          {hasExperiences() && (
            <div 
              style={styles.section} 
              className={`amsterdam-experience-section ${enhancedClasses.section}`}
            >
              <h2 
                style={styles.sectionTitle} 
                className={`amsterdam-section-title ${enhancedClasses.sectionTitle}`} 
                data-section="experience"
              >
                {t('resume.experience.title')}
              </h2>
              <div style={styles.sectionContent}>
                {data.experiences
                  .filter(exp => exp && exp.company)
                  .map((exp, index) => (
                    <div 
                      key={index} 
                      style={{
                        ...styles.expItem,
                        animationDelay: !isPdfMode ? getAnimationDelay(index) : '0s'
                      }} 
                      className={`amsterdam-exp-item ${enhancedClasses.expItem}`}
                    >
                      <div style={styles.expHeader}>
                        <div style={styles.expTitle}>{exp.position}</div>
                        <div style={styles.expDate}>
                          {formatDate(exp.start_date)} - {exp.current ? t('resume.experience.current_work') : formatDate(exp.end_date)}
                        </div>
                      </div>

                      <div style={styles.expItemSecond}>
                        <div style={styles.expCompany}>{exp.company}</div>
                        {exp.location && <div style={styles.expLocation}>{exp.location}</div>}
                      </div>
                      {exp.description && <div style={styles.expDescription}>{exp.description}</div>}
                    </div>
                ))}
              </div>
            </div>
          )}

          {/* Education with enhanced styling */}
          {hasEducation() && (
            <div 
              style={styles.section} 
              className={`amsterdam-education-section ${enhancedClasses.section}`}
            >
              <h2 
                style={styles.sectionTitle} 
                className={`amsterdam-section-title ${enhancedClasses.sectionTitle}`} 
                data-section="education"
              >
                {t('resume.education.title')}
              </h2>
              <div style={styles.sectionContent}>
                {data.educations
                  .filter(edu => edu && edu.institution)
                  .map((edu, index) => (
                    <div 
                      key={index} 
                      style={{
                        ...styles.expItem,
                        animationDelay: !isPdfMode ? getAnimationDelay(index) : '0s'
                      }} 
                      className={`amsterdam-edu-item ${enhancedClasses.expItem}`}
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

          {/* Internships with modern styling */}
          {hasInternships() && (
            <div 
              style={styles.section} 
              className={`amsterdam-internships-section ${enhancedClasses.section}`}
            >
              <h2 
                style={styles.sectionTitle} 
                className={`amsterdam-section-title ${enhancedClasses.sectionTitle}`} 
                data-section="internships"
              >
                {t('resume.internships.title')}
              </h2>
              <div style={styles.sectionContent}>
                {data.internships
                  .filter(internship => internship && internship.company)
                  .map((internship, index) => (
                    <div 
                      key={index} 
                      style={{
                        ...styles.expItem,
                        animationDelay: !isPdfMode ? getAnimationDelay(index) : '0s'
                      }} 
                      className={`amsterdam-internship-item ${enhancedClasses.expItem}`}
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

          {/* Courses & Certifications with modern styling */}
          {hasCourses() && (
            <div 
              style={styles.section} 
              className={`amsterdam-courses-section ${enhancedClasses.section}`}
            >
              <h2 
                style={styles.sectionTitle} 
                className={`amsterdam-section-title ${enhancedClasses.sectionTitle}`} 
                data-section="courses"
              >
                {t('resume.courses.title')}
              </h2>
              <div style={styles.sectionContent}>
                {data.courses
                  .filter(course => course && course.name)
                  .map((course, index) => (
                    <div 
                      key={index} 
                      style={{
                        ...styles.expItem,
                        animationDelay: !isPdfMode ? getAnimationDelay(index) : '0s'
                      }} 
                      className={`amsterdam-course-item ${enhancedClasses.expItem}`}
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

          {/* Custom Sections with modern styling */}
          {hasCustomSections() && 
            data.custom_sections
              .filter(section => section && section.title && (section.content || (section.items && section.items.length > 0)))
              .map((section, sectionIndex) => (
                <div 
                  key={`custom-${sectionIndex}`} 
                  style={styles.section} 
                  className={`amsterdam-custom-section ${enhancedClasses.section}`}
                >
                  <h2 
                    style={styles.sectionTitle} 
                    className={`amsterdam-section-title ${enhancedClasses.sectionTitle}`} 
                    data-section={`custom-${sectionIndex}`}
                  >
                    {section.title || t('resume.custom_sections.title')}
                  </h2>
                  <div style={styles.sectionContent}>
                    {/* If the section has items array, render them as individual entries */}
                    {section.items && section.items.length > 0 ? (
                      section.items.map((item, itemIndex) => (
                        <div 
                          key={`custom-item-${sectionIndex}-${itemIndex}`} 
                          style={{
                            ...styles.expItem,
                            animationDelay: !isPdfMode ? getAnimationDelay(itemIndex) : '0s'
                          }} 
                          className={`amsterdam-custom-item ${enhancedClasses.expItem}`}
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
                        className={`amsterdam-custom-content ${enhancedClasses.expItem}`}
                      >
                        {section.content && <div style={styles.expDescription}>{section.content}</div>}
                      </div>
                    )}
                  </div>
                </div>
              ))
          }

          {/* Extra Curricular Activities with modern styling */}
          {hasExtracurriculars() && (
            <div 
              style={styles.section} 
              className={`amsterdam-extracurriculars-section ${enhancedClasses.section}`}
            >
              <h2 
                style={styles.sectionTitle} 
                className={`amsterdam-section-title ${enhancedClasses.sectionTitle}`} 
                data-section="extracurriculars"
              >
                {t('resume.extracurricular.activity')}
              </h2>
              <div style={styles.sectionContent}>
                {data.extracurriculars.map((activity, index) => (
                  <div 
                    key={index} 
                    style={{
                      ...styles.expItem,
                      animationDelay: !isPdfMode ? getAnimationDelay(index) : '0s'
                    }} 
                    className={`amsterdam-extracurricular-item ${enhancedClasses.expItem}`}
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

        {/* Enhanced sidebar (right column) */}
        <div style={styles.sidebar} className={`amsterdam-sidebar ${enhancedClasses.sidebar}`}>
          {/* Personal Information with modern layout */}
          {hasPersonalDetails() && (
            <div 
              style={styles.sidebarSection} 
              className={`amsterdam-personal-details-section ${enhancedClasses.section}`}
            >
              <h2 
                style={styles.sidebarSectionTitle} 
                className={`amsterdam-sidebar-title ${enhancedClasses.sectionTitle}`} 
                data-section="personal-details"
              >
                {t('resume.personal_info.title')}
              </h2>
              <div style={styles.personalDetails}>
                {data.personal_info.address && (
                  <div style={styles.personalDetailItem} className="transition-all duration-300 hover:translate-x-1">
                    <span style={styles.contactIcon}>🏠</span>
                    <span>{data.personal_info.address}</span>
                  </div>
                )}
                {data.personal_info.postal_code && (
                  <div style={styles.personalDetailItem} className="transition-all duration-300 hover:translate-x-1">
                    <span style={styles.contactIcon}>📮</span>
                    <span>{data.personal_info.postal_code} {data.personal_info.city}</span>
                  </div>
                )}

                {data.personal_info.driving_license && (
                  <div style={styles.personalDetailItem} className="transition-all duration-300 hover:translate-x-1">
                    <span style={styles.contactIcon}>🚗</span>
                    <span>{t('resume.personal_info.driving_license')}: {data.personal_info.driving_license}</span>
                  </div>
                )}
                {data.personal_info.nationality && (
                  <div style={styles.personalDetailItem} className="transition-all duration-300 hover:translate-x-1">
                    <span style={styles.contactIcon}>🌍</span>
                    <span>{t('resume.personal_info.nationality')}: {data.personal_info.nationality}</span>
                  </div>
                )}
                {data.personal_info.place_of_birth && (
                  <div style={styles.personalDetailItem} className="transition-all duration-300 hover:translate-x-1">
                    <span style={styles.contactIcon}>📍</span>
                    <span>{t('resume.personal_info.place_of_birth')}: {data.personal_info.place_of_birth}</span>
                  </div>
                )}
                {data.personal_info.date_of_birth && (
                  <div style={styles.personalDetailItem} className="transition-all duration-300 hover:translate-x-1">
                    <span style={styles.contactIcon}>🎂</span>
                    <span>{t('resume.personal_info.date_of_birth')}: {formatDate(data.personal_info.date_of_birth)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* References with modern styling */}
          {hasReferences() && (
            <div 
              style={styles.sidebarSection} 
              className={`amsterdam-referrals-section ${enhancedClasses.section}`}
            >
              <h2 
                style={styles.sidebarSectionTitle} 
                className={`amsterdam-sidebar-title ${enhancedClasses.sectionTitle}`} 
                data-section="referrals"
              >
                {t('resume.references.title')}
              </h2>
              <div style={styles.referralsGrid}>
                {data.referrals?.providedOnRequest ? (
                  <div 
                    style={styles.referralItem} 
                    className="transition-all duration-300 hover:shadow-md"
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
                      className="transition-all duration-300 hover:translate-y-[-3px] hover:shadow-md"
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

          {/* Skills with enhanced visualization */}
          {hasSkills() && (
            <div 
              style={styles.sidebarSection} 
              className={`amsterdam-skills-section ${enhancedClasses.section}`}
            >
              <h2 
                style={styles.sidebarSectionTitle} 
                className={`amsterdam-sidebar-title ${enhancedClasses.sectionTitle}`} 
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

          {/* Languages with enhanced styling */}
          {hasLanguages() && (
            <div 
              style={styles.sidebarSection} 
              className={`amsterdam-languages-section ${enhancedClasses.section}`}
            >
              <h2 
                style={styles.sidebarSectionTitle} 
                className={`amsterdam-sidebar-title ${enhancedClasses.sectionTitle}`} 
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
                    className="transition-all duration-300 hover:translate-x-1"
                  >
                    <div style={styles.languageName}>{lang.name}</div>
                    <div style={styles.languageProficiency}>{getProficiencyTranslation(lang.level, t)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hobbies & Interests with modern styling */}
          {hasHobbies() && (
            <div 
              style={styles.sidebarSection} 
              className={`amsterdam-hobbies-section ${enhancedClasses.section}`}
            >
              <h2 
                style={styles.sidebarSectionTitle} 
                className={`amsterdam-sidebar-title ${enhancedClasses.sectionTitle}`} 
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
          
          @keyframes fadeInRight {
            from {
              opacity: 0;
              transform: translate3d(-20px, 0, 0);
            }
            to {
              opacity: 1;
              transform: translate3d(0, 0, 0);
            }
          }
          
          @keyframes slideInLeft {
            from {
              transform: translate3d(-40px, 0, 0);
              opacity: 0;
            }
            to {
              transform: translate3d(0, 0, 0);
              opacity: 1;
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
          
          .amsterdam-exp-item, .amsterdam-edu-item, .amsterdam-internship-item, .amsterdam-course-item, .amsterdam-custom-item {
            animation: fadeInUp 0.6s ease-out both;
            animation-delay: var(--delay, 0s);
          }
          
          .amsterdam-section-title, .amsterdam-sidebar-title {
            animation: slideInLeft 0.5s ease-out both;
          }
          
          .profile-image {
            animation: pulse 2s ease-in-out infinite;
          }
          
          .amsterdam-skill-level-bar {
            animation: growWidth 1s ease-out forwards;
          }
          
          .amsterdam-hobby-item {
            animation: fadeInRight 0.5s ease-out both;
            animation-delay: var(--delay, 0s);
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
            
            .amsterdam-exp-item, .amsterdam-edu-item, .amsterdam-internship-item, .amsterdam-course-item, .amsterdam-custom-item {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              animation: none !important;
            }
            
            .amsterdam-section-title, .amsterdam-sidebar-title {
              page-break-after: avoid !important;
              break-after: avoid !important;
              animation: none !important;
            }
            
            .profile-image {
              animation: none !important;
            }
            
            .amsterdam-skill-level-bar {
              animation: none !important;
            }
            
            p, li {
              orphans: 2 !important;
              widows: 2 !important;
            }
            
            * {
              transition: none !important;
            }
          }
        `}} />
      </div>
    );
  };
  
  // Enhanced skill level function with smoother gradient
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
      // Added more granular levels for better flexibility
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
  
  // Enhanced proficiency translation with more descriptive language
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
  
  export default Amsterdam;