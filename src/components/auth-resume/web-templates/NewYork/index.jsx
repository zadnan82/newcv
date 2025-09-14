import React from 'react';
import { getNewYorkStyles } from './NewYorkStyles';
import { useTranslation } from 'react-i18next';

/**
 * New York Template Implementation
 * Modern, fashion-forward design with professional layout
 * Enhanced with PDF support and proper custom settings application
 */
const NewYork = ({ formData, customSettings, darkMode, isPdfMode = false }) => {
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
      address: t('resume.personal_info.address_placeholder'),
      postal_code: t('resume.personal_info.postal_code_placeholder'),
      driving_license: t('resume.personal_info.driving_license_placeholder'),
      nationality: t('resume.personal_info.nationality_placeholder'),
      place_of_birth: t('resume.personal_info.place_of_birth_placeholder'),
      date_of_birth: t('resume.personal_info.date_of_birth_placeholder'),
      linkedin: t('resume.personal_info.linkedin_placeholder'),
      website: t('resume.personal_info.website_placeholder'),
      summary: t('resume.personal_info.summary_placeholder')
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
    referrals: formData.referrals || { providedOnRequest: true }
  };

  // Default custom settings - with proper fallbacks
  const settings = {
    primaryColor: customSettings?.primaryColor || '#3a506b', // Deep blue
    accentColor: customSettings?.accentColor || '#e63946', // Vibrant red
    secondaryColor: customSettings?.secondaryColor || '#1D3557', // Dark navy
    backgroundColor: customSettings?.backgroundColor || '#ffffff',
    sidebarColor: customSettings?.sidebarColor || '#f1faee', // Light mint
    sidebarTextColor: customSettings?.sidebarTextColor || '#1D3557', // Dark navy
    fontFamily: customSettings?.fontFamily || "'Montserrat', 'Helvetica', sans-serif",
    headingFontFamily: customSettings?.headingFontFamily || "'Playfair Display', 'Georgia', serif",
    lineSpacing: customSettings?.lineSpacing || 1.6,
    headingsUppercase: customSettings?.headingsUppercase || false,
    hideSkillLevel: customSettings?.hideSkillLevel || false
  };

  // Get NewYork styles with proper parameter passing
  const styles = getNewYorkStyles(darkMode, settings, isPdfMode);


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
  // Format date helper
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

  // Helper function to convert skill level to percentage width
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

  // Generate language proficiency dots
  const renderLanguageProficiency = (proficiency) => {
    const levels = {
      'Native': 5,
      'Fluent': 5,
      'Proficient': 4,
      'Advanced': 4,
      'Intermediate': 3,
      'Conversational': 3,
      'Elementary': 2,
      'Basic': 1,
      'Beginner': 1
    };
    
    const level = levels[proficiency] || 3;
    const dots = [];
    
    for (let i = 0; i < 5; i++) {
      dots.push(
        <div 
          key={i} 
          style={i < level ? styles.languageDotFilled : styles.languageDotEmpty}
        ></div>
      );
    }
    
    return (
      <div style={styles.languageDots}>
        {dots}
      </div>
    );
  };

  // Helper function to get the translated proficiency level
  const getProficiencyTranslation = (proficiency) => {
    const proficiencies = {
      'Native': t('resume.languages.levels.native'),
      'Fluent': t('resume.languages.levels.fluent'),
      'Advanced': t('resume.languages.levels.advanced'),
      'Intermediate': t('resume.languages.levels.intermediate'),
      'Beginner': t('resume.languages.levels.beginner')
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

  // PDF-specific classes
  const pdfClasses = isPdfMode ? {
    container: "print:bg-white print:shadow-none",
    section: "print:break-inside-avoid",
    item: "print:break-inside-avoid",
    title: "print:break-after-avoid",
    sidebar: "print:bg-gray-100"
  } : {
    container: "",
    section: "",
    item: "",
    title: "",
    sidebar: ""
  };

  return (
    <div style={styles.container} className={`newyork-template ${pdfClasses.container}`}>
      {/* Header Section with Name & Title Bar */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.headerContent}>
            <h1 style={styles.name}>{data.personal_info.full_name}</h1>
            <div style={styles.titleBar}>
              <span style={styles.titleText}>{data.personal_info.title}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Contact Section */}
      <div style={styles.contactSection}>
        <div style={styles.contactGrid}>
          {data.personal_info.mobile && (
            <div style={styles.contactItem}>
              <span style={styles.contactIcon}>📱</span>
              <span style={styles.contactText}>{data.personal_info.mobile}</span>
            </div>
          )}
          {data.personal_info.email && (
            <div style={styles.contactItem}>
              <span style={styles.contactIcon}>✉️</span>
              <span style={styles.contactText}>{data.personal_info.email}</span>
            </div>
          )}
          {data.personal_info.address && (
            <div style={styles.contactItem}>
              <span style={styles.contactIcon}>📍</span>
              <span style={styles.contactText}>
                {data.personal_info.address}
                {data.personal_info.city && `, ${data.personal_info.city}`}
                {data.personal_info.postal_code && `, ${data.personal_info.postal_code}`}
              </span>
            </div>
          )}
          {(data.personal_info.linkedin || data.personal_info.website) && (
            <div style={styles.contactItem}>
              <span style={styles.contactIcon}>🔗</span>
              <span style={styles.contactText}>
                {data.personal_info.linkedin && data.personal_info.linkedin}
                {data.personal_info.linkedin && data.personal_info.website && ' | '}
                {data.personal_info.website && data.personal_info.website}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Grid Layout */}
      <div style={styles.mainGrid}>
        {/* Left Column - Main Content */}
        <div style={styles.mainColumn}>
          {/* Profile/Summary Section */}
          {data.personal_info.summary && (
            <div style={styles.section} className={pdfClasses.section}>
              <h2 style={styles.sectionTitle} className={pdfClasses.title} data-section="summary">
                {settings.headingsUppercase ? t('resume.personal_info.summary').toUpperCase() : t('resume.personal_info.summary')}
              </h2>
              <div style={styles.summaryText}>{data.personal_info.summary}</div>
            </div>
          )}

          {/* Experience Section */}
          {hasExperiences() && (
            <div style={styles.section} className={pdfClasses.section}>
              <h2 style={styles.sectionTitle} className={pdfClasses.title} data-section="experience">
                {settings.headingsUppercase ? t('resume.experience.title').toUpperCase() : t('resume.experience.title')}
              </h2>
              
              {data.experiences.map((exp, index) => (
                <div key={index} style={styles.experienceItem} className={pdfClasses.item}>
                  <div style={styles.timelinePoint}></div>
                  <div style={styles.itemContent}>
                    <div style={styles.itemHeader}>
                      <h3 style={styles.itemTitle}>{exp.position}</h3>
                      <div style={styles.itemDate}>
                        {formatDate(exp.start_date)} - {exp.current ? t('resume.experience.current_work') : formatDate(exp.end_date)}
                      </div>
                    </div>
                    <div style={styles.itemSubtitle}>
                      <span style={styles.companyName}>{exp.company}</span>
                      {exp.location && <span style={styles.locationText}> • {exp.location}</span>}
                    </div>
                    {exp.description && (
                      <div style={styles.itemDescription}>{exp.description}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Education Section */}
          {hasEducation() && (
            <div style={styles.section} className={pdfClasses.section}>
              <h2 style={styles.sectionTitle} className={pdfClasses.title} data-section="education">
                {settings.headingsUppercase ? t('resume.education.title').toUpperCase() : t('resume.education.title')}
              </h2>
              
              {data.educations.map((edu, index) => (
                <div key={index} style={styles.educationItem} className={pdfClasses.item}>
                  <div style={styles.timelinePoint}></div>
                  <div style={styles.itemContent}>
                    <div style={styles.itemHeader}>
                      <h3 style={styles.itemTitle}>
                        {edu.degree}{edu.field_of_study ? ` ${t('common.in')} ${edu.field_of_study}` : ''}
                      </h3>
                      <div style={styles.itemDate}>
                        {formatDate(edu.start_date)} - {edu.current ? t('resume.education.currently_studying') : formatDate(edu.end_date)}
                      </div>
                    </div>
                    <div style={styles.itemSubtitle}>
                      <span style={styles.companyName}>{edu.institution}</span>
                      {edu.location && <span style={styles.locationText}> • {edu.location}</span>}
                    </div>
                    {edu.gpa && (
                      <div style={styles.itemDescription}>
                        <span style={styles.gpaLabel}>{t('resume.education.gpa')}:</span> {edu.gpa}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Internships Section */}
          {hasInternships() && (
            <div style={styles.section} className={pdfClasses.section}>
              <h2 style={styles.sectionTitle} className={pdfClasses.title} data-section="internships">
                {settings.headingsUppercase ? t('resume.internships.title').toUpperCase() : t('resume.internships.title')}
              </h2>
              
              {data.internships.map((internship, index) => (
                <div key={index} style={styles.internshipItem} className={pdfClasses.item}>
                  <div style={styles.timelinePoint}></div>
                  <div style={styles.itemContent}>
                    <div style={styles.itemHeader}>
                      <h3 style={styles.itemTitle}>{internship.position}</h3>
                      <div style={styles.itemDate}>
                        {formatDate(internship.start_date)} - {internship.current ? t('resume.internships.current_work') : formatDate(internship.end_date)}
                      </div>
                    </div>
                    <div style={styles.itemSubtitle}>
                      <span style={styles.companyName}>{internship.company}</span>
                      {internship.location && <span style={styles.locationText}> • {internship.location}</span>}
                    </div>
                    {internship.description && (
                      <div style={styles.itemDescription}>{internship.description}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Extracurricular Activities */}
          {hasExtracurriculars() && (
            <div style={styles.section} className={pdfClasses.section}>
              <h2 style={styles.sectionTitle} className={pdfClasses.title} data-section="extracurriculars">
                {settings.headingsUppercase ? t('resume.extracurricular.activity').toUpperCase() : t('resume.extracurricular.activity')}
              </h2>
              
              {data.extracurriculars.map((activity, index) => (
                <div key={index} style={styles.extracurricularItem} className={pdfClasses.item}>
                  <div style={styles.timelinePoint}></div>
                  <div style={styles.itemContent}>
                    <h3 style={styles.itemTitle}>{activity.title}</h3>
                    {activity.description && (
                      <div style={styles.itemDescription}>{activity.description}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Custom Sections */}
          {hasCustomSections() &&
            data.custom_sections.map((section, sectionIndex) => (
              <div key={`custom-${sectionIndex}`} style={styles.section} className={pdfClasses.section}>
                <h2 style={styles.sectionTitle} className={pdfClasses.title} data-section={`custom-${sectionIndex}`}>
                  {settings.headingsUppercase ? (section.title || t('resume.custom_sections.title')).toUpperCase() : (section.title || t('resume.custom_sections.title'))}
                </h2>
                
                {section.items && section.items.length > 0 ? (
                  section.items.map((item, itemIndex) => (
                    <div key={`custom-item-${sectionIndex}-${itemIndex}`} style={styles.customItem} className={pdfClasses.item}>
                      <div style={styles.timelinePoint}></div>
                      <div style={styles.itemContent}>
                        <div style={styles.itemHeader}>
                          <h3 style={styles.itemTitle}>{item.title}</h3>
                          {item.date && (
                            <div style={styles.itemDate}>{item.date}</div>
                          )}
                        </div>
                        {item.subtitle && (
                          <div style={styles.itemSubtitle}>{item.subtitle}</div>
                        )}
                        {item.content && (
                          <div style={styles.itemDescription}>{item.content}</div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={styles.itemDescription}>{section.content}</div>
                )}
              </div>
            ))
          }
        </div>

        {/* Right Column - Sidebar */}
        <div style={styles.sidebar} className={`${pdfClasses.sidebar}`}>
          {/* Personal Details Section */}
          {hasPersonalDetails() && (
            <div style={styles.sidebarSection} className={pdfClasses.section}>
              <h2 style={styles.sidebarSectionTitle} className={pdfClasses.title} data-section="personal-details">
                {settings.headingsUppercase ? t('resume.personal_info.title').toUpperCase() : t('resume.personal_info.title')}
              </h2>
              <div style={styles.personalDetails}>
                {data.personal_info.nationality && (
                  <div style={styles.personalDetailItem}>
                    <span style={styles.contactIcon}>🌍</span>
                    <span>{t('resume.personal_info.nationality')}: {data.personal_info.nationality}</span>
                  </div>
                )}
                
                {data.personal_info.date_of_birth && (
                  <div style={styles.personalDetailItem}>
                    <span style={styles.contactIcon}>🎂</span>
                    <span>{t('resume.personal_info.date_of_birth')}: {formatDate(data.personal_info.date_of_birth)}</span>
                  </div>
                )}
                
                {data.personal_info.place_of_birth && (
                  <div style={styles.personalDetailItem}>
                    <span style={styles.contactIcon}>📍</span>
                    <span>{t('resume.personal_info.place_of_birth')}: {data.personal_info.place_of_birth}</span>
                  </div>
                )}
                
                {data.personal_info.driving_license && (
                  <div style={styles.personalDetailItem}>
                    <span style={styles.contactIcon}>🚗</span>
                    <span>{t('resume.personal_info.driving_license')}: {data.personal_info.driving_license}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Skills Section */}
          {hasSkills() && (
            <div style={styles.sidebarSection} className={pdfClasses.section}>
              <h2 style={styles.sidebarSectionTitle} className={pdfClasses.title} data-section="skills">
                {settings.headingsUppercase ? t('resume.skills.title').toUpperCase() : t('resume.skills.title')}
              </h2>
              <div style={styles.skillsGrid}>
                {data.skills.map((skill, index) => (
                  <div key={index} style={styles.skillItem}>
                    <div style={styles.skillHeader}>
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
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Languages Section */}
          {hasLanguages() && (
            <div style={styles.sidebarSection} className={pdfClasses.section}>
              <h2 style={styles.sidebarSectionTitle} className={pdfClasses.title} data-section="languages">
                {settings.headingsUppercase ? t('resume.languages.title').toUpperCase() : t('resume.languages.title')}
              </h2>
              <div style={styles.languagesGrid}>
                {data.languages.map((language, index) => (
                  <div key={index} style={styles.languageItem}>
                    <div style={styles.languageName}>{language.name}</div>
                    <div style={styles.languageProficiency}>
                      {getProficiencyTranslation(language.level)}
                    </div>
                    {renderLanguageProficiency(language.level)}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Courses & Certifications */}
          {hasCourses() && (
            <div style={styles.sidebarSection} className={pdfClasses.section}>
              <h2 style={styles.sidebarSectionTitle} className={pdfClasses.title} data-section="courses">
                {settings.headingsUppercase ? t('resume.courses.title').toUpperCase() : t('resume.courses.title')}
              </h2>
              <div style={styles.coursesGrid}>
                {data.courses.map((course, index) => (
                  <div key={index} style={styles.courseItem}>
                    <div style={styles.courseName}>{course.name}</div>
                    {course.institution && (
                      <div style={styles.courseInstitution}>{course.institution}</div>
                    )}
                    {course.date && (
                      <div style={styles.courseDate}>{formatDate(course.date)}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Hobbies Section */}
          {hasHobbies() && (
            <div style={styles.sidebarSection} className={pdfClasses.section}>
              <h2 style={styles.sidebarSectionTitle} className={pdfClasses.title} data-section="hobbies">
                {settings.headingsUppercase ? t('resume.hobbies.title').toUpperCase() : t('resume.hobbies.title')}
              </h2>
              
              {typeof data.hobbies === 'string' ? (
                <div style={styles.hobbyText}>{data.hobbies}</div>
              ) : (
                <div style={styles.hobbiesGrid}>
                  {data.hobbies
                    .filter(hobby => hobby && (typeof hobby === 'string' ? hobby : hobby.name))
                    .map((hobby, index) => (
                      <div key={index} style={styles.hobbyItem}>
                        {typeof hobby === 'string' ? hobby : hobby.name}
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
          
          {/* References */}
          {hasReferences() && (
            <div style={styles.sidebarSection} className={pdfClasses.section}>
              <h2 style={styles.sidebarSectionTitle} className={pdfClasses.title} data-section="referrals">
                {settings.headingsUppercase ? t('resume.references.title').toUpperCase() : t('resume.references.title')}
              </h2>
              
              {data.referrals.providedOnRequest ? (
                <div style={styles.referenceText}>{t('resume.references.provide_upon_request')}</div>
              ) : (
                <div style={styles.referencesGrid}>
                  {Array.isArray(data.referrals) && data.referrals.map((reference, index) => (
                    <div key={index} style={styles.referenceItem}>
                      <div style={styles.referenceName}>{reference.name}</div>
                      {reference.relation && (
                        <div style={styles.referencePosition}>{reference.relation}</div>
                      )}
                      <div style={styles.referenceContact}>
                        {reference.email && <div>{reference.email}</div>}
                        {reference.phone && <div>{reference.phone}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* PDF Print Styles */}
      {isPdfMode && (
        <style dangerouslySetInnerHTML={{ __html: `
          @page {
            size: A4;
            margin: 0;
          }
          @media print {
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .newyork-template {
              width: 100%;
              max-width: 100%;
              padding: 0;
              margin: 0;
            }
            .section, .sidebarSection {
              page-break-inside: avoid;
              break-inside: avoid;
            }
            .item {
              page-break-inside: avoid;
              break-inside: avoid;
            }
            .sectionTitle, .sidebarTitle {
              page-break-after: avoid;
              break-after: avoid;
            }
            p, li {
              orphans: 2 !important;
              widows: 2 !important;
            }
          }
        `}} />
      )}
    </div>
  );
};

export default NewYork;