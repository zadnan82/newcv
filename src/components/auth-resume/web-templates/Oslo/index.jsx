import React from 'react';
import { getOsloStyles } from './OsloStyles';
import { useTranslation } from 'react-i18next';

/**
 * Oslo Template Implementation
 * Classical corporate design with full-width header and clear section demarcation
 * Enhanced with PDF support using inline styles and Tailwind classes
 */
const Oslo = ({ formData, customSettings, darkMode, isPdfMode = false }) => {
  const { t } = useTranslation();
  
  // Create a normalized version of the data with consistent property names
  const data = {
    ...formData,
    personal_info: formData?.personal_info || {
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
      profile_image: null,
      summary: t('resume.personal_info.summary_placeholder')
    },
    educations: formData?.educations || [],
    experiences: formData?.experiences || [],
    skills: formData?.skills || [],
    languages: formData?.languages?.map(lang => ({
      ...lang,
      language: lang.name || lang.language,
      proficiency: lang.level || lang.proficiency
    })) || [],
    internships: formData?.internships || [],
    courses: formData?.courses || [],
    hobbies: formData?.hobbies || [],
    extracurriculars: formData?.extracurriculars || [],
    referrals: formData?.referrals || { providedOnRequest: true },
    custom_sections: formData?.custom_sections || []
  };

  // Default custom settings with proper fallbacks
  const settings = {
    accentColor: customSettings?.accentColor || '#1565c0',
    fontFamily: customSettings?.fontFamily || "'Calibri', 'Arial', sans-serif",
    lineSpacing: customSettings?.lineSpacing || 1.4,
    headingsUppercase: customSettings?.headingsUppercase === false ? false : true, // Default to true
    hideSkillLevel: customSettings?.hideSkillLevel || false
  };

  // Get the styles with PDF mode support
  const styles = getOsloStyles(darkMode, settings, isPdfMode);

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
    return data.hobbies && (
      (Array.isArray(data.hobbies) && data.hobbies.filter(hobby => hobby && (typeof hobby === 'string' ? hobby : hobby.name)).length > 0) || 
      (typeof data.hobbies === 'string' && data.hobbies.trim() !== '')
    );
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

  // Additional Tailwind classes for PDF mode
  const pdfClasses = isPdfMode ? {
    container: "print:bg-white print:shadow-none",
    header: "print:pt-2 print:pb-2",
    section: "print:page-break-inside-avoid print:break-inside-avoid",
    expItem: "print:page-break-inside-avoid print:break-inside-avoid",
    sectionTitle: "print:page-break-after-avoid print:break-after-avoid"
  } : {
    container: "",
    header: "",
    section: "",
    expItem: "",
    sectionTitle: ""
  };

  return (
    <div 
      style={styles.container} 
      className={`oslo-template ${pdfClasses.container}`}
    >
      {/* Header section */}
      <header 
        style={styles.header} 
        className={`oslo-header ${pdfClasses.header}`}
      >
        <div style={styles.headerContent}>
          <div style={styles.headerLeft}>
            <h1 style={styles.name}>{data.personal_info.full_name}</h1>
            <div style={styles.title}>{data.personal_info.title}</div>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.contactInfo}>
              {data.personal_info.email && (
                <div style={styles.contactItem}>
                  <span>{data.personal_info.email}</span>
                  <span style={styles.contactIcon}>✉️</span>
                </div>
              )}
              {data.personal_info.mobile && (
                <div style={styles.contactItem}>
                  <span>{data.personal_info.mobile}</span>
                  <span style={styles.contactIcon}>📱</span>
                </div>
              )}
              {data.personal_info.city && (
                <div style={styles.contactItem}>
                  <span>{data.personal_info.city}</span>
                  <span style={styles.contactIcon}>📍</span>
                </div>
              )}
              {data.personal_info.linkedin && (
                <div style={styles.contactItem}>
                  <span>{data.personal_info.linkedin}</span>
                  <span style={styles.contactIcon}>🔗</span>
                </div>
              )}
              {data.personal_info.website && (
                <div style={styles.contactItem}>
                  <span>{data.personal_info.website}</span>
                  <span style={styles.contactIcon}>🌐</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content - two column layout */}
      <div style={styles.mainContainer} className="oslo-main-container">
        {/* Main column */}
        <div style={styles.mainColumn} className="oslo-main-column">
          {/* Oslo Summary */}
          {data.personal_info.summary && (
            <div style={styles.section} className={`oslo-summary-section ${pdfClasses.section}`}>
              <h2 style={styles.sectionTitle} className={`oslo-section-title ${pdfClasses.sectionTitle}`} data-section="summary">
                {settings.headingsUppercase ? t('resume.personal_info.summary').toUpperCase() : t('resume.personal_info.summary')}
              </h2>
              <div style={styles.summary}>{data.personal_info.summary}</div>
            </div>
          )}

          {/* Work Experience */}
          {hasExperiences() && (
            <div style={styles.section} className={`oslo-experience-section ${pdfClasses.section}`}>
              <h2 style={styles.sectionTitle} className={`oslo-section-title ${pdfClasses.sectionTitle}`} data-section="experience">
                {settings.headingsUppercase ? t('resume.experience.title').toUpperCase() : t('resume.experience.title')}
              </h2>
              
              {data.experiences.map((exp, index) => (
                <div key={index} style={styles.expItem} className={`oslo-exp-item ${pdfClasses.expItem}`}>
                  <div style={styles.expHeader}>
                    <div style={styles.expTitle}>{exp.position}</div>
                    <div style={styles.expDate}>
                      {formatDate(exp.start_date)} - {exp.current ? t('resume.experience.current_work') : formatDate(exp.end_date)}
                    </div>
                  </div>
                  <div style={styles.expCompany}>{exp.company}</div>
                  {exp.location && (
                    <div style={styles.expLocation}>{exp.location}</div>
                  )}
                  {exp.description && (
                    <div style={styles.expDescription}>{exp.description}</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {hasEducation() && (
            <div style={styles.section} className={`oslo-education-section ${pdfClasses.section}`}>
              <h2 style={styles.sectionTitle} className={`oslo-section-title ${pdfClasses.sectionTitle}`} data-section="education">
                {settings.headingsUppercase ? t('resume.education.title').toUpperCase() : t('resume.education.title')}
              </h2>
              
              {data.educations.map((edu, index) => (
                <div key={index} style={styles.expItem} className={`oslo-edu-item ${pdfClasses.expItem}`}>
                  <div style={styles.expHeader}>
                    <div style={styles.expTitle}>
                      {edu.degree} {edu.field_of_study && `${t('common.in')} ${edu.field_of_study}`}
                    </div>
                    <div style={styles.expDate}>
                      {formatDate(edu.start_date)} - {edu.current ? t('resume.education.currently_studying') : formatDate(edu.end_date)}
                    </div>
                  </div>
                  <div style={styles.expCompany}>{edu.institution}</div>
                  {edu.location && (
                    <div style={styles.expLocation}>{edu.location}</div>
                  )}
                  {edu.gpa && (
                    <div style={styles.expDescription}>{t('resume.education.gpa')}: {edu.gpa}</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Internships */}
          {hasInternships() && (
            <div style={styles.section} className={`oslo-internships-section ${pdfClasses.section}`}>
              <h2 style={styles.sectionTitle} className={`oslo-section-title ${pdfClasses.sectionTitle}`} data-section="internships">
                {settings.headingsUppercase ? t('resume.internships.title').toUpperCase() : t('resume.internships.title')}
              </h2>
              
              {data.internships.map((internship, index) => (
                <div key={index} style={styles.expItem} className={`oslo-internship-item ${pdfClasses.expItem}`}>
                  <div style={styles.expHeader}>
                    <div style={styles.expTitle}>{internship.position}</div>
                    <div style={styles.expDate}>
                      {formatDate(internship.start_date)} - {internship.current ? t('resume.internships.current_work') : formatDate(internship.end_date)}
                    </div>
                  </div>
                  <div style={styles.expCompany}>{internship.company}</div>
                  {internship.location && (
                    <div style={styles.expLocation}>{internship.location}</div>
                  )}
                  {internship.description && (
                    <div style={styles.expDescription}>{internship.description}</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Courses & Certifications */}
          {hasCourses() && (
            <div style={styles.section} className={`oslo-courses-section ${pdfClasses.section}`}>
              <h2 style={styles.sectionTitle} className={`oslo-section-title ${pdfClasses.sectionTitle}`} data-section="courses">
                {settings.headingsUppercase ? t('resume.courses.title').toUpperCase() : t('resume.courses.title')}
              </h2>
              
              {data.courses.map((course, index) => (
                <div key={index} style={styles.expItem} className={`oslo-course-item ${pdfClasses.expItem}`}>
                  <div style={styles.expHeader}>
                    <div style={styles.expTitle}>{course.name}</div>
                    {course.date && (
                      <div style={styles.expDate}>{formatDate(course.date)}</div>
                    )}
                  </div>
                  {course.institution && (
                    <div style={styles.expCompany}>{course.institution}</div>
                  )}
                  {course.description && (
                    <div style={styles.expDescription}>{course.description}</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Extracurricular Activities */}
          {hasExtracurriculars() && (
            <div style={styles.section} className={`oslo-extracurriculars-section ${pdfClasses.section}`}>
              <h2 style={styles.sectionTitle} className={`oslo-section-title ${pdfClasses.sectionTitle}`} data-section="extracurriculars">
                {settings.headingsUppercase ? t('resume.extracurricular.activity').toUpperCase() : t('resume.extracurricular.activity')}
              </h2>
              
              {data.extracurriculars.map((activity, index) => (
                <div key={index} style={styles.expItem} className={`oslo-extracurricular-item ${pdfClasses.expItem}`}>
                  <div style={styles.expHeader}>
                    <div style={styles.expTitle}>{activity.title}</div>
                  </div>
                  {activity.description && (
                    <div style={styles.expDescription}>{activity.description}</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Custom Sections */}
          {hasCustomSections() &&
            data.custom_sections.map((section, sectionIndex) => (
              <div key={`custom-${sectionIndex}`} style={styles.section} className={`oslo-custom-section oslo-custom-section-${sectionIndex} ${pdfClasses.section}`}>
                <h2 style={styles.sectionTitle} className={`oslo-section-title ${pdfClasses.sectionTitle}`} data-section={`custom-${sectionIndex}`}>
                  {settings.headingsUppercase ? (section.title || t('resume.custom_sections.title')).toUpperCase() : (section.title || t('resume.custom_sections.title'))}
                </h2>
                
                {section.items && section.items.length > 0 ? (
                  section.items.map((item, itemIndex) => (
                    <div key={`custom-item-${sectionIndex}-${itemIndex}`} style={styles.expItem} className={`oslo-custom-item ${pdfClasses.expItem}`}>
                      <div style={styles.expHeader}>
                        <div style={styles.expTitle}>{item.title}</div>
                        {item.date && (
                          <div style={styles.expDate}>{item.date}</div>
                        )}
                      </div>
                      {item.subtitle && (
                        <div style={styles.expCompany}>{item.subtitle}</div>
                      )}
                      {item.content && (
                        <div style={styles.expDescription}>{item.content}</div>
                      )}
                    </div>
                  ))
                ) : (
                  <div style={styles.expItem} className={`oslo-custom-content ${pdfClasses.expItem}`}>
                    <div style={styles.expDescription}>{section.content}</div>
                  </div>
                )}
              </div>
            ))
          }
        </div>

        {/* Side column */}
        <div style={styles.sideColumn} className="oslo-side-column">
          {/* Personal details section */}
          {hasPersonalDetails() && (
            <div style={styles.section} className={`oslo-personal-details-section ${pdfClasses.section}`}>
              <h2 style={styles.sectionTitle} className={`oslo-section-title ${pdfClasses.sectionTitle}`} data-section="personal-details">
                {settings.headingsUppercase ? t('resume.personal_info.title').toUpperCase() : t('resume.personal_info.title')}
              </h2>
              <div style={styles.personalInfo}>
                {data.personal_info.address && (
                  <div style={styles.personalItem}>
                    <span style={styles.personalIcon}>🏠</span>
                    <span style={styles.personalLabel}>{t('resume.personal_info.address')}:</span>
                    <span>{data.personal_info.address}</span>
                  </div>
                )}
                {data.personal_info.postal_code && (
                  <div style={styles.personalItem}>
                    <span style={styles.personalIcon}>📮</span>
                    <span style={styles.personalLabel}>{t('resume.personal_info.postal_code')}:</span>
                    <span>{data.personal_info.postal_code}</span>
                  </div>
                )}
                {data.personal_info.driving_license && (
                  <div style={styles.personalItem}>
                    <span style={styles.personalIcon}>🚗</span>
                    <span style={styles.personalLabel}>{t('resume.personal_info.driving_license')}:</span>
                    <span>{data.personal_info.driving_license}</span>
                  </div>
                )}
                {data.personal_info.nationality && (
                  <div style={styles.personalItem}>
                    <span style={styles.personalIcon}>🌍</span>
                    <span style={styles.personalLabel}>{t('resume.personal_info.nationality')}:</span>
                    <span>{data.personal_info.nationality}</span>
                  </div>
                )}
                {data.personal_info.place_of_birth && (
                  <div style={styles.personalItem}>
                    <span style={styles.personalIcon}>📍</span>
                    <span style={styles.personalLabel}>{t('resume.personal_info.place_of_birth')}:</span>
                    <span>{data.personal_info.place_of_birth}</span>
                  </div>
                )}
                {data.personal_info.date_of_birth && (
                  <div style={styles.personalItem}>
                    <span style={styles.personalIcon}>🎂</span>
                    <span style={styles.personalLabel}>{t('resume.personal_info.date_of_birth')}:</span>
                    <span>{formatDate(data.personal_info.date_of_birth)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Skills */}
          {hasSkills() && (
            <div style={styles.section} className={`oslo-skills-section ${pdfClasses.section}`}>
              <h2 style={styles.sectionTitle} className={`oslo-section-title ${pdfClasses.sectionTitle}`} data-section="skills">
                {settings.headingsUppercase ? t('resume.skills.title').toUpperCase() : t('resume.skills.title')}
              </h2>
              <div style={styles.skillsContainer}>
                {data.skills.map((skill, index) => (
                  <div key={index} style={styles.skillItem} className="oslo-skill-item">
                    <div style={styles.skillInfo}>
                      <span style={styles.skillName}>{skill.name}</span>
                      {skill.level && !settings.hideSkillLevel && (
                        <span style={styles.skillLevel}>{skill.level}</span>
                      )}
                    </div>
                    {skill.level && !settings.hideSkillLevel && (
                      <div style={styles.skillBar} className="oslo-skill-bar">
                        <div 
                          style={{
                            ...styles.skillProgress,
                            width: getSkillLevelWidth(skill.level)
                          }}
                          className="oslo-skill-progress"
                        ></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Languages */}
          {hasLanguages() && (
            <div style={styles.section} className={`oslo-languages-section ${pdfClasses.section}`}>
              <h2 style={styles.sectionTitle} className={`oslo-section-title ${pdfClasses.sectionTitle}`} data-section="languages">
                {settings.headingsUppercase ? t('resume.languages.title').toUpperCase() : t('resume.languages.title')}
              </h2>
              <div>
                {data.languages.map((language, index) => (
                  <div key={index} style={styles.languageItem} className="oslo-language-item">
                    <span style={styles.languageName}>{language.language}</span>
                    <span style={styles.languageLevel}>{language.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hobbies & Interests */}
          {hasHobbies() && (
            <div style={styles.section} className={`oslo-hobbies-section ${pdfClasses.section}`}>
              <h2 style={styles.sectionTitle} className={`oslo-section-title ${pdfClasses.sectionTitle}`} data-section="hobbies">
                {settings.headingsUppercase ? t('resume.hobbies.title').toUpperCase() : t('resume.hobbies.title')}
              </h2>
              {typeof data.hobbies === 'string' ? (
                <div className="oslo-hobbies-text">{data.hobbies}</div>
              ) : (
                <div style={styles.hobbiesContainer} className="oslo-hobbies-container">
                  {data.hobbies.map((hobby, index) => (
                    <div key={index} style={styles.hobby} className="oslo-hobby">
                      {typeof hobby === 'string' ? hobby : hobby.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* References */}
          {hasReferences() && (
            <div style={styles.section} className={`oslo-references-section ${pdfClasses.section}`}>
              <h2 style={styles.sectionTitle} className={`oslo-section-title ${pdfClasses.sectionTitle}`} data-section="references">
                {settings.headingsUppercase ? t('resume.references.title').toUpperCase() : t('resume.references.title')}
              </h2>
              <div style={styles.referencesContainer} className="oslo-references-container">
                {data.referrals.providedOnRequest ? (
                  <div style={styles.referencesText} className="oslo-references-text">
                    {t('resume.references.provide_upon_request')}
                  </div>
                ) : (
                  Array.isArray(data.referrals) && data.referrals.map((reference, index) => (
                    <div key={index} style={styles.referenceItem} className="oslo-reference-item">
                      <div style={styles.referenceName}>{reference.name}</div>
                      {reference.relation && (
                        <div style={styles.referenceTitle}>{reference.relation}</div>
                      )}
                      <div style={styles.referenceContact}>
                        {reference.email && reference.email}
                        {reference.email && reference.phone && " • "}
                        {reference.phone && reference.phone}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PDF-specific print classes */}
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
            .oslo-exp-item, .oslo-edu-item, .oslo-internship-item, .oslo-course-item, .oslo-custom-item {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            .oslo-section-title {
              page-break-after: avoid !important;
              break-after: avoid !important;
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

export default Oslo;