import React from 'react';
import { getTorontoStyles } from './TorontoStyles';
import { useTranslation } from 'react-i18next';

/**
 * Toronto Template Implementation
 * Elegant pastel background with minimalist design
 * Enhanced with PDF support - Fixed for proper export
 */
const Toronto = ({ formData, customSettings, darkMode, isPdfMode = false }) => {
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

  // Default custom settings with proper fallbacks
  const settings = {
    accentColor: customSettings?.accentColor || '#84605d', // Terracotta color from the image
    fontFamily: customSettings?.fontFamily || "'Calibri', 'Arial', sans-serif",
    lineSpacing: customSettings?.lineSpacing || 1.5,
    headingsUppercase: customSettings?.headingsUppercase === false ? false : true, // Default to true
    hideSkillLevel: customSettings?.hideSkillLevel || false
  };

  // Get the styles with PDF mode support
  const styles = getTorontoStyles(darkMode, settings, isPdfMode);

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
  // Generate language proficiency meter
  const renderLanguageMeter = (proficiency) => {
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
    const bars = [];
    
    for (let i = 0; i < 5; i++) {
      bars.push(
        <div 
          key={i} 
          style={i < level ? styles.languageMeterFill : styles.languageMeterEmpty}
          className="language-meter-item"
        ></div>
      );
    }
    
    return (
      <div style={styles.languageMeter}>
        {bars}
      </div>
    );
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

  // PDF-specific Tailwind classes
  const pdfClasses = isPdfMode ? {
    container: "print:bg-white print:shadow-none",
    section: "print:break-inside-avoid",
    expItem: "print:break-inside-avoid",
    sectionTitle: "print:break-after-avoid"
  } : {
    container: "",
    section: "",
    expItem: "",
    sectionTitle: ""
  };

  return (
    <div style={styles.container} className={`toronto-template ${pdfClasses.container}`}>
      {/* Header Section */}
      <header style={styles.header} className="toronto-header">
        <h1 style={styles.name}>{data.personal_info.full_name}</h1>
        <div style={styles.title}>{data.personal_info.title}</div>
        
        {/* Contact Info */}
        <div style={styles.contactInfo}>
          {data.personal_info.mobile && (
            <div style={styles.contactItem}>
              <span>{data.personal_info.mobile}</span>
            </div>
          )}
          {data.personal_info.address && data.personal_info.city && (
            <div style={styles.contactItem}>
              <span>{data.personal_info.address}, {data.personal_info.city}{data.personal_info.postal_code ? ', ' + data.personal_info.postal_code : ''}</span>
            </div>
          )}
          {data.personal_info.email && (
            <div style={styles.contactItem}>
              <span>{data.personal_info.email}</span>
            </div>
          )}
        </div>
        
        {/* Navigation Bar */}
        <nav style={styles.navBar}>
          <div style={styles.navItem}>
            {settings.headingsUppercase ? t('resume.personal_info.title').toUpperCase() : t('resume.personal_info.title')}
          </div>
          <div style={styles.navItem}>
            {settings.headingsUppercase ? t('resume.personal_info.summary').toUpperCase() : t('resume.personal_info.summary')}
          </div>
          <div style={styles.navItemLast}>
            {settings.headingsUppercase ? t('resume.experience.title').toUpperCase() : t('resume.experience.title')}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div style={styles.contentLayout}>
        {/* Left Sidebar */}
        <div style={styles.sidebar} className="toronto-sidebar">
          {/* Personal Details Section */}
          {hasPersonalDetails() && (
            <div style={styles.sidebarSection} className={`toronto-details-section ${pdfClasses.section}`}>
              <h3 style={styles.sidebarTitle} className={pdfClasses.sectionTitle}>
                {settings.headingsUppercase ? t('resume.personal_info.title').toUpperCase() : t('resume.personal_info.title')}
              </h3>
              
              {data.personal_info.date_of_birth && (
                <div style={styles.personalDetail}>
                  <div style={styles.personalDetailLabel}>
                    {t('resume.personal_info.date_of_birth')} {data.personal_info.place_of_birth ? `/ ${t('resume.personal_info.place_of_birth')}` : ''}
                  </div>
                  <div style={styles.personalDetailValue}>
                    {formatDate(data.personal_info.date_of_birth)}
                    {data.personal_info.place_of_birth && ` / ${data.personal_info.place_of_birth}`}
                  </div>
                </div>
              )}
              
              {data.personal_info.nationality && (
                <div style={styles.personalDetail}>
                  <div style={styles.personalDetailLabel}>{t('resume.personal_info.nationality')}</div>
                  <div style={styles.personalDetailValue}>{data.personal_info.nationality}</div>
                </div>
              )}
              
              {data.personal_info.driving_license && (
                <div style={styles.personalDetail}>
                  <div style={styles.personalDetailLabel}>{t('resume.personal_info.driving_license')}</div>
                  <div style={styles.personalDetailValue}>{data.personal_info.driving_license}</div>
                </div>
              )}
            </div>
          )}
          
          {/* Links Section */}
          {(data.personal_info.linkedin || data.personal_info.website) && (
            <div style={styles.sidebarSection} className={`toronto-links-section ${pdfClasses.section}`}>
              <h3 style={styles.sidebarTitle} className={pdfClasses.sectionTitle}>
                {settings.headingsUppercase ? t('resume.links').toUpperCase() : t('resume.links')}
              </h3>
              <div style={styles.linksSection}>
                {data.personal_info.linkedin && (
                  <div style={styles.linkItem}>{data.personal_info.linkedin}</div>
                )}
                {data.personal_info.website && (
                  <div style={styles.linkItem}>{data.personal_info.website}</div>
                )}
              </div>
            </div>
          )}
          
          {/* Skills Section */}
          {hasSkills() && (
            <div style={styles.sidebarSection} className={`toronto-skills-section ${pdfClasses.section}`}>
              <h3 style={styles.sidebarTitle} className={pdfClasses.sectionTitle}>
                {settings.headingsUppercase ? t('resume.skills.title').toUpperCase() : t('resume.skills.title')}
              </h3>
              <div style={styles.skillsGrid}>
                {data.skills.map((skill, index) => (
                  <div key={index} style={styles.skillItem}>
                    <div style={styles.skillName}>{skill.name}</div>
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
            <div style={styles.sidebarSection} className={`toronto-languages-section ${pdfClasses.section}`}>
              <h3 style={styles.sidebarTitle} className={pdfClasses.sectionTitle}>
                {settings.headingsUppercase ? t('resume.languages.title').toUpperCase() : t('resume.languages.title')}
              </h3>
              <div style={styles.languagesGrid}>
                {data.languages.map((language, index) => (
                  <div key={index} style={styles.languageItem}>
                    <div style={styles.languageName}>{language.name}</div>
                    {renderLanguageMeter(language.level)}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Hobbies Section (in sidebar if small) */}
          {hasHobbies() && (
            <div style={styles.sidebarSection} className={`toronto-sidebar-hobbies-section ${pdfClasses.section}`}>
              <h3 style={styles.sidebarTitle} className={pdfClasses.sectionTitle}>
                {settings.headingsUppercase ? t('resume.hobbies.title').toUpperCase() : t('resume.hobbies.title')}
              </h3>
              {typeof data.hobbies === 'string' ? (
                <div style={styles.expDescription}>{data.hobbies}</div>
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
        </div>

        {/* Main Column */}
        <div style={styles.mainColumn} className="toronto-main-column">
          {/* Profile Section */}
          {data.personal_info.summary && (
            <div style={styles.section} className={`toronto-profile-section ${pdfClasses.section}`}>
              <h3 style={styles.sectionTitle} className={pdfClasses.sectionTitle}>
                {settings.headingsUppercase ? t('resume.personal_info.summary').toUpperCase() : t('resume.personal_info.summary')}
              </h3>
              <div style={styles.profileText}>
                {data.personal_info.summary}
              </div>
            </div>
          )}

          {/* Employment History */}
          {hasExperiences() && (
            <div style={styles.section} className={`toronto-employment-section ${pdfClasses.section}`}>
              <h3 style={styles.sectionTitle} className={pdfClasses.sectionTitle}>
                {settings.headingsUppercase ? t('resume.experience.title').toUpperCase() : t('resume.experience.title')}
              </h3>
              
              {data.experiences.map((exp, index) => (
                <div key={index} style={styles.experienceItem} className={pdfClasses.expItem}>
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
            <div style={styles.section} className={`toronto-education-section ${pdfClasses.section}`}>
              <h3 style={styles.sectionTitle} className={pdfClasses.sectionTitle}>
                {settings.headingsUppercase ? t('resume.education.title').toUpperCase() : t('resume.education.title')}
              </h3>
              
              {data.educations.map((edu, index) => (
                <div key={index} style={styles.educationItem} className={pdfClasses.expItem}>
                  <div style={styles.expHeader}>
                    <div style={styles.expTitle}>
                      {edu.degree}{edu.field_of_study ? ` ${t('common.in')} ${edu.field_of_study}` : ''}
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
            <div style={styles.section} className={`toronto-internships-section ${pdfClasses.section}`}>
              <h3 style={styles.sectionTitle} className={pdfClasses.sectionTitle}>
                {settings.headingsUppercase ? t('resume.internships.title').toUpperCase() : t('resume.internships.title')}
              </h3>
              
              {data.internships.map((internship, index) => (
                <div key={index} style={styles.experienceItem} className={pdfClasses.expItem}>
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
            <div style={styles.section} className={`toronto-courses-section ${pdfClasses.section}`}>
              <h3 style={styles.sectionTitle} className={pdfClasses.sectionTitle}>
                {settings.headingsUppercase ? t('resume.courses.title').toUpperCase() : t('resume.courses.title')}
              </h3>
              
              {data.courses.map((course, index) => (
                <div key={index} style={styles.experienceItem} className={pdfClasses.expItem}>
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

          {/* Hobbies & Interests (main column) */}
          {hasHobbies() && (
            <div style={styles.section} className={`toronto-hobbies-section ${pdfClasses.section}`}>
              <h3 style={styles.sectionTitle} className={pdfClasses.sectionTitle}>
                {settings.headingsUppercase ? t('resume.hobbies.title').toUpperCase() : t('resume.hobbies.title')}
              </h3>
              
              {typeof data.hobbies === 'string' ? (
                <div style={styles.expDescription}>{data.hobbies}</div>
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
          
          {/* Extracurricular Activities */}
          {hasExtracurriculars() && (
            <div style={styles.section} className={`toronto-extracurriculars-section ${pdfClasses.section}`}>
              <h3 style={styles.sectionTitle} className={pdfClasses.sectionTitle}>
                {settings.headingsUppercase ? t('resume.extracurricular.activity').toUpperCase() : t('resume.extracurricular.activity')}
              </h3>
              
              {data.extracurriculars.map((activity, index) => (
                <div key={index} style={styles.experienceItem} className={pdfClasses.expItem}>
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
              <div key={`custom-${sectionIndex}`} style={styles.section} className={`toronto-custom-section ${pdfClasses.section}`}>
                <h3 style={styles.sectionTitle} className={pdfClasses.sectionTitle}>
                  {settings.headingsUppercase ? section.title.toUpperCase() : section.title || t('resume.custom_sections.title')}
                </h3>
                
                {section.items && section.items.length > 0 ? (
                  section.items.map((item, itemIndex) => (
                    <div key={`custom-item-${sectionIndex}-${itemIndex}`} style={styles.experienceItem} className={pdfClasses.expItem}>
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
                  <div style={styles.expDescription}>{section.content}</div>
                )}
              </div>
            ))
          }

          {/* References */}
          {hasReferences() && (
            <div style={styles.section} className={`toronto-references-section ${pdfClasses.section}`}>
              <h3 style={styles.sectionTitle} className={pdfClasses.sectionTitle}>
                {settings.headingsUppercase ? t('resume.references.title').toUpperCase() : t('resume.references.title')}
              </h3>
              
              {data.referrals.providedOnRequest ? (
                <div style={styles.expDescription}>{t('resume.references.provide_upon_request')}</div>
              ) : (
                Array.isArray(data.referrals) && data.referrals.map((reference, index) => (
                  <div key={index} style={styles.referenceItem} className={pdfClasses.expItem}>
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
          )}
        </div>
      </div>
      
      {/* Page Indicator (hidden in PDF mode) */}
      {!isPdfMode && (
        <div style={styles.pageIndicator}>
          <span style={styles.pageNumber}>1</span>/2
          <div style={styles.pageNav}>
            <div style={styles.pageNavButton}>◀</div>
            <div style={styles.pageNavButton}>▶</div>
          </div>
        </div>
      )}

      {/* PDF-specific print styles */}
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
            .toronto-template {
              background-color: #ffffff !important;
            }
            .toronto-sidebar {
              background-color: #f5efe0 !important;
            }
            .toronto-expItem, .toronto-educationItem {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            .toronto-sectionTitle {
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

export default Toronto;