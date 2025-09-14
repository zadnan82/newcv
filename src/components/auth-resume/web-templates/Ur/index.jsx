import React from 'react';
import { getUrStyles } from './UrStyles';
import { useTranslation } from 'react-i18next';

/**
 * Completely redesigned Ur Template with proper translation support
 * and comprehensive data handling like Stockholm template
 */
const Ur = ({ formData, customSettings, darkMode, isPdfMode = false }) => {
  const { t } = useTranslation();
  
  // Normalize data structure to match Stockholm's approach
  const data = {
    personal_info: formData?.personal_info || {},
    experiences: formData?.experiences || [],
    education: formData?.educations || formData?.education || [],
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
    custom_sections: formData?.custom_sections || []
  };

  // Default custom settings
  const settings = {
    accentColor: customSettings?.accentColor || '#2563eb',
    fontFamily: customSettings?.fontFamily || "'Inter', system-ui, sans-serif",
    lineSpacing: customSettings?.lineSpacing || 1.5,
    headingsUppercase: customSettings?.headingsUppercase || false,
    hideSkillLevel: customSettings?.hideSkillLevel || false
  };

  // Get the styles with PDF mode support
  const styles = getUrStyles(darkMode, settings, isPdfMode);

  // Format date with proper internationalization
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    
    try {
      const [year, month] = dateStr.split('-').map(num => parseInt(num, 10));
      const dateObj = new Date(year, month - 1);
      
      return new Intl.DateTimeFormat(undefined, { 
        year: 'numeric', 
        month: 'long' 
      }).format(dateObj);
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
  
  // Get skill level as percentage width
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
      'Basic': '30%'
    };
    
    return levels[level] || '50%';
  };
  
  // Get translated language proficiency level
  const getProficiencyTranslation = (proficiency) => {
    const translationKeys = {
      'Native': 'resume.languages.levels.native',
      'Fluent': 'resume.languages.levels.fluent',
      'Advanced': 'resume.languages.levels.advanced',
      'Intermediate': 'resume.languages.levels.intermediate',
      'Beginner': 'resume.languages.levels.beginner'
    };
    
    return translationKeys[proficiency] ? t(translationKeys[proficiency]) : proficiency;
  };
  
  // Get appropriate icon for contact items
  const getContactIcon = (type) => {
    const icons = {
      email: '✉',
      mobile: '📱',
      phone: '📞',
      city: '📍',
      address: '🏠',
      linkedin: '🔗',
      website: '🌐',
      github: '💻',
      default: '📌'
    };
    
    return icons[type] || icons.default;
  };
  
  // Helper functions to check if sections have data
  const hasContent = (array, keyToCheck) => {
    return array && 
           Array.isArray(array) && 
           array.filter(item => item && (keyToCheck ? item[keyToCheck] : true)).length > 0;
  };
  
  const hasPersonalDetails = () => {
    const fields = ['address', 'postal_code', 'driving_license', 
                    'nationality', 'place_of_birth', 'date_of_birth'];
    return data.personal_info && fields.some(field => data.personal_info[field]);
  };
  
  const hasReferences = () => {
    if (!data.referrals) return false;
    if (data.referrals.providedOnRequest) return true;
    return hasContent(data.referrals.references, 'name');
  };
  
  // PDF-specific classes
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
    <div style={styles.container} className={`ur-template ${pdfClasses.container}`}>
      {/* Header with two column design */}
      <header style={styles.header} className="ur-header">
        {/* Left side with name and title */}
        <div style={styles.headerMain}>
          <h1 style={styles.name}>{data.personal_info.full_name || t('resume.personal_info.full_name_placeholder')}</h1>
          <div style={styles.title}>{data.personal_info.title || t('resume.personal_info.title_placeholder')}</div>
        </div>
        
        {/* Right side with contact information */}
        <div style={styles.headerContact}>
          <div style={styles.contactContainer}>
            {data.personal_info.email && (
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>{getContactIcon('email')}</span>
                <span style={styles.contactText}>{data.personal_info.email}</span>
              </div>
            )}
            {data.personal_info.mobile && (
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>{getContactIcon('mobile')}</span>
                <span style={styles.contactText}>{data.personal_info.mobile}</span>
              </div>
            )}
            {data.personal_info.city && (
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>{getContactIcon('city')}</span>
                <span style={styles.contactText}>{data.personal_info.city}</span>
              </div>
            )}
            {data.personal_info.linkedin && (
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>{getContactIcon('linkedin')}</span>
                <span style={styles.contactText}>{data.personal_info.linkedin}</span>
              </div>
            )}
            {data.personal_info.website && (
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>{getContactIcon('website')}</span>
                <span style={styles.contactText}>{data.personal_info.website}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content with sidebar layout */}
      <div style={styles.mainContainer}>
        {/* Left column - main content */}
        <div style={styles.leftColumn}>
          {/* Profile/Summary section */}
          {data.personal_info.summary && (
            <div style={styles.section} className={`ur-summary-section ${pdfClasses.section}`}>
              <h2 style={styles.sectionTitle} className={pdfClasses.sectionTitle} data-section="summary">
                {t('resume.personal_info.summary')}
              </h2>
              <p style={styles.summaryContent}>
                {data.personal_info.summary}
              </p>
            </div>
          )}

          {/* Work Experience section */}
          {hasContent(data.experiences, 'company') && (
            <div style={styles.section} className={`ur-experience-section ${pdfClasses.section}`}>
              <h2 style={styles.sectionTitle} className={pdfClasses.sectionTitle} data-section="experience">
                {t('resume.experience.title')}
              </h2>
              
              {data.experiences
                .filter(exp => exp && exp.company)
                .map((exp, index) => (
                  <div key={index} style={styles.expItem} className={`ur-exp-item ${pdfClasses.expItem}`}>
                    <div style={styles.expHeader}>
                      <div style={styles.expTitle}>{exp.position}</div>
                      <div style={styles.expDate}>
                        {formatDate(exp.start_date)} — {exp.current ? t('resume.experience.current_work') : formatDate(exp.end_date)}
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

          {/* Education section */}
          {hasContent(data.education, 'institution') && (
            <div style={styles.section} className={`ur-education-section ${pdfClasses.section}`}>
              <h2 style={styles.sectionTitle} className={pdfClasses.sectionTitle} data-section="education">
                {t('resume.education.title')}
              </h2>
              
              {data.education
                .filter(edu => edu && edu.institution)
                .map((edu, index) => (
                  <div key={index} style={styles.expItem} className={`ur-edu-item ${pdfClasses.expItem}`}>
                    <div style={styles.expHeader}>
                      <div style={styles.expTitle}>
                        {edu.degree}{edu.field_of_study ? ` ${t('common.in')} ${edu.field_of_study}` : ''}
                      </div>
                      <div style={styles.expDate}>
                        {formatDate(edu.start_date)} — {edu.current ? t('resume.education.currently_studying') : formatDate(edu.end_date)}
                      </div>
                    </div>
                    <div style={styles.expCompany}>{edu.institution}</div>
                    {edu.location && (
                      <div style={styles.expLocation}>{edu.location}</div>
                    )}
                    {edu.description && (
                      <div style={styles.expDescription}>{edu.description}</div>
                    )}
                    {edu.gpa && (
                      <div style={styles.expDescription}>{t('resume.education.gpa')}: {edu.gpa}</div>
                    )}
                  </div>
                ))}
            </div>
          )}

          {/* Internships section */}
          {hasContent(data.internships, 'company') && (
            <div style={styles.section} className={`ur-internships-section ${pdfClasses.section}`}>
              <h2 style={styles.sectionTitle} className={pdfClasses.sectionTitle} data-section="internships">
                {t('resume.internships.title')}
              </h2>
              
              {data.internships
                .filter(internship => internship && internship.company)
                .map((internship, index) => (
                  <div key={index} style={styles.expItem} className={`ur-internship-item ${pdfClasses.expItem}`}>
                    <div style={styles.expHeader}>
                      <div style={styles.expTitle}>{internship.position}</div>
                      <div style={styles.expDate}>
                        {formatDate(internship.start_date)} — {internship.current ? t('resume.internships.current_work') : formatDate(internship.end_date)}
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

          {/* Courses & Certifications section */}
          {hasContent(data.courses, 'name') && (
            <div style={styles.section} className={`ur-courses-section ${pdfClasses.section}`}>
              <h2 style={styles.sectionTitle} className={pdfClasses.sectionTitle} data-section="courses">
                {t('resume.courses.title')}
              </h2>
              
              {data.courses
                .filter(course => course && course.name)
                .map((course, index) => (
                  <div key={index} style={styles.expItem} className={`ur-course-item ${pdfClasses.expItem}`}>
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
          {hasContent(data.extracurriculars, 'title') && (
            <div style={styles.section} className={`ur-extracurriculars-section ${pdfClasses.section}`}>
              <h2 style={styles.sectionTitle} className={pdfClasses.sectionTitle} data-section="extracurriculars">
                {t('resume.extracurricular.activity')}
              </h2>
              
              {data.extracurriculars
                .filter(activity => activity && activity.title)
                .map((activity, index) => (
                  <div key={index} style={styles.expItem} className={`ur-activity-item ${pdfClasses.expItem}`}>
                    <div style={styles.expHeader}>
                      <div style={styles.expTitle}>{activity.title}</div>
                      {activity.date && (
                        <div style={styles.expDate}>{activity.date}</div>
                      )}
                    </div>
                    {activity.description && (
                      <div style={styles.expDescription}>{activity.description}</div>
                    )}
                  </div>
                ))}
            </div>
          )}

          {/* Custom Sections */}
          {data.custom_sections
            .filter(section => section && section.title && (section.content || (section.items && section.items.length > 0)))
            .map((section, sectionIndex) => (
              <div key={`custom-${sectionIndex}`} style={styles.section} className={`ur-custom-section ${pdfClasses.section}`}>
                <h2 style={styles.sectionTitle} className={pdfClasses.sectionTitle} data-section={`custom-${sectionIndex}`}>
                  {section.title}
                </h2>
                
                {section.items && section.items.length > 0 ? (
                  section.items
                    .filter(item => item && item.title)
                    .map((item, itemIndex) => (
                      <div key={`custom-item-${sectionIndex}-${itemIndex}`} style={styles.expItem} className={`ur-custom-item ${pdfClasses.expItem}`}>
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
                  section.content && <p style={styles.summaryContent}>{section.content}</p>
                )}
              </div>
            ))}
        </div>

        {/* Right column - sidebar */}
        <div style={styles.rightColumn}>
          {/* Personal details section */}
          {hasPersonalDetails() && (
            <div style={styles.sideSection} className={`ur-details-section ${pdfClasses.section}`}>
              <h2 style={styles.sideSectionTitle} className={pdfClasses.sectionTitle} data-section="personal-details">
                {t('resume.personal_info.title')}
              </h2>
              <div style={styles.detailsContainer}>
                {data.personal_info.address && (
                  <div style={styles.detailItem}>
                    <div style={styles.detailLabel}>{t('resume.personal_info.address')}</div>
                    <div style={styles.detailValue}>{data.personal_info.address}</div>
                  </div>
                )}
                {data.personal_info.postal_code && (
                  <div style={styles.detailItem}>
                    <div style={styles.detailLabel}>{t('resume.personal_info.postal_code')}</div>
                    <div style={styles.detailValue}>{data.personal_info.postal_code}</div>
                  </div>
                )}
                {data.personal_info.nationality && (
                  <div style={styles.detailItem}>
                    <div style={styles.detailLabel}>{t('resume.personal_info.nationality')}</div>
                    <div style={styles.detailValue}>{data.personal_info.nationality}</div>
                  </div>
                )}
                {data.personal_info.driving_license && (
                  <div style={styles.detailItem}>
                    <div style={styles.detailLabel}>{t('resume.personal_info.driving_license')}</div>
                    <div style={styles.detailValue}>{data.personal_info.driving_license}</div>
                  </div>
                )}
                {data.personal_info.date_of_birth && (
                  <div style={styles.detailItem}>
                    <div style={styles.detailLabel}>{t('resume.personal_info.date_of_birth')}</div>
                    <div style={styles.detailValue}>{formatDate(data.personal_info.date_of_birth)}</div>
                  </div>
                )}
                {data.personal_info.place_of_birth && (
                  <div style={styles.detailItem}>
                    <div style={styles.detailLabel}>{t('resume.personal_info.place_of_birth')}</div>
                    <div style={styles.detailValue}>{data.personal_info.place_of_birth}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Skills section */}
          {hasContent(data.skills, 'name') && (
            <div style={styles.sideSection} className={`ur-skills-section ${pdfClasses.section}`}>
              <h2 style={styles.sideSectionTitle} className={pdfClasses.sectionTitle} data-section="skills">
                {t('resume.skills.title')}
              </h2>
              <div style={styles.skillsContainer}>
                {data.skills
                  .filter(skill => skill && skill.name)
                  .map((skill, index) => (
                    <div key={index} style={styles.skillItem}>
                      <div style={styles.skillHeader}>
                        <div style={styles.skillName}>{skill.name}</div>
                        {!settings.hideSkillLevel && skill.level && (
                          <div style={styles.skillLevelText}>{skill.level}</div>
                        )}
                      </div>
                      {!settings.hideSkillLevel && skill.level && (
                        <div style={styles.skillBar}>
                          <div
                            style={{
                              ...styles.skillProgress,
                              width: getSkillLevelWidth(skill.level)
                            }}
                          ></div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Languages section */}
          {hasContent(data.languages, 'language') && (
            <div style={styles.sideSection} className={`ur-languages-section ${pdfClasses.section}`}>
              <h2 style={styles.sideSectionTitle} className={pdfClasses.sectionTitle} data-section="languages">
                {t('resume.languages.title')}
              </h2>
              <div style={styles.languagesContainer}>
                {data.languages
                  .filter(lang => lang && lang.language)
                  .map((lang, index) => (
                    <div key={index} style={styles.languageItem}>
                      <div style={styles.languageName}>{lang.language}</div>
                      <div style={styles.languageLevel}>{getProficiencyTranslation(lang.proficiency)}</div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Hobbies & Interests section */}
          {(typeof data.hobbies === 'string' && data.hobbies.trim() !== '') || 
           (Array.isArray(data.hobbies) && data.hobbies.length > 0) && (
            <div style={styles.sideSection} className={`ur-hobbies-section ${pdfClasses.section}`}>
              <h2 style={styles.sideSectionTitle} className={pdfClasses.sectionTitle} data-section="hobbies">
                {t('resume.hobbies.title')}
              </h2>
              {typeof data.hobbies === 'string' ? (
                <div style={styles.hobbiesText}>{data.hobbies}</div>
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

          {/* References section */}
          {hasReferences() && (
            <div style={styles.sideSection} className={`ur-references-section ${pdfClasses.section}`}>
              <h2 style={styles.sideSectionTitle} className={pdfClasses.sectionTitle} data-section="referrals">
                {t('resume.references.title')}
              </h2>
              {data.referrals.providedOnRequest ? (
                <div style={styles.referenceText}>{t('resume.references.provide_upon_request')}</div>
              ) : (
                <div style={styles.referencesGrid}>
                  {data.referrals.references
                    .filter(ref => ref && ref.name)
                    .map((reference, index) => (
                      <div key={index} style={styles.referenceItem}>
                        <div style={styles.referenceName}>{reference.name}</div>
                        {reference.relation && (
                          <div style={styles.referenceTitle}>{reference.relation}</div>
                        )}
                        {reference.email && (
                          <div style={styles.referenceContact}>
                            {reference.email}
                          </div>
                        )}
                        {reference.phone && (
                          <div style={styles.referenceContact} className="phone">
                            {reference.phone}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

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
            .ur-exp-item, .ur-edu-item, .ur-internship-item, .ur-course-item, .ur-custom-item, .ur-activity-item {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            .ur-section-title, .ur-side-section-title {
              page-break-after: avoid !important;
              break-after: avoid !important;
            }
            p, li {
              orphans: 2 !important;
              widows: 2 !important;
            }
            .phone::before {
              content: "📞" !important;
              margin-right: 6px !important;
            }
          }
        `}} />
      )}
    </div>
  );
};

export default Ur;