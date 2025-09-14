import React from 'react';
import { getZurichStyles } from './ZurichStyles';
import { useTranslation } from 'react-i18next';

const Zurich = ({ formData, customSettings, darkMode, isPdfMode = false }) => {
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
    referrals: formData.referrals || [],
    custom_sections: formData.custom_sections || []
  };

  // Default custom settings
  const settings = {
    accentColor: customSettings?.accentColor || '#2c5282',
    fontFamily: customSettings?.fontFamily || 'Helvetica, Arial, sans-serif',
    lineSpacing: customSettings?.lineSpacing || 1.5,
    headingsUppercase: customSettings?.headingsUppercase || false,
    hideSkillLevel: customSettings?.hideSkillLevel || false
  };

  // Get the styles specific to this template with PDF mode
  const styles = getZurichStyles(darkMode, settings, isPdfMode);

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
  // PDF-specific Tailwind classes
  const pdfClasses = isPdfMode ? {
    container: "print:bg-white print:shadow-none",
    header: "print:py-3",
    section: "print:break-inside-avoid",
    expItem: "print:break-inside-avoid print:border print:border-gray-200 print:shadow-none",
    sectionTitle: "print:break-after-avoid",
    sidebar: "print:bg-gray-100"
  } : {
    container: "",
    header: "",
    section: "",
    expItem: "",
    sectionTitle: "",
    sidebar: ""
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
           data.extracurriculars.filter(activity => activity && activity.name).length > 0;
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
    };
    
    return levels[level] || '50%';
  };

  return (
    <div style={styles.container} className={`zurich-template ${pdfClasses.container}`}>
      {/* Sidebar section (left column) */}
      <div style={styles.sidebar} className={`zurich-sidebar ${pdfClasses.sidebar}`}>
        {/* Profile image and name */}
        <div style={styles.profileImageContainer}>
          <img 
            src={profileImage}
            alt={data.personal_info.full_name} 
            style={styles.profileImage} 
          />
        </div>
        <h1 style={styles.name}>{data.personal_info.full_name}</h1>
        <div style={styles.title}>{data.personal_info.title}</div>
        
        {/* Contact Information */}
        <div style={styles.sidebarSection} className={pdfClasses.section}>
          <h2 style={styles.sidebarSectionTitle} className={pdfClasses.sectionTitle}> </h2>
          <div style={styles.contactGrid}>
            {data.personal_info.email && (
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>✉️</span>
                <span>{data.personal_info.email}</span>
              </div>
            )}
            {data.personal_info.mobile && (
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>📱</span>
                <span>{data.personal_info.mobile}</span>
              </div>
            )}
            {data.personal_info.city && (
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>📍</span>
                <span>{data.personal_info.city}</span>
              </div>
            )}
            {data.personal_info.linkedin && (
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>🔗</span>
                <span>{data.personal_info.linkedin}</span>
              </div>
            )}
            {data.personal_info.website && (
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>🌐</span>
                <span>{data.personal_info.website}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Personal Details */}
        {hasPersonalDetails() && (
          <div style={styles.sidebarSection} className={pdfClasses.section}>
            <h2 style={styles.sidebarSectionTitle} className={pdfClasses.sectionTitle}> </h2>
            <div style={styles.personalDetails}>
              {data.personal_info.address && (
                <div style={styles.personalDetailItem}>
                  <span style={styles.contactIcon}>🏠</span>
                  <span>{data.personal_info.address}</span>
                </div>
              )}
              {data.personal_info.postal_code && (
                <div style={styles.personalDetailItem}>
                  <span style={styles.contactIcon}>📮</span>
                  <span>{data.personal_info.postal_code} {data.personal_info.city}</span>
                </div>
              )}
              {data.personal_info.driving_license && (
                <div style={styles.personalDetailItem}>
                  <span style={styles.contactIcon}>🚗</span>
                  <span>{t('resume.personal_info.driving_license')}: {data.personal_info.driving_license}</span>
                </div>
              )}
              {data.personal_info.nationality && (
                <div style={styles.personalDetailItem}>
                  <span style={styles.contactIcon}>🌍</span>
                  <span>{t('resume.personal_info.nationality')}: {data.personal_info.nationality}</span>
                </div>
              )}
              {data.personal_info.place_of_birth && (
                <div style={styles.personalDetailItem}>
                  <span style={styles.contactIcon}>📍</span>
                  <span>{t('resume.personal_info.place_of_birth')}: {data.personal_info.place_of_birth}</span>
                </div>
              )}
              {data.personal_info.date_of_birth && (
                <div style={styles.personalDetailItem}>
                  <span style={styles.contactIcon}>🎂</span>
                  <span>{t('resume.personal_info.date_of_birth')}: {formatDate(data.personal_info.date_of_birth)}</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Skills */}
        {hasSkills() && (
          <div style={styles.sidebarSection} className={pdfClasses.section}>
            <h2 style={styles.sidebarSectionTitle} className={pdfClasses.sectionTitle}>{t('resume.skills.title')}</h2>
            <div style={styles.skillsGrid}>
              {data.skills
                .filter(skill => skill && skill.name)
                .map((skill, index) => (
                  <div key={index} style={styles.skillItem}>
                    {skill.name}
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
        
        {/* Languages */}
        {hasLanguages() && (
          <div style={styles.sidebarSection} className={pdfClasses.section}>
            <h2 style={styles.sidebarSectionTitle} className={pdfClasses.sectionTitle}>{t('resume.languages.title')}</h2>
            <div style={styles.languagesGrid}>
              {data.languages
                .filter(lang => lang && lang.language)
                .map((lang, index) => (
                  <div key={index} style={styles.languageItem}>
                    <div style={styles.languageName}>{lang.name}</div>
                    <div style={styles.languageProficiency}>{getProficiencyTranslation(lang.level)}</div>
                  </div>
                ))}
            </div>
          </div>
        )}
        
       {/* Hobbies & Interests */}
       {hasHobbies() && (
          <div style={styles.sidebarSection} className={pdfClasses.section}>
            <h2 style={styles.sidebarSectionTitle} className={pdfClasses.sectionTitle}>{t('resume.hobbies.title')}</h2>
            {typeof data.hobbies === 'string' ? (
              <p style={styles.hobbiesText}>{data.hobbies}</p>
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

      {/* Main content area (right column) */}
      <div style={styles.mainContent} className="zurich-main-content">
        {/* Professional Summary */}
        {data.personal_info.summary && (
          <div style={styles.section} className={`zurich-summary-section ${pdfClasses.section}`}>
            <h2 style={styles.sectionTitle} className={pdfClasses.sectionTitle}>{t('resume.personal_info.summary')}</h2>
            <p style={styles.summary}>{data.personal_info.summary}</p>
          </div>
        )}
        
        {/* Work Experience */}
        {hasExperiences() && (
          <div style={styles.section} className={`zurich-experience-section ${pdfClasses.section}`}>
            <h2 style={styles.sectionTitle} className={pdfClasses.sectionTitle}>{t('resume.experience.title')}</h2>
            {data.experiences
              .filter(exp => exp && exp.company)
              .map((exp, index) => (
                <div key={index} style={styles.expItem} className={`zurich-exp-item ${pdfClasses.expItem}`}>
                  <div style={styles.expHeader}>
                    <div style={styles.expTitle}>{exp.position}</div>
                    <div style={styles.expDate}>
                      {formatDate(exp.start_date)} - {exp.current ? t('resume.experience.current_work') : formatDate(exp.end_date)}
                    </div>
                  </div>
                  <div style={styles.expCompany}>{exp.company}</div>
                  {exp.location && <div style={styles.expLocation}>{exp.location}</div>}
                  {exp.description && <div style={styles.expDescription}>{exp.description}</div>}
                </div>
              ))}
          </div>
        )}
        
        {/* Education */}
        {hasEducation() && (
          <div style={styles.section} className={`zurich-education-section ${pdfClasses.section}`}>
            <h2 style={styles.sectionTitle} className={pdfClasses.sectionTitle}>{t('resume.education.title')}</h2>
            {data.educations
              .filter(edu => edu && edu.institution)
              .map((edu, index) => (
                <div key={index} style={styles.expItem} className={`zurich-edu-item ${pdfClasses.expItem}`}>
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
        )}
        
        {/* Internships */}
        {hasInternships() && (
          <div style={styles.section} className={`zurich-internships-section ${pdfClasses.section}`}>
            <h2 style={styles.sectionTitle} className={pdfClasses.sectionTitle}>{t('resume.internships.title')}</h2>
            {data.internships
              .filter(internship => internship && internship.company)
              .map((internship, index) => (
                <div key={index} style={styles.expItem} className={`zurich-internship-item ${pdfClasses.expItem}`}>
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
        )}
        
        {/* Courses & Certifications */}
        {hasCourses() && (
          <div style={styles.section} className={`zurich-courses-section ${pdfClasses.section}`}>
            <h2 style={styles.sectionTitle} className={pdfClasses.sectionTitle}>{t('resume.courses.title')}</h2>
            {data.courses
              .filter(course => course && course.name)
              .map((course, index) => (
                <div key={index} style={styles.expItem} className={`zurich-course-item ${pdfClasses.expItem}`}>
                  <div style={styles.expHeader}>
                    <div style={styles.expTitle}>{course.name}</div>
                    {course.date && <div style={styles.expDate}>{formatDate(course.date)}</div>}
                  </div>
                  {course.institution && <div style={styles.expCompany}>{course.institution}</div>}
                  {course.description && <div style={styles.expDescription}>{course.description}</div>}
                </div>
              ))}
          </div>
        )}
        
        {/* Extracurricular Activities */}
        {hasExtracurriculars() && (
          <div style={styles.section} className={`zurich-activities-section ${pdfClasses.section}`}>
            <h2 style={styles.sectionTitle} className={pdfClasses.sectionTitle}>{t('resume.extracurricular.activity')}</h2>
            {data.extracurriculars
              .filter(activity => activity && activity.name)
              .map((activity, index) => (
                <div key={index} style={styles.expItem} className={`zurich-activity-item ${pdfClasses.expItem}`}>
                  <div style={styles.expHeader}>
                    <div style={styles.expTitle}>{activity.name}</div>
                  </div>
                  {activity.description && <div style={styles.expDescription}>{activity.description}</div>}
                </div>
              ))}
          </div>
        )}
        
        {/* Custom Sections */}
        {hasCustomSections() && 
          data.custom_sections
            .filter(section => section && section.title && (section.content || (section.items && section.items.length > 0)))
            .map((section, sectionIndex) => (
              <div key={`custom-${sectionIndex}`} style={styles.section} className={`zurich-custom-section ${pdfClasses.section}`}>
                <h2 style={styles.sectionTitle} className={`zurich-section-title ${pdfClasses.sectionTitle}`}>{section.title || t('resume.custom_sections.title')}</h2>
                <div style={styles.sectionContent}>
                  {/* If the section has items array, render them as individual entries */}
                  {section.items && section.items.length > 0 ? (
                    section.items.map((item, itemIndex) => (
                      <div key={`custom-item-${sectionIndex}-${itemIndex}`} style={styles.expItem} className={`zurich-custom-item ${pdfClasses.expItem}`}>
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
                    <div style={styles.expItem} className={`zurich-custom-content ${pdfClasses.expItem}`}>
                      {section.content && <div style={styles.expDescription}>{section.content}</div>}
                    </div>
                  )}
                </div>
              </div>
            ))
        }
        
        {/* References */}
        {hasReferences() && (
          <div style={styles.section} className={`zurich-referrals-section ${pdfClasses.section}`}>
            <h2 style={styles.sectionTitle} className={pdfClasses.sectionTitle}>{t('resume.references.title')}</h2>
            {data.referrals.providedOnRequest ? (
              <div style={styles.expItem} className={`zurich-referrals-text ${pdfClasses.expItem}`}>
                <p>{t('resume.references.provide_upon_request')}</p>
              </div>
            ) : (
              data.referrals && data.referrals.map((reference, index) => (
                <div key={`referral-${index}`} style={styles.expItem} className={`zurich-referral-item ${pdfClasses.expItem}`}>
                  <div style={styles.expTitle}>{reference.name}</div>
                  {reference.relation && <div style={styles.expCompany}>{reference.relation}</div>}
                  <div style={styles.expDescription}>
                    {reference.email && `${reference.email}`}
                    {reference.email && reference.phone && " • "}
                    {reference.phone && `${reference.phone}`}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
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
            .zurich-exp-item, .zurich-edu-item, .zurich-internship-item, .zurich-course-item, .zurich-custom-item {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            .zurich-section-title, .zurich-sidebar-title {
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

export default Zurich;